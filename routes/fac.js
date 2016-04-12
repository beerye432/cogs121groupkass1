var models = require("../models");

exports.view = function(req, res) {
    /* TODO */
    var facID = req.query.id;
    console.log(facID);
    res.render("fac");
};
