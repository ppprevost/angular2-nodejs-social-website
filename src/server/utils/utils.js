const Users = require('../datasets/users');

module.exports = () => {

  let listOfFriends = function (req, res, followingTable, numberOfFriends = 0, callback) {
    let following = followingTable || [];
    let newTable = [];
    newTable = following.filter(elem => {
      return elem.statut === 'accepted'
    }).map(doc => {
      return doc.userId
    });
    Users.find({_id: {$in: newTable}}).select({image: 1, _id: 1, username: 1}).limit(numberOfFriends)
      .exec(function (err, waster) {
        following = following.map(follow => {
          waster.forEach(elem => {
            if (follow.userId === elem._id.toString()) {
              follow.image = elem.image;
              follow.username = elem.username
            }
          });
          return follow
        }).filter(filt => {
          return filt.statut === "accepted"
        });
        callback(following)
      });
  };

  /**
   *
   * @param query
   * 'followingTable':Array of Follower
   * 'numberOfFriends':number
   * 'afterCheck':callback function return wasters
   */
  let listOfFriends2 = function (query) {
    let following = query['followingTable'] || [];
    let newTable = [];
      newTable = following.filter(elem => {
        return elem.statut === 'accepted'
      }).map(doc => {
        return doc.userId
      });
      Users.find({_id: {$in: newTable}}).select({
        statut: 1,
        image: 1,
        _id: 1,
        username: 1
      }).limit(query['numberOfFriends'])
        .exec(function (err, waster) {
          query['afterCheck'](waster)
        });
  };

  /**
   * add additional information to listOfFriends
   * @param req
   * @param res
   * @param numberOfFriends
   * @param userData
   * @param callback
   */
  let expandFriendInfo = (req, res, numberOfFriends, userData, callback) => {
    listOfFriends(req, res, userData.following, numberOfFriends, (waster) => {
      waster.map(elem => {
        if (userData.following) {
          userData.following.map(doc => {
            if (doc.userId === elem._id.toString()) {
              doc = elem
            }
            return doc
          })
        }
      });
      return callback(userData);
    });
  };

  /**
   * Get list of friend and sent notf to all friend list
   * @param req
   * @param res
   * @param userData
   * @param message
   * @returns {Promise}
   */
  let getListOfFriendAndSentSocket = (req, res, userData, message) => {
    return new Promise((rej, resolve) => {
      listOfFriends(req, res, userData.following, 0, waster => {
        let socketUser = waster.map(elem => {
          return elem.userId
        });
        let socketIds = [];
        UsersConnected.find({userId: {$in: socketUser}}).exec((err, userCo) => {
          userCo.forEach(userConected => {
            userConected.location.forEach(socketId => {
              if (io.sockets.connected[socketId.socketId]) {
                socketIds = [...socketIds, socketId.socketId];
                io.sockets.connected[socketId.socketId].emit('newComments', message)
              }
            });
          })
        });
        socketIds.forEach(elem => {
          console.log('send to friend==>', elem)
        });
        resolve(waster)
      })

    });
  };

  return {listOfFriends, listOfFriends2, expandFriendInfo, getListOfFriendAndSentSocket};


  /**
   * Created by Prevost on 05/06/2017.
   */
};
