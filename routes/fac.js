var models = require("../models");

exports.view = function(req, res) {
    /* TODO */
    var facID = req.query.id;
    if(facID == null){
    	res.redirect("/sport");
    	return;
    }
    console.log(facID);
    res.render("fac");
};
