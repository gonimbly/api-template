'use strict';

var knexpg = require('../knexpg')
var bookshelf = require('bookshelf')(knexpg);

var model = bookshelf.Model.extend({
	tableName: 'projects',
	hasTimestamps: true
});
module.exports = model;