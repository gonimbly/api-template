'use strict';

var Bromise = require('bluebird');
var Token = require('../../../db/models/token');
var User = require('../../../db/models/user');
var invalidCredentials = 'Invalid email or password';

exports.signup = function(req, res) {
	Bromise.resolve()
		.then(function(){
			return User.forge()
				.signup(req.body)
				.then(function (model) {
					console.log('model',model);
					res.status(200).send(model);
				});
		})
		.catch(function(err){
			console.log('err',err);
			res.status(400).send({error:err.message});
		});
};

exports.login = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;

	if (!email || !password) {
		return res.send(401, invalidCredentials);
	}

	//todo: authenticate
	User.forge({email: email})
		.fetch()
		.then(function (user) {
			if(!user){
				throw new Error(invalidCredentials);			
			}
			return user;
		})
		.then(function (user) {
			return createAndWriteAccessToken(user);
		})
		.then(function (token) {
			res.send(token);
		})
		.catch(function(err){
			console.log('err',err);
			res.status(400).send({error:err.message});
		});
};