'use strict';

var knexpg = require('../knexpg')
var bookshelf = require('bookshelf')(knexpg);
var Bromise = require('bluebird');
var jwt = require('jwt-simple');
var moment = require('moment');
var redisClient = require('../redis');

var model = bookshelf.Model.extend({
	tableName: 'tokens',
	hasTimestamps: true,

	createAccessToken: function (user){
		return Bromise.resolve()
			.then(function(){
				var expires = moment().add(1, 'days').valueOf();
				var token = jwt.encode({
					iss: user.id,
					exp: expires
					}, 'royunderhill');

				return token;
			});
	},
	writeAccessToken: function (token, user){
		var TIME_TO_LIVE = 60*60*24; //24 hours
		return redisClient.setexAsync(token, TIME_TO_LIVE, JSON.stringify(user))
			.then(function(){
				return token;
			});
	},
	createAndWriteAccessToken: function(user){
		return Bromise.resolve().then(function(){
			return this.createAccessToken(user)
				.then(function (token) {
					return this.writeAccessToken(token, user);
				}.bind(this));
		}.bind(this));
	}
	
});
module.exports = model;