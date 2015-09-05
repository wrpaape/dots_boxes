/* globals React */
'use strict';

var Board = React.createClass({
  getInitialState: function() {
    return this.getDispBoard(this.props);
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getDispBoard(nextProps));
  },
  render: function() {
    var dispBoard = this.state;
    var inputs = Object.keys(dispBoard).map(function(dim) {
      return(
        <td key={ dim } className='dimension'>
          <label>
            { dim + ': ' }
            <input type='text' size={ dispBoard[dim].length || 1 } value={ dispBoard[dim] } className='hover-child' onChange={ this.updateBoard.bind(this, dim) } onKeyUp={ this.submitBoard } onBlur={ this.submitBoard } />
          </label>
          <span onMouseLeave={ this.submitIncrements }>
            <span className='cursor-pointer hover-child' onClick={ this.incrementDim.bind(this, dim, 1) }>
              ▲
            </span>
            <span className='cursor-pointer hover-child' onClick={ this.incrementDim.bind(this, dim, -1) }>
              ▼
            </span>
          </span>
        </td>
      );
    }.bind(this));

    return(
      <table>
        <tbody>
          <tr>
            { inputs }
          </tr>
        </tbody>
      </table>
    );
  },
  getDispBoard: function(props) {
    var board = props.board;
    var dispBoard = {};
    Object.keys(board).forEach(function(dim) {
      dispBoard[dim] = board[dim].toString();
    });

    return dispBoard;
  },
  getBoard: function() {
    var dispBoard = this.state;
    var board = {};
    Object.keys(dispBoard).forEach(function(dim) {
      board[dim] = dispBoard[dim] - 0;
    });

    return board;
  },
  updateBoard: function(dim, event) {
    var newDim = event.target.value;
    if (!isNaN(newDim)) {
      this.state[dim] = newDim;
      this.setState(this.state);
    }
  },
  submitBoard: function(event) {
    if (event.type === 'blur' || event.keyCode === 13) {
      this.props.updateBoard(this.getBoard());
    }
  },
  incrementDim: function(dim, inc) {
    this.state[dim] = (this.state[dim] - 0 + inc).toString();
    this.setState(this.state);
  },
  submitIncrements: function() {
    this.props.updateBoard(this.getBoard());
  }
});
