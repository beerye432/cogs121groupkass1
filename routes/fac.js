var models = require("../models");
var facilities = require("../facilities.json");

const fac = [];

exports.view = function(req, res) {
    /* TODO */
    var facID = req.query.id;
    //redirect if not correct parameter
    if(req.query == null || facID == null /*|| fac.indexOf(facID) == -1*/){
    	res.redirect("/sport");
    	return;
    }
    console.log(facID);
    res.render("fac", facilities["facilities"][facID]);
};
