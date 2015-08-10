'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var payload = {
  "name": "fake-payload"
};

describe('POST /api/projects', function() {

  it('should respond with 200', function(done) {
    request(app)
      .post('/api/projects')
      .send(payload)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
