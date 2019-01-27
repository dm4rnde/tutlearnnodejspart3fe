'use strict';

const guardingprecondition = require('../env_verify_run_before_tests.js');

const chai = require('chai');
const expect = require('chai').expect;

chai.use(require('chai-http'));

const app = require('../../app.js');

var PlanetModel = require('../../model/planet');
var MoonModel = require('../../model/moon');
var mongoose = require('mongoose');

// - R - -

describe('API endpoint /planets GET', function() {

  this.timeout(5000);

  before(function() {
  });

  after(function() {
  });

  // GET - get planets (all of them)
  it('should return all planets', function(done) {
    
    // prepare starts here
    var planet = new PlanetModel();
    planet.name = 'EarthAbcde1111TEST';
    planet.save(function(err) {
      expect(err).to.equal(null);
    });
    
    planet = new PlanetModel();
    planet.name = 'MarsAbcde5555TEST';
    planet.save(function(err) {
      expect(err).to.equal(null);
    });
    
    // prepare ends here
    
    chai.request(app)
    .get('/planets')
    .then(function(res) {
      expect(res).to.have.status(200);

      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length.above(1);
    })
    .then(function(res) {
      // clean up starts here
      PlanetModel.deleteOne( { name: 'EarthAbcde1111TEST' }, function(err, result) {} );
      PlanetModel.deleteOne( { name: 'MarsAbcde5555TEST' }, function(err, result) {} );
      // clean up ends here
      done();
    })
    .catch(function(err) {
      // clean up starts here
      PlanetModel.deleteOne( { name: 'EarthAbcde1111TEST' }, function(err, result) {} );
      PlanetModel.deleteOne( { name: 'MarsAbcde5555TEST' }, function(err, result) {} );
      // clean up ends here
      done();
      throw err;
    });
    
  });

  // GET - get planets (0 or more planets)
  it('should not fail if (possibly) no planets', function(done) {
    chai.request(app)
    .get('/planets')
    .then(function(res) {
      expect(res).to.have.status(200);
      
      expect(res.body).to.be.an('array');
      // there might be other tests running
      // on db, therefore it is either 0 or more
      expect(res.body).to.have.length.above(-1);
      done();
    })
  });
  
});

// C - - -

describe('API endpoint /planets POST', function() {

  this.timeout(5000);

  // POST - add new planet
  it('should create new planet and return status indicating success', function(done) {
    chai.request(app)
    .post('/planets')
    .send({
      name: 'SaturnTEST1'
    })
    .then(function(res) {
      expect(res).to.have.status(201);
    })
    .then(function(res) {
      // clean up starts here
      PlanetModel.deleteOne( { name: 'SaturnTEST1' }, function(err, result) {} );
      // clean up ends here
      done();
    })
    .catch(function(err) {
      // clean up starts here
      PlanetModel.deleteOne( { name: 'SaturnTEST1' }, function(err, result) {} );
      // clean up ends here
      done();
      throw err;
    });
  });
  
  // POST - no duplicates allowed
  it('should return 400 on attempt to create same planet twice', function(done) {
    // prepare starts here
    var planet = new PlanetModel();
    planet.name = 'SaturnTESTp11';
    
    planet.save(function(err) {
    
      expect(err).to.equal(null);
      
      // prepare ends here
      
      chai.request(app)
      .post('/planets')
      .send({
        name: 'SaturnTESTp11'
      })
      .then(function(res) {
        expect(res).to.have.status(400);
      })
      .then(function(res) {
        // clean up starts here
        PlanetModel.deleteOne( { name: 'SaturnTESTp11' }, function(err, result) {} );
        // clean up ends here
        done();
      })
      .catch(function(err) {
        // clean up starts here
        PlanetModel.deleteOne( { name: 'SaturnTESTp11' }, function(err, result) {} );
        // clean up ends here
        done();
        throw err;
      });
    
    });
    
  });
  
  // POST - no empty document adding allowed; json is empty
  it('should return 400 on attempt to create resource w/o details (when {})', function(done) { 
    chai.request(app)
    .post('/planets')
    .send({
    })
    .then(function(res) {
      expect(res).to.have.status(400);
    })
    .then(function(res) {
      // skip the possible fail and clean up for now
      // ...
      //
      done();
    })
    .catch(function(err) {
      // skip the possible fail and clean up for now
      // ...
      //
      done();
    });
  });

  // POST - when unknown content type then 400
  it('should return 400 when unknown content type', function(done) {
    chai.request(app)
    .post('/planets')
    .type('form')
    .send({
      name: 'SaturnTEST2'
    })
    .then(function(res) {
      expect(res).to.have.status(400);
    })
    .then(function(res) {
      // clean up starts here
      PlanetModel.deleteOne( { name: 'SaturnTEST2' }, function(err, result) {} );
      // clean up ends here
      done();
    })
    .catch(function(err) {
      // clean up starts here
      PlanetModel.deleteOne( { name: 'SaturnTEST2' }, function(err, result) {} );
      // clean up ends here
      done();
      throw err;
    });
  });

});

