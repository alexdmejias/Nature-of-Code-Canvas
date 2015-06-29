var Vector = require('vector2d')
  , utils
	, topSpeed
;

function random2D () {
	var angle = Math.random()*Math.PI*2;
	return new Vector.ObjectVector(Math.cos(angle), Math.sin(angle));
};

function Mover(cx, canvas) {
  utils = require('utils')(cx, canvas);

  this.cx = cx;
  this.canvas = canvas;
	this.topSpeed = 5;

	this.location = new Vector.ObjectVector(utils.halfX(), utils.halfY());
  this.velocity = new Vector.ObjectVector(utils.range(-2, 2), utils.range(-2, 2));
	this.acceleration = new Vector.ObjectVector(0.001, 0.01);
}

Mover.prototype.update = function() {
  var acceleration = random2D();

	this.velocity.add(acceleration);
	this.velocity.limit(this.topSpeed);
	this.location.add(this.velocity);
};

Mover.prototype.checkEdges = function () {
  if (this.location.getX() > this.canvas.width) {
    this.location.setX(0);
  } else if (this.location.getX() < 0) {
    this.location.setX(canvas.width);
  }

  if (this.location.getY() > this.canvas.height) {
    this.location.setY(0);
  } else if (this.location.getY() < 0){
    this.location.setY(this.canvas.height);
  }
};

Mover.prototype.display = function () {
  this.cx.fillRect(this.location.getX(), this.location.getY(), 10, 10);
};

module.exports = Mover;
