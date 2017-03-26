var Waste = require('../datasets/wastes');
var Users = require('../datasets/users');

module.exports = function (io) {
  var postWaste = function (req, res) {
    var waste = new Waste(req.body);
    waste.save();
    Waste.find({})
      .sort({date: -1}).exec(function (err, allWastes) {
      if (err) {
        res.error(err);
      } else {
        res.json(allWastes);
      }
    });

  };


  var sendPost = function (data, fn) {
    if (data) {
      var waste = new Waste(data);

      io.sockets.emit("getNewPost", waste);
      waste.save();
      Waste.find({})
        .sort({date: -1}).exec(function (err, allWastes) {
        if (err) {
          fn("error" / socket)
        } else {
          fn("bien sauvegardé dans la base waste /socket")
        }
      });
    } else {
      fn("Contenu vide")
    }

  };


  var getPost = function (req, res) {
    if (!req.body.following) {
      Waste.find({})
        .sort({date: -1})
        .exec(function (err, allWastes) {
          if (err) {
            res.error(err)
          } else {
            res.json(allWastes);
          }
        })
    }
    else {
      var requestedWastes = [];
      var following = req.body.following;
      for (var i = 0, len = following.length; i < len; i++) {
        if (following[i].statut == "accepted") {
          requestedWastes.push({userId: following[i].userId});
        }
      }
      if (requestedWastes.length) {
        Waste.find({$or: requestedWastes})
          .sort({date: -1})
          .exec(function (err, allWastes) {
            if (err) {
              console.log(err)
            } else {
              res.json(allWastes);
            }
          })
      } else {
        console.log("nothing dans le tableau")
      }
    }
  };

  var listOfFriends = function (req, res) {
    var requestedImage = [];
    if (req.body.following) {
      req.body.following.forEach(function (doc, i) {
        if (doc.statut == "accepted") {
          requestedImage.push({_id: doc.userId});
          Users.find({$or: requestedImage})
            .select({image: 1, username: 1})
            .exec(function (err, allWastes) {
              if (err) {
                console.log(err)
              } else {
                res.json(allWastes)
              }
            });
        }
      });
    }
  };

  return {
    listOfFriends: listOfFriends,
    sendPost: sendPost,
    getPost: getPost
  }


};


