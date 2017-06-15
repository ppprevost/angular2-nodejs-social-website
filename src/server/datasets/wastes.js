let mongoose = require('mongoose');
module.exports = mongoose.model('Waste', {
  userId: {type: String, required: true},
  userType: {type: String, enum: ['public', 'private']},
  content: String,
  likes: {
    type: Number,
    default: 0
  },
  commentary: [{
    userId: String, typeWaste: String, likes: {
      type: Number,
      default: 0
    }, data: String, date: {type: Date, default: Date.now}
  }],
  date: {type: Date, default: Date.now}
});
