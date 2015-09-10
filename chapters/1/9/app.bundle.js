require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Vector = require('vector2d')
  , utils
	, topSpeed
;

function random2D () {
	var angle = Math.random()*Math.PI*2;
	return new Vector.ObjectVector(Math.cos(angle), Math.sin(angle));
};

function Mover(cx, canvas) {
  utils = require('utils')(cx, canvas);

  this.cx = cx;
  this.canvas = canvas;
	this.topSpeed = 5;

	this.location = new Vector.ObjectVector(utils.halfX(), utils.halfY());
  this.velocity = new Vector.ObjectVector(utils.range(-2, 2), utils.range(-2, 2));
	this.acceleration = new Vector.ObjectVector(0.001, 0.01);
}

Mover.prototype.update = function() {
  var acceleration = random2D();

	this.velocity.add(acceleration);
	this.velocity.limit(this.topSpeed);
	this.location.add(this.velocity);
};

Mover.prototype.checkEdges = function () {
  if (this.location.getX() > this.canvas.width) {
    this.location.setX(0);
  } else if (this.location.getX() < 0) {
    this.location.setX(canvas.width);
  }

  if (this.location.getY() > this.canvas.height) {
    this.location.setY(0);
  } else if (this.location.getY() < 0){
    this.location.setY(this.canvas.height);
  }
};

Mover.prototype.display = function () {
  this.cx.fillRect(this.location.getX(), this.location.getY(), 10, 10);
};

