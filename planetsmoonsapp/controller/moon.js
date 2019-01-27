'use strict';

var mongoose = require('mongoose');

var PlanetModel = require('../model/planet');
var MoonModel = require('../model/moon');
var Db = require('../model/db');

var helpr = require('./helper');

var express = require('express');
var router = express.Router();

// GET moon (specific ONE)

// response body JSON: {...}
router.get('/:moonid', function(req, res) {
  var operation = helpr.READ_OPERATION;
  
  MoonModel.findOne({ '_id': req.params.moonid }, function(err, mn) {
    if ( err ) {
      return res.status(501).send({ error: helpr.errFeedbackMsgConstruct(operation, err) });
    }
    if ( mn == null ) {
      return res.status(404).send({ error: helpr.errFeedbackMsgConstruct(operation, 'No resource exists with provided id.') });
    }
    res.status(200).json(mn);
  });
});


// UPDATE a moon

// response body (on success): moon w/ updated data
// response status code (on success): 200
router.put('/:moonid', function(req, res, next) {
  var operation = helpr.UPDATE_OPERATION;
  
  if ( req.is('application/json') ) {

    if( JSON.stringify(req.body) === '{}' ){
      return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation, 'Json empty.') });
    }
      
    MoonModel.findOneAndUpdate( { '_id': req.params.moonid }, req.body, {useFindAndModify: false, new: true}, function(err, updtMn){
      // sets useFindAndModify: false, to avoid following warning:
      // DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, ...
      // [https://stackoverflow.com/a/52572958]
      if ( err ) {
        if ( typeof(err.code) != 'undefined' && err.code === 66 ) {
          return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation,  err.errmsg) });
        }
        return res.status(501).send({ error: helpr.errFeedbackMsgConstruct(operation, err) });
      }
      if ( updtMn == null ) {
        return res.status(404).send({ error: helpr.errFeedbackMsgConstruct(operation, 'No resource exists with provided id.') });
      }
      res.status(200).json(updtMn);
    });
     
  } else {
    return res.status(400).send({ error: helpr.errFeedbackMsgConstruct(operation, 'Json expected.') });
  }
});

// DELETE a moon

// response body (on success): empty
// response status code (on success): 204
router.delete('/:moonid', function(req, res, next) {
  var operation = helpr.DELETE_OPERATION;
  
  MoonModel.findOneAndDelete( { '_id': req.params.moonid }, function(err, dltdMn){
    if ( err ) {
      return res.status(501).send({ error: helpr.errFeedbackMsgConstruct(operation, err) });
    }
    if ( dltdMn == null ) {
      return res.status(404).send({ error: helpr.errFeedbackMsgConstruct(operation, 'No resource exists with provided id.') });
    }
    return res.status(204).send();
  });
});


module.exports = router;