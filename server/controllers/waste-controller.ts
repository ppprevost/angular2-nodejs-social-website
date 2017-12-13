const Waste = require('../datasets/wastes');
const Users = require('../datasets/users');
type TypePost = 'publicOnly' | 'all';
const extract = require('article-parser');
import {asyncEach, youtube_parser} from '../utils/utils';
const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
const regex = new RegExp(expression);


export class WasteController {
  private io;

  /**
   * Send a post and send notif via socket to friends
   * @param req
   * @param res
   */

  constructor(io) {
    this.io = io;

  }

  /**
   *
   * @param {Array} requestedWastes -Array of userId
   * @param {string} typePost -either public or private
   * @param {number} numberOfWaste
   * @param {number} skipLimit
   */
  private actionGetPost(requestedWastes, req, res) {
    if (requestedWastes.length) { // length == 1 means no friends
      const seekPosts: any = {userId: {$in: requestedWastes}};
      if (req.body.typePost === 'publicOnly') {
        seekPosts.userType = 'public';
      }
      Waste.find(seekPosts)
        .sort({date: -1})
        .skip(req.body.skipLimit)
        .limit(req.body.numberOfWaste)
        .exec(function (err, allWastes) {
          if (err) {
            res.status(400).send('Erreur dans la récupération de la base de donnée');
          } else {
            Users.find({
              _id: {
                $in: requestedWastes
              }
            }).select({image: 1, _id: 1, username: 1}).exec((err, allUserImage) => {
              if (err) {
                res.status(400).send(err);
              }
              asyncEach(allWastes, function (doc, next) {
                allUserImage.forEach((elem) => {
                  if (doc.userId == elem._id) {
                    doc._doc.image = elem.image; // hack Mongoose
                    doc._doc.username = elem.username;
                  }
                  return doc;
                });
                next()
              }, function () {
                res.json(allWastes);
              });
            });
          }
        });
    } else {
      res.status(400).send('pas de posts trouvés ou erreurs envoi userId');
    }
  }

  /**
   * Get all Post from a user and his friends depends on the request
   * @param {Express.Request} req
   * @param {boolean} req.body.onlyOwnPost -if true get your own Post
   * @param {string] req.body.typePost -private or public
   * @param {Express.Response} res
   */
  getPost = (req, res) => {
    const userData = req.body.following, onlyOwnPost: boolean = req.body.onlyOwnPost;
    let requestedWastes = [userData];
    Users.findById(userData, (err, user) => {
      if (!err && !onlyOwnPost && user.following && user.following.length) { // load own post plus post from friends
        Users.listOfFriends(user.following, 0, false, following => {
          following = following.map(elem => elem.userId);
          requestedWastes = requestedWastes.concat(following);
          this.actionGetPost(requestedWastes, req, res);
        });
      } else {
        this.actionGetPost(requestedWastes, req, res);
      }
    });
  };

  /**
   * Send post function
   * @param req
   * @param {Object} req.body.request
   * @param {string} req.body.request.userId
   * @param res
   */
  sendPost = (req, res) => {
    const data = req.body.request;
    let waste;
    let saveWaste = (waste, user) => {
      if (waste && waste.content && waste.content.source === 'YouTube') {
        waste.content._url = 'https://www.youtube.com/embed/' + youtube_parser(waste.content._url);
      }
      waste = new Waste(data);
      waste.save((er) => {
        if (!er) {
          waste = waste.getMoreWasteInfo(user);
          Users.getListOfFriendAndSentSocket(user, waste, 'getNewPost', this.io)
            .then(() => res.json(waste))
            .catch(error => res.status(400).send(error));
        }
      });
    }
    if (data) {
      Users.findById(data.userId, (err, user) => {
        if (data.content.match(regex)) {
          extract.extractWithEmbedly(data.content)
            .then((article) => {
              data.content = article;
              saveWaste(data, user);
            }).catch((error) => {
            console.log(error);
            res.status(401).send(error);
          });
        } else {
          data.content = {
            content: data.content,
            type: 'text'
          };
          saveWaste(data, user)
        }
      });
    } else {
      res.status(404).send('no content saved in the database');
    }
  };


  /**
   * Send a new comment from a specific
   * @param req
   * @param res
   */
  sendComments = (req, res) => {
    const comments = req.body.comments;
    Waste.findById(comments.wasteId, (err, waste) => {
      if (!err) {
        // delete comments.wasteId
        const index = waste.commentary.push(comments) - 1; // return length or Array so minus one to find the position
        waste.save(() => {
          Users.findById(comments.userId, (err, user) => {
            let wasteContent = waste.commentary[index];
            const tab = ['image', 'username'], userObj = user.toObject();
            for (let prop in userObj) {
              tab.forEach(elem => { // ok there is only two property...
                if (prop === elem) {
                  wasteContent._doc[prop] = userObj[prop];
                }
              });
              wasteContent._doc.wasteId = comments.wasteId;
            }
            Users.getListOfFriendAndSentSocket(user, waste, 'newComments', this.io)
              .then(waster => res.json(wasteContent))
              .catch(error => console.log(error));
          });
        });
      } else {
        console.error(err);
      }
    });
  }

  /**
   * Get all Commentary from a post
   * @param req
   * @param res
   */
  getCommentary = (req, res) => {
    const commentary = req.body.commentary;
    const tableUserCommentary = commentary.map(elem => {
      return elem.userId;
    }).filter((v, i, a) => {
      return a.indexOf(v) === i;
    });
    Users.find({_id: {$in: tableUserCommentary}}).exec((err, users) => {
      users.forEach(user => {
        commentary.map(comment => {
          if (user._id == comment.userId) {
            comment.image = user.image;
            comment.username = user.username;
          }
          return comment;
        });
      });
      res.json(req.body);
    });
  }


  /**
   * Same function for deleting and liking POST AND COMMENT
   * @param req
   * typeOfFunction => likes or comments
   * @param res
   * @param typeOfFunction string
   */
  private likeOrDeletePost(req, res, typeOfFunction) {
    const wasteId = req.params.wasteId,
      userId = req.params.userId;
    Waste.findById(wasteId, (err, result) => {
      if (!err) {
        if (!req.params.commentId) {
          if (typeOfFunction == 'likes') { // you like it
            const testIfExist = result.likes.find(elem => {
              return elem == userId;
            });
            if (!testIfExist) { //cannot find it so we could inject the like
              result.likes = [...result.likes, userId];
            } else { // means you want to delete it
              console.log('user alreqdy like this post, we delete the like ');
              const index = result.likes.findIndex(elem => {
                return elem === result.userId
              });
              result.likes.splice(index, 1);
            }
          } else { // you delete your post
            result.remove();
          }
          result.save(() => {
            res.json(result);
          });
        } else {
          const index = result.commentary.indexOf(result.commentary.find(elem => {
            return req.params.commentId == elem._id;
          }));
          if (typeOfFunction === 'likes') {
            const testIfComment = result.commentary[index].likes.find(elem => {
              return elem === result.commentary[index].userId;
            });
            if (!testIfComment) {
              result.commentary[index].likes = [...result.commentary[index].likes, result.commentary[index].userId];
            }
          } else {
            result.commentary.splice(index, 1);
          }
          result.save(() => {
            res.json(result);
          });
        }


      }
    });
  };

  likeThisPostOrComment = (req, res) => {
    return this.likeOrDeletePost(req, res, 'likes');
  }

  deletePost = (req, res) => {
    return this.likeOrDeletePost(req, res, 'delete');
  }

}



