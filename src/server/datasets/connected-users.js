var mongoose = require("mongoose");
module.exports = mongoose.model('UsersConnected', {
  userId: String,
  socketId: {type: String},
  isConnected: Boolean,
  date: {type: Date, default: Date.now}
});
