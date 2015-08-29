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
                spec: game.spec,
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
    var saveMessage = game.title + ' save failed!'
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: this.props.saveURL + game.id,
      headers: {
        'X-HTTP-Method-Override': 'PUT'
      },
      data: gameState,
      success: function(successMessage) {
        return saveMessage = successMessage;
      }
    });

    this.setState({
      alert: saveMessage
    });
  },
  quitGame: function() {
    this.setState({
      idPlaying: 0,
      players: {}
    })
  }
});
