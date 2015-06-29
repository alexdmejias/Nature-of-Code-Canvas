var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')(cx, canvas)
  , Mover = require('./_Mover')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , mover = new Mover(cx, canvas)
	, mousePos = {x:0, y: 0}
;

function setup() {
  console.log('setup');
}

function draw() {
  utils.clear();
  mover.update(mousePos);
  mover.checkEdges();
  mover.display();

  window.requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', function(event) {
	mousePos = utils.getMousePos(event);
});

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
