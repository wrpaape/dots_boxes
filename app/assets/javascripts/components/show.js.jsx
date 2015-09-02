/* globals React */
'use strict';

var Show = React.createClass({
  getInitialState: function() {
    return({
      buttonSelected: '',
      players: this.getDefault('players'),
      turns: this.getDefault('turns'),
      counts: this.getDefault('counts'),
      board: this.getDefault('board')
    });
  },
  render: function() {
    var game = this.props.game;
    var levels = game.spec.computer.levels;
    var stopGame = this.props.stopGame;
    var players = this.state.players;
    var turns = this.state.turns;
    var board = this.state.board;

    var buttons = {
      'rules': {
        props: {
          rules: game.rules
        }
      },
      'players': {
        props: {
          players: players,
          turns: turns,
          levels: levels,
          getButtons: this.getButtons,
          addPlayer: this.addPlayer,
          removePlayer: this.removePlayer,
          clearPlayers: this.clearPlayers,
          restoreDefaultPlayers: this.restoreDefaultPlayers,
          shufflePlayers: this.shufflePlayers,
          updateName: this.updateName,
          updateTurn: this.updateTurn,
          updateHandicap: this.updateHandicap,
          updateDifficulty: this.updateDifficulty
        }
      }
    };
    if (board) {
      buttons.board = {
        props: {
          board: board,
          updateBoard: this.updateBoard,
          getDefaultBoard: this.getDefault.bind(null, 'board')
        }
      };
    }
    buttons.play = {
      callBack: {
        func: this.props.startGame,
        args: [game.id, players, turns]
      }
    };
    buttons.back = {
      callBack: {
        func: this.props.goBack,
        args: []
      }
    };
    return(
      <div className='show-wrap'>
        { this.getButtons(buttons) }
      </div>
    );
  },
  getDefault: function(returnState) {
    var spec = this.props.game.spec;
    var numPlayers = spec.player.default;
    var numComputers = spec.computer.default;
    var startScore = spec.score.default;

    switch (returnState) {
      case 'players':
        return this.getDefaultPlayers(numPlayers, numComputers, startScore);
        break;
      case 'turns':
        return this.getTurns(this.getDefault('players'));
      case 'counts':
        return {
          player: numPlayers,
          computer: numComputers,
          total: numPlayers + numComputers
        };
        break;
      case 'board':
        var dimensions = spec.layout.dimensions;
        if (dimensions) {
          var board = {};
          Object.keys(dimensions).forEach(function(dim) {
            board[dim] = dimensions[dim].default;
          });
          return board;
        }
    }
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
  getTurns: function(players) {
    var turns = [];
    Object.keys(players).forEach(function(name) {
      turns[players[name].turn] = name;
    });

    return turns;
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
      });

      return(
        <div key={ button }>
          <div className={ button + '-button cursor-pointer' } onClick={ this.selectButton.bind(this, button, callBack) }>
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
  removePlayer: function(name) {
    var players = this.state.players;
    var turns = this.state.turns;
    var counts = this.state.counts;
    var player = players[name];
    var removedTurn = player.turn;
    counts.total--;
    player.token > 0 ? counts.player-- : counts.computer--;

    turns.splice(removedTurn, 1);
    turns.slice(removedTurn).forEach(function(name) {
      players[name].turn--;
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
      turns: [],
      counts: {
        player: 0,
        computer: 0,
        total: 0
      }
    });
  },
  restoreDefaultPlayers: function() {
    this.setState({
      players: this.getDefault('players'),
      turns: this.getDefault('turns'),
      counts: this.getDefault('counts')
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
  updateName: function(oldName, newName) {
    var turns = this.state.turns;
    if (newName === oldName) {
      return;
    } else if (turns.indexOf(newName) !== -1) {
      this.props.setAlert('\'' + newName + '\' is already taken');
      return;
    }

    var turnIndex = turns.indexOf(oldName);
    var players = this.state.players;
    turns[turnIndex] = newName;
    players[newName] = players[oldName];
    delete(players[oldName]);

    this.setState({
      players: players,
      turns: turns
    });
  },
  updateTurn: function(name, newTurn) {
    var turns = this.state.turns;
    if (turns.indexOf(name) === newTurn) {
      return;
    } else if (newTurn < 0) {
      newTurn = 0;
    } else if (newTurn >= turns.length) {
      newTurn = turns.length - 1;
    }

    var players = this.state.players;
    var oldTurn = players[name].turn;
    players[name].turn = newTurn;

    turns.splice(newTurn, 0, turns.splice(oldTurn,1)[0]);
    var turnsAffected = newTurn > oldTurn ? turns.slice(oldTurn, newTurn) : turns.slice(newTurn + 1, oldTurn + 1);
    var shift = newTurn > oldTurn ? -1 : 1;
    turnsAffected.forEach(function(name) {
      players[name].turn += shift;
    });

    this.setState({
      players: players,
      turns: turns
    });
  },
  updateHandicap: function(name, newHandicap) {
    var limit = this.props.game.spec.score.limit;
    if (limit) {
      var func = limit.func;
      var args = limit.args;
      var funcArgs = [], inputArgs = [];
      args.forEach(function(arg, i) {
        funcArgs.push(arg.name);
        var inputArg = this;
        arg.path.forEach(function(step) {
          inputArg = inputArg[step];
        });
        inputArgs.push(inputArg);
      }.bind(this));

      var limitFunc = new Function(funcArgs.concat('handicap'), func);
      var failed = limitFunc.apply(this, inputArgs.concat(newHandicap));
      if (failed) {
        this.props.setAlert(failed);
        return;
      }
    }

    var players = this.state.players;
    players[name].handicap = newHandicap;

    this.setState({
      players: players
    });
  },
  updateDifficulty: function(name, newDifficulty) {
    var players = this.state.players;
    players[name].difficulty = newDifficulty;

    this.setState({
      players: players
    });
  },
  updateBoard: function(newBoard) {
    var setAlert = this.props.setAlert;
    var dimensions = this.props.spec.layout.dimensions;
    var invalidDims = Object.keys(dimensions).some(function(dim) {
      var minDim = dimensions[dim].min;
      var maxDim = dimensions[dim].max;
      if (newBoard[dim] < minDim) {
        setAlert('not enough ' + dim + ' (min ' + minDim + ')');
        return true;
      } else if (newBoard[dim] > maxDim) {
        setAlert('too many ' + dim + ' (max ' + maxDim + ')');
        return true;
      }
    });

    if (!invalidDims) {
      this.setState({
        board: newBoard
      });
    }
  }
});
