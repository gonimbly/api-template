'use strict';

//addressing bug w/ knexjs https://github.com/tgriesser/knex/issues/893
var parse = require('pg-connection-string').parse;

module.exports = {
	connection: parse(process.env.DATABASE_URL)
};