let User = require('../datasets/users');
let fs = require('fs-extra');
let path = require('path');
let Waste = require('../datasets/wastes');
let bcrypt = require('bcryptjs');
let multer = require('multer');


let storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    const dir = './src/assets/upload/' + req.body.userId;
    if (!fs.existsSync(dir)) {
      console.log("le path n'existe pas lors de la creation demulter", dir);
      fs.mkdir(dir, err => {
        cb(err, dir)
      });
    } else {
      cb(null, dir)
    }
  },
  filename: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});

var upload = multer({ //multer settings
  storage: storage
}).single('file');

module.exports = function (io) {
  let updatePhoto = (req, res) => {
    upload(req, res, function (err) {
      console.log("req.file", req.file);
      if (err) {
        res.json({error_code: 1, err_desc: err});
      }
      var userId = req.body.userId;
      User.findById(userId).select({password: 0, __v: 0}).exec(function (err, userData) {
        var user = userData;
        user.image = req.file.path.substr(4);
        user.save(function (err) {
          if (err) {
            console.log("failed save");
            res.status(500).send(err + "error uploading image")
          } else {
            console.log("save successful", userData);
            user.image = user.image
            res.json(user);
          }
        })
      });
    });
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
    req.assert('lastPassword', 'Password must be at least 4 characters long').len(4);
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    let errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    }
    let userId = req.body.userId, password = req.body.password;
    User.findById(userId, function (err, user) {
      comparePassword(req.body.lastPassword, user.password, function (err, isMatch) {
        if (err) {
          res.status(401).json("error when comparing Pasword")
        } else {
          if (isMatch) {
            req.body.password = bcrypt.hashSync(password);
            user._doc.password = req.body.password;
            user.save(() => {
              res.send("password update from the server")
            })
          } else {
            res.status(401).json("Match error, please be sure to fill your good old password")
          }
        }
      })
    });
  };

  let comparePassword = (passw, userPass, cb) => {
    bcrypt.compare(passw, userPass, function (err, isMatch) {
      if (err) {
        return cb(err, false);
      }
      return cb(null, isMatch);
    });
  };

  let deleteAccount = (req, res) => {
    let id = req.params.id;
    User.update({'following.userId': id}, {$pull: {following: {userId: id}}}, {multi: true}, (err, numberAffect) => {
      if (err) {
        res.status(404).json("cannot find the account")
      } else {
        User.findByIdAndRemove(id, (err) => {
          if (!err) {
            res.send(`Your account has been deleted, number of friend affected : ${numberAffect}`)
          } else {
            res.status(404).json("cannot find the account")
          }
        });
      }
    });
  };

  return {
    updatePhoto,
    updateCover,
    updateChamp,
    updatePassword,
    deleteAccount
  }
};


