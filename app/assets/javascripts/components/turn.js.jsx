/* globals React */
'use strict';

var Turn = React.createClass({
  getInitialState: function() {
    return({
      turn: this.props.turn + 1
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      turn: nextProps.turn + 1
    });
  },
  render: function() {
    var turn = this.state.turn;
    return(
      <label>
        <input type='text' value={ turn } onChange={ this.updateTurn } onKeyUp={ this.submitTurn } />
        { this.getOrdinal(turn) }
      </label>
    );
  },
  getOrdinal: function(turn) {
  return ([,'st','nd','rd'][~~(turn / 10 % 10) - 1 ? turn % 10 : 0 ] || 'th');
  },
  updateTurn: function(event) {
    this.setState({
      turn: event.target.value
    });
  },
  submitTurn: function(event) {
    if (event.keyCode === 13) {
      this.props.updatePlayer(this.props.name, this.state.turn - 1);
    }
  }
});
