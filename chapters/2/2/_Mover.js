var V = require('V')
  , utils
;

function Mover(cx, canvas, opts) {
  utils = require('utils')(cx, canvas);
  this.cx = cx;
  this.canvas = canvas;

  this.location = new V(opts.x, opts.y);
  this.mass = opts.mass;

  this.velocity = new V(0, 0);
  this.acceleration = new V(0, 0);
}

Mover.prototype.applyForce = function (force) {
  var f = V.div(force, this.mass);
  this.acceleration.add(f);
};

Mover.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.location.add(this.velocity);
  this.acceleration.mult(0);
};

Mover.prototype.checkEdges = function () {
  if (this.location.x > utils.W) {
    this.location.x = utils.W;
    this.velocity.x *= -1;
  } else if (this.location.x < 0) {
    this.location.x = 0;
    this.velocity.x *= -1;
  }

  if (this.location.y > utils.H) {
    this.location.y = utils.H;
    this.velocity.y *= -1;
  } else if (this.location.y < 0) {
    this.location.y = 0;
    this.velocity.y *= -1;
  }
};

Mover.prototype.display = function () {
  this.cx.fillStyle = 'grey';
  this.cx.strokeStyle = 'black';
  utils.ellipse(this.location.x, this.location.y, this.mass * 16);
};

module.exports = Mover;
