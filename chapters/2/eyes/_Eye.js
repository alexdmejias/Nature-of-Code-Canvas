var V = require('V')
  , utils
;

function Eye(cx, canvas, options) {
  utils = require('utils')(cx, canvas);

  this.cx = cx;
  this.canvas = canvas;

  this.x = options.x;
  this.y = options.y;

  this.size = options.size || 40;
  this.retinaSize = this.size / 3;
  this.retinaFillStyle = options.retinaFillStyle || 'red';

  var half = this.size / 2;
  this.centerVec = new V(half, half);
  this.endVec = new V(half, half);
}

Eye.prototype.display = function() {
  this.cx.save();
  this.cx.translate(this.x, this.y);
  this.cx.fillStyle = 'white';
  utils.ellipse(0 + (this.size / 2), 0 + (this.size / 2), this.size / 2)
  this.cx.restore();
  this.displayRetina();
};

Eye.prototype.update = function(mousePos) {
  this.mousePos = mousePos;
  this.updateRetina();
};

Eye.prototype.updateRetina = function() {
};

Eye.prototype.displayRetina = function() {
  var center = this.size / 2;
  var mouseVec = new V(this.mousePos.x, this.mousePos.y);
  var centerVec = new V(this.x + center, this.y + center);
  mouseVec.sub(centerVec);
  mouseVec.limit(center - (this.retinaSize / 2));
  this.cx.save();
  this.cx.translate(this.x + center, this.y + center);
  utils.ellipse(mouseVec.x, mouseVec.y, this.retinaSize / 2);
  this.cx.restore();
};
module.exports = Eye;
