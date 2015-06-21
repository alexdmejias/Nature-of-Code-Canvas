var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
;

var x = 100
  , y = 100
  , xSpeed = 1
  , ySpeed = 1
;

function setup() {
  console.log('setup');
}

function draw() {
  cx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  cx.fillRect(0, 0, WIDTH, HEIGHT);

  cx.fillStyle = 'black';
  x = x + xSpeed;
  y = y + ySpeed;

  if ((x > WIDTH - 16) || (x < 0)) {
    xSpeed = xSpeed * -1;
  }

  if ((y > HEIGHT - 16) || (y < 0)) {
    ySpeed = ySpeed * -1;
  }

  cx.fillRect(x, y, 16, 16);

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
