/* globals React */
'use strict';

var Handicap = React.createClass({
  getInitialState: function() {
    return({
      dispHandicap: this.props.handicap.toString()
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      dispHandicap: nextProps.handicap.toString()
    });
  },
  render: function() {
    var dispHandicap = this.state.dispHandicap;
    return(
      <input type='text' size={ dispHandicap.length || 1 } value={ dispHandicap } onChange={ this.updateHandicap } onKeyUp={ this.submitHandicap } />
    );
  },
  updateHandicap: function(event) {
    this.setState({
      dispHandicap: event.target.value
    });
  },
  submitHandicap: function(event) {
    if (event.keyCode === 13) {
      this.props.updatePlayer(this.props.name, this.state.dispHandicap - 0);
    }
  }
});
