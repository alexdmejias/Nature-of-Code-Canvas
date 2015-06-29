var utils
	, PerlinGenerator = require('proc-noise')
	, noise = new PerlinGenerator()
;

function Walker(context, opts, canvas) {
	utils = require('utils')(context, canvas);
	this.cx = context;
	this.x = opts.x || 0;
	this.y = opts.y || 0;
	this.width = opts.width || 3;

	this.noiseX = 0
	this.noiseY = 100;

	this.canvas = canvas;
}

Walker.prototype.display = function() {
	this.cx.fillRect(this.x, this.y, this.width, this.width);
};

Walker.prototype.step = function() {
	this.x = utils.map(noise.noise(this.noiseX), 0, 1, 0, this.canvas.width);
	this.y = utils.map(noise.noise(this.noiseY), 0, 1, 0, this.canvas.height);

	this.noiseX += 0.01;
	this.noiseY += 0.01;
};

module.exports = Walker;
