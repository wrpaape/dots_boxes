/* globals React */
'use strict';

var Rules = React.createClass({
  render: function() {
    var rules = this.props.rules;

    return (
      <div className='rules'>
        { rules }
      </div>
    );
  }
});
