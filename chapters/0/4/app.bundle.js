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
  },
  // taken from the p5.js project
  // https://github.com/processing/p5.js/blob/5c81d655f683f90452b80ab225a67e449463fff9/src/math/calculation.js#L394
  map: function(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8wLzQvYXBwLmpzIiwibm9kZV9tb2R1bGVzL2dhdXNzLXJhbmRvbS9zYW1wbGUuanMiLCJtb2R1bGVzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJylcbiAgLCBjeCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICwgdXRpbHMgPSByZXF1aXJlKCd1dGlscycpXG4gICwgZ2F1c3NpYW4gPSByZXF1aXJlKCdnYXVzcy1yYW5kb20nKVxuO1xuXG52YXIgV0lEVEggPSBjYW52YXMud2lkdGhcbiAgLCBIRUlHSFQgPSBjYW52YXMuaGVpZ2h0XG47XG5cbmZ1bmN0aW9uIHNldHVwKCkge1xuICBjb25zb2xlLmxvZygnc2V0dXAnKTtcbn1cblxuZnVuY3Rpb24gZHJhdygpIHtcbiAgY3guZmlsbFN0eWxlID0gJ3JnYmEoMjU1LDI1NSwyNTUsIDAuMDA1KSc7XG4gIGN4LmZpbGxSZWN0KDAsMCxXSURUSCwgSEVJR0hUKTtcblxuICB2YXIgbnVtID0gMzAgKiBnYXVzc2lhbigpICsgV0lEVEggLyAyO1xuICBjeC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwgMC4xNSknO1xuICBjeC5maWxsUmVjdChudW0sIDEwICwgMTAgLDEwKTtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn1cblxuKGZ1bmN0aW9uKCkge1xuICBzZXR1cCgpO1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufSgpKTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdhdXNzUmFuZG9tXG5cbmZ1bmN0aW9uIGdhdXNzUmFuZG9tKCkge1xuICByZXR1cm4gTWF0aC5zcXJ0KC0yLjAgKiBNYXRoLmxvZyhNYXRoLnJhbmRvbSgpKSkgKiBNYXRoLmNvcygyLjAgKiBNYXRoLlBJICogTWF0aC5yYW5kb20oKSlcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmFuZ2U6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgIGlmICghbWF4KSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xuICB9LFxuICAvLyB0YWtlbiBmcm9tIHRoZSBwNS5qcyBwcm9qZWN0XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9jZXNzaW5nL3A1LmpzL2Jsb2IvNWM4MWQ2NTVmNjgzZjkwNDUyYjgwYWIyMjVhNjdlNDQ5NDYzZmZmOS9zcmMvbWF0aC9jYWxjdWxhdGlvbi5qcyNMMzk0XG4gIG1hcDogZnVuY3Rpb24obiwgc3RhcnQxLCBzdG9wMSwgc3RhcnQyLCBzdG9wMikge1xuICAgIHJldHVybiAoKG4tc3RhcnQxKS8oc3RvcDEtc3RhcnQxKSkqKHN0b3AyLXN0YXJ0Mikrc3RhcnQyO1xuICB9XG59O1xuIl19
