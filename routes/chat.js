var models = require("../models");

exports.view = function(req, res) {
    /* TODO */
    var sportID = req.query.id;
    console.log(sportID);
    if(sportID == null){
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
          	res.json({});
          }else{
          	console.log(channel);
          	res.json(channel.messages);
          }
    });
};