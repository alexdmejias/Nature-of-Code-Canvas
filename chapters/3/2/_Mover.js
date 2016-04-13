var V = require('V')
  , utils
;

function Mover(cx, canvas, opts) {
  utils = require('utils')(cx, canvas);
  this.cx = cx;
  this.canvas = canvas;

  this.position = new V(opts.x, opts.y);
  this.mass = opts.mass;

  this.angle = 0;
  this.aVelocity = 0;
  this.aAcceleration = 0;

  this.velocity = new V(1, 0);
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

  this.aAcceleration = this.acceleration.x / 10;
  this.aVelocity += this.aAcceleration;
  this.aVelocity = utils.constrain(this.aVelocity, -0.1, 0.1);
  this.angle += this.aVelocity;

  this.acceleration.mult(0);

  return this;
};

Mover.prototype.checkEdges = function() {
  if (this.position.x > utils.W()) {
    this.position.x = utils.W();
    this.velocity.x *= -1;
  } else if (this.position.x < 0) {
    this.velocity.x *= -1;
    this.position.x = 0;
  }

  if (this.position.y > utils.H()) {
    this.position.y = utils.H();
    this.velocity.y *= -1;
  }
  return this;
};

// Mover.prototype.drag = function(liquid) {
//   var speed = this.velocity.mag();
//   var dragMagnitude = liquid.c * speed * speed;
//   var drag = this.velocity.copy();
//   drag.mult(-1);
//   drag.normalize();
//   drag.mult(dragMagnitude);
//   this.applyForce(drag);
// };

Mover.prototype.display = function() {
  this.cx.fillStyle = 'grey';
  this.cx.strokeStyle = 'black';
  this.cx.save();
  this.cx.translate(this.position.x, this.position.y);
  this.cx.rotate(this.angle);
  this.cx.fillRect(0, 0, this.mass * 16, this.mass * 16);
  this.cx.restore();

  return this;
};

module.exports = Mover;
