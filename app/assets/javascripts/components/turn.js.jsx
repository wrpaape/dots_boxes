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
    return(
      <input type='text' value={ this.state.turn } onChange={ this.updateTurn } onKeyUp={ this.submitTurn } />
    );
  },
  updateTurn: function(event) {
    this.setState({
      turn: event.target.value
    });
  },
  submitTurn: function(event) {
    if (event.keyCode === 13) {
      this.props.updatePlayer(this.props.name, parseInt(this.state.turn) - 1);
    }
  }
});
