var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
    "twitterID": String,
    "token": String,
    "name": String,
    "displayName": String,
    "photo": String
});

//will remove
var NewsFeedSchema = new Mongoose.Schema({
  'user': {
    'displayName': String,
    'photo': String
  },
  'message': String,
  'posted': { type: Date, default: Date.now() }
});

var MessageSchema = new Mongoose.Schema({
  'user': {
    'displayName': String,
    'photo': String
  },
  'message': String,
  'posted': { type: Date, default: Date.now() }
});

var SportsFeedSchema = new Mongoose.Schema({
  'sport' : String,
  'messages' : [MessageSchema]
});

exports.User = Mongoose.model('User', UserSchema);
exports.NewsFeed = Mongoose.model('NewsFeed', NewsFeedSchema);
exports.SportsFeed = Mongoose.model('SportsFeed', SportsFeedSchema);
exports.Message = Mongoose.model('Message', MessageSchema);