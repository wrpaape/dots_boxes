/* globals React */
'use strict';

var Turn = React.createClass({
  getInitialState: function() {
    return({
      dispTurn: (this.props.turn + 1).toString()
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      dispTurn: (nextProps.turn + 1).toString()
    });
  },
  render: function() {
    var dispTurn = this.state.dispTurn;
    return(
      <label>
        <input type='text' size={ dispTurn.length || 1 } value={ dispTurn } onChange={ this.updateTurn } onKeyUp={ this.submitTurn } />
        { this.getOrdinal(dispTurn) }
      </label>
    );
  },
  getOrdinal: function(dispTurn) {
    return [, 'st', 'nd', 'rd'][~~(dispTurn / 10 % 10) - 1 ? dispTurn % 10 : 0 ] || 'th';
  },
  updateTurn: function(event) {
    this.setState({
      dispTurn: event.target.value
    });
  },
  submitTurn: function(event) {
    if (event.keyCode === 13) {
      var newTurn = this.state.dispTurn - 1;
      newTurn || newTurn === 0 ? this.props.updatePlayer(newTurn) : this.setState({ dispTurn: (this.props.turn + 1).toString() });
    }
  }
});
