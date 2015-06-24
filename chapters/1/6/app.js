var canvas = document.getElementById('canvas')
	, cx = canvas.getContext('2d')
	, utils = require('utils')(cx, canvas)
	, Vector = require('vector2d')
	;

var WIDTH = canvas.width
	, HEIGHT = canvas.height
	;

var centerVec
	, mouseVec
	, mousePos
	, magnitude
	, xPanning = WIDTH / 2
	, yPanning = HEIGHT / 2
	;

function setup() {
	console.log('setup');
	mousePos = {x: 0, y: 0};
	centerVec = new Vector.ObjectVector(xPanning, yPanning);
	mouseVec = new Vector.ObjectVector(0, 0);
}

function draw() {
	utils.clear();

	mouseVec.setAxes(mousePos.x, mousePos.y);

	mouseVec.subtract(centerVec);
	mouseVec.normalize();
	mouseVec.mulS(50);
	//magnitude = mouseVec.magnitude();
	//cx.fillRect(0, 0, magnitude, 10);

	cx.translate(xPanning, yPanning);

	cx.beginPath();
	cx.moveTo(0, 0);
	cx.lineTo(mouseVec.getX(), mouseVec.getY());
	cx.stroke();

	cx.resetTransform();
	window.requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', function(event) {
	mousePos = utils.getMousePos(event);
});

(function() {
	setup();
	window.requestAnimationFrame(draw);
}());
