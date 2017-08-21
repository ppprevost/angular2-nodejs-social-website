import * as mongoose from 'mongoose';


var schema = new mongoose.Schema({
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


/**
 * Add image and username to waste
 * @param {User} user -the userinformation
 * @returns {schema.methods}
 */
schema.methods.getMoreWasteInfo = function (user) {
  this._doc.username = user.username;
  this._doc.image = user.image;
  return this
};

module.exports = mongoose.model('Waste', schema);
