var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')
	, Mover = require('./_Mover')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , mover = new Mover(cx, canvas)
;

function setup() {
  console.log('setup');
}

function draw() {
  cx.clearRect(0, 0, WIDTH, HEIGHT);
  mover.update();
  mover.checkEdges();
  mover.display();

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
