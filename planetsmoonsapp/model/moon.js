'use strict';

var mongoose = require('mongoose');

// define schema
var MoonSchema = mongoose.Schema({
  name: { type: String, required: true },
  diam: Number,
  discoveredBy: String,
  satelliteOf_id: { type: mongoose.Schema.Types.ObjectId, required: true }
});
// over satellite, name must be unique
MoonSchema.index({ satelliteOf_id: 1, name: 1 }, { unique: true });

var collectionName = 'moons';
// compile schema to model
var MoonModel = mongoose.model('Moon', MoonSchema, collectionName);

module.exports = MoonModel;