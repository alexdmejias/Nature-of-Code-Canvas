var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
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

  m = [];
  for (var i = 0; i < 10; i++) {
    m[i] = new Mover(cx, canvas, {
      mass: 1,
      x: utils.range(0, 400),
      y: utils.range(0, 400)
    });
  };
}

function draw() {
  utils.clear();

  for (var i = 0; i < m.length; i++) {
    for (var j = 0; j < m.length; j++) {
      if (j !== i) {
        var f = m[j].attract(m[i]);
        m[i].applyForce(f);
      }
    };
    m[i].update();
    m[i].checkEdges();
    m[i].display();
  };

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