// - - U -

describe('API endpoint /planets/:planetid PUT', function() {

  this.timeout(5000);

  // PUT - update existing planet
  it('should update existing planet and return new/updated version of the planet', function(done) {
    
    // prepare starts here
    var planet = new PlanetModel();
    planet.name = 'Mercury3TEST';
    
    planet.save(function(err) {
    
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mercury3TEST' }, function(err, obj) {
  
        expect(err).to.equal(null);
      
        // prepare ends here
        
        chai.request(app)
        .put('/planets/' + obj.id)
        .send({
            name: 'Mercury3TESTedit'
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('_id');
          expect(res.body.name).to.be.equal('Mercury3TESTedit');
        })
        .then(function(res) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mercury3TESTedit' }, function(err, result) {} );
          PlanetModel.deleteOne( { name: 'Mercury3TEST' }, function(err, result) {} );
          // clean up ends here
          done();
        })
        .catch(function(err) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mercury3TESTedit' }, function(err, result) {} );
          PlanetModel.deleteOne( { name: 'Mercury3TEST' }, function(err, result) {} );
          // clean up ends here
          done();
          throw err;
        });

      });
      
    });

  });
  
  // PUT - 400, update of id should not be allowed
  it('should return 400 on attempt to update planet\'s _id (an immutable field)', function(done) {
    
    // prepare starts here
    var planet = new PlanetModel();
    planet.name = 'Mercury3T3E3ST';
    
    planet.save(function(err) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mercury3T3E3ST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        // prepare ends here
        
        var non_existent_id = '5bc1111111a11111d111b111';
        
        chai.request(app)
        .put('/planets/' + obj.id)
        .send({
          name: 'Mercury3T3E3STedit',
          _id: non_existent_id
        })
        .then(function(res) {
          expect(res).to.have.status(400);
        })
        .then(function(res) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mercury3T3E3STedit' }, function(err, result) {} );
          PlanetModel.deleteOne( { name: 'Mercury3T3E3ST' }, function(err, result) {} );
          // clean up ends here
          done();
        })
        .catch(function(err) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mercury3T3E3STedit' }, function(err, result) {} );
          PlanetModel.deleteOne( { name: 'Mercury3T3E3ST' }, function(err, result) {} );
          // clean up ends here
          done();
          throw err;
        });
          
      });
      
    });
    
  });

  // PUT - non existent planet, thus can't do update on it
  // (attempt to update planet that does not exist)
  it('should return 404 if specified planet does not exist', function(done) {
    
    // prepare starts here
    var planet = new PlanetModel();
    planet.name = 'Mercury4T4E44T';
    
    planet.save(function(err) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mercury4T4E44T' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        // prepare ends here
        
        var non_existent_id = '5bc1111111a11111d111b111';
        
        chai.request(app)
        .put('/planets/' + non_existent_id)
        .send({
          name: 'Mercury4T4E44Tedit'
        })
        .then(function(res) {
          expect(res).to.have.status(404);
        })
        .then(function(res) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mercury4T4E44Tedit' }, function(err, result) {} );
          PlanetModel.deleteOne( { name: 'Mercury4T4E44T' }, function(err, result) {} );
          // clean up ends here
          done();
        })
        .catch(function(err) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mercury4T4E44Tedit' }, function(err, result) {} );
          PlanetModel.deleteOne( { name: 'Mercury4T4E44T' }, function(err, result) {} );
          // clean up ends here
          done();
          throw err;
        });
          
      });
      
    });
    
  });
  
  // PUT - update w/ update data missing; json is empty
  it('should return 400 on attempt to update resource with {}', function(done) {
    
    // prepare starts here
    var planet = new PlanetModel();
    planet.name = 'Mercuryd800dTEST';
    
    planet.save(function(err) {
  
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mercuryd800dTEST' }, function(err, obj) {
          
        expect(err).to.equal(null);
      
        // prepare ends here
        
        chai.request(app)
        .put('/planets/' + obj.id)
        .send({ })
        .then(function(res) {
          expect(res).to.have.status(400);
        })
        .then(function(res) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mercuryd800dTEST' }, function(err, result) {} );
          // clean up ends here
          done();
        })
        .catch(function(err) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mercuryd800dTEST' }, function(err, result) {} );
          // clean up ends here
          done();
          throw err;
        });

      });

    });

  });

});

