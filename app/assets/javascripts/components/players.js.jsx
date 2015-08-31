/* globals React */
'use strict';

var Players = React.createClass({
  render: function() {
    var players = this.props.players;
    var turns = this.props.turns;
    var addPlayer = this.props.addPlayer;
    var removePlayer = this.props.removePlayer;
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
      var tds = [<td key={ 'remove-' + name } onClick={ removePlayer.bind(null, name) }>X</td>];
      Object.keys(player).concat('name').forEach(function(attr) {
        if (headers.concat('difficulty').indexOf(attr) !== -1) {
          tds.push(React.createElement(
            window[attr.charAt(0).toUpperCase() + attr.slice(1)],
            {
              key: name + '-' + attr,
              name: name,
              attr: attr,
              val: player[attr],
              updatePlayer: addPlayer,
            }
          ));
        }
      });

      return <tr key={ name + '-row' }>{ tds }</tr>;
    }.bind(this));

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
