var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')(cx, canvas)
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
  utils.clear();
  mover.update();
  mover.checkEdges();
  mover.display();

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
