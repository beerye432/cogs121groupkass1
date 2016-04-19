var models = require("../models");
var facilities = require("../facilities.json");
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

exports.getFacilities = function(req, res) {
  var sportName = req.query.id;
  var data = {};
  var facIds = [];
  var fac = [];
  if(sportName == "basketball"){
    facIds.push(0);
    facIds.push(1);
    facIds.push(2);
  } else if(sportName == "badminton") {
    facIds.push(3);
    facIds.push(4);
    facIds.push(0);
  } else if(sportName == "jogging") {
    facIds.push(5);
    facIds.push(6);
    facIds.push(11);
  } else if(sportName == "ultimate_frisbee") {
    facIds.push(7);
    facIds.push(8);
    facIds.push(9);
  } else if(sportName == "tennis") {
    facIds.push(10);
    facIds.push(1);
    facIds.push(12);
  } else if(sportName == "volleyball") {
    facIds.push(0);
    facIds.push(3);
    facIds.push(4);
  }
  facIds.forEach(function(id){
    fac.push(facilities["facilities"][id]);

  });
  data["ids"] = facIds;
  data["facilities"] = fac;
  res.json(data);
}