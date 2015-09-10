require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var V = require('V')
  , utils
;

function Mover(cx, canvas, opts) {
  utils = require('utils')(cx, canvas);
  this.cx = cx;
  this.canvas = canvas;

  this.mass = opts.mass;
  this.position = new V(opts.x, opts.y);

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
  utils.ellipse(this.position.x, this.position.y, this.mass * 16);
};

module.exports = Mover;

},{"V":"V","utils":"utils"}],2:[function(require,module,exports){
var canvas = document.getElementById('canvas')
  , cx = canvas.getContext('2d')
  , Mover = require('./_Mover')
  , V = require('V')
  , utils
;

var WIDTH = canvas.width
  , HEIGHT = canvas.height
  , movers = []
  , qty = 20 // number of Movers to create
  , wind
  , gravity
;

function setup() {
  console.log('setup');
  canvas.height = 600;
  canvas.width = 600;
  utils = require('utils')(cx, canvas)

  for(var i = 0; qty > i; i++) {
    var options = {
      mass: utils.range(1, 4),
      x: 0,
      y: 0
    }
    movers[i] = new Mover(cx, canvas, options);
  }
  wind = new V(0.001, 0);
  gravity = new V(0, 0.1);
}


function draw() {
  utils.clear();
  for(var i = 0; qty > i; i++) {
    movers[i].applyForce(wind);

    // new gravity proportional to the object's mass
    var gravity = new V(0, 0.1 * movers[i].mass);
    movers[i].applyForce(gravity);

    movers[i].update();
    movers[i].checkEdges();
    movers[i].display();
  }

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGFwdGVycy8yLzMvX01vdmVyLmpzIiwiY2hhcHRlcnMvMi8zL2FwcC5qcyIsIm1vZHVsZXMvcDVWZWN0b3JzLmpzIiwibW9kdWxlcy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNTZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBWID0gcmVxdWlyZSgnVicpXG4gICwgdXRpbHNcbjtcblxuZnVuY3Rpb24gTW92ZXIoY3gsIGNhbnZhcywgb3B0cykge1xuICB1dGlscyA9IHJlcXVpcmUoJ3V0aWxzJykoY3gsIGNhbnZhcyk7XG4gIHRoaXMuY3ggPSBjeDtcbiAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG5cbiAgdGhpcy5tYXNzID0gb3B0cy5tYXNzO1xuICB0aGlzLnBvc2l0aW9uID0gbmV3IFYob3B0cy54LCBvcHRzLnkpO1xuXG4gIHRoaXMudmVsb2NpdHkgPSBuZXcgVigwLCAwKTtcbiAgdGhpcy5hY2NlbGVyYXRpb24gPSBuZXcgVigwLCAwKTtcbn1cblxuTW92ZXIucHJvdG90eXBlLmFwcGx5Rm9yY2UgPSBmdW5jdGlvbiAoZm9yY2UpIHtcbiAgdmFyIGYgPSBWLmRpdihmb3JjZSwgdGhpcy5tYXNzKTtcbiAgdGhpcy5hY2NlbGVyYXRpb24uYWRkKGYpO1xufTtcblxuTW92ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnZlbG9jaXR5LmFkZCh0aGlzLmFjY2VsZXJhdGlvbik7XG4gIHRoaXMucG9zaXRpb24uYWRkKHRoaXMudmVsb2NpdHkpO1xuICB0aGlzLmFjY2VsZXJhdGlvbi5tdWx0KDApO1xufTtcblxuTW92ZXIucHJvdG90eXBlLmNoZWNrRWRnZXMgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLnBvc2l0aW9uLnggPiB1dGlscy5XKSB7XG4gICAgdGhpcy5wb3NpdGlvbi54ID0gdXRpbHMuVztcbiAgICB0aGlzLnZlbG9jaXR5LnggKj0gLTE7XG4gIH0gZWxzZSBpZiAodGhpcy5wb3NpdGlvbi54IDwgMCkge1xuICAgIHRoaXMucG9zaXRpb24ueCA9IDA7XG4gICAgdGhpcy52ZWxvY2l0eS54ICo9IC0xO1xuICB9XG5cbiAgaWYgKHRoaXMucG9zaXRpb24ueSA+IHV0aWxzLkgpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSB1dGlscy5IO1xuICAgIHRoaXMudmVsb2NpdHkueSAqPSAtMTtcbiAgfSBlbHNlIGlmICh0aGlzLnBvc2l0aW9uLnkgPCAwKSB7XG4gICAgdGhpcy5wb3NpdGlvbi55ID0gMDtcbiAgICB0aGlzLnZlbG9jaXR5LnkgKj0gLTE7XG4gIH1cbn07XG5cbk1vdmVyLnByb3RvdHlwZS5kaXNwbGF5ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmN4LmZpbGxTdHlsZSA9ICdncmV5JztcbiAgdGhpcy5jeC5zdHJva2VTdHlsZSA9ICdibGFjayc7XG4gIHV0aWxzLmVsbGlwc2UodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksIHRoaXMubWFzcyAqIDE2KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTW92ZXI7XG4iLCJ2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpXG4gICwgY3ggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAsIE1vdmVyID0gcmVxdWlyZSgnLi9fTW92ZXInKVxuICAsIFYgPSByZXF1aXJlKCdWJylcbiAgLCB1dGlsc1xuO1xuXG52YXIgV0lEVEggPSBjYW52YXMud2lkdGhcbiAgLCBIRUlHSFQgPSBjYW52YXMuaGVpZ2h0XG4gICwgbW92ZXJzID0gW11cbiAgLCBxdHkgPSAyMCAvLyBudW1iZXIgb2YgTW92ZXJzIHRvIGNyZWF0ZVxuICAsIHdpbmRcbiAgLCBncmF2aXR5XG47XG5cbmZ1bmN0aW9uIHNldHVwKCkge1xuICBjb25zb2xlLmxvZygnc2V0dXAnKTtcbiAgY2FudmFzLmhlaWdodCA9IDYwMDtcbiAgY2FudmFzLndpZHRoID0gNjAwO1xuICB1dGlscyA9IHJlcXVpcmUoJ3V0aWxzJykoY3gsIGNhbnZhcylcblxuICBmb3IodmFyIGkgPSAwOyBxdHkgPiBpOyBpKyspIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIG1hc3M6IHV0aWxzLnJhbmdlKDEsIDQpLFxuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9XG4gICAgbW92ZXJzW2ldID0gbmV3IE1vdmVyKGN4LCBjYW52YXMsIG9wdGlvbnMpO1xuICB9XG4gIHdpbmQgPSBuZXcgVigwLjAwMSwgMCk7XG4gIGdyYXZpdHkgPSBuZXcgVigwLCAwLjEpO1xufVxuXG5cbmZ1bmN0aW9uIGRyYXcoKSB7XG4gIHV0aWxzLmNsZWFyKCk7XG4gIGZvcih2YXIgaSA9IDA7IHF0eSA+IGk7IGkrKykge1xuICAgIG1vdmVyc1tpXS5hcHBseUZvcmNlKHdpbmQpO1xuXG4gICAgLy8gbmV3IGdyYXZpdHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBvYmplY3QncyBtYXNzXG4gICAgdmFyIGdyYXZpdHkgPSBuZXcgVigwLCAwLjEgKiBtb3ZlcnNbaV0ubWFzcyk7XG4gICAgbW92ZXJzW2ldLmFwcGx5Rm9yY2UoZ3Jhdml0eSk7XG5cbiAgICBtb3ZlcnNbaV0udXBkYXRlKCk7XG4gICAgbW92ZXJzW2ldLmNoZWNrRWRnZXMoKTtcbiAgICBtb3ZlcnNbaV0uZGlzcGxheSgpO1xuICB9XG5cbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn1cblxuKGZ1bmN0aW9uKCkge1xuICBzZXR1cCgpO1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xufSgpKTtcbiIsIiAgLyoqXG4gICAqIEEgY2xhc3MgdG8gZGVzY3JpYmUgYSB0d28gb3IgdGhyZWUgZGltZW5zaW9uYWwgdmVjdG9yLCBzcGVjaWZpY2FsbHlcbiAgICogYSBFdWNsaWRlYW4gKGFsc28ga25vd24gYXMgZ2VvbWV0cmljKSB2ZWN0b3IuIEEgdmVjdG9yIGlzIGFuIGVudGl0eVxuICAgKiB0aGF0IGhhcyBib3RoIG1hZ25pdHVkZSBhbmQgZGlyZWN0aW9uLiBUaGUgZGF0YXR5cGUsIGhvd2V2ZXIsIHN0b3Jlc1xuICAgKiB0aGUgY29tcG9uZW50cyBvZiB0aGUgdmVjdG9yICh4LHkgZm9yIDJELCBhbmQgeCx5LHogZm9yIDNEKS4gVGhlIG1hZ25pdHVkZVxuICAgKiBhbmQgZGlyZWN0aW9uIGNhbiBiZSBhY2Nlc3NlZCB2aWEgdGhlIG1ldGhvZHMgbWFnKCkgYW5kIGhlYWRpbmcoKS4gSW4gbWFueVxuICAgKiBvZiB0aGUgcDUuanMgZXhhbXBsZXMsIHlvdSB3aWxsIHNlZSBWZWN0b3IgdXNlZCB0byBkZXNjcmliZSBhIHBvc2l0aW9uLFxuICAgKiB2ZWxvY2l0eSwgb3IgYWNjZWxlcmF0aW9uLiBGb3IgZXhhbXBsZSwgaWYgeW91IGNvbnNpZGVyIGEgcmVjdGFuZ2xlIG1vdmluZ1xuICAgKiBhY3Jvc3MgdGhlIHNjcmVlbiwgYXQgYW55IGdpdmVuIGluc3RhbnQgaXQgaGFzIGEgcG9zaXRpb24gKGEgdmVjdG9yIHRoYXRcbiAgICogcG9pbnRzIGZyb20gdGhlIG9yaWdpbiB0byBpdHMgbG9jYXRpb24pLCBhIHZlbG9jaXR5ICh0aGUgcmF0ZSBhdCB3aGljaCB0aGVcbiAgICogb2JqZWN0J3MgcG9zaXRpb24gY2hhbmdlcyBwZXIgdGltZSB1bml0LCBleHByZXNzZWQgYXMgYSB2ZWN0b3IpLCBhbmRcbiAgICogYWNjZWxlcmF0aW9uICh0aGUgcmF0ZSBhdCB3aGljaCB0aGUgb2JqZWN0J3MgdmVsb2NpdHkgY2hhbmdlcyBwZXIgdGltZVxuICAgKiB1bml0LCBleHByZXNzZWQgYXMgYSB2ZWN0b3IpLiBTaW5jZSB2ZWN0b3JzIHJlcHJlc2VudCBncm91cGluZ3Mgb2YgdmFsdWVzLFxuICAgKiB3ZSBjYW5ub3Qgc2ltcGx5IHVzZSB0cmFkaXRpb25hbCBhZGRpdGlvbi9tdWx0aXBsaWNhdGlvbi9ldGMuIEluc3RlYWQsXG4gICAqIHdlJ2xsIG5lZWQgdG8gZG8gc29tZSBcInZlY3RvclwiIG1hdGgsIHdoaWNoIGlzIG1hZGUgZWFzeSBieSB0aGUgbWV0aG9kc1xuICAgKiBpbnNpZGUgdGhlIFZlY3RvciBjbGFzcy5cbiAgICpcbiAgICogQGNsYXNzIFZlY3RvclxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt4XSB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbeV0geSBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcGFyYW0ge051bWJlcn0gW3pdIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3Rvcig0MCwgNTApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoNDAsIDUwKTtcbiAgICpcbiAgICogZWxsaXBzZSh2MS54LCB2MS55LCA1MCwgNTApO1xuICAgKiBlbGxpcHNlKHYyLngsIHYyLnksIDUwLCA1MCk7XG4gICAqIHYxLmFkZCh2Mik7XG4gICAqIGVsbGlwc2UodjEueCwgdjEueSwgNTAsIDUwKTtcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIHZhciBWZWN0b3IgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnggPSBhcmd1bWVudHNbMF0gfHwgMDtcblx0XHR0aGlzLnkgPSBhcmd1bWVudHNbMV0gfHwgMDtcblx0XHR0aGlzLnogPSBhcmd1bWVudHNbMl0gfHwgMDtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZlY3RvciB2IGJ5IGNhbGxpbmcgU3RyaW5nKHYpXG4gICAqIG9yIHYudG9TdHJpbmcoKS4gVGhpcyBtZXRob2QgaXMgdXNlZnVsIGZvciBsb2dnaW5nIHZlY3RvcnMgaW4gdGhlXG4gICAqIGNvbnNvbGUuXG4gICAqIEBtZXRob2QgIHRvU3RyaW5nXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3MgPSBcIm5vcmVuZGVyXCI+PGNvZGU+XG4gICAqIGZ1bmN0aW9uIHNldHVwKCkge1xuICAgKiAgIHZhciB2ID0gY3JlYXRlVmVjdG9yKDIwLDMwKTtcbiAgICogICBwcmludChTdHJpbmcodikpOyAvLyBwcmludHMgXCJWZWN0b3IgT2JqZWN0IDogWzIwLCAzMCwgMF1cIlxuICAgKiB9XG4gICAqIDwvZGl2PjwvY29kZT5cbiAgICpcbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJ1ZlY3RvciBPYmplY3QgOiBbJysgdGhpcy54ICsnLCAnKyB0aGlzLnkgKycsICcrIHRoaXMueiArICddJztcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgeCwgeSwgYW5kIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3IgdXNpbmcgdHdvIG9yIHRocmVlIHNlcGFyYXRlXG4gICAqIHZhcmlhYmxlcywgdGhlIGRhdGEgZnJvbSBhIFZlY3Rvciwgb3IgdGhlIHZhbHVlcyBmcm9tIGEgZmxvYXQgYXJyYXkuXG4gICAqIEBtZXRob2Qgc2V0XG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfFZlY3RvcnxBcnJheX0gW3hdIHRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIG9yIGFcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVjdG9yIG9yIGFuIEFycmF5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3ldIHRoZSB5IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3pdIHRoZSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAqICAgIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiAgICB2LnNldCg0LDUsNik7IC8vIFNldHMgdmVjdG9yIHRvIFs0LCA1LCA2XVxuICAgKlxuICAgKiAgICB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMCwgMCwgMCk7XG4gICAqICAgIHZhciBhcnIgPSBbMSwgMiwgM107XG4gICAqICAgIHYxLnNldChhcnIpOyAvLyBTZXRzIHZlY3RvciB0byBbMSwgMiwgM11cbiAgICogfVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoeCwgeSwgeikge1xuICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yKSB7XG4gICAgICB0aGlzLnggPSB4LnggfHwgMDtcbiAgICAgIHRoaXMueSA9IHgueSB8fCAwO1xuICAgICAgdGhpcy56ID0geC56IHx8IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgdGhpcy54ID0geFswXSB8fCAwO1xuICAgICAgdGhpcy55ID0geFsxXSB8fCAwO1xuICAgICAgdGhpcy56ID0geFsyXSB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRoaXMueCA9IHggfHwgMDtcbiAgICB0aGlzLnkgPSB5IHx8IDA7XG4gICAgdGhpcy56ID0geiB8fCAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgY29weSBvZiB0aGUgdmVjdG9yLCByZXR1cm5zIGEgVmVjdG9yIG9iamVjdC5cbiAgICpcbiAgICogQG1ldGhvZCBjb3B5XG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIGNvcHkgb2YgdGhlIFZlY3RvciBvYmplY3RcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHZhciB2MiA9IHYuY29weSgpO1xuICAgKiBwcmludCh2MS54ID09IHYyLnggJiYgdjEueSA9PSB2Mi55ICYmIHYxLnogPT0gdjIueik7XG4gICAqIC8vIFByaW50cyBcInRydWVcIlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCx0aGlzLnksdGhpcy56KTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkcyB4LCB5LCBhbmQgeiBjb21wb25lbnRzIHRvIGEgdmVjdG9yLCBhZGRzIG9uZSB2ZWN0b3IgdG8gYW5vdGhlciwgb3JcbiAgICogYWRkcyB0d28gaW5kZXBlbmRlbnQgdmVjdG9ycyB0b2dldGhlci4gVGhlIHZlcnNpb24gb2YgdGhlIG1ldGhvZCB0aGF0IGFkZHNcbiAgICogdHdvIHZlY3RvcnMgdG9nZXRoZXIgaXMgYSBzdGF0aWMgbWV0aG9kIGFuZCByZXR1cm5zIGEgVmVjdG9yLCB0aGUgb3RoZXJzXG4gICAqIGFjdHMgZGlyZWN0bHkgb24gdGhlIHZlY3Rvci4gU2VlIHRoZSBleGFtcGxlcyBmb3IgbW9yZSBjb250ZXh0LlxuICAgKlxuICAgKiBAbWV0aG9kIGFkZFxuICAgKiBAY2hhaW5hYmxlXG4gICAqIEBwYXJhbSAge051bWJlcnxWZWN0b3J8QXJyYXl9IHggICB0aGUgeCBjb21wb25lbnQgb2YgdGhlIHZlY3RvciB0byBiZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWQgb3IgYSBWZWN0b3Igb3IgYW4gQXJyYXlcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3ldIHRoZSB5IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIHRvIGJlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRlZFxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbel0gdGhlIHogY29tcG9uZW50IG9mIHRoZSB2ZWN0b3IgdG8gYmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgICAgICAgICAgICAgICB0aGUgVmVjdG9yIG9iamVjdC5cbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdi5hZGQoNCw1LDYpO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG8gWzUsIDcsIDldXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigyLCAzLCA0KTtcbiAgICpcbiAgICogdmFyIHYzID0gVmVjdG9yLmFkZCh2MSwgdjIpO1xuICAgKiAvLyB2MyBoYXMgY29tcG9uZW50cyBbMywgNSwgN11cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuICAgICAgdGhpcy54ICs9IHgueCB8fCAwO1xuICAgICAgdGhpcy55ICs9IHgueSB8fCAwO1xuICAgICAgdGhpcy56ICs9IHgueiB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHRoaXMueCArPSB4WzBdIHx8IDA7XG4gICAgICB0aGlzLnkgKz0geFsxXSB8fCAwO1xuICAgICAgdGhpcy56ICs9IHhbMl0gfHwgMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0aGlzLnggKz0geCB8fCAwO1xuICAgIHRoaXMueSArPSB5IHx8IDA7XG4gICAgdGhpcy56ICs9IHogfHwgMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogU3VidHJhY3RzIHgsIHksIGFuZCB6IGNvbXBvbmVudHMgZnJvbSBhIHZlY3Rvciwgc3VidHJhY3RzIG9uZSB2ZWN0b3IgZnJvbVxuICAgKiBhbm90aGVyLCBvciBzdWJ0cmFjdHMgdHdvIGluZGVwZW5kZW50IHZlY3RvcnMuIFRoZSB2ZXJzaW9uIG9mIHRoZSBtZXRob2RcbiAgICogdGhhdCBzdWJ0cmFjdHMgdHdvIHZlY3RvcnMgaXMgYSBzdGF0aWMgbWV0aG9kIGFuZCByZXR1cm5zIGEgVmVjdG9yLCB0aGVcbiAgICogb3RoZXIgYWN0cyBkaXJlY3RseSBvbiB0aGUgdmVjdG9yLiBTZWUgdGhlIGV4YW1wbGVzIGZvciBtb3JlIGNvbnRleHQuXG4gICAqXG4gICAqIEBtZXRob2Qgc3ViXG4gICAqIEBjaGFpbmFibGVcbiAgICogQHBhcmFtICB7TnVtYmVyfFZlY3RvcnxBcnJheX0geCAgIHRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIG9yIGFcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlY3RvciBvciBhbiBBcnJheVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBbeV0gdGhlIHkgY29tcG9uZW50IG9mIHRoZSB2ZWN0b3JcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgICAgICAgW3pdIHRoZSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgICAgICAgICAgICAgICBWZWN0b3Igb2JqZWN0LlxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDQsIDUsIDYpO1xuICAgKiB2LnN1YigxLCAxLCAxKTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvIFszLCA0LCA1XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDIsIDMsIDQpO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqXG4gICAqIHZhciB2MyA9IFZlY3Rvci5zdWIodjEsIHYyKTtcbiAgICogLy8gdjMgaGFzIGNvbXBuZW50cyBbMSwgMSwgMV1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuICAgICAgdGhpcy54IC09IHgueCB8fCAwO1xuICAgICAgdGhpcy55IC09IHgueSB8fCAwO1xuICAgICAgdGhpcy56IC09IHgueiB8fCAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHRoaXMueCAtPSB4WzBdIHx8IDA7XG4gICAgICB0aGlzLnkgLT0geFsxXSB8fCAwO1xuICAgICAgdGhpcy56IC09IHhbMl0gfHwgMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0aGlzLnggLT0geCB8fCAwO1xuICAgIHRoaXMueSAtPSB5IHx8IDA7XG4gICAgdGhpcy56IC09IHogfHwgMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogTXVsdGlwbHkgdGhlIHZlY3RvciBieSBhIHNjYWxhci4gVGhlIHN0YXRpYyB2ZXJzaW9uIG9mIHRoaXMgbWV0aG9kXG4gICAqIGNyZWF0ZXMgYSBuZXcgVmVjdG9yIHdoaWxlIHRoZSBub24gc3RhdGljIHZlcnNpb24gYWN0cyBvbiB0aGUgdmVjdG9yXG4gICAqIGRpcmVjdGx5LiBTZWUgdGhlIGV4YW1wbGVzIGZvciBtb3JlIGNvbnRleHQuXG4gICAqXG4gICAqIEBtZXRob2QgbXVsdFxuICAgKiBAY2hhaW5hYmxlXG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgbiB0aGUgbnVtYmVyIHRvIG11bHRpcGx5IHdpdGggdGhlIHZlY3RvclxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IGEgcmVmZXJlbmNlIHRvIHRoZSBWZWN0b3Igb2JqZWN0IChhbGxvdyBjaGFpbmluZylcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdi5tdWx0KDIpO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG8gWzIsIDQsIDZdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHZhciB2MiA9IFZlY3Rvci5tdWx0KHYxLCAyKTtcbiAgICogLy8gdjIgaGFzIGNvbXBuZW50cyBbMiwgNCwgNl1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUubXVsdCA9IGZ1bmN0aW9uIChuKSB7XG4gICAgdGhpcy54ICo9IG4gfHwgMDtcbiAgICB0aGlzLnkgKj0gbiB8fCAwO1xuICAgIHRoaXMueiAqPSBuIHx8IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpdmlkZSB0aGUgdmVjdG9yIGJ5IGEgc2NhbGFyLiBUaGUgc3RhdGljIHZlcnNpb24gb2YgdGhpcyBtZXRob2QgY3JlYXRlcyBhXG4gICAqIG5ldyBWZWN0b3Igd2hpbGUgdGhlIG5vbiBzdGF0aWMgdmVyc2lvbiBhY3RzIG9uIHRoZSB2ZWN0b3IgZGlyZWN0bHkuXG4gICAqIFNlZSB0aGUgZXhhbXBsZXMgZm9yIG1vcmUgY29udGV4dC5cbiAgICpcbiAgICogQG1ldGhvZCBkaXZcbiAgICogQGNoYWluYWJsZVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9ICAgIG4gdGhlIG51bWJlciB0byBkaXZpZGUgdGhlIHZlY3RvciBieVxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IGEgcmVmZXJlbmNlIHRvIHRoZSBWZWN0b3Igb2JqZWN0IChhbGxvdyBjaGFpbmluZylcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3Rvcig2LCA0LCAyKTtcbiAgICogdi5kaXYoMik7IC8vdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvIFszLCAyLCAxXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxICA9IGNyZWF0ZVZlY3Rvcig2LCA0LCAyKTtcbiAgICogdmFyIHYyID0gVmVjdG9yLmRpdih2LCAyKTtcbiAgICogLy8gdjIgaGFzIGNvbXBuZW50cyBbMywgMiwgMV1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuZGl2ID0gZnVuY3Rpb24gKG4pIHtcbiAgICB0aGlzLnggLz0gbjtcbiAgICB0aGlzLnkgLz0gbjtcbiAgICB0aGlzLnogLz0gbjtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgbWFnbml0dWRlIChsZW5ndGgpIG9mIHRoZSB2ZWN0b3IgYW5kIHJldHVybnMgdGhlIHJlc3VsdCBhc1xuICAgKiBhIGZsb2F0ICh0aGlzIGlzIHNpbXBseSB0aGUgZXF1YXRpb24gc3FydCh4KnggKyB5KnkgKyB6KnopLilcbiAgICpcbiAgICogQG1ldGhvZCBtYWdcbiAgICogQHJldHVybiB7TnVtYmVyfSBtYWduaXR1ZGUgb2YgdGhlIHZlY3RvclxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDIwLjAsIDMwLjAsIDQwLjApO1xuICAgKiB2YXIgbSA9IHYubWFnKDEwKTtcbiAgICogcHJpbnQobSk7IC8vIFByaW50cyBcIjUzLjg1MTY0ODA3MTM0NTA0XCJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUubWFnID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5tYWdTcSgpKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgc3F1YXJlZCBtYWduaXR1ZGUgb2YgdGhlIHZlY3RvciBhbmQgcmV0dXJucyB0aGUgcmVzdWx0XG4gICAqIGFzIGEgZmxvYXQgKHRoaXMgaXMgc2ltcGx5IHRoZSBlcXVhdGlvbiA8ZW0+KHgqeCArIHkqeSArIHoqeik8L2VtPi4pXG4gICAqIEZhc3RlciBpZiB0aGUgcmVhbCBsZW5ndGggaXMgbm90IHJlcXVpcmVkIGluIHRoZVxuICAgKiBjYXNlIG9mIGNvbXBhcmluZyB2ZWN0b3JzLCBldGMuXG4gICAqXG4gICAqIEBtZXRob2QgbWFnU3FcbiAgICogQHJldHVybiB7bnVtYmVyfSBzcXVhcmVkIG1hZ25pdHVkZSBvZiB0aGUgdmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoNiwgNCwgMik7XG4gICAqIHByaW50KHYxLm1hZ1NxKCkpOyAvLyBQcmludHMgXCI1NlwiXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLm1hZ1NxID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB4ID0gdGhpcy54LCB5ID0gdGhpcy55LCB6ID0gdGhpcy56O1xuICAgIHJldHVybiAoeCAqIHggKyB5ICogeSArIHogKiB6KTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuIFRoZSB2ZXJzaW9uIG9mIHRoZSBtZXRob2RcbiAgICogdGhhdCBjb21wdXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIGluZGVwZW5kZW50IHZlY3RvcnMgaXMgYSBzdGF0aWNcbiAgICogbWV0aG9kLiBTZWUgdGhlIGV4YW1wbGVzIGZvciBtb3JlIGNvbnRleHQuXG4gICAqXG4gICAqXG4gICAqIEBtZXRob2QgZG90XG4gICAqIEBwYXJhbSAge051bWJlcnxWZWN0b3J9IHggICB4IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yIG9yIGEgVmVjdG9yXG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgIFt5XSB5IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgIFt6XSB6IGNvbXBvbmVudCBvZiB0aGUgdmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn0gICAgICAgICAgICAgICAgIHRoZSBkb3QgcHJvZHVjdFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAyLCAzKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDIsIDMsIDQpO1xuICAgKlxuICAgKiBwcmludCh2MS5kb3QodjIpKTsgLy8gUHJpbnRzIFwiMjBcIlxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigzLCAyLCAxKTtcbiAgICogcHJpbnQgKFZlY3Rvci5kb3QodjEsIHYyKSk7IC8vIFByaW50cyBcIjEwXCJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3Rvcikge1xuICAgICAgcmV0dXJuIHRoaXMuZG90KHgueCwgeC55LCB4LnopO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy54ICogKHggfHwgMCkgK1xuICAgICAgICAgICB0aGlzLnkgKiAoeSB8fCAwKSArXG4gICAgICAgICAgIHRoaXMueiAqICh6IHx8IDApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIGEgdmVjdG9yIGNvbXBvc2VkIG9mIHRoZSBjcm9zcyBwcm9kdWN0IGJldHdlZW5cbiAgICogdHdvIHZlY3RvcnMuIEJvdGggdGhlIHN0YXRpYyBhbmQgbm9uIHN0YXRpYyBtZXRob2RzIHJldHVybiBhIG5ldyBWZWN0b3IuXG4gICAqIFNlZSB0aGUgZXhhbXBsZXMgZm9yIG1vcmUgY29udGV4dC5cbiAgICpcbiAgICogQG1ldGhvZCBjcm9zc1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYgVmVjdG9yIHRvIGJlIGNyb3NzZWRcbiAgICogQHJldHVybiB7VmVjdG9yfSAgIFZlY3RvciBjb21wb3NlZCBvZiBjcm9zcyBwcm9kdWN0XG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDIsIDMpO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMSwgMiwgMyk7XG4gICAqXG4gICAqIHYxLmNyb3NzKHYyKTsgLy8gdidzIGNvbXBvbmVudHMgYXJlIFswLCAwLCAwXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIC8vIFN0YXRpYyBtZXRob2RcbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEsIDAsIDApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMCwgMSwgMCk7XG4gICAqXG4gICAqIHZhciBjcm9zc1Byb2R1Y3QgPSBWZWN0b3IuY3Jvc3ModjEsIHYyKTtcbiAgICogLy8gY3Jvc3NQcm9kdWN0IGhhcyBjb21wb25lbnRzIFswLCAwLCAxXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5jcm9zcyA9IGZ1bmN0aW9uICh2KSB7XG4gICAgdmFyIHggPSB0aGlzLnkgKiB2LnogLSB0aGlzLnogKiB2Lnk7XG4gICAgdmFyIHkgPSB0aGlzLnogKiB2LnggLSB0aGlzLnggKiB2Lno7XG4gICAgdmFyIHogPSB0aGlzLnggKiB2LnkgLSB0aGlzLnkgKiB2Lng7XG5cblx0XHRyZXR1cm4gbmV3IFZlY3Rvcih4LHkseik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIEV1Y2xpZGVhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHMgKGNvbnNpZGVyaW5nIGFcbiAgICogcG9pbnQgYXMgYSB2ZWN0b3Igb2JqZWN0KS5cbiAgICpcbiAgICogQG1ldGhvZCBkaXN0XG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdiB0aGUgeCwgeSwgYW5kIHogY29vcmRpbmF0ZXMgb2YgYSBWZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgIHRoZSBkaXN0YW5jZVxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAwLCAwKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDAsIDEsIDApO1xuICAgKlxuICAgKiB2YXIgZGlzdGFuY2UgPSB2MS5kaXN0KHYyKTsgLy8gZGlzdGFuY2UgaXMgMS40MTQyLi4uXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogLy8gU3RhdGljIG1ldGhvZFxuICAgKiB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMSwgMCwgMCk7XG4gICAqIHZhciB2MiA9IGNyZWF0ZVZlY3RvcigwLCAxLCAwKTtcbiAgICpcbiAgICogdmFyIGRpc3RhbmNlID0gVmVjdG9yLmRpc3QodjEsdjIpO1xuICAgKiAvLyBkaXN0YW5jZSBpcyAxLjQxNDIuLi5cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuZGlzdCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgdmFyIGQgPSB2LmNvcHkoKS5zdWIodGhpcyk7XG4gICAgcmV0dXJuIGQubWFnKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIE5vcm1hbGl6ZSB0aGUgdmVjdG9yIHRvIGxlbmd0aCAxIChtYWtlIGl0IGEgdW5pdCB2ZWN0b3IpLlxuICAgKlxuICAgKiBAbWV0aG9kIG5vcm1hbGl6ZVxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IG5vcm1hbGl6ZWQgVmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMTAsIDIwLCAyKTtcbiAgICogLy8gdiBoYXMgY29tcG5lbnRzIFsxMC4wLCAyMC4wLCAyLjBdXG4gICAqIHYubm9ybWFsaXplKCk7XG4gICAqIC8vIHYncyBjb21wbmVudHMgYXJlIHNldCB0b1xuICAgKiAvLyBbMC40NDU0MzU0LCAwLjg5MDg3MDgsIDAuMDg5MDg3MDg0XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2KHRoaXMubWFnKCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMaW1pdCB0aGUgbWFnbml0dWRlIG9mIHRoaXMgdmVjdG9yIHRvIHRoZSB2YWx1ZSB1c2VkIGZvciB0aGUgPGI+bWF4PC9iPlxuICAgKiBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBtZXRob2QgbGltaXRcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgICBtYXggdGhlIG1heGltdW0gbWFnbml0dWRlIGZvciB0aGUgdmVjdG9yXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgIHRoZSBtb2RpZmllZCBWZWN0b3JcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcz1cIm5vcmVuZGVyXCI+XG4gICAqIDxjb2RlPlxuICAgKiB2YXIgdiA9IGNyZWF0ZVZlY3RvcigxMCwgMjAsIDIpO1xuICAgKiAvLyB2IGhhcyBjb21wbmVudHMgWzEwLjAsIDIwLjAsIDIuMF1cbiAgICogdi5saW1pdCg1KTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvXG4gICAqIC8vIFsyLjIyNzE3NzEsIDQuNDU0MzU0MywgMC40NDU0MzU0XVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5saW1pdCA9IGZ1bmN0aW9uIChsKSB7XG4gICAgdmFyIG1TcSA9IHRoaXMubWFnU3EoKTtcbiAgICBpZihtU3EgPiBsKmwpIHtcbiAgICAgIHRoaXMuZGl2KE1hdGguc3FydChtU3EpKTsgLy9ub3JtYWxpemUgaXRcbiAgICAgIHRoaXMubXVsdChsKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgbWFnbml0dWRlIG9mIHRoaXMgdmVjdG9yIHRvIHRoZSB2YWx1ZSB1c2VkIGZvciB0aGUgPGI+bGVuPC9iPlxuICAgKiBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBtZXRob2Qgc2V0TWFnXG4gICAqIEBwYXJhbSAge251bWJlcn0gICAgbGVuIHRoZSBuZXcgbGVuZ3RoIGZvciB0aGlzIHZlY3RvclxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgICB0aGUgbW9kaWZpZWQgVmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEwLCAyMCwgMik7XG4gICAqIC8vIHYgaGFzIGNvbXBuZW50cyBbMTAuMCwgMjAuMCwgMi4wXVxuICAgKiB2MS5zZXRNYWcoMTApO1xuICAgKiAvLyB2J3MgY29tcG5lbnRzIGFyZSBzZXQgdG8gWzYuMCwgOC4wLCAwLjBdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLnNldE1hZyA9IGZ1bmN0aW9uIChsZW4pIHtcbiAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUoKS5tdWx0KGxlbik7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSB0aGUgYW5nbGUgb2Ygcm90YXRpb24gZm9yIHRoaXMgdmVjdG9yIChvbmx5IDJEIHZlY3RvcnMpXG4gICAqXG4gICAqIEBtZXRob2QgaGVhZGluZ1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSBhbmdsZSBvZiByb3RhdGlvblxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzID0gXCJub3JlbmRlclwiPjxjb2RlPlxuICAgKiBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICogICB2YXIgdjEgPSBjcmVhdGVWZWN0b3IoMzAsNTApO1xuICAgKiAgIHByaW50KHYxLmhlYWRpbmcoKSk7IC8vIDEuMDMwMzc2ODI2NTI0MzEyNVxuICAgKlxuICAgKiAgIHZhciB2MSA9IGNyZWF0ZVZlY3Rvcig0MCw1MCk7XG4gICAqICAgcHJpbnQodjEuaGVhZGluZygpKTsgLy8gMC44OTYwNTUzODQ1NzEzNDM5XG4gICAqXG4gICAqICAgdmFyIHYxID0gY3JlYXRlVmVjdG9yKDMwLDcwKTtcbiAgICogICBwcmludCh2MS5oZWFkaW5nKCkpOyAvLyAxLjE2NTkwNDU0MDUwOTgxMzJcbiAgICogfVxuICAgKiA8L2Rpdj48L2NvZGU+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmhlYWRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy55LCB0aGlzLngpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSb3RhdGUgdGhlIHZlY3RvciBieSBhbiBhbmdsZSAob25seSAyRCB2ZWN0b3JzKSwgbWFnbml0dWRlIHJlbWFpbnMgdGhlXG4gICAqIHNhbWVcbiAgICpcbiAgICogQG1ldGhvZCByb3RhdGVcbiAgICogQHBhcmFtICB7bnVtYmVyfSAgICBhbmdsZSB0aGUgYW5nbGUgb2Ygcm90YXRpb25cbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgbW9kaWZpZWQgVmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMTAuMCwgMjAuMCk7XG4gICAqIC8vIHYgaGFzIGNvbXBuZW50cyBbMTAuMCwgMjAuMCwgMC4wXVxuICAgKiB2LnJvdGF0ZShIQUxGX1BJKTtcbiAgICogLy8gdidzIGNvbXBuZW50cyBhcmUgc2V0IHRvIFstMjAuMCwgOS45OTk5OTksIDAuMF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gKGFuZ2xlKSB7XG4gICAgdmFyIG5ld0hlYWRpbmcgPSB0aGlzLmhlYWRpbmcoKSArIGFuZ2xlO1xuICAgIHZhciBtYWcgPSB0aGlzLm1hZygpO1xuICAgIHRoaXMueCA9IE1hdGguY29zKG5ld0hlYWRpbmcpICogbWFnO1xuICAgIHRoaXMueSA9IE1hdGguc2luKG5ld0hlYWRpbmcpICogbWFnO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMaW5lYXIgaW50ZXJwb2xhdGUgdGhlIHZlY3RvciB0byBhbm90aGVyIHZlY3RvclxuICAgKlxuICAgKiBAbWV0aG9kIGxlcnBcbiAgICogQHBhcmFtICB7VmVjdG9yfSB4ICAgdGhlIHggY29tcG9uZW50IG9yIHRoZSBWZWN0b3IgdG8gbGVycCB0b1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IFt5XSB5IHRoZSB5IGNvbXBvbmVudFxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IFt6XSB6IHRoZSB6IGNvbXBvbmVudFxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgIGFtdCB0aGUgYW1vdW50IG9mIGludGVycG9sYXRpb247IHNvbWUgdmFsdWUgYmV0d2VlbiAwLjBcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgKG9sZCB2ZWN0b3IpIGFuZCAxLjAgKG5ldyB2ZWN0b3IpLiAwLjEgaXMgdmVyeSBuZWFyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBuZXcgdmVjdG9yLiAwLjUgaXMgaGFsZndheSBpbiBiZXR3ZWVuLlxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgICB0aGUgbW9kaWZpZWQgVmVjdG9yXG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBjcmVhdGVWZWN0b3IoMSwgMSwgMCk7XG4gICAqXG4gICAqIHYubGVycCgzLCAzLCAwLCAwLjUpOyAvLyB2IG5vdyBoYXMgY29tcG9uZW50cyBbMiwyLDBdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDAsIDAsIDApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMTAwLCAxMDAsIDApO1xuICAgKlxuICAgKiB2YXIgdjMgPSBWZWN0b3IubGVycCh2MSwgdjIsIDAuNSk7XG4gICAqIC8vIHYzIGhhcyBjb21wb25lbnRzIFs1MCw1MCwwXVxuICAgKiA8L2NvZGU+XG4gICAqIDwvZGl2PlxuICAgKi9cbiAgVmVjdG9yLnByb3RvdHlwZS5sZXJwID0gZnVuY3Rpb24gKHgsIHksIHosIGFtdCkge1xuICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5sZXJwKHgueCwgeC55LCB4LnosIHkpO1xuICAgIH1cbiAgICB0aGlzLnggKz0gKHggLSB0aGlzLngpICogYW10IHx8IDA7XG4gICAgdGhpcy55ICs9ICh5IC0gdGhpcy55KSAqIGFtdCB8fCAwO1xuICAgIHRoaXMueiArPSAoeiAtIHRoaXMueikgKiBhbXQgfHwgMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJuIGEgcmVwcmVzZW50YXRpb24gb2YgdGhpcyB2ZWN0b3IgYXMgYSBmbG9hdCBhcnJheS4gVGhpcyBpcyBvbmx5XG4gICAqIGZvciB0ZW1wb3JhcnkgdXNlLiBJZiB1c2VkIGluIGFueSBvdGhlciBmYXNoaW9uLCB0aGUgY29udGVudHMgc2hvdWxkIGJlXG4gICAqIGNvcGllZCBieSB1c2luZyB0aGUgPGI+VmVjdG9yLmNvcHkoKTwvYj4gbWV0aG9kIHRvIGNvcHkgaW50byB5b3VyIG93blxuICAgKiBhcnJheS5cbiAgICpcbiAgICogQG1ldGhvZCBhcnJheVxuICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gQXJyYXkgd2l0aCB0aGUgMyB2YWx1ZXNcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcyA9IFwibm9yZW5kZXJcIj48Y29kZT5cbiAgICogZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAqICAgdmFyIHYgPSBjcmVhdGVWZWN0b3IoMjAsMzApO1xuICAgKiAgIHByaW50KHYuYXJyYXkoKSk7IC8vIFByaW50cyA6IEFycmF5IFsyMCwgMzAsIDBdXG4gICAqIH1cbiAgICogPC9kaXY+PC9jb2RlPlxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2ID0gY3JlYXRlVmVjdG9yKDEwLjAsIDIwLjAsIDMwLjApO1xuICAgKiB2YXIgZiA9IHYuYXJyYXkoKTtcbiAgICogcHJpbnQoZlswXSk7IC8vIFByaW50cyBcIjEwLjBcIlxuICAgKiBwcmludChmWzFdKTsgLy8gUHJpbnRzIFwiMjAuMFwiXG4gICAqIHByaW50KGZbMl0pOyAvLyBQcmludHMgXCIzMC4wXCJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5wcm90b3R5cGUuYXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnggfHwgMCwgdGhpcy55IHx8IDAsIHRoaXMueiB8fCAwXTtcbiAgfTtcblxuICAvKipcbiAgICogRXF1YWxpdHkgY2hlY2sgYWdhaW5zdCBhIFZlY3RvclxuICAgKlxuICAgKiBAbWV0aG9kIGVxdWFsc1xuICAgKiBAcGFyYW0ge051bWJlcnxWZWN0b3J8QXJyYXl9IFt4XSB0aGUgeCBjb21wb25lbnQgb2YgdGhlIHZlY3RvciBvciBhXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlY3RvciBvciBhbiBBcnJheVxuICAgKiBAcGFyYW0ge051bWJlcn0gICAgICAgICAgICAgICAgIFt5XSB0aGUgeSBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcGFyYW0ge051bWJlcn0gICAgICAgICAgICAgICAgIFt6XSB0aGUgeiBjb21wb25lbnQgb2YgdGhlIHZlY3RvclxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIHRoZSB2ZWN0b3JzIGFyZSBlcXVhbHNcbiAgICogQGV4YW1wbGVcbiAgICogPGRpdiBjbGFzcyA9IFwibm9yZW5kZXJcIj48Y29kZT5cbiAgICogdjEgPSBjcmVhdGVWZWN0b3IoNSwxMCwyMCk7XG4gICAqIHYyID0gY3JlYXRlVmVjdG9yKDUsMTAsMjApO1xuICAgKiB2MyA9IGNyZWF0ZVZlY3RvcigxMywxMCwxOSk7XG4gICAqXG4gICAqIHByaW50KHYxLmVxdWFscyh2Mi54LHYyLnksdjIueikpOyAvLyB0cnVlXG4gICAqIHByaW50KHYxLmVxdWFscyh2My54LHYzLnksdjMueikpOyAvLyBmYWxzZVxuICAgKiA8L2Rpdj48L2NvZGU+XG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYxID0gY3JlYXRlVmVjdG9yKDEwLjAsIDIwLjAsIDMwLjApO1xuICAgKiB2YXIgdjIgPSBjcmVhdGVWZWN0b3IoMTAuMCwgMjAuMCwgMzAuMCk7XG4gICAqIHZhciB2MyA9IGNyZWF0ZVZlY3RvcigwLjAsIDAuMCwgMC4wKTtcbiAgICogcHJpbnQgKHYxLmVxdWFscyh2MikpIC8vIHRydWVcbiAgICogcHJpbnQgKHYxLmVxdWFscyh2MykpIC8vIGZhbHNlXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gICAgdmFyIGEsIGIsIGM7XG4gICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IpIHtcbiAgICAgIGEgPSB4LnggfHwgMDtcbiAgICAgIGIgPSB4LnkgfHwgMDtcbiAgICAgIGMgPSB4LnogfHwgMDtcbiAgICB9IGVsc2UgaWYgKHggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgYSA9IHhbMF0gfHwgMDtcbiAgICAgIGIgPSB4WzFdIHx8IDA7XG4gICAgICBjID0geFsyXSB8fCAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBhID0geCB8fCAwO1xuICAgICAgYiA9IHkgfHwgMDtcbiAgICAgIGMgPSB6IHx8IDA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnggPT09IGEgJiYgdGhpcy55ID09PSBiICYmIHRoaXMueiA9PT0gYztcbiAgfTtcblxuXG4gIC8vIFN0YXRpYyBNZXRob2RzXG5cblxuICAvKipcbiAgICogTWFrZSBhIG5ldyAyRCB1bml0IHZlY3RvciBmcm9tIGFuIGFuZ2xlXG4gICAqXG4gICAqIEBtZXRob2QgZnJvbUFuZ2xlXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtOdW1iZXJ9ICAgICBhbmdsZSB0aGUgZGVzaXJlZCBhbmdsZVxuICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgICAgIHRoZSBuZXcgVmVjdG9yIG9iamVjdFxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2PlxuICAgKiA8Y29kZT5cbiAgICogZnVuY3Rpb24gZHJhdygpIHtcbiAgICogICBiYWNrZ3JvdW5kICgyMDApO1xuICAgKlxuICAgKiAgIC8vIENyZWF0ZSBhIHZhcmlhYmxlLCBwcm9wb3J0aW9uYWwgdG8gdGhlIG1vdXNlWCxcbiAgICogICAvLyB2YXJ5aW5nIGZyb20gMC0zNjAsIHRvIHJlcHJlc2VudCBhbiBhbmdsZSBpbiBkZWdyZWVzLlxuICAgKiAgIGFuZ2xlTW9kZShERUdSRUVTKTtcbiAgICogICB2YXIgbXlEZWdyZWVzID0gbWFwKG1vdXNlWCwgMCx3aWR0aCwgMCwzNjApO1xuICAgKlxuICAgKiAgIC8vIERpc3BsYXkgdGhhdCB2YXJpYWJsZSBpbiBhbiBvbnNjcmVlbiB0ZXh0LlxuICAgKiAgIC8vIChOb3RlIHRoZSBuZmMoKSBmdW5jdGlvbiB0byB0cnVuY2F0ZSBhZGRpdGlvbmFsIGRlY2ltYWwgcGxhY2VzLFxuICAgKiAgIC8vIGFuZCB0aGUgXCJcXHhCMFwiIGNoYXJhY3RlciBmb3IgdGhlIGRlZ3JlZSBzeW1ib2wuKVxuICAgKiAgIHZhciByZWFkb3V0ID0gXCJhbmdsZSA9IFwiICsgbmZjKG15RGVncmVlcywxLDEpICsgXCJcXHhCMFwiXG4gICAqICAgbm9TdHJva2UoKTtcbiAgICogICBmaWxsICgwKTtcbiAgICogICB0ZXh0IChyZWFkb3V0LCA1LCAxNSk7XG4gICAqXG4gICAqICAgLy8gQ3JlYXRlIGEgVmVjdG9yIHVzaW5nIHRoZSBmcm9tQW5nbGUgZnVuY3Rpb24sXG4gICAqICAgLy8gYW5kIGV4dHJhY3QgaXRzIHggYW5kIHkgY29tcG9uZW50cy5cbiAgICogICB2YXIgdiA9IFZlY3Rvci5mcm9tQW5nbGUocmFkaWFucyhteURlZ3JlZXMpKTtcbiAgICogICB2YXIgdnggPSB2Lng7XG4gICAqICAgdmFyIHZ5ID0gdi55O1xuICAgKlxuICAgKiAgIHB1c2goKTtcbiAgICogICB0cmFuc2xhdGUgKHdpZHRoLzIsIGhlaWdodC8yKTtcbiAgICogICBub0ZpbGwoKTtcbiAgICogICBzdHJva2UgKDE1MCk7XG4gICAqICAgbGluZSAoMCwwLCAzMCwwKTtcbiAgICogICBzdHJva2UgKDApO1xuICAgKiAgIGxpbmUgKDAsMCwgMzAqdngsIDMwKnZ5KTtcbiAgICogICBwb3AoKVxuICAgKiB9XG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IuZnJvbUFuZ2xlID0gZnVuY3Rpb24oYW5nbGUpIHtcbiAgICByZXR1cm4gbmV3IFZlY3RvcihNYXRoLmNvcyhhbmdsZSksTWF0aC5zaW4oYW5nbGUpLDApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBNYWtlIGEgbmV3IDJEIHVuaXQgdmVjdG9yIGZyb20gYSByYW5kb20gYW5nbGVcbiAgICpcbiAgICogQG1ldGhvZCByYW5kb20yRFxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIG5ldyBWZWN0b3Igb2JqZWN0XG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBWZWN0b3IucmFuZG9tMkQoKTtcbiAgICogLy8gTWF5IG1ha2UgdidzIGF0dHJpYnV0ZXMgc29tZXRoaW5nIGxpa2U6XG4gICAqIC8vIFswLjYxNTU0NjE3LCAtMC41MTE5NTc2NSwgMC4wXSBvclxuICAgKiAvLyBbLTAuNDY5NTg0MSwgLTAuMTQzNjY3MzEsIDAuMF0gb3JcbiAgICogLy8gWzAuNjA5MTA5NywgLTAuMjI4MDUyNzgsIDAuMF1cbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5yYW5kb20yRCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYW5nbGUgPSBNYXRoLnJhbmRvbSgpKk1hdGguUEkqMjtcbiAgICByZXR1cm4gdGhpcy5mcm9tQW5nbGUoYW5nbGUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBNYWtlIGEgbmV3IHJhbmRvbSAzRCB1bml0IHZlY3Rvci5cbiAgICpcbiAgICogQG1ldGhvZCByYW5kb20zRFxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIG5ldyBWZWN0b3Igb2JqZWN0XG4gICAqIEBleGFtcGxlXG4gICAqIDxkaXYgY2xhc3M9XCJub3JlbmRlclwiPlxuICAgKiA8Y29kZT5cbiAgICogdmFyIHYgPSBWZWN0b3IucmFuZG9tM0QoKTtcbiAgICogLy8gTWF5IG1ha2UgdidzIGF0dHJpYnV0ZXMgc29tZXRoaW5nIGxpa2U6XG4gICAqIC8vIFswLjYxNTU0NjE3LCAtMC41MTE5NTc2NSwgMC41OTkxNjhdIG9yXG4gICAqIC8vIFstMC40Njk1ODQxLCAtMC4xNDM2NjczMSwgLTAuODcxMTIwMl0gb3JcbiAgICogLy8gWzAuNjA5MTA5NywgLTAuMjI4MDUyNzgsIC0wLjc1OTU5MDJdXG4gICAqIDwvY29kZT5cbiAgICogPC9kaXY+XG4gICAqL1xuICBWZWN0b3IucmFuZG9tM0QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFuZ2xlID0gTWF0aC5yYW5kb20oKSpNYXRoLlBJKjIsXG5cdCAgICB2eiA9IE1hdGgucmFuZG9tKCkqMi0xLFxuICAgIFx0dnggPSBNYXRoLnNxcnQoMS12eip2eikqTWF0aC5jb3MoYW5nbGUpLFxuICAgIFx0dnkgPSBNYXRoLnNxcnQoMS12eip2eikqTWF0aC5zaW4oYW5nbGUpO1xuXG4gICAgcmV0dXJuIG5ldyBWZWN0b3IodngsdnksdnopO1xuICB9O1xuXG5cbiAgLyoqXG4gICAqIEFkZHMgdHdvIHZlY3RvcnMgdG9nZXRoZXIgYW5kIHJldHVybnMgYSBuZXcgb25lLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjEgYSBWZWN0b3IgdG8gYWRkXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjIgYSBWZWN0b3IgdG8gYWRkXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdGFyZ2V0IGlmIHVuZGVmaW5lZCBhIG5ldyB2ZWN0b3Igd2lsbCBiZSBjcmVhdGVkXG4gICAqIEByZXR1cm4ge1ZlY3Rvcn0gdGhlIHJlc3VsdGluZyBWZWN0b3JcbiAgICpcbiAgICovXG5cbiAgVmVjdG9yLmFkZCA9IGZ1bmN0aW9uICh2MSwgdjIsIHRhcmdldCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB2MS5jb3B5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5zZXQodjEpO1xuICAgIH1cbiAgICB0YXJnZXQuYWRkKHYyKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBTdWJ0cmFjdHMgb25lIFZlY3RvciBmcm9tIGFub3RoZXIgYW5kIHJldHVybnMgYSBuZXcgb25lLiAgVGhlIHNlY29uZFxuICAgKiB2ZWN0b3IgKHYyKSBpcyBzdWJ0cmFjdGVkIGZyb20gdGhlIGZpcnN0ICh2MSksIHJlc3VsdGluZyBpbiB2MS12Mi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYxIGEgVmVjdG9yIHRvIHN1YnRyYWN0IGZyb21cbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MiBhIFZlY3RvciB0byBzdWJ0cmFjdFxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHRhcmdldCBpZiB1bmRlZmluZWQgYSBuZXcgdmVjdG9yIHdpbGwgYmUgY3JlYXRlZFxuICAgKiBAcmV0dXJuIHtWZWN0b3J9IHRoZSByZXN1bHRpbmcgVmVjdG9yXG4gICAqL1xuXG4gIFZlY3Rvci5zdWIgPSBmdW5jdGlvbiAodjEsIHYyLCB0YXJnZXQpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdjEuY29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuc2V0KHYxKTtcbiAgICB9XG4gICAgdGFyZ2V0LnN1Yih2Mik7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfTtcblxuXG4gIC8qKlxuICAgKiBNdWx0aXBsaWVzIGEgdmVjdG9yIGJ5IGEgc2NhbGFyIGFuZCByZXR1cm5zIGEgbmV3IHZlY3Rvci5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYgdGhlIFZlY3RvciB0byBtdWx0aXBseVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICBuIHRoZSBzY2FsYXJcbiAgICogQHBhcmFtICB7VmVjdG9yfSB0YXJnZXQgaWYgdW5kZWZpbmVkIGEgbmV3IHZlY3RvciB3aWxsIGJlIGNyZWF0ZWRcbiAgICogQHJldHVybiB7VmVjdG9yfSAgdGhlIHJlc3VsdGluZyBuZXcgVmVjdG9yXG4gICAqL1xuICBWZWN0b3IubXVsdCA9IGZ1bmN0aW9uICh2LCBuLCB0YXJnZXQpIHtcbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGFyZ2V0ID0gdi5jb3B5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5zZXQodik7XG4gICAgfVxuICAgIHRhcmdldC5tdWx0KG4pO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIERpdmlkZXMgYSB2ZWN0b3IgYnkgYSBzY2FsYXIgYW5kIHJldHVybnMgYSBuZXcgdmVjdG9yLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdiB0aGUgVmVjdG9yIHRvIGRpdmlkZVxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICBuIHRoZSBzY2FsYXJcbiAgICogQHBhcmFtICB7VmVjdG9yfSB0YXJnZXQgaWYgdW5kZWZpbmVkIGEgbmV3IHZlY3RvciB3aWxsIGJlIGNyZWF0ZWRcbiAgICogQHJldHVybiB7VmVjdG9yfSB0aGUgcmVzdWx0aW5nIG5ldyBWZWN0b3JcbiAgICovXG4gIFZlY3Rvci5kaXYgPSBmdW5jdGlvbiAodiwgbiwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IHYuY29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuc2V0KHYpO1xuICAgIH1cbiAgICB0YXJnZXQuZGl2KG4pO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MSB0aGUgZmlyc3QgVmVjdG9yXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjIgdGhlIHNlY29uZCBWZWN0b3JcbiAgICogQHJldHVybiB7TnVtYmVyfSAgICAgdGhlIGRvdCBwcm9kdWN0XG4gICAqL1xuICBWZWN0b3IuZG90ID0gZnVuY3Rpb24gKHYxLCB2Mikge1xuICAgIHJldHVybiB2MS5kb3QodjIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBjcm9zcyBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjEgdGhlIGZpcnN0IFZlY3RvclxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYyIHRoZSBzZWNvbmQgVmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn0gICAgIHRoZSBjcm9zcyBwcm9kdWN0XG4gICAqL1xuICBWZWN0b3IuY3Jvc3MgPSBmdW5jdGlvbiAodjEsIHYyKSB7XG4gICAgcmV0dXJuIHYxLmNyb3NzKHYyKTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgRXVjbGlkZWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50cyAoY29uc2lkZXJpbmcgYVxuICAgKiBwb2ludCBhcyBhIHZlY3RvciBvYmplY3QpLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjEgdGhlIGZpcnN0IFZlY3RvclxuICAgKiBAcGFyYW0gIHtWZWN0b3J9IHYyIHRoZSBzZWNvbmQgVmVjdG9yXG4gICAqIEByZXR1cm4ge051bWJlcn0gICAgIHRoZSBkaXN0YW5jZVxuICAgKi9cbiAgVmVjdG9yLmRpc3QgPSBmdW5jdGlvbiAodjEsdjIpIHtcbiAgICByZXR1cm4gdjEuZGlzdCh2Mik7XG4gIH07XG5cbiAgLyoqXG4gICAqIExpbmVhciBpbnRlcnBvbGF0ZSBhIHZlY3RvciB0byBhbm90aGVyIHZlY3RvciBhbmQgcmV0dXJuIHRoZSByZXN1bHQgYXMgYVxuICAgKiBuZXcgdmVjdG9yLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7VmVjdG9yfSB2MSBhIHN0YXJ0aW5nIFZlY3RvclxuICAgKiBAcGFyYW0ge1ZlY3Rvcn0gdjIgdGhlIFZlY3RvciB0byBsZXJwIHRvXG4gICAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICB0aGUgYW1vdW50IG9mIGludGVycG9sYXRpb247IHNvbWUgdmFsdWUgYmV0d2VlbiAwLjBcbiAgICogICAgICAgICAgICAgICAgICAgICAgIChvbGQgdmVjdG9yKSBhbmQgMS4wIChuZXcgdmVjdG9yKS4gMC4xIGlzIHZlcnkgbmVhclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgdGhlIG5ldyB2ZWN0b3IuIDAuNSBpcyBoYWxmd2F5IGluIGJldHdlZW4uXG4gICAqL1xuICBWZWN0b3IubGVycCA9IGZ1bmN0aW9uICh2MSwgdjIsIGFtdCwgdGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IHYxLmNvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnNldCh2MSk7XG4gICAgfVxuICAgIHRhcmdldC5sZXJwKHYyLCBhbXQpO1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYW5kIHJldHVybnMgdGhlIGFuZ2xlIChpbiByYWRpYW5zKSBiZXR3ZWVuIHR3byB2ZWN0b3JzLlxuICAgKiBAbWV0aG9kIGFuZ2xlQmV0d2VlblxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge1ZlY3Rvcn0gdjEgdGhlIHgsIHksIGFuZCB6IGNvbXBvbmVudHMgb2YgYSBWZWN0b3JcbiAgICogQHBhcmFtICB7VmVjdG9yfSB2MiB0aGUgeCwgeSwgYW5kIHogY29tcG9uZW50cyBvZiBhIFZlY3RvclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICAgIHRoZSBhbmdsZSBiZXR3ZWVuIChpbiByYWRpYW5zKVxuICAgKiBAZXhhbXBsZVxuICAgKiA8ZGl2IGNsYXNzPVwibm9yZW5kZXJcIj5cbiAgICogPGNvZGU+XG4gICAqIHZhciB2MSA9IGNyZWF0ZVZlY3RvcigxLCAwLCAwKTtcbiAgICogdmFyIHYyID0gY3JlYXRlVmVjdG9yKDAsIDEsIDApO1xuICAgKlxuICAgKiB2YXIgYW5nbGUgPSBWZWN0b3IuYW5nbGVCZXR3ZWVuKHYxLCB2Mik7XG4gICAqIC8vIGFuZ2xlIGlzIFBJLzJcbiAgICogPC9jb2RlPlxuICAgKiA8L2Rpdj5cbiAgICovXG4gIFZlY3Rvci5hbmdsZUJldHdlZW4gPSBmdW5jdGlvbiAodjEsIHYyKSB7XG4gICAgcmV0dXJuIE1hdGguYWNvcyh2MS5kb3QodjIpIC8gKHYxLm1hZygpICogdjIubWFnKCkpKTtcbiAgfTtcblxuICAvLyByZXR1cm4gVmVjdG9yO1xubW9kdWxlLmV4cG9ydHMgPSBWZWN0b3I7XG4vLyB9KTtcbiIsImZ1bmN0aW9uIFV0aWxzKGN4LCBjYW52YXMpIHtcbiAgcmV0dXJuIHtcbiAgICBjeCA6IGN4IHx8ICcnLFxuICAgIGNhbnZhczogY2FudmFzIHx8ICcnLFxuICAgIGhhbGZYOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhbnZhcy53aWR0aCAvIDI7XG4gICAgfSxcbiAgICBoYWxmWTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYW52YXMuaGVpZ2h0IC8gMjtcbiAgICB9LFxuICAgIHJhbmdlOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgICAgIGlmICghbWF4KSB7XG4gICAgICAgIG1heCA9IG1pbjtcbiAgICAgICAgbWluID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbik7XG4gICAgfSxcbiAgICByYW5nZTogZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICAgIHZhciByYW5kID0gTWF0aC5yYW5kb20oKTtcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHJhbmQ7XG4gICAgICB9IGVsc2VcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiByYW5kICogbWluO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG1pbiA+IG1heCkge1xuICAgICAgICAgIHZhciB0bXAgPSBtaW47XG4gICAgICAgICAgbWluID0gbWF4O1xuICAgICAgICAgIG1heCA9IHRtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByYW5kICogKG1heC1taW4pICsgbWluO1xuICAgICAgfVxuICAgIH0sXG4gICAgLy8gdGFrZW4gZnJvbSB0aGUgcDUuanMgcHJvamVjdFxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9jZXNzaW5nL3A1LmpzL2Jsb2IvNWM4MWQ2NTVmNjgzZjkwNDUyYjgwYWIyMjVhNjdlNDQ5NDYzZmZmOS9zcmMvbWF0aC9jYWxjdWxhdGlvbi5qcyNMMzk0XG4gICAgbWFwOiBmdW5jdGlvbihuLCBzdGFydDEsIHN0b3AxLCBzdGFydDIsIHN0b3AyKSB7XG4gICAgICByZXR1cm4gKChuLXN0YXJ0MSkvKHN0b3AxLXN0YXJ0MSkpKihzdG9wMi1zdGFydDIpK3N0YXJ0MjtcbiAgICB9LFxuXG4gICAgZ2V0TW91c2VQb3M6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiBldmVudC5jbGllbnRYLFxuICAgICAgICB5OiBldmVudC5jbGllbnRZXG4gICAgICB9XG4gICAgfSxcblxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuY3guY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgIH0sXG4gICAgVzogY2FudmFzLndpZHRoLFxuICAgIEg6IGNhbnZhcy5oZWlnaHQsXG4gICAgSFc6IGNhbnZhcy53aWR0aCAvIDIsXG4gICAgSEg6IGNhbnZhcy5oZWlnaHQgLyAyLFxuICAgIGVsbGlwc2U6IGZ1bmN0aW9uKHgsIHksIHIpIHtcbiAgICAgIHRoaXMuY3guYmVnaW5QYXRoKCk7XG4gICAgICB0aGlzLmN4LmFyYyh4LCB5LCByLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgICAgdGhpcy5jeC5maWxsKCk7XG4gICAgICB0aGlzLmN4LnN0cm9rZSgpO1xuICAgIH0sXG4gICAgY29uc3RyYWluOiBmdW5jdGlvbih2YWwsIG1pbiwgbWF4KSB7XG4gICAgICBpZiAodmFsID4gbWF4KSB7XG4gICAgICAgIHJldHVybiBtYXg7XG4gICAgICB9IGVsc2UgaWYgKHZhbCA8IG1pbikge1xuICAgICAgICByZXR1cm4gbWluO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY3gsIGNhbnZhcykge1xuICByZXR1cm4gbmV3IFV0aWxzKGN4LCBjYW52YXMpO1xufTtcbiJdfQ==
