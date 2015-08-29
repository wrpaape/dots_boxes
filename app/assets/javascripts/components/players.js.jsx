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
        func: this.clearPlayers,
        args: []
      },
      'scramble players': {
        func: this.scramblePlayers,
        args: []
      }
    };
    var allPlayers = turns.map(function(name) {
      <tr key={ name }>
        <td>{ name }</td>
        <td></td>
        <td></td>
      </tr>
    });

    var buttons =

    return(
      <div className='players-wrap'>
        <table className='players-table'>
          <tr>
            <th>name</th>
            <th>handicap</th>
          </tr>
          { allPlayers }
        </table>
        { buttons }
      </div>
    );
  }
});
