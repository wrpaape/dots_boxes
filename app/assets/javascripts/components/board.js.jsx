/* globals React */
'use strict';

var Board = React.createClass({
  getInitialState: function() {
    var turn = this.props.players[0];
    var rows = this.props.grid.rows;
    var cols = this.props.grid.cols;
    var lines = [];
    for (var i = 0; i < 2 * rows + 1; i++) {
      var numLines = i % 2 === 0 ? cols : cols + 1;
      lines[i] = new Array(numLines);
      for (var j = 0; j < numLines; j++) {
        lines[i][j] = 0;
      }
    }
    var boxes = this.getBoxes(lines);
    return({
      turn: turn,
      lines: lines,
      boxes: boxes
    });
  },
  render: function() {
    var lines = this.state.lines;
    var boxes = this.state.boxes;
    var rows = [];
    for (var i = 0; i < lines.length; i++) {
      var rowLines = [];
      var alignment = i % 2 === 0 ? 'horiz' : 'vert';
      for (var j = 0; j < lines[i].length; j++) {
        var className = alignment;
        if (lines[i][j] > 0) {
          className += ' player';
        } else if (lines[i][j] < 0) {
          className += ' computer';
        } else {
          className += ' open';
        }
        rowLines.push(<hr key={ 'line-' + i + '-' + j } className={ className } onClick={ this.handleClick.bind(this, i, j) } />);
        if (alignment === 'vert' && j < lines[i].length - 1) {
          var m = (i - 1) / 2;
          var n = j;
          var className;
          if (boxes[m][n] === 4) {
            className = 'player';
          } else if (boxes[m][n] === -4) {
            className = 'computer';
          } else {
            className = 'open';
          }
          rowLines.push(<div key={ 'box-' + m + '-' + n } className={ className } />);
        }
      }
      rows.push(<div key={ 'row-' + i } className='row'>{ rowLines }</div>);
    }

    return(
      <div className='board'>
        { rows }
      </div>
    )
  },
  getBoxes: function(lines) {
    var rows = this.props.grid.rows;
    var cols = this.props.grid.cols;
    var boxes = [];
    for (var m = 0; m < rows; m++) {
      var i = 2 * m;
      boxes[m] = new Array(cols);
      for (var n = 0; n < cols; n++) {
        var j = n;
        boxes[m][n] = lines[i][j] + lines[i + 1][j] + lines[i + 1][j + 1] + lines[i + 2][j];
      }
    }
    return boxes;
  },
  handleClick: function(i, j) {
    var turn = this.state.turn;
    var lines = this.state.lines;
    lines[i][j] = turn;
    var boxes = this.getBoxes(lines);
    this.setState({
      turn: -turn,
      lines: lines,
      boxes: boxes
    })
  }
});
