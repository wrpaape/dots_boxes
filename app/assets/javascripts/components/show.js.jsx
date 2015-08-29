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
    var spec = game.spec;
    var stopGame = this.props.stopGame;
    var players = this.state.players;
    var turns = this.state.turns;

    var buttons = {
      'rules': {
        props: {
          rules: game.rules
        }
      },
      'players': {
        props: {
          spec: spec,
          players: players,
          turns: turns,
          getButtons: this.getButtons,
          addPlayer: this.addPlayer,
          removePlayer: this.removePlayer,
          clearPlayers: this.clearPlayers,
          shufflePlayers: this.shufflePlayers
        }
      },
      'play': {
        callBack: {
          func: this.props.startGame,
          args: [game.id, players, turns]
        }
      },
      'back': {
        callBack: {
          func: this.props.goBack,
          args: []
        }
      }
    };

    return(
      <div className='show-wrap'>
        { this.getButtons(buttons) }
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
  getButtons: function(buttons) {
    var buttonSelected = this.state.buttonSelected;

    return Object.keys(buttons).map(function(button) {
      var componentName = window[button.charAt(0).toUpperCase() + button.slice(1)];
      var props = buttons[button];
      var component = <div />;
      var callBack = function() { return; };

      Object.keys(props).forEach(function(prop) {
        switch (prop) {
          case 'callBack':
            callBack = props.callBack;
            break;
          case 'props':
            component =
              <div className={ button + '-component ' + (button === buttonSelected) }>
                { React.createElement(componentName, props.props) }
              </div>;
        }
      }.bind(this));

      return(
        <div key={ button }>
          <div className={ button + '-button ' } onClick={ this.selectButton.bind(this, button, callBack) }>
            { button }
          </div>
          { component }
        </div>
      );
    }.bind(this));
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

    turns.splice(players[name].turn, 1);
    delete(players[name]);

    this.setState({
      players: players,
      turns: turns
    });
  },
  clearPlayers: function() {
    this.setState({
      players: {},
      turns: []
    });
  },
  shufflePlayers: function() {
    var turns = this.state.turns;
    var players = this.state.players;
    var turn = turns.length;
    var randTurn, name, randName;

    while (turn > 0) {
      randTurn = Math.floor(Math.random() * turn--);
      name = turns[turn];
      randName = turns[randTurn];
      turns[turn] = randName;
      turns[randTurn] = name;
      players[randName].turn = turn;
      players[name].turn = randTurn;
    }

    this.setState({
      players: players,
      turns: turns
    });
  }
});
