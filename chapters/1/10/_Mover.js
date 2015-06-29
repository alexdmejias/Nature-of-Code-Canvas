var Vector = require('vector2d')
  , utils
;

function sub(one, two) {
	var v1 = new Vector.ObjectVector(one.x, one.y);
	var v2 = new Vector.ObjectVector(two.x, two.y);

	return v1.subtract(v2);
}

function Mover(cx, canvas) {
  utils = require('utils')(cx, canvas);

  this.cx = cx;
  this.canvas = canvas;
	this.topSpeed = 5;

	this.location = new Vector.ObjectVector(utils.halfX(), utils.halfY());
  this.velocity = new Vector.ObjectVector(utils.range(-2, 2), utils.range(-2, 2));
	this.acceleration = new Vector.ObjectVector(0.001, 0.01);
}

Mover.prototype.update = function(mousePos) {
	var mouse = {
		x: mousePos.x,
		y: mousePos.y
	};
	var mouseVec = new Vector.ObjectVector(mouse.x, mouse.y);

	var dir = sub(mouseVec, this.location);
	dir.normalise();
	dir.mulS(0.5);
	var acceleration = dir;

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
