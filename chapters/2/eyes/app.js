var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , V = require('V')
  , Eye = require('./_Eye')
  , utils
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , left
  , right
  , mousePos = {x: 0, y: 0}
;

function setup() {
  console.log('setup');
  canvas.height = 300;
  canvas.width = 600;
  utils = require('utils')(cx, canvas);

  var eyeSize = 100;

  left = new Eye(cx, canvas, {x: 200, y: 100, size: eyeSize});
  right = new Eye(cx, canvas, {x: 400, y: 100, size: eyeSize});
}

function draw() {
  utils.clear();

  left.update(mousePos);
  right.update(mousePos);

  left.display();
  right.display();

  window.requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', function(event) {
  mousePos = utils.getMousePos(event);
});

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
