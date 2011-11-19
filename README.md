jShould is now the JavaScript assertion library for QUnit. jShould enables developers to write unit tests faster by making them easier to read and write, and removing the hassle of constantly writing assertions strings.

##So, how do I use it?##

First, you need to download jShould and reference it along with QUnit:

``` javascript
    <script src="qunit.js"></script>
    <script src="jshould.js"></script>
```

Now you can write assertions inside of your QUnit tests using a simple, chainable jShould syntax:

``` javascript

test("qunit jshould test 1", function () {
    var num = 3,
        username = 'john_doe';

    jShould(num).shouldEqual(3);

    // or use the $$ shorthand
    $$(num).shouldEqual(3);

    $$(username)
        .shouldNotBeNull()
    	.shouldBeDefined()
    	.shouldNotContain('<');
});

```

And that's it. Assertions are created as they normally would be in QUnit.

jShould is even extensible so you can create your own, more complex and reusable assertions:

``` javascript

$$.extend('shouldBeValidUsername', 'The username should have been valid.', function (username) {
    return username != null && username.indexOf('<') === -1;
});

test("qunit jshould test 1", function () {
    var username = 'john_doe';	

    $$(username).shouldBeValidUsername();
});

```

##Documentation##

__Core__

``` javascript
jShould(value)
```

Define a value, variable, or expression to run assertions against.

``` javascript
jShould(3);
```

Can also be used via shorthand:

``` javascript
$$(3);
```

__ __

``` javascript
$$.noConflict()
```

Return the jShould and $$ variables to their original values.

``` javascript
$$.noConflict();
```

Reassign to a different name:

``` javascript
var Assert = $$.noConflict();

// EXAMPLE: Now you can use your own name when asserting:
Assert(3).shouldByType('number');
```

__ __

``` javascript
$$.extend(name, message, expression)
```

Extend jShould with custom assertions.

name is the method name placed on jShould when extending
message is shown in the QUnit test results after the test has executed
expression is a function which gets passed one argument: the value being asserted.

``` javascript
// EXAMPLE:
$$.extend('shouldBeValidUsername', 'The username should have been valid.', function (value) {
    return value != null && value.indexOf('<') === -1;
});

$$('john_doe').shouldBeValidUsername();
```

__API__

``` javascript
.shouldEqual(value)
```

Assertion passes if the assertion context is equal to the value argument.
Equivalent to QUnit's deepEqual.

``` javascript
// EXAMPLE
var car = { color: 'green' };
$$(car).shouldEqual({ color: 'green' });
```

__ __

``` javascript
.shouldNotEqual(value)
```

Assertion passes if the assertion context is not equal to the value argument.
Equivalent to QUnit's notDeepEqual.

``` javascript
// EXAMPLE
var car = { color: 'green' };
$$(car).shouldNotEqual({ color: 'red' });
```

__ __

``` javascript
.shouldBeType(type)
```

Assertion passes if the assertion context's type is equal to the value argument's type.
These are the same types as those returned from JavaScript's typeof operator.

``` javascript
// EXAMPLE
var car = { color: 'green' };
$$(car).shouldBeType('object');
```
__ __

``` javascript
.shouldNotBeType(type)
```

Assertion passes if the assertion context's type is not equal to the value argument's type.
These are the same types as those returned from JavaScript's typeof operator.

``` javascript
// EXAMPLE
var car = { color: 'green' };
$$(car).shouldNotBeType('string');
```

__ __

``` javascript
.shouldContain(value)
```

Assertion passes if the assertion context contains the value argument. If the context is a string,
the string is searched for the value. If the context is an array, the array is searched for the value.
If the context is an object, the object's keys are searched for any matches against the value.

``` javascript
// EXAMPLE
$$('my name is').shouldContain('name');
$$([0, 10, 20]).shouldContain(10);
$$({ color: 'green' }).shouldContain('color');
```

__ __

``` javascript
.shouldNotContain(value)
```

Assertion passes if the assertion context does not contains the value argument. If the context
is a string, the string is searched for the value. If the context is an array, the array is searched
for the value. If the context is an object, the object's keys are searched for any matches against
the value.

``` javascript
// EXAMPLE
$$('john_doe').shouldNotContain('; DROP');
$$([0, 10, 20]).shouldNotContain(30);
$$({ color: 'green' }).shouldNotContain('make');
```
__ __

``` javascript
.shouldBeNull()
```

Assertion passes if the assertion context is null.

``` javascript
// EXAMPLE
var username = null;
$$(username).shouldBeNull();
```
__ __

``` javascript
.shouldNotBeNull()
```

Assertion passes if the assertion context is not null.

``` javascript
// EXAMPLE
var username = 'john_doe';
$$(username).shouldNotBeNull();
```

__ __

``` javascript
.shouldBeEmpty()
```

Assertion passes if the assertion context is an empty string or array (length 0) or an empty
object ({}).

``` javascript
// EXAMPLE
$$('').shouldBeEmpty();
$$([]).shouldBeEmpty();
$$({}).shouldBeEmpty();
```

__ __
``` javascript
.shouldNotBeEmpty()
```

Assertion passes if the assertion context is not an empty string or array (length greater than 0)
nor an empty object ({}).

``` javascript
// EXAMPLE
$$('john_doe').shouldNotBeEmpty();
$$([10, 20, 30]).shouldNotBeEmpty();
$$({ color: 'green' }).shouldNotBeEmpty();
```

__ __

``` javascript
.shouldBeUndefined()
```

Assertion passes if the assertion context is undefined.

``` javascript
// EXAMPLE
var username;
$$(username).shouldBeUndefined();
```

__ __

``` javascript
.shouldBeDefined()
```

Assertion passes if the assertion context is defined (not undefined).

``` javascript
// EXAMPLE
var username = 'john_doe';
$$(username).shouldBeDefined();
```

__ __

``` javascript
.shouldBeTrue()
```

Assertion passes if the assertion context evaluates to true (strict evaluation).

``` javascript
// EXAMPLE
$$(10 < 100).shouldBeTrue();
$$(!!1).shouldBeTrue();
```

__ __

``` javascript
.shouldBeFalse()
```

Assertion passes if the assertion context evaluates to false (strict evaluation).

``` javascript
// EXAMPLE
$$(10 > 100).shouldBeFalse();
$$(!!window.myProp).shouldBeFalse();
```

__ __

``` javascript
.shouldBeLessThan(value)
```

Assertion passes if the assertion context is less than the value argument.

``` javascript
// EXAMPLE
$$(10).shouldBeLessThan(100);
```

__ __

``` javascript
.shouldBeMoreThan(num)
```

Assertion passes if the assertion context is greater than the num argument.

``` javascript
// EXAMPLE
$$(100).shouldBeMoreThan(10);
```

__ __

``` javascript
.shouldBeLessThan(num)
```

Assertion passes if the assertion context is less than the num argument.

``` javascript
// EXAMPLE
$$(10).shouldBeLessThan(100);
```

__ __

``` javascript
.shouldThrowException()
```

Assertion passes if the assertion context is a function that throws an error.
Equivalent to QUnit's raises.

``` javascript
// EXAMPLE
var errorFunc = function() {
    throw new Error('Oh crap.');
};

$$(errorFunc).shouldThrowException();
```