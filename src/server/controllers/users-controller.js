var Users = require('../datasets/users');

module.exports = function (io) {
  var getUsers = function (req, res) {
    Users.find({}, function (err, usersData) {
      if (err) {
        res.error(err);
      } else {
        res.json(usersData);
      }
    })
  };


  var deconnection = function (req, res) {
    console.log(req.body.userId);
    Users.update({_id: req.body.userId}, {$set: {"isConnected": false}}, function (err, result) {
      if (!err) {
        res.send("deconnection effectuée")
        //io.sockets.emit("userDisconnected", data.userId)
      }
    });
  };

  var followUser = function (req, res) {
    var userId = req.body.userId,
      wasterId = req.body.wasterId;
    var userIdWaster;
    var date = new Date();
    console.log("req.body", req.body);
    Users.findById(wasterId, function (err, waster) {
      if (!waster.following.length) { //init s tableau vide
        waster.following.push({
          userId: userId,
          statut: "requested",
          date: date
        })
      } else {
        console.log(waster);
        var already = false; // test si l'user ID est deja présent
        waster.following.forEach(function (doc) {
          if (doc.userId && doc.userId == userId) {
            already = true;
            console.log("deja présent");
          }
        });
        if (!already) {
          waster.following.push({
            userId: userId,
            statut: "requested",
            date: date
          });
        }
      }
      waster.save(function () {
        userIdWaster = waster.username;
      })
    });
    Users.findById(userId, function (err, follower) {
      if (!follower.following.length) { //init
        follower.following.push({
          userId: wasterId,
          statut: "pending",
          date: date
        })
      } else {
        var already = false; // test si l'user ID est deja présent
        follower.following.forEach(function (doc) {
          if (doc.userId && doc.userId == wasterId) {
            already = true;
          }
        });
        if (!already) {
          follower.following.push({
            userId: wasterId,
            statut: "pending",
            date: date
          });
        }
      }
      follower.save(function () {
        res.json(follower);
      })

    });
  };

  var followUserOk = function (req, res) {
    var userId = req.body.userId,
      wasterId = req.body.wasterId;
    var userIdWaster;
    console.log("user e waster");
    console.log(userId + wasterId);
    Users.findById(wasterId, function (err, waster) {
      if (!err) {

      }
      waster.following.forEach(function (doc) {
        console.log(doc);
        if (doc.userId == userId) {
          doc.statut = "accepted"
        }

      });
      waster.save();
    });

    Users.findById(userId, function (err, follower) {
      if (err) {
        console.log("failed save");
      } else {
        follower.following.forEach(function (doc) {
          if (doc.userId == wasterId) {
            doc.statut = "accepted"
          }
        });
        follower.save(function () {
        });
        res.json(follower);
      }
    });
  };
  var unfollowUser = function (req, res) {
    var userId = req.body.userId,
      wasterId = req.body.wasterId;

    Users.findById(wasterId, function (err, waster) {
      console.log(waster)
      waster.following.forEach(function (doc) {
        if (doc.userId == userId) {
          console.log(doc)
          waster.following.splice(doc, 1)
        }
      });
      waster.save();
    });
    Users.findById(userId, function (err, follower) {
      follower.following.forEach(function (doc) {
        if (doc.userId == wasterId) {
          follower.following.splice(doc, 1)
        }
      });
      follower.save();
      res.json(follower);
    })
  };
  var getThisUser = function (req, res) {
    var userId = req.body.userId;
    Users.findById(userId).select({password: 0, __v: 0}).exec(function (err, user) {
      if (!err) {
        res.json(user)
      }
    });
  };

  var returnStatusFollowing = function (req, res) {
    var userId = req.body.userId;
    Users.findById(userId, function (err, user) {
      if (!err) {
        res.json(user.following)
      }
    });
  };

  return {
    getUsers: getUsers,
    followUserOk: followUserOk,
    getThisUser: getThisUser,
    deconnection: deconnection,
    followUser: followUser,
    unfollowUser: unfollowUser
  }
};


