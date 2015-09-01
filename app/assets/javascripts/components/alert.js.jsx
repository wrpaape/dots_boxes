/* globals React */
'use strict';

var Alert = React.createClass({
  render: function() {
    return (
      <div className='alert'>
        { this.props.message }
      </div>
    );
  }
});
