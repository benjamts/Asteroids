var MovingObject = function(startX, startY){
  this.x = startX;
  this.y = startY;
}

MovingObject.prototype.update = function(dx, dy){
  this.x += dx;
  this.y += dy;
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

//---------------------------------------------------------

var Asteroid = function(startX, startY){
  MovingObject.apply(this, [startX, startY]);
  this.r = 5 + Math.random() * 50;
  this.dx = -2 + (Math.random() * 4);
  this.dy = -2 + (Math.random() * 4);
}

function F(){}
F.prototype = MovingObject.prototype;
Asteroid.prototype = new F();


var randomAsteroid = function(){

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
    asteroid = new Asteroid(startX, startY);
    return asteroid;
}

Asteroid.prototype.draw = function(ctx, x, y, r){

  ctx.beginPath();
  ctx.arc(x,y,r,0, Math.PI*2,true);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.closePath();
}

Asteroid.prototype.explode = function(){
  var spawns = 2 + Math.floor(Math.random() * 4);
  var newAsteroids = [];

  for(var i=0; i < spawns; i++){
    var newAsteroid = new Asteroid(this.x, this.y);
    newAsteroid.r = Math.floor(this.r/spawns);
    if(newAsteroid.r > 10){
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
  for (var i = 0; i < 20; i++){
    this.asteroids.push(randomAsteroid());
  }

  // Key bindings.

  key('space', function(){
    var newBullet = that.ship.fireBullet();
    that.bullets.push(newBullet);
  });


}

Game.prototype.draw = function (ctx){
  var ship = this.ship
  ship.draw(ctx, ship.x, ship.y)
  for(var i = 0; i < this.asteroids.length; i++){
    asteroid = this.asteroids[i];
    this.asteroids[i].draw(ctx, asteroid.x, asteroid.y, asteroid.r);
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
  var asteroids = this.asteroids;
  var ship = this.ship;
  var bullets = this.bullets;

  if (key.isPressed("A")) that.ship.steer(-0.1);
  if (key.isPressed("D")) that.ship.steer(0.1);
  if (key.isPressed("W")) that.ship.accelerate();
  if (key.isPressed("S")) that.ship.decelerate();

  ship.update(ship.vx, ship.vy);

  for(var i = 0; i < asteroids.length; i++){
    var asteroid = asteroids[i]
    asteroid.update(asteroid.dx,asteroid.dy);

    if (ship.isHit(asteroid)){
      window.alert("You LOSE!!!!");
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
        this.asteroids = asteroids.concat(asteroids[j].explode());
        this.asteroids.splice(j,1);
        bullets.splice(i,1);
      }
    }

  }

  ship.offScreen();

  return false;
}

//---------------------------------------------------------

var Ship = function(startX, startY){
  MovingObject.apply(this,[startX, startY]);
  this.r = 25;
  this.vx = 0;
  this.vy = 0;
  this.angle = 0.00;
}

Ship.prototype = new F();

Ship.prototype.draw = function(ctx,x,y){
  ctx.beginPath();
  ctx.arc(x, y, this.r,0, Math.PI*2, true);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();

  var r = this.r;
  var nose = [0, -r];
  var leftWing = [0-(r/2), r*Math.sqrt(3)/2];
  var rightWing = [(r/2), r*Math.sqrt(3)/2];

  var noseX = nose[0]*Math.cos(this.angle) - nose[1]*Math.sin(this.angle);
  var noseY = nose[0]*Math.sin(this.angle) + nose[1]*Math.cos(this.angle);
  this.nose = [noseX, noseY];

  nose = this.nose;

  var leftWingX = leftWing[0]*Math.cos(this.angle) - leftWing[1]*Math.sin(this.angle);
  var leftWingY = leftWing[0]*Math.sin(this.angle) + leftWing[1]*Math.cos(this.angle);
  leftWing = [leftWingX, leftWingY];

  var rightWingX = rightWing[0]*Math.cos(this.angle) - rightWing[1]*Math.sin(this.angle);
  var rightWingY = rightWing[0]*Math.sin(this.angle) + rightWing[1]*Math.cos(this.angle);
  rightWing = [rightWingX, rightWingY];


  ctx.beginPath();

  ctx.strokeStyle = "#ffffff";

  ctx.moveTo(x + noseX, y + noseY);
  ctx.lineTo(x+leftWing[0], y+leftWing[1]);
  ctx.lineTo(x+rightWing[0], y+rightWing[1]);
  ctx.lineTo(x+ noseX, y+noseY)
  ctx.stroke();
  ctx.closePath();
}

Ship.prototype.accelerate = function(){
  this.vx += 0.2*Math.sin(this.angle);
  if (this.vx > 10){
    this.vx = 10;
  }
  this.vy += -0.2*Math.cos(this.angle);
  if (this.vy > 10){
    this.vy = 10;
  }
}


Ship.prototype.decelerate = function(){
  this.vx -= 0.2*Math.sin(this.angle);
  if (this.vx > 10){
    this.vx = 10;
  }
  this.vy -= -0.2*Math.cos(this.angle);
  if (this.vy > 10){
    this.vy = 10;
  }

}


Ship.prototype.steer = function(dAngle){
  this.angle += dAngle;
}

Ship.prototype.fireBullet= function(){
  var bullet = new Bullet(this.x + this.nose[0], this.y + this.nose[1], this.angle);
  return bullet;
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

Bullet.prototype = new F();

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
  ctx.fillStyle = "#f00";
  ctx.fill();
  ctx.closePath();
}

