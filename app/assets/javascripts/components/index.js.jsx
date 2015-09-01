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
            <Show game={ game } goBack={ this.selectGame } startGame={ this.startGame } setAlert={ this.setAlert } />
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
                turns: turns,
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
        { alert }
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
    this.setState({
      idSelected: id || 0
    })
  },
  startGame: function(id, players, turns) {
    this.setState({
      idSelected: 0,
      idPlaying: id,
      players: players,
      turns: turns
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
