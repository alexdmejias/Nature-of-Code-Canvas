require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var V = require('V')
  , utils
  ;

function Attractor(cx, canvas, opts) {
  utils = require('utils')(cx, canvas);
  this.cx = cx;
  this.canvas = canvas;

  this.position = new V(utils.HW, utils.HH);
  this.mass = 20;
  this.G = 1;
}

Attractor.prototype.display = function() {
	this.cx.save();
	this.cx.fillStyle = 'red';
	utils.ellipse(this.position.x, this.position.y, this.mass * 2);
};

Attractor.prototype.attract = function(m) {
  var force = V.sub(this.position, m.position);
  var distance = force.mag();
  distance = utils.constrain(distance, 5, 25);

  force.normalize();

  var strength = (this.G * this.mass * m.mass) / (distance * distance);
  force.mult(strength);
  return force;
};

module.exports = Attractor;

},{"V":"V","utils":"utils"}],2:[function(require,module,exports){
var V = require('V')
  , utils
;

function Mover(cx, canvas, opts) {
  utils = require('utils')(cx, canvas);
  this.cx = cx;
  this.canvas = canvas;

  this.position = new V(opts.x, opts.y);
  this.velocity = new V(1, 0);
  this.acceleration = new V(0, 0);
  this.G = 1;
  this.mass = opts.mass;
}

Mover.prototype.applyForce = function(force) {
  var f = V.div(force, this.mass);
  this.acceleration.add(f);
  return this;
};

Mover.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.acceleration.mult(0);
  return this;
};

Mover.prototype.checkEdges = function() {
  if (this.position.x > utils.W) {
    this.position.x = utils.W;
    this.velocity.x *= -1;
  } else if (this.position.x < 0) {
    this.velocity.x *= -1;
    this.position.x = 0;
  }

  if (this.position.y > utils.H) {
    this.position.y = utils.H;
    this.velocity.y *= -1;
  } else if (this.position.y < 0) {
    this.velocity.y *= -1;
    this.velocity.y = 0;
  }
  return this;
};

Mover.prototype.attract = function(m) {
  var force = V.sub(this.position, m.position);
  var distance = force.mag();
  distance = utils.constrain(distance, 5, 25);

  force.normalize();

  var strength = (this.G * this.mass * m.mass) / (distance * distance);
  force.mult(strength);
  return force;
};

Mover.prototype.display = function() {
  this.cx.fillStyle = 'grey';
  this.cx.strokeStyle = 'black';
  utils.ellipse(this.position.x, this.position.y, this.mass * 16);
  return this;
};

module.exports = Mover;

},{"V":"V","utils":"utils"}],3:[function(require,module,exports){
var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , Attractor = require('./_Attractor')
  , Mover = require('./_Mover')
  , V = require('V')
  , utils
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , a
  , m
  ;

function setup() {
  console.log('setup');
  canvas.height = 300;
  canvas.width = 600;
  utils = require('utils')(cx, canvas);

  a = new Attractor(cx, canvas);
  m = [];
  for (var i = 0; i < 10; i++) {
    m[i] = new Mover(cx, canvas, {
      mass: 1,
      x: utils.range(0, 400),
      y: utils.range(0, 400)
    });
  };
}

function draw() {
  utils.clear();

  a.display();
  for (var i = 0; i < m.length; i++) {
    for (var j = 0; j < m.length; j++) {
      if (j !== i) {
        var f = m[j].attract(m[i]);
        m[i].applyForce(f);
      }
    };
    m[i].update();
    m[i].checkEdges();
    m[i].display();
  };

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());

},{"./_Attractor":1,"./_Mover":2,"V":"V","utils":"utils"}],"V":[function(require,module,exports){
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

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8yLzgvX0F0dHJhY3Rvci5qcyIsImNoYXB0ZXJzLzIvOC9fTW92ZXIuanMiLCJjaGFwdGVycy8yLzgvYXBwLmpzIiwibW9kdWxlcy9wNVZlY3RvcnMuanMiLCJtb2R1bGVzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNTZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBWID0gcmVxdWlyZSgnVicpXG4gICwgdXRpbHNcbiAgO1xuXG5mdW5jdGlvbiBBdHRyYWN0b3IoY3gsIGNhbnZhcywgb3B0cykge1xuICB1dGlscyA9IHJlcXVpcmUoJ3V0aWxzJykoY3gsIGNhbnZhcyk7XG4gIHRoaXMuY3ggPSBjeDtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG5cbiAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWKHV0aWxzLkhXLCB1dGlscy5ISCk7XG4gIHRoaXMubWFzcyA9IDIwO1xuICB0aGlzLkcgPSAxO1xufVxuXG5BdHRyYWN0b3IucHJvdG90eXBlLmRpc3BsYXkgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5jeC5zYXZlKCk7XG5cdHRoaXMuY3guZmlsbFN0eWxlID0gJ3JlZCc7XG5cdHV0aWxzLmVsbGlwc2UodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksIHRoaXMubWFzcyAqIDIpO1xufTtcblxuQXR0cmFjdG9yLnByb3RvdHlwZS5hdHRyYWN0ID0gZnVuY3Rpb24obSkge1xuICB2YXIgZm9yY2UgPSBWLnN1Yih0aGlzLnBvc2l0aW9uLCBtLnBvc2l0aW9uKTtcbiAgdmFyIGRpc3RhbmNlID0gZm9yY2UubWFnKCk7XG4gIGRpc3RhbmNlID0gdXRpbHMuY29uc3RyYWluKGRpc3RhbmNlLCA1LCAyNSk7XG5cbiAgZm9yY2Uubm9ybWFsaXplKCk7XG5cbiAgdmFyIHN0cmVuZ3RoID0gKHRoaXMuRyAqIHRoaXMubWFzcyAqIG0ubWFzcykgLyAoZGlzdGFuY2UgKiBkaXN0YW5jZSk7XG4gIGZvcmNlLm11bHQoc3RyZW5ndGgpO1xuICByZXR1cm4gZm9yY2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF0dHJhY3RvcjtcbiIsInZhciBWID0gcmVxdWlyZSgnVicpXG4gICwgdXRpbHNcbjtcblxuZnVuY3Rpb24gTW92ZXIoY3gsIGNhbnZhcywgb3B0cykge1xuICB1dGlscyA9IHJlcXVpcmUoJ3V0aWxzJykoY3gsIGNhbnZhcyk7XG4gIHRoaXMuY3ggPSBjeDtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG5cbiAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWKG9wdHMueCwgb3B0cy55KTtcbiAgdGhpcy52ZWxvY2l0eSA9IG5ldyBWKDEsIDApO1xuICB0aGlzLmFjY2VsZXJhdGlvbiA9IG5ldyBWKDAsIDApO1xuICB0aGlzLkcgPSAxO1xuICB0aGlzLm1hc3MgPSBvcHRzLm1hc3M7XG59XG5cbk1vdmVyLnByb3RvdHlwZS5hcHBseUZvcmNlID0gZnVuY3Rpb24oZm9yY2UpIHtcbiAgdmFyIGYgPSBWLmRpdihmb3JjZSwgdGhpcy5tYXNzKTtcbiAgdGhpcy5hY2NlbGVyYXRpb24uYWRkKGYpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbk1vdmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52ZWxvY2l0eS5hZGQodGhpcy5hY2NlbGVyYXRpb24pO1xuICB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnZlbG9jaXR5KTtcbiAgdGhpcy5hY2NlbGVyYXRpb24ubXVsdCgwKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5Nb3Zlci5wcm90b3R5cGUuY2hlY2tFZGdlcyA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5wb3NpdGlvbi54ID4gdXRpbHMuVykge1xuICAgIHRoaXMucG9zaXRpb24ueCA9IHV0aWxzLlc7XG4gICAgdGhpcy52ZWxvY2l0eS54ICo9IC0xO1xuICB9IGVsc2UgaWYgKHRoaXMucG9zaXRpb24ueCA8IDApIHtcbiAgICB0aGlzLnZlbG9jaXR5LnggKj0gLTE7XG4gICAgdGhpcy5wb3NpdGlvbi54ID0gMDtcbiAgfVxuXG4gIGlmICh0aGlzLnBvc2l0aW9uLnkgPiB1dGlscy5IKSB7XG4gICAgdGhpcy5wb3NpdGlvbi55ID0gdXRpbHMuSDtcbiAgICB0aGlzLnZlbG9jaXR5LnkgKj0gLTE7XG4gIH0gZWxzZSBpZiAodGhpcy5wb3NpdGlvbi55IDwgMCkge1xuICAgIHRoaXMudmVsb2NpdHkueSAqPSAtMTtcbiAgICB0aGlzLnZlbG9jaXR5LnkgPSAwO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuTW92ZXIucHJvdG90eXBlLmF0dHJhY3QgPSBmdW5jdGlvbihtKSB7XG4gIHZhciBmb3JjZSA9IFYuc3ViKHRoaXMucG9zaXRpb24sIG0ucG9zaXRpb24pO1xuICB2YXIgZGlzdGFuY2UgPSBmb3JjZS5tYWcoKTtcbiAgZGlzdGFuY2UgPSB1dGlscy5jb25zdHJhaW4oZGlzdGFuY2UsIDUsIDI1KTtcblxuICBmb3JjZS5ub3JtYWxpemUoKTtcblxuICB2YXIgc3RyZW5ndGggPSAodGhpcy5HICogdGhpcy5tYXNzICogbS5tYXNzKSAvIChkaXN0YW5jZSAqIGRpc3RhbmNlKTtcbiAgZm9yY2UubXVsdChzdHJlbmd0aCk7XG4gIHJldHVybiBmb3JjZTtcbn07XG5cbk1vdmVyLnByb3RvdHlwZS5kaXNwbGF5ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY3guZmlsbFN0eWxlID0gJ2dyZXknO1xuICB0aGlzLmN4LnN0cm9rZVN0eWxlID0gJ2JsYWNrJztcbiAgdXRpbHMuZWxsaXBzZSh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSwgdGhpcy5tYXNzICogMTYpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTW92ZXI7XG4iLCJ2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpXG4gICwgY3ggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAsIEF0dHJhY3RvciA9IHJlcXVpcmUoJy4vX0F0dHJhY3RvcicpXG4gICwgTW92ZXIgPSByZXF1aXJlKCcuL19Nb3ZlcicpXG4gICwgViA9IHJlcXVpcmUoJ1YnKVxuICAsIHV0aWxzXG47XG5cbnZhciBXSURUSCA9IGNhbnZhcy53aWR0aFxuICAsIEhFSUdIVCA9IGNhbnZhcy5oZWlnaHRcbiAgLCBhXG4gICwgbVxuICA7XG5cbmZ1bmN0aW9uIHNldHVwKCkge1xuICBjb25zb2xlLmxvZygnc2V0dXAnKTtcbiAgY2FudmFzLmhlaWdodCA9IDMwMDtcbiAgY2FudmFzLndpZHRoID0gNjAwO1xuICB1dGlscyA9IHJlcXVpcmUoJ3V0aWxzJykoY3gsIGNhbnZhcyk7XG5cbiAgYSA9IG5ldyBBdHRyYWN0b3IoY3gsIGNhbnZhcyk7XG4gIG0gPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgbVtpXSA9IG5ldyBNb3ZlcihjeCwgY2FudmFzLCB7XG4gICAgICBtYXNzOiAxLFxuICAgICAgeDogdXRpbHMucmFuZ2UoMCwgNDAwKSxcbiAgICAgIHk6IHV0aWxzLnJhbmdlKDAsIDQwMClcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZHJhdygpIHtcbiAgdXRpbHMuY2xlYXIoKTtcblxuICBhLmRpc3BsYXkoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBtLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoaiAhPT0gaSkge1xuICAgICAgICB2YXIgZiA9IG1bal0uYXR0cmFjdChtW2ldKTtcbiAgICAgICAgbVtpXS5hcHBseUZvcmNlKGYpO1xuICAgICAgfVxuICAgIH07XG4gICAgbVtpXS51cGRhdGUoKTtcbiAgICBtW2ldLmNoZWNrRWRnZXMoKTtcbiAgICBtW2ldLmRpc3BsYXkoKTtcbiAgfTtcblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufVxuXG4oZnVuY3Rpb24oKSB7XG4gIHNldHVwKCk7XG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG59KCkpO1xuIiwiICAvKipcbiAgICogQSBjbGFzcyB0byBkZXNjcmliZSBhIHR3byBvciB0aHJlZSBkaW1lbnNpb25hbCB2ZWN0b3IsIHNwZWNpZmljYWxseVxuICAgKiBhIEV1Y2xpZGVhbiAoYWxzbyBrbm93biBhcyBnZW9tZXRyaWMpIHZlY3Rvci4gQSB2ZWN0b3IgaXMgYW4gZW50aXR5XG4gICAqIHRoYXQgaGFzIGJvdGggbWFnbml0dWRlIGFuZCBkaXJlY3Rpb24uIFRoZSBkYXRhdHlwZSwgaG93ZXZlciwgc3RvcmVzXG4gICAqIHRoZSBjb21wb25lbnRzIG9mIHRoZSB2ZWN0b3IgKHgseSBmb3IgMkQsIGFuZCB4LHkseiBmb3IgM0QpLiBUaGUgbWFnbml0dWRlXG4gICAqIGFuZCBkaXJlY3Rpb24gY2FuIGJlIGFjY2Vzc2VkIHZpYSB0aGUgbWV0aG9kcyBtYWcoKSBhbmQgaGVhZGluZygpLiBJbiBtYW55XG4gICAqIG9mIHRoZSBwNS5qcyBleGFtcGxlcywgeW91IHdpbGwgc2VlIFZlY3RvciB1c2VkIHRvIGRlc2NyaWJlIGEgcG9zaXRpb24sXG4gICAqIHZlbG9jaXR5LCBvciBhY2NlbGVyYXRpb24uIEZvciBleGFtcGxlLCBpZiB5b3UgY29uc2lkZXIgYSByZWN0YW5nbGUgbW92aW5nXG4gICAqIGFjcm9zcyB0aGUgc2NyZWVuLCBhdCBhbnkgZ2l2ZW4gaW5zdGFudCBpdCBoYXMgYSBwb3NpdGlvbiAoYSB2ZWN0b3IgdGhhdFxuICAgKiBwb2ludHMgZnJvbSB0aGUgb3JpZ2luIHRvIGl0cyBsb2NhdGlvbiksIGEgdmVsb2NpdHkgKHRoZSByYXRlIGF0IHdoaWNoIHRoZVxuICAgKiBvYmplY3QncyBwb3NpdGlvbiBjaGFuZ2VzIHBlciB0aW1lIHVuaXQsIGV4cHJlc3NlZCBhcyBhIHZlY3RvciksIGFuZFxuICAgKiBhY2NlbGVyYXRpb24gKHRoZSByYXRlIGF0IHdoaWNoIHRoZSBvYmplY3QncyB2ZWxvY2l0eSBjaGFuZ2VzIHBlciB0aW1lXG4gICAqIHVuaXQsIGV4cHJlc3NlZCBhcyBhIHZlY3RvcikuIFNpbmNlIHZlY3RvcnMgcmVwcmVzZW50IGdyb3VwaW5ncyBvZiB2YWx1ZXMsXG4gICAqIHdlIGNhbm5vdCBzaW1wbHkgdXNlIHRyYWRpdGlvbmFsIGFkZGl0aW9uL211bHRpcGxpY2F0aW9uL2V0Yy4gSW5zdGVhZCxcbiAgICogd2UnbGwgbmVlZCB0byBkbyBzb21lIFwidmVjdG9yXCIgbWF0aCwgd2hpY2ggaXMgbWFkZSBlYXN5IGJ5IHRoZSBtZXRob2RzXG4gICAqIGluc2lkZSB0aGUgVmVjdG9yIGNsYXNzLlxuICAgKlxuICAgKiBAY2xhc3MgVmVjdG9yXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge051bWJlcn0gW3hdIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt5XSB5IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbel0geiBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2PlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDQwLCA1MCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3Rvcig0MCwgNTApO1xuICAgKlxuICAgKiBlbGxpcHNlKHYxLngsIHYxLnksIDUwLCA1MCk7XG4gICAqIGVsbGlwc2UodjIueCwgdjIueSwgNTAsIDUwKTtcbiAgICogdjEuYWRkKHYyKTtcbiAgICogZWxsaXBzZSh2MS54LCB2MS55LCA1MCwgNTApO1xuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgdmFyIFZlY3RvciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMueCA9IGFyZ3VtZW50c1swXSB8fCAwO1xuXHRcdHRoaXMueSA9IGFyZ3VtZW50c1sxXSB8fCAwO1xuXHRcdHRoaXMueiA9IGFyZ3VtZW50c1syXSB8fCAwO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgdmVjdG9yIHYgYnkgY2FsbGluZyBTdHJpbmcodilcbiAgICogb3Igdi50b1N0cmluZygpLiBUaGlzIG1ldGhvZCBpcyB1c2VmdWwgZm9yIGxvZ2dpbmcgdmVjdG9ycyBpbiB0aGVcbiAgICogY29uc29sZS5cbiAgICogQG1ldGhvZCAgdG9TdHJpbmdcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcyA9IFwibm9yZW5kZXJcIj48Y29kZT5cbiAgICogZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAqICAgdmFyIHYgPSBjcmVhdGVWZWN0b3IoMjAsMzApO1xuICAgKiAgIHByaW50KFN0cmluZyh2KSk7IC8vIHByaW50cyBcIlZlY3RvciBPYmplY3QgOiBbMjAsIDMwLCAwXVwiXG4gICAqIH1cbiAgICogPC9kaXY+PC9jb2RlPlxuICAgKlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnVmVjdG9yIE9iamVjdCA6IFsnKyB0aGlzLnggKycsICcrIHRoaXMueSArJywgJysgdGhpcy56ICsgJ10nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB4LCB5LCBhbmQgeiBjb21wb25lbnQgb2YgdGhlIHZlY3RvciB1c2luZyB0d28gb3IgdGhyZWUgc2VwYXJhdGVcbiAgICogdmFyaWFibGVzLCB0aGUgZGF0YSBmcm9tIGEgVmVjdG9yLCBvciB0aGUgdmFsdWVzIGZyb20gYSBmbG9hdCBhcnJheS5cbiAgICogQG1ldGhvZCBzZXRcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ8VmVjdG9yfEFycmF5fSBbeF0gdGhlIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3Igb3IgYVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWN0b3Igb3IgYW4gQXJyYXlcbiAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbeV0gdGhlIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbel0gdGhlIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICogICAgdmFyIHYgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqICAgIHYuc2V0KDQsNSw2KTsgLy8gU2V0cyB2ZWN0b3IgdG8gWzQsIDUsIDZdXG4gICAqXG4gICAqICAgIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigwLCAwLCAwKTtcbiAgICogICAgdmFyIGFyciA9IFsxLCAyLCAzXTtcbiAgICogICAgdjEuc2V0KGFycik7IC8vIFNldHMgdmVjdG9yIHRvIFsxLCAyLCAzXVxuICAgKiB9XG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IpIHtcbiAgICAgIHRoaXMueCA9IHgueCB8fCAwO1xuICAgICAgdGhpcy55ID0geC55IHx8IDA7XG4gICAgICB0aGlzLnogPSB4LnogfHwgMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICB0aGlzLnggPSB4WzBdIHx8IDA7XG4gICAgICB0aGlzLnkgPSB4WzFdIHx8IDA7XG4gICAgICB0aGlzLnogPSB4WzJdIHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdGhpcy54ID0geCB8fCAwO1xuICAgIHRoaXMueSA9IHkgfHwgMDtcbiAgICB0aGlzLnogPSB6IHx8IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldHMgYSBjb3B5IG9mIHRoZSB2ZWN0b3IsIHJldHVybnMgYSBWZWN0b3Igb2JqZWN0LlxuICAgKlxuICAgKiBAbWV0aG9kIGNvcHlcbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgY29weSBvZiB0aGUgVmVjdG9yIG9iamVjdFxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdmFyIHYyID0gdi5jb3B5KCk7XG4gICAqIHByaW50KHYxLnggPT0gdjIueCAmJiB2MS55ID09IHYyLnkgJiYgdjEueiA9PSB2Mi56KTtcbiAgICogLy8gUHJpbnRzIFwidHJ1ZVwiXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54LHRoaXMueSx0aGlzLnopO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGRzIHgsIHksIGFuZCB6IGNvbXBvbmVudHMgdG8gYSB2ZWN0b3IsIGFkZHMgb25lIHZlY3RvciB0byBhbm90aGVyLCBvclxuICAgKiBhZGRzIHR3byBpbmRlcGVuZGVudCB2ZWN0b3JzIHRvZ2V0aGVyLiBUaGUgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIHRoYXQgYWRkc1xuICAgKiB0d28gdmVjdG9ycyB0b2dldGhlciBpcyBhIHN0YXRpYyBtZXRob2QgYW5kIHJldHVybnMgYSBWZWN0b3IsIHRoZSBvdGhlcnNcbiAgICogYWN0cyBkaXJlY3RseSBvbiB0aGUgdmVjdG9yLiBTZWUgdGhlIGV4YW1wbGVzIGZvciBtb3JlIGNvbnRleHQuXG4gICAqXG4gICAqIEBtZXRob2QgYWRkXG4gICAqIEBjaGFpbmFibGVcbiAgICogQHBhcmFtICB7TnVtYmVyfFZlY3RvcnxBcnJheX0geCAgIHRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIHRvIGJlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRlZCBvciBhIFZlY3RvciBvciBhbiBBcnJheVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbeV0gdGhlIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3IgdG8gYmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkXG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIFt6XSB0aGUgeiBjb21wb25lbnQgb2YgdGhlIHZlY3RvciB0byBiZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWRcbiAgICogQHJldHVybiB7VmVjdG9yfSAgICAgICAgICAgICAgICAgIHRoZSBWZWN0b3Igb2JqZWN0LlxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2LmFkZCg0LDUsNik7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0byBbNSwgNywgOV1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDIsIDMsIDQpO1xuICAgKlxuICAgKiB2YXIgdjMgPSBWZWN0b3IuYWRkKHYxLCB2Mik7XG4gICAqIC8vIHYzIGhhcyBjb21wb25lbnRzIFszLCA1LCA3XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yKSB7XG4gICAgICB0aGlzLnggKz0geC54IHx8IDA7XG4gICAgICB0aGlzLnkgKz0geC55IHx8IDA7XG4gICAgICB0aGlzLnogKz0geC56IHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgdGhpcy54ICs9IHhbMF0gfHwgMDtcbiAgICAgIHRoaXMueSArPSB4WzFdIHx8IDA7XG4gICAgICB0aGlzLnogKz0geFsyXSB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRoaXMueCArPSB4IHx8IDA7XG4gICAgdGhpcy55ICs9IHkgfHwgMDtcbiAgICB0aGlzLnogKz0geiB8fCAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTdWJ0cmFjdHMgeCwgeSwgYW5kIHogY29tcG9uZW50cyBmcm9tIGEgdmVjdG9yLCBzdWJ0cmFjdHMgb25lIHZlY3RvciBmcm9tXG4gICAqIGFub3RoZXIsIG9yIHN1YnRyYWN0cyB0d28gaW5kZXBlbmRlbnQgdmVjdG9ycy4gVGhlIHZlcnNpb24gb2YgdGhlIG1ldGhvZFxuICAgKiB0aGF0IHN1YnRyYWN0cyB0d28gdmVjdG9ycyBpcyBhIHN0YXRpYyBtZXRob2QgYW5kIHJldHVybnMgYSBWZWN0b3IsIHRoZVxuICAgKiBvdGhlciBhY3RzIGRpcmVjdGx5IG9uIHRoZSB2ZWN0b3IuIFNlZSB0aGUgZXhhbXBsZXMgZm9yIG1vcmUgY29udGV4dC5cbiAgICpcbiAgICogQG1ldGhvZCBzdWJcbiAgICogQGNoYWluYWJsZVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ8VmVjdG9yfEFycmF5fSB4ICAgdGhlIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3Igb3IgYVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVjdG9yIG9yIGFuIEFycmF5XG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIFt5XSB0aGUgeSBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbel0gdGhlIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHJldHVybiB7VmVjdG9yfSAgICAgICAgICAgICAgICAgIFZlY3RvciBvYmplY3QuXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoNCwgNSwgNik7XG4gICAqIHYuc3ViKDEsIDEsIDEpO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG8gWzMsIDQsIDVdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMiwgMywgNCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICpcbiAgICogdmFyIHYzID0gVmVjdG9yLnN1Yih2MSwgdjIpO1xuICAgKiAvLyB2MyBoYXMgY29tcG5lbnRzIFsxLCAxLCAxXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yKSB7XG4gICAgICB0aGlzLnggLT0geC54IHx8IDA7XG4gICAgICB0aGlzLnkgLT0geC55IHx8IDA7XG4gICAgICB0aGlzLnogLT0geC56IHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgdGhpcy54IC09IHhbMF0gfHwgMDtcbiAgICAgIHRoaXMueSAtPSB4WzFdIHx8IDA7XG4gICAgICB0aGlzLnogLT0geFsyXSB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRoaXMueCAtPSB4IHx8IDA7XG4gICAgdGhpcy55IC09IHkgfHwgMDtcbiAgICB0aGlzLnogLT0geiB8fCAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBNdWx0aXBseSB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLiBUaGUgc3RhdGljIHZlcnNpb24gb2YgdGhpcyBtZXRob2RcbiAgICogY3JlYXRlcyBhIG5ldyBWZWN0b3Igd2hpbGUgdGhlIG5vbiBzdGF0aWMgdmVyc2lvbiBhY3RzIG9uIHRoZSB2ZWN0b3JcbiAgICogZGlyZWN0bHkuIFNlZSB0aGUgZXhhbXBsZXMgZm9yIG1vcmUgY29udGV4dC5cbiAgICpcbiAgICogQG1ldGhvZCBtdWx0XG4gICAqIEBjaGFpbmFibGVcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICBuIHRoZSBudW1iZXIgdG8gbXVsdGlwbHkgd2l0aCB0aGUgdmVjdG9yXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gYSByZWZlcmVuY2UgdG8gdGhlIFZlY3RvciBvYmplY3QgKGFsbG93IGNoYWluaW5nKVxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2Lm11bHQoMik7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0byBbMiwgNCwgNl1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdmFyIHYyID0gVmVjdG9yLm11bHQodjEsIDIpO1xuICAgKiAvLyB2MiBoYXMgY29tcG5lbnRzIFsyLCA0LCA2XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5tdWx0ID0gZnVuY3Rpb24gKG4pIHtcbiAgICB0aGlzLnggKj0gbiB8fCAwO1xuICAgIHRoaXMueSAqPSBuIHx8IDA7XG4gICAgdGhpcy56ICo9IG4gfHwgMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogRGl2aWRlIHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuIFRoZSBzdGF0aWMgdmVyc2lvbiBvZiB0aGlzIG1ldGhvZCBjcmVhdGVzIGFcbiAgICogbmV3IFZlY3RvciB3aGlsZSB0aGUgbm9uIHN0YXRpYyB2ZXJzaW9uIGFjdHMgb24gdGhlIHZlY3RvciBkaXJlY3RseS5cbiAgICogU2VlIHRoZSBleGFtcGxlcyBmb3IgbW9yZSBjb250ZXh0LlxuICAgKlxuICAgKiBAbWV0aG9kIGRpdlxuICAgKiBAY2hhaW5hYmxlXG4gICAqIEBwYXJhbSAge251bWJlcn0gICAgbiB0aGUgbnVtYmVyIHRvIGRpdmlkZSB0aGUgdmVjdG9yIGJ5XG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gYSByZWZlcmVuY2UgdG8gdGhlIFZlY3RvciBvYmplY3QgKGFsbG93IGNoYWluaW5nKVxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDYsIDQsIDIpO1xuICAgKiB2LmRpdigyKTsgLy92J3MgY29tcG5lbnRzIGFyZSBzZXQgdG8gWzMsIDIsIDFdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgID0gY3JlYXRlVmVjdG9yKDYsIDQsIDIpO1xuICAgKiB2YXIgdjIgPSBWZWN0b3IuZGl2KHYsIDIpO1xuICAgKiAvLyB2MiBoYXMgY29tcG5lbnRzIFszLCAyLCAxXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5kaXYgPSBmdW5jdGlvbiAobikge1xuICAgIHRoaXMueCAvPSBuO1xuICAgIHRoaXMueSAvPSBuO1xuICAgIHRoaXMueiAvPSBuO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBtYWduaXR1ZGUgKGxlbmd0aCkgb2YgdGhlIHZlY3RvciBhbmQgcmV0dXJucyB0aGUgcmVzdWx0IGFzXG4gICAqIGEgZmxvYXQgKHRoaXMgaXMgc2ltcGx5IHRoZSBlcXVhdGlvbiBzcXJ0KHgqeCArIHkqeSArIHoqeikuKVxuICAgKlxuICAgKiBAbWV0aG9kIG1hZ1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IG1hZ25pdHVkZSBvZiB0aGUgdmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMjAuMCwgMzAuMCwgNDAuMCk7XG4gICAqIHZhciBtID0gdi5tYWcoMTApO1xuICAgKiBwcmludChtKTsgLy8gUHJpbnRzIFwiNTMuODUxNjQ4MDcxMzQ1MDRcIlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5tYWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLm1hZ1NxKCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIG1hZ25pdHVkZSBvZiB0aGUgdmVjdG9yIGFuZCByZXR1cm5zIHRoZSByZXN1bHRcbiAgICogYXMgYSBmbG9hdCAodGhpcyBpcyBzaW1wbHkgdGhlIGVxdWF0aW9uIDxlbT4oeCp4ICsgeSp5ICsgeip6KTwvZW0+LilcbiAgICogRmFzdGVyIGlmIHRoZSByZWFsIGxlbmd0aCBpcyBub3QgcmVxdWlyZWQgaW4gdGhlXG4gICAqIGNhc2Ugb2YgY29tcGFyaW5nIHZlY3RvcnMsIGV0Yy5cbiAgICpcbiAgICogQG1ldGhvZCBtYWdTcVxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IHNxdWFyZWQgbWFnbml0dWRlIG9mIHRoZSB2ZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3Rvcig2LCA0LCAyKTtcbiAgICogcHJpbnQodjEubWFnU3EoKSk7IC8vIFByaW50cyBcIjU2XCJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUubWFnU3EgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHggPSB0aGlzLngsIHkgPSB0aGlzLnksIHogPSB0aGlzLno7XG4gICAgcmV0dXJuICh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjdG9ycy4gVGhlIHZlcnNpb24gb2YgdGhlIG1ldGhvZFxuICAgKiB0aGF0IGNvbXB1dGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gaW5kZXBlbmRlbnQgdmVjdG9ycyBpcyBhIHN0YXRpY1xuICAgKiBtZXRob2QuIFNlZSB0aGUgZXhhbXBsZXMgZm9yIG1vcmUgY29udGV4dC5cbiAgICpcbiAgICpcbiAgICogQG1ldGhvZCBkb3RcbiAgICogQHBhcmFtICB7TnVtYmVyfFZlY3Rvcn0geCAgIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3Igb3IgYSBWZWN0b3JcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgW3ldIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgW3pdIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgICAgICAgICAgICAgdGhlIGRvdCBwcm9kdWN0XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMiwgMywgNCk7XG4gICAqXG4gICAqIHByaW50KHYxLmRvdCh2MikpOyAvLyBQcmludHMgXCIyMFwiXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy9TdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDMsIDIsIDEpO1xuICAgKiBwcmludCAoVmVjdG9yLmRvdCh2MSwgdjIpKTsgLy8gUHJpbnRzIFwiMTBcIlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5kb3QoeC54LCB4LnksIHgueik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnggKiAoeCB8fCAwKSArXG4gICAgICAgICAgIHRoaXMueSAqICh5IHx8IDApICtcbiAgICAgICAgICAgdGhpcy56ICogKHogfHwgMCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgYSB2ZWN0b3IgY29tcG9zZWQgb2YgdGhlIGNyb3NzIHByb2R1Y3QgYmV0d2VlblxuICAgKiB0d28gdmVjdG9ycy4gQm90aCB0aGUgc3RhdGljIGFuZCBub24gc3RhdGljIG1ldGhvZHMgcmV0dXJuIGEgbmV3IFZlY3Rvci5cbiAgICogU2VlIHRoZSBleGFtcGxlcyBmb3IgbW9yZSBjb250ZXh0LlxuICAgKlxuICAgKiBAbWV0aG9kIGNyb3NzXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdiBWZWN0b3IgdG8gYmUgY3Jvc3NlZFxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgVmVjdG9yIGNvbXBvc2VkIG9mIGNyb3NzIHByb2R1Y3RcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICpcbiAgICogdjEuY3Jvc3ModjIpOyAvLyB2J3MgY29tcG9uZW50cyBhcmUgWzAsIDAsIDBdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMCwgMCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigwLCAxLCAwKTtcbiAgICpcbiAgICogdmFyIGNyb3NzUHJvZHVjdCA9IFZlY3Rvci5jcm9zcyh2MSwgdjIpO1xuICAgKiAvLyBjcm9zc1Byb2R1Y3QgaGFzIGNvbXBvbmVudHMgWzAsIDAsIDFdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24gKHYpIHtcbiAgICB2YXIgeCA9IHRoaXMueSAqIHYueiAtIHRoaXMueiAqIHYueTtcbiAgICB2YXIgeSA9IHRoaXMueiAqIHYueCAtIHRoaXMueCAqIHYuejtcbiAgICB2YXIgeiA9IHRoaXMueCAqIHYueSAtIHRoaXMueSAqIHYueDtcblxuXHRcdHJldHVybiBuZXcgVmVjdG9yKHgseSx6KTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgRXVjbGlkZWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50cyAoY29uc2lkZXJpbmcgYVxuICAgKiBwb2ludCBhcyBhIHZlY3RvciBvYmplY3QpLlxuICAgKlxuICAgKiBAbWV0aG9kIGRpc3RcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2IHRoZSB4LCB5LCBhbmQgeiBjb29yZGluYXRlcyBvZiBhIFZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICAgdGhlIGRpc3RhbmNlXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDAsIDApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMCwgMSwgMCk7XG4gICAqXG4gICAqIHZhciBkaXN0YW5jZSA9IHYxLmRpc3QodjIpOyAvLyBkaXN0YW5jZSBpcyAxLjQxNDIuLi5cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAwLCAwKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDAsIDEsIDApO1xuICAgKlxuICAgKiB2YXIgZGlzdGFuY2UgPSBWZWN0b3IuZGlzdCh2MSx2Mik7XG4gICAqIC8vIGRpc3RhbmNlIGlzIDEuNDE0Mi4uLlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5kaXN0ID0gZnVuY3Rpb24gKHYpIHtcbiAgICB2YXIgZCA9IHYuY29weSgpLnN1Yih0aGlzKTtcbiAgICByZXR1cm4gZC5tYWcoKTtcbiAgfTtcblxuICAvKipcbiAgICogTm9ybWFsaXplIHRoZSB2ZWN0b3IgdG8gbGVuZ3RoIDEgKG1ha2UgaXQgYSB1bml0IHZlY3RvcikuXG4gICAqXG4gICAqIEBtZXRob2Qgbm9ybWFsaXplXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gbm9ybWFsaXplZCBWZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxMCwgMjAsIDIpO1xuICAgKiAvLyB2IGhhcyBjb21wbmVudHMgWzEwLjAsIDIwLjAsIDIuMF1cbiAgICogdi5ub3JtYWxpemUoKTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvXG4gICAqIC8vIFswLjQ0NTQzNTQsIDAuODkwODcwOCwgMC4wODkwODcwODRdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXYodGhpcy5tYWcoKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIExpbWl0IHRoZSBtYWduaXR1ZGUgb2YgdGhpcyB2ZWN0b3IgdG8gdGhlIHZhbHVlIHVzZWQgZm9yIHRoZSA8Yj5tYXg8L2I+XG4gICAqIHBhcmFtZXRlci5cbiAgICpcbiAgICogQG1ldGhvZCBsaW1pdFxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgIG1heCB0aGUgbWF4aW11bSBtYWduaXR1ZGUgZm9yIHRoZSB2ZWN0b3JcbiAgICogQHJldHVybiB7VmVjdG9yfSAgICAgdGhlIG1vZGlmaWVkIFZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEwLCAyMCwgMik7XG4gICAqIC8vIHYgaGFzIGNvbXBuZW50cyBbMTAuMCwgMjAuMCwgMi4wXVxuICAgKiB2LmxpbWl0KDUpO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG9cbiAgICogLy8gWzIuMjI3MTc3MSwgNC40NTQzNTQzLCAwLjQ0NTQzNTRdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmxpbWl0ID0gZnVuY3Rpb24gKGwpIHtcbiAgICB2YXIgbVNxID0gdGhpcy5tYWdTcSgpO1xuICAgIGlmKG1TcSA+IGwqbCkge1xuICAgICAgdGhpcy5kaXYoTWF0aC5zcXJ0KG1TcSkpOyAvL25vcm1hbGl6ZSBpdFxuICAgICAgdGhpcy5tdWx0KGwpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHRoZSBtYWduaXR1ZGUgb2YgdGhpcyB2ZWN0b3IgdG8gdGhlIHZhbHVlIHVzZWQgZm9yIHRoZSA8Yj5sZW48L2I+XG4gICAqIHBhcmFtZXRlci5cbiAgICpcbiAgICogQG1ldGhvZCBzZXRNYWdcbiAgICogQHBhcmFtICB7bnVtYmVyfSAgICBsZW4gdGhlIG5ldyBsZW5ndGggZm9yIHRoaXMgdmVjdG9yXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgIHRoZSBtb2RpZmllZCBWZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMTAsIDIwLCAyKTtcbiAgICogLy8gdiBoYXMgY29tcG5lbnRzIFsxMC4wLCAyMC4wLCAyLjBdXG4gICAqIHYxLnNldE1hZygxMCk7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0byBbNi4wLCA4LjAsIDAuMF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuc2V0TWFnID0gZnVuY3Rpb24gKGxlbikge1xuICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpLm11bHQobGVuKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlIHRoZSBhbmdsZSBvZiByb3RhdGlvbiBmb3IgdGhpcyB2ZWN0b3IgKG9ubHkgMkQgdmVjdG9ycylcbiAgICpcbiAgICogQG1ldGhvZCBoZWFkaW5nXG4gICAqIEByZXR1cm4ge051bWJlcn0gdGhlIGFuZ2xlIG9mIHJvdGF0aW9uXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3MgPSBcIm5vcmVuZGVyXCI+PGNvZGU+XG4gICAqIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgKiAgIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigzMCw1MCk7XG4gICAqICAgcHJpbnQodjEuaGVhZGluZygpKTsgLy8gMS4wMzAzNzY4MjY1MjQzMTI1XG4gICAqXG4gICAqICAgdmFyIHYxID0gY3JlYXRlVmVjdG9yKDQwLDUwKTtcbiAgICogICBwcmludCh2MS5oZWFkaW5nKCkpOyAvLyAwLjg5NjA1NTM4NDU3MTM0MzlcbiAgICpcbiAgICogICB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMzAsNzApO1xuICAgKiAgIHByaW50KHYxLmhlYWRpbmcoKSk7IC8vIDEuMTY1OTA0NTQwNTA5ODEzMlxuICAgKiB9XG4gICAqIDwvZGl2PjwvY29kZT5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuaGVhZGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnksIHRoaXMueCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJvdGF0ZSB0aGUgdmVjdG9yIGJ5IGFuIGFuZ2xlIChvbmx5IDJEIHZlY3RvcnMpLCBtYWduaXR1ZGUgcmVtYWlucyB0aGVcbiAgICogc2FtZVxuICAgKlxuICAgKiBAbWV0aG9kIHJvdGF0ZVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9ICAgIGFuZ2xlIHRoZSBhbmdsZSBvZiByb3RhdGlvblxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSBtb2RpZmllZCBWZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxMC4wLCAyMC4wKTtcbiAgICogLy8gdiBoYXMgY29tcG5lbnRzIFsxMC4wLCAyMC4wLCAwLjBdXG4gICAqIHYucm90YXRlKEhBTEZfUEkpO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG8gWy0yMC4wLCA5Ljk5OTk5OSwgMC4wXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbiAoYW5nbGUpIHtcbiAgICB2YXIgbmV3SGVhZGluZyA9IHRoaXMuaGVhZGluZygpICsgYW5nbGU7XG4gICAgdmFyIG1hZyA9IHRoaXMubWFnKCk7XG4gICAgdGhpcy54ID0gTWF0aC5jb3MobmV3SGVhZGluZykgKiBtYWc7XG4gICAgdGhpcy55ID0gTWF0aC5zaW4obmV3SGVhZGluZykgKiBtYWc7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIExpbmVhciBpbnRlcnBvbGF0ZSB0aGUgdmVjdG9yIHRvIGFub3RoZXIgdmVjdG9yXG4gICAqXG4gICAqIEBtZXRob2QgbGVycFxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHggICB0aGUgeCBjb21wb25lbnQgb3IgdGhlIFZlY3RvciB0byBsZXJwIHRvXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gW3ldIHkgdGhlIHkgY29tcG9uZW50XG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gW3pdIHogdGhlIHogY29tcG9uZW50XG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgYW10IHRoZSBhbW91bnQgb2YgaW50ZXJwb2xhdGlvbjsgc29tZSB2YWx1ZSBiZXR3ZWVuIDAuMFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAob2xkIHZlY3RvcikgYW5kIDEuMCAobmV3IHZlY3RvcikuIDAuMSBpcyB2ZXJ5IG5lYXJcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgdGhlIG5ldyB2ZWN0b3IuIDAuNSBpcyBoYWxmd2F5IGluIGJldHdlZW4uXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgIHRoZSBtb2RpZmllZCBWZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxLCAxLCAwKTtcbiAgICpcbiAgICogdi5sZXJwKDMsIDMsIDAsIDAuNSk7IC8vIHYgbm93IGhhcyBjb21wb25lbnRzIFsyLDIsMF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMCwgMCwgMCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigxMDAsIDEwMCwgMCk7XG4gICAqXG4gICAqIHZhciB2MyA9IFZlY3Rvci5sZXJwKHYxLCB2MiwgMC41KTtcbiAgICogLy8gdjMgaGFzIGNvbXBvbmVudHMgWzUwLDUwLDBdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmxlcnAgPSBmdW5jdGlvbiAoeCwgeSwgeiwgYW10KSB7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmxlcnAoeC54LCB4LnksIHgueiwgeSk7XG4gICAgfVxuICAgIHRoaXMueCArPSAoeCAtIHRoaXMueCkgKiBhbXQgfHwgMDtcbiAgICB0aGlzLnkgKz0gKHkgLSB0aGlzLnkpICogYW10IHx8IDA7XG4gICAgdGhpcy56ICs9ICh6IC0gdGhpcy56KSAqIGFtdCB8fCAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHZlY3RvciBhcyBhIGZsb2F0IGFycmF5LiBUaGlzIGlzIG9ubHlcbiAgICogZm9yIHRlbXBvcmFyeSB1c2UuIElmIHVzZWQgaW4gYW55IG90aGVyIGZhc2hpb24sIHRoZSBjb250ZW50cyBzaG91bGQgYmVcbiAgICogY29waWVkIGJ5IHVzaW5nIHRoZSA8Yj5WZWN0b3IuY29weSgpPC9iPiBtZXRob2QgdG8gY29weSBpbnRvIHlvdXIgb3duXG4gICAqIGFycmF5LlxuICAgKlxuICAgKiBAbWV0aG9kIGFycmF5XG4gICAqIEByZXR1cm4ge0FycmF5fSBhbiBBcnJheSB3aXRoIHRoZSAzIHZhbHVlc1xuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzID0gXCJub3JlbmRlclwiPjxjb2RlPlxuICAgKiBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICogICB2YXIgdiA9IGNyZWF0ZVZlY3RvcigyMCwzMCk7XG4gICAqICAgcHJpbnQodi5hcnJheSgpKTsgLy8gUHJpbnRzIDogQXJyYXkgWzIwLCAzMCwgMF1cbiAgICogfVxuICAgKiA8L2Rpdj48L2NvZGU+XG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMTAuMCwgMjAuMCwgMzAuMCk7XG4gICAqIHZhciBmID0gdi5hcnJheSgpO1xuICAgKiBwcmludChmWzBdKTsgLy8gUHJpbnRzIFwiMTAuMFwiXG4gICAqIHByaW50KGZbMV0pOyAvLyBQcmludHMgXCIyMC4wXCJcbiAgICogcHJpbnQoZlsyXSk7IC8vIFByaW50cyBcIjMwLjBcIlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5hcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gW3RoaXMueCB8fCAwLCB0aGlzLnkgfHwgMCwgdGhpcy56IHx8IDBdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBFcXVhbGl0eSBjaGVjayBhZ2FpbnN0IGEgVmVjdG9yXG4gICAqXG4gICAqIEBtZXRob2QgZXF1YWxzXG4gICAqIEBwYXJhbSB7TnVtYmVyfFZlY3RvcnxBcnJheX0gW3hdIHRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIG9yIGFcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVjdG9yIG9yIGFuIEFycmF5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3ldIHRoZSB5IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3pdIHRoZSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IHdoZXRoZXIgdGhlIHZlY3RvcnMgYXJlIGVxdWFsc1xuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzID0gXCJub3JlbmRlclwiPjxjb2RlPlxuICAgKiB2MSA9IGNyZWF0ZVZlY3Rvcig1LDEwLDIwKTtcbiAgICogdjIgPSBjcmVhdGVWZWN0b3IoNSwxMCwyMCk7XG4gICAqIHYzID0gY3JlYXRlVmVjdG9yKDEzLDEwLDE5KTtcbiAgICpcbiAgICogcHJpbnQodjEuZXF1YWxzKHYyLngsdjIueSx2Mi56KSk7IC8vIHRydWVcbiAgICogcHJpbnQodjEuZXF1YWxzKHYzLngsdjMueSx2My56KSk7IC8vIGZhbHNlXG4gICAqIDwvZGl2PjwvY29kZT5cbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMTAuMCwgMjAuMCwgMzAuMCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigxMC4wLCAyMC4wLCAzMC4wKTtcbiAgICogdmFyIHYzID0gY3JlYXRlVmVjdG9yKDAuMCwgMC4wLCAwLjApO1xuICAgKiBwcmludCAodjEuZXF1YWxzKHYyKSkgLy8gdHJ1ZVxuICAgKiBwcmludCAodjEuZXF1YWxzKHYzKSkgLy8gZmFsc2VcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICB2YXIgYSwgYiwgYztcbiAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuICAgICAgYSA9IHgueCB8fCAwO1xuICAgICAgYiA9IHgueSB8fCAwO1xuICAgICAgYyA9IHgueiB8fCAwO1xuICAgIH0gZWxzZSBpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBhID0geFswXSB8fCAwO1xuICAgICAgYiA9IHhbMV0gfHwgMDtcbiAgICAgIGMgPSB4WzJdIHx8IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGEgPSB4IHx8IDA7XG4gICAgICBiID0geSB8fCAwO1xuICAgICAgYyA9IHogfHwgMDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMueCA9PT0gYSAmJiB0aGlzLnkgPT09IGIgJiYgdGhpcy56ID09PSBjO1xuICB9O1xuXG5cbiAgLy8gU3RhdGljIE1ldGhvZHNcblxuXG4gIC8qKlxuICAgKiBNYWtlIGEgbmV3IDJEIHVuaXQgdmVjdG9yIGZyb20gYW4gYW5nbGVcbiAgICpcbiAgICogQG1ldGhvZCBmcm9tQW5nbGVcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge051bWJlcn0gICAgIGFuZ2xlIHRoZSBkZXNpcmVkIGFuZ2xlXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgICAgdGhlIG5ldyBWZWN0b3Igb2JqZWN0XG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXY+XG4gICAqIDxjb2RlPlxuICAgKiBmdW5jdGlvbiBkcmF3KCkge1xuICAgKiAgIGJhY2tncm91bmQgKDIwMCk7XG4gICAqXG4gICAqICAgLy8gQ3JlYXRlIGEgdmFyaWFibGUsIHByb3BvcnRpb25hbCB0byB0aGUgbW91c2VYLFxuICAgKiAgIC8vIHZhcnlpbmcgZnJvbSAwLTM2MCwgdG8gcmVwcmVzZW50IGFuIGFuZ2xlIGluIGRlZ3JlZXMuXG4gICAqICAgYW5nbGVNb2RlKERFR1JFRVMpO1xuICAgKiAgIHZhciBteURlZ3JlZXMgPSBtYXAobW91c2VYLCAwLHdpZHRoLCAwLDM2MCk7XG4gICAqXG4gICAqICAgLy8gRGlzcGxheSB0aGF0IHZhcmlhYmxlIGluIGFuIG9uc2NyZWVuIHRleHQuXG4gICAqICAgLy8gKE5vdGUgdGhlIG5mYygpIGZ1bmN0aW9uIHRvIHRydW5jYXRlIGFkZGl0aW9uYWwgZGVjaW1hbCBwbGFjZXMsXG4gICAqICAgLy8gYW5kIHRoZSBcIlxceEIwXCIgY2hhcmFjdGVyIGZvciB0aGUgZGVncmVlIHN5bWJvbC4pXG4gICAqICAgdmFyIHJlYWRvdXQgPSBcImFuZ2xlID0gXCIgKyBuZmMobXlEZWdyZWVzLDEsMSkgKyBcIlxceEIwXCJcbiAgICogICBub1N0cm9rZSgpO1xuICAgKiAgIGZpbGwgKDApO1xuICAgKiAgIHRleHQgKHJlYWRvdXQsIDUsIDE1KTtcbiAgICpcbiAgICogICAvLyBDcmVhdGUgYSBWZWN0b3IgdXNpbmcgdGhlIGZyb21BbmdsZSBmdW5jdGlvbixcbiAgICogICAvLyBhbmQgZXh0cmFjdCBpdHMgeCBhbmQgeSBjb21wb25lbnRzLlxuICAgKiAgIHZhciB2ID0gVmVjdG9yLmZyb21BbmdsZShyYWRpYW5zKG15RGVncmVlcykpO1xuICAgKiAgIHZhciB2eCA9IHYueDtcbiAgICogICB2YXIgdnkgPSB2Lnk7XG4gICAqXG4gICAqICAgcHVzaCgpO1xuICAgKiAgIHRyYW5zbGF0ZSAod2lkdGgvMiwgaGVpZ2h0LzIpO1xuICAgKiAgIG5vRmlsbCgpO1xuICAgKiAgIHN0cm9rZSAoMTUwKTtcbiAgICogICBsaW5lICgwLDAsIDMwLDApO1xuICAgKiAgIHN0cm9rZSAoMCk7XG4gICAqICAgbGluZSAoMCwwLCAzMCp2eCwgMzAqdnkpO1xuICAgKiAgIHBvcCgpXG4gICAqIH1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5mcm9tQW5nbGUgPSBmdW5jdGlvbihhbmdsZSkge1xuICAgIHJldHVybiBuZXcgVmVjdG9yKE1hdGguY29zKGFuZ2xlKSxNYXRoLnNpbihhbmdsZSksMCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIE1ha2UgYSBuZXcgMkQgdW5pdCB2ZWN0b3IgZnJvbSBhIHJhbmRvbSBhbmdsZVxuICAgKlxuICAgKiBAbWV0aG9kIHJhbmRvbTJEXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgbmV3IFZlY3RvciBvYmplY3RcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IFZlY3Rvci5yYW5kb20yRCgpO1xuICAgKiAvLyBNYXkgbWFrZSB2J3MgYXR0cmlidXRlcyBzb21ldGhpbmcgbGlrZTpcbiAgICogLy8gWzAuNjE1NTQ2MTcsIC0wLjUxMTk1NzY1LCAwLjBdIG9yXG4gICAqIC8vIFstMC40Njk1ODQxLCAtMC4xNDM2NjczMSwgMC4wXSBvclxuICAgKiAvLyBbMC42MDkxMDk3LCAtMC4yMjgwNTI3OCwgMC4wXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnJhbmRvbTJEID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbmdsZSA9IE1hdGgucmFuZG9tKCkqTWF0aC5QSSoyO1xuICAgIHJldHVybiB0aGlzLmZyb21BbmdsZShhbmdsZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIE1ha2UgYSBuZXcgcmFuZG9tIDNEIHVuaXQgdmVjdG9yLlxuICAgKlxuICAgKiBAbWV0aG9kIHJhbmRvbTNEXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgbmV3IFZlY3RvciBvYmplY3RcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IFZlY3Rvci5yYW5kb20zRCgpO1xuICAgKiAvLyBNYXkgbWFrZSB2J3MgYXR0cmlidXRlcyBzb21ldGhpbmcgbGlrZTpcbiAgICogLy8gWzAuNjE1NTQ2MTcsIC0wLjUxMTk1NzY1LCAwLjU5OTE2OF0gb3JcbiAgICogLy8gWy0wLjQ2OTU4NDEsIC0wLjE0MzY2NzMxLCAtMC44NzExMjAyXSBvclxuICAgKiAvLyBbMC42MDkxMDk3LCAtMC4yMjgwNTI3OCwgLTAuNzU5NTkwMl1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5yYW5kb20zRCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYW5nbGUgPSBNYXRoLnJhbmRvbSgpKk1hdGguUEkqMixcblx0ICAgIHZ6ID0gTWF0aC5yYW5kb20oKSoyLTEsXG4gICAgXHR2eCA9IE1hdGguc3FydCgxLXZ6KnZ6KSpNYXRoLmNvcyhhbmdsZSksXG4gICAgXHR2eSA9IE1hdGguc3FydCgxLXZ6KnZ6KSpNYXRoLnNpbihhbmdsZSk7XG5cbiAgICByZXR1cm4gbmV3IFZlY3Rvcih2eCx2eSx2eik7XG4gIH07XG5cblxuICAvKipcbiAgICogQWRkcyB0d28gdmVjdG9ycyB0b2dldGhlciBhbmQgcmV0dXJucyBhIG5ldyBvbmUuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MSBhIFZlY3RvciB0byBhZGRcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MiBhIFZlY3RvciB0byBhZGRcbiAgICogQHBhcmFtICB7VmVjdG9yfSB0YXJnZXQgaWYgdW5kZWZpbmVkIGEgbmV3IHZlY3RvciB3aWxsIGJlIGNyZWF0ZWRcbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgcmVzdWx0aW5nIFZlY3RvclxuICAgKlxuICAgKi9cblxuICBWZWN0b3IuYWRkID0gZnVuY3Rpb24gKHYxLCB2MiwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IHYxLmNvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnNldCh2MSk7XG4gICAgfVxuICAgIHRhcmdldC5hZGQodjIpO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN1YnRyYWN0cyBvbmUgVmVjdG9yIGZyb20gYW5vdGhlciBhbmQgcmV0dXJucyBhIG5ldyBvbmUuICBUaGUgc2Vjb25kXG4gICAqIHZlY3RvciAodjIpIGlzIHN1YnRyYWN0ZWQgZnJvbSB0aGUgZmlyc3QgKHYxKSwgcmVzdWx0aW5nIGluIHYxLXYyLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjEgYSBWZWN0b3IgdG8gc3VidHJhY3QgZnJvbVxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYyIGEgVmVjdG9yIHRvIHN1YnRyYWN0XG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdGFyZ2V0IGlmIHVuZGVmaW5lZCBhIG5ldyB2ZWN0b3Igd2lsbCBiZSBjcmVhdGVkXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIHJlc3VsdGluZyBWZWN0b3JcbiAgICovXG5cbiAgVmVjdG9yLnN1YiA9IGZ1bmN0aW9uICh2MSwgdjIsIHRhcmdldCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB2MS5jb3B5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5zZXQodjEpO1xuICAgIH1cbiAgICB0YXJnZXQuc3ViKHYyKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIE11bHRpcGxpZXMgYSB2ZWN0b3IgYnkgYSBzY2FsYXIgYW5kIHJldHVybnMgYSBuZXcgdmVjdG9yLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdiB0aGUgVmVjdG9yIHRvIG11bHRpcGx5XG4gICAqIEBwYXJhbSAge051bWJlcn0gIG4gdGhlIHNjYWxhclxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHRhcmdldCBpZiB1bmRlZmluZWQgYSBuZXcgdmVjdG9yIHdpbGwgYmUgY3JlYXRlZFxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICB0aGUgcmVzdWx0aW5nIG5ldyBWZWN0b3JcbiAgICovXG4gIFZlY3Rvci5tdWx0ID0gZnVuY3Rpb24gKHYsIG4sIHRhcmdldCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB2LmNvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnNldCh2KTtcbiAgICB9XG4gICAgdGFyZ2V0Lm11bHQobik7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICAvKipcbiAgICogRGl2aWRlcyBhIHZlY3RvciBieSBhIHNjYWxhciBhbmQgcmV0dXJucyBhIG5ldyB2ZWN0b3IuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2IHRoZSBWZWN0b3IgdG8gZGl2aWRlXG4gICAqIEBwYXJhbSAge051bWJlcn0gIG4gdGhlIHNjYWxhclxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHRhcmdldCBpZiB1bmRlZmluZWQgYSBuZXcgdmVjdG9yIHdpbGwgYmUgY3JlYXRlZFxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSByZXN1bHRpbmcgbmV3IFZlY3RvclxuICAgKi9cbiAgVmVjdG9yLmRpdiA9IGZ1bmN0aW9uICh2LCBuLCB0YXJnZXQpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdi5jb3B5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5zZXQodik7XG4gICAgfVxuICAgIHRhcmdldC5kaXYobik7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjdG9ycy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYxIHRoZSBmaXJzdCBWZWN0b3JcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MiB0aGUgc2Vjb25kIFZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICB0aGUgZG90IHByb2R1Y3RcbiAgICovXG4gIFZlY3Rvci5kb3QgPSBmdW5jdGlvbiAodjEsIHYyKSB7XG4gICAgcmV0dXJuIHYxLmRvdCh2Mik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MSB0aGUgZmlyc3QgVmVjdG9yXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjIgdGhlIHNlY29uZCBWZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgdGhlIGNyb3NzIHByb2R1Y3RcbiAgICovXG4gIFZlY3Rvci5jcm9zcyA9IGZ1bmN0aW9uICh2MSwgdjIpIHtcbiAgICByZXR1cm4gdjEuY3Jvc3ModjIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBFdWNsaWRlYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzIChjb25zaWRlcmluZyBhXG4gICAqIHBvaW50IGFzIGEgdmVjdG9yIG9iamVjdCkuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MSB0aGUgZmlyc3QgVmVjdG9yXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjIgdGhlIHNlY29uZCBWZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgdGhlIGRpc3RhbmNlXG4gICAqL1xuICBWZWN0b3IuZGlzdCA9IGZ1bmN0aW9uICh2MSx2Mikge1xuICAgIHJldHVybiB2MS5kaXN0KHYyKTtcbiAgfTtcblxuICAvKipcbiAgICogTGluZWFyIGludGVycG9sYXRlIGEgdmVjdG9yIHRvIGFub3RoZXIgdmVjdG9yIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBhcyBhXG4gICAqIG5ldyB2ZWN0b3IuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtWZWN0b3J9IHYxIGEgc3RhcnRpbmcgVmVjdG9yXG4gICAqIEBwYXJhbSB7VmVjdG9yfSB2MiB0aGUgVmVjdG9yIHRvIGxlcnAgdG9cbiAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgIHRoZSBhbW91bnQgb2YgaW50ZXJwb2xhdGlvbjsgc29tZSB2YWx1ZSBiZXR3ZWVuIDAuMFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgKG9sZCB2ZWN0b3IpIGFuZCAxLjAgKG5ldyB2ZWN0b3IpLiAwLjEgaXMgdmVyeSBuZWFyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICB0aGUgbmV3IHZlY3Rvci4gMC41IGlzIGhhbGZ3YXkgaW4gYmV0d2Vlbi5cbiAgICovXG4gIFZlY3Rvci5sZXJwID0gZnVuY3Rpb24gKHYxLCB2MiwgYW10LCB0YXJnZXQpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdjEuY29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuc2V0KHYxKTtcbiAgICB9XG4gICAgdGFyZ2V0LmxlcnAodjIsIGFtdCk7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyB0aGUgYW5nbGUgKGluIHJhZGlhbnMpIGJldHdlZW4gdHdvIHZlY3RvcnMuXG4gICAqIEBtZXRob2QgYW5nbGVCZXR3ZWVuXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MSB0aGUgeCwgeSwgYW5kIHogY29tcG9uZW50cyBvZiBhIFZlY3RvclxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYyIHRoZSB4LCB5LCBhbmQgeiBjb21wb25lbnRzIG9mIGEgVmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn0gICAgICAgdGhlIGFuZ2xlIGJldHdlZW4gKGluIHJhZGlhbnMpXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDAsIDApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMCwgMSwgMCk7XG4gICAqXG4gICAqIHZhciBhbmdsZSA9IFZlY3Rvci5hbmdsZUJldHdlZW4odjEsIHYyKTtcbiAgICogLy8gYW5nbGUgaXMgUEkvMlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLmFuZ2xlQmV0d2VlbiA9IGZ1bmN0aW9uICh2MSwgdjIpIHtcbiAgICByZXR1cm4gTWF0aC5hY29zKHYxLmRvdCh2MikgLyAodjEubWFnKCkgKiB2Mi5tYWcoKSkpO1xuICB9O1xuXG4gIC8vIHJldHVybiBWZWN0b3I7XG5tb2R1bGUuZXhwb3J0cyA9IFZlY3Rvcjtcbi8vIH0pO1xuIiwiZnVuY3Rpb24gVXRpbHMoY3gsIGNhbnZhcykge1xuICByZXR1cm4ge1xuICAgIGN4IDogY3ggfHwgJycsXG4gICAgY2FudmFzOiBjYW52YXMgfHwgJycsXG4gICAgaGFsZlg6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLndpZHRoIC8gMjtcbiAgICB9LFxuICAgIGhhbGZZOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhbnZhcy5oZWlnaHQgLyAyO1xuICAgIH0sXG4gICAgcmFuZ2U6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgICAgaWYgKCFtYXgpIHtcbiAgICAgICAgbWF4ID0gbWluO1xuICAgICAgICBtaW4gPSAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKTtcbiAgICB9LFxuICAgIHJhbmdlOiBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgICAgdmFyIHJhbmQgPSBNYXRoLnJhbmRvbSgpO1xuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcmFuZDtcbiAgICAgIH0gZWxzZVxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHJhbmQgKiBtaW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobWluID4gbWF4KSB7XG4gICAgICAgICAgdmFyIHRtcCA9IG1pbjtcbiAgICAgICAgICBtaW4gPSBtYXg7XG4gICAgICAgICAgbWF4ID0gdG1wO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJhbmQgKiAobWF4LW1pbikgKyBtaW47XG4gICAgICB9XG4gICAgfSxcbiAgICAvLyB0YWtlbiBmcm9tIHRoZSBwNS5qcyBwcm9qZWN0XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Byb2Nlc3NpbmcvcDUuanMvYmxvYi81YzgxZDY1NWY2ODNmOTA0NTJiODBhYjIyNWE2N2U0NDk0NjNmZmY5L3NyYy9tYXRoL2NhbGN1bGF0aW9uLmpzI0wzOTRcbiAgICBtYXA6IGZ1bmN0aW9uKG4sIHN0YXJ0MSwgc3RvcDEsIHN0YXJ0Miwgc3RvcDIpIHtcbiAgICAgIHJldHVybiAoKG4tc3RhcnQxKS8oc3RvcDEtc3RhcnQxKSkqKHN0b3AyLXN0YXJ0Mikrc3RhcnQyO1xuICAgIH0sXG5cbiAgICBnZXRNb3VzZVBvczogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IGV2ZW50LmNsaWVudFgsXG4gICAgICAgIHk6IGV2ZW50LmNsaWVudFlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5jeC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfSxcbiAgICBXOiBjYW52YXMud2lkdGgsXG4gICAgSDogY2FudmFzLmhlaWdodCxcbiAgICBIVzogY2FudmFzLndpZHRoIC8gMixcbiAgICBISDogY2FudmFzLmhlaWdodCAvIDIsXG4gICAgZWxsaXBzZTogZnVuY3Rpb24oeCwgeSwgcikge1xuICAgICAgdGhpcy5jeC5iZWdpblBhdGgoKTtcbiAgICAgIHRoaXMuY3guYXJjKHgsIHksIHIsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICB0aGlzLmN4LmZpbGwoKTtcbiAgICAgIHRoaXMuY3guc3Ryb2tlKCk7XG4gICAgfSxcbiAgICBjb25zdHJhaW46IGZ1bmN0aW9uKHZhbCwgbWluLCBtYXgpIHtcbiAgICAgIGlmICh2YWwgPiBtYXgpIHtcbiAgICAgICAgcmV0dXJuIG1heDtcbiAgICAgIH0gZWxzZSBpZiAodmFsIDwgbWluKSB7XG4gICAgICAgIHJldHVybiBtaW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihjeCwgY2FudmFzKSB7XG4gIHJldHVybiBuZXcgVXRpbHMoY3gsIGNhbnZhcyk7XG59O1xuIl19
