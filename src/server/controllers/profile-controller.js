var User = require('../datasets/users');
var fs = require('fs-extra');
var path = require('path');
var Waste = require('../datasets/wastes');
var bcrypt = require('bcryptjs');

module.exports = function (io) {
  var updatePhoto = function (req, res) {
    var file = req.files.file;
    var userId = req.body.userId;

    console.log("User " + userId + " is submitting ", file);
    var uploadDate = new Date();
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../../uploads/" + userId + file.name);
    console.log("target");
    console.log(targetPath);
    var savePath = "/uploads/" + userId + file.name;

    fs.rename(tempPath, targetPath, function (err) {
      if (err) {
        console.log(err)
      } else {
        User.findById(userId, function (err, userData) {
          var user = userData;
          user.image = savePath;
          user.save(function (err) {
            if (err) {
              console.log("failed save");
              res.json({status: 500})
            } else {
              console.log("save successful");//
              console.log(userData);
              Waste.update({userId: userData._id}, {$set: {userImage: userData.image}}, {
                upsert: true,
                multi: true
              }, function (err) {

              });
              res.json(user);
            }
          })
        })

      }
    })
  };

  var updateCover = function (req, res) {
    var file = req.files.file;
    var userId = req.body.userId;

    console.log("User " + userId + " is submitting ", file);
    var uploadDate = new Date();
    var tempPath = file.path;
    var targetPath = path.join(__dirname, "../../uploads/cover/" + userId + file.name);
    console.log("target");
    console.log(targetPath);
    var savePath = "/uploads/cover/" + userId + file.name;

    fs.rename(tempPath, targetPath, function (err) {
      if (err) {
        console.log(err)
      } else {
        User.findById(userId, function (err, userData) {
          var user = userData;
          user.cover = savePath;
          user.save(function (err) {
            if (err) {
              console.log("failed save");
              res.json({status: 500})
            } else {
              console.log("save successful");//
              console.log(userData)
              res.json(user);
            }
          })
        })

      }
    })
  };

  let updateChamp = function (req, res) {
    let userId = req.body.userId;
    console.log(req.body)
    delete req.body.userId;
    let champ = Object.keys(req.body)[0];
    if (champ == "email") {
      req.assert('email', 'Email is not valid').isEmail();
      req.assert('email', 'Email cannot be blank').notEmpty();
      req.sanitize('email').normalizeEmail({remove_dots: false});
      var errors = req.validationErrors();
      if (errors) {
        return res.status(400).send(errors);
      }
    }
    let value = Object.values(req.body)[0];
    User.findById(userId).select({password: 0, __v: 0}).exec(function (err, userData) {
      var user = userData;
      user[champ] = [value];

      user.save(function (err) {
        if (err) {
          console.log("fail");
          res.json({status: 500});
        } else {
          console.log("champ sauvegardé " + champ);
          res.json(user);
        }
      })
    });
  };

  let updatePassword = (req, res) => {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    }
    let userId = req.body.userId;
    let password = req.body.password;
    req.body.password = bcrypt.hashSync(password);
    User.findByIdAndUpdate(userId, req.body, function (err, success) {
      if (err) {
        console.log("fail");
        res.json({status: 500});
      } else {
        res.json(success);
      }
    })
  };

  return {
    updatePhoto: updatePhoto,
    updateCover: updateCover,
    updateChamp: updateChamp,
    updatePassword: updatePassword
  }
};


