var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')(cx, canvas)
;

var Mover = require('./_Mover'),
  Attractor = require('./_Attractor');

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , a
  , m
;

function setup() {
  console.log('setup');
  utils = require('utils')(cx, canvas);

  a = new Attractor(cx, canvas);
  m = [];
  for (var i = 0; i < 10; i++) {
    m[i] = new Mover(cx, canvas, {
      mass: 1,
      x: utils.range(0, 400),
      y: 50
    });
  };
}

function draw() {
  utils.clear();

  a.display();

  for(let i = 0; i < m.length; i++) {
    let force = a.calculateAttraction(m[i]);
    m[i].applyForce(force);
    m[i].update();
    m[i].display();


  }

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
