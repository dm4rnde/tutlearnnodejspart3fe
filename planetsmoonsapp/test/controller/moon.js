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

describe('API endpoint /moons/:moonid GET', function() {

  this.timeout(5000);

  before(function() {
  });

  after(function() {
  });

  // GET - get specific (ONE) moon
  it('should return specific moon', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'MarsRR1TEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'MarsRR1TEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        var moons = [{ name: 'PhobosMarsRR1TEST', diam: 22, discoveredBy: 'A. Hall', satelliteOf_id: mongoose.Types.ObjectId(obj.id) },
          { name: 'DeimosMarsRR1TEST', diam: 12, discoveredBy: 'A. Hall', satelliteOf_id: mongoose.Types.ObjectId(obj.id) }];
        
        MoonModel.collection.insertMany(moons, function(err, mns) {
          
          expect(err).to.equal(null);

          MoonModel.findOne({ name: 'DeimosMarsRR1TEST' }, function(err, obj) {
            
            expect(err).to.equal(null);

            // prepare ends here

            chai.request(app)
            .get('/moons/' + obj.id)
            .then(function(res) {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.include({ name: 'DeimosMarsRR1TEST', diam: 12, discoveredBy: 'A. Hall', satelliteOf_id: obj.satelliteOf_id.toString() });
            })
            .then(function(res) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMarsRR1TEST' }, function(err, result) {} );
              MoonModel.deleteOne( { name: 'DeimosMarsRR1TEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'MarsRR1TEST' }, function(err, result) {} );
              // clean up ends here
              done();
            })
            .catch(function(err) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMarsRR1TEST' }, function(err, result) {} );
              MoonModel.deleteOne( { name: 'DeimosMarsRR1TEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'MarsRR1TEST' }, function(err, result) {} );
              // clean up ends here
              done();
              throw err;
            });

          });
          
        });
        
      });
      
    });
      
  });
  
  // GET - if no resource exists w/ provided id, return 404
  it('should return 404 if specified moon does not exist', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'Mercury8TEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mercury8TEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        var moon = new MoonModel();
        moon.name = 'Mercury8TESTmoonTEST';
        moon.diam = 3475;
        moon.satelliteOf_id = mongoose.Types.ObjectId(obj.id);
        
        moon.save(function(err) {
          
          MoonModel.findOne({ name: 'Mercury8TESTmoonTEST', satelliteOf_id: obj.id }, function(err, obj) {
            
            expect(err).to.equal(null);
            
            // prepare ends here
            
            var non_existent_id = '5bc1111111a11111d111b111';
            
            chai.request(app)
            .get('/moons/' + non_existent_id)
            .then(function(res) {
              expect(res).to.have.status(404);
            })
            .then(function(res) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'Mercury8TESTmoonTEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'Mercury8TEST' }, function(err, result) {} );
              // clean up ends here
              done();
            })
            .catch(function(err) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'Mercury8TESTmoonTEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'Mercury8TEST' }, function(err, result) {} );
              // clean up ends here
              done();
              throw err;
            });
            
          });
          
        });
        
      });
      
    });
    
  });
      
});

