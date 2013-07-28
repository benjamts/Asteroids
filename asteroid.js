Asteroids.Asteroid = (function(){
  var Asteroid = function(startX, startY, radius){
    Asteroids.MovingObject.apply(this, [startX, startY, radius]);
    this.dx = (-0.002 + (Math.random() * 0.004)) * Asteroids.HEIGHT;
    this.dy = (-0.002 + (Math.random() * 0.004)) * Asteroids.HEIGHT;
    this.shape = generateAsteroidShape(radius);
    this.spin = Math.random() * 0.1;
    this.rotShape = this.shape;
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
  A.prototype = Asteroids.MovingObject.prototype;
  Asteroid.prototype = new A();

  Asteroid.prototype.explode = function(){
    var spawns = 2 + Math.floor(Math.random() * 2);
    var newAsteroids = [];

    for(var i=0; i < spawns; i++){
      var newAsteroidR = 0.003 * Asteroids.HEIGHT + Math.floor(Math.random() * (this.r/spawns));
      var newAsteroid = new Asteroid(this.x, this.y, newAsteroidR);
      if(newAsteroidR > 0.0076 * Asteroids.HEIGHT){
        newAsteroids.push(newAsteroid);
      }
    }
    return newAsteroids;
  }
  return Asteroid;
})();