var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')(cx, canvas)
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
;

var randomCounts;

function setup() {
  console.log('setup');
  var totalBars = 20;
  randomCounts = [];
  for (var i = 0; i < totalBars; i++) {
    randomCounts[i] = 0;
  }
}

function draw() {
  var index = Math.floor(utils.range(0, 20));

  randomCounts[index]++;
  var w = WIDTH / randomCounts.length;

  for (var i = 0; randomCounts.length > i; i++) {
    cx.fillRect((i* w) , HEIGHT - randomCounts[i], w - 1, randomCounts[i]);
  }

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
