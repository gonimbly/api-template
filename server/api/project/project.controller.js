'use strict';

var Project = require('../../../db/models/project');

exports.get = function(req, res) {
	console.log(req.body);
   	Project
   		.forge()
	   	.fetchAll({debug:true, required:true})
	  	.then(function(models){
	  		console.log('models',models);
	  		res.json(models);
	  	})
	  	.catch(function(err){
	  		res.error(err);
	  	});
};

// exports.post = function(req, res) {}