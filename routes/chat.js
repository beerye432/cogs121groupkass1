var models = require("../models");
const sports = ["basketball", "badminton", "jogging", "ultimate_frisbee", "tennis", "volleyball"];

exports.view = function(req, res) {
    /* TODO */
    var sportID = req.query.id;
    //redirect if not correct parameter
    if(req.query == null || sportID == null || sports.indexOf(sportID) == -1){
    	res.redirect("/sport");
    	return;
    }
    res.render("chat");
};

exports.getChatData = function(req, res) {
	var sportID = req.query.id;
	console.log(sportID);
    models.SportsFeed.findOne({ "sport": sportID }, function(err, channel) {
          if(err) {
          	console.log(err);
          	res.json([]);
          }else{
          	console.log(channel);
          	if(channel == null || channel.messages == null){
          		res.json([]);
          	}else{
          		res.json(channel.messages);
          	}
          }
    });
};