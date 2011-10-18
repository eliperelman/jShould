/*
jShould v2.0 JavaScript Assertion Library for QUnit
http://eliperelman.com/jshould

Copyright (c) 2011 Eli Perelman
Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function (global) {
	"use strict";

	var _jShould = global.jShould;
	var _$$ = global.$$;

	var is = function (value, type) {
		// Get the true type of any value. If it's null or undefined, compare that, otherwise get its type class and compare that.
		return type === (value == null ? '' + value : {}.toString.call(value).slice(8, -1).toLowerCase());
	},
	contains = function (source, value) {
		if (is(source, 'string')) {
			return source.indexOf(value) !== -1;
		} else if (is(source, 'array')) {
			if (Array.prototype.indexOf) {
				return source.indexOf(value) !== -1;
			}

			for (var i = 0, il = source.length; i < il; i++) {
				if (source[i] === value) {
					return true;
				}
			}
		} else if (is(source, 'object')) {
			for (var prop in source) {
				if (source.hasOwnProperty(prop) && prop === value) {
					return true;
				}
			}
		}

		return false;
	},
	isEmpty = function (value) {
		if (!is(value, 'object')) {
			return !value.length;
		} else {
			for (var prop in value) {
				if (value.hasOwnProperty(prop)) {
					return false;
				}
			}

			return true;
		}
	};

	var jShould = function (value) {
		if (!(this instanceof jShould)) {
			return new jShould(value);
		}

		this.context = value;
	};

	jShould.prototype = {
		shouldEqual: function (value) {
			deepEqual(this.context, value, 'The arguments should have been equal.');
			return this;
		},
		shouldNotEqual: function (value) {
			notDeepEqual(this.context, value, 'The arguments should not have been equal.');
			return this;
		},
		shouldBeType: function (type) {
			ok(typeof this.context === type, 'The argument should have been of type: "' + type + '".');
			return this;
		},
		shouldNotBeType: function (type) {
			ok(typeof this.context !== type, 'The argument should not have been of type: "' + type + '".');
			return this;
		},
		shouldContain: function (value) {
			ok(contains(this.context, value), 'The argument should have contained "' + value + '".');
			return this;
		},
		shouldNotContain: function (value) {
			ok(!contains(this.context, value), 'The argument should not have contained "' + value + '".');
			return this;
		},
		shouldBeNull: function () {
			ok(is(this.context, 'null'), 'The argument should have been null.');
			return this;
		},
		shouldNotBeNull: function () {
			ok(!is(this.context, 'null'), 'The argument should have been null.');
			return this;
		},
		shouldBeEmpty: function () {
			ok(isEmpty(this.context), 'The argument should have been empty.');
			return this;
		},
		shouldNotBeEmpty: function () {
			ok(!isEmpty(this.context), 'The argument should not have been empty.');
			return this;
		},
		shouldBeUndefined: function () {
			ok(is(this.context, 'undefined'), 'The argument should have been undefined.');
			return this;
		},
		shouldBeDefined: function () {
			ok(!is(this.context, 'undefined'), 'The argument should have been defined.');
			return this;
		},
		shouldBeTrue: function () {
			ok(this.context === true, 'The argument should have been true.');
			return this;
		},
		shouldBeFalse: function () {
			ok(this.context === false, 'The argument should have been false.');
			return this;
		},
		shouldBeLessThan: function (num) {
			ok(is(this.context, 'number') && this.context < num, 'The argument should have been at least ' + num + '.');
			return this;
		},
		shouldBeMoreThan: function (num) {
			ok(is(this.context, 'number') && this.context > num, 'The argument should have been at most ' + num + '.');
			return this;
		},
		shouldThrowException: function () {
			raises(this.context, 'The argument should have thrown an exception.');
			return this;
		}
	};

	jShould.extend = function (name, message, expression) {
		jShould.prototype[name] = function () {
			ok(expression(this.context), message);
			return this;
		};
	};

	jShould.noConflict = function () {
		global.$$ = _$$;
		global.jShould = _jShould;

		return jShould;
	};

	global.$$ = global.jShould = jShould;
})(this);