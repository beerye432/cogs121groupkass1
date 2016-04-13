var models = require("../models");
const sports = ["basketball", "badminton", "jogging", "ultimate_frisbee", "tennis", "volleyball"];

exports.view = function(req, res) {
    /* TODO */
    var facID = req.query.id;
    //redirect if not correct parameter
    if(req.query == null || facID == null || sports.indexOf(sportID) == -1){
    	res.redirect("/sport");
    	return;
    }
    console.log(facID);
    res.render("fac");
};
