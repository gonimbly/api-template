'use strict';

var Token = require('../../../db/models/token');
var User = require('../../../db/models/user');
var invalidCredentials = 'Invalid email or password';

exports.login = function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;

	if (!email || !password) {
		return res.send(401, invalidCredentials);
	}

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
			res.error(err);
		});;
};