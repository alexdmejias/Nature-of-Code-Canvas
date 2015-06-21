require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require('utils');

function Walker(context, opts) {
  this.cx = context;
  this.x = opts.x || 0;
  this.y = opts.y || 0;
  this.width = opts.width || 3;
}

Walker.prototype.display = function() {
  this.cx.fillRect(this.x, this.y, this.width, this.width);
};

Walker.prototype.step = function() {
  var choice = utils.range(4);
  if (choice === 0) {
    this.x++;
  } else if(choice === 1) {
    this.x--;
  } else if(choice === 2) {
    this.y++;
  } else {
    this.y--;
  }
};

module.exports = Walker;

},{"utils":"utils"}],2:[function(require,module,exports){
var Walker = require('./_Walker');

var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d');

var H = canvas.height
  , W = canvas.width
;

var walker;

function setup() {
  walker = new Walker(cx, {x: W / 2, y: H / 2, width: 1});
}

function draw() {
  walker.step();
  walker.display();


  window.requestAnimationFrame(draw);
}


(function() {
  setup();
  window.requestAnimationFrame(draw);
}());
},{"./_Walker":1}],"utils":[function(require,module,exports){
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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8wLzEvX1dhbGtlci5qcyIsImNoYXB0ZXJzLzAvMS9hcHAuanMiLCJtb2R1bGVzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHV0aWxzID0gcmVxdWlyZSgndXRpbHMnKTtcblxuZnVuY3Rpb24gV2Fsa2VyKGNvbnRleHQsIG9wdHMpIHtcbiAgdGhpcy5jeCA9IGNvbnRleHQ7XG4gIHRoaXMueCA9IG9wdHMueCB8fCAwO1xuICB0aGlzLnkgPSBvcHRzLnkgfHwgMDtcbiAgdGhpcy53aWR0aCA9IG9wdHMud2lkdGggfHwgMztcbn1cblxuV2Fsa2VyLnByb3RvdHlwZS5kaXNwbGF5ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY3guZmlsbFJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMud2lkdGgpO1xufTtcblxuV2Fsa2VyLnByb3RvdHlwZS5zdGVwID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjaG9pY2UgPSB1dGlscy5yYW5nZSg0KTtcbiAgaWYgKGNob2ljZSA9PT0gMCkge1xuICAgIHRoaXMueCsrO1xuICB9IGVsc2UgaWYoY2hvaWNlID09PSAxKSB7XG4gICAgdGhpcy54LS07XG4gIH0gZWxzZSBpZihjaG9pY2UgPT09IDIpIHtcbiAgICB0aGlzLnkrKztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnktLTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXYWxrZXI7XG4iLCJ2YXIgV2Fsa2VyID0gcmVxdWlyZSgnLi9fV2Fsa2VyJyk7XG5cbnZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJylcbiAgLCBjeCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG52YXIgSCA9IGNhbnZhcy5oZWlnaHRcbiAgLCBXID0gY2FudmFzLndpZHRoXG47XG5cbnZhciB3YWxrZXI7XG5cbmZ1bmN0aW9uIHNldHVwKCkge1xuICB3YWxrZXIgPSBuZXcgV2Fsa2VyKGN4LCB7eDogVyAvIDIsIHk6IEggLyAyLCB3aWR0aDogMX0pO1xufVxuXG5mdW5jdGlvbiBkcmF3KCkge1xuICB3YWxrZXIuc3RlcCgpO1xuICB3YWxrZXIuZGlzcGxheSgpO1xuXG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn1cblxuXG4oZnVuY3Rpb24oKSB7XG4gIHNldHVwKCk7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG59KCkpOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICByYW5nZTogZnVuY3Rpb24gKG1pbiwgbWF4KSB7XG4gICAgaWYgKCFtYXgpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbik7XG4gIH0sXG4gIC8vIHRha2VuIGZyb20gdGhlIHA1LmpzIHByb2plY3RcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Byb2Nlc3NpbmcvcDUuanMvYmxvYi81YzgxZDY1NWY2ODNmOTA0NTJiODBhYjIyNWE2N2U0NDk0NjNmZmY5L3NyYy9tYXRoL2NhbGN1bGF0aW9uLmpzI0wzOTRcbiAgbWFwOiBmdW5jdGlvbihuLCBzdGFydDEsIHN0b3AxLCBzdGFydDIsIHN0b3AyKSB7XG4gICAgcmV0dXJuICgobi1zdGFydDEpLyhzdG9wMS1zdGFydDEpKSooc3RvcDItc3RhcnQyKStzdGFydDI7XG4gIH1cbn07XG4iXX0=
