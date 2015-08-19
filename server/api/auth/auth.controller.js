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
				.then(function (thing) {
					console.log('thing',thing);
					res.send(200);
				});
		})
		.catch(function(err){
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
				return res.send(401, invalidCredentials);			
			}
			return Token.forge().createAccessToken(user)
				.then(function (token) {
					return Token.forge().writeAccessToken(token, user);
				});
		})
		.then(function (token) {
			res.send(token);
		})
		.catch(function(err){
			res.status(400).send({error:err.message});
		});
};