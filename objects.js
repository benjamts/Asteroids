var MovingObject = function(startX, startY){
  this.x = startX;
  this.y = startY;
}

MovingObject.prototype.update = function(dx, dy){
  this.x += dx;
  this.y += dy;
  this.angle += this.spin;
}

MovingObject.prototype.offScreen = function(){

  if (this.x < 0){
    this.x = WIDTH;
  }
  else if (this.x > WIDTH){
    this.x = 0;
  }
  else if (this.y < 0){
    this.y = HEIGHT;
  }
  else if (this.y > HEIGHT){
    this.y = 0;
  }
}


MovingObject.prototype.isHit = function(object){
  var deltaX = this.x - object.x;
  var deltaY = this.y - object.y;
  var distance = (Math.sqrt(Math.pow(deltaX, 2) + (Math.pow(deltaY, 2))));

  if (distance < (this.r + object.r)){
    return true;
  }
}

MovingObject.prototype.rotate = function() {
  var that = this;
  var rotCoords
  that.rotShape = _.map(that.shape, function(coords) {
    var coordsX = coords[0]*Math.cos(that.angle) - coords[1]*Math.sin(that.angle);
    var coordsY = coords[0]*Math.sin(that.angle) + coords[1]*Math.cos(that.angle);
    return [coordsX, coordsY];
  });
}

MovingObject.prototype.draw = function(ctx,x,y){
  var that = this;

  // ctx.beginPath();
  // ctx.arc(that.x,that.y,that.r,0, Math.PI*2,true);
  // ctx.strokeStyle = "#ffffff";
  // ctx.stroke();
  // ctx.closePath();

  that.rotate();

  ctx.beginPath();
  ctx.strokeStyle = "#ffffff";

  ctx.moveTo(x + that.rotShape[0][0], y + that.rotShape[0][1]);
  that.rotShape.push(that.rotShape.shift());
  _.each(that.rotShape, function(coords){
    ctx.lineTo(that.x + coords[0], that.y + coords[1]);
  });
  ctx.stroke();
  ctx.closePath();
}

//---------------------------------------------------------


var Asteroid = function(startX, startY, r, startAngle){
  MovingObject.apply(this, [startX, startY]);
  this.r = r;
  var r = this.r;
  this.dx = -2 + (Math.random() * 4);
  this.dy = -2 + (Math.random() * 4);
  this.shape = generateAsteroidShape(r);
  this.angle = 0.00;
  this.spin = Math.random() * 0.1;
  this.rotShape;
}

var generateAsteroidShape = function(radius) {
  var allCoordinates = [];

  for(angle = 0; angle < 360; angle += (0 + Math.floor(Math.random() * 100))) {
    allCoordinates.push(calculateCoordinates(angle, radius));
  }
  return allCoordinates;
}

var calculateCoordinates = function(angle, radius) {
  newX = radius * Math.cos(toRadians(angle));
  newY = radius * Math.sin(toRadians(angle));
  return [newX, newY];
}

var toRadians = function(degrees) {
  return degrees * (Math.PI / 180);
}

function A(){}
A.prototype = MovingObject.prototype;
A.constructor = "Asteroid";
Asteroid.prototype = new A();

var randomAsteroid = function(){
  var asteroidRadius = 10 + Math.random() * 50;

  var walls = ['left','right', 'top','bottom'];
  // chooses random wall to spawn asteroid from.
  var sample = walls[Math.floor((Math.random()*4)/1)];

  switch (sample){
  case "left":
    var startX = 0;
    var startY = Math.random() * HEIGHT;
    break;
  case "right":
    var startX = WIDTH;
    var startY = Math.random() * HEIGHT;
    break;
  case "top":
    var startX = Math.random() * WIDTH;
    var startY = 0;
    break;
  case "bottom":
    var startX = Math.random() * WIDTH;
    var startY = HEIGHT;
    break;
    }
    asteroid = new Asteroid(startX, startY, asteroidRadius);
    return asteroid;
}

Asteroid.prototype.explode = function(){
  var spawns = 2 + Math.floor(Math.random() * 2);
  var newAsteroids = [];

  for(var i=0; i < spawns; i++){
    var newAsteroidR = 3 + Math.floor(Math.random() * (this.r/spawns));
    var newAsteroid = new Asteroid(this.x, this.y, newAsteroidR);
    if(newAsteroidR > 5){
      newAsteroids.push(newAsteroid);
    }
  }
  return newAsteroids;
}

//---------------------------------------------------------

var Game = function(ctx){
  var that = this;
  this.bullets = [];
  this.asteroids = [];
  this.ship = new Ship(WIDTH/2, HEIGHT/2);
  this.points = 0;
  this.startTime = new Date().getTime();
  for (var i = 0; i < 20; i++){
    this.asteroids.push(randomAsteroid());
  }

  // Key bindings.

  key('space', function(){
    if (that.bullets.length < 4) {
      var newBullet = that.ship.fireBullet();
      that.bullets.push(newBullet);
    }
  });


}

Game.prototype.elapsedTime = function(){
  return (new Date().getTime() - this.startTime);
}

Game.prototype.draw = function (ctx){
  var ship = this.ship
  ship.draw(ctx, ship.x, ship.y)
  for(var i = 0; i < this.asteroids.length; i++){
    asteroid = this.asteroids[i];
    this.asteroids[i].draw(ctx, asteroid.x, asteroid.y);
  }
  for(var j = 0; j < this.bullets.length; j++){
    bullet = this.bullets[j];
    this.bullets[j].draw(ctx, bullet.x, bullet.y, bullet.r);
  }
}

