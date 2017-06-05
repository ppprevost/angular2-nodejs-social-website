const Users = require('../datasets/users');

module.exports = () => {

  let listOfFriends = function (req, res, followingTable, numberOfFriends = 0, callback) {
    let following = followingTable || [];
    let newTable = [];
    if (!following.length) {
      res.json([]);
    } else {
      newTable = following.filter(elem => {
        return elem.statut == 'accepted'
      }).map(doc => {
        return doc.userId
      });
      Users.find({_id: {$in: newTable}}).select({image: 1, _id: 1, username: 1}).limit(numberOfFriends)
        .exec(function (err, waster) {
          following = following.map(follow => {
            waster.forEach(elem => {
              if (follow.userId == elem._id.toString()) {
                follow.image = elem.image;
                follow.username = elem.username
              }
            });
            return follow
          }).filter(filt => {
            return filt.statut == "accepted"
          });

          callback(following)
        });
    }
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
    if (!following.length) {
      query['res'].json([]);
    } else {
      newTable = following.filter(elem => {
        return elem.statut == 'accepted'
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
    }
  };

  return {listOfFriends, listOfFriends2};


  /**
   * Created by Prevost on 05/06/2017.
   */
};
