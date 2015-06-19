require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require('utils');

function Walker(context, opts) {
  var self = this;
  this.cx = context;
  this.x = opts.x || 0;
  this.y = opts.y || 0;
  this.width = opts.width || 3;

  (function() {
    console.log(self.x , self.y);
  }())
  
}

Walker.prototype.display = function() {
  this.cx.fillRect(this.x, this.y, this.width, this.width);
};

Walker.prototype.step = function() {
  this.x += utils.range(-4, 4);
  this.y += utils.range(-4, 4);
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
  walker = new Walker(cx, {x: W / 2, y: H / 2, width: 5});
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8wLzEvX1dhbGtlci5qcyIsImNoYXB0ZXJzLzAvMS9hcHAuanMiLCJtb2R1bGVzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB1dGlscyA9IHJlcXVpcmUoJ3V0aWxzJyk7XG5cbmZ1bmN0aW9uIFdhbGtlcihjb250ZXh0LCBvcHRzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5jeCA9IGNvbnRleHQ7XG4gIHRoaXMueCA9IG9wdHMueCB8fCAwO1xuICB0aGlzLnkgPSBvcHRzLnkgfHwgMDtcbiAgdGhpcy53aWR0aCA9IG9wdHMud2lkdGggfHwgMztcblxuICAoZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coc2VsZi54ICwgc2VsZi55KTtcbiAgfSgpKVxuICBcbn1cblxuV2Fsa2VyLnByb3RvdHlwZS5kaXNwbGF5ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY3guZmlsbFJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMud2lkdGgpO1xufTtcblxuV2Fsa2VyLnByb3RvdHlwZS5zdGVwID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMueCArPSB1dGlscy5yYW5nZSgtNCwgNCk7XG4gIHRoaXMueSArPSB1dGlscy5yYW5nZSgtNCwgNCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdhbGtlcjtcbiIsInZhciBXYWxrZXIgPSByZXF1aXJlKCcuL19XYWxrZXInKTtcblxudmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKVxuICAsIGN4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbnZhciBIID0gY2FudmFzLmhlaWdodFxuICAsIFcgPSBjYW52YXMud2lkdGhcbjtcblxudmFyIHdhbGtlcjtcblxuZnVuY3Rpb24gc2V0dXAoKSB7XG4gIHdhbGtlciA9IG5ldyBXYWxrZXIoY3gsIHt4OiBXIC8gMiwgeTogSCAvIDIsIHdpZHRoOiA1fSk7XG59XG5cbmZ1bmN0aW9uIGRyYXcoKSB7XG4gIHdhbGtlci5zdGVwKCk7XG4gIHdhbGtlci5kaXNwbGF5KCk7XG5cblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufVxuXG5cbihmdW5jdGlvbigpIHtcbiAgc2V0dXAoKTtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn0oKSk7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmdlOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICBpZiAoIW1heCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKTtcbiAgfVxufTtcbiJdfQ==
