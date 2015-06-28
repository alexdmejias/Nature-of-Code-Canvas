var Vector = require('vector2d')
  , utils
;

function Mover(cx, canvas) {
  utils = require('utils')(cx, canvas);
  this.cx = cx;
  this.canvas = canvas;
  this.location = new Vector.ObjectVector(canvas.width, canvas.height);
  this.velocity = new Vector.ObjectVector(utils.range(-2, 2), utils.range(-2, 2));
}

Mover.prototype.update = function() {
  this.location.add(this.velocity);
};

Mover.prototype.checkEdges = function () {
  if (this.location.getX() > this.canvas.width) {
    this.location.setX(0);
  } else if (this.location.getX() < 0) {
    this.location.setX(canvas.width);
  }

  if (this.location.getY() > this.canvas.height) {
    this.location.setX(0);
  } else if (this.location.getY() < 0){
    this.location.setY(this.canvas.height);
  }
};

Mover.prototype.display = function () {
  this.cx.fillRect(this.location.getX(), this.location.getY(), 10, 10);
};

module.exports = Mover;
