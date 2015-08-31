/* globals React */
'use strict';

var Players = React.createClass({
  render: function() {
    var players = this.props.players;
    var turns = this.props.turns;
    var addPlayer = this.props.addPlayer;
    var clearPlayers = this.props.clearPlayers;
    var shufflePlayers = this.props.shufflePlayers;
    var buttons = {
      'add player': {
        callBack: {
          only: true,
          func: addPlayer,
          args: [{}]
        }
      },
      'add computer': {
        callBack: {
          only: true,
          func: addPlayer,
          args: [{ difficulty: undefined }]
        }
      },
      'clear players': {
        callBack: {
          only: true,
          func: clearPlayers,
          args: []
        }
      },
      'scramble players': {
        callBack: {
          only: true,
          func: shufflePlayers,
          args: []
        }
      }
    };

    var headers = ['name', 'turn', 'handicap'];
    // if (this.areComputers()) {
    //   headers.push('difficulty');
    // }


    var ths = headers.map(function(header) {
      return <th key={ header }>{ header }</th>;
    });

    var playersRows = turns.map(function(name) {
      var player = players[name];
      var tds = [];
      Object.keys(player).forEach(function(attr) {
        if (headers.concat('difficulty').indexOf(attr) !== -1) {
          tds.push(<PlayerInput key={ name + '-' + attr } attr={ attr } val={ player[attr] } updatePlayer={ addPlayer } />);
        }
      });

      return <tr key={ name + '-row' }>{ tds }</tr>;
    });

    return(
      <div className='players-wrap'>
        <table className='players-table'>
          <tbody>
            <tr>
              { ths }
            </tr>
            { playersRows }
          </tbody>
        </table>
        { this.props.getButtons(buttons) }
      </div>
    );
  },
  areComputers: function() {
    var players = this.state.players;
    var areComputers = false;
      Object.keys(players).some(function(name) {
        return areComputers = players[name].token > 0 ? true : false;
      });
    return areComputers;
  }
});
