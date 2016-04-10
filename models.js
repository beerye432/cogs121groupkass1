var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
    "twitterID": String,
    "token": String,
    "name": String,
    "displayName": String,
    "photo": String
});

var NewsFeedSchema = new Mongoose.Schema({
  'user': {
    'displayName': String,
    'photo': String
  },
  'message': String,
  'posted': { type: Date, default: Date.now() }
});

exports.User = Mongoose.model('User', UserSchema);
exports.NewsFeed = Mongoose.model('NewsFeed', NewsFeedSchema);
