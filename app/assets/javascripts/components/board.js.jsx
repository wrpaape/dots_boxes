/* globals React */
'use strict';

var Board = React.createClass({
  getInitialState: function() {
    var turn = this.props.players[0];
    var rows = this.props.rows;
    var cols = this.props.cols;
    var lines = [], openLines = [], boxes = [], boxesByScore = [[], [], [], [], []];
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
          boxesByScore[0].push([m, n]);
        }
      }
    }

    return({
      turn: turn,
      lines: lines,
      openLines: openLines,
      boxes: boxes,
      boxesScore: $.extend(true, [], boxes),
      boxesByScore: boxesByScore,
      boxesClosed: { player: 0, computer: 0 },
      winner: '',
      shouldUpdate: true
    });
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextState.shouldUpdate;
  },
  componentDidUpdate: function() {
    var turn = this.state.turn;
    var openLines = this.state.openLines;
    if (openLines.length > 0) {
      if (turn === -1) {
        var openLines = this.state.openLines;
        var k = Math.floor(Math.random() * openLines.length);
        var i = openLines[k][0];
        var j = openLines[k][1];
        this.selectLine(i, j);
      }
    } else if (turn !== 0) {
      this.renderGameover();
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
      if (i % 2 === 0) {
        this.updateBoxes(turn, m - 1, n);
      } else {
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
    if (m >= 0 && m < boxes.length && n >= 0 && n < boxes[m].length) {
      var boxesScore = this.state.boxesScore;
      var boxesByScore = this.state.boxesByScore;
      var boxesClosed = this.state.boxesClosed;
      var score = boxesScore[m][n];
      if (score === 3) {
        boxes[m][n] = turn;
        turn === 1 ? boxesClosed.player++ : boxesClosed.computer++;
      }
      this.removeCoords(boxesByScore[score], m, n);
      boxesByScore[score + 1].push([m, n]);
      boxesScore[m][n]++;

      this.setState({
        boxes: boxes,
        boxesScore: boxesScore,
        boxesByScore: boxesByScore,
        boxesClosed: boxesClosed,
        shouldUpdate: false
      });
    }
  },
  renderGameover: function() {
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
});
