const Users = require('../datasets/users'), UsersConnected = require('../datasets/connected-users');
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

import {ipConnection} from '../utils/utils';

const uploadUtil = (req, res, callback) => {
  const userId = req.params.id;
  const directory = `${process.cwd()}\\src\\assets\\upload\\${userId}\\`;
  try {
    const files = fs.readdirSync(directory);
    callback(files, directory, userId);
  } catch (err) {
    res.json([]);
  }
};

export class UserController {
  private io;

  constructor(io) {
    this.io = io;
  }

  getlistOfFriends = (req, res) => {
    return Users.listOfFriends(req.body, 0, false, (followers) => {
      res.json(followers);
    });
  }

  /**
   * Get all Users and add the connected carcterisitc
   * @param req
   * @param {string} [req.body.searchData] -the sepcific users you are looking for
   * @param {number} [req.body.limitData] -the number of users you want to send
   * @param {number} [req.body.skipLimit] -for scrolling users
   * @param {express.Response} res
   */
  getUsers = (req, res) => {
    const search = req.query.searchData ? {username: new RegExp(req.query.searchData, 'i')} : {},
      limitData = req.query.limitData ? Number(req.query.limitData) : 0;
    Users
      .find(search)
      .select({
        password: 0,
        __v: 0
      }).limit(limitData)
      .sort({createdAt: 1})
      .skip(req.body.skipLimit)
      .exec(function (err, usersData) {
        if (err) {
          res.status(500).send(err);
        } else {
          if (Array.isArray(usersData) && usersData.length) {
            const asyncLoop = (i, usersData) => {
              Users.listOfFriends(usersData[i].following, 10, false, waster => {
                usersData[i].following = waster;
                if (i === usersData.length - 1) {
                  UsersConnected.find().exec((err, userConnected) => {
                    const connectedId = userConnected.map(elem => {
                      return elem.userId;
                    });
                    usersData = usersData.map(doc => {
                      let isConnected: boolean;
                      if (doc && doc._id) {
                        isConnected = connectedId.some(elem => {
                          return elem === doc._id.toString();
                        });
                        doc._doc.isConnected = isConnected;
                        return doc;
                      }
                    });
                    res.json(usersData);
                  });
                } else {
                  asyncLoop(++i, usersData);
                }
              });
            };
            asyncLoop(0, usersData);
          } else {
            res.json([]);
          }
        }
      });
  }

  /**
   *
   * @param req
   * @param {string} req.body.userId -mongoose userId
   * @param {string} req.body.token -json web token
   * @param res
   */
  deconnection = (req, res) => {
    console.log(req.body);
    const userId = req.body.userId;
    Users.findOne({_id: userId}, (err, user) => {
      UsersConnected.findOne({userId: userId}, (err, user) => {
        if (!err) {
          if (user) {
            if (user.location.length <= 1) {
              user.remove();
            } else {
              if (!err) {
                const indexObj = user.location.findIndex(elem => {
                  return elem._id.toString() === user.idOfLocation;
                });
                user.location.splice(indexObj, 1);
                user.save();
              }
            }
          }
          res.send('deconnection effectuée');
        }
      });
    });
    // TODO  deconnectionMethod('userId', decoded.user._id)
  }
  /**
   * Delete socket ID from MongoDB server
   * @param {string} socketId string
   */
  deleteSocketIdDB = (socketId) => {
    // TODO  deconnectionMethod('location.socketId', socketId)
    UsersConnected.findOne({'location.socketId': socketId}, (err, locationUser) => {
      if (!err) {
        if (locationUser) {
          if (locationUser.location.length <= 1) {
            locationUser.remove()
          } else {
            const indexOfLocation = locationUser.location.indexOf(locationUser.location.find(elem => {
              return elem.socketId === socketId;
            }));
            locationUser.location.splice(indexOfLocation, 1);
            locationUser.save();
          }
        }
      }
    });
  }

  followingFunction = (req, res) => {
    return Users.followMethod(req.body, function (user) {
      res.json(user);
    });

  }

  followUser = (req, res) => {
    const userId = req.body.userId,
      wasterId = req.body.wasterId;
    let userIdWaster;
    const date = new Date();
    console.log('req.body', req.body);
    Users.findById(wasterId, function (err, waster) {
        if (!waster.following.length) { // init s tableau vide
          waster.following.push({
            userId: userId,
            statut: 'requested',
            date: date
          });
        } else {
          console.log(waster);
          // test si l'user ID est deja présent
          const already = waster.following.some(doc => {
            console.log('deja présent');
            return doc && doc.userId === userId;
          });
          if (!already) {
            waster.following.push({
              userId: userId,
              statut: 'requested',
              date: date
            });
          }
        }
        waster.save(function () {
          userIdWaster = waster.username;
          this.sendSocketNotification(waster, 'friendRequest');
        });
      }
    );
    Users.findById(userId, function (err, follower) {
      if (!follower.following.length) { // init
        follower.following.push({
          userId: wasterId,
          statut: 'pending',
          date: date
        });
      } else {
        let already = false; // test si l'user ID est deja présent
        follower.following.forEach(function (doc) {
          if (doc.userId && doc.userId === wasterId) {
            already = true;
          }
        });
        if (!already) {
          follower.following.push({
            userId: wasterId,
            statut: 'pending',
            date: date
          });
        }
      }
      follower.save(function () {
        res.json(follower);
      });
    });
  }
  ;

