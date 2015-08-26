/* globals React */
'use strict';

var Board = React.createClass({
  getInitialState: function() {
    var turn = this.props.players[0];
    var rows = this.props.rows;
    var cols = this.props.cols;
    var lines = [], openLines = [], boxes = [];
    var linesByPriority = [[], [], [], [], [], []];
    var boxesByScore = [[], [], [], [], []];
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
        linesByPriority[3].push([i, j]);
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
      linesByPriority: linesByPriority,
      boxes: boxes,
      boxesScore: $.extend(true, [], boxes),
      boxesByScore: boxesByScore,
      player: 0,
      computer: 0,
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
        var boxesByScore = this.state.boxesByScore;
        var bestMove = this.getBestMove(openLines.slice(), boxesByScore[3].slice());

        // console.log(nextMoves);

        // var k = Math.floor(Math.random() * openLines.length);
        // var i = openLines[k][0];
        // var j = openLines[k][1];
        this.selectLine(bestMove[0], bestMove[1], true);
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
        rowLines.push(<hr key={ 'line-' + i + '-' + j } className={ className } onClick={ this.selectLine.bind(this, i, j, true) } />);
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
  selectLine: function(i, j, shouldUpdate) {
    var lines = this.state.lines;
    if (lines[i][j] === 0) {
      var turn = this.state.turn;
      var openLines = this.state.openLines;
      var linesByPriority = this.state.linesByPriority;
      var boxesScore = this.state.boxesScore;
      var m = Math.floor(i / 2);
      var n = j;
      var num2s = 0, num3s = 0;

      this.removeCoords(openLines, i, j);
      lines[i][j] = turn;
      for (var z = 0; z < 2; z++) {
        if (z > 0) {
          i % 2 === 0 ? m-- : n--;
        }
        if (m >= 0 && m < boxesScore.length && n >= 0 && n < boxesScore[m].length) {
          if (boxesScore[m][n] > 1) {
            boxesScore[m][n] == 2 ? num2s++ : num3s++;
          }
          oldScores.push(boxesScore[m][n]);
          this.updateBoxes(turn, boxesScore, m, n);
        }
      }

      var oldPriority = this.getOldPriority(num2s, num3s);


      this.setState({
        turn: -turn,
        lines: lines,
        openLines: openLines,
        linesByPriority: linesByPriority,
        shouldUpdate: shouldUpdate
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
  updateBoxes: function(turn, boxesScore, m, n) {
    var boxes = this.state.boxes;
    var boxesByScore = this.state.boxesByScore;
    var player = this.state.player;
    var computer = this.state.computer;
    var score = boxesScore[m][n];
    if (score === 3) {
      boxes[m][n] = turn;
      turn === 1 ? player++ : computer++;
    }

    this.removeCoords(boxesByScore[score], m, n);
    boxesByScore[score + 1].push([m, n]);
    boxesScore[m][n]++;

    this.setState({
      boxes: boxes,
      boxesScore: boxesScore,
      boxesByScore: boxesByScore,
      player: player,
      computer: computer,
      shouldUpdate: false
    });
  },
  getOldPriority: function(num2s, num3s) {
    var oldPriority;
    if (num2s === 0 && num3s === 2) {
      oldPriority = 0;
    } else if (num2s === 0 && num3s === 1) {
      oldPriority = 1;
    } else if (num2s === 1 && num3s === 1) {
      oldPriority = 2;
    } else if (num2s === 0 && num3s === 0) {
      oldPriority = 3;
    } else if (num2s === 1 && num3s === 0) {
      oldPriority = 4;
    } else if (num2s === 2 && num3s === 0) {
      oldPriority = 5;
    }

    return oldPriority;
  },
  getBestMove: function(openLines, boxes3) {
    if (boxes3.length > 0) {

    }
    //  var nextMoves = [];
    //   while (openLines.length > 1) {
    //     var move = openLines.pop();
    //     this.getBestMove(openLines.slice());
    //     nextMoves.push({
    //       move: move,
    //       bestScore: this.getBestScore(move, copy)
    //     });
    //   }

    //   nextMoves.sort(function(a, b) {
    //     return b.bestScore - a.bestScore;
    //   });
    // while (openLines.length > 0) {

    // }
    return bestMove;
  },
  renderGameover: function() {
    var player = this.state.player;
    var computer = this.state.computer;
    var winner;
    if (player === computer) {
      winner = 'tie';
    } else {
      winner = player > computer ? 'player' : 'computer';
    }

    this.setState({
      turn: 0,
      winner: winner,
      shouldUpdate: true
    });
  }
});
