var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FluxDataConstants = require('../constants/FluxDataConstants');
var _ = require('underscore');
var DateFormat = require('../DateFormat.js');

// Define initial data points
var _initialized = false, _lastValue = null, _temps = {}, _humidity = {}, _size, _redraw=false, _labelCount=1;

var _tempChartData = {}, _humidityChartData;

function loadData(data) {
  _lastValue = data.channel.last_entry_id;
  _temps = _.map(data.feeds, function(entry){ return {id: entry.entry_id, time:entry.created_at, value:entry.field1} });
  _humidity = _.map(data.feeds, function(entry){ return {id: entry.entry_id, time:entry.created_at, value:entry.field2} });
  _temps = _.indexBy(_temps,'id');
  _tempChartData = transforForChartData(_temps);
  _humidityChartData = transforForChartData(_humidity);
  _humidity = _.indexBy(_humidity,'id');
  _initialized = true;
}

function handleLabelChange(data) {
    var recalcValues = false;
    if(data < 992 && _labelCount != 1) { 
       _labelCount = 1;
       recalcValues = true;
    }
    if(data >= 992 && _labelCount != 0) {
      _labelCount = 0;
      recalcValues = true;
    }
    return recalcValues;
}

function resizeRecalc(data){
  if(_initialized) {
    
    if(handleLabelChange(data)) {
      _tempChartData = transforForChartData(_temps);
      _humidityChartData = transforForChartData(_humidity);
    }
    _redraw = false;
    if(data >= 1200 && _size<1200){
      _redraw = true;
    }
    if(data >= 992 && (_size<768 || _size>=1200)){
      _redraw = true;
    }
    if(data < 768 && _size >= 768) {
     _redraw = true;  
    }
    _redraw = true;
    _size = data;  
  }
}

function transforForChartData(values){
  var labels=[];
  var dataset=[];
  var countLabels = _labelCount;
  var countValues = 0;

  var filtered = _.filter(values,function(){
    if(countValues == 12){
      countValues = 0;
      return 1;
    } else {
      countValues++;
      return 0;
    }
  });

  _.map(filtered, function(entry){
    var label = "";
    if(countLabels==_labelCount){
      label = DateFormat.format(new Date(entry.time),"dd.m. HH")+"h";
      //label = "a";
      countLabels=0;
    } else {
      countLabels++;  
    }   
    labels.push(label);
    //dataset.push(entry.value);
    dataset.push(Number(entry.value));
  });

  return {
    labels: labels,
    datasets: [{
                  fillColor: "rgba(220,220,220,0.2)",
                  strokeColor: "rgba(220,220,220,1)",
                  pointColor: "rgba(220,220,220,1)",
                  data: dataset
    }]
  };
}


// Extend DataStore with EventEmitter to add eventing capabilities
var DataStore = _.extend({}, EventEmitter.prototype, {

  getLastTemperature: function(){
    return _temps[_lastValue];
  },

  // Return temperature line
  getTemperature: function() {
    return _temps;
  },

  getTemperatureChart: function() {
    return _tempChartData;
  },

  getLastHumidity: function(){
    return _humidity[_lastValue];
  },

  // Return humidity line
  getHumidity: function(){
    return _humidity;
  },

  getHumidityChart: function() {
    return _humidityChartData;
  },

  //Is everything initialized
  isInitialized: function(){
    return _initialized;
  },

  shouldBeRedrawn: function(){
    return _redraw;
  },

  // Emit Change event
  emitChange: function() {
    this.emit('change');
  },

  // Add change listener
  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  // Remove change listener
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }

});

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
  var action = payload.action;
  var text;

  switch(action.actionType) {

    // Respond to DATA_RECEIVE action
    case FluxDataConstants.DATA_RECEIVE:
      loadData(action.data);
      break;
    case FluxDataConstants.WINDOW_RESIZE:
      resizeRecalc(action.data);
      break;
    case FluxDataConstants.INIT_WINDOW:
      handleLabelChange(action.data);
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  DataStore.emitChange();

  return true;

});

module.exports = DataStore;
