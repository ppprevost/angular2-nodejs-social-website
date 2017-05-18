const Users = require('../datasets/users'), fs = require('fs'), UsersConnected = require('../datasets/connected-users');
let uploadUtil = (req, res, callback) => {
  let userId = req.params.id;
  let directory = `${process.cwd()}\\src\\assets\\upload\\${userId}\\`;
  try {
    let files = fs.readdirSync(directory);
    callback(files, directory, userId)
  } catch (err) {
    res.json([]);
  }
};


module.exports = function (io) {
  let getUsers = function (req, res) {
    Users.find().select({password: 0, __v: 0}).exec(function (err, usersData) {
      if (err) {
        res.error(err);
      } else {
        res.json(usersData);
      }
    })
  };

  let deconnection = function (req, res) {
    console.log(req.body.userId);
    Users.update({_id: req.body.userId}, {$set: {"isConnected": false}}, function (err, result) {
      if (!err) {
        UsersConnected.findOneAndRemove({userId: req.body.userId}, (err) => {
          if (!err) {
            res.send("deconnection effectuée")
          }
        });
      }
    });
  };

  let followUser = function (req, res) {
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
          if (doc && doc.userId == userId) {
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

  let followUserOk = function (req, res) {
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
  let unfollowUser = function (req, res) {
    var userId = req.body.userId,
      wasterId = req.body.wasterId;
    Users.findById(wasterId, function (err, waster) {
      console.log(waster);
      waster.following.forEach(function (doc) {
        if (doc.userId == userId) {
          console.log(doc);
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
  let getThisUser = function (req, res) {
    var userId = req.body.userId;
    Users.findById(userId).select({password: 0, __v: 0}).exec(function (err, user) {
      if (!err) {
        res.json(user)
      }
    });
  };

  let uploadPicture = (req, res) => {
    return uploadUtil(req, res, (files, directory, userId) => {
      if (files.length === 0) {
        fs.rmdir(directory, function (err) {
          if (err) {
            res.status(400).send(err)
          }
        });
      } else {
        res.json(files);
      }
    })
  };

  let deleteAllPictures = (req, res) => {
    uploadUtil(req, res, (files, directory, userId) => {
      if (files.length === 0) {
        fs.rmdir(directory, function (err) {
          if (err) {
            res.status(400).send(err)
          }
        });
      }
      else {
        Users.findById(userId).select({password: 0, __v: 0}).exec((err, user) => {
          if (err) {
            res.status(500).send("unerreru a la suppression:", err);
          }
          files.forEach((file, i) => {
            let filePath = directory + file;
            fs.stat(filePath, function (err, stats) {
              if (err) {
                console.log(JSON.stringify(err));
              } else {
                if (stats.isFile()) {
                  fs.unlink(filePath, function (err) {
                    if (err) {
                      res.status(400).json(err)
                    }
                  });
                }
              }
            });
          });
          user.image = undefined;
          user.save(() => {
            res.json(user);
          })
        });
      }
    })
  };


  return {
    getUsers,
    followUserOk,
    getThisUser,
    deconnection,
    followUser,
    unfollowUser,
    uploadPicture,
    deleteAllPictures
  }
};