  /**
   * Send private notification to the receiver of the request
   * @type {(p1?:*, p2?:*)}
   */

  private sendSocketNotification(waster, notif) {
    UsersConnected.findOne({userId: waster._id}, (err, userCo) => {
      if (userCo) {
        userCo.location.forEach(elem => {
          this.io.sockets.connected[elem.socketId].emit(notif, waster);
        });
      }
    });
  };

  followUserOk = (req, res) => {
    const userId = req.body.userId,
      wasterId = req.body.wasterId;
    console.log('user e waster');
    console.log(userId + wasterId);
    Users.findById(wasterId, function (err, waster) {
      if (!err) {

      }
      waster.following.forEach(function (doc) {
        console.log(doc);
        if (doc.userId == userId) {
          doc.statut = 'accepted';
        }

      });
      waster.save(() => {
        this.sendSocketNotification(waster, 'friendRequestAccepted');
      });
    });
    Users.findById(userId, function (err, follower) {
      if (err) {
        console.log('failed save');
      } else {
        follower.following.forEach(function (doc) {
          if (doc.userId === wasterId) {
            doc.statut = 'accepted';
          }
        });
        follower.save(function () {
        });
        res.json(follower);
      }
    });
  };

  unfollowUser(req, res) {
    const userId = req.body.userId,
      wasterId = req.body.wasterId;
    Users.findById(wasterId, function (err, waster) {
      console.log(waster);
      const index = waster.following.findIndex(function (doc) {
        return doc.userId === userId
      });
      waster.following.splice(index, 1);
      waster.save(() => {
        this.sendSocketNotification(waster, 'removeFriend');
        Users.findById(userId, function (err, follower) {
          const wasterIndex = follower.following.findIndex(function (doc) {
            return doc.userId === wasterId;
          });
          follower.following.splice(wasterIndex, 1);
          follower.save();
          res.json(follower);
        });
      });
    });
  };


  getThisUser = (req, res) => {
    const userId = req.body.userId;
    Users.findById(userId).select({password: 0, __v: 0}).exec((err, user) => {
      if (!err) {
        Users.listOfFriends(user.following, 10, false, waster => {
          user.following = waster;
          res.json(user);
        });
      }
    });
  };

  uploadPicture = (req, res) => {
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
    });
  }

  /**
   * Delete all Picture of a specific user
   * @param req
   * @param res
   */
  deleteAllPictures = (req, res) => {
    uploadUtil(req, res, (files, directory, userId) => {
      if (files.length === 0) {
        fs.rmdir(directory, function (err) {
          if (err) {
            res.status(400).send(err);
          }
        });
      } else {
        Users.findById(userId).select({password: 0, __v: 0}).exec((err, user) => {
          if (err) {
            res.status(500).send('unerreru a la suppression:', err);
          }
          files.forEach((file, i) => {
            const filePath = directory + file;
            fs.stat(filePath, function (err, stats) {
              if (err) {
                console.log(JSON.stringify(err));
              } else {
                if (stats.isFile()) {
                  fs.unlink(filePath, function (er) {
                    if (err) {
                      res.status(400).json(er);
                    }
                  });
                }
              }
            });
          });
          user.image = undefined;
          user.save(() => {
            res.json(user);
          });
        });
      }
    });
  }


  /**
   * Call this function uniquely if the user is refreshing the page of connnect again
   * @param req
   * @param res
   */
  refreshSocketIdOfConnectedUsers = (req, res) => {
    const socketId = req.body.socketId;
    UsersConnected.findOne({userId: req.body.userId}, (err, user) => {
      if (!err) {
        if (user) {
          user.location.push({socketId: socketId, IP: ipConnection(req)});
          let location = [];
          Object.keys(this.io.sockets.connected).forEach(elem => {
            user.location.forEach(theRealSocketUses => {
              if (theRealSocketUses.socketId === elem) {
                location = [...location, theRealSocketUses];
              }
            });
          });
          if (!location.length) {
            user.remove();
          } else {
            user.location = location;
          }
          user.save(() => {
            res.send(`socketnumber ${req.body.socketId} has been updated as an existing user`);
          });
        } else {
          const newUserConnected = new UsersConnected({
            userId: req.body.userId,
            location: [{socketId: req.body.socketId, IP: ipConnection(req)}]
          });
          newUserConnected.save((err, savedUser) => {
            // locationSearch(savedUser, socketId, decoded.user, res)
            res.send(`socketnumber ${req.body.socketId} has been updated as a new user`);
          });
        }
      } else {
        console.log(err);
      }
    });
  };

  /**
   * This function update lit of friends and information about a specific user (the connected user mainly)
   * @param req
   * @param {string} req.body.token -JsonWebToken
   * @param res
   */
  refreshUserData = (req, res) => {
    const userId = req.body.userId;
    Users.findById(userId).select({password: 0, __v: 0}).exec((err, user) => {
      if (!err) {
        Users.listOfFriends(user.following, 10, false, waster => {
          waster.map(elem => {
            user.following.map(doc => {
              if (doc.userId === elem._id) {
                doc = elem;
              }
              return doc;
            });
          });
          res.status(200).json(user);
        });
      }
    });
  };
}
