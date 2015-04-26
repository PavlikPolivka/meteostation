var FluxDataActions = require('../actions/FluxDataActions');

var thingSpeakApiUrl = "https://api.thingspeak.com/channels/<CHANNEL_ID>/feeds.json?results=520&key=<CHANNEL_KEY>";
var updateInterval = 30000;

//Load data from thing speak api
var getData = function() {
		var request = new XMLHttpRequest();
		request.open('GET', thingSpeakApiUrl, true);

		request.onload = function() {
		  if (this.status >= 200 && this.status < 400) {
		    // Success!
		    var data = JSON.parse(this.response);
		    FluxDataActions.receiveData(data);
		  }
		};
		request.send();
	};

module.exports = {

	//Loads initial data
	init: function() {
		getData();
		setInterval(function () {
			getData();
		}, updateInterval);
	},
	//Starts data updating
	startDataUpdate: function() {
		
	}

};