describe('API endpoint /planets/:planetid/moons GET', function() {
  
  this.timeout(5000);
  
  before(function() {
  });
  
  after(function() {
  });
  
  // GET - get moons of the planet
  it('should return moons of specified planet', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'Mars22TEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mars22TEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        var moons = [{ name: 'PhobosMars22TEST', diam: 22, discoveredBy: 'A. Hall', satelliteOf_id: mongoose.Types.ObjectId(obj.id) },
          { name: 'DeimosMars22TEST', diam: 12, discoveredBy: 'A. Hall', satelliteOf_id: mongoose.Types.ObjectId(obj.id) }];
        
        MoonModel.collection.insertMany(moons, function(err, mns) {
          
          expect(err).to.equal(null);
          
          // prepare ends here

          chai.request(app)
          .get('/planets/' + obj.id + '/moons')
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(2);
            
            if ( res.body[0].name == 'PhobosMars22TEST' ) {
              expect(res.body[0]).to.include({name: 'PhobosMars22TEST', diam: 22, discoveredBy: 'A. Hall', satelliteOf_id: obj.id});
            } else {
              expect(res.body[0]).to.include({name: 'DeimosMars22TEST', diam: 12, discoveredBy: 'A. Hall', satelliteOf_id: obj.id});
            }
            if ( res.body[1].name == 'DeimosMars22TEST' ) {
              expect(res.body[1]).to.include({name: 'DeimosMars22TEST', diam: 12, discoveredBy: 'A. Hall', satelliteOf_id: obj.id});
            } else {
              expect(res.body[1]).to.include({name: 'PhobosMars22TEST', diam: 22, discoveredBy: 'A. Hall', satelliteOf_id: obj.id});
            }
            
          })
          .then(function(res) {
            // clean up starts here
            MoonModel.deleteOne( { name: 'PhobosMars22TEST' }, function(err, result) {} );
            MoonModel.deleteOne( { name: 'DeimosMars22TEST' }, function(err, result) {} );
            PlanetModel.deleteOne( { name: 'Mars22TEST' }, function(err, result) {} );
            // clean up ends here
            done();
          })
          .catch(function(err) {
            // clean up starts here
            MoonModel.deleteOne( { name: 'PhobosMars22TEST' }, function(err, result) {} );
            MoonModel.deleteOne( { name: 'DeimosMars22TEST' }, function(err, result) {} );
            PlanetModel.deleteOne( { name: 'Mars22TEST' }, function(err, result) {} );
            // clean up ends here
            done();
            throw err;
          });
          
        });
        
      });
      
    });
      
  });

  // GET - non existent planet, thus can't have moons
  it('should return 404 if specified planet does not exist', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'Mars22bbTEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mars22bbTEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        var moons = [{ name: 'PhobosMars22bbTEST', diam: 22, discoveredBy: 'A. Hall', satelliteOf_id: mongoose.Types.ObjectId(obj.id) },
          { name: 'DeimosMars22bbTEST', diam: 12, discoveredBy: 'A. Hall', satelliteOf_id: mongoose.Types.ObjectId(obj.id) }];
        
        MoonModel.collection.insertMany(moons, function(err, mns) {
          
          expect(err).to.equal(null);
          
          // prepare ends here
          
          var non_existent_id = '5bc1111111a11111d111b111';
          
          chai.request(app)
          .get('/planets/' + non_existent_id + '/moons')
          .then(function(res) {
            expect(res).to.have.status(404);
          })
          .then(function(res) {
            // clean up starts here
            MoonModel.deleteOne( { name: 'PhobosMars22bbTEST' }, function(err, result) {} );
            MoonModel.deleteOne( { name: 'DeimosMars22bbTEST' }, function(err, result) {} );
            PlanetModel.deleteOne( { name: 'Mars22bbTEST' }, function(err, result) {} );
            // clean up ends here
            done();
          })
          .catch(function(err) {
            // clean up starts here
            MoonModel.deleteOne( { name: 'PhobosMars22bbTEST' }, function(err, result) {} );
            MoonModel.deleteOne( { name: 'DeimosMars22bbTEST' }, function(err, result) {} );
            PlanetModel.deleteOne( { name: 'Mars22bbTEST' }, function(err, result) {} );
            // clean up ends here
            done();
            throw err;
          });
          
        });
        
      });
      
    });
      
  });
  
});

// C - - -

