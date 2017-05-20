let Waste = require('../datasets/wastes');
let Users = require('../datasets/users');
let UsersConnected = require('../datasets/connected-users');
let mongoose = require('mongoose');

module.exports = function (io) {

  let sendPost = (req, res) => {
    let data = req.body.request;
    if (data) {
      let waste = new Waste(data);
      waste.save();

      Users.findById(data.userId, (err, user) => {
        user.following.forEach(elem => {
          if (elem.statut == "accepted") {
            UsersConnected.findOne({userId: elem.userId}, (err, userConnecteds) => {
              if (io.sockets.connected[userConnecteds.socketId]) {
                io.sockets.connected[userConnecteds.socketId].emit("getNewPost", waste)
              } else {
                console.log("users are not connected")
              }
            });
            // for(let connected in io.sockets.connected){
            //   io.sockets.connected[connected].emit("getNewPost",waste)
            //
            // }
          }
        })
      });
      res.json(waste);
    } else {
      res.status(404).send('aucun contenu enregistré dans la base')
    }

  };

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
   *
   * @param req
   * @param res
   */
  let listOfFriends = function (req, res) {
    let following = req.body.following || [];
    let newTable = [];
    if (!following.length) {
      res.json([]);
    } else {
      following.forEach(doc => {
        if (doc.statut == 'accepted')
          newTable.push(mongoose.Types.ObjectId(doc.userId))
      });
      if (newTable.length) {
        Users.find({_id: {$in: newTable}}).select({image: 1, _id: 1, username: 1})
          .exec(function (err, waster) {
            res.json(waster);
          });
      }
    }

  };

  return {
    listOfFriends,
    sendPost,
    getPost
  }
};


