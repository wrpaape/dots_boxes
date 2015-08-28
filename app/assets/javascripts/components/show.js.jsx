/* globals React */
'use strict';

var Show = React.createClass({
  getInitialState: function() {
    var game = this.props.game;
    var player = game.spec.player;
    var computer = game.spec.computer;
    var players = this.getDefaultPlayers(player.num, player.score, computer.num, computer.score);
    var turns = [];
    Object.keys(players).forEach(function(name) {
      turns[players[name].turn] = name;
    });

    return({
      buttonSelected: '',
      players: players,
      turns: turns
    });
  },
  render: function() {
    var game = this.props.game;
    var goBack = this.props.goBack;
    var startGame = this.props.startGame;
    var stopGame = this.props.stopGame;
    var buttonSelected = this.state.buttonSelected;
    var players = this.state.players;
    var undefinedCallBack = function() { return; };
    var buttons = {
      'rules': { callBack: { func: undefinedCallBack, args: [] }, rules: game.rules },
      'players': { callBack: { func: undefinedCallBack, args: [] }, player: game.spec.player, computer: game.spec.computer },
      'play': { callBack: { func: startGame, args: [game.id, players] } },
      'back': { callBack: { func: goBack, args: [] } }
    };

    var allButtons = Object.keys(buttons).map(function(button) {
      var component = window[button.charAt(0).toUpperCase() + button.slice(1)];
      var props = buttons[button];

      return(
        <div key={ button }>
          <div className={ button + '-button ' } onClick={ this.selectButton.bind(this, button, props.callBack) }>
            { button }
          </div>
          <div className={ button + '-component ' + (button === buttonSelected) }>
            { React.createElement(component, props) }
          </div>
        </div>
      );
    }.bind(this));

    return(
      <div className='show-wrap'>
        { allButtons }
      </div>
    );
  },
  getDefaultPlayers: function(numPlayers, scorePlayers, numComputers, scoreComputers) {
    var numBigger = numPlayers > numComputers ? numPlayers : numComputers;
    var turn = 0;
    var players = {};
    for(var i = 1; i <= numBigger; i++) {
      if (i <= numPlayers) {
        players['player' + i] = {
          token: i,
          turn: turn++,
          score: scorePlayers,
          handicap: 0
        }
      }
      if (i <= numComputers) {
        players['computer' + i] = {
          token: -i,
          turn: turn++,
          score: scoreComputers,
          handicap: 0,
          difficulty: 'normal'
        }
      }
    }

    return players;
  },
  selectButton: function(button, callBack) {
    var lastButton = this.state.buttonSelected;

    this.setState({
      buttonSelected: button === lastButton ? '' : button
    });
    callBack.func.apply(this, callBack.args);
  },
  addPlayer: function(input) {
    var game = this.props.game;
    var score = game.spec.player.score;
    var players = this.state.players;
    var turns = this.state.turns;
    var newToken = 0;
    var tokens = players.map(function(player) {
      return player.token;
    }).sort();
    var name, token, handicap, difficulty;
    var player = {};



    switch (typeof(args)) {
      case 'object':
        player.difficulty = args.difficulty;
      case 'number':
        player.token = tokens.shift() - 1;
        player.name = args['name'] || 'computer' + -token;
        break;
      default:
        player.token = tokens.pop() + 1;
        player.name = args || 'player' + token;
    }

    players[name] = player;
    turns.push(name);

    this.setState({
      players: players,
      turns: turns
    });
  },
  removePlayer: function(name) {
    var players = this.state.players;
    var turns = this.state.turns;
    var player = players[name];

    turns.splice(player.turn, 1);
    delete(player);

    this.setState({
      players: players,
      turns: turns
    });
  },
  updatePlayers: function(name) {

  }
});
