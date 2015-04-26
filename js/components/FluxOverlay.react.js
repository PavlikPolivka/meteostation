var React = require('react');

// Flux overlay view
var FluxOverlay = React.createClass({

  // Render overlay view
  render: function() {
    var self = this, products = this.props.products;
    return (
      <div className={"overlay " + (this.props.visible ? '' : 'inactive')}>
        <div id="floatingBarsG">
          <div className="blockG" id="rotateG_01">
          </div>
          <div className="blockG" id="rotateG_02">
          </div>
          <div className="blockG" id="rotateG_03">
          </div>
          <div className="blockG" id="rotateG_04">
          </div>
          <div className="blockG" id="rotateG_05">
          </div>
          <div className="blockG" id="rotateG_06">
          </div>
          <div className="blockG" id="rotateG_07">
          </div>
          <div className="blockG" id="rotateG_08">
          </div>
        </div>
      </div>
    );
  },

});

module.exports = FluxOverlay;