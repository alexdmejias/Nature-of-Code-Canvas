var utils = require('utils');

function Walker(context, opts) {
  var self = this;
  this.cx = context;
  this.x = opts.x || 0;
  this.y = opts.y || 0;
  this.width = opts.width || 3;

  (function() {
    console.log(self.x , self.y);
  }())
  
}

Walker.prototype.display = function() {
  this.cx.fillRect(this.x, this.y, this.width, this.width);
};

Walker.prototype.step = function() {
  this.x += utils.range(-4, 4);
  this.y += utils.range(-4, 4);
};

module.exports = Walker;
