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

    var headers = ['name', 'turn', 'handicap'];
    var ths = headers.map(function(header) {
      return <th key={ header }>{ header }</th>;
    });
    var headerRow = [<tr key='header-row'>{ ths }</tr>];

    var parentProps = this.props;
    var playersRows = turns.map(function(name, i) {
      var player = players[name];
      var tds = [<td key={ 'remove-' + i } onClick={ removePlayer.bind(null, name) }>X</td>];
      ['name'].concat(Object.keys(player)).forEach(function(attr) {
        if (headers.concat('difficulty').indexOf(attr) !== -1) {
          var capAttr = attr.charAt(0).toUpperCase() + attr.slice(1);
          var childProps = {
            name: name,
            updatePlayer: parentProps['update' + capAttr]
          };
          if (attr !== 'name') {
            childProps[attr] = player[attr];
          }

          tds.push(
            <td key={ attr }>
              { React.createElement(window[capAttr], childProps) }
            </td>
          );
        }
      });

      return <tr key={ 'row-' + i }>{ tds }</tr>;
    });

    return(
      <div className='players-wrap'>
        <table className='players-table'>
          <tbody>
            { headerRow.concat(playersRows) }
          </tbody>
        </table>
        { this.props.getButtons(buttons) }
      </div>
    );
  }
});
