/* globals React */
'use strict';

var Show = React.createClass({
  // getInitialState: function() {

  // },
  render: function() {
    var game = this.props.game;
    return(
      React.createElement(window[game.component], { spec: game.spec })
    );
  }
});
