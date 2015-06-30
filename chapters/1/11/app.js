var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')(cx, canvas)
  , Mover = require('./_Mover')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
	, movers = []
	, moversQty = 50
  //, mover = new Mover(cx, canvas)
	, mousePos = {x:0, y: 0}
;

function setup() {
  console.log('setup');
	for (var i = 0; moversQty > i; i++) {
		movers[i] = new Mover(cx, canvas);
	}
}

function draw() {
  utils.clear();
	cx.fillStyle = 'white';
	cx.strokeStyle = 'black';
	for (var i = 0; moversQty > i; i++) {
		cx.beginPath();
		movers[i].update(mousePos);
		movers[i].checkEdges();
		movers[i].display();
		cx.stroke();
		cx.fill();
	}
  window.requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', function(event) {
	mousePos = utils.getMousePos(event);
});

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
