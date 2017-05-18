const Users = require('../datasets/users');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const nev = require('../services/email-verification')(mongoose);
const path = require('path');
const jwt = require('jsonwebtoken');
const UsersConnected = require('../datasets/connected-users');

myHasher = function (password, tempUserData, insertTempUser, callback) {
  bcrypt.genSalt(8, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      return insertTempUser(hash, tempUserData, callback);
    });
  });
};

/**
 * Think to see :
 * https://medium.com/@pandeysoni/nodemailer-service-in-node-js-using-smtp-and-xoauth2-7c638a39a37e
 * https://nodemailer.com/smtp/oauth2/
 * and update nodemailer
 */
nev.configure({
  persistentUserModel: Users,
  expirationTime: 600, // 10 minutes
  verificationURL: process.env.URLVERIF,
  shouldSendConfirmation: false,
  transportOptions: {
    service: process.env.MAILVERIF,
    // auth: {
    //   type: 'OAuth2',
    //   user: process.env.MAILACCOUNT, // Your gmail address.
    //   clientSecret: process.env.CLIENTSECRET,
    //   accessToken: process.env.ACCESSTOKEN,
    //   refreshToken: process.env.REFRESHTOKEN,
    //   clientId: process.env.CLIENTID
    // },

    secure: true, // use SSL
    auth: {
      user: process.env.MAILACCOUNT,
      pass: process.env.MAILPASS
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

nev.generateTempUserModel(Users, function (err, tempUserModel) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
  }

});

module.exports = function (io) {
  var signup = function (req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('pass', 'Password must be at least 4 characters long').len(4);
    req.sanitize('email').normalizeEmail({remove_dots: false});
    var errors = req.validationErrors();

    if (errors) {
      return res.status(400).send(errors);
    }
    let email = req.body.email;

    let newUser = new Users({
      email: req.body.email,
      password: req.body.pass,
      username: req.body.username,
      role: 2
    });

    nev.createTempUser(newUser, function (err, existingPersistentUser, newTempUser) {
      if (err) {
        console.log(err);
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

  let login = (req, res) => {
    console.log("req.body", req.body);
    req.assert('email', 'Email cannot be blank and must be a correct email').notEmpty().isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({remove_dots: false});
    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    }

    Users.find({email: req.body.email}, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results && results.length == 1) {
          let userData = results[0];
          console.log(results.length == 1 ? "nombre de resultat au login ok :" + results.length : "plus de 1 resultat attention!!");
          bcrypt.compare(req.body.password, results[0].password, function (err, ok) {
            if (ok) {

              Users.update({_id: userData._id}, {$set: {"isConnected": true}}, function (err, result) {
                if (!err) {
                  delete userData.password;
                  const token = jwt.sign({user: userData}, process.env.SECRET_TOKEN);
                  let newUserConnected = new UsersConnected({
                    userId: userData._id,
                    socketId: req.body.socketId,
                    isConnected:true
                  });
                  newUserConnected.save();
                  res.status(200).json(
                    {token: token}
                  );
                } else {
                  res.status(401).send({msg: 'problem with connection'})
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

  let emailVerif = (req, res) => {
    console.log(req.body)
    var url = req.body.url;
    console.log(url);
    nev.confirmTempUser(url, function (err, user) {
      console.log(user);
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

  let refreshUserData = (req, res) => {
    let token = req.body.token;
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
      if (!err)
        Users.findById(decoded.user).select({password: 0, __v: 0}).exec(function (err, user) {
          if (!err) {
            res.status(200).json(user)
          }
        });
    })
  };

  return {
    emailVerif,
    login,
    refreshUserData,
    signup
  };

};
