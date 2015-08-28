/* globals React */
'use strict';

var Show = React.createClass({
  getInitialState: function() {
    return({
      buttonSelected: '',
      players:
    });
  },
  render: function() {
    var game = this.props.game;
    var goBack = this.props.goBack;
    var startGame = this.props.startGame;
    var stopGame = this.props.stopGame;
    var buttonSelected = this.state.buttonSelected;
    var players = this.state.players;
    var undefinedCallBack = function() { return; };
    var buttons = {
      'rules': { callBack: { callBack: undefinedCallBack, args: [] }, rules: game.rules },
      'players': { callBack: { callback: undefinedCallBack, args: [] }, player: game.spec.player, computer: game.spec.computer },
      'play': { callBack: { callback: startGame, args: [game.id, ] } },
      'back': { callBack: { goBack } }
    };

    var allButtons = Object.keys(buttons).map(function(button) {
      var component = window[button.charAt(0).toUpperCase() + button.slice(1)];
      var props = buttons[button];

      return(
        <div key={ button }>
          <div className={ button + '-button ' } onClick={ this.selectButton.bind(this, button, props.callBack) }>
            { button }
          </div>
          <div className={ button + '-component ' + (button === buttonSelected) }>
            { React.createElement(component, props) }
          </div>
        </div>
      );
    }.bind(this));

    return(
      <div className='show-wrap'>
        { allButtons }
      </div>
    );
  },
  selectButton: function(button, callBack) {
    this.setState({
      buttonSelected: button
    });
    callBack.apply(this, args);
  }
});
