var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , Mover = require('./_Mover')
  , Liquid = require('./_Liquid')
  , V = require('V')
  , utils
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , movers = []
  , liquid
  , qty = 5 // number of Movers to create
  , wind
  , gravity
;

function setup() {
  console.log('setup');
  canvas.height = 300;
  canvas.width = 600;
  utils = require('utils')(cx, canvas);

  liquid = new Liquid(cx, canvas, {x:0, y: utils.H - 100, w: utils.W, h: 100, c: 0.1})

  for(var i = 0; qty > i; i++) {
    var options = {
      mass: utils.range(1, 4),
      x: 100 + (i * 100),
      y: 0
    }
    movers[i] = new Mover(cx, canvas, options);
  }
}

function draw() {
  utils.clear();

  liquid.display();

  movers.forEach(function(mover) {
    if (mover.isInside(liquid)) {
      mover.drag(liquid);
    };

    // new gravity proportional to the object's mass
    var gravity = new V(0, 0.1 * mover.mass);
    mover
      .applyForce(gravity);

    mover
      .update()
      .checkEdges()
      .display();
  });


  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
