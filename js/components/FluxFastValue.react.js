var React = require('react');

// Flux product view
var FluxFastValue = React.createClass({

  // Render product View
  render: function() {
    return (
      <div className="fastValue lead">
        <span className="fastLabel">
          {this.props.label}:
        </span>
        <span className="fastValue">
          {this.props.value.value}
        </span>
        <span className="fastUnit">
          {this.props.unit}
        </span>
      </div>
    );
  },

});

module.exports = FluxFastValue;