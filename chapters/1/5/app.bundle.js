require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')(cx, canvas)
	, Vector = require('vector2d')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
;

var centerVec
	, mouseVec
	, mousePos
  , magnitude
	, xPanning = WIDTH / 2
	, yPanning = HEIGHT / 2
;

function setup() {
  console.log('setup');
	mousePos = {x: 0, y: 0};
	centerVec = new Vector.ObjectVector(xPanning, yPanning);
	mouseVec = new Vector.ObjectVector(0, 0);
}

function draw() {
	utils.clear();

  mouseVec.setAxes(mousePos.x, mousePos.y);

  mouseVec.subtract(centerVec);
  magnitude = mouseVec.magnitude();
  cx.fillRect(0, 0, magnitude, 10);

  cx.translate(xPanning, yPanning);

	cx.beginPath();
	cx.moveTo(0, 0);
	cx.lineTo(mouseVec.getX(), mouseVec.getY());
	cx.stroke();

	cx.resetTransform();
  window.requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', function(event) {
	mousePos = utils.getMousePos(event);
});

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());

},{"utils":"utils","vector2d":8}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],5:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":4,"_process":3,"inherits":2}],6:[function(require,module,exports){
'use strict';

var util = require('util')
  , Vector = require('./Vector.js');

function Float32Vector(x, y) {
  if (this instanceof Float32Vector === false) {
    return new Float32Vector(x, y);
  }

  this._axes = new Float32Array(2);
  this._axes[0] = x;
  this._axes[1] = y;
}
util.inherits(Float32Vector, Vector);

Float32Vector.prototype.ctor = Float32Vector;

module.exports = Float32Vector;

},{"./Vector.js":9,"util":5}],7:[function(require,module,exports){
'use strict';

var util = require('util')
  , Vector = require('./Vector.js');

function ObjectVector(x, y) {
  if (this instanceof ObjectVector === false) {
    return new ObjectVector(x, y);
  }

  this._x = x;
  this._y = y;
}
util.inherits(ObjectVector, Vector);

Object.defineProperty(ObjectVector.prototype, 'x', {
  get: function () {
    return this._x;
  },
  set: function (x) {
    this._x = x;
  }
});

Object.defineProperty(ObjectVector.prototype, 'y', {
  get: function () {
    return this._y;
  },
  set: function (y) {
    this._y = y;
  }
});

ObjectVector.prototype.ctor = ObjectVector;

module.exports = ObjectVector;

},{"./Vector.js":9,"util":5}],8:[function(require,module,exports){
'use strict';

var Vector = require('./Vector.js')
  , Float32Vector = require('./Float32Vector.js')
  , ObjectVector = require('./ObjectVector.js');

module.exports = {
  ArrayVector: Vector,
  ObjectVector: ObjectVector,
  Float32Vector: Float32Vector

  // TODO: Add instance methods in the future
};

},{"./Float32Vector.js":6,"./ObjectVector.js":7,"./Vector.js":9}],9:[function(require,module,exports){
'use strict';

/**
 * Primary Vector class. Uses Array type for axis storage.
 * @class Vector
 * @param {Number} x The x component of this Vector
 * @param {Number} y The y component of this Vector
 */
function Vector(x, y) {
  if (this instanceof Vector === false) {
    return new Vector(x, y);
  }

  this._axes = [x, y];
}
module.exports = Vector;

var precision = [
  1,
  10,
  100,
  1000,
  10000,
  100000,
  1000000,
  10000000,
  100000000,
  1000000000,
  10000000000
];

Vector.prototype = {
  ctor: Vector,

  /**
   * Set both x and y
   * @param x   New x val
   * @param y   New y val
   */
  setAxes: function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  },


  /**
   * Getter for x axis.
   * @return {Number}
   */
  getX: function() {
    return this.x;
  },


  /**
   * Setter for x axis.
   */
  setX: function(x) {
    this.x = x;

    return this;
  },


  /**
   * Getter for y axis.
   * @return {Number}
   */
  getY: function() {
    return this.y;
  },


  /**
   * Setter for y axis.
   */
  setY: function(y) {
    this.y = y;

    return this;
  },


  /**
   * View vector as a string such as "Vec2D: (0, 4)"
   * @param   {Boolean}
   * @return  {String}
   */
  toString: function(round) {
    if (round) {
      return '(' + Math.round(this.x) +
        ', ' + Math.round(this.y) + ')';
    }
    return '(' + this.x + ', ' + this.y + ')';
  },


  /**
   * Return an array containing the vector axes.
   * @return {Array}
   */
  toArray: function() {
    return new Array(this.x, this.y);
  },


  /**
   * Return an array containing the vector axes.
   * @return {Object}
   */
  toObject: function() {
    return {
      x: this.x,
      y: this.y
    };
  },


  /**
   * Add the provided Vector to this one.
   * @param {Vector} vec
   */
  add: function(vec) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  },


  /**
   * Subtract the provided vector from this one.
   * @param {Vector} vec
   */
  subtract: function(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  },


  /**
   * Check is the vector provided equal to this one.
   * @param   {Vec2D}   vec
   * @return  {Boolean}
   */
  equals: function(vec) {
    return (vec.x == this.x && vec.y == this.y);
  },


  /**
   * Multiply this vector by the provided vector.
   * @param {Vector} vec
   */
  multiplyByVector: function(vec) {
    this.x *= vec.x;
    this.y *= vec.y;
    return this;
  },
  mulV: function(v) {
    return this.multiplyByVector(v);
  },


  /**
   * Multiply this vector by the provided vector.
   * @param {Vector} vec
   */
  divideByVector: function(vec) {
    this.x /= vec.x;
    this.y /= vec.y;
    return this;
  },
  divV: function(v) {
    return this.divideByVector(v);
  },


  /**
   * Multiply this vector by the provided number
   * @param {Number} n
   */
  multiplyByScalar: function(n) {
    this.x *= n;
    this.y *= n;

    return this;
  },
  mulS: function(n) {
    return this.multiplyByScalar(n);
  },


  /**
   * Divive this vector by the provided number
   * @param {Number} n
   */
  divideByScalar: function(n) {
    this.x /= n;
    this.y /= n;
    return this;
  },
  divS: function(n) {
    return this.divideByScalar(n);
  },


  /**
   * Normalise this vector. Directly affects this vector.
   * Use Vec2D.normalise(vector) to create a normalised clone of this.
   */
  normalise: function() {
    return this.divideByScalar(this.magnitude());
  },


  /**
   * For American spelling.
   * Same as unit/normalise function.
   */
  normalize: function() {
    return this.normalise();
  },


  /**
   * The same as normalise.
   */
  unit: function() {
    return this.normalise();
  },


  /**
   * Return the magnitude (length) of this vector.
   * @return  {Number}
   */
  magnitude: function() {
    var x = this.x,
      y = this.y;

    return Math.sqrt((x * x) + (y * y));
  },


  /**
   * Return the magnitude (length) of this vector.
   * @return  {Number}
   */
  length: function() {
    return this.magnitude();
  },


  /**
   * Return the squred length of a vector
   * @return {Number}
   */
  lengthSq: function() {
    var x = this.x,
      y = this.y;

    return (x * x) + (y * y);
  },


  /**
   * Get the dot product of this vector by another.
   * @param   {Vector} vec
   * @return  {Number}
   */
  dot: function(vec) {
    return (vec.x * this.x) + (vec.y * this.y);
  },


  /**
   * Get the cross product of this vector by another.
   * @param   {Vector} vec
   * @return  {Number}
   */
  cross: function(vec) {
    return ((this.x * vec.y) - (this.y * vec.x));
  },


  /**
   * Reverses this vector.
   */
  reverse: function() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  },


  /**
   * Convert vector to absolute values.
   * @param   {Vector} vec
   */
  abs: function() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);

    return this;
  },

  limit: function(max) {
    if (this.magnitude() > max) {
		  this.normalize();
		  this.mulS(max);
	  }
  },


  /**
   * Zeroes the vector
   * @return  {Vector}
   */
  zero: function() {
    this.x = this.y = 0;
    return this;
  },


  /**
   * Distance between this vector and another.
   * @param {Vector} v
   */
  distance: function (v) {
    var x = this.x - v.x;
    var y = this.y - v.y;

    return Math.sqrt((x * x) + (y * y));
  },


  /**
   * Rotate the vetor by provided radians.
   * @param   {Number}  rads
   * @return  {Vector}
   */
  rotate: function(rads) {
    var cos = Math.cos(rads),
      sin = Math.sin(rads);

    var ox = this.x,
      oy = this.y;

    this.x = ox * cos - oy * sin;
    this.y = ox * sin + oy * cos;

    return this;
  },


  /**
   * Round this vector to n decimal places
   * @param {Number}  n
   */
  round: function(n) {
    // Default is two decimals
    n = n || 2;

    var p = precision[n];

    // This performs waaay better than toFixed and give Float32 the edge again.
    // http://www.dynamicguru.com/javascript/round-numbers-with-precision/
    this.x = ((0.5 + (this.x * p)) << 0) / p;
    this.y = ((0.5 + (this.y * p)) << 0) / p;

    return this;
  },


  /**
   * Create a copy of this vector.
   * @return {Vector}
   */
  clone: function() {
    return new this.ctor(this.x, this.y);
  }
};

Object.defineProperty(Vector.prototype, 'x', {
  get: function () {
    return this._axes[0];
  },
  set: function (x) {
    this._axes[0] = x;
  }
});

