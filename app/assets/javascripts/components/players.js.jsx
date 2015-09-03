/* globals React */
'use strict';

var Players = React.createClass({
  render: function() {
    var parentProps = this.props;
    var addPlayer = parentProps.addPlayer;
    var removePlayer = parentProps.removePlayer;
    var clearPlayers = parentProps.clearPlayers;
    var restoreDefaultPlayers = parentProps.restoreDefaultPlayers;
    var shufflePlayers = parentProps.shufflePlayers;
    var players = parentProps.players;
    var turns = parentProps.turns;
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
      },
      'restore defaults': {
        callBack: {
          only: true,
          func: restoreDefaultPlayers,
          args: []
        }
      }
    };

    var playersTable = [<div key='players-table' />];
    if (turns.length) {
      var playersRows = turns.map(function(name) {
        var player = players[name];
        var tds = [<td key={ 'remove-' + player.token } className='cursor-pointer hover-child' onClick={ removePlayer.bind(null, name) }>X</td>];
        ['turn', 'name', 'handicap', 'difficulty'].forEach(function(attr) {
          if (player[attr] !== undefined || attr === 'name') {
            var capAttr = attr.charAt(0).toUpperCase() + attr.slice(1);
            var childProps = {
              updatePlayer: parentProps['update' + capAttr].bind(null, name)
            };
            childProps[attr] = attr === 'difficulty' ? { level: player[attr], levels: parentProps.levels } : attr === 'name' ? name : player[attr];

            tds.push(
              <td key={ attr + '-' + player.token }>
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
          { headerRow.concat(<tbody key='players-rows'>{ playersRows }</tbody>) }
        </table>
      ];
    }

    return(
      <div className='players-wrap'>
        { playersTable.concat(parentProps.getButtons(buttons)) }
      </div>
    );
  }
});
