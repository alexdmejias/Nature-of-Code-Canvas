var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
;

var randomCounts;

function setup() {
  console.log('setup');
  randomCounts = new Array(20);
  for (var i = 0; randomCounts.length > i; i++) {
    randomCounts[i] = 0;
  }
}

function draw() {
  var index = utils.range(-1, randomCounts.length);

  randomCounts[index] += 1;
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