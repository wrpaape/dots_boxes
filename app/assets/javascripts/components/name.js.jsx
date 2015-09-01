/* globals React */
'use strict';

var Name = React.createClass({
  getInitialState: function() {
    return({
      name: this.props.name
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      name: nextProps.name
    });
  },
  render: function() {
    return(
      <input type='text' value={ this.state.name } onChange={ this.updateName } onKeyUp={ this.submitName } />
    );
  },
  updateName: function(event) {
    this.setState({
      name: event.target.value
    });
  },
  submitName: function(event) {
    if (event.keyCode === 13) {
      this.props.updatePlayer(this.props.name, this.state.name);
    }
  }
});
