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
    this.x = WIDTH + this.r;
  }
  else if (this.x > WIDTH + this.r ){
    this.x = -this.r;
  }
  else if (this.y < -this.r){
    this.y = HEIGHT + this.r ;
  }
  else if (this.y > HEIGHT + this.r ){
    this.y = -this.r;
  }
}


MovingObject.prototype.isHit = function(object){
	var thisShape = this.rotShape.slice(0);
	thisShape.push(thisShape[0]);
	var objectShape = object.rotShape.slice(0);
	objectShape.push(objectShape[0]);

  for(var i = thisShape.length - 1; i>0; i-=1) {
		var thisY1 = this.y + thisShape[i][1];
		var thisY2 = this.y + thisShape[(i-1)][1];
		var thisX1 = this.x + thisShape[i][0];
		var thisX2 = this.x + thisShape[(i-1)][0];

		var thisA = thisY2 - thisY1;
		var thisB = thisX1 - thisX2;
		var thisC = thisA * thisX1 + thisB * thisY1;

  	for(var j = objectShape.length - 1; j>0; j-=1) {
			var objectY1 = object.y + objectShape[j][1];
			var objectY2 = object.y + objectShape[(j-1)][1];
			var objectX1 = object.x + objectShape[j][0];
			var objectX2 = object.x + objectShape[(j-1)][0];

			var objectA = objectY2 - objectY1;
			var objectB = objectX1 - objectX2;
			var objectC = objectA * objectX1 + objectB * objectY1;

			var det = thisA * objectB - objectA * thisB;

			if(det != 0) {
				var intX = (objectB * thisC - thisB * objectC)/det;
				var intY = (thisA * objectC - objectA * thisC)/det;

				// thisY1 = Math.floor(thisY1);
				// thisY2 = Math.floor(thisY2);
				// thisX1 = Math.floor(thisX1);
				// thisX2 = Math.floor(thisX2);
				// thisA = Math.floor(thisA);
				// thisB = Math.floor(thisB);
				// thisC = Math.floor(thisC);
				//
				// objectY1 = Math.floor(objectY1);
				// objectY2 = Math.floor(objectY2);
				// objectX1 = Math.floor(objectX1);
				// objectX2 = Math.floor(objectX2);
				// objectA = Math.floor(objectA);
				// objectB = Math.floor(objectB);
				// objectC = Math.floor(objectC);
				//
				// intX = Math.floor(intX);
				// intY = Math.floor(intY);

				if(((thisX1 < intX && intX < thisX2) || (thisX1 > intX && intX > thisX2)) &&
					((thisY1 < intY && intY < thisY2) || (thisY1 > intY && intY > thisY2)) &&
					((objectX1 < intX && intX < objectX2) || (objectX1 > intX && intX > objectX2)) &&
					((objectY1 < intY && intY < objectY2) || (objectY1 > intY && intY > objectY2))){
						console.log(object.rotShape);
						console.log(objectShape);

						return true;
				}
			}
		}
	}
	return false;
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
  this.spin = 0//Math.random() * 0.1;
  this.rotShape;
}

var generateAsteroidShape = function(radius) {
  var allCoordinates = [];

  for(var angle = 0; angle < 360; angle += (0 + Math.floor(Math.random() * 100))) {
    allCoordinates.push(calculateCoordinates(angle, radius));
  }
  return allCoordinates;
}

var calculateCoordinates = function(angle, radius) {
  var newX = radius * Math.cos(toRadians(angle));
  var newY = radius * Math.sin(toRadians(angle));
  return [newX, newY];
}

var toRadians = function(degrees) {
  return degrees * (Math.PI / 180);
}

function A(){}
A.prototype = MovingObject.prototype;

Asteroid.prototype = new A();
Asteroid.prototype.constructor = Asteroid;

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
    var asteroid = new Asteroid(startX, startY, asteroidRadius);
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
  this.pointTags = [];
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
  var that = this;
  var ship = this.ship

  ctx.clearRect(0,0,WIDTH,HEIGHT);
  ctx.fillStyle = "#000000"
  ctx.fillRect(0,0,WIDTH, HEIGHT)

  ship.draw(ctx, ship.x, ship.y)
  for(var i = 0; i < this.asteroids.length; i++){
    asteroid = this.asteroids[i];
    this.asteroids[i].draw(ctx, asteroid.x, asteroid.y);
  }
  for(var j = 0; j < this.bullets.length; j++){
    bullet = this.bullets[j];
    this.bullets[j].draw(ctx, bullet.x, bullet.y, bullet.r);
  }

  _.each(this.pointTags, function(tag, tagIndex) {
    tag.update();
    if (tag.opacity < 0.1) {
      that.pointTags[tagIndex] = null;
    }
    tag.draw(ctx);
  });
  that.pointTags = _.compact(that.pointTags);

  that.drawPointBox(ctx);
  that.drawTimeBox(ctx);
}