describe('API endpoint /planets/:planetid/moons POST', function() {

  this.timeout(5000);

  before(function() {
  });

  after(function() {
  });

  // POST - add new moon
  it('should create new moon and return status indicating success', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'Mars55ccTEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mars55ccTEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        // prepare ends here
        
        var moon = { name: 'PhobosMars55ccTEST', diam: 22, discoveredBy: 'A. Hall' };
        
        chai.request(app)
        .post('/planets/' + obj.id + '/moons')
        .send(moon)
        .then(function(res) {
          expect(res).to.have.status(201);
        })
        .then(function(res) {
          // clean up starts here
          MoonModel.deleteOne( { name: 'PhobosMars55ccTEST' }, function(err, result) {} );
          PlanetModel.deleteOne( { name: 'Mars55ccTEST' }, function(err, result) {} );
          // clean up ends here
          done();
        })
        .catch(function(err) {
          // clean up starts here
          MoonModel.deleteOne( { name: 'PhobosMars55ccTEST' }, function(err, result) {} );
          PlanetModel.deleteOne( { name: 'Mars55ccTEST' }, function(err, result) {} );
          // clean up ends here
          done();
          throw err;
        });
      
      });

    });
    
  });

  // POST - no duplicates allowed
  it('should return 400 on attempt to create same moon twice', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'Mars1cc111TEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mars1cc111TEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        var moon1 = { name: 'PhobosMars1cc111TEST', diam: 22, discoveredBy: 'A. Hall', satelliteOf_id: mongoose.Types.ObjectId(obj.id) };
        
        var moons = [moon1];
        
        MoonModel.collection.insertMany(moons, function(err, mns) {
          
          expect(err).to.equal(null);
          
          // prepare ends here
          
          var moon2 = { name: 'PhobosMars1cc111TEST', diam: 22, discoveredBy: 'A. Hall' }
            
          chai.request(app)
          .post('/planets/' + obj.id + '/moons')
          .send(moon2)
          .then(function(res) {
            expect(res).to.have.status(400);
          })
          .then(function(res) {
            // clean up starts here
            MoonModel.deleteOne( { name: 'PhobosMars1cc111TEST' }, function(err, result) {} );
            PlanetModel.deleteOne( { name: 'Mars1cc111TEST' }, function(err, result) {} );
            // clean up ends here
            done();
          })
          .catch(function(err) {
            // clean up starts here
            MoonModel.deleteOne( { name: 'PhobosMars1cc111TEST' }, function(err, result) {} );
            PlanetModel.deleteOne( { name: 'Mars1cc111TEST' }, function(err, result) {} );
            // clean up ends here
            done();
            throw err;
          });
      
        });

      });

    });
    
  });

  // POST - non existent planet, thus can't create moons for it
  it('should return 404 if specified planet does not exist', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'MarsjbRb3TEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'MarsjbRb3TEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        var moons = [{ name: 'PhobosMarsjbRb3TEST', diam: 22, discoveredBy: 'A. Hall', satelliteOf_id: mongoose.Types.ObjectId(obj.id) },
          { name: 'DeimosMarsjbRb3TEST', diam: 12, discoveredBy: 'A. Hall', satelliteOf_id: mongoose.Types.ObjectId(obj.id) }];
        
        MoonModel.collection.insertMany(moons, function(err, mns) {
          
          expect(err).to.equal(null);
          
          // prepare ends here
          
          var non_existent_id = '5bc1111111a11111d111b111';
          
          chai.request(app)
          .post('/planets/' + non_existent_id + '/moons')
          .send({
            name: 'test111111111z1'
          })
          .then(function(res) {
            expect(res).to.have.status(404);
          })
          .then(function(res) {
            // clean up starts here
            MoonModel.deleteOne( { name: 'test111111111z1' }, function(err, result) {} );
            MoonModel.deleteOne( { name: 'PhobosMarsjbRb3TEST' }, function(err, result) {} );
            MoonModel.deleteOne( { name: 'DeimosMarsjbRb3TEST' }, function(err, result) {} );
            PlanetModel.deleteOne( { name: 'MarsjbRb3TEST' }, function(err, result) {} );
            // clean up ends here
            done();
          })
          .catch(function(err) {
            // clean up starts here
            MoonModel.deleteOne( { name: 'test111111111z1' }, function(err, result) {} );
            MoonModel.deleteOne( { name: 'PhobosMarsjbRb3TEST' }, function(err, result) {} );
            MoonModel.deleteOne( { name: 'DeimosMarsjbRb3TEST' }, function(err, result) {} );
            PlanetModel.deleteOne( { name: 'MarsjbRb3TEST' }, function(err, result) {} );
            // clean up ends here
            done();
            throw err;
          });
          
        });
        
      });
      
    });
      
  });

  // POST - no empty document adding allowed; json is empty
  it('should return 400 on attempt to create resource w/o details (when {})', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'Mars2bE2TEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mars2bE2TEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        // prepare ends here
        
        chai.request(app)
        .post('/planets/' + obj.id + '/moons')
        .send({
        })
        .then(function(res) {
          expect(res).to.have.status(400);
        })
        .then(function(res) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mars2bE2TEST' }, function(err, result) {} );
          // clean up ends here
          done();
        })
        .catch(function(err) {
          // clean up starts here
          PlanetModel.deleteOne( { name: 'Mars2bE2TEST' }, function(err, result) {} );
          // clean up ends here
          done();
          throw err;
        });
          
      });
      
    });
      
  });
  
  // POST - when unknown content type then 400
  it('should return 400 when unknown content type', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'MarsA1d1B1ccTEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'MarsA1d1B1ccTEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        // prepare ends here
        
        var moon = { name: 'PhobosMarsA1d1B1ccTEST', diam: 22, discoveredBy: 'A. Hall' };
        
        chai.request(app)
        .post('/planets/' + obj.id + '/moons')
        .type('form')
        .send(moon)
        .then(function(res) {
          expect(res).to.have.status(400);
        })
        .then(function(res) {
          // clean up starts here
          MoonModel.deleteOne( { name: 'PhobosMarsA1d1B1ccTEST' }, function(err, result) {} );
          PlanetModel.deleteOne( { name: 'MarsA1d1B1ccTEST' }, function(err, result) {} );
          // clean up ends here
          done();
        })
        .catch(function(err) {
          // clean up starts here
          MoonModel.deleteOne( { name: 'PhobosMarsA1d1B1ccTEST' }, function(err, result) {} );
          PlanetModel.deleteOne( { name: 'MarsA1d1B1ccTEST' }, function(err, result) {} );
          // clean up ends here
          done();
          throw err;
        });
      
      });

    });
    
  });

});

