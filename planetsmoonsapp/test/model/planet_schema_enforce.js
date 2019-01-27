'use strict';

const guardingprecondition = require('../env_verify_run_before_tests.js');

// Below test would allow to verify 
// that db schema enforcing (set up 
// through mongoose) actually works. 

const chai = require('chai');
const assert = require('assert');

var expect = chai.expect;

describe('db, planet schema enforce (is set up properly)', function() {

  this.timeout(5000);
  
  var mongoose = require('mongoose');

  var PlanetModel = require('../../model/planet');
  var MoonModel = require('../../model/moon');

  var Db = require('../../model/db');
  
  it('should receive error on attempt to save empty document (document {})', function(done) {
    // note: done is required because of async 
    // nature of the calls this test contains

    var planet = new PlanetModel();
    
    planet.save(function(err) {
      
      // should evaluate to true
      var proper_err_received = ( err && err.errors['name'].message.includes('Path `name` is required') );
      assert(proper_err_received);
      
      // in case it went through
      //PlanetModel.deleteOne( { }, function(err, result) {} );
      // NOTE! This will delete everything! Don't want it to affect other tests, so will not run it.
      
      done();
    
    });
    
  });

  it('should receive error on attempt to create document where required field has value missing', function(done) {
    
    var planet = new PlanetModel();
    planet.name = '';
    
    planet.save(function(err) {

      // should evaluate to true
      var proper_err_received = ( err && err.errors['name'].message.includes('Path `name` is required') );
      assert(proper_err_received);

      // clean up; in case it went through
      PlanetModel.deleteOne( { name: '' }, function(err, result) {} );

      done();

    });

  });

  it('should not allow create document while required field has value missing', function(done) {
    
    var planet = new PlanetModel();
    planet.name = '';
    
    planet.save(function(err) {

      PlanetModel.findOne({ name: '' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        // clean up; in case it went through
        PlanetModel.deleteOne( { name: '' }, function(err, result) {} );

        done();
        
      });
    
    });
    
  });

  it('should receive error on attempt to create document with required field missing', function(done) {
    
    var planet = new PlanetModel();
    planet.unknownFieldName = 'b';
    
    planet.save(function(err) {
      
      // should evaluate to true
      var proper_err_received = ( err && err.errors['name'].message.includes('Path `name` is required') );
      assert(proper_err_received);
      
      // clean up; in case it went through
      PlanetModel.deleteOne( { unknownFieldName: 'b' }, function(err, result) {} );
      
      done();
    
    });
    
  });

  it('should not allow create document when required field is missing', function(done) {
    
    var planet = new PlanetModel();
    planet.unknownFieldName = 'b';
    
    planet.save(function(err) {

      PlanetModel.findOne({ unknownFieldName: 'b' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        // clean up; in case it went through
        PlanetModel.deleteOne( { unknownFieldName: 'b' }, function(err, result) {} );

        done();
        
      });
    
    });
    
  });

  it('should respond w/o error, when all schema requirements respected', function(done) {
    
    var planet = new PlanetModel();
    planet.name = 'Mercury0TEST';
    
    planet.save(function(err) {
      
      // there should be no error
      expect(err).to.equal(null);
      
      // clean up
      PlanetModel.deleteOne( { name: 'Mercury0TEST' }, function(err, result) {} );
      
      done();
      
    });
  
  });
  
  it('should respond w/o error, when all schema requirements respected and include additional but unknown fields', function(done) {
    
    var planet = new PlanetModel();
    planet.name = 'Mercury1TEST';
    planet.e = 'b';
    planet.c = 1;
    planet.h = 'nn';
    
    planet.save(function(err) {
      
      // there should be no error
      expect(err).to.equal(null);
      
      // clean up
      PlanetModel.deleteOne( { name: 'Mercury1TEST' }, function(err, result) {} );
      
      done();
      
    });
  
  });
  
  it('should create document, when all schema requirements respected and include additional but unknown fields (unknown fields should not be stored)', function(done) {
    
    var planet = new PlanetModel();
    planet.name = 'Mercury2TEST';
    planet.e = 'b';
    planet.c = 1;
    planet.h = 'nn';
    
    planet.save(function(err) {
  
      PlanetModel.findOne({ name: 'Mercury2TEST' }, function(err, obj) {
  
        expect(err).to.equal(null);
        
        try {
          // w/o mongoose interaction,
          // convert to plain json obj
          var objJsonStr = JSON.stringify(obj);
          var objJson = JSON.parse(objJsonStr);
          assert.equal(objJson.name, 'Mercury2TEST');
          // check that unknown fields were not stored
          assert.equal(objJson.e, undefined);
          assert.equal(objJson.c, undefined);
          assert.equal(objJson.h, undefined);
        } catch(err) {
          assert.fail('unexpected error during testing');
        }
  
        // clean up
        PlanetModel.deleteOne( { name: 'Mercury2TEST' }, function(err, result) {} );
        
        done();
        
      });
  
    });
    
  });

});