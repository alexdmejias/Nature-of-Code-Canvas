require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var V = require('V')
  , utils
;

function Mover(cx, canvas, opts) {
  utils = require('utils')(cx, canvas);

  this.cx = cx;
  this.canvas = canvas;

  this.mass = 1;
  this.position = new V(30, 30);
  this.velocity = new V(0, 0);
  this.acceleration = new V(0, 0);
}

Mover.prototype.applyForce = function (force) {
  var f = V.div(force, this.mass);
  this.acceleration.add(f);
};

Mover.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.acceleration.mult(0);
};

Mover.prototype.checkEdges = function () {
  if (this.position.x > utils.W) {
    this.position.x = utils.W;
    this.velocity.x *= -1;
  } else if (this.position.x < 0) {
    this.position.x = 0;
    this.velocity.x *= -1;
  }

  if (this.position.y > utils.H) {
    this.position.y = utils.H;
    this.velocity.y *= -1;
  } else if (this.position.y < 0) {
    this.position.y = 0;
    this.velocity.y *= -1;
  }
};

Mover.prototype.display = function () {
  this.cx.fillStyle = 'grey';
  this.cx.strokeStyle = 'black';
  utils.ellipse(this.position.x, this.position.y, 48);
};

module.exports = Mover;

},{"V":"V","utils":"utils"}],2:[function(require,module,exports){
var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , utils = require('utils')(cx, canvas)
  , Mover = require('./_Mover')
  , V = require('V')
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , mover
  , wind
  , gravity
;

function setup() {
  console.log('setup');
  canvas.height = 600;
  canvas.width = 600;

  mover = new Mover(cx, canvas);
  wind = new V(0.01, 0);
  gravity = new V(0, 0.1);
}


function draw() {
  utils.clear();
  mover.applyForce(wind);
  mover.applyForce(gravity);

  mover.update();
  mover.checkEdges();
  mover.display();

  window.requestAnimationFrame(draw);
}

(function() {
  setup();
  window.requestAnimationFrame(draw);
}());

},{"./_Mover":1,"V":"V","utils":"utils"}],"V":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8yLzEvX01vdmVyLmpzIiwiY2hhcHRlcnMvMi8xL2FwcC5qcyIsIm1vZHVsZXMvcDVWZWN0b3JzLmpzIiwibW9kdWxlcy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1NkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFYgPSByZXF1aXJlKCdWJylcbiAgLCB1dGlsc1xuO1xuXG5mdW5jdGlvbiBNb3ZlcihjeCwgY2FudmFzLCBvcHRzKSB7XG4gIHV0aWxzID0gcmVxdWlyZSgndXRpbHMnKShjeCwgY2FudmFzKTtcblxuICB0aGlzLmN4ID0gY3g7XG4gIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gIHRoaXMubWFzcyA9IDE7XG4gIHRoaXMucG9zaXRpb24gPSBuZXcgVigzMCwgMzApO1xuICB0aGlzLnZlbG9jaXR5ID0gbmV3IFYoMCwgMCk7XG4gIHRoaXMuYWNjZWxlcmF0aW9uID0gbmV3IFYoMCwgMCk7XG59XG5cbk1vdmVyLnByb3RvdHlwZS5hcHBseUZvcmNlID0gZnVuY3Rpb24gKGZvcmNlKSB7XG4gIHZhciBmID0gVi5kaXYoZm9yY2UsIHRoaXMubWFzcyk7XG4gIHRoaXMuYWNjZWxlcmF0aW9uLmFkZChmKTtcbn07XG5cbk1vdmVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy52ZWxvY2l0eS5hZGQodGhpcy5hY2NlbGVyYXRpb24pO1xuICB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnZlbG9jaXR5KTtcbiAgdGhpcy5hY2NlbGVyYXRpb24ubXVsdCgwKTtcbn07XG5cbk1vdmVyLnByb3RvdHlwZS5jaGVja0VkZ2VzID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5wb3NpdGlvbi54ID4gdXRpbHMuVykge1xuICAgIHRoaXMucG9zaXRpb24ueCA9IHV0aWxzLlc7XG4gICAgdGhpcy52ZWxvY2l0eS54ICo9IC0xO1xuICB9IGVsc2UgaWYgKHRoaXMucG9zaXRpb24ueCA8IDApIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSAwO1xuICAgIHRoaXMudmVsb2NpdHkueCAqPSAtMTtcbiAgfVxuXG4gIGlmICh0aGlzLnBvc2l0aW9uLnkgPiB1dGlscy5IKSB7XG4gICAgdGhpcy5wb3NpdGlvbi55ID0gdXRpbHMuSDtcbiAgICB0aGlzLnZlbG9jaXR5LnkgKj0gLTE7XG4gIH0gZWxzZSBpZiAodGhpcy5wb3NpdGlvbi55IDwgMCkge1xuICAgIHRoaXMucG9zaXRpb24ueSA9IDA7XG4gICAgdGhpcy52ZWxvY2l0eS55ICo9IC0xO1xuICB9XG59O1xuXG5Nb3Zlci5wcm90b3R5cGUuZGlzcGxheSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jeC5maWxsU3R5bGUgPSAnZ3JleSc7XG4gIHRoaXMuY3guc3Ryb2tlU3R5bGUgPSAnYmxhY2snO1xuICB1dGlscy5lbGxpcHNlKHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55LCA0OCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vdmVyO1xuIiwidmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKVxuICAsIGN4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgLCB1dGlscyA9IHJlcXVpcmUoJ3V0aWxzJykoY3gsIGNhbnZhcylcbiAgLCBNb3ZlciA9IHJlcXVpcmUoJy4vX01vdmVyJylcbiAgLCBWID0gcmVxdWlyZSgnVicpXG47XG5cbnZhciBXSURUSCA9IGNhbnZhcy53aWR0aFxuICAsIEhFSUdIVCA9IGNhbnZhcy5oZWlnaHRcbiAgLCBtb3ZlclxuICAsIHdpbmRcbiAgLCBncmF2aXR5XG47XG5cbmZ1bmN0aW9uIHNldHVwKCkge1xuICBjb25zb2xlLmxvZygnc2V0dXAnKTtcbiAgY2FudmFzLmhlaWdodCA9IDYwMDtcbiAgY2FudmFzLndpZHRoID0gNjAwO1xuXG4gIG1vdmVyID0gbmV3IE1vdmVyKGN4LCBjYW52YXMpO1xuICB3aW5kID0gbmV3IFYoMC4wMSwgMCk7XG4gIGdyYXZpdHkgPSBuZXcgVigwLCAwLjEpO1xufVxuXG5cbmZ1bmN0aW9uIGRyYXcoKSB7XG4gIHV0aWxzLmNsZWFyKCk7XG4gIG1vdmVyLmFwcGx5Rm9yY2Uod2luZCk7XG4gIG1vdmVyLmFwcGx5Rm9yY2UoZ3Jhdml0eSk7XG5cbiAgbW92ZXIudXBkYXRlKCk7XG4gIG1vdmVyLmNoZWNrRWRnZXMoKTtcbiAgbW92ZXIuZGlzcGxheSgpO1xuXG4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG59XG5cbihmdW5jdGlvbigpIHtcbiAgc2V0dXAoKTtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn0oKSk7XG4iLCIgIC8qKlxuICAgKiBBIGNsYXNzIHRvIGRlc2NyaWJlIGEgdHdvIG9yIHRocmVlIGRpbWVuc2lvbmFsIHZlY3Rvciwgc3BlY2lmaWNhbGx5XG4gICAqIGEgRXVjbGlkZWFuIChhbHNvIGtub3duIGFzIGdlb21ldHJpYykgdmVjdG9yLiBBIHZlY3RvciBpcyBhbiBlbnRpdHlcbiAgICogdGhhdCBoYXMgYm90aCBtYWduaXR1ZGUgYW5kIGRpcmVjdGlvbi4gVGhlIGRhdGF0eXBlLCBob3dldmVyLCBzdG9yZXNcbiAgICogdGhlIGNvbXBvbmVudHMgb2YgdGhlIHZlY3RvciAoeCx5IGZvciAyRCwgYW5kIHgseSx6IGZvciAzRCkuIFRoZSBtYWduaXR1ZGVcbiAgICogYW5kIGRpcmVjdGlvbiBjYW4gYmUgYWNjZXNzZWQgdmlhIHRoZSBtZXRob2RzIG1hZygpIGFuZCBoZWFkaW5nKCkuIEluIG1hbnlcbiAgICogb2YgdGhlIHA1LmpzIGV4YW1wbGVzLCB5b3Ugd2lsbCBzZWUgVmVjdG9yIHVzZWQgdG8gZGVzY3JpYmUgYSBwb3NpdGlvbixcbiAgICogdmVsb2NpdHksIG9yIGFjY2VsZXJhdGlvbi4gRm9yIGV4YW1wbGUsIGlmIHlvdSBjb25zaWRlciBhIHJlY3RhbmdsZSBtb3ZpbmdcbiAgICogYWNyb3NzIHRoZSBzY3JlZW4sIGF0IGFueSBnaXZlbiBpbnN0YW50IGl0IGhhcyBhIHBvc2l0aW9uIChhIHZlY3RvciB0aGF0XG4gICAqIHBvaW50cyBmcm9tIHRoZSBvcmlnaW4gdG8gaXRzIGxvY2F0aW9uKSwgYSB2ZWxvY2l0eSAodGhlIHJhdGUgYXQgd2hpY2ggdGhlXG4gICAqIG9iamVjdCdzIHBvc2l0aW9uIGNoYW5nZXMgcGVyIHRpbWUgdW5pdCwgZXhwcmVzc2VkIGFzIGEgdmVjdG9yKSwgYW5kXG4gICAqIGFjY2VsZXJhdGlvbiAodGhlIHJhdGUgYXQgd2hpY2ggdGhlIG9iamVjdCdzIHZlbG9jaXR5IGNoYW5nZXMgcGVyIHRpbWVcbiAgICogdW5pdCwgZXhwcmVzc2VkIGFzIGEgdmVjdG9yKS4gU2luY2UgdmVjdG9ycyByZXByZXNlbnQgZ3JvdXBpbmdzIG9mIHZhbHVlcyxcbiAgICogd2UgY2Fubm90IHNpbXBseSB1c2UgdHJhZGl0aW9uYWwgYWRkaXRpb24vbXVsdGlwbGljYXRpb24vZXRjLiBJbnN0ZWFkLFxuICAgKiB3ZSdsbCBuZWVkIHRvIGRvIHNvbWUgXCJ2ZWN0b3JcIiBtYXRoLCB3aGljaCBpcyBtYWRlIGVhc3kgYnkgdGhlIG1ldGhvZHNcbiAgICogaW5zaWRlIHRoZSBWZWN0b3IgY2xhc3MuXG4gICAqXG4gICAqIEBjbGFzcyBWZWN0b3JcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbeF0geCBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcGFyYW0ge051bWJlcn0gW3ldIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt6XSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXY+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoNDAsIDUwKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDQwLCA1MCk7XG4gICAqXG4gICAqIGVsbGlwc2UodjEueCwgdjEueSwgNTAsIDUwKTtcbiAgICogZWxsaXBzZSh2Mi54LCB2Mi55LCA1MCwgNTApO1xuICAgKiB2MS5hZGQodjIpO1xuICAgKiBlbGxpcHNlKHYxLngsIHYxLnksIDUwLCA1MCk7XG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICB2YXIgVmVjdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy54ID0gYXJndW1lbnRzWzBdIHx8IDA7XG5cdFx0dGhpcy55ID0gYXJndW1lbnRzWzFdIHx8IDA7XG5cdFx0dGhpcy56ID0gYXJndW1lbnRzWzJdIHx8IDA7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSB2ZWN0b3IgdiBieSBjYWxsaW5nIFN0cmluZyh2KVxuICAgKiBvciB2LnRvU3RyaW5nKCkuIFRoaXMgbWV0aG9kIGlzIHVzZWZ1bCBmb3IgbG9nZ2luZyB2ZWN0b3JzIGluIHRoZVxuICAgKiBjb25zb2xlLlxuICAgKiBAbWV0aG9kICB0b1N0cmluZ1xuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzID0gXCJub3JlbmRlclwiPjxjb2RlPlxuICAgKiBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICogICB2YXIgdiA9IGNyZWF0ZVZlY3RvcigyMCwzMCk7XG4gICAqICAgcHJpbnQoU3RyaW5nKHYpKTsgLy8gcHJpbnRzIFwiVmVjdG9yIE9iamVjdCA6IFsyMCwgMzAsIDBdXCJcbiAgICogfVxuICAgKiA8L2Rpdj48L2NvZGU+XG4gICAqXG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdWZWN0b3IgT2JqZWN0IDogWycrIHRoaXMueCArJywgJysgdGhpcy55ICsnLCAnKyB0aGlzLnogKyAnXSc7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHgsIHksIGFuZCB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIHVzaW5nIHR3byBvciB0aHJlZSBzZXBhcmF0ZVxuICAgKiB2YXJpYWJsZXMsIHRoZSBkYXRhIGZyb20gYSBWZWN0b3IsIG9yIHRoZSB2YWx1ZXMgZnJvbSBhIGZsb2F0IGFycmF5LlxuICAgKiBAbWV0aG9kIHNldFxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcnxWZWN0b3J8QXJyYXl9IFt4XSB0aGUgeCBjb21wb25lbnQgb2YgdGhlIHZlY3RvciBvciBhXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlY3RvciBvciBhbiBBcnJheVxuICAgKiBAcGFyYW0ge051bWJlcn0gICAgICAgICAgICAgICAgIFt5XSB0aGUgeSBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcGFyYW0ge051bWJlcn0gICAgICAgICAgICAgICAgIFt6XSB0aGUgeiBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgKiAgICB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogICAgdi5zZXQoNCw1LDYpOyAvLyBTZXRzIHZlY3RvciB0byBbNCwgNSwgNl1cbiAgICpcbiAgICogICAgdmFyIHYxID0gY3JlYXRlVmVjdG9yKDAsIDAsIDApO1xuICAgKiAgICB2YXIgYXJyID0gWzEsIDIsIDNdO1xuICAgKiAgICB2MS5zZXQoYXJyKTsgLy8gU2V0cyB2ZWN0b3IgdG8gWzEsIDIsIDNdXG4gICAqIH1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuICAgICAgdGhpcy54ID0geC54IHx8IDA7XG4gICAgICB0aGlzLnkgPSB4LnkgfHwgMDtcbiAgICAgIHRoaXMueiA9IHgueiB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHRoaXMueCA9IHhbMF0gfHwgMDtcbiAgICAgIHRoaXMueSA9IHhbMV0gfHwgMDtcbiAgICAgIHRoaXMueiA9IHhbMl0gfHwgMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0aGlzLnggPSB4IHx8IDA7XG4gICAgdGhpcy55ID0geSB8fCAwO1xuICAgIHRoaXMueiA9IHogfHwgMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogR2V0cyBhIGNvcHkgb2YgdGhlIHZlY3RvciwgcmV0dXJucyBhIFZlY3RvciBvYmplY3QuXG4gICAqXG4gICAqIEBtZXRob2QgY29weVxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSBjb3B5IG9mIHRoZSBWZWN0b3Igb2JqZWN0XG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2YXIgdjIgPSB2LmNvcHkoKTtcbiAgICogcHJpbnQodjEueCA9PSB2Mi54ICYmIHYxLnkgPT0gdjIueSAmJiB2MS56ID09IHYyLnopO1xuICAgKiAvLyBQcmludHMgXCJ0cnVlXCJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLngsdGhpcy55LHRoaXMueik7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZHMgeCwgeSwgYW5kIHogY29tcG9uZW50cyB0byBhIHZlY3RvciwgYWRkcyBvbmUgdmVjdG9yIHRvIGFub3RoZXIsIG9yXG4gICAqIGFkZHMgdHdvIGluZGVwZW5kZW50IHZlY3RvcnMgdG9nZXRoZXIuIFRoZSB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgdGhhdCBhZGRzXG4gICAqIHR3byB2ZWN0b3JzIHRvZ2V0aGVyIGlzIGEgc3RhdGljIG1ldGhvZCBhbmQgcmV0dXJucyBhIFZlY3RvciwgdGhlIG90aGVyc1xuICAgKiBhY3RzIGRpcmVjdGx5IG9uIHRoZSB2ZWN0b3IuIFNlZSB0aGUgZXhhbXBsZXMgZm9yIG1vcmUgY29udGV4dC5cbiAgICpcbiAgICogQG1ldGhvZCBhZGRcbiAgICogQGNoYWluYWJsZVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ8VmVjdG9yfEFycmF5fSB4ICAgdGhlIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3IgdG8gYmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkIG9yIGEgVmVjdG9yIG9yIGFuIEFycmF5XG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIFt5XSB0aGUgeSBjb21wb25lbnQgb2YgdGhlIHZlY3RvciB0byBiZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWRcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3pdIHRoZSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIHRvIGJlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRlZFxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgICAgICAgICAgICAgICAgdGhlIFZlY3RvciBvYmplY3QuXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHYuYWRkKDQsNSw2KTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvIFs1LCA3LCA5XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMiwgMywgNCk7XG4gICAqXG4gICAqIHZhciB2MyA9IFZlY3Rvci5hZGQodjEsIHYyKTtcbiAgICogLy8gdjMgaGFzIGNvbXBvbmVudHMgWzMsIDUsIDddXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IpIHtcbiAgICAgIHRoaXMueCArPSB4LnggfHwgMDtcbiAgICAgIHRoaXMueSArPSB4LnkgfHwgMDtcbiAgICAgIHRoaXMueiArPSB4LnogfHwgMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICB0aGlzLnggKz0geFswXSB8fCAwO1xuICAgICAgdGhpcy55ICs9IHhbMV0gfHwgMDtcbiAgICAgIHRoaXMueiArPSB4WzJdIHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdGhpcy54ICs9IHggfHwgMDtcbiAgICB0aGlzLnkgKz0geSB8fCAwO1xuICAgIHRoaXMueiArPSB6IHx8IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN1YnRyYWN0cyB4LCB5LCBhbmQgeiBjb21wb25lbnRzIGZyb20gYSB2ZWN0b3IsIHN1YnRyYWN0cyBvbmUgdmVjdG9yIGZyb21cbiAgICogYW5vdGhlciwgb3Igc3VidHJhY3RzIHR3byBpbmRlcGVuZGVudCB2ZWN0b3JzLiBUaGUgdmVyc2lvbiBvZiB0aGUgbWV0aG9kXG4gICAqIHRoYXQgc3VidHJhY3RzIHR3byB2ZWN0b3JzIGlzIGEgc3RhdGljIG1ldGhvZCBhbmQgcmV0dXJucyBhIFZlY3RvciwgdGhlXG4gICAqIG90aGVyIGFjdHMgZGlyZWN0bHkgb24gdGhlIHZlY3Rvci4gU2VlIHRoZSBleGFtcGxlcyBmb3IgbW9yZSBjb250ZXh0LlxuICAgKlxuICAgKiBAbWV0aG9kIHN1YlxuICAgKiBAY2hhaW5hYmxlXG4gICAqIEBwYXJhbSAge051bWJlcnxWZWN0b3J8QXJyYXl9IHggICB0aGUgeCBjb21wb25lbnQgb2YgdGhlIHZlY3RvciBvciBhXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWN0b3Igb3IgYW4gQXJyYXlcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3ldIHRoZSB5IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIFt6XSB0aGUgeiBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgICAgICAgICAgICAgICAgVmVjdG9yIG9iamVjdC5cbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3Rvcig0LCA1LCA2KTtcbiAgICogdi5zdWIoMSwgMSwgMSk7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0byBbMywgNCwgNV1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigyLCAzLCA0KTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKlxuICAgKiB2YXIgdjMgPSBWZWN0b3Iuc3ViKHYxLCB2Mik7XG4gICAqIC8vIHYzIGhhcyBjb21wbmVudHMgWzEsIDEsIDFdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IpIHtcbiAgICAgIHRoaXMueCAtPSB4LnggfHwgMDtcbiAgICAgIHRoaXMueSAtPSB4LnkgfHwgMDtcbiAgICAgIHRoaXMueiAtPSB4LnogfHwgMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICB0aGlzLnggLT0geFswXSB8fCAwO1xuICAgICAgdGhpcy55IC09IHhbMV0gfHwgMDtcbiAgICAgIHRoaXMueiAtPSB4WzJdIHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdGhpcy54IC09IHggfHwgMDtcbiAgICB0aGlzLnkgLT0geSB8fCAwO1xuICAgIHRoaXMueiAtPSB6IHx8IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIE11bHRpcGx5IHRoZSB2ZWN0b3IgYnkgYSBzY2FsYXIuIFRoZSBzdGF0aWMgdmVyc2lvbiBvZiB0aGlzIG1ldGhvZFxuICAgKiBjcmVhdGVzIGEgbmV3IFZlY3RvciB3aGlsZSB0aGUgbm9uIHN0YXRpYyB2ZXJzaW9uIGFjdHMgb24gdGhlIHZlY3RvclxuICAgKiBkaXJlY3RseS4gU2VlIHRoZSBleGFtcGxlcyBmb3IgbW9yZSBjb250ZXh0LlxuICAgKlxuICAgKiBAbWV0aG9kIG11bHRcbiAgICogQGNoYWluYWJsZVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgIG4gdGhlIG51bWJlciB0byBtdWx0aXBseSB3aXRoIHRoZSB2ZWN0b3JcbiAgICogQHJldHVybiB7VmVjdG9yfSBhIHJlZmVyZW5jZSB0byB0aGUgVmVjdG9yIG9iamVjdCAoYWxsb3cgY2hhaW5pbmcpXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHYubXVsdCgyKTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvIFsyLCA0LCA2XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2YXIgdjIgPSBWZWN0b3IubXVsdCh2MSwgMik7XG4gICAqIC8vIHYyIGhhcyBjb21wbmVudHMgWzIsIDQsIDZdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiAobikge1xuICAgIHRoaXMueCAqPSBuIHx8IDA7XG4gICAgdGhpcy55ICo9IG4gfHwgMDtcbiAgICB0aGlzLnogKj0gbiB8fCAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBEaXZpZGUgdGhlIHZlY3RvciBieSBhIHNjYWxhci4gVGhlIHN0YXRpYyB2ZXJzaW9uIG9mIHRoaXMgbWV0aG9kIGNyZWF0ZXMgYVxuICAgKiBuZXcgVmVjdG9yIHdoaWxlIHRoZSBub24gc3RhdGljIHZlcnNpb24gYWN0cyBvbiB0aGUgdmVjdG9yIGRpcmVjdGx5LlxuICAgKiBTZWUgdGhlIGV4YW1wbGVzIGZvciBtb3JlIGNvbnRleHQuXG4gICAqXG4gICAqIEBtZXRob2QgZGl2XG4gICAqIEBjaGFpbmFibGVcbiAgICogQHBhcmFtICB7bnVtYmVyfSAgICBuIHRoZSBudW1iZXIgdG8gZGl2aWRlIHRoZSB2ZWN0b3IgYnlcbiAgICogQHJldHVybiB7VmVjdG9yfSBhIHJlZmVyZW5jZSB0byB0aGUgVmVjdG9yIG9iamVjdCAoYWxsb3cgY2hhaW5pbmcpXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoNiwgNCwgMik7XG4gICAqIHYuZGl2KDIpOyAvL3YncyBjb21wbmVudHMgYXJlIHNldCB0byBbMywgMiwgMV1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSAgPSBjcmVhdGVWZWN0b3IoNiwgNCwgMik7XG4gICAqIHZhciB2MiA9IFZlY3Rvci5kaXYodiwgMik7XG4gICAqIC8vIHYyIGhhcyBjb21wbmVudHMgWzMsIDIsIDFdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmRpdiA9IGZ1bmN0aW9uIChuKSB7XG4gICAgdGhpcy54IC89IG47XG4gICAgdGhpcy55IC89IG47XG4gICAgdGhpcy56IC89IG47XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIG1hZ25pdHVkZSAobGVuZ3RoKSBvZiB0aGUgdmVjdG9yIGFuZCByZXR1cm5zIHRoZSByZXN1bHQgYXNcbiAgICogYSBmbG9hdCAodGhpcyBpcyBzaW1wbHkgdGhlIGVxdWF0aW9uIHNxcnQoeCp4ICsgeSp5ICsgeip6KS4pXG4gICAqXG4gICAqIEBtZXRob2QgbWFnXG4gICAqIEByZXR1cm4ge051bWJlcn0gbWFnbml0dWRlIG9mIHRoZSB2ZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigyMC4wLCAzMC4wLCA0MC4wKTtcbiAgICogdmFyIG0gPSB2Lm1hZygxMCk7XG4gICAqIHByaW50KG0pOyAvLyBQcmludHMgXCI1My44NTE2NDgwNzEzNDUwNFwiXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLm1hZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMubWFnU3EoKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgbWFnbml0dWRlIG9mIHRoZSB2ZWN0b3IgYW5kIHJldHVybnMgdGhlIHJlc3VsdFxuICAgKiBhcyBhIGZsb2F0ICh0aGlzIGlzIHNpbXBseSB0aGUgZXF1YXRpb24gPGVtPih4KnggKyB5KnkgKyB6KnopPC9lbT4uKVxuICAgKiBGYXN0ZXIgaWYgdGhlIHJlYWwgbGVuZ3RoIGlzIG5vdCByZXF1aXJlZCBpbiB0aGVcbiAgICogY2FzZSBvZiBjb21wYXJpbmcgdmVjdG9ycywgZXRjLlxuICAgKlxuICAgKiBAbWV0aG9kIG1hZ1NxXG4gICAqIEByZXR1cm4ge251bWJlcn0gc3F1YXJlZCBtYWduaXR1ZGUgb2YgdGhlIHZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDYsIDQsIDIpO1xuICAgKiBwcmludCh2MS5tYWdTcSgpKTsgLy8gUHJpbnRzIFwiNTZcIlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5tYWdTcSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgeCA9IHRoaXMueCwgeSA9IHRoaXMueSwgeiA9IHRoaXMuejtcbiAgICByZXR1cm4gKHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzLiBUaGUgdmVyc2lvbiBvZiB0aGUgbWV0aG9kXG4gICAqIHRoYXQgY29tcHV0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byBpbmRlcGVuZGVudCB2ZWN0b3JzIGlzIGEgc3RhdGljXG4gICAqIG1ldGhvZC4gU2VlIHRoZSBleGFtcGxlcyBmb3IgbW9yZSBjb250ZXh0LlxuICAgKlxuICAgKlxuICAgKiBAbWV0aG9kIGRvdFxuICAgKiBAcGFyYW0gIHtOdW1iZXJ8VmVjdG9yfSB4ICAgeCBjb21wb25lbnQgb2YgdGhlIHZlY3RvciBvciBhIFZlY3RvclxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICBbeV0geSBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICBbel0geiBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICB0aGUgZG90IHByb2R1Y3RcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigyLCAzLCA0KTtcbiAgICpcbiAgICogcHJpbnQodjEuZG90KHYyKSk7IC8vIFByaW50cyBcIjIwXCJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvL1N0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMywgMiwgMSk7XG4gICAqIHByaW50IChWZWN0b3IuZG90KHYxLCB2MikpOyAvLyBQcmludHMgXCIxMFwiXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvdCh4LngsIHgueSwgeC56KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMueCAqICh4IHx8IDApICtcbiAgICAgICAgICAgdGhpcy55ICogKHkgfHwgMCkgK1xuICAgICAgICAgICB0aGlzLnogKiAoeiB8fCAwKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhbmQgcmV0dXJucyBhIHZlY3RvciBjb21wb3NlZCBvZiB0aGUgY3Jvc3MgcHJvZHVjdCBiZXR3ZWVuXG4gICAqIHR3byB2ZWN0b3JzLiBCb3RoIHRoZSBzdGF0aWMgYW5kIG5vbiBzdGF0aWMgbWV0aG9kcyByZXR1cm4gYSBuZXcgVmVjdG9yLlxuICAgKiBTZWUgdGhlIGV4YW1wbGVzIGZvciBtb3JlIGNvbnRleHQuXG4gICAqXG4gICAqIEBtZXRob2QgY3Jvc3NcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2IFZlY3RvciB0byBiZSBjcm9zc2VkXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICBWZWN0b3IgY29tcG9zZWQgb2YgY3Jvc3MgcHJvZHVjdFxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKlxuICAgKiB2MS5jcm9zcyh2Mik7IC8vIHYncyBjb21wb25lbnRzIGFyZSBbMCwgMCwgMF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiAvLyBTdGF0aWMgbWV0aG9kXG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAwLCAwKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDAsIDEsIDApO1xuICAgKlxuICAgKiB2YXIgY3Jvc3NQcm9kdWN0ID0gVmVjdG9yLmNyb3NzKHYxLCB2Mik7XG4gICAqIC8vIGNyb3NzUHJvZHVjdCBoYXMgY29tcG9uZW50cyBbMCwgMCwgMV1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuY3Jvc3MgPSBmdW5jdGlvbiAodikge1xuICAgIHZhciB4ID0gdGhpcy55ICogdi56IC0gdGhpcy56ICogdi55O1xuICAgIHZhciB5ID0gdGhpcy56ICogdi54IC0gdGhpcy54ICogdi56O1xuICAgIHZhciB6ID0gdGhpcy54ICogdi55IC0gdGhpcy55ICogdi54O1xuXG5cdFx0cmV0dXJuIG5ldyBWZWN0b3IoeCx5LHopO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBFdWNsaWRlYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzIChjb25zaWRlcmluZyBhXG4gICAqIHBvaW50IGFzIGEgdmVjdG9yIG9iamVjdCkuXG4gICAqXG4gICAqIEBtZXRob2QgZGlzdFxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYgdGhlIHgsIHksIGFuZCB6IGNvb3JkaW5hdGVzIG9mIGEgVmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn0gICAgICB0aGUgZGlzdGFuY2VcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMCwgMCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigwLCAxLCAwKTtcbiAgICpcbiAgICogdmFyIGRpc3RhbmNlID0gdjEuZGlzdCh2Mik7IC8vIGRpc3RhbmNlIGlzIDEuNDE0Mi4uLlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDAsIDApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMCwgMSwgMCk7XG4gICAqXG4gICAqIHZhciBkaXN0YW5jZSA9IFZlY3Rvci5kaXN0KHYxLHYyKTtcbiAgICogLy8gZGlzdGFuY2UgaXMgMS40MTQyLi4uXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmRpc3QgPSBmdW5jdGlvbiAodikge1xuICAgIHZhciBkID0gdi5jb3B5KCkuc3ViKHRoaXMpO1xuICAgIHJldHVybiBkLm1hZygpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBOb3JtYWxpemUgdGhlIHZlY3RvciB0byBsZW5ndGggMSAobWFrZSBpdCBhIHVuaXQgdmVjdG9yKS5cbiAgICpcbiAgICogQG1ldGhvZCBub3JtYWxpemVcbiAgICogQHJldHVybiB7VmVjdG9yfSBub3JtYWxpemVkIFZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEwLCAyMCwgMik7XG4gICAqIC8vIHYgaGFzIGNvbXBuZW50cyBbMTAuMCwgMjAuMCwgMi4wXVxuICAgKiB2Lm5vcm1hbGl6ZSgpO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG9cbiAgICogLy8gWzAuNDQ1NDM1NCwgMC44OTA4NzA4LCAwLjA4OTA4NzA4NF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmRpdih0aGlzLm1hZygpKTtcbiAgfTtcblxuICAvKipcbiAgICogTGltaXQgdGhlIG1hZ25pdHVkZSBvZiB0aGlzIHZlY3RvciB0byB0aGUgdmFsdWUgdXNlZCBmb3IgdGhlIDxiPm1heDwvYj5cbiAgICogcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAbWV0aG9kIGxpbWl0XG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgbWF4IHRoZSBtYXhpbXVtIG1hZ25pdHVkZSBmb3IgdGhlIHZlY3RvclxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgICB0aGUgbW9kaWZpZWQgVmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMTAsIDIwLCAyKTtcbiAgICogLy8gdiBoYXMgY29tcG5lbnRzIFsxMC4wLCAyMC4wLCAyLjBdXG4gICAqIHYubGltaXQoNSk7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0b1xuICAgKiAvLyBbMi4yMjcxNzcxLCA0LjQ1NDM1NDMsIDAuNDQ1NDM1NF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUubGltaXQgPSBmdW5jdGlvbiAobCkge1xuICAgIHZhciBtU3EgPSB0aGlzLm1hZ1NxKCk7XG4gICAgaWYobVNxID4gbCpsKSB7XG4gICAgICB0aGlzLmRpdihNYXRoLnNxcnQobVNxKSk7IC8vbm9ybWFsaXplIGl0XG4gICAgICB0aGlzLm11bHQobCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgdGhlIG1hZ25pdHVkZSBvZiB0aGlzIHZlY3RvciB0byB0aGUgdmFsdWUgdXNlZCBmb3IgdGhlIDxiPmxlbjwvYj5cbiAgICogcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAbWV0aG9kIHNldE1hZ1xuICAgKiBAcGFyYW0gIHtudW1iZXJ9ICAgIGxlbiB0aGUgbmV3IGxlbmd0aCBmb3IgdGhpcyB2ZWN0b3JcbiAgICogQHJldHVybiB7VmVjdG9yfSAgICAgdGhlIG1vZGlmaWVkIFZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxMCwgMjAsIDIpO1xuICAgKiAvLyB2IGhhcyBjb21wbmVudHMgWzEwLjAsIDIwLjAsIDIuMF1cbiAgICogdjEuc2V0TWFnKDEwKTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvIFs2LjAsIDguMCwgMC4wXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5zZXRNYWcgPSBmdW5jdGlvbiAobGVuKSB7XG4gICAgcmV0dXJuIHRoaXMubm9ybWFsaXplKCkubXVsdChsZW4pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIGFuZ2xlIG9mIHJvdGF0aW9uIGZvciB0aGlzIHZlY3RvciAob25seSAyRCB2ZWN0b3JzKVxuICAgKlxuICAgKiBAbWV0aG9kIGhlYWRpbmdcbiAgICogQHJldHVybiB7TnVtYmVyfSB0aGUgYW5nbGUgb2Ygcm90YXRpb25cbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcyA9IFwibm9yZW5kZXJcIj48Y29kZT5cbiAgICogZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAqICAgdmFyIHYxID0gY3JlYXRlVmVjdG9yKDMwLDUwKTtcbiAgICogICBwcmludCh2MS5oZWFkaW5nKCkpOyAvLyAxLjAzMDM3NjgyNjUyNDMxMjVcbiAgICpcbiAgICogICB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoNDAsNTApO1xuICAgKiAgIHByaW50KHYxLmhlYWRpbmcoKSk7IC8vIDAuODk2MDU1Mzg0NTcxMzQzOVxuICAgKlxuICAgKiAgIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigzMCw3MCk7XG4gICAqICAgcHJpbnQodjEuaGVhZGluZygpKTsgLy8gMS4xNjU5MDQ1NDA1MDk4MTMyXG4gICAqIH1cbiAgICogPC9kaXY+PC9jb2RlPlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5oZWFkaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueSwgdGhpcy54KTtcbiAgfTtcblxuICAvKipcbiAgICogUm90YXRlIHRoZSB2ZWN0b3IgYnkgYW4gYW5nbGUgKG9ubHkgMkQgdmVjdG9ycyksIG1hZ25pdHVkZSByZW1haW5zIHRoZVxuICAgKiBzYW1lXG4gICAqXG4gICAqIEBtZXRob2Qgcm90YXRlXG4gICAqIEBwYXJhbSAge251bWJlcn0gICAgYW5nbGUgdGhlIGFuZ2xlIG9mIHJvdGF0aW9uXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIG1vZGlmaWVkIFZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEwLjAsIDIwLjApO1xuICAgKiAvLyB2IGhhcyBjb21wbmVudHMgWzEwLjAsIDIwLjAsIDAuMF1cbiAgICogdi5yb3RhdGUoSEFMRl9QSSk7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0byBbLTIwLjAsIDkuOTk5OTk5LCAwLjBdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uIChhbmdsZSkge1xuICAgIHZhciBuZXdIZWFkaW5nID0gdGhpcy5oZWFkaW5nKCkgKyBhbmdsZTtcbiAgICB2YXIgbWFnID0gdGhpcy5tYWcoKTtcbiAgICB0aGlzLnggPSBNYXRoLmNvcyhuZXdIZWFkaW5nKSAqIG1hZztcbiAgICB0aGlzLnkgPSBNYXRoLnNpbihuZXdIZWFkaW5nKSAqIG1hZztcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogTGluZWFyIGludGVycG9sYXRlIHRoZSB2ZWN0b3IgdG8gYW5vdGhlciB2ZWN0b3JcbiAgICpcbiAgICogQG1ldGhvZCBsZXJwXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0geCAgIHRoZSB4IGNvbXBvbmVudCBvciB0aGUgVmVjdG9yIHRvIGxlcnAgdG9cbiAgICogQHBhcmFtICB7VmVjdG9yfSBbeV0geSB0aGUgeSBjb21wb25lbnRcbiAgICogQHBhcmFtICB7VmVjdG9yfSBbel0geiB0aGUgeiBjb21wb25lbnRcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICBhbXQgdGhlIGFtb3VudCBvZiBpbnRlcnBvbGF0aW9uOyBzb21lIHZhbHVlIGJldHdlZW4gMC4wXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgIChvbGQgdmVjdG9yKSBhbmQgMS4wIChuZXcgdmVjdG9yKS4gMC4xIGlzIHZlcnkgbmVhclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgbmV3IHZlY3Rvci4gMC41IGlzIGhhbGZ3YXkgaW4gYmV0d2Vlbi5cbiAgICogQHJldHVybiB7VmVjdG9yfSAgICAgdGhlIG1vZGlmaWVkIFZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEsIDEsIDApO1xuICAgKlxuICAgKiB2LmxlcnAoMywgMywgMCwgMC41KTsgLy8gdiBub3cgaGFzIGNvbXBvbmVudHMgWzIsMiwwXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigwLCAwLCAwKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDEwMCwgMTAwLCAwKTtcbiAgICpcbiAgICogdmFyIHYzID0gVmVjdG9yLmxlcnAodjEsIHYyLCAwLjUpO1xuICAgKiAvLyB2MyBoYXMgY29tcG9uZW50cyBbNTAsNTAsMF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUubGVycCA9IGZ1bmN0aW9uICh4LCB5LCB6LCBhbXQpIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuICAgICAgcmV0dXJuIHRoaXMubGVycCh4LngsIHgueSwgeC56LCB5KTtcbiAgICB9XG4gICAgdGhpcy54ICs9ICh4IC0gdGhpcy54KSAqIGFtdCB8fCAwO1xuICAgIHRoaXMueSArPSAoeSAtIHRoaXMueSkgKiBhbXQgfHwgMDtcbiAgICB0aGlzLnogKz0gKHogLSB0aGlzLnopICogYW10IHx8IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgdmVjdG9yIGFzIGEgZmxvYXQgYXJyYXkuIFRoaXMgaXMgb25seVxuICAgKiBmb3IgdGVtcG9yYXJ5IHVzZS4gSWYgdXNlZCBpbiBhbnkgb3RoZXIgZmFzaGlvbiwgdGhlIGNvbnRlbnRzIHNob3VsZCBiZVxuICAgKiBjb3BpZWQgYnkgdXNpbmcgdGhlIDxiPlZlY3Rvci5jb3B5KCk8L2I+IG1ldGhvZCB0byBjb3B5IGludG8geW91ciBvd25cbiAgICogYXJyYXkuXG4gICAqXG4gICAqIEBtZXRob2QgYXJyYXlcbiAgICogQHJldHVybiB7QXJyYXl9IGFuIEFycmF5IHdpdGggdGhlIDMgdmFsdWVzXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3MgPSBcIm5vcmVuZGVyXCI+PGNvZGU+XG4gICAqIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgKiAgIHZhciB2ID0gY3JlYXRlVmVjdG9yKDIwLDMwKTtcbiAgICogICBwcmludCh2LmFycmF5KCkpOyAvLyBQcmludHMgOiBBcnJheSBbMjAsIDMwLCAwXVxuICAgKiB9XG4gICAqIDwvZGl2PjwvY29kZT5cbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxMC4wLCAyMC4wLCAzMC4wKTtcbiAgICogdmFyIGYgPSB2LmFycmF5KCk7XG4gICAqIHByaW50KGZbMF0pOyAvLyBQcmludHMgXCIxMC4wXCJcbiAgICogcHJpbnQoZlsxXSk7IC8vIFByaW50cyBcIjIwLjBcIlxuICAgKiBwcmludChmWzJdKTsgLy8gUHJpbnRzIFwiMzAuMFwiXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbdGhpcy54IHx8IDAsIHRoaXMueSB8fCAwLCB0aGlzLnogfHwgMF07XG4gIH07XG5cbiAgLyoqXG4gICAqIEVxdWFsaXR5IGNoZWNrIGFnYWluc3QgYSBWZWN0b3JcbiAgICpcbiAgICogQG1ldGhvZCBlcXVhbHNcbiAgICogQHBhcmFtIHtOdW1iZXJ8VmVjdG9yfEFycmF5fSBbeF0gdGhlIHggY29tcG9uZW50IG9mIHRoZSB2ZWN0b3Igb3IgYVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWN0b3Igb3IgYW4gQXJyYXlcbiAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbeV0gdGhlIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbel0gdGhlIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gd2hldGhlciB0aGUgdmVjdG9ycyBhcmUgZXF1YWxzXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3MgPSBcIm5vcmVuZGVyXCI+PGNvZGU+XG4gICAqIHYxID0gY3JlYXRlVmVjdG9yKDUsMTAsMjApO1xuICAgKiB2MiA9IGNyZWF0ZVZlY3Rvcig1LDEwLDIwKTtcbiAgICogdjMgPSBjcmVhdGVWZWN0b3IoMTMsMTAsMTkpO1xuICAgKlxuICAgKiBwcmludCh2MS5lcXVhbHModjIueCx2Mi55LHYyLnopKTsgLy8gdHJ1ZVxuICAgKiBwcmludCh2MS5lcXVhbHModjMueCx2My55LHYzLnopKTsgLy8gZmFsc2VcbiAgICogPC9kaXY+PC9jb2RlPlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxMC4wLCAyMC4wLCAzMC4wKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDEwLjAsIDIwLjAsIDMwLjApO1xuICAgKiB2YXIgdjMgPSBjcmVhdGVWZWN0b3IoMC4wLCAwLjAsIDAuMCk7XG4gICAqIHByaW50ICh2MS5lcXVhbHModjIpKSAvLyB0cnVlXG4gICAqIHByaW50ICh2MS5lcXVhbHModjMpKSAvLyBmYWxzZVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIHZhciBhLCBiLCBjO1xuICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yKSB7XG4gICAgICBhID0geC54IHx8IDA7XG4gICAgICBiID0geC55IHx8IDA7XG4gICAgICBjID0geC56IHx8IDA7XG4gICAgfSBlbHNlIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGEgPSB4WzBdIHx8IDA7XG4gICAgICBiID0geFsxXSB8fCAwO1xuICAgICAgYyA9IHhbMl0gfHwgMDtcbiAgICB9IGVsc2Uge1xuICAgICAgYSA9IHggfHwgMDtcbiAgICAgIGIgPSB5IHx8IDA7XG4gICAgICBjID0geiB8fCAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy54ID09PSBhICYmIHRoaXMueSA9PT0gYiAmJiB0aGlzLnogPT09IGM7XG4gIH07XG5cblxuICAvLyBTdGF0aWMgTWV0aG9kc1xuXG5cbiAgLyoqXG4gICAqIE1ha2UgYSBuZXcgMkQgdW5pdCB2ZWN0b3IgZnJvbSBhbiBhbmdsZVxuICAgKlxuICAgKiBAbWV0aG9kIGZyb21BbmdsZVxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgYW5nbGUgdGhlIGRlc2lyZWQgYW5nbGVcbiAgICogQHJldHVybiB7VmVjdG9yfSAgICAgICB0aGUgbmV3IFZlY3RvciBvYmplY3RcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdj5cbiAgICogPGNvZGU+XG4gICAqIGZ1bmN0aW9uIGRyYXcoKSB7XG4gICAqICAgYmFja2dyb3VuZCAoMjAwKTtcbiAgICpcbiAgICogICAvLyBDcmVhdGUgYSB2YXJpYWJsZSwgcHJvcG9ydGlvbmFsIHRvIHRoZSBtb3VzZVgsXG4gICAqICAgLy8gdmFyeWluZyBmcm9tIDAtMzYwLCB0byByZXByZXNlbnQgYW4gYW5nbGUgaW4gZGVncmVlcy5cbiAgICogICBhbmdsZU1vZGUoREVHUkVFUyk7XG4gICAqICAgdmFyIG15RGVncmVlcyA9IG1hcChtb3VzZVgsIDAsd2lkdGgsIDAsMzYwKTtcbiAgICpcbiAgICogICAvLyBEaXNwbGF5IHRoYXQgdmFyaWFibGUgaW4gYW4gb25zY3JlZW4gdGV4dC5cbiAgICogICAvLyAoTm90ZSB0aGUgbmZjKCkgZnVuY3Rpb24gdG8gdHJ1bmNhdGUgYWRkaXRpb25hbCBkZWNpbWFsIHBsYWNlcyxcbiAgICogICAvLyBhbmQgdGhlIFwiXFx4QjBcIiBjaGFyYWN0ZXIgZm9yIHRoZSBkZWdyZWUgc3ltYm9sLilcbiAgICogICB2YXIgcmVhZG91dCA9IFwiYW5nbGUgPSBcIiArIG5mYyhteURlZ3JlZXMsMSwxKSArIFwiXFx4QjBcIlxuICAgKiAgIG5vU3Ryb2tlKCk7XG4gICAqICAgZmlsbCAoMCk7XG4gICAqICAgdGV4dCAocmVhZG91dCwgNSwgMTUpO1xuICAgKlxuICAgKiAgIC8vIENyZWF0ZSBhIFZlY3RvciB1c2luZyB0aGUgZnJvbUFuZ2xlIGZ1bmN0aW9uLFxuICAgKiAgIC8vIGFuZCBleHRyYWN0IGl0cyB4IGFuZCB5IGNvbXBvbmVudHMuXG4gICAqICAgdmFyIHYgPSBWZWN0b3IuZnJvbUFuZ2xlKHJhZGlhbnMobXlEZWdyZWVzKSk7XG4gICAqICAgdmFyIHZ4ID0gdi54O1xuICAgKiAgIHZhciB2eSA9IHYueTtcbiAgICpcbiAgICogICBwdXNoKCk7XG4gICAqICAgdHJhbnNsYXRlICh3aWR0aC8yLCBoZWlnaHQvMik7XG4gICAqICAgbm9GaWxsKCk7XG4gICAqICAgc3Ryb2tlICgxNTApO1xuICAgKiAgIGxpbmUgKDAsMCwgMzAsMCk7XG4gICAqICAgc3Ryb2tlICgwKTtcbiAgICogICBsaW5lICgwLDAsIDMwKnZ4LCAzMCp2eSk7XG4gICAqICAgcG9wKClcbiAgICogfVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLmZyb21BbmdsZSA9IGZ1bmN0aW9uKGFuZ2xlKSB7XG4gICAgcmV0dXJuIG5ldyBWZWN0b3IoTWF0aC5jb3MoYW5nbGUpLE1hdGguc2luKGFuZ2xlKSwwKTtcbiAgfTtcblxuICAvKipcbiAgICogTWFrZSBhIG5ldyAyRCB1bml0IHZlY3RvciBmcm9tIGEgcmFuZG9tIGFuZ2xlXG4gICAqXG4gICAqIEBtZXRob2QgcmFuZG9tMkRcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSBuZXcgVmVjdG9yIG9iamVjdFxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gVmVjdG9yLnJhbmRvbTJEKCk7XG4gICAqIC8vIE1heSBtYWtlIHYncyBhdHRyaWJ1dGVzIHNvbWV0aGluZyBsaWtlOlxuICAgKiAvLyBbMC42MTU1NDYxNywgLTAuNTExOTU3NjUsIDAuMF0gb3JcbiAgICogLy8gWy0wLjQ2OTU4NDEsIC0wLjE0MzY2NzMxLCAwLjBdIG9yXG4gICAqIC8vIFswLjYwOTEwOTcsIC0wLjIyODA1Mjc4LCAwLjBdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucmFuZG9tMkQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFuZ2xlID0gTWF0aC5yYW5kb20oKSpNYXRoLlBJKjI7XG4gICAgcmV0dXJuIHRoaXMuZnJvbUFuZ2xlKGFuZ2xlKTtcbiAgfTtcblxuICAvKipcbiAgICogTWFrZSBhIG5ldyByYW5kb20gM0QgdW5pdCB2ZWN0b3IuXG4gICAqXG4gICAqIEBtZXRob2QgcmFuZG9tM0RcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSBuZXcgVmVjdG9yIG9iamVjdFxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gVmVjdG9yLnJhbmRvbTNEKCk7XG4gICAqIC8vIE1heSBtYWtlIHYncyBhdHRyaWJ1dGVzIHNvbWV0aGluZyBsaWtlOlxuICAgKiAvLyBbMC42MTU1NDYxNywgLTAuNTExOTU3NjUsIDAuNTk5MTY4XSBvclxuICAgKiAvLyBbLTAuNDY5NTg0MSwgLTAuMTQzNjY3MzEsIC0wLjg3MTEyMDJdIG9yXG4gICAqIC8vIFswLjYwOTEwOTcsIC0wLjIyODA1Mjc4LCAtMC43NTk1OTAyXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnJhbmRvbTNEID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbmdsZSA9IE1hdGgucmFuZG9tKCkqTWF0aC5QSSoyLFxuXHQgICAgdnogPSBNYXRoLnJhbmRvbSgpKjItMSxcbiAgICBcdHZ4ID0gTWF0aC5zcXJ0KDEtdnoqdnopKk1hdGguY29zKGFuZ2xlKSxcbiAgICBcdHZ5ID0gTWF0aC5zcXJ0KDEtdnoqdnopKk1hdGguc2luKGFuZ2xlKTtcblxuICAgIHJldHVybiBuZXcgVmVjdG9yKHZ4LHZ5LHZ6KTtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBBZGRzIHR3byB2ZWN0b3JzIHRvZ2V0aGVyIGFuZCByZXR1cm5zIGEgbmV3IG9uZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYxIGEgVmVjdG9yIHRvIGFkZFxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYyIGEgVmVjdG9yIHRvIGFkZFxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHRhcmdldCBpZiB1bmRlZmluZWQgYSBuZXcgdmVjdG9yIHdpbGwgYmUgY3JlYXRlZFxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSByZXN1bHRpbmcgVmVjdG9yXG4gICAqXG4gICAqL1xuXG4gIFZlY3Rvci5hZGQgPSBmdW5jdGlvbiAodjEsIHYyLCB0YXJnZXQpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdjEuY29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuc2V0KHYxKTtcbiAgICB9XG4gICAgdGFyZ2V0LmFkZCh2Mik7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuICAvKipcbiAgICogU3VidHJhY3RzIG9uZSBWZWN0b3IgZnJvbSBhbm90aGVyIGFuZCByZXR1cm5zIGEgbmV3IG9uZS4gIFRoZSBzZWNvbmRcbiAgICogdmVjdG9yICh2MikgaXMgc3VidHJhY3RlZCBmcm9tIHRoZSBmaXJzdCAodjEpLCByZXN1bHRpbmcgaW4gdjEtdjIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MSBhIFZlY3RvciB0byBzdWJ0cmFjdCBmcm9tXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjIgYSBWZWN0b3IgdG8gc3VidHJhY3RcbiAgICogQHBhcmFtICB7VmVjdG9yfSB0YXJnZXQgaWYgdW5kZWZpbmVkIGEgbmV3IHZlY3RvciB3aWxsIGJlIGNyZWF0ZWRcbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgcmVzdWx0aW5nIFZlY3RvclxuICAgKi9cblxuICBWZWN0b3Iuc3ViID0gZnVuY3Rpb24gKHYxLCB2MiwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IHYxLmNvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnNldCh2MSk7XG4gICAgfVxuICAgIHRhcmdldC5zdWIodjIpO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cblxuICAvKipcbiAgICogTXVsdGlwbGllcyBhIHZlY3RvciBieSBhIHNjYWxhciBhbmQgcmV0dXJucyBhIG5ldyB2ZWN0b3IuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2IHRoZSBWZWN0b3IgdG8gbXVsdGlwbHlcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgbiB0aGUgc2NhbGFyXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdGFyZ2V0IGlmIHVuZGVmaW5lZCBhIG5ldyB2ZWN0b3Igd2lsbCBiZSBjcmVhdGVkXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gIHRoZSByZXN1bHRpbmcgbmV3IFZlY3RvclxuICAgKi9cbiAgVmVjdG9yLm11bHQgPSBmdW5jdGlvbiAodiwgbiwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IHYuY29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuc2V0KHYpO1xuICAgIH1cbiAgICB0YXJnZXQubXVsdChuKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBEaXZpZGVzIGEgdmVjdG9yIGJ5IGEgc2NhbGFyIGFuZCByZXR1cm5zIGEgbmV3IHZlY3Rvci5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYgdGhlIFZlY3RvciB0byBkaXZpZGVcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgbiB0aGUgc2NhbGFyXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdGFyZ2V0IGlmIHVuZGVmaW5lZCBhIG5ldyB2ZWN0b3Igd2lsbCBiZSBjcmVhdGVkXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIHJlc3VsdGluZyBuZXcgVmVjdG9yXG4gICAqL1xuICBWZWN0b3IuZGl2ID0gZnVuY3Rpb24gKHYsIG4sIHRhcmdldCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB2LmNvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnNldCh2KTtcbiAgICB9XG4gICAgdGFyZ2V0LmRpdihuKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjEgdGhlIGZpcnN0IFZlY3RvclxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYyIHRoZSBzZWNvbmQgVmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn0gICAgIHRoZSBkb3QgcHJvZHVjdFxuICAgKi9cbiAgVmVjdG9yLmRvdCA9IGZ1bmN0aW9uICh2MSwgdjIpIHtcbiAgICByZXR1cm4gdjEuZG90KHYyKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjdG9ycy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYxIHRoZSBmaXJzdCBWZWN0b3JcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MiB0aGUgc2Vjb25kIFZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICB0aGUgY3Jvc3MgcHJvZHVjdFxuICAgKi9cbiAgVmVjdG9yLmNyb3NzID0gZnVuY3Rpb24gKHYxLCB2Mikge1xuICAgIHJldHVybiB2MS5jcm9zcyh2Mik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIEV1Y2xpZGVhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHMgKGNvbnNpZGVyaW5nIGFcbiAgICogcG9pbnQgYXMgYSB2ZWN0b3Igb2JqZWN0KS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYxIHRoZSBmaXJzdCBWZWN0b3JcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MiB0aGUgc2Vjb25kIFZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICB0aGUgZGlzdGFuY2VcbiAgICovXG4gIFZlY3Rvci5kaXN0ID0gZnVuY3Rpb24gKHYxLHYyKSB7XG4gICAgcmV0dXJuIHYxLmRpc3QodjIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMaW5lYXIgaW50ZXJwb2xhdGUgYSB2ZWN0b3IgdG8gYW5vdGhlciB2ZWN0b3IgYW5kIHJldHVybiB0aGUgcmVzdWx0IGFzIGFcbiAgICogbmV3IHZlY3Rvci5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge1ZlY3Rvcn0gdjEgYSBzdGFydGluZyBWZWN0b3JcbiAgICogQHBhcmFtIHtWZWN0b3J9IHYyIHRoZSBWZWN0b3IgdG8gbGVycCB0b1xuICAgKiBAcGFyYW0ge051bWJlcn0gICAgICAgdGhlIGFtb3VudCBvZiBpbnRlcnBvbGF0aW9uOyBzb21lIHZhbHVlIGJldHdlZW4gMC4wXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAob2xkIHZlY3RvcikgYW5kIDEuMCAobmV3IHZlY3RvcikuIDAuMSBpcyB2ZXJ5IG5lYXJcbiAgICogICAgICAgICAgICAgICAgICAgICAgIHRoZSBuZXcgdmVjdG9yLiAwLjUgaXMgaGFsZndheSBpbiBiZXR3ZWVuLlxuICAgKi9cbiAgVmVjdG9yLmxlcnAgPSBmdW5jdGlvbiAodjEsIHYyLCBhbXQsIHRhcmdldCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB2MS5jb3B5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5zZXQodjEpO1xuICAgIH1cbiAgICB0YXJnZXQubGVycCh2MiwgYW10KTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIHRoZSBhbmdsZSAoaW4gcmFkaWFucykgYmV0d2VlbiB0d28gdmVjdG9ycy5cbiAgICogQG1ldGhvZCBhbmdsZUJldHdlZW5cbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYxIHRoZSB4LCB5LCBhbmQgeiBjb21wb25lbnRzIG9mIGEgVmVjdG9yXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjIgdGhlIHgsIHksIGFuZCB6IGNvbXBvbmVudHMgb2YgYSBWZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgICB0aGUgYW5nbGUgYmV0d2VlbiAoaW4gcmFkaWFucylcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMCwgMCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigwLCAxLCAwKTtcbiAgICpcbiAgICogdmFyIGFuZ2xlID0gVmVjdG9yLmFuZ2xlQmV0d2Vlbih2MSwgdjIpO1xuICAgKiAvLyBhbmdsZSBpcyBQSS8yXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IuYW5nbGVCZXR3ZWVuID0gZnVuY3Rpb24gKHYxLCB2Mikge1xuICAgIHJldHVybiBNYXRoLmFjb3ModjEuZG90KHYyKSAvICh2MS5tYWcoKSAqIHYyLm1hZygpKSk7XG4gIH07XG5cbiAgLy8gcmV0dXJuIFZlY3Rvcjtcbm1vZHVsZS5leHBvcnRzID0gVmVjdG9yO1xuLy8gfSk7XG4iLCJmdW5jdGlvbiBVdGlscyhjeCwgY2FudmFzKSB7XG4gIHJldHVybiB7XG4gICAgY3ggOiBjeCB8fCAnJyxcbiAgICBjYW52YXM6IGNhbnZhcyB8fCAnJyxcbiAgICBoYWxmWDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYW52YXMud2lkdGggLyAyO1xuICAgIH0sXG4gICAgaGFsZlk6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLmhlaWdodCAvIDI7XG4gICAgfSxcbiAgICByYW5nZTogZnVuY3Rpb24gKG1pbiwgbWF4KSB7XG4gICAgICBpZiAoIW1heCkge1xuICAgICAgICBtYXggPSBtaW47XG4gICAgICAgIG1pbiA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pO1xuICAgIH0sXG4gICAgcmFuZ2U6IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgICB2YXIgcmFuZCA9IE1hdGgucmFuZG9tKCk7XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiByYW5kO1xuICAgICAgfSBlbHNlXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gcmFuZCAqIG1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtaW4gPiBtYXgpIHtcbiAgICAgICAgICB2YXIgdG1wID0gbWluO1xuICAgICAgICAgIG1pbiA9IG1heDtcbiAgICAgICAgICBtYXggPSB0bXA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmFuZCAqIChtYXgtbWluKSArIG1pbjtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8vIHRha2VuIGZyb20gdGhlIHA1LmpzIHByb2plY3RcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcHJvY2Vzc2luZy9wNS5qcy9ibG9iLzVjODFkNjU1ZjY4M2Y5MDQ1MmI4MGFiMjI1YTY3ZTQ0OTQ2M2ZmZjkvc3JjL21hdGgvY2FsY3VsYXRpb24uanMjTDM5NFxuICAgIG1hcDogZnVuY3Rpb24obiwgc3RhcnQxLCBzdG9wMSwgc3RhcnQyLCBzdG9wMikge1xuICAgICAgcmV0dXJuICgobi1zdGFydDEpLyhzdG9wMS1zdGFydDEpKSooc3RvcDItc3RhcnQyKStzdGFydDI7XG4gICAgfSxcblxuICAgIGdldE1vdXNlUG9zOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgeDogZXZlbnQuY2xpZW50WCxcbiAgICAgICAgeTogZXZlbnQuY2xpZW50WVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmN4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICB9LFxuICAgIFc6IGNhbnZhcy53aWR0aCxcbiAgICBIOiBjYW52YXMuaGVpZ2h0LFxuICAgIEhXOiBjYW52YXMud2lkdGggLyAyLFxuICAgIEhIOiBjYW52YXMuaGVpZ2h0IC8gMixcbiAgICBlbGxpcHNlOiBmdW5jdGlvbih4LCB5LCByKSB7XG4gICAgICB0aGlzLmN4LmJlZ2luUGF0aCgpO1xuICAgICAgdGhpcy5jeC5hcmMoeCwgeSwgciwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgIHRoaXMuY3guZmlsbCgpO1xuICAgICAgdGhpcy5jeC5zdHJva2UoKTtcbiAgICB9LFxuICAgIGNvbnN0cmFpbjogZnVuY3Rpb24odmFsLCBtaW4sIG1heCkge1xuICAgICAgaWYgKHZhbCA+IG1heCkge1xuICAgICAgICByZXR1cm4gbWF4O1xuICAgICAgfSBlbHNlIGlmICh2YWwgPCBtaW4pIHtcbiAgICAgICAgcmV0dXJuIG1pbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGN4LCBjYW52YXMpIHtcbiAgcmV0dXJuIG5ldyBVdGlscyhjeCwgY2FudmFzKTtcbn07XG4iXX0=
