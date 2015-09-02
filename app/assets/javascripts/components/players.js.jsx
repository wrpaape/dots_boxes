/* globals React */
'use strict';

var Players = React.createClass({
  render: function() {
    var addPlayer = this.props.addPlayer;
    var removePlayer = this.props.removePlayer;
    var clearPlayers = this.props.clearPlayers;
    var shufflePlayers = this.props.shufflePlayers;
    var players = this.props.players;
    var turns = this.props.turns;
    var buttons = {
      'add player': {
        callBack: {
          only: true,
          func: addPlayer,
          args: [false]
        }
      },
      'add computer': {
        callBack: {
          only: true,
          func: addPlayer,
          args: [true]
        }
      },
      'shuffle players': {
        callBack: {
          only: true,
          func: shufflePlayers,
          args: []
        }
      },
      'clear players': {
        callBack: {
          only: true,
          func: clearPlayers,
          args: []
        }
      }
    };

    var playersTable = [<div key='players-table' />];
    if (turns.length) {
      var parentProps = this.props;
      var playersRows = turns.map(function(name, i) {
        var player = players[name];
        var tds = [<td key={ 'remove-' + i } onClick={ removePlayer.bind(null, name) }>X</td>];
        ['turn', 'name', 'handicap', 'difficulty'].forEach(function(attr) {
          if (player[attr] !== undefined || attr === 'name') {
            var capAttr = attr.charAt(0).toUpperCase() + attr.slice(1);
            var childProps = {
              updatePlayer: parentProps['update' + capAttr].bind(null, name)
            };
            childProps[attr] = attr === 'difficulty' ? { level: player[attr], levels: parentProps.levels } : attr === 'name' ? name : player[attr];

            tds.push(
              <td key={ attr }>
                { React.createElement(window[capAttr], childProps) }
              </td>
            );
          }
        });

        return <tr key={ 'row-' + player.token }>{ tds }</tr>;
      });

      var headers = [' ', ' ', ' ', 'handicap'];
      var ths = headers.map(function(header, i) {
        return <th key={ 'header-' + i }>{ header }</th>;
      });
      var headerRow = [<thead key='header-row'><tr>{ ths }</tr></thead>];
      playersTable = [
        <table key='players-table'>
          { headerRow.concat(<tbody key='tbody'>{ playersRows }</tbody>) }
        </table>
      ];
    }

    return(
      <div className='players-wrap'>
        { playersTable.concat(this.props.getButtons(buttons)) }
      </div>
    );
  }
});
