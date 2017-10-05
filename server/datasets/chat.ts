import {model, Schema} from 'mongoose';

const User = require('./users');

/**
 * The chatting model to find it parse the participant array
 * @type {"mongoose".Model<T>}
 */

const Message = new Schema(
  {
    userId: {required: true, type: String},
    date: Date,
    content: String,
    image: String,
    username: String
  });

const schema = new Schema({
  participant: Array,
  message: [Message],
  date: {type: Date, default: Date.now}
})

schema.methods.getMoreUserInfo = function (userIds: Array<string>, callback: (user) => any) {
  const users = userIds.map(doc => {
    User.findById(doc)
      .select({username: 1, image: 1})
      .exec((err, user) => {
          if (err) {
            console.log('error', err);
          } else {
            callback(user);
          }
        }
      )
    ;
  });

};
const Chat = model('Chat', schema);
module.exports = Chat;


