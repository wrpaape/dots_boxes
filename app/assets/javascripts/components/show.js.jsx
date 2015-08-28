/* globals React */
'use strict';

var Show = React.createClass({
  getInitialState: function() {
    return({
      selected: ''
    });
  },
  render: function() {
    var game = this.props.game;
    var turns = {}, scoreboard = {};
    for(var i = 1; i < 8; i+=2) {
      for (var j = 0; j < 2; j++) {
        turns['player ' + (i + j)] = (1 - 2 * j) * (i + 1) / 2 ;
        scoreboard['player ' + (i + j)] = 0;
      }
    }
    return(
      <div className='div-wrap'>
        React.createElement(window[game.component], { spec: game.spec, turns: turns })
      </div>
    );
  }
});
