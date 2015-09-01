/* globals React */
'use strict';

var Handicap = React.createClass({
  getInitialState: function() {
    return({
      handicap: this.props.handicap
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      handicap: nextProps.handicap
    });
  },
  render: function() {
    return(
      <input type='text' value={ this.state.handicap } onChange={ this.updateHandicap } onKeyUp={ this.submitHandicap } />
    );
  },
  updateHandicap: function(event) {
    this.setState({
      handicap: event.target.value
    });
  },
  submitHandicap: function(event) {
    if (event.keyCode === 13) {
      this.props.updatePlayer(this.props.name, parseInt(this.state.handicap));
    }
  }
});
