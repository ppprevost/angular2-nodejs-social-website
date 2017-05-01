var mongoose = require('mongoose');
module.exports = mongoose.model('Waste', {
  userId: String,
  userType: {type: String, enum: ['public', 'private']},
  content: String,
  date: {type: Date, default: Date.now}
});
