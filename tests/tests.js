var Utils = require('../modules/utils.js');
var assert = require('assert');
var expect = require('chai').expect;

var canvas = {
	width: 100,
	height: 100
};

describe('Utility Functions', function() {
	var utils = Utils({}, canvas);

	describe('testing number functions', function() {
		it('should be between 0 and 10', function() {
			var range = utils.range(0, 10);
			expect(range).to.be.within(0, 10);
		});

		it('should be between 0 and 10', function() {
			var range = utils.range(10);
			expect(range).to.be.within(0, 10);
		});

		it('should be between 90 and 100', function() {
			var range = utils.range(90, 100);
			expect(range).to.be.within(90, 100);
		});

		it('should be mapped to from one range to another', function() {
			var toMap = 5,
				start1 = 0,
				stop1 = 10,
				start2 = 0,
				stop2 = 100;

			var mapped = utils.map(toMap, start1, stop1, start2, stop2);
			assert(50, toMap, 'properly mapped. Number went from 5 to 50');
		});
		
		it('should be mapped to from one range to another', function() {
			var toMap = 21,
				start1 = 20,
				stop1 = 100,
				start2 = 200,
				stop2 = 1000;

			var mapped = utils.map(toMap, start1, stop1, start2, stop2);
			assert(210, toMap, 'properly mapped. Number went from 21 to 210');
		});

		it('should be constrained within the range', function() {
			var toConstrain = 50,
				max = 25,
				min = 0;

			assert(25, utils.constrain(toConstrain, min, max));
		});

		it('should be left alone', function() {
			var toConstrain = 5,
				max = 25,
				min = 0;

			assert(5, utils.constrain(toConstrain, min, max));
		});

		it('should be pushed to the min value', function() {
			var toConstrain = 1,
				max = 25,
				min = 5;

			assert(5, utils.constrain(toConstrain, min, max));
		});
	});

	describe('size shortcut functions', function () {
		it('should be the width', function() {
			assert(canvas.width, utils.W(), 'it is the full width');
		});

		it('should be the height', function() {
			assert(canvas.height, utils.H(), 'it is the full height');
		});

		it('check the half the width', function () {
			assert(canvas.width / 2, utils.halfX(), 'it is half the width');
		});

		it('check the half the height', function () {
			assert(canvas.height / 2, utils.halfY(), 'it is half the height');
		});

		it('check the half the width', function () {
			assert(canvas.width / 2, utils.HW(), 'it is half the width');
		});

		it('check the half the height', function () {
			assert(canvas.height / 2, utils.HH(), 'it is half the height');
		});
	});

	describe('mouse coordinates helper', function() {
		var event = {
			clientX: 150,
			clientY: 200
		};

		assert(150, utils.getMousePos(event).x);
		assert(200, utils.getMousePos(event).y);

	});

});