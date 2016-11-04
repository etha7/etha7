
/*
 * GET role page.
 */
var data = require('../sampleData.json');

exports.view = function(req, res){
	console.log(data);
  res.render('scientist', data);
};
