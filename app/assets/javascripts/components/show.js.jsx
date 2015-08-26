/* globals React */
'use strict';

var Show = React.createClass({
  // getInitialState: function() {

  // },
  render: function() {
    var game = this.props.game;
    console.log(game.spec);
    return(
      React.createElement(window[game.component], { spec: game.spec })
    );
  }
});