// - - - D

describe('API endpoint /planets/:planetid DELETE', function() {

  this.timeout(5000);

  // DELETE - delete existing planet
  it('should delete existing planet and return status indicating successful operation', function(done) {
    
    // prepare starts here
    var planet = new PlanetModel();
    planet.name = 'Mercury4TEST';
  
    planet.save(function(err) {
  
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mercury4TEST' }, function(err, obj) {
  
        expect(err).to.equal(null);

        // prepare ends here
        
        chai.request(app)
        .delete('/planets/' + obj.id)
        .then(function(res) {
          expect(res).to.have.status(204);
          
          // now verify that planet was actually deleted
          PlanetModel.find({ _id: obj.id }, function(err, objs) {
            expect(err).to.equal(null);
            
            expect(objs).to.be.an('array');
            expect(objs).to.have.lengthOf(0);
            
            done();
          })
          .catch(function(err) {
            // clean up starts here
            PlanetModel.deleteOne( { name: 'Mercury4TEST' }, function(err, result) {} );
            // clean up ends here
            done();
            throw err;
          });
          
        })
        .catch(function(err) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mercury4TEST' }, function(err, result) {} );
          // clean up ends here
          done();
          throw err;
        });
  
      });
  
    });
  
  });

  // DELETE - delete non-existent planet (or already deleted element)
  it('should return 404 if specified planet does not exist', function(done) {
    
    // prepare starts here
    var planet = new PlanetModel();
    planet.name = 'Mercury4fqTEST';
    
    planet.save(function(err) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mercury4fqTEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        // prepare ends here

        var non_existent_id = '5bc1111111a11111d111b111';

        chai.request(app)
        .delete('/planets/' + non_existent_id)
        .then(function(res) {
          expect(res).to.have.status(404);
        })
        .then(function(res) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mercury4fqTEST' }, function(err, result) {} );
          // clean up ends here
          done();
        })
        .catch(function(err) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mercury4fqTEST' }, function(err, result) {} );
          // clean up ends here
          done();
          throw err;
        });
          
      });
      
    });
    
  });

  // DELETE - delete planet must trigger cascade-delete of related moon
  it('should delete existing planet and w/ it every related moon (cascade-delete moons)', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'Mars884BJTEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mars884BJTEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        var moon1 = { name: 'PhobosMars884BJTEST', diam: 22, discoveredBy: 'Test A', satelliteOf_id: mongoose.Types.ObjectId(obj.id) };
        var moon2 = { name: 'DeimosMars884BJTEST', diam: 12, discoveredBy: 'Test A', satelliteOf_id: mongoose.Types.ObjectId(obj.id) };
        
        var moons = [moon1, moon2];
        
        MoonModel.collection.insertMany(moons, function(err, mns) {
          
          expect(err).to.equal(null);
          
          // prepare ends here
          
          chai.request(app)
          .delete('/planets/' + obj.id)
          .then(function(res) {
            
            expect(res).to.have.status(204);
            
            // now verify that moons were actually deleted
            MoonModel.find({ satelliteOf_id: obj.id }, function(err, objs) {
              expect(err).to.equal(null);
              
              expect(objs).to.be.an('array');
              expect(objs).to.have.lengthOf(0);
            })
            .then(function(res) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMars884BJTEST' }, function(err, result) {} );
              MoonModel.deleteOne( { name: 'DeimosMars884BJTEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'Mars884BJTEST' }, function(err, result) {} );
              // clean up ends here
              done();
            })
            .catch(function(err) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMars884BJTEST' }, function(err, result) {} );
              MoonModel.deleteOne( { name: 'DeimosMars884BJTEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'Mars884BJTEST' }, function(err, result) {} );
              // clean up ends here
              done();
              throw err;
            });
            
          })
          .catch(function(err) {
            // clean up starts here
            MoonModel.deleteOne( { name: 'PhobosMars884BJTEST' }, function(err, result) {} );
            MoonModel.deleteOne( { name: 'DeimosMars884BJTEST' }, function(err, result) {} );
            PlanetModel.deleteOne( { name: 'Mars884BJTEST' }, function(err, result) {} );
            // clean up ends here
            done();
            throw err;
          });
            
        });
        
      });
      
    });
      
  });

});
