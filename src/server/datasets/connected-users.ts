import * as mongoose from 'mongoose';

export default mongoose.model('UsersConnected', new mongoose.Schema({
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
