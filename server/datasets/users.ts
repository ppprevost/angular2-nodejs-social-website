import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {} from 'socket.io';
import {Response} from 'express';
const UsersConnected = require('./connected-users');

interface IUser {
  email: string;
  username: string;
  password: string;
  website: string;
  gender: string;
  image: string;
  cover: string;
  location: string;
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
 *Get the list of friends of a specific user.
 * @param followingTable
 * @param {Number} numberOfFriends
 * @param {String} fullDataWanted If you want a lot of data of just picture and username
 * @param {RequestedCallback} callback
 */
schema.statics.listOfFriends = function (followingTable: Follower[] = [], numberOfFriends: number = 0, fullDataWanted: boolean = false, callback: (IUser) => void) {
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
schema.methods.comparePassword = function (candidatePassword, callback: (err: Error
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
schema.statics.hashingFunction = function (password: string, tempUserData, insertTempUser, callback: Function) {
  bcrypt.genSalt(8, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      return insertTempUser(hash, tempUserData, callback);
    });
  });
};

interface InfoMethod {
  typeFunction: string;
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
 * @param {string} infoFollowMethod.typeFunction
 * @param {string} infoFollowMethod.socketMessage
 * @param {Express Response} res
 */
schema.statics.followMethod = (infoFollowMethod: InfoMethod, res: Response, func: (IUser) => any) => {
  const userId = infoFollowMethod.userId, wasterId = infoFollowMethod.wasterId;
  let exist: boolean;
  const typeFunctionMethod = [
    {
      type: 'unfollow',
      associatedMethod: function (user, objUserId) {
        const index = user.following.findIndex(function (doc) {
          return doc.userId === objUserId.waster;
        });
        user.following.splice(index, 1);
        return user;
      },
      socketMessage: 'removeFriend'
    }, {
      type: 'followOk',
      statut: 'accepted',
      associatedMethod: function (user, objUserId) {
        user.following.forEach(function (doc) {
          console.log(doc);
          if (doc.userId === objUserId.waste) {
            doc.statut = 'accepted';
          }
        });
        return user;
      }
    },
    {
      type: 'follow',
      statut: ['pending', 'requested'],
      associatedMethod: function (user, objUserId) {
        if (!user.following.length) { // init s tableau vide
          user.following.push({
            userId: objUserId.waster,
            statut: 'requested'
          });
        } else {
          console.log(user);
          // test si l'user ID est deja présent
          const already = user.following.some(doc => {
            console.log('deja présent');
            return doc && doc.userId === userId;
          });
          if (!already) {
            user.following.push({
              userId: objUserId.waster,
              statut: 'requested'
            });
          }
        }
        return user;
      }
    }
  ];
  const actualMethodObject: any = typeFunctionMethod.find(elem => elem.type === infoFollowMethod.typeFunction);
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
      if (Array.isArray(statut)) {
        addStatutUser.statut = statut[i];
      } else {
        addStatutUser.statut = statut;
      }
    }
    return addStatutUser;
  });
  delete actualMethodObject.statut;

  this.find({_id: {$in: [userId, wasterId]}}, (err, users) => {
    users.forEach(user => {
      exist = actualMethodObject.users.some(objUserId => {
        if (user._id === objUserId.user) {
          actualMethodObject.associatedMethod(user, objUserId);
          user.save(function () {
            if (objUserId.user === userId) {
              res.json(user);
            } else {
              this.sendSocketNotification(user, actualMethodObject.socketMessage);
            }
          });
        }
        return user._id === objUserId.user;
      });
    });
    if (!exist) {
      res.status(403).send('unable to find the query');
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

