const Waste = require('../datasets/wastes');
const Users = require('../datasets/users');
const mongoose = require('mongoose');

module.exports = function (io) {
  const utils = require('../utils/utils')(io);
  //TODO  send to specific friends with the function utils
  /**
   * Send a post and send notif via socket to friends
   * @param req
   * @param res
   */
  let sendPost = (req, res) => {
    let data = req.body.request;
    if (data) {
      let waste = new Waste(data);
      Users.findById(data.userId, (err, user) => {
        waste.save();
        if (!err) {
          utils.getListOfFriendAndSentSocket(req, user, waste, 'getNewPost')
            .then(() => res.json(waste))
            .catch(err => res.status(400).send(err));
        }
      });
      // Users.findById(data.userId, (err, user) => {
      //   waste._doc.username = user.username;
      //   waste._doc.image = user.image;
      //   user.following.forEach(elem => {
      //     if (elem.statut === 'accepted') {
      //       UsersConnected.findOne({userId: elem.userId.toString()}, (err, userConnecteds) => {
      //         if (userConnecteds) {
      //           userConnecteds.location.forEach((doc) => {
      //             if (io.sockets.connected[doc.socketId]) {
      //               io.sockets.connected[doc.socketId].emit("getNewPost", waste)
      //             } else {
      //               console.log("users are not connected")
      //             }
      //           });
      //         }
      //       });
      //     }
      //   })
      // });

    } else {
      res.status(404).send('aucun contenu enregistré dans la base')
    }

  };

  /**
   * Get all Post from a user
   * @param req Object
   * onlyOwnPost Get own Post
   * @param res
   */
  let getPost = (req, res) => {
    let userData = req.body.following, onlyOwnPost = req.body.onlyOwnPost, typePost = req.body.typePost;
    let requestedWastes = [userData];
    Users.findById(userData, (err, user) => {
      if (!err && !onlyOwnPost && user.following && user.following.length) {
        for (let i = 0, len = user.following.length; i < len; i++) {
          if (user.following[i].statut == "accepted") {
            requestedWastes.push(user.following[i].userId);
          }
        }
      }
      if (requestedWastes.length) {
        let seekPosts = {userId: {$in: requestedWastes}};
        if (typePost == "publicOnly") {
          seekPosts.userType = "public"
        }
        Waste.find(seekPosts)
          .sort({date: -1})
          .limit(req.body.numberOfWaste)
          .exec(function (err, allWastes) {
            if (err) {
              res.status(400).send("Erreur dans la récupération de la base de donnée")
            } else {
              Users.find({
                _id: {
                  $in: requestedWastes
                }
              }).select({image: 1, _id: 1, username: 1}).exec((err, allUserImage) => {
                if (err) {
                  res.status(400).send(err)
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
          })
      } else {
        res.status(400).send("pas de posts trouvés ou erreurs envoi userId")
      }
    });
  };

  /**
   * Get all Commentary from a post
   * @param req
   * @param res
   */
  let getCommentary = (req, res) => {
    let commentary = req.body.commentary
    let tableUserCommentary = commentary.map(elem => {
      return elem.userId
    }).filter((v, i, a) => {
      return a.indexOf(v) === i
    });
    Users.find({_id: {$in: tableUserCommentary}}).exec((err, users) => {
      users.forEach(user => {
        commentary.map(comment => {
          if (user._id == comment.userId) {
            comment.image = user.image;
            comment.username = user.username
          }
          return comment
        })
      });
      req.body.commentary = commentary;
      res.json(req.body)
    })
  };

  /**
   * Send a new comment from a specific
   * @param req
   * @param res
   */
  let sendComments = (req, res) => {
    let comments = req.body.comments;
    Waste.findById(comments.wasteId, (err, waste) => {
      comments.date = new Date();
      //delete comments.wasteId
      waste.commentary.push(comments);
      waste.save(() => {
        Users.findById(comments.userId, (err, user) => {
          utils.getListOfFriendAndSentSocket(req, user, waste, 'newComments')
            .then(waster => res.json(comments))
            .catch(err => console.log(err));
        });
      });
    })
  };

  /**
   * Same function for deleting and liking POST AND COMMENT
   * @param req
   * typeOfFunction => likes or comments
   * @param res
   * @param typeOfFunction string
   */
  let likeOrDeletePost = (req, res, typeOfFunction) => {
    let wasteId = req.params.wasteId;
    Waste.findById(wasteId, (err, result) => {
      if (!err) {
        if (!req.params.commentId) {
          if (typeOfFunction == "likes") {
            let testIfExist = result.likes.find(elem => {
              return elem == result.userId
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
          })
        } else {
          let index = result.commentary.indexOf(result.commentary.find(elem => {
            return req.params.commentId == elem._id
          }));
          if (typeOfFunction == "likes") {
            let testIfComment = result.commentary[index].likes.find(elem => {
              return elem == result.commentary[index].userId
            });
            if (!testIfComment) {
              result.commentary[index].likes = [...result.commentary[index].likes, result.commentary[index].userId];
            }
          } else {
            result.commentary.splice(index, 1)
          }
          result.save(() => {
            res.json(result)
          })
        }


      }
    });
  };

  let likeThisPostOrComment = (req, res) => {
    return likeOrDeletePost(req, res, 'likes')
  };

  let deletePost = (req, res) => {
    return likeOrDeletePost(req, res, 'delete')
  };


  return {
    getCommentary,
    deletePost,
    sendComments,
    likeThisPostOrComment,
    sendPost,
    getPost
  }
};


