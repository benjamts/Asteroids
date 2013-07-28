Asteroids.Bullet = (function(){
  var Bullet = function(startX, startY, radius, angle){
    Asteroids.MovingObject.apply(this,[startX, startY, radius, angle]);
    this.speed = 0.017 * Asteroids.HEIGHT;
    this.vx = this.speed * Math.sin(this.angle);
    this.vy = this.speed * -Math.cos(this.angle);
  }

  B = function(){}
  B.prototype = Asteroids.MovingObject.prototype;
  Bullet.prototype = new B();

  Bullet.prototype.offScreen = function(){
      if (this.x < 0 || this.x > Asteroids.WIDTH || this.y < 0 || this.y > Asteroids.HEIGHT) {
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
  return Bullet;
})();

//--------------------------------------------------------
Asteroids.Point = (function(){
  var Point = function(startX, startY, pointValue) {
    this.x = startX;
    this.y = startY;
    this.pointValue = pointValue;
    this. vx = 0;
    this.vy = 0.004 * Asteroids.HEIGHT;
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
    ctx.font="4vh Arial"
    ctx.fillText(this.pointValue, this.x, this.y);
  }
  return Point;
})();