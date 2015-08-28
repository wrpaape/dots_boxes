/* globals React */
'use strict';

var Index = React.createClass({
  getInitialState: function() {
    return({
      selected: 0,
      playing: 0
    });
  },
  render: function() {
    var games = this.props.games;
    var selected = this.state.selected;
    var index = games.map(function(game) {
      var id = game.id;
      return(
        <div key={ id } className='show-wrap'>
          <div className='show-title' onClick={ this.selectGame.bind(this, id) }>
            { game.title }
          </div>
          <div className={ 'show-component ' + selected === id }>
            <Show game={ game } startGame={ this.startGame } />
          </div>
        </div>
      );
    });

    return(
      <div className='index-wrap'>
        { index }
      </div>
    );
  },
  selectGame: function(id) {
    this.setState({
      selected: id
    })
  },
  startGame: function(id) {
    this.setState({
      playing: id
    })
  }
});
