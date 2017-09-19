import * as mongoose from 'mongoose';


let Article = new mongoose.Schema({
  author: String,
  content: String,
  description: String,
  type: {
    type: String,
    enum: ['text', 'image', 'articleUrl', 'videoUrl']
  },
  image: String,
  source: String,
  title: String,
  url: String,
  _url: String
});

const Commentary = new mongoose.Schema({
  userId: String, typeWaste: String,
  likes: [String],
  data: String, date: {type: Date, default: Date.now}
});


const schema = new mongoose.Schema({
  userId: {type: String, required: true},
  userType: {type: String, enum: ['public', 'private']},
  content: Article,
  likes: [String],
  commentary: [Commentary],
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
