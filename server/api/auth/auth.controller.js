'use strict';

exports.login = function(req, res) {
	console.log(req.body);
	//do login things
	res.json({near:'here'});
};