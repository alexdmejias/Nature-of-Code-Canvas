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
;

function setup() {
  console.log('setup');
  mousePos = {x: 0, y: 0};
  centerVec = new Vector.ObjectVector(WIDTH / 2, HEIGHT / 2);
	mouseVec = new Vector.ObjectVector(0, 0);
}

function draw() {
	utils.clear();

	var xPanning = WIDTH / 2;
	var yPanning = HEIGHT / 2;

	cx.translate(xPanning, yPanning);

	// set the mouseVector to the position of the mouse
	// modify the mousePos cords by the amount of the matrix
	// translation
	mouseVec.setX(mousePos.x - xPanning);
	mouseVec.setY(mousePos.y - yPanning);

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
