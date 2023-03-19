(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.multiline) { flags += 'm'; }
	if (options.caseInsensitive) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}

var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$Logic$App$Msg$GetContentSize = function (a) {
	return {$: 'GetContentSize', a: a};
};
var $author$project$Logic$App$Msg$GetGrid = function (a) {
	return {$: 'GetGrid', a: a};
};
var $author$project$Logic$App$Types$NoItem = {$: 'NoItem'};
var $author$project$Logic$App$Types$NoOverlay = {$: 'NoOverlay'};
var $author$project$Logic$App$Types$PatternPanel = {$: 'PatternPanel'};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		{
			castingContext: {heldItem: $author$project$Logic$App$Types$NoItem, heldItemContent: $elm$core$Maybe$Nothing, macros: $elm$core$Dict$empty, ravenmind: $elm$core$Maybe$Nothing},
			downloadSrc: '',
			grid: {
				drawing: {activePath: _List_Nil, drawingMode: false},
				drawnPoints: _List_Nil,
				height: 0,
				points: _List_Nil,
				width: 0
			},
			importQueue: _List_Nil,
			insertionPoint: 0,
			lastEvent: $elm$core$Maybe$Nothing,
			mousePos: _Utils_Tuple2(0.0, 0.0),
			patternArray: $elm$core$Array$empty,
			settings: {gridScale: 1.0},
			stack: $elm$core$Array$empty,
			time: 0,
			timeline: $elm$core$Array$empty,
			timelineIndex: 0,
			ui: {
				dragging: _Utils_Tuple2(false, -1),
				importInput: '',
				mouseOverElementIndex: -1,
				openOverlay: $author$project$Logic$App$Types$NoOverlay,
				openPanels: _List_fromArray(
					[$author$project$Logic$App$Types$PatternPanel]),
				overDragHandle: false,
				patternElementMiddleLocations: _List_Nil,
				patternInputField: '',
				patternInputLocation: _Utils_Tuple2(0, 0),
				selectedInputID: '',
				suggestionIndex: 0
			},
			window: {height: 0.0, width: 0.0}
		},
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					A2(
					$elm$core$Task$attempt,
					$author$project$Logic$App$Msg$GetGrid,
					$elm$browser$Browser$Dom$getElement('hex_grid')),
					A2(
					$elm$core$Task$attempt,
					$author$project$Logic$App$Msg$GetContentSize,
					$elm$browser$Browser$Dom$getElement('content'))
				])));
};
var $author$project$Logic$App$Msg$HandleKeyboardEvent = function (a) {
	return {$: 'HandleKeyboardEvent', a: a};
};
var $author$project$Logic$App$Msg$RecieveGeneratedNumberLiteral = function (a) {
	return {$: 'RecieveGeneratedNumberLiteral', a: a};
};
var $author$project$Logic$App$Msg$RecieveGridDrawingAsGIF = function (a) {
	return {$: 'RecieveGridDrawingAsGIF', a: a};
};
var $author$project$Logic$App$Msg$RecieveGridDrawingAsImage = function (a) {
	return {$: 'RecieveGridDrawingAsImage', a: a};
};
var $author$project$Logic$App$Msg$RecieveInputBoundingBox = function (a) {
	return {$: 'RecieveInputBoundingBox', a: a};
};
var $author$project$Logic$App$Msg$RecieveInputBoundingBoxes = function (a) {
	return {$: 'RecieveInputBoundingBoxes', a: a};
};
var $author$project$Logic$App$Msg$RecieveMouseOverHandle = function (a) {
	return {$: 'RecieveMouseOverHandle', a: a};
};
var $author$project$Logic$App$Msg$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $author$project$Logic$App$Msg$WindowResize = {$: 'WindowResize'};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $Gizra$elm_keyboard_event$Keyboard$Event$KeyboardEvent = F7(
	function (altKey, ctrlKey, key, keyCode, metaKey, repeat, shiftKey) {
		return {altKey: altKey, ctrlKey: ctrlKey, key: key, keyCode: keyCode, metaKey: metaKey, repeat: repeat, shiftKey: shiftKey};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $elm$json$Json$Decode$string = _Json_decodeString;
var $Gizra$elm_keyboard_event$Keyboard$Event$decodeKey = $elm$json$Json$Decode$maybe(
	A2(
		$elm$json$Json$Decode$andThen,
		function (key) {
			return $elm$core$String$isEmpty(key) ? $elm$json$Json$Decode$fail('empty key') : $elm$json$Json$Decode$succeed(key);
		},
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string)));
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $Gizra$elm_keyboard_event$Keyboard$Event$decodeNonZero = A2(
	$elm$json$Json$Decode$andThen,
	function (code) {
		return (!code) ? $elm$json$Json$Decode$fail('code was zero') : $elm$json$Json$Decode$succeed(code);
	},
	$elm$json$Json$Decode$int);
var $Gizra$elm_keyboard_event$Keyboard$Event$decodeKeyCode = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2($elm$json$Json$Decode$field, 'keyCode', $Gizra$elm_keyboard_event$Keyboard$Event$decodeNonZero),
			A2($elm$json$Json$Decode$field, 'which', $Gizra$elm_keyboard_event$Keyboard$Event$decodeNonZero),
			A2($elm$json$Json$Decode$field, 'charCode', $Gizra$elm_keyboard_event$Keyboard$Event$decodeNonZero),
			$elm$json$Json$Decode$succeed(0)
		]));
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$A = {$: 'A'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Add = {$: 'Add'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Alt = {$: 'Alt'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Ambiguous = function (a) {
	return {$: 'Ambiguous', a: a};
};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$B = {$: 'B'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Backspace = {$: 'Backspace'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$C = {$: 'C'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$CapsLock = {$: 'CapsLock'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$ChromeSearch = {$: 'ChromeSearch'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Command = {$: 'Command'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Ctrl = function (a) {
	return {$: 'Ctrl', a: a};
};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$D = {$: 'D'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Decimal = {$: 'Decimal'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Delete = {$: 'Delete'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Divide = {$: 'Divide'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Down = {$: 'Down'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$E = {$: 'E'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Eight = {$: 'Eight'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$End = {$: 'End'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Enter = {$: 'Enter'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Escape = {$: 'Escape'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F = {$: 'F'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F1 = {$: 'F1'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F10 = {$: 'F10'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F11 = {$: 'F11'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F12 = {$: 'F12'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F2 = {$: 'F2'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F3 = {$: 'F3'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F4 = {$: 'F4'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F5 = {$: 'F5'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F6 = {$: 'F6'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F7 = {$: 'F7'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F8 = {$: 'F8'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F9 = {$: 'F9'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Five = {$: 'Five'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Four = {$: 'Four'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$G = {$: 'G'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$H = {$: 'H'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Home = {$: 'Home'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$I = {$: 'I'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Insert = {$: 'Insert'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$J = {$: 'J'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$K = {$: 'K'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$L = {$: 'L'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Left = {$: 'Left'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$M = {$: 'M'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Multiply = {$: 'Multiply'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$N = {$: 'N'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Nine = {$: 'Nine'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumLock = {$: 'NumLock'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadEight = {$: 'NumpadEight'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadFive = {$: 'NumpadFive'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadFour = {$: 'NumpadFour'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadNine = {$: 'NumpadNine'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadOne = {$: 'NumpadOne'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadSeven = {$: 'NumpadSeven'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadSix = {$: 'NumpadSix'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadThree = {$: 'NumpadThree'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadTwo = {$: 'NumpadTwo'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadZero = {$: 'NumpadZero'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$O = {$: 'O'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$One = {$: 'One'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$P = {$: 'P'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$PageDown = {$: 'PageDown'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$PageUp = {$: 'PageUp'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$PauseBreak = {$: 'PauseBreak'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$PrintScreen = {$: 'PrintScreen'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Q = {$: 'Q'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$R = {$: 'R'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Right = {$: 'Right'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$S = {$: 'S'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$ScrollLock = {$: 'ScrollLock'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Seven = {$: 'Seven'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Shift = function (a) {
	return {$: 'Shift', a: a};
};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Six = {$: 'Six'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Spacebar = {$: 'Spacebar'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Subtract = {$: 'Subtract'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$T = {$: 'T'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Tab = {$: 'Tab'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Three = {$: 'Three'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Two = {$: 'Two'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$U = {$: 'U'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Unknown = function (a) {
	return {$: 'Unknown', a: a};
};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Up = {$: 'Up'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$V = {$: 'V'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$W = {$: 'W'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Windows = {$: 'Windows'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$X = {$: 'X'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Y = {$: 'Y'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Z = {$: 'Z'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Zero = {$: 'Zero'};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$fromCode = function (keyCode) {
	switch (keyCode) {
		case 8:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Backspace;
		case 9:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Tab;
		case 13:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Enter;
		case 16:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Shift($elm$core$Maybe$Nothing);
		case 17:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Ctrl($elm$core$Maybe$Nothing);
		case 18:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Alt;
		case 19:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$PauseBreak;
		case 20:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$CapsLock;
		case 27:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Escape;
		case 32:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Spacebar;
		case 33:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$PageUp;
		case 34:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$PageDown;
		case 35:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$End;
		case 36:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Home;
		case 37:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Left;
		case 38:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Up;
		case 39:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Right;
		case 40:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Down;
		case 44:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$PrintScreen;
		case 45:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Insert;
		case 46:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Delete;
		case 48:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Zero;
		case 49:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$One;
		case 50:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Two;
		case 51:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Three;
		case 52:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Four;
		case 53:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Five;
		case 54:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Six;
		case 55:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Seven;
		case 56:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Eight;
		case 57:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Nine;
		case 65:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$A;
		case 66:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$B;
		case 67:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$C;
		case 68:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$D;
		case 69:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$E;
		case 70:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F;
		case 71:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$G;
		case 72:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$H;
		case 73:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$I;
		case 74:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$J;
		case 75:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$K;
		case 76:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$L;
		case 77:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$M;
		case 78:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$N;
		case 79:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$O;
		case 80:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$P;
		case 81:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Q;
		case 82:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$R;
		case 83:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$S;
		case 84:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$T;
		case 85:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$U;
		case 86:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$V;
		case 87:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$W;
		case 88:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$X;
		case 89:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Y;
		case 90:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Z;
		case 91:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Ambiguous(
				_List_fromArray(
					[$SwiftsNamesake$proper_keyboard$Keyboard$Key$Windows, $SwiftsNamesake$proper_keyboard$Keyboard$Key$Command, $SwiftsNamesake$proper_keyboard$Keyboard$Key$ChromeSearch]));
		case 96:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadZero;
		case 97:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadOne;
		case 98:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadTwo;
		case 99:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadThree;
		case 100:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadFour;
		case 101:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadFive;
		case 102:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadSix;
		case 103:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadSeven;
		case 104:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadEight;
		case 105:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadNine;
		case 106:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Multiply;
		case 107:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Add;
		case 109:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Subtract;
		case 110:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Decimal;
		case 111:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Divide;
		case 112:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F1;
		case 113:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F2;
		case 114:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F3;
		case 115:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F4;
		case 116:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F5;
		case 117:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F6;
		case 118:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F7;
		case 119:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F8;
		case 120:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F9;
		case 121:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F10;
		case 122:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F11;
		case 123:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$F12;
		case 144:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumLock;
		case 145:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$ScrollLock;
		default:
			return $SwiftsNamesake$proper_keyboard$Keyboard$Key$Unknown(keyCode);
	}
};
var $elm$json$Json$Decode$map7 = _Json_map7;
var $Gizra$elm_keyboard_event$Keyboard$Event$decodeKeyboardEvent = A8(
	$elm$json$Json$Decode$map7,
	$Gizra$elm_keyboard_event$Keyboard$Event$KeyboardEvent,
	A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
	$Gizra$elm_keyboard_event$Keyboard$Event$decodeKey,
	A2($elm$json$Json$Decode$map, $SwiftsNamesake$proper_keyboard$Keyboard$Key$fromCode, $Gizra$elm_keyboard_event$Keyboard$Event$decodeKeyCode),
	A2($elm$json$Json$Decode$field, 'metaKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'repeat', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 'Every', a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {processes: processes, taggers: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 'Nothing') {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.processes;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(_Utils_Tuple0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.taggers);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $author$project$Logic$App$Types$ElementLocation = F5(
	function (element, left, bottom, top, right) {
		return {bottom: bottom, element: element, left: left, right: right, top: top};
	});
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$Main$locationDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Logic$App$Types$ElementLocation,
	A2($elm$json$Json$Decode$field, 'element', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'left', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'bottom', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'top', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'right', $elm$json$Json$Decode$int));
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keydown');
var $elm$browser$Browser$Events$Window = {$: 'Window'};
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		$elm$browser$Browser$Events$Window,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Ports$GetElementBoundingBoxById$recieveBoundingBox = _Platform_incomingPort('recieveBoundingBox', $elm$json$Json$Decode$value);
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Ports$GetElementBoundingBoxById$recieveBoundingBoxes = _Platform_incomingPort(
	'recieveBoundingBoxes',
	$elm$json$Json$Decode$list($elm$json$Json$Decode$value));
var $author$project$Ports$CheckMouseOverDragHandle$recieveCheckMouseOverDragHandle = _Platform_incomingPort('recieveCheckMouseOverDragHandle', $elm$json$Json$Decode$bool);
var $author$project$Ports$GetGridDrawingAsGif$recieveGIF = _Platform_incomingPort('recieveGIF', $elm$json$Json$Decode$string);
var $author$project$Ports$GetGridDrawingAsImage$recieveImage = _Platform_incomingPort('recieveImage', $elm$json$Json$Decode$string);
var $author$project$Ports$HexNumGen$recieveNumber = _Platform_incomingPort('recieveNumber', $elm$json$Json$Decode$string);
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onResize(
				F2(
					function (_v0, _v1) {
						return $author$project$Logic$App$Msg$WindowResize;
					})),
				A2($elm$time$Time$every, 100, $author$project$Logic$App$Msg$Tick),
				$elm$browser$Browser$Events$onKeyDown(
				A2($elm$json$Json$Decode$map, $author$project$Logic$App$Msg$HandleKeyboardEvent, $Gizra$elm_keyboard_event$Keyboard$Event$decodeKeyboardEvent)),
				$author$project$Ports$HexNumGen$recieveNumber($author$project$Logic$App$Msg$RecieveGeneratedNumberLiteral),
				$author$project$Ports$GetElementBoundingBoxById$recieveBoundingBox(
				A2(
					$elm$core$Basics$composeR,
					$elm$json$Json$Decode$decodeValue($author$project$Main$locationDecoder),
					$author$project$Logic$App$Msg$RecieveInputBoundingBox)),
				$author$project$Ports$GetElementBoundingBoxById$recieveBoundingBoxes(
				A2(
					$elm$core$Basics$composeR,
					$elm$core$List$map(
						$elm$json$Json$Decode$decodeValue($author$project$Main$locationDecoder)),
					$author$project$Logic$App$Msg$RecieveInputBoundingBoxes)),
				$author$project$Ports$CheckMouseOverDragHandle$recieveCheckMouseOverDragHandle($author$project$Logic$App$Msg$RecieveMouseOverHandle),
				$author$project$Ports$GetGridDrawingAsGif$recieveGIF($author$project$Logic$App$Msg$RecieveGridDrawingAsGIF),
				$author$project$Ports$GetGridDrawingAsImage$recieveImage($author$project$Logic$App$Msg$RecieveGridDrawingAsImage)
			]));
};
var $author$project$Logic$App$Types$Artifact = {$: 'Artifact'};
var $author$project$Logic$App$Types$Cypher = {$: 'Cypher'};
var $author$project$Logic$App$Types$Focus = {$: 'Focus'};
var $author$project$Logic$App$Types$Pie = {$: 'Pie'};
var $author$project$Logic$App$Msg$SetTimelineIndex = function (a) {
	return {$: 'SetTimelineIndex', a: a};
};
var $author$project$Logic$App$Types$Spellbook = {$: 'Spellbook'};
var $author$project$Logic$App$Types$Trinket = {$: 'Trinket'};
var $author$project$Settings$Theme$accent2 = '#D8B8E0';
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$atan2 = _Basics_atan2;
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$pow = _Basics_pow;
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$Components$App$Grid$distanceBetweenCoordinates = F2(
	function (a, b) {
		var y2 = b.b;
		var y1 = a.b;
		var x2 = b.a;
		var x1 = a.a;
		return $elm$core$Basics$sqrt(
			A2($elm$core$Basics$pow, x1 - x2, 2) + A2($elm$core$Basics$pow, y1 - y2, 2));
	});
var $author$project$Components$App$Grid$emptyGridpoint = {color: '', connectedPoints: _List_Nil, offsetX: 0, offsetY: 0, radius: 0, used: false, x: 0, y: 0};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$sortWith = _List_sortWith;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Components$App$Grid$getClosestPoint = F3(
	function (coordinates, points, model) {
		var gridOffset = model.window.width - model.grid.width;
		var offsetCoords = _Utils_Tuple2(coordinates.a - gridOffset, coordinates.b);
		var distanceComparison = F2(
			function (a, b) {
				var _v0 = A2(
					$elm$core$Basics$compare,
					A2(
						$author$project$Components$App$Grid$distanceBetweenCoordinates,
						_Utils_Tuple2(a.x, a.y),
						offsetCoords),
					A2(
						$author$project$Components$App$Grid$distanceBetweenCoordinates,
						_Utils_Tuple2(b.x, b.y),
						offsetCoords));
				switch (_v0.$) {
					case 'LT':
						return $elm$core$Basics$LT;
					case 'EQ':
						return $elm$core$Basics$EQ;
					default:
						return $elm$core$Basics$GT;
				}
			});
		return A2(
			$elm$core$Maybe$withDefault,
			$author$project$Components$App$Grid$emptyGridpoint,
			$elm$core$List$head(
				A2(
					$elm$core$List$sortWith,
					distanceComparison,
					$elm$core$List$concat(points))));
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Basics$not = _Basics_not;
var $elm$core$Basics$sin = _Basics_sin;
var $author$project$Components$App$Grid$spacing = function (scale) {
	return 100 * scale;
};
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Components$App$Grid$addNearbyPoint = function (model) {
	var scale = model.settings.gridScale;
	var modelGrid = model.grid;
	var otherNodes = A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		$elm$core$List$tail(modelGrid.drawing.activePath));
	var prevPrevNode = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Components$App$Grid$emptyGridpoint,
		$elm$core$List$head(otherNodes));
	var prevGridNode = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Components$App$Grid$emptyGridpoint,
		$elm$core$List$head(modelGrid.drawing.activePath));
	var prevNode = A2(
		$elm$core$Maybe$withDefault,
		prevGridNode,
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (point) {
					return _Utils_eq(
						_Utils_Tuple2(point.x, point.y),
						_Utils_Tuple2(prevGridNode.x, prevGridNode.y));
				},
				otherNodes)));
	var gridOffset = model.window.width - model.grid.width;
	var offsetMousePos = _Utils_Tuple2(model.mousePos.a - gridOffset, model.mousePos.b);
	var trimmedMousePos = function () {
		var relativeMousePos = {x: offsetMousePos.a - prevNode.x, y: offsetMousePos.b - prevNode.y};
		var theta = A2($elm$core$Basics$atan2, relativeMousePos.y, relativeMousePos.x);
		var trimmedMagnitude = A2(
			$elm$core$Basics$min,
			$elm$core$Basics$sqrt(
				A2($elm$core$Basics$pow, relativeMousePos.x, 2) + A2($elm$core$Basics$pow, relativeMousePos.y, 2)),
			$author$project$Components$App$Grid$spacing(scale));
		var _v0 = model.mousePos;
		return _Utils_Tuple2(
			(trimmedMagnitude * $elm$core$Basics$cos(theta)) + prevNode.x,
			(trimmedMagnitude * $elm$core$Basics$sin(theta)) + prevNode.y);
	}();
	var closestGridNode = A3(
		$author$project$Components$App$Grid$getClosestPoint,
		_Utils_Tuple2(trimmedMousePos.a + gridOffset, trimmedMousePos.b),
		modelGrid.points,
		model);
	var closestPoint = A2(
		$elm$core$Maybe$withDefault,
		closestGridNode,
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (point) {
					return _Utils_eq(
						_Utils_Tuple2(point.x, point.y),
						_Utils_Tuple2(closestGridNode.x, closestGridNode.y));
				},
				modelGrid.drawing.activePath)));
	var mouseDistanceCloseToPoint = _Utils_cmp(
		A2(
			$author$project$Components$App$Grid$distanceBetweenCoordinates,
			trimmedMousePos,
			_Utils_Tuple2(closestPoint.x, closestPoint.y)),
		$author$project$Components$App$Grid$spacing(scale) / 2) < 1;
	var pointCloseToPrevPoint = _Utils_cmp(
		A2(
			$author$project$Components$App$Grid$distanceBetweenCoordinates,
			_Utils_Tuple2(prevNode.x, prevNode.y),
			_Utils_Tuple2(closestPoint.x, closestPoint.y)),
		$author$project$Components$App$Grid$spacing(scale) * 1.5) < 1;
	var pointNotConnectedToPrevPoint = !(A2(
		$elm$core$List$any,
		function (x) {
			return x;
		},
		A2(
			$elm$core$List$map,
			function (pnt) {
				return _Utils_eq(
					_Utils_Tuple2(pnt.offsetX, pnt.offsetY),
					_Utils_Tuple2(closestPoint.offsetX, closestPoint.offsetY));
			},
			prevNode.connectedPoints)) || A2(
		$elm$core$List$any,
		function (x) {
			return x;
		},
		A2(
			$elm$core$List$map,
			function (pnt) {
				return _Utils_eq(
					_Utils_Tuple2(pnt.offsetX, pnt.offsetY),
					_Utils_Tuple2(prevNode.offsetX, prevNode.offsetY));
			},
			closestPoint.connectedPoints)));
	var pointNotPrevPoint = !_Utils_eq(
		_Utils_Tuple2(prevNode.x, prevNode.y),
		_Utils_Tuple2(closestPoint.x, closestPoint.y));
	var pointPrevPrevPoint = _Utils_eq(
		_Utils_Tuple2(prevPrevNode.x, prevPrevNode.y),
		_Utils_Tuple2(closestPoint.x, closestPoint.y));
	return pointPrevPrevPoint ? A2(
		$elm$core$List$cons,
		_Utils_update(
			prevPrevNode,
			{
				connectedPoints: A2(
					$elm$core$List$filter,
					function (pnt) {
						return !_Utils_eq(
							_Utils_Tuple2(pnt.offsetX, pnt.offsetY),
							_Utils_Tuple2(prevNode.offsetX, prevNode.offsetY));
					},
					prevPrevNode.connectedPoints)
			}),
		A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$tail(otherNodes))) : ((mouseDistanceCloseToPoint && (pointCloseToPrevPoint && (pointNotConnectedToPrevPoint && (pointNotPrevPoint && (!closestPoint.used))))) ? _Utils_ap(
		_List_fromArray(
			[
				closestPoint,
				_Utils_update(
				prevNode,
				{
					connectedPoints: A2(
						$elm$core$List$cons,
						{
							betweenOffsetValues: _Utils_Tuple3(
								_Utils_Tuple2(0, 0),
								_Utils_Tuple2(0, 0),
								_Utils_Tuple2(0, 0)),
							color: $author$project$Settings$Theme$accent2,
							offsetX: closestPoint.offsetX,
							offsetY: closestPoint.offsetY
						},
						prevNode.connectedPoints)
				})
			]),
		otherNodes) : modelGrid.drawing.activePath);
};
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		nodeList: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		nodeListSize: (len / $elm$core$Array$branchFactor) | 0,
		tail: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $elm_community$array_extra$Array$Extra$insertAt = F2(
	function (index, val) {
		return function (array) {
			var arrayLength = $elm$core$Array$length(array);
			if ((index >= 0) && (_Utils_cmp(index, arrayLength) < 1)) {
				var before = A3($elm$core$Array$slice, 0, index, array);
				var after = A3($elm$core$Array$slice, index, arrayLength, array);
				return A2(
					$elm$core$Array$append,
					A2($elm$core$Array$push, val, before),
					after);
			} else {
				return array;
			}
		};
	});
var $author$project$Logic$App$PatternList$PatternArray$updateDrawingColors = function (patternTuple) {
	return _Utils_Tuple2(
		patternTuple.a,
		A2(
			$elm$core$List$map,
			function (pnt) {
				return _Utils_update(
					pnt,
					{
						connectedPoints: A2(
							$elm$core$List$map,
							function (conPnt) {
								return _Utils_update(
									conPnt,
									{
										color: (!patternTuple.a.active) ? 'grey' : patternTuple.a.color
									});
							},
							pnt.connectedPoints)
					});
			},
			patternTuple.b));
};
var $author$project$Logic$App$PatternList$PatternArray$addToPatternArray = F3(
	function (model, pattern, index) {
		var patternArray = model.patternArray;
		var drawing = model.grid.drawing;
		var patternDrawingPair = _Utils_Tuple2(pattern, drawing.activePath);
		return A3(
			$elm_community$array_extra$Array$Extra$insertAt,
			index,
			$author$project$Logic$App$PatternList$PatternArray$updateDrawingColors(patternDrawingPair),
			patternArray);
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Settings$Theme$accent1 = '#BAC5E2';
var $author$project$Settings$Theme$accent4 = '#dd6666';
var $author$project$Settings$Theme$accent5 = '#E0E3B8';
var $author$project$Logic$App$PatternList$PatternArray$applyColorToPatternFromResult = F2(
	function (pattern, result) {
		switch (result.$) {
			case 'Succeeded':
				return _Utils_update(
					pattern,
					{color: $author$project$Settings$Theme$accent1});
			case 'Failed':
				return _Utils_update(
					pattern,
					{color: $author$project$Settings$Theme$accent4});
			default:
				return _Utils_update(
					pattern,
					{color: $author$project$Settings$Theme$accent5});
		}
	});
var $author$project$Logic$App$Types$PatternIota = F2(
	function (a, b) {
		return {$: 'PatternIota', a: a, b: b};
	});
var $author$project$Logic$App$Types$CatastrophicFailure = {$: 'CatastrophicFailure'};
var $author$project$Logic$App$Types$Considered = {$: 'Considered'};
var $author$project$Logic$App$Types$Failed = {$: 'Failed'};
var $author$project$Logic$App$Types$Garbage = function (a) {
	return {$: 'Garbage', a: a};
};
var $author$project$Logic$App$Types$IncorrectIota = {$: 'IncorrectIota'};
var $author$project$Logic$App$Types$IotaList = function (a) {
	return {$: 'IotaList', a: a};
};
var $author$project$Logic$App$Types$NotEnoughIotas = {$: 'NotEnoughIotas'};
var $author$project$Logic$App$Types$Null = {$: 'Null'};
var $author$project$Logic$App$Types$NullType = {$: 'NullType'};
var $author$project$Logic$App$Types$OpenParenthesis = function (a) {
	return {$: 'OpenParenthesis', a: a};
};
var $author$project$Logic$App$Types$Succeeded = {$: 'Succeeded'};
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (_v0.$ === 'SubTree') {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $author$project$Logic$App$Utils$Utils$unshift = F2(
	function (item, array) {
		return A2(
			$elm$core$Array$append,
			$elm$core$Array$fromList(
				_List_fromArray(
					[item])),
			array);
	});
var $author$project$Logic$App$Stack$EvalStack$addEscapedIotaToStack = F2(
	function (stack, iota) {
		var _v0 = A2($elm$core$Array$get, 0, stack);
		if ((_v0.$ === 'Just') && (_v0.a.$ === 'OpenParenthesis')) {
			var list = _v0.a.a;
			return A3(
				$elm$core$Array$set,
				0,
				$author$project$Logic$App$Types$OpenParenthesis(
					A2($elm$core$Array$push, iota, list)),
				stack);
		} else {
			return A2($author$project$Logic$App$Utils$Utils$unshift, iota, stack);
		}
	});
var $elm$core$Array$filter = F2(
	function (isGood, array) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$Array$foldr,
				F2(
					function (x, xs) {
						return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
					}),
				_List_Nil,
				array));
	});
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$getIotaList = function (iota) {
	if (iota.$ === 'IotaList') {
		return $elm$core$Maybe$Just(iota);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Patterns$OperatorUtils$getPatternOrIotaList = function (iota) {
	switch (iota.$) {
		case 'PatternIota':
			return $elm$core$Maybe$Just(iota);
		case 'IotaList':
			return $elm$core$Maybe$Just(iota);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Utils$Utils$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Logic$App$Patterns$OperatorUtils$mapNothingToMissingIota = function (maybeIota) {
	if (maybeIota.$ === 'Nothing') {
		return $author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas);
	} else {
		var iota = maybeIota.a;
		return iota;
	}
};
var $author$project$Logic$App$Patterns$OperatorUtils$moveNothingsToFront = function (list) {
	var comparison = F2(
		function (a, b) {
			var checkNothing = function (x) {
				if (x.$ === 'Nothing') {
					return 1;
				} else {
					return 2;
				}
			};
			var _v0 = A2(
				$elm$core$Basics$compare,
				checkNothing(a),
				checkNothing(b));
			switch (_v0.$) {
				case 'LT':
					return $elm$core$Basics$LT;
				case 'EQ':
					return $elm$core$Basics$EQ;
				default:
					return $elm$core$Basics$GT;
			}
		});
	return A2($elm$core$List$sortWith, comparison, list);
};
var $elm_community$array_extra$Array$Extra$reverseToList = A2($elm$core$Array$foldl, $elm$core$List$cons, _List_Nil);
var $elm_community$array_extra$Array$Extra$reverse = A2($elm$core$Basics$composeR, $elm_community$array_extra$Array$Extra$reverseToList, $elm$core$Array$fromList);
var $author$project$Logic$App$Stack$EvalStack$applyPatternToStack = F4(
	function (stack, ctx, pattern, index) {
		var _v11 = A2($elm$core$Array$get, 0, stack);
		if ((_v11.$ === 'Just') && (_v11.a.$ === 'OpenParenthesis')) {
			var list = _v11.a.a;
			var numberOfOpenParen = 1 + $elm$core$Array$length(
				A2(
					$elm$core$Array$filter,
					function (iota) {
						if ((iota.$ === 'PatternIota') && (!iota.b)) {
							var pat = iota.a;
							return pat.internalName === 'open_paren';
						} else {
							return false;
						}
					},
					list));
			var numberOfCloseParen = $elm$core$Array$length(
				A2(
					$elm$core$Array$filter,
					function (iota) {
						if ((iota.$ === 'PatternIota') && (!iota.b)) {
							var pat = iota.a;
							return pat.internalName === 'close_paren';
						} else {
							return false;
						}
					},
					list));
			var addToIntroList = A3(
				$elm$core$Array$set,
				0,
				$author$project$Logic$App$Types$OpenParenthesis(
					A2(
						$elm$core$Array$push,
						A2($author$project$Logic$App$Types$PatternIota, pattern, false),
						list)),
				stack);
			if (pattern.internalName === 'escape') {
				return {
					considerNext: true,
					ctx: ctx,
					result: $author$project$Logic$App$Types$Succeeded,
					stack: stack,
					timeline: $elm$core$Array$fromList(
						_List_fromArray(
							[
								{patternIndex: index, stack: stack}
							]))
				};
			} else {
				if (pattern.internalName === 'close_paren') {
					if ((pattern.internalName === 'close_paren') && (_Utils_cmp(numberOfCloseParen + 1, numberOfOpenParen) > -1)) {
						var newStack = A2(
							$elm$core$Array$map,
							function (iota) {
								if (iota.$ === 'OpenParenthesis') {
									var l = iota.a;
									return $author$project$Logic$App$Types$IotaList(l);
								} else {
									var otherIota = iota;
									return otherIota;
								}
							},
							stack);
						return {
							considerNext: false,
							ctx: ctx,
							result: $author$project$Logic$App$Types$Succeeded,
							stack: newStack,
							timeline: $elm$core$Array$fromList(
								_List_fromArray(
									[
										{patternIndex: index, stack: newStack}
									]))
						};
					} else {
						return {
							considerNext: false,
							ctx: ctx,
							result: $author$project$Logic$App$Types$Considered,
							stack: addToIntroList,
							timeline: $elm$core$Array$fromList(
								_List_fromArray(
									[
										{patternIndex: index, stack: addToIntroList}
									]))
						};
					}
				} else {
					var _v13 = A2($elm$core$Dict$get, pattern.signature, ctx.macros);
					if ((_v13.$ === 'Just') && (_v13.a.c.$ === 'IotaList')) {
						var _v14 = _v13.a;
						var iotaList = _v14.c.a;
						var newStack = A3(
							$elm$core$Array$set,
							0,
							$author$project$Logic$App$Types$OpenParenthesis(
								A2($elm$core$Array$append, list, iotaList)),
							stack);
						return {
							considerNext: false,
							ctx: ctx,
							result: $author$project$Logic$App$Types$Considered,
							stack: newStack,
							timeline: $elm$core$Array$fromList(
								_List_fromArray(
									[
										{patternIndex: index, stack: newStack}
									]))
						};
					} else {
						return {
							considerNext: false,
							ctx: ctx,
							result: $author$project$Logic$App$Types$Considered,
							stack: addToIntroList,
							timeline: $elm$core$Array$fromList(
								_List_fromArray(
									[
										{patternIndex: index, stack: addToIntroList}
									]))
						};
					}
				}
			}
		} else {
			if (pattern.internalName === 'escape') {
				return {
					considerNext: true,
					ctx: ctx,
					result: $author$project$Logic$App$Types$Succeeded,
					stack: stack,
					timeline: $elm$core$Array$fromList(
						_List_fromArray(
							[
								{patternIndex: index, stack: stack}
							]))
				};
			} else {
				if (pattern.internalName === 'close_paren') {
					return {
						considerNext: false,
						ctx: ctx,
						result: $author$project$Logic$App$Types$Failed,
						stack: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							A2($author$project$Logic$App$Types$PatternIota, pattern, false),
							stack),
						timeline: $elm$core$Array$fromList(
							_List_fromArray(
								[
									{patternIndex: index, stack: stack}
								]))
					};
				} else {
					if (pattern.internalName === 'eval') {
						var actionResult = A2($author$project$Logic$App$Stack$EvalStack$eval, stack, ctx);
						return actionResult.success ? {
							considerNext: false,
							ctx: actionResult.ctx,
							result: $author$project$Logic$App$Types$Succeeded,
							stack: actionResult.stack,
							timeline: A2(
								$elm$core$Array$map,
								function (x) {
									return {patternIndex: index, stack: x};
								},
								actionResult.allStackStates)
						} : {
							considerNext: false,
							ctx: actionResult.ctx,
							result: $author$project$Logic$App$Types$Failed,
							stack: actionResult.stack,
							timeline: A2(
								$elm$core$Array$map,
								function (x) {
									return {patternIndex: index, stack: x};
								},
								actionResult.allStackStates)
						};
					} else {
						if (pattern.internalName === 'for_each') {
							var actionResult = A2($author$project$Logic$App$Stack$EvalStack$forEach, stack, ctx);
							return actionResult.success ? {
								considerNext: false,
								ctx: actionResult.ctx,
								result: $author$project$Logic$App$Types$Succeeded,
								stack: actionResult.stack,
								timeline: A2(
									$elm$core$Array$map,
									function (x) {
										return {patternIndex: index, stack: x};
									},
									actionResult.allStackStates)
							} : {
								considerNext: false,
								ctx: actionResult.ctx,
								result: $author$project$Logic$App$Types$Failed,
								stack: actionResult.stack,
								timeline: A2(
									$elm$core$Array$map,
									function (x) {
										return {patternIndex: index, stack: x};
									},
									actionResult.allStackStates)
							};
						} else {
							var _v17 = A2($elm$core$Dict$get, pattern.signature, ctx.macros);
							if (_v17.$ === 'Just') {
								var _v18 = _v17.a;
								var iota = _v18.c;
								var actionResult = A2(
									$author$project$Logic$App$Stack$EvalStack$eval,
									A2($author$project$Logic$App$Utils$Utils$unshift, iota, stack),
									ctx);
								return actionResult.success ? {
									considerNext: false,
									ctx: actionResult.ctx,
									result: $author$project$Logic$App$Types$Succeeded,
									stack: actionResult.stack,
									timeline: A2(
										$elm$core$Array$map,
										function (x) {
											return {patternIndex: index, stack: x};
										},
										actionResult.allStackStates)
								} : {
									considerNext: false,
									ctx: actionResult.ctx,
									result: $author$project$Logic$App$Types$Failed,
									stack: actionResult.stack,
									timeline: A2(
										$elm$core$Array$map,
										function (x) {
											return {patternIndex: index, stack: x};
										},
										actionResult.allStackStates)
								};
							} else {
								var actionResult = function () {
									var preActionResult = A2(pattern.action, stack, ctx);
									return (preActionResult.success && $author$project$Logic$App$Utils$Utils$isJust(pattern.selectedOutput)) ? _Utils_update(
										preActionResult,
										{
											stack: A2(
												$author$project$Logic$App$Utils$Utils$unshift,
												A2(
													$elm$core$Maybe$withDefault,
													_Utils_Tuple2($author$project$Logic$App$Types$NullType, $author$project$Logic$App$Types$Null),
													pattern.selectedOutput).b,
												preActionResult.stack)
										}) : preActionResult;
								}();
								return actionResult.success ? {
									considerNext: false,
									ctx: actionResult.ctx,
									result: $author$project$Logic$App$Types$Succeeded,
									stack: actionResult.stack,
									timeline: $elm$core$Array$fromList(
										_List_fromArray(
											[
												{patternIndex: index, stack: actionResult.stack}
											]))
								} : {
									considerNext: false,
									ctx: actionResult.ctx,
									result: $author$project$Logic$App$Types$Failed,
									stack: actionResult.stack,
									timeline: $elm$core$Array$fromList(
										_List_fromArray(
											[
												{patternIndex: index, stack: actionResult.stack}
											]))
								};
							}
						}
					}
				}
			}
		}
	});
var $author$project$Logic$App$Stack$EvalStack$applyToStackLoop = F7(
	function (stackResultTuple, ctx, patterns, currentIndex, timeline, considerThis, stopAtErrorOrHalt) {
		applyToStackLoop:
		while (true) {
			var stack = stackResultTuple.a;
			var resultArray = stackResultTuple.b;
			var introspection = function () {
				var _v10 = A2($elm$core$Array$get, 0, stack);
				if ((_v10.$ === 'Just') && (_v10.a.$ === 'OpenParenthesis')) {
					return true;
				} else {
					return false;
				}
			}();
			var _v8 = $elm$core$List$head(patterns);
			if (_v8.$ === 'Nothing') {
				return {ctx: ctx, error: false, halted: false, resultArray: resultArray, stack: stack, timeline: timeline};
			} else {
				if (_v8.a.$ === 'PatternIota') {
					var _v9 = _v8.a;
					var pattern = _v9.a;
					if (considerThis) {
						var applyResult = _Utils_Tuple2(
							A2(
								$author$project$Logic$App$Stack$EvalStack$addEscapedIotaToStack,
								stack,
								A2($author$project$Logic$App$Types$PatternIota, pattern, true)),
							A2($author$project$Logic$App$Utils$Utils$unshift, $author$project$Logic$App$Types$Considered, resultArray));
						var $temp$stackResultTuple = applyResult,
							$temp$ctx = ctx,
							$temp$patterns = A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							$elm$core$List$tail(patterns)),
							$temp$currentIndex = currentIndex + 1,
							$temp$timeline = A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							{patternIndex: currentIndex, stack: applyResult.a},
							timeline),
							$temp$considerThis = false,
							$temp$stopAtErrorOrHalt = stopAtErrorOrHalt;
						stackResultTuple = $temp$stackResultTuple;
						ctx = $temp$ctx;
						patterns = $temp$patterns;
						currentIndex = $temp$currentIndex;
						timeline = $temp$timeline;
						considerThis = $temp$considerThis;
						stopAtErrorOrHalt = $temp$stopAtErrorOrHalt;
						continue applyToStackLoop;
					} else {
						if ((pattern.internalName === 'halt') && stopAtErrorOrHalt) {
							return {ctx: ctx, error: false, halted: true, resultArray: resultArray, stack: stack, timeline: timeline};
						} else {
							var applyResult = A4($author$project$Logic$App$Stack$EvalStack$applyPatternToStack, stack, ctx, pattern, currentIndex);
							if ((!stopAtErrorOrHalt) || (stopAtErrorOrHalt && (!_Utils_eq(applyResult.result, $author$project$Logic$App$Types$Failed)))) {
								var $temp$stackResultTuple = _Utils_Tuple2(
									applyResult.stack,
									A2($author$project$Logic$App$Utils$Utils$unshift, applyResult.result, resultArray)),
									$temp$ctx = applyResult.ctx,
									$temp$patterns = A2(
									$elm$core$Maybe$withDefault,
									_List_Nil,
									$elm$core$List$tail(patterns)),
									$temp$currentIndex = currentIndex + 1,
									$temp$timeline = A2($elm$core$Array$append, applyResult.timeline, timeline),
									$temp$considerThis = applyResult.considerNext,
									$temp$stopAtErrorOrHalt = stopAtErrorOrHalt;
								stackResultTuple = $temp$stackResultTuple;
								ctx = $temp$ctx;
								patterns = $temp$patterns;
								currentIndex = $temp$currentIndex;
								timeline = $temp$timeline;
								considerThis = $temp$considerThis;
								stopAtErrorOrHalt = $temp$stopAtErrorOrHalt;
								continue applyToStackLoop;
							} else {
								return {
									ctx: applyResult.ctx,
									error: true,
									halted: false,
									resultArray: A2($author$project$Logic$App$Utils$Utils$unshift, applyResult.result, resultArray),
									stack: applyResult.stack,
									timeline: A2(
										$elm$core$Array$push,
										{patternIndex: currentIndex, stack: applyResult.stack},
										timeline)
								};
							}
						}
					}
				} else {
					var iota = _v8.a;
					if (considerThis || introspection) {
						var applyResult = _Utils_Tuple2(
							A2($author$project$Logic$App$Stack$EvalStack$addEscapedIotaToStack, stack, iota),
							A2($author$project$Logic$App$Utils$Utils$unshift, $author$project$Logic$App$Types$Considered, resultArray));
						var $temp$stackResultTuple = applyResult,
							$temp$ctx = ctx,
							$temp$patterns = A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							$elm$core$List$tail(patterns)),
							$temp$currentIndex = currentIndex + 1,
							$temp$timeline = A2(
							$elm$core$Array$push,
							{patternIndex: currentIndex, stack: applyResult.a},
							timeline),
							$temp$considerThis = false,
							$temp$stopAtErrorOrHalt = stopAtErrorOrHalt;
						stackResultTuple = $temp$stackResultTuple;
						ctx = $temp$ctx;
						patterns = $temp$patterns;
						currentIndex = $temp$currentIndex;
						timeline = $temp$timeline;
						considerThis = $temp$considerThis;
						stopAtErrorOrHalt = $temp$stopAtErrorOrHalt;
						continue applyToStackLoop;
					} else {
						return {ctx: ctx, error: true, halted: false, resultArray: resultArray, stack: stack, timeline: timeline};
					}
				}
			}
		}
	});
var $author$project$Logic$App$Stack$EvalStack$applyToStackStopAtErrorOrHalt = F3(
	function (stack, ctx, iotas) {
		return A7(
			$author$project$Logic$App$Stack$EvalStack$applyToStackLoop,
			_Utils_Tuple2(stack, $elm$core$Array$empty),
			ctx,
			$elm$core$Array$toList(iotas),
			0,
			$elm$core$Array$empty,
			false,
			true);
	});
var $author$project$Logic$App$Stack$EvalStack$eval = F2(
	function (stack, ctx) {
		var newStack = A3(
			$elm$core$Array$slice,
			1,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota = A2($elm$core$Array$get, 0, stack);
		if (maybeIota.$ === 'Nothing') {
			return {
				allStackStates: $elm$core$Array$fromList(
					_List_fromArray(
						[
							A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas),
							newStack)
						])),
				ctx: ctx,
				stack: A2(
					$author$project$Logic$App$Utils$Utils$unshift,
					$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas),
					newStack),
				success: false
			};
		} else {
			var iota = maybeIota.a;
			var _v5 = $author$project$Logic$App$Patterns$OperatorUtils$getPatternOrIotaList(iota);
			if (_v5.$ === 'Nothing') {
				return {
					allStackStates: $elm$core$Array$fromList(
						_List_fromArray(
							[
								A2(
								$author$project$Logic$App$Utils$Utils$unshift,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
								newStack)
							])),
					ctx: ctx,
					stack: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
						newStack),
					success: false
				};
			} else {
				switch (iota.$) {
					case 'IotaList':
						var list = iota.a;
						var applyResult = A3($author$project$Logic$App$Stack$EvalStack$applyToStackStopAtErrorOrHalt, newStack, ctx, list);
						return {
							allStackStates: A2(
								$elm$core$Array$map,
								function (x) {
									return x.stack;
								},
								applyResult.timeline),
							ctx: applyResult.ctx,
							stack: A2(
								$elm$core$Array$filter,
								function (i) {
									if (i.$ === 'OpenParenthesis') {
										return false;
									} else {
										return true;
									}
								},
								applyResult.stack),
							success: !applyResult.error
						};
					case 'PatternIota':
						var pattern = iota.a;
						var applyResult = A3(
							$author$project$Logic$App$Stack$EvalStack$applyToStackStopAtErrorOrHalt,
							newStack,
							ctx,
							$elm$core$Array$fromList(
								_List_fromArray(
									[
										A2($author$project$Logic$App$Types$PatternIota, pattern, false)
									])));
						return {
							allStackStates: A2(
								$elm$core$Array$map,
								function (x) {
									return x.stack;
								},
								applyResult.timeline),
							ctx: applyResult.ctx,
							stack: applyResult.stack,
							success: !applyResult.error
						};
					default:
						return {
							allStackStates: $elm$core$Array$fromList(
								_List_fromArray(
									[
										$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure)
											]))
									])),
							ctx: ctx,
							stack: $elm$core$Array$fromList(
								_List_fromArray(
									[
										$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure)
									])),
							success: false
						};
				}
			}
		}
	});
var $author$project$Logic$App$Stack$EvalStack$forEach = F2(
	function (stack, ctx) {
		var newStack = A3(
			$elm$core$Array$slice,
			2,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota2 = A2($elm$core$Array$get, 0, stack);
		var maybeIota1 = A2($elm$core$Array$get, 1, stack);
		if (_Utils_eq(maybeIota1, $elm$core$Maybe$Nothing) || _Utils_eq(maybeIota2, $elm$core$Maybe$Nothing)) {
			var newNewStack = A2(
				$elm$core$Array$append,
				A2(
					$elm$core$Array$map,
					$author$project$Logic$App$Patterns$OperatorUtils$mapNothingToMissingIota,
					$elm$core$Array$fromList(
						$author$project$Logic$App$Patterns$OperatorUtils$moveNothingsToFront(
							_List_fromArray(
								[maybeIota1, maybeIota2])))),
				newStack);
			return {
				allStackStates: $elm$core$Array$fromList(
					_List_fromArray(
						[newNewStack])),
				ctx: ctx,
				stack: newNewStack,
				success: false
			};
		} else {
			var _v0 = _Utils_Tuple2(
				A2($elm$core$Maybe$map, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, maybeIota1),
				A2($elm$core$Maybe$map, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, maybeIota2));
			if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
				var iota1 = _v0.a.a;
				var iota2 = _v0.b.a;
				if (_Utils_eq(iota1, $elm$core$Maybe$Nothing) || _Utils_eq(iota2, $elm$core$Maybe$Nothing)) {
					var newNewStack = A2(
						$elm$core$Array$append,
						$elm$core$Array$fromList(
							_List_fromArray(
								[
									A2(
									$elm$core$Maybe$withDefault,
									$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
									iota1),
									A2(
									$elm$core$Maybe$withDefault,
									$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
									iota2)
								])),
						newStack);
					return {
						allStackStates: $elm$core$Array$fromList(
							_List_fromArray(
								[newNewStack])),
						ctx: ctx,
						stack: newNewStack,
						success: false
					};
				} else {
					var _v1 = _Utils_Tuple2(iota1, iota2);
					if ((((_v1.a.$ === 'Just') && (_v1.a.a.$ === 'IotaList')) && (_v1.b.$ === 'Just')) && (_v1.b.a.$ === 'IotaList')) {
						var patternList = _v1.a.a.a;
						var iotaList = _v1.b.a.a;
						var applyResult = A3(
							$elm$core$Array$foldl,
							F2(
								function (iota, accumulator) {
									if (!accumulator._continue) {
										return accumulator;
									} else {
										var thothList = function () {
											var _v3 = A2($elm$core$Array$get, 0, accumulator.stack);
											if ((_v3.$ === 'Just') && (_v3.a.$ === 'IotaList')) {
												var list = _v3.a.a;
												return list;
											} else {
												return $elm$core$Array$empty;
											}
										}();
										var subApplyResult = A3(
											$author$project$Logic$App$Stack$EvalStack$applyToStackStopAtErrorOrHalt,
											A2($author$project$Logic$App$Utils$Utils$unshift, iota, newStack),
											accumulator.ctx,
											patternList);
										var success = (accumulator.success && subApplyResult.error) ? false : accumulator.success;
										return {
											allStackStates: A2(
												$elm$core$Array$append,
												A2(
													$author$project$Logic$App$Utils$Utils$unshift,
													A3(
														$elm$core$Array$set,
														0,
														$author$project$Logic$App$Types$IotaList(
															A2(
																$elm$core$Array$append,
																thothList,
																$elm_community$array_extra$Array$Extra$reverse(subApplyResult.stack))),
														accumulator.stack),
													A2(
														$elm$core$Array$map,
														function (x) {
															return x.stack;
														},
														subApplyResult.timeline)),
												accumulator.allStackStates),
											_continue: ((!success) || subApplyResult.halted) ? false : true,
											ctx: subApplyResult.ctx,
											stack: A3(
												$elm$core$Array$set,
												0,
												$author$project$Logic$App$Types$IotaList(
													A2(
														$elm$core$Array$append,
														thothList,
														$elm_community$array_extra$Array$Extra$reverse(subApplyResult.stack))),
												accumulator.stack),
											success: success
										};
									}
								}),
							{
								allStackStates: $elm$core$Array$empty,
								_continue: true,
								ctx: ctx,
								stack: A2(
									$author$project$Logic$App$Utils$Utils$unshift,
									$author$project$Logic$App$Types$IotaList($elm$core$Array$empty),
									newStack),
								success: true
							},
							iotaList);
						return {
							allStackStates: applyResult.allStackStates,
							ctx: applyResult.ctx,
							stack: A2(
								$elm$core$Array$filter,
								function (i) {
									if (i.$ === 'OpenParenthesis') {
										return false;
									} else {
										return true;
									}
								},
								applyResult.stack),
							success: applyResult.success
						};
					} else {
						return {
							allStackStates: $elm$core$Array$fromList(
								_List_fromArray(
									[
										$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure)
											]))
									])),
							ctx: ctx,
							stack: $elm$core$Array$fromList(
								_List_fromArray(
									[
										$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure)
									])),
							success: false
						};
					}
				}
			} else {
				return {
					allStackStates: $elm$core$Array$fromList(
						_List_fromArray(
							[
								A2(
								$author$project$Logic$App$Utils$Utils$unshift,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure),
								newStack)
							])),
					ctx: ctx,
					stack: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure),
						newStack),
					success: false
				};
			}
		}
	});
var $author$project$Logic$App$Stack$EvalStack$applyPatternsToStack = F3(
	function (stack, ctx, patterns) {
		var patternIotas = A2(
			$elm$core$List$map,
			function (pattern) {
				return A2($author$project$Logic$App$Types$PatternIota, pattern, false);
			},
			patterns);
		return A7(
			$author$project$Logic$App$Stack$EvalStack$applyToStackLoop,
			_Utils_Tuple2(stack, $elm$core$Array$empty),
			ctx,
			patternIotas,
			0,
			$elm$core$Array$empty,
			false,
			false);
	});
var $author$project$Components$App$Grid$applyUsedPointsToGrid = F2(
	function (gridPoints, pointsToChange) {
		var replace = function (pnt) {
			var replacedPnt = $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (activePnt) {
						return _Utils_eq(
							_Utils_Tuple2(activePnt.offsetX, activePnt.offsetY),
							_Utils_Tuple2(pnt.offsetX, pnt.offsetY));
					},
					pointsToChange));
			if (replacedPnt.$ === 'Just') {
				return _Utils_update(
					pnt,
					{used: true});
			} else {
				return pnt;
			}
		};
		return A2(
			$elm$core$List$map,
			function (row) {
				return A2($elm$core$List$map, replace, row);
			},
			gridPoints);
	});
var $author$project$Logic$App$Grid$clearGrid = function (points) {
	return A2(
		$elm$core$List$map,
		function (row) {
			return A2(
				$elm$core$List$map,
				function (point) {
					return _Utils_update(
						point,
						{color: $author$project$Settings$Theme$accent1, connectedPoints: _List_Nil, used: false});
				},
				row);
		},
		points);
};
var $author$project$Logic$App$Types$East = {$: 'East'};
var $author$project$Logic$App$Types$ErrorDirection = {$: 'ErrorDirection'};
var $author$project$Logic$App$Types$Northeast = {$: 'Northeast'};
var $author$project$Logic$App$Types$Northwest = {$: 'Northwest'};
var $author$project$Logic$App$Types$Southeast = {$: 'Southeast'};
var $author$project$Logic$App$Types$Southwest = {$: 'Southwest'};
var $author$project$Logic$App$Types$West = {$: 'West'};
var $author$project$Logic$App$Utils$DirectionMap$directionMap = _List_fromArray(
	[
		_Utils_Tuple2(
		$author$project$Logic$App$Types$Northeast,
		_Utils_Tuple2(1, -1)),
		_Utils_Tuple2(
		$author$project$Logic$App$Types$East,
		_Utils_Tuple2(2, 0)),
		_Utils_Tuple2(
		$author$project$Logic$App$Types$Southeast,
		_Utils_Tuple2(1, 1)),
		_Utils_Tuple2(
		$author$project$Logic$App$Types$Southwest,
		_Utils_Tuple2(-1, 1)),
		_Utils_Tuple2(
		$author$project$Logic$App$Types$West,
		_Utils_Tuple2(-2, 0)),
		_Utils_Tuple2(
		$author$project$Logic$App$Types$Northwest,
		_Utils_Tuple2(-1, -1))
	]);
var $author$project$Logic$App$Utils$LetterMap$letterMap = _List_fromArray(
	[
		_Utils_Tuple2(
		'w',
		_Utils_Tuple2($author$project$Logic$App$Types$East, $author$project$Logic$App$Types$East)),
		_Utils_Tuple2(
		'a',
		_Utils_Tuple2($author$project$Logic$App$Types$East, $author$project$Logic$App$Types$Northwest)),
		_Utils_Tuple2(
		'q',
		_Utils_Tuple2($author$project$Logic$App$Types$East, $author$project$Logic$App$Types$Northeast)),
		_Utils_Tuple2(
		'd',
		_Utils_Tuple2($author$project$Logic$App$Types$East, $author$project$Logic$App$Types$Southwest)),
		_Utils_Tuple2(
		'e',
		_Utils_Tuple2($author$project$Logic$App$Types$East, $author$project$Logic$App$Types$Southeast)),
		_Utils_Tuple2(
		'e',
		_Utils_Tuple2($author$project$Logic$App$Types$Northeast, $author$project$Logic$App$Types$East)),
		_Utils_Tuple2(
		'q',
		_Utils_Tuple2($author$project$Logic$App$Types$Northeast, $author$project$Logic$App$Types$Northwest)),
		_Utils_Tuple2(
		'a',
		_Utils_Tuple2($author$project$Logic$App$Types$Northeast, $author$project$Logic$App$Types$West)),
		_Utils_Tuple2(
		'w',
		_Utils_Tuple2($author$project$Logic$App$Types$Northeast, $author$project$Logic$App$Types$Northeast)),
		_Utils_Tuple2(
		'd',
		_Utils_Tuple2($author$project$Logic$App$Types$Northeast, $author$project$Logic$App$Types$Southeast)),
		_Utils_Tuple2(
		'd',
		_Utils_Tuple2($author$project$Logic$App$Types$Northwest, $author$project$Logic$App$Types$East)),
		_Utils_Tuple2(
		'w',
		_Utils_Tuple2($author$project$Logic$App$Types$Northwest, $author$project$Logic$App$Types$Northwest)),
		_Utils_Tuple2(
		'q',
		_Utils_Tuple2($author$project$Logic$App$Types$Northwest, $author$project$Logic$App$Types$West)),
		_Utils_Tuple2(
		'e',
		_Utils_Tuple2($author$project$Logic$App$Types$Northwest, $author$project$Logic$App$Types$Northeast)),
		_Utils_Tuple2(
		'a',
		_Utils_Tuple2($author$project$Logic$App$Types$Northwest, $author$project$Logic$App$Types$Southwest)),
		_Utils_Tuple2(
		'd',
		_Utils_Tuple2($author$project$Logic$App$Types$West, $author$project$Logic$App$Types$Northeast)),
		_Utils_Tuple2(
		'e',
		_Utils_Tuple2($author$project$Logic$App$Types$West, $author$project$Logic$App$Types$Northwest)),
		_Utils_Tuple2(
		'w',
		_Utils_Tuple2($author$project$Logic$App$Types$West, $author$project$Logic$App$Types$West)),
		_Utils_Tuple2(
		'a',
		_Utils_Tuple2($author$project$Logic$App$Types$West, $author$project$Logic$App$Types$Southeast)),
		_Utils_Tuple2(
		'q',
		_Utils_Tuple2($author$project$Logic$App$Types$West, $author$project$Logic$App$Types$Southwest)),
		_Utils_Tuple2(
		'a',
		_Utils_Tuple2($author$project$Logic$App$Types$Southwest, $author$project$Logic$App$Types$East)),
		_Utils_Tuple2(
		'd',
		_Utils_Tuple2($author$project$Logic$App$Types$Southwest, $author$project$Logic$App$Types$Northwest)),
		_Utils_Tuple2(
		'e',
		_Utils_Tuple2($author$project$Logic$App$Types$Southwest, $author$project$Logic$App$Types$West)),
		_Utils_Tuple2(
		'q',
		_Utils_Tuple2($author$project$Logic$App$Types$Southwest, $author$project$Logic$App$Types$Southeast)),
		_Utils_Tuple2(
		'w',
		_Utils_Tuple2($author$project$Logic$App$Types$Southwest, $author$project$Logic$App$Types$Southwest)),
		_Utils_Tuple2(
		'q',
		_Utils_Tuple2($author$project$Logic$App$Types$Southeast, $author$project$Logic$App$Types$East)),
		_Utils_Tuple2(
		'a',
		_Utils_Tuple2($author$project$Logic$App$Types$Southeast, $author$project$Logic$App$Types$Northeast)),
		_Utils_Tuple2(
		'd',
		_Utils_Tuple2($author$project$Logic$App$Types$Southeast, $author$project$Logic$App$Types$West)),
		_Utils_Tuple2(
		'w',
		_Utils_Tuple2($author$project$Logic$App$Types$Southeast, $author$project$Logic$App$Types$Southeast)),
		_Utils_Tuple2(
		'e',
		_Utils_Tuple2($author$project$Logic$App$Types$Southeast, $author$project$Logic$App$Types$Southwest))
	]);
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Logic$App$Grid$drawPattern = F3(
	function (xOffset, yOffset, pattern) {
		var positionCoords = F4(
			function (leftBound, topBound, coord, accumulator) {
				var offsetBounds = _Utils_eq(
					A2($elm$core$Basics$modBy, 2, leftBound),
					A2($elm$core$Basics$modBy, 2, topBound)) ? _Utils_Tuple2(leftBound, topBound) : _Utils_Tuple2(leftBound + 1, topBound);
				var offsetLeftBound = offsetBounds.a;
				var offsetTopBound = offsetBounds.b;
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(coord.a + offsetLeftBound, coord.b + offsetTopBound),
					accumulator);
			});
		var pointConnectionToGridPoint = function (point) {
			return _Utils_update(
				$author$project$Components$App$Grid$emptyGridpoint,
				{color: point.color, offsetX: point.offsetX, offsetY: point.offsetY, used: true});
		};
		var gridpointToPointConnection = function (point) {
			return {
				betweenOffsetValues: _Utils_Tuple3(
					_Utils_Tuple2(0, 0),
					_Utils_Tuple2(0, 0),
					_Utils_Tuple2(0, 0)),
				color: pattern.color,
				offsetX: point.offsetX,
				offsetY: point.offsetY
			};
		};
		var getbottomAndRightBound = F2(
			function (coord, accumulator) {
				var x = coord.a;
				var y = coord.b;
				return {
					bottom: A2($elm$core$Basics$max, y, accumulator.bottom),
					right: A2($elm$core$Basics$max, x, accumulator.right)
				};
			});
		var getNextDirection = F2(
			function (prevDirection, angle) {
				return A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(
						'',
						_Utils_Tuple2($author$project$Logic$App$Types$ErrorDirection, $author$project$Logic$App$Types$ErrorDirection)),
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (mapItem) {
								var letter = mapItem.a;
								var direction = mapItem.b;
								return (_Utils_eq(letter, angle) && _Utils_eq(direction.a, prevDirection)) ? true : false;
							},
							$author$project$Logic$App$Utils$LetterMap$letterMap))).b.b;
			});
		var signatureToAngles = F2(
			function (angle, accumulator) {
				return A2(
					$elm$core$List$cons,
					A2(
						getNextDirection,
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$East,
							$elm$core$List$head(accumulator)),
						angle),
					accumulator);
			});
		var getLeftmostAndTopmostValues = F2(
			function (coord, accumulator) {
				var x = coord.a;
				var y = coord.b;
				return {
					x: A2($elm$core$Basics$min, x, accumulator.x),
					y: A2($elm$core$Basics$min, y, accumulator.y)
				};
			});
		var directionToCoord = function (direction) {
			return A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(
					$author$project$Logic$App$Types$ErrorDirection,
					_Utils_Tuple2(0, 0)),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (mapItem) {
							var dir = mapItem.a;
							return _Utils_eq(dir, direction) ? true : false;
						},
						$author$project$Logic$App$Utils$DirectionMap$directionMap))).b;
		};
		var coordsToPathCoords = F2(
			function (coord, accumulator) {
				var _v1 = $elm$core$List$head(accumulator);
				if (_v1.$ === 'Just') {
					var prevPoint = _v1.a;
					return A2(
						$elm$core$List$cons,
						_Utils_Tuple2(coord.a + prevPoint.a, coord.b + prevPoint.b),
						accumulator);
				} else {
					return _List_fromArray(
						[
							_Utils_Tuple2(coord.a - 2, coord.b)
						]);
				}
			});
		var pathCoords = A3(
			$elm$core$List$foldl,
			coordsToPathCoords,
			_List_Nil,
			A2(
				$elm$core$List$map,
				directionToCoord,
				$elm$core$List$reverse(
					A3(
						$elm$core$List$foldl,
						signatureToAngles,
						_List_fromArray(
							[pattern.startDirection, pattern.startDirection]),
						A2($elm$core$String$split, '', pattern.signature)))));
		var leftmostAndTopmostValues = A3(
			$elm$core$List$foldl,
			getLeftmostAndTopmostValues,
			{x: 0, y: 0},
			pathCoords);
		var coordToPointConnection = function (coord) {
			return {
				betweenOffsetValues: _Utils_Tuple3(
					_Utils_Tuple2(0, 0),
					_Utils_Tuple2(0, 0),
					_Utils_Tuple2(0, 0)),
				color: pattern.color,
				offsetX: coord.a,
				offsetY: coord.b
			};
		};
		var connectPoints = F2(
			function (point, accumulator) {
				var prevPoint = accumulator.a;
				var drawing = accumulator.b;
				var _v0 = $elm$core$List$head(drawing);
				if (_v0.$ === 'Just') {
					return A2(
						$elm$core$List$any,
						function (x) {
							return _Utils_eq(
								_Utils_Tuple2(x.offsetX, x.offsetY),
								_Utils_Tuple2(point.offsetX, point.offsetY));
						},
						drawing) ? _Utils_Tuple2(
						point,
						A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_eq(
									_Utils_Tuple2(x.offsetX, x.offsetY),
									_Utils_Tuple2(point.offsetX, point.offsetY)) ? _Utils_update(
									x,
									{
										connectedPoints: A2(
											$elm$core$List$cons,
											gridpointToPointConnection(prevPoint),
											x.connectedPoints)
									}) : x;
							},
							drawing)) : _Utils_Tuple2(
						point,
						A2(
							$elm$core$List$cons,
							_Utils_update(
								point,
								{
									connectedPoints: _List_fromArray(
										[
											gridpointToPointConnection(prevPoint)
										])
								}),
							drawing));
				} else {
					return _Utils_Tuple2(
						point,
						A2($elm$core$List$cons, point, drawing));
				}
			});
		var grid = A3(
			$elm$core$List$foldr,
			connectPoints,
			_Utils_Tuple2($author$project$Components$App$Grid$emptyGridpoint, _List_Nil),
			A2(
				$elm$core$List$map,
				function (x) {
					return pointConnectionToGridPoint(
						coordToPointConnection(x));
				},
				A3(
					$elm$core$List$foldl,
					A2(positionCoords, xOffset - leftmostAndTopmostValues.x, yOffset - leftmostAndTopmostValues.y),
					_List_Nil,
					pathCoords))).b;
		var bottomAndRightBound = A3(
			$elm$core$List$foldl,
			getbottomAndRightBound,
			{bottom: 0, right: 0},
			A3(
				$elm$core$List$foldl,
				A2(positionCoords, xOffset - leftmostAndTopmostValues.x, yOffset - leftmostAndTopmostValues.y),
				_List_Nil,
				pathCoords));
		return {bottomBound: bottomAndRightBound.bottom, points: grid, rightBound: bottomAndRightBound.right};
	});
var $author$project$Components$App$Grid$updateCoords = F2(
	function (gridPoints, pointsToUpdate) {
		var update = F2(
			function (pnt, accumulator) {
				var replacedPnt = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (activePnt) {
							return _Utils_eq(
								_Utils_Tuple2(activePnt.offsetX, activePnt.offsetY),
								_Utils_Tuple2(pnt.offsetX, pnt.offsetY));
						},
						$elm$core$List$concat(gridPoints)));
				if (replacedPnt.$ === 'Just') {
					var point = replacedPnt.a;
					return A2(
						$elm$core$List$cons,
						_Utils_update(
							pnt,
							{color: $author$project$Settings$Theme$accent2, used: true, x: point.x, y: point.y}),
						accumulator);
				} else {
					return accumulator;
				}
			});
		return A3($elm$core$List$foldl, update, _List_Nil, pointsToUpdate);
	});
var $author$project$Logic$App$Grid$drawPatterns = F2(
	function (patterns, grid) {
		var gridOffsetWidth = (-6) + (2 * $elm$core$List$length(
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$head(grid.points))));
		var addPatternToGrid = F2(
			function (pattern, accumulator) {
				var attemptDrawPatternResult = A3($author$project$Logic$App$Grid$drawPattern, accumulator.xOffset, accumulator.yOffset, pattern);
				var drawPatternResult = function () {
					if (_Utils_cmp(attemptDrawPatternResult.rightBound, gridOffsetWidth) < 0) {
						return {
							bottomBound: attemptDrawPatternResult.bottomBound,
							points: A2($author$project$Components$App$Grid$updateCoords, grid.points, attemptDrawPatternResult.points),
							rightBound: attemptDrawPatternResult.rightBound,
							yOffset: accumulator.yOffset
						};
					} else {
						var drawPatternResultOld = A3($author$project$Logic$App$Grid$drawPattern, 0, accumulator.currentLowestY + 1, pattern);
						return {
							bottomBound: drawPatternResultOld.bottomBound,
							points: A2($author$project$Components$App$Grid$updateCoords, grid.points, drawPatternResultOld.points),
							rightBound: drawPatternResultOld.rightBound,
							yOffset: accumulator.currentLowestY + 1
						};
					}
				}();
				return {
					currentLowestY: A2($elm$core$Basics$max, accumulator.currentLowestY, drawPatternResult.bottomBound),
					patternArray: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						_Utils_Tuple2(pattern, drawPatternResult.points),
						accumulator.patternArray),
					points: _Utils_ap(accumulator.points, drawPatternResult.points),
					xOffset: drawPatternResult.rightBound + 1,
					yOffset: drawPatternResult.yOffset
				};
			});
		var drawPatternsResult = A3(
			$elm$core$Array$foldr,
			addPatternToGrid,
			{currentLowestY: 0, patternArray: $elm$core$Array$empty, points: _List_Nil, xOffset: 0, yOffset: 0},
			patterns);
		return {
			grid: _Utils_update(
				grid,
				{
					drawnPoints: drawPatternsResult.points,
					points: A2(
						$author$project$Components$App$Grid$applyUsedPointsToGrid,
						$author$project$Logic$App$Grid$clearGrid(grid.points),
						drawPatternsResult.points)
				}),
			patternArray: drawPatternsResult.patternArray
		};
	});
var $author$project$Logic$App$Types$None = {$: 'None'};
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {index: index, match: match, number: number, submatches: submatches};
	});
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{caseInsensitive: false, multiline: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $author$project$Logic$App$Utils$RegexPatterns$angleSignaturePattern = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^[qawed]+$'));
var $author$project$Logic$App$Utils$RegexPatterns$bookkeepersPattern = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^[v-]+$'));
var $elm$regex$Regex$contains = _Regex_contains;
var $elm$regex$Regex$find = _Regex_findAtMost(_Regex_infinity);
var $author$project$Logic$App$Patterns$PatternRegistry$noAction = F2(
	function (stack, ctx) {
		return {ctx: ctx, stack: stack, success: true};
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Logic$App$Types$Number = function (a) {
	return {$: 'Number', a: a};
};
var $author$project$Logic$App$Patterns$Misc$numberLiteral = F3(
	function (number, stack, ctx) {
		return {
			ctx: ctx,
			stack: A2(
				$author$project$Logic$App$Utils$Utils$unshift,
				$author$project$Logic$App$Types$Number(number),
				stack),
			success: true
		};
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Logic$App$Patterns$PatternRegistry$numberLiteralGenerator = F2(
	function (angleSignature, isNegative) {
		var letterMap = function (letter) {
			switch (letter.valueOf()) {
				case 'w':
					return $elm$core$Basics$add(1);
				case 'q':
					return $elm$core$Basics$add(5);
				case 'e':
					return $elm$core$Basics$add(10);
				case 'a':
					return $elm$core$Basics$mul(2);
				case 'd':
					return $elm$core$Basics$mul(0.5);
				default:
					return $elm$core$Basics$add(0);
			}
		};
		var numberAbs = A3(
			$elm$core$List$foldl,
			letterMap,
			0,
			$elm$core$String$toList(
				A2($elm$core$String$dropLeft, 4, angleSignature)));
		var number = isNegative ? (-numberAbs) : numberAbs;
		return {
			action: $author$project$Logic$App$Patterns$Misc$numberLiteral(number),
			active: true,
			color: $author$project$Settings$Theme$accent1,
			displayName: 'Numerical Reflection: ' + $elm$core$String$fromFloat(number),
			internalName: $elm$core$String$fromFloat(number),
			metaAction: $author$project$Logic$App$Types$None,
			outputOptions: _List_Nil,
			selectedOutput: $elm$core$Maybe$Nothing,
			signature: angleSignature,
			startDirection: $author$project$Logic$App$Types$Southeast
		};
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm_community$array_extra$Array$Extra$map2 = F3(
	function (combineAb, aArray, bArray) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$List$map2,
				combineAb,
				$elm$core$Array$toList(aArray),
				$elm$core$Array$toList(bArray)));
	});
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $author$project$Logic$App$Patterns$Misc$mask = F3(
	function (maskCode, stack, ctx) {
		var action = F2(
			function (code, iota) {
				if (code === 'v') {
					return $elm$core$Maybe$Nothing;
				} else {
					return $elm$core$Maybe$Just(iota);
				}
			});
		if (_Utils_cmp(
			$elm$core$Array$length(stack),
			$elm$core$List$length(maskCode)) > -1) {
			var newStack = A2(
				$elm$core$Array$append,
				A2(
					$elm$core$Array$map,
					function (x) {
						return A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure),
							x);
					},
					A2(
						$elm$core$Array$filter,
						function (x) {
							return $author$project$Logic$App$Utils$Utils$isJust(x);
						},
						A3(
							$elm_community$array_extra$Array$Extra$map2,
							action,
							$elm$core$Array$fromList(
								$elm$core$List$reverse(maskCode)),
							stack))),
				A3(
					$elm$core$Array$slice,
					$elm$core$List$length(maskCode),
					$elm$core$Array$length(stack),
					stack));
			return {ctx: ctx, stack: newStack, success: true};
		} else {
			return {
				ctx: ctx,
				stack: A2(
					$elm$core$Array$append,
					stack,
					A2(
						$elm$core$Array$repeat,
						$elm$core$List$length(maskCode) - $elm$core$Array$length(stack),
						$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas))),
				success: false
			};
		}
	});
var $author$project$Logic$App$Types$InvalidPattern = {$: 'InvalidPattern'};
var $author$project$Settings$Theme$accent3 = '#e0b8b8';
var $author$project$Logic$App$Patterns$PatternRegistry$unknownPattern = {
	action: F2(
		function (stack, ctx) {
			return {
				ctx: ctx,
				stack: A2(
					$author$project$Logic$App$Utils$Utils$unshift,
					$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$InvalidPattern),
					stack),
				success: false
			};
		}),
	active: true,
	color: $author$project$Settings$Theme$accent3,
	displayName: 'Unknown Pattern',
	internalName: 'unknown',
	metaAction: $author$project$Logic$App$Types$None,
	outputOptions: _List_Nil,
	selectedOutput: $elm$core$Maybe$Nothing,
	signature: '',
	startDirection: $author$project$Logic$App$Types$East
};
var $author$project$Logic$App$Patterns$PatternRegistry$parseBookkeeper = function (signature) {
	if (signature === '') {
		return {
			action: $author$project$Logic$App$Patterns$Misc$mask(
				_List_fromArray(
					['-'])),
			active: true,
			color: $author$project$Settings$Theme$accent1,
			displayName: 'Bookkeeper\'s Gambit: -',
			internalName: 'mask',
			metaAction: $author$project$Logic$App$Types$None,
			outputOptions: _List_Nil,
			selectedOutput: $elm$core$Maybe$Nothing,
			signature: signature,
			startDirection: $author$project$Logic$App$Types$East
		};
	} else {
		var parseSignature = F2(
			function (angle, accumulatorResult) {
				if (accumulatorResult.$ === 'Ok') {
					var accumulator = accumulatorResult.a;
					if (!$elm$core$List$length(accumulator)) {
						return (angle === 'e') ? $elm$core$Result$Ok(
							_Utils_ap(
								_List_fromArray(
									['\\', '-']),
								accumulator)) : ((angle === 'w') ? $elm$core$Result$Ok(
							_Utils_ap(
								_List_fromArray(
									['-', '-']),
								accumulator)) : ((angle === 'a') ? $elm$core$Result$Ok(
							A2($elm$core$List$cons, 'v', accumulator)) : $elm$core$Result$Err(accumulator)));
					} else {
						var _v3 = A2(
							$elm$core$Maybe$withDefault,
							'',
							$elm$core$List$head(accumulator));
						switch (_v3) {
							case '\\':
								return (angle === 'a') ? $elm$core$Result$Ok(
									A2(
										$elm$core$List$cons,
										'v',
										A2(
											$elm$core$Maybe$withDefault,
											_List_Nil,
											$elm$core$List$tail(accumulator)))) : $elm$core$Result$Err(accumulator);
							case 'v':
								return (angle === 'e') ? $elm$core$Result$Ok(
									A2($elm$core$List$cons, '-', accumulator)) : ((angle === 'd') ? $elm$core$Result$Ok(
									A2($elm$core$List$cons, '\\', accumulator)) : $elm$core$Result$Err(accumulator));
							case '-':
								return (angle === 'w') ? $elm$core$Result$Ok(
									A2($elm$core$List$cons, '-', accumulator)) : ((angle === 'e') ? $elm$core$Result$Ok(
									_Utils_ap(
										_List_fromArray(
											['\\', '-']),
										A2(
											$elm$core$Maybe$withDefault,
											_List_Nil,
											$elm$core$List$tail(accumulator)))) : $elm$core$Result$Err(accumulator));
							default:
								return $elm$core$Result$Err(accumulator);
						}
					}
				} else {
					return accumulatorResult;
				}
			});
		var angleList = A2($elm$core$String$split, '', signature);
		var maskCodeResult = function () {
			var _v1 = A3(
				$elm$core$List$foldl,
				parseSignature,
				$elm$core$Result$Ok(_List_Nil),
				angleList);
			if (_v1.$ === 'Ok') {
				var maskCode = _v1.a;
				return (A2(
					$elm$core$Maybe$withDefault,
					'',
					$elm$core$List$head(maskCode)) === '\\') ? $elm$core$Result$Err(
					$elm$core$List$reverse(maskCode)) : $elm$core$Result$Ok(
					$elm$core$List$reverse(maskCode));
			} else {
				var maskCode = _v1.a;
				return $elm$core$Result$Err(
					$elm$core$List$reverse(maskCode));
			}
		}();
		if (maskCodeResult.$ === 'Ok') {
			var maskCode = maskCodeResult.a;
			return {
				action: $author$project$Logic$App$Patterns$Misc$mask(maskCode),
				active: true,
				color: $author$project$Settings$Theme$accent1,
				displayName: 'Bookkeeper\'s Gambit: ' + $elm$core$String$concat(maskCode),
				internalName: 'mask',
				metaAction: $author$project$Logic$App$Types$None,
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: signature,
				startDirection: $author$project$Logic$App$Types$East
			};
		} else {
			return $author$project$Logic$App$Patterns$PatternRegistry$unknownPattern;
		}
	}
};
var $author$project$Logic$App$Types$Boolean = function (a) {
	return {$: 'Boolean', a: a};
};
var $author$project$Logic$App$Types$Entity = function (a) {
	return {$: 'Entity', a: a};
};
var $author$project$Logic$App$Types$EntityType = {$: 'EntityType'};
var $author$project$Logic$App$Types$IotaListType = function (a) {
	return {$: 'IotaListType', a: a};
};
var $author$project$Logic$App$Types$NumberType = {$: 'NumberType'};
var $author$project$Logic$App$Types$Unset = {$: 'Unset'};
var $author$project$Logic$App$Types$Vector = function (a) {
	return {$: 'Vector', a: a};
};
var $author$project$Logic$App$Types$VectorType = {$: 'VectorType'};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$Logic$App$Types$MathematicalError = {$: 'MathematicalError'};
var $elm_community$array_extra$Array$Extra$any = function (isOkay) {
	return A2(
		$elm$core$Array$foldl,
		F2(
			function (element, soFar) {
				return soFar || isOkay(element);
			}),
		false);
};
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $author$project$Logic$App$Patterns$OperatorUtils$nanOrInfinityCheck = function (array) {
	return A2(
		$elm_community$array_extra$Array$Extra$any,
		function (i) {
			switch (i.$) {
				case 'Number':
					var number = i.a;
					return $elm$core$Basics$isNaN(number) || $elm$core$Basics$isInfinite(number);
				case 'Vector':
					var _v1 = i.a;
					var x = _v1.a;
					var y = _v1.b;
					var z = _v1.c;
					return A2(
						$elm_community$array_extra$Array$Extra$any,
						function (num) {
							return $elm$core$Basics$isNaN(num) || $elm$core$Basics$isInfinite(num);
						},
						$elm$core$Array$fromList(
							_List_fromArray(
								[x, y, z])));
				default:
					return false;
			}
		},
		array);
};
var $author$project$Logic$App$Patterns$OperatorUtils$action1Input = F4(
	function (stack, ctx, inputGetter, action) {
		var newStack = A3(
			$elm$core$Array$slice,
			1,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota = A2($elm$core$Array$get, 0, stack);
		if (maybeIota.$ === 'Nothing') {
			return {
				ctx: ctx,
				stack: A2(
					$author$project$Logic$App$Utils$Utils$unshift,
					$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas),
					newStack),
				success: false
			};
		} else {
			var iota = maybeIota.a;
			var _v1 = inputGetter(iota);
			if (_v1.$ === 'Nothing') {
				return {
					ctx: ctx,
					stack: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
						newStack),
					success: false
				};
			} else {
				var actionResult = A2(action, iota, ctx);
				return $author$project$Logic$App$Patterns$OperatorUtils$nanOrInfinityCheck(actionResult.a) ? {
					ctx: actionResult.b,
					stack: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$MathematicalError),
						stack),
					success: false
				} : {
					ctx: actionResult.b,
					stack: A2($elm$core$Array$append, actionResult.a, newStack),
					success: true
				};
			}
		}
	});
var $ianmackenzie$elm_geometry$Geometry$Types$Vector3d = function (a) {
	return {$: 'Vector3d', a: a};
};
var $ianmackenzie$elm_geometry$Vector3d$xyz = F3(
	function (_v0, _v1, _v2) {
		var x = _v0.a;
		var y = _v1.a;
		var z = _v2.a;
		return $ianmackenzie$elm_geometry$Geometry$Types$Vector3d(
			{x: x, y: y, z: z});
	});
var $ianmackenzie$elm_geometry$Vector3d$fromTuple = F2(
	function (toQuantity, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		var z = _v0.c;
		return A3(
			$ianmackenzie$elm_geometry$Vector3d$xyz,
			toQuantity(x),
			toQuantity(y),
			toQuantity(z));
	});
var $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector = function (iota) {
	switch (iota.$) {
		case 'Vector':
			return $elm$core$Maybe$Just(iota);
		case 'Number':
			return $elm$core$Maybe$Just(iota);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $ianmackenzie$elm_units$Quantity$Quantity = function (a) {
	return {$: 'Quantity', a: a};
};
var $ianmackenzie$elm_units$Quantity$zero = $ianmackenzie$elm_units$Quantity$Quantity(0);
var $ianmackenzie$elm_geometry$Vector3d$length = function (_v0) {
	var v = _v0.a;
	var largestComponent = A2(
		$elm$core$Basics$max,
		$elm$core$Basics$abs(v.x),
		A2(
			$elm$core$Basics$max,
			$elm$core$Basics$abs(v.y),
			$elm$core$Basics$abs(v.z)));
	if (!largestComponent) {
		return $ianmackenzie$elm_units$Quantity$zero;
	} else {
		var scaledZ = v.z / largestComponent;
		var scaledY = v.y / largestComponent;
		var scaledX = v.x / largestComponent;
		var scaledLength = $elm$core$Basics$sqrt(((scaledX * scaledX) + (scaledY * scaledY)) + (scaledZ * scaledZ));
		return $ianmackenzie$elm_units$Quantity$Quantity(scaledLength * largestComponent);
	}
};
var $ianmackenzie$elm_units$Length$meters = function (numMeters) {
	return $ianmackenzie$elm_units$Quantity$Quantity(numMeters);
};
var $ianmackenzie$elm_units$Quantity$unwrap = function (_v0) {
	var value = _v0.a;
	return value;
};
var $author$project$Logic$App$Patterns$Math$absLen = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						switch (iota.$) {
							case 'Number':
								var number = iota.a;
								return A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Number(
										$elm$core$Basics$abs(number)));
							case 'Vector':
								var vector = iota.a;
								var length = $ianmackenzie$elm_units$Quantity$unwrap(
									$ianmackenzie$elm_geometry$Vector3d$length(
										A2($ianmackenzie$elm_geometry$Vector3d$fromTuple, $ianmackenzie$elm_units$Length$meters, vector)));
								return A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Number(length));
							default:
								return A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$action2Inputs = F5(
	function (stack, ctx, inputGetter1, inputGetter2, action) {
		var newStack = A3(
			$elm$core$Array$slice,
			2,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota2 = A2($elm$core$Array$get, 0, stack);
		var maybeIota1 = A2($elm$core$Array$get, 1, stack);
		if (_Utils_eq(maybeIota1, $elm$core$Maybe$Nothing) || _Utils_eq(maybeIota2, $elm$core$Maybe$Nothing)) {
			return {
				ctx: ctx,
				stack: A2(
					$elm$core$Array$append,
					A2(
						$elm$core$Array$map,
						$author$project$Logic$App$Patterns$OperatorUtils$mapNothingToMissingIota,
						$elm$core$Array$fromList(
							$author$project$Logic$App$Patterns$OperatorUtils$moveNothingsToFront(
								_List_fromArray(
									[maybeIota1, maybeIota2])))),
					newStack),
				success: false
			};
		} else {
			var _v0 = _Utils_Tuple2(
				A2($elm$core$Maybe$map, inputGetter1, maybeIota1),
				A2($elm$core$Maybe$map, inputGetter2, maybeIota2));
			if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
				var iota1 = _v0.a.a;
				var iota2 = _v0.b.a;
				if (_Utils_eq(iota1, $elm$core$Maybe$Nothing) || _Utils_eq(iota2, $elm$core$Maybe$Nothing)) {
					return {
						ctx: ctx,
						stack: A2(
							$elm$core$Array$append,
							$elm$core$Array$fromList(
								_List_fromArray(
									[
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
										iota1),
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
										iota2)
									])),
							newStack),
						success: false
					};
				} else {
					var actionResult = A3(
						action,
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
							iota1),
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
							iota2),
						ctx);
					return $author$project$Logic$App$Patterns$OperatorUtils$nanOrInfinityCheck(actionResult.a) ? {
						ctx: actionResult.b,
						stack: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$MathematicalError),
							stack),
						success: false
					} : {
						ctx: actionResult.b,
						stack: A2($elm$core$Array$append, actionResult.a, newStack),
						success: true
					};
				}
			} else {
				return {
					ctx: ctx,
					stack: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure),
						newStack),
					success: false
				};
			}
		}
	});
var $author$project$Logic$App$Patterns$Math$add = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v6) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						_v0$4:
						while (true) {
							switch (_v0.a.$) {
								case 'Number':
									switch (_v0.b.$) {
										case 'Number':
											var number1 = _v0.a.a;
											var number2 = _v0.b.a;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Number(number1 + number2));
										case 'Vector':
											var number = _v0.a.a;
											var vector = _v0.b.a;
											var x = vector.a;
											var y = vector.b;
											var z = vector.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(number + x, number + y, number + z)));
										default:
											break _v0$4;
									}
								case 'Vector':
									switch (_v0.b.$) {
										case 'Number':
											var vector = _v0.a.a;
											var number = _v0.b.a;
											var x = vector.a;
											var y = vector.b;
											var z = vector.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(x + number, y + number, z + number)));
										case 'Vector':
											var vector1 = _v0.a.a;
											var vector2 = _v0.b.a;
											var _v3 = _Utils_Tuple2(vector1, vector2);
											var _v4 = _v3.a;
											var x1 = _v4.a;
											var y1 = _v4.b;
											var z1 = _v4.c;
											var _v5 = _v3.b;
											var x2 = _v5.a;
											var y2 = _v5.b;
											var z2 = _v5.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(x1 + x2, y1 + y2, z1 + z2)));
										default:
											break _v0$4;
									}
								default:
									break _v0$4;
							}
						}
						return A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$getEntity = function (iota) {
	if (iota.$ === 'Entity') {
		return $elm$core$Maybe$Just(iota);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Patterns$OperatorUtils$getVector = function (iota) {
	if (iota.$ === 'Vector') {
		return $elm$core$Maybe$Just(iota);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs = F4(
	function (stack, ctx, inputGetter1, inputGetter2) {
		return A5(
			$author$project$Logic$App$Patterns$OperatorUtils$action2Inputs,
			stack,
			ctx,
			inputGetter1,
			inputGetter2,
			F3(
				function (_v0, _v1, _v2) {
					return _Utils_Tuple2($elm$core$Array$empty, ctx);
				}));
	});
var $author$project$Logic$App$Patterns$Spells$addMotion = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $ianmackenzie$elm_units$Quantity$lessThanOrEqualTo = F2(
	function (_v0, _v1) {
		var y = _v0.a;
		var x = _v1.a;
		return _Utils_cmp(x, y) < 1;
	});
var $ianmackenzie$elm_geometry$Vector3d$minus = F2(
	function (_v0, _v1) {
		var v2 = _v0.a;
		var v1 = _v1.a;
		return $ianmackenzie$elm_geometry$Geometry$Types$Vector3d(
			{x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z});
	});
var $ianmackenzie$elm_geometry$Vector3d$equalWithin = F3(
	function (givenTolerance, firstVector, secondVector) {
		return A2(
			$ianmackenzie$elm_units$Quantity$lessThanOrEqualTo,
			givenTolerance,
			$ianmackenzie$elm_geometry$Vector3d$length(
				A2($ianmackenzie$elm_geometry$Vector3d$minus, firstVector, secondVector)));
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$checkEquality = F2(
	function (iota1, iota2) {
		var tolerance = 0.0001;
		var _v0 = _Utils_Tuple2(iota1, iota2);
		_v0$5:
		while (true) {
			switch (_v0.a.$) {
				case 'PatternIota':
					if (_v0.b.$ === 'PatternIota') {
						var _v1 = _v0.a;
						var pattern1 = _v1.a;
						var _v2 = _v0.b;
						var pattern2 = _v2.a;
						return _Utils_eq(pattern1.signature, pattern2.signature);
					} else {
						break _v0$5;
					}
				case 'IotaList':
					if (_v0.b.$ === 'IotaList') {
						var list1 = _v0.a.a;
						var list2 = _v0.b.a;
						return !A2(
							$elm$core$List$member,
							false,
							A3(
								$elm$core$List$map2,
								F2(
									function (i1, i2) {
										return A2($author$project$Logic$App$Patterns$OperatorUtils$checkEquality, i1, i2);
									}),
								$elm$core$Array$toList(list1),
								$elm$core$Array$toList(list2)));
					} else {
						break _v0$5;
					}
				case 'Vector':
					if (_v0.b.$ === 'Vector') {
						var vector1Tuple = _v0.a.a;
						var vector2Tuple = _v0.b.a;
						var vector2 = A2($ianmackenzie$elm_geometry$Vector3d$fromTuple, $ianmackenzie$elm_units$Length$meters, vector2Tuple);
						var vector1 = A2($ianmackenzie$elm_geometry$Vector3d$fromTuple, $ianmackenzie$elm_units$Length$meters, vector1Tuple);
						return A3(
							$ianmackenzie$elm_geometry$Vector3d$equalWithin,
							$ianmackenzie$elm_units$Quantity$Quantity(tolerance),
							vector1,
							vector2);
					} else {
						break _v0$5;
					}
				case 'Number':
					if (_v0.b.$ === 'Number') {
						var number1 = _v0.a.a;
						var number2 = _v0.b.a;
						return _Utils_cmp(
							$elm$core$Basics$abs(number1 - number2),
							tolerance) < 0;
					} else {
						break _v0$5;
					}
				case 'Entity':
					if (_v0.b.$ === 'Entity') {
						var entity1 = _v0.a.a;
						var entity2 = _v0.b.a;
						return _Utils_eq(entity1, entity2);
					} else {
						break _v0$5;
					}
				default:
					break _v0$5;
			}
		}
		return _Utils_eq(iota1, iota2);
	});
var $elm$core$Basics$round = _Basics_round;
var $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList = function (iota) {
	switch (iota.$) {
		case 'Number':
			var number = iota.a;
			return _Utils_eq(
				$elm$core$Basics$round(number),
				number) ? $elm$core$Maybe$Just(iota) : $elm$core$Maybe$Nothing;
		case 'IotaList':
			return $elm$core$Maybe$Just(iota);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Patterns$Math$andBit = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						_v0$2:
						while (true) {
							switch (_v0.a.$) {
								case 'Number':
									if (_v0.b.$ === 'Number') {
										var number1 = _v0.a.a;
										var number2 = _v0.b.a;
										return A2(
											$elm$core$Array$repeat,
											1,
											$author$project$Logic$App$Types$Number(
												$elm$core$Basics$round(number1) & $elm$core$Basics$round(number2)));
									} else {
										break _v0$2;
									}
								case 'IotaList':
									if (_v0.b.$ === 'IotaList') {
										var list1 = _v0.a.a;
										var list2 = _v0.b.a;
										return A2(
											$elm$core$Array$repeat,
											1,
											$author$project$Logic$App$Types$IotaList(
												A2(
													$elm$core$Array$filter,
													function (iota) {
														return A2(
															$elm$core$List$any,
															$author$project$Logic$App$Patterns$OperatorUtils$checkEquality(iota),
															$elm$core$Array$toList(list2));
													},
													list1)));
									} else {
										break _v0$2;
									}
								default:
									break _v0$2;
							}
						}
						return A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$getBoolean = function (iota) {
	if (iota.$ === 'Boolean') {
		return $elm$core$Maybe$Just(iota);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Patterns$Math$andBool = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'Boolean') && (_v0.b.$ === 'Boolean')) {
							var bool1 = _v0.a.a;
							var bool2 = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Boolean(bool1 && bool2));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$getAny = function (iota) {
	return $elm$core$Maybe$Just(iota);
};
var $author$project$Logic$App$Patterns$Lists$append = F2(
	function (stack, ctx) {
		var action = F3(
			function (listIota, iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (listIota.$ === 'IotaList') {
							var list = listIota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$IotaList(
									A2($elm$core$Array$push, iota, list)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $elm$core$Basics$acos = _Basics_acos;
var $author$project$Logic$App$Patterns$OperatorUtils$getNumber = function (iota) {
	if (iota.$ === 'Number') {
		return $elm$core$Maybe$Just(iota);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Patterns$Math$arccos = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'Number') {
							var number = iota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									$elm$core$Basics$acos(number)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $elm$core$Basics$asin = _Basics_asin;
var $author$project$Logic$App$Patterns$Math$arcsin = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'Number') {
							var number = iota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									$elm$core$Basics$asin(number)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $elm$core$Basics$atan = _Basics_atan;
var $author$project$Logic$App$Patterns$Math$arctan = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'Number') {
							var number = iota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									$elm$core$Basics$atan(number)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$action3Inputs = F6(
	function (stack, ctx, inputGetter1, inputGetter2, inputGetter3, action) {
		var newStack = A3(
			$elm$core$Array$slice,
			3,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota3 = A2($elm$core$Array$get, 0, stack);
		var maybeIota2 = A2($elm$core$Array$get, 1, stack);
		var maybeIota1 = A2($elm$core$Array$get, 2, stack);
		if (_Utils_eq(maybeIota1, $elm$core$Maybe$Nothing) || (_Utils_eq(maybeIota2, $elm$core$Maybe$Nothing) || _Utils_eq(maybeIota3, $elm$core$Maybe$Nothing))) {
			return {
				ctx: ctx,
				stack: A2(
					$elm$core$Array$append,
					A2(
						$elm$core$Array$map,
						$author$project$Logic$App$Patterns$OperatorUtils$mapNothingToMissingIota,
						$elm$core$Array$fromList(
							$author$project$Logic$App$Patterns$OperatorUtils$moveNothingsToFront(
								_List_fromArray(
									[maybeIota1, maybeIota2, maybeIota3])))),
					newStack),
				success: false
			};
		} else {
			var _v0 = _Utils_Tuple3(
				A2($elm$core$Maybe$map, inputGetter1, maybeIota1),
				A2($elm$core$Maybe$map, inputGetter2, maybeIota2),
				A2($elm$core$Maybe$map, inputGetter3, maybeIota3));
			if (((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) && (_v0.c.$ === 'Just')) {
				var iota1 = _v0.a.a;
				var iota2 = _v0.b.a;
				var iota3 = _v0.c.a;
				if (_Utils_eq(iota1, $elm$core$Maybe$Nothing) || (_Utils_eq(iota2, $elm$core$Maybe$Nothing) || _Utils_eq(iota3, $elm$core$Maybe$Nothing))) {
					return {
						ctx: ctx,
						stack: A2(
							$elm$core$Array$append,
							$elm$core$Array$fromList(
								_List_fromArray(
									[
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
										iota1),
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
										iota2),
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
										iota3)
									])),
							newStack),
						success: false
					};
				} else {
					var actionResult = A4(
						action,
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
							iota1),
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
							iota2),
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
							iota3),
						ctx);
					return $author$project$Logic$App$Patterns$OperatorUtils$nanOrInfinityCheck(actionResult.a) ? {
						ctx: actionResult.b,
						stack: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$MathematicalError),
							stack),
						success: false
					} : {
						ctx: actionResult.b,
						stack: A2($elm$core$Array$append, actionResult.a, newStack),
						success: true
					};
				}
			} else {
				return {
					ctx: ctx,
					stack: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure),
						newStack),
					success: false
				};
			}
		}
	});
var $author$project$Logic$App$Patterns$OperatorUtils$spell3Inputs = F5(
	function (stack, ctx, inputGetter1, inputGetter2, inputGetter3) {
		return A6(
			$author$project$Logic$App$Patterns$OperatorUtils$action3Inputs,
			stack,
			ctx,
			inputGetter1,
			inputGetter2,
			inputGetter3,
			F4(
				function (_v0, _v1, _v2, _v3) {
					return _Utils_Tuple2($elm$core$Array$empty, ctx);
				}));
	});
var $author$project$Logic$App$Patterns$Spells$beep = F2(
	function (stack, ctx) {
		return A5($author$project$Logic$App$Patterns$OperatorUtils$spell3Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber);
	});
var $author$project$Logic$App$Patterns$Spells$blink = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, $author$project$Logic$App$Patterns$OperatorUtils$getNumber);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$spell1Input = F3(
	function (stack, ctx, inputGetter) {
		return A4(
			$author$project$Logic$App$Patterns$OperatorUtils$action1Input,
			stack,
			ctx,
			inputGetter,
			F2(
				function (_v0, _v1) {
					return _Utils_Tuple2($elm$core$Array$empty, ctx);
				}));
	});
var $author$project$Logic$App$Patterns$Spells$bonemeal = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$Math$boolCoerce = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						switch (iota.$) {
							case 'Number':
								return A2(
									$author$project$Logic$App$Patterns$OperatorUtils$checkEquality,
									iota,
									$author$project$Logic$App$Types$Number(0.0)) ? A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Boolean(false)) : A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Boolean(true));
							case 'Null':
								return A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Boolean(false));
							case 'IotaList':
								var x = iota.a;
								return _Utils_eq(x, $elm$core$Array$empty) ? A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Boolean(false)) : A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Boolean(true));
							default:
								return A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Boolean(true));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$Spells$breakBlock = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$Math$ceilAction = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'Number') {
							var number = iota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									$elm$core$Basics$ceiling(number)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$actionNoInput = F3(
	function (stack, ctx, action) {
		var actionResult = action(ctx);
		return $author$project$Logic$App$Patterns$OperatorUtils$nanOrInfinityCheck(actionResult.a) ? {
			ctx: actionResult.b,
			stack: A2(
				$author$project$Logic$App$Utils$Utils$unshift,
				$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$MathematicalError),
				stack),
			success: false
		} : {
			ctx: actionResult.b,
			stack: A2($elm$core$Array$append, actionResult.a, stack),
			success: true
		};
	});
var $author$project$Logic$App$Patterns$Circles$circleBoundsMax = F2(
	function (stack, ctx) {
		var action = function (_v0) {
			return _Utils_Tuple2(
				A2(
					$elm$core$Array$repeat,
					1,
					$author$project$Logic$App$Types$Vector(
						_Utils_Tuple3(0.0, 0.0, 0.0))),
				ctx);
		};
		return A3($author$project$Logic$App$Patterns$OperatorUtils$actionNoInput, stack, ctx, action);
	});
var $author$project$Logic$App$Patterns$Circles$circleBoundsMin = F2(
	function (stack, ctx) {
		var action = function (_v0) {
			return _Utils_Tuple2(
				A2(
					$elm$core$Array$repeat,
					1,
					$author$project$Logic$App$Types$Vector(
						_Utils_Tuple3(0.0, 0.0, 0.0))),
				ctx);
		};
		return A3($author$project$Logic$App$Patterns$OperatorUtils$actionNoInput, stack, ctx, action);
	});
var $author$project$Logic$App$Patterns$Circles$circleImpetusDirection = F2(
	function (stack, ctx) {
		var action = function (_v0) {
			return _Utils_Tuple2(
				A2(
					$elm$core$Array$repeat,
					1,
					$author$project$Logic$App$Types$Vector(
						_Utils_Tuple3(1.0, 0.0, 0.0))),
				ctx);
		};
		return A3($author$project$Logic$App$Patterns$OperatorUtils$actionNoInput, stack, ctx, action);
	});
var $elm$core$Basics$pi = _Basics_pi;
var $author$project$Logic$App$Patterns$Math$coerceAxial = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v2) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'Vector') {
							var vector = iota.a;
							var x = vector.a;
							var y = vector.b;
							var z = vector.c;
							var theta = $elm$core$Basics$atan(y / x);
							var snapped_theta = ($elm$core$Basics$pi / 2) * $elm$core$Basics$round(theta / ($elm$core$Basics$pi / 2));
							var magnitude = $elm$core$Basics$sqrt(
								(A2($elm$core$Basics$pow, x, 2) + A2($elm$core$Basics$pow, y, 2)) + A2($elm$core$Basics$pow, z, 2));
							var azimuth = $elm$core$Basics$acos(z / magnitude);
							var snapped_azimuth = ($elm$core$Basics$pi / 2) * $elm$core$Basics$round(azimuth / ($elm$core$Basics$pi / 2));
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(
										$elm$core$Basics$round(
											$elm$core$Basics$sin(snapped_azimuth) * $elm$core$Basics$cos(snapped_theta)),
										$elm$core$Basics$round(
											$elm$core$Basics$sin(snapped_azimuth) * $elm$core$Basics$sin(snapped_theta)),
										$elm$core$Basics$round(
											$elm$core$Basics$cos(snapped_azimuth)))));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$spellNoInput = F2(
	function (stack, ctx) {
		return A3(
			$author$project$Logic$App$Patterns$OperatorUtils$actionNoInput,
			stack,
			ctx,
			function (_v0) {
				return _Utils_Tuple2($elm$core$Array$empty, ctx);
			});
	});
var $author$project$Logic$App$Patterns$Spells$colorize = F2(
	function (stack, ctx) {
		return A2($author$project$Logic$App$Patterns$OperatorUtils$spellNoInput, stack, ctx);
	});
var $author$project$Logic$App$Patterns$Lists$concat = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'IotaList') && (_v0.b.$ === 'IotaList')) {
							var list1 = _v0.a.a;
							var list2 = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$IotaList(
									A2($elm$core$Array$append, list1, list2)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, action);
	});
var $author$project$Logic$App$Patterns$Spells$conjureBlock = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$Spells$conjureLight = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$Lists$construct = F2(
	function (stack, ctx) {
		var action = F3(
			function (listIota, iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (listIota.$ === 'IotaList') {
							var list = listIota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$IotaList(
									A2($author$project$Logic$App$Utils$Utils$unshift, iota, list)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$Math$constructVector = F2(
	function (stack, ctx) {
		var action = F4(
			function (iota1, iota2, iota3, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple3(iota1, iota2, iota3);
						if (((_v0.a.$ === 'Number') && (_v0.b.$ === 'Number')) && (_v0.c.$ === 'Number')) {
							var number1 = _v0.a.a;
							var number2 = _v0.b.a;
							var number3 = _v0.c.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(number1, number2, number3)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A6($author$project$Logic$App$Patterns$OperatorUtils$action3Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Patterns$Math$cosine = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'Number') {
							var number = iota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									$elm$core$Basics$cos(number)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$getPatternList = function (iota) {
	if (iota.$ === 'IotaList') {
		var list = iota.a;
		return A2(
			$elm$core$List$all,
			function (i) {
				if (i.$ === 'PatternIota') {
					return true;
				} else {
					return false;
				}
			},
			$elm$core$Array$toList(list)) ? $elm$core$Maybe$Just(iota) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Patterns$Spells$craftArtifact = F3(
	function (requiredItem, stack, ctx) {
		var action = F3(
			function (iota1, iota2, context) {
				return _Utils_eq(context.heldItem, requiredItem) ? _Utils_Tuple2(
					$elm$core$Array$empty,
					_Utils_update(
						context,
						{
							heldItemContent: $elm$core$Maybe$Just(iota2)
						})) : _Utils_Tuple2(
					$elm$core$Array$fromList(
						_List_fromArray(
							[iota2, iota1])),
					context);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, $author$project$Logic$App$Patterns$OperatorUtils$getPatternList, action);
	});
var $author$project$Logic$App$Patterns$Spells$createWater = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $elm_community$array_extra$Array$Extra$sliceFrom = function (lengthDropped) {
	return function (array) {
		return A3(
			$elm$core$Array$slice,
			lengthDropped,
			$elm$core$Array$length(array),
			array);
	};
};
var $elm_community$array_extra$Array$Extra$sliceUntil = function (lengthNew) {
	return function (array) {
		return A3(
			$elm$core$Array$slice,
			0,
			(lengthNew >= 0) ? lengthNew : ($elm$core$Array$length(array) + lengthNew),
			array);
	};
};
var $elm_community$array_extra$Array$Extra$splitAt = function (index) {
	return function (array) {
		return (index > 0) ? _Utils_Tuple2(
			A2($elm_community$array_extra$Array$Extra$sliceUntil, index, array),
			A2($elm_community$array_extra$Array$Extra$sliceFrom, index, array)) : _Utils_Tuple2($elm$core$Array$empty, array);
	};
};
var $elm_community$array_extra$Array$Extra$removeAt = function (index) {
	return function (array) {
		if (index >= 0) {
			var _v0 = A2($elm_community$array_extra$Array$Extra$splitAt, index, array);
			var beforeIndex = _v0.a;
			var startingAtIndex = _v0.b;
			var lengthStartingAtIndex = $elm$core$Array$length(startingAtIndex);
			return (!lengthStartingAtIndex) ? beforeIndex : A2(
				$elm$core$Array$append,
				beforeIndex,
				A3($elm$core$Array$slice, 1, lengthStartingAtIndex, startingAtIndex));
		} else {
			return array;
		}
	};
};
var $author$project$Logic$App$Patterns$Lists$deconstruct = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'IotaList') {
							var list = iota.a;
							return $elm$core$Array$fromList(
								_List_fromArray(
									[
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Null,
										A2($elm$core$Array$get, 0, list)),
										$author$project$Logic$App$Types$IotaList(
										A2($elm_community$array_extra$Array$Extra$removeAt, 0, list))
									]));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, action);
	});
var $author$project$Logic$App$Patterns$Math$deconstructVector = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v2) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'Vector') {
							var _v1 = iota.a;
							var x = _v1.a;
							var y = _v1.b;
							var z = _v1.c;
							return $elm$core$Array$fromList(
								_List_fromArray(
									[
										$author$project$Logic$App$Types$Number(z),
										$author$project$Logic$App$Types$Number(y),
										$author$project$Logic$App$Types$Number(x)
									]));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector, action);
	});
var $author$project$Logic$App$Patterns$Spells$destroyWater = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $ianmackenzie$elm_geometry$Vector3d$cross = F2(
	function (_v0, _v1) {
		var v2 = _v0.a;
		var v1 = _v1.a;
		return $ianmackenzie$elm_geometry$Geometry$Types$Vector3d(
			{x: (v1.y * v2.z) - (v1.z * v2.y), y: (v1.z * v2.x) - (v1.x * v2.z), z: (v1.x * v2.y) - (v1.y * v2.x)});
	});
var $ianmackenzie$elm_units$Area$inSquareMeters = function (_v0) {
	var numSquareMeters = _v0.a;
	return numSquareMeters;
};
var $ianmackenzie$elm_geometry$Vector3d$xComponent = function (_v0) {
	var v = _v0.a;
	return $ianmackenzie$elm_units$Quantity$Quantity(v.x);
};
var $ianmackenzie$elm_geometry$Vector3d$yComponent = function (_v0) {
	var v = _v0.a;
	return $ianmackenzie$elm_units$Quantity$Quantity(v.y);
};
var $ianmackenzie$elm_geometry$Vector3d$zComponent = function (_v0) {
	var v = _v0.a;
	return $ianmackenzie$elm_units$Quantity$Quantity(v.z);
};
var $ianmackenzie$elm_geometry$Vector3d$toTuple = F2(
	function (fromQuantity, vector) {
		return _Utils_Tuple3(
			fromQuantity(
				$ianmackenzie$elm_geometry$Vector3d$xComponent(vector)),
			fromQuantity(
				$ianmackenzie$elm_geometry$Vector3d$yComponent(vector)),
			fromQuantity(
				$ianmackenzie$elm_geometry$Vector3d$zComponent(vector)));
	});
var $author$project$Logic$App$Patterns$Math$divCross = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v3) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						_v0$4:
						while (true) {
							switch (_v0.a.$) {
								case 'Number':
									switch (_v0.b.$) {
										case 'Number':
											var number1 = _v0.a.a;
											var number2 = _v0.b.a;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Number(number1 / number2));
										case 'Vector':
											var number = _v0.a.a;
											var vector = _v0.b.a;
											var x = vector.a;
											var y = vector.b;
											var z = vector.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(number / x, number / y, number / z)));
										default:
											break _v0$4;
									}
								case 'Vector':
									switch (_v0.b.$) {
										case 'Number':
											var vector = _v0.a.a;
											var number = _v0.b.a;
											var x = vector.a;
											var y = vector.b;
											var z = vector.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(x / number, y / number, z / number)));
										case 'Vector':
											var vector1 = _v0.a.a;
											var vector2 = _v0.b.a;
											var vec2 = A2($ianmackenzie$elm_geometry$Vector3d$fromTuple, $ianmackenzie$elm_units$Length$meters, vector2);
											var vec1 = A2($ianmackenzie$elm_geometry$Vector3d$fromTuple, $ianmackenzie$elm_units$Length$meters, vector1);
											var newVec = A2(
												$ianmackenzie$elm_geometry$Vector3d$toTuple,
												$ianmackenzie$elm_units$Area$inSquareMeters,
												A2($ianmackenzie$elm_geometry$Vector3d$cross, vec2, vec1));
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(newVec));
										default:
											break _v0$4;
									}
								default:
									break _v0$4;
							}
						}
						return A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
	});
var $author$project$Logic$App$Patterns$Stack$dup2 = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v0) {
				return _Utils_Tuple2(
					$elm$core$Array$fromList(
						_List_fromArray(
							[iota2, iota1, iota2, iota1])),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$Stack$duplicate = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v0) {
				return _Utils_Tuple2(
					$elm$core$Array$fromList(
						_List_fromArray(
							[iota, iota])),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$getInteger = function (iota) {
	if (iota.$ === 'Number') {
		var number = iota.a;
		return _Utils_eq(
			$elm$core$Basics$round(number),
			number) ? $elm$core$Maybe$Just(iota) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$Logic$App$Patterns$Stack$duplicateN = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota2.$ === 'Number') {
							var number = iota2.a;
							return $elm$core$Array$fromList(
								A2(
									$elm$core$List$repeat,
									$elm$core$Basics$round(number),
									iota1));
						} else {
							return $elm$core$Array$fromList(
								_List_fromArray(
									[
										$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure)
									]));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getInteger, action);
	});
var $elm$core$Basics$e = _Basics_e;
var $author$project$Logic$App$Patterns$Spells$edify = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$Misc$entityPos = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity);
	});
var $author$project$Logic$App$Patterns$Math$equalTo = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v0) {
				return _Utils_Tuple2(
					A2(
						$elm$core$Array$repeat,
						1,
						$author$project$Logic$App$Types$Boolean(
							A2($author$project$Logic$App$Patterns$OperatorUtils$checkEquality, iota1, iota2))),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$Spells$erase = F2(
	function (stack, ctx) {
		return A2($author$project$Logic$App$Patterns$OperatorUtils$spellNoInput, stack, ctx);
	});
var $author$project$Logic$App$Patterns$Spells$explode = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumber);
	});
var $author$project$Logic$App$Patterns$Spells$explodeFire = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumber);
	});
var $author$project$Logic$App$Patterns$Spells$extinguish = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $elm$core$Array$toIndexedList = function (array) {
	var len = array.a;
	var helper = F2(
		function (entry, _v0) {
			var index = _v0.a;
			var list = _v0.b;
			return _Utils_Tuple2(
				index - 1,
				A2(
					$elm$core$List$cons,
					_Utils_Tuple2(index, entry),
					list));
		});
	return A3(
		$elm$core$Array$foldr,
		helper,
		_Utils_Tuple2(len - 1, _List_Nil),
		array).b;
};
var $elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var x = _v0.a;
			var y = _v0.b;
			var xs = _v1.a;
			var ys = _v1.b;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, x, xs),
				A2($elm$core$List$cons, y, ys));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var $author$project$Logic$App$Utils$Utils$removeFromArray = F3(
	function (start, end, array) {
		var rangeToRemove = A2($elm$core$List$range, start, end - 1);
		var removeRange = function (item) {
			return !A2($elm$core$List$member, item.a, rangeToRemove);
		};
		return $elm$core$Array$fromList(
			$elm$core$List$unzip(
				A2(
					$elm$core$List$filter,
					removeRange,
					$elm$core$Array$toIndexedList(array))).b);
	});
var $author$project$Logic$App$Patterns$Stack$fisherman = F2(
	function (stack, ctx) {
		var newStack = A3(
			$elm$core$Array$slice,
			1,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota = A2($elm$core$Array$get, 0, stack);
		if (maybeIota.$ === 'Nothing') {
			return {
				ctx: ctx,
				stack: A2(
					$elm$core$Array$append,
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas),
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas)
							])),
					newStack),
				success: false
			};
		} else {
			var iota = maybeIota.a;
			var _v1 = $author$project$Logic$App$Patterns$OperatorUtils$getInteger(iota);
			if (_v1.$ === 'Nothing') {
				return {
					ctx: ctx,
					stack: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
						newStack),
					success: false
				};
			} else {
				if (iota.$ === 'Number') {
					var number = iota.a;
					var newNewStack = A3(
						$author$project$Logic$App$Utils$Utils$removeFromArray,
						$elm$core$Basics$round(number) - 1,
						$elm$core$Basics$round(number),
						newStack);
					var maybeCaughtIota = A2(
						$elm$core$Array$get,
						$elm$core$Basics$round(number) - 1,
						newStack);
					if (maybeCaughtIota.$ === 'Nothing') {
						return {
							ctx: ctx,
							stack: A2(
								$author$project$Logic$App$Utils$Utils$unshift,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas),
								stack),
							success: false
						};
					} else {
						var caughtIota = maybeCaughtIota.a;
						return {
							ctx: ctx,
							stack: A2($author$project$Logic$App$Utils$Utils$unshift, caughtIota, newNewStack),
							success: true
						};
					}
				} else {
					return {
						ctx: ctx,
						stack: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure),
							stack),
						success: false
					};
				}
			}
		}
	});
var $author$project$Logic$App$Patterns$Stack$fishermanCopy = F2(
	function (stack, ctx) {
		var newStack = A3(
			$elm$core$Array$slice,
			1,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota = A2($elm$core$Array$get, 0, stack);
		if (maybeIota.$ === 'Nothing') {
			return {
				ctx: ctx,
				stack: A2(
					$elm$core$Array$append,
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas),
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas)
							])),
					newStack),
				success: false
			};
		} else {
			var iota = maybeIota.a;
			var _v1 = $author$project$Logic$App$Patterns$OperatorUtils$getInteger(iota);
			if (_v1.$ === 'Nothing') {
				return {
					ctx: ctx,
					stack: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
						newStack),
					success: false
				};
			} else {
				if (iota.$ === 'Number') {
					var number = iota.a;
					var maybeCaughtIota = A2(
						$elm$core$Array$get,
						$elm$core$Basics$round(number),
						newStack);
					if (maybeCaughtIota.$ === 'Nothing') {
						return {
							ctx: ctx,
							stack: A2(
								$author$project$Logic$App$Utils$Utils$unshift,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas),
								stack),
							success: false
						};
					} else {
						var caughtIota = maybeCaughtIota.a;
						return {
							ctx: ctx,
							stack: A2($author$project$Logic$App$Utils$Utils$unshift, caughtIota, newStack),
							success: true
						};
					}
				} else {
					return {
						ctx: ctx,
						stack: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure),
							stack),
						success: false
					};
				}
			}
		}
	});
var $author$project$Logic$App$Patterns$Math$floorAction = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'Number') {
							var number = iota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									$elm$core$Basics$floor(number)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Types$Player = {$: 'Player'};
var $author$project$Logic$App$Patterns$Selectors$getCaster = F2(
	function (stack, ctx) {
		var action = function (_v0) {
			return _Utils_Tuple2(
				A2(
					$elm$core$Array$repeat,
					1,
					$author$project$Logic$App$Types$Entity($author$project$Logic$App$Types$Player)),
				ctx);
		};
		return A3($author$project$Logic$App$Patterns$OperatorUtils$actionNoInput, stack, ctx, action);
	});
var $author$project$Logic$App$Patterns$Selectors$getEntity = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$Misc$getEntityHeight = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity);
	});
var $author$project$Logic$App$Patterns$Misc$getEntityLook = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity);
	});
var $author$project$Logic$App$Patterns$Misc$getEntityVelocity = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity);
	});
var $author$project$Logic$App$Patterns$Math$greaterThan = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'Number') && (_v0.b.$ === 'Number')) {
							var number1 = _v0.a.a;
							var number2 = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Boolean(
									_Utils_cmp(number1, number2) > 0));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Patterns$Math$greaterThanOrEqualTo = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'Number') && (_v0.b.$ === 'Number')) {
							var number1 = _v0.a.a;
							var number2 = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Boolean(
									_Utils_cmp(number1, number2) > -1));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Patterns$Math$ifBool = F2(
	function (stack, ctx) {
		var action = F4(
			function (iota1, iota2, iota3, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota1.$ === 'Boolean') {
							var bool = iota1.a;
							return bool ? A2($elm$core$Array$repeat, 1, iota2) : A2($elm$core$Array$repeat, 1, iota3);
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A6($author$project$Logic$App$Patterns$OperatorUtils$action3Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$Spells$ignite = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$Lists$index = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'IotaList') && (_v0.b.$ === 'Number')) {
							var list1 = _v0.a.a;
							var number = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								A2(
									$elm$core$Maybe$withDefault,
									$author$project$Logic$App$Types$Null,
									A2(
										$elm$core$Array$get,
										$elm$core$Basics$round(number),
										list1)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Patterns$Lists$indexOf = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota1.$ === 'IotaList') {
							var list = iota1.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									A2(
										$elm$core$Maybe$withDefault,
										_Utils_Tuple2(-1, $author$project$Logic$App$Types$Null),
										$elm$core$List$head(
											A2(
												$elm$core$List$filter,
												function (elm) {
													return A2($author$project$Logic$App$Patterns$OperatorUtils$checkEquality, elm.b, iota2);
												},
												$elm$core$Array$toIndexedList(list)))).a));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$Math$invertBool = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'Boolean') {
							if (iota.a) {
								return A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Boolean(false));
							} else {
								return A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Boolean(true));
							}
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, action);
	});
var $author$project$Logic$App$Patterns$Lists$lastNList = F2(
	function (stack, ctx) {
		var newStack = A3(
			$elm$core$Array$slice,
			1,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota = A2($elm$core$Array$get, 0, stack);
		if (maybeIota.$ === 'Nothing') {
			return {
				ctx: ctx,
				stack: A2(
					$elm$core$Array$append,
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas)
							])),
					newStack),
				success: false
			};
		} else {
			var iota = maybeIota.a;
			var _v1 = $author$project$Logic$App$Patterns$OperatorUtils$getInteger(iota);
			if (_v1.$ === 'Nothing') {
				return {
					ctx: ctx,
					stack: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$IncorrectIota),
						newStack),
					success: false
				};
			} else {
				if (iota.$ === 'Number') {
					var number = iota.a;
					var selectedIotas = $elm_community$array_extra$Array$Extra$reverse(
						A3(
							$elm$core$Array$slice,
							0,
							$elm$core$Basics$round(number),
							newStack));
					var newNewStack = A3(
						$author$project$Logic$App$Utils$Utils$removeFromArray,
						0,
						$elm$core$Basics$round(number),
						newStack);
					return (_Utils_cmp(
						$elm$core$Basics$round(number),
						$elm$core$Array$length(newStack)) > 0) ? {
						ctx: ctx,
						stack: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$NotEnoughIotas),
							newStack),
						success: false
					} : {
						ctx: ctx,
						stack: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$IotaList(selectedIotas),
							newNewStack),
						success: true
					};
				} else {
					return {
						ctx: ctx,
						stack: $elm$core$Array$fromList(
							_List_fromArray(
								[
									$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure)
								])),
						success: false
					};
				}
			}
		}
	});
var $author$project$Logic$App$Patterns$Math$lessThan = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'Number') && (_v0.b.$ === 'Number')) {
							var number1 = _v0.a.a;
							var number2 = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Boolean(
									_Utils_cmp(number1, number2) < 0));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Patterns$Math$lessThanOrEqualTo = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'Number') && (_v0.b.$ === 'Number')) {
							var number1 = _v0.a.a;
							var number2 = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Boolean(
									_Utils_cmp(number1, number2) < 1));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Patterns$Lists$listRemove = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'IotaList') && (_v0.b.$ === 'Number')) {
							var list1 = _v0.a.a;
							var number = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$IotaList(
									A2(
										$elm_community$array_extra$Array$Extra$removeAt,
										$elm$core$Basics$round(number),
										list1)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getInteger, action);
	});
var $author$project$Logic$App$Patterns$Lists$listSize = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'IotaList') {
							var list = iota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									$elm$core$Array$length(list)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, action);
	});
var $author$project$Logic$App$Patterns$Math$logarithm = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'Number') && (_v0.b.$ === 'Number')) {
							var number1 = _v0.a.a;
							var number2 = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									A2($elm$core$Basics$logBase, number2, number1)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$makeConstant = F3(
	function (iota, stack, ctx) {
		return {
			ctx: ctx,
			stack: A2($author$project$Logic$App$Utils$Utils$unshift, iota, stack),
			success: true
		};
	});
var $author$project$Logic$App$Types$Backspace = {$: 'Backspace'};
var $author$project$Logic$App$Types$ClearPatterns = {$: 'ClearPatterns'};
var $author$project$Logic$App$Types$Reset = {$: 'Reset'};
var $author$project$Logic$App$Types$Wrap = {$: 'Wrap'};
var $author$project$Logic$App$Patterns$PatternRegistry$metapatternRegistry = A2(
	$elm$core$List$map,
	function (pattern) {
		return {action: pattern.action, active: true, color: $author$project$Settings$Theme$accent1, displayName: pattern.displayName, internalName: pattern.internalName, metaAction: pattern.metaAction, outputOptions: pattern.outputOptions, selectedOutput: pattern.selectedOutput, signature: pattern.signature, startDirection: $author$project$Logic$App$Types$East};
	},
	_List_fromArray(
		[
			{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: 'Clear', internalName: 'clearPatterns', metaAction: $author$project$Logic$App$Types$ClearPatterns, outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqq'},
			{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: 'Reset', internalName: 'resetApp', metaAction: $author$project$Logic$App$Types$Reset, outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqqqa'},
			{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: 'Backspace', internalName: 'backspace', metaAction: $author$project$Logic$App$Types$Backspace, outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qa'},
			{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: 'Wrap', internalName: 'wrap', metaAction: $author$project$Logic$App$Types$Wrap, outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qwqqqwq'}
		]));
var $author$project$Logic$App$Patterns$OperatorUtils$getPositiveInteger = function (iota) {
	if (iota.$ === 'Number') {
		var number = iota.a;
		return (_Utils_eq(
			$elm$core$Basics$round(number),
			number) && ($elm$core$Basics$round(number) >= 0)) ? $elm$core$Maybe$Just(iota) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Patterns$Lists$modifyinPlace = F2(
	function (stack, ctx) {
		var action = F4(
			function (iota1, iota2, iota3, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'IotaList') && (_v0.b.$ === 'Number')) {
							var list = _v0.a.a;
							var number = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$IotaList(
									A3(
										$elm$core$Array$set,
										$elm$core$Basics$round(number),
										iota3,
										list)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A6($author$project$Logic$App$Patterns$OperatorUtils$action3Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getPositiveInteger, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $elm$core$Basics$truncate = _Basics_truncate;
var $ianmackenzie$elm_units$Quantity$fractionalRemainderBy = F2(
	function (_v0, _v1) {
		var modulus = _v0.a;
		var value = _v1.a;
		return $ianmackenzie$elm_units$Quantity$Quantity(value - (modulus * ((value / modulus) | 0)));
	});
var $author$project$Logic$App$Patterns$Math$modulo = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'Number') && (_v0.b.$ === 'Number')) {
							var number1 = _v0.a.a;
							var number2 = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									$ianmackenzie$elm_units$Quantity$unwrap(
										A2(
											$ianmackenzie$elm_units$Quantity$fractionalRemainderBy,
											$ianmackenzie$elm_units$Quantity$Quantity(number2),
											$ianmackenzie$elm_units$Quantity$Quantity(number1)))));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $ianmackenzie$elm_geometry$Vector3d$dot = F2(
	function (_v0, _v1) {
		var v2 = _v0.a;
		var v1 = _v1.a;
		return $ianmackenzie$elm_units$Quantity$Quantity(((v1.x * v2.x) + (v1.y * v2.y)) + (v1.z * v2.z));
	});
var $author$project$Logic$App$Patterns$Math$mulDot = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v3) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						_v0$4:
						while (true) {
							switch (_v0.a.$) {
								case 'Number':
									switch (_v0.b.$) {
										case 'Number':
											var number1 = _v0.a.a;
											var number2 = _v0.b.a;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Number(number1 * number2));
										case 'Vector':
											var number = _v0.a.a;
											var vector = _v0.b.a;
											var x = vector.a;
											var y = vector.b;
											var z = vector.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(number * x, number * y, number * z)));
										default:
											break _v0$4;
									}
								case 'Vector':
									switch (_v0.b.$) {
										case 'Number':
											var vector = _v0.a.a;
											var number = _v0.b.a;
											var x = vector.a;
											var y = vector.b;
											var z = vector.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(x * number, y * number, z * number)));
										case 'Vector':
											var vector1 = _v0.a.a;
											var vector2 = _v0.b.a;
											var vec2 = A2($ianmackenzie$elm_geometry$Vector3d$fromTuple, $ianmackenzie$elm_units$Length$meters, vector2);
											var vec1 = A2($ianmackenzie$elm_geometry$Vector3d$fromTuple, $ianmackenzie$elm_units$Length$meters, vector1);
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Number(
													$ianmackenzie$elm_units$Quantity$unwrap(
														A2($ianmackenzie$elm_geometry$Vector3d$dot, vec2, vec1))));
										default:
											break _v0$4;
									}
								default:
									break _v0$4;
							}
						}
						return A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
	});
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $author$project$Logic$App$Patterns$Math$notBit = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'Number') {
							var number = iota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									~$elm$core$Basics$round(number)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getInteger, action);
	});
var $author$project$Logic$App$Patterns$Math$notEqualTo = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v0) {
				return _Utils_Tuple2(
					A2(
						$elm$core$Array$repeat,
						1,
						$author$project$Logic$App$Types$Boolean(
							!A2($author$project$Logic$App$Patterns$OperatorUtils$checkEquality, iota1, iota2))),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $author$project$Logic$App$Patterns$Math$orBit = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						_v0$2:
						while (true) {
							switch (_v0.a.$) {
								case 'Number':
									if (_v0.b.$ === 'Number') {
										var number1 = _v0.a.a;
										var number2 = _v0.b.a;
										return A2(
											$elm$core$Array$repeat,
											1,
											$author$project$Logic$App$Types$Number(
												$elm$core$Basics$round(number1) | $elm$core$Basics$round(number2)));
									} else {
										break _v0$2;
									}
								case 'IotaList':
									if (_v0.b.$ === 'IotaList') {
										var list1 = _v0.a.a;
										var list2 = _v0.b.a;
										return A2(
											$elm$core$Array$repeat,
											1,
											$author$project$Logic$App$Types$IotaList(
												A2(
													$elm$core$Array$append,
													list1,
													A2(
														$elm$core$Array$filter,
														function (iota) {
															return !A2(
																$elm$core$List$any,
																$author$project$Logic$App$Patterns$OperatorUtils$checkEquality(iota),
																$elm$core$Array$toList(list1));
														},
														list2))));
									} else {
										break _v0$2;
									}
								default:
									break _v0$2;
							}
						}
						return A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, action);
	});
var $author$project$Logic$App$Patterns$Math$orBool = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'Boolean') && (_v0.b.$ === 'Boolean')) {
							var bool1 = _v0.a.a;
							var bool2 = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Boolean(bool1 || bool2));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, action);
	});
var $author$project$Logic$App$Patterns$Stack$over = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v0) {
				return _Utils_Tuple2(
					$elm$core$Array$fromList(
						_List_fromArray(
							[iota1, iota2, iota1])),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$Spells$placeBlock = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$Spells$potion = F2(
	function (stack, ctx) {
		return A5($author$project$Logic$App$Patterns$OperatorUtils$spell3Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber);
	});
var $author$project$Logic$App$Patterns$Spells$potionFixedPotency = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, $author$project$Logic$App$Patterns$OperatorUtils$getNumber);
	});
var $author$project$Logic$App$Patterns$Math$powProj = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v4) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						_v0$4:
						while (true) {
							switch (_v0.a.$) {
								case 'Number':
									switch (_v0.b.$) {
										case 'Number':
											var number1 = _v0.a.a;
											var number2 = _v0.b.a;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Number(
													A2($elm$core$Basics$pow, number1, number2)));
										case 'Vector':
											var number = _v0.a.a;
											var vector = _v0.b.a;
											var x = vector.a;
											var y = vector.b;
											var z = vector.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(
														A2($elm$core$Basics$pow, number, x),
														A2($elm$core$Basics$pow, number, y),
														A2($elm$core$Basics$pow, number, z))));
										default:
											break _v0$4;
									}
								case 'Vector':
									switch (_v0.b.$) {
										case 'Number':
											var vector = _v0.a.a;
											var number = _v0.b.a;
											var x = vector.a;
											var y = vector.b;
											var z = vector.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(
														A2($elm$core$Basics$pow, x, number),
														A2($elm$core$Basics$pow, y, number),
														A2($elm$core$Basics$pow, z, number))));
										case 'Vector':
											var vector1Tuple = _v0.a.a;
											var vector2Tuple = _v0.b.a;
											var vector2 = A2($ianmackenzie$elm_geometry$Vector3d$fromTuple, $ianmackenzie$elm_units$Length$meters, vector2Tuple);
											var vector1 = A2($ianmackenzie$elm_geometry$Vector3d$fromTuple, $ianmackenzie$elm_units$Length$meters, vector1Tuple);
											var mapFunction = function (number) {
												return (number * $ianmackenzie$elm_units$Quantity$unwrap(
													A2($ianmackenzie$elm_geometry$Vector3d$dot, vector1, vector2))) / $ianmackenzie$elm_units$Quantity$unwrap(
													A2($ianmackenzie$elm_geometry$Vector3d$dot, vector1, vector1));
											};
											var x = vector1Tuple.a;
											var y = vector1Tuple.b;
											var z = vector1Tuple.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(
														mapFunction(x),
														mapFunction(y),
														mapFunction(z))));
										default:
											break _v0$4;
									}
								default:
									break _v0$4;
							}
						}
						return A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
	});
var $author$project$Logic$App$Patterns$Misc$print = F2(
	function (stack, ctx) {
		return A4(
			$author$project$Logic$App$Patterns$OperatorUtils$action1Input,
			stack,
			ctx,
			$author$project$Logic$App$Patterns$OperatorUtils$getAny,
			F2(
				function (iota, _v0) {
					return _Utils_Tuple2(
						$elm$core$Array$fromList(
							_List_fromArray(
								[iota])),
						ctx);
				}));
	});
var $author$project$Logic$App$Patterns$Misc$raycast = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$Misc$raycastAxis = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$Misc$raycastEntity = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$ReadWrite$read = F2(
	function (stack, ctx) {
		var action = function (context) {
			return _Utils_Tuple2(
				function () {
					var _v0 = context.heldItem;
					switch (_v0.$) {
						case 'NoItem':
							return $elm$core$Array$empty;
						case 'Trinket':
							return $elm$core$Array$empty;
						case 'Cypher':
							return $elm$core$Array$empty;
						case 'Artifact':
							return $elm$core$Array$empty;
						case 'Focus':
							return $elm$core$Array$fromList(
								_List_fromArray(
									[
										A2($elm$core$Maybe$withDefault, $author$project$Logic$App$Types$Null, context.heldItemContent)
									]));
						case 'Spellbook':
							return $elm$core$Array$fromList(
								_List_fromArray(
									[
										A2($elm$core$Maybe$withDefault, $author$project$Logic$App$Types$Null, context.heldItemContent)
									]));
						default:
							return $elm$core$Array$fromList(
								_List_fromArray(
									[
										$author$project$Logic$App$Types$Number($elm$core$Basics$pi)
									]));
					}
				}(),
				context);
		};
		return A3($author$project$Logic$App$Patterns$OperatorUtils$actionNoInput, stack, ctx, action);
	});
var $author$project$Logic$App$Patterns$ReadWrite$readLocal = F2(
	function (stack, ctx) {
		var action = function (context) {
			var _v0 = context.ravenmind;
			if (_v0.$ === 'Nothing') {
				return _Utils_Tuple2(
					A2($elm$core$Array$repeat, 1, $author$project$Logic$App$Types$Null),
					context);
			} else {
				var iota = _v0.a;
				return _Utils_Tuple2(
					A2($elm$core$Array$repeat, 1, iota),
					context);
			}
		};
		return A3($author$project$Logic$App$Patterns$OperatorUtils$actionNoInput, stack, ctx, action);
	});
var $author$project$Logic$App$Patterns$ReadWrite$readable = F2(
	function (stack, ctx) {
		var action = function (context) {
			var _v0 = context.heldItem;
			switch (_v0.$) {
				case 'NoItem':
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 'Trinket':
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 'Cypher':
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 'Artifact':
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 'Focus':
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(true)),
						context);
				case 'Spellbook':
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(true)),
						context);
				default:
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(true)),
						context);
			}
		};
		return A3($author$project$Logic$App$Patterns$OperatorUtils$actionNoInput, stack, ctx, action);
	});
var $author$project$Logic$App$Patterns$Spells$recharge = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity);
	});
var $author$project$Logic$App$Patterns$Lists$reverseList = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'IotaList') {
							var list = iota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$IotaList(
									$elm_community$array_extra$Array$Extra$reverse(list)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, action);
	});
var $author$project$Logic$App$Patterns$Stack$rotate = F2(
	function (stack, ctx) {
		var action = F4(
			function (iota1, iota2, iota3, _v0) {
				return _Utils_Tuple2(
					$elm$core$Array$fromList(
						_List_fromArray(
							[iota1, iota3, iota2])),
					ctx);
			});
		return A6($author$project$Logic$App$Patterns$OperatorUtils$action3Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$Stack$rotateReverse = F2(
	function (stack, ctx) {
		var action = F4(
			function (iota1, iota2, iota3, _v0) {
				return _Utils_Tuple2(
					$elm$core$Array$fromList(
						_List_fromArray(
							[iota2, iota1, iota3])),
					ctx);
			});
		return A6($author$project$Logic$App$Patterns$OperatorUtils$action3Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$getPatternIota = function (iota) {
	if (iota.$ === 'PatternIota') {
		return $elm$core$Maybe$Just(iota);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Patterns$Misc$saveMacro = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, context) {
				var _v0 = _Utils_Tuple2(iota1, iota2);
				if (_v0.b.$ === 'PatternIota') {
					var value = _v0.a;
					var _v1 = _v0.b;
					var key = _v1.a;
					return _Utils_Tuple2(
						$elm$core$Array$empty,
						_Utils_update(
							context,
							{
								macros: A3(
									$elm$core$Dict$insert,
									key.signature,
									_Utils_Tuple3('Unnamed Macro', key.startDirection, value),
									context.macros)
							}));
				} else {
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure)),
						ctx);
				}
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getPatternIota, action);
	});
var $author$project$Logic$App$Patterns$Spells$sentinelCreate = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$Spells$sentinelDestroy = F2(
	function (stack, ctx) {
		return A2($author$project$Logic$App$Patterns$OperatorUtils$spellNoInput, stack, ctx);
	});
var $author$project$Logic$App$Patterns$Spells$sentinelGetPos = F2(
	function (stack, ctx) {
		return A3(
			$author$project$Logic$App$Patterns$OperatorUtils$actionNoInput,
			stack,
			ctx,
			function (_v0) {
				return _Utils_Tuple2(
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$Logic$App$Types$Vector(
								_Utils_Tuple3(0, 0, 0))
							])),
					ctx);
			});
	});
var $author$project$Logic$App$Patterns$Spells$sentinelWayfind = F2(
	function (stack, ctx) {
		return A4(
			$author$project$Logic$App$Patterns$OperatorUtils$action1Input,
			stack,
			ctx,
			$author$project$Logic$App$Patterns$OperatorUtils$getVector,
			F2(
				function (_v0, _v1) {
					return _Utils_Tuple2(
						$elm$core$Array$fromList(
							_List_fromArray(
								[
									$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(0, 0, 0))
								])),
						ctx);
				}));
	});
var $author$project$Logic$App$Patterns$Math$sine = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'Number') {
							var number = iota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									$elm$core$Basics$sin(number)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Patterns$Lists$singleton = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v0) {
				return _Utils_Tuple2(
					A2(
						$elm$core$Array$repeat,
						1,
						$author$project$Logic$App$Types$IotaList(
							A2($elm$core$Array$repeat, 1, iota))),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$Lists$slice = F2(
	function (stack, ctx) {
		var action = F4(
			function (iota1, iota2, iota3, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple3(iota1, iota2, iota3);
						if (((_v0.a.$ === 'IotaList') && (_v0.b.$ === 'Number')) && (_v0.c.$ === 'Number')) {
							var list = _v0.a.a;
							var number1 = _v0.b.a;
							var number2 = _v0.c.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$IotaList(
									A3(
										$elm$core$Array$slice,
										$elm$core$Basics$round(number1),
										$elm$core$Basics$round(number2),
										list)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A6($author$project$Logic$App$Patterns$OperatorUtils$action3Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getPositiveInteger, $author$project$Logic$App$Patterns$OperatorUtils$getPositiveInteger, action);
	});
var $author$project$Logic$App$Patterns$Lists$splat = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'IotaList') {
							var list = iota.a;
							return $elm_community$array_extra$Array$Extra$reverse(list);
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, action);
	});
var $author$project$Logic$App$Patterns$Stack$stackLength = F2(
	function (stack, ctx) {
		return A3(
			$author$project$Logic$App$Patterns$OperatorUtils$actionNoInput,
			stack,
			ctx,
			function (_v0) {
				return _Utils_Tuple2(
					A2(
						$elm$core$Array$repeat,
						1,
						$author$project$Logic$App$Types$Number(
							$elm$core$Array$length(stack))),
					ctx);
			});
	});
var $author$project$Logic$App$Patterns$Math$subtract = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v6) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						_v0$4:
						while (true) {
							switch (_v0.a.$) {
								case 'Number':
									switch (_v0.b.$) {
										case 'Number':
											var number1 = _v0.a.a;
											var number2 = _v0.b.a;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Number(number1 - number2));
										case 'Vector':
											var number = _v0.a.a;
											var vector = _v0.b.a;
											var x = vector.a;
											var y = vector.b;
											var z = vector.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(number - x, number - y, number - z)));
										default:
											break _v0$4;
									}
								case 'Vector':
									switch (_v0.b.$) {
										case 'Number':
											var vector = _v0.a.a;
											var number = _v0.b.a;
											var x = vector.a;
											var y = vector.b;
											var z = vector.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(x - number, y - number, z - number)));
										case 'Vector':
											var vector1 = _v0.a.a;
											var vector2 = _v0.b.a;
											var _v3 = _Utils_Tuple2(vector1, vector2);
											var _v4 = _v3.a;
											var x1 = _v4.a;
											var y1 = _v4.b;
											var z1 = _v4.c;
											var _v5 = _v3.b;
											var x2 = _v5.a;
											var y2 = _v5.b;
											var z2 = _v5.c;
											return A2(
												$elm$core$Array$repeat,
												1,
												$author$project$Logic$App$Types$Vector(
													_Utils_Tuple3(x1 - x2, y1 - y2, z1 - z2)));
										default:
											break _v0$4;
									}
								default:
									break _v0$4;
							}
						}
						return A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
	});
var $author$project$Logic$App$Patterns$Stack$swap = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v0) {
				return _Utils_Tuple2(
					$elm$core$Array$fromList(
						_List_fromArray(
							[iota1, iota2])),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $elm$core$Basics$tan = _Basics_tan;
var $author$project$Logic$App$Patterns$Math$tangent = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'Number') {
							var number = iota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Number(
									$elm$core$Basics$tan(number)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Patterns$Math$toSet = F2(
	function (stack, ctx) {
		var constructSet = F2(
			function (iota, out) {
				return A2(
					$elm$core$List$any,
					$author$project$Logic$App$Patterns$OperatorUtils$checkEquality(iota),
					$elm$core$Array$toList(out)) ? out : A2($elm$core$Array$push, iota, out);
			});
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota.$ === 'IotaList') {
							var list = iota.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$IotaList(
									A3($elm$core$Array$foldl, constructSet, $elm$core$Array$empty, list)));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, action);
	});
var $author$project$Logic$App$Patterns$Stack$tuck = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v0) {
				return _Utils_Tuple2(
					$elm$core$Array$fromList(
						_List_fromArray(
							[iota2, iota1, iota2])),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$ReadWrite$writable = F2(
	function (stack, ctx) {
		var action = function (context) {
			var _v0 = context.heldItem;
			switch (_v0.$) {
				case 'NoItem':
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 'Trinket':
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 'Cypher':
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 'Artifact':
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 'Focus':
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(true)),
						context);
				case 'Spellbook':
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(true)),
						context);
				default:
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
			}
		};
		return A3($author$project$Logic$App$Patterns$OperatorUtils$actionNoInput, stack, ctx, action);
	});
var $author$project$Logic$App$Patterns$ReadWrite$write = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, context) {
				var _v0 = context.heldItem;
				switch (_v0.$) {
					case 'NoItem':
						return _Utils_Tuple2(
							$elm$core$Array$fromList(
								_List_fromArray(
									[iota])),
							context);
					case 'Trinket':
						return _Utils_Tuple2(
							$elm$core$Array$fromList(
								_List_fromArray(
									[iota])),
							context);
					case 'Cypher':
						return _Utils_Tuple2(
							$elm$core$Array$fromList(
								_List_fromArray(
									[iota])),
							context);
					case 'Artifact':
						return _Utils_Tuple2(
							$elm$core$Array$fromList(
								_List_fromArray(
									[iota])),
							context);
					case 'Focus':
						return _Utils_Tuple2(
							$elm$core$Array$empty,
							_Utils_update(
								context,
								{
									heldItemContent: $elm$core$Maybe$Just(iota)
								}));
					case 'Spellbook':
						return _Utils_Tuple2(
							$elm$core$Array$empty,
							_Utils_update(
								context,
								{
									heldItemContent: $elm$core$Maybe$Just(iota)
								}));
					default:
						return _Utils_Tuple2(
							$elm$core$Array$fromList(
								_List_fromArray(
									[iota])),
							context);
				}
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $author$project$Logic$App$Patterns$ReadWrite$writeLocal = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, context) {
				return _Utils_Tuple2(
					$elm$core$Array$empty,
					_Utils_update(
						context,
						{
							ravenmind: $elm$core$Maybe$Just(iota)
						}));
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $author$project$Logic$App$Patterns$Math$xorBit = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						_v0$2:
						while (true) {
							switch (_v0.a.$) {
								case 'Number':
									if (_v0.b.$ === 'Number') {
										var number1 = _v0.a.a;
										var number2 = _v0.b.a;
										return A2(
											$elm$core$Array$repeat,
											1,
											$author$project$Logic$App$Types$Number(
												$elm$core$Basics$round(number1) ^ $elm$core$Basics$round(number2)));
									} else {
										break _v0$2;
									}
								case 'IotaList':
									if (_v0.b.$ === 'IotaList') {
										var list1 = _v0.a.a;
										var list2 = _v0.b.a;
										return A2(
											$elm$core$Array$repeat,
											1,
											$author$project$Logic$App$Types$IotaList(
												A2(
													$elm$core$Array$append,
													A2(
														$elm$core$Array$filter,
														function (iota) {
															return !A2(
																$elm$core$List$any,
																$author$project$Logic$App$Patterns$OperatorUtils$checkEquality(iota),
																$elm$core$Array$toList(list1));
														},
														list2),
													A2(
														$elm$core$Array$filter,
														function (iota) {
															return !A2(
																$elm$core$List$any,
																$author$project$Logic$App$Patterns$OperatorUtils$checkEquality(iota),
																$elm$core$Array$toList(list2));
														},
														list1))));
									} else {
										break _v0$2;
									}
								default:
									break _v0$2;
							}
						}
						return A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, action);
	});
var $elm$core$Basics$xor = _Basics_xor;
var $author$project$Logic$App$Patterns$Math$xorBool = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
						var _v0 = _Utils_Tuple2(iota1, iota2);
						if ((_v0.a.$ === 'Boolean') && (_v0.b.$ === 'Boolean')) {
							var bool1 = _v0.a.a;
							var bool2 = _v0.b.a;
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Boolean(bool1 !== bool2));
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage($author$project$Logic$App$Types$CatastrophicFailure));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, action);
	});
var $author$project$Logic$App$Patterns$Selectors$zoneEntity = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumber);
	});
var $author$project$Logic$App$Patterns$PatternRegistry$patternRegistry = _Utils_ap(
	$author$project$Logic$App$Patterns$PatternRegistry$metapatternRegistry,
	A2(
		$elm$core$List$map,
		function (pattern) {
			return {action: pattern.action, active: true, color: $author$project$Settings$Theme$accent1, displayName: pattern.displayName, internalName: pattern.internalName, metaAction: $author$project$Logic$App$Types$None, outputOptions: pattern.outputOptions, selectedOutput: pattern.selectedOutput, signature: pattern.signature, startDirection: pattern.startDirection};
		},
		_List_fromArray(
			[
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: '', internalName: 'interop/gravity/get', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wawawddew', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: '', internalName: 'interop/gravity/set', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wdwdwaaqw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: '', internalName: 'interop/pehkui/get', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aawawwawwa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: '', internalName: 'interop/pehkui/set', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'ddwdwwdwwd', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Selectors$getCaster, displayName: 'Mind\'s Reflection', internalName: 'get_caster', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qaq', startDirection: $author$project$Logic$App$Types$Northeast},
				{
				action: $author$project$Logic$App$Patterns$Misc$entityPos,
				displayName: 'Compass\' Purification',
				internalName: 'entity_pos/eye',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$VectorType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$VectorType,
						$author$project$Logic$App$Types$Vector(
							_Utils_Tuple3(0, 0, 0)))),
				signature: 'aa',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Misc$entityPos,
				displayName: 'Compass\' Purification II',
				internalName: 'entity_pos/foot',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$VectorType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$VectorType,
						$author$project$Logic$App$Types$Vector(
							_Utils_Tuple3(0, 0, 0)))),
				signature: 'dd',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Misc$getEntityLook,
				displayName: 'Alidade\'s Purification',
				internalName: 'get_entity_look',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$VectorType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$VectorType,
						$author$project$Logic$App$Types$Vector(
							_Utils_Tuple3(0, 0, 0)))),
				signature: 'wa',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Misc$getEntityHeight,
				displayName: 'Stadiometer\'s Purification',
				internalName: 'get_entity_height',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$NumberType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$NumberType,
						$author$project$Logic$App$Types$Number(0))),
				signature: 'awq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Misc$getEntityVelocity,
				displayName: 'Pace Purification',
				internalName: 'get_entity_velocity',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$VectorType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$VectorType,
						$author$project$Logic$App$Types$Vector(
							_Utils_Tuple3(0, 0, 0)))),
				signature: 'wq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Misc$raycast,
				displayName: 'Archer\'s Distillation',
				internalName: 'raycast',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$VectorType, $author$project$Logic$App$Types$NullType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$VectorType,
						$author$project$Logic$App$Types$Vector(
							_Utils_Tuple3(0, 0, 0)))),
				signature: 'wqaawdd',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Misc$raycastAxis,
				displayName: 'Architect\'s Distillation',
				internalName: 'raycast/axis',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$VectorType, $author$project$Logic$App$Types$NullType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$VectorType,
						$author$project$Logic$App$Types$Vector(
							_Utils_Tuple3(0, 0, 0)))),
				signature: 'weddwaa',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Misc$raycastEntity,
				displayName: 'Scout\'s Distillation',
				internalName: 'raycast/entity',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$EntityType,
						$author$project$Logic$App$Types$Entity($author$project$Logic$App$Types$Unset))),
				signature: 'weaqa',
				startDirection: $author$project$Logic$App$Types$East
			},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: 'Waystone Reflection', internalName: 'circle/impetus_pos', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'eaqwqae', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Circles$circleImpetusDirection, displayName: 'Lodestone Reflection', internalName: 'circle/impetus_dir', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'eaqwqaewede', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Circles$circleBoundsMin, displayName: 'Lesser Fold Reflection', internalName: 'circle/bounds/min', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'eaqwqaewdd', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Circles$circleBoundsMax, displayName: 'Greater Fold Reflection', internalName: 'circle/bounds/max', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aqwqawaaqa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Stack$swap, displayName: 'Jester\'s Gambit', internalName: 'swap', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aawdd', startDirection: $author$project$Logic$App$Types$Northeast},
				{action: $author$project$Logic$App$Patterns$Stack$rotate, displayName: 'Rotation Gambit', internalName: 'rotate', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aaeaa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Stack$rotateReverse, displayName: 'Rotation Gambit II', internalName: 'rotate_reverse', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'ddqdd', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Stack$duplicate, displayName: 'Gemini Decomposition', internalName: 'duplicate', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aadaa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Stack$over, displayName: 'Prospector\'s Gambit', internalName: 'over', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aaedd', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Stack$tuck, displayName: 'Undertaker\'s Gambit', internalName: 'tuck', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'ddqaa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Stack$dup2, displayName: 'Dioscuri Gambit', internalName: 'two_dup', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aadadaaw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Stack$stackLength, displayName: 'Flock\'s Reflection', internalName: 'stack_len', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qwaeawqaeaqa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Stack$duplicateN, displayName: 'Gemini Gambit', internalName: 'duplicate_n', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aadaadaa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Stack$fisherman, displayName: 'Fisherman\'s Gambit', internalName: 'fisherman', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'ddad', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Stack$fishermanCopy, displayName: 'Fisherman\'s Gambit II', internalName: 'fisherman/copy', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aada', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: '', internalName: 'swizzle', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qaawdde', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$add, displayName: 'Additive Distillation', internalName: 'add', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'waaw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$subtract, displayName: 'Subtractive Distillation', internalName: 'sub', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wddw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$mulDot, displayName: 'Multiplicative Distillation', internalName: 'mul_dot', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'waqaw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$divCross, displayName: 'Division Distillation', internalName: 'div_cross', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wdedw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$absLen, displayName: 'Length Purification', internalName: 'abs_len', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wqaqw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$powProj, displayName: 'Power Distillation', internalName: 'pow_proj', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wedew', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$floorAction, displayName: 'Floor Purification', internalName: 'floor', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'ewq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$ceilAction, displayName: 'Ceiling Purification', internalName: 'ceil', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qwe', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$constructVector, displayName: 'Vector Exaltation', internalName: 'construct_vec', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'eqqqqq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$deconstructVector, displayName: 'Vector Disintegration', internalName: 'deconstruct_vec', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qeeeee', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$coerceAxial, displayName: 'Axial Purification', internalName: 'coerce_axial', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqqqaww', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$andBool, displayName: 'Conjunction Distillation', internalName: 'and', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wdw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$orBool, displayName: 'Disjunction Distillation', internalName: 'or', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'waw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$xorBool, displayName: 'Exclusion Distillation', internalName: 'xor', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'dwa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$greaterThan, displayName: 'Maximus Distillation', internalName: 'greater', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'e', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$lessThan, displayName: 'Minimus Distillation', internalName: 'less', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'q', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$greaterThanOrEqualTo, displayName: 'Maximus Distillation II', internalName: 'greater_eq', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'ee', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$lessThanOrEqualTo, displayName: 'Minimus Distillation II', internalName: 'less_eq', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$equalTo, displayName: 'Equality Distillation', internalName: 'equals', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'ad', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$notEqualTo, displayName: 'Inequality Distillation', internalName: 'not_equals', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'da', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$invertBool, displayName: 'Negation Purification', internalName: 'not', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'dw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$boolCoerce, displayName: 'Augur\'s Purification', internalName: 'bool_coerce', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$ifBool, displayName: 'Augur\'s Exaltation', internalName: 'if', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'awdd', startDirection: $author$project$Logic$App$Types$East},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Number(0.5)),
				displayName: 'Entropy Reflection',
				internalName: 'random',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'eqqq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{action: $author$project$Logic$App$Patterns$Math$sine, displayName: 'Sine Purification', internalName: 'sin', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqqqaa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$cosine, displayName: 'Cosine Purification', internalName: 'cos', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqqqad', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$tangent, displayName: 'Tangent Purification', internalName: 'tan', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wqqqqqadq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$arcsin, displayName: 'Inverse Sine Purification', internalName: 'arcsin', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'ddeeeee', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$arccos, displayName: 'Inverse Cosine Purification', internalName: 'arccos', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'adeeeee', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$arctan, displayName: 'Inverse Tangent Purification', internalName: 'arctan', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'eadeeeeew', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$logarithm, displayName: 'Logarithmic Distillation', internalName: 'logarithm', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'eqaqe', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$modulo, displayName: 'Modulus Distillation', internalName: 'modulo', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'addwaad', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$andBit, displayName: 'Intersection Distillation', internalName: 'and_bit', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wdweaqa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$orBit, displayName: 'Unifying Distillation', internalName: 'or_bit', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'waweaqa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$xorBit, displayName: 'Exclusionary Distillation', internalName: 'xor_bit', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'dwaeaqa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$notBit, displayName: 'Inversion Purification', internalName: 'not_bit', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'dweaqa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Math$toSet, displayName: 'Uniqueness Purification', internalName: 'to_set', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aweaqa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Misc$print, displayName: 'Reveal', internalName: 'print', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'de', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$explode, displayName: 'Explosion', internalName: 'explode', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aawaawaa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$explodeFire, displayName: 'Fireball', internalName: 'explode/fire', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'ddwddwdd', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$addMotion, displayName: 'Impulse', internalName: 'add_motion', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'awqqqwaqw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$blink, displayName: 'Blink', internalName: 'blink', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'awqqqwaq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$breakBlock, displayName: 'Break Block', internalName: 'break_block', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qaqqqqq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$placeBlock, displayName: 'Place Block', internalName: 'place_block', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'eeeeede', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$colorize, displayName: 'Internalize Pigment', internalName: 'colorize', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'awddwqawqwawq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$createWater, displayName: 'Create Water', internalName: 'create_water', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aqawqadaq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$destroyWater, displayName: 'Destroy Liquid', internalName: 'destroy_water', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'dedwedade', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$ignite, displayName: 'Ignite Block', internalName: 'ignite', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aaqawawa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$extinguish, displayName: 'Extinguish Area', internalName: 'extinguish', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'ddedwdwd', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$conjureBlock, displayName: 'Conjure Block', internalName: 'conjure_block', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$conjureLight, displayName: 'Conjure Light', internalName: 'conjure_light', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqd', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$bonemeal, displayName: 'Overgrow', internalName: 'bonemeal', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wqaqwawqaqw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$recharge, displayName: 'Recharge Item', internalName: 'recharge', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqqqwaeaeaeaeaea', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$erase, displayName: 'Erase Item', internalName: 'erase', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qdqawwaww', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$edify, displayName: 'Edify Sapling', internalName: 'edify', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wqaqwd', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$beep, displayName: 'Make Note', internalName: 'beep', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'adaa', startDirection: $author$project$Logic$App$Types$East},
				{
				action: $author$project$Logic$App$Patterns$Spells$craftArtifact($author$project$Logic$App$Types$Cypher),
				displayName: 'Craft Cypher',
				internalName: 'craft/cypher',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'waqqqqq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Spells$craftArtifact($author$project$Logic$App$Types$Trinket),
				displayName: 'Craft Trinket',
				internalName: 'craft/trinket',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'wwaqqqqqeaqeaeqqqeaeq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Spells$craftArtifact($author$project$Logic$App$Types$Artifact),
				displayName: 'Craft Artifact',
				internalName: 'craft/artifact',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'wwaqqqqqeawqwqwqwqwqwwqqeadaeqqeqqeadaeqq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{action: $author$project$Logic$App$Patterns$Spells$potion, displayName: 'White Sun\'s Nadir', internalName: 'potion/weakness', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqqqaqwawaw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$potionFixedPotency, displayName: 'Blue Sun\'s Nadir', internalName: 'potion/levitation', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqqqawwawawd', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$potion, displayName: 'Black Sun\'s Nadir', internalName: 'potion/wither', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqqqaewawawe', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$potion, displayName: 'Red Sun\'s Nadir', internalName: 'potion/poison', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqqqadwawaww', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$potion, displayName: 'Green Sun\'s Nadir', internalName: 'potion/slowness', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqqqadwawaw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$sentinelCreate, displayName: 'Summon Sentinel', internalName: 'sentinel/create', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'waeawae', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$sentinelDestroy, displayName: 'Banish Sentinel', internalName: 'sentinel/destroy', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qdwdqdw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$sentinelGetPos, displayName: 'Locate Sentinel', internalName: 'sentinel/get_pos', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'waeawaede', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Spells$sentinelWayfind, displayName: 'Wayfind Sentinel', internalName: 'sentinel/wayfind', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'waeawaedwa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: '', internalName: 'akashic/read', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqwqqqqqaq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: '', internalName: 'akashic/write', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'eeeweeeeede', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: 'Charon\'s Gambit', internalName: 'halt', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aqdee', startDirection: $author$project$Logic$App$Types$Southwest},
				{action: $author$project$Logic$App$Patterns$ReadWrite$read, displayName: 'Scribe\'s Reflection', internalName: 'read', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aqqqqq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: 'Chronicler\'s Purification', internalName: 'read/entity', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wawqwqwqwqwqw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$ReadWrite$write, displayName: 'Scribe\'s Gambit', internalName: 'write', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'deeeee', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: 'Chronicler\'s Gambit', internalName: 'write/entity', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wdwewewewewew', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$ReadWrite$readable, displayName: 'Auditor\'s Reflection', internalName: 'readable', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aqqqqqe', startDirection: $author$project$Logic$App$Types$East},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Boolean(false)),
				displayName: 'Auditor\'s Purification',
				internalName: 'readable/entity',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'wawqwqwqwqwqwew',
				startDirection: $author$project$Logic$App$Types$East
			},
				{action: $author$project$Logic$App$Patterns$ReadWrite$writable, displayName: 'Assessor\'s Reflection', internalName: 'writable', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'deeeeeq', startDirection: $author$project$Logic$App$Types$East},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Boolean(false)),
				displayName: 'Assessor\'s Purification',
				internalName: 'writable/entity',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'wdwewewewewewqw',
				startDirection: $author$project$Logic$App$Types$East
			},
				{action: $author$project$Logic$App$Patterns$ReadWrite$readLocal, displayName: 'Muninn\'s Reflection', internalName: 'read/local', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qeewdweddw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$ReadWrite$writeLocal, displayName: 'Huginn\'s Gambit', internalName: 'write/local', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'eqqwawqaaw', startDirection: $author$project$Logic$App$Types$East},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant($author$project$Logic$App$Types$Null),
				displayName: 'Nullary Reflection',
				internalName: 'const/null',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'd',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Boolean(true)),
				displayName: 'True Reflection',
				internalName: 'const/true',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'aqae',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Boolean(false)),
				displayName: 'False Reflection',
				internalName: 'const/false',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'dedq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Vector(
						_Utils_Tuple3(1, 0, 0))),
				displayName: 'Vector Reflection +X',
				internalName: 'const/vec/px',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'qqqqqea',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Vector(
						_Utils_Tuple3(0, 1, 0))),
				displayName: 'Vector Reflection +Y',
				internalName: 'const/vec/py',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'qqqqqew',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Vector(
						_Utils_Tuple3(0, 0, 1))),
				displayName: 'Vector Reflection +Z',
				internalName: 'const/vec/pz',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'qqqqqed',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Vector(
						_Utils_Tuple3(-1, 0, 0))),
				displayName: 'Vector Reflection -X',
				internalName: 'const/vec/nx',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'eeeeeqa',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Vector(
						_Utils_Tuple3(0, -1, 0))),
				displayName: 'Vector Reflection -Y',
				internalName: 'const/vec/ny',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'eeeeeqw',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Vector(
						_Utils_Tuple3(0, 0, -1))),
				displayName: 'Vector Reflection -Z',
				internalName: 'const/vec/nz',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'eeeeeqd',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Vector(
						_Utils_Tuple3(0, 0, 0))),
				displayName: 'Vector Reflection Zero',
				internalName: 'const/vec/0',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'qqqqq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Number($elm$core$Basics$pi)),
				displayName: 'Arc\'s Reflection',
				internalName: 'const/double/pi',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'qdwdq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Number($elm$core$Basics$pi * 2)),
				displayName: 'Circle\'s Reflection',
				internalName: 'const/double/tau',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'eawae',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$Number($elm$core$Basics$e)),
				displayName: 'Euler\'s Reflection',
				internalName: 'const/double/e',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'aaq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$getEntity,
				displayName: 'Entity Purification',
				internalName: 'get_entity',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$EntityType,
						$author$project$Logic$App$Types$Entity($author$project$Logic$App$Types$Unset))),
				signature: 'qqqqqdaqa',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$getEntity,
				displayName: 'Entity Purification: Animal',
				internalName: 'get_entity/animal',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$EntityType,
						$author$project$Logic$App$Types$Entity($author$project$Logic$App$Types$Unset))),
				signature: 'qqqqqdaqaawa',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$getEntity,
				displayName: 'Entity Purification: Monster',
				internalName: 'get_entity/monster',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$EntityType,
						$author$project$Logic$App$Types$Entity($author$project$Logic$App$Types$Unset))),
				signature: 'qqqqqdaqaawq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$getEntity,
				displayName: 'Entity Purification: Item',
				internalName: 'get_entity/item',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$EntityType,
						$author$project$Logic$App$Types$Entity($author$project$Logic$App$Types$Unset))),
				signature: 'qqqqqdaqaaww',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$getEntity,
				displayName: 'Entity Purification: Player',
				internalName: 'get_entity/player',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$EntityType,
						$author$project$Logic$App$Types$Entity($author$project$Logic$App$Types$Unset))),
				signature: 'qqqqqdaqaawe',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$getEntity,
				displayName: 'Entity Purification: Living',
				internalName: 'get_entity/living',
				outputOptions: _List_fromArray(
					[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$EntityType,
						$author$project$Logic$App$Types$Entity($author$project$Logic$App$Types$Unset))),
				signature: 'qqqqqdaqaawd',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
				displayName: 'Zone Distillation: Any',
				internalName: 'zone_entity',
				outputOptions: _List_fromArray(
					[
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
					]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
						$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
				signature: 'qqqqqwded',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
				displayName: 'Zone Distillation: Animal',
				internalName: 'zone_entity/animal',
				outputOptions: _List_fromArray(
					[
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
					]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
						$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
				signature: 'qqqqqwdeddwa',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
				displayName: 'Zone Distillation: Non-Animal',
				internalName: 'zone_entity/not_animal',
				outputOptions: _List_fromArray(
					[
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
					]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
						$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
				signature: 'eeeeewaqaawa',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
				displayName: 'Zone Distillation: Monster',
				internalName: 'zone_entity/monster',
				outputOptions: _List_fromArray(
					[
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
					]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
						$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
				signature: 'qqqqqwdeddwq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
				displayName: 'Zone Distillation: Non-Monster',
				internalName: 'zone_entity/not_monster',
				outputOptions: _List_fromArray(
					[
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
					]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
						$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
				signature: 'eeeeewaqaawq',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
				displayName: 'Zone Distillation: Item',
				internalName: 'zone_entity/item',
				outputOptions: _List_fromArray(
					[
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
					]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
						$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
				signature: 'qqqqqwdeddww',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
				displayName: 'Zone Distillation: Non-Item',
				internalName: 'zone_entity/not_item',
				outputOptions: _List_fromArray(
					[
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
					]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
						$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
				signature: 'eeeeewaqaaww',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
				displayName: 'Zone Distillation: Player',
				internalName: 'zone_entity/player',
				outputOptions: _List_fromArray(
					[
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
					]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
						$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
				signature: 'qqqqqwdeddwe',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
				displayName: 'Zone Distillation: Non-Player',
				internalName: 'zone_entity/not_player',
				outputOptions: _List_fromArray(
					[
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
					]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
						$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
				signature: 'eeeeewaqaawe',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
				displayName: 'Zone Distillation: Living',
				internalName: 'zone_entity/living',
				outputOptions: _List_fromArray(
					[
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
					]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
						$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
				signature: 'qqqqqwdeddwd',
				startDirection: $author$project$Logic$App$Types$East
			},
				{
				action: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
				displayName: 'Zone Distillation: Non-Living',
				internalName: 'zone_entity/not_living',
				outputOptions: _List_fromArray(
					[
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
					]),
				selectedOutput: $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
						$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
				signature: 'eeeeewaqaawd',
				startDirection: $author$project$Logic$App$Types$East
			},
				{action: $author$project$Logic$App$Patterns$Lists$append, displayName: 'Integration Distillation', internalName: 'append', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'edqde', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Lists$concat, displayName: 'Combination Distillation', internalName: 'concat', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qaeaq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Lists$index, displayName: 'Selection Distillation', internalName: 'index', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'deeed', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Lists$listSize, displayName: 'Abacus Purification', internalName: 'list_size', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aqaeaq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Lists$singleton, displayName: 'Single\'s Purification', internalName: 'singleton', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'adeeed', startDirection: $author$project$Logic$App$Types$East},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$IotaList($elm$core$Array$empty)),
				displayName: 'Vacant Reflection',
				internalName: 'empty_list',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'qqaeaae',
				startDirection: $author$project$Logic$App$Types$East
			},
				{action: $author$project$Logic$App$Patterns$Lists$reverseList, displayName: 'Retrograde Purification', internalName: 'reverse_list', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqaede', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Lists$lastNList, displayName: 'Flock\'s Gambit', internalName: 'last_n_list', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'ewdqdwe', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Lists$splat, displayName: 'Flock\'s Disintegration', internalName: 'splat', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qwaeawq', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Lists$indexOf, displayName: 'Locator\'s Distillation', internalName: 'index_of', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'dedqde', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Lists$listRemove, displayName: 'Excisor\'s Distillation', internalName: 'list_remove', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'edqdewaqa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Lists$slice, displayName: 'Selection Exaltation', internalName: 'slice', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qaeaqwded', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Lists$modifyinPlace, displayName: 'Surgeon\'s Exaltation', internalName: 'modify_in_place', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'wqaeaqw', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Lists$construct, displayName: 'Speaker\'s Distillation', internalName: 'construct', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'ddewedd', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$Lists$deconstruct, displayName: 'Speaker\'s Decomposition', internalName: 'deconstruct', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'aaqwqaa', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: 'Consideration', internalName: 'escape', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'qqqaw', startDirection: $author$project$Logic$App$Types$West},
				{
				action: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
					$author$project$Logic$App$Types$OpenParenthesis($elm$core$Array$empty)),
				displayName: 'Introspection',
				internalName: 'open_paren',
				outputOptions: _List_Nil,
				selectedOutput: $elm$core$Maybe$Nothing,
				signature: 'qqq',
				startDirection: $author$project$Logic$App$Types$West
			},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: 'Retrospection', internalName: 'close_paren', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'eee', startDirection: $author$project$Logic$App$Types$East},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: 'Hermes\' Gambit', internalName: 'eval', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'deaqq', startDirection: $author$project$Logic$App$Types$Southeast},
				{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, displayName: 'Thoth\'s Gambit', internalName: 'for_each', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'dadad', startDirection: $author$project$Logic$App$Types$Northeast},
				{action: $author$project$Logic$App$Patterns$Misc$saveMacro, displayName: 'Save Macro', internalName: 'save_macro', outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: 'awaawa', startDirection: $author$project$Logic$App$Types$Southeast}
			])));
var $author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature = F2(
	function (maybeMacros, signature) {
		var _v0 = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (regPattern) {
					return _Utils_eq(regPattern.signature, signature);
				},
				$author$project$Logic$App$Patterns$PatternRegistry$patternRegistry));
		if (_v0.$ === 'Just') {
			var a = _v0.a;
			return a;
		} else {
			if (A2($elm$core$String$startsWith, 'aqaa', signature)) {
				return A2($author$project$Logic$App$Patterns$PatternRegistry$numberLiteralGenerator, signature, false);
			} else {
				if (A2($elm$core$String$startsWith, 'dedd', signature)) {
					return A2($author$project$Logic$App$Patterns$PatternRegistry$numberLiteralGenerator, signature, true);
				} else {
					var parseBookkeeperResult = $author$project$Logic$App$Patterns$PatternRegistry$parseBookkeeper(signature);
					if (parseBookkeeperResult.internalName !== 'unknown') {
						return parseBookkeeperResult;
					} else {
						if (maybeMacros.$ === 'Just') {
							var macros = maybeMacros.a;
							var _v2 = A2($elm$core$Dict$get, signature, macros);
							if (_v2.$ === 'Just') {
								var value = _v2.a;
								var displayName = value.a;
								var direction = value.b;
								return {action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, active: true, color: $author$project$Settings$Theme$accent1, displayName: displayName, internalName: '', metaAction: $author$project$Logic$App$Types$None, outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: signature, startDirection: direction};
							} else {
								return _Utils_update(
									$author$project$Logic$App$Patterns$PatternRegistry$unknownPattern,
									{displayName: 'Pattern ' + ('\"' + (signature + '\"')), signature: signature});
							}
						} else {
							return _Utils_update(
								$author$project$Logic$App$Patterns$PatternRegistry$unknownPattern,
								{displayName: 'Pattern ' + ('\"' + (signature + '\"')), signature: signature});
						}
					}
				}
			}
		}
	});
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$String$append = _String_append;
var $elm$core$String$endsWith = _String_endsWith;
var $author$project$Logic$App$Utils$Utils$ifThenElse = F3(
	function (conditional, a, b) {
		return conditional ? a : b;
	});
var $elm$core$Debug$log = _Debug_log;
var $author$project$Logic$App$Patterns$PatternRegistry$reverseParseBookkeeper = function (code) {
	if (code === '-') {
		return {
			action: $author$project$Logic$App$Patterns$Misc$mask(
				_List_fromArray(
					['-'])),
			active: true,
			color: $author$project$Settings$Theme$accent1,
			displayName: 'Bookkeeper\'s Gambit: -',
			internalName: 'mask',
			metaAction: $author$project$Logic$App$Types$None,
			outputOptions: _List_Nil,
			selectedOutput: $elm$core$Maybe$Nothing,
			signature: '',
			startDirection: $author$project$Logic$App$Types$East
		};
	} else {
		var toAngleSignature = F2(
			function (codeChunk, accumulator) {
				var _v0 = A2($elm$core$Debug$log, codeChunk, accumulator);
				switch (codeChunk) {
					case '--':
						return A2($elm$core$String$endsWith, 'a', accumulator) ? A2($elm$core$String$append, accumulator, 'ew') : (A2($elm$core$String$endsWith, 'w', accumulator) ? A2($elm$core$String$append, accumulator, 'ww') : (A2($elm$core$String$endsWith, 'e', accumulator) ? A2($elm$core$String$append, accumulator, 'ww') : A2($elm$core$String$append, accumulator, 'w')));
					case 'vv':
						return A2($elm$core$String$endsWith, 'w', accumulator) ? A2($elm$core$String$append, accumulator, 'eada') : (A2($elm$core$String$endsWith, 'a', accumulator) ? A2($elm$core$String$append, accumulator, 'dad') : (A2($elm$core$String$endsWith, 'e', accumulator) ? A2($elm$core$String$append, accumulator, 'ada') : A2($elm$core$String$append, accumulator, 'ada')));
					case 'v-':
						return A2($elm$core$String$endsWith, 'w', accumulator) ? A2($elm$core$String$append, accumulator, 'eae') : (A2($elm$core$String$endsWith, 'a', accumulator) ? A2($elm$core$String$append, accumulator, 'dae') : (A2($elm$core$String$endsWith, 'e', accumulator) ? A2($elm$core$String$append, accumulator, 'eae') : A2($elm$core$String$append, accumulator, 'ae')));
					case '-v':
						return A2($elm$core$String$endsWith, 'w', accumulator) ? A2($elm$core$String$append, accumulator, 'wea') : (A2($elm$core$String$endsWith, 'a', accumulator) ? A2($elm$core$String$append, accumulator, 'eea') : (A2($elm$core$String$endsWith, 'e', accumulator) ? A2($elm$core$String$append, accumulator, 'wea') : A2($elm$core$String$append, accumulator, 'ea')));
					case 'v':
						return A2($elm$core$String$endsWith, 'a', accumulator) ? A2($elm$core$String$append, accumulator, 'da') : (A2($elm$core$String$endsWith, 'w', accumulator) ? A2($elm$core$String$append, accumulator, 'ea') : (A2($elm$core$String$endsWith, 'e', accumulator) ? A2($elm$core$String$append, accumulator, 'ea') : A2($elm$core$String$append, accumulator, 'a')));
					case '-':
						return A2($elm$core$String$endsWith, 'a', accumulator) ? A2($elm$core$String$append, accumulator, 'e') : (A2($elm$core$String$endsWith, 'w', accumulator) ? A2($elm$core$String$append, accumulator, 'w') : (A2($elm$core$String$endsWith, 'e', accumulator) ? A2($elm$core$String$append, accumulator, 'w') : A2($elm$core$String$append, accumulator, '')));
					default:
						return accumulator;
				}
			});
		var codeList = A2($elm$core$String$split, '', code);
		var codeGroupedByTwos = A2(
			$elm$core$Debug$log,
			'twos',
			$elm$core$List$reverse(
				A3(
					$elm$core$List$foldl,
					F2(
						function (letter, accumulator) {
							var tail = A2(
								$elm$core$Maybe$withDefault,
								_List_Nil,
								$elm$core$List$tail(accumulator));
							var head = A2(
								$elm$core$Maybe$withDefault,
								'',
								$elm$core$List$head(accumulator));
							return (!$elm$core$String$length(head)) ? A2($elm$core$List$cons, letter, tail) : (($elm$core$String$length(head) === 1) ? A2(
								$elm$core$List$cons,
								_Utils_ap(head, letter),
								tail) : A2($elm$core$List$cons, letter, accumulator));
						}),
					_List_Nil,
					codeList)));
		var signature = A3($elm$core$List$foldl, toAngleSignature, '', codeGroupedByTwos);
		return {
			action: $author$project$Logic$App$Patterns$Misc$mask(
				A2($elm$core$String$split, '', code)),
			active: true,
			color: $author$project$Settings$Theme$accent1,
			displayName: 'Bookkeeper\'s Gambit: ' + code,
			internalName: 'mask',
			metaAction: $author$project$Logic$App$Types$None,
			outputOptions: _List_Nil,
			selectedOutput: $elm$core$Maybe$Nothing,
			signature: A2($elm$core$Debug$log, 'signature', signature),
			startDirection: A3(
				$author$project$Logic$App$Utils$Utils$ifThenElse,
				A2($elm$core$String$startsWith, 'v', code),
				$author$project$Logic$App$Types$Southeast,
				$author$project$Logic$App$Types$East)
		};
	}
};
var $elm$json$Json$Encode$float = _Json_wrap;
var $author$project$Ports$HexNumGen$sendNumber = _Platform_outgoingPort('sendNumber', $elm$json$Json$Encode$float);
var $elm$core$String$toFloat = _String_toFloat;
var $elm$core$String$trim = _String_trim;
var $author$project$Logic$App$Patterns$PatternRegistry$getPatternFromName = F2(
	function (maybeMacros, name) {
		var _v0 = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (regPattern) {
					return _Utils_eq(regPattern.displayName, name) || (_Utils_eq(regPattern.internalName, name) || _Utils_eq(regPattern.signature, name));
				},
				$author$project$Logic$App$Patterns$PatternRegistry$patternRegistry));
		if (_v0.$ === 'Just') {
			var a = _v0.a;
			return _Utils_Tuple2(a, $elm$core$Platform$Cmd$none);
		} else {
			var _v1 = $elm$core$String$toFloat(name);
			if (_v1.$ === 'Just') {
				var number = _v1.a;
				return _Utils_Tuple2(
					$author$project$Logic$App$Patterns$PatternRegistry$unknownPattern,
					$author$project$Ports$HexNumGen$sendNumber(number));
			} else {
				var regexMatch = $elm$core$String$trim(
					A2(
						$elm$core$Maybe$withDefault,
						'',
						$elm$core$List$head(
							A2(
								$elm$core$List$map,
								function (x) {
									return x.match;
								},
								A2($elm$regex$Regex$find, $author$project$Logic$App$Utils$RegexPatterns$bookkeepersPattern, name)))));
				if (_Utils_eq(
					regexMatch,
					$elm$core$String$trim(name))) {
					return _Utils_Tuple2(
						$author$project$Logic$App$Patterns$PatternRegistry$reverseParseBookkeeper(name),
						$elm$core$Platform$Cmd$none);
				} else {
					if (maybeMacros.$ === 'Just') {
						var macros = maybeMacros.a;
						var _v3 = A2($elm$core$Dict$get, name, macros);
						if (_v3.$ === 'Just') {
							var value = _v3.a;
							var displayName = value.a;
							var direction = value.b;
							return _Utils_Tuple2(
								{action: $author$project$Logic$App$Patterns$PatternRegistry$noAction, active: true, color: $author$project$Settings$Theme$accent1, displayName: displayName, internalName: '', metaAction: $author$project$Logic$App$Types$None, outputOptions: _List_Nil, selectedOutput: $elm$core$Maybe$Nothing, signature: name, startDirection: direction},
								$elm$core$Platform$Cmd$none);
						} else {
							return A2($elm$regex$Regex$contains, $author$project$Logic$App$Utils$RegexPatterns$angleSignaturePattern, name) ? _Utils_Tuple2(
								A2($author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature, maybeMacros, name),
								$elm$core$Platform$Cmd$none) : _Utils_Tuple2($author$project$Logic$App$Patterns$PatternRegistry$unknownPattern, $elm$core$Platform$Cmd$none);
						}
					} else {
						return A2($elm$regex$Regex$contains, $author$project$Logic$App$Utils$RegexPatterns$angleSignaturePattern, name) ? _Utils_Tuple2(
							A2($author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature, maybeMacros, name),
							$elm$core$Platform$Cmd$none) : _Utils_Tuple2($author$project$Logic$App$Patterns$PatternRegistry$unknownPattern, $elm$core$Platform$Cmd$none);
					}
				}
			}
		}
	});
var $author$project$Components$App$Grid$applyPathToGrid = F2(
	function (gridPoints, pointsToAdd) {
		var replace = function (pnt) {
			var replacedPnt = $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (activePnt) {
						return _Utils_eq(
							_Utils_Tuple2(activePnt.offsetX, activePnt.offsetY),
							_Utils_Tuple2(pnt.offsetX, pnt.offsetY));
					},
					pointsToAdd));
			if (replacedPnt.$ === 'Just') {
				var point = replacedPnt.a;
				return _Utils_update(
					pnt,
					{color: $author$project$Settings$Theme$accent2, connectedPoints: point.connectedPoints, used: true});
			} else {
				return pnt;
			}
		};
		return A2(
			$elm$core$List$map,
			function (row) {
				return A2($elm$core$List$map, replace, row);
			},
			gridPoints);
	});
var $author$project$Components$App$Grid$verticalSpacing = function (scale) {
	return ($author$project$Components$App$Grid$spacing(scale) * $elm$core$Basics$sqrt(3.0)) / 2;
};
var $author$project$Components$App$Grid$generateGrid = F3(
	function (gridWidth, gridHeight, scale) {
		var rowCount = 3 + $elm$core$Basics$floor(
			gridHeight / $author$project$Components$App$Grid$verticalSpacing(scale));
		var pointCount = 3 + $elm$core$Basics$floor(
			gridWidth / $author$project$Components$App$Grid$spacing(scale));
		return A2(
			$elm$core$List$indexedMap,
			F2(
				function (r, _v0) {
					return A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, _v1) {
								var radius = ((_Utils_cmp(r, rowCount - 3) > -1) || (_Utils_cmp(i, pointCount - 3) > -1)) ? 0 : (8.0 * scale);
								return {
									color: $author$project$Settings$Theme$accent1,
									connectedPoints: _List_Nil,
									offsetX: (i * 2) + A2($elm$core$Basics$modBy, 2, r),
									offsetY: r,
									radius: radius,
									used: false,
									x: (($author$project$Components$App$Grid$spacing(scale) * i) + (($author$project$Components$App$Grid$spacing(scale) / 2) * A2($elm$core$Basics$modBy, 2, r))) + ((gridWidth - ((pointCount - 3.5) * $author$project$Components$App$Grid$spacing(scale))) / 2),
									y: ($author$project$Components$App$Grid$verticalSpacing(scale) * r) + ((gridHeight - ((rowCount - 4) * $author$project$Components$App$Grid$verticalSpacing(scale))) / 2)
								};
							}),
						A2($elm$core$List$repeat, pointCount, 0));
				}),
			A2($elm$core$List$repeat, rowCount, 0));
	});
var $author$project$Components$App$Grid$updateGridPoints = F5(
	function (gridWidth, gridHeight, patternArray, maybeGrid, scale) {
		updateGridPoints:
		while (true) {
			var tail = A3(
				$elm$core$Array$slice,
				1,
				$elm$core$Array$length(patternArray),
				patternArray);
			var oldGrid = _Utils_eq(maybeGrid, _List_Nil) ? A3($author$project$Components$App$Grid$generateGrid, gridWidth, gridHeight, scale) : maybeGrid;
			var drawing = A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2($author$project$Logic$App$Patterns$PatternRegistry$unknownPattern, _List_Nil),
				A2($elm$core$Array$get, 0, patternArray)).b;
			var newGrid = A2($author$project$Components$App$Grid$applyPathToGrid, oldGrid, drawing);
			if (!$elm$core$Array$length(tail)) {
				return newGrid;
			} else {
				var $temp$gridWidth = gridWidth,
					$temp$gridHeight = gridHeight,
					$temp$patternArray = tail,
					$temp$maybeGrid = newGrid,
					$temp$scale = scale;
				gridWidth = $temp$gridWidth;
				gridHeight = $temp$gridHeight;
				patternArray = $temp$patternArray;
				maybeGrid = $temp$maybeGrid;
				scale = $temp$scale;
				continue updateGridPoints;
			}
		}
	});
var $author$project$Logic$App$Patterns$MetaActions$applyMetaAction = F2(
	function (model, metaActionMsg) {
		var settings = model.settings;
		var grid = model.grid;
		var castingContext = model.castingContext;
		switch (metaActionMsg.$) {
			case 'None':
				return model;
			case 'Reset':
				return _Utils_update(
					model,
					{
						castingContext: _Utils_update(
							castingContext,
							{heldItemContent: $elm$core$Maybe$Nothing}),
						grid: _Utils_update(
							grid,
							{
								points: A5($author$project$Components$App$Grid$updateGridPoints, grid.width, grid.height, $elm$core$Array$empty, _List_Nil, settings.gridScale)
							}),
						insertionPoint: 0,
						patternArray: $elm$core$Array$empty,
						stack: $elm$core$Array$empty,
						timeline: $elm$core$Array$empty
					});
			case 'ClearPatterns':
				return _Utils_update(
					model,
					{
						grid: _Utils_update(
							grid,
							{
								points: A5($author$project$Components$App$Grid$updateGridPoints, grid.width, grid.height, $elm$core$Array$empty, _List_Nil, settings.gridScale)
							}),
						insertionPoint: 0,
						patternArray: $elm$core$Array$empty,
						stack: $elm$core$Array$empty,
						timeline: $elm$core$Array$empty
					});
			case 'Backspace':
				var newUncoloredPatternArray = A2(
					$elm_community$array_extra$Array$Extra$removeAt,
					model.insertionPoint,
					A2($elm_community$array_extra$Array$Extra$removeAt, model.insertionPoint, model.patternArray));
				var stackResult = A3(
					$author$project$Logic$App$Stack$EvalStack$applyPatternsToStack,
					$elm$core$Array$empty,
					castingContext,
					$elm$core$List$reverse(
						$elm$core$List$unzip(
							$elm$core$Array$toList(newUncoloredPatternArray)).a));
				var resultArray = stackResult.resultArray;
				var newStack = stackResult.stack;
				var newPatternArray = A3(
					$elm_community$array_extra$Array$Extra$map2,
					F2(
						function (patternTuple, result) {
							return $author$project$Logic$App$PatternList$PatternArray$updateDrawingColors(
								_Utils_Tuple2(
									A2($author$project$Logic$App$PatternList$PatternArray$applyColorToPatternFromResult, patternTuple.a, result),
									patternTuple.b));
						}),
					newUncoloredPatternArray,
					resultArray);
				return _Utils_update(
					model,
					{
						castingContext: stackResult.ctx,
						grid: _Utils_update(
							grid,
							{
								points: A5($author$project$Components$App$Grid$updateGridPoints, grid.width, grid.height, newPatternArray, _List_Nil, settings.gridScale)
							}),
						insertionPoint: (_Utils_cmp(
							model.insertionPoint,
							$elm$core$Array$length(newPatternArray)) > 0) ? 0 : model.insertionPoint,
						patternArray: newPatternArray,
						stack: newStack,
						timeline: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							{patternIndex: -1, stack: $elm$core$Array$empty},
							stackResult.timeline)
					});
			default:
				var newUncoloredPatternArray = A2(
					$author$project$Logic$App$Utils$Utils$unshift,
					_Utils_Tuple2(
						A2($author$project$Logic$App$Patterns$PatternRegistry$getPatternFromName, $elm$core$Maybe$Nothing, 'close_paren').a,
						_List_Nil),
					A2(
						$elm$core$Array$push,
						_Utils_Tuple2(
							A2($author$project$Logic$App$Patterns$PatternRegistry$getPatternFromName, $elm$core$Maybe$Nothing, 'open_paren').a,
							_List_Nil),
						A2($elm_community$array_extra$Array$Extra$removeAt, model.insertionPoint, model.patternArray)));
				var stackResult = A3(
					$author$project$Logic$App$Stack$EvalStack$applyPatternsToStack,
					$elm$core$Array$empty,
					castingContext,
					$elm$core$List$reverse(
						$elm$core$List$unzip(
							$elm$core$Array$toList(newUncoloredPatternArray)).a));
				var resultArray = stackResult.resultArray;
				var newStack = stackResult.stack;
				var newPatternArray = A3(
					$elm_community$array_extra$Array$Extra$map2,
					F2(
						function (patternTuple, result) {
							return $author$project$Logic$App$PatternList$PatternArray$updateDrawingColors(
								_Utils_Tuple2(
									A2($author$project$Logic$App$PatternList$PatternArray$applyColorToPatternFromResult, patternTuple.a, result),
									patternTuple.b));
						}),
					newUncoloredPatternArray,
					resultArray);
				var patterns = A2(
					$elm$core$Array$map,
					function (x) {
						return x.a;
					},
					newPatternArray);
				var drawPatternsResult = A2($author$project$Logic$App$Grid$drawPatterns, patterns, model.grid);
				return _Utils_update(
					model,
					{
						castingContext: stackResult.ctx,
						grid: drawPatternsResult.grid,
						patternArray: drawPatternsResult.patternArray,
						stack: newStack,
						timeline: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							{patternIndex: -1, stack: $elm$core$Array$empty},
							stackResult.timeline)
					});
		}
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $author$project$Components$App$Grid$generateDrawnPointsListFromPatternArray = function (patternArray) {
	return A2(
		$elm$core$List$concatMap,
		$elm$core$Tuple$second,
		$elm$core$Array$toList(patternArray));
};
var $author$project$Logic$App$Utils$GetAngleSignature$getAngleSignature = function (unflippedPath) {
	var path = $elm$core$List$reverse(unflippedPath);
	var getAngleLetter = F2(
		function (direction1, direction2) {
			return A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(
					'',
					_Utils_Tuple2($author$project$Logic$App$Types$ErrorDirection, $author$project$Logic$App$Types$ErrorDirection)),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (x) {
							return _Utils_eq(
								x.b,
								_Utils_Tuple2(direction1, direction2));
						},
						$author$project$Logic$App$Utils$LetterMap$letterMap))).a;
		});
	var directionVector = function (_v0) {
		var x1 = _v0.x1;
		var x2 = _v0.x2;
		var y1 = _v0.y1;
		var y2 = _v0.y2;
		return _Utils_Tuple2(x2 - x1, y2 - y1);
	};
	var directionBetweenPoints = F2(
		function (point1, point2) {
			return A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(
					$author$project$Logic$App$Types$ErrorDirection,
					_Utils_Tuple2(404, 0)),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (x) {
							return _Utils_eq(
								x.b,
								directionVector(
									{x1: point1.a, x2: point2.a, y1: point1.b, y2: point2.b}));
						},
						$author$project$Logic$App$Utils$DirectionMap$directionMap))).a;
		});
	var directionList = A3(
		$elm$core$List$map2,
		F2(
			function (pnt1, pnt2) {
				return A2(
					directionBetweenPoints,
					_Utils_Tuple2(pnt1.offsetX, pnt1.offsetY),
					_Utils_Tuple2(pnt2.offsetX, pnt2.offsetY));
			}),
		path,
		A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$tail(path)));
	return $elm$core$String$concat(
		A3(
			$elm$core$List$map2,
			F2(
				function (dir1, dir2) {
					return A2(getAngleLetter, dir1, dir2);
				}),
			directionList,
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$tail(directionList))));
};
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			nodeList: _List_Nil,
			nodeListSize: 0,
			tail: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.nodeListSize * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						nodeList: A2($elm$core$List$cons, mappedLeaf, builder.nodeList),
						nodeListSize: builder.nodeListSize + 1,
						tail: builder.tail
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $author$project$Logic$App$Msg$MouseMoveData = F4(
	function (pageX, pageY, offsetHeight, offsetWidth) {
		return {offsetHeight: offsetHeight, offsetWidth: offsetWidth, pageX: pageX, pageY: pageY};
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Main$mouseMoveDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Logic$App$Msg$MouseMoveData,
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['pageX']),
		$elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['pageY']),
		$elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['target', 'offsetHeight']),
		$elm$json$Json$Decode$float),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['target', 'offsetWidth']),
		$elm$json$Json$Decode$float));
var $author$project$Logic$App$Utils$RegexPatterns$bookkeepersValuePattern = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString(':(?=[^\\n]*[-v])[\\sv-]*'));
var $author$project$Logic$App$Utils$RegexPatterns$commentPattern = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('\\/\\/.*'));
var $author$project$Logic$App$Utils$RegexPatterns$numberValuePattern = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString(':(?=[^\\n]*\\d)[\\d\\s.-]*'));
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $author$project$Logic$App$ImportExport$ImportParser$parseInput = F2(
	function (input, macros) {
		var getPatternFromString = function (string) {
			return (string === '{') ? A2(
				$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromName,
				$elm$core$Maybe$Just(macros),
				'open_paren') : ((string === '}') ? A2(
				$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromName,
				$elm$core$Maybe$Just(macros),
				'close_paren') : (A2($elm$regex$Regex$contains, $author$project$Logic$App$Utils$RegexPatterns$numberValuePattern, string) ? A2(
				$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromName,
				$elm$core$Maybe$Just(macros),
				$elm$core$String$trim(
					A2(
						$elm$core$String$dropLeft,
						1,
						A2(
							$elm$core$Maybe$withDefault,
							'',
							$elm$core$List$head(
								A2(
									$elm$core$List$map,
									function (val) {
										return val.match;
									},
									A2($elm$regex$Regex$find, $author$project$Logic$App$Utils$RegexPatterns$numberValuePattern, string))))))) : (A2($elm$regex$Regex$contains, $author$project$Logic$App$Utils$RegexPatterns$bookkeepersValuePattern, string) ? A2(
				$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromName,
				$elm$core$Maybe$Just(macros),
				$elm$core$String$trim(
					A2(
						$elm$core$String$dropLeft,
						1,
						A2(
							$elm$core$Maybe$withDefault,
							'',
							$elm$core$List$head(
								A2(
									$elm$core$List$map,
									function (val) {
										return val.match;
									},
									A2($elm$regex$Regex$find, $author$project$Logic$App$Utils$RegexPatterns$bookkeepersValuePattern, string))))))) : A2(
				$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromName,
				$elm$core$Maybe$Just(macros),
				string))));
		};
		return A2(
			$elm$core$List$map,
			getPatternFromString,
			A2(
				$elm$core$List$filter,
				function (l) {
					return l !== '';
				},
				A2(
					$elm$core$List$map,
					$elm$core$String$trim,
					A2(
						$elm$core$List$map,
						A2(
							$elm$regex$Regex$replace,
							$author$project$Logic$App$Utils$RegexPatterns$commentPattern,
							function (_v0) {
								return '';
							}),
						A2($elm$core$String$split, '\n', input)))));
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Ports$GetElementBoundingBoxById$requestBoundingBox = _Platform_outgoingPort('requestBoundingBox', $elm$json$Json$Encode$string);
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Ports$GetElementBoundingBoxById$requestBoundingBoxes = _Platform_outgoingPort(
	'requestBoundingBoxes',
	$elm$json$Json$Encode$list($elm$json$Json$Encode$string));
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Ports$CheckMouseOverDragHandle$requestCheckMouseOverDragHandle = _Platform_outgoingPort(
	'requestCheckMouseOverDragHandle',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Ports$GetGridDrawingAsGif$requestGIF = _Platform_outgoingPort(
	'requestGIF',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Ports$GetGridDrawingAsImage$requestImage = _Platform_outgoingPort(
	'requestImage',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Logic$App$Grid$sortPatterns = function (model) {
	var drawPatternsResult = A2(
		$author$project$Logic$App$Grid$drawPatterns,
		A2($elm$core$Array$map, $elm$core$Tuple$first, model.patternArray),
		model.grid);
	return _Utils_update(
		model,
		{grid: drawPatternsResult.grid, patternArray: drawPatternsResult.patternArray});
};
var $elm$file$File$Download$string = F3(
	function (name, mime, content) {
		return A2(
			$elm$core$Task$perform,
			$elm$core$Basics$never,
			A3(_File_download, name, mime, content));
	});
var $elm_community$array_extra$Array$Extra$update = F2(
	function (index, alter) {
		return function (array) {
			var _v0 = A2($elm$core$Array$get, index, array);
			if (_v0.$ === 'Nothing') {
				return array;
			} else {
				var element = _v0.a;
				return A3(
					$elm$core$Array$set,
					index,
					alter(element),
					array);
			}
		};
	});
var $author$project$Components$App$Grid$updateUsedGridPoints = F5(
	function (gridWidth, gridHeight, patternArray, maybeGrid, scale) {
		updateUsedGridPoints:
		while (true) {
			var tail = A3(
				$elm$core$Array$slice,
				1,
				$elm$core$Array$length(patternArray),
				patternArray);
			var oldGrid = _Utils_eq(maybeGrid, _List_Nil) ? A3($author$project$Components$App$Grid$generateGrid, gridWidth, gridHeight, scale) : maybeGrid;
			var drawing = A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2($author$project$Logic$App$Patterns$PatternRegistry$unknownPattern, _List_Nil),
				A2($elm$core$Array$get, 0, patternArray)).b;
			var newGrid = A2($author$project$Components$App$Grid$applyUsedPointsToGrid, oldGrid, drawing);
			if (!$elm$core$Array$length(tail)) {
				return newGrid;
			} else {
				var $temp$gridWidth = gridWidth,
					$temp$gridHeight = gridHeight,
					$temp$patternArray = tail,
					$temp$maybeGrid = newGrid,
					$temp$scale = scale;
				gridWidth = $temp$gridWidth;
				gridHeight = $temp$gridHeight;
				patternArray = $temp$patternArray;
				maybeGrid = $temp$maybeGrid;
				scale = $temp$scale;
				continue updateUsedGridPoints;
			}
		}
	});
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 'Seed', a: a, b: b};
	});
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$random$Random$Generator = function (a) {
	return {$: 'Generator', a: a};
};
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
				var lo = _v0.a;
				var hi = _v0.b;
				var range = (hi - lo) + 1;
				if (!((range - 1) & range)) {
					return _Utils_Tuple2(
						(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
						$elm$random$Random$next(seed0));
				} else {
					var threshhold = (((-range) >>> 0) % range) >>> 0;
					var accountForBias = function (seed) {
						accountForBias:
						while (true) {
							var x = $elm$random$Random$peel(seed);
							var seedN = $elm$random$Random$next(seed);
							if (_Utils_cmp(x, threshhold) < 0) {
								var $temp$seed = seedN;
								seed = $temp$seed;
								continue accountForBias;
							} else {
								return _Utils_Tuple2((x % range) + lo, seedN);
							}
						}
					};
					return accountForBias(seed0);
				}
			});
	});
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0.a;
		return generator(seed);
	});
var $author$project$Components$App$Grid$updatemidLineOffsets = F2(
	function (grid_, time) {
		var randomNum = function (seed) {
			return (!A2(
				$elm$random$Random$step,
				A2($elm$random$Random$int, 0, 1),
				$elm$random$Random$initialSeed(seed)).a) ? (-1) : 1;
		};
		var offset = F2(
			function (oldVal, amount) {
				var newVal = oldVal + amount;
				return ((newVal > 8) || (_Utils_cmp(newVal, -8) < 0)) ? oldVal : newVal;
			});
		var updateOffsets = function (point) {
			return _Utils_update(
				point,
				{
					connectedPoints: A2(
						$elm$core$List$map,
						function (conPoint) {
							var _v0 = conPoint.betweenOffsetValues;
							var _v1 = _v0.a;
							var a1 = _v1.a;
							var a2 = _v1.b;
							var _v2 = _v0.b;
							var b1 = _v2.a;
							var b2 = _v2.b;
							var _v3 = _v0.c;
							var c1 = _v3.a;
							var c2 = _v3.b;
							return _Utils_update(
								conPoint,
								{
									betweenOffsetValues: function () {
										var uniqueNumber = ((conPoint.offsetY * 10000) + conPoint.offsetX) + time;
										return _Utils_Tuple3(
											_Utils_Tuple2(
												A2(
													offset,
													a1,
													randomNum(uniqueNumber + 1)),
												A2(
													offset,
													a2,
													randomNum(uniqueNumber + 4))),
											_Utils_Tuple2(
												A2(
													offset,
													b1,
													randomNum(uniqueNumber + 2)),
												A2(
													offset,
													b2,
													randomNum(uniqueNumber + 5))),
											_Utils_Tuple2(
												A2(
													offset,
													c1,
													randomNum(uniqueNumber + 3)),
												A2(
													offset,
													c2,
													randomNum(uniqueNumber + 6))));
									}()
								});
						},
						point.connectedPoints)
				});
		};
		return A2($elm$core$List$map, updateOffsets, grid_);
	});
var $elm$file$File$Download$url = function (href) {
	return A2(
		$elm$core$Task$perform,
		$elm$core$Basics$never,
		_File_downloadUrl(href));
};
var $author$project$Main$update = F2(
	function (msg, model) {
		update:
		while (true) {
			var ui = model.ui;
			var settings = model.settings;
			var patternArray = model.patternArray;
			var grid = model.grid;
			var drawing = model.grid.drawing;
			var castingContext = model.castingContext;
			switch (msg.$) {
				case 'NoOp':
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 'ViewPanel':
					var panel = msg.a;
					var keys = msg.b;
					return (!keys.shift) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{
										openPanels: _List_fromArray(
											[panel])
									})
							}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{
										openPanels: _Utils_ap(
											ui.openPanels,
											_List_fromArray(
												[panel]))
									})
							}),
						$elm$core$Platform$Cmd$none);
				case 'GetGrid':
					if (msg.a.$ === 'Ok') {
						var element = msg.a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									grid: _Utils_update(
										grid,
										{
											height: element.element.height,
											points: A5($author$project$Components$App$Grid$updateGridPoints, element.element.width, element.element.height, model.patternArray, _List_Nil, model.settings.gridScale),
											width: element.element.width
										})
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'GetContentSize':
					if (msg.a.$ === 'Ok') {
						var element = msg.a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									window: {height: element.element.height, width: element.element.width}
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'MouseMove':
					var _v1 = msg.a;
					var x = _v1.a;
					var y = _v1.b;
					return drawing.drawingMode ? _Utils_Tuple2(
						_Utils_update(
							model,
							{
								grid: _Utils_update(
									grid,
									{
										drawing: _Utils_update(
											drawing,
											{
												activePath: $author$project$Components$App$Grid$addNearbyPoint(model)
											})
									}),
								mousePos: _Utils_Tuple2(x, y)
							}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{
								mousePos: _Utils_Tuple2(x, y)
							}),
						$elm$core$Platform$Cmd$none);
				case 'GridDown':
					var _v2 = msg.a;
					var x = _v2.a;
					var y = _v2.b;
					var mousePos = _Utils_Tuple2(x, y);
					var closestPoint = A3($author$project$Components$App$Grid$getClosestPoint, mousePos, grid.points, model);
					return (!closestPoint.used) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{
								grid: _Utils_update(
									grid,
									{
										drawing: _Utils_update(
											drawing,
											{
												activePath: _List_fromArray(
													[closestPoint]),
												drawingMode: true
											})
									}),
								mousePos: mousePos
							}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 'MouseUp':
					if (drawing.drawingMode) {
						if ($elm$core$List$length(drawing.activePath) > 1) {
							var newPattern = A2(
								$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature,
								$elm$core$Maybe$Just(model.castingContext.macros),
								$author$project$Logic$App$Utils$GetAngleSignature$getAngleSignature(drawing.activePath));
							var newUncoloredPatternArray = A3($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern, model.insertionPoint);
							var stackResult = A3(
								$author$project$Logic$App$Stack$EvalStack$applyPatternsToStack,
								$elm$core$Array$empty,
								castingContext,
								$elm$core$List$reverse(
									A2(
										$elm$core$List$map,
										function (x) {
											return x.a;
										},
										$elm$core$Array$toList(
											A3($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern, model.insertionPoint)))));
							var newStack = stackResult.stack;
							var resultArray = stackResult.resultArray;
							var newPatternArray = A3(
								$elm_community$array_extra$Array$Extra$map2,
								F2(
									function (patternTuple, result) {
										return $author$project$Logic$App$PatternList$PatternArray$updateDrawingColors(
											_Utils_Tuple2(
												A2($author$project$Logic$App$PatternList$PatternArray$applyColorToPatternFromResult, patternTuple.a, result),
												patternTuple.b));
									}),
								newUncoloredPatternArray,
								resultArray);
							var newGrid = _Utils_update(
								grid,
								{
									drawing: _Utils_update(
										drawing,
										{activePath: _List_Nil, drawingMode: false})
								});
							var newModel = A2(
								$author$project$Logic$App$Patterns$MetaActions$applyMetaAction,
								_Utils_update(
									model,
									{
										castingContext: stackResult.ctx,
										grid: newGrid,
										insertionPoint: (_Utils_cmp(
											model.insertionPoint,
											$elm$core$Array$length(model.patternArray)) > 0) ? 0 : model.insertionPoint,
										patternArray: newPatternArray,
										stack: newStack,
										timeline: A2(
											$author$project$Logic$App$Utils$Utils$unshift,
											{patternIndex: -1, stack: $elm$core$Array$empty},
											stackResult.timeline)
									}),
								newPattern.metaAction);
							return A2(
								$author$project$Main$update,
								$author$project$Logic$App$Msg$SetTimelineIndex(
									$elm$core$Array$length(newModel.timeline)),
								newModel);
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										grid: _Utils_update(
											grid,
											{
												drawing: _Utils_update(
													drawing,
													{activePath: _List_Nil, drawingMode: false})
											})
									}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'RemoveFromPatternArray':
					var startIndex = msg.a;
					var endIndex = msg.b;
					var newUncoloredPatternArray = A3($author$project$Logic$App$Utils$Utils$removeFromArray, startIndex, endIndex, model.patternArray);
					var stackResult = A3(
						$author$project$Logic$App$Stack$EvalStack$applyPatternsToStack,
						$elm$core$Array$empty,
						castingContext,
						$elm$core$List$reverse(
							$elm$core$List$unzip(
								$elm$core$Array$toList(newUncoloredPatternArray)).a));
					var resultArray = stackResult.resultArray;
					var newStack = stackResult.stack;
					var newPatternArray = A3(
						$elm_community$array_extra$Array$Extra$map2,
						F2(
							function (patternTuple, result) {
								return $author$project$Logic$App$PatternList$PatternArray$updateDrawingColors(
									_Utils_Tuple2(
										A2($author$project$Logic$App$PatternList$PatternArray$applyColorToPatternFromResult, patternTuple.a, result),
										patternTuple.b));
							}),
						newUncoloredPatternArray,
						resultArray);
					return A2(
						$author$project$Main$update,
						$author$project$Logic$App$Msg$SetTimelineIndex(
							$elm$core$Array$length(stackResult.timeline) + 1),
						_Utils_update(
							model,
							{
								castingContext: stackResult.ctx,
								grid: _Utils_update(
									grid,
									{
										points: A5($author$project$Components$App$Grid$updateGridPoints, grid.width, grid.height, newPatternArray, _List_Nil, settings.gridScale)
									}),
								insertionPoint: (_Utils_cmp(
									model.insertionPoint,
									$elm$core$Array$length(newPatternArray)) > 0) ? 0 : ((_Utils_cmp(model.insertionPoint, endIndex) < 0) ? A2($elm$core$Basics$max, model.insertionPoint, 0) : A2($elm$core$Basics$max, model.insertionPoint - 1, 0)),
								patternArray: newPatternArray,
								stack: newStack,
								timeline: A2(
									$author$project$Logic$App$Utils$Utils$unshift,
									{patternIndex: -1, stack: $elm$core$Array$empty},
									stackResult.timeline)
							}));
				case 'SetGridScale':
					var scale = msg.a;
					return _Utils_Tuple2(
						$author$project$Logic$App$Grid$sortPatterns(
							_Utils_update(
								model,
								{
									grid: _Utils_update(
										grid,
										{
											points: A5($author$project$Components$App$Grid$updateGridPoints, grid.width, grid.height, model.patternArray, _List_Nil, scale)
										}),
									settings: _Utils_update(
										settings,
										{gridScale: scale})
								})),
						$elm$core$Platform$Cmd$none);
				case 'WindowResize':
					return _Utils_Tuple2(
						model,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2(
									$elm$core$Task$attempt,
									$author$project$Logic$App$Msg$GetGrid,
									$elm$browser$Browser$Dom$getElement('hex_grid')),
									A2(
									$elm$core$Task$attempt,
									$author$project$Logic$App$Msg$GetContentSize,
									$elm$browser$Browser$Dom$getElement('content'))
								])));
				case 'Tick':
					var newTime = msg.a;
					var drawnPoints = grid.drawnPoints;
					var autocompleteIndex = (model.ui.patternInputField === '') ? 0 : model.ui.suggestionIndex;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								grid: _Utils_update(
									grid,
									{
										drawnPoints: A2(
											$author$project$Components$App$Grid$updatemidLineOffsets,
											drawnPoints,
											$elm$time$Time$posixToMillis(newTime))
									}),
								time: $elm$time$Time$posixToMillis(newTime),
								ui: _Utils_update(
									ui,
									{suggestionIndex: autocompleteIndex})
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Ports$GetElementBoundingBoxById$requestBoundingBox('#add_pattern_input'),
									$author$project$Ports$CheckMouseOverDragHandle$requestCheckMouseOverDragHandle(_Utils_Tuple0),
									$author$project$Ports$GetElementBoundingBoxById$requestBoundingBoxes(
									$elm$core$Array$toList(
										A2(
											$elm$core$Array$indexedMap,
											F2(
												function (index, _v3) {
													return '[data-index=\"' + ($elm$core$String$fromInt(index) + '\"]');
												}),
											model.patternArray)))
								])));
				case 'UpdatePatternInputField':
					var text = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{patternInputField: text})
							}),
						$elm$core$Platform$Cmd$none);
				case 'InputPattern':
					var name = msg.a;
					var newImportQueue = (name !== '') ? A2(
						$elm$core$List$cons,
						A2(
							$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromName,
							$elm$core$Maybe$Just(model.castingContext.macros),
							name),
						model.importQueue) : model.importQueue;
					return $author$project$Main$updatePatternArrayFromQueue(
						_Utils_update(
							model,
							{importQueue: newImportQueue}));
				case 'SendNumberLiteralToGenerate':
					var number = msg.a;
					return _Utils_Tuple2(
						model,
						$author$project$Ports$HexNumGen$sendNumber(number));
				case 'RecieveGeneratedNumberLiteral':
					var signature = msg.a;
					var newPattern = A2(
						$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature,
						$elm$core$Maybe$Just(model.castingContext.macros),
						signature);
					return $author$project$Main$updatePatternArrayFromQueue(
						_Utils_update(
							model,
							{
								importQueue: A2(
									$elm$core$List$cons,
									_Utils_Tuple2(newPattern, $elm$core$Platform$Cmd$none),
									model.importQueue)
							}));
				case 'SelectPreviousSuggestion':
					var suggestLength = msg.a;
					var newIndex = (model.ui.suggestionIndex <= 0) ? (A2($elm$core$Basics$min, 3, suggestLength) - 1) : (model.ui.suggestionIndex - 1);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{suggestionIndex: newIndex})
							}),
						$elm$core$Platform$Cmd$none);
				case 'SelectNextSuggestion':
					var suggestLength = msg.a;
					var newIndex = (_Utils_cmp(
						model.ui.suggestionIndex,
						A2($elm$core$Basics$min, 3, suggestLength) - 1) > -1) ? 0 : (model.ui.suggestionIndex + 1);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{suggestionIndex: newIndex})
							}),
						$elm$core$Platform$Cmd$none);
				case 'SelectFirstSuggestion':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{suggestionIndex: 0})
							}),
						$elm$core$Platform$Cmd$none);
				case 'RequestInputBoundingBox':
					var id = msg.a;
					return _Utils_Tuple2(
						model,
						$author$project$Ports$GetElementBoundingBoxById$requestBoundingBox(id));
				case 'RecieveInputBoundingBox':
					var result = msg.a;
					if (result.$ === 'Ok') {
						var value = result.a;
						return (value.element === '#add_pattern_input') ? _Utils_Tuple2(
							_Utils_update(
								model,
								{
									ui: _Utils_update(
										ui,
										{
											patternInputLocation: _Utils_Tuple2(value.left, value.bottom)
										})
								}),
							$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'RecieveInputBoundingBoxes':
					var resultList = msg.a;
					var handleResult = function (result) {
						if (result.$ === 'Ok') {
							var value = result.a;
							return (value.top + value.bottom) / 2;
						} else {
							return 0.0;
						}
					};
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{
										patternElementMiddleLocations: A2($elm$core$List$map, handleResult, resultList)
									})
							}),
						$elm$core$Platform$Cmd$none);
				case 'DragStart':
					var index = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{
										dragging: _Utils_Tuple2(true, index),
										mouseOverElementIndex: index
									})
							}),
						$elm$core$Platform$Cmd$none);
				case 'DragEnd':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{
										dragging: _Utils_Tuple2(false, -1),
										mouseOverElementIndex: -1
									})
							}),
						$elm$core$Platform$Cmd$none);
				case 'DragOver':
					var eventJson = msg.b;
					var event = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$mouseMoveDecoder, eventJson);
					var mousePos = function () {
						if (event.$ === 'Ok') {
							var value = event.a;
							return _Utils_Tuple2(value.pageX, value.pageY);
						} else {
							return _Utils_Tuple2(0.0, 0.0);
						}
					}();
					var closestElementToMouseY = A2(
						$elm$core$Maybe$withDefault,
						_Utils_Tuple2(
							$elm$core$List$length(model.ui.patternElementMiddleLocations),
							0),
						$elm$core$List$head(
							A2(
								$elm$core$List$sortWith,
								F2(
									function (a, b) {
										var _v6 = A2($elm$core$Basics$compare, a.b, b.b);
										switch (_v6.$) {
											case 'LT':
												return $elm$core$Basics$LT;
											case 'EQ':
												return $elm$core$Basics$EQ;
											default:
												return $elm$core$Basics$GT;
										}
									}),
								A2(
									$elm$core$List$filter,
									function (element) {
										return element.b > 0;
									},
									A2(
										$elm$core$List$indexedMap,
										F2(
											function (index, yPos) {
												return _Utils_Tuple2(index, mousePos.b - yPos);
											}),
										model.ui.patternElementMiddleLocations))))).a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								mousePos: mousePos,
								ui: _Utils_update(
									ui,
									{mouseOverElementIndex: closestElementToMouseY})
							}),
						$elm$core$Platform$Cmd$none);
				case 'Drag':
					var event = msg.a;
					var mouseEvent = event.mouseEvent;
					var mousePos = mouseEvent.clientPos;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{mousePos: mousePos}),
						$elm$core$Platform$Cmd$none);
				case 'Drop':
					var originIndex = model.ui.dragging.b;
					var index = (_Utils_cmp(model.ui.mouseOverElementIndex, originIndex) > 0) ? (model.ui.mouseOverElementIndex - 1) : model.ui.mouseOverElementIndex;
					var newUncoloredPatternArray = function () {
						var _v8 = A2($elm$core$Array$get, originIndex, patternArray);
						if (_v8.$ === 'Just') {
							var element = _v8.a;
							return A3(
								$elm_community$array_extra$Array$Extra$insertAt,
								index,
								element,
								A3($author$project$Logic$App$Utils$Utils$removeFromArray, originIndex, originIndex + 1, model.patternArray));
						} else {
							return patternArray;
						}
					}();
					var stackResult = A3(
						$author$project$Logic$App$Stack$EvalStack$applyPatternsToStack,
						$elm$core$Array$empty,
						castingContext,
						$elm$core$List$reverse(
							$elm$core$List$unzip(
								$elm$core$Array$toList(newUncoloredPatternArray)).a));
					var newStack = stackResult.stack;
					var resultArray = stackResult.resultArray;
					var newPatternArray = A3(
						$elm_community$array_extra$Array$Extra$map2,
						F2(
							function (patternTuple, result) {
								return $author$project$Logic$App$PatternList$PatternArray$updateDrawingColors(
									_Utils_Tuple2(
										A2($author$project$Logic$App$PatternList$PatternArray$applyColorToPatternFromResult, patternTuple.a, result),
										patternTuple.b));
							}),
						newUncoloredPatternArray,
						resultArray);
					return A2(
						$author$project$Main$update,
						$author$project$Logic$App$Msg$SetTimelineIndex(
							$elm$core$Array$length(stackResult.timeline) + 1),
						$author$project$Logic$App$Grid$sortPatterns(
							_Utils_update(
								model,
								{
									castingContext: stackResult.ctx,
									grid: _Utils_update(
										grid,
										{
											points: A5($author$project$Components$App$Grid$updateGridPoints, grid.width, grid.height, newPatternArray, _List_Nil, settings.gridScale)
										}),
									patternArray: newPatternArray,
									stack: newStack,
									timeline: A2(
										$author$project$Logic$App$Utils$Utils$unshift,
										{patternIndex: -1, stack: $elm$core$Array$empty},
										stackResult.timeline),
									ui: _Utils_update(
										ui,
										{
											dragging: _Utils_Tuple2(false, -1),
											mouseOverElementIndex: -1
										})
								})));
				case 'SetFocus':
					var id = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{selectedInputID: id})
							}),
						$elm$core$Platform$Cmd$none);
				case 'RecieveMouseOverHandle':
					var bool = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{overDragHandle: bool})
							}),
						$elm$core$Platform$Cmd$none);
				case 'ChangeHeldItem':
					var itemString = msg.a;
					var item = function () {
						switch (itemString) {
							case 'Trinket':
								return $author$project$Logic$App$Types$Trinket;
							case 'Cypher':
								return $author$project$Logic$App$Types$Cypher;
							case 'Artifact':
								return $author$project$Logic$App$Types$Artifact;
							case 'Spellbook':
								return $author$project$Logic$App$Types$Spellbook;
							case 'Focus':
								return $author$project$Logic$App$Types$Focus;
							case 'Pie':
								return $author$project$Logic$App$Types$Pie;
							default:
								return $author$project$Logic$App$Types$NoItem;
						}
					}();
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								castingContext: _Utils_update(
									castingContext,
									{heldItem: item, heldItemContent: $elm$core$Maybe$Nothing})
							}),
						$elm$core$Platform$Cmd$none);
				case 'RequestGridDrawingAsGIF':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{downloadSrc: ''}),
						$author$project$Ports$GetGridDrawingAsGif$requestGIF(_Utils_Tuple0));
				case 'RecieveGridDrawingAsGIF':
					var src = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{downloadSrc: src}),
						$elm$file$File$Download$url(src));
				case 'RequestGridDrawingAsImage':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{downloadSrc: ''}),
						$author$project$Ports$GetGridDrawingAsImage$requestImage(_Utils_Tuple0));
				case 'RecieveGridDrawingAsImage':
					var src = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{downloadSrc: src}),
						$elm$file$File$Download$url(src));
				case 'UpdatePatternOuptut':
					var index = msg.a;
					var replacementPattern = msg.b;
					var newUncoloredPatternArray = A3(
						$elm_community$array_extra$Array$Extra$update,
						index,
						function (patternTuple) {
							var d = patternTuple.b;
							return _Utils_Tuple2(replacementPattern, d);
						},
						model.patternArray);
					var stackResult = A3(
						$author$project$Logic$App$Stack$EvalStack$applyPatternsToStack,
						$elm$core$Array$empty,
						castingContext,
						$elm$core$List$reverse(
							$elm$core$List$unzip(
								$elm$core$Array$toList(newUncoloredPatternArray)).a));
					var resultArray = stackResult.resultArray;
					var newStack = stackResult.stack;
					var newPatternArray = A3(
						$elm_community$array_extra$Array$Extra$map2,
						F2(
							function (patternTuple, result) {
								return $author$project$Logic$App$PatternList$PatternArray$updateDrawingColors(
									_Utils_Tuple2(
										A2($author$project$Logic$App$PatternList$PatternArray$applyColorToPatternFromResult, patternTuple.a, result),
										patternTuple.b));
							}),
						newUncoloredPatternArray,
						resultArray);
					return A2(
						$author$project$Main$update,
						$author$project$Logic$App$Msg$SetTimelineIndex(
							$elm$core$Array$length(stackResult.timeline) + 1),
						_Utils_update(
							model,
							{
								castingContext: stackResult.ctx,
								grid: _Utils_update(
									grid,
									{
										points: A5($author$project$Components$App$Grid$updateGridPoints, grid.width, grid.height, newPatternArray, _List_Nil, settings.gridScale)
									}),
								patternArray: newPatternArray,
								stack: newStack,
								timeline: A2(
									$author$project$Logic$App$Utils$Utils$unshift,
									{patternIndex: -1, stack: $elm$core$Array$empty},
									stackResult.timeline)
							}));
				case 'SetInsertionPoint':
					var index = msg.a;
					var keys = msg.b;
					return keys.shift ? (_Utils_eq(model.insertionPoint, index) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{insertionPoint: 0}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{insertionPoint: index}),
						$elm$core$Platform$Cmd$none)) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 'SetImportInputValue':
					var string = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{importInput: string})
							}),
						$elm$core$Platform$Cmd$none);
				case 'ImportText':
					var string = msg.a;
					var importQueue = A2($author$project$Logic$App$ImportExport$ImportParser$parseInput, string, model.castingContext.macros);
					return $author$project$Main$updatePatternArrayFromQueue(
						_Utils_update(
							model,
							{
								importQueue: importQueue,
								ui: _Utils_update(
									ui,
									{importInput: '', openOverlay: $author$project$Logic$App$Types$NoOverlay})
							}));
				case 'ViewOverlay':
					var overlay = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ui: _Utils_update(
									ui,
									{openOverlay: overlay})
							}),
						$elm$core$Platform$Cmd$none);
				case 'Download':
					var string = msg.a;
					return _Utils_Tuple2(
						model,
						A3($elm$file$File$Download$string, 'Hex.hexcasting', 'text/plain', string));
				case 'SetTimelineIndex':
					var index = msg.a;
					var timeline = ($elm$core$Array$length(model.timeline) < 2) ? A2(
						$elm$core$Array$repeat,
						2,
						{patternIndex: -1, stack: $elm$core$Array$empty}) : model.timeline;
					var timelinePatternIndex = (index >= 0) ? A2(
						$elm$core$Maybe$withDefault,
						$elm$core$Array$length(timeline),
						A2(
							$elm$core$Maybe$andThen,
							function (x) {
								return $elm$core$Maybe$Just(x.patternIndex);
							},
							A2(
								$elm$core$Array$get,
								index,
								$elm_community$array_extra$Array$Extra$reverse(timeline)))) : (-1);
					var newPatternArray = $elm_community$array_extra$Array$Extra$reverse(
						$elm$core$Array$fromList(
							A2(
								$elm$core$List$map,
								function (indexTuple) {
									var patternIndex = indexTuple.a;
									var tuple = indexTuple.b;
									return $author$project$Logic$App$PatternList$PatternArray$updateDrawingColors(
										function () {
											var pat = tuple.a;
											var draw = tuple.b;
											return (_Utils_cmp(timelinePatternIndex, patternIndex) < 0) ? _Utils_Tuple2(
												_Utils_update(
													pat,
													{active: false}),
												draw) : _Utils_Tuple2(
												_Utils_update(
													pat,
													{active: true}),
												draw);
										}());
								},
								$elm$core$Array$toIndexedList(
									$elm_community$array_extra$Array$Extra$reverse(model.patternArray)))));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								grid: _Utils_update(
									grid,
									{
										drawnPoints: $author$project$Components$App$Grid$generateDrawnPointsListFromPatternArray(newPatternArray),
										points: A5($author$project$Components$App$Grid$updateUsedGridPoints, grid.width, grid.height, newPatternArray, _List_Nil, settings.gridScale)
									}),
								patternArray: newPatternArray,
								stack: _Utils_eq(
									index,
									$elm$core$Array$length(timeline)) ? model.stack : A2(
									$elm$core$Maybe$withDefault,
									$elm$core$Array$empty,
									A2(
										$elm$core$Maybe$andThen,
										function (x) {
											return $elm$core$Maybe$Just(x.stack);
										},
										A2(
											$elm$core$Array$get,
											index,
											$elm_community$array_extra$Array$Extra$reverse(timeline)))),
								timelineIndex: index
							}),
						$elm$core$Platform$Cmd$none);
				default:
					var event = msg.a;
					var timeline = ($elm$core$Array$length(model.timeline) < 2) ? A2(
						$elm$core$Array$repeat,
						2,
						{patternIndex: -1, stack: $elm$core$Array$empty}) : model.timeline;
					if (event.altKey && _Utils_eq(
						event.key,
						$elm$core$Maybe$Just('ArrowRight'))) {
						var $temp$msg = $author$project$Logic$App$Msg$SetTimelineIndex(
							A2(
								$elm$core$Basics$min,
								$elm$core$Array$length(timeline) - 2,
								model.timelineIndex + 1)),
							$temp$model = model;
						msg = $temp$msg;
						model = $temp$model;
						continue update;
					} else {
						if (event.altKey && _Utils_eq(
							event.key,
							$elm$core$Maybe$Just('ArrowLeft'))) {
							var $temp$msg = $author$project$Logic$App$Msg$SetTimelineIndex(
								A2(
									$elm$core$Basics$min,
									$elm$core$Array$length(timeline) - 3,
									A2($elm$core$Basics$max, -1, model.timelineIndex - 1))),
								$temp$model = model;
							msg = $temp$msg;
							model = $temp$model;
							continue update;
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					}
			}
		}
	});
var $author$project$Main$updatePatternArrayFromQueue = function (model) {
	if ($elm$core$List$length(model.importQueue) > 0) {
		var ui = model.ui;
		var getPattern = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2($author$project$Logic$App$Patterns$PatternRegistry$unknownPattern, $elm$core$Platform$Cmd$none),
			$elm$core$List$head(model.importQueue));
		var newPattern = getPattern.a;
		var newUncoloredPatternArray = A3($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern, model.insertionPoint);
		var command = getPattern.b;
		var castingContext = model.castingContext;
		var stackResult = A3(
			$author$project$Logic$App$Stack$EvalStack$applyPatternsToStack,
			$elm$core$Array$empty,
			castingContext,
			$elm$core$List$reverse(
				A2(
					$elm$core$List$map,
					function (x) {
						return x.a;
					},
					$elm$core$Array$toList(
						A3($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern, model.insertionPoint)))));
		var newPatternArray = A3(
			$elm_community$array_extra$Array$Extra$map2,
			F2(
				function (patternTuple, result) {
					return $author$project$Logic$App$PatternList$PatternArray$updateDrawingColors(
						_Utils_Tuple2(
							A2($author$project$Logic$App$PatternList$PatternArray$applyColorToPatternFromResult, patternTuple.a, result),
							patternTuple.b));
				}),
			newUncoloredPatternArray,
			stackResult.resultArray);
		var patterns = A2(
			$elm$core$Array$map,
			function (x) {
				return x.a;
			},
			newPatternArray);
		var drawPatternsResult = A2($author$project$Logic$App$Grid$drawPatterns, patterns, model.grid);
		return _Utils_eq(command, $elm$core$Platform$Cmd$none) ? $author$project$Main$updatePatternArrayFromQueue(
			A2(
				$author$project$Logic$App$Patterns$MetaActions$applyMetaAction,
				_Utils_update(
					model,
					{
						castingContext: stackResult.ctx,
						grid: drawPatternsResult.grid,
						importQueue: A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							$elm$core$List$tail(model.importQueue)),
						insertionPoint: (_Utils_cmp(
							model.insertionPoint,
							$elm$core$Array$length(model.patternArray)) > 0) ? 0 : model.insertionPoint,
						patternArray: drawPatternsResult.patternArray,
						stack: stackResult.stack,
						timeline: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							{patternIndex: -1, stack: $elm$core$Array$empty},
							stackResult.timeline),
						ui: _Utils_update(
							ui,
							{patternInputField: ''})
					}),
				newPattern.metaAction)) : _Utils_Tuple2(
			_Utils_update(
				model,
				{
					importQueue: A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						$elm$core$List$tail(model.importQueue))
				}),
			command);
	} else {
		return A2(
			$author$project$Main$update,
			$author$project$Logic$App$Msg$SetTimelineIndex(
				$elm$core$Array$length(model.timeline)),
			model);
	}
};
var $author$project$Logic$App$Msg$MouseMove = function (a) {
	return {$: 'MouseMove', a: a};
};
var $author$project$Logic$App$Msg$MouseUp = {$: 'MouseUp'};
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$Logic$App$Msg$Download = function (a) {
	return {$: 'Download', a: a};
};
var $author$project$Logic$App$Types$ExportTextOverlay = {$: 'ExportTextOverlay'};
var $author$project$Logic$App$Msg$SetImportInputValue = function (a) {
	return {$: 'SetImportInputValue', a: a};
};
var $author$project$Logic$App$Msg$ViewOverlay = function (a) {
	return {$: 'ViewOverlay', a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $author$project$Logic$App$ImportExport$ExportAsGiveCommand$exportAsGiveCommand = function (patternArray) {
	var singatureList = A2(
		$elm$core$List$map,
		function (pattern) {
			return pattern.signature;
		},
		$elm$core$List$reverse(
			$elm$core$Array$toList(patternArray)));
	var patternStartString = '{\"hexcasting:type\": \"hexcasting:pattern\", \"hexcasting:data\": {angles: [B; ';
	var patternEndString = '], start_dir: 0b}}';
	var mapAngleToBytes = function (angle) {
		switch (angle) {
			case 'w':
				return '0B';
			case 'e':
				return '1B';
			case 'd':
				return '2B';
			case 'a':
				return '4B';
			case 'q':
				return '5B';
			default:
				return '3B';
		}
	};
	var commandStartString = '/give @p hexcasting:focus{data: {\"hexcasting:type\": \"hexcasting:list\", \"hexcasting:data\": [';
	var commandEndString = ']}} 1';
	return $elm$core$String$concat(
		_List_fromArray(
			[
				commandStartString,
				A2(
				$elm$core$String$join,
				', ',
				A2(
					$elm$core$List$map,
					function (signature) {
						return $elm$core$String$concat(
							_List_fromArray(
								[
									patternStartString,
									A2(
									$elm$core$String$join,
									', ',
									A2(
										$elm$core$List$map,
										mapAngleToBytes,
										A2($elm$core$String$split, '', signature))),
									patternEndString
								]));
					},
					singatureList)),
				commandEndString
			]));
};
var $author$project$Logic$App$ImportExport$ExportAsText$exportPatternsAsLineList = function (patternArray) {
	var mapPatternToLine = F2(
		function (pattern, accumulator) {
			var lines = accumulator.b;
			var indentDepth = accumulator.a;
			var applyIndent = F2(
				function (depth, string) {
					return $elm$core$String$concat(
						_Utils_ap(
							A2($elm$core$List$repeat, depth, '    '),
							_List_fromArray(
								[string])));
				});
			var _v1 = pattern.internalName;
			switch (_v1) {
				case 'open_paren':
					return _Utils_Tuple2(
						indentDepth + 1,
						A2(
							$elm$core$List$cons,
							A2(applyIndent, indentDepth, '{'),
							lines));
				case 'close_paren':
					return _Utils_Tuple2(
						indentDepth - 1,
						A2(
							$elm$core$List$cons,
							A2(applyIndent, indentDepth - 1, '}'),
							lines));
				default:
					return _Utils_Tuple2(
						indentDepth,
						A2(
							$elm$core$List$cons,
							A2(applyIndent, indentDepth, pattern.displayName),
							lines));
			}
		});
	var _v0 = A2(
		$elm$core$Debug$log,
		'give',
		$author$project$Logic$App$ImportExport$ExportAsGiveCommand$exportAsGiveCommand(patternArray));
	return A2(
		$elm$core$String$join,
		'\n',
		$elm$core$List$reverse(
			A3(
				$elm$core$Array$foldr,
				mapPatternToLine,
				_Utils_Tuple2(0, _List_Nil),
				patternArray).b));
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Components$App$Overlays$ExportTextOverlay$exportTextOverlay = function (model) {
	if (!_Utils_eq(model.ui.openOverlay, $author$project$Logic$App$Types$ExportTextOverlay)) {
		return _List_Nil;
	} else {
		var patternText = $author$project$Logic$App$ImportExport$ExportAsText$exportPatternsAsLineList(
			A2($elm$core$Array$map, $elm$core$Tuple$first, model.patternArray));
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('overlay')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('export_text'),
								$elm$html$Html$Events$onInput($author$project$Logic$App$Msg$SetImportInputValue),
								$elm$html$Html$Attributes$value(model.ui.importInput),
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'flex-direction', 'column')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(patternText)
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('import_overlay_button_container')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('import_overlay_button'),
										$elm$html$Html$Events$onClick(
										$author$project$Logic$App$Msg$Download(patternText))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Download')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('import_overlay_button'),
										$elm$html$Html$Attributes$class('cancel_button'),
										$elm$html$Html$Events$onClick(
										$author$project$Logic$App$Msg$ViewOverlay($author$project$Logic$App$Types$NoOverlay))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									]))
							]))
					]))
			]);
	}
};
var $author$project$Logic$App$Msg$ImportText = function (a) {
	return {$: 'ImportText', a: a};
};
var $author$project$Logic$App$Types$ImportTextOverlay = {$: 'ImportTextOverlay'};
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$Components$App$Overlays$ImportTextOverlay$importTextOverlay = function (model) {
	return (!_Utils_eq(model.ui.openOverlay, $author$project$Logic$App$Types$ImportTextOverlay)) ? _List_Nil : _List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('overlay')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$textarea,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('import_input'),
							$elm$html$Html$Events$onInput($author$project$Logic$App$Msg$SetImportInputValue),
							$elm$html$Html$Attributes$value(model.ui.importInput)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('import_overlay_button_container')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('import_overlay_button'),
									$elm$html$Html$Events$onClick(
									$author$project$Logic$App$Msg$ImportText(model.ui.importInput))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Import')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('import_overlay_button'),
									$elm$html$Html$Attributes$class('cancel_button'),
									$elm$html$Html$Events$onClick(
									$author$project$Logic$App$Msg$ViewOverlay($author$project$Logic$App$Types$NoOverlay))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Cancel')
								]))
						]))
				]))
		]);
};
var $author$project$Logic$App$Types$ConfigHexPanel = {$: 'ConfigHexPanel'};
var $author$project$Logic$App$Types$FilePanel = {$: 'FilePanel'};
var $author$project$Logic$App$Types$LibraryPanel = {$: 'LibraryPanel'};
var $author$project$Logic$App$Types$StackPanel = {$: 'StackPanel'};
var $author$project$Logic$App$Msg$ViewPanel = F2(
	function (a, b) {
		return {$: 'ViewPanel', a: a, b: b};
	});
var $lattyware$elm_fontawesome$FontAwesome$IconDef = F4(
	function (prefix, name, size, paths) {
		return {name: name, paths: paths, prefix: prefix, size: size};
	});
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$book = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'book',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M448 336v-288C448 21.49 426.5 0 400 0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-31.1c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM143.1 128h192C344.8 128 352 135.2 352 144C352 152.8 344.8 160 336 160H143.1C135.2 160 128 152.8 128 144C128 135.2 135.2 128 143.1 128zM143.1 192h192C344.8 192 352 199.2 352 208C352 216.8 344.8 224 336 224H143.1C135.2 224 128 216.8 128 208C128 199.2 135.2 192 143.1 192zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Internal$Icon = function (a) {
	return {$: 'Icon', a: a};
};
var $lattyware$elm_fontawesome$FontAwesome$present = function (icon) {
	return $lattyware$elm_fontawesome$FontAwesome$Internal$Icon(
		{attributes: _List_Nil, icon: icon, id: $elm$core$Maybe$Nothing, outer: $elm$core$Maybe$Nothing, role: 'img', title: $elm$core$Maybe$Nothing, transforms: _List_Nil});
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$book = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$book);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$code = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'code',
	_Utils_Tuple2(640, 512),
	_Utils_Tuple2('M414.8 40.79L286.8 488.8C281.9 505.8 264.2 515.6 247.2 510.8C230.2 505.9 220.4 488.2 225.2 471.2L353.2 23.21C358.1 6.216 375.8-3.624 392.8 1.232C409.8 6.087 419.6 23.8 414.8 40.79H414.8zM518.6 121.4L630.6 233.4C643.1 245.9 643.1 266.1 630.6 278.6L518.6 390.6C506.1 403.1 485.9 403.1 473.4 390.6C460.9 378.1 460.9 357.9 473.4 345.4L562.7 256L473.4 166.6C460.9 154.1 460.9 133.9 473.4 121.4C485.9 108.9 506.1 108.9 518.6 121.4V121.4zM166.6 166.6L77.25 256L166.6 345.4C179.1 357.9 179.1 378.1 166.6 390.6C154.1 403.1 133.9 403.1 121.4 390.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4L121.4 121.4C133.9 108.9 154.1 108.9 166.6 121.4C179.1 133.9 179.1 154.1 166.6 166.6V166.6z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$code = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$code);
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $lattyware$elm_fontawesome$FontAwesome$Styles$css = A3(
	$elm$html$Html$node,
	'style',
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text(':root, :host {  --fa-font-solid: normal 900 1em/1 \"Font Awesome 6 Solid\";  --fa-font-regular: normal 400 1em/1 \"Font Awesome 6 Regular\";  --fa-font-light: normal 300 1em/1 \"Font Awesome 6 Light\";  --fa-font-thin: normal 100 1em/1 \"Font Awesome 6 Thin\";  --fa-font-duotone: normal 900 1em/1 \"Font Awesome 6 Duotone\";  --fa-font-brands: normal 400 1em/1 \"Font Awesome 6 Brands\";}svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {  overflow: visible;  box-sizing: content-box;}.svg-inline--fa {  display: var(--fa-display, inline-block);  height: 1em;  overflow: visible;  vertical-align: -0.125em;}.svg-inline--fa.fa-2xs {  vertical-align: 0.1em;}.svg-inline--fa.fa-xs {  vertical-align: 0em;}.svg-inline--fa.fa-sm {  vertical-align: -0.0714285705em;}.svg-inline--fa.fa-lg {  vertical-align: -0.2em;}.svg-inline--fa.fa-xl {  vertical-align: -0.25em;}.svg-inline--fa.fa-2xl {  vertical-align: -0.3125em;}.svg-inline--fa.fa-pull-left {  margin-right: var(--fa-pull-margin, 0.3em);  width: auto;}.svg-inline--fa.fa-pull-right {  margin-left: var(--fa-pull-margin, 0.3em);  width: auto;}.svg-inline--fa.fa-li {  width: var(--fa-li-width, 2em);  top: 0.25em;}.svg-inline--fa.fa-fw {  width: var(--fa-fw-width, 1.25em);}.fa-layers svg.svg-inline--fa {  bottom: 0;  left: 0;  margin: auto;  position: absolute;  right: 0;  top: 0;}.fa-layers-counter, .fa-layers-text {  display: inline-block;  position: absolute;  text-align: center;}.fa-layers {  display: inline-block;  height: 1em;  position: relative;  text-align: center;  vertical-align: -0.125em;  width: 1em;}.fa-layers svg.svg-inline--fa {  -webkit-transform-origin: center center;          transform-origin: center center;}.fa-layers-text {  left: 50%;  top: 50%;  -webkit-transform: translate(-50%, -50%);          transform: translate(-50%, -50%);  -webkit-transform-origin: center center;          transform-origin: center center;}.fa-layers-counter {  background-color: var(--fa-counter-background-color, #ff253a);  border-radius: var(--fa-counter-border-radius, 1em);  box-sizing: border-box;  color: var(--fa-inverse, #fff);  line-height: var(--fa-counter-line-height, 1);  max-width: var(--fa-counter-max-width, 5em);  min-width: var(--fa-counter-min-width, 1.5em);  overflow: hidden;  padding: var(--fa-counter-padding, 0.25em 0.5em);  right: var(--fa-right, 0);  text-overflow: ellipsis;  top: var(--fa-top, 0);  -webkit-transform: scale(var(--fa-counter-scale, 0.25));          transform: scale(var(--fa-counter-scale, 0.25));  -webkit-transform-origin: top right;          transform-origin: top right;}.fa-layers-bottom-right {  bottom: var(--fa-bottom, 0);  right: var(--fa-right, 0);  top: auto;  -webkit-transform: scale(var(--fa-layers-scale, 0.25));          transform: scale(var(--fa-layers-scale, 0.25));  -webkit-transform-origin: bottom right;          transform-origin: bottom right;}.fa-layers-bottom-left {  bottom: var(--fa-bottom, 0);  left: var(--fa-left, 0);  right: auto;  top: auto;  -webkit-transform: scale(var(--fa-layers-scale, 0.25));          transform: scale(var(--fa-layers-scale, 0.25));  -webkit-transform-origin: bottom left;          transform-origin: bottom left;}.fa-layers-top-right {  top: var(--fa-top, 0);  right: var(--fa-right, 0);  -webkit-transform: scale(var(--fa-layers-scale, 0.25));          transform: scale(var(--fa-layers-scale, 0.25));  -webkit-transform-origin: top right;          transform-origin: top right;}.fa-layers-top-left {  left: var(--fa-left, 0);  right: auto;  top: var(--fa-top, 0);  -webkit-transform: scale(var(--fa-layers-scale, 0.25));          transform: scale(var(--fa-layers-scale, 0.25));  -webkit-transform-origin: top left;          transform-origin: top left;}.fa-1x {  font-size: 1em;}.fa-2x {  font-size: 2em;}.fa-3x {  font-size: 3em;}.fa-4x {  font-size: 4em;}.fa-5x {  font-size: 5em;}.fa-6x {  font-size: 6em;}.fa-7x {  font-size: 7em;}.fa-8x {  font-size: 8em;}.fa-9x {  font-size: 9em;}.fa-10x {  font-size: 10em;}.fa-2xs {  font-size: 0.625em;  line-height: 0.1em;  vertical-align: 0.225em;}.fa-xs {  font-size: 0.75em;  line-height: 0.0833333337em;  vertical-align: 0.125em;}.fa-sm {  font-size: 0.875em;  line-height: 0.0714285718em;  vertical-align: 0.0535714295em;}.fa-lg {  font-size: 1.25em;  line-height: 0.05em;  vertical-align: -0.075em;}.fa-xl {  font-size: 1.5em;  line-height: 0.0416666682em;  vertical-align: -0.125em;}.fa-2xl {  font-size: 2em;  line-height: 0.03125em;  vertical-align: -0.1875em;}.fa-fw {  text-align: center;  width: 1.25em;}.fa-ul {  list-style-type: none;  margin-left: var(--fa-li-margin, 2.5em);  padding-left: 0;}.fa-ul > li {  position: relative;}.fa-li {  left: calc(var(--fa-li-width, 2em) * -1);  position: absolute;  text-align: center;  width: var(--fa-li-width, 2em);  line-height: inherit;}.fa-border {  border-color: var(--fa-border-color, #eee);  border-radius: var(--fa-border-radius, 0.1em);  border-style: var(--fa-border-style, solid);  border-width: var(--fa-border-width, 0.08em);  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);}.fa-pull-left {  float: left;  margin-right: var(--fa-pull-margin, 0.3em);}.fa-pull-right {  float: right;  margin-left: var(--fa-pull-margin, 0.3em);}.fa-beat {  -webkit-animation-name: fa-beat;          animation-name: fa-beat;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);          animation-timing-function: var(--fa-animation-timing, ease-in-out);}.fa-bounce {  -webkit-animation-name: fa-bounce;          animation-name: fa-bounce;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));}.fa-fade {  -webkit-animation-name: fa-fade;          animation-name: fa-fade;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));}.fa-beat-fade {  -webkit-animation-name: fa-beat-fade;          animation-name: fa-beat-fade;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));}.fa-flip {  -webkit-animation-name: fa-flip;          animation-name: fa-flip;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);          animation-timing-function: var(--fa-animation-timing, ease-in-out);}.fa-shake {  -webkit-animation-name: fa-shake;          animation-name: fa-shake;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, linear);          animation-timing-function: var(--fa-animation-timing, linear);}.fa-spin {  -webkit-animation-name: fa-spin;          animation-name: fa-spin;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 2s);          animation-duration: var(--fa-animation-duration, 2s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, linear);          animation-timing-function: var(--fa-animation-timing, linear);}.fa-spin-reverse {  --fa-animation-direction: reverse;}.fa-pulse,.fa-spin-pulse {  -webkit-animation-name: fa-spin;          animation-name: fa-spin;  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, steps(8));          animation-timing-function: var(--fa-animation-timing, steps(8));}@media (prefers-reduced-motion: reduce) {  .fa-beat,.fa-bounce,.fa-fade,.fa-beat-fade,.fa-flip,.fa-pulse,.fa-shake,.fa-spin,.fa-spin-pulse {    -webkit-animation-delay: -1ms;            animation-delay: -1ms;    -webkit-animation-duration: 1ms;            animation-duration: 1ms;    -webkit-animation-iteration-count: 1;            animation-iteration-count: 1;    transition-delay: 0s;    transition-duration: 0s;  }}@-webkit-keyframes fa-beat {  0%, 90% {    -webkit-transform: scale(1);            transform: scale(1);  }  45% {    -webkit-transform: scale(var(--fa-beat-scale, 1.25));            transform: scale(var(--fa-beat-scale, 1.25));  }}@keyframes fa-beat {  0%, 90% {    -webkit-transform: scale(1);            transform: scale(1);  }  45% {    -webkit-transform: scale(var(--fa-beat-scale, 1.25));            transform: scale(var(--fa-beat-scale, 1.25));  }}@-webkit-keyframes fa-bounce {  0% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }  10% {    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);  }  30% {    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));  }  50% {    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);  }  57% {    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));  }  64% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }  100% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }}@keyframes fa-bounce {  0% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }  10% {    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);  }  30% {    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));  }  50% {    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);  }  57% {    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));  }  64% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }  100% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }}@-webkit-keyframes fa-fade {  50% {    opacity: var(--fa-fade-opacity, 0.4);  }}@keyframes fa-fade {  50% {    opacity: var(--fa-fade-opacity, 0.4);  }}@-webkit-keyframes fa-beat-fade {  0%, 100% {    opacity: var(--fa-beat-fade-opacity, 0.4);    -webkit-transform: scale(1);            transform: scale(1);  }  50% {    opacity: 1;    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));            transform: scale(var(--fa-beat-fade-scale, 1.125));  }}@keyframes fa-beat-fade {  0%, 100% {    opacity: var(--fa-beat-fade-opacity, 0.4);    -webkit-transform: scale(1);            transform: scale(1);  }  50% {    opacity: 1;    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));            transform: scale(var(--fa-beat-fade-scale, 1.125));  }}@-webkit-keyframes fa-flip {  50% {    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));  }}@keyframes fa-flip {  50% {    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));  }}@-webkit-keyframes fa-shake {  0% {    -webkit-transform: rotate(-15deg);            transform: rotate(-15deg);  }  4% {    -webkit-transform: rotate(15deg);            transform: rotate(15deg);  }  8%, 24% {    -webkit-transform: rotate(-18deg);            transform: rotate(-18deg);  }  12%, 28% {    -webkit-transform: rotate(18deg);            transform: rotate(18deg);  }  16% {    -webkit-transform: rotate(-22deg);            transform: rotate(-22deg);  }  20% {    -webkit-transform: rotate(22deg);            transform: rotate(22deg);  }  32% {    -webkit-transform: rotate(-12deg);            transform: rotate(-12deg);  }  36% {    -webkit-transform: rotate(12deg);            transform: rotate(12deg);  }  40%, 100% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }}@keyframes fa-shake {  0% {    -webkit-transform: rotate(-15deg);            transform: rotate(-15deg);  }  4% {    -webkit-transform: rotate(15deg);            transform: rotate(15deg);  }  8%, 24% {    -webkit-transform: rotate(-18deg);            transform: rotate(-18deg);  }  12%, 28% {    -webkit-transform: rotate(18deg);            transform: rotate(18deg);  }  16% {    -webkit-transform: rotate(-22deg);            transform: rotate(-22deg);  }  20% {    -webkit-transform: rotate(22deg);            transform: rotate(22deg);  }  32% {    -webkit-transform: rotate(-12deg);            transform: rotate(-12deg);  }  36% {    -webkit-transform: rotate(12deg);            transform: rotate(12deg);  }  40%, 100% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }}@-webkit-keyframes fa-spin {  0% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }  100% {    -webkit-transform: rotate(360deg);            transform: rotate(360deg);  }}@keyframes fa-spin {  0% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }  100% {    -webkit-transform: rotate(360deg);            transform: rotate(360deg);  }}.fa-rotate-90 {  -webkit-transform: rotate(90deg);          transform: rotate(90deg);}.fa-rotate-180 {  -webkit-transform: rotate(180deg);          transform: rotate(180deg);}.fa-rotate-270 {  -webkit-transform: rotate(270deg);          transform: rotate(270deg);}.fa-flip-horizontal {  -webkit-transform: scale(-1, 1);          transform: scale(-1, 1);}.fa-flip-vertical {  -webkit-transform: scale(1, -1);          transform: scale(1, -1);}.fa-flip-both,.fa-flip-horizontal.fa-flip-vertical {  -webkit-transform: scale(-1, -1);          transform: scale(-1, -1);}.fa-rotate-by {  -webkit-transform: rotate(var(--fa-rotate-angle, none));          transform: rotate(var(--fa-rotate-angle, none));}.fa-stack {  display: inline-block;  vertical-align: middle;  height: 2em;  position: relative;  width: 2.5em;}.fa-stack-1x,.fa-stack-2x {  bottom: 0;  left: 0;  margin: auto;  position: absolute;  right: 0;  top: 0;  z-index: var(--fa-stack-z-index, auto);}.svg-inline--fa.fa-stack-1x {  height: 1em;  width: 1.25em;}.svg-inline--fa.fa-stack-2x {  height: 2em;  width: 2.5em;}.fa-inverse {  color: var(--fa-inverse, #fff);}.sr-only,.fa-sr-only {  position: absolute;  width: 1px;  height: 1px;  padding: 0;  margin: -1px;  overflow: hidden;  clip: rect(0, 0, 0, 0);  white-space: nowrap;  border-width: 0;}.sr-only-focusable:not(:focus),.fa-sr-only-focusable:not(:focus) {  position: absolute;  width: 1px;  height: 1px;  padding: 0;  margin: -1px;  overflow: hidden;  clip: rect(0, 0, 0, 0);  white-space: nowrap;  border-width: 0;}.svg-inline--fa .fa-primary {  fill: var(--fa-primary-color, currentColor);  opacity: var(--fa-primary-opacity, 1);}.svg-inline--fa .fa-secondary {  fill: var(--fa-secondary-color, currentColor);  opacity: var(--fa-secondary-opacity, 0.4);}.svg-inline--fa.fa-swap-opacity .fa-primary {  opacity: var(--fa-secondary-opacity, 0.4);}.svg-inline--fa.fa-swap-opacity .fa-secondary {  opacity: var(--fa-primary-opacity, 1);}.svg-inline--fa mask .fa-primary,.svg-inline--fa mask .fa-secondary {  fill: black;}.fad.fa-inverse,.fa-duotone.fa-inverse {  color: var(--fa-inverse, #fff);}')
		]));
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$file = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'file',
	_Utils_Tuple2(384, 512),
	_Utils_Tuple2('M0 64C0 28.65 28.65 0 64 0H224V128C224 145.7 238.3 160 256 160H384V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM256 128V0L384 128H256z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$file = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$file);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$gear = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'gear',
	_Utils_Tuple2(512, 512),
	_Utils_Tuple2('M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$gear = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$gear);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$house = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'house',
	_Utils_Tuple2(576, 512),
	_Utils_Tuple2('M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$house = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$house);
var $lattyware$elm_fontawesome$FontAwesome$Solid$home = $lattyware$elm_fontawesome$FontAwesome$Solid$house;
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$layerGroup = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'layer-group',
	_Utils_Tuple2(512, 512),
	_Utils_Tuple2('M232.5 5.171C247.4-1.718 264.6-1.718 279.5 5.171L498.1 106.2C506.6 110.1 512 118.6 512 127.1C512 137.3 506.6 145.8 498.1 149.8L279.5 250.8C264.6 257.7 247.4 257.7 232.5 250.8L13.93 149.8C5.438 145.8 0 137.3 0 127.1C0 118.6 5.437 110.1 13.93 106.2L232.5 5.171zM498.1 234.2C506.6 238.1 512 246.6 512 255.1C512 265.3 506.6 273.8 498.1 277.8L279.5 378.8C264.6 385.7 247.4 385.7 232.5 378.8L13.93 277.8C5.438 273.8 0 265.3 0 255.1C0 246.6 5.437 238.1 13.93 234.2L67.13 209.6L219.1 279.8C242.5 290.7 269.5 290.7 292.9 279.8L444.9 209.6L498.1 234.2zM292.9 407.8L444.9 337.6L498.1 362.2C506.6 366.1 512 374.6 512 383.1C512 393.3 506.6 401.8 498.1 405.8L279.5 506.8C264.6 513.7 247.4 513.7 232.5 506.8L13.93 405.8C5.438 401.8 0 393.3 0 383.1C0 374.6 5.437 366.1 13.93 362.2L67.13 337.6L219.1 407.8C242.5 418.7 269.5 418.7 292.9 407.8V407.8z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$layerGroup = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$layerGroup);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions = {preventDefault: true, stopPropagation: false};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event = F6(
	function (keys, button, clientPos, offsetPos, pagePos, screenPos) {
		return {button: button, clientPos: clientPos, keys: keys, offsetPos: offsetPos, pagePos: pagePos, screenPos: screenPos};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton = {$: 'BackButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton = {$: 'ErrorButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton = {$: 'ForwardButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton = {$: 'MainButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton = {$: 'MiddleButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton = {$: 'SecondButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId = function (id) {
	switch (id) {
		case 0:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton;
		case 1:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton;
		case 2:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton;
		case 3:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton;
		case 4:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton;
		default:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton;
	}
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder = A2(
	$elm$json$Json$Decode$map,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId,
	A2($elm$json$Json$Decode$field, 'button', $elm$json$Json$Decode$int));
var $mpizenberg$elm_pointer_events$Internal$Decode$clientPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'clientY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$Keys = F3(
	function (alt, ctrl, shift) {
		return {alt: alt, ctrl: ctrl, shift: shift};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $mpizenberg$elm_pointer_events$Internal$Decode$keys = A4(
	$elm$json$Json$Decode$map3,
	$mpizenberg$elm_pointer_events$Internal$Decode$Keys,
	A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$map6 = _Json_map6;
var $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$pagePos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$screenPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'screenX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'screenY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder = A7($elm$json$Json$Decode$map6, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event, $mpizenberg$elm_pointer_events$Internal$Decode$keys, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder, $mpizenberg$elm_pointer_events$Internal$Decode$clientPos, $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos, $mpizenberg$elm_pointer_events$Internal$Decode$pagePos, $mpizenberg$elm_pointer_events$Internal$Decode$screenPos);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions = F3(
	function (event, options, tag) {
		return A2(
			$elm$html$Html$Events$custom,
			event,
			A2(
				$elm$json$Json$Decode$map,
				function (ev) {
					return {
						message: tag(ev),
						preventDefault: options.preventDefault,
						stopPropagation: options.stopPropagation
					};
				},
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'click', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$sliders = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'sliders',
	_Utils_Tuple2(512, 512),
	_Utils_Tuple2('M0 416C0 398.3 14.33 384 32 384H86.66C99 355.7 127.2 336 160 336C192.8 336 220.1 355.7 233.3 384H480C497.7 384 512 398.3 512 416C512 433.7 497.7 448 480 448H233.3C220.1 476.3 192.8 496 160 496C127.2 496 99 476.3 86.66 448H32C14.33 448 0 433.7 0 416V416zM192 416C192 398.3 177.7 384 160 384C142.3 384 128 398.3 128 416C128 433.7 142.3 448 160 448C177.7 448 192 433.7 192 416zM352 176C384.8 176 412.1 195.7 425.3 224H480C497.7 224 512 238.3 512 256C512 273.7 497.7 288 480 288H425.3C412.1 316.3 384.8 336 352 336C319.2 336 291 316.3 278.7 288H32C14.33 288 0 273.7 0 256C0 238.3 14.33 224 32 224H278.7C291 195.7 319.2 176 352 176zM384 256C384 238.3 369.7 224 352 224C334.3 224 320 238.3 320 256C320 273.7 334.3 288 352 288C369.7 288 384 273.7 384 256zM480 64C497.7 64 512 78.33 512 96C512 113.7 497.7 128 480 128H265.3C252.1 156.3 224.8 176 192 176C159.2 176 131 156.3 118.7 128H32C14.33 128 0 113.7 0 96C0 78.33 14.33 64 32 64H118.7C131 35.75 159.2 16 192 16C224.8 16 252.1 35.75 265.3 64H480zM160 96C160 113.7 174.3 128 192 128C209.7 128 224 113.7 224 96C224 78.33 209.7 64 192 64C174.3 64 160 78.33 160 96z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$sliders = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$sliders);
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $lattyware$elm_fontawesome$FontAwesome$Attributes$sm = $elm$svg$Svg$Attributes$class('fa-sm');
var $lattyware$elm_fontawesome$FontAwesome$styled = F2(
	function (attributes, _v0) {
		var presentation = _v0.a;
		return $lattyware$elm_fontawesome$FontAwesome$Internal$Icon(
			_Utils_update(
				presentation,
				{
					attributes: _Utils_ap(presentation.attributes, attributes)
				}));
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $elm$html$Html$Attributes$map = $elm$virtual_dom$VirtualDom$mapAttribute;
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$title = $elm$svg$Svg$trustedNode('title');
var $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensions = function (_v1) {
	var icon = _v1.a.icon;
	var outer = _v1.a.outer;
	return A2(
		$elm$core$Maybe$withDefault,
		icon.size,
		A2($elm$core$Maybe$map, $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensionsInternal, outer));
};
var $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensionsInternal = function (_v0) {
	var icon = _v0.a.icon;
	var outer = _v0.a.outer;
	return A2(
		$elm$core$Maybe$withDefault,
		icon.size,
		A2($elm$core$Maybe$map, $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensions, outer));
};
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $lattyware$elm_fontawesome$FontAwesome$Svg$fill = _List_fromArray(
	[
		$elm$svg$Svg$Attributes$x('0'),
		$elm$svg$Svg$Attributes$y('0'),
		$elm$svg$Svg$Attributes$width('100%'),
		$elm$svg$Svg$Attributes$height('100%')
	]);
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$mask = $elm$svg$Svg$trustedNode('mask');
var $elm$svg$Svg$Attributes$mask = _VirtualDom_attribute('mask');
var $elm$svg$Svg$Attributes$maskContentUnits = _VirtualDom_attribute('maskContentUnits');
var $elm$svg$Svg$Attributes$maskUnits = _VirtualDom_attribute('maskUnits');
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$add = F2(
	function (transform, combined) {
		switch (transform.$) {
			case 'Scale':
				var by = transform.a;
				return _Utils_update(
					combined,
					{size: combined.size + by});
			case 'Reposition':
				var axis = transform.a;
				var by = transform.b;
				var _v1 = function () {
					if (axis.$ === 'Vertical') {
						return _Utils_Tuple2(0, by);
					} else {
						return _Utils_Tuple2(by, 0);
					}
				}();
				var x = _v1.a;
				var y = _v1.b;
				return _Utils_update(
					combined,
					{x: combined.x + x, y: combined.y + y});
			case 'Rotate':
				var rotation = transform.a;
				return _Utils_update(
					combined,
					{rotate: combined.rotate + rotation});
			default:
				var axis = transform.a;
				if (axis.$ === 'Vertical') {
					return _Utils_update(
						combined,
						{flipY: !combined.flipY});
				} else {
					return _Utils_update(
						combined,
						{flipX: !combined.flipX});
				}
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize = 16;
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform = {flipX: false, flipY: false, rotate: 0, size: $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize, x: 0, y: 0};
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$combine = function (transforms) {
	return A3($elm$core$List$foldl, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$add, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform, transforms);
};
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaningfulTransform = function (transforms) {
	var combined = $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$combine(transforms);
	return _Utils_eq(combined, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(combined);
};
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$transformForSvg = F3(
	function (containerWidth, iconWidth, transform) {
		var path = 'translate(' + ($elm$core$String$fromFloat((iconWidth / 2) * (-1)) + ' -256)');
		var outer = 'translate(' + ($elm$core$String$fromFloat(containerWidth / 2) + ' 256)');
		var innerTranslate = 'translate(' + ($elm$core$String$fromFloat(transform.x * 32) + (',' + ($elm$core$String$fromFloat(transform.y * 32) + ') ')));
		var innerRotate = 'rotate(' + ($elm$core$String$fromFloat(transform.rotate) + ' 0 0)');
		var flipY = transform.flipY ? (-1) : 1;
		var scaleY = (transform.size / $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize) * flipY;
		var flipX = transform.flipX ? (-1) : 1;
		var scaleX = (transform.size / $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize) * flipX;
		var innerScale = 'scale(' + ($elm$core$String$fromFloat(scaleX) + (', ' + ($elm$core$String$fromFloat(scaleY) + ') ')));
		return {
			inner: $elm$svg$Svg$Attributes$transform(
				_Utils_ap(
					innerTranslate,
					_Utils_ap(innerScale, innerRotate))),
			outer: $elm$svg$Svg$Attributes$transform(outer),
			path: $elm$svg$Svg$Attributes$transform(path)
		};
	});
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $lattyware$elm_fontawesome$FontAwesome$Svg$viewPath = F2(
	function (attrs, d) {
		return A2(
			$elm$svg$Svg$path,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$d(d),
				attrs),
			_List_Nil);
	});
var $lattyware$elm_fontawesome$FontAwesome$Svg$viewPaths = F2(
	function (attrs, _v0) {
		var paths = _v0.paths;
		if (paths.b.$ === 'Nothing') {
			var only = paths.a;
			var _v2 = paths.b;
			return A2($lattyware$elm_fontawesome$FontAwesome$Svg$viewPath, attrs, only);
		} else {
			var secondary = paths.a;
			var primary = paths.b.a;
			return A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('fa-group')
					]),
				_List_fromArray(
					[
						A2(
						$lattyware$elm_fontawesome$FontAwesome$Svg$viewPath,
						A2(
							$elm$core$List$cons,
							$elm$svg$Svg$Attributes$class('fa-secondary'),
							attrs),
						secondary),
						A2(
						$lattyware$elm_fontawesome$FontAwesome$Svg$viewPath,
						A2(
							$elm$core$List$cons,
							$elm$svg$Svg$Attributes$class('fa-primary'),
							attrs),
						primary)
					]));
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Svg$viewWithTransform = F3(
	function (color, _v0, icon) {
		var outer = _v0.outer;
		var inner = _v0.inner;
		var path = _v0.path;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[outer]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[inner]),
					_List_fromArray(
						[
							A2(
							$lattyware$elm_fontawesome$FontAwesome$Svg$viewPaths,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$fill(color),
									path
								]),
							icon)
						]))
				]));
	});
var $lattyware$elm_fontawesome$FontAwesome$Svg$viewInColor = F2(
	function (color, fullIcon) {
		var icon = fullIcon.a.icon;
		var transforms = fullIcon.a.transforms;
		var id = fullIcon.a.id;
		var outer = fullIcon.a.outer;
		var combinedTransforms = $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaningfulTransform(transforms);
		var _v0 = icon.size;
		var width = _v0.a;
		var _v1 = $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensions(fullIcon);
		var topLevelWidth = _v1.a;
		if (combinedTransforms.$ === 'Just') {
			var meaningfulTransform = combinedTransforms.a;
			var svgTransform = A3($lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$transformForSvg, topLevelWidth, width, meaningfulTransform);
			if (outer.$ === 'Just') {
				var outerIcon = outer.a;
				return A4($lattyware$elm_fontawesome$FontAwesome$Svg$viewMaskedWithTransform, color, svgTransform, icon, outerIcon);
			} else {
				return A3($lattyware$elm_fontawesome$FontAwesome$Svg$viewWithTransform, color, svgTransform, icon);
			}
		} else {
			return A2(
				$lattyware$elm_fontawesome$FontAwesome$Svg$viewPaths,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(color)
					]),
				icon);
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Svg$viewMaskedWithTransform = F4(
	function (color, transforms, exclude, include) {
		var id = include.a.id;
		var alwaysId = A2($elm$core$Maybe$withDefault, '', id);
		var clipId = 'clip-' + alwaysId;
		var maskId = 'mask-' + alwaysId;
		var maskTag = A2(
			$elm$svg$Svg$mask,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$id(maskId),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$maskUnits('userSpaceOnUse'),
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$maskContentUnits('userSpaceOnUse'),
						$lattyware$elm_fontawesome$FontAwesome$Svg$fill))),
			_List_fromArray(
				[
					A2($lattyware$elm_fontawesome$FontAwesome$Svg$viewInColor, 'white', include),
					A3($lattyware$elm_fontawesome$FontAwesome$Svg$viewWithTransform, 'black', transforms, exclude)
				]));
		var defs = A2(
			$elm$svg$Svg$defs,
			_List_Nil,
			_List_fromArray(
				[maskTag]));
		var rect = A2(
			$elm$svg$Svg$rect,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$fill(color),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$mask('url(#' + (maskId + ')')),
					$lattyware$elm_fontawesome$FontAwesome$Svg$fill)),
			_List_Nil);
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[defs, rect]));
	});
var $lattyware$elm_fontawesome$FontAwesome$Svg$view = $lattyware$elm_fontawesome$FontAwesome$Svg$viewInColor('currentColor');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $lattyware$elm_fontawesome$FontAwesome$internalView = F2(
	function (fullIcon, extraAttributes) {
		var icon = fullIcon.a.icon;
		var transforms = fullIcon.a.transforms;
		var role = fullIcon.a.role;
		var id = fullIcon.a.id;
		var title = fullIcon.a.title;
		var outer = fullIcon.a.outer;
		var attributes = fullIcon.a.attributes;
		var contents = $lattyware$elm_fontawesome$FontAwesome$Svg$view(fullIcon);
		var _v0 = function () {
			if (title.$ === 'Just') {
				var givenTitle = title.a;
				var titleId = A2($elm$core$Maybe$withDefault, '', id) + '-title';
				return _Utils_Tuple2(
					A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', titleId),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$title,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$id(titleId)
								]),
							_List_fromArray(
								[
									$elm$svg$Svg$text(givenTitle)
								])),
							contents
						]));
			} else {
				return _Utils_Tuple2(
					A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
					_List_fromArray(
						[contents]));
			}
		}();
		var semantics = _v0.a;
		var potentiallyTitledContents = _v0.b;
		var _v2 = $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensions(fullIcon);
		var width = _v2.a;
		var height = _v2.b;
		var aspectRatio = $elm$core$Basics$ceiling((width / height) * 16);
		var classes = _List_fromArray(
			[
				'svg-inline--fa',
				'fa-' + icon.name,
				'fa-w-' + $elm$core$String$fromInt(aspectRatio)
			]);
		return A2(
			$elm$svg$Svg$svg,
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'role', role),
							A2($elm$html$Html$Attributes$attribute, 'xmlns', 'http://www.w3.org/2000/svg'),
							$elm$svg$Svg$Attributes$viewBox(
							'0 0 ' + ($elm$core$String$fromInt(width) + (' ' + $elm$core$String$fromInt(height)))),
							semantics
						]),
						A2($elm$core$List$map, $elm$svg$Svg$Attributes$class, classes),
						A2(
						$elm$core$List$map,
						$elm$html$Html$Attributes$map($elm$core$Basics$never),
						attributes),
						extraAttributes
					])),
			potentiallyTitledContents);
	});
var $lattyware$elm_fontawesome$FontAwesome$view = function (presentation) {
	return A2($lattyware$elm_fontawesome$FontAwesome$internalView, presentation, _List_Nil);
};
var $author$project$Components$App$Menu$menu = function (model) {
	var highlightIfActive = function (panel) {
		return A2($elm$core$List$member, panel, model.ui.openPanels) ? _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background-color', 'var(--primary_medium)')
			]) : _List_Nil;
	};
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('menu')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('pattern_menu_button'),
							$elm$html$Html$Attributes$class('menu_button'),
							$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick(
							function (event) {
								return A2($author$project$Logic$App$Msg$ViewPanel, $author$project$Logic$App$Types$PatternPanel, event.keys);
							})
						]),
					highlightIfActive($author$project$Logic$App$Types$PatternPanel)),
				_List_fromArray(
					[
						$lattyware$elm_fontawesome$FontAwesome$Styles$css,
						$lattyware$elm_fontawesome$FontAwesome$view(
						A2(
							$lattyware$elm_fontawesome$FontAwesome$styled,
							_List_fromArray(
								[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
							$lattyware$elm_fontawesome$FontAwesome$Solid$code))
					])),
				A2(
				$elm$html$Html$button,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('stack_menu_button'),
							$elm$html$Html$Attributes$class('menu_button'),
							$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick(
							function (event) {
								return A2($author$project$Logic$App$Msg$ViewPanel, $author$project$Logic$App$Types$StackPanel, event.keys);
							})
						]),
					highlightIfActive($author$project$Logic$App$Types$StackPanel)),
				_List_fromArray(
					[
						$lattyware$elm_fontawesome$FontAwesome$Styles$css,
						$lattyware$elm_fontawesome$FontAwesome$view(
						A2(
							$lattyware$elm_fontawesome$FontAwesome$styled,
							_List_fromArray(
								[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
							$lattyware$elm_fontawesome$FontAwesome$Solid$layerGroup))
					])),
				A2(
				$elm$html$Html$button,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('macro_menu_button'),
							$elm$html$Html$Attributes$class('menu_button'),
							$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick(
							function (event) {
								return A2($author$project$Logic$App$Msg$ViewPanel, $author$project$Logic$App$Types$LibraryPanel, event.keys);
							})
						]),
					highlightIfActive($author$project$Logic$App$Types$LibraryPanel)),
				_List_fromArray(
					[
						$lattyware$elm_fontawesome$FontAwesome$Styles$css,
						$lattyware$elm_fontawesome$FontAwesome$view(
						A2(
							$lattyware$elm_fontawesome$FontAwesome$styled,
							_List_fromArray(
								[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
							$lattyware$elm_fontawesome$FontAwesome$Solid$book))
					])),
				A2(
				$elm$html$Html$button,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('config_hex_menu_button'),
							$elm$html$Html$Attributes$class('menu_button'),
							$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick(
							function (event) {
								return A2($author$project$Logic$App$Msg$ViewPanel, $author$project$Logic$App$Types$ConfigHexPanel, event.keys);
							})
						]),
					highlightIfActive($author$project$Logic$App$Types$ConfigHexPanel)),
				_List_fromArray(
					[
						$lattyware$elm_fontawesome$FontAwesome$Styles$css,
						$lattyware$elm_fontawesome$FontAwesome$view(
						A2(
							$lattyware$elm_fontawesome$FontAwesome$styled,
							_List_fromArray(
								[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
							$lattyware$elm_fontawesome$FontAwesome$Solid$sliders))
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('home_menu_button'),
						$elm$html$Html$Attributes$class('menu_button'),
						A2($elm$html$Html$Attributes$style, 'margin-top', 'auto')
					]),
				_List_fromArray(
					[
						$lattyware$elm_fontawesome$FontAwesome$Styles$css,
						$lattyware$elm_fontawesome$FontAwesome$view(
						A2(
							$lattyware$elm_fontawesome$FontAwesome$styled,
							_List_fromArray(
								[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
							$lattyware$elm_fontawesome$FontAwesome$Solid$home))
					])),
				A2(
				$elm$html$Html$button,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('save_export_menu_button'),
							$elm$html$Html$Attributes$class('menu_button'),
							$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick(
							function (event) {
								return A2($author$project$Logic$App$Msg$ViewPanel, $author$project$Logic$App$Types$FilePanel, event.keys);
							})
						]),
					highlightIfActive($author$project$Logic$App$Types$FilePanel)),
				_List_fromArray(
					[
						$lattyware$elm_fontawesome$FontAwesome$Styles$css,
						$lattyware$elm_fontawesome$FontAwesome$view(
						A2(
							$lattyware$elm_fontawesome$FontAwesome$styled,
							_List_fromArray(
								[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
							$lattyware$elm_fontawesome$FontAwesome$Solid$file))
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('settings_menu_button'),
						$elm$html$Html$Attributes$class('menu_button')
					]),
				_List_fromArray(
					[
						$lattyware$elm_fontawesome$FontAwesome$Styles$css,
						$lattyware$elm_fontawesome$FontAwesome$view(
						A2(
							$lattyware$elm_fontawesome$FontAwesome$styled,
							_List_fromArray(
								[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
							$lattyware$elm_fontawesome$FontAwesome$Solid$gear))
					]))
			]));
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$Logic$App$Msg$ChangeHeldItem = function (a) {
	return {$: 'ChangeHeldItem', a: a};
};
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$option = _VirtualDom_node('option');
var $author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsString = function (iota) {
	switch (iota.$) {
		case 'Null':
			return 'Null';
		case 'Number':
			var number = iota.a;
			return $elm$core$String$fromFloat(number);
		case 'Vector':
			var _v1 = iota.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return 'Vector [' + ($elm$core$String$fromFloat(x) + (', ' + ($elm$core$String$fromFloat(y) + (', ' + ($elm$core$String$fromFloat(z) + ']')))));
		case 'Boolean':
			var bool = iota.a;
			return bool ? 'True' : 'False';
		case 'Entity':
			return 'Entity';
		case 'IotaList':
			var list = iota.a;
			return 'dont do this';
		case 'PatternIota':
			var pattern = iota.a;
			return pattern.displayName;
		case 'Garbage':
			var mishap = iota.a;
			var mishapMessage = function () {
				switch (mishap.$) {
					case 'InvalidPattern':
						return 'Invalid Pattern';
					case 'NotEnoughIotas':
						return 'Not Enough Iotas';
					case 'IncorrectIota':
						return 'Incorrect Iota';
					case 'VectorOutOfAmbit':
						return 'Vector Out of Ambit';
					case 'EntityOutOfAmbit':
						return 'Entity Out of Ambit';
					case 'EntityIsImmune':
						return 'Entity is Immune';
					case 'MathematicalError':
						return 'Mathematical Error';
					case 'IncorrectItem':
						return 'Incorrect Item';
					case 'IncorrectBlock':
						return 'Incorrect Block';
					case 'DelveTooDeep':
						return 'Delve Too Deep';
					case 'TransgressOther':
						return 'Transgress Other';
					case 'DisallowedAction':
						return 'Disallowed Action';
					default:
						return 'Catastrophic Failure';
				}
			}();
			return 'Garbage (' + (mishapMessage + ')');
		default:
			var list = iota.a;
			return 'dont do this';
	}
};
var $author$project$Settings$Theme$iotaColorMap = function (iota) {
	switch (iota.$) {
		case 'Null':
			return '#354C3F';
		case 'Number':
			return '#4C3541';
		case 'Vector':
			return '#4C3541';
		case 'Boolean':
			return '#4B4C35';
		case 'Entity':
			return '#354B4C';
		case 'IotaList':
			return '#354C3F';
		case 'PatternIota':
			return '#354C3F';
		case 'Garbage':
			return '#4F3737';
		default:
			return '#4B4845';
	}
};
var $author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsHtmlMsg = F3(
	function (index, iota, indent) {
		var renderList = function (list) {
			return _Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('outer_box'),
								A2(
								$elm$html$Html$Attributes$style,
								'background-color',
								$author$project$Settings$Theme$iotaColorMap(iota)),
								A2(
								$elm$html$Html$Attributes$style,
								'margin-left',
								$elm$core$String$fromInt(indent * 26) + 'px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('inner_box')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('index_display')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(index + 1))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$p,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('List')
															]))
													]))
											]))
									]))
							]))
					]),
				$elm$core$List$concat(
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, x) {
								return A3($author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsHtmlMsg, i - 1, x, indent + 1);
							}),
						$elm$core$Array$toList(list))));
		};
		switch (iota.$) {
			case 'IotaList':
				var list = iota.a;
				return renderList(list);
			case 'OpenParenthesis':
				var list = iota.a;
				return renderList(list);
			default:
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('outer_box'),
								A2(
								$elm$html$Html$Attributes$style,
								'background-color',
								$author$project$Settings$Theme$iotaColorMap(iota)),
								A2(
								$elm$html$Html$Attributes$style,
								'margin-left',
								$elm$core$String$fromInt(indent * 26) + 'px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('inner_box')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('index_display')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(index + 1))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$p,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text(
																$author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsString(iota))
															]))
													]))
											]))
									]))
							]))
					]);
		}
	});
var $author$project$Components$App$Panels$ConfigHexPanel$renderIotaBox = function (iota) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_Nil,
			A3($author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsHtmlMsg, 0, iota, 0))
		]);
};
var $elm$html$Html$select = _VirtualDom_node('select');
var $author$project$Components$App$Panels$ConfigHexPanel$heldItemSection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('held_item_section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('input_label_box')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Held Item:')
							])),
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput($author$project$Logic$App$Msg$ChangeHeldItem)
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$option,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Nothing')
									])),
								A2(
								$elm$html$Html$option,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Trinket')
									])),
								A2(
								$elm$html$Html$option,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Cypher')
									])),
								A2(
								$elm$html$Html$option,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Artifact')
									])),
								A2(
								$elm$html$Html$option,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Spellbook')
									])),
								A2(
								$elm$html$Html$option,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Focus')
									])),
								A2(
								$elm$html$Html$option,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Pie')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('stored_iota_container')
					]),
				A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stored_iota_label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Content:')
							])),
					function () {
						var _v0 = model.castingContext.heldItemContent;
						if (_v0.$ === 'Just') {
							var iota = _v0.a;
							return $author$project$Components$App$Panels$ConfigHexPanel$renderIotaBox(iota);
						} else {
							return _List_Nil;
						}
					}()))
			]));
};
var $author$project$Components$App$Panels$ConfigHexPanel$ravenmindSection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('ravenmind_section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('stored_iota_container')
					]),
				A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stored_iota_label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Ravenmind:')
							])),
					function () {
						var _v0 = model.castingContext.ravenmind;
						if (_v0.$ === 'Just') {
							var iota = _v0.a;
							return $author$project$Components$App$Panels$ConfigHexPanel$renderIotaBox(iota);
						} else {
							return _List_Nil;
						}
					}()))
			]));
};
var $author$project$Components$App$Panels$Utils$visibilityToDisplayStyle = function (visibility) {
	return visibility ? A2($elm$html$Html$Attributes$style, 'display', 'flex') : A2($elm$html$Html$Attributes$style, 'display', 'none');
};
var $author$project$Components$App$Panels$ConfigHexPanel$configHexPanel = function (model) {
	var visibility = A2($elm$core$List$member, $author$project$Logic$App$Types$ConfigHexPanel, model.ui.openPanels);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('config_hex_panel'),
				$elm$html$Html$Attributes$class('panel'),
				$author$project$Components$App$Panels$Utils$visibilityToDisplayStyle(visibility)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('panel_title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Casting Context')
					])),
				$author$project$Components$App$Panels$ConfigHexPanel$heldItemSection(model),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('divider')
					]),
				_List_Nil),
				$author$project$Components$App$Panels$ConfigHexPanel$ravenmindSection(model)
			]));
};
var $author$project$Logic$App$Msg$InputPattern = function (a) {
	return {$: 'InputPattern', a: a};
};
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$plus = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'plus',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$plus = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$plus);
var $author$project$Components$App$Panels$MacroPanel$renderIotaBox = function (iota) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_Nil,
			A3($author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsHtmlMsg, 0, iota, 0))
		]);
};
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $lattyware$elm_fontawesome$FontAwesome$Attributes$xs = $elm$svg$Svg$Attributes$class('fa-xs');
var $author$project$Components$App$Panels$MacroPanel$renderDict = function (model) {
	var renderEntry = F2(
		function (signature, value) {
			var displayName = value.a;
			var iota = value.c;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('stored_iota_container')
					]),
				A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('saved_iota_title')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stored_iota_label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(displayName + (' (\"' + (signature + '\")')))
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('add_button'),
										$elm$html$Html$Events$onClick(
										$author$project$Logic$App$Msg$InputPattern(signature))
									]),
								_List_fromArray(
									[
										$lattyware$elm_fontawesome$FontAwesome$Styles$css,
										$lattyware$elm_fontawesome$FontAwesome$view(
										A2(
											$lattyware$elm_fontawesome$FontAwesome$styled,
											_List_fromArray(
												[$lattyware$elm_fontawesome$FontAwesome$Attributes$xs]),
											$lattyware$elm_fontawesome$FontAwesome$Solid$plus))
									]))
							])),
					$author$project$Components$App$Panels$MacroPanel$renderIotaBox(iota)));
		});
	return A2(
		$elm$core$List$intersperse,
		A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('divider')
				]),
			_List_Nil),
		$elm$core$Dict$values(
			A2($elm$core$Dict$map, renderEntry, model.castingContext.macros)));
};
var $author$project$Components$App$Panels$MacroPanel$libraryPanel = function (model) {
	var visibility = A2($elm$core$List$member, $author$project$Logic$App$Types$LibraryPanel, model.ui.openPanels);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('macro_panel'),
				$elm$html$Html$Attributes$class('panel'),
				$author$project$Components$App$Panels$Utils$visibilityToDisplayStyle(visibility)
			]),
		A2(
			$elm$core$List$cons,
			A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('panel_title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Macros')
					])),
			$author$project$Components$App$Panels$MacroPanel$renderDict(model)));
};
var $author$project$Logic$App$Msg$SelectNextSuggestion = function (a) {
	return {$: 'SelectNextSuggestion', a: a};
};
var $author$project$Logic$App$Msg$SelectPreviousSuggestion = function (a) {
	return {$: 'SelectPreviousSuggestion', a: a};
};
var $author$project$Logic$App$Msg$SetFocus = function (a) {
	return {$: 'SetFocus', a: a};
};
var $author$project$Logic$App$Msg$UpdatePatternInputField = function (a) {
	return {$: 'UpdatePatternInputField', a: a};
};
var $author$project$Logic$App$Msg$DragOver = F2(
	function (a, b) {
		return {$: 'DragOver', a: a, b: b};
	});
var $author$project$Logic$App$Msg$Drop = {$: 'Drop'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$MoveOnDrop = {$: 'MoveOnDrop'};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $author$project$Components$App$Panels$PatternPanel$dropTargetConfig = {
	dropEffect: $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$MoveOnDrop,
	onDrop: $elm$core$Basics$always($author$project$Logic$App$Msg$Drop),
	onEnter: $elm$core$Maybe$Nothing,
	onLeave: $elm$core$Maybe$Nothing,
	onOver: $author$project$Logic$App$Msg$DragOver
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$Event = F2(
	function (dataTransfer, mouseEvent) {
		return {dataTransfer: dataTransfer, mouseEvent: mouseEvent};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$DataTransfer = F3(
	function (files, types, dropEffect) {
		return {dropEffect: dropEffect, files: files, types: types};
	});
var $elm$file$File$decoder = _File_decoder;
var $mpizenberg$elm_pointer_events$Internal$Decode$all = A2(
	$elm$core$List$foldr,
	$elm$json$Json$Decode$map2($elm$core$List$cons),
	$elm$json$Json$Decode$succeed(_List_Nil));
var $mpizenberg$elm_pointer_events$Internal$Decode$dynamicListOf = function (itemDecoder) {
	var decodeOne = function (n) {
		return A2(
			$elm$json$Json$Decode$field,
			$elm$core$String$fromInt(n),
			itemDecoder);
	};
	var decodeN = function (n) {
		return $mpizenberg$elm_pointer_events$Internal$Decode$all(
			A2(
				$elm$core$List$map,
				decodeOne,
				A2($elm$core$List$range, 0, n - 1)));
	};
	return A2(
		$elm$json$Json$Decode$andThen,
		decodeN,
		A2($elm$json$Json$Decode$field, 'length', $elm$json$Json$Decode$int));
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$fileListDecoder = $mpizenberg$elm_pointer_events$Internal$Decode$dynamicListOf;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$dataTransferDecoder = A4(
	$elm$json$Json$Decode$map3,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$DataTransfer,
	A2(
		$elm$json$Json$Decode$field,
		'files',
		$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$fileListDecoder($elm$file$File$decoder)),
	A2(
		$elm$json$Json$Decode$field,
		'types',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'dropEffect', $elm$json$Json$Decode$string));
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$eventDecoder = A3(
	$elm$json$Json$Decode$map2,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$Event,
	A2($elm$json$Json$Decode$field, 'dataTransfer', $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$dataTransferDecoder),
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$on = F2(
	function (event, tag) {
		return A2(
			$elm$html$Html$Events$custom,
			event,
			A2(
				$elm$json$Json$Decode$map,
				function (ev) {
					return {
						message: tag(ev),
						preventDefault: true,
						stopPropagation: true
					};
				},
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$eventDecoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$valuePreventedOn = F2(
	function (event, tag) {
		return A2(
			$elm$html$Html$Events$custom,
			event,
			A2(
				$elm$json$Json$Decode$map,
				function (value) {
					return {
						message: tag(value),
						preventDefault: true,
						stopPropagation: true
					};
				},
				$elm$json$Json$Decode$value));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$onDropTarget = function (config) {
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		_List_fromArray(
			[
				$elm$core$Maybe$Just(
				A2(
					$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$valuePreventedOn,
					'dragover',
					config.onOver(config.dropEffect))),
				$elm$core$Maybe$Just(
				A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$on, 'drop', config.onDrop)),
				A2(
				$elm$core$Maybe$map,
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$on('dragenter'),
				config.onEnter),
				A2(
				$elm$core$Maybe$map,
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$on('dragleave'),
				config.onLeave)
			]));
};
var $elm$html$Html$Events$onFocus = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'focus',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$svg$Svg$Attributes$opacity = _VirtualDom_attribute('opacity');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeMiterlimit = _VirtualDom_attribute('stroke-miterlimit');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $author$project$Components$Icon$ParagraphDropdown$paragraphDropdown = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$id('paragraph_dropdown')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$id('Layer_1'),
					A2($elm$html$Html$Attributes$attribute, 'data-name', 'Layer 1'),
					$elm$svg$Svg$Attributes$viewBox('0 0 21.36 16.37')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$opacity('0.7')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$y1('14.79'),
									$elm$svg$Svg$Attributes$x2('14.11'),
									$elm$svg$Svg$Attributes$y2('14.79'),
									$elm$svg$Svg$Attributes$fill('none'),
									$elm$svg$Svg$Attributes$stroke('#f5faff'),
									$elm$svg$Svg$Attributes$strokeMiterlimit('10'),
									$elm$svg$Svg$Attributes$strokeWidth('3')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$y1('8.15'),
									$elm$svg$Svg$Attributes$x2('21.36'),
									$elm$svg$Svg$Attributes$y2('8.15'),
									$elm$svg$Svg$Attributes$fill('none'),
									$elm$svg$Svg$Attributes$stroke('#f5faff'),
									$elm$svg$Svg$Attributes$strokeMiterlimit('10'),
									$elm$svg$Svg$Attributes$strokeWidth('3')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$y1('1.5'),
									$elm$svg$Svg$Attributes$x2('21.36'),
									$elm$svg$Svg$Attributes$y2('1.5'),
									$elm$svg$Svg$Attributes$fill('none'),
									$elm$svg$Svg$Attributes$stroke('#f5faff'),
									$elm$svg$Svg$Attributes$strokeMiterlimit('10'),
									$elm$svg$Svg$Attributes$strokeWidth('3')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$polygon,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$points('18.49 16.36 21.36 13.27 15.62 13.27 18.49 16.36'),
									$elm$svg$Svg$Attributes$fill('#f5faff')
								]),
							_List_Nil)
						]))
				]))
		]));
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Components$App$PatternAutoComplete$autocompleteList = A2(
	$elm$core$List$map,
	function (pat) {
		return _Utils_Tuple2(pat.displayName, pat.internalName);
	},
	$author$project$Logic$App$Patterns$PatternRegistry$patternRegistry);
var $elm$core$String$toLower = _String_toLower;
var $author$project$Components$App$PatternAutoComplete$patternInputSuggestionList = function (model) {
	var inputValue = model.ui.patternInputField;
	return (inputValue !== '') ? $elm$core$List$unzip(
		A2(
			$elm$core$List$filter,
			function (name) {
				return A2(
					$elm$core$String$contains,
					$elm$core$String$toLower(inputValue),
					$elm$core$String$toLower(name.a)) || A2(
					$elm$core$String$contains,
					$elm$core$String$toLower(inputValue),
					$elm$core$String$toLower(name.b));
			},
			$author$project$Components$App$PatternAutoComplete$autocompleteList)).a : _List_Nil;
};
var $author$project$Components$App$PatternAutoComplete$patternInputAutoComplete = function (model) {
	var suggestionIndex = model.ui.suggestionIndex;
	var getHighlightedOption = A2(
		$elm$core$Maybe$withDefault,
		'',
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (name) {
					return name !== '';
				},
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (index, name) {
							return _Utils_eq(index, suggestionIndex) ? name : '';
						}),
					$author$project$Components$App$PatternAutoComplete$patternInputSuggestionList(model)))));
	var constructOption = F2(
		function (index, name) {
			return A2(
				$elm$html$Html$li,
				_List_fromArray(
					[
						_Utils_eq(index, suggestionIndex) ? $elm$html$Html$Attributes$class('highlighted_suggestion') : $elm$html$Html$Attributes$class('')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						(name === '') ? '[pattern not implemented]' : name)
					]));
		});
	return _Utils_Tuple2(
		A2(
			$elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('autocomplete_container'),
						A2(
						$elm$html$Html$Attributes$style,
						'left',
						$elm$core$String$fromInt(model.ui.patternInputLocation.a) + 'px'),
						A2(
						$elm$html$Html$Attributes$style,
						'top',
						$elm$core$String$fromInt(model.ui.patternInputLocation.b) + 'px')
					]),
				(_Utils_eq(
					model.ui.patternInputLocation,
					_Utils_Tuple2(0, 0)) || (model.ui.selectedInputID === '')) ? _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'none')
					]) : _List_Nil),
			A2(
				$elm$core$List$indexedMap,
				constructOption,
				$author$project$Components$App$PatternAutoComplete$patternInputSuggestionList(model))),
		getHighlightedOption);
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $author$project$Logic$App$Msg$RemoveFromPatternArray = F2(
	function (a, b) {
		return {$: 'RemoveFromPatternArray', a: a, b: b};
	});
var $author$project$Logic$App$Msg$SetInsertionPoint = F2(
	function (a, b) {
		return {$: 'SetInsertionPoint', a: a, b: b};
	});
var $author$project$Logic$App$Msg$UpdatePatternOuptut = F2(
	function (a, b) {
		return {$: 'UpdatePatternOuptut', a: a, b: b};
	});
var $author$project$Logic$App$Msg$DragEnd = {$: 'DragEnd'};
var $author$project$Logic$App$Msg$DragStart = F3(
	function (a, b, c) {
		return {$: 'DragStart', a: a, b: b, c: c};
	});
var $author$project$Components$App$Panels$PatternPanel$draggedSourceConfig = function (id) {
	return {
		effectAllowed: {copy: false, link: false, move: true},
		onDrag: $elm$core$Maybe$Nothing,
		onEnd: $elm$core$Basics$always($author$project$Logic$App$Msg$DragEnd),
		onStart: $author$project$Logic$App$Msg$DragStart(id)
	};
};
var $author$project$Logic$App$Utils$GetIotaValue$getIotaFromString = function (string) {
	return (string === 'Null') ? $author$project$Logic$App$Types$Null : ((string === 'Entity') ? $author$project$Logic$App$Types$Entity($author$project$Logic$App$Types$Unset) : ((string === 'Vector') ? $author$project$Logic$App$Types$Vector(
		_Utils_Tuple3(0, 0, 0)) : ((!_Utils_eq(
		$elm$core$String$toFloat(string),
		$elm$core$Maybe$Nothing)) ? $author$project$Logic$App$Types$Number(
		A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$String$toFloat(string))) : $author$project$Logic$App$Types$Null)));
};
var $author$project$Logic$App$Utils$GetIotaValue$getIotaTypeAsString = function (iota) {
	switch (iota.$) {
		case 'NullType':
			return 'Null';
		case 'NumberType':
			return 'Number';
		case 'VectorType':
			return 'Vector';
		case 'BooleanType':
			return 'Boolean';
		case 'EntityType':
			return 'Entity';
		case 'IotaListType':
			var iotaType = iota.a;
			return 'List: ' + $author$project$Logic$App$Utils$GetIotaValue$getIotaTypeAsString(iotaType);
		case 'PatternType':
			return 'Pattern';
		default:
			return 'Garbage';
	}
};
var $author$project$Logic$App$Utils$GetIotaValue$getIotaTypeFromString = function (string) {
	return (string === 'Null') ? $author$project$Logic$App$Types$NullType : ((string === 'Entity') ? $author$project$Logic$App$Types$EntityType : ((string === 'Vector') ? $author$project$Logic$App$Types$VectorType : ((!_Utils_eq(
		$elm$core$String$toFloat(string),
		$elm$core$Maybe$Nothing)) ? $author$project$Logic$App$Types$NumberType : $author$project$Logic$App$Types$NullType)));
};
var $author$project$Components$Icon$MoveButton$moveButton = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$viewBox('0 0 21.36 16.29')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$opacity('0.7')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$line,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$y1('14.79'),
							$elm$svg$Svg$Attributes$x2('21.36'),
							$elm$svg$Svg$Attributes$y2('14.79'),
							$elm$svg$Svg$Attributes$fill('none'),
							$elm$svg$Svg$Attributes$stroke('#f5faff'),
							$elm$svg$Svg$Attributes$strokeMiterlimit('10'),
							$elm$svg$Svg$Attributes$strokeWidth('3')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$line,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$y1('8.15'),
							$elm$svg$Svg$Attributes$x2('21.36'),
							$elm$svg$Svg$Attributes$y2('8.15'),
							$elm$svg$Svg$Attributes$fill('none'),
							$elm$svg$Svg$Attributes$stroke('#f5faff'),
							$elm$svg$Svg$Attributes$strokeMiterlimit('10'),
							$elm$svg$Svg$Attributes$strokeWidth('3')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$line,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$y1('1.5'),
							$elm$svg$Svg$Attributes$x2('21.36'),
							$elm$svg$Svg$Attributes$y2('1.5'),
							$elm$svg$Svg$Attributes$fill('none'),
							$elm$svg$Svg$Attributes$stroke('#f5faff'),
							$elm$svg$Svg$Attributes$strokeMiterlimit('10'),
							$elm$svg$Svg$Attributes$strokeWidth('3')
						]),
					_List_Nil)
				]))
		]));
var $elm$html$Html$Attributes$draggable = _VirtualDom_attribute('draggable');
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$valueOn = F2(
	function (event, tag) {
		return A2(
			$elm$html$Html$Events$custom,
			event,
			A2(
				$elm$json$Json$Decode$map,
				function (value) {
					return {
						message: tag(value),
						preventDefault: false,
						stopPropagation: true
					};
				},
				$elm$json$Json$Decode$value));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$onSourceDrag = function (config) {
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		_List_fromArray(
			[
				$elm$core$Maybe$Just(
				$elm$html$Html$Attributes$draggable('true')),
				$elm$core$Maybe$Just(
				A2(
					$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$valueOn,
					'dragstart',
					config.onStart(config.effectAllowed))),
				$elm$core$Maybe$Just(
				A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$on, 'dragend', config.onEnd)),
				A2(
				$elm$core$Maybe$map,
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$on('drag'),
				config.onDrag)
			]));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$svg$Svg$style = $elm$svg$Svg$trustedNode('style');
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $author$project$Components$Icon$XButton$xButton = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$viewBox('0 0 10.98 10.98')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$defs,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$style,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('.cls-1{opacity:0.51;}.cls-2{fill:none;stroke:#f5faff;stroke-miterlimit:10;stroke-width:3px;}')
						]))
				])),
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$id('Layer_2'),
					A2($elm$html$Html$Attributes$attribute, 'data-name', 'Layer 2')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$id('Code')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$g,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-1')
								]),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$line,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$class('cls-2'),
											$elm$svg$Svg$Attributes$x1('1.06'),
											$elm$svg$Svg$Attributes$y1('1.06'),
											$elm$svg$Svg$Attributes$x2('9.92'),
											$elm$svg$Svg$Attributes$y2('9.92')
										]),
									_List_Nil),
									A2(
									$elm$svg$Svg$line,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$class('cls-2'),
											$elm$svg$Svg$Attributes$x1('9.92'),
											$elm$svg$Svg$Attributes$y1('1.06'),
											$elm$svg$Svg$Attributes$x2('1.06'),
											$elm$svg$Svg$Attributes$y2('9.92')
										]),
									_List_Nil)
								]))
						]))
				]))
		]));
var $author$project$Components$App$Panels$PatternPanel$renderPatternList = F5(
	function (patternList, dragoverIndex, dragstartIndex, overDragHandle, insertionPoint) {
		var renderPattern = F2(
			function (index, pattern) {
				var activeOpacity = (!pattern.active) ? A2($elm$html$Html$Attributes$style, 'opacity', '50%') : A2($elm$html$Html$Attributes$style, '', '');
				return _Utils_ap(
					_Utils_eq(dragoverIndex, index) ? _List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('seperator')
								]),
							_List_Nil)
						]) : _List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_Utils_ap(
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('outer_box'),
										A2(
										$elm$html$Html$Attributes$attribute,
										'data-index',
										$elm$core$String$fromInt(index)),
										$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick(
										function (event) {
											return A2($author$project$Logic$App$Msg$SetInsertionPoint, index, event.keys);
										})
									]),
								_Utils_ap(
									overDragHandle ? $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$onSourceDrag(
										$author$project$Components$App$Panels$PatternPanel$draggedSourceConfig(index)) : _Utils_ap(
										_List_Nil,
										_Utils_ap(
											_Utils_eq(index, dragstartIndex) ? _List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'opacity', '40%')
												]) : _List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'opacity', '100%')
												]),
											_Utils_eq(dragoverIndex, index) ? _List_fromArray(
												[
													$elm$html$Html$Attributes$class('dragover')
												]) : _List_Nil)),
									(_Utils_eq(index, insertionPoint) && (!(!index))) ? _List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid ' + '#7D8599')
										]) : _List_Nil)),
							A2(
								$elm$core$List$cons,
								A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('inner_box')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('x_button'),
													$elm$html$Html$Events$onClick(
													A2($author$project$Logic$App$Msg$RemoveFromPatternArray, index, index + 1))
												]),
											_List_fromArray(
												[$author$project$Components$Icon$XButton$xButton])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('text'),
													activeOpacity
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(pattern.displayName)
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('move_button')
												]),
											_List_fromArray(
												[$author$project$Components$Icon$MoveButton$moveButton]))
										])),
								($elm$core$List$length(pattern.outputOptions) > 0) ? A2(
									$elm$core$List$cons,
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('output_option_box'),
												activeOpacity
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$label,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Output:')
													])),
												A2(
												$elm$html$Html$select,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(
														$author$project$Logic$App$Utils$GetIotaValue$getIotaTypeAsString(
															A2(
																$elm$core$Maybe$withDefault,
																_Utils_Tuple2($author$project$Logic$App$Types$NullType, $author$project$Logic$App$Types$Null),
																pattern.selectedOutput).a)),
														$elm$html$Html$Events$onInput(
														function (str) {
															return A2(
																$author$project$Logic$App$Msg$UpdatePatternOuptut,
																index,
																_Utils_update(
																	pattern,
																	{
																		selectedOutput: $elm$core$Maybe$Just(
																			_Utils_Tuple2(
																				$author$project$Logic$App$Utils$GetIotaValue$getIotaTypeFromString(str),
																				$author$project$Logic$App$Utils$GetIotaValue$getIotaFromString(str)))
																	}));
														})
													]),
												A2(
													$elm$core$List$map,
													function (iota) {
														return A2(
															$elm$html$Html$option,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text(
																	$author$project$Logic$App$Utils$GetIotaValue$getIotaTypeAsString(iota))
																]));
													},
													pattern.outputOptions))
											])),
									function () {
										var _v0 = pattern.selectedOutput;
										_v0$3:
										while (true) {
											if (_v0.$ === 'Just') {
												switch (_v0.a.a.$) {
													case 'VectorType':
														if (_v0.a.b.$ === 'Vector') {
															var _v1 = _v0.a;
															var _v2 = _v1.a;
															var vector = _v1.b.a;
															var x = vector.a;
															var y = vector.b;
															var z = vector.c;
															return _List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('output_option_box'),
																			A2($elm$html$Html$Attributes$style, 'grid-template-columns', '2.1fr 3fr'),
																			activeOpacity
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$label,
																			_List_Nil,
																			_List_fromArray(
																				[
																					$elm$html$Html$text('X Value:')
																				])),
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$placeholder('0'),
																					$elm$html$Html$Attributes$type_('number'),
																					$elm$html$Html$Events$onInput(
																					function (str) {
																						return A2(
																							$author$project$Logic$App$Msg$UpdatePatternOuptut,
																							index,
																							_Utils_update(
																								pattern,
																								{
																									selectedOutput: $elm$core$Maybe$Just(
																										_Utils_Tuple2(
																											$author$project$Logic$App$Types$VectorType,
																											$author$project$Logic$App$Types$Vector(
																												_Utils_Tuple3(
																													A2(
																														$elm$core$Maybe$withDefault,
																														0,
																														$elm$core$String$toFloat(str)),
																													y,
																													z))))
																								}));
																					})
																				]),
																			_List_Nil)
																		])),
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('output_option_box'),
																			A2($elm$html$Html$Attributes$style, 'grid-template-columns', '2.1fr 3fr'),
																			activeOpacity
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$label,
																			_List_Nil,
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Y Value:')
																				])),
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$placeholder('0'),
																					$elm$html$Html$Attributes$type_('number'),
																					$elm$html$Html$Events$onInput(
																					function (str) {
																						return A2(
																							$author$project$Logic$App$Msg$UpdatePatternOuptut,
																							index,
																							_Utils_update(
																								pattern,
																								{
																									selectedOutput: $elm$core$Maybe$Just(
																										_Utils_Tuple2(
																											$author$project$Logic$App$Types$VectorType,
																											$author$project$Logic$App$Types$Vector(
																												_Utils_Tuple3(
																													x,
																													A2(
																														$elm$core$Maybe$withDefault,
																														0,
																														$elm$core$String$toFloat(str)),
																													z))))
																								}));
																					})
																				]),
																			_List_Nil)
																		])),
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('output_option_box'),
																			A2($elm$html$Html$Attributes$style, 'grid-template-columns', '2.1fr 3fr'),
																			activeOpacity
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$label,
																			_List_Nil,
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Z Value:')
																				])),
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$placeholder('0'),
																					$elm$html$Html$Attributes$type_('number'),
																					$elm$html$Html$Events$onInput(
																					function (str) {
																						return A2(
																							$author$project$Logic$App$Msg$UpdatePatternOuptut,
																							index,
																							_Utils_update(
																								pattern,
																								{
																									selectedOutput: $elm$core$Maybe$Just(
																										_Utils_Tuple2(
																											$author$project$Logic$App$Types$VectorType,
																											$author$project$Logic$App$Types$Vector(
																												_Utils_Tuple3(
																													x,
																													y,
																													A2(
																														$elm$core$Maybe$withDefault,
																														0,
																														$elm$core$String$toFloat(str))))))
																								}));
																					})
																				]),
																			_List_Nil)
																		]))
																]);
														} else {
															break _v0$3;
														}
													case 'NumberType':
														if (_v0.a.b.$ === 'Number') {
															var _v4 = _v0.a;
															var _v5 = _v4.a;
															var number = _v4.b.a;
															return _List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('output_option_box'),
																			A2($elm$html$Html$Attributes$style, 'grid-template-columns', '2.1fr 3fr'),
																			activeOpacity
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$label,
																			_List_Nil,
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Number:')
																				])),
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$placeholder('0'),
																					$elm$html$Html$Attributes$type_('number'),
																					$elm$html$Html$Events$onInput(
																					function (str) {
																						return A2(
																							$author$project$Logic$App$Msg$UpdatePatternOuptut,
																							index,
																							_Utils_update(
																								pattern,
																								{
																									selectedOutput: $elm$core$Maybe$Just(
																										_Utils_Tuple2(
																											$author$project$Logic$App$Types$NumberType,
																											$author$project$Logic$App$Types$Number(
																												A2(
																													$elm$core$Maybe$withDefault,
																													0,
																													$elm$core$String$toFloat(str)))))
																								}));
																					})
																				]),
																			A2(
																				$elm$core$List$map,
																				function (iota) {
																					return A2(
																						$elm$html$Html$option,
																						_List_Nil,
																						_List_fromArray(
																							[
																								$elm$html$Html$text(
																								$author$project$Logic$App$Utils$GetIotaValue$getIotaTypeAsString(iota))
																							]));
																				},
																				pattern.outputOptions))
																		]))
																]);
														} else {
															break _v0$3;
														}
													case 'IotaListType':
														if ((_v0.a.a.a.$ === 'EntityType') && (_v0.a.b.$ === 'IotaList')) {
															var _v6 = _v0.a;
															var _v7 = _v6.a.a;
															return _List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('output_option_box'),
																			A2($elm$html$Html$Attributes$style, 'grid-template-columns', '2.1fr 3fr'),
																			activeOpacity
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$label,
																			_List_Nil,
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Count:')
																				])),
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$placeholder('0'),
																					$elm$html$Html$Attributes$type_('number'),
																					$elm$html$Html$Events$onInput(
																					function (str) {
																						return A2(
																							$author$project$Logic$App$Msg$UpdatePatternOuptut,
																							index,
																							_Utils_update(
																								pattern,
																								{
																									selectedOutput: $elm$core$Maybe$Just(
																										_Utils_Tuple2(
																											$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
																											$author$project$Logic$App$Types$IotaList(
																												A2(
																													$elm$core$Array$repeat,
																													A2(
																														$elm$core$Maybe$withDefault,
																														0,
																														$elm$core$String$toInt(str)),
																													$author$project$Logic$App$Types$Entity($author$project$Logic$App$Types$Unset)))))
																								}));
																					})
																				]),
																			A2(
																				$elm$core$List$map,
																				function (iota) {
																					return A2(
																						$elm$html$Html$option,
																						_List_Nil,
																						_List_fromArray(
																							[
																								$elm$html$Html$text(
																								$author$project$Logic$App$Utils$GetIotaValue$getIotaTypeAsString(iota))
																							]));
																				},
																				pattern.outputOptions))
																		]))
																]);
														} else {
															break _v0$3;
														}
													default:
														break _v0$3;
												}
											} else {
												break _v0$3;
											}
										}
										return _List_Nil;
									}()) : _List_Nil))
						]));
			});
		var patterns = $elm$core$List$unzip(
			$elm$core$Array$toList(patternList)).a;
		return _Utils_ap(
			$elm$core$List$concat(
				A2($elm$core$List$indexedMap, renderPattern, patterns)),
			(_Utils_cmp(
				dragoverIndex,
				$elm$core$List$length(patterns) - 1) > 0) ? _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('seperator')
						]),
					_List_Nil)
				]) : _List_Nil);
	});
var $author$project$Components$App$Panels$PatternPanel$patternPanel = function (model) {
	var visibility = A2($elm$core$List$member, $author$project$Logic$App$Types$PatternPanel, model.ui.openPanels);
	var autocompleteTuple = $author$project$Components$App$PatternAutoComplete$patternInputAutoComplete(model);
	var valueToSend = (autocompleteTuple.b !== '') ? autocompleteTuple.b : model.ui.patternInputField;
	var detectKey = function (code) {
		return ((code === 13) || (code === 9)) ? $elm$json$Json$Decode$succeed(
			_Utils_Tuple2(
				$author$project$Logic$App$Msg$InputPattern(valueToSend),
				true)) : ((code === 38) ? $elm$json$Json$Decode$succeed(
			_Utils_Tuple2(
				$author$project$Logic$App$Msg$SelectPreviousSuggestion(
					$elm$core$List$length(
						$author$project$Components$App$PatternAutoComplete$patternInputSuggestionList(model))),
				true)) : ((code === 40) ? $elm$json$Json$Decode$succeed(
			_Utils_Tuple2(
				$author$project$Logic$App$Msg$SelectNextSuggestion(
					$elm$core$List$length(
						$author$project$Components$App$PatternAutoComplete$patternInputSuggestionList(model))),
				true)) : $elm$json$Json$Decode$fail('')));
	};
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('pattern_panel'),
				$elm$html$Html$Attributes$class('panel'),
				$author$project$Components$App$Panels$Utils$visibilityToDisplayStyle(visibility)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('panel_title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Pattern Order ∨')
					])),
				A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id('pattern_draggable_container'),
					$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$onDropTarget($author$project$Components$App$Panels$PatternPanel$dropTargetConfig)),
				$elm$core$List$reverse(
					A5($author$project$Components$App$Panels$PatternPanel$renderPatternList, model.patternArray, model.ui.mouseOverElementIndex, model.ui.dragging.b, model.ui.overDragHandle, model.insertionPoint))),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('add_pattern'),
						$elm$html$Html$Attributes$class('outer_box')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('inner_box')
							]),
						_List_fromArray(
							[
								$author$project$Components$Icon$ParagraphDropdown$paragraphDropdown,
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('pattern_input_container')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('add_pattern_input'),
												$elm$html$Html$Attributes$placeholder('Add a pattern'),
												A2($elm$html$Html$Attributes$attribute, 'autocomplete', 'off'),
												$elm$html$Html$Events$onInput($author$project$Logic$App$Msg$UpdatePatternInputField),
												$elm$html$Html$Events$onFocus(
												$author$project$Logic$App$Msg$SetFocus('add_pattern_input')),
												$elm$html$Html$Events$onBlur(
												$author$project$Logic$App$Msg$SetFocus('')),
												$elm$html$Html$Attributes$value(model.ui.patternInputField),
												A2(
												$elm$html$Html$Events$preventDefaultOn,
												'keydown',
												A2($elm$json$Json$Decode$andThen, detectKey, $elm$html$Html$Events$keyCode))
											]),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('add_pattern_button'),
										$elm$html$Html$Attributes$class('add_button'),
										$elm$html$Html$Events$onClick(
										$author$project$Logic$App$Msg$InputPattern(valueToSend))
									]),
								_List_fromArray(
									[
										$lattyware$elm_fontawesome$FontAwesome$Styles$css,
										$lattyware$elm_fontawesome$FontAwesome$view(
										A2(
											$lattyware$elm_fontawesome$FontAwesome$styled,
											_List_fromArray(
												[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
											$lattyware$elm_fontawesome$FontAwesome$Solid$plus))
									]))
							]))
					]))
			]));
};
var $author$project$Logic$App$Msg$RequestGridDrawingAsGIF = {$: 'RequestGridDrawingAsGIF'};
var $author$project$Logic$App$Msg$RequestGridDrawingAsImage = {$: 'RequestGridDrawingAsImage'};
var $author$project$Components$App$Panels$FilePanel$saveExportPanel = function (model) {
	var visibility = A2($elm$core$List$member, $author$project$Logic$App$Types$FilePanel, model.ui.openPanels);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('save_export_panel'),
				$elm$html$Html$Attributes$class('panel'),
				$author$project$Components$App$Panels$Utils$visibilityToDisplayStyle(visibility)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('panel_title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('File')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('generic_button'),
						$elm$html$Html$Events$onClick(
						$author$project$Logic$App$Msg$ViewOverlay($author$project$Logic$App$Types$ImportTextOverlay))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(' • Import Patterns')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('generic_button'),
						$elm$html$Html$Events$onClick(
						$author$project$Logic$App$Msg$ViewOverlay($author$project$Logic$App$Types$ExportTextOverlay))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(' • Export Patterns')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('generic_button'),
						$elm$html$Html$Events$onClick(
						$author$project$Logic$App$Msg$ViewOverlay($author$project$Logic$App$Types$ExportTextOverlay))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(' • Export Give Command')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('generic_button'),
						$elm$html$Html$Events$onClick($author$project$Logic$App$Msg$RequestGridDrawingAsImage)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(' • Export Image')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('generic_button'),
						$elm$html$Html$Events$onClick($author$project$Logic$App$Msg$RequestGridDrawingAsGIF)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(' • Export Gif')
					]))
			]));
};
var $author$project$Components$App$Panels$StackPanel$renderStack = function (stack) {
	var renderIota = F2(
		function (index, iota) {
			return A3($author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsHtmlMsg, index, iota, 0);
		});
	return $elm$core$List$concat(
		$elm$core$Array$toList(
			A2($elm$core$Array$indexedMap, renderIota, stack)));
};
var $author$project$Components$App$Panels$StackPanel$stackPanel = function (model) {
	var visibility = A2($elm$core$List$member, $author$project$Logic$App$Types$StackPanel, model.ui.openPanels);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('stack_panel'),
				$elm$html$Html$Attributes$class('panel'),
				$author$project$Components$App$Panels$Utils$visibilityToDisplayStyle(visibility)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('panel_title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Stack ∧')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('scroll_container')
					]),
				$author$project$Components$App$Panels$StackPanel$renderStack(model.stack))
			]));
};
var $author$project$Components$App$Panels$Panels$panels = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('panels')
			]),
		_List_fromArray(
			[
				$author$project$Components$App$Panels$PatternPanel$patternPanel(model),
				$author$project$Components$App$Panels$StackPanel$stackPanel(model),
				$author$project$Components$App$Panels$ConfigHexPanel$configHexPanel(model),
				$author$project$Components$App$Panels$FilePanel$saveExportPanel(model),
				$author$project$Components$App$Panels$MacroPanel$libraryPanel(model)
			]));
};
var $author$project$Components$App$LeftBox$leftBox = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('left_box')
			]),
		_List_fromArray(
			[
				$author$project$Components$App$Menu$menu(model),
				$author$project$Components$App$Panels$Panels$panels(model)
			]));
};
var $elm$html$Html$Events$onMouseUp = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$Event = F4(
	function (keys, changedTouches, targetTouches, touches) {
		return {changedTouches: changedTouches, keys: keys, targetTouches: targetTouches, touches: touches};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$Touch = F4(
	function (identifier, clientPos, pagePos, screenPos) {
		return {clientPos: clientPos, identifier: identifier, pagePos: pagePos, screenPos: screenPos};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$touchDecoder = A5(
	$elm$json$Json$Decode$map4,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$Touch,
	A2($elm$json$Json$Decode$field, 'identifier', $elm$json$Json$Decode$int),
	$mpizenberg$elm_pointer_events$Internal$Decode$clientPos,
	$mpizenberg$elm_pointer_events$Internal$Decode$pagePos,
	$mpizenberg$elm_pointer_events$Internal$Decode$screenPos);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$touchListDecoder = $mpizenberg$elm_pointer_events$Internal$Decode$dynamicListOf;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$eventDecoder = A5(
	$elm$json$Json$Decode$map4,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$Event,
	$mpizenberg$elm_pointer_events$Internal$Decode$keys,
	A2(
		$elm$json$Json$Decode$field,
		'changedTouches',
		$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$touchListDecoder($mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$touchDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'targetTouches',
		$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$touchListDecoder($mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$touchDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'touches',
		$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$touchListDecoder($mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$touchDecoder)));
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onWithOptions = F3(
	function (event, options, tag) {
		return A2(
			$elm$html$Html$Events$custom,
			event,
			A2(
				$elm$json$Json$Decode$map,
				function (ev) {
					return {
						message: tag(ev),
						preventDefault: options.preventDefault,
						stopPropagation: options.stopPropagation
					};
				},
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$eventDecoder));
	});
var $author$project$Logic$App$Msg$SetGridScale = function (a) {
	return {$: 'SetGridScale', a: a};
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$arrowDownShortWide = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'arrow-down-short-wide',
	_Utils_Tuple2(576, 512),
	_Utils_Tuple2('M320 224H416c17.67 0 32-14.33 32-32s-14.33-32-32-32h-95.1c-17.67 0-32 14.33-32 32S302.3 224 320 224zM320 352H480c17.67 0 32-14.33 32-32s-14.33-32-32-32h-159.1c-17.67 0-32 14.33-32 32S302.3 352 320 352zM320 96h32c17.67 0 31.1-14.33 31.1-32s-14.33-32-31.1-32h-32c-17.67 0-32 14.33-32 32S302.3 96 320 96zM544 416h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 416 544 416zM192.4 330.7L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-6.312-6.883-14.94-10.38-23.61-10.38c-7.719 0-15.47 2.781-21.61 8.414c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C224.6 316.8 204.4 317.7 192.4 330.7z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$arrowDownShortWide = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$arrowDownShortWide);
var $author$project$Logic$App$Msg$GridDown = function (a) {
	return {$: 'GridDown', a: a};
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousedown', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$defaultOptions = {preventDefault: true, stopPropagation: false};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onEnd = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onWithOptions, 'touchend', $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$defaultOptions);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onStart = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onWithOptions, 'touchstart', $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$defaultOptions);
var $author$project$Components$App$Grid$getGridpointFromOffsetCoordinates = F2(
	function (grid_, offsetCoords) {
		var checkMatchingOffsetCoords = function (point) {
			return _Utils_eq(
				_Utils_Tuple2(point.offsetX, point.offsetY),
				_Utils_Tuple2(offsetCoords.offsetX, offsetCoords.offsetY));
		};
		return A2(
			$elm$core$Maybe$withDefault,
			$author$project$Components$App$Grid$emptyGridpoint,
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					checkMatchingOffsetCoords,
					$elm$core$List$concat(grid_))));
	});
var $author$project$Components$App$Grid$findLinkedPoints = F2(
	function (grid_, point) {
		var connectedPoints = A2(
			$elm$core$List$map,
			function (pnt) {
				return _Utils_Tuple3(
					A2($author$project$Components$App$Grid$getGridpointFromOffsetCoordinates, grid_, pnt),
					pnt.betweenOffsetValues,
					pnt.color);
			},
			point.connectedPoints);
		return A2(
			$elm$core$List$map,
			function (conPnt) {
				var conPntCoords = conPnt.a;
				var betweenOffsetValues = conPnt.b;
				var color = conPnt.c;
				return {
					betweenOffsetValues: betweenOffsetValues,
					color: color,
					coordPair: {x1: conPntCoords.x, x2: point.x, y1: conPntCoords.y, y2: point.y}
				};
			},
			connectedPoints);
	});
var $elm$svg$Svg$Attributes$fillOpacity = _VirtualDom_attribute('fill-opacity');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $author$project$Components$App$Grid$renderLine = F4(
	function (scale, color, coordinatePair, offsetsTuple) {
		var y2 = coordinatePair.y2;
		var y1 = coordinatePair.y1;
		var x2 = coordinatePair.x2;
		var x1 = coordinatePair.x1;
		var run = x2 - x1;
		var rise = y2 - y1;
		var coordsList = function () {
			var _v1 = offsetsTuple.a;
			var a1 = _v1.a;
			var a2 = _v1.b;
			var _v2 = offsetsTuple.b;
			var b1 = _v2.a;
			var b2 = _v2.b;
			var _v3 = offsetsTuple.c;
			var c1 = _v3.a;
			var c2 = _v3.b;
			return _List_fromArray(
				[
					_List_fromArray(
					[x1, y1]),
					_List_fromArray(
					[(x1 + ((0.6 * scale) * a1)) + (0.25 * run), (y1 + ((0.6 * scale) * a2)) + (0.25 * rise)]),
					_List_fromArray(
					[(x1 + ((0.6 * scale) * b1)) + (0.5 * run), (y1 + ((0.6 * scale) * b2)) + (0.5 * rise)]),
					_List_fromArray(
					[(x1 + ((0.6 * scale) * c1)) + (0.75 * run), (y1 + ((0.6 * scale) * c2)) + (0.75 * rise)]),
					_List_fromArray(
					[x2, y2])
				]);
		}();
		var allPointsValid = (!_Utils_eq(
			_Utils_Tuple2(coordinatePair.x1, coordinatePair.y1),
			_Utils_Tuple2(0.0, 0.0))) && (!_Utils_eq(
			_Utils_Tuple2(coordinatePair.x2, coordinatePair.y2),
			_Utils_Tuple2(0.0, 0.0)));
		return allPointsValid ? A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d(
					'M' + A2(
						$elm$core$String$join,
						' ',
						A2(
							$elm$core$List$map,
							$elm$core$String$fromFloat,
							$elm$core$List$concat(coordsList)))),
					$elm$svg$Svg$Attributes$stroke(color),
					$elm$svg$Svg$Attributes$strokeWidth(
					$elm$core$String$fromFloat(5.0 * scale)),
					$elm$svg$Svg$Attributes$strokeLinecap('round'),
					$elm$svg$Svg$Attributes$strokeLinejoin('round'),
					$elm$svg$Svg$Attributes$fillOpacity('0')
				]),
			_List_Nil) : $elm$html$Html$text('');
	});
var $author$project$Components$App$Grid$renderActivePath = function (model) {
	var points = model.grid.drawing.activePath;
	return A2(
		$elm$core$List$map,
		function (x) {
			return A4($author$project$Components$App$Grid$renderLine, model.settings.gridScale, x.color, x.coordPair, x.betweenOffsetValues);
		},
		A2(
			$elm$core$List$concatMap,
			$author$project$Components$App$Grid$findLinkedPoints(model.grid.points),
			points));
};
var $author$project$Components$App$Grid$renderDrawingLine = function (model) {
	var mousePos = model.mousePos;
	var gridOffset = model.window.width - model.grid.width;
	var drawingMode = model.grid.drawing.drawingMode;
	var activePoint = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Components$App$Grid$emptyGridpoint,
		$elm$core$List$head(model.grid.drawing.activePath));
	return drawingMode ? _List_fromArray(
		[
			A4(
			$author$project$Components$App$Grid$renderLine,
			model.settings.gridScale,
			$author$project$Settings$Theme$accent2,
			{x1: mousePos.a - gridOffset, x2: activePoint.x, y1: mousePos.b, y2: activePoint.y},
			_Utils_Tuple3(
				_Utils_Tuple2(0, 0),
				_Utils_Tuple2(0, 0),
				_Utils_Tuple2(0, 0)))
		]) : _List_Nil;
};
var $author$project$Components$App$Grid$renderLines = function (model) {
	var points = model.grid.drawnPoints;
	return A2(
		$elm$core$List$map,
		function (x) {
			return A4($author$project$Components$App$Grid$renderLine, model.settings.gridScale, x.color, x.coordPair, x.betweenOffsetValues);
		},
		A2(
			$elm$core$List$concatMap,
			$author$project$Components$App$Grid$findLinkedPoints(
				_List_fromArray(
					[points])),
			points));
};
var $author$project$Components$App$Grid$renderPoint = F4(
	function (mousePos, gridOffset, scale, point) {
		var pointScale = (!point.used) ? (A2(
			$elm$core$Basics$min,
			1,
			1 / (A2(
				$author$project$Components$App$Grid$distanceBetweenCoordinates,
				mousePos,
				_Utils_Tuple2(point.x + gridOffset, point.y)) / 30)) * scale) : 0;
		return (pointScale > 0.05) ? _List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(point.radius * 2)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(point.radius * 2)),
						$elm$svg$Svg$Attributes$viewBox('0 0 300 280'),
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2(
						$elm$html$Html$Attributes$style,
						'left',
						$elm$core$String$fromFloat(point.x - (8 * scale)) + 'px'),
						A2(
						$elm$html$Html$Attributes$style,
						'top',
						$elm$core$String$fromFloat(point.y - (8 * scale)) + 'px'),
						A2(
						$elm$html$Html$Attributes$style,
						'transform',
						'scale(' + ($elm$core$String$fromFloat(pointScale) + ')')),
						$elm$svg$Svg$Attributes$fill(point.color)
					]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$polygon,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$points('300,150 225,280 75,280 0,150 75,20 225,20')
							]),
						_List_Nil)
					]))
			]) : _List_Nil;
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Components$App$Grid$renderPoints = function (model) {
	var scale = model.settings.gridScale;
	var mousePos = model.mousePos;
	var mouseOffsetCoordY = $elm$core$Basics$floor(
		mousePos.b / $author$project$Components$App$Grid$verticalSpacing(scale));
	var points = A2(
		$elm$core$List$take,
		14,
		A2($elm$core$List$drop, mouseOffsetCoordY - 7, model.grid.points));
	var gridWidth = model.grid.width;
	var gridOffset = model.window.width - gridWidth;
	return A2(
		$elm$core$List$concatMap,
		A3($author$project$Components$App$Grid$renderPoint, mousePos, gridOffset, scale),
		$elm$core$List$concat(points));
};
var $author$project$Logic$App$Utils$Utils$touchCoordinates = function (touchEvent) {
	return A2(
		$elm$core$Maybe$withDefault,
		_Utils_Tuple2(0, 0),
		A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.clientPos;
			},
			$elm$core$List$head(touchEvent.changedTouches)));
};
var $author$project$Components$App$Grid$grid = function (model) {
	var scale = model.settings.gridScale;
	var gridHeight = model.grid.height;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('hex_grid'),
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.clientPos;
					},
					$author$project$Logic$App$Msg$GridDown)),
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onStart(
				A2($elm$core$Basics$composeR, $author$project$Logic$App$Utils$Utils$touchCoordinates, $author$project$Logic$App$Msg$GridDown)),
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onEnd(
				function (_v0) {
					return $author$project$Logic$App$Msg$MouseUp;
				})
			]),
		_Utils_ap(
			$author$project$Components$App$Grid$renderPoints(model),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(model.grid.height)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(model.grid.width)),
							$elm$svg$Svg$Attributes$id('grid_drawing')
						]),
					_Utils_ap(
						$author$project$Components$App$Grid$renderDrawingLine(model),
						_Utils_ap(
							$author$project$Components$App$Grid$renderActivePath(model),
							$author$project$Components$App$Grid$renderLines(model))))
				])));
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$minus = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'minus',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M400 288h-352c-17.69 0-32-14.32-32-32.01s14.31-31.99 32-31.99h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$minus = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$minus);
var $author$project$Components$App$Timeline$renderPoints = function (model) {
	var timelineLength = $elm$core$Array$length(model.timeline);
	var spacing = (model.grid.width - 50) / (timelineLength - 1);
	var setSpecificAttributes = F2(
		function (scale, index) {
			return _Utils_eq(index, timelineLength - 1) ? _List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromFloat(model.grid.width - 30) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'transform',
					'scale(' + ($elm$core$String$fromFloat(200 * scale) + '%)'))
				]) : ((!index) ? _List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromFloat(20) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'transform',
					'scale(' + ($elm$core$String$fromFloat(200 * scale) + '%)'))
				]) : _List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromFloat((spacing * index) + 20) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'transform',
					'scale(' + ($elm$core$String$fromFloat(100 * scale) + '%)'))
				]));
		});
	var currentTime = _Utils_eq(
		model.timelineIndex,
		$elm$core$Array$length(model.timeline));
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (index, _v0) {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A3(
							$author$project$Logic$App$Utils$Utils$ifThenElse,
							_Utils_eq(index, model.timelineIndex + 1) || (currentTime && _Utils_eq(index + 1, timelineLength)),
							$elm$svg$Svg$Attributes$class('timeline_point_selected'),
							$elm$svg$Svg$Attributes$class('timeline_point'))
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$svg,
							_Utils_ap(
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$width(
										$elm$core$String$fromFloat(12)),
										$elm$svg$Svg$Attributes$height(
										$elm$core$String$fromFloat(12)),
										$elm$svg$Svg$Attributes$viewBox('0 0 300 280'),
										A3(
										$author$project$Logic$App$Utils$Utils$ifThenElse,
										_Utils_eq(index, model.timelineIndex + 1) || (currentTime && _Utils_eq(index + 1, timelineLength)),
										$elm$svg$Svg$Attributes$class('timeline_point_outline_selected'),
										$elm$svg$Svg$Attributes$class('timeline_point_outline')),
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2(
										$elm$html$Html$Attributes$style,
										'top',
										$elm$core$String$fromInt(44) + 'px'),
										A3(
										$author$project$Logic$App$Utils$Utils$ifThenElse,
										_Utils_eq(index, model.timelineIndex + 1) || (currentTime && _Utils_eq(index + 1, timelineLength)),
										$elm$svg$Svg$Attributes$fill($author$project$Settings$Theme$accent2),
										$elm$svg$Svg$Attributes$fill($author$project$Settings$Theme$accent1)),
										$elm$html$Html$Events$onClick(
										$author$project$Logic$App$Msg$SetTimelineIndex(index - 1))
									]),
								A2(setSpecificAttributes, 1.7, index)),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$polygon,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$points('300,150 225,280 75,280 0,150 75,20 225,20')
										]),
									_List_Nil)
								])),
							A2(
							$elm$svg$Svg$svg,
							_Utils_ap(
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$width(
										$elm$core$String$fromFloat(12)),
										$elm$svg$Svg$Attributes$height(
										$elm$core$String$fromFloat(12)),
										$elm$svg$Svg$Attributes$viewBox('0 0 300 280'),
										A3(
										$author$project$Logic$App$Utils$Utils$ifThenElse,
										_Utils_eq(index, model.timelineIndex + 1) || (currentTime && _Utils_eq(index + 1, timelineLength)),
										$elm$svg$Svg$Attributes$class('timeline_point_outline_selected'),
										$elm$svg$Svg$Attributes$class('timeline_point_outline')),
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2(
										$elm$html$Html$Attributes$style,
										'top',
										$elm$core$String$fromInt(44) + 'px'),
										$elm$svg$Svg$Attributes$fill('var(--primary_light)'),
										$elm$html$Html$Events$onClick(
										$author$project$Logic$App$Msg$SetTimelineIndex(index - 1))
									]),
								A2(setSpecificAttributes, 1.3, index)),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$polygon,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$points('300,150 225,280 75,280 0,150 75,20 225,20')
										]),
									_List_Nil)
								])),
							A2(
							$elm$svg$Svg$svg,
							_Utils_ap(
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$width(
										$elm$core$String$fromFloat(12)),
										$elm$svg$Svg$Attributes$height(
										$elm$core$String$fromFloat(12)),
										$elm$svg$Svg$Attributes$viewBox('0 0 300 280'),
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2(
										$elm$html$Html$Attributes$style,
										'top',
										$elm$core$String$fromInt(44) + 'px'),
										A3(
										$author$project$Logic$App$Utils$Utils$ifThenElse,
										_Utils_eq(index, model.timelineIndex + 1) || (currentTime && _Utils_eq(index + 1, timelineLength)),
										$elm$svg$Svg$Attributes$fill($author$project$Settings$Theme$accent2),
										$elm$svg$Svg$Attributes$fill($author$project$Settings$Theme$accent1)),
										$elm$html$Html$Events$onClick(
										$author$project$Logic$App$Msg$SetTimelineIndex(index - 1))
									]),
								A2(setSpecificAttributes, 1, index)),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$polygon,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$points('300,150 225,280 75,280 0,150 75,20 225,20')
										]),
									_List_Nil)
								]))
						]));
			}),
		A2($elm$core$List$repeat, timelineLength, $elm$core$Maybe$Nothing));
};
var $author$project$Components$App$Timeline$timeline = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('bottom_box')
			]),
		A2(
			$elm$core$List$cons,
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('timeline_bar')
					]),
				_List_Nil),
			$author$project$Components$App$Timeline$renderPoints(
				_Utils_update(
					model,
					{
						timeline: ($elm$core$Array$length(model.timeline) < 2) ? A2(
							$elm$core$Array$repeat,
							2,
							{patternIndex: -1, stack: $elm$core$Array$empty}) : model.timeline
					}))));
};
var $author$project$Components$App$Right$right = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('right')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('canvas_buttons')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('sort'),
								$elm$html$Html$Events$onClick(
								$author$project$Logic$App$Msg$SetTimelineIndex(2))
							]),
						_List_fromArray(
							[
								$lattyware$elm_fontawesome$FontAwesome$Styles$css,
								$lattyware$elm_fontawesome$FontAwesome$view(
								A2(
									$lattyware$elm_fontawesome$FontAwesome$styled,
									_List_fromArray(
										[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
									$lattyware$elm_fontawesome$FontAwesome$Solid$arrowDownShortWide))
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('zoom_out'),
								$elm$html$Html$Events$onClick(
								$author$project$Logic$App$Msg$SetGridScale(model.settings.gridScale - 0.1))
							]),
						_List_fromArray(
							[
								$lattyware$elm_fontawesome$FontAwesome$Styles$css,
								$lattyware$elm_fontawesome$FontAwesome$view(
								A2(
									$lattyware$elm_fontawesome$FontAwesome$styled,
									_List_fromArray(
										[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
									$lattyware$elm_fontawesome$FontAwesome$Solid$minus))
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('zoom_in'),
								$elm$html$Html$Events$onClick(
								$author$project$Logic$App$Msg$SetGridScale(model.settings.gridScale + 0.1))
							]),
						_List_fromArray(
							[
								$lattyware$elm_fontawesome$FontAwesome$Styles$css,
								$lattyware$elm_fontawesome$FontAwesome$view(
								A2(
									$lattyware$elm_fontawesome$FontAwesome$styled,
									_List_fromArray(
										[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
									$lattyware$elm_fontawesome$FontAwesome$Solid$plus))
							]))
					])),
				$author$project$Components$App$Grid$grid(model),
				$author$project$Components$App$Timeline$timeline(model)
			]));
};
var $author$project$Components$App$Content$content = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('content'),
				A3(
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions,
				'mousemove',
				{preventDefault: false, stopPropagation: false},
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.clientPos;
					},
					$author$project$Logic$App$Msg$MouseMove)),
				A3(
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onWithOptions,
				'touchmove',
				{preventDefault: false, stopPropagation: false},
				A2($elm$core$Basics$composeR, $author$project$Logic$App$Utils$Utils$touchCoordinates, $author$project$Logic$App$Msg$MouseMove)),
				$elm$html$Html$Events$onMouseUp($author$project$Logic$App$Msg$MouseUp)
			]),
		_Utils_ap(
			_List_fromArray(
				[
					$author$project$Components$App$LeftBox$leftBox(model),
					$author$project$Components$App$Right$right(model),
					$author$project$Components$App$PatternAutoComplete$patternInputAutoComplete(model).a
				]),
			_Utils_ap(
				$author$project$Components$App$Overlays$ImportTextOverlay$importTextOverlay(model),
				$author$project$Components$App$Overlays$ExportTextOverlay$exportTextOverlay(model))));
};
var $author$project$Main$view = function (model) {
	return {
		body: _List_fromArray(
			[
				$author$project$Components$App$Content$content(model)
			]),
		title: 'Hex Studio'
	};
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));