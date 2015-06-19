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
  }
};

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8wLzMvX1dhbGtlci5qcyIsImNoYXB0ZXJzLzAvMy9hcHAuanMiLCJtb2R1bGVzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB1dGlscyA9IHJlcXVpcmUoJ3V0aWxzJyk7XG5cbmZ1bmN0aW9uIFdhbGtlcihjb250ZXh0LCBvcHRzKSB7XG5cdHRoaXMuY3ggPSBjb250ZXh0O1xuXHR0aGlzLnggPSBvcHRzLnggfHwgMDtcblx0dGhpcy55ID0gb3B0cy55IHx8IDA7XG5cdHRoaXMud2lkdGggPSBvcHRzLndpZHRoIHx8IDM7XG59XG5cbldhbGtlci5wcm90b3R5cGUuZGlzcGxheSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmN4LmZpbGxSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLndpZHRoKTtcbn07XG5cbldhbGtlci5wcm90b3R5cGUuc3RlcCA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgciA9IE1hdGgucmFuZG9tKCk7XG5cblx0aWYgKHIgPCAwLjQpIHtcblx0XHR0aGlzLngrKztcblx0fSBlbHNlIGlmIChyIDwgMC42KSB7XG5cdFx0dGhpcy54LS07XG5cdH0gZWxzZSBpZiAociA8IDAuNikge1xuXHRcdHRoaXMueSsrO1xuXHR9IGVsc2Uge1xuXHRcdHRoaXMueS0tO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdhbGtlcjtcbiIsInZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJylcbiAgLCBjeCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICwgdXRpbHMgPSByZXF1aXJlKCd1dGlscycpXG5cdCwgV2Fsa2VyID0gcmVxdWlyZSgnLi9fV2Fsa2VyJylcbjtcblxudmFyIFdJRFRIID0gY2FudmFzLndpZHRoXG4gICwgSEVJR0hUID0gY2FudmFzLmhlaWdodFxuO1xuXG52YXIgd2Fsa2VyO1xuXG5mdW5jdGlvbiBzZXR1cCgpIHtcbiAgY29uc29sZS5sb2coJ3NldHVwJyk7XG5cdHdhbGtlciA9IG5ldyBXYWxrZXIoY3gsIHt4OiBXSURUSCAvIDIsIHk6IEhFSUdIVCAvIDIsIHdpZHRoOiAxfSk7XG5cdC8vd2Fsa2VyID0gbmV3IFdhbGtlcihjeCwge3g6IFcgLyAyLCB5OiBIIC8gMiwgd2lkdGg6IDF9KTtcbn1cblxuZnVuY3Rpb24gZHJhdygpIHtcblx0d2Fsa2VyLnN0ZXAoKTtcblx0d2Fsa2VyLmRpc3BsYXkoKTtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn1cblxuKGZ1bmN0aW9uKCkge1xuICBzZXR1cCgpO1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufSgpKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmFuZ2U6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgIGlmICghbWF4KSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xuICB9XG59O1xuIl19
