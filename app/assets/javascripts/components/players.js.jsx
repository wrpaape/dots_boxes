/* globals React */
'use strict';

var Players = React.createClass({
  render: function() {
    var players = this.props.players;
    var turns = this.props.turns;
    var buttons = {
      'add player': {
        callBack: {
          func: this.props.addPlayer,
          args: [{}]
        }
      },
      'add computer': {
        callBack: {
          func: this.props.addPlayer,
          args: [{ difficulty: undefined }]
        }
      },
      'clear players': {
        callBack: {
          func: this.props.clearPlayers,
          args: []
        }
      },
      'scramble players': {
        callBack: {
          func: this.props.shufflePlayers,
          args: []
        }
      }
    };

    var allPlayers = turns.map(function(name) {
      return (
        <tr key={ name }>
          <td>{ name }</td>
          <td>{ players[name].handicap }</td>
        </tr>
      );
    });

    return(
      <div className='players-wrap'>
        <table className='players-table'>
          <tbody>
            <tr>
              <th>name</th>
              <th>handicap</th>
            </tr>
            { allPlayers }
          </tbody>
        </table>
        { this.props.getButtons(buttons) }
      </div>
    );
  }
});