module.exports = Mover;

},{"utils":"utils","vector2d":9}],2:[function(require,module,exports){
var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')(cx, canvas)
  , Mover = require('./_Mover')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , mover = new Mover(cx, canvas)
;

function setup() {
  console.log('setup');

}

function draw() {
  utils.clear();
  mover.update();
  mover.checkEdges();
  mover.display();

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());

},{"./_Mover":1,"utils":"utils"}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],6:[function(require,module,exports){
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

},{"./support/isBuffer":5,"_process":4,"inherits":3}],7:[function(require,module,exports){
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

},{"./Vector.js":10,"util":6}],8:[function(require,module,exports){
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

},{"./Vector.js":10,"util":6}],9:[function(require,module,exports){
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

},{"./Float32Vector.js":7,"./ObjectVector.js":8,"./Vector.js":10}],10:[function(require,module,exports){
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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8xLzkvX01vdmVyLmpzIiwiY2hhcHRlcnMvMS85L2FwcC5qcyIsIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy92ZWN0b3IyZC9zcmMvRmxvYXQzMlZlY3Rvci5qcyIsIm5vZGVfbW9kdWxlcy92ZWN0b3IyZC9zcmMvT2JqZWN0VmVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL3ZlY3RvcjJkL3NyYy9WZWMyRC5qcyIsIm5vZGVfbW9kdWxlcy92ZWN0b3IyZC9zcmMvVmVjdG9yLmpzIiwibW9kdWxlcy9wNVZlY3RvcnMuanMiLCJtb2R1bGVzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMxa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzU2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVmVjdG9yID0gcmVxdWlyZSgndmVjdG9yMmQnKVxuICAsIHV0aWxzXG5cdCwgdG9wU3BlZWRcbjtcblxuZnVuY3Rpb24gcmFuZG9tMkQgKCkge1xuXHR2YXIgYW5nbGUgPSBNYXRoLnJhbmRvbSgpKk1hdGguUEkqMjtcblx0cmV0dXJuIG5ldyBWZWN0b3IuT2JqZWN0VmVjdG9yKE1hdGguY29zKGFuZ2xlKSwgTWF0aC5zaW4oYW5nbGUpKTtcbn07XG5cbmZ1bmN0aW9uIE1vdmVyKGN4LCBjYW52YXMpIHtcbiAgdXRpbHMgPSByZXF1aXJlKCd1dGlscycpKGN4LCBjYW52YXMpO1xuXG4gIHRoaXMuY3ggPSBjeDtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG5cdHRoaXMudG9wU3BlZWQgPSA1O1xuXG5cdHRoaXMubG9jYXRpb24gPSBuZXcgVmVjdG9yLk9iamVjdFZlY3Rvcih1dGlscy5oYWxmWCgpLCB1dGlscy5oYWxmWSgpKTtcbiAgdGhpcy52ZWxvY2l0eSA9IG5ldyBWZWN0b3IuT2JqZWN0VmVjdG9yKHV0aWxzLnJhbmdlKC0yLCAyKSwgdXRpbHMucmFuZ2UoLTIsIDIpKTtcblx0dGhpcy5hY2NlbGVyYXRpb24gPSBuZXcgVmVjdG9yLk9iamVjdFZlY3RvcigwLjAwMSwgMC4wMSk7XG59XG5cbk1vdmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFjY2VsZXJhdGlvbiA9IHJhbmRvbTJEKCk7XG5cblx0dGhpcy52ZWxvY2l0eS5hZGQoYWNjZWxlcmF0aW9uKTtcblx0dGhpcy52ZWxvY2l0eS5saW1pdCh0aGlzLnRvcFNwZWVkKTtcblx0dGhpcy5sb2NhdGlvbi5hZGQodGhpcy52ZWxvY2l0eSk7XG59O1xuXG5Nb3Zlci5wcm90b3R5cGUuY2hlY2tFZGdlcyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMubG9jYXRpb24uZ2V0WCgpID4gdGhpcy5jYW52YXMud2lkdGgpIHtcbiAgICB0aGlzLmxvY2F0aW9uLnNldFgoMCk7XG4gIH0gZWxzZSBpZiAodGhpcy5sb2NhdGlvbi5nZXRYKCkgPCAwKSB7XG4gICAgdGhpcy5sb2NhdGlvbi5zZXRYKGNhbnZhcy53aWR0aCk7XG4gIH1cblxuICBpZiAodGhpcy5sb2NhdGlvbi5nZXRZKCkgPiB0aGlzLmNhbnZhcy5oZWlnaHQpIHtcbiAgICB0aGlzLmxvY2F0aW9uLnNldFkoMCk7XG4gIH0gZWxzZSBpZiAodGhpcy5sb2NhdGlvbi5nZXRZKCkgPCAwKXtcbiAgICB0aGlzLmxvY2F0aW9uLnNldFkodGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgfVxufTtcblxuTW92ZXIucHJvdG90eXBlLmRpc3BsYXkgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY3guZmlsbFJlY3QodGhpcy5sb2NhdGlvbi5nZXRYKCksIHRoaXMubG9jYXRpb24uZ2V0WSgpLCAxMCwgMTApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb3ZlcjtcbiIsInZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJylcbiAgLCBjeCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICwgdXRpbHMgPSByZXF1aXJlKCd1dGlscycpKGN4LCBjYW52YXMpXG4gICwgTW92ZXIgPSByZXF1aXJlKCcuL19Nb3ZlcicpXG47XG5cbnZhciBXSURUSCA9IGNhbnZhcy53aWR0aFxuICAsIEhFSUdIVCA9IGNhbnZhcy5oZWlnaHRcbiAgLCBtb3ZlciA9IG5ldyBNb3ZlcihjeCwgY2FudmFzKVxuO1xuXG5mdW5jdGlvbiBzZXR1cCgpIHtcbiAgY29uc29sZS5sb2coJ3NldHVwJyk7XG5cbn1cblxuZnVuY3Rpb24gZHJhdygpIHtcbiAgdXRpbHMuY2xlYXIoKTtcbiAgbW92ZXIudXBkYXRlKCk7XG4gIG1vdmVyLmNoZWNrRWRnZXMoKTtcbiAgbW92ZXIuZGlzcGxheSgpO1xuXG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG59XG5cbihmdW5jdGlvbigpIHtcbiAgc2V0dXAoKTtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn0oKSk7XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbiAgLCBWZWN0b3IgPSByZXF1aXJlKCcuL1ZlY3Rvci5qcycpO1xuXG5mdW5jdGlvbiBGbG9hdDMyVmVjdG9yKHgsIHkpIHtcbiAgaWYgKHRoaXMgaW5zdGFuY2VvZiBGbG9hdDMyVmVjdG9yID09PSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgRmxvYXQzMlZlY3Rvcih4LCB5KTtcbiAgfVxuXG4gIHRoaXMuX2F4ZXMgPSBuZXcgRmxvYXQzMkFycmF5KDIpO1xuICB0aGlzLl9heGVzWzBdID0geDtcbiAgdGhpcy5fYXhlc1sxXSA9IHk7XG59XG51dGlsLmluaGVyaXRzKEZsb2F0MzJWZWN0b3IsIFZlY3Rvcik7XG5cbkZsb2F0MzJWZWN0b3IucHJvdG90eXBlLmN0b3IgPSBGbG9hdDMyVmVjdG9yO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZsb2F0MzJWZWN0b3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpXG4gICwgVmVjdG9yID0gcmVxdWlyZSgnLi9WZWN0b3IuanMnKTtcblxuZnVuY3Rpb24gT2JqZWN0VmVjdG9yKHgsIHkpIHtcbiAgaWYgKHRoaXMgaW5zdGFuY2VvZiBPYmplY3RWZWN0b3IgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIG5ldyBPYmplY3RWZWN0b3IoeCwgeSk7XG4gIH1cblxuICB0aGlzLl94ID0geDtcbiAgdGhpcy5feSA9IHk7XG59XG51dGlsLmluaGVyaXRzKE9iamVjdFZlY3RvciwgVmVjdG9yKTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdFZlY3Rvci5wcm90b3R5cGUsICd4Jywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5feDtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAoeCkge1xuICAgIHRoaXMuX3ggPSB4O1xuICB9XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdFZlY3Rvci5wcm90b3R5cGUsICd5Jywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5feTtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAoeSkge1xuICAgIHRoaXMuX3kgPSB5O1xuICB9XG59KTtcblxuT2JqZWN0VmVjdG9yLnByb3RvdHlwZS5jdG9yID0gT2JqZWN0VmVjdG9yO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdFZlY3RvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFZlY3RvciA9IHJlcXVpcmUoJy4vVmVjdG9yLmpzJylcbiAgLCBGbG9hdDMyVmVjdG9yID0gcmVxdWlyZSgnLi9GbG9hdDMyVmVjdG9yLmpzJylcbiAgLCBPYmplY3RWZWN0b3IgPSByZXF1aXJlKCcuL09iamVjdFZlY3Rvci5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQXJyYXlWZWN0b3I6IFZlY3RvcixcbiAgT2JqZWN0VmVjdG9yOiBPYmplY3RWZWN0b3IsXG4gIEZsb2F0MzJWZWN0b3I6IEZsb2F0MzJWZWN0b3JcblxuICAvLyBUT0RPOiBBZGQgaW5zdGFuY2UgbWV0aG9kcyBpbiB0aGUgZnV0dXJlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFByaW1hcnkgVmVjdG9yIGNsYXNzLiBVc2VzIEFycmF5IHR5cGUgZm9yIGF4aXMgc3RvcmFnZS5cbiAqIEBjbGFzcyBWZWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFRoZSB4IGNvbXBvbmVudCBvZiB0aGlzIFZlY3RvclxuICogQHBhcmFtIHtOdW1iZXJ9IHkgVGhlIHkgY29tcG9uZW50IG9mIHRoaXMgVmVjdG9yXG4gKi9cbmZ1bmN0aW9uIFZlY3Rvcih4LCB5KSB7XG4gIGlmICh0aGlzIGluc3RhbmNlb2YgVmVjdG9yID09PSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgVmVjdG9yKHgsIHkpO1xuICB9XG5cbiAgdGhpcy5fYXhlcyA9IFt4LCB5XTtcbn1cbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yO1xuXG52YXIgcHJlY2lzaW9uID0gW1xuICAxLFxuICAxMCxcbiAgMTAwLFxuICAxMDAwLFxuICAxMDAwMCxcbiAgMTAwMDAwLFxuICAxMDAwMDAwLFxuICAxMDAwMDAwMCxcbiAgMTAwMDAwMDAwLFxuICAxMDAwMDAwMDAwLFxuICAxMDAwMDAwMDAwMFxuXTtcblxuVmVjdG9yLnByb3RvdHlwZSA9IHtcbiAgY3RvcjogVmVjdG9yLFxuXG4gIC8qKlxuICAgKiBTZXQgYm90aCB4IGFuZCB5XG4gICAqIEBwYXJhbSB4ICAgTmV3IHggdmFsXG4gICAqIEBwYXJhbSB5ICAgTmV3IHkgdmFsXG4gICAqL1xuICBzZXRBeGVzOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgeCBheGlzLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBnZXRYOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy54O1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgeCBheGlzLlxuICAgKi9cbiAgc2V0WDogZnVuY3Rpb24oeCkge1xuICAgIHRoaXMueCA9IHg7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHkgYXhpcy5cbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0WTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMueTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIHkgYXhpcy5cbiAgICovXG4gIHNldFk6IGZ1bmN0aW9uKHkpIHtcbiAgICB0aGlzLnkgPSB5O1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICAvKipcbiAgICogVmlldyB2ZWN0b3IgYXMgYSBzdHJpbmcgc3VjaCBhcyBcIlZlYzJEOiAoMCwgNClcIlxuICAgKiBAcGFyYW0gICB7Qm9vbGVhbn1cbiAgICogQHJldHVybiAge1N0cmluZ31cbiAgICovXG4gIHRvU3RyaW5nOiBmdW5jdGlvbihyb3VuZCkge1xuICAgIGlmIChyb3VuZCkge1xuICAgICAgcmV0dXJuICcoJyArIE1hdGgucm91bmQodGhpcy54KSArXG4gICAgICAgICcsICcgKyBNYXRoLnJvdW5kKHRoaXMueSkgKyAnKSc7XG4gICAgfVxuICAgIHJldHVybiAnKCcgKyB0aGlzLnggKyAnLCAnICsgdGhpcy55ICsgJyknO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFJldHVybiBhbiBhcnJheSBjb250YWluaW5nIHRoZSB2ZWN0b3IgYXhlcy5cbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuICB0b0FycmF5OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IEFycmF5KHRoaXMueCwgdGhpcy55KTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgdmVjdG9yIGF4ZXMuXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIHRvT2JqZWN0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogdGhpcy54LFxuICAgICAgeTogdGhpcy55XG4gICAgfTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIHByb3ZpZGVkIFZlY3RvciB0byB0aGlzIG9uZS5cbiAgICogQHBhcmFtIHtWZWN0b3J9IHZlY1xuICAgKi9cbiAgYWRkOiBmdW5jdGlvbih2ZWMpIHtcbiAgICB0aGlzLnggKz0gdmVjLng7XG4gICAgdGhpcy55ICs9IHZlYy55O1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFN1YnRyYWN0IHRoZSBwcm92aWRlZCB2ZWN0b3IgZnJvbSB0aGlzIG9uZS5cbiAgICogQHBhcmFtIHtWZWN0b3J9IHZlY1xuICAgKi9cbiAgc3VidHJhY3Q6IGZ1bmN0aW9uKHZlYykge1xuICAgIHRoaXMueCAtPSB2ZWMueDtcbiAgICB0aGlzLnkgLT0gdmVjLnk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICAvKipcbiAgICogQ2hlY2sgaXMgdGhlIHZlY3RvciBwcm92aWRlZCBlcXVhbCB0byB0aGlzIG9uZS5cbiAgICogQHBhcmFtICAge1ZlYzJEfSAgIHZlY1xuICAgKiBAcmV0dXJuICB7Qm9vbGVhbn1cbiAgICovXG4gIGVxdWFsczogZnVuY3Rpb24odmVjKSB7XG4gICAgcmV0dXJuICh2ZWMueCA9PSB0aGlzLnggJiYgdmVjLnkgPT0gdGhpcy55KTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBNdWx0aXBseSB0aGlzIHZlY3RvciBieSB0aGUgcHJvdmlkZWQgdmVjdG9yLlxuICAgKiBAcGFyYW0ge1ZlY3Rvcn0gdmVjXG4gICAqL1xuICBtdWx0aXBseUJ5VmVjdG9yOiBmdW5jdGlvbih2ZWMpIHtcbiAgICB0aGlzLnggKj0gdmVjLng7XG4gICAgdGhpcy55ICo9IHZlYy55O1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBtdWxWOiBmdW5jdGlvbih2KSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbHlCeVZlY3Rvcih2KTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBNdWx0aXBseSB0aGlzIHZlY3RvciBieSB0aGUgcHJvdmlkZWQgdmVjdG9yLlxuICAgKiBAcGFyYW0ge1ZlY3Rvcn0gdmVjXG4gICAqL1xuICBkaXZpZGVCeVZlY3RvcjogZnVuY3Rpb24odmVjKSB7XG4gICAgdGhpcy54IC89IHZlYy54O1xuICAgIHRoaXMueSAvPSB2ZWMueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgZGl2VjogZnVuY3Rpb24odikge1xuICAgIHJldHVybiB0aGlzLmRpdmlkZUJ5VmVjdG9yKHYpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIE11bHRpcGx5IHRoaXMgdmVjdG9yIGJ5IHRoZSBwcm92aWRlZCBudW1iZXJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICovXG4gIG11bHRpcGx5QnlTY2FsYXI6IGZ1bmN0aW9uKG4pIHtcbiAgICB0aGlzLnggKj0gbjtcbiAgICB0aGlzLnkgKj0gbjtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBtdWxTOiBmdW5jdGlvbihuKSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbHlCeVNjYWxhcihuKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBEaXZpdmUgdGhpcyB2ZWN0b3IgYnkgdGhlIHByb3ZpZGVkIG51bWJlclxuICAgKiBAcGFyYW0ge051bWJlcn0gblxuICAgKi9cbiAgZGl2aWRlQnlTY2FsYXI6IGZ1bmN0aW9uKG4pIHtcbiAgICB0aGlzLnggLz0gbjtcbiAgICB0aGlzLnkgLz0gbjtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgZGl2UzogZnVuY3Rpb24obikge1xuICAgIHJldHVybiB0aGlzLmRpdmlkZUJ5U2NhbGFyKG4pO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIE5vcm1hbGlzZSB0aGlzIHZlY3Rvci4gRGlyZWN0bHkgYWZmZWN0cyB0aGlzIHZlY3Rvci5cbiAgICogVXNlIFZlYzJELm5vcm1hbGlzZSh2ZWN0b3IpIHRvIGNyZWF0ZSBhIG5vcm1hbGlzZWQgY2xvbmUgb2YgdGhpcy5cbiAgICovXG4gIG5vcm1hbGlzZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2aWRlQnlTY2FsYXIodGhpcy5tYWduaXR1ZGUoKSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogRm9yIEFtZXJpY2FuIHNwZWxsaW5nLlxuICAgKiBTYW1lIGFzIHVuaXQvbm9ybWFsaXNlIGZ1bmN0aW9uLlxuICAgKi9cbiAgbm9ybWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5ub3JtYWxpc2UoKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBUaGUgc2FtZSBhcyBub3JtYWxpc2UuXG4gICAqL1xuICB1bml0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5ub3JtYWxpc2UoKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG1hZ25pdHVkZSAobGVuZ3RoKSBvZiB0aGlzIHZlY3Rvci5cbiAgICogQHJldHVybiAge051bWJlcn1cbiAgICovXG4gIG1hZ25pdHVkZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHggPSB0aGlzLngsXG4gICAgICB5ID0gdGhpcy55O1xuXG4gICAgcmV0dXJuIE1hdGguc3FydCgoeCAqIHgpICsgKHkgKiB5KSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBtYWduaXR1ZGUgKGxlbmd0aCkgb2YgdGhpcyB2ZWN0b3IuXG4gICAqIEByZXR1cm4gIHtOdW1iZXJ9XG4gICAqL1xuICBsZW5ndGg6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hZ25pdHVkZSgpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgc3F1cmVkIGxlbmd0aCBvZiBhIHZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBsZW5ndGhTcTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHggPSB0aGlzLngsXG4gICAgICB5ID0gdGhpcy55O1xuXG4gICAgcmV0dXJuICh4ICogeCkgKyAoeSAqIHkpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgZG90IHByb2R1Y3Qgb2YgdGhpcyB2ZWN0b3IgYnkgYW5vdGhlci5cbiAgICogQHBhcmFtICAge1ZlY3Rvcn0gdmVjXG4gICAqIEByZXR1cm4gIHtOdW1iZXJ9XG4gICAqL1xuICBkb3Q6IGZ1bmN0aW9uKHZlYykge1xuICAgIHJldHVybiAodmVjLnggKiB0aGlzLngpICsgKHZlYy55ICogdGhpcy55KTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdGhpcyB2ZWN0b3IgYnkgYW5vdGhlci5cbiAgICogQHBhcmFtICAge1ZlY3Rvcn0gdmVjXG4gICAqIEByZXR1cm4gIHtOdW1iZXJ9XG4gICAqL1xuICBjcm9zczogZnVuY3Rpb24odmVjKSB7XG4gICAgcmV0dXJuICgodGhpcy54ICogdmVjLnkpIC0gKHRoaXMueSAqIHZlYy54KSk7XG4gIH0sXG5cblxuICAvKipcbiAgICogUmV2ZXJzZXMgdGhpcyB2ZWN0b3IuXG4gICAqL1xuICByZXZlcnNlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnggPSAtdGhpcy54O1xuICAgIHRoaXMueSA9IC10aGlzLnk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cblxuICAvKipcbiAgICogQ29udmVydCB2ZWN0b3IgdG8gYWJzb2x1dGUgdmFsdWVzLlxuICAgKiBAcGFyYW0gICB7VmVjdG9yfSB2ZWNcbiAgICovXG4gIGFiczogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy54ID0gTWF0aC5hYnModGhpcy54KTtcbiAgICB0aGlzLnkgPSBNYXRoLmFicyh0aGlzLnkpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgbGltaXQ6IGZ1bmN0aW9uKG1heCkge1xuICAgIGlmICh0aGlzLm1hZ25pdHVkZSgpID4gbWF4KSB7XG5cdFx0ICB0aGlzLm5vcm1hbGl6ZSgpO1xuXHRcdCAgdGhpcy5tdWxTKG1heCk7XG5cdCAgfVxuICB9LFxuXG5cbiAgLyoqXG4gICAqIFplcm9lcyB0aGUgdmVjdG9yXG4gICAqIEByZXR1cm4gIHtWZWN0b3J9XG4gICAqL1xuICB6ZXJvOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnggPSB0aGlzLnkgPSAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIERpc3RhbmNlIGJldHdlZW4gdGhpcyB2ZWN0b3IgYW5kIGFub3RoZXIuXG4gICAqIEBwYXJhbSB7VmVjdG9yfSB2XG4gICAqL1xuICBkaXN0YW5jZTogZnVuY3Rpb24gKHYpIHtcbiAgICB2YXIgeCA9IHRoaXMueCAtIHYueDtcbiAgICB2YXIgeSA9IHRoaXMueSAtIHYueTtcblxuICAgIHJldHVybiBNYXRoLnNxcnQoKHggKiB4KSArICh5ICogeSkpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFJvdGF0ZSB0aGUgdmV0b3IgYnkgcHJvdmlkZWQgcmFkaWFucy5cbiAgICogQHBhcmFtICAge051bWJlcn0gIHJhZHNcbiAgICogQHJldHVybiAge1ZlY3Rvcn1cbiAgICovXG4gIHJvdGF0ZTogZnVuY3Rpb24ocmFkcykge1xuICAgIHZhciBjb3MgPSBNYXRoLmNvcyhyYWRzKSxcbiAgICAgIHNpbiA9IE1hdGguc2luKHJhZHMpO1xuXG4gICAgdmFyIG94ID0gdGhpcy54LFxuICAgICAgb3kgPSB0aGlzLnk7XG5cbiAgICB0aGlzLnggPSBveCAqIGNvcyAtIG95ICogc2luO1xuICAgIHRoaXMueSA9IG94ICogc2luICsgb3kgKiBjb3M7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBSb3VuZCB0aGlzIHZlY3RvciB0byBuIGRlY2ltYWwgcGxhY2VzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgblxuICAgKi9cbiAgcm91bmQ6IGZ1bmN0aW9uKG4pIHtcbiAgICAvLyBEZWZhdWx0IGlzIHR3byBkZWNpbWFsc1xuICAgIG4gPSBuIHx8IDI7XG5cbiAgICB2YXIgcCA9IHByZWNpc2lvbltuXTtcblxuICAgIC8vIFRoaXMgcGVyZm9ybXMgd2FhYXkgYmV0dGVyIHRoYW4gdG9GaXhlZCBhbmQgZ2l2ZSBGbG9hdDMyIHRoZSBlZGdlIGFnYWluLlxuICAgIC8vIGh0dHA6Ly93d3cuZHluYW1pY2d1cnUuY29tL2phdmFzY3JpcHQvcm91bmQtbnVtYmVycy13aXRoLXByZWNpc2lvbi9cbiAgICB0aGlzLnggPSAoKDAuNSArICh0aGlzLnggKiBwKSkgPDwgMCkgLyBwO1xuICAgIHRoaXMueSA9ICgoMC41ICsgKHRoaXMueSAqIHApKSA8PCAwKSAvIHA7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBjb3B5IG9mIHRoaXMgdmVjdG9yLlxuICAgKiBAcmV0dXJuIHtWZWN0b3J9XG4gICAqL1xuICBjbG9uZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmN0b3IodGhpcy54LCB0aGlzLnkpO1xuICB9XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVmVjdG9yLnByb3RvdHlwZSwgJ3gnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9heGVzWzBdO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgdGhpcy5fYXhlc1swXSA9IHg7XG4gIH1cbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVmVjdG9yLnByb3RvdHlwZSwgJ3knLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9heGVzWzFdO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uICh5KSB7XG4gICAgdGhpcy5fYXhlc1sxXSA9IHk7XG4gIH1cbn0pO1xuIiwiICAvKipcbiAgICogQSBjbGFzcyB0byBkZXNjcmliZSBhIHR3byBvciB0aHJlZSBkaW1lbnNpb25hbCB2ZWN0b3IsIHNwZWNpZmljYWxseVxuICAgKiBhIEV1Y2xpZGVhbiAoYWxzbyBrbm93biBhcyBnZW9tZXRyaWMpIHZlY3Rvci4gQSB2ZWN0b3IgaXMgYW4gZW50aXR5XG4gICAqIHRoYXQgaGFzIGJvdGggbWFnbml0dWRlIGFuZCBkaXJlY3Rpb24uIFRoZSBkYXRhdHlwZSwgaG93ZXZlciwgc3RvcmVzXG4gICAqIHRoZSBjb21wb25lbnRzIG9mIHRoZSB2ZWN0b3IgKHgseSBmb3IgMkQsIGFuZCB4LHkseiBmb3IgM0QpLiBUaGUgbWFnbml0dWRlXG4gICAqIGFuZCBkaXJlY3Rpb24gY2FuIGJlIGFjY2Vzc2VkIHZpYSB0aGUgbWV0aG9kcyBtYWcoKSBhbmQgaGVhZGluZygpLiBJbiBtYW55XG4gICAqIG9mIHRoZSBwNS5qcyBleGFtcGxlcywgeW91IHdpbGwgc2VlIFZlY3RvciB1c2VkIHRvIGRlc2NyaWJlIGEgcG9zaXRpb24sXG4gICAqIHZlbG9jaXR5LCBvciBhY2NlbGVyYXRpb24uIEZvciBleGFtcGxlLCBpZiB5b3UgY29uc2lkZXIgYSByZWN0YW5nbGUgbW92aW5nXG4gICAqIGFjcm9zcyB0aGUgc2NyZWVuLCBhdCBhbnkgZ2l2ZW4gaW5zdGFudCBpdCBoYXMgYSBwb3NpdGlvbiAoYSB2ZWN0b3IgdGhhdFxuICAgKiBwb2ludHMgZnJvbSB0aGUgb3JpZ2luIHRvIGl0cyBsb2NhdGlvbiksIGEgdmVsb2NpdHkgKHRoZSByYXRlIGF0IHdoaWNoIHRoZVxuICAgKiBvYmplY3QncyBwb3NpdGlvbiBjaGFuZ2VzIHBlciB0aW1lIHVuaXQsIGV4cHJlc3NlZCBhcyBhIHZlY3RvciksIGFuZFxuICAgKiBhY2NlbGVyYXRpb24gKHRoZSByYXRlIGF0IHdoaWNoIHRoZSBvYmplY3QncyB2ZWxvY2l0eSBjaGFuZ2VzIHBlciB0aW1lXG4gICAqIHVuaXQsIGV4cHJlc3NlZCBhcyBhIHZlY3RvcikuIFNpbmNlIHZlY3RvcnMgcmVwcmVzZW50IGdyb3VwaW5ncyBvZiB2YWx1ZXMsXG4gICAqIHdlIGNhbm5vdCBzaW1wbHkgdXNlIHRyYWRpdGlvbmFsIGFkZGl0aW9uL211bHRpcGxpY2F0aW9uL2V0Yy4gSW5zdGVhZCxcbiAgICogd2UnbGwgbmVlZCB0byBkbyBzb21lIFwidmVjdG9yXCIgbWF0aCwgd2hpY2ggaXMgbWFkZSBlYXN5IGJ5IHRoZSBtZXRob2RzXG4gICAqIGluc2lkZSB0aGUgVmVjdG9yIGNsYXNzLlxuICAgKlxuICAgKiBAY2xhc3MgVmVjdG9yXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge051bWJlcn0gW3hdIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt5XSB5IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbel0geiBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2PlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDQwLCA1MCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3Rvcig0MCwgNTApO1xuICAgKlxuICAgKiBlbGxpcHNlKHYxLngsIHYxLnksIDUwLCA1MCk7XG4gICAqIGVsbGlwc2UodjIueCwgdjIueSwgNTAsIDUwKTtcbiAgICogdjEuYWRkKHYyKTtcbiAgICogZWxsaXBzZSh2MS54LCB2MS55LCA1MCwgNTApO1xuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgdmFyIFZlY3RvciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXSB8fCAwO1xuXHRcdHRoaXMueSA9IGFyZ3VtZW50c1sxXSB8fCAwO1xuXHRcdHRoaXMueiA9IGFyZ3VtZW50c1syXSB8fCAwO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgdmVjdG9yIHYgYnkgY2FsbGluZyBTdHJpbmcodilcbiAgICogb3Igdi50b1N0cmluZygpLiBUaGlzIG1ldGhvZCBpcyB1c2VmdWwgZm9yIGxvZ2dpbmcgdmVjdG9ycyBpbiB0aGVcbiAgICogY29uc29sZS5cbiAgICogQG1ldGhvZCAgdG9TdHJpbmdcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcyA9IFwibm9yZW5kZXJcIj48Y29kZT5cbiAgICogZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAqICAgdmFyIHYgPSBjcmVhdGVWZWN0b3IoMjAsMzApO1xuICAgKiAgIHByaW50KFN0cmluZyh2KSk7IC8vIHByaW50cyBcIlZlY3RvciBPYmplY3QgOiBbMjAsIDMwLCAwXVwiXG4gICAqIH1cbiAgICogPC9kaXY+PC9jb2RlPlxuICAgKlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnVmVjdG9yIE9iamVjdCA6IFsnKyB0aGlzLnggKycsICcrIHRoaXMueSArJywgJysgdGhpcy56ICsgJ10nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB4LCB5LCBhbmQgeiBjb21wb25lbnQgb2YgdGhlIHZlY3RvciB1c2luZyB0d28gb3IgdGhyZWUgc2VwYXJhdGVcbiAgICogdmFyaWFibGVzLCB0aGUgZGF0YSBmcm9tIGEgVmVjdG9yLCBvciB0aGUgdmFsdWVzIGZyb20gYSBmbG9hdCBhcnJheS5cbiAgICogQG1ldGhvZCBzZXRcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ8VmVjdG9yfEFycmF5fSBbeF0gdGhlIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3Igb3IgYVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWN0b3Igb3IgYW4gQXJyYXlcbiAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbeV0gdGhlIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbel0gdGhlIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICogICAgdmFyIHYgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqICAgIHYuc2V0KDQsNSw2KTsgLy8gU2V0cyB2ZWN0b3IgdG8gWzQsIDUsIDZdXG4gICAqXG4gICAqICAgIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigwLCAwLCAwKTtcbiAgICogICAgdmFyIGFyciA9IFsxLCAyLCAzXTtcbiAgICogICAgdjEuc2V0KGFycik7IC8vIFNldHMgdmVjdG9yIHRvIFsxLCAyLCAzXVxuICAgKiB9XG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IpIHtcbiAgICAgIHRoaXMueCA9IHgueCB8fCAwO1xuICAgICAgdGhpcy55ID0geC55IHx8IDA7XG4gICAgICB0aGlzLnogPSB4LnogfHwgMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICB0aGlzLnggPSB4WzBdIHx8IDA7XG4gICAgICB0aGlzLnkgPSB4WzFdIHx8IDA7XG4gICAgICB0aGlzLnogPSB4WzJdIHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdGhpcy54ID0geCB8fCAwO1xuICAgIHRoaXMueSA9IHkgfHwgMDtcbiAgICB0aGlzLnogPSB6IHx8IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldHMgYSBjb3B5IG9mIHRoZSB2ZWN0b3IsIHJldHVybnMgYSBWZWN0b3Igb2JqZWN0LlxuICAgKlxuICAgKiBAbWV0aG9kIGNvcHlcbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgY29weSBvZiB0aGUgVmVjdG9yIG9iamVjdFxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdmFyIHYyID0gdi5jb3B5KCk7XG4gICAqIHByaW50KHYxLnggPT0gdjIueCAmJiB2MS55ID09IHYyLnkgJiYgdjEueiA9PSB2Mi56KTtcbiAgICogLy8gUHJpbnRzIFwidHJ1ZVwiXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54LHRoaXMueSx0aGlzLnopO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGRzIHgsIHksIGFuZCB6IGNvbXBvbmVudHMgdG8gYSB2ZWN0b3IsIGFkZHMgb25lIHZlY3RvciB0byBhbm90aGVyLCBvclxuICAgKiBhZGRzIHR3byBpbmRlcGVuZGVudCB2ZWN0b3JzIHRvZ2V0aGVyLiBUaGUgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIHRoYXQgYWRkc1xuICAgKiB0d28gdmVjdG9ycyB0b2dldGhlciBpcyBhIHN0YXRpYyBtZXRob2QgYW5kIHJldHVybnMgYSBWZWN0b3IsIHRoZSBvdGhlcnNcbiAgICogYWN0cyBkaXJlY3RseSBvbiB0aGUgdmVjdG9yLiBTZWUgdGhlIGV4YW1wbGVzIGZvciBtb3JlIGNvbnRleHQuXG4gICAqXG4gICAqIEBtZXRob2QgYWRkXG4gICAqIEBjaGFpbmFibGVcbiAgICogQHBhcmFtICB7TnVtYmVyfFZlY3RvcnxBcnJheX0geCAgIHRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIHRvIGJlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRlZCBvciBhIFZlY3RvciBvciBhbiBBcnJheVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbeV0gdGhlIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3IgdG8gYmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkXG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIFt6XSB0aGUgeiBjb21wb25lbnQgb2YgdGhlIHZlY3RvciB0byBiZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWRcbiAgICogQHJldHVybiB7VmVjdG9yfSAgICAgICAgICAgICAgICAgIHRoZSBWZWN0b3Igb2JqZWN0LlxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2LmFkZCg0LDUsNik7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0byBbNSwgNywgOV1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDIsIDMsIDQpO1xuICAgKlxuICAgKiB2YXIgdjMgPSBWZWN0b3IuYWRkKHYxLCB2Mik7XG4gICAqIC8vIHYzIGhhcyBjb21wb25lbnRzIFszLCA1LCA3XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yKSB7XG4gICAgICB0aGlzLnggKz0geC54IHx8IDA7XG4gICAgICB0aGlzLnkgKz0geC55IHx8IDA7XG4gICAgICB0aGlzLnogKz0geC56IHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgdGhpcy54ICs9IHhbMF0gfHwgMDtcbiAgICAgIHRoaXMueSArPSB4WzFdIHx8IDA7XG4gICAgICB0aGlzLnogKz0geFsyXSB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRoaXMueCArPSB4IHx8IDA7XG4gICAgdGhpcy55ICs9IHkgfHwgMDtcbiAgICB0aGlzLnogKz0geiB8fCAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTdWJ0cmFjdHMgeCwgeSwgYW5kIHogY29tcG9uZW50cyBmcm9tIGEgdmVjdG9yLCBzdWJ0cmFjdHMgb25lIHZlY3RvciBmcm9tXG4gICAqIGFub3RoZXIsIG9yIHN1YnRyYWN0cyB0d28gaW5kZXBlbmRlbnQgdmVjdG9ycy4gVGhlIHZlcnNpb24gb2YgdGhlIG1ldGhvZFxuICAgKiB0aGF0IHN1YnRyYWN0cyB0d28gdmVjdG9ycyBpcyBhIHN0YXRpYyBtZXRob2QgYW5kIHJldHVybnMgYSBWZWN0b3IsIHRoZVxuICAgKiBvdGhlciBhY3RzIGRpcmVjdGx5IG9uIHRoZSB2ZWN0b3IuIFNlZSB0aGUgZXhhbXBsZXMgZm9yIG1vcmUgY29udGV4dC5cbiAgICpcbiAgICogQG1ldGhvZCBzdWJcbiAgICogQGNoYWluYWJsZVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ8VmVjdG9yfEFycmF5fSB4ICAgdGhlIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3Igb3IgYVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVjdG9yIG9yIGFuIEFycmF5XG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIFt5XSB0aGUgeSBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbel0gdGhlIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHJldHVybiB7VmVjdG9yfSAgICAgICAgICAgICAgICAgIFZlY3RvciBvYmplY3QuXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoNCwgNSwgNik7XG4gICAqIHYuc3ViKDEsIDEsIDEpO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG8gWzMsIDQsIDVdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMiwgMywgNCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICpcbiAgICogdmFyIHYzID0gVmVjdG9yLnN1Yih2MSwgdjIpO1xuICAgKiAvLyB2MyBoYXMgY29tcG5lbnRzIFsxLCAxLCAxXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yKSB7XG4gICAgICB0aGlzLnggLT0geC54IHx8IDA7XG4gICAgICB0aGlzLnkgLT0geC55IHx8IDA7XG4gICAgICB0aGlzLnogLT0geC56IHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgdGhpcy54IC09IHhbMF0gfHwgMDtcbiAgICAgIHRoaXMueSAtPSB4WzFdIHx8IDA7XG4gICAgICB0aGlzLnogLT0geFsyXSB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRoaXMueCAtPSB4IHx8IDA7XG4gICAgdGhpcy55IC09IHkgfHwgMDtcbiAgICB0aGlzLnogLT0geiB8fCAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBNdWx0aXBseSB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLiBUaGUgc3RhdGljIHZlcnNpb24gb2YgdGhpcyBtZXRob2RcbiAgICogY3JlYXRlcyBhIG5ldyBWZWN0b3Igd2hpbGUgdGhlIG5vbiBzdGF0aWMgdmVyc2lvbiBhY3RzIG9uIHRoZSB2ZWN0b3JcbiAgICogZGlyZWN0bHkuIFNlZSB0aGUgZXhhbXBsZXMgZm9yIG1vcmUgY29udGV4dC5cbiAgICpcbiAgICogQG1ldGhvZCBtdWx0XG4gICAqIEBjaGFpbmFibGVcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICBuIHRoZSBudW1iZXIgdG8gbXVsdGlwbHkgd2l0aCB0aGUgdmVjdG9yXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gYSByZWZlcmVuY2UgdG8gdGhlIFZlY3RvciBvYmplY3QgKGFsbG93IGNoYWluaW5nKVxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2Lm11bHQoMik7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0byBbMiwgNCwgNl1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdmFyIHYyID0gVmVjdG9yLm11bHQodjEsIDIpO1xuICAgKiAvLyB2MiBoYXMgY29tcG5lbnRzIFsyLCA0LCA2XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5tdWx0ID0gZnVuY3Rpb24gKG4pIHtcbiAgICB0aGlzLnggKj0gbiB8fCAwO1xuICAgIHRoaXMueSAqPSBuIHx8IDA7XG4gICAgdGhpcy56ICo9IG4gfHwgMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogRGl2aWRlIHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuIFRoZSBzdGF0aWMgdmVyc2lvbiBvZiB0aGlzIG1ldGhvZCBjcmVhdGVzIGFcbiAgICogbmV3IFZlY3RvciB3aGlsZSB0aGUgbm9uIHN0YXRpYyB2ZXJzaW9uIGFjdHMgb24gdGhlIHZlY3RvciBkaXJlY3RseS5cbiAgICogU2VlIHRoZSBleGFtcGxlcyBmb3IgbW9yZSBjb250ZXh0LlxuICAgKlxuICAgKiBAbWV0aG9kIGRpdlxuICAgKiBAY2hhaW5hYmxlXG4gICAqIEBwYXJhbSAge251bWJlcn0gICAgbiB0aGUgbnVtYmVyIHRvIGRpdmlkZSB0aGUgdmVjdG9yIGJ5XG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gYSByZWZlcmVuY2UgdG8gdGhlIFZlY3RvciBvYmplY3QgKGFsbG93IGNoYWluaW5nKVxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDYsIDQsIDIpO1xuICAgKiB2LmRpdigyKTsgLy92J3MgY29tcG5lbnRzIGFyZSBzZXQgdG8gWzMsIDIsIDFdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgID0gY3JlYXRlVmVjdG9yKDYsIDQsIDIpO1xuICAgKiB2YXIgdjIgPSBWZWN0b3IuZGl2KHYsIDIpO1xuICAgKiAvLyB2MiBoYXMgY29tcG5lbnRzIFszLCAyLCAxXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbiAobikge1xuICAgIHRoaXMueCAvPSBuO1xuICAgIHRoaXMueSAvPSBuO1xuICAgIHRoaXMueiAvPSBuO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBtYWduaXR1ZGUgKGxlbmd0aCkgb2YgdGhlIHZlY3RvciBhbmQgcmV0dXJucyB0aGUgcmVzdWx0IGFzXG4gICAqIGEgZmxvYXQgKHRoaXMgaXMgc2ltcGx5IHRoZSBlcXVhdGlvbiBzcXJ0KHgqeCArIHkqeSArIHoqeikuKVxuICAgKlxuICAgKiBAbWV0aG9kIG1hZ1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IG1hZ25pdHVkZSBvZiB0aGUgdmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMjAuMCwgMzAuMCwgNDAuMCk7XG4gICAqIHZhciBtID0gdi5tYWcoMTApO1xuICAgKiBwcmludChtKTsgLy8gUHJpbnRzIFwiNTMuODUxNjQ4MDcxMzQ1MDRcIlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5tYWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLm1hZ1NxKCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIG1hZ25pdHVkZSBvZiB0aGUgdmVjdG9yIGFuZCByZXR1cm5zIHRoZSByZXN1bHRcbiAgICogYXMgYSBmbG9hdCAodGhpcyBpcyBzaW1wbHkgdGhlIGVxdWF0aW9uIDxlbT4oeCp4ICsgeSp5ICsgeip6KTwvZW0+LilcbiAgICogRmFzdGVyIGlmIHRoZSByZWFsIGxlbmd0aCBpcyBub3QgcmVxdWlyZWQgaW4gdGhlXG4gICAqIGNhc2Ugb2YgY29tcGFyaW5nIHZlY3RvcnMsIGV0Yy5cbiAgICpcbiAgICogQG1ldGhvZCBtYWdTcVxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHNxdWFyZWQgbWFnbml0dWRlIG9mIHRoZSB2ZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3Rvcig2LCA0LCAyKTtcbiAgICogcHJpbnQodjEubWFnU3EoKSk7IC8vIFByaW50cyBcIjU2XCJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUubWFnU3EgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHggPSB0aGlzLngsIHkgPSB0aGlzLnksIHogPSB0aGlzLno7XG4gICAgcmV0dXJuICh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjdG9ycy4gVGhlIHZlcnNpb24gb2YgdGhlIG1ldGhvZFxuICAgKiB0aGF0IGNvbXB1dGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gaW5kZXBlbmRlbnQgdmVjdG9ycyBpcyBhIHN0YXRpY1xuICAgKiBtZXRob2QuIFNlZSB0aGUgZXhhbXBsZXMgZm9yIG1vcmUgY29udGV4dC5cbiAgICpcbiAgICpcbiAgICogQG1ldGhvZCBkb3RcbiAgICogQHBhcmFtICB7TnVtYmVyfFZlY3Rvcn0geCAgIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3Igb3IgYSBWZWN0b3JcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgW3ldIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgW3pdIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgICAgICAgICAgICAgdGhlIGRvdCBwcm9kdWN0XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMiwgMywgNCk7XG4gICAqXG4gICAqIHByaW50KHYxLmRvdCh2MikpOyAvLyBQcmludHMgXCIyMFwiXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy9TdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDMsIDIsIDEpO1xuICAgKiBwcmludCAoVmVjdG9yLmRvdCh2MSwgdjIpKTsgLy8gUHJpbnRzIFwiMTBcIlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5kb3QoeC54LCB4LnksIHgueik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnggKiAoeCB8fCAwKSArXG4gICAgICAgICAgIHRoaXMueSAqICh5IHx8IDApICtcbiAgICAgICAgICAgdGhpcy56ICogKHogfHwgMCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgYSB2ZWN0b3IgY29tcG9zZWQgb2YgdGhlIGNyb3NzIHByb2R1Y3QgYmV0d2VlblxuICAgKiB0d28gdmVjdG9ycy4gQm90aCB0aGUgc3RhdGljIGFuZCBub24gc3RhdGljIG1ldGhvZHMgcmV0dXJuIGEgbmV3IFZlY3Rvci5cbiAgICogU2VlIHRoZSBleGFtcGxlcyBmb3IgbW9yZSBjb250ZXh0LlxuICAgKlxuICAgKiBAbWV0aG9kIGNyb3NzXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdiBWZWN0b3IgdG8gYmUgY3Jvc3NlZFxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgVmVjdG9yIGNvbXBvc2VkIG9mIGNyb3NzIHByb2R1Y3RcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICpcbiAgICogdjEuY3Jvc3ModjIpOyAvLyB2J3MgY29tcG9uZW50cyBhcmUgWzAsIDAsIDBdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMCwgMCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigwLCAxLCAwKTtcbiAgICpcbiAgICogdmFyIGNyb3NzUHJvZHVjdCA9IFZlY3Rvci5jcm9zcyh2MSwgdjIpO1xuICAgKiAvLyBjcm9zc1Byb2R1Y3QgaGFzIGNvbXBvbmVudHMgWzAsIDAsIDFdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24gKHYpIHtcbiAgICB2YXIgeCA9IHRoaXMueSAqIHYueiAtIHRoaXMueiAqIHYueTtcbiAgICB2YXIgeSA9IHRoaXMueiAqIHYueCAtIHRoaXMueCAqIHYuejtcbiAgICB2YXIgeiA9IHRoaXMueCAqIHYueSAtIHRoaXMueSAqIHYueDtcblxuXHRcdHJldHVybiBuZXcgVmVjdG9yKHgseSx6KTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgRXVjbGlkZWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50cyAoY29uc2lkZXJpbmcgYVxuICAgKiBwb2ludCBhcyBhIHZlY3RvciBvYmplY3QpLlxuICAgKlxuICAgKiBAbWV0aG9kIGRpc3RcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2IHRoZSB4LCB5LCBhbmQgeiBjb29yZGluYXRlcyBvZiBhIFZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICAgdGhlIGRpc3RhbmNlXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDAsIDApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMCwgMSwgMCk7XG4gICAqXG4gICAqIHZhciBkaXN0YW5jZSA9IHYxLmRpc3QodjIpOyAvLyBkaXN0YW5jZSBpcyAxLjQxNDIuLi5cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAwLCAwKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDAsIDEsIDApO1xuICAgKlxuICAgKiB2YXIgZGlzdGFuY2UgPSBWZWN0b3IuZGlzdCh2MSx2Mik7XG4gICAqIC8vIGRpc3RhbmNlIGlzIDEuNDE0Mi4uLlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5kaXN0ID0gZnVuY3Rpb24gKHYpIHtcbiAgICB2YXIgZCA9IHYuY29weSgpLnN1Yih0aGlzKTtcbiAgICByZXR1cm4gZC5tYWcoKTtcbiAgfTtcblxuICAvKipcbiAgICogTm9ybWFsaXplIHRoZSB2ZWN0b3IgdG8gbGVuZ3RoIDEgKG1ha2UgaXQgYSB1bml0IHZlY3RvcikuXG4gICAqXG4gICAqIEBtZXRob2Qgbm9ybWFsaXplXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gbm9ybWFsaXplZCBWZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxMCwgMjAsIDIpO1xuICAgKiAvLyB2IGhhcyBjb21wbmVudHMgWzEwLjAsIDIwLjAsIDIuMF1cbiAgICogdi5ub3JtYWxpemUoKTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvXG4gICAqIC8vIFswLjQ0NTQzNTQsIDAuODkwODcwOCwgMC4wODkwODcwODRdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXYodGhpcy5tYWcoKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIExpbWl0IHRoZSBtYWduaXR1ZGUgb2YgdGhpcyB2ZWN0b3IgdG8gdGhlIHZhbHVlIHVzZWQgZm9yIHRoZSA8Yj5tYXg8L2I+XG4gICAqIHBhcmFtZXRlci5cbiAgICpcbiAgICogQG1ldGhvZCBsaW1pdFxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgIG1heCB0aGUgbWF4aW11bSBtYWduaXR1ZGUgZm9yIHRoZSB2ZWN0b3JcbiAgICogQHJldHVybiB7VmVjdG9yfSAgICAgdGhlIG1vZGlmaWVkIFZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEwLCAyMCwgMik7XG4gICAqIC8vIHYgaGFzIGNvbXBuZW50cyBbMTAuMCwgMjAuMCwgMi4wXVxuICAgKiB2LmxpbWl0KDUpO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG9cbiAgICogLy8gWzIuMjI3MTc3MSwgNC40NTQzNTQzLCAwLjQ0NTQzNTRdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmxpbWl0ID0gZnVuY3Rpb24gKGwpIHtcbiAgICB2YXIgbVNxID0gdGhpcy5tYWdTcSgpO1xuICAgIGlmKG1TcSA+IGwqbCkge1xuICAgICAgdGhpcy5kaXYoTWF0aC5zcXJ0KG1TcSkpOyAvL25vcm1hbGl6ZSBpdFxuICAgICAgdGhpcy5tdWx0KGwpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHRoZSBtYWduaXR1ZGUgb2YgdGhpcyB2ZWN0b3IgdG8gdGhlIHZhbHVlIHVzZWQgZm9yIHRoZSA8Yj5sZW48L2I+XG4gICAqIHBhcmFtZXRlci5cbiAgICpcbiAgICogQG1ldGhvZCBzZXRNYWdcbiAgICogQHBhcmFtICB7bnVtYmVyfSAgICBsZW4gdGhlIG5ldyBsZW5ndGggZm9yIHRoaXMgdmVjdG9yXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgIHRoZSBtb2RpZmllZCBWZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMTAsIDIwLCAyKTtcbiAgICogLy8gdiBoYXMgY29tcG5lbnRzIFsxMC4wLCAyMC4wLCAyLjBdXG4gICAqIHYxLnNldE1hZygxMCk7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0byBbNi4wLCA4LjAsIDAuMF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuc2V0TWFnID0gZnVuY3Rpb24gKGxlbikge1xuICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpLm11bHQobGVuKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlIHRoZSBhbmdsZSBvZiByb3RhdGlvbiBmb3IgdGhpcyB2ZWN0b3IgKG9ubHkgMkQgdmVjdG9ycylcbiAgICpcbiAgICogQG1ldGhvZCBoZWFkaW5nXG4gICAqIEByZXR1cm4ge051bWJlcn0gdGhlIGFuZ2xlIG9mIHJvdGF0aW9uXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3MgPSBcIm5vcmVuZGVyXCI+PGNvZGU+XG4gICAqIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgKiAgIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigzMCw1MCk7XG4gICAqICAgcHJpbnQodjEuaGVhZGluZygpKTsgLy8gMS4wMzAzNzY4MjY1MjQzMTI1XG4gICAqXG4gICAqICAgdmFyIHYxID0gY3JlYXRlVmVjdG9yKDQwLDUwKTtcbiAgICogICBwcmludCh2MS5oZWFkaW5nKCkpOyAvLyAwLjg5NjA1NTM4NDU3MTM0MzlcbiAgICpcbiAgICogICB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMzAsNzApO1xuICAgKiAgIHByaW50KHYxLmhlYWRpbmcoKSk7IC8vIDEuMTY1OTA0NTQwNTA5ODEzMlxuICAgKiB9XG4gICAqIDwvZGl2PjwvY29kZT5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuaGVhZGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnksIHRoaXMueCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJvdGF0ZSB0aGUgdmVjdG9yIGJ5IGFuIGFuZ2xlIChvbmx5IDJEIHZlY3RvcnMpLCBtYWduaXR1ZGUgcmVtYWlucyB0aGVcbiAgICogc2FtZVxuICAgKlxuICAgKiBAbWV0aG9kIHJvdGF0ZVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9ICAgIGFuZ2xlIHRoZSBhbmdsZSBvZiByb3RhdGlvblxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSBtb2RpZmllZCBWZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxMC4wLCAyMC4wKTtcbiAgICogLy8gdiBoYXMgY29tcG5lbnRzIFsxMC4wLCAyMC4wLCAwLjBdXG4gICAqIHYucm90YXRlKEhBTEZfUEkpO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG8gWy0yMC4wLCA5Ljk5OTk5OSwgMC4wXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbiAoYW5nbGUpIHtcbiAgICB2YXIgbmV3SGVhZGluZyA9IHRoaXMuaGVhZGluZygpICsgYW5nbGU7XG4gICAgdmFyIG1hZyA9IHRoaXMubWFnKCk7XG4gICAgdGhpcy54ID0gTWF0aC5jb3MobmV3SGVhZGluZykgKiBtYWc7XG4gICAgdGhpcy55ID0gTWF0aC5zaW4obmV3SGVhZGluZykgKiBtYWc7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIExpbmVhciBpbnRlcnBvbGF0ZSB0aGUgdmVjdG9yIHRvIGFub3RoZXIgdmVjdG9yXG4gICAqXG4gICAqIEBtZXRob2QgbGVycFxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHggICB0aGUgeCBjb21wb25lbnQgb3IgdGhlIFZlY3RvciB0byBsZXJwIHRvXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gW3ldIHkgdGhlIHkgY29tcG9uZW50XG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gW3pdIHogdGhlIHogY29tcG9uZW50XG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgYW10IHRoZSBhbW91bnQgb2YgaW50ZXJwb2xhdGlvbjsgc29tZSB2YWx1ZSBiZXR3ZWVuIDAuMFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAob2xkIHZlY3RvcikgYW5kIDEuMCAobmV3IHZlY3RvcikuIDAuMSBpcyB2ZXJ5IG5lYXJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgdGhlIG5ldyB2ZWN0b3IuIDAuNSBpcyBoYWxmd2F5IGluIGJldHdlZW4uXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgIHRoZSBtb2RpZmllZCBWZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxLCAxLCAwKTtcbiAgICpcbiAgICogdi5sZXJwKDMsIDMsIDAsIDAuNSk7IC8vIHYgbm93IGhhcyBjb21wb25lbnRzIFsyLDIsMF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMCwgMCwgMCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigxMDAsIDEwMCwgMCk7XG4gICAqXG4gICAqIHZhciB2MyA9IFZlY3Rvci5sZXJwKHYxLCB2MiwgMC41KTtcbiAgICogLy8gdjMgaGFzIGNvbXBvbmVudHMgWzUwLDUwLDBdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmxlcnAgPSBmdW5jdGlvbiAoeCwgeSwgeiwgYW10KSB7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmxlcnAoeC54LCB4LnksIHgueiwgeSk7XG4gICAgfVxuICAgIHRoaXMueCArPSAoeCAtIHRoaXMueCkgKiBhbXQgfHwgMDtcbiAgICB0aGlzLnkgKz0gKHkgLSB0aGlzLnkpICogYW10IHx8IDA7XG4gICAgdGhpcy56ICs9ICh6IC0gdGhpcy56KSAqIGFtdCB8fCAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHZlY3RvciBhcyBhIGZsb2F0IGFycmF5LiBUaGlzIGlzIG9ubHlcbiAgICogZm9yIHRlbXBvcmFyeSB1c2UuIElmIHVzZWQgaW4gYW55IG90aGVyIGZhc2hpb24sIHRoZSBjb250ZW50cyBzaG91bGQgYmVcbiAgICogY29waWVkIGJ5IHVzaW5nIHRoZSA8Yj5WZWN0b3IuY29weSgpPC9iPiBtZXRob2QgdG8gY29weSBpbnRvIHlvdXIgb3duXG4gICAqIGFycmF5LlxuICAgKlxuICAgKiBAbWV0aG9kIGFycmF5XG4gICAqIEByZXR1cm4ge0FycmF5fSBhbiBBcnJheSB3aXRoIHRoZSAzIHZhbHVlc1xuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzID0gXCJub3JlbmRlclwiPjxjb2RlPlxuICAgKiBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICogICB2YXIgdiA9IGNyZWF0ZVZlY3RvcigyMCwzMCk7XG4gICAqICAgcHJpbnQodi5hcnJheSgpKTsgLy8gUHJpbnRzIDogQXJyYXkgWzIwLCAzMCwgMF1cbiAgICogfVxuICAgKiA8L2Rpdj48L2NvZGU+XG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMTAuMCwgMjAuMCwgMzAuMCk7XG4gICAqIHZhciBmID0gdi5hcnJheSgpO1xuICAgKiBwcmludChmWzBdKTsgLy8gUHJpbnRzIFwiMTAuMFwiXG4gICAqIHByaW50KGZbMV0pOyAvLyBQcmludHMgXCIyMC4wXCJcbiAgICogcHJpbnQoZlsyXSk7IC8vIFByaW50cyBcIjMwLjBcIlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5hcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gW3RoaXMueCB8fCAwLCB0aGlzLnkgfHwgMCwgdGhpcy56IHx8IDBdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBFcXVhbGl0eSBjaGVjayBhZ2FpbnN0IGEgVmVjdG9yXG4gICAqXG4gICAqIEBtZXRob2QgZXF1YWxzXG4gICAqIEBwYXJhbSB7TnVtYmVyfFZlY3RvcnxBcnJheX0gW3hdIHRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIG9yIGFcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVjdG9yIG9yIGFuIEFycmF5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3ldIHRoZSB5IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3pdIHRoZSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgdGhlIHZlY3RvcnMgYXJlIGVxdWFsc1xuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzID0gXCJub3JlbmRlclwiPjxjb2RlPlxuICAgKiB2MSA9IGNyZWF0ZVZlY3Rvcig1LDEwLDIwKTtcbiAgICogdjIgPSBjcmVhdGVWZWN0b3IoNSwxMCwyMCk7XG4gICAqIHYzID0gY3JlYXRlVmVjdG9yKDEzLDEwLDE5KTtcbiAgICpcbiAgICogcHJpbnQodjEuZXF1YWxzKHYyLngsdjIueSx2Mi56KSk7IC8vIHRydWVcbiAgICogcHJpbnQodjEuZXF1YWxzKHYzLngsdjMueSx2My56KSk7IC8vIGZhbHNlXG4gICAqIDwvZGl2PjwvY29kZT5cbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMTAuMCwgMjAuMCwgMzAuMCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigxMC4wLCAyMC4wLCAzMC4wKTtcbiAgICogdmFyIHYzID0gY3JlYXRlVmVjdG9yKDAuMCwgMC4wLCAwLjApO1xuICAgKiBwcmludCAodjEuZXF1YWxzKHYyKSkgLy8gdHJ1ZVxuICAgKiBwcmludCAodjEuZXF1YWxzKHYzKSkgLy8gZmFsc2VcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICB2YXIgYSwgYiwgYztcbiAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuICAgICAgYSA9IHgueCB8fCAwO1xuICAgICAgYiA9IHgueSB8fCAwO1xuICAgICAgYyA9IHgueiB8fCAwO1xuICAgIH0gZWxzZSBpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBhID0geFswXSB8fCAwO1xuICAgICAgYiA9IHhbMV0gfHwgMDtcbiAgICAgIGMgPSB4WzJdIHx8IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGEgPSB4IHx8IDA7XG4gICAgICBiID0geSB8fCAwO1xuICAgICAgYyA9IHogfHwgMDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMueCA9PT0gYSAmJiB0aGlzLnkgPT09IGIgJiYgdGhpcy56ID09PSBjO1xuICB9O1xuXG5cbiAgLy8gU3RhdGljIE1ldGhvZHNcblxuXG4gIC8qKlxuICAgKiBNYWtlIGEgbmV3IDJEIHVuaXQgdmVjdG9yIGZyb20gYW4gYW5nbGVcbiAgICpcbiAgICogQG1ldGhvZCBmcm9tQW5nbGVcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge051bWJlcn0gICAgIGFuZ2xlIHRoZSBkZXNpcmVkIGFuZ2xlXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgICAgdGhlIG5ldyBWZWN0b3Igb2JqZWN0XG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXY+XG4gICAqIDxjb2RlPlxuICAgKiBmdW5jdGlvbiBkcmF3KCkge1xuICAgKiAgIGJhY2tncm91bmQgKDIwMCk7XG4gICAqXG4gICAqICAgLy8gQ3JlYXRlIGEgdmFyaWFibGUsIHByb3BvcnRpb25hbCB0byB0aGUgbW91c2VYLFxuICAgKiAgIC8vIHZhcnlpbmcgZnJvbSAwLTM2MCwgdG8gcmVwcmVzZW50IGFuIGFuZ2xlIGluIGRlZ3JlZXMuXG4gICAqICAgYW5nbGVNb2RlKERFR1JFRVMpO1xuICAgKiAgIHZhciBteURlZ3JlZXMgPSBtYXAobW91c2VYLCAwLHdpZHRoLCAwLDM2MCk7XG4gICAqXG4gICAqICAgLy8gRGlzcGxheSB0aGF0IHZhcmlhYmxlIGluIGFuIG9uc2NyZWVuIHRleHQuXG4gICAqICAgLy8gKE5vdGUgdGhlIG5mYygpIGZ1bmN0aW9uIHRvIHRydW5jYXRlIGFkZGl0aW9uYWwgZGVjaW1hbCBwbGFjZXMsXG4gICAqICAgLy8gYW5kIHRoZSBcIlxceEIwXCIgY2hhcmFjdGVyIGZvciB0aGUgZGVncmVlIHN5bWJvbC4pXG4gICAqICAgdmFyIHJlYWRvdXQgPSBcImFuZ2xlID0gXCIgKyBuZmMobXlEZWdyZWVzLDEsMSkgKyBcIlxceEIwXCJcbiAgICogICBub1N0cm9rZSgpO1xuICAgKiAgIGZpbGwgKDApO1xuICAgKiAgIHRleHQgKHJlYWRvdXQsIDUsIDE1KTtcbiAgICpcbiAgICogICAvLyBDcmVhdGUgYSBWZWN0b3IgdXNpbmcgdGhlIGZyb21BbmdsZSBmdW5jdGlvbixcbiAgICogICAvLyBhbmQgZXh0cmFjdCBpdHMgeCBhbmQgeSBjb21wb25lbnRzLlxuICAgKiAgIHZhciB2ID0gVmVjdG9yLmZyb21BbmdsZShyYWRpYW5zKG15RGVncmVlcykpO1xuICAgKiAgIHZhciB2eCA9IHYueDtcbiAgICogICB2YXIgdnkgPSB2Lnk7XG4gICAqXG4gICAqICAgcHVzaCgpO1xuICAgKiAgIHRyYW5zbGF0ZSAod2lkdGgvMiwgaGVpZ2h0LzIpO1xuICAgKiAgIG5vRmlsbCgpO1xuICAgKiAgIHN0cm9rZSAoMTUwKTtcbiAgICogICBsaW5lICgwLDAsIDMwLDApO1xuICAgKiAgIHN0cm9rZSAoMCk7XG4gICAqICAgbGluZSAoMCwwLCAzMCp2eCwgMzAqdnkpO1xuICAgKiAgIHBvcCgpXG4gICAqIH1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5mcm9tQW5nbGUgPSBmdW5jdGlvbihhbmdsZSkge1xuICAgIHJldHVybiBuZXcgVmVjdG9yKE1hdGguY29zKGFuZ2xlKSxNYXRoLnNpbihhbmdsZSksMCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIE1ha2UgYSBuZXcgMkQgdW5pdCB2ZWN0b3IgZnJvbSBhIHJhbmRvbSBhbmdsZVxuICAgKlxuICAgKiBAbWV0aG9kIHJhbmRvbTJEXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgbmV3IFZlY3RvciBvYmplY3RcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IFZlY3Rvci5yYW5kb20yRCgpO1xuICAgKiAvLyBNYXkgbWFrZSB2J3MgYXR0cmlidXRlcyBzb21ldGhpbmcgbGlrZTpcbiAgICogLy8gWzAuNjE1NTQ2MTcsIC0wLjUxMTk1NzY1LCAwLjBdIG9yXG4gICAqIC8vIFstMC40Njk1ODQxLCAtMC4xNDM2NjczMSwgMC4wXSBvclxuICAgKiAvLyBbMC42MDkxMDk3LCAtMC4yMjgwNTI3OCwgMC4wXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnJhbmRvbTJEID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbmdsZSA9IE1hdGgucmFuZG9tKCkqTWF0aC5QSSoyO1xuICAgIHJldHVybiB0aGlzLmZyb21BbmdsZShhbmdsZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIE1ha2UgYSBuZXcgcmFuZG9tIDNEIHVuaXQgdmVjdG9yLlxuICAgKlxuICAgKiBAbWV0aG9kIHJhbmRvbTNEXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgbmV3IFZlY3RvciBvYmplY3RcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IFZlY3Rvci5yYW5kb20zRCgpO1xuICAgKiAvLyBNYXkgbWFrZSB2J3MgYXR0cmlidXRlcyBzb21ldGhpbmcgbGlrZTpcbiAgICogLy8gWzAuNjE1NTQ2MTcsIC0wLjUxMTk1NzY1LCAwLjU5OTE2OF0gb3JcbiAgICogLy8gWy0wLjQ2OTU4NDEsIC0wLjE0MzY2NzMxLCAtMC44NzExMjAyXSBvclxuICAgKiAvLyBbMC42MDkxMDk3LCAtMC4yMjgwNTI3OCwgLTAuNzU5NTkwMl1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5yYW5kb20zRCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYW5nbGUgPSBNYXRoLnJhbmRvbSgpKk1hdGguUEkqMixcblx0ICAgIHZ6ID0gTWF0aC5yYW5kb20oKSoyLTEsXG4gICAgXHR2eCA9IE1hdGguc3FydCgxLXZ6KnZ6KSpNYXRoLmNvcyhhbmdsZSksXG4gICAgXHR2eSA9IE1hdGguc3FydCgxLXZ6KnZ6KSpNYXRoLnNpbihhbmdsZSk7XG5cbiAgICByZXR1cm4gbmV3IFZlY3Rvcih2eCx2eSx2eik7XG4gIH07XG5cblxuICAvKipcbiAgICogQWRkcyB0d28gdmVjdG9ycyB0b2dldGhlciBhbmQgcmV0dXJucyBhIG5ldyBvbmUuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MSBhIFZlY3RvciB0byBhZGRcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MiBhIFZlY3RvciB0byBhZGRcbiAgICogQHBhcmFtICB7VmVjdG9yfSB0YXJnZXQgaWYgdW5kZWZpbmVkIGEgbmV3IHZlY3RvciB3aWxsIGJlIGNyZWF0ZWRcbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgcmVzdWx0aW5nIFZlY3RvclxuICAgKlxuICAgKi9cblxuICBWZWN0b3IuYWRkID0gZnVuY3Rpb24gKHYxLCB2MiwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IHYxLmNvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnNldCh2MSk7XG4gICAgfVxuICAgIHRhcmdldC5hZGQodjIpO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN1YnRyYWN0cyBvbmUgVmVjdG9yIGZyb20gYW5vdGhlciBhbmQgcmV0dXJucyBhIG5ldyBvbmUuICBUaGUgc2Vjb25kXG4gICAqIHZlY3RvciAodjIpIGlzIHN1YnRyYWN0ZWQgZnJvbSB0aGUgZmlyc3QgKHYxKSwgcmVzdWx0aW5nIGluIHYxLXYyLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjEgYSBWZWN0b3IgdG8gc3VidHJhY3QgZnJvbVxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYyIGEgVmVjdG9yIHRvIHN1YnRyYWN0XG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdGFyZ2V0IGlmIHVuZGVmaW5lZCBhIG5ldyB2ZWN0b3Igd2lsbCBiZSBjcmVhdGVkXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIHJlc3VsdGluZyBWZWN0b3JcbiAgICovXG5cbiAgVmVjdG9yLnN1YiA9IGZ1bmN0aW9uICh2MSwgdjIsIHRhcmdldCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB2MS5jb3B5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5zZXQodjEpO1xuICAgIH1cbiAgICB0YXJnZXQuc3ViKHYyKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYSB2ZWN0b3IgYnkgYSBzY2FsYXIgYW5kIHJldHVybnMgYSBuZXcgdmVjdG9yLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdiB0aGUgVmVjdG9yIHRvIG11bHRpcGx5XG4gICAqIEBwYXJhbSAge051bWJlcn0gIG4gdGhlIHNjYWxhclxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHRhcmdldCBpZiB1bmRlZmluZWQgYSBuZXcgdmVjdG9yIHdpbGwgYmUgY3JlYXRlZFxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICB0aGUgcmVzdWx0aW5nIG5ldyBWZWN0b3JcbiAgICovXG4gIFZlY3Rvci5tdWx0ID0gZnVuY3Rpb24gKHYsIG4sIHRhcmdldCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB2LmNvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnNldCh2KTtcbiAgICB9XG4gICAgdGFyZ2V0Lm11bHQobik7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICAvKipcbiAgICogRGl2aWRlcyBhIHZlY3RvciBieSBhIHNjYWxhciBhbmQgcmV0dXJucyBhIG5ldyB2ZWN0b3IuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2IHRoZSBWZWN0b3IgdG8gZGl2aWRlXG4gICAqIEBwYXJhbSAge051bWJlcn0gIG4gdGhlIHNjYWxhclxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHRhcmdldCBpZiB1bmRlZmluZWQgYSBuZXcgdmVjdG9yIHdpbGwgYmUgY3JlYXRlZFxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSByZXN1bHRpbmcgbmV3IFZlY3RvclxuICAgKi9cbiAgVmVjdG9yLmRpdiA9IGZ1bmN0aW9uICh2LCBuLCB0YXJnZXQpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdi5jb3B5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5zZXQodik7XG4gICAgfVxuICAgIHRhcmdldC5kaXYobik7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjdG9ycy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYxIHRoZSBmaXJzdCBWZWN0b3JcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MiB0aGUgc2Vjb25kIFZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICB0aGUgZG90IHByb2R1Y3RcbiAgICovXG4gIFZlY3Rvci5kb3QgPSBmdW5jdGlvbiAodjEsIHYyKSB7XG4gICAgcmV0dXJuIHYxLmRvdCh2Mik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MSB0aGUgZmlyc3QgVmVjdG9yXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjIgdGhlIHNlY29uZCBWZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgdGhlIGNyb3NzIHByb2R1Y3RcbiAgICovXG4gIFZlY3Rvci5jcm9zcyA9IGZ1bmN0aW9uICh2MSwgdjIpIHtcbiAgICByZXR1cm4gdjEuY3Jvc3ModjIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBFdWNsaWRlYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzIChjb25zaWRlcmluZyBhXG4gICAqIHBvaW50IGFzIGEgdmVjdG9yIG9iamVjdCkuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MSB0aGUgZmlyc3QgVmVjdG9yXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjIgdGhlIHNlY29uZCBWZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgdGhlIGRpc3RhbmNlXG4gICAqL1xuICBWZWN0b3IuZGlzdCA9IGZ1bmN0aW9uICh2MSx2Mikge1xuICAgIHJldHVybiB2MS5kaXN0KHYyKTtcbiAgfTtcblxuICAvKipcbiAgICogTGluZWFyIGludGVycG9sYXRlIGEgdmVjdG9yIHRvIGFub3RoZXIgdmVjdG9yIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBhcyBhXG4gICAqIG5ldyB2ZWN0b3IuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtWZWN0b3J9IHYxIGEgc3RhcnRpbmcgVmVjdG9yXG4gICAqIEBwYXJhbSB7VmVjdG9yfSB2MiB0aGUgVmVjdG9yIHRvIGxlcnAgdG9cbiAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgIHRoZSBhbW91bnQgb2YgaW50ZXJwb2xhdGlvbjsgc29tZSB2YWx1ZSBiZXR3ZWVuIDAuMFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgKG9sZCB2ZWN0b3IpIGFuZCAxLjAgKG5ldyB2ZWN0b3IpLiAwLjEgaXMgdmVyeSBuZWFyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICB0aGUgbmV3IHZlY3Rvci4gMC41IGlzIGhhbGZ3YXkgaW4gYmV0d2Vlbi5cbiAgICovXG4gIFZlY3Rvci5sZXJwID0gZnVuY3Rpb24gKHYxLCB2MiwgYW10LCB0YXJnZXQpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdjEuY29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuc2V0KHYxKTtcbiAgICB9XG4gICAgdGFyZ2V0LmxlcnAodjIsIGFtdCk7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyB0aGUgYW5nbGUgKGluIHJhZGlhbnMpIGJldHdlZW4gdHdvIHZlY3RvcnMuXG4gICAqIEBtZXRob2QgYW5nbGVCZXR3ZWVuXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MSB0aGUgeCwgeSwgYW5kIHogY29tcG9uZW50cyBvZiBhIFZlY3RvclxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYyIHRoZSB4LCB5LCBhbmQgeiBjb21wb25lbnRzIG9mIGEgVmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn0gICAgICAgdGhlIGFuZ2xlIGJldHdlZW4gKGluIHJhZGlhbnMpXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDAsIDApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMCwgMSwgMCk7XG4gICAqXG4gICAqIHZhciBhbmdsZSA9IFZlY3Rvci5hbmdsZUJldHdlZW4odjEsIHYyKTtcbiAgICogLy8gYW5nbGUgaXMgUEkvMlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLmFuZ2xlQmV0d2VlbiA9IGZ1bmN0aW9uICh2MSwgdjIpIHtcbiAgICByZXR1cm4gTWF0aC5hY29zKHYxLmRvdCh2MikgLyAodjEubWFnKCkgKiB2Mi5tYWcoKSkpO1xuICB9O1xuXG4gIC8vIHJldHVybiBWZWN0b3I7XG5tb2R1bGUuZXhwb3J0cyA9IFZlY3Rvcjtcbi8vIH0pO1xuIiwiZnVuY3Rpb24gVXRpbHMoY3gsIGNhbnZhcykge1xuICByZXR1cm4ge1xuICAgIGN4IDogY3ggfHwgJycsXG4gICAgY2FudmFzOiBjYW52YXMgfHwgJycsXG4gICAgaGFsZlg6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLndpZHRoIC8gMjtcbiAgICB9LFxuICAgIGhhbGZZOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhbnZhcy5oZWlnaHQgLyAyO1xuICAgIH0sXG4gICAgcmFuZ2U6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgICAgaWYgKCFtYXgpIHtcbiAgICAgICAgbWF4ID0gbWluO1xuICAgICAgICBtaW4gPSAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKTtcbiAgICB9LFxuICAgIHJhbmdlOiBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgICAgdmFyIHJhbmQgPSBNYXRoLnJhbmRvbSgpO1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcmFuZDtcbiAgICAgIH0gZWxzZVxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHJhbmQgKiBtaW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWluID4gbWF4KSB7XG4gICAgICAgICAgdmFyIHRtcCA9IG1pbjtcbiAgICAgICAgICBtaW4gPSBtYXg7XG4gICAgICAgICAgbWF4ID0gdG1wO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJhbmQgKiAobWF4LW1pbikgKyBtaW47XG4gICAgICB9XG4gICAgfSxcbiAgICAvLyB0YWtlbiBmcm9tIHRoZSBwNS5qcyBwcm9qZWN0XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Byb2Nlc3NpbmcvcDUuanMvYmxvYi81YzgxZDY1NWY2ODNmOTA0NTJiODBhYjIyNWE2N2U0NDk0NjNmZmY5L3NyYy9tYXRoL2NhbGN1bGF0aW9uLmpzI0wzOTRcbiAgICBtYXA6IGZ1bmN0aW9uKG4sIHN0YXJ0MSwgc3RvcDEsIHN0YXJ0Miwgc3RvcDIpIHtcbiAgICAgIHJldHVybiAoKG4tc3RhcnQxKS8oc3RvcDEtc3RhcnQxKSkqKHN0b3AyLXN0YXJ0Mikrc3RhcnQyO1xuICAgIH0sXG5cbiAgICBnZXRNb3VzZVBvczogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IGV2ZW50LmNsaWVudFgsXG4gICAgICAgIHk6IGV2ZW50LmNsaWVudFlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5jeC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfSxcbiAgICBXOiBjYW52YXMud2lkdGgsXG4gICAgSDogY2FudmFzLmhlaWdodCxcbiAgICBIVzogY2FudmFzLndpZHRoIC8gMixcbiAgICBISDogY2FudmFzLmhlaWdodCAvIDIsXG4gICAgZWxsaXBzZTogZnVuY3Rpb24oeCwgeSwgcikge1xuICAgICAgdGhpcy5jeC5iZWdpblBhdGgoKTtcbiAgICAgIHRoaXMuY3guYXJjKHgsIHksIHIsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICB0aGlzLmN4LmZpbGwoKTtcbiAgICAgIHRoaXMuY3guc3Ryb2tlKCk7XG4gICAgfSxcbiAgICBjb25zdHJhaW46IGZ1bmN0aW9uKHZhbCwgbWluLCBtYXgpIHtcbiAgICAgIGlmICh2YWwgPiBtYXgpIHtcbiAgICAgICAgcmV0dXJuIG1heDtcbiAgICAgIH0gZWxzZSBpZiAodmFsIDwgbWluKSB7XG4gICAgICAgIHJldHVybiBtaW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjeCwgY2FudmFzKSB7XG4gIHJldHVybiBuZXcgVXRpbHMoY3gsIGNhbnZhcyk7XG59O1xuIl19
