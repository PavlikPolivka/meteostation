var React = require('react');
var ThingsSpeakAPI = require('./utils/ThingsSpeakAPI');
var FluxMeteostationApp = require('./components/FluxMeteostationApp.react');

//Init thing speak api
ThingsSpeakAPI.init();

// Render FluxMeteostationApp Controller View
React.render(
  <FluxMeteostationApp />,
  document.getElementById('flux-meteostation')
);
