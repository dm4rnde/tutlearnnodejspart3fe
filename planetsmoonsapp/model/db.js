'use strict';

var mongoose = require('mongoose');

// make a connection
var options = { user: 'rwufpmdbyy8', pass: '5e3E&zcWqpeP-r', useNewUrlParser: true, useCreateIndex: true };
var dbname = 'planetsmoonsdbdev';
if ( process.env.NODE_ENV == 'production' ) {
  dbname = 'planetsmoonsdb';
}
var conn_str = 'mongodb://localhost:27017/' + dbname;
mongoose.connect(conn_str, options);

// get reference to database
var db = mongoose.connection;

db.on('error', function(err) {
  var err_str = '\n[\n' +
  'ERROR! Can\'t connect to DB - app abruptly exited! Full error message: \n-----\n' +
  '' + err + '\n-----\n' +
  'Suggested solution: 1) verify that database server is up; 2) verify that credentials are valid.\n' + 
  ']\n';
  
  console.error(err_str);
	
  // this must abruptly end whole process;
  // as w/o db cannot use functionality
  process.exit(1);
})

module.exports = db;