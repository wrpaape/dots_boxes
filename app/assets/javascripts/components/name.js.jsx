/* globals React */
'use strict';

var Name = React.createClass({
  getInitialState: function() {
    return({
      name: this.props.name
    });
  },
  render: function() {
    return(
      <input type='text' name='input' value={ this.state.name } onChange={ this.updateName } onKeyUp={ this.submit } />
    );
  },
  updateName: function(event) {
    this.setState({
      name: event.target.value
    });
  },
  submit: function(event) {
    if (event.keyCode === 13) {
      this.props.updatePlayer(this.props.name, this.state.name);
    }
  }
});
