var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')(cx, canvas)
  , V = require('V')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
;

var centerVec
  , mouseVec
  , mousePos
  , xPanning = WIDTH / 2
  , yPanning = HEIGHT / 2
;

function setup() {
  console.log('setup');
  mousePos = {x: 0, y: 0};
  centerVec = new V(xPanning, yPanning);
  mouseVec = new V(0, 0);
}

function draw() {
  utils.clear();
  mouseVec = new V(mousePos.x, mousePos.y);
  mouseVec.sub(centerVec);

  cx.translate(xPanning, yPanning);

  cx.beginPath();
  cx.moveTo(0, 0);
  cx.lineTo(mouseVec.x, mouseVec.y);
  cx.stroke();

  cx.resetTransform();
  window.requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', function(event) {
  mousePos = utils.getMousePos(event);
});

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
