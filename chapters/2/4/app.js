var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , Mover = require('./_Mover')
  , V = require('V')
  , utils
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , movers = []
  , qty = 1 // number of Movers to create
  , wind
  , gravity
;

function setup() {
  console.log('setup');
  canvas.height = 300;
  canvas.width = 600;
  utils = require('utils')(cx, canvas);

  for(var i = 0; qty > i; i++) {
    var options = {
      mass: utils.range(1, 4),
      x: 0,
      y: 0
    }
    movers[i] = new Mover(cx, canvas, options);
  }
  wind = new V(0.01, 0);
}

function draw() {
  utils.clear();

  movers.forEach(function(mover) {
    // new gravity proportional to the object's mass
    var gravity = new V(0, 0.1 * mover.mass);

    // friction
    var c = 0.01
    , normal = 1
    , frictionMag = c * normal
    , friction = mover.velocity.copy()

    friction.mult(-1)
      .normalize()
      .mult(frictionMag);

    mover.applyForce(friction)
      .applyForce(wind)
      .applyForce(gravity);

    mover.update()
      .checkEdges()
      .display();

  });

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
