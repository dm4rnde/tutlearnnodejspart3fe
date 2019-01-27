'use strict';

const guardingprecondition = require('../env_verify_run_before_tests.js');

const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../../app.js');

var PlanetModel = require('../../model/planet');
var MoonModel = require('../../model/moon');
var mongoose = require('mongoose');

describe('API unknown endpoint /nonexistent1', function() {

  this.timeout(5000);

  before(function() {
  });

  after(function() {
  });

  // - R - -

  it('GET should return 404', function(done) {
    
    // prepare starts here
    var planet = new PlanetModel();
    planet.name = 'EarthAbcde1111aTEST';
    planet.save(function(err) {
      expect(err).to.equal(null);
    });
    // prepare ends here
    
    chai.request(app)
    .get('/nonexistent1')
    .then(function(res) {
      expect(res).to.have.status(404);
    })
    .then(function(res) {
      // clean up starts here
      PlanetModel.deleteOne( { name: 'EarthAbcde1111aTEST' }, function(err, result) {} );
      // clean up ends here
      done();
    })
    .catch(function(err) {
      // clean up starts here
      PlanetModel.deleteOne( { name: 'EarthAbcde1111aTEST' }, function(err, result) {} );
      // clean up ends here
      done();
      throw err;
    });
    
  });
  
  // C - - -

  it('POST should return 404', function(done) {
    // prepare starts here
    var planet = new PlanetModel();
    planet.name = 'SaturnTESTp11aa';
    
    planet.save(function(err) {
    
      expect(err).to.equal(null);
      
      // prepare ends here
      
      chai.request(app)
      .post('/nonexistent1')
      .send({
        name: 'SaturnTESTp11aa'
      })
      .then(function(res) {
        expect(res).to.have.status(404);
      })
      .then(function(res) {
        // clean up starts here
        PlanetModel.deleteOne( { name: 'SaturnTESTp11aa' }, function(err, result) {} );
        // clean up ends here
        done();
      })
      .catch(function(err) {
        // clean up starts here
        PlanetModel.deleteOne( { name: 'SaturnTESTp11aa' }, function(err, result) {} );
        // clean up ends here
        done();
        throw err;
      });
    
    });
    
  });

  // - - U -

  it('PUT should return 404', function(done) {
    
    // prepare starts here
    var planet = new PlanetModel();
    planet.name = 'SaturnTESTp11bb';
    
    planet.save(function(err) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'SaturnTESTp11bb' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        // prepare ends here
        
        chai.request(app)
        .put('/nonexistent1')
        .send({
          name: 'SaturnTESTp11bbEdit'
        })
        .then(function(res) {
          expect(res).to.have.status(404);
        })
        .then(function(res) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'SaturnTESTp11bbEdit' }, function(err, result) {} );
          PlanetModel.deleteOne( { name: 'SaturnTESTp11bb' }, function(err, result) {} );
          // clean up ends here
          done();
        })
        .catch(function(err) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'SaturnTESTp11bbEdit' }, function(err, result) {} );
          PlanetModel.deleteOne( { name: 'SaturnTESTp11bb' }, function(err, result) {} );
          // clean up ends here
          done();
          throw err;
        });
          
      });
      
    });
    
  });

  // - - - D

  it('DELETE should return 404', function(done) {
    
    // prepare starts here
    var planet = new PlanetModel();
    planet.name = 'SaturnTESTp11cc';
    
    planet.save(function(err) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'SaturnTESTp11cc' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        // prepare ends here

        chai.request(app)
        .delete('/nonexistent1')
        .then(function(res) {
          expect(res).to.have.status(404);
        })
        .then(function(res) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'SaturnTESTp11cc' }, function(err, result) {} );
          // clean up ends here
          done();
        })
        .catch(function(err) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'SaturnTESTp11cc' }, function(err, result) {} );
          // clean up ends here
          done();
          throw err;
        });
          
      });
      
    });
    
  });

});
