require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')
  , gaussian = require('gauss-random')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
;

function setup() {
  console.log('setup');
}

function draw() {
  cx.fillStyle = 'rgba(255,255,255, 0.005)';
  cx.fillRect(0,0,WIDTH, HEIGHT);

  var num = 30 * gaussian() + WIDTH / 2;
  cx.fillStyle = 'rgba(0,0,0, 0.15)';
  cx.fillRect(num, 10 , 10 ,10);
  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());

},{"gauss-random":2,"utils":"utils"}],2:[function(require,module,exports){
'use strict'

module.exports = gaussRandom

function gaussRandom() {
  return Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random())
}
},{}],"utils":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8wLzQvYXBwLmpzIiwibm9kZV9tb2R1bGVzL2dhdXNzLXJhbmRvbS9zYW1wbGUuanMiLCJtb2R1bGVzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKVxuICAsIGN4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgLCB1dGlscyA9IHJlcXVpcmUoJ3V0aWxzJylcbiAgLCBnYXVzc2lhbiA9IHJlcXVpcmUoJ2dhdXNzLXJhbmRvbScpXG47XG5cbnZhciBXSURUSCA9IGNhbnZhcy53aWR0aFxuICAsIEhFSUdIVCA9IGNhbnZhcy5oZWlnaHRcbjtcblxuZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNvbnNvbGUubG9nKCdzZXR1cCcpO1xufVxuXG5mdW5jdGlvbiBkcmF3KCkge1xuICBjeC5maWxsU3R5bGUgPSAncmdiYSgyNTUsMjU1LDI1NSwgMC4wMDUpJztcbiAgY3guZmlsbFJlY3QoMCwwLFdJRFRILCBIRUlHSFQpO1xuXG4gIHZhciBudW0gPSAzMCAqIGdhdXNzaWFuKCkgKyBXSURUSCAvIDI7XG4gIGN4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLCAwLjE1KSc7XG4gIGN4LmZpbGxSZWN0KG51bSwgMTAgLCAxMCAsMTApO1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufVxuXG4oZnVuY3Rpb24oKSB7XG4gIHNldHVwKCk7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG59KCkpO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gZ2F1c3NSYW5kb21cblxuZnVuY3Rpb24gZ2F1c3NSYW5kb20oKSB7XG4gIHJldHVybiBNYXRoLnNxcnQoLTIuMCAqIE1hdGgubG9nKE1hdGgucmFuZG9tKCkpKSAqIE1hdGguY29zKDIuMCAqIE1hdGguUEkgKiBNYXRoLnJhbmRvbSgpKVxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5nZTogZnVuY3Rpb24gKG1pbiwgbWF4KSB7XG4gICAgaWYgKCFtYXgpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbik7XG4gIH1cbn07XG4iXX0=
