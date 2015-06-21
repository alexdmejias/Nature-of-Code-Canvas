var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')
  , Walker = require('./_Walker')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , walker
;

function setup() {
  console.log('setup');
  walker = new Walker(cx, {}, canvas);
}

function draw() {
  walker.step();
	walker.display();

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
