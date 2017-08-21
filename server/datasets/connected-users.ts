import {model, Schema} from 'mongoose';

/**
 * The waste model
 * @type {"mongoose".Model<T>}
 */
const UsersConnected = model('UsersConnected', new Schema({
  userId: String,
  location: [
    {
      socketId: String,
      IP: String,
      token: String
    }],
  isConnected: Boolean,
  date: {type: Date, default: Date.now}
}));
module.exports = UsersConnected;
