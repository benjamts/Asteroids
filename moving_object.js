Asteroids.MovingObject = (function(){
  var MovingObject = function(startX, startY, radius, angle){
    this.x = startX;
    this.y = startY;
    this.r = radius;
    this.angle = (angle === undefined ? 0.00 : angle);
  }

  MovingObject.prototype.update = function(dx, dy){
    this.x += dx;
    this.y += dy;
    this.angle += this.spin;
    this.rotate();
  }

  MovingObject.prototype.offScreen = function(){
    if (this.x < -this.r){ this.x = Asteroids.WIDTH + this.r; }
    else if (this.x > Asteroids.WIDTH + this.r ){ this.x = -this.r; }
    else if (this.y < -this.r){ this.y = Asteroids.HEIGHT + this.r ; }
    else if (this.y > Asteroids.HEIGHT + this.r ){ this.y = -this.r; }
  }

  MovingObject.prototype.getSegmentVariables = function(object, shape, vertex) {
    var variables = {
      Y1: object.y + shape[vertex][1],
      Y2: object.y + shape[(vertex-1)][1],
      X1: object.x + shape[vertex][0],
      X2: object.x + shape[(vertex-1)][0],
    };

    variables.A = variables.Y2 - variables.Y1;
    variables.B = variables.X1 - variables.X2;
    variables.C = variables.A * variables.X1 + variables.B * variables.Y1;

    return variables;
  }

  MovingObject.prototype.linesIntersect = function(first, second, det) {
    var intX = (second.B * first.C - first.B * second.C)/det;
    var intY = (first.A * second.C - second.A * first.C)/det;

    if(((first.X1 < intX && intX < first.X2) || (first.X1 > intX && intX > first.X2)) &&
      ((first.Y1 < intY && intY < first.Y2) || (first.Y1 > intY && intY > first.Y2)) &&
      ((second.X1 < intX && intX < second.X2) || (second.X1 > intX && intX > second.X2)) &&
      ((second.Y1 < intY && intY < second.Y2) || (second.Y1 > intY && intY > second.Y2))){

        return true;
    }
    return false
  }

  MovingObject.prototype.isHit = function(object){
    var ctx = ctx;
    var firstShape = this.rotShape.slice(0);
    firstShape.push(firstShape[0]);
    var secondShape = object.rotShape.slice(0);
    secondShape.push(secondShape[0]);

    for(var i = firstShape.length - 1; i > 0; i--) {
      var firstLine = this.getSegmentVariables(this, firstShape, i);

      for(var j = secondShape.length - 1; j > 0; j--) {
        var secondLine = this.getSegmentVariables(object, secondShape, j);
        var det = firstLine.A * secondLine.B - secondLine.A * firstLine.B;

        if(det != 0) {
          if(object.linesIntersect(firstLine, secondLine, det)){ return true };
        }
      }
    }
    return false;
  }

  MovingObject.prototype.rotate = function() {
    var that = this;
    that.rotShape = (that.shape || []).map(function(coords) {
      var coordsX = coords[0]*Math.cos(that.angle) - coords[1]*Math.sin(that.angle);
      var coordsY = coords[0]*Math.sin(that.angle) + coords[1]*Math.cos(that.angle);
      return [coordsX, coordsY];
    });
  }

  MovingObject.prototype.draw = function(ctx){
    var that = this;

    // Shows object radius for debugging
    // ctx.beginPath();
    // ctx.arc(that.x,that.y,that.r,0, Math.PI*2,true);
    // ctx.strokeStyle = "#ffffff";
    // ctx.stroke();
    // ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = "#ffffff";
  	ctx.lineWidth= 2;

    ctx.moveTo(this.x + this.rotShape[0][0], this.y + this.rotShape[0][1]);
    this.rotShape.push(this.rotShape.shift());
    this.rotShape.forEach(function(coords) {
      ctx.lineTo(that.x + coords[0], that.y + coords[1]);
    });
    ctx.stroke();
    ctx.closePath();
  }

  return MovingObject;
})();