// - - U -

describe('API endpoint /moons/:moonid PUT', function() {
  
  this.timeout(5000);

  before(function() {
  });

  after(function() {
  });

  // PUT - update existing moon
  it('should update existing moon and return new/updated version of the moon', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'MarsAbc1TEST' }];
      
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'MarsAbc1TEST' }, function(err, obj) {
        
        expect(err).to.equal(null);

        var moon1 = { name: 'PhobosMarsAbc1TEST', diam: 22, discoveredBy: 'Test A', satelliteOf_id: mongoose.Types.ObjectId(obj.id) };
        
        var moons = [moon1];
        
        MoonModel.collection.insertMany(moons, function(err, mns) {
          
          expect(err).to.equal(null);
          
          MoonModel.findOne({ name: 'PhobosMarsAbc1TEST' }, function(err, obj) {
            
            expect(err).to.equal(null);

            // prepare ends here
          
            var refToPlanet = obj.satelliteOf_id.toString();
            var moonEdit = { name: 'PhobosMarsAbc1TESTedited', diam: 23 }
            
            chai.request(app)
            .put('/moons/' + obj.id)
            .send(moonEdit)
            .then(function(res) {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.include({ name: 'PhobosMarsAbc1TESTedited', diam: 23 });
              expect(res.body).to.include({ discoveredBy: 'Test A', satelliteOf_id: refToPlanet });
            })
            .then(function(res) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMarsAbc1TESTedited' }, function(err, result) {} );
              MoonModel.deleteOne( { name: 'PhobosMarsAbc1TEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'MarsAbc1TEST' }, function(err, result) {} );
              // clean up ends here
              done();
            })
            .catch(function(err) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMarsAbc1TESTedited' }, function(err, result) {} );
              MoonModel.deleteOne( { name: 'PhobosMarsAbc1TEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'MarsAbc1TEST' }, function(err, result) {} );
              // clean up ends here
              done();
              throw err;
            });

          });
      
        });

      });

    });
    
  });
  
  // PUT - 400, update of id should not be allowed
  it('should return 400 on attempt to update moon\'s _id (an immutable field)', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'MarsAbc0000TEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'MarsAbc0000TEST' }, function(err, obj) {
        
        expect(err).to.equal(null);

        var moon1 = { name: 'PhobosMarsAbc0000TEST', diam: 22, discoveredBy: 'Test A', satelliteOf_id: mongoose.Types.ObjectId(obj.id) };
        
        var moons = [moon1];
        
        MoonModel.collection.insertMany(moons, function(err, mns) {
          
          expect(err).to.equal(null);
          
          MoonModel.findOne({ name: 'PhobosMarsAbc0000TEST' }, function(err, obj) {
            
            expect(err).to.equal(null);

            // prepare ends here
          
            var non_existent_id = '5bc1111111a11111d111b111';
            var moonEdit = { name: 'PhobosMarsAbc0000TESTedited', _id: non_existent_id }

            chai.request(app)
            .put('/moons/' + obj.id)
            .send(moonEdit)
            .then(function(res) {
              expect(res).to.have.status(400);
            })
            .then(function(res) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMarsAbc0000TESTedited' }, function(err, result) {} );
              MoonModel.deleteOne( { name: 'PhobosMarsAbc0000TEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'MarsAbc0000TEST' }, function(err, result) {} );
              // clean up ends here
              done();
            })
            .catch(function(err) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMarsAbc0000TESTedited' }, function(err, result) {} );
              MoonModel.deleteOne( { name: 'PhobosMarsAbc0000TEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'MarsAbc0000TEST' }, function(err, result) {} );
              // clean up ends here
              done();
              throw err;
            });

          });
      
        });

      });

    });
    
  });

  // PUT - 400, update of id should not be allowed
  it('should return 404 if specified moon does not exist', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'Mars8ed5TEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mars8ed5TEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        var moon1 = { name: 'PhobosMars8ed5TEST', diam: 22, discoveredBy: 'Test A', satelliteOf_id: mongoose.Types.ObjectId(obj.id) };
        
        var moons = [moon1];
        
        MoonModel.collection.insertMany(moons, function(err, mns) {
          
          expect(err).to.equal(null);
          
          MoonModel.findOne({ name: 'PhobosMars8ed5TEST' }, function(err, obj) {
            
            expect(err).to.equal(null);
            
            // prepare ends here
            
            var non_existent_id = '5bc1111111a11111d111b111';
            var moonEdit = { name: 'PhobosMars8ed5TESTedited' }
            
            chai.request(app)
            .put('/moons/' + non_existent_id)
            .send(moonEdit)
            .then(function(res) {
              expect(res).to.have.status(404);
            })
            .then(function(res) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMars8ed5TESTedited' }, function(err, result) {} );
              MoonModel.deleteOne( { name: 'PhobosMars8ed5TEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'Mars8ed5TEST' }, function(err, result) {} );
              // clean up ends here
              done();
            })
            .catch(function(err) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMars8ed5TESTedited' }, function(err, result) {} );
              MoonModel.deleteOne( { name: 'PhobosMars8ed5TEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'Mars8ed5TEST' }, function(err, result) {} );
              // clean up ends here
              done();
              throw err;
            });
            
          });
          
        });
        
      });
      
    });
    
  });

  // PUT - update w/ update data missing; json is empty
  it('should return 400 on attempt to update resource with {}', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'MarsAbc1cbaTEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'MarsAbc1cbaTEST' }, function(err, obj) {
        
        expect(err).to.equal(null);

        var moon1 = { name: 'PhobosMarsAbc1cbaTEST', diam: 22, discoveredBy: 'Test A', satelliteOf_id: mongoose.Types.ObjectId(obj.id) };
        
        var moons = [moon1];
        
        MoonModel.collection.insertMany(moons, function(err, mns) {
          
          expect(err).to.equal(null);
          
          MoonModel.findOne({ name: 'PhobosMarsAbc1cbaTEST' }, function(err, obj) {
            
            expect(err).to.equal(null);

            // prepare ends here
          
            var refToPlanet = obj.satelliteOf_id.toString();
            
            chai.request(app)
            .put('/moons/' + obj.id)
            .send({})
            .then(function(res) {
              expect(res).to.have.status(400);
            })
            .then(function(res) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMarsAbc1cbaTEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'MarsAbc1cbaTEST' }, function(err, result) {} );
              // clean up ends here
              done();
            })
            .catch(function(err) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMarsAbc1cbaTEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'MarsAbc1cbaTEST' }, function(err, result) {} );
              // clean up ends here
              done();
              throw err;
            });

          });
      
        });

      });

    });
    
  });
  
  //TODO
  //satelliteOf_id should be also immutable; once set 
  //it should not be possible to change it

});

