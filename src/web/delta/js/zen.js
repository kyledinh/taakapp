// ZEN.JS
(function () {
    "use strict";

    var zen = {};

    function slice(obj) {
        return Array.prototype.slice.apply(obj, Array.prototype.slice.call(arguments, 1));
    }

    zen.extend = function (target) {
        slice(arguments, 1).forEach(function (source) {
            for (var prop in source) {
                target[prop] = source[prop];
            }
        });
        return target;
    };

    zen.isArrayLike = function (obj) {
        return obj &&
            typeof obj === 'object' &&
            isFinite(obj.length) &&
            obj.length >= 0 &&
            obj.length < 4294967296 &&
            obj.length === Math.floor(obj.length);
    };

    zen.classOf = function (obj) {
        return typeof obj === 'object' ?
            Object.prototype.toString(obj).slice(8, -1) : '';
    };

    /**
     * Make creates a new object with a specified prototype.  If additional
     * arguments are given, copy the enumerable properties from the arguments
     * to the new object.
     */
    zen.make = function (prototype) {
        var that = Object.create(prototype);
        for (var i = 1; i < arguments.length; i++) {
            zen.extend(that, arguments[i]);
        }
        return that;
    };

    /**
     * Creates a new function which when invoked will invoke the original
     * function passing in additional specified arguments.
     *
     * @example:
     *     function add(x,y) { return x+y }
     *
     *     var g = zen.partial(add, 2);
     *     g(1); //=> 3
     *     g(3); //=> 5
     */
    zen.partial = function (f) {
        var args = slice(arguments, 1);
        return function () {
            return f.apply(this, args.concat(slice(arguments)));
        };
    };

    /**
     * Creates a curried function.
     *
     * @example:
     *     var g = zen.curry(function(a,b,c) { return a+b+c });
     *     g(1)(2)(3); //=> 6
     *     g(1)(2,3); //=> 6
     */
    function curry(f, arity) {
        arity = arity || f.length;
        return function () {
            if (arguments.length < arity) {
                return curry(zen.partial.apply(this, [f].concat(slice(arguments))), arity - arguments.length);
            } else {
                return f.apply(this, arguments);
            }
        };
    }

    zen.curry = curry;

    /**
     * identity(x) //=> x
     */
    zen.identity = function (x) {
        return x;
    };

    /**
     * not(x) //=> !x
     */
    zen.not = function (x) {
        return !x;
    };

    /**
     * negate(x) => -x
     */
    zen.negate = function (x) {
        return -x;
    };

    /**
     * reiprocate(x) => 1/x
     */
    zen.reciprocate = function (x) {
        return 1 / x;
    };

    /**
     * add(a,b) => a + b
     */
    zen.add = curry(function (a, b) {
        return a + b;
    });

    /**
     * subtract(a,b) => a + b
     */
    zen.subtract = curry(function (a, b) {
        return a - b;
    });

    /**
     * multiply(a,b) => a * b
     */
    zen.multiply = curry(function (a, b) {
        return a * b;
    });

    /**
     * divide(a,b) => a + b
     */
    zen.divide = curry(function (a, b) {
        return a / b;
    });

    /**
     * mod(a,b) => a % b
     */
    zen.mod = curry(function (a, b) {
        return a % b;
    });

    /**
     * index(a,b) => a[b]
     */
    zen.index = curry(function (a, b) {
        return a[b];
    });

    /**
     * Converts an array of arrays to an array of their elements.
     *
     * @example
     *     flatten([ [1,2], [], [3] ])  // => [1,2,3]
     *     flatten([ [1], [[2]], [3] ]) // => [1, [2], 3]
     */
    zen.flatten = function (array) {
        var result = [], len = array.length, n = 0, i, j, a, l;
        for (i = 0; i < len; i += 1) {
            a = array[i];
            l = a.length;
            for (j = 0; j < l; j += 1) {
                result[n] = a[j];
                n += 1;
            }
        }
        return result;
    };

    zen.compose = function () {
        var fns = arguments;
        return function (x) {
            var value = x,
                n = fns.length;
            while (n--) {
                value = fns[n](value);
            }
            return value;
        };
    };

    zen.Apply = function (f) {
        return function (x) {
            return f.apply(null, x);
        };
    };

    /**
     *
     * @example:
     *     zen.dot("name")({ "name" : "Bob" }); //=> "Bob"
     */
    zen.dot = function (name) {
        return function (obj) {
            return obj[name];
        };
    };

    /**
     *
     * @example:
     *     var p = {name: "Bob", age: 29, gender: "M"};
     *     zen.pick("name", "age")(p); //=> ["Bob", 29]
     */
    zen.Pick = function () {
        var names = slice(arguments);
        return function (obj) {
            var a = [], len = names.length, i;
            for (i = 0; i < len; i += 1) {
                a[i] = obj[name];
            }
            return a;
        };
    };

    /**
     * @example:
     *     zen.invert(zen.eq(0))(1); //=> true
     */
    zen.invert = function (f) {
        return function (x) {
            return !f(x);
        };
    };

    zen.eq = function (c) {
        return function (x) {
            return x === c;
        };
    };

    zen.const = function (c) {
        return function (x) {
            return c;
        };
    };

    zen.inc = function (c) {
        return function (x) {
            return x + c;
        };
    };

    zen.scale = function (c) {
        return function (x) {
            return x * c;
        };
    };

    zen.step = function (c) {
        return function (x) {
            return x < c ? 0 : 1;
        };
    };

    zen.shift = function (c) {
        return function (f) {
            return function (x) {
                f(x + c);
            };
        };
    };

    zen.conjoin = function () {
        var fns = slice(arguments);
        return function (x) {
            var result = true, len = fns.length, i;
            for (i = 0; i < len && result; i += 1) {
                result = result && fns[i](x);
            }
            return result;
        };
    };

    zen.disjoin = function () {
        var fns = slice(arguments);
        return function (x) {
            var result = false, len = fns.length, i;
            for (i = 0; i < len && !result; i += 1) {
                result = result || fns[i](x);
            }
            return result;
        };
    };

    // LAMBDA FUNCTIONS
    var fncache = {};

    function parse(expr) {
        var body = expr, params = [], fragments, i, n, len, left, right, temp, vars, v;

        expr = expr.trim();

        fragments = expr.split(/\s*->\s*/m);
        if (fragments.length > 1) {
            n = fragments.length - 1;
            body = fragments[n];
            for (n -= 1; n > 0; n -= 1) {
                params = fragments[n].split(/\s*,\s*|\s+/m);
                body = '(function(' + params + '){return (' + body + ')})';
            }
            params = fragments[n].split(/\s*,\s*|\s+/m);
        } else if (expr.match(/\b_\b/)) {
            params = '_';
        } else if (expr === '-') {
            params = '_';
            body = '-_';
        } else {
            left = expr.match(/^(?:[+\-*\/%&|\^\.=<>]|!=)/m);
            right = expr.match(/[+\-*\/%&|\^\.=<>!]$/m);
            if (left) {
                params.push('$1');
                body = '$1' + body;
            }
            if (right) {
                params.push('$2');
                body = body + '$2';
            }
            if (!left && !right) {
                temp = expr.replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, '');
                vars = temp.match(/([a-z_$][a-z_$\d]*)/gi) || [];
                vars.sort();
                len = vars.length;
                for (i = 0; i < len; i += 1) {
                    v = vars[i];
                    if (params.length === 0 || params[params.length - 1] !== v) {
                        params.push(v);
                    }
                }
            }
        }
        return { "params": params, "body": body };
    }

    /**
     * Fn creates a function from the argument.
     * - If the argument is a Function, returns it.
     * - If the argument is a string, treats it a lambda expression.
     * - If the argument is a number or boolean, creates a constant function.
     *
     * Functions created from strings are cached.  Subsequent calls to fn
     * with the same string will return the same function.
     *
     * @example
     *     fn('x -> x+1')         //=> function(x) {return x+1}
     *     fn('x -> y -> x*y')
     *     //=> function(x) {return (function(y) {return x*y})}
     *     fn('x,y -> x*y')       //=> function(x,y) {return x*y}
     *     fn('x y -> x*y')       //=> x,y -> x*y
     *     fn('x,y,z -> (x+y)/z') //=> x,y,z -> (x+y)/z
     *     fn('x')                //=> x -> x
     *     fn('x+y')              //=> function(x,y) {return x+y}
     *     fn('y-x')              //=> x,y => y-x
     *     fn('_+1')              //=> x -> x + 1
     *     fn('*2')               //=> x -> x * 2
     *     fn('2*')               //=> x -> 2 * x
     *     fn('%2 === 0')         //=> x -> x % 2 === 0
     *     fn('/')                //=> x,y -> x / y
     *     fn('-')                //=> x -> -x
     *     fn(0)                  //=> function(x) { return 0 }
     *     fn(true)               //=> function(x) { return true }
     */

    function fn(arg) {
        var t = typeof arg, e, f;
        if (t === 'function') {
            f = arg;
        } else if (t === 'number' || t === 'boolean') {
            f = function (x) {
                return x;
            };
        } else if (t === 'string') {
            f = fncache[arg];
            if (typeof f !== 'function') {
                e = parse(arg);
                f = new Function(e.params, 'return ' + e.body);
                fncache[arg] = f;
            }
        }
        return f;
    }

    zen.fn = fn;
    zen.fn.parse = parse;

    // LIST
    var list_ = {};

    function wrap(array) {
        return Object.create(list_, { _array: { value: array } });
    }

    /**
     * Creates a list.
     *
     *    list()         //=> empty list
     *    list(1)        //=> 1
     *    list(1,2,3)    //=> 1,2,3
     *    list([1,2,3])  //=> 1,2,3
     *
     */
    function list() {
        var that;
        if (arguments.length !== 1) {
            that = Object.create(list_);
            that._array = slice(arguments);
        } else {
            var arg = arguments[0];
            if (zen.isArrayLike(arg)) {
                that = wrap(slice(arg));
            } else {
                that = Object.create(list_);
                that._array = [ arg ];
            }
        }
        return that;
    }

    /**
     * Size returns the number of elements in the list.
     */
    list_.size = function () {
        return this._array.length;
    };

    /**
     * Returns the smallest value in the list.
     */
    list_.min = function () {
        var out = this._array[0];
        this._array.forEach(function(x) { if (x < out) out = x; });
        return out;
    };

    /**
     * Returns the greatest value in the list.
     */
    list_.max = function () {
        var out = this._array[0];
        this._array.forEach(function(x) { if (x > out) out = x; });
        return out;
    };

    /**
     * Returns the lowest index where value is found or -1 if value is not in
     * the list.
     */
    list_.indexOf = function (value, from) {
        return this._array.indexOf(value, from);
    };

    /**
     * Returns the highest index where value is found or -1 if value is not in
     * the list.
     */
    list_.lastIndexOf = function (value, from) {
        return this._array.indexOf(value, from);
    };

    /**
     * Map creates a new list by applying the argument function f to each
     * element of this list.
     *
     * @param f
     *
     * @example
     *    list(1,2,3).map(function(x) { return 2*x; }) //=> list(2,4,6)
     */
    list_.map = function (f) {
        return wrap(this._array.map(f));
    };

    /**
     * Map creates a new list with all elements of this._array for which
     * the filtering function returns true.
     *
     * @param f
     *
     * @example
     *    list(1,2,3).filter(function(x) { return x > 1; }) //=> list(2,3)
     */
    list_.filter = function (f) {
        return wrap(this._array.filter(f));
    };

    /**
     * Drop returns a copy of the list without the first n elements.
     *
     * @param n
     *
     * @example
     *    list(1,2,3,4,5).drop(3) //=> list(4,5)
     */
    list_.drop = function (n) {
        return wrap(this._array.slice(n));
    };

    /**
     * Take returns a list of the first n elements.
     *
     * @param n
     *
     * @example
     *    list(1,2,3,4,5).take(3) //=> list(1,2,3)
     *    list(1,2).take(4) //=> list(1,2)
     */
    list_.take = function (n) {
        return wrap(this._array.slice(0, n));
    };

    /**
     * Fold starts with an initial value of an accumulator and successively
     * combines it with elements of this list using a binary function.
     *
     * list(1,2,3).fold(0, f) //=> f(f(f(0, 1), 2), 3)
     *
     * @example
     *    list(1,2,3,4).fold(1, function(a,b) { return a*b; }) //=> 24
     */
    list_.fold = function (init, f) {
        return this._array.reduce(f, init);
    };

    /**
     * Head returns the first element of the list.
     *
     * @example
     *    list(1,2,3,4).head() //=> 1
     */
    list_.head = function () {
        return this._array[0];
    };

    /**
     * Get returns the nth element of the list.
     *
     * @param n
     *
     * @example
     *    list(1,2,3,4).get(0) //=> 1
     *    list(1,2,3,4).get(1) //=> 2
     */
    list_.get = function (n) {
        return this._array[n];
    };

    /**
     * Creates a reversed copy of this list.
     *
     * @example
     *    list(1,2,3,4).reverse() //=> list(4,3,2,1)
     */
    list_.reverse = function () {
        return wrap(this._array.reverse());
    };

    /**
     * ToArray returns a JavaScript array containing elements of this list.
     *
     * @param n
     *
     * @example
     *    list(1,2,3,4).toArray()  //=> [1,2,3,4]
     */
    list_.toArray = function () {
        return this._array.slice();
    };

    /**
     * Each invoke a function for each element of the list.
     *
     * @param f
     *
     * @example
     *    list(1,2,3,4).each(function(n) { console.log(n); })
     */
    list_.each = function (f) {
        this._array.forEach(f);
    };

    list_.toString = function () {
        return "list(" + this._array.join(", ") + ")";
    };

    // export list

    list.list_ = list_;
    zen.list = list;

    // LAZY FUNCTIONS
    var STOP = {},
        lazy_ = { isLazy: true },
        lazy_array_ = Object.create(lazy_),
        lazy_filter_ = Object.create(lazy_),
        lazy_map_ = Object.create(lazy_),
        lazy_drop_ = Object.create(lazy_),
        lazy_take_ = Object.create(lazy_),
        lazy_get_ = Object.create(lazy_),
        lazy_seq_ = Object.create(lazy_),
        lazy_iter_ = Object.create(lazy_),
        lazy_function_ = Object.create(lazy_),
        lazy_lines_ = Object.create(lazy_),
        lazy_tick_ = Object.create(lazy_);

    /**
     * Creates a lazy sequence.
     *
     *    lazy()         //=> empty sequence
     *    lazy(1)        //=> 1
     *    lazy(1,2,3)    //=> 1,2,3
     *    lazy([1,2,3])  //=> 1,2,3
     *
     * When the single argument is a generator function, creates a sequence
     * from repeated invocation of the function.  For example:
     *     var g = (function () {
     *         var a = 0, b = 1;
     *         return function() {
     *             var t = b;
     *             b = a + b;
     *             a = t;
     *             return a;
     *         }
     *     })();
     *     lazy(g)       //=> 1,1,2,3,5,8,...
     */
    function lazy() {
        var that;
        if (arguments.length !== 1) {
            that = fromArray(arguments);
        } else {
            var arg = arguments[0];
            if (arg.isLazy) {
                that = arg;
            } else if (arg.isList) {
                that = fromList(arg);
            } else if (typeof arg === 'function') {
                that = Object.create(lazy_function_);
                that.g = arg;
            } else if (zen.isLikeArray(arg)) {
                that = fromArray(arg);
            } else {
                that = Object.create(lazy_array_);
                that.array = [ arg ];
            }
        }
        return that;
    }

    lazy_.map = function (f) {
        var that = Object.create(lazy_map_);
        that.super = this;
        that.transform = f;
        return that;
    };

    lazy_.filter = function (f) {
        var that = Object.create(lazy_filter_);
        that.super = this;
        that.filterFn = f;
        return that;
    };

    lazy_.drop = function (n) {
        var that = Object.create(lazy_drop_);
        that.super = this;
        that.n = n;
        return that;
    };

    lazy_.take = function (n) {
        var that = Object.create(lazy_take_);
        that.super = this;
        that.n = n;
        return that;
    };

    lazy_.fold = function (init, f) {
        var out = init;
        this.each(function (x) {
            out = f(out, x);
        });
        return out;
    };

    lazy_.head = function () {
        var value;
        this.each(function (x) {
            value = x;
            return STOP;
        });
        return value;
    };

    lazy_.get = function (n) {
        var value;
        this.each(function (x) {
            if (n <= 0) {
                value = x;
                return STOP;
            } else {
                n -= 1;
            }
        });
        return value;
    };

    lazy_.toArray = function () {
        var a = [];
        this.each(function (e) {
            a.push(e);
        });
        return a;
    };

    // lazy_array_
    lazy_array_.each = function (f) {
        var array = this.array, len = this.array.length, i;
        for (i = 0; i < len; i += 1) {
            if (f(array[i], i) === STOP) {
                return;
            }
        }
    };

    lazy_array_.get = function (n) {
        return this.array[n];
    };

    lazy_function_.each = function(f) {
        var g = this.g;
        while (true) {
            if (f(g()) === STOP) {
                return STOP;
            }
        }
    };

    // lazy_map_
    lazy_map_.each = function (f) {
        var transform = this.transform;
        this.super.each(function (x) {
            return f(transform(x));
        });
    };

    // lazy_filter_
    lazy_filter_.each = function (f) {
        var filterFn = this.filterFn;
        this.super.each(function (x) {
            if (filterFn(x)) {
                return f(x);
            }
        });
    };

    // lazy_drop_
    lazy_drop_.each = function (f) {
        var n = this.n;
        this.super.each(function (x) {
            if (n > 0) {
                n -= 1;
            } else {
                return f(x);
            }
        });
    };

    // lazy_take_
    lazy_take_.each = function (f) {
        var n = this.n;
        this.super.each(function (x) {
            if (n <= 0) {
                return STOP;
            }
            n -= 1;
            return f(x);
        });
    };

    lazy_seq_.each = function (f) {
        var inc = this.step, value;
        for (value = this.seed; ; value += inc) {
            if (f(value) === STOP) {
                return STOP;
            }
        }
    };

    lazy_iter_.each = function (f) {
        var value = this.seed, next = this.step;
        while (true) {
            if (f(value) === STOP) {
                return STOP;
            }
            value = next(value);
        }
    };

    lazy_.lines = function () {
        var that = Object.create(lazy_lines_);
        that.super = this;
        return that;
    };

    // Make lines from stream of strings.
    lazy_lines_.each = function (f) {
        var strings = [];
        this.super.each(function (string) {
            while (true) {
                var n = string.indexOf('\n');
                if (n === -1) {
                    strings.push(string);
                    break;
                } else {
                    strings.push(string.substring(0, n));
                    var line = strings.join('');
                    strings = [];
                    string = string.substring(n);
                    if (f(line) === STOP) {
                        return STOP;
                    }
                }
            }
        });
    };

    var set_interval, clear_interval;
    if (typeof window === 'undefined') {
        if (typeof setInterval === 'function') {
            set_interval = setInterval;
        }
        if (typeof clearInterval === 'function') {
            clear_interval = clearInterval;
        }
    } else {
        set_interval = window.setInterval;
        clear_interval = window.clearInterval;
    }

    lazy_tick_.each = function (f) {
        var g = this.gen;
        var interval_id = set_interval(function() {
            if (f(g()) === STOP) {
                clear_interval(interval_id);
                return STOP;
            }
        }, this.msecs);
    };

    /**
     * Creates a sequence beginning with a seed and subsequent values computed
     * by applying a step function to the previous value. If step is a number,
     * the next number is the step added to the previous one.  If the step is
     * not specified a default value of 1 is used.
     *
     * @example
     *     from(1, function(x) { return 2*x });  // => 1,2,4,8,16, ...
     *     from(100, -2);      // => 100,98,96,94,...
     *     from();             // => 0,1,2,3,4,...
     *
     * @param {number} seed=0
     * @param {number|function} step=1
     */
    function from(seed, step) {
        var that = Object.create(
            typeof step === 'function' ? lazy_iter_ : lazy_seq_
        );
        that.seed = seed || 0;
        that.step = step || 1;
        return that;
    }

    /**
     * Creates a lazy sequence from an array.
     */
    function fromArray(a) {
        var that = Object.create(lazy_array_);
        that._array = a;
        return that;
    }

    /**
     * Creates a lazy sequence from a list.
     */
    function fromList(l) {
        return lazy.fromArray(l.toArray());
    }

    /**
     * Creates a lazy sequence which yields a value periodically.
     *
     * @example:
     *     // prints a random number every second
     *     zen.tick(1000, Math.random).each(console.log);
     */
    function tick(msecs, g) {
        var that = Object.create(lazy_tick_);
        that.msecs = msecs;
        that.gen = g;
        return that;
    }

    /**
     * Makes a list lazy.
     */
    function listToLazy() {
        return fromList(this);
    }

    lazy.fromArray = fromArray;
    lazy.fromList = fromList;
    lazy.STOP = STOP;
    lazy.from = from;
    lazy.lazy_ = lazy_;
    zen.lazy = lazy;
    zen.tick = tick;
    zen.list.list_.lazy = listToLazy;

    // DOM FUNCTIONS

    var dom_ = Object.create(zen.lazy.lazy_),
        dom_node_ = Object.create(dom_),
        dom_seq_ = Object.create(dom_),
        dom_parent_ = Object.create(dom_),
        dom_children_ = Object.create(dom_),
        dom_id_ = Object.create(dom_),
        dom_tag_ = Object.create(dom_),
        dom_find_ = Object.create(dom_),
        dom_html_ = Object.create(dom_),
        dom_attr_ = Object.create(dom_),
        dom_addClass_ = Object.create(dom_),
        dom_removeClass_ = Object.create(dom_),
        dom_toggleClass_ = Object.create(dom_),
        dom_hide_ = Object.create(dom_),
        dom_show_ = Object.create(dom_),
        BREAK = lazy.BREAK,
        ROOT = Object.create(dom_);

    function dom() {
        var that, arg;

        if (arguments.length === 0) {
            that = ROOT;
        } else if (arguments.length === 1) {
            arg = arguments[0];
            if (typeof arg === 'string') {
                that = Object.create(dom_find_);
                that.super = ROOT;
                that.selector = arg;
            } else if (arg instanceof Node) {
                that = Object.create(dom_node_);
                that.node = arg;
            } else if (arg instanceof NodeList) {
                that = Object.create(dom_seq_);
                that.nodes = slice(arg);
            } else {
                throw "Bad argument to zen.dom().";
            }
        }
        return that;
    }

    dom.id = function (id) {
        var that = Object.create(dom_id_);
        that.super = ROOT;
        that.id = id;
        return that;
    };

    dom_.id = function (id) {
        var that = Object.create(dom_id_);
        that.super = this;
        that.id = id;
        return that;
    };

    dom_id_.each = function (f) {
        this.super.each(function (node) {
            if (f(node.getElementById(this.id)) === BREAK) {
                return BREAK;
            }
        });
    };

    dom.tag = function (name) {
        var that = Object.create(dom_tag_);
        that.super = ROOT;
        that.name = name;
        return that;
    };

    dom_.tag = function (name) {
        var that = Object.create(dom_tag_);
        that.super = this;
        that.name = name;
    };

    dom_tag_.each = function (f) {
        this.super.each(function (node) {
            var elems = node.getElementsByTagName(this.name);
            for (var i = 0; i < elems.length; i++) {
                if (f(elems[i]) === BREAK) {
                    return BREAK;
                }
            }
        });
    };

    ROOT.each = function (f) {
        f(document);
    };

    ROOT.get = ROOT.head = function () {
        return document;
    };

    dom_.children = function () {
        var that = Object.create(dom_children_);
        that.super = this;
        return that;
    };

    dom_children_.each = function (f) {
        this.super.each(function (node) {
            var children = node.children;
            for (var i = 0; i < children.length; i++) {
                if (f(children[i]) === BREAK) {
                    return BREAK;
                }
            }
        });
    };

    dom_.parent = function () {
        var that = Object.create(dom_parent_);
        that.super = this;
        return that;
    };

    dom_parent_.each = function (f) {
        this.super.each(function (node) {
            if (node.parentNode) {
                if (f(node.parentNode) === BREAK) {
                    return BREAK;
                }
            }
        });
    };

    dom_.find = function (selector) {
        var that = Object.create(dom_find_);
        that.super = this;
        that.selector = selector;
        return that;
    };

    dom_find_.each = function (f) {
        this.super.each(function (node) {
            var nodes = node.querySelectorAll(this.selector);
            for (var i = 0; i < nodes.length; i++) {
                node = nodes[i];
                if (f(node) === BREAK) {
                    return BREAK;
                }
            }
        });
    };

    dom_.html = function (markup) {
        var that = Object.create(dom_html_);
        that.super = this;
        that.markup = markup;
        return that;
    };

    dom_html_.each = function (f) {
        var markup = this.markup;
        this.super.each(function (node) {
            if (f(node) === BREAK) {
                return BREAK;
            }
            node.innerHTML = markup;
        });
    };

    dom_.attr = function (name, value) {
        var that = Object.create(dom_attr_);
        that.super = this;
        that.name = name;
        that.value = value;
        return that;
    };

    dom_attr_.each = function (f) {
        var name = this.name, value = this.value;
        this.super.each(function (node) {
            if (f(node) === BREAK) {
                return BREAK;
            }
            node.setAttribute(name, value);
        });
    };

    dom_.addClass = function (name) {
        var that = Object.create(dom_addClass_);
        that.super = this;
        that.name = name;
        return that;
    };

    dom_addClass_.each = function (f) {
        var name = this.name, value = this.value;
        var re = new RegExp('\\b' + name + '\\b');
        this.super.each(function (node) {
            if (f(node) === BREAK) {
                return BREAK;
            }
            var old = node.getAttribute('class');
            if (!old) {
                node.setAttribute('class', name);
            } else if (old.search(re) === -1) {
                node.setAttribute('class', old + ' ' + name);
            }
        });
    };

    dom_.removeClass = function (name) {
        var that = Object.create(dom_removeClass_);
        that.super = this;
        that.name = name;
        return that;
    };

    dom_removeClass_.each = function (f) {
        var name = this.name, value = this.value;
        var re = new RegExp('\\s*\\b' + name + '\\b\\s*', 'g');
        this.super.each(function (node) {
            if (f(node) === BREAK) {
                return BREAK;
            }
            var old = node.getAttribute('class');
            if (!old && old.search(re) !== -1) {
                node.setAttribute('class', old.replace(re, ''));
            }
        });
    };

    dom_.hide = function () {
        var that = Object.create(dom_hide_);
        that.super = this;
        return that;
    };

    dom_hide_.each = function (f) {
        this.super.each(function (node) {
            if (f(node) === BREAK) {
                return BREAK;
            }
            node.style.display = 'none';
        });
    };

    dom_.show = function (code) {
        var that = Object.create(dom_hide_);
        that.super = this;
        that.code = code;
        return that;
    };

    dom_show_.each = function (f) {
        var code = this.code || 'block';
        this.super.each(function (node) {
            if (f(node) === BREAK) {
                return BREAK;
            }
            node.style.display = code;
        });
    };

    zen.dom = dom;

    if (typeof exports === 'undefined') {
        this.zen = zen;
    } else {
        zen.extend(exports, zen);
    }

}).call(this);