Game.prototype.drawPointBox = function(ctx) {
  ctx.clearRect(WIDTH,0,150,40);
  ctx.fillStyle = "#000000";
  ctx.fillRect(WIDTH - 150,0,150, 40);

  ctx.strokeStyle = "#ffffff";
  ctx.strokeRect(WIDTH - 150,0,150, 40);

  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.font="20px Arial";
  ctx.fillText(this.points, WIDTH - 140, 30);
}

Game.prototype.drawTimeBox = function(ctx) {
  ctx.clearRect(0,0,150,40);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0,0,150, 40);

  ctx.strokeStyle = "#ffffff";
  ctx.strokeRect(0,0,150, 40);

  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.font="20px Arial";

  var minutes = Math.floor(this.elapsedTime()/60000);
  if (minutes < 10 ) {minutes = "0" + minutes}
  var seconds = Math.floor((this.elapsedTime()%60000)/1000);
  if (seconds < 10 ) {seconds = "0" + seconds}
  var milliseconds = Math.floor((this.elapsedTime()%1000)/10);
  if (milliseconds < 10 ) {milliseconds = "0" + milliseconds}
  ctx.fillText(minutes + ":" + seconds + ":" + milliseconds, 10, 30);
}

Game.prototype.start = function(ctx){
	this.ctx = ctx;
  var that = this;
  var loop = setInterval(function(){



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

  if (key.isPressed("left") || key.isPressed("A")) that.ship.steer(-0.1);
  if (key.isPressed("right") || key.isPressed("D")) that.ship.steer(0.1);
  if (key.isPressed("up") || key.isPressed("W")) that.ship.accelerate(1);
  if (key.isPressed("down") || key.isPressed("S")) that.ship.accelerate(-1);

  ship.update(ship.vx, ship.vy);


  for(var i = 0; i < asteroids.length; i++){
    var asteroid = asteroids[i]
    asteroid.update(asteroid.dx,asteroid.dy);

    if (ship.isHit(asteroid)){
			gameOver("<p>You've failed. Earth will be destroyed by Asteroids.</p> <p>You earned " + that.points + " points.</p> <p>You lasted " + Math.floor(that.elapsedTime()/1000) + " seconds before you were obliterated by space rocks.</p>");
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
        if (time < 1) {
          time = 1;
        }
        var pointsGained = (Math.floor((100-asteroids[j].r) * time * (this.pointTags.length + 1)))
        this.pointTags.push(new Point(asteroids[j].x, asteroids[j].y, pointsGained));
        this.points += pointsGained;
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
    gameOver("<p>Congratulations, you've saved Earth!</p> <p>You earned " + this.points + " points!</p> <p>It took you " + Math.floor(this.elapsedTime()/1000) + " seconds to eliminate the threat.</p>");
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

Bullet.prototype.isHit = function(object){
  var deltaX = this.x - object.x;
  var deltaY = this.y - object.y;
  var distance = (Math.sqrt(Math.pow(deltaX, 2) + (Math.pow(deltaY, 2))));

  if (distance < (this.r + object.r)){
    return true;
  }
}

//--------------------------------------------------------
var Point = function(startX, startY, pointValue) {
  this.x = startX;
  this.y = startY;
  this.pointValue = pointValue;
  this. vx = 0;
  this.vy = 4;
  this.dy = -1;
  this.opacity = 1.5;
}

Point.prototype.update = function() {
  this.y += this.vy;
  this.vy += this.dy;
  this.opacity -= 0.05;
}

Point.prototype.draw = function(ctx) {
  ctx.fillStyle = "rgba(255,0,0," + this.opacity + ")"
  ctx.font="20px Arial"
  ctx.fillText(this.pointValue, this.x, this.y);
}
