'use strict';

var mongoose = require('mongoose');

// define schema
var PlanetSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

// moon can not exist w/o planet;
// cascade-delete related moons, if delete of planet occurs
var MoonModel = require('./moon');
// middleware, hook 'pre', called when 'remove' is called on planet; 
// it says: "on delete of planet cascade-delete related moons"
PlanetSchema.pre('remove', function(next) {
  //console.log('Cascade-delete of related moons (documents of collection \'moon\') has been triggerred. In case there are any moons referring to this planet, they are deleted now.');
  MoonModel.deleteMany({ satelliteOf_id: this._id }, next);
});

var collectionName = 'planets';
// compile schema to model
var PlanetModel = mongoose.model('Planet', PlanetSchema, collectionName);

module.exports = PlanetModel;