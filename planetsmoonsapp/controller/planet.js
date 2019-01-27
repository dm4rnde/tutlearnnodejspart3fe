'use strict';

var mongoose = require('mongoose');
var PlanetModel = require('../model/planet');
var MoonModel = require('../model/moon');
var Db = require('../model/db');

var helpr = require('./helper');

var express = require('express');
var router = express.Router();

// GET planets (all of them)

// response body (list of JSONs): [...]
router.get('/', function(req, res) {
  var operation = helpr.READ_OPERATION;
  
  PlanetModel.find({ }, function(err, pls) {
    if ( err ) {
      return res.status(501).send({ error: helpr.errFeedbackMsgConstruct(operation, err) });
    }
    var alist = [];
    pls.forEach(function(pl) {
      alist.push(pl);
    });
    res.status(200).json(alist);
  });
});

// must be present, otherwise will not 
// recognize the body part as json
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// CREATE a planet

// response body (on success): empty
// response status code (on success): 201
router.post('/', function(req, res, next) {
  var operation = helpr.CREATE_OPERATION;
  
  if ( req.is('application/json') ) {
     
    // in case json sent empty, return right away
    if( JSON.stringify(req.body) === '{}' ){
      return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation, 'Json empty.') });
    }

    var planet = new PlanetModel();
    planet.name = req.body.name;

    planet.save(function(err) {

      if ( err ) {
        // construct specific response text
        if ( typeof(err.code) != 'undefined' && err.code === 11000 ) {
          return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation, '\'Planet\' with given \'name\' already exists.') });
        }
        return res.status(501).send({ error: helpr.errFeedbackMsgConstruct(operation, err) });
      }
      return res.status(201).send();
      
    });
     
  } else {
    return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation, 'Json expected.') });
  }
});

// UPDATE a planet

// response body (on success): planet w/ updated data
// response status code (on success): 200
router.put('/:planetid', function(req, res, next) {
  var operation = helpr.UPDATE_OPERATION;
  
  if ( req.is('application/json') ) {
    
    // in case json sent empty, return right away
    if( JSON.stringify(req.body) === '{}' ){
      return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation, 'Json expected.') });
    }

    PlanetModel.findOneAndUpdate( { '_id': req.params.planetid }, req.body, {useFindAndModify: false, new: true}, function(err, updtPlt){
      // sets useFindAndModify: false, to avoid following warning:
      // DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, ...
      // [https://stackoverflow.com/a/52572958]
      if ( err ) {
        if ( typeof(err.code) != 'undefined' && err.code === 66 ) {
          return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation,  err.errmsg) });
        }
        return res.status(501).send({ error: helpr.errFeedbackMsgConstruct(operation, err) });
      }
      if ( updtPlt == null ) {
        return res.status(404).send({ error: helpr.errFeedbackMsgConstruct(operation, 'No resource exists with provided id.') });
      }

      res.status(200).json(updtPlt);
    });
     
  } else {
    return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation, 'Json expected.') });
  }
});
  
// DELETE a planet

// response body (on success): empty
// response status code (on success): 204
router.delete('/:planetid', function(req, res, next) {
  var operation = helpr.DELETE_OPERATION;
  
  PlanetModel.findOne( { '_id': req.params.planetid }, function(err, plt){
    if ( err ) {
      return res.status(501).send({ error: helpr.errFeedbackMsgConstruct(operation, err) });
    }
    if ( plt == null ) {
      return res.status(404).send({ error: helpr.errFeedbackMsgConstruct(operation, 'No resource exists with provided id.') });
    }
    plt.remove(function(err, product) {
      if ( err ) {
        return res.status(501).send({ error: helpr.errFeedbackMsgConstruct(operation, err) });
      }
      return res.status(204).send();
    });
  });
});


// WARNING ! Following are operations related to resources 'moons'.
//    They are here because they will have route /planet/ in 
//    their route (route starts w/ /planet/)
//    because they are strongly related to 'planet'.
//  Yes, this does not sound perfect solution (as one would 
//  like to have all 'moon' related routes in separate file), 
//  but this is how this solution is designed and how 'Routes' 
//  middleware allows (if to do according to usual way, at least). 
//  Consider it good enough solution.


// GET moons (of certain planet)

// response body (list of JSONs): [...]
router.get('/:planetid/moons', function(req, res) {
  var operation = helpr.READ_OPERATION;
  
  PlanetModel.findOne({ '_id': req.params.planetid }, function(err, pl) {
    // first need to verify that such planet exists
    
    if ( err ) {
      return res.status(501).send({ error: helpr.errFeedbackMsgConstruct(operation, err) });
    }
    if( pl == null ){
      return res.status(404).send({ error: helpr.errFeedbackMsgConstruct(operation, 'No resource exists with provided id.') });
    }
    
    MoonModel.find({ 'satelliteOf_id': req.params.planetid }, function(err, mns) {
      if ( err ) {
        return res.status(501).send({ error: helpr.errFeedbackMsgConstruct(operation, err) });
      }
      if ( mns == null ) {
        return res.status(404).send({ error: helpr.errFeedbackMsgConstruct(operation, 'No resource exists with provided id.') });
      }
      var alist = [];
      mns.forEach(function(mn) {
        alist.push(mn);
      });
      res.status(200).json(alist);
    });

  });
});

// CREATE a moon

// response body (on success): empty
// response status code (on success): 201
router.post('/:planetid/moons', function(req, res, next) {
  var operation = helpr.CREATE_OPERATION;
  
  if ( req.is('application/json') ) {
     
    if( JSON.stringify(req.body) === '{}' ){
      return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation, 'Json empty.') });
    }
    
    if ( req.body.satelliteOf_id ) {
      var err_msg = 'No need to provide satelliteOf_id value, as it would be taken from URL.';
      return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation, err_msg) });
    }
    
    PlanetModel.findOne({ '_id': req.params.planetid }, function(err, pl) {
      // first need to verify that such planet exists
      
      if ( err ) {
        return res.status(501).send({ error: helpr.errFeedbackMsgConstruct(operation, err) });
      }
      if( pl == null ) {
        return res.status(404).send({ error: helpr.errFeedbackMsgConstruct(operation, 'No resource exists with provided id.') });
      }
      
      var moon = new MoonModel();
      moon.name = req.body.name;
      moon.diam = req.body.diam; 
      moon.discoveredBy = req.body.discoveredBy;
      moon.satelliteOf_id = req.params.planetid;
      
      moon.save(function(err) {
        if ( err ) {
          if ( typeof(err.code) != 'undefined' && err.code === 11000 ) {
            return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation, '\'Moon\' with given \'name\' (for given planet) already exists.') });
          }
          return res.status(501).send({ error: helpr.errFeedbackMsgConstruct(operation, err) });
        }
        return res.status(201).send();
      });

    });
     
  } else {
    return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation, 'Json expected.') });
  }
});


module.exports = router;