Object.defineProperty(Vector.prototype, 'y', {
  get: function () {
    return this._axes[1];
  },
  set: function (y) {
    this._axes[1] = y;
  }
});

},{}],"V":[function(require,module,exports){
  /**
   * A class to describe a two or three dimensional vector, specifically
   * a Euclidean (also known as geometric) vector. A vector is an entity
   * that has both magnitude and direction. The datatype, however, stores
   * the components of the vector (x,y for 2D, and x,y,z for 3D). The magnitude
   * and direction can be accessed via the methods mag() and heading(). In many
   * of the p5.js examples, you will see Vector used to describe a position,
   * velocity, or acceleration. For example, if you consider a rectangle moving
   * across the screen, at any given instant it has a position (a vector that
   * points from the origin to its location), a velocity (the rate at which the
   * object's position changes per time unit, expressed as a vector), and
   * acceleration (the rate at which the object's velocity changes per time
   * unit, expressed as a vector). Since vectors represent groupings of values,
   * we cannot simply use traditional addition/multiplication/etc. Instead,
   * we'll need to do some "vector" math, which is made easy by the methods
   * inside the Vector class.
   *
   * @class Vector
   * @constructor
   * @param {Number} [x] x component of the vector
   * @param {Number} [y] y component of the vector
   * @param {Number} [z] z component of the vector
   * @example
   * <div>
   * <code>
   * var v1 = createVector(40, 50);
   * var v2 = createVector(40, 50);
   *
   * ellipse(v1.x, v1.y, 50, 50);
   * ellipse(v2.x, v2.y, 50, 50);
   * v1.add(v2);
   * ellipse(v1.x, v1.y, 50, 50);
   * </code>
   * </div>
   */
  var Vector = function() {
    this.x = arguments[0] || 0;
		this.y = arguments[1] || 0;
		this.z = arguments[2] || 0;
  };

  /**
   * Returns a string representation of a vector v by calling String(v)
   * or v.toString(). This method is useful for logging vectors in the
   * console.
   * @method  toString
   * @example
   * <div class = "norender"><code>
   * function setup() {
   *   var v = createVector(20,30);
   *   print(String(v)); // prints "Vector Object : [20, 30, 0]"
   * }
   * </div></code>
   *
   */
  Vector.prototype.toString = function() {
    return 'Vector Object : ['+ this.x +', '+ this.y +', '+ this.z + ']';
  };

  /**
   * Sets the x, y, and z component of the vector using two or three separate
   * variables, the data from a Vector, or the values from a float array.
   * @method set
   *
   * @param {Number|Vector|Array} [x] the x component of the vector or a
   *                                     Vector or an Array
   * @param {Number}                 [y] the y component of the vector
   * @param {Number}                 [z] the z component of the vector
   * @example
   * <div class="norender">
   * <code>
   * function setup() {
   *    var v = createVector(1, 2, 3);
   *    v.set(4,5,6); // Sets vector to [4, 5, 6]
   *
   *    var v1 = createVector(0, 0, 0);
   *    var arr = [1, 2, 3];
   *    v1.set(arr); // Sets vector to [1, 2, 3]
   * }
   * </code>
   * </div>
   */
  Vector.prototype.set = function (x, y, z) {
    if (x instanceof Vector) {
      this.x = x.x || 0;
      this.y = x.y || 0;
      this.z = x.z || 0;
      return this;
    }
    if (x instanceof Array) {
      this.x = x[0] || 0;
      this.y = x[1] || 0;
      this.z = x[2] || 0;
      return this;
    }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    return this;
  };

  /**
   * Gets a copy of the vector, returns a Vector object.
   *
   * @method copy
   * @return {Vector} the copy of the Vector object
   * @example
   * <div class="norender">
   * <code>
   * var v1 = createVector(1, 2, 3);
   * var v2 = v.copy();
   * print(v1.x == v2.x && v1.y == v2.y && v1.z == v2.z);
   * // Prints "true"
   * </code>
   * </div>
   */
  Vector.prototype.copy = function () {
    return new Vector(this.x,this.y,this.z);
  };

  /**
   * Adds x, y, and z components to a vector, adds one vector to another, or
   * adds two independent vectors together. The version of the method that adds
   * two vectors together is a static method and returns a Vector, the others
   * acts directly on the vector. See the examples for more context.
   *
   * @method add
   * @chainable
   * @param  {Number|Vector|Array} x   the x component of the vector to be
   *                                      added or a Vector or an Array
   * @param  {Number}                 [y] the y component of the vector to be
   *                                      added
   * @param  {Number}                 [z] the z component of the vector to be
   *                                      added
   * @return {Vector}                  the Vector object.
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(1, 2, 3);
   * v.add(4,5,6);
   * // v's compnents are set to [5, 7, 9]
   * </code>
   * </div>
   * <div class="norender">
   * <code>
   * // Static method
   * var v1 = createVector(1, 2, 3);
   * var v2 = createVector(2, 3, 4);
   *
   * var v3 = Vector.add(v1, v2);
   * // v3 has components [3, 5, 7]
   * </code>
   * </div>
   */
  Vector.prototype.add = function (x, y, z) {
    if (x instanceof Vector) {
      this.x += x.x || 0;
      this.y += x.y || 0;
      this.z += x.z || 0;
      return this;
    }
    if (x instanceof Array) {
      this.x += x[0] || 0;
      this.y += x[1] || 0;
      this.z += x[2] || 0;
      return this;
    }
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    return this;
  };

  /**
   * Subtracts x, y, and z components from a vector, subtracts one vector from
   * another, or subtracts two independent vectors. The version of the method
   * that subtracts two vectors is a static method and returns a Vector, the
   * other acts directly on the vector. See the examples for more context.
   *
   * @method sub
   * @chainable
   * @param  {Number|Vector|Array} x   the x component of the vector or a
   *                                      Vector or an Array
   * @param  {Number}                 [y] the y component of the vector
   * @param  {Number}                 [z] the z component of the vector
   * @return {Vector}                  Vector object.
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(4, 5, 6);
   * v.sub(1, 1, 1);
   * // v's compnents are set to [3, 4, 5]
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * // Static method
   * var v1 = createVector(2, 3, 4);
   * var v2 = createVector(1, 2, 3);
   *
   * var v3 = Vector.sub(v1, v2);
   * // v3 has compnents [1, 1, 1]
   * </code>
   * </div>
   */
  Vector.prototype.sub = function (x, y, z) {
    if (x instanceof Vector) {
      this.x -= x.x || 0;
      this.y -= x.y || 0;
      this.z -= x.z || 0;
      return this;
    }
    if (x instanceof Array) {
      this.x -= x[0] || 0;
      this.y -= x[1] || 0;
      this.z -= x[2] || 0;
      return this;
    }
    this.x -= x || 0;
    this.y -= y || 0;
    this.z -= z || 0;
    return this;
  };

  /**
   * Multiply the vector by a scalar. The static version of this method
   * creates a new Vector while the non static version acts on the vector
   * directly. See the examples for more context.
   *
   * @method mult
   * @chainable
   * @param  {Number}    n the number to multiply with the vector
   * @return {Vector} a reference to the Vector object (allow chaining)
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(1, 2, 3);
   * v.mult(2);
   * // v's compnents are set to [2, 4, 6]
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * // Static method
   * var v1 = createVector(1, 2, 3);
   * var v2 = Vector.mult(v1, 2);
   * // v2 has compnents [2, 4, 6]
   * </code>
   * </div>
   */
  Vector.prototype.mult = function (n) {
    this.x *= n || 0;
    this.y *= n || 0;
    this.z *= n || 0;
    return this;
  };

  /**
   * Divide the vector by a scalar. The static version of this method creates a
   * new Vector while the non static version acts on the vector directly.
   * See the examples for more context.
   *
   * @method div
   * @chainable
   * @param  {number}    n the number to divide the vector by
   * @return {Vector} a reference to the Vector object (allow chaining)
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(6, 4, 2);
   * v.div(2); //v's compnents are set to [3, 2, 1]
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * // Static method
   * var v1  = createVector(6, 4, 2);
   * var v2 = Vector.div(v, 2);
   * // v2 has compnents [3, 2, 1]
   * </code>
   * </div>
   */
  Vector.prototype.div = function (n) {
    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this;
  };

  /**
   * Calculates the magnitude (length) of the vector and returns the result as
   * a float (this is simply the equation sqrt(x*x + y*y + z*z).)
   *
   * @method mag
   * @return {Number} magnitude of the vector
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(20.0, 30.0, 40.0);
   * var m = v.mag(10);
   * print(m); // Prints "53.85164807134504"
   * </code>
   * </div>
   */
  Vector.prototype.mag = function () {
    return Math.sqrt(this.magSq());
  };

  /**
   * Calculates the squared magnitude of the vector and returns the result
   * as a float (this is simply the equation <em>(x*x + y*y + z*z)</em>.)
   * Faster if the real length is not required in the
   * case of comparing vectors, etc.
   *
   * @method magSq
   * @return {number} squared magnitude of the vector
   * @example
   * <div class="norender">
   * <code>
   * // Static method
   * var v1 = createVector(6, 4, 2);
   * print(v1.magSq()); // Prints "56"
   * </code>
   * </div>
   */
  Vector.prototype.magSq = function () {
    var x = this.x, y = this.y, z = this.z;
    return (x * x + y * y + z * z);
  };

  /**
   * Calculates the dot product of two vectors. The version of the method
   * that computes the dot product of two independent vectors is a static
   * method. See the examples for more context.
   *
   *
   * @method dot
   * @param  {Number|Vector} x   x component of the vector or a Vector
   * @param  {Number}           [y] y component of the vector
   * @param  {Number}           [z] z component of the vector
   * @return {Number}                 the dot product
   *
   * @example
   * <div class="norender">
   * <code>
   * var v1 = createVector(1, 2, 3);
   * var v2 = createVector(2, 3, 4);
   *
   * print(v1.dot(v2)); // Prints "20"
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * //Static method
   * var v1 = createVector(1, 2, 3);
   * var v2 = createVector(3, 2, 1);
   * print (Vector.dot(v1, v2)); // Prints "10"
   * </code>
   * </div>
   */
  Vector.prototype.dot = function (x, y, z) {
    if (x instanceof Vector) {
      return this.dot(x.x, x.y, x.z);
    }
    return this.x * (x || 0) +
           this.y * (y || 0) +
           this.z * (z || 0);
  };

  /**
   * Calculates and returns a vector composed of the cross product between
   * two vectors. Both the static and non static methods return a new Vector.
   * See the examples for more context.
   *
   * @method cross
   * @param  {Vector} v Vector to be crossed
   * @return {Vector}   Vector composed of cross product
   * @example
   * <div class="norender">
   * <code>
   * var v1 = createVector(1, 2, 3);
   * var v2 = createVector(1, 2, 3);
   *
   * v1.cross(v2); // v's components are [0, 0, 0]
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * // Static method
   * var v1 = createVector(1, 0, 0);
   * var v2 = createVector(0, 1, 0);
   *
   * var crossProduct = Vector.cross(v1, v2);
   * // crossProduct has components [0, 0, 1]
   * </code>
   * </div>
   */
  Vector.prototype.cross = function (v) {
    var x = this.y * v.z - this.z * v.y;
    var y = this.z * v.x - this.x * v.z;
    var z = this.x * v.y - this.y * v.x;

		return new Vector(x,y,z);
  };

  /**
   * Calculates the Euclidean distance between two points (considering a
   * point as a vector object).
   *
   * @method dist
   * @param  {Vector} v the x, y, and z coordinates of a Vector
   * @return {Number}      the distance
   * @example
   * <div class="norender">
   * <code>
   * var v1 = createVector(1, 0, 0);
   * var v2 = createVector(0, 1, 0);
   *
   * var distance = v1.dist(v2); // distance is 1.4142...
   * </code>
   * </div>
   * <div class="norender">
   * <code>
   * // Static method
   * var v1 = createVector(1, 0, 0);
   * var v2 = createVector(0, 1, 0);
   *
   * var distance = Vector.dist(v1,v2);
   * // distance is 1.4142...
   * </code>
   * </div>
   */
  Vector.prototype.dist = function (v) {
    var d = v.copy().sub(this);
    return d.mag();
  };

  /**
   * Normalize the vector to length 1 (make it a unit vector).
   *
   * @method normalize
   * @return {Vector} normalized Vector
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(10, 20, 2);
   * // v has compnents [10.0, 20.0, 2.0]
   * v.normalize();
   * // v's compnents are set to
   * // [0.4454354, 0.8908708, 0.089087084]
   * </code>
   * </div>
   *
   */
  Vector.prototype.normalize = function () {
    return this.div(this.mag());
  };

  /**
   * Limit the magnitude of this vector to the value used for the <b>max</b>
   * parameter.
   *
   * @method limit
   * @param  {Number}    max the maximum magnitude for the vector
   * @return {Vector}     the modified Vector
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(10, 20, 2);
   * // v has compnents [10.0, 20.0, 2.0]
   * v.limit(5);
   * // v's compnents are set to
   * // [2.2271771, 4.4543543, 0.4454354]
   * </code>
   * </div>
   */
  Vector.prototype.limit = function (l) {
    var mSq = this.magSq();
    if(mSq > l*l) {
      this.div(Math.sqrt(mSq)); //normalize it
      this.mult(l);
    }
    return this;
  };

  /**
   * Set the magnitude of this vector to the value used for the <b>len</b>
   * parameter.
   *
   * @method setMag
   * @param  {number}    len the new length for this vector
   * @return {Vector}     the modified Vector
   * @example
   * <div class="norender">
   * <code>
   * var v1 = createVector(10, 20, 2);
   * // v has compnents [10.0, 20.0, 2.0]
   * v1.setMag(10);
   * // v's compnents are set to [6.0, 8.0, 0.0]
   * </code>
   * </div>
   */
  Vector.prototype.setMag = function (len) {
    return this.normalize().mult(len);
  };

  /**
   * Calculate the angle of rotation for this vector (only 2D vectors)
   *
   * @method heading
   * @return {Number} the angle of rotation
   * @example
   * <div class = "norender"><code>
   * function setup() {
   *   var v1 = createVector(30,50);
   *   print(v1.heading()); // 1.0303768265243125
   *
   *   var v1 = createVector(40,50);
   *   print(v1.heading()); // 0.8960553845713439
   *
   *   var v1 = createVector(30,70);
   *   print(v1.heading()); // 1.1659045405098132
   * }
   * </div></code>
   */
  Vector.prototype.heading = function () {
    return Math.atan2(this.y, this.x);
  };

  /**
   * Rotate the vector by an angle (only 2D vectors), magnitude remains the
   * same
   *
   * @method rotate
   * @param  {number}    angle the angle of rotation
   * @return {Vector} the modified Vector
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(10.0, 20.0);
   * // v has compnents [10.0, 20.0, 0.0]
   * v.rotate(HALF_PI);
   * // v's compnents are set to [-20.0, 9.999999, 0.0]
   * </code>
   * </div>
   */
  Vector.prototype.rotate = function (angle) {
    var newHeading = this.heading() + angle;
    var mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  };

  /**
   * Linear interpolate the vector to another vector
   *
   * @method lerp
   * @param  {Vector} x   the x component or the Vector to lerp to
   * @param  {Vector} [y] y the y component
   * @param  {Vector} [z] z the z component
   * @param  {Number}    amt the amount of interpolation; some value between 0.0
   *                         (old vector) and 1.0 (new vector). 0.1 is very near
   *                         the new vector. 0.5 is halfway in between.
   * @return {Vector}     the modified Vector
   * @example
   * <div class="norender">
   * <code>
   * var v = createVector(1, 1, 0);
   *
   * v.lerp(3, 3, 0, 0.5); // v now has components [2,2,0]
   * </code>
   * </div>
   *
   * <div class="norender">
   * <code>
   * var v1 = createVector(0, 0, 0);
   * var v2 = createVector(100, 100, 0);
   *
   * var v3 = Vector.lerp(v1, v2, 0.5);
   * // v3 has components [50,50,0]
   * </code>
   * </div>
   */
  Vector.prototype.lerp = function (x, y, z, amt) {
    if (x instanceof Vector) {
      return this.lerp(x.x, x.y, x.z, y);
    }
    this.x += (x - this.x) * amt || 0;
    this.y += (y - this.y) * amt || 0;
    this.z += (z - this.z) * amt || 0;
    return this;
  };

  /**
   * Return a representation of this vector as a float array. This is only
   * for temporary use. If used in any other fashion, the contents should be
   * copied by using the <b>Vector.copy()</b> method to copy into your own
   * array.
   *
   * @method array
   * @return {Array} an Array with the 3 values
   * @example
   * <div class = "norender"><code>
   * function setup() {
   *   var v = createVector(20,30);
   *   print(v.array()); // Prints : Array [20, 30, 0]
   * }
   * </div></code>
   * <div class="norender">
   * <code>
   * var v = createVector(10.0, 20.0, 30.0);
   * var f = v.array();
   * print(f[0]); // Prints "10.0"
   * print(f[1]); // Prints "20.0"
   * print(f[2]); // Prints "30.0"
   * </code>
   * </div>
   */
  Vector.prototype.array = function () {
    return [this.x || 0, this.y || 0, this.z || 0];
  };

  /**
   * Equality check against a Vector
   *
   * @method equals
   * @param {Number|Vector|Array} [x] the x component of the vector or a
   *                                     Vector or an Array
   * @param {Number}                 [y] the y component of the vector
   * @param {Number}                 [z] the z component of the vector
   * @return {Boolean} whether the vectors are equals
   * @example
   * <div class = "norender"><code>
   * v1 = createVector(5,10,20);
   * v2 = createVector(5,10,20);
   * v3 = createVector(13,10,19);
   *
   * print(v1.equals(v2.x,v2.y,v2.z)); // true
   * print(v1.equals(v3.x,v3.y,v3.z)); // false
   * </div></code>
   * <div class="norender">
   * <code>
   * var v1 = createVector(10.0, 20.0, 30.0);
   * var v2 = createVector(10.0, 20.0, 30.0);
   * var v3 = createVector(0.0, 0.0, 0.0);
   * print (v1.equals(v2)) // true
   * print (v1.equals(v3)) // false
   * </code>
   * </div>
   */
  Vector.prototype.equals = function (x, y, z) {
    var a, b, c;
    if (x instanceof Vector) {
      a = x.x || 0;
      b = x.y || 0;
      c = x.z || 0;
    } else if (x instanceof Array) {
      a = x[0] || 0;
      b = x[1] || 0;
      c = x[2] || 0;
    } else {
      a = x || 0;
      b = y || 0;
      c = z || 0;
    }
    return this.x === a && this.y === b && this.z === c;
  };


  // Static Methods


  /**
   * Make a new 2D unit vector from an angle
   *
   * @method fromAngle
   * @static
   * @param {Number}     angle the desired angle
   * @return {Vector}       the new Vector object
   * @example
   * <div>
   * <code>
   * function draw() {
   *   background (200);
   *
   *   // Create a variable, proportional to the mouseX,
   *   // varying from 0-360, to represent an angle in degrees.
   *   angleMode(DEGREES);
   *   var myDegrees = map(mouseX, 0,width, 0,360);
   *
   *   // Display that variable in an onscreen text.
   *   // (Note the nfc() function to truncate additional decimal places,
   *   // and the "\xB0" character for the degree symbol.)
   *   var readout = "angle = " + nfc(myDegrees,1,1) + "\xB0"
   *   noStroke();
   *   fill (0);
   *   text (readout, 5, 15);
   *
   *   // Create a Vector using the fromAngle function,
   *   // and extract its x and y components.
   *   var v = Vector.fromAngle(radians(myDegrees));
   *   var vx = v.x;
   *   var vy = v.y;
   *
   *   push();
   *   translate (width/2, height/2);
   *   noFill();
   *   stroke (150);
   *   line (0,0, 30,0);
   *   stroke (0);
   *   line (0,0, 30*vx, 30*vy);
   *   pop()
   * }
   * </code>
   * </div>
   */
  Vector.fromAngle = function(angle) {
    return new Vector(Math.cos(angle),Math.sin(angle),0);
  };

  /**
   * Make a new 2D unit vector from a random angle
   *
   * @method random2D
   * @static
   * @return {Vector} the new Vector object
   * @example
   * <div class="norender">
   * <code>
   * var v = Vector.random2D();
   * // May make v's attributes something like:
   * // [0.61554617, -0.51195765, 0.0] or
   * // [-0.4695841, -0.14366731, 0.0] or
   * // [0.6091097, -0.22805278, 0.0]
   * </code>
   * </div>
   */
  Vector.random2D = function () {
    var angle = Math.random()*Math.PI*2;
    return this.fromAngle(angle);
  };

  /**
   * Make a new random 3D unit vector.
   *
   * @method random3D
   * @static
   * @return {Vector} the new Vector object
   * @example
   * <div class="norender">
   * <code>
   * var v = Vector.random3D();
   * // May make v's attributes something like:
   * // [0.61554617, -0.51195765, 0.599168] or
   * // [-0.4695841, -0.14366731, -0.8711202] or
   * // [0.6091097, -0.22805278, -0.7595902]
   * </code>
   * </div>
   */
  Vector.random3D = function () {
    var angle = Math.random()*Math.PI*2,
	    vz = Math.random()*2-1,
    	vx = Math.sqrt(1-vz*vz)*Math.cos(angle),
    	vy = Math.sqrt(1-vz*vz)*Math.sin(angle);

    return new Vector(vx,vy,vz);
  };


  /**
   * Adds two vectors together and returns a new one.
   *
   * @static
   * @param  {Vector} v1 a Vector to add
   * @param  {Vector} v2 a Vector to add
   * @param  {Vector} target if undefined a new vector will be created
   * @return {Vector} the resulting Vector
   *
   */

  Vector.add = function (v1, v2, target) {
    if (!target) {
      target = v1.copy();
    } else {
      target.set(v1);
    }
    target.add(v2);
    return target;
  };

  /**
   * Subtracts one Vector from another and returns a new one.  The second
   * vector (v2) is subtracted from the first (v1), resulting in v1-v2.
   *
   * @static
   * @param  {Vector} v1 a Vector to subtract from
   * @param  {Vector} v2 a Vector to subtract
   * @param  {Vector} target if undefined a new vector will be created
   * @return {Vector} the resulting Vector
   */

  Vector.sub = function (v1, v2, target) {
    if (!target) {
      target = v1.copy();
    } else {
      target.set(v1);
    }
    target.sub(v2);
    return target;
  };


  /**
   * Multiplies a vector by a scalar and returns a new vector.
   *
   * @static
   * @param  {Vector} v the Vector to multiply
   * @param  {Number}  n the scalar
   * @param  {Vector} target if undefined a new vector will be created
   * @return {Vector}  the resulting new Vector
   */
  Vector.mult = function (v, n, target) {
    if (!target) {
      target = v.copy();
    } else {
      target.set(v);
    }
    target.mult(n);
    return target;
  };

  /**
   * Divides a vector by a scalar and returns a new vector.
   *
   * @static
   * @param  {Vector} v the Vector to divide
   * @param  {Number}  n the scalar
   * @param  {Vector} target if undefined a new vector will be created
   * @return {Vector} the resulting new Vector
   */
  Vector.div = function (v, n, target) {
    if (!target) {
      target = v.copy();
    } else {
      target.set(v);
    }
    target.div(n);
    return target;
  };


  /**
   * Calculates the dot product of two vectors.
   *
   * @static
   * @param  {Vector} v1 the first Vector
   * @param  {Vector} v2 the second Vector
   * @return {Number}     the dot product
   */
  Vector.dot = function (v1, v2) {
    return v1.dot(v2);
  };

  /**
   * Calculates the cross product of two vectors.
   *
   * @static
   * @param  {Vector} v1 the first Vector
   * @param  {Vector} v2 the second Vector
   * @return {Number}     the cross product
   */
  Vector.cross = function (v1, v2) {
    return v1.cross(v2);
  };

  /**
   * Calculates the Euclidean distance between two points (considering a
   * point as a vector object).
   *
   * @static
   * @param  {Vector} v1 the first Vector
   * @param  {Vector} v2 the second Vector
   * @return {Number}     the distance
   */
  Vector.dist = function (v1,v2) {
    return v1.dist(v2);
  };

  /**
   * Linear interpolate a vector to another vector and return the result as a
   * new vector.
   *
   * @static
   * @param {Vector} v1 a starting Vector
   * @param {Vector} v2 the Vector to lerp to
   * @param {Number}       the amount of interpolation; some value between 0.0
   *                       (old vector) and 1.0 (new vector). 0.1 is very near
   *                       the new vector. 0.5 is halfway in between.
   */
  Vector.lerp = function (v1, v2, amt, target) {
    if (!target) {
      target = v1.copy();
    } else {
      target.set(v1);
    }
    target.lerp(v2, amt);
    return target;
  };

  /**
   * Calculates and returns the angle (in radians) between two vectors.
   * @method angleBetween
   * @static
   * @param  {Vector} v1 the x, y, and z components of a Vector
   * @param  {Vector} v2 the x, y, and z components of a Vector
   * @return {Number}       the angle between (in radians)
   * @example
   * <div class="norender">
   * <code>
   * var v1 = createVector(1, 0, 0);
   * var v2 = createVector(0, 1, 0);
   *
   * var angle = Vector.angleBetween(v1, v2);
   * // angle is PI/2
   * </code>
   * </div>
   */
  Vector.angleBetween = function (v1, v2) {
    return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
  };

  // return Vector;
module.exports = Vector;
// });

},{}],"utils":[function(require,module,exports){
function Utils(cx, canvas) {
  return {
    cx : cx || '',
    canvas: canvas || '',
    halfX: function() {
      return this.canvas.width / 2;
    },
    halfY: function() {
      return this.canvas.height / 2;
    },
    range: function (min, max) {
      if (!max) {
        max = min;
        min = 0;
      }
      return Math.floor(Math.random() * (max - min) + min);
    },
    range: function(min, max) {
      var rand = Math.random();

      if (arguments.length === 0) {
        return rand;
      } else
      if (arguments.length === 1) {
        return rand * min;
      } else {
        if (min > max) {
          var tmp = min;
          min = max;
          max = tmp;
        }

        return rand * (max-min) + min;
      }
    },
    // taken from the p5.js project
    // https://github.com/processing/p5.js/blob/5c81d655f683f90452b80ab225a67e449463fff9/src/math/calculation.js#L394
    map: function(n, start1, stop1, start2, stop2) {
      return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
    },

    getMousePos: function(event) {
      return {
        x: event.clientX,
        y: event.clientY
      }
    },

    clear: function() {
      this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    W: canvas.width,
    H: canvas.height,
    HW: canvas.width / 2,
    HH: canvas.height / 2,
    ellipse: function(x, y, r) {
      this.cx.beginPath();
      this.cx.arc(x, y, r, 0, 2 * Math.PI, false);
      this.cx.fill();
      this.cx.stroke();
    },
    constrain: function(val, min, max) {
      if (val > max) {
        return max;
      } else if (val < min) {
        return min;
      } else {
        return val;
      }
    }
  }
};

module.exports = function(cx, canvas) {
  return new Utils(cx, canvas);
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8xLzUvYXBwLmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIiwibm9kZV9tb2R1bGVzL3ZlY3RvcjJkL3NyYy9GbG9hdDMyVmVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL3ZlY3RvcjJkL3NyYy9PYmplY3RWZWN0b3IuanMiLCJub2RlX21vZHVsZXMvdmVjdG9yMmQvc3JjL1ZlYzJELmpzIiwibm9kZV9tb2R1bGVzL3ZlY3RvcjJkL3NyYy9WZWN0b3IuanMiLCJtb2R1bGVzL3A1VmVjdG9ycy5qcyIsIm1vZHVsZXMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNTZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJylcbiAgLCBjeCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICwgdXRpbHMgPSByZXF1aXJlKCd1dGlscycpKGN4LCBjYW52YXMpXG5cdCwgVmVjdG9yID0gcmVxdWlyZSgndmVjdG9yMmQnKVxuO1xuXG52YXIgV0lEVEggPSBjYW52YXMud2lkdGhcbiAgLCBIRUlHSFQgPSBjYW52YXMuaGVpZ2h0XG47XG5cbnZhciBjZW50ZXJWZWNcblx0LCBtb3VzZVZlY1xuXHQsIG1vdXNlUG9zXG4gICwgbWFnbml0dWRlXG5cdCwgeFBhbm5pbmcgPSBXSURUSCAvIDJcblx0LCB5UGFubmluZyA9IEhFSUdIVCAvIDJcbjtcblxuZnVuY3Rpb24gc2V0dXAoKSB7XG4gIGNvbnNvbGUubG9nKCdzZXR1cCcpO1xuXHRtb3VzZVBvcyA9IHt4OiAwLCB5OiAwfTtcblx0Y2VudGVyVmVjID0gbmV3IFZlY3Rvci5PYmplY3RWZWN0b3IoeFBhbm5pbmcsIHlQYW5uaW5nKTtcblx0bW91c2VWZWMgPSBuZXcgVmVjdG9yLk9iamVjdFZlY3RvcigwLCAwKTtcbn1cblxuZnVuY3Rpb24gZHJhdygpIHtcblx0dXRpbHMuY2xlYXIoKTtcblxuICBtb3VzZVZlYy5zZXRBeGVzKG1vdXNlUG9zLngsIG1vdXNlUG9zLnkpO1xuXG4gIG1vdXNlVmVjLnN1YnRyYWN0KGNlbnRlclZlYyk7XG4gIG1hZ25pdHVkZSA9IG1vdXNlVmVjLm1hZ25pdHVkZSgpO1xuICBjeC5maWxsUmVjdCgwLCAwLCBtYWduaXR1ZGUsIDEwKTtcblxuICBjeC50cmFuc2xhdGUoeFBhbm5pbmcsIHlQYW5uaW5nKTtcblxuXHRjeC5iZWdpblBhdGgoKTtcblx0Y3gubW92ZVRvKDAsIDApO1xuXHRjeC5saW5lVG8obW91c2VWZWMuZ2V0WCgpLCBtb3VzZVZlYy5nZXRZKCkpO1xuXHRjeC5zdHJva2UoKTtcblxuXHRjeC5yZXNldFRyYW5zZm9ybSgpO1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufVxuXG5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0bW91c2VQb3MgPSB1dGlscy5nZXRNb3VzZVBvcyhldmVudCk7XG59KTtcblxuKGZ1bmN0aW9uKCkge1xuICBzZXR1cCgpO1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufSgpKTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKVxuICAsIFZlY3RvciA9IHJlcXVpcmUoJy4vVmVjdG9yLmpzJyk7XG5cbmZ1bmN0aW9uIEZsb2F0MzJWZWN0b3IoeCwgeSkge1xuICBpZiAodGhpcyBpbnN0YW5jZW9mIEZsb2F0MzJWZWN0b3IgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyVmVjdG9yKHgsIHkpO1xuICB9XG5cbiAgdGhpcy5fYXhlcyA9IG5ldyBGbG9hdDMyQXJyYXkoMik7XG4gIHRoaXMuX2F4ZXNbMF0gPSB4O1xuICB0aGlzLl9heGVzWzFdID0geTtcbn1cbnV0aWwuaW5oZXJpdHMoRmxvYXQzMlZlY3RvciwgVmVjdG9yKTtcblxuRmxvYXQzMlZlY3Rvci5wcm90b3R5cGUuY3RvciA9IEZsb2F0MzJWZWN0b3I7XG5cbm1vZHVsZS5leHBvcnRzID0gRmxvYXQzMlZlY3RvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbiAgLCBWZWN0b3IgPSByZXF1aXJlKCcuL1ZlY3Rvci5qcycpO1xuXG5mdW5jdGlvbiBPYmplY3RWZWN0b3IoeCwgeSkge1xuICBpZiAodGhpcyBpbnN0YW5jZW9mIE9iamVjdFZlY3RvciA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IE9iamVjdFZlY3Rvcih4LCB5KTtcbiAgfVxuXG4gIHRoaXMuX3ggPSB4O1xuICB0aGlzLl95ID0geTtcbn1cbnV0aWwuaW5oZXJpdHMoT2JqZWN0VmVjdG9yLCBWZWN0b3IpO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0VmVjdG9yLnByb3RvdHlwZSwgJ3gnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl94O1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgdGhpcy5feCA9IHg7XG4gIH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0VmVjdG9yLnByb3RvdHlwZSwgJ3knLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl95O1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uICh5KSB7XG4gICAgdGhpcy5feSA9IHk7XG4gIH1cbn0pO1xuXG5PYmplY3RWZWN0b3IucHJvdG90eXBlLmN0b3IgPSBPYmplY3RWZWN0b3I7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0VmVjdG9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVmVjdG9yID0gcmVxdWlyZSgnLi9WZWN0b3IuanMnKVxuICAsIEZsb2F0MzJWZWN0b3IgPSByZXF1aXJlKCcuL0Zsb2F0MzJWZWN0b3IuanMnKVxuICAsIE9iamVjdFZlY3RvciA9IHJlcXVpcmUoJy4vT2JqZWN0VmVjdG9yLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBBcnJheVZlY3RvcjogVmVjdG9yLFxuICBPYmplY3RWZWN0b3I6IE9iamVjdFZlY3RvcixcbiAgRmxvYXQzMlZlY3RvcjogRmxvYXQzMlZlY3RvclxuXG4gIC8vIFRPRE86IEFkZCBpbnN0YW5jZSBtZXRob2RzIGluIHRoZSBmdXR1cmVcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogUHJpbWFyeSBWZWN0b3IgY2xhc3MuIFVzZXMgQXJyYXkgdHlwZSBmb3IgYXhpcyBzdG9yYWdlLlxuICogQGNsYXNzIFZlY3RvclxuICogQHBhcmFtIHtOdW1iZXJ9IHggVGhlIHggY29tcG9uZW50IG9mIHRoaXMgVmVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0geSBUaGUgeSBjb21wb25lbnQgb2YgdGhpcyBWZWN0b3JcbiAqL1xuZnVuY3Rpb24gVmVjdG9yKHgsIHkpIHtcbiAgaWYgKHRoaXMgaW5zdGFuY2VvZiBWZWN0b3IgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IoeCwgeSk7XG4gIH1cblxuICB0aGlzLl9heGVzID0gW3gsIHldO1xufVxubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3I7XG5cbnZhciBwcmVjaXNpb24gPSBbXG4gIDEsXG4gIDEwLFxuICAxMDAsXG4gIDEwMDAsXG4gIDEwMDAwLFxuICAxMDAwMDAsXG4gIDEwMDAwMDAsXG4gIDEwMDAwMDAwLFxuICAxMDAwMDAwMDAsXG4gIDEwMDAwMDAwMDAsXG4gIDEwMDAwMDAwMDAwXG5dO1xuXG5WZWN0b3IucHJvdG90eXBlID0ge1xuICBjdG9yOiBWZWN0b3IsXG5cbiAgLyoqXG4gICAqIFNldCBib3RoIHggYW5kIHlcbiAgICogQHBhcmFtIHggICBOZXcgeCB2YWxcbiAgICogQHBhcmFtIHkgICBOZXcgeSB2YWxcbiAgICovXG4gIHNldEF4ZXM6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICAvKipcbiAgICogR2V0dGVyIGZvciB4IGF4aXMuXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGdldFg6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLng7XG4gIH0sXG5cblxuICAvKipcbiAgICogU2V0dGVyIGZvciB4IGF4aXMuXG4gICAqL1xuICBzZXRYOiBmdW5jdGlvbih4KSB7XG4gICAgdGhpcy54ID0geDtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgeSBheGlzLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBnZXRZOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy55O1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgeSBheGlzLlxuICAgKi9cbiAgc2V0WTogZnVuY3Rpb24oeSkge1xuICAgIHRoaXMueSA9IHk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBWaWV3IHZlY3RvciBhcyBhIHN0cmluZyBzdWNoIGFzIFwiVmVjMkQ6ICgwLCA0KVwiXG4gICAqIEBwYXJhbSAgIHtCb29sZWFufVxuICAgKiBAcmV0dXJuICB7U3RyaW5nfVxuICAgKi9cbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKHJvdW5kKSB7XG4gICAgaWYgKHJvdW5kKSB7XG4gICAgICByZXR1cm4gJygnICsgTWF0aC5yb3VuZCh0aGlzLngpICtcbiAgICAgICAgJywgJyArIE1hdGgucm91bmQodGhpcy55KSArICcpJztcbiAgICB9XG4gICAgcmV0dXJuICcoJyArIHRoaXMueCArICcsICcgKyB0aGlzLnkgKyAnKSc7XG4gIH0sXG5cblxuICAvKipcbiAgICogUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHZlY3RvciBheGVzLlxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIHRvQXJyYXk6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgQXJyYXkodGhpcy54LCB0aGlzLnkpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFJldHVybiBhbiBhcnJheSBjb250YWluaW5nIHRoZSB2ZWN0b3IgYXhlcy5cbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgdG9PYmplY3Q6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICB4OiB0aGlzLngsXG4gICAgICB5OiB0aGlzLnlcbiAgICB9O1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgcHJvdmlkZWQgVmVjdG9yIHRvIHRoaXMgb25lLlxuICAgKiBAcGFyYW0ge1ZlY3Rvcn0gdmVjXG4gICAqL1xuICBhZGQ6IGZ1bmN0aW9uKHZlYykge1xuICAgIHRoaXMueCArPSB2ZWMueDtcbiAgICB0aGlzLnkgKz0gdmVjLnk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICAvKipcbiAgICogU3VidHJhY3QgdGhlIHByb3ZpZGVkIHZlY3RvciBmcm9tIHRoaXMgb25lLlxuICAgKiBAcGFyYW0ge1ZlY3Rvcn0gdmVjXG4gICAqL1xuICBzdWJ0cmFjdDogZnVuY3Rpb24odmVjKSB7XG4gICAgdGhpcy54IC09IHZlYy54O1xuICAgIHRoaXMueSAtPSB2ZWMueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBDaGVjayBpcyB0aGUgdmVjdG9yIHByb3ZpZGVkIGVxdWFsIHRvIHRoaXMgb25lLlxuICAgKiBAcGFyYW0gICB7VmVjMkR9ICAgdmVjXG4gICAqIEByZXR1cm4gIHtCb29sZWFufVxuICAgKi9cbiAgZXF1YWxzOiBmdW5jdGlvbih2ZWMpIHtcbiAgICByZXR1cm4gKHZlYy54ID09IHRoaXMueCAmJiB2ZWMueSA9PSB0aGlzLnkpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIE11bHRpcGx5IHRoaXMgdmVjdG9yIGJ5IHRoZSBwcm92aWRlZCB2ZWN0b3IuXG4gICAqIEBwYXJhbSB7VmVjdG9yfSB2ZWNcbiAgICovXG4gIG11bHRpcGx5QnlWZWN0b3I6IGZ1bmN0aW9uKHZlYykge1xuICAgIHRoaXMueCAqPSB2ZWMueDtcbiAgICB0aGlzLnkgKj0gdmVjLnk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIG11bFY6IGZ1bmN0aW9uKHYpIHtcbiAgICByZXR1cm4gdGhpcy5tdWx0aXBseUJ5VmVjdG9yKHYpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIE11bHRpcGx5IHRoaXMgdmVjdG9yIGJ5IHRoZSBwcm92aWRlZCB2ZWN0b3IuXG4gICAqIEBwYXJhbSB7VmVjdG9yfSB2ZWNcbiAgICovXG4gIGRpdmlkZUJ5VmVjdG9yOiBmdW5jdGlvbih2ZWMpIHtcbiAgICB0aGlzLnggLz0gdmVjLng7XG4gICAgdGhpcy55IC89IHZlYy55O1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBkaXZWOiBmdW5jdGlvbih2KSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2aWRlQnlWZWN0b3Iodik7XG4gIH0sXG5cblxuICAvKipcbiAgICogTXVsdGlwbHkgdGhpcyB2ZWN0b3IgYnkgdGhlIHByb3ZpZGVkIG51bWJlclxuICAgKiBAcGFyYW0ge051bWJlcn0gblxuICAgKi9cbiAgbXVsdGlwbHlCeVNjYWxhcjogZnVuY3Rpb24obikge1xuICAgIHRoaXMueCAqPSBuO1xuICAgIHRoaXMueSAqPSBuO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIG11bFM6IGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gdGhpcy5tdWx0aXBseUJ5U2NhbGFyKG4pO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIERpdml2ZSB0aGlzIHZlY3RvciBieSB0aGUgcHJvdmlkZWQgbnVtYmVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gICAqL1xuICBkaXZpZGVCeVNjYWxhcjogZnVuY3Rpb24obikge1xuICAgIHRoaXMueCAvPSBuO1xuICAgIHRoaXMueSAvPSBuO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBkaXZTOiBmdW5jdGlvbihuKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2aWRlQnlTY2FsYXIobik7XG4gIH0sXG5cblxuICAvKipcbiAgICogTm9ybWFsaXNlIHRoaXMgdmVjdG9yLiBEaXJlY3RseSBhZmZlY3RzIHRoaXMgdmVjdG9yLlxuICAgKiBVc2UgVmVjMkQubm9ybWFsaXNlKHZlY3RvcikgdG8gY3JlYXRlIGEgbm9ybWFsaXNlZCBjbG9uZSBvZiB0aGlzLlxuICAgKi9cbiAgbm9ybWFsaXNlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kaXZpZGVCeVNjYWxhcih0aGlzLm1hZ25pdHVkZSgpKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBGb3IgQW1lcmljYW4gc3BlbGxpbmcuXG4gICAqIFNhbWUgYXMgdW5pdC9ub3JtYWxpc2UgZnVuY3Rpb24uXG4gICAqL1xuICBub3JtYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm5vcm1hbGlzZSgpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFRoZSBzYW1lIGFzIG5vcm1hbGlzZS5cbiAgICovXG4gIHVuaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm5vcm1hbGlzZSgpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbWFnbml0dWRlIChsZW5ndGgpIG9mIHRoaXMgdmVjdG9yLlxuICAgKiBAcmV0dXJuICB7TnVtYmVyfVxuICAgKi9cbiAgbWFnbml0dWRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IHRoaXMueCxcbiAgICAgIHkgPSB0aGlzLnk7XG5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ICogeCkgKyAoeSAqIHkpKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG1hZ25pdHVkZSAobGVuZ3RoKSBvZiB0aGlzIHZlY3Rvci5cbiAgICogQHJldHVybiAge051bWJlcn1cbiAgICovXG4gIGxlbmd0aDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWFnbml0dWRlKCk7XG4gIH0sXG5cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBzcXVyZWQgbGVuZ3RoIG9mIGEgdmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGxlbmd0aFNxOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgeCA9IHRoaXMueCxcbiAgICAgIHkgPSB0aGlzLnk7XG5cbiAgICByZXR1cm4gKHggKiB4KSArICh5ICogeSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogR2V0IHRoZSBkb3QgcHJvZHVjdCBvZiB0aGlzIHZlY3RvciBieSBhbm90aGVyLlxuICAgKiBAcGFyYW0gICB7VmVjdG9yfSB2ZWNcbiAgICogQHJldHVybiAge051bWJlcn1cbiAgICovXG4gIGRvdDogZnVuY3Rpb24odmVjKSB7XG4gICAgcmV0dXJuICh2ZWMueCAqIHRoaXMueCkgKyAodmVjLnkgKiB0aGlzLnkpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0aGlzIHZlY3RvciBieSBhbm90aGVyLlxuICAgKiBAcGFyYW0gICB7VmVjdG9yfSB2ZWNcbiAgICogQHJldHVybiAge051bWJlcn1cbiAgICovXG4gIGNyb3NzOiBmdW5jdGlvbih2ZWMpIHtcbiAgICByZXR1cm4gKCh0aGlzLnggKiB2ZWMueSkgLSAodGhpcy55ICogdmVjLngpKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBSZXZlcnNlcyB0aGlzIHZlY3Rvci5cbiAgICovXG4gIHJldmVyc2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMueCA9IC10aGlzLng7XG4gICAgdGhpcy55ID0gLXRoaXMueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHZlY3RvciB0byBhYnNvbHV0ZSB2YWx1ZXMuXG4gICAqIEBwYXJhbSAgIHtWZWN0b3J9IHZlY1xuICAgKi9cbiAgYWJzOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnggPSBNYXRoLmFicyh0aGlzLngpO1xuICAgIHRoaXMueSA9IE1hdGguYWJzKHRoaXMueSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBsaW1pdDogZnVuY3Rpb24obWF4KSB7XG4gICAgaWYgKHRoaXMubWFnbml0dWRlKCkgPiBtYXgpIHtcblx0XHQgIHRoaXMubm9ybWFsaXplKCk7XG5cdFx0ICB0aGlzLm11bFMobWF4KTtcblx0ICB9XG4gIH0sXG5cblxuICAvKipcbiAgICogWmVyb2VzIHRoZSB2ZWN0b3JcbiAgICogQHJldHVybiAge1ZlY3Rvcn1cbiAgICovXG4gIHplcm86IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMueCA9IHRoaXMueSA9IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICAvKipcbiAgICogRGlzdGFuY2UgYmV0d2VlbiB0aGlzIHZlY3RvciBhbmQgYW5vdGhlci5cbiAgICogQHBhcmFtIHtWZWN0b3J9IHZcbiAgICovXG4gIGRpc3RhbmNlOiBmdW5jdGlvbiAodikge1xuICAgIHZhciB4ID0gdGhpcy54IC0gdi54O1xuICAgIHZhciB5ID0gdGhpcy55IC0gdi55O1xuXG4gICAgcmV0dXJuIE1hdGguc3FydCgoeCAqIHgpICsgKHkgKiB5KSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogUm90YXRlIHRoZSB2ZXRvciBieSBwcm92aWRlZCByYWRpYW5zLlxuICAgKiBAcGFyYW0gICB7TnVtYmVyfSAgcmFkc1xuICAgKiBAcmV0dXJuICB7VmVjdG9yfVxuICAgKi9cbiAgcm90YXRlOiBmdW5jdGlvbihyYWRzKSB7XG4gICAgdmFyIGNvcyA9IE1hdGguY29zKHJhZHMpLFxuICAgICAgc2luID0gTWF0aC5zaW4ocmFkcyk7XG5cbiAgICB2YXIgb3ggPSB0aGlzLngsXG4gICAgICBveSA9IHRoaXMueTtcblxuICAgIHRoaXMueCA9IG94ICogY29zIC0gb3kgKiBzaW47XG4gICAgdGhpcy55ID0gb3ggKiBzaW4gKyBveSAqIGNvcztcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFJvdW5kIHRoaXMgdmVjdG9yIHRvIG4gZGVjaW1hbCBwbGFjZXNcbiAgICogQHBhcmFtIHtOdW1iZXJ9ICBuXG4gICAqL1xuICByb3VuZDogZnVuY3Rpb24obikge1xuICAgIC8vIERlZmF1bHQgaXMgdHdvIGRlY2ltYWxzXG4gICAgbiA9IG4gfHwgMjtcblxuICAgIHZhciBwID0gcHJlY2lzaW9uW25dO1xuXG4gICAgLy8gVGhpcyBwZXJmb3JtcyB3YWFheSBiZXR0ZXIgdGhhbiB0b0ZpeGVkIGFuZCBnaXZlIEZsb2F0MzIgdGhlIGVkZ2UgYWdhaW4uXG4gICAgLy8gaHR0cDovL3d3dy5keW5hbWljZ3VydS5jb20vamF2YXNjcmlwdC9yb3VuZC1udW1iZXJzLXdpdGgtcHJlY2lzaW9uL1xuICAgIHRoaXMueCA9ICgoMC41ICsgKHRoaXMueCAqIHApKSA8PCAwKSAvIHA7XG4gICAgdGhpcy55ID0gKCgwLjUgKyAodGhpcy55ICogcCkpIDw8IDApIC8gcDtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGNvcHkgb2YgdGhpcyB2ZWN0b3IuXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn1cbiAgICovXG4gIGNsb25lOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY3Rvcih0aGlzLngsIHRoaXMueSk7XG4gIH1cbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShWZWN0b3IucHJvdG90eXBlLCAneCcsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F4ZXNbMF07XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKHgpIHtcbiAgICB0aGlzLl9heGVzWzBdID0geDtcbiAgfVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShWZWN0b3IucHJvdG90eXBlLCAneScsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F4ZXNbMV07XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKHkpIHtcbiAgICB0aGlzLl9heGVzWzFdID0geTtcbiAgfVxufSk7XG4iLCIgIC8qKlxuICAgKiBBIGNsYXNzIHRvIGRlc2NyaWJlIGEgdHdvIG9yIHRocmVlIGRpbWVuc2lvbmFsIHZlY3Rvciwgc3BlY2lmaWNhbGx5XG4gICAqIGEgRXVjbGlkZWFuIChhbHNvIGtub3duIGFzIGdlb21ldHJpYykgdmVjdG9yLiBBIHZlY3RvciBpcyBhbiBlbnRpdHlcbiAgICogdGhhdCBoYXMgYm90aCBtYWduaXR1ZGUgYW5kIGRpcmVjdGlvbi4gVGhlIGRhdGF0eXBlLCBob3dldmVyLCBzdG9yZXNcbiAgICogdGhlIGNvbXBvbmVudHMgb2YgdGhlIHZlY3RvciAoeCx5IGZvciAyRCwgYW5kIHgseSx6IGZvciAzRCkuIFRoZSBtYWduaXR1ZGVcbiAgICogYW5kIGRpcmVjdGlvbiBjYW4gYmUgYWNjZXNzZWQgdmlhIHRoZSBtZXRob2RzIG1hZygpIGFuZCBoZWFkaW5nKCkuIEluIG1hbnlcbiAgICogb2YgdGhlIHA1LmpzIGV4YW1wbGVzLCB5b3Ugd2lsbCBzZWUgVmVjdG9yIHVzZWQgdG8gZGVzY3JpYmUgYSBwb3NpdGlvbixcbiAgICogdmVsb2NpdHksIG9yIGFjY2VsZXJhdGlvbi4gRm9yIGV4YW1wbGUsIGlmIHlvdSBjb25zaWRlciBhIHJlY3RhbmdsZSBtb3ZpbmdcbiAgICogYWNyb3NzIHRoZSBzY3JlZW4sIGF0IGFueSBnaXZlbiBpbnN0YW50IGl0IGhhcyBhIHBvc2l0aW9uIChhIHZlY3RvciB0aGF0XG4gICAqIHBvaW50cyBmcm9tIHRoZSBvcmlnaW4gdG8gaXRzIGxvY2F0aW9uKSwgYSB2ZWxvY2l0eSAodGhlIHJhdGUgYXQgd2hpY2ggdGhlXG4gICAqIG9iamVjdCdzIHBvc2l0aW9uIGNoYW5nZXMgcGVyIHRpbWUgdW5pdCwgZXhwcmVzc2VkIGFzIGEgdmVjdG9yKSwgYW5kXG4gICAqIGFjY2VsZXJhdGlvbiAodGhlIHJhdGUgYXQgd2hpY2ggdGhlIG9iamVjdCdzIHZlbG9jaXR5IGNoYW5nZXMgcGVyIHRpbWVcbiAgICogdW5pdCwgZXhwcmVzc2VkIGFzIGEgdmVjdG9yKS4gU2luY2UgdmVjdG9ycyByZXByZXNlbnQgZ3JvdXBpbmdzIG9mIHZhbHVlcyxcbiAgICogd2UgY2Fubm90IHNpbXBseSB1c2UgdHJhZGl0aW9uYWwgYWRkaXRpb24vbXVsdGlwbGljYXRpb24vZXRjLiBJbnN0ZWFkLFxuICAgKiB3ZSdsbCBuZWVkIHRvIGRvIHNvbWUgXCJ2ZWN0b3JcIiBtYXRoLCB3aGljaCBpcyBtYWRlIGVhc3kgYnkgdGhlIG1ldGhvZHNcbiAgICogaW5zaWRlIHRoZSBWZWN0b3IgY2xhc3MuXG4gICAqXG4gICAqIEBjbGFzcyBWZWN0b3JcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbeF0geCBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcGFyYW0ge051bWJlcn0gW3ldIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt6XSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXY+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoNDAsIDUwKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDQwLCA1MCk7XG4gICAqXG4gICAqIGVsbGlwc2UodjEueCwgdjEueSwgNTAsIDUwKTtcbiAgICogZWxsaXBzZSh2Mi54LCB2Mi55LCA1MCwgNTApO1xuICAgKiB2MS5hZGQodjIpO1xuICAgKiBlbGxpcHNlKHYxLngsIHYxLnksIDUwLCA1MCk7XG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICB2YXIgVmVjdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy54ID0gYXJndW1lbnRzWzBdIHx8IDA7XG5cdFx0dGhpcy55ID0gYXJndW1lbnRzWzFdIHx8IDA7XG5cdFx0dGhpcy56ID0gYXJndW1lbnRzWzJdIHx8IDA7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSB2ZWN0b3IgdiBieSBjYWxsaW5nIFN0cmluZyh2KVxuICAgKiBvciB2LnRvU3RyaW5nKCkuIFRoaXMgbWV0aG9kIGlzIHVzZWZ1bCBmb3IgbG9nZ2luZyB2ZWN0b3JzIGluIHRoZVxuICAgKiBjb25zb2xlLlxuICAgKiBAbWV0aG9kICB0b1N0cmluZ1xuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzID0gXCJub3JlbmRlclwiPjxjb2RlPlxuICAgKiBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICogICB2YXIgdiA9IGNyZWF0ZVZlY3RvcigyMCwzMCk7XG4gICAqICAgcHJpbnQoU3RyaW5nKHYpKTsgLy8gcHJpbnRzIFwiVmVjdG9yIE9iamVjdCA6IFsyMCwgMzAsIDBdXCJcbiAgICogfVxuICAgKiA8L2Rpdj48L2NvZGU+XG4gICAqXG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdWZWN0b3IgT2JqZWN0IDogWycrIHRoaXMueCArJywgJysgdGhpcy55ICsnLCAnKyB0aGlzLnogKyAnXSc7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHgsIHksIGFuZCB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIHVzaW5nIHR3byBvciB0aHJlZSBzZXBhcmF0ZVxuICAgKiB2YXJpYWJsZXMsIHRoZSBkYXRhIGZyb20gYSBWZWN0b3IsIG9yIHRoZSB2YWx1ZXMgZnJvbSBhIGZsb2F0IGFycmF5LlxuICAgKiBAbWV0aG9kIHNldFxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcnxWZWN0b3J8QXJyYXl9IFt4XSB0aGUgeCBjb21wb25lbnQgb2YgdGhlIHZlY3RvciBvciBhXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlY3RvciBvciBhbiBBcnJheVxuICAgKiBAcGFyYW0ge051bWJlcn0gICAgICAgICAgICAgICAgIFt5XSB0aGUgeSBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcGFyYW0ge051bWJlcn0gICAgICAgICAgICAgICAgIFt6XSB0aGUgeiBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgKiAgICB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogICAgdi5zZXQoNCw1LDYpOyAvLyBTZXRzIHZlY3RvciB0byBbNCwgNSwgNl1cbiAgICpcbiAgICogICAgdmFyIHYxID0gY3JlYXRlVmVjdG9yKDAsIDAsIDApO1xuICAgKiAgICB2YXIgYXJyID0gWzEsIDIsIDNdO1xuICAgKiAgICB2MS5zZXQoYXJyKTsgLy8gU2V0cyB2ZWN0b3IgdG8gWzEsIDIsIDNdXG4gICAqIH1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuICAgICAgdGhpcy54ID0geC54IHx8IDA7XG4gICAgICB0aGlzLnkgPSB4LnkgfHwgMDtcbiAgICAgIHRoaXMueiA9IHgueiB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHRoaXMueCA9IHhbMF0gfHwgMDtcbiAgICAgIHRoaXMueSA9IHhbMV0gfHwgMDtcbiAgICAgIHRoaXMueiA9IHhbMl0gfHwgMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0aGlzLnggPSB4IHx8IDA7XG4gICAgdGhpcy55ID0geSB8fCAwO1xuICAgIHRoaXMueiA9IHogfHwgMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogR2V0cyBhIGNvcHkgb2YgdGhlIHZlY3RvciwgcmV0dXJucyBhIFZlY3RvciBvYmplY3QuXG4gICAqXG4gICAqIEBtZXRob2QgY29weVxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSBjb3B5IG9mIHRoZSBWZWN0b3Igb2JqZWN0XG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2YXIgdjIgPSB2LmNvcHkoKTtcbiAgICogcHJpbnQodjEueCA9PSB2Mi54ICYmIHYxLnkgPT0gdjIueSAmJiB2MS56ID09IHYyLnopO1xuICAgKiAvLyBQcmludHMgXCJ0cnVlXCJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLngsdGhpcy55LHRoaXMueik7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZHMgeCwgeSwgYW5kIHogY29tcG9uZW50cyB0byBhIHZlY3RvciwgYWRkcyBvbmUgdmVjdG9yIHRvIGFub3RoZXIsIG9yXG4gICAqIGFkZHMgdHdvIGluZGVwZW5kZW50IHZlY3RvcnMgdG9nZXRoZXIuIFRoZSB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgdGhhdCBhZGRzXG4gICAqIHR3byB2ZWN0b3JzIHRvZ2V0aGVyIGlzIGEgc3RhdGljIG1ldGhvZCBhbmQgcmV0dXJucyBhIFZlY3RvciwgdGhlIG90aGVyc1xuICAgKiBhY3RzIGRpcmVjdGx5IG9uIHRoZSB2ZWN0b3IuIFNlZSB0aGUgZXhhbXBsZXMgZm9yIG1vcmUgY29udGV4dC5cbiAgICpcbiAgICogQG1ldGhvZCBhZGRcbiAgICogQGNoYWluYWJsZVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ8VmVjdG9yfEFycmF5fSB4ICAgdGhlIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3IgdG8gYmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkIG9yIGEgVmVjdG9yIG9yIGFuIEFycmF5XG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIFt5XSB0aGUgeSBjb21wb25lbnQgb2YgdGhlIHZlY3RvciB0byBiZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWRcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3pdIHRoZSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIHRvIGJlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRlZFxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgICAgICAgICAgICAgICAgdGhlIFZlY3RvciBvYmplY3QuXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHYuYWRkKDQsNSw2KTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvIFs1LCA3LCA5XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMiwgMywgNCk7XG4gICAqXG4gICAqIHZhciB2MyA9IFZlY3Rvci5hZGQodjEsIHYyKTtcbiAgICogLy8gdjMgaGFzIGNvbXBvbmVudHMgWzMsIDUsIDddXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IpIHtcbiAgICAgIHRoaXMueCArPSB4LnggfHwgMDtcbiAgICAgIHRoaXMueSArPSB4LnkgfHwgMDtcbiAgICAgIHRoaXMueiArPSB4LnogfHwgMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICB0aGlzLnggKz0geFswXSB8fCAwO1xuICAgICAgdGhpcy55ICs9IHhbMV0gfHwgMDtcbiAgICAgIHRoaXMueiArPSB4WzJdIHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdGhpcy54ICs9IHggfHwgMDtcbiAgICB0aGlzLnkgKz0geSB8fCAwO1xuICAgIHRoaXMueiArPSB6IHx8IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN1YnRyYWN0cyB4LCB5LCBhbmQgeiBjb21wb25lbnRzIGZyb20gYSB2ZWN0b3IsIHN1YnRyYWN0cyBvbmUgdmVjdG9yIGZyb21cbiAgICogYW5vdGhlciwgb3Igc3VidHJhY3RzIHR3byBpbmRlcGVuZGVudCB2ZWN0b3JzLiBUaGUgdmVyc2lvbiBvZiB0aGUgbWV0aG9kXG4gICAqIHRoYXQgc3VidHJhY3RzIHR3byB2ZWN0b3JzIGlzIGEgc3RhdGljIG1ldGhvZCBhbmQgcmV0dXJucyBhIFZlY3RvciwgdGhlXG4gICAqIG90aGVyIGFjdHMgZGlyZWN0bHkgb24gdGhlIHZlY3Rvci4gU2VlIHRoZSBleGFtcGxlcyBmb3IgbW9yZSBjb250ZXh0LlxuICAgKlxuICAgKiBAbWV0aG9kIHN1YlxuICAgKiBAY2hhaW5hYmxlXG4gICAqIEBwYXJhbSAge051bWJlcnxWZWN0b3J8QXJyYXl9IHggICB0aGUgeCBjb21wb25lbnQgb2YgdGhlIHZlY3RvciBvciBhXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWN0b3Igb3IgYW4gQXJyYXlcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3ldIHRoZSB5IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIFt6XSB0aGUgeiBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgICAgICAgICAgICAgICAgVmVjdG9yIG9iamVjdC5cbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3Rvcig0LCA1LCA2KTtcbiAgICogdi5zdWIoMSwgMSwgMSk7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0byBbMywgNCwgNV1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigyLCAzLCA0KTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKlxuICAgKiB2YXIgdjMgPSBWZWN0b3Iuc3ViKHYxLCB2Mik7XG4gICAqIC8vIHYzIGhhcyBjb21wbmVudHMgWzEsIDEsIDFdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IpIHtcbiAgICAgIHRoaXMueCAtPSB4LnggfHwgMDtcbiAgICAgIHRoaXMueSAtPSB4LnkgfHwgMDtcbiAgICAgIHRoaXMueiAtPSB4LnogfHwgMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICB0aGlzLnggLT0geFswXSB8fCAwO1xuICAgICAgdGhpcy55IC09IHhbMV0gfHwgMDtcbiAgICAgIHRoaXMueiAtPSB4WzJdIHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdGhpcy54IC09IHggfHwgMDtcbiAgICB0aGlzLnkgLT0geSB8fCAwO1xuICAgIHRoaXMueiAtPSB6IHx8IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIE11bHRpcGx5IHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuIFRoZSBzdGF0aWMgdmVyc2lvbiBvZiB0aGlzIG1ldGhvZFxuICAgKiBjcmVhdGVzIGEgbmV3IFZlY3RvciB3aGlsZSB0aGUgbm9uIHN0YXRpYyB2ZXJzaW9uIGFjdHMgb24gdGhlIHZlY3RvclxuICAgKiBkaXJlY3RseS4gU2VlIHRoZSBleGFtcGxlcyBmb3IgbW9yZSBjb250ZXh0LlxuICAgKlxuICAgKiBAbWV0aG9kIG11bHRcbiAgICogQGNoYWluYWJsZVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgIG4gdGhlIG51bWJlciB0byBtdWx0aXBseSB3aXRoIHRoZSB2ZWN0b3JcbiAgICogQHJldHVybiB7VmVjdG9yfSBhIHJlZmVyZW5jZSB0byB0aGUgVmVjdG9yIG9iamVjdCAoYWxsb3cgY2hhaW5pbmcpXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHYubXVsdCgyKTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvIFsyLCA0LCA2XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2YXIgdjIgPSBWZWN0b3IubXVsdCh2MSwgMik7XG4gICAqIC8vIHYyIGhhcyBjb21wbmVudHMgWzIsIDQsIDZdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiAobikge1xuICAgIHRoaXMueCAqPSBuIHx8IDA7XG4gICAgdGhpcy55ICo9IG4gfHwgMDtcbiAgICB0aGlzLnogKj0gbiB8fCAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEaXZpZGUgdGhlIHZlY3RvciBieSBhIHNjYWxhci4gVGhlIHN0YXRpYyB2ZXJzaW9uIG9mIHRoaXMgbWV0aG9kIGNyZWF0ZXMgYVxuICAgKiBuZXcgVmVjdG9yIHdoaWxlIHRoZSBub24gc3RhdGljIHZlcnNpb24gYWN0cyBvbiB0aGUgdmVjdG9yIGRpcmVjdGx5LlxuICAgKiBTZWUgdGhlIGV4YW1wbGVzIGZvciBtb3JlIGNvbnRleHQuXG4gICAqXG4gICAqIEBtZXRob2QgZGl2XG4gICAqIEBjaGFpbmFibGVcbiAgICogQHBhcmFtICB7bnVtYmVyfSAgICBuIHRoZSBudW1iZXIgdG8gZGl2aWRlIHRoZSB2ZWN0b3IgYnlcbiAgICogQHJldHVybiB7VmVjdG9yfSBhIHJlZmVyZW5jZSB0byB0aGUgVmVjdG9yIG9iamVjdCAoYWxsb3cgY2hhaW5pbmcpXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoNiwgNCwgMik7XG4gICAqIHYuZGl2KDIpOyAvL3YncyBjb21wbmVudHMgYXJlIHNldCB0byBbMywgMiwgMV1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSAgPSBjcmVhdGVWZWN0b3IoNiwgNCwgMik7XG4gICAqIHZhciB2MiA9IFZlY3Rvci5kaXYodiwgMik7XG4gICAqIC8vIHYyIGhhcyBjb21wbmVudHMgWzMsIDIsIDFdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmRpdiA9IGZ1bmN0aW9uIChuKSB7XG4gICAgdGhpcy54IC89IG47XG4gICAgdGhpcy55IC89IG47XG4gICAgdGhpcy56IC89IG47XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIG1hZ25pdHVkZSAobGVuZ3RoKSBvZiB0aGUgdmVjdG9yIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgYXNcbiAgICogYSBmbG9hdCAodGhpcyBpcyBzaW1wbHkgdGhlIGVxdWF0aW9uIHNxcnQoeCp4ICsgeSp5ICsgeip6KS4pXG4gICAqXG4gICAqIEBtZXRob2QgbWFnXG4gICAqIEByZXR1cm4ge051bWJlcn0gbWFnbml0dWRlIG9mIHRoZSB2ZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigyMC4wLCAzMC4wLCA0MC4wKTtcbiAgICogdmFyIG0gPSB2Lm1hZygxMCk7XG4gICAqIHByaW50KG0pOyAvLyBQcmludHMgXCI1My44NTE2NDgwNzEzNDUwNFwiXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLm1hZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMubWFnU3EoKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgbWFnbml0dWRlIG9mIHRoZSB2ZWN0b3IgYW5kIHJldHVybnMgdGhlIHJlc3VsdFxuICAgKiBhcyBhIGZsb2F0ICh0aGlzIGlzIHNpbXBseSB0aGUgZXF1YXRpb24gPGVtPih4KnggKyB5KnkgKyB6KnopPC9lbT4uKVxuICAgKiBGYXN0ZXIgaWYgdGhlIHJlYWwgbGVuZ3RoIGlzIG5vdCByZXF1aXJlZCBpbiB0aGVcbiAgICogY2FzZSBvZiBjb21wYXJpbmcgdmVjdG9ycywgZXRjLlxuICAgKlxuICAgKiBAbWV0aG9kIG1hZ1NxXG4gICAqIEByZXR1cm4ge251bWJlcn0gc3F1YXJlZCBtYWduaXR1ZGUgb2YgdGhlIHZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDYsIDQsIDIpO1xuICAgKiBwcmludCh2MS5tYWdTcSgpKTsgLy8gUHJpbnRzIFwiNTZcIlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5tYWdTcSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgeCA9IHRoaXMueCwgeSA9IHRoaXMueSwgeiA9IHRoaXMuejtcbiAgICByZXR1cm4gKHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzLiBUaGUgdmVyc2lvbiBvZiB0aGUgbWV0aG9kXG4gICAqIHRoYXQgY29tcHV0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byBpbmRlcGVuZGVudCB2ZWN0b3JzIGlzIGEgc3RhdGljXG4gICAqIG1ldGhvZC4gU2VlIHRoZSBleGFtcGxlcyBmb3IgbW9yZSBjb250ZXh0LlxuICAgKlxuICAgKlxuICAgKiBAbWV0aG9kIGRvdFxuICAgKiBAcGFyYW0gIHtOdW1iZXJ8VmVjdG9yfSB4ICAgeCBjb21wb25lbnQgb2YgdGhlIHZlY3RvciBvciBhIFZlY3RvclxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICBbeV0geSBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICBbel0geiBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICB0aGUgZG90IHByb2R1Y3RcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigyLCAzLCA0KTtcbiAgICpcbiAgICogcHJpbnQodjEuZG90KHYyKSk7IC8vIFByaW50cyBcIjIwXCJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvL1N0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMywgMiwgMSk7XG4gICAqIHByaW50IChWZWN0b3IuZG90KHYxLCB2MikpOyAvLyBQcmludHMgXCIxMFwiXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvdCh4LngsIHgueSwgeC56KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMueCAqICh4IHx8IDApICtcbiAgICAgICAgICAgdGhpcy55ICogKHkgfHwgMCkgK1xuICAgICAgICAgICB0aGlzLnogKiAoeiB8fCAwKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyBhIHZlY3RvciBjb21wb3NlZCBvZiB0aGUgY3Jvc3MgcHJvZHVjdCBiZXR3ZWVuXG4gICAqIHR3byB2ZWN0b3JzLiBCb3RoIHRoZSBzdGF0aWMgYW5kIG5vbiBzdGF0aWMgbWV0aG9kcyByZXR1cm4gYSBuZXcgVmVjdG9yLlxuICAgKiBTZWUgdGhlIGV4YW1wbGVzIGZvciBtb3JlIGNvbnRleHQuXG4gICAqXG4gICAqIEBtZXRob2QgY3Jvc3NcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2IFZlY3RvciB0byBiZSBjcm9zc2VkXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICBWZWN0b3IgY29tcG9zZWQgb2YgY3Jvc3MgcHJvZHVjdFxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKlxuICAgKiB2MS5jcm9zcyh2Mik7IC8vIHYncyBjb21wb25lbnRzIGFyZSBbMCwgMCwgMF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAwLCAwKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDAsIDEsIDApO1xuICAgKlxuICAgKiB2YXIgY3Jvc3NQcm9kdWN0ID0gVmVjdG9yLmNyb3NzKHYxLCB2Mik7XG4gICAqIC8vIGNyb3NzUHJvZHVjdCBoYXMgY29tcG9uZW50cyBbMCwgMCwgMV1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbiAodikge1xuICAgIHZhciB4ID0gdGhpcy55ICogdi56IC0gdGhpcy56ICogdi55O1xuICAgIHZhciB5ID0gdGhpcy56ICogdi54IC0gdGhpcy54ICogdi56O1xuICAgIHZhciB6ID0gdGhpcy54ICogdi55IC0gdGhpcy55ICogdi54O1xuXG5cdFx0cmV0dXJuIG5ldyBWZWN0b3IoeCx5LHopO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBFdWNsaWRlYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzIChjb25zaWRlcmluZyBhXG4gICAqIHBvaW50IGFzIGEgdmVjdG9yIG9iamVjdCkuXG4gICAqXG4gICAqIEBtZXRob2QgZGlzdFxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYgdGhlIHgsIHksIGFuZCB6IGNvb3JkaW5hdGVzIG9mIGEgVmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn0gICAgICB0aGUgZGlzdGFuY2VcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMCwgMCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigwLCAxLCAwKTtcbiAgICpcbiAgICogdmFyIGRpc3RhbmNlID0gdjEuZGlzdCh2Mik7IC8vIGRpc3RhbmNlIGlzIDEuNDE0Mi4uLlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDAsIDApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMCwgMSwgMCk7XG4gICAqXG4gICAqIHZhciBkaXN0YW5jZSA9IFZlY3Rvci5kaXN0KHYxLHYyKTtcbiAgICogLy8gZGlzdGFuY2UgaXMgMS40MTQyLi4uXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmRpc3QgPSBmdW5jdGlvbiAodikge1xuICAgIHZhciBkID0gdi5jb3B5KCkuc3ViKHRoaXMpO1xuICAgIHJldHVybiBkLm1hZygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBOb3JtYWxpemUgdGhlIHZlY3RvciB0byBsZW5ndGggMSAobWFrZSBpdCBhIHVuaXQgdmVjdG9yKS5cbiAgICpcbiAgICogQG1ldGhvZCBub3JtYWxpemVcbiAgICogQHJldHVybiB7VmVjdG9yfSBub3JtYWxpemVkIFZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEwLCAyMCwgMik7XG4gICAqIC8vIHYgaGFzIGNvbXBuZW50cyBbMTAuMCwgMjAuMCwgMi4wXVxuICAgKiB2Lm5vcm1hbGl6ZSgpO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG9cbiAgICogLy8gWzAuNDQ1NDM1NCwgMC44OTA4NzA4LCAwLjA4OTA4NzA4NF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmRpdih0aGlzLm1hZygpKTtcbiAgfTtcblxuICAvKipcbiAgICogTGltaXQgdGhlIG1hZ25pdHVkZSBvZiB0aGlzIHZlY3RvciB0byB0aGUgdmFsdWUgdXNlZCBmb3IgdGhlIDxiPm1heDwvYj5cbiAgICogcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAbWV0aG9kIGxpbWl0XG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgbWF4IHRoZSBtYXhpbXVtIG1hZ25pdHVkZSBmb3IgdGhlIHZlY3RvclxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgICB0aGUgbW9kaWZpZWQgVmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMTAsIDIwLCAyKTtcbiAgICogLy8gdiBoYXMgY29tcG5lbnRzIFsxMC4wLCAyMC4wLCAyLjBdXG4gICAqIHYubGltaXQoNSk7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0b1xuICAgKiAvLyBbMi4yMjcxNzcxLCA0LjQ1NDM1NDMsIDAuNDQ1NDM1NF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUubGltaXQgPSBmdW5jdGlvbiAobCkge1xuICAgIHZhciBtU3EgPSB0aGlzLm1hZ1NxKCk7XG4gICAgaWYobVNxID4gbCpsKSB7XG4gICAgICB0aGlzLmRpdihNYXRoLnNxcnQobVNxKSk7IC8vbm9ybWFsaXplIGl0XG4gICAgICB0aGlzLm11bHQobCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIG1hZ25pdHVkZSBvZiB0aGlzIHZlY3RvciB0byB0aGUgdmFsdWUgdXNlZCBmb3IgdGhlIDxiPmxlbjwvYj5cbiAgICogcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAbWV0aG9kIHNldE1hZ1xuICAgKiBAcGFyYW0gIHtudW1iZXJ9ICAgIGxlbiB0aGUgbmV3IGxlbmd0aCBmb3IgdGhpcyB2ZWN0b3JcbiAgICogQHJldHVybiB7VmVjdG9yfSAgICAgdGhlIG1vZGlmaWVkIFZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxMCwgMjAsIDIpO1xuICAgKiAvLyB2IGhhcyBjb21wbmVudHMgWzEwLjAsIDIwLjAsIDIuMF1cbiAgICogdjEuc2V0TWFnKDEwKTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvIFs2LjAsIDguMCwgMC4wXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5zZXRNYWcgPSBmdW5jdGlvbiAobGVuKSB7XG4gICAgcmV0dXJuIHRoaXMubm9ybWFsaXplKCkubXVsdChsZW4pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIGFuZ2xlIG9mIHJvdGF0aW9uIGZvciB0aGlzIHZlY3RvciAob25seSAyRCB2ZWN0b3JzKVxuICAgKlxuICAgKiBAbWV0aG9kIGhlYWRpbmdcbiAgICogQHJldHVybiB7TnVtYmVyfSB0aGUgYW5nbGUgb2Ygcm90YXRpb25cbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcyA9IFwibm9yZW5kZXJcIj48Y29kZT5cbiAgICogZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAqICAgdmFyIHYxID0gY3JlYXRlVmVjdG9yKDMwLDUwKTtcbiAgICogICBwcmludCh2MS5oZWFkaW5nKCkpOyAvLyAxLjAzMDM3NjgyNjUyNDMxMjVcbiAgICpcbiAgICogICB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoNDAsNTApO1xuICAgKiAgIHByaW50KHYxLmhlYWRpbmcoKSk7IC8vIDAuODk2MDU1Mzg0NTcxMzQzOVxuICAgKlxuICAgKiAgIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigzMCw3MCk7XG4gICAqICAgcHJpbnQodjEuaGVhZGluZygpKTsgLy8gMS4xNjU5MDQ1NDA1MDk4MTMyXG4gICAqIH1cbiAgICogPC9kaXY+PC9jb2RlPlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5oZWFkaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueSwgdGhpcy54KTtcbiAgfTtcblxuICAvKipcbiAgICogUm90YXRlIHRoZSB2ZWN0b3IgYnkgYW4gYW5nbGUgKG9ubHkgMkQgdmVjdG9ycyksIG1hZ25pdHVkZSByZW1haW5zIHRoZVxuICAgKiBzYW1lXG4gICAqXG4gICAqIEBtZXRob2Qgcm90YXRlXG4gICAqIEBwYXJhbSAge251bWJlcn0gICAgYW5nbGUgdGhlIGFuZ2xlIG9mIHJvdGF0aW9uXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIG1vZGlmaWVkIFZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEwLjAsIDIwLjApO1xuICAgKiAvLyB2IGhhcyBjb21wbmVudHMgWzEwLjAsIDIwLjAsIDAuMF1cbiAgICogdi5yb3RhdGUoSEFMRl9QSSk7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0byBbLTIwLjAsIDkuOTk5OTk5LCAwLjBdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uIChhbmdsZSkge1xuICAgIHZhciBuZXdIZWFkaW5nID0gdGhpcy5oZWFkaW5nKCkgKyBhbmdsZTtcbiAgICB2YXIgbWFnID0gdGhpcy5tYWcoKTtcbiAgICB0aGlzLnggPSBNYXRoLmNvcyhuZXdIZWFkaW5nKSAqIG1hZztcbiAgICB0aGlzLnkgPSBNYXRoLnNpbihuZXdIZWFkaW5nKSAqIG1hZztcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogTGluZWFyIGludGVycG9sYXRlIHRoZSB2ZWN0b3IgdG8gYW5vdGhlciB2ZWN0b3JcbiAgICpcbiAgICogQG1ldGhvZCBsZXJwXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0geCAgIHRoZSB4IGNvbXBvbmVudCBvciB0aGUgVmVjdG9yIHRvIGxlcnAgdG9cbiAgICogQHBhcmFtICB7VmVjdG9yfSBbeV0geSB0aGUgeSBjb21wb25lbnRcbiAgICogQHBhcmFtICB7VmVjdG9yfSBbel0geiB0aGUgeiBjb21wb25lbnRcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICBhbXQgdGhlIGFtb3VudCBvZiBpbnRlcnBvbGF0aW9uOyBzb21lIHZhbHVlIGJldHdlZW4gMC4wXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgIChvbGQgdmVjdG9yKSBhbmQgMS4wIChuZXcgdmVjdG9yKS4gMC4xIGlzIHZlcnkgbmVhclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgbmV3IHZlY3Rvci4gMC41IGlzIGhhbGZ3YXkgaW4gYmV0d2Vlbi5cbiAgICogQHJldHVybiB7VmVjdG9yfSAgICAgdGhlIG1vZGlmaWVkIFZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEsIDEsIDApO1xuICAgKlxuICAgKiB2LmxlcnAoMywgMywgMCwgMC41KTsgLy8gdiBub3cgaGFzIGNvbXBvbmVudHMgWzIsMiwwXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigwLCAwLCAwKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDEwMCwgMTAwLCAwKTtcbiAgICpcbiAgICogdmFyIHYzID0gVmVjdG9yLmxlcnAodjEsIHYyLCAwLjUpO1xuICAgKiAvLyB2MyBoYXMgY29tcG9uZW50cyBbNTAsNTAsMF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUubGVycCA9IGZ1bmN0aW9uICh4LCB5LCB6LCBhbXQpIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuICAgICAgcmV0dXJuIHRoaXMubGVycCh4LngsIHgueSwgeC56LCB5KTtcbiAgICB9XG4gICAgdGhpcy54ICs9ICh4IC0gdGhpcy54KSAqIGFtdCB8fCAwO1xuICAgIHRoaXMueSArPSAoeSAtIHRoaXMueSkgKiBhbXQgfHwgMDtcbiAgICB0aGlzLnogKz0gKHogLSB0aGlzLnopICogYW10IHx8IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgdmVjdG9yIGFzIGEgZmxvYXQgYXJyYXkuIFRoaXMgaXMgb25seVxuICAgKiBmb3IgdGVtcG9yYXJ5IHVzZS4gSWYgdXNlZCBpbiBhbnkgb3RoZXIgZmFzaGlvbiwgdGhlIGNvbnRlbnRzIHNob3VsZCBiZVxuICAgKiBjb3BpZWQgYnkgdXNpbmcgdGhlIDxiPlZlY3Rvci5jb3B5KCk8L2I+IG1ldGhvZCB0byBjb3B5IGludG8geW91ciBvd25cbiAgICogYXJyYXkuXG4gICAqXG4gICAqIEBtZXRob2QgYXJyYXlcbiAgICogQHJldHVybiB7QXJyYXl9IGFuIEFycmF5IHdpdGggdGhlIDMgdmFsdWVzXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3MgPSBcIm5vcmVuZGVyXCI+PGNvZGU+XG4gICAqIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgKiAgIHZhciB2ID0gY3JlYXRlVmVjdG9yKDIwLDMwKTtcbiAgICogICBwcmludCh2LmFycmF5KCkpOyAvLyBQcmludHMgOiBBcnJheSBbMjAsIDMwLCAwXVxuICAgKiB9XG4gICAqIDwvZGl2PjwvY29kZT5cbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxMC4wLCAyMC4wLCAzMC4wKTtcbiAgICogdmFyIGYgPSB2LmFycmF5KCk7XG4gICAqIHByaW50KGZbMF0pOyAvLyBQcmludHMgXCIxMC4wXCJcbiAgICogcHJpbnQoZlsxXSk7IC8vIFByaW50cyBcIjIwLjBcIlxuICAgKiBwcmludChmWzJdKTsgLy8gUHJpbnRzIFwiMzAuMFwiXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbdGhpcy54IHx8IDAsIHRoaXMueSB8fCAwLCB0aGlzLnogfHwgMF07XG4gIH07XG5cbiAgLyoqXG4gICAqIEVxdWFsaXR5IGNoZWNrIGFnYWluc3QgYSBWZWN0b3JcbiAgICpcbiAgICogQG1ldGhvZCBlcXVhbHNcbiAgICogQHBhcmFtIHtOdW1iZXJ8VmVjdG9yfEFycmF5fSBbeF0gdGhlIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3Igb3IgYVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWN0b3Igb3IgYW4gQXJyYXlcbiAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbeV0gdGhlIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbel0gdGhlIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gd2hldGhlciB0aGUgdmVjdG9ycyBhcmUgZXF1YWxzXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3MgPSBcIm5vcmVuZGVyXCI+PGNvZGU+XG4gICAqIHYxID0gY3JlYXRlVmVjdG9yKDUsMTAsMjApO1xuICAgKiB2MiA9IGNyZWF0ZVZlY3Rvcig1LDEwLDIwKTtcbiAgICogdjMgPSBjcmVhdGVWZWN0b3IoMTMsMTAsMTkpO1xuICAgKlxuICAgKiBwcmludCh2MS5lcXVhbHModjIueCx2Mi55LHYyLnopKTsgLy8gdHJ1ZVxuICAgKiBwcmludCh2MS5lcXVhbHModjMueCx2My55LHYzLnopKTsgLy8gZmFsc2VcbiAgICogPC9kaXY+PC9jb2RlPlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxMC4wLCAyMC4wLCAzMC4wKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDEwLjAsIDIwLjAsIDMwLjApO1xuICAgKiB2YXIgdjMgPSBjcmVhdGVWZWN0b3IoMC4wLCAwLjAsIDAuMCk7XG4gICAqIHByaW50ICh2MS5lcXVhbHModjIpKSAvLyB0cnVlXG4gICAqIHByaW50ICh2MS5lcXVhbHModjMpKSAvLyBmYWxzZVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIHZhciBhLCBiLCBjO1xuICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yKSB7XG4gICAgICBhID0geC54IHx8IDA7XG4gICAgICBiID0geC55IHx8IDA7XG4gICAgICBjID0geC56IHx8IDA7XG4gICAgfSBlbHNlIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGEgPSB4WzBdIHx8IDA7XG4gICAgICBiID0geFsxXSB8fCAwO1xuICAgICAgYyA9IHhbMl0gfHwgMDtcbiAgICB9IGVsc2Uge1xuICAgICAgYSA9IHggfHwgMDtcbiAgICAgIGIgPSB5IHx8IDA7XG4gICAgICBjID0geiB8fCAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy54ID09PSBhICYmIHRoaXMueSA9PT0gYiAmJiB0aGlzLnogPT09IGM7XG4gIH07XG5cblxuICAvLyBTdGF0aWMgTWV0aG9kc1xuXG5cbiAgLyoqXG4gICAqIE1ha2UgYSBuZXcgMkQgdW5pdCB2ZWN0b3IgZnJvbSBhbiBhbmdsZVxuICAgKlxuICAgKiBAbWV0aG9kIGZyb21BbmdsZVxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgYW5nbGUgdGhlIGRlc2lyZWQgYW5nbGVcbiAgICogQHJldHVybiB7VmVjdG9yfSAgICAgICB0aGUgbmV3IFZlY3RvciBvYmplY3RcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdj5cbiAgICogPGNvZGU+XG4gICAqIGZ1bmN0aW9uIGRyYXcoKSB7XG4gICAqICAgYmFja2dyb3VuZCAoMjAwKTtcbiAgICpcbiAgICogICAvLyBDcmVhdGUgYSB2YXJpYWJsZSwgcHJvcG9ydGlvbmFsIHRvIHRoZSBtb3VzZVgsXG4gICAqICAgLy8gdmFyeWluZyBmcm9tIDAtMzYwLCB0byByZXByZXNlbnQgYW4gYW5nbGUgaW4gZGVncmVlcy5cbiAgICogICBhbmdsZU1vZGUoREVHUkVFUyk7XG4gICAqICAgdmFyIG15RGVncmVlcyA9IG1hcChtb3VzZVgsIDAsd2lkdGgsIDAsMzYwKTtcbiAgICpcbiAgICogICAvLyBEaXNwbGF5IHRoYXQgdmFyaWFibGUgaW4gYW4gb25zY3JlZW4gdGV4dC5cbiAgICogICAvLyAoTm90ZSB0aGUgbmZjKCkgZnVuY3Rpb24gdG8gdHJ1bmNhdGUgYWRkaXRpb25hbCBkZWNpbWFsIHBsYWNlcyxcbiAgICogICAvLyBhbmQgdGhlIFwiXFx4QjBcIiBjaGFyYWN0ZXIgZm9yIHRoZSBkZWdyZWUgc3ltYm9sLilcbiAgICogICB2YXIgcmVhZG91dCA9IFwiYW5nbGUgPSBcIiArIG5mYyhteURlZ3JlZXMsMSwxKSArIFwiXFx4QjBcIlxuICAgKiAgIG5vU3Ryb2tlKCk7XG4gICAqICAgZmlsbCAoMCk7XG4gICAqICAgdGV4dCAocmVhZG91dCwgNSwgMTUpO1xuICAgKlxuICAgKiAgIC8vIENyZWF0ZSBhIFZlY3RvciB1c2luZyB0aGUgZnJvbUFuZ2xlIGZ1bmN0aW9uLFxuICAgKiAgIC8vIGFuZCBleHRyYWN0IGl0cyB4IGFuZCB5IGNvbXBvbmVudHMuXG4gICAqICAgdmFyIHYgPSBWZWN0b3IuZnJvbUFuZ2xlKHJhZGlhbnMobXlEZWdyZWVzKSk7XG4gICAqICAgdmFyIHZ4ID0gdi54O1xuICAgKiAgIHZhciB2eSA9IHYueTtcbiAgICpcbiAgICogICBwdXNoKCk7XG4gICAqICAgdHJhbnNsYXRlICh3aWR0aC8yLCBoZWlnaHQvMik7XG4gICAqICAgbm9GaWxsKCk7XG4gICAqICAgc3Ryb2tlICgxNTApO1xuICAgKiAgIGxpbmUgKDAsMCwgMzAsMCk7XG4gICAqICAgc3Ryb2tlICgwKTtcbiAgICogICBsaW5lICgwLDAsIDMwKnZ4LCAzMCp2eSk7XG4gICAqICAgcG9wKClcbiAgICogfVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLmZyb21BbmdsZSA9IGZ1bmN0aW9uKGFuZ2xlKSB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IoTWF0aC5jb3MoYW5nbGUpLE1hdGguc2luKGFuZ2xlKSwwKTtcbiAgfTtcblxuICAvKipcbiAgICogTWFrZSBhIG5ldyAyRCB1bml0IHZlY3RvciBmcm9tIGEgcmFuZG9tIGFuZ2xlXG4gICAqXG4gICAqIEBtZXRob2QgcmFuZG9tMkRcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSBuZXcgVmVjdG9yIG9iamVjdFxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gVmVjdG9yLnJhbmRvbTJEKCk7XG4gICAqIC8vIE1heSBtYWtlIHYncyBhdHRyaWJ1dGVzIHNvbWV0aGluZyBsaWtlOlxuICAgKiAvLyBbMC42MTU1NDYxNywgLTAuNTExOTU3NjUsIDAuMF0gb3JcbiAgICogLy8gWy0wLjQ2OTU4NDEsIC0wLjE0MzY2NzMxLCAwLjBdIG9yXG4gICAqIC8vIFswLjYwOTEwOTcsIC0wLjIyODA1Mjc4LCAwLjBdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucmFuZG9tMkQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFuZ2xlID0gTWF0aC5yYW5kb20oKSpNYXRoLlBJKjI7XG4gICAgcmV0dXJuIHRoaXMuZnJvbUFuZ2xlKGFuZ2xlKTtcbiAgfTtcblxuICAvKipcbiAgICogTWFrZSBhIG5ldyByYW5kb20gM0QgdW5pdCB2ZWN0b3IuXG4gICAqXG4gICAqIEBtZXRob2QgcmFuZG9tM0RcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSBuZXcgVmVjdG9yIG9iamVjdFxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gVmVjdG9yLnJhbmRvbTNEKCk7XG4gICAqIC8vIE1heSBtYWtlIHYncyBhdHRyaWJ1dGVzIHNvbWV0aGluZyBsaWtlOlxuICAgKiAvLyBbMC42MTU1NDYxNywgLTAuNTExOTU3NjUsIDAuNTk5MTY4XSBvclxuICAgKiAvLyBbLTAuNDY5NTg0MSwgLTAuMTQzNjY3MzEsIC0wLjg3MTEyMDJdIG9yXG4gICAqIC8vIFswLjYwOTEwOTcsIC0wLjIyODA1Mjc4LCAtMC43NTk1OTAyXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnJhbmRvbTNEID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbmdsZSA9IE1hdGgucmFuZG9tKCkqTWF0aC5QSSoyLFxuXHQgICAgdnogPSBNYXRoLnJhbmRvbSgpKjItMSxcbiAgICBcdHZ4ID0gTWF0aC5zcXJ0KDEtdnoqdnopKk1hdGguY29zKGFuZ2xlKSxcbiAgICBcdHZ5ID0gTWF0aC5zcXJ0KDEtdnoqdnopKk1hdGguc2luKGFuZ2xlKTtcblxuICAgIHJldHVybiBuZXcgVmVjdG9yKHZ4LHZ5LHZ6KTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBBZGRzIHR3byB2ZWN0b3JzIHRvZ2V0aGVyIGFuZCByZXR1cm5zIGEgbmV3IG9uZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYxIGEgVmVjdG9yIHRvIGFkZFxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYyIGEgVmVjdG9yIHRvIGFkZFxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHRhcmdldCBpZiB1bmRlZmluZWQgYSBuZXcgdmVjdG9yIHdpbGwgYmUgY3JlYXRlZFxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSByZXN1bHRpbmcgVmVjdG9yXG4gICAqXG4gICAqL1xuXG4gIFZlY3Rvci5hZGQgPSBmdW5jdGlvbiAodjEsIHYyLCB0YXJnZXQpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdjEuY29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuc2V0KHYxKTtcbiAgICB9XG4gICAgdGFyZ2V0LmFkZCh2Mik7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICAvKipcbiAgICogU3VidHJhY3RzIG9uZSBWZWN0b3IgZnJvbSBhbm90aGVyIGFuZCByZXR1cm5zIGEgbmV3IG9uZS4gIFRoZSBzZWNvbmRcbiAgICogdmVjdG9yICh2MikgaXMgc3VidHJhY3RlZCBmcm9tIHRoZSBmaXJzdCAodjEpLCByZXN1bHRpbmcgaW4gdjEtdjIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MSBhIFZlY3RvciB0byBzdWJ0cmFjdCBmcm9tXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjIgYSBWZWN0b3IgdG8gc3VidHJhY3RcbiAgICogQHBhcmFtICB7VmVjdG9yfSB0YXJnZXQgaWYgdW5kZWZpbmVkIGEgbmV3IHZlY3RvciB3aWxsIGJlIGNyZWF0ZWRcbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgcmVzdWx0aW5nIFZlY3RvclxuICAgKi9cblxuICBWZWN0b3Iuc3ViID0gZnVuY3Rpb24gKHYxLCB2MiwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IHYxLmNvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnNldCh2MSk7XG4gICAgfVxuICAgIHRhcmdldC5zdWIodjIpO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBhIHZlY3RvciBieSBhIHNjYWxhciBhbmQgcmV0dXJucyBhIG5ldyB2ZWN0b3IuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2IHRoZSBWZWN0b3IgdG8gbXVsdGlwbHlcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgbiB0aGUgc2NhbGFyXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdGFyZ2V0IGlmIHVuZGVmaW5lZCBhIG5ldyB2ZWN0b3Igd2lsbCBiZSBjcmVhdGVkXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gIHRoZSByZXN1bHRpbmcgbmV3IFZlY3RvclxuICAgKi9cbiAgVmVjdG9yLm11bHQgPSBmdW5jdGlvbiAodiwgbiwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IHYuY29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuc2V0KHYpO1xuICAgIH1cbiAgICB0YXJnZXQubXVsdChuKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBEaXZpZGVzIGEgdmVjdG9yIGJ5IGEgc2NhbGFyIGFuZCByZXR1cm5zIGEgbmV3IHZlY3Rvci5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYgdGhlIFZlY3RvciB0byBkaXZpZGVcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgbiB0aGUgc2NhbGFyXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdGFyZ2V0IGlmIHVuZGVmaW5lZCBhIG5ldyB2ZWN0b3Igd2lsbCBiZSBjcmVhdGVkXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIHJlc3VsdGluZyBuZXcgVmVjdG9yXG4gICAqL1xuICBWZWN0b3IuZGl2ID0gZnVuY3Rpb24gKHYsIG4sIHRhcmdldCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB2LmNvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnNldCh2KTtcbiAgICB9XG4gICAgdGFyZ2V0LmRpdihuKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjEgdGhlIGZpcnN0IFZlY3RvclxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYyIHRoZSBzZWNvbmQgVmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn0gICAgIHRoZSBkb3QgcHJvZHVjdFxuICAgKi9cbiAgVmVjdG9yLmRvdCA9IGZ1bmN0aW9uICh2MSwgdjIpIHtcbiAgICByZXR1cm4gdjEuZG90KHYyKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjdG9ycy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYxIHRoZSBmaXJzdCBWZWN0b3JcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MiB0aGUgc2Vjb25kIFZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICB0aGUgY3Jvc3MgcHJvZHVjdFxuICAgKi9cbiAgVmVjdG9yLmNyb3NzID0gZnVuY3Rpb24gKHYxLCB2Mikge1xuICAgIHJldHVybiB2MS5jcm9zcyh2Mik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIEV1Y2xpZGVhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHMgKGNvbnNpZGVyaW5nIGFcbiAgICogcG9pbnQgYXMgYSB2ZWN0b3Igb2JqZWN0KS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYxIHRoZSBmaXJzdCBWZWN0b3JcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MiB0aGUgc2Vjb25kIFZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICB0aGUgZGlzdGFuY2VcbiAgICovXG4gIFZlY3Rvci5kaXN0ID0gZnVuY3Rpb24gKHYxLHYyKSB7XG4gICAgcmV0dXJuIHYxLmRpc3QodjIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMaW5lYXIgaW50ZXJwb2xhdGUgYSB2ZWN0b3IgdG8gYW5vdGhlciB2ZWN0b3IgYW5kIHJldHVybiB0aGUgcmVzdWx0IGFzIGFcbiAgICogbmV3IHZlY3Rvci5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge1ZlY3Rvcn0gdjEgYSBzdGFydGluZyBWZWN0b3JcbiAgICogQHBhcmFtIHtWZWN0b3J9IHYyIHRoZSBWZWN0b3IgdG8gbGVycCB0b1xuICAgKiBAcGFyYW0ge051bWJlcn0gICAgICAgdGhlIGFtb3VudCBvZiBpbnRlcnBvbGF0aW9uOyBzb21lIHZhbHVlIGJldHdlZW4gMC4wXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAob2xkIHZlY3RvcikgYW5kIDEuMCAobmV3IHZlY3RvcikuIDAuMSBpcyB2ZXJ5IG5lYXJcbiAgICogICAgICAgICAgICAgICAgICAgICAgIHRoZSBuZXcgdmVjdG9yLiAwLjUgaXMgaGFsZndheSBpbiBiZXR3ZWVuLlxuICAgKi9cbiAgVmVjdG9yLmxlcnAgPSBmdW5jdGlvbiAodjEsIHYyLCBhbXQsIHRhcmdldCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB2MS5jb3B5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5zZXQodjEpO1xuICAgIH1cbiAgICB0YXJnZXQubGVycCh2MiwgYW10KTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIHRoZSBhbmdsZSAoaW4gcmFkaWFucykgYmV0d2VlbiB0d28gdmVjdG9ycy5cbiAgICogQG1ldGhvZCBhbmdsZUJldHdlZW5cbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYxIHRoZSB4LCB5LCBhbmQgeiBjb21wb25lbnRzIG9mIGEgVmVjdG9yXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjIgdGhlIHgsIHksIGFuZCB6IGNvbXBvbmVudHMgb2YgYSBWZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgICB0aGUgYW5nbGUgYmV0d2VlbiAoaW4gcmFkaWFucylcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMCwgMCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigwLCAxLCAwKTtcbiAgICpcbiAgICogdmFyIGFuZ2xlID0gVmVjdG9yLmFuZ2xlQmV0d2Vlbih2MSwgdjIpO1xuICAgKiAvLyBhbmdsZSBpcyBQSS8yXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IuYW5nbGVCZXR3ZWVuID0gZnVuY3Rpb24gKHYxLCB2Mikge1xuICAgIHJldHVybiBNYXRoLmFjb3ModjEuZG90KHYyKSAvICh2MS5tYWcoKSAqIHYyLm1hZygpKSk7XG4gIH07XG5cbiAgLy8gcmV0dXJuIFZlY3Rvcjtcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yO1xuLy8gfSk7XG4iLCJmdW5jdGlvbiBVdGlscyhjeCwgY2FudmFzKSB7XG4gIHJldHVybiB7XG4gICAgY3ggOiBjeCB8fCAnJyxcbiAgICBjYW52YXM6IGNhbnZhcyB8fCAnJyxcbiAgICBoYWxmWDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYW52YXMud2lkdGggLyAyO1xuICAgIH0sXG4gICAgaGFsZlk6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLmhlaWdodCAvIDI7XG4gICAgfSxcbiAgICByYW5nZTogZnVuY3Rpb24gKG1pbiwgbWF4KSB7XG4gICAgICBpZiAoIW1heCkge1xuICAgICAgICBtYXggPSBtaW47XG4gICAgICAgIG1pbiA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xuICAgIH0sXG4gICAgcmFuZ2U6IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgICB2YXIgcmFuZCA9IE1hdGgucmFuZG9tKCk7XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiByYW5kO1xuICAgICAgfSBlbHNlXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gcmFuZCAqIG1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtaW4gPiBtYXgpIHtcbiAgICAgICAgICB2YXIgdG1wID0gbWluO1xuICAgICAgICAgIG1pbiA9IG1heDtcbiAgICAgICAgICBtYXggPSB0bXA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmFuZCAqIChtYXgtbWluKSArIG1pbjtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIHRha2VuIGZyb20gdGhlIHA1LmpzIHByb2plY3RcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcHJvY2Vzc2luZy9wNS5qcy9ibG9iLzVjODFkNjU1ZjY4M2Y5MDQ1MmI4MGFiMjI1YTY3ZTQ0OTQ2M2ZmZjkvc3JjL21hdGgvY2FsY3VsYXRpb24uanMjTDM5NFxuICAgIG1hcDogZnVuY3Rpb24obiwgc3RhcnQxLCBzdG9wMSwgc3RhcnQyLCBzdG9wMikge1xuICAgICAgcmV0dXJuICgobi1zdGFydDEpLyhzdG9wMS1zdGFydDEpKSooc3RvcDItc3RhcnQyKStzdGFydDI7XG4gICAgfSxcblxuICAgIGdldE1vdXNlUG9zOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogZXZlbnQuY2xpZW50WCxcbiAgICAgICAgeTogZXZlbnQuY2xpZW50WVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmN4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICB9LFxuICAgIFc6IGNhbnZhcy53aWR0aCxcbiAgICBIOiBjYW52YXMuaGVpZ2h0LFxuICAgIEhXOiBjYW52YXMud2lkdGggLyAyLFxuICAgIEhIOiBjYW52YXMuaGVpZ2h0IC8gMixcbiAgICBlbGxpcHNlOiBmdW5jdGlvbih4LCB5LCByKSB7XG4gICAgICB0aGlzLmN4LmJlZ2luUGF0aCgpO1xuICAgICAgdGhpcy5jeC5hcmMoeCwgeSwgciwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgIHRoaXMuY3guZmlsbCgpO1xuICAgICAgdGhpcy5jeC5zdHJva2UoKTtcbiAgICB9LFxuICAgIGNvbnN0cmFpbjogZnVuY3Rpb24odmFsLCBtaW4sIG1heCkge1xuICAgICAgaWYgKHZhbCA+IG1heCkge1xuICAgICAgICByZXR1cm4gbWF4O1xuICAgICAgfSBlbHNlIGlmICh2YWwgPCBtaW4pIHtcbiAgICAgICAgcmV0dXJuIG1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN4LCBjYW52YXMpIHtcbiAgcmV0dXJuIG5ldyBVdGlscyhjeCwgY2FudmFzKTtcbn07XG4iXX0=
