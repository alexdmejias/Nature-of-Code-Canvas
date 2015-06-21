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
	var r = Math.random();

	if (r < 0.4) {
		this.x++;
	} else if (r < 0.6) {
		this.x--;
	} else if (r < 0.6) {
		this.y++;
	} else {
		this.y--;
	}
};

module.exports = Walker;

},{"utils":"utils"}],2:[function(require,module,exports){
var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')
	, Walker = require('./_Walker')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
;

var walker;

function setup() {
  console.log('setup');
	walker = new Walker(cx, {x: WIDTH / 2, y: HEIGHT / 2, width: 1});
	//walker = new Walker(cx, {x: W / 2, y: H / 2, width: 1});
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
},{"./_Walker":1,"utils":"utils"}],"utils":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8wLzMvX1dhbGtlci5qcyIsImNoYXB0ZXJzLzAvMy9hcHAuanMiLCJtb2R1bGVzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCd1dGlscycpO1xuXG5mdW5jdGlvbiBXYWxrZXIoY29udGV4dCwgb3B0cykge1xuXHR0aGlzLmN4ID0gY29udGV4dDtcblx0dGhpcy54ID0gb3B0cy54IHx8IDA7XG5cdHRoaXMueSA9IG9wdHMueSB8fCAwO1xuXHR0aGlzLndpZHRoID0gb3B0cy53aWR0aCB8fCAzO1xufVxuXG5XYWxrZXIucHJvdG90eXBlLmRpc3BsYXkgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jeC5maWxsUmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy53aWR0aCk7XG59O1xuXG5XYWxrZXIucHJvdG90eXBlLnN0ZXAgPSBmdW5jdGlvbigpIHtcblx0dmFyIHIgPSBNYXRoLnJhbmRvbSgpO1xuXG5cdGlmIChyIDwgMC40KSB7XG5cdFx0dGhpcy54Kys7XG5cdH0gZWxzZSBpZiAociA8IDAuNikge1xuXHRcdHRoaXMueC0tO1xuXHR9IGVsc2UgaWYgKHIgPCAwLjYpIHtcblx0XHR0aGlzLnkrKztcblx0fSBlbHNlIHtcblx0XHR0aGlzLnktLTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXYWxrZXI7XG4iLCJ2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpXG4gICwgY3ggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAsIHV0aWxzID0gcmVxdWlyZSgndXRpbHMnKVxuXHQsIFdhbGtlciA9IHJlcXVpcmUoJy4vX1dhbGtlcicpXG47XG5cbnZhciBXSURUSCA9IGNhbnZhcy53aWR0aFxuICAsIEhFSUdIVCA9IGNhbnZhcy5oZWlnaHRcbjtcblxudmFyIHdhbGtlcjtcblxuZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNvbnNvbGUubG9nKCdzZXR1cCcpO1xuXHR3YWxrZXIgPSBuZXcgV2Fsa2VyKGN4LCB7eDogV0lEVEggLyAyLCB5OiBIRUlHSFQgLyAyLCB3aWR0aDogMX0pO1xuXHQvL3dhbGtlciA9IG5ldyBXYWxrZXIoY3gsIHt4OiBXIC8gMiwgeTogSCAvIDIsIHdpZHRoOiAxfSk7XG59XG5cbmZ1bmN0aW9uIGRyYXcoKSB7XG5cdHdhbGtlci5zdGVwKCk7XG5cdHdhbGtlci5kaXNwbGF5KCk7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG59XG5cbihmdW5jdGlvbigpIHtcbiAgc2V0dXAoKTtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn0oKSk7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmdlOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICBpZiAoIW1heCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKTtcbiAgfSxcbiAgLy8gdGFrZW4gZnJvbSB0aGUgcDUuanMgcHJvamVjdFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vcHJvY2Vzc2luZy9wNS5qcy9ibG9iLzVjODFkNjU1ZjY4M2Y5MDQ1MmI4MGFiMjI1YTY3ZTQ0OTQ2M2ZmZjkvc3JjL21hdGgvY2FsY3VsYXRpb24uanMjTDM5NFxuICBtYXA6IGZ1bmN0aW9uKG4sIHN0YXJ0MSwgc3RvcDEsIHN0YXJ0Miwgc3RvcDIpIHtcbiAgICByZXR1cm4gKChuLXN0YXJ0MSkvKHN0b3AxLXN0YXJ0MSkpKihzdG9wMi1zdGFydDIpK3N0YXJ0MjtcbiAgfVxufTtcbiJdfQ==
