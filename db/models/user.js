'use strict';

var Bromise = require('bluebird');
var bcrypt = Bromise.promisifyAll(require('bcrypt'));
var bookshelf = require('bookshelf')(require('../knexpg'));
var validator = require('validator');
var Token = require('./token');

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
	authenticate: function (options) {
		var invalidCredentials = 'Invalid username or password';
		if (!validator.isEmail(options.email)) {
			throw new Error('Invalid email address');
		}
		if (!validator.isLength(options.password, 4)) {
			throw new Error('Password must be at least 4 characters');
		}

		return Bromise.resolve().then(function(){
			return model.forge({email: options.email})
				.fetch()
				.then(function (user) {
					if(!user) {
						throw new Error(invalidCredentials);
					}
					return this.comparePassword(options.password, user.get('password'))
						.then(function (match) {
							// if (err) return callback(err);
							if (match) {
								return token.forge()
									.createAccessToken(user.toJSON())
									.then(function(token) {
										return{'user':{'email': user.get('email'), 'firstName': user.get('firstName'), 'lastName': user.get('lastName')}, 'token': token};
									});
							} else {
								// Passwords don't match
								throw new Error(invalidCredentials);
							}
						}, 	function(err){
							return err;
						});
				});
		});
	},

	/**
	 * Compare clear with hashed password
	 * @param password
	 * @param hash
	 */
	comparePassword: function (password, hash) {
		return Bromise.resolve().then(function(){
			return bcrypt.compareAsync(password, hash)
				.then(function (match) {
					return match;
				}, function(error){
					return error;
				});
		});
	},

	/**
	 * Encrypt password with per-user salt
	 * @param password
	 */
	encryptPassword: function (password) {
		return Bromise.resolve().then(function(){
			return bcrypt.genSaltAsync(10)
				.then(function (salt) {
					return bcrypt.hashAsync(password, salt);
				}, function(err){
					return err;
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
	signup: function (options) {
		if (!validator.isEmail(options.email)) {
			throw new Error('Invalid email address');
		}
		if (!validator.isLength(options.firstName, 1) || !validator.isAlphanumeric(options.firstName)) {
			throw new Error('First name must be at least one character');
		}
		if (!validator.isLength(options.lastName, 1) || !validator.isAlphanumeric(options.lastName)) {
			throw new Error('Last name must be at least one character');
		}
		if (!validator.isLength(options.password, 4)) {
			throw new Error('Password must be at least 4 characters');
		}

		return Bromise.resolve().then(function(){
			return model.forge({email: options.email})
				.fetch()
				.then(function (user) {
					if(user) {
						throw new Error('Email address already registered');
					}
					return this.encryptPassword(options.password)
						.then(function (hash) {
							var newUser = {
								email: options.email,
								firstName: options.firstName,
								lastName: options.lastName,
								password: hash
							};
							return model.forge(newUser).save();
						})
						.then(function (newUser) {
							return Token.forge().createAndWriteAccessToken(newUser);
						});
						
				});
		});
	}
});
module.exports = model;