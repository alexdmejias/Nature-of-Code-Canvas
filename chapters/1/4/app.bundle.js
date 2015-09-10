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
  mouseVec.mulS(0.5);

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8xLzQvYXBwLmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3V0aWwvc3VwcG9ydC9pc0J1ZmZlckJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIiwibm9kZV9tb2R1bGVzL3ZlY3RvcjJkL3NyYy9GbG9hdDMyVmVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL3ZlY3RvcjJkL3NyYy9PYmplY3RWZWN0b3IuanMiLCJub2RlX21vZHVsZXMvdmVjdG9yMmQvc3JjL1ZlYzJELmpzIiwibm9kZV9tb2R1bGVzL3ZlY3RvcjJkL3NyYy9WZWN0b3IuanMiLCJtb2R1bGVzL3A1VmVjdG9ycy5qcyIsIm1vZHVsZXMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMWtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1NkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKVxuICAsIGN4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgLCB1dGlscyA9IHJlcXVpcmUoJ3V0aWxzJykoY3gsIGNhbnZhcylcblx0LCBWZWN0b3IgPSByZXF1aXJlKCd2ZWN0b3IyZCcpXG47XG5cbnZhciBXSURUSCA9IGNhbnZhcy53aWR0aFxuICAsIEhFSUdIVCA9IGNhbnZhcy5oZWlnaHRcbjtcblxudmFyIGNlbnRlclZlY1xuXHQsIG1vdXNlVmVjXG5cdCwgbW91c2VQb3Ncblx0LCB4UGFubmluZyA9IFdJRFRIIC8gMlxuXHQsIHlQYW5uaW5nID0gSEVJR0hUIC8gMlxuO1xuXG5mdW5jdGlvbiBzZXR1cCgpIHtcbiAgY29uc29sZS5sb2coJ3NldHVwJyk7XG5cdG1vdXNlUG9zID0ge3g6IDAsIHk6IDB9O1xuXHRjZW50ZXJWZWMgPSBuZXcgVmVjdG9yLk9iamVjdFZlY3Rvcih4UGFubmluZywgeVBhbm5pbmcpO1xuXHRtb3VzZVZlYyA9IG5ldyBWZWN0b3IuT2JqZWN0VmVjdG9yKDAsIDApO1xufVxuXG5mdW5jdGlvbiBkcmF3KCkge1xuXHR1dGlscy5jbGVhcigpO1xuXG4gIG1vdXNlVmVjLnNldEF4ZXMobW91c2VQb3MueCwgbW91c2VQb3MueSk7XG5cbiAgbW91c2VWZWMuc3VidHJhY3QoY2VudGVyVmVjKTtcbiAgbW91c2VWZWMubXVsUygwLjUpO1xuXG4gIGN4LnRyYW5zbGF0ZSh4UGFubmluZywgeVBhbm5pbmcpO1xuXG5cdGN4LmJlZ2luUGF0aCgpO1xuXHRjeC5tb3ZlVG8oMCwgMCk7XG5cdGN4LmxpbmVUbyhtb3VzZVZlYy5nZXRYKCksIG1vdXNlVmVjLmdldFkoKSk7XG5cdGN4LnN0cm9rZSgpO1xuXG5cdGN4LnJlc2V0VHJhbnNmb3JtKCk7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG59XG5cbmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihldmVudCkge1xuXHRtb3VzZVBvcyA9IHV0aWxzLmdldE1vdXNlUG9zKGV2ZW50KTtcbn0pO1xuXG4oZnVuY3Rpb24oKSB7XG4gIHNldHVwKCk7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG59KCkpO1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpXG4gICwgVmVjdG9yID0gcmVxdWlyZSgnLi9WZWN0b3IuanMnKTtcblxuZnVuY3Rpb24gRmxvYXQzMlZlY3Rvcih4LCB5KSB7XG4gIGlmICh0aGlzIGluc3RhbmNlb2YgRmxvYXQzMlZlY3RvciA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IEZsb2F0MzJWZWN0b3IoeCwgeSk7XG4gIH1cblxuICB0aGlzLl9heGVzID0gbmV3IEZsb2F0MzJBcnJheSgyKTtcbiAgdGhpcy5fYXhlc1swXSA9IHg7XG4gIHRoaXMuX2F4ZXNbMV0gPSB5O1xufVxudXRpbC5pbmhlcml0cyhGbG9hdDMyVmVjdG9yLCBWZWN0b3IpO1xuXG5GbG9hdDMyVmVjdG9yLnByb3RvdHlwZS5jdG9yID0gRmxvYXQzMlZlY3RvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBGbG9hdDMyVmVjdG9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKVxuICAsIFZlY3RvciA9IHJlcXVpcmUoJy4vVmVjdG9yLmpzJyk7XG5cbmZ1bmN0aW9uIE9iamVjdFZlY3Rvcih4LCB5KSB7XG4gIGlmICh0aGlzIGluc3RhbmNlb2YgT2JqZWN0VmVjdG9yID09PSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgT2JqZWN0VmVjdG9yKHgsIHkpO1xuICB9XG5cbiAgdGhpcy5feCA9IHg7XG4gIHRoaXMuX3kgPSB5O1xufVxudXRpbC5pbmhlcml0cyhPYmplY3RWZWN0b3IsIFZlY3Rvcik7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3RWZWN0b3IucHJvdG90eXBlLCAneCcsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3g7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKHgpIHtcbiAgICB0aGlzLl94ID0geDtcbiAgfVxufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3RWZWN0b3IucHJvdG90eXBlLCAneScsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3k7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKHkpIHtcbiAgICB0aGlzLl95ID0geTtcbiAgfVxufSk7XG5cbk9iamVjdFZlY3Rvci5wcm90b3R5cGUuY3RvciA9IE9iamVjdFZlY3RvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3RWZWN0b3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBWZWN0b3IgPSByZXF1aXJlKCcuL1ZlY3Rvci5qcycpXG4gICwgRmxvYXQzMlZlY3RvciA9IHJlcXVpcmUoJy4vRmxvYXQzMlZlY3Rvci5qcycpXG4gICwgT2JqZWN0VmVjdG9yID0gcmVxdWlyZSgnLi9PYmplY3RWZWN0b3IuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEFycmF5VmVjdG9yOiBWZWN0b3IsXG4gIE9iamVjdFZlY3RvcjogT2JqZWN0VmVjdG9yLFxuICBGbG9hdDMyVmVjdG9yOiBGbG9hdDMyVmVjdG9yXG5cbiAgLy8gVE9ETzogQWRkIGluc3RhbmNlIG1ldGhvZHMgaW4gdGhlIGZ1dHVyZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBQcmltYXJ5IFZlY3RvciBjbGFzcy4gVXNlcyBBcnJheSB0eXBlIGZvciBheGlzIHN0b3JhZ2UuXG4gKiBAY2xhc3MgVmVjdG9yXG4gKiBAcGFyYW0ge051bWJlcn0geCBUaGUgeCBjb21wb25lbnQgb2YgdGhpcyBWZWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFRoZSB5IGNvbXBvbmVudCBvZiB0aGlzIFZlY3RvclxuICovXG5mdW5jdGlvbiBWZWN0b3IoeCwgeSkge1xuICBpZiAodGhpcyBpbnN0YW5jZW9mIFZlY3RvciA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IFZlY3Rvcih4LCB5KTtcbiAgfVxuXG4gIHRoaXMuX2F4ZXMgPSBbeCwgeV07XG59XG5tb2R1bGUuZXhwb3J0cyA9IFZlY3RvcjtcblxudmFyIHByZWNpc2lvbiA9IFtcbiAgMSxcbiAgMTAsXG4gIDEwMCxcbiAgMTAwMCxcbiAgMTAwMDAsXG4gIDEwMDAwMCxcbiAgMTAwMDAwMCxcbiAgMTAwMDAwMDAsXG4gIDEwMDAwMDAwMCxcbiAgMTAwMDAwMDAwMCxcbiAgMTAwMDAwMDAwMDBcbl07XG5cblZlY3Rvci5wcm90b3R5cGUgPSB7XG4gIGN0b3I6IFZlY3RvcixcblxuICAvKipcbiAgICogU2V0IGJvdGggeCBhbmQgeVxuICAgKiBAcGFyYW0geCAgIE5ldyB4IHZhbFxuICAgKiBAcGFyYW0geSAgIE5ldyB5IHZhbFxuICAgKi9cbiAgc2V0QXhlczogZnVuY3Rpb24oeCwgeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHggYXhpcy5cbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0WDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMueDtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIHggYXhpcy5cbiAgICovXG4gIHNldFg6IGZ1bmN0aW9uKHgpIHtcbiAgICB0aGlzLnggPSB4O1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICAvKipcbiAgICogR2V0dGVyIGZvciB5IGF4aXMuXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGdldFk6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnk7XG4gIH0sXG5cblxuICAvKipcbiAgICogU2V0dGVyIGZvciB5IGF4aXMuXG4gICAqL1xuICBzZXRZOiBmdW5jdGlvbih5KSB7XG4gICAgdGhpcy55ID0geTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFZpZXcgdmVjdG9yIGFzIGEgc3RyaW5nIHN1Y2ggYXMgXCJWZWMyRDogKDAsIDQpXCJcbiAgICogQHBhcmFtICAge0Jvb2xlYW59XG4gICAqIEByZXR1cm4gIHtTdHJpbmd9XG4gICAqL1xuICB0b1N0cmluZzogZnVuY3Rpb24ocm91bmQpIHtcbiAgICBpZiAocm91bmQpIHtcbiAgICAgIHJldHVybiAnKCcgKyBNYXRoLnJvdW5kKHRoaXMueCkgK1xuICAgICAgICAnLCAnICsgTWF0aC5yb3VuZCh0aGlzLnkpICsgJyknO1xuICAgIH1cbiAgICByZXR1cm4gJygnICsgdGhpcy54ICsgJywgJyArIHRoaXMueSArICcpJztcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgdmVjdG9yIGF4ZXMuXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cbiAgdG9BcnJheTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBBcnJheSh0aGlzLngsIHRoaXMueSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogUmV0dXJuIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHZlY3RvciBheGVzLlxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICB0b09iamVjdDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHRoaXMueCxcbiAgICAgIHk6IHRoaXMueVxuICAgIH07XG4gIH0sXG5cblxuICAvKipcbiAgICogQWRkIHRoZSBwcm92aWRlZCBWZWN0b3IgdG8gdGhpcyBvbmUuXG4gICAqIEBwYXJhbSB7VmVjdG9yfSB2ZWNcbiAgICovXG4gIGFkZDogZnVuY3Rpb24odmVjKSB7XG4gICAgdGhpcy54ICs9IHZlYy54O1xuICAgIHRoaXMueSArPSB2ZWMueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBTdWJ0cmFjdCB0aGUgcHJvdmlkZWQgdmVjdG9yIGZyb20gdGhpcyBvbmUuXG4gICAqIEBwYXJhbSB7VmVjdG9yfSB2ZWNcbiAgICovXG4gIHN1YnRyYWN0OiBmdW5jdGlvbih2ZWMpIHtcbiAgICB0aGlzLnggLT0gdmVjLng7XG4gICAgdGhpcy55IC09IHZlYy55O1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIENoZWNrIGlzIHRoZSB2ZWN0b3IgcHJvdmlkZWQgZXF1YWwgdG8gdGhpcyBvbmUuXG4gICAqIEBwYXJhbSAgIHtWZWMyRH0gICB2ZWNcbiAgICogQHJldHVybiAge0Jvb2xlYW59XG4gICAqL1xuICBlcXVhbHM6IGZ1bmN0aW9uKHZlYykge1xuICAgIHJldHVybiAodmVjLnggPT0gdGhpcy54ICYmIHZlYy55ID09IHRoaXMueSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogTXVsdGlwbHkgdGhpcyB2ZWN0b3IgYnkgdGhlIHByb3ZpZGVkIHZlY3Rvci5cbiAgICogQHBhcmFtIHtWZWN0b3J9IHZlY1xuICAgKi9cbiAgbXVsdGlwbHlCeVZlY3RvcjogZnVuY3Rpb24odmVjKSB7XG4gICAgdGhpcy54ICo9IHZlYy54O1xuICAgIHRoaXMueSAqPSB2ZWMueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgbXVsVjogZnVuY3Rpb24odikge1xuICAgIHJldHVybiB0aGlzLm11bHRpcGx5QnlWZWN0b3Iodik7XG4gIH0sXG5cblxuICAvKipcbiAgICogTXVsdGlwbHkgdGhpcyB2ZWN0b3IgYnkgdGhlIHByb3ZpZGVkIHZlY3Rvci5cbiAgICogQHBhcmFtIHtWZWN0b3J9IHZlY1xuICAgKi9cbiAgZGl2aWRlQnlWZWN0b3I6IGZ1bmN0aW9uKHZlYykge1xuICAgIHRoaXMueCAvPSB2ZWMueDtcbiAgICB0aGlzLnkgLz0gdmVjLnk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGRpdlY6IGZ1bmN0aW9uKHYpIHtcbiAgICByZXR1cm4gdGhpcy5kaXZpZGVCeVZlY3Rvcih2KTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBNdWx0aXBseSB0aGlzIHZlY3RvciBieSB0aGUgcHJvdmlkZWQgbnVtYmVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gICAqL1xuICBtdWx0aXBseUJ5U2NhbGFyOiBmdW5jdGlvbihuKSB7XG4gICAgdGhpcy54ICo9IG47XG4gICAgdGhpcy55ICo9IG47XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgbXVsUzogZnVuY3Rpb24obikge1xuICAgIHJldHVybiB0aGlzLm11bHRpcGx5QnlTY2FsYXIobik7XG4gIH0sXG5cblxuICAvKipcbiAgICogRGl2aXZlIHRoaXMgdmVjdG9yIGJ5IHRoZSBwcm92aWRlZCBudW1iZXJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICovXG4gIGRpdmlkZUJ5U2NhbGFyOiBmdW5jdGlvbihuKSB7XG4gICAgdGhpcy54IC89IG47XG4gICAgdGhpcy55IC89IG47XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGRpdlM6IGZ1bmN0aW9uKG4pIHtcbiAgICByZXR1cm4gdGhpcy5kaXZpZGVCeVNjYWxhcihuKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBOb3JtYWxpc2UgdGhpcyB2ZWN0b3IuIERpcmVjdGx5IGFmZmVjdHMgdGhpcyB2ZWN0b3IuXG4gICAqIFVzZSBWZWMyRC5ub3JtYWxpc2UodmVjdG9yKSB0byBjcmVhdGUgYSBub3JtYWxpc2VkIGNsb25lIG9mIHRoaXMuXG4gICAqL1xuICBub3JtYWxpc2U6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRpdmlkZUJ5U2NhbGFyKHRoaXMubWFnbml0dWRlKCkpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEZvciBBbWVyaWNhbiBzcGVsbGluZy5cbiAgICogU2FtZSBhcyB1bml0L25vcm1hbGlzZSBmdW5jdGlvbi5cbiAgICovXG4gIG5vcm1hbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubm9ybWFsaXNlKCk7XG4gIH0sXG5cblxuICAvKipcbiAgICogVGhlIHNhbWUgYXMgbm9ybWFsaXNlLlxuICAgKi9cbiAgdW5pdDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubm9ybWFsaXNlKCk7XG4gIH0sXG5cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBtYWduaXR1ZGUgKGxlbmd0aCkgb2YgdGhpcyB2ZWN0b3IuXG4gICAqIEByZXR1cm4gIHtOdW1iZXJ9XG4gICAqL1xuICBtYWduaXR1ZGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gdGhpcy54LFxuICAgICAgeSA9IHRoaXMueTtcblxuICAgIHJldHVybiBNYXRoLnNxcnQoKHggKiB4KSArICh5ICogeSkpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbWFnbml0dWRlIChsZW5ndGgpIG9mIHRoaXMgdmVjdG9yLlxuICAgKiBAcmV0dXJuICB7TnVtYmVyfVxuICAgKi9cbiAgbGVuZ3RoOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYWduaXR1ZGUoKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHNxdXJlZCBsZW5ndGggb2YgYSB2ZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgbGVuZ3RoU3E6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB4ID0gdGhpcy54LFxuICAgICAgeSA9IHRoaXMueTtcblxuICAgIHJldHVybiAoeCAqIHgpICsgKHkgKiB5KTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRvdCBwcm9kdWN0IG9mIHRoaXMgdmVjdG9yIGJ5IGFub3RoZXIuXG4gICAqIEBwYXJhbSAgIHtWZWN0b3J9IHZlY1xuICAgKiBAcmV0dXJuICB7TnVtYmVyfVxuICAgKi9cbiAgZG90OiBmdW5jdGlvbih2ZWMpIHtcbiAgICByZXR1cm4gKHZlYy54ICogdGhpcy54KSArICh2ZWMueSAqIHRoaXMueSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogR2V0IHRoZSBjcm9zcyBwcm9kdWN0IG9mIHRoaXMgdmVjdG9yIGJ5IGFub3RoZXIuXG4gICAqIEBwYXJhbSAgIHtWZWN0b3J9IHZlY1xuICAgKiBAcmV0dXJuICB7TnVtYmVyfVxuICAgKi9cbiAgY3Jvc3M6IGZ1bmN0aW9uKHZlYykge1xuICAgIHJldHVybiAoKHRoaXMueCAqIHZlYy55KSAtICh0aGlzLnkgKiB2ZWMueCkpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFJldmVyc2VzIHRoaXMgdmVjdG9yLlxuICAgKi9cbiAgcmV2ZXJzZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy54ID0gLXRoaXMueDtcbiAgICB0aGlzLnkgPSAtdGhpcy55O1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIENvbnZlcnQgdmVjdG9yIHRvIGFic29sdXRlIHZhbHVlcy5cbiAgICogQHBhcmFtICAge1ZlY3Rvcn0gdmVjXG4gICAqL1xuICBhYnM6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMueCA9IE1hdGguYWJzKHRoaXMueCk7XG4gICAgdGhpcy55ID0gTWF0aC5hYnModGhpcy55KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGxpbWl0OiBmdW5jdGlvbihtYXgpIHtcbiAgICBpZiAodGhpcy5tYWduaXR1ZGUoKSA+IG1heCkge1xuXHRcdCAgdGhpcy5ub3JtYWxpemUoKTtcblx0XHQgIHRoaXMubXVsUyhtYXgpO1xuXHQgIH1cbiAgfSxcblxuXG4gIC8qKlxuICAgKiBaZXJvZXMgdGhlIHZlY3RvclxuICAgKiBAcmV0dXJuICB7VmVjdG9yfVxuICAgKi9cbiAgemVybzogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy54ID0gdGhpcy55ID0gMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBEaXN0YW5jZSBiZXR3ZWVuIHRoaXMgdmVjdG9yIGFuZCBhbm90aGVyLlxuICAgKiBAcGFyYW0ge1ZlY3Rvcn0gdlxuICAgKi9cbiAgZGlzdGFuY2U6IGZ1bmN0aW9uICh2KSB7XG4gICAgdmFyIHggPSB0aGlzLnggLSB2Lng7XG4gICAgdmFyIHkgPSB0aGlzLnkgLSB2Lnk7XG5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ICogeCkgKyAoeSAqIHkpKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBSb3RhdGUgdGhlIHZldG9yIGJ5IHByb3ZpZGVkIHJhZGlhbnMuXG4gICAqIEBwYXJhbSAgIHtOdW1iZXJ9ICByYWRzXG4gICAqIEByZXR1cm4gIHtWZWN0b3J9XG4gICAqL1xuICByb3RhdGU6IGZ1bmN0aW9uKHJhZHMpIHtcbiAgICB2YXIgY29zID0gTWF0aC5jb3MocmFkcyksXG4gICAgICBzaW4gPSBNYXRoLnNpbihyYWRzKTtcblxuICAgIHZhciBveCA9IHRoaXMueCxcbiAgICAgIG95ID0gdGhpcy55O1xuXG4gICAgdGhpcy54ID0gb3ggKiBjb3MgLSBveSAqIHNpbjtcbiAgICB0aGlzLnkgPSBveCAqIHNpbiArIG95ICogY29zO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICAvKipcbiAgICogUm91bmQgdGhpcyB2ZWN0b3IgdG8gbiBkZWNpbWFsIHBsYWNlc1xuICAgKiBAcGFyYW0ge051bWJlcn0gIG5cbiAgICovXG4gIHJvdW5kOiBmdW5jdGlvbihuKSB7XG4gICAgLy8gRGVmYXVsdCBpcyB0d28gZGVjaW1hbHNcbiAgICBuID0gbiB8fCAyO1xuXG4gICAgdmFyIHAgPSBwcmVjaXNpb25bbl07XG5cbiAgICAvLyBUaGlzIHBlcmZvcm1zIHdhYWF5IGJldHRlciB0aGFuIHRvRml4ZWQgYW5kIGdpdmUgRmxvYXQzMiB0aGUgZWRnZSBhZ2Fpbi5cbiAgICAvLyBodHRwOi8vd3d3LmR5bmFtaWNndXJ1LmNvbS9qYXZhc2NyaXB0L3JvdW5kLW51bWJlcnMtd2l0aC1wcmVjaXNpb24vXG4gICAgdGhpcy54ID0gKCgwLjUgKyAodGhpcy54ICogcCkpIDw8IDApIC8gcDtcbiAgICB0aGlzLnkgPSAoKDAuNSArICh0aGlzLnkgKiBwKSkgPDwgMCkgLyBwO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICAvKipcbiAgICogQ3JlYXRlIGEgY29weSBvZiB0aGlzIHZlY3Rvci5cbiAgICogQHJldHVybiB7VmVjdG9yfVxuICAgKi9cbiAgY2xvbmU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jdG9yKHRoaXMueCwgdGhpcy55KTtcbiAgfVxufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFZlY3Rvci5wcm90b3R5cGUsICd4Jywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXhlc1swXTtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAoeCkge1xuICAgIHRoaXMuX2F4ZXNbMF0gPSB4O1xuICB9XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFZlY3Rvci5wcm90b3R5cGUsICd5Jywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXhlc1sxXTtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAoeSkge1xuICAgIHRoaXMuX2F4ZXNbMV0gPSB5O1xuICB9XG59KTtcbiIsIiAgLyoqXG4gICAqIEEgY2xhc3MgdG8gZGVzY3JpYmUgYSB0d28gb3IgdGhyZWUgZGltZW5zaW9uYWwgdmVjdG9yLCBzcGVjaWZpY2FsbHlcbiAgICogYSBFdWNsaWRlYW4gKGFsc28ga25vd24gYXMgZ2VvbWV0cmljKSB2ZWN0b3IuIEEgdmVjdG9yIGlzIGFuIGVudGl0eVxuICAgKiB0aGF0IGhhcyBib3RoIG1hZ25pdHVkZSBhbmQgZGlyZWN0aW9uLiBUaGUgZGF0YXR5cGUsIGhvd2V2ZXIsIHN0b3Jlc1xuICAgKiB0aGUgY29tcG9uZW50cyBvZiB0aGUgdmVjdG9yICh4LHkgZm9yIDJELCBhbmQgeCx5LHogZm9yIDNEKS4gVGhlIG1hZ25pdHVkZVxuICAgKiBhbmQgZGlyZWN0aW9uIGNhbiBiZSBhY2Nlc3NlZCB2aWEgdGhlIG1ldGhvZHMgbWFnKCkgYW5kIGhlYWRpbmcoKS4gSW4gbWFueVxuICAgKiBvZiB0aGUgcDUuanMgZXhhbXBsZXMsIHlvdSB3aWxsIHNlZSBWZWN0b3IgdXNlZCB0byBkZXNjcmliZSBhIHBvc2l0aW9uLFxuICAgKiB2ZWxvY2l0eSwgb3IgYWNjZWxlcmF0aW9uLiBGb3IgZXhhbXBsZSwgaWYgeW91IGNvbnNpZGVyIGEgcmVjdGFuZ2xlIG1vdmluZ1xuICAgKiBhY3Jvc3MgdGhlIHNjcmVlbiwgYXQgYW55IGdpdmVuIGluc3RhbnQgaXQgaGFzIGEgcG9zaXRpb24gKGEgdmVjdG9yIHRoYXRcbiAgICogcG9pbnRzIGZyb20gdGhlIG9yaWdpbiB0byBpdHMgbG9jYXRpb24pLCBhIHZlbG9jaXR5ICh0aGUgcmF0ZSBhdCB3aGljaCB0aGVcbiAgICogb2JqZWN0J3MgcG9zaXRpb24gY2hhbmdlcyBwZXIgdGltZSB1bml0LCBleHByZXNzZWQgYXMgYSB2ZWN0b3IpLCBhbmRcbiAgICogYWNjZWxlcmF0aW9uICh0aGUgcmF0ZSBhdCB3aGljaCB0aGUgb2JqZWN0J3MgdmVsb2NpdHkgY2hhbmdlcyBwZXIgdGltZVxuICAgKiB1bml0LCBleHByZXNzZWQgYXMgYSB2ZWN0b3IpLiBTaW5jZSB2ZWN0b3JzIHJlcHJlc2VudCBncm91cGluZ3Mgb2YgdmFsdWVzLFxuICAgKiB3ZSBjYW5ub3Qgc2ltcGx5IHVzZSB0cmFkaXRpb25hbCBhZGRpdGlvbi9tdWx0aXBsaWNhdGlvbi9ldGMuIEluc3RlYWQsXG4gICAqIHdlJ2xsIG5lZWQgdG8gZG8gc29tZSBcInZlY3RvclwiIG1hdGgsIHdoaWNoIGlzIG1hZGUgZWFzeSBieSB0aGUgbWV0aG9kc1xuICAgKiBpbnNpZGUgdGhlIFZlY3RvciBjbGFzcy5cbiAgICpcbiAgICogQGNsYXNzIFZlY3RvclxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt4XSB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbeV0geSBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcGFyYW0ge051bWJlcn0gW3pdIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3Rvcig0MCwgNTApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoNDAsIDUwKTtcbiAgICpcbiAgICogZWxsaXBzZSh2MS54LCB2MS55LCA1MCwgNTApO1xuICAgKiBlbGxpcHNlKHYyLngsIHYyLnksIDUwLCA1MCk7XG4gICAqIHYxLmFkZCh2Mik7XG4gICAqIGVsbGlwc2UodjEueCwgdjEueSwgNTAsIDUwKTtcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIHZhciBWZWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0gfHwgMDtcblx0XHR0aGlzLnkgPSBhcmd1bWVudHNbMV0gfHwgMDtcblx0XHR0aGlzLnogPSBhcmd1bWVudHNbMl0gfHwgMDtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZlY3RvciB2IGJ5IGNhbGxpbmcgU3RyaW5nKHYpXG4gICAqIG9yIHYudG9TdHJpbmcoKS4gVGhpcyBtZXRob2QgaXMgdXNlZnVsIGZvciBsb2dnaW5nIHZlY3RvcnMgaW4gdGhlXG4gICAqIGNvbnNvbGUuXG4gICAqIEBtZXRob2QgIHRvU3RyaW5nXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3MgPSBcIm5vcmVuZGVyXCI+PGNvZGU+XG4gICAqIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgKiAgIHZhciB2ID0gY3JlYXRlVmVjdG9yKDIwLDMwKTtcbiAgICogICBwcmludChTdHJpbmcodikpOyAvLyBwcmludHMgXCJWZWN0b3IgT2JqZWN0IDogWzIwLCAzMCwgMF1cIlxuICAgKiB9XG4gICAqIDwvZGl2PjwvY29kZT5cbiAgICpcbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJ1ZlY3RvciBPYmplY3QgOiBbJysgdGhpcy54ICsnLCAnKyB0aGlzLnkgKycsICcrIHRoaXMueiArICddJztcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgeCwgeSwgYW5kIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3IgdXNpbmcgdHdvIG9yIHRocmVlIHNlcGFyYXRlXG4gICAqIHZhcmlhYmxlcywgdGhlIGRhdGEgZnJvbSBhIFZlY3Rvciwgb3IgdGhlIHZhbHVlcyBmcm9tIGEgZmxvYXQgYXJyYXkuXG4gICAqIEBtZXRob2Qgc2V0XG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfFZlY3RvcnxBcnJheX0gW3hdIHRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIG9yIGFcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVjdG9yIG9yIGFuIEFycmF5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3ldIHRoZSB5IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3pdIHRoZSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAqICAgIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiAgICB2LnNldCg0LDUsNik7IC8vIFNldHMgdmVjdG9yIHRvIFs0LCA1LCA2XVxuICAgKlxuICAgKiAgICB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMCwgMCwgMCk7XG4gICAqICAgIHZhciBhcnIgPSBbMSwgMiwgM107XG4gICAqICAgIHYxLnNldChhcnIpOyAvLyBTZXRzIHZlY3RvciB0byBbMSwgMiwgM11cbiAgICogfVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yKSB7XG4gICAgICB0aGlzLnggPSB4LnggfHwgMDtcbiAgICAgIHRoaXMueSA9IHgueSB8fCAwO1xuICAgICAgdGhpcy56ID0geC56IHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgdGhpcy54ID0geFswXSB8fCAwO1xuICAgICAgdGhpcy55ID0geFsxXSB8fCAwO1xuICAgICAgdGhpcy56ID0geFsyXSB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRoaXMueCA9IHggfHwgMDtcbiAgICB0aGlzLnkgPSB5IHx8IDA7XG4gICAgdGhpcy56ID0geiB8fCAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgY29weSBvZiB0aGUgdmVjdG9yLCByZXR1cm5zIGEgVmVjdG9yIG9iamVjdC5cbiAgICpcbiAgICogQG1ldGhvZCBjb3B5XG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIGNvcHkgb2YgdGhlIFZlY3RvciBvYmplY3RcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHZhciB2MiA9IHYuY29weSgpO1xuICAgKiBwcmludCh2MS54ID09IHYyLnggJiYgdjEueSA9PSB2Mi55ICYmIHYxLnogPT0gdjIueik7XG4gICAqIC8vIFByaW50cyBcInRydWVcIlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCx0aGlzLnksdGhpcy56KTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkcyB4LCB5LCBhbmQgeiBjb21wb25lbnRzIHRvIGEgdmVjdG9yLCBhZGRzIG9uZSB2ZWN0b3IgdG8gYW5vdGhlciwgb3JcbiAgICogYWRkcyB0d28gaW5kZXBlbmRlbnQgdmVjdG9ycyB0b2dldGhlci4gVGhlIHZlcnNpb24gb2YgdGhlIG1ldGhvZCB0aGF0IGFkZHNcbiAgICogdHdvIHZlY3RvcnMgdG9nZXRoZXIgaXMgYSBzdGF0aWMgbWV0aG9kIGFuZCByZXR1cm5zIGEgVmVjdG9yLCB0aGUgb3RoZXJzXG4gICAqIGFjdHMgZGlyZWN0bHkgb24gdGhlIHZlY3Rvci4gU2VlIHRoZSBleGFtcGxlcyBmb3IgbW9yZSBjb250ZXh0LlxuICAgKlxuICAgKiBAbWV0aG9kIGFkZFxuICAgKiBAY2hhaW5hYmxlXG4gICAqIEBwYXJhbSAge051bWJlcnxWZWN0b3J8QXJyYXl9IHggICB0aGUgeCBjb21wb25lbnQgb2YgdGhlIHZlY3RvciB0byBiZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWQgb3IgYSBWZWN0b3Igb3IgYW4gQXJyYXlcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3ldIHRoZSB5IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIHRvIGJlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRlZFxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbel0gdGhlIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3IgdG8gYmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgICAgICAgICAgICAgICB0aGUgVmVjdG9yIG9iamVjdC5cbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdi5hZGQoNCw1LDYpO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG8gWzUsIDcsIDldXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigyLCAzLCA0KTtcbiAgICpcbiAgICogdmFyIHYzID0gVmVjdG9yLmFkZCh2MSwgdjIpO1xuICAgKiAvLyB2MyBoYXMgY29tcG9uZW50cyBbMywgNSwgN11cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuICAgICAgdGhpcy54ICs9IHgueCB8fCAwO1xuICAgICAgdGhpcy55ICs9IHgueSB8fCAwO1xuICAgICAgdGhpcy56ICs9IHgueiB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHRoaXMueCArPSB4WzBdIHx8IDA7XG4gICAgICB0aGlzLnkgKz0geFsxXSB8fCAwO1xuICAgICAgdGhpcy56ICs9IHhbMl0gfHwgMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0aGlzLnggKz0geCB8fCAwO1xuICAgIHRoaXMueSArPSB5IHx8IDA7XG4gICAgdGhpcy56ICs9IHogfHwgMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogU3VidHJhY3RzIHgsIHksIGFuZCB6IGNvbXBvbmVudHMgZnJvbSBhIHZlY3Rvciwgc3VidHJhY3RzIG9uZSB2ZWN0b3IgZnJvbVxuICAgKiBhbm90aGVyLCBvciBzdWJ0cmFjdHMgdHdvIGluZGVwZW5kZW50IHZlY3RvcnMuIFRoZSB2ZXJzaW9uIG9mIHRoZSBtZXRob2RcbiAgICogdGhhdCBzdWJ0cmFjdHMgdHdvIHZlY3RvcnMgaXMgYSBzdGF0aWMgbWV0aG9kIGFuZCByZXR1cm5zIGEgVmVjdG9yLCB0aGVcbiAgICogb3RoZXIgYWN0cyBkaXJlY3RseSBvbiB0aGUgdmVjdG9yLiBTZWUgdGhlIGV4YW1wbGVzIGZvciBtb3JlIGNvbnRleHQuXG4gICAqXG4gICAqIEBtZXRob2Qgc3ViXG4gICAqIEBjaGFpbmFibGVcbiAgICogQHBhcmFtICB7TnVtYmVyfFZlY3RvcnxBcnJheX0geCAgIHRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIG9yIGFcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlY3RvciBvciBhbiBBcnJheVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbeV0gdGhlIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3pdIHRoZSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgICAgICAgICAgICAgICBWZWN0b3Igb2JqZWN0LlxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDQsIDUsIDYpO1xuICAgKiB2LnN1YigxLCAxLCAxKTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvIFszLCA0LCA1XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDIsIDMsIDQpO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqXG4gICAqIHZhciB2MyA9IFZlY3Rvci5zdWIodjEsIHYyKTtcbiAgICogLy8gdjMgaGFzIGNvbXBuZW50cyBbMSwgMSwgMV1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuICAgICAgdGhpcy54IC09IHgueCB8fCAwO1xuICAgICAgdGhpcy55IC09IHgueSB8fCAwO1xuICAgICAgdGhpcy56IC09IHgueiB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHRoaXMueCAtPSB4WzBdIHx8IDA7XG4gICAgICB0aGlzLnkgLT0geFsxXSB8fCAwO1xuICAgICAgdGhpcy56IC09IHhbMl0gfHwgMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0aGlzLnggLT0geCB8fCAwO1xuICAgIHRoaXMueSAtPSB5IHx8IDA7XG4gICAgdGhpcy56IC09IHogfHwgMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogTXVsdGlwbHkgdGhlIHZlY3RvciBieSBhIHNjYWxhci4gVGhlIHN0YXRpYyB2ZXJzaW9uIG9mIHRoaXMgbWV0aG9kXG4gICAqIGNyZWF0ZXMgYSBuZXcgVmVjdG9yIHdoaWxlIHRoZSBub24gc3RhdGljIHZlcnNpb24gYWN0cyBvbiB0aGUgdmVjdG9yXG4gICAqIGRpcmVjdGx5LiBTZWUgdGhlIGV4YW1wbGVzIGZvciBtb3JlIGNvbnRleHQuXG4gICAqXG4gICAqIEBtZXRob2QgbXVsdFxuICAgKiBAY2hhaW5hYmxlXG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgbiB0aGUgbnVtYmVyIHRvIG11bHRpcGx5IHdpdGggdGhlIHZlY3RvclxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IGEgcmVmZXJlbmNlIHRvIHRoZSBWZWN0b3Igb2JqZWN0IChhbGxvdyBjaGFpbmluZylcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdi5tdWx0KDIpO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG8gWzIsIDQsIDZdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHZhciB2MiA9IFZlY3Rvci5tdWx0KHYxLCAyKTtcbiAgICogLy8gdjIgaGFzIGNvbXBuZW50cyBbMiwgNCwgNl1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUubXVsdCA9IGZ1bmN0aW9uIChuKSB7XG4gICAgdGhpcy54ICo9IG4gfHwgMDtcbiAgICB0aGlzLnkgKj0gbiB8fCAwO1xuICAgIHRoaXMueiAqPSBuIHx8IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpdmlkZSB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLiBUaGUgc3RhdGljIHZlcnNpb24gb2YgdGhpcyBtZXRob2QgY3JlYXRlcyBhXG4gICAqIG5ldyBWZWN0b3Igd2hpbGUgdGhlIG5vbiBzdGF0aWMgdmVyc2lvbiBhY3RzIG9uIHRoZSB2ZWN0b3IgZGlyZWN0bHkuXG4gICAqIFNlZSB0aGUgZXhhbXBsZXMgZm9yIG1vcmUgY29udGV4dC5cbiAgICpcbiAgICogQG1ldGhvZCBkaXZcbiAgICogQGNoYWluYWJsZVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9ICAgIG4gdGhlIG51bWJlciB0byBkaXZpZGUgdGhlIHZlY3RvciBieVxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IGEgcmVmZXJlbmNlIHRvIHRoZSBWZWN0b3Igb2JqZWN0IChhbGxvdyBjaGFpbmluZylcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3Rvcig2LCA0LCAyKTtcbiAgICogdi5kaXYoMik7IC8vdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvIFszLCAyLCAxXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxICA9IGNyZWF0ZVZlY3Rvcig2LCA0LCAyKTtcbiAgICogdmFyIHYyID0gVmVjdG9yLmRpdih2LCAyKTtcbiAgICogLy8gdjIgaGFzIGNvbXBuZW50cyBbMywgMiwgMV1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuZGl2ID0gZnVuY3Rpb24gKG4pIHtcbiAgICB0aGlzLnggLz0gbjtcbiAgICB0aGlzLnkgLz0gbjtcbiAgICB0aGlzLnogLz0gbjtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgbWFnbml0dWRlIChsZW5ndGgpIG9mIHRoZSB2ZWN0b3IgYW5kIHJldHVybnMgdGhlIHJlc3VsdCBhc1xuICAgKiBhIGZsb2F0ICh0aGlzIGlzIHNpbXBseSB0aGUgZXF1YXRpb24gc3FydCh4KnggKyB5KnkgKyB6KnopLilcbiAgICpcbiAgICogQG1ldGhvZCBtYWdcbiAgICogQHJldHVybiB7TnVtYmVyfSBtYWduaXR1ZGUgb2YgdGhlIHZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDIwLjAsIDMwLjAsIDQwLjApO1xuICAgKiB2YXIgbSA9IHYubWFnKDEwKTtcbiAgICogcHJpbnQobSk7IC8vIFByaW50cyBcIjUzLjg1MTY0ODA3MTM0NTA0XCJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUubWFnID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5tYWdTcSgpKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgc3F1YXJlZCBtYWduaXR1ZGUgb2YgdGhlIHZlY3RvciBhbmQgcmV0dXJucyB0aGUgcmVzdWx0XG4gICAqIGFzIGEgZmxvYXQgKHRoaXMgaXMgc2ltcGx5IHRoZSBlcXVhdGlvbiA8ZW0+KHgqeCArIHkqeSArIHoqeik8L2VtPi4pXG4gICAqIEZhc3RlciBpZiB0aGUgcmVhbCBsZW5ndGggaXMgbm90IHJlcXVpcmVkIGluIHRoZVxuICAgKiBjYXNlIG9mIGNvbXBhcmluZyB2ZWN0b3JzLCBldGMuXG4gICAqXG4gICAqIEBtZXRob2QgbWFnU3FcbiAgICogQHJldHVybiB7bnVtYmVyfSBzcXVhcmVkIG1hZ25pdHVkZSBvZiB0aGUgdmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoNiwgNCwgMik7XG4gICAqIHByaW50KHYxLm1hZ1NxKCkpOyAvLyBQcmludHMgXCI1NlwiXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLm1hZ1NxID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB4ID0gdGhpcy54LCB5ID0gdGhpcy55LCB6ID0gdGhpcy56O1xuICAgIHJldHVybiAoeCAqIHggKyB5ICogeSArIHogKiB6KTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuIFRoZSB2ZXJzaW9uIG9mIHRoZSBtZXRob2RcbiAgICogdGhhdCBjb21wdXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIGluZGVwZW5kZW50IHZlY3RvcnMgaXMgYSBzdGF0aWNcbiAgICogbWV0aG9kLiBTZWUgdGhlIGV4YW1wbGVzIGZvciBtb3JlIGNvbnRleHQuXG4gICAqXG4gICAqXG4gICAqIEBtZXRob2QgZG90XG4gICAqIEBwYXJhbSAge051bWJlcnxWZWN0b3J9IHggICB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIG9yIGEgVmVjdG9yXG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgIFt5XSB5IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgIFt6XSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn0gICAgICAgICAgICAgICAgIHRoZSBkb3QgcHJvZHVjdFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDIsIDMsIDQpO1xuICAgKlxuICAgKiBwcmludCh2MS5kb3QodjIpKTsgLy8gUHJpbnRzIFwiMjBcIlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigzLCAyLCAxKTtcbiAgICogcHJpbnQgKFZlY3Rvci5kb3QodjEsIHYyKSk7IC8vIFByaW50cyBcIjEwXCJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuICAgICAgcmV0dXJuIHRoaXMuZG90KHgueCwgeC55LCB4LnopO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy54ICogKHggfHwgMCkgK1xuICAgICAgICAgICB0aGlzLnkgKiAoeSB8fCAwKSArXG4gICAgICAgICAgIHRoaXMueiAqICh6IHx8IDApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIGEgdmVjdG9yIGNvbXBvc2VkIG9mIHRoZSBjcm9zcyBwcm9kdWN0IGJldHdlZW5cbiAgICogdHdvIHZlY3RvcnMuIEJvdGggdGhlIHN0YXRpYyBhbmQgbm9uIHN0YXRpYyBtZXRob2RzIHJldHVybiBhIG5ldyBWZWN0b3IuXG4gICAqIFNlZSB0aGUgZXhhbXBsZXMgZm9yIG1vcmUgY29udGV4dC5cbiAgICpcbiAgICogQG1ldGhvZCBjcm9zc1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYgVmVjdG9yIHRvIGJlIGNyb3NzZWRcbiAgICogQHJldHVybiB7VmVjdG9yfSAgIFZlY3RvciBjb21wb3NlZCBvZiBjcm9zcyBwcm9kdWN0XG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqXG4gICAqIHYxLmNyb3NzKHYyKTsgLy8gdidzIGNvbXBvbmVudHMgYXJlIFswLCAwLCAwXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDAsIDApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMCwgMSwgMCk7XG4gICAqXG4gICAqIHZhciBjcm9zc1Byb2R1Y3QgPSBWZWN0b3IuY3Jvc3ModjEsIHYyKTtcbiAgICogLy8gY3Jvc3NQcm9kdWN0IGhhcyBjb21wb25lbnRzIFswLCAwLCAxXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uICh2KSB7XG4gICAgdmFyIHggPSB0aGlzLnkgKiB2LnogLSB0aGlzLnogKiB2Lnk7XG4gICAgdmFyIHkgPSB0aGlzLnogKiB2LnggLSB0aGlzLnggKiB2Lno7XG4gICAgdmFyIHogPSB0aGlzLnggKiB2LnkgLSB0aGlzLnkgKiB2Lng7XG5cblx0XHRyZXR1cm4gbmV3IFZlY3Rvcih4LHkseik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIEV1Y2xpZGVhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHMgKGNvbnNpZGVyaW5nIGFcbiAgICogcG9pbnQgYXMgYSB2ZWN0b3Igb2JqZWN0KS5cbiAgICpcbiAgICogQG1ldGhvZCBkaXN0XG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdiB0aGUgeCwgeSwgYW5kIHogY29vcmRpbmF0ZXMgb2YgYSBWZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgIHRoZSBkaXN0YW5jZVxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAwLCAwKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDAsIDEsIDApO1xuICAgKlxuICAgKiB2YXIgZGlzdGFuY2UgPSB2MS5kaXN0KHYyKTsgLy8gZGlzdGFuY2UgaXMgMS40MTQyLi4uXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMCwgMCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigwLCAxLCAwKTtcbiAgICpcbiAgICogdmFyIGRpc3RhbmNlID0gVmVjdG9yLmRpc3QodjEsdjIpO1xuICAgKiAvLyBkaXN0YW5jZSBpcyAxLjQxNDIuLi5cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuZGlzdCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgdmFyIGQgPSB2LmNvcHkoKS5zdWIodGhpcyk7XG4gICAgcmV0dXJuIGQubWFnKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZSB0aGUgdmVjdG9yIHRvIGxlbmd0aCAxIChtYWtlIGl0IGEgdW5pdCB2ZWN0b3IpLlxuICAgKlxuICAgKiBAbWV0aG9kIG5vcm1hbGl6ZVxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IG5vcm1hbGl6ZWQgVmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMTAsIDIwLCAyKTtcbiAgICogLy8gdiBoYXMgY29tcG5lbnRzIFsxMC4wLCAyMC4wLCAyLjBdXG4gICAqIHYubm9ybWFsaXplKCk7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0b1xuICAgKiAvLyBbMC40NDU0MzU0LCAwLjg5MDg3MDgsIDAuMDg5MDg3MDg0XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2KHRoaXMubWFnKCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMaW1pdCB0aGUgbWFnbml0dWRlIG9mIHRoaXMgdmVjdG9yIHRvIHRoZSB2YWx1ZSB1c2VkIGZvciB0aGUgPGI+bWF4PC9iPlxuICAgKiBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBtZXRob2QgbGltaXRcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICBtYXggdGhlIG1heGltdW0gbWFnbml0dWRlIGZvciB0aGUgdmVjdG9yXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgIHRoZSBtb2RpZmllZCBWZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxMCwgMjAsIDIpO1xuICAgKiAvLyB2IGhhcyBjb21wbmVudHMgWzEwLjAsIDIwLjAsIDIuMF1cbiAgICogdi5saW1pdCg1KTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvXG4gICAqIC8vIFsyLjIyNzE3NzEsIDQuNDU0MzU0MywgMC40NDU0MzU0XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5saW1pdCA9IGZ1bmN0aW9uIChsKSB7XG4gICAgdmFyIG1TcSA9IHRoaXMubWFnU3EoKTtcbiAgICBpZihtU3EgPiBsKmwpIHtcbiAgICAgIHRoaXMuZGl2KE1hdGguc3FydChtU3EpKTsgLy9ub3JtYWxpemUgaXRcbiAgICAgIHRoaXMubXVsdChsKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgbWFnbml0dWRlIG9mIHRoaXMgdmVjdG9yIHRvIHRoZSB2YWx1ZSB1c2VkIGZvciB0aGUgPGI+bGVuPC9iPlxuICAgKiBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBtZXRob2Qgc2V0TWFnXG4gICAqIEBwYXJhbSAge251bWJlcn0gICAgbGVuIHRoZSBuZXcgbGVuZ3RoIGZvciB0aGlzIHZlY3RvclxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgICB0aGUgbW9kaWZpZWQgVmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEwLCAyMCwgMik7XG4gICAqIC8vIHYgaGFzIGNvbXBuZW50cyBbMTAuMCwgMjAuMCwgMi4wXVxuICAgKiB2MS5zZXRNYWcoMTApO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG8gWzYuMCwgOC4wLCAwLjBdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLnNldE1hZyA9IGZ1bmN0aW9uIChsZW4pIHtcbiAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUoKS5tdWx0KGxlbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSB0aGUgYW5nbGUgb2Ygcm90YXRpb24gZm9yIHRoaXMgdmVjdG9yIChvbmx5IDJEIHZlY3RvcnMpXG4gICAqXG4gICAqIEBtZXRob2QgaGVhZGluZ1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSBhbmdsZSBvZiByb3RhdGlvblxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzID0gXCJub3JlbmRlclwiPjxjb2RlPlxuICAgKiBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICogICB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMzAsNTApO1xuICAgKiAgIHByaW50KHYxLmhlYWRpbmcoKSk7IC8vIDEuMDMwMzc2ODI2NTI0MzEyNVxuICAgKlxuICAgKiAgIHZhciB2MSA9IGNyZWF0ZVZlY3Rvcig0MCw1MCk7XG4gICAqICAgcHJpbnQodjEuaGVhZGluZygpKTsgLy8gMC44OTYwNTUzODQ1NzEzNDM5XG4gICAqXG4gICAqICAgdmFyIHYxID0gY3JlYXRlVmVjdG9yKDMwLDcwKTtcbiAgICogICBwcmludCh2MS5oZWFkaW5nKCkpOyAvLyAxLjE2NTkwNDU0MDUwOTgxMzJcbiAgICogfVxuICAgKiA8L2Rpdj48L2NvZGU+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmhlYWRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy55LCB0aGlzLngpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSb3RhdGUgdGhlIHZlY3RvciBieSBhbiBhbmdsZSAob25seSAyRCB2ZWN0b3JzKSwgbWFnbml0dWRlIHJlbWFpbnMgdGhlXG4gICAqIHNhbWVcbiAgICpcbiAgICogQG1ldGhvZCByb3RhdGVcbiAgICogQHBhcmFtICB7bnVtYmVyfSAgICBhbmdsZSB0aGUgYW5nbGUgb2Ygcm90YXRpb25cbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgbW9kaWZpZWQgVmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMTAuMCwgMjAuMCk7XG4gICAqIC8vIHYgaGFzIGNvbXBuZW50cyBbMTAuMCwgMjAuMCwgMC4wXVxuICAgKiB2LnJvdGF0ZShIQUxGX1BJKTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvIFstMjAuMCwgOS45OTk5OTksIDAuMF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gKGFuZ2xlKSB7XG4gICAgdmFyIG5ld0hlYWRpbmcgPSB0aGlzLmhlYWRpbmcoKSArIGFuZ2xlO1xuICAgIHZhciBtYWcgPSB0aGlzLm1hZygpO1xuICAgIHRoaXMueCA9IE1hdGguY29zKG5ld0hlYWRpbmcpICogbWFnO1xuICAgIHRoaXMueSA9IE1hdGguc2luKG5ld0hlYWRpbmcpICogbWFnO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMaW5lYXIgaW50ZXJwb2xhdGUgdGhlIHZlY3RvciB0byBhbm90aGVyIHZlY3RvclxuICAgKlxuICAgKiBAbWV0aG9kIGxlcnBcbiAgICogQHBhcmFtICB7VmVjdG9yfSB4ICAgdGhlIHggY29tcG9uZW50IG9yIHRoZSBWZWN0b3IgdG8gbGVycCB0b1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IFt5XSB5IHRoZSB5IGNvbXBvbmVudFxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IFt6XSB6IHRoZSB6IGNvbXBvbmVudFxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgIGFtdCB0aGUgYW1vdW50IG9mIGludGVycG9sYXRpb247IHNvbWUgdmFsdWUgYmV0d2VlbiAwLjBcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgKG9sZCB2ZWN0b3IpIGFuZCAxLjAgKG5ldyB2ZWN0b3IpLiAwLjEgaXMgdmVyeSBuZWFyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBuZXcgdmVjdG9yLiAwLjUgaXMgaGFsZndheSBpbiBiZXR3ZWVuLlxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgICB0aGUgbW9kaWZpZWQgVmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMSwgMSwgMCk7XG4gICAqXG4gICAqIHYubGVycCgzLCAzLCAwLCAwLjUpOyAvLyB2IG5vdyBoYXMgY29tcG9uZW50cyBbMiwyLDBdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDAsIDAsIDApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMTAwLCAxMDAsIDApO1xuICAgKlxuICAgKiB2YXIgdjMgPSBWZWN0b3IubGVycCh2MSwgdjIsIDAuNSk7XG4gICAqIC8vIHYzIGhhcyBjb21wb25lbnRzIFs1MCw1MCwwXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5sZXJwID0gZnVuY3Rpb24gKHgsIHksIHosIGFtdCkge1xuICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5sZXJwKHgueCwgeC55LCB4LnosIHkpO1xuICAgIH1cbiAgICB0aGlzLnggKz0gKHggLSB0aGlzLngpICogYW10IHx8IDA7XG4gICAgdGhpcy55ICs9ICh5IC0gdGhpcy55KSAqIGFtdCB8fCAwO1xuICAgIHRoaXMueiArPSAoeiAtIHRoaXMueikgKiBhbXQgfHwgMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIGEgcmVwcmVzZW50YXRpb24gb2YgdGhpcyB2ZWN0b3IgYXMgYSBmbG9hdCBhcnJheS4gVGhpcyBpcyBvbmx5XG4gICAqIGZvciB0ZW1wb3JhcnkgdXNlLiBJZiB1c2VkIGluIGFueSBvdGhlciBmYXNoaW9uLCB0aGUgY29udGVudHMgc2hvdWxkIGJlXG4gICAqIGNvcGllZCBieSB1c2luZyB0aGUgPGI+VmVjdG9yLmNvcHkoKTwvYj4gbWV0aG9kIHRvIGNvcHkgaW50byB5b3VyIG93blxuICAgKiBhcnJheS5cbiAgICpcbiAgICogQG1ldGhvZCBhcnJheVxuICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gQXJyYXkgd2l0aCB0aGUgMyB2YWx1ZXNcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcyA9IFwibm9yZW5kZXJcIj48Y29kZT5cbiAgICogZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAqICAgdmFyIHYgPSBjcmVhdGVWZWN0b3IoMjAsMzApO1xuICAgKiAgIHByaW50KHYuYXJyYXkoKSk7IC8vIFByaW50cyA6IEFycmF5IFsyMCwgMzAsIDBdXG4gICAqIH1cbiAgICogPC9kaXY+PC9jb2RlPlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEwLjAsIDIwLjAsIDMwLjApO1xuICAgKiB2YXIgZiA9IHYuYXJyYXkoKTtcbiAgICogcHJpbnQoZlswXSk7IC8vIFByaW50cyBcIjEwLjBcIlxuICAgKiBwcmludChmWzFdKTsgLy8gUHJpbnRzIFwiMjAuMFwiXG4gICAqIHByaW50KGZbMl0pOyAvLyBQcmludHMgXCIzMC4wXCJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuYXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnggfHwgMCwgdGhpcy55IHx8IDAsIHRoaXMueiB8fCAwXTtcbiAgfTtcblxuICAvKipcbiAgICogRXF1YWxpdHkgY2hlY2sgYWdhaW5zdCBhIFZlY3RvclxuICAgKlxuICAgKiBAbWV0aG9kIGVxdWFsc1xuICAgKiBAcGFyYW0ge051bWJlcnxWZWN0b3J8QXJyYXl9IFt4XSB0aGUgeCBjb21wb25lbnQgb2YgdGhlIHZlY3RvciBvciBhXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlY3RvciBvciBhbiBBcnJheVxuICAgKiBAcGFyYW0ge051bWJlcn0gICAgICAgICAgICAgICAgIFt5XSB0aGUgeSBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcGFyYW0ge051bWJlcn0gICAgICAgICAgICAgICAgIFt6XSB0aGUgeiBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIHRoZSB2ZWN0b3JzIGFyZSBlcXVhbHNcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcyA9IFwibm9yZW5kZXJcIj48Y29kZT5cbiAgICogdjEgPSBjcmVhdGVWZWN0b3IoNSwxMCwyMCk7XG4gICAqIHYyID0gY3JlYXRlVmVjdG9yKDUsMTAsMjApO1xuICAgKiB2MyA9IGNyZWF0ZVZlY3RvcigxMywxMCwxOSk7XG4gICAqXG4gICAqIHByaW50KHYxLmVxdWFscyh2Mi54LHYyLnksdjIueikpOyAvLyB0cnVlXG4gICAqIHByaW50KHYxLmVxdWFscyh2My54LHYzLnksdjMueikpOyAvLyBmYWxzZVxuICAgKiA8L2Rpdj48L2NvZGU+XG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEwLjAsIDIwLjAsIDMwLjApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMTAuMCwgMjAuMCwgMzAuMCk7XG4gICAqIHZhciB2MyA9IGNyZWF0ZVZlY3RvcigwLjAsIDAuMCwgMC4wKTtcbiAgICogcHJpbnQgKHYxLmVxdWFscyh2MikpIC8vIHRydWVcbiAgICogcHJpbnQgKHYxLmVxdWFscyh2MykpIC8vIGZhbHNlXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgdmFyIGEsIGIsIGM7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IpIHtcbiAgICAgIGEgPSB4LnggfHwgMDtcbiAgICAgIGIgPSB4LnkgfHwgMDtcbiAgICAgIGMgPSB4LnogfHwgMDtcbiAgICB9IGVsc2UgaWYgKHggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgYSA9IHhbMF0gfHwgMDtcbiAgICAgIGIgPSB4WzFdIHx8IDA7XG4gICAgICBjID0geFsyXSB8fCAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBhID0geCB8fCAwO1xuICAgICAgYiA9IHkgfHwgMDtcbiAgICAgIGMgPSB6IHx8IDA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnggPT09IGEgJiYgdGhpcy55ID09PSBiICYmIHRoaXMueiA9PT0gYztcbiAgfTtcblxuXG4gIC8vIFN0YXRpYyBNZXRob2RzXG5cblxuICAvKipcbiAgICogTWFrZSBhIG5ldyAyRCB1bml0IHZlY3RvciBmcm9tIGFuIGFuZ2xlXG4gICAqXG4gICAqIEBtZXRob2QgZnJvbUFuZ2xlXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICBhbmdsZSB0aGUgZGVzaXJlZCBhbmdsZVxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgICAgIHRoZSBuZXcgVmVjdG9yIG9iamVjdFxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2PlxuICAgKiA8Y29kZT5cbiAgICogZnVuY3Rpb24gZHJhdygpIHtcbiAgICogICBiYWNrZ3JvdW5kICgyMDApO1xuICAgKlxuICAgKiAgIC8vIENyZWF0ZSBhIHZhcmlhYmxlLCBwcm9wb3J0aW9uYWwgdG8gdGhlIG1vdXNlWCxcbiAgICogICAvLyB2YXJ5aW5nIGZyb20gMC0zNjAsIHRvIHJlcHJlc2VudCBhbiBhbmdsZSBpbiBkZWdyZWVzLlxuICAgKiAgIGFuZ2xlTW9kZShERUdSRUVTKTtcbiAgICogICB2YXIgbXlEZWdyZWVzID0gbWFwKG1vdXNlWCwgMCx3aWR0aCwgMCwzNjApO1xuICAgKlxuICAgKiAgIC8vIERpc3BsYXkgdGhhdCB2YXJpYWJsZSBpbiBhbiBvbnNjcmVlbiB0ZXh0LlxuICAgKiAgIC8vIChOb3RlIHRoZSBuZmMoKSBmdW5jdGlvbiB0byB0cnVuY2F0ZSBhZGRpdGlvbmFsIGRlY2ltYWwgcGxhY2VzLFxuICAgKiAgIC8vIGFuZCB0aGUgXCJcXHhCMFwiIGNoYXJhY3RlciBmb3IgdGhlIGRlZ3JlZSBzeW1ib2wuKVxuICAgKiAgIHZhciByZWFkb3V0ID0gXCJhbmdsZSA9IFwiICsgbmZjKG15RGVncmVlcywxLDEpICsgXCJcXHhCMFwiXG4gICAqICAgbm9TdHJva2UoKTtcbiAgICogICBmaWxsICgwKTtcbiAgICogICB0ZXh0IChyZWFkb3V0LCA1LCAxNSk7XG4gICAqXG4gICAqICAgLy8gQ3JlYXRlIGEgVmVjdG9yIHVzaW5nIHRoZSBmcm9tQW5nbGUgZnVuY3Rpb24sXG4gICAqICAgLy8gYW5kIGV4dHJhY3QgaXRzIHggYW5kIHkgY29tcG9uZW50cy5cbiAgICogICB2YXIgdiA9IFZlY3Rvci5mcm9tQW5nbGUocmFkaWFucyhteURlZ3JlZXMpKTtcbiAgICogICB2YXIgdnggPSB2Lng7XG4gICAqICAgdmFyIHZ5ID0gdi55O1xuICAgKlxuICAgKiAgIHB1c2goKTtcbiAgICogICB0cmFuc2xhdGUgKHdpZHRoLzIsIGhlaWdodC8yKTtcbiAgICogICBub0ZpbGwoKTtcbiAgICogICBzdHJva2UgKDE1MCk7XG4gICAqICAgbGluZSAoMCwwLCAzMCwwKTtcbiAgICogICBzdHJva2UgKDApO1xuICAgKiAgIGxpbmUgKDAsMCwgMzAqdngsIDMwKnZ5KTtcbiAgICogICBwb3AoKVxuICAgKiB9XG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IuZnJvbUFuZ2xlID0gZnVuY3Rpb24oYW5nbGUpIHtcbiAgICByZXR1cm4gbmV3IFZlY3RvcihNYXRoLmNvcyhhbmdsZSksTWF0aC5zaW4oYW5nbGUpLDApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBNYWtlIGEgbmV3IDJEIHVuaXQgdmVjdG9yIGZyb20gYSByYW5kb20gYW5nbGVcbiAgICpcbiAgICogQG1ldGhvZCByYW5kb20yRFxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIG5ldyBWZWN0b3Igb2JqZWN0XG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBWZWN0b3IucmFuZG9tMkQoKTtcbiAgICogLy8gTWF5IG1ha2UgdidzIGF0dHJpYnV0ZXMgc29tZXRoaW5nIGxpa2U6XG4gICAqIC8vIFswLjYxNTU0NjE3LCAtMC41MTE5NTc2NSwgMC4wXSBvclxuICAgKiAvLyBbLTAuNDY5NTg0MSwgLTAuMTQzNjY3MzEsIDAuMF0gb3JcbiAgICogLy8gWzAuNjA5MTA5NywgLTAuMjI4MDUyNzgsIDAuMF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5yYW5kb20yRCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYW5nbGUgPSBNYXRoLnJhbmRvbSgpKk1hdGguUEkqMjtcbiAgICByZXR1cm4gdGhpcy5mcm9tQW5nbGUoYW5nbGUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBNYWtlIGEgbmV3IHJhbmRvbSAzRCB1bml0IHZlY3Rvci5cbiAgICpcbiAgICogQG1ldGhvZCByYW5kb20zRFxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIG5ldyBWZWN0b3Igb2JqZWN0XG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBWZWN0b3IucmFuZG9tM0QoKTtcbiAgICogLy8gTWF5IG1ha2UgdidzIGF0dHJpYnV0ZXMgc29tZXRoaW5nIGxpa2U6XG4gICAqIC8vIFswLjYxNTU0NjE3LCAtMC41MTE5NTc2NSwgMC41OTkxNjhdIG9yXG4gICAqIC8vIFstMC40Njk1ODQxLCAtMC4xNDM2NjczMSwgLTAuODcxMTIwMl0gb3JcbiAgICogLy8gWzAuNjA5MTA5NywgLTAuMjI4MDUyNzgsIC0wLjc1OTU5MDJdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucmFuZG9tM0QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFuZ2xlID0gTWF0aC5yYW5kb20oKSpNYXRoLlBJKjIsXG5cdCAgICB2eiA9IE1hdGgucmFuZG9tKCkqMi0xLFxuICAgIFx0dnggPSBNYXRoLnNxcnQoMS12eip2eikqTWF0aC5jb3MoYW5nbGUpLFxuICAgIFx0dnkgPSBNYXRoLnNxcnQoMS12eip2eikqTWF0aC5zaW4oYW5nbGUpO1xuXG4gICAgcmV0dXJuIG5ldyBWZWN0b3IodngsdnksdnopO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEFkZHMgdHdvIHZlY3RvcnMgdG9nZXRoZXIgYW5kIHJldHVybnMgYSBuZXcgb25lLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjEgYSBWZWN0b3IgdG8gYWRkXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjIgYSBWZWN0b3IgdG8gYWRkXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdGFyZ2V0IGlmIHVuZGVmaW5lZCBhIG5ldyB2ZWN0b3Igd2lsbCBiZSBjcmVhdGVkXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIHJlc3VsdGluZyBWZWN0b3JcbiAgICpcbiAgICovXG5cbiAgVmVjdG9yLmFkZCA9IGZ1bmN0aW9uICh2MSwgdjIsIHRhcmdldCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB2MS5jb3B5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5zZXQodjEpO1xuICAgIH1cbiAgICB0YXJnZXQuYWRkKHYyKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBTdWJ0cmFjdHMgb25lIFZlY3RvciBmcm9tIGFub3RoZXIgYW5kIHJldHVybnMgYSBuZXcgb25lLiAgVGhlIHNlY29uZFxuICAgKiB2ZWN0b3IgKHYyKSBpcyBzdWJ0cmFjdGVkIGZyb20gdGhlIGZpcnN0ICh2MSksIHJlc3VsdGluZyBpbiB2MS12Mi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYxIGEgVmVjdG9yIHRvIHN1YnRyYWN0IGZyb21cbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MiBhIFZlY3RvciB0byBzdWJ0cmFjdFxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHRhcmdldCBpZiB1bmRlZmluZWQgYSBuZXcgdmVjdG9yIHdpbGwgYmUgY3JlYXRlZFxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSByZXN1bHRpbmcgVmVjdG9yXG4gICAqL1xuXG4gIFZlY3Rvci5zdWIgPSBmdW5jdGlvbiAodjEsIHYyLCB0YXJnZXQpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdjEuY29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuc2V0KHYxKTtcbiAgICB9XG4gICAgdGFyZ2V0LnN1Yih2Mik7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGEgdmVjdG9yIGJ5IGEgc2NhbGFyIGFuZCByZXR1cm5zIGEgbmV3IHZlY3Rvci5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYgdGhlIFZlY3RvciB0byBtdWx0aXBseVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICBuIHRoZSBzY2FsYXJcbiAgICogQHBhcmFtICB7VmVjdG9yfSB0YXJnZXQgaWYgdW5kZWZpbmVkIGEgbmV3IHZlY3RvciB3aWxsIGJlIGNyZWF0ZWRcbiAgICogQHJldHVybiB7VmVjdG9yfSAgdGhlIHJlc3VsdGluZyBuZXcgVmVjdG9yXG4gICAqL1xuICBWZWN0b3IubXVsdCA9IGZ1bmN0aW9uICh2LCBuLCB0YXJnZXQpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdi5jb3B5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5zZXQodik7XG4gICAgfVxuICAgIHRhcmdldC5tdWx0KG4pO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpdmlkZXMgYSB2ZWN0b3IgYnkgYSBzY2FsYXIgYW5kIHJldHVybnMgYSBuZXcgdmVjdG9yLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdiB0aGUgVmVjdG9yIHRvIGRpdmlkZVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICBuIHRoZSBzY2FsYXJcbiAgICogQHBhcmFtICB7VmVjdG9yfSB0YXJnZXQgaWYgdW5kZWZpbmVkIGEgbmV3IHZlY3RvciB3aWxsIGJlIGNyZWF0ZWRcbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgcmVzdWx0aW5nIG5ldyBWZWN0b3JcbiAgICovXG4gIFZlY3Rvci5kaXYgPSBmdW5jdGlvbiAodiwgbiwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IHYuY29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuc2V0KHYpO1xuICAgIH1cbiAgICB0YXJnZXQuZGl2KG4pO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MSB0aGUgZmlyc3QgVmVjdG9yXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjIgdGhlIHNlY29uZCBWZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgdGhlIGRvdCBwcm9kdWN0XG4gICAqL1xuICBWZWN0b3IuZG90ID0gZnVuY3Rpb24gKHYxLCB2Mikge1xuICAgIHJldHVybiB2MS5kb3QodjIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBjcm9zcyBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjEgdGhlIGZpcnN0IFZlY3RvclxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYyIHRoZSBzZWNvbmQgVmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn0gICAgIHRoZSBjcm9zcyBwcm9kdWN0XG4gICAqL1xuICBWZWN0b3IuY3Jvc3MgPSBmdW5jdGlvbiAodjEsIHYyKSB7XG4gICAgcmV0dXJuIHYxLmNyb3NzKHYyKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgRXVjbGlkZWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50cyAoY29uc2lkZXJpbmcgYVxuICAgKiBwb2ludCBhcyBhIHZlY3RvciBvYmplY3QpLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjEgdGhlIGZpcnN0IFZlY3RvclxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYyIHRoZSBzZWNvbmQgVmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn0gICAgIHRoZSBkaXN0YW5jZVxuICAgKi9cbiAgVmVjdG9yLmRpc3QgPSBmdW5jdGlvbiAodjEsdjIpIHtcbiAgICByZXR1cm4gdjEuZGlzdCh2Mik7XG4gIH07XG5cbiAgLyoqXG4gICAqIExpbmVhciBpbnRlcnBvbGF0ZSBhIHZlY3RvciB0byBhbm90aGVyIHZlY3RvciBhbmQgcmV0dXJuIHRoZSByZXN1bHQgYXMgYVxuICAgKiBuZXcgdmVjdG9yLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7VmVjdG9yfSB2MSBhIHN0YXJ0aW5nIFZlY3RvclxuICAgKiBAcGFyYW0ge1ZlY3Rvcn0gdjIgdGhlIFZlY3RvciB0byBsZXJwIHRvXG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICB0aGUgYW1vdW50IG9mIGludGVycG9sYXRpb247IHNvbWUgdmFsdWUgYmV0d2VlbiAwLjBcbiAgICogICAgICAgICAgICAgICAgICAgICAgIChvbGQgdmVjdG9yKSBhbmQgMS4wIChuZXcgdmVjdG9yKS4gMC4xIGlzIHZlcnkgbmVhclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgdGhlIG5ldyB2ZWN0b3IuIDAuNSBpcyBoYWxmd2F5IGluIGJldHdlZW4uXG4gICAqL1xuICBWZWN0b3IubGVycCA9IGZ1bmN0aW9uICh2MSwgdjIsIGFtdCwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IHYxLmNvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnNldCh2MSk7XG4gICAgfVxuICAgIHRhcmdldC5sZXJwKHYyLCBhbXQpO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgdGhlIGFuZ2xlIChpbiByYWRpYW5zKSBiZXR3ZWVuIHR3byB2ZWN0b3JzLlxuICAgKiBAbWV0aG9kIGFuZ2xlQmV0d2VlblxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjEgdGhlIHgsIHksIGFuZCB6IGNvbXBvbmVudHMgb2YgYSBWZWN0b3JcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MiB0aGUgeCwgeSwgYW5kIHogY29tcG9uZW50cyBvZiBhIFZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICAgIHRoZSBhbmdsZSBiZXR3ZWVuIChpbiByYWRpYW5zKVxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAwLCAwKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDAsIDEsIDApO1xuICAgKlxuICAgKiB2YXIgYW5nbGUgPSBWZWN0b3IuYW5nbGVCZXR3ZWVuKHYxLCB2Mik7XG4gICAqIC8vIGFuZ2xlIGlzIFBJLzJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5hbmdsZUJldHdlZW4gPSBmdW5jdGlvbiAodjEsIHYyKSB7XG4gICAgcmV0dXJuIE1hdGguYWNvcyh2MS5kb3QodjIpIC8gKHYxLm1hZygpICogdjIubWFnKCkpKTtcbiAgfTtcblxuICAvLyByZXR1cm4gVmVjdG9yO1xubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3I7XG4vLyB9KTtcbiIsImZ1bmN0aW9uIFV0aWxzKGN4LCBjYW52YXMpIHtcbiAgcmV0dXJuIHtcbiAgICBjeCA6IGN4IHx8ICcnLFxuICAgIGNhbnZhczogY2FudmFzIHx8ICcnLFxuICAgIGhhbGZYOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhbnZhcy53aWR0aCAvIDI7XG4gICAgfSxcbiAgICBoYWxmWTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYW52YXMuaGVpZ2h0IC8gMjtcbiAgICB9LFxuICAgIHJhbmdlOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICAgIGlmICghbWF4KSB7XG4gICAgICAgIG1heCA9IG1pbjtcbiAgICAgICAgbWluID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbik7XG4gICAgfSxcbiAgICByYW5nZTogZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICAgIHZhciByYW5kID0gTWF0aC5yYW5kb20oKTtcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHJhbmQ7XG4gICAgICB9IGVsc2VcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiByYW5kICogbWluO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG1pbiA+IG1heCkge1xuICAgICAgICAgIHZhciB0bXAgPSBtaW47XG4gICAgICAgICAgbWluID0gbWF4O1xuICAgICAgICAgIG1heCA9IHRtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByYW5kICogKG1heC1taW4pICsgbWluO1xuICAgICAgfVxuICAgIH0sXG4gICAgLy8gdGFrZW4gZnJvbSB0aGUgcDUuanMgcHJvamVjdFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9jZXNzaW5nL3A1LmpzL2Jsb2IvNWM4MWQ2NTVmNjgzZjkwNDUyYjgwYWIyMjVhNjdlNDQ5NDYzZmZmOS9zcmMvbWF0aC9jYWxjdWxhdGlvbi5qcyNMMzk0XG4gICAgbWFwOiBmdW5jdGlvbihuLCBzdGFydDEsIHN0b3AxLCBzdGFydDIsIHN0b3AyKSB7XG4gICAgICByZXR1cm4gKChuLXN0YXJ0MSkvKHN0b3AxLXN0YXJ0MSkpKihzdG9wMi1zdGFydDIpK3N0YXJ0MjtcbiAgICB9LFxuXG4gICAgZ2V0TW91c2VQb3M6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiBldmVudC5jbGllbnRYLFxuICAgICAgICB5OiBldmVudC5jbGllbnRZXG4gICAgICB9XG4gICAgfSxcblxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuY3guY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgIH0sXG4gICAgVzogY2FudmFzLndpZHRoLFxuICAgIEg6IGNhbnZhcy5oZWlnaHQsXG4gICAgSFc6IGNhbnZhcy53aWR0aCAvIDIsXG4gICAgSEg6IGNhbnZhcy5oZWlnaHQgLyAyLFxuICAgIGVsbGlwc2U6IGZ1bmN0aW9uKHgsIHksIHIpIHtcbiAgICAgIHRoaXMuY3guYmVnaW5QYXRoKCk7XG4gICAgICB0aGlzLmN4LmFyYyh4LCB5LCByLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgICAgdGhpcy5jeC5maWxsKCk7XG4gICAgICB0aGlzLmN4LnN0cm9rZSgpO1xuICAgIH0sXG4gICAgY29uc3RyYWluOiBmdW5jdGlvbih2YWwsIG1pbiwgbWF4KSB7XG4gICAgICBpZiAodmFsID4gbWF4KSB7XG4gICAgICAgIHJldHVybiBtYXg7XG4gICAgICB9IGVsc2UgaWYgKHZhbCA8IG1pbikge1xuICAgICAgICByZXR1cm4gbWluO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3gsIGNhbnZhcykge1xuICByZXR1cm4gbmV3IFV0aWxzKGN4LCBjYW52YXMpO1xufTtcbiJdfQ==
