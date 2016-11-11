
/*
 * GET role page.
 */

var data1 = require('../public/json/sampleData.json');

exports.view = function(req, res){
<<<<<<< HEAD
	console.log(data1);
  res.render('scientist', data1);
=======
    data.choices.push({"cheese": "boots" });
	console.log(data);
    res.render('scientist', data);
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
};
