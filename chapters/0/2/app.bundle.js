require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"utils":"utils"}],"utils":[function(require,module,exports){
module.exports = {
  range: function (min, max) {
    if (!max) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min) + min);
  }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8wLzIvYXBwLmpzIiwibW9kdWxlcy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKVxuICAsIGN4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgLCB1dGlscyA9IHJlcXVpcmUoJ3V0aWxzJylcbjtcblxudmFyIFdJRFRIID0gY2FudmFzLndpZHRoXG4gICwgSEVJR0hUID0gY2FudmFzLmhlaWdodFxuO1xuXG52YXIgcmFuZG9tQ291bnRzO1xuXG5mdW5jdGlvbiBzZXR1cCgpIHtcbiAgY29uc29sZS5sb2coJ3NldHVwJyk7XG4gIHJhbmRvbUNvdW50cyA9IG5ldyBBcnJheSgyMCk7XG4gIGZvciAodmFyIGkgPSAwOyByYW5kb21Db3VudHMubGVuZ3RoID4gaTsgaSsrKSB7XG4gICAgcmFuZG9tQ291bnRzW2ldID0gMDtcbiAgfVxufVxuXG5mdW5jdGlvbiBkcmF3KCkge1xuICB2YXIgaW5kZXggPSB1dGlscy5yYW5nZSgtMSwgcmFuZG9tQ291bnRzLmxlbmd0aCk7XG5cbiAgcmFuZG9tQ291bnRzW2luZGV4XSArPSAxO1xuICB2YXIgdyA9IFdJRFRIIC8gcmFuZG9tQ291bnRzLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgcmFuZG9tQ291bnRzLmxlbmd0aCA+IGk7IGkrKykge1xuICAgIGN4LmZpbGxSZWN0KChpKiB3KSAsIEhFSUdIVCAtIHJhbmRvbUNvdW50c1tpXSwgdyAtIDEsIHJhbmRvbUNvdW50c1tpXSk7XG4gIH1cblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufVxuXG4oZnVuY3Rpb24oKSB7XG4gIHNldHVwKCk7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG59KCkpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5nZTogZnVuY3Rpb24gKG1pbiwgbWF4KSB7XG4gICAgaWYgKCFtYXgpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbik7XG4gIH1cbn07XG4iXX0=
