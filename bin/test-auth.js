#!/usr/bin/env node
'use strict';

var model = require('../db/models/user');

function handler(err, result){
	if(err){
		console.log('err',err);
		process.exit(1);
	}
	else {
		console.log('result',result);
		process.exit();
	}
}

var user = {
	email: 'test@test.com',
	password: 'test'
};

model.forge().authenticate(user, handler);
