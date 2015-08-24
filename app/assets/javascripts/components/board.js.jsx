/* globals React */
'use strict';

var Board = React.createClass({
  getInitialState: function() {
    var turn = this.props.players[0];
    var rows = this.props.rows;
    var cols = this.props.cols;
    var lines = [], openLines = [], boxes = [], openBoxes = [];
    for (var i = 0; i < 2 * rows + 1; i++) {
      var numLines = cols;
      var m = (i - 1) / 2;
      if (i % 2 !== 0) {
        numLines++;
        boxes[m] = new Array(cols);
      }
      lines[i] = new Array(numLines);
      for (var j = 0; j < numLines; j++) {
        lines[i][j] = 0;
        openLines.push([i, j]);
        if (i % 2 !== 0 && j < cols) {
          var n = j;
          boxes[m][n] = 0;
          openBoxes.push([m, n]);
        }
      }
    }
    return({
      turn: turn,
      lines: lines,
      openLines: openLines,
      selectedLines: [],
      boxes: boxes,
      openBoxes: openBoxes,
      closedBoxes: [],
      winner: ''
    });
  },
  componentDidUpdate: function() {
    var turn = this.state.turn;
    if (turn !== 0) {
      this.checkGameover();
    }
    if (turn === -1) {
      var lines = this.state.lines;
      var i, j;
      do {
        i = Math.floor(Math.random() * lines.length);
        j = Math.floor(Math.random() * lines[i].length);
      } while (lines[i][j] !== 0);
      this.selectLine(i, j);
    }
  },
  render: function() {
    var turn = this.state.turn;
    var lines = this.state.lines;
    var boxes = this.state.boxes;
    var winner = this.state.winner;
    var rows = [];
    for (var i = 0; i < lines.length; i++) {
      var rowLines = [];
      var alignment = i % 2 === 0 ? 'horiz' : 'vert';
      for (var j = 0; j < lines[i].length; j++) {
        var className = alignment;
        switch (lines[i][j]) {
          case 1:
            className += ' player';
            break;
          case -1:
            className += ' computer';
            break;
          default:
            className += ' open';
        }
        rowLines.push(<hr key={ 'line-' + i + '-' + j } className={ className } onClick={ this.selectLine.bind(this, i, j) } />);
        if (alignment === 'vert' && j < lines[i].length - 1) {
          var m = (i - 1) / 2;
          var n = j;
          var className;
          switch (boxes[m][n]) {
            case 1:
              className = 'player';
              break;
            case -1:
              className = 'computer';
              break;
            default:
              className = 'open';
          }
          rowLines.push(<div key={ 'box-' + m + '-' + n } className={ className } />);
        }
      }
      rows.push(<div key={ 'row-' + i } className='row'>{ rowLines }</div>);
    }
    var gameover = turn === 0 ? ' gameover' : '';
    var gameoverText = winner === 'tie' ? 'tie game' : winner + ' wins';
    return(
      <div className='board' >
        <div className={ 'gameover-text' + gameover }>
          { gameoverText }
        </div>
        <div className={ 'rows' + gameover }>
          { rows }
        </div>
      </div>
    )
  },
  // updateBoxes: function(lines) {
  //   var rows = this.props.rows;
  //   var cols = this.props.cols;
  //   var boxes = [];
  //   for (var m = 0; m < rows; m++) {
  //     var i = 2 * m + 1;
  //     boxes[m] = new Array(cols);
  //     for (var n = 0; n < cols; n++) {
  //       var j = n;
  //       boxes[m][n] = lines[i - 1][j] + lines[i][j] + lines[i][j + 1] + lines[i + 1][j];
  //     }
  //   }
  //   return boxes;
  // },
  selectLine: function(i, j) {
    var lines = this.state.lines;
    if (lines[i][j] === 0) {
      var turn = this.state.turn;
      var openLines = this.state.openLines;
      var selectedLines = this.state.selectedLines;
      var boxes = this.state.boxes;
      var openBoxes = this.state.openBoxes;
      var closedBoxes = this.state.closedBoxes;
      var m = (i - 1) / 2;
      var n = j;

      lines[i][j] = turn;
      for (var x = 0; x < openLines.length; x++) {
        if (openLines[x][0] === i && openLines[x][1] === j) {
          openLines.splice(x, 1);
          break;
        }
      };
      selectedLines.push([i, j]);
      boxes[m][n]++;

      if (i % 2 !== 0 && m >= 1) {
        boxes[m - 1][n]++;
      } else if (n >= 1) {
        boxes[m][n - 1]++;
      }

      // var closeCount = 0;
      // for (var y = 0;, y < openBoxes.length; y++) {
      //   var my = openBoxes[y][0];
      //   var ny = openBoxes[y][1];
      //   if ((i % 2 !== 0 && ny === n && (my === m || my === m - 1)) || (my === m && (ny === n || ny === n - 1))) {
      //     var borderCount = 0;
      //     linefor (var x = 0;, x < selectedLines.length; x++) {
      //       if (line === [i - 1, j] || line === [i, j] || line === [i, j + 1] || line === [i + 1, j]) {
      //         borderCount++;
      //         if (borderCount === 4) {
      //           closedBoxes.push([my, ny]);
      //           openBoxes.splice(y, 1);
      //           break;
      //         }
      //       }
      //     }
      //   }
      // };



      this.setState({
        turn: -turn,
        lines: lines,
        openLines: openLines,
        boxes: boxes,
        openBoxes: openBoxes
      })
    }
  },
  checkGameover: function() {
    var lines = this.state.lines;
    var flatLines = lines.reduce(function(a, b) {
      return a.concat(b);
    });
    if (flatLines.indexOf(0) === -1) {
      var boxes = this.state.boxes;
      var numPlayer = 0, numComputer = 0;
      for (var m = 0; m < boxes.length; m++) {
        for (var n = 0; n < boxes[m].length; n++) {
          switch (boxes[m][n]) {
            case 4:
              numPlayer++;
              break;
            case -4:
              numComputer++;
          }
        }
      }
      var winner;
      if (numPlayer === numComputer) {
        winner = 'tie';
      } else {
        winner = numPlayer > numComputer ? 'player' : 'computer';
      }
      this.setState({
        turn: 0,
        winner: winner
      })
    }
  }
});
