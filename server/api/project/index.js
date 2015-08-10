'use strict';

var express = require('express');
var controller = require('./project.controller');

var router = express.Router();

// router.post('/', controller.post);
router.get('/', controller.get);

module.exports = router;