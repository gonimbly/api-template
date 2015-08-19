'use strict';

var Project = require('../../../db/models/project');

exports.get = function(req, res) {
	console.log(req.body);
	Project
		.forge()
		.fetchAll({debug:true, required:true})
			.then(function(models){
				res.json(models);
			})
			.catch(function(err){
				res.status(400).send({error:err.message});
			});
};