'use strict';

const guardingprecondition = require('./env_verify_run_before_tests.js');

const chai = require('chai');
const assert = require('assert');

describe('environment variables (are set up properly for \'development\')', function() {

  this.timeout(5000);

  it('should exist, NODE_ENV', function() {
    assert(process.env.NODE_ENV);
  });

  // only 'development' would be eligible for testing
  it('should be correct value, attached to NODE_ENV', function() {
    assert.equal(process.env.NODE_ENV, 'development');
  });

});