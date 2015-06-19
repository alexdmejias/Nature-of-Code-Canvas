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
  }
};

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8wLzEvX1dhbGtlci5qcyIsImNoYXB0ZXJzLzAvMS9hcHAuanMiLCJtb2R1bGVzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCd1dGlscycpO1xuXG5mdW5jdGlvbiBXYWxrZXIoY29udGV4dCwgb3B0cykge1xuICB0aGlzLmN4ID0gY29udGV4dDtcbiAgdGhpcy54ID0gb3B0cy54IHx8IDA7XG4gIHRoaXMueSA9IG9wdHMueSB8fCAwO1xuICB0aGlzLndpZHRoID0gb3B0cy53aWR0aCB8fCAzO1xufVxuXG5XYWxrZXIucHJvdG90eXBlLmRpc3BsYXkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jeC5maWxsUmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy53aWR0aCk7XG59O1xuXG5XYWxrZXIucHJvdG90eXBlLnN0ZXAgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNob2ljZSA9IHV0aWxzLnJhbmdlKDQpO1xuICBpZiAoY2hvaWNlID09PSAwKSB7XG4gICAgdGhpcy54Kys7XG4gIH0gZWxzZSBpZihjaG9pY2UgPT09IDEpIHtcbiAgICB0aGlzLngtLTtcbiAgfSBlbHNlIGlmKGNob2ljZSA9PT0gMikge1xuICAgIHRoaXMueSsrO1xuICB9IGVsc2Uge1xuICAgIHRoaXMueS0tO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdhbGtlcjtcbiIsInZhciBXYWxrZXIgPSByZXF1aXJlKCcuL19XYWxrZXInKTtcblxudmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKVxuICAsIGN4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbnZhciBIID0gY2FudmFzLmhlaWdodFxuICAsIFcgPSBjYW52YXMud2lkdGhcbjtcblxudmFyIHdhbGtlcjtcblxuZnVuY3Rpb24gc2V0dXAoKSB7XG4gIHdhbGtlciA9IG5ldyBXYWxrZXIoY3gsIHt4OiBXIC8gMiwgeTogSCAvIDIsIHdpZHRoOiAxfSk7XG59XG5cbmZ1bmN0aW9uIGRyYXcoKSB7XG4gIHdhbGtlci5zdGVwKCk7XG4gIHdhbGtlci5kaXNwbGF5KCk7XG5cblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufVxuXG5cbihmdW5jdGlvbigpIHtcbiAgc2V0dXAoKTtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn0oKSk7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmdlOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICBpZiAoIW1heCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKTtcbiAgfVxufTtcbiJdfQ==
