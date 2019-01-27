'use strict';

module.exports = { 
  // constants
  READ_OPERATION: 'read',
  CREATE_OPERATION: 'create',
  UPDATE_OPERATION: 'update',
  DELETE_OPERATION: 'delete',
  // functions
  errFeedbackMsgConstruct: function(operation, err){
    var rsp_txt = 'Unable to ' + operation + '. ';
    rsp_txt = rsp_txt + err;
    return rsp_txt;
	}
};