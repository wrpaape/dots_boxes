/* globals React */
'use strict';

var Index = React.createClass({
  // getInitialState: function() {

  // },
  render: function() {
    var games = this.props.games;
    var index = games.map(function(game, i) {
      return <Show key={ i } game={ game } />;
    });

    return(
      <div>
        { index }
      </div>
    );
  }
});
