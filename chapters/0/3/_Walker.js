var utils = require('utils');

function Walker(context, opts) {
	this.cx = context;
	this.x = opts.x || 0;
	this.y = opts.y || 0;
	this.width = opts.width || 3;
}

Walker.prototype.display = function() {
	this.cx.fillRect(this.x, this.y, this.width, this.width);
};

Walker.prototype.step = function() {
	var r = Math.random();

	if (r < 0.4) {
		this.x++;
	} else if (r < 0.6) {
		this.x--;
	} else if (r < 0.6) {
		this.y++;
	} else {
		this.y--;
	}
};

module.exports = Walker;
