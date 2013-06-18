var WIDTH;
var HEIGHT;

var Asteroids = function(){
  var elem = document.getElementById('canvas');
  var ctx = elem.getContext('2d');

  WIDTH = 900//elem.width();
  HEIGHT = 900//elem.height();

  this.game = new Game(ctx);
  this.game.start(ctx);
}
