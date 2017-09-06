/**
 * Created by sfrBox on 22/08/2017.
 */

/**
 * Get ipconnection to spy
 * @param req
 * @returns {*}
 */
const ipConnection = (req) => {
  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(',')[0];
  } else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress;
  } else {
    ip = req.ip;
  }
  return ip;
}

/**
 * Send private notification to the receiver of the request
 * @type {(p1?:*, p2?:*)}
 */

const sendSocketNotification = (waster, notif, io, usersConnected) => {
  usersConnected.findOne({userId: waster._id}, (err, userCo) => {
    if (userCo) {
      userCo.location.forEach(elem => {
        io.sockets.connected[elem.socketId].emit(notif, waster);
      });
    }
  });
};


const typeFunctionMethod = (): Array<any> => {
  return [
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
      socketMessage: 'friendRequestAccepted',
      statut: 'accepted',
      associatedMethod: function (user, objUserId) {
        user.following.forEach(function (doc) {
          console.log(doc);
          if (doc.userId === objUserId.waster) {
            doc.statut = 'accepted';
          }
        });
        return user;
      }
    },
    {
      type: 'follow',
      socketMessage: 'friendRequest',
      statut: ['pending', 'requested'],
      associatedMethod: function (user, objUserId) {
        if (!user.following.length) { // init s tableau vide
          user.following.push({
            userId: objUserId.waster,
            statut: objUserId.statut
          });
        } else {
          console.log(user);
          // test si l'user ID est deja présent
          const already = user.following.some(doc => {
            return doc && doc.userId === user._id.toString();
          });
          if (!already) {
            user.following.push({
              userId: objUserId.waster,
              statut: objUserId.statut
            });
          } else {
            console.log('deja présent');
          }
        }
        return user;
      }
    }
  ];
}

const asyncEach = (iterableList, callback, done) => {
  let i = -1,
    length = iterableList.length;

  function loop() {
    i++;
    if (i === length) {
      done();
      return;
    }
    callback(iterableList[i], loop);
  }

  loop();
};
export{ipConnection, sendSocketNotification, asyncEach, typeFunctionMethod}

