var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')(cx, canvas)
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
;

function setup() {
  console.log('setup');

}

function draw() {

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
