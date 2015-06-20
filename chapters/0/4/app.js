var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')
  , gaussian = require('gauss-random')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
;

function setup() {
  console.log('setup');
}

function draw() {
  cx.fillStyle = 'rgba(255,255,255, 0.005)';
  cx.fillRect(0,0,WIDTH, HEIGHT);

  var num = 30 * gaussian() + WIDTH / 2;
  cx.fillStyle = 'rgba(0,0,0, 0.15)';
  cx.fillRect(num, 10 , 10 ,10);
  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
