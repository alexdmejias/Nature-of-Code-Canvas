var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , Mover = require('./_Mover')
  , V = require('V')
  , utils
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , movers = []
  , qty = 20 // number of Movers to create
  , wind
  , gravity
;

function setup() {
  console.log('setup');
  canvas.height = 600;
  canvas.width = 600;
  utils = require('utils')(cx, canvas)

  for(var i = 0; qty > i; i++) {
    var options = {
      mass: utils.range(1, 4),
      x: 0,
      y: 0
    }
    movers[i] = new Mover(cx, canvas, options);
  }
  wind = new V(0.001, 0);
  gravity = new V(0, 0.1);
}


function draw() {
  utils.clear();
  for(var i = 0; qty > i; i++) {
    movers[i].applyForce(wind);

    // new gravity proportional to the object's mass
    var gravity = new V(0, 0.1 * movers[i].mass);
    movers[i].applyForce(gravity);

    movers[i].update();
    movers[i].checkEdges();
    movers[i].display();
  }

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
