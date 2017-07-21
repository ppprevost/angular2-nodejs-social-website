const Users = require('../datasets/users');
const UsersConnected = require('../datasets/connected-users');

module.exports = (io) => {
  /**
   *Get the list of friends of a specific user.
   * @param followingTable
   * @param {Number} numberOfFriends
   * @param {String} fullDataWanted If you want a lot of data of just picture and username
   * @param {Function} callback
   */
  let listOfFriends = (followingTable = [], numberOfFriends = 0, fullDataWanted = false, callback) => {
    let following = followingTable;
    let newTable = following.filter(elem => elem.statut === 'accepted').map(doc => doc.userId);
    fullDataWanted = fullDataWanted ? {} : {image: 1, _id: 1, username: 1};
    Users.find({_id: {$in: newTable}}).select(fullDataWanted).limit(numberOfFriends)
      .exec(function (err, waster) {
        waster.map(el => {
          el._doc.userId = el._id.toString();
          el._doc.statut = 'accepted';
          delete el._doc._id;
          return el
        });
        callback(waster)
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
  let getListOfFriendAndSentSocket = (userData, message, aliasSocketMessage) => {
    return new Promise((resolve, rej) => {
      listOfFriends(userData.following, 0, false, waster => {
        let socketUser = waster.map(elem => elem.userId);
        let socketIds = [];
        // send uniquely if the user is connected
        UsersConnected.find({userId: {$in: socketUser}}).exec((err, userCo) => {
          if (!err) {
            userCo.forEach(userConected => {
              userConected.location.forEach(socketId => {
                if (io.sockets.connected[socketId.socketId]) {
                  console.log('send to friend==>', socketId.socketId);
                  socketIds = [...socketIds, socketId.socketId];
                  io.sockets.connected[socketId.socketId].emit(aliasSocketMessage, message)
                }
              });
            });
            resolve(waster)
          } else {
            rej(err)
          }
        });
      })
    });
  };

  return {listOfFriends, getListOfFriendAndSentSocket};


  /**
   * Created by Prevost on 05/06/2017.
   */
};