// - - - D

describe('API endpoint /moons/:moonid DELETE', function() {

  // DELETE - delete existing moon
  it('should delete existing moon and return status indicating successful operation', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'Mars9b8e6TEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'Mars9b8e6TEST' }, function(err, obj) {
        
        expect(err).to.equal(null);

        var moon1 = { name: 'PhobosMars9b8e6TEST', diam: 22, discoveredBy: 'Test A', satelliteOf_id: mongoose.Types.ObjectId(obj.id) };
        
        var moons = [moon1];
        
        MoonModel.collection.insertMany(moons, function(err, mns) {
          
          expect(err).to.equal(null);
          
          MoonModel.findOne({ name: 'PhobosMars9b8e6TEST' }, function(err, obj) {
            
            expect(err).to.equal(null);

            // prepare ends here

            chai.request(app)
            .delete('/moons/' + obj.id)
            .then(function(res) {
              expect(res).to.have.status(204);
            })
            .then(function(res) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMars9b8e6TEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'Mars9b8e6TEST' }, function(err, result) {} );
              // clean up ends here
              done();
            })
            .catch(function(err) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMars9b8e6TEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'Mars9b8e6TEST' }, function(err, result) {} );
              // clean up ends here
              done();
              throw err;
            });
      
          });

        });

      });
    
    });
    
  });

  // DELETE - delete non-existent moon (or already deleted element)
  it('should return 404 if specified moon does not exist', function(done) {
    
    // prepare starts here
    var planets = [{ name: 'MarsBJaTEST' }];
    
    PlanetModel.collection.insertMany(planets, function(err, docs) {
      
      expect(err).to.equal(null);
      
      PlanetModel.findOne({ name: 'MarsBJaTEST' }, function(err, obj) {
        
        expect(err).to.equal(null);
        
        var moon1 = { name: 'PhobosMarsBJaTEST', diam: 22, discoveredBy: 'Test A', satelliteOf_id: mongoose.Types.ObjectId(obj.id) };
        
        var moons = [moon1];
        
        MoonModel.collection.insertMany(moons, function(err, mns) {
          
          expect(err).to.equal(null);
          
          MoonModel.findOne({ name: 'PhobosMarsBJaTEST' }, function(err, obj) {
            
            expect(err).to.equal(null);
            
            // prepare ends here
            
            var non_existent_id = '5bc1111111a11111d111b111';

            chai.request(app)
            .delete('/moons/' + non_existent_id)
            .then(function(res) {
              expect(res).to.have.status(404);
            })
            .then(function(res) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMarsBJaTEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'MarsBJaTEST' }, function(err, result) {} );
              // clean up ends here
              done();
            })
            .catch(function(err) {
              // clean up starts here
              MoonModel.deleteOne( { name: 'PhobosMarsBJaTEST' }, function(err, result) {} );
              PlanetModel.deleteOne( { name: 'MarsBJaTEST' }, function(err, result) {} );
              // clean up ends here
              done();
              throw err;
            });
            
          });
          
        });
        
      });
      
    });
      
  });

});
