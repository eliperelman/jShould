jShould is now the JavaScript assertion library for QUnit. jShould enables developers to write unit tests faster by making them easier to read and write, and removing the hassle of constantly writing assertions strings.

##So, how do I use it?##

First, you need to download jShould and reference it along with QUnit:

    <script src="qunit.js"></script>
    <script src="jshould.js"></script>

Now you can write assertions inside of your QUnit tests using a simple, chainable jShould syntax:


    test("qunit jshould test 1", function () {
        var num = 3,
            username = 'john_doe';

        jShould(num).shouldEqual(3);

        // or use the $$ shorthand
        $$(num).shouldEqual(3);

        $$(username)
            .shouldNotBeNull()
        	.shouldBeDefined()
        	.shouldNotContain('&lt;');
    });


And that's it. Assertions are created as they normally would be in QUnit.

jShould is even extensible so you can create your own, more complex and reusable assertions:

    $$.extend('shouldBeValidUsername', 'The username should have been valid.', function (username) {
        return username != null && username.indexOf('&lt;') === -1;
    });

    test("qunit jshould test 1", function () {
        var username = 'john_doe';	

        $$(username).shouldBeValidUsername();
    });

##Documentation##

__Core__

`jShould(value)`

Define a value, variable, or expression to run assertions against.
    jShould(3);

Can also be used via shorthand:
    $$(3);


`$$.noConflict()`

Return the jShould and $$ variables to their original values.

    $$.noConflict();

Reassign to a different name:

    var Assert = $$.noConflict();

    // EXAMPLE: Now you can use your own name when asserting:
    Assert(3).shouldByType('number');


`$$.extend(name, message, expression)`

Extend jShould with custom assertions.

name is the method name placed on jShould when extending
message is shown in the QUnit test results after the test has executed
expression is a function which gets passed one argument: the value being asserted.

    // EXAMPLE:
    $$.extend('shouldBeValidUsername', 'The username should have been valid.', function (value) {
        return value != null && value.indexOf('&lt;') === -1;
    });

    $$('john_doe').shouldBeValidUsername();


__API__

`.shouldEqual(value)`

Assertion passes if the assertion context is equal to the value argument.
Equivalent to QUnit's deepEqual.

    // EXAMPLE
    var car = { color: 'green' };
    $$(car).shouldEqual({ color: 'green' });


`.shouldNotEqual(value)`

Assertion passes if the assertion context is not equal to the value argument.
Equivalent to QUnit's notDeepEqual.

    // EXAMPLE
    var car = { color: 'green' };
    $$(car).shouldNotEqual({ color: 'red' });


`.shouldBeType(type)`

Assertion passes if the assertion context's type is equal to the value argument's type.
These are the same types as those returned from JavaScript's typeof operator.

    // EXAMPLE
    var car = { color: 'green' };
    $$(car).shouldBeType('object');


`.shouldNotBeType(type)`

Assertion passes if the assertion context's type is not equal to the value argument's type.
These are the same types as those returned from JavaScript's typeof operator.

    // EXAMPLE
    var car = { color: 'green' };
    $$(car).shouldNotBeType('string');


`.shouldContain(value)`

Assertion passes if the assertion context contains the value argument. If the context is a string,
the string is searched for the value. If the context is an array, the array is searched for the value.
If the context is an object, the object's keys are searched for any matches against the value.

    // EXAMPLE
    $$('my name is').shouldContain('name');
    $$([0, 10, 20]).shouldContain(10);
    $$({ color: 'green' }).shouldContain('color');


`.shouldNotContain(value)`

Assertion passes if the assertion context does not contains the value argument. If the context
is a string, the string is searched for the value. If the context is an array, the array is searched
for the value. If the context is an object, the object's keys are searched for any matches against
the value.

    // EXAMPLE
    $$('john_doe').shouldNotContain('; DROP');
    $$([0, 10, 20]).shouldNotContain(30);
    $$({ color: 'green' }).shouldNotContain('make');


`.shouldBeNull()`

Assertion passes if the assertion context is null.

    // EXAMPLE
    var username = null;
    $$(username).shouldBeNull();


`.shouldNotBeNull()`

Assertion passes if the assertion context is not null.

    // EXAMPLE
    var username = 'john_doe';
    $$(username).shouldNotBeNull();


`.shouldBeEmpty()`

Assertion passes if the assertion context is an empty string or array (length 0) or an empty
object ({}).

    // EXAMPLE
    $$('').shouldBeEmpty();
    $$([]).shouldBeEmpty();
    $$({}).shouldBeEmpty();


`.shouldNotBeEmpty()`

Assertion passes if the assertion context is not an empty string or array (length greater than 0)
nor an empty object ({}).

    // EXAMPLE
    $$('john_doe').shouldNotBeEmpty();
    $$([10, 20, 30]).shouldNotBeEmpty();
    $$({ color: 'green' }).shouldNotBeEmpty();


`.shouldBeUndefined()`

Assertion passes if the assertion context is undefined.

    // EXAMPLE
    var username;
    $$(username).shouldBeUndefined();


`.shouldBeDefined()`

Assertion passes if the assertion context is defined (not undefined).

    // EXAMPLE
    var username = 'john_doe';
    $$(username).shouldBeDefined();


`.shouldBeTrue()`

Assertion passes if the assertion context evaluates to true (truthy evaluation).

    // EXAMPLE
    $$(10 &lt; 100).shouldBeTrue();
    $$(!!1).shouldBeTrue();


`.shouldBeFalse()`

Assertion passes if the assertion context evaluates to false (falsy evaluation).

    // EXAMPLE
    $$(10 &gt; 100).shouldBeFalse();
    $$(!!window.myProp).shouldBeFalse();


`.shouldBeLessThan(value)`

Assertion passes if the assertion context is less than the value argument.

    // EXAMPLE
    $$(10).shouldBeLessThan(100);


`.shouldBeMoreThan(num)`

Assertion passes if the assertion context is greater than the num argument.

    // EXAMPLE
    $$(100).shouldBeMoreThan(10);


`.shouldBeLessThan(num)`

Assertion passes if the assertion context is less than the num argument.

    // EXAMPLE
    $$(10).shouldBeLessThan(100);


`.shouldThrowException()`

Assertion passes if the assertion context is a function that throws an error.
Equivalent to QUnit's raises.

    // EXAMPLE
    var errorFunc = function() {
        throw new Error('Oh crap.');
    };

    $$(errorFunc).shouldThrowException();
