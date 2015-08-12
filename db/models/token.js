'use strict';

var knexpg = require('../knexpg')
var bookshelf = require('bookshelf')(knexpg);
var Bromise = require('bluebird');
var jwt = require('jwt-simple');
var moment = require('moment');

var model = bookshelf.Model.extend({
	tableName: 'tokens',
	hasTimestamps: true,

	createAccessToken: function (user){
		
		//JWT stuff here
		return Bromise.resolve()
			.then(function(){
				var expires = moment().add(1, 'days').valueOf();
				var token = jwt.encode({
					iss: user.id,
					exp: expires
					}, 'royunderhill');

				return token;
			});
	}
});
module.exports = model;