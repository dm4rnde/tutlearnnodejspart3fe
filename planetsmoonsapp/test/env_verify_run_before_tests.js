'use strict';

// precondition must be met; this is to avoid 
// running tests on prod env and making 
// changes on prod database accidentally

var env_is_correct = ( process.env.NODE_ENV == 'development') ;

if ( !env_is_correct ) {
  var err_str = '[\n' +
  ' ERROR! Env variable NODE_ENV mismatch - no test can run!\n' +
  '\t1) If your env is prod, then these tests should not be run anyhow!\n' +
  '\t2) If your env is dev, then you have forgot to set NODE_ENV.\n' + 
  '\t   If so, to fix this, exec:\n\n' +
  '\t\texport NODE_ENV=development\n\n' + 
  '\t   (then it should be possible to run the tests).\n' +
  ']';
  
  console.error(err_str);
  // this must abruptly end whole process
  process.exit(1);
}