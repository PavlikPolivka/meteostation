var React = require('react');
var DataStore = require('../stores/DataStore');
var FluxOverlay = require('./FluxOverlay.react');
var FluxFastValue = require('./FluxFastValue.react');
var LineChart = require("react-chartjs").Line;

// Method to retrieve state from Stores
function getDataState() {
  return {
    initialized: DataStore.isInitialized(),
    tempChartValues: DataStore.getTemperatureChart(),
    humidityChartValues: DataStore.getHumidityChart(),
    lastTemp: DataStore.getLastTemperature(),
    lastHumidity: DataStore.getLastHumidity()
  };
}

var chartOptions = 
  {
    pointDotRadius : 1,
    pointHitDetectionRadius : 5
};


// Define main Controller View
var FluxMeteostationApp = React.createClass({

  // Get initial state from stores
  getInitialState: function() {
    return getDataState();
  },

  // Add change listeners to stores
  componentDidMount: function() {
    DataStore.addChangeListener(this._onChange);
  },

  // Remove change listers from stores
  componentWillUnmount: function() {
    DataStore.removeChangeListener(this._onChange);
  },

  // Render our child components, passing state via props
  render: function() {
    var initMarkaup;
    if (this.state.initialized) {
      initMarkaup = 
      <div>
        <div className="fastValues jumbotron">
          <FluxFastValue label="Teplota" value={this.state.lastTemp} unit="°C" />
          <FluxFastValue label="Vlhkost" value={this.state.lastHumidity} unit="%" />
        </div>
        <div className="charts">
          <div className="temperature">
            <h3>Teplota</h3>
            <LineChart data={this.state.tempChartValues} options={chartOptions} width="1140" height="300"/>
          </div>
          <div className="humidity">
            <h3>Vlhkost</h3>
            <LineChart data={this.state.humidityChartValues} options={chartOptions} width="1140" height="300"/>
          </div>    
        </div>
      </div>;
    } 
  	return (
      <div className="flux-meteo-app container">
        <div className="header clearfix">
          <h3 className="text-muted">Meteostanice</h3>
        </div>
        <FluxOverlay visible={!this.state.initialized} />
        {initMarkaup}
      </div>
  	);
  },

  // Method to setState based upon Store changes
  _onChange: function() {
    this.setState(getDataState());
  }

});

module.exports = FluxMeteostationApp;

        // <FluxCart products={this.state.cartItems} count={this.state.cartCount} total={this.state.cartTotal} visible={this.state.cartVisible} />
        // <FluxProduct product={this.state.product} cartitems={this.state.cartItems} selected={this.state.selectedProduct} />