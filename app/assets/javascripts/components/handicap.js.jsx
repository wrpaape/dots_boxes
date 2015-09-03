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
      <label>
        <input type='text' size={ dispHandicap.length || 1 } value={ dispHandicap } className='hover-child' onChange={ this.updateHandicap } onKeyUp={ this.submitHandicap } />
        <span className='cursor-pointer hover-child' onClick={ this.incrementHandicap.bind(this, 1) }>
          ▲
        </span>
        <span className='cursor-pointer hover-child' onClick={ this.incrementHandicap.bind(this, -1) }>
          ▼
        </span>
      </label>
    );
  },
  updateHandicap: function(event) {
    this.setState({
      dispHandicap: event.target.value
    });
  },
  submitHandicap: function(event) {
    if (event.keyCode === 13) {
      this.props.updatePlayer(this.state.dispHandicap - 0);
    }
  },
  incrementHandicap: function(inc) {
    this.props.updatePlayer(this.state.dispHandicap - 0 + inc);
  }
});
