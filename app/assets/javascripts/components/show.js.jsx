/* globals React */
'use strict';

var Show = React.createClass({
  getInitialState: function() {
    return({
      buttonSelected: ''
    });
  },
  render: function() {
    var game = this.props.game;
    var goBack = this.props.goBack;
    var startGame = this.props.startGame;
    var stopGame = this.props.stopGame;
    var buttonSelected = this.state.buttonSelected;

    var buttons = {
      'rules': { rules: game.rules },
      'players': { player: game.spec.player, computer: game.spec.computer },
      'play': { startGame: startGame },
      'back': { goBack: goBack }
    };
    var allButtons = Object.keys(buttons).map(function(button) {
      var component = button.charAt(0).toUpperCase() + button.slice(1);
      var className = button + ' ' + (button === buttonSelected);

      return(
        <div key={ button } className={ className }>
          React.createElement(window[component], buttons[button] )
        </div>
      );
    });

    return(
      <div className='show-wrap'>
        { allButtons }
      </div>
    );
  }
});
