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
      boxes: boxes,
      boxesScore: $.extend(true, [], boxes),
      openBoxes: openBoxes,
      boxesByScore: [$.extend(true, [], openBoxes), [], [] , [], []],
      boxesClosed: { player: 0, computer: 0 },
      winner: '',
      shouldUpdate: true
    });
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextState.shouldUpdate;
  },
  componentDidUpdate: function() {
    this.checkGameover();
    var turn = this.state.turn;
    if (turn === -1) {
      var openLines = this.state.openLines;
      var k = Math.floor(Math.random() * openLines.length);
      var i = openLines[k][0];
      var j = openLines[k][1];
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
    );
  },
  selectLine: function(i, j) {
    var lines = this.state.lines;
    if (lines[i][j] === 0) {
      var turn = this.state.turn;
      var openLines = this.state.openLines;
      var m = Math.floor(i / 2);
      var n = j;
      this.removeCoords(openLines, i, j);
      lines[i][j] = turn;
      this.updateBoxes(turn, m, n);
      if (i % 2 === 0 && m >= 1) {
        this.updateBoxes(turn, m - 1, n);
      } else if (i % 2 !== 0 && n >= 1) {
        this.updateBoxes(turn, m, n - 1);
      }

      this.setState({
        turn: -turn,
        lines: lines,
        shouldUpdate: true
      });
    }
  },
  removeCoords: function(arr, x, y) {
    for (var k = 0; k < arr.length; k++) {
      if (arr[k][0] === x && arr[k][1] === y) {
        return arr.splice(k, 1);
      }
    }
  },
  updateBoxes: function(turn, m, n) {
    var boxes = this.state.boxes;
    if (boxes[m] === undefined || boxes[m][n] === undefined) {
      return;
    }
    var boxesScore = this.state.boxesScore;
    var openBoxes = this.state.openBoxes;
    var boxesByScore = this.state.boxesByScore;
    var boxesClosed = this.state.boxesClosed;
    var score = boxesScore[m][n];
    if (score === 3) {
      this.removeCoords(openBoxes, m, n);
      boxes[m][n] = turn;
      turn === 1 ? boxesClosed.player++ : boxesClosed.computer++;
    }
    this.removeCoords(boxesByScore[score], m, n);
    console.log(m + ' ' + n);
    console.log(score + 1);
    boxesByScore[score + 1].push([m, n]);
    boxesScore[m][n]++;

    this.setState({
      boxes: boxes,
      boxesScore: boxesScore,
      openBoxes: openBoxes,
      boxesByScore: boxesByScore,
      boxesClosed: boxesClosed,
      shouldUpdate: false
    });
  },
  checkGameover: function() {
    var openBoxes = this.state.openBoxes;
    if (openBoxes.length === 0) {
      var boxesClosed = this.state.boxesClosed;
      var playerScore = boxesClosed.player;
      var computerScore = boxesClosed.computer;
      var winner;
      if (playerScore === computerScore) {
        winner = 'tie';
      } else {
        winner = playerScore > computerScore ? 'player' : 'computer';
      }

      this.setState({
        turn: 0,
        winner: winner,
        shouldUpdate: true
      });
    }
  }
});
