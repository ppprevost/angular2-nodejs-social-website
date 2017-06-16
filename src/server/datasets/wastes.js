let mongoose = require('mongoose');
module.exports = mongoose.model('Waste', {
  userId: {type: String, required: true},
  userType: {type: String, enum: ['public', 'private']},
  content: String,
  likes: [String],
  commentary: [{
    userId: String, typeWaste: String,
    likes: [String],
    data: String, date: {type: Date, default: Date.now}
  }],
  date: {type: Date, default: Date.now}
});
