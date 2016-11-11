
/*
 * GET role page.
 */
var data = require('../data.json');

exports.view = function(req, res){
    data.choices.push({"cheese": "boots" });
	console.log(data);
    res.render('scientist', data);
};
