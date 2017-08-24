/**
 * Created by sfrBox on 22/08/2017.
 */

/**
 * Get ipconnection to spy
 * @param req
 * @returns {*}
 */
export function ipConnection(req) {
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

export function typeFunctionMethod(): Array {
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
            return doc && doc.userId === user._id;
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
}
