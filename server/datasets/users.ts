import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {} from 'socket.io';
import {Response} from 'express';
import {typeFunctionMethod, sendSocketNotification, ipConnection} from '../utils/utils';
const UsersConnected = require('./connected-users');

interface IUser {
  _id: string;
  email: string;
  username: string;
  password: string;
  website: string;
  gender: string;
  image: string;
  cover: string;
  idOfLocation?: string;
  location: Array<any>;
  createdAt: string;
  bio: string;
  role: number;
  isConnected: boolean;
  following: Follower[];
}

interface Follower {
  userId: string;
  date: Date;
  statut: string;
  image: string;
  username: string;
}

const follower = new mongoose.Schema(
  {
    userId: {required: true, type: String},
    date: Date,
    statut: {type: String, enum: ['pending', 'requested', 'accepted']},
    image: String,
    username: String
  });

const schema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: 'Email address is required',

  },
  username: {
    type: String
  },
  password: {
    type: String,
    required: 'mot de passe Mongoose required'
  },
  website: String,
  gender: String,
  image: String,
  cover: String,
  location: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  bio: String,
  role: Number,
  mail: String,
  isConnected: Boolean,
  following: [follower]
});

/**
 *Get the list of friends('accepted') of a specific user.
 * @param followingTable
 * @param {Number} numberOfFriends
 * @param {String} fullDataWanted If you want a lot of data of just picture and username
 * @param {RequestedCallback} callback
 */
schema.statics.listOfFriends = function (followingTable: Follower[] = [],
                                         numberOfFriends: number = 0,
                                         fullDataWanted: boolean = false,
                                         callback: (IUser) => void) {
  const following = followingTable;
  const newTable = following.filter(elem => elem.statut === 'accepted').map(doc => doc.userId);
  const valueSeek = fullDataWanted ? {} : {image: 1, _id: 1, username: 1};
  this.find({_id: {$in: newTable}}).select(valueSeek).limit(numberOfFriends)
    .exec(function (err, waster) {
      waster = waster
        .map(doc => doc.toObject())
        .map(el => {
          el.userId = el._id.toString();
          el.statut = 'accepted';
          delete el._id;
          return el;
        });
      callback(waster);
    });
};

/**
 * Get list of friend and sent notf to all friend list that are connected
 * @param {Users} userData
 * @param {Object} message -the message to send to the other friends
 * @param {string} aliasSocketMessage -the alias of the socket
 * @param {any} socketSource
 * @returns {Promise<T>}
 */
schema.statics
  .getListOfFriendAndSentSocket = function (userData: IUser, message, aliasSocketMessage: string, socketSource): Promise<IUser[]> {
  return new Promise((resolve, rej) => {
    this.listOfFriends(userData.following, 0, false, function (waster) {
      const socketUser = waster.map(elem => elem.userId);
      UsersConnected.find({userId: {$in: socketUser}}).exec((err, userCo) => {
        if (!err) {
          userCo.forEach(userConected => {
            userConected.location.forEach(socketObject => {
              if (socketSource.sockets.connected[socketObject.socketId]) {
                console.log('send to friend==>', socketObject.socketId);
                //  socketIds = [...socketIds, socketObject.socketId];
                socketSource.sockets.connected[socketObject.socketId].emit(aliasSocketMessage, message);
              }
            });
          });
          resolve(waster);
        } else {
          rej(err);
        }
      });
    });
  });
};

/**
 * Compare your password to change it
 * @param candidatePassword
 * @param callback
 */
schema.methods.comparePassword = async function (candidatePassword, callback: (err: Error
  | string, isMatch: boolean) => any) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (isMatch) {
      callback(null, isMatch);
    } else {
      callback(err || 'Match error, please be sure to fill your good old password', null);
    }
  });
};

/**
 * To create a new secure user
 * @param password
 * @param tempUserData
 * @param insertTempUser
 * @param callback
 */
schema.statics.hashingFunction = async function (password: string, tempUserData, insertTempUser, callback: Function) {
  bcrypt.genSalt(8, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      return insertTempUser(hash, tempUserData, callback);
    });
  });
};

