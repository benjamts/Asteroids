Asteroids.Game = (function(){
  var Game = function() {
    var that = this;
    this.bullets = [];
    this.asteroids = [];
    this.pointTags = [];
    this.ship = new Asteroids.Ship(Asteroids.WIDTH/2, Asteroids.HEIGHT/2, Asteroids.HEIGHT * 0.03);
    this.points = 0;
    this.startTime = new Date().getTime();

    for (var i = 0; i < 20; i++){
      this.asteroids.push(this.randomAsteroid());
    }
  // Key bindings.

    key('space', function(){
      if (that.bullets.length < 4) {
        var newBullet = that.ship.fireBullet();
        that.bullets.push(newBullet);
      }
    });
  }

  Game.prototype.randomAsteroid = function(){
    var asteroidRadius = 10 + Math.random() * Asteroids.HEIGHT * 0.06;

    var walls = ['left','right', 'top','bottom'];
    // chooses random wall to spawn asteroid from.
    var sample = walls[Math.floor((Math.random()*4)/1)];

    switch (sample){
    case "left":
      var startX = 0;
      var startY = Math.random() * Asteroids.HEIGHT;
      break;
    case "right":
      var startX = Asteroids.WIDTH;
      var startY = Math.random() * Asteroids.HEIGHT;
      break;
    case "top":
      var startX = Math.random() * Asteroids.WIDTH;
      var startY = 0;
      break;
    case "bottom":
      var startX = Math.random() * Asteroids.WIDTH;
      var startY = Asteroids.HEIGHT;
      break;
      }
      var asteroid = new Asteroids.Asteroid(startX, startY, asteroidRadius);
      return asteroid;
  }

  Game.prototype.elapsedTime = function(){
    return (new Date().getTime() - this.startTime);
  }

  Game.prototype.drawBackground = function(ctx) {
    ctx.clearRect(0,0,Asteroids.WIDTH,Asteroids.HEIGHT);
    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0,Asteroids.WIDTH, Asteroids.HEIGHT)
  };

  Game.prototype.draw = function (ctx){
    var that = this;
    var ship = this.ship;

    this.drawBackground(ctx);
    ship.draw(ctx);

    for(var i = 0; i < this.asteroids.length; i++){
      asteroid = this.asteroids[i];
      asteroid.draw(ctx);
    }
    for(var j = 0; j < this.bullets.length; j++){
      bullet = this.bullets[j];
      this.bullets[j].draw(ctx, bullet.x, bullet.y, bullet.r);
    }

    this.pointTags.forEach(function(tag, tagIndex) {
      tag.update();
      if (tag.opacity < 0.1) {
        that.pointTags[tagIndex] = null;
      }
      tag.draw(ctx);
    });
    that.pointTags = that.pointTags.filter(Boolean);

    that.drawPointBox(ctx);
    that.drawTimeBox(ctx);
  }

  Game.prototype.drawPointBox = function(ctx) {
    var boxWidth = 0.167 * Asteroids.HEIGHT;
    var boxHeight =  0.045 * Asteroids.HEIGHT;

    ctx.clearRect(Asteroids.WIDTH,0,boxWidth,boxHeight);
    ctx.fillStyle = "#000000";
    ctx.fillRect(Asteroids.WIDTH - boxWidth,0,boxWidth, boxHeight);

    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(Asteroids.WIDTH - boxWidth,0,boxWidth, boxHeight);

    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.font="5vh Arial";
    ctx.fillText(this.points, Asteroids.WIDTH - boxWidth * 0.9, boxHeight * 0.75);
  }

  Game.prototype.drawTimeBox = function(ctx) {
    var boxWidth = 0.167 * Asteroids.HEIGHT;
    var boxHeight =  0.045 * Asteroids.HEIGHT;

    ctx.clearRect(0,0,boxWidth,boxHeight);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,boxWidth, boxHeight);

    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(0,0,boxWidth, boxHeight);

    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.font="5vh Arial";

    var minutes = Math.floor(this.elapsedTime()/60000);
    if (minutes < 10 ) {minutes = "0" + minutes}
    var seconds = Math.floor((this.elapsedTime()%60000)/1000);
    if (seconds < 10 ) {seconds = "0" + seconds}
    var milliseconds = Math.floor((this.elapsedTime()%1000)/10);
    if (milliseconds < 10 ) {milliseconds = "0" + milliseconds}
    ctx.fillText(minutes + ":" + seconds + ":" + milliseconds, 10, boxHeight * 0.75);
  }

  Game.prototype.start = function(ctx){
    var that = this;
    var loop = setInterval(function(){
      if(that.update()){ clearInterval(loop); };
      that.draw(ctx);
    }, 30);
  }

  Game.prototype.update = function(){
    var asteroids = this.asteroids;
    var ship = this.ship;
    var bullets = this.bullets;

    if (this.win()) { return true; };

    if (key.isPressed("left") || key.isPressed("A")) this.ship.steer(-0.1);
    if (key.isPressed("right") || key.isPressed("D")) this.ship.steer(0.1);
    if (key.isPressed("up") || key.isPressed("W")) this.ship.accelerate(1);
    if (key.isPressed("down") || key.isPressed("S")) this.ship.accelerate(-1);

    ship.update(ship.vx, ship.vy);


    if(this.updateAsteroids()){ return true; };

    this.updateBullets();

    ship.offScreen();
    return false;
  }

  Game.prototype.updateBullets = function(){
    for (var i = 0; i < this.bullets.length; i++){
      var bullet = this.bullets[i];
      bullet.update(bullet.vx, bullet.vy);
      if (bullet.offScreen()){
        this.bullets.splice(i, 1);
      }

      for (var j = 0; j < this.asteroids.length; j++){
        if (bullet.isHit(this.asteroids[j])){
          this.gainPoints(this.asteroids[j]);
          this.asteroids.splice(j,1);
          this.bullets.splice(i,1);
        }
      }
    }
  }

  Game.prototype.gainPoints = function(asteroid){
    var timeDestroyed = (30000 - this.elapsedTime())/10000;
    if (timeDestroyed < 1) {
      timeDestroyed = 1;
    }

    var pointsGained = (Math.floor((100 - asteroid.r/9) * timeDestroyed * (this.pointTags.length + 1)))
    this.pointTags.push(new Asteroids.Point(asteroid.x, asteroid.y, pointsGained));
    this.points += pointsGained;
    this.asteroids = this.asteroids.concat(asteroid.explode());
  }

  Game.prototype.updateAsteroids = function(){
    var shipIsDestroyed = false;
    for(var i = 0; i < this.asteroids.length; i++){
      var asteroid = this.asteroids[i]
      asteroid.update(asteroid.dx,asteroid.dy);

      if (this.ship.isHit(asteroid)){
        gameOver("<p>You've failed. Earth will be destroyed by Asteroids.</p> <p>You earned " + this.points + " points.</p> <p>You lasted " + Math.floor(this.elapsedTime()/1000) + " seconds before you were obliterated by space rocks.</p>");
        shipIsDestroyed = true;
      }
      asteroid.offScreen();
    }
    return shipIsDestroyed;
  }

  Game.prototype.win = function(){
    if (this.asteroids.length == 0){
      var time = (100000 - this.elapsedTime())/10000
      if (time < 100) {
        time = 100;
      }
      this.points += (time * 10);
      gameOver("<p>Congratulations, you've saved Earth!</p> <p>You earned " + this.points + " points!</p> <p>It took you " + Math.floor(this.elapsedTime()/1000) + " seconds to eliminate the threat.</p>");
      return true;
    }
  }

  return Game;
})();


