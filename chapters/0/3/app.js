var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')
	, Walker = require('./_Walker')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
;

var walker;

function setup() {
  console.log('setup');
	walker = new Walker(cx, {x: WIDTH / 2, y: HEIGHT / 2, width: 1});
	//walker = new Walker(cx, {x: W / 2, y: H / 2, width: 1});
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