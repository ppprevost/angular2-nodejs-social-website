const Waste = require('../datasets/wastes');
const Users = require('../datasets/users');
const mongoose = require('mongoose');


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
   * @param {Array} requestedWastes userId
   * @param {['public','private']} typePost
   * @param req
   * @param res
   */
  private actionGetPost(requestedWastes, typePost, req, res) {
    if (requestedWastes.length) { // length == 1 means no friends
      const seekPosts: any = {userId: {$in: requestedWastes}};
      if (typePost === 'publicOnly') {
        seekPosts.userType = 'public';
      }
      Waste.find(seekPosts)
        .sort({date: -1})
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
              allWastes.map(doc => {
                allUserImage.forEach((elem) => {
                  if (doc.userId == elem._id) {
                    doc._doc.image = elem.image; // hack Mongoose
                    doc._doc.user = elem.username;
                    return doc
                  }
                });
              });
              res.json(allWastes);
            });
          }
        });
    } else {
      res.status(400).send('pas de posts trouvés ou erreurs envoi userId');
    }
  }

  /**
   * Send post function
   * @param req
   * @param {Object} req.body.request
   * @param {string} req.body.request.userId
   * @param res
   */
  sendPost = (req, res) => {
    const data = req.body.request;
    if (data) {
      const waste = new Waste(data);
      Users.findById(data.userId, (err, user) => {
        waste.save();
        if (!err) {
          user.getListOfFriendAndSentSocket(user, waste, 'getNewPost', this.io)
            .then(() => res.json(waste))
            .catch(error => res.status(400).send(error));
        }
      });
    } else {
      res.status(404).send('no content saved in the database');
    }
  };

  /**
   * Get all Post from a user
   * @param req Object
   * onlyOwnPost Get own Post
   * @param res
   */
  getPost = (req, res) => {
    const userData = req.body.following, onlyOwnPost = req.body.onlyOwnPost, typePost = req.body.typePost;
    let requestedWastes = [userData];
    Users.findById(userData, (err, user) => {
      if (!err && !onlyOwnPost && user.following && user.following.length) {
        Users.listOfFriends(user.following, 0, false, following => {
          following = following.map(elem => elem._doc.userId);
          requestedWastes = requestedWastes.concat(following);
          this.actionGetPost(requestedWastes, typePost, req, res);
        });
      } else {
        this.actionGetPost(requestedWastes, typePost, req, res);
      }
    });
  }

  /**
   * Send a new comment from a specific
   * @param req
   * @param res
   */
  sendComments = (req, res) => {
    const comments = req.body.comments;
    Waste.findById(comments.wasteId, (err, waste) => {
      comments.date = new Date();
      // delete comments.wasteId
      waste.commentary.push(comments);
      waste.save(() => {
        Users.findById(comments.userId, (err, user) => {
          user.getListOfFriendAndSentSocket(user, waste, 'newComments', this.io)
            .then(waster => res.json(comments))
            .catch(error => console.log(error));
        });
      });
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
      req.body.commentary = commentary;
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
    const wasteId = req.params.wasteId;
    Waste.findById(wasteId, (err, result) => {
      if (!err) {
        if (!req.params.commentId) {
          if (typeOfFunction == 'likes') {
            const testIfExist = result.likes.find(elem => {
              return elem == result.userId;
            });
            if (!testIfExist) {
              result.likes = [...result.likes, result.userId];
            } else {
              console.log('user alreqdy like this post ');
            }
          } else {
            result.remove();
          }
          result.save(() => {
            res.json(result)
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



