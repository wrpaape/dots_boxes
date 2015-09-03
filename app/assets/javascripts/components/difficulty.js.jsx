/* globals React */
'use strict';

var Difficulty = React.createClass({
  getInitialState: function() {
    return({
      level: this.props.difficulty.level
    });
  },
  render: function() {
    var levels = this.props.difficulty.levels;
    var level = this.state.level;
    var start = 0;
    var finish = levels;
    if (levels === 2) {
      start++;
      finish++;
    }

    var options = ['easy', 'normal', 'hard'].slice(start, finish).map(function(level) {
      return(
        <option key={ level } value={ level }>
          { level }
        </option>
      );
    });

    return(
      <select className='cursor-pointer hover-child' defaultValue={ level } onChange={ this.submitDifficulty }>
        { options }
      </select>
    );
  },
  submitDifficulty: function(event) {
    this.props.updatePlayer(event.target.value);
  }
});
