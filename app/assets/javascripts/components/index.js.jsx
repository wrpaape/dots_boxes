/* globals React */
'use strict';

var Index = React.createClass({
  getInitialState: function() {
    return({
      idSelected: 0,
      idPlaying: 0,
      players: {},
      alert: this.props.userId ? 'welcome' : 'welcome back'
    });
  },
  render: function() {
    var games = this.props.games;
    var idSelected = this.state.idSelected;
    var idPlaying = this.state.idPlaying;
    var players = this.state.players;
    var alert = this.state.alert;
    var allGames = [], index = [];

    games.forEach(function(game) {
      var id = game.id;

      index.push(
        <div key={ 'index-' + id } className='game-wrap'>
          <div className={ 'title ' + (idSelected === 0) } onClick={ this.selectGame.bind(this, id) }>
            { game.title }
          </div>
          <div className={ 'selected-game ' + (idSelected === id) }>
            <Show game={ game } goBack={ this.selectGame } startGame={ this.startGame } />
          </div>
        </div>
      );

      allGames.push(
        <div key={ 'game-' + id } className={ (id === idPlaying) + ' playing id-' + id }>
          {
            React.createElement(
              window[game.component],
              {
                game: game,
                players: players,
                saveGame: this.saveGame,
                quitGame: this.quitGame
              }
            )
          }
        </div>
      );
    }.bind(this));

    return(
      <div className='index-wrap'>
        <div className='alert'>
          { alert }
        </div>
        <div className={ 'index ' + (idPlaying === 0) }>
          { index }
        </div>
        <div className={ 'all-games ' + (idPlaying > 0) }>
          { allGames }
        </div>
      </div>
    );
  },
  selectGame: function(id) {
    this.saveGame(this.props.games[0], this.state);
    this.setState({
      idSelected: id || 0
    })
  },
  startGame: function(id, players) {
    this.setState({
      idSelected: 0,
      idPlaying: id,
      players: players
    })
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
        this.setState({
          alert: response.message
        });
      }.bind(this),
      error: function() {
        this.setState({
          alert: game.title + ' save failed!'
        });
      }.bind(this)
    });
  },
  quitGame: function() {
    this.setState({
      idPlaying: 0,
      players: {}
    })
  }
});
