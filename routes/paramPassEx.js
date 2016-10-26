
/*
 * GET role page.
 */

exports.view = function(req, res){
  var role = req.params.role;
  console.log("Role is: " + role);
  res.render('index', {
  	'role': role,
  });
};
