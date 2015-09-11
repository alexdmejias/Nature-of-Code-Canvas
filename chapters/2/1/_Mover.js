var V = require('V')
  , utils
;

function Mover(cx, canvas, opts) {
  utils = require('utils')(cx, canvas);

  this.cx = cx;
  this.canvas = canvas;

  this.mass = 1;
  this.position = new V(30, 30);
  this.velocity = new V(0, 0);
  this.acceleration = new V(0, 0);
}

Mover.prototype.applyForce = function (force) {
  var f = V.div(force, this.mass);
  this.acceleration.add(f);
};

Mover.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.acceleration.mult(0);
};

Mover.prototype.checkEdges = function () {
  if (this.position.x > utils.W()) {
    this.position.x = utils.W();
    this.velocity.x *= -1;
  } else if (this.position.x < 0) {
    this.position.x = 0;
    this.velocity.x *= -1;
  }

  if (this.position.y > utils.H()) {
    this.position.y = utils.H();
    this.velocity.y *= -1;
  } else if (this.position.y < 0) {
    this.position.y = 0;
    this.velocity.y *= -1;
  }
};

Mover.prototype.display = function () {
  this.cx.fillStyle = 'grey';
  this.cx.strokeStyle = 'black';
  utils.ellipse(this.position.x, this.position.y, 48);
};

module.exports = Mover;
