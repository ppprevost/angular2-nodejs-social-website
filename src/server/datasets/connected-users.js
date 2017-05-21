var mongoose = require("mongoose");
module.exports = mongoose.model('UsersConnected', {
  userId: String,
  location: [
    {
      socketId: String,
      IP: String,
      token: String
    }],
  isConnected: Boolean,
  date: {type: Date, default: Date.now}
});
