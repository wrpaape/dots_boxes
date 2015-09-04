/* globals React */
'use strict';

var Index = React.createClass({
  getInitialState: function() {
    return({
      idSelected: 0,
      idPlaying: 0,
      players: {},
      turns: [],
      alert: <Alert key='true' message={ this.props.userId ? 'welcome' : 'welcome back' } />
    });
  },
  render: function() {
    var games = this.props.games;
    var idSelected = this.state.idSelected;
    var idPlaying = this.state.idPlaying;
    var players = this.state.players;
    var turns = this.state.turns;
    var board = this.state.board;
    var alert = this.state.alert;
    var gamePlaying = <div />;

    var index = games.map(function(game) {
      var id = game.id;

      if (id === idPlaying) {
        var gameProps = {
          game: game,
          players: players,
          turns: turns,
          saveGame: this.saveGame,
          quitGame: this.quitGame
        }
        if (board) {
          gameProps.board = board;
        }
        gamePlaying = React.createElement(window[game.component], gameProps);
      }

      return(
        <div key={ 'index-' + id } className='game-wrap'>
          <div className={ 'title ' + (idSelected === 0) + ' cursor-pointer' } onClick={ this.selectGame.bind(this, id) }>
            { game.title }
          </div>
          <div className={ 'selected-game ' + (idSelected === id) }>
            <Show game={ game } goBack={ this.selectGame.bind(null, 0) } startGame={ this.startGame.bind(null, id) } setAlert={ this.setAlert } />
          </div>
        </div>
      );

    }.bind(this));

    return(
      <div className='index-wrap'>
        { alert }
        <div className={ 'index ' + (idPlaying === 0) }>
          { index }
        </div>
        { gamePlaying }
      </div>
    );
  },
  selectGame: function(id) {
    this.setState({
      idSelected: id
    })
  },
  startGame: function(id, players, turns, board) {
    var initialGameState = {
      idSelected: 0,
      idPlaying: id,
      players: players,
      turns: turns
    };

    board ? initialGameState.board = board : delete(this.state.board);

    this.setState(initialGameState);
  },
  saveGame: function(game, gameState) {
    $.ajax({
      type: 'POST',
      url: game.saveURL,
      dataType: 'json',
      headers: {
        'X-HTTP-Method-Override': 'PUT'
      },
      data: {
        id: game.id,
        state: gameState
      },
      success: function(response) {
        this.setAlert(game.title + response.message);
      }.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        this.setAlert(game.title + ' save failed!');
      }.bind(this)
    });
  },
  quitGame: function() {
    this.setState({
      idPlaying: 0,
      players: {}
    })
  },
  setAlert: function(message) {
    this.setState({
      alert: <Alert key={ !JSON.parse(this.state.alert.key) } message={ message } />
    })
  }
});