Game.prototype.start = function(ctx){
  that = this;
  var loop = setInterval(function(){

    ctx.clearRect(0,0,WIDTH,HEIGHT);
    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0,WIDTH, HEIGHT)

    that.draw(ctx);

    if(that.update()){
      clearInterval(loop);
    }
  }, 30);
}

Game.prototype.update = function(){
  var that = this;
  var asteroids = this.asteroids;
  var ship = this.ship;
  var bullets = this.bullets;

  if (this.win()) {
    return true;
  };

  if (key.isPressed("A")) that.ship.steer(-0.1);
  if (key.isPressed("D")) that.ship.steer(0.1);
  if (key.isPressed("W")) that.ship.accelerate(1);
  if (key.isPressed("S")) that.ship.accelerate(-1);

  ship.update(ship.vx, ship.vy);

  for(var i = 0; i < asteroids.length; i++){
    var asteroid = asteroids[i]
    asteroid.update(asteroid.dx,asteroid.dy);

    if (ship.isDestroyed(asteroid)){
      window.alert("You've failed. Earth will be destroyed by Asteroids. You earned " + this.points + " points. You lasted " + this.elapsedTime()/1000 + " seconds before you were obliterated by space rocks.");
      return true;
    }
    asteroid.offScreen();
  }

  for (var i = 0; i < bullets.length; i++){
    var bullet = bullets[i];
    bullet.update(bullet.vx, bullet.vy);
    if (bullet.offScreen()){
      bullets.splice(i, 1);
    }
    var newAsteroids = [];
    for (var j = 0; j < asteroids.length; j++){
      if (bullet.isHit(asteroids[j])){
        var time = (30000 - this.elapsedTime())/10000;
        if (time < 0) {
          time = 1;
        }
        this.points += (Math.floor((100-asteroids[j].r) * time));
        this.asteroids = asteroids.concat(asteroids[j].explode());
        this.asteroids.splice(j,1);
        bullets.splice(i,1);
      }
    }

  }
  ship.offScreen();
  return false;
}

Game.prototype.win = function(){
  if (this.asteroids.length == 0){
    var time = (100000 - this.elapsedTime())/10000
    if (time < 100) {
      time = 100;
    }
    this.points += (time * 10);
    window.alert("Congratulations, you've saved Earth! You earned " + this.points + " points! It took you " + this.elapsedTime()/1000 + " seconds to eliminate the threat.");
    return true;
  }
}

//---------------------------------------------------------

var Ship = function(startX, startY){
  MovingObject.apply(this,[startX, startY]);
  this.r = 25;
  var r = this.r;
  this.vx = 1;
  this.vy = 1;
  this.angle = 0.00;
  this.shape = [[0, -r], [0-(r/2), r*Math.sqrt(3)/2], [(r/2), r*Math.sqrt(3)/2]];
  this.rotShape = this.shape;
  this.spin = 0;
}

S = function() {}
S.prototype = MovingObject.prototype;
S.constructor = "Ship";
Ship.prototype = new S();

Ship.prototype.accelerate = function(direction){
  this.vx += 0.2*Math.sin(this.angle) * direction;
  if (this.vx > 10){
    this.vx = 10;
  } else if (this.vx < -10){
    this.vx = -10;
  }

  this.vy += -0.2*Math.cos(this.angle) * direction;
  if (this.vy > 10){
    this.vy = 10;
  } else if (this.vy < -10){
    this.vy = -10;
  }
}

Ship.prototype.steer = function(dAngle){
  this.angle += dAngle;
}

Ship.prototype.fireBullet= function(){
  var bullet = new Bullet(this.x + this.rotShape[2][0], this.y + this.rotShape[2][1], this.angle);
  return bullet;
}

Ship.prototype.isDestroyed = function(asteroid) {
  var that = this;
  var asteroid = asteroid;
  var destroyed = false;
  var shipCenter = [0, 0];

  var importantPoints = that.rotShape;
  importantPoints.push(shipCenter);
  _.each(importantPoints, function(coords){
    var pointX = coords[0] + that.x;
    var pointY = coords[1] + that.y;
    var deltaXSquared = Math.pow((pointX - asteroid.x), 2);
    var deltaYSquared = Math.pow((pointY - asteroid.y), 2);

    if ((Math.sqrt(deltaXSquared + deltaYSquared)) < asteroid.r) {
      destroyed = true;
    }
  });

  return destroyed;

}

//-----------------------------------------------------

var Bullet = function(startX, startY, angle){
  MovingObject.apply(this,[startX, startY]);
  this.r = 3;
  this.speed = 15;
  this.angle = angle;
  this.vx = this.speed * Math.sin(this.angle);
  this.vy = this.speed * -Math.cos(this.angle);

}

B = function(){}
B.prototype = MovingObject.prototype;
B.constructor = "Bullet";
Bullet.prototype = new B();

Bullet.prototype.offScreen = function(){
    if (this.x < 0 || this.x > WIDTH || this.y < 0 || this.y > HEIGHT) {
      return true;
    } else {
      return false;
    }
}

Bullet.prototype.draw = function (ctx){
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r,0, Math.PI*2, true);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();
}

