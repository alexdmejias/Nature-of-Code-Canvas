var utils;

function Liquid(cx, camvas, options) {
  utils = require('utils')(cx, canvas);

  this.cx = cx;
  this.canvas = canvas;

  this.x = options.x;
  this.y = options.y;
  this.w = options.w;
  this.h = options.h;
  this.c = options.c;
}

Liquid.prototype.display = function() {
  this.cx.fillStyle = 'rgba(0, 0, 100, 0.25)';
  this.cx.fillRect(this.x, this.y, this.w, this.h);
}

module.exports = Liquid;
