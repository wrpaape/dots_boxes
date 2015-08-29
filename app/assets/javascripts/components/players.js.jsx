/* globals React */
'use strict';

var Players = React.createClass({
  render: function() {
    var players = this.props.players;
    var turns = this.props.turns;
    var buttons = {
      'add player': {
        func: this.props.addPlayer,
        args: [{}]
      },
      'add computer': {
        func: this.props.addPlayer,
        args: [{ difficulty: undefined }]
      },
      'clear players': {
        func: this.props.clearPlayers,
        args: []
      },
      'scramble players': {
        func: this.props.shufflePlayers,
        args: []
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
          <tr>
            <th>name</th>
            <th>handicap</th>
          </tr>
          { allPlayers }
        </table>
        { this.props.getButtons(buttons) }
      </div>
    );
  }
});
