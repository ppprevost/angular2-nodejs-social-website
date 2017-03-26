let User = require('../datasets/users');
let fs = require('fs-extra');
let path = require('path');
let Waste = require('../datasets/wastes');
let bcrypt = require('bcryptjs');
let multer = require('multer');


let storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './src/assets/upload/');
  },
  filename: function (req, file, cb) {
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
        return;
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


