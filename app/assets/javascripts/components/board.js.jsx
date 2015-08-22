/* globals React */
'use strict';

var Board = React.createClass({
  getInitialState: function() {
    var rows = this.props.grid.rows;
    var cols = this.props.grid.cols;
    var player1 = this.props.players[0];
    var board = [];
    for (var i = 0; i < 2 * rows + 1; i++) {
      var numLines = i % 2 === 0 ? cols : cols + 1;
      board[i] = new Array(numLines);
      for (var j = 0; j < numLines; j++) {
        board[i][j] = 0;
      }
    }

    return({
      board: board,
      turn: player1
    });
  },
  render: function() {
    var board = this.state.board;
    var rows = [];
    for (var i = 0; i < board.length; i++) {
      var lines = [];
      var alignment = i % 2 === 0 ? 'horiz' : 'vert';
      for (var j = 0; j < board[i].length; j++) {
        var className = alignment;
        if (board[i][j] > 0) {
          className += ' player';
        } else if (board[i][j] < 0) {
          className += ' computer';
        }
        lines.push(<hr key={ 'line-' + i + '-' + j } className={ className } />);
      }
      rows.push(<div key={ 'row-' + i } className='row'>{ lines }</div>);
    }

    return(
      <div className='board'>
        { rows }
      </div>
    )
  }
});
