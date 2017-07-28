import * as Users from '../datasets/users';
import * as UsersConnected from '../datasets/connected-users';

export class Utils {
  private io;

  constructor(io) {
    this.io = io;
  }

  /**
   *Get the list of friends of a specific user.
   * @param followingTable
   * @param {Number} numberOfFriends
   * @param {String} fullDataWanted If you want a lot of data of just picture and username
   * @param {Function} callback
   */
  listOfFriends(followingTable = [], numberOfFriends = 0, fullDataWanted = false, callback) {
    const following = followingTable;
    const newTable = following.filter(elem => elem.statut === 'accepted').map(doc => doc.userId);
    const valueSeek = fullDataWanted ? {} : {image: 1, _id: 1, username: 1};
    Users.find({_id: {$in: newTable}}).select(valueSeek).limit(numberOfFriends)
      .exec(function (err, waster) {
        waster.map(el => {
          el._doc.userId = el._id.toString();
          el._doc.statut = 'accepted';
          delete el._doc._id;
          return el;
        });
        callback(waster);
      });
  };


  /**
   * Get list of friend and sent notf to all friend list that are connected
   * @param req
   * @param res
   * @param userData
   * @param message
   * @returns {Promise}
   */
  getListOfFriendAndSentSocket(userData, message, aliasSocketMessage): Promise<any> {
    return new Promise((resolve, rej) => {
      this.listOfFriends(userData.following, 0, false, waster => {
        const socketUser = waster.map(elem => elem.userId);
        let socketIds = [];
        // send uniquely if the user is connected
        UsersConnected.find({userId: {$in: socketUser}}).exec((err, userCo) => {
          if (!err) {
            userCo.forEach(userConected => {
              userConected.location.forEach(socketId => {
                if (this.io.sockets.connected[socketId.socketId]) {
                  console.log('send to friend==>', socketId.socketId);
                  socketIds = [...socketIds, socketId.socketId];
                  this.io.sockets.connected[socketId.socketId].emit(aliasSocketMessage, message);
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
   * Created by Prevost on 05/06/2017.
   */
}
;
