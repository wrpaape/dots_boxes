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
      <div>
        <label>
          <input type='text' size={ dispTurn.length || 1 } value={ dispTurn } className='hover-child' onChange={ this.updateTurn } onKeyUp={ this.submitTurn } onBlur={ this.submitTurn } />
          { this.getOrdinal(dispTurn) }
        </label>
        <span onMouseLeave={ this.submitIncrements }>
          <span className='cursor-pointer hover-child' onClick={ this.incrementTurn.bind(this, 1) }>
            ▲
          </span>
          <span className='cursor-pointer hover-child' onClick={ this.incrementTurn.bind(this, -1) }>
            ▼
          </span>
        </span>
      </div>
    );
  },
  getOrdinal: function(dispTurn) {
    return [, 'st', 'nd', 'rd'][~~(dispTurn / 10 % 10) - 1 ? dispTurn % 10 : 0 ] || 'th';
  },
  updateTurn: function(event) {
    var newTurn = event.target.value;
    if (!isNaN(newTurn)) {
      this.setState({
        dispTurn: newTurn
      });
    }
  },
  submitTurn: function(event) {
    if (event.type === 'blur' || event.keyCode === 13) {
      var newTurn = this.state.dispTurn - 1;
      newTurn || newTurn === 0 ? this.props.updatePlayer(newTurn) : this.setState({ dispTurn: (this.props.turn + 1).toString() });
    }
  },
  incrementTurn: function(inc) {
    this.setState({
      dispTurn: (this.state.dispTurn - 0 + inc).toString()
    });
  },
  submitIncrements: function() {
    this.props.updatePlayer(this.state.dispTurn - 1);
  }
});
