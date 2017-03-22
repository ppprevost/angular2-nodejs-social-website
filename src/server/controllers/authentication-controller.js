var User = require('../datasets/users');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var nev = require('../services/email-verification')(mongoose);
var path = require('path');


myHasher = function (password, tempUserData, insertTempUser, callback) {
  bcrypt.genSalt(8, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      return insertTempUser(hash, tempUserData, callback);
    });
  });
};

console.log("processENV====>", process.env)

nev.configure({
  persistentUserModel: User,
  expirationTime: 600, // 10 minutes
  verificationURL: process.env.url,
  shouldSendConfirmation: false,
  transportOptions: {
    service: 'Mailgun',
    auth: {
      user: 'postmaster@app190992b4524d44e5af245d97259df82c.mailgun.org',
      pass: 'dbfa3f1a582ac214a424f295c617f183'
    },
    tls: {
      rejectUnauthorized: false
    }
  },

  hashingFunction: myHasher,
  passwordFieldName: 'password',
}, function (err, options) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('configured: ' + (typeof options === 'object'));
});

nev.generateTempUserModel(User, function (err, tempUserModel) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
  }

});

module.exports = function (io) {
  var signup = function (req, res, next) {
    console.log(req.body)

    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('pass', 'Password must be at least 4 characters long').len(4);
    req.sanitize('email').normalizeEmail({remove_dots: false});
    var errors = req.validationErrors();

    if (errors) {
      return res.status(400).send(errors);
    }
    let email = req.body.email;

    var newUser = new User({
      email: req.body.email,
      password: req.body.pass,
      username: req.body.username,
      role: 2
    });

    nev.createTempUser(newUser, function (err, existingPersistentUser, newTempUser) {
      if (err) {
        console.log(err)
        return res.status(404).send('ERROR: creating temp user FAILED');
      }
      // user already exists in persistent collection
      console.log("logAlors", err, existingPersistentUser, newTempUser);
      if (existingPersistentUser) {
        return res.json({
          msg: 'You have already signed up and confirmed your account. Did you forget your password?'
        });
      }
      // new user created
      if (newTempUser) {
        var URL = newTempUser[nev.options.URLFieldName];

        nev.sendVerificationEmail(email, URL, function (err, info) {
          if (err) {
            console.log(err)
            return res.status(404).send('ERROR: sending verification email FAILED');
          }
          res.json({
            msg: 'An email has been sent to you. Please check it to verify your account.',
            info: info
          });
        });

        // user already exists in temporary collection!
      } else {
        res.json({
          msg: 'You have already signed up. Please check your email to verify your account.'
        });
      }
    });

    // resend verification button was clicked
    //
    // nev.resendVerificationEmail(email, function (err, userFound) {
    //   if (err) {
    //     return res.status(404).send('ERROR: resending verification email FAILED');
    //   }
    //   if (userFound) {
    //     res.json({
    //       msg: 'An email has been sent to you, yet again. Please check it to verify your account.'
    //     });
    //   } else {
    //     res.json({
    //       msg: 'Your verification code has expired. Please sign up again.'
    //     });
    //   }
    // });


  };

  var login = function (req, res) {

    console.log("req.body", req.body);
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({remove_dots: false});
    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    }

    User.find({email: req.body.email}, function (err, results) {
      if (err) {
        console.log(err);
      } else {
        if (results && results.length == 1) {
          console.log(results.length == 1 ? "nombre de resultat au login ok :" + results.length : "plus de 1 resultat attention!!");
          bcrypt.compare(req.body.password, results[0].password, function (err, ok) {
            if (ok) {
              var userData = results[0];
              res.json({
                email: req.body.email,
                _id: userData._id,
                username: userData.username,
                image: userData.image,
                location: userData.location,
                gender: userData.gender,
                bio: userData.bio,
                following: userData.following,
                followers: userData.followers
              });

              User.update({_id: userData._id}, {$set: {"isConnected": true}}, function (err, result) {
                if (!err) {
                  console.log("connecté a true");

                }
              });
            } else {
              return res.status(401).send({msg: 'Invalid email or password'});
            }
          });
          io.sockets.emit("userConnected", results[0]._id);

        }
        else {
          return res.status(401).send({
            msg: 'The email address ' + req.body.email + ' is not associated with any account. ' +
            'Double-check your email address and try again.'
          });
        }
        ;
      }
    });
  };

  var emailVerif = function (req, res) {
    console.log(req.body)
    var url = req.body.url;
    console.log(url)
    nev.confirmTempUser(url, function (err, user) {
      console.log(user)
      if (err) {

      }
      if (user) {
        nev.sendConfirmationEmail(user['email'], function (data) {
          console.log(data);
          res.json(data);
        });

      } else {
        return res.status(404).send('ERROR: confirming temp user FAILED' + err);
      }
    });
  };
  return {
    emailVerif: emailVerif,
    login: login,
    signup: signup
  };

};