interface InfoMethod {
  typeFollowing: string;
  socketMessage: string;
  userId: string;
  wasterId: string;
  statut: string;
  users?: any;
}
/**
 *
 * @param {Object} infoFollowMethod
 * @param {string} infoFollowMethod.userId
 * @param {string} infoFollowMethod.wasterId
 * @param {string} infoFollowMethod.typeFollowing
 * @param {string} infoFollowMethod.socketMessage
 * @param {Express Response} res
 */
schema.statics.followMethod = function (infoFollowMethod: InfoMethod, io, callback: (err, IUser) => Response) {
  const userId = infoFollowMethod.userId, wasterId = infoFollowMethod.wasterId;
  let exist: boolean;
  // take the good type of following function and the associated method
  const actualMethodObject: any = typeFunctionMethod().find(elem => elem.type === infoFollowMethod.typeFollowing);
  actualMethodObject.users = [{
    user: userId,
    waster: wasterId,
  }, {
    user: wasterId,
    waster: userId,
  }];
  const statut = actualMethodObject.statut;
  actualMethodObject.users = actualMethodObject.users.map((addStatutUser, i) => {
    if (statut) {
      addStatutUser.statut = Array.isArray(statut) ? statut[i] : statut;
    }
    return addStatutUser;
  });
  delete actualMethodObject.statut;
  // now we know the following method and each users  have type Object with property {statut, userId,wasterId}
  this.find({_id: {$in: [userId, wasterId]}}, (err, users) => {
    exist = users.some(user => {
      actualMethodObject.users.forEach(objUserId => {
        if (user._id.toString() === objUserId.user) {
          actualMethodObject.associatedMethod(user, objUserId);
          user.save(function () {
            if (user._id.toString() === userId) {
              callback(null, user);
              //  res.json(user);
            } else {
              sendSocketNotification(user, actualMethodObject.socketMessage, io, UsersConnected);
            }
          });
        }
      });
      return false;
    });
  });
};

const locationSearch = function (savedUser, socketId, userData) {
  const idOfLocation = savedUser.location.indexOf(savedUser.location.find(elem => {
    return elem.socketId === socketId;
  }));
  if (userData && userData._doc && userData._doc.password
  ) {
    delete userData._doc.password;
    userData._doc.idOfLocation = savedUser.location[idOfLocation]['_id'];
  } else {
    userData.idOfLocation = savedUser.location[idOfLocation]['_id'];
  }
};

schema.methods.setconnectedStatuts = async function (userData, req, callback) {
  UsersConnected.findOne({userId: userData._id}, (err, userAlreadyConnected) => {
    if (userAlreadyConnected) {
      userAlreadyConnected.location.push({socketId: req.body.socketId, IP: ipConnection(req)});
      userAlreadyConnected.save(() => {
        locationSearch(userAlreadyConnected, req.body.socketId, userData);
      });
    } else {
      const newUserConnected = new UsersConnected({
        userId: userData._id,
        location: [{socketId: req.body.socketId, IP: ipConnection(req)}]
      });
      newUserConnected.save((err, savedUser) => {
        locationSearch(savedUser, req.body.socketId, userData);
      });
    }
    callback(userData);
  });
}

schema.methods.getConnectedStatus = async function (userId, callback) {
  return new Promise((rej, res) => {
    this.findOne('userId').select({isConnected: 1}).exec((err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });

};

schema.methods.deleteConnectedStatus = async function (user: IUser, callback: (err, result?) => any) {
  UsersConnected.findOne({userId: user._id}, (err, userCo) => {
    if (!err) {
      if (userCo) {
        if (userCo.location.length <= 1) {
          userCo.remove();
        } else {
          const indexObj = user.location.findIndex(elem => {
            return elem._id.toString() === user.idOfLocation;
          });
          userCo.location.splice(indexObj, 1);
          userCo.save();
        }
      }
      callback(null);
// res.send('deconnection effectuée');
    } else {
      callback(err, null);
    }
  });
};


// Omit the password when returning a user
schema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

// schema.plugin(friends({pathName: 'friendManagement'}));
const User = mongoose.model('User', schema);
module.exports = User;

