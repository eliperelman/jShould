/*
jShould JavaScript Assertion Library
http://eliperelman.com/jshould

Copyright (c) 2011 Eli Perelman
Dual licensed under the MIT or GPL Version 2 licenses.

Special thanks to Akhil Uddemarri for his help in solving 
several logical issues I faced in creating jShould.
*/
(function (global) {
	"use strict";
	
	var _jShould = global.jShould;
	var _$$ = global.$$;

	// constants
	var constants = {
		undef: 'undefined',
		func: 'function',
		pass: 'info',
		fail: 'warn',
		string: 'string',
		bool: 'boolean',
		num: 'number',
		obj: 'object'
	};
	// end of constants

	// helper methods
	var helpers = {
		hasConsole: typeof console !== constants.undef,
		hasInfo: typeof console !== constants.undef && typeof console.info === constants.func,
		hasWarn: typeof console !== constants.undef && typeof console.warn === constants.func,
		hasFireUnit: typeof fireunit === constants.obj,
		fill: function (str) {
			for (var i = 0, len = arguments.length; i < len; i++) {
				var regex = new RegExp("\\{" + i + "\\}", "g");
				str = str.replace(regex, arguments[i + 1]);
			}

			return str;
		},
		filter: function (arr, expression) {
			// taken from MDC for filter compatibility/use native where available
			// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter
			if (!Array.prototype.filter) {
				if (arr === void 0 || arr === null)
					throw new TypeError();

				var t = Object(arr);
				var len = t.length >>> 0;
				if (!this.isFunction(expression))
					throw new TypeError();

				var res = [];
				for (var i = 0; i < len; i++) {
					if (i in t) {
						var val = t[i]; // in case fun mutates this
						if (expression.call(arr, val, i, t))
							res.push(val);
					}
				}

				return res;
			} else {
				return arr.filter(expression);
			}
		},
		contains: function (a, b) {
			var con = false;

			if (this.isArray(a)) {
				if (this.isFunction(Array.prototype.indexOf)) {
					con = a.indexOf(b) !== -1;
				} else {
					for (var i = 0, len = a.length; i < len; i++) {
						if (a[i] === b) {
							con = true;
							break;
						}
					}
				}
			} else if (this.isObject(a)) {
				con = b in a;
			} else {
				if (a.toString().indexOf(b) !== -1)
					con = true;
				else
					con = false;
			}

			return con;
		},
		isArray: function (obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		},
		isNumber: function (num) {
			return !!(num && typeof num === constants.num);
		},
		isString: function (str) {
			return !!(str && typeof str === constants.string);
		},
		isBool: function (bool) {
			return !!(bool && typeof bool === constants.bool);
		},
		isFunction: function (method) {
			return !!(method && typeof method === constants.func);
		},
		isDate: function (date) {
			return !!(date && typeof date.valueOf === constants.func);
		},
		isObject: function (obj) {
			return !!(obj && typeof obj === constants.obj);
		},
		isUndefined: function (arg) {
			return typeof arg === constants.undef;
		},
		isNull: function (arg) {
			return arg === null;
		},
		isEmpty: function (arg) {
			return arg.length === 0 ||
				arg === '' ||
				(this.isObject(arg) && this.getKeys(arg).length === 0);
		},
		getKeys: function (obj) {
			return this.isFunction(Object.keys) && this.isObject(obj) ? Object.keys(obj) : (function () {
				var collection = [];

				for (var key in obj) {
					if (obj.hasOwnProperty(key))
						collection.push(key);
				}

				return collection;
			})();
		},

		// Thanks John Resig!
		// http://ejohn.org/blog/objectgetprototypeof/
		getPrototype: function (obj) {
			if (!this.isFunction(Object.getPrototypeOf))
				return this.isObject("test".__proto__) ? object.__proto__ : obj.constructor.prototype;
			else
				return Object.getPrototypeOf(obj);
		},
		throwsEx: function (callback) {
			if (!this.isFunction(callback)) {
				callback = function () {
					callback;
				};
			}

			try {
				callback();
				return false;
			} catch (ex) {
				return true;
			}
		},
		isEqual: function (a, b) {
			var typea = typeof a,
				typeb = typeof b,
				akeys, bkeys,
				eq = true;

			// if arguments aren't the same type, don't bother comparing
			if (typea !== typeb)
				return false;

			// return true if arguments point to the same memory location
			// will succeed on most primitive types
			if (a === b)
				return true;

			// if the arguments are both dates, compare their offset values
			if (a instanceof Date && b instanceof Date)
				return a.valueOf() === b.valueOf();

			// if these aren't objects we can non-strict compare
			if (!this.isObject(a) && !this.isObject(b))
				return a == b;

			// once we hit this point, we need to perform semi-deep equality testing
			// by comparing the keys, values, etc.

			// let's make sure that we actually have something here worth comparing
			if (this.isUndefined(a) || this.isNull(a) || this.isUndefined(b) || this.isNull(b))
				return false;

			// let's also make sure that these objects are the
			// same length and save us from some intense processing
			if (a.length !== b.length)
				return false;

			// if these are arrays compare the values at each index
			if (this.isArray(a) && this.isArray(b)) {
				eq = true,
				i = a.length;

				for (var i = 0, len = a.length; i < len; i++) {
					if (!this.isEqual(a[i], b[i])) {
						eq = false;
						break;
					}
				}

				return eq;
			}

			try {
				akeys = this.getKeys(a);
				bkeys = this.getKeys(b);
			} catch (ex) {
				return false;
			}

			// if there aren't the same number of keys, the objects aren't equal.
			// also, helps optimize the next check when we try to access a non-
			// existent property
			if (akeys.length !== bkeys.length)
				return false;

			eq = true;

			for (var i = 0, len = akeys.length; i < len; i++) {
				if (!this.isEqual(a[akeys[i]], b[akeys[i]])) {
					eq = false;
					break;
				}
			}

			return eq;
		}
	};
	// end of helper methods

	var makeAssertion = function (value, passMessage, failMessage) {
		if (helpers.hasFireUnit) {
			if (value === true) {
				fireunit.ok(true, passMessage);
			} else {
				fireunit.ok(false, failMessage);
			}
		} else if (helpers.hasConsole && helpers.hasInfo) {
			if (value === true) {
				console.info(helpers.fill('Assertion passed: {0}', passMessage));
			} else {
				console.warn(helpers.fill('Assertion failed: {0}', failMessage));
			}
		}
	},

	// context is used to hold the object/value that is passed in.
	// can be of any type or value (eventually)
	context,

	jShould = (function () {

		// this method is the constructor for the jShould global object.
		// it returns a new instance of itself (instantiation)
		var jShould = function (obj) {
			context = obj;
			return new instance(obj);
		},

		// instance generator, this function will have prototypes attached
		// to it, which will be available on jShould instances.
		instance = function (obj) {
			return this;
		},

		// the string containing the message to be shown when an assertion passes
		p,

		// the string containing the message to be shown when an assertion fails
		f,

		// private methods
		assert = function (value, passMsg, failMsg) {
			makeAssertion(value, passMsg, failMsg);

			return jShould(context);
		};
		// end of private methods

		// instance methods
		instance.prototype = {
			shouldEqual: function (value) {
				p = 'The arguments are equal.';
				f = 'The arguments should have been equal, but they were not.';

				return assert(helpers.isEqual(context, value), p, f);
			},
			shouldNotEqual: function (value) {
				p = 'The arguments are not equal.';
				f = 'The arguments should not have been equal, but they were.';

				return assert(!helpers.isEqual(context, value), p, f);
			},
			shouldBeType: function (type) {
				p = helpers.fill('The argument was of type "{0}".', type);
				f = helpers.fill('The argument should have been of type "{0}", but it was not.', type);

				return assert(typeof context === type, p, f);
			},
			shouldNotBeType: function (type) {
				p = helpers.fill('The argument was not of type "{0}".', type);
				f = helpers.fill('The argument should not have been of type "{0}", but it was.', type);

				return assert(typeof context !== type, p, f);
			},
			shouldContain: function (value) {
				p = 'The argument contained the value.';
				f = 'The argument should have contained the value, but it did not.';

				return assert(helpers.contains(context, value), p, f);
			},
			shouldNotContain: function (value) {
				p = 'The argument did not contain the value.';
				f = 'The argument should not have contained the value, but it did.';

				return assert(!helpers.contains(context, value), p, f);
			},
			shouldBeNull: function () {
				p = 'The argument was null';
				f = 'The argument should have been null, but it was not.';

				return assert(helpers.isNull(context), p, f);
			},
			shouldNotBeNull: function () {
				p = 'The argument was not null';
				f = 'The argument should not have been null, but it was.';

				return assert(!helpers.isNull(context), p, f);
			},
			shouldBeEmpty: function () {
				p = 'The argument was empty.';
				f = 'The argument should have been empty, but it was not.';

				return assert(helpers.isEmpty(context), p, f);
			},
			shouldNotBeEmpty: function () {
				p = 'The argument was not empty.';
				f = 'The argument should not have been empty, but it was.';

				return assert(!helpers.isEmpty(context), p, f);
			},
			shouldBeUndefined: function () {
				p = 'The argument was undefined.';
				f = 'The argument should have been undefined, but it was defined.';

				return assert(helpers.isUndefined(context), p, f);
			},
			shouldBeDefined: function () {
				p = 'The argument was defined.';
				f = 'The argument should have been defined, but it was undefined.';

				return assert(!helpers.isUndefined(context), p, f);
			},
			shouldBeTrue: function () {
				p = 'The argument was true.';
				f = 'The argument should have been true, but it was not.';

				return assert(context === true, p, f);
			},
			shouldBeFalse: function () {
				p = 'The argument was false.';
				f = 'The argument should have been false, but it was not.';

				return assert(context === false, p, f);
			},
			shouldBeAtLeast: function (num) {
				p = helpers.fill('The argument was at least {0}.', num);
				f = helpers.fill('The argument should have at least been {0}, but it was less than {0}.', num);

				return assert(helpers.isNumber(context) && context >= num, p, f);
			},
			shouldBeAtMost: function (num) {
				p = helpers.fill('The argument was at most {0}.', num);
				f = helpers.fill('The argument should have at most been {0}, but it was greater than {0}.', num);

				return assert(helpers.isNumber(context) && context <= num, p, f);
			},
			shouldThrowException: function () {
				p = 'The callback threw an exception.';
				f = 'The callback should have thrown an exception, but it did not.';

				return assert(helpers.throwsEx(context), p, f);
			},
			shouldNotThrowException: function () {
				p = 'The callback did not throw an exception.';
				f = 'The callback should not have thrown an exception, but it did.';

				return assert(!helpers.throwsEx(context), p, f);
			}
		};
		// end of instance methods

		return jShould;
	})();

	// static methods (methods available on the jShould "class", not its instances)
	jShould.noConflict = function (removeAll) {
		global.$$ = _$$;

		if (removeAll)
			global.jShould = _jShould;

		return jShould;
	};

	// store the prototype of jShould for extending
	var _prototype = helpers.getPrototype(jShould());

	jShould.extend = function (name, passMessage, failMessage, expression) {
		_prototype[name] = function () {
			makeAssertion(expression(context), passMessage, failMessage);

			return jShould(context);
		};
	};
	// end of static methods

	global.$$ = global.jShould = jShould;
})(window);