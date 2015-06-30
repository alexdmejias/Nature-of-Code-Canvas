  var V = require('V')
  , utils
;

function sub(one, two) {
	// var v1 = new Vector.ObjectVector(one.x, one.y);
	var v1 = new V(one.x, one.y);
	// var v2 = new Vector.ObjectVector(two.x, two.y);
	var v2 = new V(two.x, two.y);

	return v1.sub(v2);
}

function Mover(cx, canvas) {
  utils = require('utils')(cx, canvas);

  this.cx = cx;
  this.canvas = canvas;
	this.topSpeed = 5;

	this.location = new V(utils.halfX(), utils.halfY());
  this.velocity = new V(utils.range(-2, 10), utils.range(-2, 10));
	this.acceleration = new V(0.001, 0.01);
}

Mover.prototype.update = function(mousePos) {
	var mouse = {
		x: mousePos.x,
		y: mousePos.y
	};
	var mouseVec = new V(mouse.x, mouse.y);

	var dir = V.sub(mouseVec, this.location);
	dir.normalize();
	dir.mult(0.5);
	var acceleration = dir;

	this.velocity.add(acceleration);
	this.velocity.limit(this.topSpeed);
	this.location.add(this.velocity);
};

Mover.prototype.checkEdges = function () {
  if (this.location.x > this.canvas.width) {
    this.location.x = 0;
  } else if (this.location.x < 0) {
    this.location.x = canvas.width;
  }

  if (this.location.y > this.canvas.height) {
    this.location.y = 0;
  } else if (this.location.y < 0){
    this.location.y = this.canvas.height;
  }
};

Mover.prototype.display = function () {
  this.cx.rect(this.location.x, this.location.y, 10, 10);
	this.cx.stroke();
};

module.exports = Mover;
