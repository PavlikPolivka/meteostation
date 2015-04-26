var AppDispatcher = require('../dispatcher/AppDispatcher');
var FluxDataConstants = require('../constants/FluxDataConstants');

// Define action methods
var FluxDataActions = {

  // Receive inital data
  receiveData: function(data) {
    AppDispatcher.handleAction({
      actionType: FluxDataConstants.DATA_RECEIVE,
      data: data
    })
  }

};

module.exports = FluxDataActions;
