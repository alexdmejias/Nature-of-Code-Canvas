var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')(cx, canvas)
  , Mover = require('./_Mover')
  , V = require('V')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , mover
  , wind
  , gravity
;

function setup() {
  console.log('setup');
  canvas.height = 600;
  canvas.width = 600;

  mover = new Mover(cx, canvas);
  wind = new V(0.01, 0);
  gravity = new V(0, 0.1);
}


function draw() {
  utils.clear();
  mover.applyForce(wind);
  mover.applyForce(gravity);

  mover.update();
  mover.checkEdges();
  mover.display();

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
