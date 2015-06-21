require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require('utils')
	, PerlinGenerator = require('proc-noise')
	, noise = new PerlinGenerator()
;

function Walker(context, opts, canvas) {
	this.cx = context;
	this.x = opts.x || 0;
	this.y = opts.y || 0;
	this.width = opts.width || 3;

	this.noiseX = 0
	this.noiseY = 100;

	this.canvas = canvas;
}

Walker.prototype.display = function() {
	this.cx.fillRect(this.x, this.y, this.width, this.width);
};

Walker.prototype.step = function() {
	this.x = utils.map(noise.noise(this.noiseX), 0, 1, 0, this.canvas.width);
	this.y = utils.map(noise.noise(this.noiseY), 0, 1, 0, this.canvas.height);

	this.noiseX += 0.01;
	this.noiseY += 0.01;
};

module.exports = Walker;

},{"proc-noise":3,"utils":"utils"}],2:[function(require,module,exports){
var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')
  , Walker = require('./_Walker')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , walker
;

function setup() {
  console.log('setup');
  walker = new Walker(cx, {}, canvas);
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

},{"./_Walker":1,"utils":"utils"}],3:[function(require,module,exports){
// PERLIN NOISE
// based 99.999% on Processing's implementation, found here:
// https://github.com/processing/processing/blob/master/core/src/processing/core/PApplet.java
// credit goes entirely to them. i just ported it to javascript.

var Alea = require("alea"); // this is pretty great, btw

var Perlin = module.exports = function(seed) {
	if (seed != undefined) {
		this.alea_rand = new Alea(seed); // use provided seed
	} else {
		this.alea_rand = new Alea(); // use random seed
	}
	this.PERLIN_YWRAPB = 4;
	this.PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
	this.PERLIN_ZWRAPB = 8;
	this.PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
	this.PERLIN_SIZE = 4095;
	this.perlin_octaves = 4; // default to medium smooth
	this.perlin_amp_falloff = 0.5; // 50% reduction/octave
	this.perlin_array = new Array();
	// generate cos lookup table
	var DEG_TO_RAD = 0.0174532925;
	var SINCOS_PRECISION = 0.5;
	var SINCOS_LENGTH = Math.floor(360/SINCOS_PRECISION);
	this.cosLUT = new Array();
	for (var i = 0; i < SINCOS_LENGTH; i++) {
		this.cosLUT[i] = Math.cos(i * DEG_TO_RAD * SINCOS_PRECISION);
	}
	this.perlin_TWOPI = SINCOS_LENGTH;
	this.perlin_PI = SINCOS_LENGTH;
	this.perlin_PI >>= 1;
}

Perlin.prototype.noiseReseed = function() {
	this.alea_rand = new Alea(); // new random seed
	this.perlin_array = new Array(); // start the perlin array fresh
}

Perlin.prototype.noiseSeed = function(seed) {
	this.alea_rand = new Alea(seed); // use provided seed
	this.perlin_array = new Array(); // start the perlin array fresh
}


Perlin.prototype.noiseDetail = function(lod, falloff) {
	if (Math.floor(lod) > 0) this.perlin_octaves = Math.floor(lod);
	if (falloff != undefined && falloff > 0) this.perlin_amp_falloff = falloff;
}

Perlin.prototype.noise_fsc = function(i) {
	return 0.5 * (1.0 - this.cosLUT[Math.floor(i * this.perlin_PI) % this.perlin_TWOPI]);
}

Perlin.prototype.noise = function(x, y, z) {
	if (x == undefined) {
		return false; // we need at least one param
	}
	if (y == undefined) {
		y = 0; // use 0 if not provided
	}
	if (z == undefined) {
		z = 0; // use 0 if not provided
	}
	
	// build the first perlin array if there isn't one
	if (this.perlin_array.length == 0) {
		this.perlin_array = new Array();
		for (var i = 0; i < this.PERLIN_SIZE + 1; i++) {
			this.perlin_array[i] = this.alea_rand();
		}
	}

	if (x < 0) x = -x;
	if (y < 0) y = -y;
	if (z < 0) z = -z;
	var xi = Math.floor(x);
	var yi = Math.floor(y);
	var zi = Math.floor(z);
	var xf = x - xi;
	var yf = y - yi;
	var zf = z - zi;
	var r = 0;
	var ampl = 0.5;
	var rxf, ryf, n1, n2, n3;
	
	for (var i = 0; i < this.perlin_octaves; i++) {
		// look at all this math stuff
		var of = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);
		rxf = this.noise_fsc(xf);
		ryf = this.noise_fsc(yf);
		n1  = this.perlin_array[of & this.PERLIN_SIZE];
		n1 += rxf * (this.perlin_array[(of + 1) & this.PERLIN_SIZE] - n1);
		n2  = this.perlin_array[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
		n2 += rxf * (this.perlin_array[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
		n1 += ryf * (n2-n1);
		of += this.PERLIN_ZWRAP;
		n2  = this.perlin_array[of & this.PERLIN_SIZE];
		n2 += rxf * (this.perlin_array[(of + 1) & this.PERLIN_SIZE] - n2);
		n3  = this.perlin_array[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
		n3 += rxf * (this.perlin_array[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n3);
		n2 += ryf * (n3 - n2);
		n1 += this.noise_fsc(zf) * (n2 - n1);
		r += n1 * ampl;
		ampl *= this.perlin_amp_falloff;
		xi <<= 1;
		xf *= 2;
		yi <<= 1;
		yf *= 2;
		zi <<= 1; 
		zf *= 2;
		if (xf >= 1) { xi++; xf--; }
		if (yf >= 1) { yi++; yf--; }
		if (zf >= 1) { zi++; zf--; }
	}
	return r;
}

},{"alea":4}],4:[function(require,module,exports){
(function (root, factory) {
  if (typeof exports === 'object') {
      module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
      define(factory);
  } else {
      root.Alea = factory();
  }
}(this, function () {

  'use strict';

  // From http://baagoe.com/en/RandomMusings/javascript/

  // importState to sync generator states
  Alea.importState = function(i){
    var random = new Alea();
    random.importState(i);
    return random;
  };

  return Alea;

  function Alea() {
    return (function(args) {
      // Johannes Baagøe <baagoe@baagoe.com>, 2010
      var s0 = 0;
      var s1 = 0;
      var s2 = 0;
      var c = 1;

      if (args.length == 0) {
        args = [+new Date];
      }
      var mash = Mash();
      s0 = mash(' ');
      s1 = mash(' ');
      s2 = mash(' ');

      for (var i = 0; i < args.length; i++) {
        s0 -= mash(args[i]);
        if (s0 < 0) {
          s0 += 1;
        }
        s1 -= mash(args[i]);
        if (s1 < 0) {
          s1 += 1;
        }
        s2 -= mash(args[i]);
        if (s2 < 0) {
          s2 += 1;
        }
      }
      mash = null;

      var random = function() {
        var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = t | 0);
      };
      random.uint32 = function() {
        return random() * 0x100000000; // 2^32
      };
      random.fract53 = function() {
        return random() + 
          (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
      };
      random.version = 'Alea 0.9';
      random.args = args;

      // my own additions to sync state between two generators
      random.exportState = function(){
        return [s0, s1, s2, c];
      };
      random.importState = function(i){
        s0 = +i[0] || 0;
        s1 = +i[1] || 0;
        s2 = +i[2] || 0;
        c = +i[3] || 0;
      };
 
      return random;

    } (Array.prototype.slice.call(arguments)));
  }

  function Mash() {
    var n = 0xefc8249d;

    var mash = function(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = 'Mash 0.9';
    return mash;
  }
}));

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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8wLzUvX1dhbGtlci5qcyIsImNoYXB0ZXJzLzAvNS9hcHAuanMiLCJub2RlX21vZHVsZXMvcHJvYy1ub2lzZS9saWIvcHJvYy1ub2lzZS5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jLW5vaXNlL25vZGVfbW9kdWxlcy9hbGVhL2FsZWEuanMiLCJtb2R1bGVzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciB1dGlscyA9IHJlcXVpcmUoJ3V0aWxzJylcblx0LCBQZXJsaW5HZW5lcmF0b3IgPSByZXF1aXJlKCdwcm9jLW5vaXNlJylcblx0LCBub2lzZSA9IG5ldyBQZXJsaW5HZW5lcmF0b3IoKVxuO1xuXG5mdW5jdGlvbiBXYWxrZXIoY29udGV4dCwgb3B0cywgY2FudmFzKSB7XG5cdHRoaXMuY3ggPSBjb250ZXh0O1xuXHR0aGlzLnggPSBvcHRzLnggfHwgMDtcblx0dGhpcy55ID0gb3B0cy55IHx8IDA7XG5cdHRoaXMud2lkdGggPSBvcHRzLndpZHRoIHx8IDM7XG5cblx0dGhpcy5ub2lzZVggPSAwXG5cdHRoaXMubm9pc2VZID0gMTAwO1xuXG5cdHRoaXMuY2FudmFzID0gY2FudmFzO1xufVxuXG5XYWxrZXIucHJvdG90eXBlLmRpc3BsYXkgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jeC5maWxsUmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy53aWR0aCk7XG59O1xuXG5XYWxrZXIucHJvdG90eXBlLnN0ZXAgPSBmdW5jdGlvbigpIHtcblx0dGhpcy54ID0gdXRpbHMubWFwKG5vaXNlLm5vaXNlKHRoaXMubm9pc2VYKSwgMCwgMSwgMCwgdGhpcy5jYW52YXMud2lkdGgpO1xuXHR0aGlzLnkgPSB1dGlscy5tYXAobm9pc2Uubm9pc2UodGhpcy5ub2lzZVkpLCAwLCAxLCAwLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXG5cdHRoaXMubm9pc2VYICs9IDAuMDE7XG5cdHRoaXMubm9pc2VZICs9IDAuMDE7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdhbGtlcjtcbiIsInZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJylcbiAgLCBjeCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICwgdXRpbHMgPSByZXF1aXJlKCd1dGlscycpXG4gICwgV2Fsa2VyID0gcmVxdWlyZSgnLi9fV2Fsa2VyJylcbjtcblxudmFyIFdJRFRIID0gY2FudmFzLndpZHRoXG4gICwgSEVJR0hUID0gY2FudmFzLmhlaWdodFxuICAsIHdhbGtlclxuO1xuXG5mdW5jdGlvbiBzZXR1cCgpIHtcbiAgY29uc29sZS5sb2coJ3NldHVwJyk7XG4gIHdhbGtlciA9IG5ldyBXYWxrZXIoY3gsIHt9LCBjYW52YXMpO1xufVxuXG5mdW5jdGlvbiBkcmF3KCkge1xuICB3YWxrZXIuc3RlcCgpO1xuXHR3YWxrZXIuZGlzcGxheSgpO1xuXG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG59XG5cbihmdW5jdGlvbigpIHtcbiAgc2V0dXAoKTtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn0oKSk7XG4iLCIvLyBQRVJMSU4gTk9JU0Vcbi8vIGJhc2VkIDk5Ljk5OSUgb24gUHJvY2Vzc2luZydzIGltcGxlbWVudGF0aW9uLCBmb3VuZCBoZXJlOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3Byb2Nlc3NpbmcvcHJvY2Vzc2luZy9ibG9iL21hc3Rlci9jb3JlL3NyYy9wcm9jZXNzaW5nL2NvcmUvUEFwcGxldC5qYXZhXG4vLyBjcmVkaXQgZ29lcyBlbnRpcmVseSB0byB0aGVtLiBpIGp1c3QgcG9ydGVkIGl0IHRvIGphdmFzY3JpcHQuXG5cbnZhciBBbGVhID0gcmVxdWlyZShcImFsZWFcIik7IC8vIHRoaXMgaXMgcHJldHR5IGdyZWF0LCBidHdcblxudmFyIFBlcmxpbiA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VlZCkge1xuXHRpZiAoc2VlZCAhPSB1bmRlZmluZWQpIHtcblx0XHR0aGlzLmFsZWFfcmFuZCA9IG5ldyBBbGVhKHNlZWQpOyAvLyB1c2UgcHJvdmlkZWQgc2VlZFxuXHR9IGVsc2Uge1xuXHRcdHRoaXMuYWxlYV9yYW5kID0gbmV3IEFsZWEoKTsgLy8gdXNlIHJhbmRvbSBzZWVkXG5cdH1cblx0dGhpcy5QRVJMSU5fWVdSQVBCID0gNDtcblx0dGhpcy5QRVJMSU5fWVdSQVAgPSAxIDw8IHRoaXMuUEVSTElOX1lXUkFQQjtcblx0dGhpcy5QRVJMSU5fWldSQVBCID0gODtcblx0dGhpcy5QRVJMSU5fWldSQVAgPSAxIDw8IHRoaXMuUEVSTElOX1pXUkFQQjtcblx0dGhpcy5QRVJMSU5fU0laRSA9IDQwOTU7XG5cdHRoaXMucGVybGluX29jdGF2ZXMgPSA0OyAvLyBkZWZhdWx0IHRvIG1lZGl1bSBzbW9vdGhcblx0dGhpcy5wZXJsaW5fYW1wX2ZhbGxvZmYgPSAwLjU7IC8vIDUwJSByZWR1Y3Rpb24vb2N0YXZlXG5cdHRoaXMucGVybGluX2FycmF5ID0gbmV3IEFycmF5KCk7XG5cdC8vIGdlbmVyYXRlIGNvcyBsb29rdXAgdGFibGVcblx0dmFyIERFR19UT19SQUQgPSAwLjAxNzQ1MzI5MjU7XG5cdHZhciBTSU5DT1NfUFJFQ0lTSU9OID0gMC41O1xuXHR2YXIgU0lOQ09TX0xFTkdUSCA9IE1hdGguZmxvb3IoMzYwL1NJTkNPU19QUkVDSVNJT04pO1xuXHR0aGlzLmNvc0xVVCA9IG5ldyBBcnJheSgpO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IFNJTkNPU19MRU5HVEg7IGkrKykge1xuXHRcdHRoaXMuY29zTFVUW2ldID0gTWF0aC5jb3MoaSAqIERFR19UT19SQUQgKiBTSU5DT1NfUFJFQ0lTSU9OKTtcblx0fVxuXHR0aGlzLnBlcmxpbl9UV09QSSA9IFNJTkNPU19MRU5HVEg7XG5cdHRoaXMucGVybGluX1BJID0gU0lOQ09TX0xFTkdUSDtcblx0dGhpcy5wZXJsaW5fUEkgPj49IDE7XG59XG5cblBlcmxpbi5wcm90b3R5cGUubm9pc2VSZXNlZWQgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5hbGVhX3JhbmQgPSBuZXcgQWxlYSgpOyAvLyBuZXcgcmFuZG9tIHNlZWRcblx0dGhpcy5wZXJsaW5fYXJyYXkgPSBuZXcgQXJyYXkoKTsgLy8gc3RhcnQgdGhlIHBlcmxpbiBhcnJheSBmcmVzaFxufVxuXG5QZXJsaW4ucHJvdG90eXBlLm5vaXNlU2VlZCA9IGZ1bmN0aW9uKHNlZWQpIHtcblx0dGhpcy5hbGVhX3JhbmQgPSBuZXcgQWxlYShzZWVkKTsgLy8gdXNlIHByb3ZpZGVkIHNlZWRcblx0dGhpcy5wZXJsaW5fYXJyYXkgPSBuZXcgQXJyYXkoKTsgLy8gc3RhcnQgdGhlIHBlcmxpbiBhcnJheSBmcmVzaFxufVxuXG5cblBlcmxpbi5wcm90b3R5cGUubm9pc2VEZXRhaWwgPSBmdW5jdGlvbihsb2QsIGZhbGxvZmYpIHtcblx0aWYgKE1hdGguZmxvb3IobG9kKSA+IDApIHRoaXMucGVybGluX29jdGF2ZXMgPSBNYXRoLmZsb29yKGxvZCk7XG5cdGlmIChmYWxsb2ZmICE9IHVuZGVmaW5lZCAmJiBmYWxsb2ZmID4gMCkgdGhpcy5wZXJsaW5fYW1wX2ZhbGxvZmYgPSBmYWxsb2ZmO1xufVxuXG5QZXJsaW4ucHJvdG90eXBlLm5vaXNlX2ZzYyA9IGZ1bmN0aW9uKGkpIHtcblx0cmV0dXJuIDAuNSAqICgxLjAgLSB0aGlzLmNvc0xVVFtNYXRoLmZsb29yKGkgKiB0aGlzLnBlcmxpbl9QSSkgJSB0aGlzLnBlcmxpbl9UV09QSV0pO1xufVxuXG5QZXJsaW4ucHJvdG90eXBlLm5vaXNlID0gZnVuY3Rpb24oeCwgeSwgeikge1xuXHRpZiAoeCA9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gZmFsc2U7IC8vIHdlIG5lZWQgYXQgbGVhc3Qgb25lIHBhcmFtXG5cdH1cblx0aWYgKHkgPT0gdW5kZWZpbmVkKSB7XG5cdFx0eSA9IDA7IC8vIHVzZSAwIGlmIG5vdCBwcm92aWRlZFxuXHR9XG5cdGlmICh6ID09IHVuZGVmaW5lZCkge1xuXHRcdHogPSAwOyAvLyB1c2UgMCBpZiBub3QgcHJvdmlkZWRcblx0fVxuXHRcblx0Ly8gYnVpbGQgdGhlIGZpcnN0IHBlcmxpbiBhcnJheSBpZiB0aGVyZSBpc24ndCBvbmVcblx0aWYgKHRoaXMucGVybGluX2FycmF5Lmxlbmd0aCA9PSAwKSB7XG5cdFx0dGhpcy5wZXJsaW5fYXJyYXkgPSBuZXcgQXJyYXkoKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuUEVSTElOX1NJWkUgKyAxOyBpKyspIHtcblx0XHRcdHRoaXMucGVybGluX2FycmF5W2ldID0gdGhpcy5hbGVhX3JhbmQoKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoeCA8IDApIHggPSAteDtcblx0aWYgKHkgPCAwKSB5ID0gLXk7XG5cdGlmICh6IDwgMCkgeiA9IC16O1xuXHR2YXIgeGkgPSBNYXRoLmZsb29yKHgpO1xuXHR2YXIgeWkgPSBNYXRoLmZsb29yKHkpO1xuXHR2YXIgemkgPSBNYXRoLmZsb29yKHopO1xuXHR2YXIgeGYgPSB4IC0geGk7XG5cdHZhciB5ZiA9IHkgLSB5aTtcblx0dmFyIHpmID0geiAtIHppO1xuXHR2YXIgciA9IDA7XG5cdHZhciBhbXBsID0gMC41O1xuXHR2YXIgcnhmLCByeWYsIG4xLCBuMiwgbjM7XG5cdFxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGVybGluX29jdGF2ZXM7IGkrKykge1xuXHRcdC8vIGxvb2sgYXQgYWxsIHRoaXMgbWF0aCBzdHVmZlxuXHRcdHZhciBvZiA9IHhpICsgKHlpIDw8IHRoaXMuUEVSTElOX1lXUkFQQikgKyAoemkgPDwgdGhpcy5QRVJMSU5fWldSQVBCKTtcblx0XHRyeGYgPSB0aGlzLm5vaXNlX2ZzYyh4Zik7XG5cdFx0cnlmID0gdGhpcy5ub2lzZV9mc2MoeWYpO1xuXHRcdG4xICA9IHRoaXMucGVybGluX2FycmF5W29mICYgdGhpcy5QRVJMSU5fU0laRV07XG5cdFx0bjEgKz0gcnhmICogKHRoaXMucGVybGluX2FycmF5WyhvZiArIDEpICYgdGhpcy5QRVJMSU5fU0laRV0gLSBuMSk7XG5cdFx0bjIgID0gdGhpcy5wZXJsaW5fYXJyYXlbKG9mICsgdGhpcy5QRVJMSU5fWVdSQVApICYgdGhpcy5QRVJMSU5fU0laRV07XG5cdFx0bjIgKz0gcnhmICogKHRoaXMucGVybGluX2FycmF5WyhvZiArIHRoaXMuUEVSTElOX1lXUkFQICsgMSkgJiB0aGlzLlBFUkxJTl9TSVpFXSAtIG4yKTtcblx0XHRuMSArPSByeWYgKiAobjItbjEpO1xuXHRcdG9mICs9IHRoaXMuUEVSTElOX1pXUkFQO1xuXHRcdG4yICA9IHRoaXMucGVybGluX2FycmF5W29mICYgdGhpcy5QRVJMSU5fU0laRV07XG5cdFx0bjIgKz0gcnhmICogKHRoaXMucGVybGluX2FycmF5WyhvZiArIDEpICYgdGhpcy5QRVJMSU5fU0laRV0gLSBuMik7XG5cdFx0bjMgID0gdGhpcy5wZXJsaW5fYXJyYXlbKG9mICsgdGhpcy5QRVJMSU5fWVdSQVApICYgdGhpcy5QRVJMSU5fU0laRV07XG5cdFx0bjMgKz0gcnhmICogKHRoaXMucGVybGluX2FycmF5WyhvZiArIHRoaXMuUEVSTElOX1lXUkFQICsgMSkgJiB0aGlzLlBFUkxJTl9TSVpFXSAtIG4zKTtcblx0XHRuMiArPSByeWYgKiAobjMgLSBuMik7XG5cdFx0bjEgKz0gdGhpcy5ub2lzZV9mc2MoemYpICogKG4yIC0gbjEpO1xuXHRcdHIgKz0gbjEgKiBhbXBsO1xuXHRcdGFtcGwgKj0gdGhpcy5wZXJsaW5fYW1wX2ZhbGxvZmY7XG5cdFx0eGkgPDw9IDE7XG5cdFx0eGYgKj0gMjtcblx0XHR5aSA8PD0gMTtcblx0XHR5ZiAqPSAyO1xuXHRcdHppIDw8PSAxOyBcblx0XHR6ZiAqPSAyO1xuXHRcdGlmICh4ZiA+PSAxKSB7IHhpKys7IHhmLS07IH1cblx0XHRpZiAoeWYgPj0gMSkgeyB5aSsrOyB5Zi0tOyB9XG5cdFx0aWYgKHpmID49IDEpIHsgemkrKzsgemYtLTsgfVxuXHR9XG5cdHJldHVybiByO1xufVxuIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgZGVmaW5lKGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgICAgcm9vdC5BbGVhID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gRnJvbSBodHRwOi8vYmFhZ29lLmNvbS9lbi9SYW5kb21NdXNpbmdzL2phdmFzY3JpcHQvXG5cbiAgLy8gaW1wb3J0U3RhdGUgdG8gc3luYyBnZW5lcmF0b3Igc3RhdGVzXG4gIEFsZWEuaW1wb3J0U3RhdGUgPSBmdW5jdGlvbihpKXtcbiAgICB2YXIgcmFuZG9tID0gbmV3IEFsZWEoKTtcbiAgICByYW5kb20uaW1wb3J0U3RhdGUoaSk7XG4gICAgcmV0dXJuIHJhbmRvbTtcbiAgfTtcblxuICByZXR1cm4gQWxlYTtcblxuICBmdW5jdGlvbiBBbGVhKCkge1xuICAgIHJldHVybiAoZnVuY3Rpb24oYXJncykge1xuICAgICAgLy8gSm9oYW5uZXMgQmFhZ8O4ZSA8YmFhZ29lQGJhYWdvZS5jb20+LCAyMDEwXG4gICAgICB2YXIgczAgPSAwO1xuICAgICAgdmFyIHMxID0gMDtcbiAgICAgIHZhciBzMiA9IDA7XG4gICAgICB2YXIgYyA9IDE7XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGFyZ3MgPSBbK25ldyBEYXRlXTtcbiAgICAgIH1cbiAgICAgIHZhciBtYXNoID0gTWFzaCgpO1xuICAgICAgczAgPSBtYXNoKCcgJyk7XG4gICAgICBzMSA9IG1hc2goJyAnKTtcbiAgICAgIHMyID0gbWFzaCgnICcpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgczAgLT0gbWFzaChhcmdzW2ldKTtcbiAgICAgICAgaWYgKHMwIDwgMCkge1xuICAgICAgICAgIHMwICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgczEgLT0gbWFzaChhcmdzW2ldKTtcbiAgICAgICAgaWYgKHMxIDwgMCkge1xuICAgICAgICAgIHMxICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgczIgLT0gbWFzaChhcmdzW2ldKTtcbiAgICAgICAgaWYgKHMyIDwgMCkge1xuICAgICAgICAgIHMyICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1hc2ggPSBudWxsO1xuXG4gICAgICB2YXIgcmFuZG9tID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0ID0gMjA5MTYzOSAqIHMwICsgYyAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXG4gICAgICAgIHMwID0gczE7XG4gICAgICAgIHMxID0gczI7XG4gICAgICAgIHJldHVybiBzMiA9IHQgLSAoYyA9IHQgfCAwKTtcbiAgICAgIH07XG4gICAgICByYW5kb20udWludDMyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiByYW5kb20oKSAqIDB4MTAwMDAwMDAwOyAvLyAyXjMyXG4gICAgICB9O1xuICAgICAgcmFuZG9tLmZyYWN0NTMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHJhbmRvbSgpICsgXG4gICAgICAgICAgKHJhbmRvbSgpICogMHgyMDAwMDAgfCAwKSAqIDEuMTEwMjIzMDI0NjI1MTU2NWUtMTY7IC8vIDJeLTUzXG4gICAgICB9O1xuICAgICAgcmFuZG9tLnZlcnNpb24gPSAnQWxlYSAwLjknO1xuICAgICAgcmFuZG9tLmFyZ3MgPSBhcmdzO1xuXG4gICAgICAvLyBteSBvd24gYWRkaXRpb25zIHRvIHN5bmMgc3RhdGUgYmV0d2VlbiB0d28gZ2VuZXJhdG9yc1xuICAgICAgcmFuZG9tLmV4cG9ydFN0YXRlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIFtzMCwgczEsIHMyLCBjXTtcbiAgICAgIH07XG4gICAgICByYW5kb20uaW1wb3J0U3RhdGUgPSBmdW5jdGlvbihpKXtcbiAgICAgICAgczAgPSAraVswXSB8fCAwO1xuICAgICAgICBzMSA9ICtpWzFdIHx8IDA7XG4gICAgICAgIHMyID0gK2lbMl0gfHwgMDtcbiAgICAgICAgYyA9ICtpWzNdIHx8IDA7XG4gICAgICB9O1xuIFxuICAgICAgcmV0dXJuIHJhbmRvbTtcblxuICAgIH0gKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIE1hc2goKSB7XG4gICAgdmFyIG4gPSAweGVmYzgyNDlkO1xuXG4gICAgdmFyIG1hc2ggPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBkYXRhID0gZGF0YS50b1N0cmluZygpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG4gKz0gZGF0YS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB2YXIgaCA9IDAuMDI1MTk2MDMyODI0MTY5MzggKiBuO1xuICAgICAgICBuID0gaCA+Pj4gMDtcbiAgICAgICAgaCAtPSBuO1xuICAgICAgICBoICo9IG47XG4gICAgICAgIG4gPSBoID4+PiAwO1xuICAgICAgICBoIC09IG47XG4gICAgICAgIG4gKz0gaCAqIDB4MTAwMDAwMDAwOyAvLyAyXjMyXG4gICAgICB9XG4gICAgICByZXR1cm4gKG4gPj4+IDApICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcbiAgICB9O1xuXG4gICAgbWFzaC52ZXJzaW9uID0gJ01hc2ggMC45JztcbiAgICByZXR1cm4gbWFzaDtcbiAgfVxufSkpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJhbmdlOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICBpZiAoIW1heCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKTtcbiAgfSxcbiAgLy8gdGFrZW4gZnJvbSB0aGUgcDUuanMgcHJvamVjdFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vcHJvY2Vzc2luZy9wNS5qcy9ibG9iLzVjODFkNjU1ZjY4M2Y5MDQ1MmI4MGFiMjI1YTY3ZTQ0OTQ2M2ZmZjkvc3JjL21hdGgvY2FsY3VsYXRpb24uanMjTDM5NFxuICBtYXA6IGZ1bmN0aW9uKG4sIHN0YXJ0MSwgc3RvcDEsIHN0YXJ0Miwgc3RvcDIpIHtcbiAgICByZXR1cm4gKChuLXN0YXJ0MSkvKHN0b3AxLXN0YXJ0MSkpKihzdG9wMi1zdGFydDIpK3N0YXJ0MjtcbiAgfVxufTtcbiJdfQ==
