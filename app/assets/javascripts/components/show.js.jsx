/* globals React */
'use strict';

var Show = React.createClass({
  getInitialState: function() {
    return({
      selected: '',
      playing: false
    });
  },
  render: function() {
    var game = this.props.game;
    var startGame = this.props.startGame;
    var selected = this.state.selected;
    var playing = this.state.playing;

    var buttons = ['rules', 'players', 'play', 'back'].map(function() {
      return(
        <div key={ id } className='game-wrap'>
          <div className='title' onClick={ this.selectGame.bind(this, id) }>
            { game.title }
          </div>
          <div className={ 'selected-game ' + selected === id }>
            <Show game={ game } selectGame={ this.selectGame } startGame={ this.startGame } />
          </div>
        </div>
      );
    });
    // var turns = {}, scoreboard = {};
    // for(var i = 1; i < 8; i+=2) {
    //   for (var j = 0; j < 2; j++) {
    //     turns['player ' + (i + j)] = (1 - 2 * j) * (i + 1) / 2;
    //     scoreboard['player ' + (i + j)] = 0;
    //   }
    // }
    if (playing) {
      this.startGame(game);
    }
    return(
      <div className='show-wrap'>
        <div className={ 'game' + playing }>
          React.createElement(window[game.component], { spec: game.spec, turns: turns })
        </div>
      </div>
    );
  }
});
