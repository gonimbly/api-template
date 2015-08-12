'use strict';

var bcrypt = require('bcrypt');
var bookshelf = require('bookshelf')(require('../knexpg'));
var validator = require('validator');
var token = require('./token');

var model = bookshelf.Model.extend({
	tableName: 'users',
	hasTimestamps: true,

	/**
	 * Signup
	 * @param {Object} options, The options object.
	 * @param {string} options.email, String for user field.
	 * @param {string} options.password, String for user field.
	 * @returns {Function} 'Ok'
	 */
	authenticate: function (options, callback) {
		var invalidCredentials = 'Invalide username or password';
		if (!validator.isEmail(options.email)) {
			return callback(new Error('Invalid email address'));
		}
		if (!validator.isLength(options.password, 4)) {
			return callback(new Error('Password must be at least 4 characters'));
		}

		model.forge({email: options.email})
		.fetch()
		.then(function (user) {
			if(!user) {
				return callback(new Error(invalidCredentials));
			}
			this.comparePassword(options.password, user.get('password'), function (err, match) {
				if (err) return callback(err);
				if (match) {
					token.forge()
						.createAccessToken(user.toJSON())
						.then(function(token) {
							return callback(null, {'user':{'email': user.get('email'), 'firstName': user.get('firstName'), 'lastName': user.get('lastName')}, 'token': token});
						})
						.catch(function(err) {
							return callback(err);    
						});
				} else {
					// Passwords don't match
					return callback(null, invalidCredentials);
				}
			});
		});
	},

	/**
	 * Compare clear with hashed password
	 * @param password
	 * @param hash
	 * @param callback
	 */
	comparePassword: function (password, hash, callback) {
		console.log('password',password);
		console.log('hash',hash);
		bcrypt.compare(password, hash, function (err, match) {
			if (err) {
				return callback(err);
			}
			return callback(null, match);
		});
	},

	/**
	 * Encrypt password with per-user salt
	 * @param password
	 * @param callback
	 */
	encryptPassword: function (password, callback) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				return callback(err);
			}
			bcrypt.hash(password, salt, function (err, hash) {
				return callback(err, hash);
			});
		});
	},

	/**
	 * Signup
	 * @param {Object} options, The options object.
	 * @param {string} options.email, String for user field.
	 * @param {string} options.firstName, String for user field.
	 * @param {string} options.lastName, String for user field.
	 * @param {string} options.password, String for user field.
	 * @returns {Function} 'Ok'
	 */
	signup: function (options, callback) {
		if (!validator.isEmail(options.email)) {
			return callback(new Error('Invalid email address'));
		}
		if (!validator.isLength(options.firstName, 1) || !validator.isAlphanumeric(options.firstName)) {
			return callback(new Error('First name must be at least one character'));
		}
		if (!validator.isLength(options.lastName, 1) || !validator.isAlphanumeric(options.lastName)) {
			return callback(new Error('Last name must be at least one character'));
		}
		if (!validator.isLength(options.password, 4)) {
			return callback(new Error('Password must be at least 4 characters'));
		}

		model.forge({email: options.email})
			.fetch()
			.then(function (user) {
				if(user) {
					return callback(new Error('Email address already registered'));
				}
				this.encryptPassword(options.password, function (err, hash) {
					if (err) return callback(err);
					var newModel = {
						email: options.email,
						firstName: options.firstName,
						lastName: options.lastName,
						password: hash
					};
					model.forge(newModel)
					.save()
					.then(function () {
						return callback(null,'OK');
					})
					.catch(callback);
				});
			})
			.catch(callback);
	}
});
module.exports = model;