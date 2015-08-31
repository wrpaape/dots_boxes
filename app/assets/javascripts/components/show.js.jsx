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
    var counts = {
      player: numPlayers,
      computer: numComputers,
      total: numPlayers + numComputers
    };

    return({
      buttonSelected: '',
      players: players,
      turns: turns,
      counts: counts
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
          updatePlayer: this.updatePlayer,
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
          score: startScore,
          handicap: 0
        }
      }
      if (i <= numComputers) {
        players['computer' + i] = {
          token: -i,
          turn: turn++,
          score: startScore,
          handicap: 0,
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
      var callBack = {
        func: function() { return; },
        args: []
      };

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

    if (!callBack.only) {
      this.setState({
        buttonSelected: button === lastButton ? '' : button
      });
    }

    callBack.func.apply(this, callBack.args);
  },
  addPlayer: function(isComputer) {
    var counts = this.state.counts;
    var spec = this.props.game.spec;
    var tooMany = Object.keys(counts).some(function(type) {
      var limit = spec[type].max;
      if (counts[type] >= limit) {
        this.props.setAlert(type + ' limit (' + limit + ') reached, cannot add more');
        return true;
      }
    }.bind(this));
    if (tooMany) {
      return;
    }
    counts.total++;
    var players = this.state.players;
    var turns = this.state.turns;
    var token = isComputer ? -counts.computer++ - 1 : counts.player++ + 1;
    var name = isComputer ? 'computer' + -token : 'player' + token;
    var player = {
      token: token,
      turn: turns.length,
      score: spec.score,
      handicap: 0
    };
    if (isComputer) {
      player.difficulty = 'normal';
    }

    players[name] = player;
    turns.push(name);

    this.setState({
      players: players,
      turns: turns,
      counts: counts
    });
  },
  updatePlayer: function(name, attr, newVal) {
    switch (attr) {
      case 'name':
      case 'turn':
      case 'handicap':
    }


    var players = this.state.players;
    if (turns.indexOf(name) !== -1) {
      this.props.setAlert.bind(this, name + ' is already taken');
      return;
    }
  },
  removePlayer: function(name) {
    var players = this.state.players;
    var turns = this.state.turns;
    var counts = this.state.counts;
    var player = players[name];
    var removedTurn = player.turn;
    counts.total--;
    player.token > 0 ? counts.player-- : counts.computer--;

    turns.splice(removedTurn, 1);
    turns.slice(removedTurn).forEach(function(name, turn) {
      players[name].turn = turn;
    });
    delete(players[name]);

    this.setState({
      players: players,
      turns: turns,
      counts: counts
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
  },
  updateTurns: function(name, newTurn) {

    this.setState({
      players: players,
      turns: turns
    })
  }
});
