/* globals React */
'use strict';

var Alert = React.createClass({
  getInitialState: function() {
    return({
      classToggle: false
    });
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.toggle) {
      this.setState({
        classToggle: !this.state.classToggle
      });
    }
  },
  render: function() {
    return (
      <div className={ 'alert toggle-' + this.state.classToggle }>
        { this.props.message }
      </div>
    );
  }
});
