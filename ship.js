Asteroids.Ship = (function(){
  var Ship = function(startX, startY, radius, angle){
    Asteroids.MovingObject.apply(this,[startX, startY, radius, angle]);
    this.vx = (0.001 * Asteroids.HEIGHT);
    this.vy = (0.001 * Asteroids.HEIGHT);
    this.shape = [[0, -radius], [0-(radius/2), radius*Math.sqrt(3)/2], [(radius/2), radius*Math.sqrt(3)/2]];
    this.rotShape = this.shape;
    this.spin = 0;
  }

  S = function() {}
  S.prototype = Asteroids.MovingObject.prototype;
  Ship.prototype = new S();

  Ship.prototype.accelerate = function(direction){

    this.vx += 0.0002 * Asteroids.HEIGHT * Math.sin(this.angle) * direction;
    if (this.vx > 0.01 * Asteroids.HEIGHT){
      this.vx = 0.01 * Asteroids.HEIGHT;
    } else if (this.vx < -0.01 * Asteroids.HEIGHT){
      this.vx = -0.01 * Asteroids.HEIGHT;
    }

    this.vy += -0.0002 * Asteroids.HEIGHT * Math.cos(this.angle) * direction;
    if (this.vy > 0.01 * Asteroids.HEIGHT){
      this.vy = 0.01 * Asteroids.HEIGHT;
    } else if (this.vy < -0.01 * Asteroids.HEIGHT){
      this.vy = -0.01 * Asteroids.HEIGHT;
    }
  }

  Ship.prototype.steer = function(dAngle){
    this.angle += dAngle;
  }

  Ship.prototype.fireBullet= function(){
    var bullet = new Asteroids.Bullet(this.x + this.rotShape[2][0], this.y + this.rotShape[2][1], 0.003 * Asteroids.HEIGHT, this.angle);
    return bullet;
  }

  return Ship;
})();