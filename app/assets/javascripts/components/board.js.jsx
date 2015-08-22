/* globals React */
'use strict';

var Board = React.createClass({
  getInitialState: function() {
    var rows = this.props.grid.rows;
    var cols = this.props.grid.cols;
    var board = [];
    for (var i = 0; i < cols; i++) {
      board[i] = new Array(rows);
      for (var j = 0; j < rows; j++) {
        board[i][j] = 0;
      }
    }

    return({ board: board });
  },
  render: function() {
    var rows = this.props.grid.rows;
    var cols = this.props.grid.cols;

    return(
      <div>
        { rows }
      </div>
    )
  }
});
