'use strict';

const guardingprecondition = require('../env_verify_run_before_tests.js');

const chai = require('chai');
const expect = require('chai').expect;

var helpr = require('../../controller/helper');

describe('err feedback msg is constructed properly', function() {

  this.timeout(5000);

  it('should return concatenated text', function() {
    
    var operation = 'create';
    var err = 'Json missing.';
    
    var msg = helpr.errFeedbackMsgConstruct(operation, err);
    expect(msg).to.equal('Unable to create. Json missing.');

  });
  
});