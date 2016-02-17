var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')(cx, canvas)
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
;

let angle = 0;
let aVelocity = 0;
let aAcceleration = 0.001;

function setup() {
}

function draw() {
  cx.save();
  cx.fillStyle = "white";
  cx.globalAlpha = 0.1;
  cx.fillRect(0, 0, WIDTH, HEIGHT);
  cx.restore();

  cx.save();
  cx.translate(utils.HW(), utils.HH());
  cx.rotate(angle);
  utils.ellipse(-50, 0, 8);
  utils.ellipse(50, 0, 8);
  cx.beginPath();
  cx.moveTo(-50, 0);
  cx.lineTo(50, 0);
  cx.stroke();

  aVelocity += aAcceleration;
  angle += aVelocity;

  cx.restore();

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
