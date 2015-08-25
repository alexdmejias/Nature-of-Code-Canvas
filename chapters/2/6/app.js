var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , Attractor = require('./_Attractor')
  , Mover = require('./_Mover')
  , V = require('V')
  , utils
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , a
  , m
  ;

function setup() {
  console.log('setup');
  canvas.height = 300;
  canvas.width = 600;
  utils = require('utils')(cx, canvas);

  a = new Attractor(cx, canvas);
  m = new Mover(cx, canvas, {
    mass: 1,
    x: 400,
    y: 50
  });
}

function draw() {
  utils.clear();

  var f = a.attract(m);
  m.applyForce(f);
  m.update();
  m.checkEdges();
  a.display();
  m.display()

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
