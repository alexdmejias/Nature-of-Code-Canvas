var V = require('V')
  , utils
;

function Mover(cx, canvas, opts) {
  utils = require('utils')(cx, canvas);
  this.cx = cx;
  this.canvas = canvas;

  this.mass = opts.mass;
  this.position = new V(opts.x, opts.y);

  this.velocity = new V(0, 0);
  this.acceleration = new V(0, 0);
}

Mover.prototype.applyForce = function(force) {
  var f = V.div(force, this.mass);
  this.acceleration.add(f);
  return this;
};

Mover.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.acceleration.mult(0);
  return this;
};

Mover.prototype.checkEdges = function() {
  if (this.position.x > utils.W) {
    this.position.x = utils.W;
    this.velocity.x *= -1;
  } else if (this.position.x < 0) {
    this.position.x = 0;
    this.velocity.x *= -1;
  }

  if (this.position.y > utils.H) {
    this.position.y = utils.H;
    this.velocity.y *= -1;
  } else if (this.position.y < 0) {
    this.position.y = 0;
    this.velocity.y *= -1;
  }
  return this;
};

Mover.prototype.display = function() {
  this.cx.fillStyle = 'grey';
  this.cx.strokeStyle = 'black';
  utils.ellipse(this.position.x, this.position.y, this.mass * 16);
  return this;
};

module.exports = Mover;
