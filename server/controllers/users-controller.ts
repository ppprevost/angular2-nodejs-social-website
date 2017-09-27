const Users = require('../datasets/users'), UsersConnected = require('../datasets/connected-users');
import * as fs from 'fs';
import * as utils from '../utils/utils';

import {ipConnection} from '../utils/utils';
type Request = ['requested', 'accepted']

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

  getlistOfFriends(req, res) {
    let fullDataWanted = req.body.fullDataWanted;
    return Users.listOfFriends(req.body, 0, fullDataWanted, followers => {
      res.json(followers);
    });
  };

  /**
   * Get all Users and add the connected carcterisitc
   * @param req
   * @param {string} [req.body.searchData] -the sepcific users you are looking for
   * @param {number} [req.body.limitData] -the number of users you want to send
   * @param {number} [req.body.skipLimit] -for scrolling users
   * @param {express.Response} res
   */
  getUsers(req, res) {
    let obj = {
      all: {},
      requested: {_id: {$in: req.waster}},
      accepted: {_id: {$in: req.waster}},
    }, search;
    const requestWanted = req.query.searchData || req.body.typeOfRequest;
    if (requestWanted) {
      search = obj[requestWanted];
      console.log('search', search);
      if (!search) {
        search = {username: new RegExp(req.query.searchData, 'i')};
      }
    }
    const limitData = req.query.limitData ? Number(req.query.limitData) : 0, request = req.query.request;
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
              }, request);
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
    return Users.followMethod(req.body, this.io, function (err, user) {
      if (err) {
        res.status(403).json(err);
      } else {
        res.status(200).json(user);
      }
    });
  }

  /**
   * get user infos and list of Friends. If typerequest send follloower and not the user itself
   * @param req
   * @param res
   */
  getThisUser = (req, res) => {
    const userId = req.body.userId, typeOfRequest: Request = req.body.typeOfRequest,
      fullDataWanted = req.body.fullDataWanted;
    Users.findById(userId).select({password: 0, __v: 0}).exec((err, user) => {
      if (!err) {
        Users.listOfFriends(user.following, 10, fullDataWanted, waster => {
          this.sendFollowerToClient(waster, typeOfRequest, req, res, user);
        }, typeOfRequest);
      } else {
        console.error(err);
      }
    });
  };

  private sendFollowerToClient(waster, typeOfRequest, req, res, user) {
    if (typeOfRequest) { // for get request and accepted users.
      req.waster = waster.map(elem => elem.userId);
      console.log('fsdfsd', req.waster);
      this.getUsers(req, res);
    } else {
      user.following = waster;
      res.json(user);
    }
  }

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
          if (!req.pramas.pictureId) {
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
          } else {
            // ToDO delete pictures
            res.json(user);
          }
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
