function log(arg) {
  document.writeln(arg);
}
function identity(x) {
  return x;
}
log(identity(3));

function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

function mul(a, b) {
  return a * b;
}

function identityf(x) {
  return function() {
    return x;
  };
}

function addf(x) {
  return function(y) {
    return x + y;
  };
}

function liftf(func) {
  return function(x) {
    return function(y) {
      return func(x, y);
    };
  };
}

function curry(func, x) {
  return function(y) {
    return func(x, y);
  };
}

var inc1 = addf(1);
var inc2 = liftf(add)(1);
var inc3 = curry(add, 1);

function twice(binaryFunc) {
  return function(x) {
    return binaryFunc(x, x);
  };
}

var doubl = twice(add);
var square = twice(mul);

function reverse(binaryFunc) {
  return function(x, y) {
    return binaryFunc(y, x);
  };
}

function composeu(unaryFunc1, unaryFunc2) {
  return function(x) {
    return unaryFunc2(unaryFunc1(x));
  };
}

/* Write a function composeb that takes two binary
 * functions and returns a function that calls them both.
 */
function composeb(binaryFunc1, binaryFunc2) {
  return function(x, y, z) {
    return binaryFunc2(binaryFunc1(x, y), z);
  };
}

function once(binary) {
  var flag = true;
  return function(a, b) {
    if (flag) {
      flag = false;
      return binary(a, b);
    }
    return undefined;
  };
}

function fromTo(first, last) {
  var index = first;
  return function() {
    var next = index;
    if ( index < last ) {
      index += 1;
      return next;
    }
    return undefined; //optional
  };
}

function element(ary, generator) {
  if ( generator === undefined ) {
    generator = fromTo(0, ary.length);
  }
  return function() {
    var index = generator();
    if ( index !== undefined ) {
      return ary[index];
    }
  };
}

function collect(generator, array) {
  return function() {
    var next = generator();
    if ( next !== undefined ) {
      array.push(next);
      return next;
    }
  };
}

function filter(generator, predicate) {
  return function() {
      var next = generator();
      if ( next !== undefined ) {
        if ( predicate(next) ) {
          return next;
        } else {
          return filter(generator, predicate)();
        }
      }
  };
}

/* Write a concat function that takes two generators
 * and produces a generator that combines the sequences.
 */
function concat(generator1, generator2) {
  return function() {
    var next = generator1();
    if ( next === undefined ) {
      next = generator2();
    }
    return next;
  };
}

/* Write a counter function that returns an object
 * containing two functions that implement an up/down
 * counter, hiding the counter.
 */
function counter(count) {
  return {
    next: function () {
      count += 1;
      return count;
    },
    prev: function () {
      count -= 1;
      return count;
    }
  };
}

/* Make a revocable function that takes a unary function,
 * and returns an object containing an invoke function
 * that can invoke the unary funcion, and a revoke function
 * that disables the invoke function.
 */
function revokable(unary) {
  return {
    invoke: function (x) { return unary(x); },
    revoke: function () { unary = function () {}; }
  };
}

/* Make a function gensymf that makes a function
 * that generates unique symbols.
 */
function gensymf(prefix) {
  var counter = 0;
  return function () {
    counter += 1;
    return "" + prefix + counter;
  };
}

/* Write a function gensymff that takes a unary function
 * and a seed and returns a gensymf.
 */
function gensymff(unary, seed) {
  return function (prefix) {
    var suffix = seed;
    return function () {
      suffix = unary(suffix);
      return "" + prefix + suffix;
    };
  };
}

/* Make a function fibonaccif that returns
 * a generator that will return the next fibonacci number.
 */
function fibonaccif(a, b) {
  var count = 0;
  return function () {
    if ( count === 0 ) {
      count += 1;
      return a;
    } else if ( count === 1 ) {
      count += 1;
      return b;
    }
    var next = a + b;
    a = b;
    b = next;
    return next;
  };
}

// Another way to do it...
function fibonaccif(a, b) {
  return function () {
    var next = a;
    a = b;
    b += next;
    return next;
  };
}

// Yet another way
function fibonaccif(a, b) {
  return concat(
      element([a, b]),
      function fibonacci () {
        var next = a + b;
        a = b;
        b = next;
        return next;
      }
  );
}

/* Write a function m that takes a value and an optional
 * source string and returns them in an object.
 * JSON.stringify(m(1)) // {"value": 1, "source": "1"}
 */
function m(value, source) {
  return {
    value: value,
    source: typeof source === 'string' ? source : String(value)
  };
}

/* Write a function addm that takes two m objects and
 * returns an m object.
 * JSON.stringify(addm(m(3), m(Math.PI, "pi"))) // "{"value":6.141...,"source":"(3+pi)"}"
 */
function addm(mObj1, mObj2) {
  return m(
    mObj1.value + mObj2.value,
    "(" + mObj1.source + "+" + mObj2.source + ")"
    );
}

/* Write a function liftm that takes a binary function and a
 * string and returns a function that acts on m objects.
 */
function liftm(binaryFunc, op) {
  return function (mObj1, mObj2) {
    return m(binaryFunc(mObj1.value, mObj2.value), "(" + mObj1.source + op + mObj2.source + ")");
  };
}

/* Modify liftm so that that functions it produces can accept
 * arguments that are either numbers or m objects.
 */
function liftm(binary, op) {
  return function(obj1, obj2) {
    obj1 = typeof(obj1) === 'number' ? m(obj1) : obj1;
    obj2 = typeof(obj2) === 'number' ? m(obj2) : obj2;
    return m(binary(obj1.value, obj2.value), "(" + obj1.source + op + obj2.source + ")");
  };
}

// Write a function exp that evaluates simple array expressions.
function exp(args) {
  return Array.isArray(args) ? value[0](value[1], value[2]) : value;
}

// Modify exp to evaluate nested array expressions.
function exp(value) {
  return Array.isArray(value) ? value[0](exp(value[1]), exp(value[2])) : value;
}

/* Write a function addg that adds from many invocations, until 
 * it sees an empty invocation.
 *
 * addg()             // undefined
 * addg(2)()          // 2
 * addg(2)(7)()       // 9
 * addg(3)(4)(0)()    // 7
 * addg(1)(2)(4)(8)() // 15
 */
function addg(x) {
  if ( x === undefined ) {
    return undefined;
  }
  var sum = x;
  return function recur(y) {
    if ( y === undefined ) {
      return sum;
    }
    sum += y;
    return recur;
  };
}

function liftg(fn) {
  return function (val) {
    if ( val === undefined ) return undefined;
    var result = val;
    return function name(val) {
      if ( val === undefined ) {
        return result;
      }
      result = fn(result, val);

      return name;
    };
  };
}

// Write a function arrayg that will build an array from many invocations
function arrayg(x) {
  if ( x === undefined ) {
    return [];
  }
  var array = [x];
  return function recur (y) {
    if ( y === undefined ) {
      return array;
    }
    array.push(y);
    return recur;
  };
}


function arrayg(first) {
  var array = [];
  function more(next) {
    if ( next === undefined ) {
      return array;
    }
    array.push(next);
    return more;
  }
  return more(first);
} 

/* Make a function continuize that takes a unary function,
 * and returns a function that takes a callback and an argument.
 */
function continuize(unary) {
  return function(callback, x) {
    return callback(unary(x));
  };
}

function constructor(init) {
  var that = other_constructor(init),
      member,
      method = function () {
        // init, member, method
      };
  that.method = method;
  return that;
}
