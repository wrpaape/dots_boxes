/* globals React */
'use strict';

var DotsBoxes = React.createClass({
  getInitialState: function() {
    var spec = this.props.spec;
    var dimensions = spec.layout.dimensions;
    var rows = dimensions[0].max;
    var cols = dimensions[1].max;
    var turn = 1;
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
      winner: ''
    });
  },
  componentDidUpdate: function() {
    var turn = this.state.turn;
    var openLines = this.state.openLines;
    if (openLines.length > 0) {
      if (turn === -1) {
        var bestMove = this.getBestMove();
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
  selectLine: function(i, j) {
    var lines = this.state.lines;
    if (lines[i][j] === 0) {
      var turn = this.state.turn;
      var openLines = this.state.openLines;
      var linesByPriority = this.state.linesByPriority;
      var boxesScore = this.state.boxesScore;
      var oldBoxesScore = boxesScore.map(function(boxes) {
        return boxes.slice();
      });
      this.removeCoords(openLines, i, j);
      lines[i][j] = turn;
      var neighbors = this.getNeighbors(boxesScore, i, j);

      neighbors.forEach(function(box) {
        this.updateBoxes(turn, boxesScore, box[0], box[1]);
      }.bind(this));
      var bumpLines = this.getBumpLines(neighbors, openLines);
      this.updatePriorities(linesByPriority, bumpLines, [i, j], oldBoxesScore, boxesScore);

      this.setState({
        turn: -turn,
        lines: lines,
        openLines: openLines,
        linesByPriority: linesByPriority
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
  getNeighbors: function(boxesScore, i, j) {
    var m = Math.floor(i / 2);
    var n = j;
    var neighbors = [];
    for (var z = 0; z < 2; z++) {
      if (z > 0) {
        i % 2 === 0 ? m-- : n--;
      }
      if (m >= 0 && m < boxesScore.length && n >= 0 && n < boxesScore[m].length) {
        neighbors.push([m, n]);
      }
    }
    return neighbors;
  },
  getBumpLines: function(neighbors, openLines) {
    var allBorders = [];
    neighbors.forEach(function(box) {
      var i = 2 * box[0] + 1;
      var j = box[1];
      allBorders.concat([[i - 1, j], [i, j], [i, j + 1], [i + 1, j]]);
    });

    return allBorders && openLines;
  },
  updateBoxes: function(turn, boxesScore, m, n) {
    var boxes = this.state.boxes;
    var boxesByScore = this.state.boxesByScore;
    var score = boxesScore[m][n];
    if (score === 3) {
      boxes[m][n] = turn;
    }
    this.removeCoords(boxesByScore[score], m, n);
    boxesByScore[score + 1].push([m, n]);
    boxesScore[m][n]++;

    this.setState({
      boxes: boxes,
      boxesScore: boxesScore,
      boxesByScore: boxesByScore,
    });
  },
  updatePriorities: function(linesByPriority, bumpLines, dropLine, oldBoxesScore, boxesScore) {
    var i = dropLine[0];
    var j = dropLine[1];
    var neighbors = this.getNeighbors(boxesScore, i, j);
    var oldNums = this.getNums(neighbors, oldBoxesScore);
    var oldPriority = this.getPriority(oldNums[0], oldNums[1]);
    this.removeCoords(linesByPriority[oldPriority], i, j);

    bumpLines.forEach(function(line) {
      var i = line[0];
      var j = line[1];
      var neighbors = this.getNeighbors(boxesScore, i, j);
      var oldNums = this.getNums(neighbors, oldBoxesScore);
      var oldPriority = this.getPriority(oldNums[0], oldNums[1]);
      var nums = this.getNums(neighbors, boxesScore);
      var priority = this.getPriority(nums[0], nums[1]);
      this.removeCoords(linesByPriority[oldPriority], i, j);
      linesByPriority[priority].push([i, j]);
    }.bind(this));

    return linesByPriority;
  },
  getNums: function(neighbors, boxesScore) {
    var num2s = 0, num3s = 0;
    neighbors.forEach(function(box) {
      var m = box[0];
      var n = box[1];
      var score = boxesScore[m][n];
      if (score > 1) {
        score === 2 ? num2s++ : num3s++;
      }
    });

    return [num2s, num3s];
  },
  getPriority: function(num2s, num3s) {
    if (num2s === 0 && num3s === 2) {
      return 0;
    } else if (num2s === 0 && num3s === 1) {
      return 1;
    } else if (num2s === 1 && num3s === 1) {
      return 2;
    } else if (num2s === 0 && num3s === 0) {
      return 3;
    } else if (num2s === 1 && num3s === 0) {
      return 4;
    } else if (num2s === 2 && num3s === 0) {
      return 5;
    }
  },
  getBestMove: function() {
    var linesByPriority = this.state.linesByPriority;
    for (var priority = 0; priority < 6; priority++) {
      var moves = linesByPriority[priority];
      if (moves.length > 0) {
        return moves[0];
      }
    }
  },
  renderGameover: function() {
    var boxes = this.state.boxes;
    var sum = 0;
    boxes.forEach(function(row) {
      row.forEach(function(box) {
        sum += box;
      })
    });

    var winner;
    if (sum === 0) {
      winner = 'tie';
    } else {
      winner = sum > 0 ? 'player' : 'computer';
    }

    this.setState({
      turn: 0,
      winner: winner
    });
  }
});
