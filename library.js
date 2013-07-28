var Asteroids = function(){
  var elem = document.getElementById('canvas');
  var ctx = elem.getContext('2d');

  Asteroids.WIDTH = window.innerWidth; //elem.width();
  Asteroids.HEIGHT = window.innerWidth; //elem.height();
  ctx.canvas.height = Asteroids.HEIGHT;
  ctx.canvas.width = Asteroids.WIDTH;

  this.game = new Asteroids.Game(ctx);
  this.game.start(ctx);
}
