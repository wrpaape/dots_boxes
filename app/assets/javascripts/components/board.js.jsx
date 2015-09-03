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
      return(<label key={ dim } className='dimension'>
        { dim + ': ' }
        <input type='text' size={ dispBoard[dim].length || 1 } value={ dispBoard[dim] } className='hover-child' onChange={ this.updateBoard.bind(this, dim) } onKeyUp={ this.submitBoard } />
      </label>);
    }.bind(this));

    return(
      <div>
        { inputs }
      </div>
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
  updateBoard: function(dim, event) {
    this.state[dim] = event.target.value;

    this.setState(this.state);
  },
  submitBoard: function(event) {
    if (event.keyCode === 13) {
      var dispBoard = this.state;
      var board = {};
      Object.keys(dispBoard).forEach(function(dim) {
        board[dim] = dispBoard[dim] - 0;
      });

      this.props.updateBoard(board);
    }
  }
});
