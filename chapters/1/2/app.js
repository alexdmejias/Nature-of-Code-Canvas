var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')
  , Vector = require('vector2d')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
;

var boxWidth
  , location
  , velocity
;

function setup() {
  boxWidth = 10;
  location = new Vector.ObjectVector(10, 10);
  velocity = new Vector.ObjectVector(1.5, 2.5);
}

function draw() {
  cx.clearRect(0, 0, WIDTH, HEIGHT);

  location.add(velocity);

  if ((location.getX() > WIDTH - boxWidth) || (location.getX() < 0)) {
    velocity.setX(velocity.getX() * -1)

  }

  if ((location.getY() > HEIGHT - boxWidth) || (location.getY() < 0)) {
    velocity.setY(velocity.getY() * -1);
  }

  cx.fillRect(location.getX(), location.getY(), boxWidth, boxWidth);
  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
