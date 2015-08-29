/* globals React */
'use strict';

var Show = React.createClass({
  getInitialState: function() {
    var spec = this.props.game.spec;
    var numPlayers = spec.player.default;
    var numComputers = spec.computer.default;
    var startScore = spec.score;
    var players = this.getDefaultPlayers(numPlayers, numComputers, startScore);
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
  getDefaultPlayers: function(numPlayers, numComputers, startScore) {
    var numBigger = numPlayers > numComputers ? numPlayers : numComputers;
    var turn = 0;
    var players = {};
    for(var i = 1; i <= numBigger; i++) {
      if (i <= numPlayers) {
        players['player' + i] = {
          token: i,
          turn: turn++,
          score: startScore
        }
      }
      if (i <= numComputers) {
        players['computer' + i] = {
          token: -i,
          turn: turn++,
          score: startScore,
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
    var spec = this.props.game.spec;
    var startScore = spec.score;
    var players = this.state.players;
    var turns = this.state.turns;
    var tokens = turns.map(function(name) {
      return players.name.token;
    }).sort();

    var isComputer = Object.keys(input).indexOf('difficulty') > 0;
    var token = isComputer ? tokens.shift() - 1 : tokens.pop() + 1;
    var name = input.name || isComputer ? 'computer' + -token : 'player' + token;
    var player = {
      token: token,
      turn: input.turn || turns.length,
      score: startScore + input.handicap || startScore
    };
    if (isComputer) {
      player.difficulty = input.difficulty || 'normal';
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
  }
});
