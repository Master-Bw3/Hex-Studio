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

	/**_UNUSED/
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

	/**/
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

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
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

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


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



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


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

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
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

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
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


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
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
	if (region.bY.aT === region.cd.aT)
	{
		return 'on line ' + region.bY.aT;
	}
	return 'on lines ' + region.bY.aT + ' through ' + region.cd.aT;
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



/**_UNUSED/
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

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

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
		impl.du,
		impl.el,
		impl.d8,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
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


function _Platform_export(exports)
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


function _Platform_export_UNUSED(exports)
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

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
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

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
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
		ad: func(record.ad),
		bZ: record.bZ,
		bT: record.bT
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
		var message = !tag ? value : tag < 3 ? value.a : value.ad;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bZ;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bT) && event.preventDefault(),
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
		impl.du,
		impl.el,
		impl.d8,
		function(sendToApp, initialModel) {
			var view = impl.en;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
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
		impl.du,
		impl.el,
		impl.d8,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bX && impl.bX(sendToApp)
			var view = impl.en;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.c7);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.ee) && (_VirtualDom_doc.title = title = doc.ee);
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
	var onUrlChange = impl.dL;
	var onUrlRequest = impl.dM;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bX: function(sendToApp)
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
							&& curr.cM === next.cM
							&& curr.cl === next.cl
							&& curr.cI.a === next.cI.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		du: function(flags)
		{
			return A3(impl.du, flags, _Browser_getUrl(), key);
		},
		en: impl.en,
		el: impl.el,
		d8: impl.d8
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
		? { dr: 'hidden', c9: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { dr: 'mozHidden', c9: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { dr: 'msHidden', c9: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { dr: 'webkitHidden', c9: 'webkitvisibilitychange' }
		: { dr: 'hidden', c9: 'visibilitychange' };
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
		cS: _Browser_getScene(),
		c1: {
			p: _Browser_window.pageXOffset,
			q: _Browser_window.pageYOffset,
			_: _Browser_doc.documentElement.clientWidth,
			dq: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		_: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		dq: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
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
			cS: {
				_: node.scrollWidth,
				dq: node.scrollHeight
			},
			c1: {
				p: node.scrollLeft,
				q: node.scrollTop,
				_: node.clientWidth,
				dq: node.clientHeight
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
			cS: _Browser_getScene(),
			c1: {
				p: x,
				q: y,
				_: _Browser_doc.documentElement.clientWidth,
				dq: _Browser_doc.documentElement.clientHeight
			},
			av: {
				p: x + rect.left,
				q: y + rect.top,
				_: rect.width,
				dq: rect.height
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
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
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
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
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
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
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
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
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
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
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
		return {$: 0, a: a, b: b, c: c, d: d};
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
	return {$: 1, a: a};
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
	return {$: 0, a: a};
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
		if (!builder.r) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.u),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.u);
		} else {
			var treeLen = builder.r * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.v) : builder.v;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.r);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.u) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.u);
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
					{v: nodeList, r: (len / $elm$core$Array$branchFactor) | 0, u: tail});
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
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
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
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {ci: fragment, cl: host, cG: path, cI: port_, cM: protocol, cN: query};
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
					if (_v1.$ === 1) {
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
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
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
		var task = _v0;
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
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$Logic$App$Msg$GetContentSize = function (a) {
	return {$: 3, a: a};
};
var $author$project$Logic$App$Msg$GetGrid = function (a) {
	return {$: 2, a: a};
};
var $author$project$Logic$App$Types$PatternPanel = 1;
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
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
					task)));
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		{
			E: {
				am: {au: _List_Nil, dk: false},
				dq: 0,
				bi: _List_Nil,
				_: 0
			},
			aU: _Utils_Tuple2(0.0, 0.0),
			dU: $elm$core$Array$empty,
			aZ: {aQ: 1.0},
			d5: $elm$core$Array$empty,
			ed: 0,
			ek: {
				dO: _List_fromArray(
					[1]),
				bS: '',
				d9: 0
			},
			bn: {dq: 0.0, _: 0.0}
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
var $author$project$Logic$App$Msg$RecieveGeneratedNumberLiteral = function (a) {
	return {$: 14, a: a};
};
var $author$project$Logic$App$Msg$Tick = function (a) {
	return {$: 10, a: a};
};
var $author$project$Logic$App$Msg$WindowResize = {$: 9};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {cL: processes, cZ: taggers};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
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
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
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
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
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
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
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
		if (_v1.$ === 1) {
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
			if (dict.$ === -2) {
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
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
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
		var processes = _v0.cL;
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
				$elm$core$Task$succeed(0)));
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
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.cZ);
		if (_v0.$ === 1) {
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
var $elm$browser$Browser$Events$Window = 1;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {cH: pids, cY: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
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
		return {cf: event, cq: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
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
			state.cH,
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
		if (!_v0.$) {
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
		var key = _v0.cq;
		var event = _v0.cf;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.cY);
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
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		1,
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
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Ports$HexNumGen$return = _Platform_incomingPort('return', $elm$json$Json$Decode$string);
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onResize(
				F2(
					function (_v0, _v1) {
						return $author$project$Logic$App$Msg$WindowResize;
					})),
				A2($elm$time$Time$every, 50, $author$project$Logic$App$Msg$Tick),
				$author$project$Ports$HexNumGen$return($author$project$Logic$App$Msg$RecieveGeneratedNumberLiteral)
			]));
};
var $author$project$Settings$Theme$accent5 = '#E0E3B8';
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
var $author$project$Components$App$Grid$emptyGridpoint = {S: '', D: _List_Nil, A: 0, B: 0, bj: 0, a5: false, p: 0, q: 0};
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
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Components$App$Grid$getClosestPoint = F3(
	function (coordinates, points, model) {
		var gridOffset = model.bn._ - model.E._;
		var offsetCoords = _Utils_Tuple2(coordinates.a - gridOffset, coordinates.b);
		var distanceComparison = F2(
			function (a, b) {
				var _v0 = A2(
					$elm$core$Basics$compare,
					A2(
						$author$project$Components$App$Grid$distanceBetweenCoordinates,
						_Utils_Tuple2(a.p, a.q),
						offsetCoords),
					A2(
						$author$project$Components$App$Grid$distanceBetweenCoordinates,
						_Utils_Tuple2(b.p, b.q),
						offsetCoords));
				switch (_v0) {
					case 0:
						return 0;
					case 1:
						return 1;
					default:
						return 2;
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
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Basics$not = _Basics_not;
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
	var scale = model.aZ.aQ;
	var modelGrid = model.E;
	var otherNodes = A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		$elm$core$List$tail(modelGrid.am.au));
	var prevPrevNode = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Components$App$Grid$emptyGridpoint,
		$elm$core$List$head(otherNodes));
	var prevGridNode = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Components$App$Grid$emptyGridpoint,
		$elm$core$List$head(modelGrid.am.au));
	var prevNode = A2(
		$elm$core$Maybe$withDefault,
		prevGridNode,
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (point) {
					return _Utils_eq(
						_Utils_Tuple2(point.p, point.q),
						_Utils_Tuple2(prevGridNode.p, prevGridNode.q));
				},
				otherNodes)));
	var gridOffset = model.bn._ - model.E._;
	var offsetMousePos = _Utils_Tuple2(model.aU.a - gridOffset, model.aU.b);
	var closestGridNode = A3($author$project$Components$App$Grid$getClosestPoint, model.aU, modelGrid.bi, model);
	var closestPoint = A2(
		$elm$core$Maybe$withDefault,
		closestGridNode,
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (point) {
					return _Utils_eq(
						_Utils_Tuple2(point.p, point.q),
						_Utils_Tuple2(closestGridNode.p, closestGridNode.q));
				},
				modelGrid.am.au)));
	var mouseDistanceCloseToPoint = _Utils_cmp(
		A2(
			$author$project$Components$App$Grid$distanceBetweenCoordinates,
			offsetMousePos,
			_Utils_Tuple2(closestPoint.p, closestPoint.q)),
		$author$project$Components$App$Grid$spacing(scale) / 2) < 1;
	var pointCloseToPrevPoint = _Utils_cmp(
		A2(
			$author$project$Components$App$Grid$distanceBetweenCoordinates,
			_Utils_Tuple2(prevNode.p, prevNode.q),
			_Utils_Tuple2(closestPoint.p, closestPoint.q)),
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
					_Utils_Tuple2(pnt.A, pnt.B),
					_Utils_Tuple2(closestPoint.A, closestPoint.B));
			},
			prevNode.D)) || A2(
		$elm$core$List$any,
		function (x) {
			return x;
		},
		A2(
			$elm$core$List$map,
			function (pnt) {
				return _Utils_eq(
					_Utils_Tuple2(pnt.A, pnt.B),
					_Utils_Tuple2(prevNode.A, prevNode.B));
			},
			closestPoint.D)));
	var pointNotPrevPoint = !_Utils_eq(
		_Utils_Tuple2(prevNode.p, prevNode.q),
		_Utils_Tuple2(closestPoint.p, closestPoint.q));
	var pointPrevPrevPoint = _Utils_eq(
		_Utils_Tuple2(prevPrevNode.p, prevPrevNode.q),
		_Utils_Tuple2(closestPoint.p, closestPoint.q));
	return pointPrevPrevPoint ? A2(
		$elm$core$List$cons,
		_Utils_update(
			prevPrevNode,
			{
				D: A2(
					$elm$core$List$filter,
					function (pnt) {
						return !_Utils_eq(
							_Utils_Tuple2(pnt.A, pnt.B),
							_Utils_Tuple2(prevNode.A, prevNode.B));
					},
					prevPrevNode.D)
			}),
		A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$tail(otherNodes))) : ((mouseDistanceCloseToPoint && (pointCloseToPrevPoint && (pointNotConnectedToPrevPoint && (pointNotPrevPoint && (!closestPoint.a5))))) ? _Utils_ap(
		_List_fromArray(
			[
				closestPoint,
				_Utils_update(
				prevNode,
				{
					D: A2(
						$elm$core$List$cons,
						{
							aj: _Utils_Tuple3(
								_Utils_Tuple2(0, 0),
								_Utils_Tuple2(0, 0),
								_Utils_Tuple2(0, 0)),
							S: $author$project$Settings$Theme$accent2,
							A: closestPoint.A,
							B: closestPoint.B
						},
						prevNode.D)
				})
			]),
		otherNodes) : modelGrid.am.au);
};
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.u)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.u, tail);
		return (notAppended < 0) ? {
			v: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.v),
			r: builder.r + 1,
			u: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			v: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.v),
			r: builder.r + 1,
			u: $elm$core$Elm$JsArray$empty
		} : {v: builder.v, r: builder.r, u: appended});
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
			if (!value.$) {
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
			if (!node.$) {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		v: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		r: (len / $elm$core$Array$branchFactor) | 0,
		u: tail
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
					if (!node.$) {
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
					if (!node.$) {
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
					{v: nodeList, r: nodeListSize, u: jsArray});
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
var $author$project$Logic$App$PatternList$PatternArray$updateDrawingColors = function (patternTuple) {
	return _Utils_Tuple2(
		patternTuple.a,
		A2(
			$elm$core$List$map,
			function (pnt) {
				return _Utils_update(
					pnt,
					{
						D: A2(
							$elm$core$List$map,
							function (conPnt) {
								return _Utils_update(
									conPnt,
									{S: patternTuple.a.S});
							},
							pnt.D)
					});
			},
			patternTuple.b));
};
var $author$project$Logic$App$PatternList$PatternArray$addToPatternArray = F2(
	function (model, pattern) {
		var patternList = model.dU;
		var drawing = model.E.am;
		var patternDrawingPair = _Utils_Tuple2(pattern, drawing.au);
		return A2(
			$elm$core$Array$append,
			$elm$core$Array$fromList(
				_List_fromArray(
					[
						$author$project$Logic$App$PatternList$PatternArray$updateDrawingColors(patternDrawingPair)
					])),
			patternList);
	});
var $author$project$Components$App$Grid$applyPathToGrid = F2(
	function (gridPoints, pointsToAdd) {
		var replace = function (pnt) {
			var replacedPnt = $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (activePnt) {
						return _Utils_eq(
							_Utils_Tuple2(activePnt.A, activePnt.B),
							_Utils_Tuple2(pnt.A, pnt.B));
					},
					pointsToAdd));
			if (!replacedPnt.$) {
				var point = replacedPnt.a;
				return _Utils_update(
					pnt,
					{S: $author$project$Settings$Theme$accent2, D: point.D, a5: true});
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
var $author$project$Components$App$Grid$applyActivePathToGrid = F2(
	function (gridPoints, activePoints) {
		return A2($author$project$Components$App$Grid$applyPathToGrid, gridPoints, activePoints);
	});
var $author$project$Logic$App$Types$OpenParenthesis = function (a) {
	return {$: 8, a: a};
};
var $author$project$Logic$App$Types$Pattern = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
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
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
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
		if (!_v0.$) {
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
var $author$project$Logic$App$Utils$Utils$unshift = F2(
	function (item, array) {
		return A2(
			$elm$core$Array$append,
			$elm$core$Array$fromList(
				_List_fromArray(
					[item])),
			array);
	});
var $author$project$Logic$App$Stack$Stack$addEscapedPatternIotaToStack = F2(
	function (stack, pattern) {
		var _v0 = A2($elm$core$Array$get, 0, stack);
		if ((!_v0.$) && (_v0.a.$ === 8)) {
			var list = _v0.a.a;
			return A3(
				$elm$core$Array$set,
				0,
				$author$project$Logic$App$Types$OpenParenthesis(
					A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						A2($author$project$Logic$App$Types$Pattern, pattern, true),
						list)),
				stack);
		} else {
			return A2(
				$author$project$Logic$App$Utils$Utils$unshift,
				A2($author$project$Logic$App$Types$Pattern, pattern, true),
				stack);
		}
	});
var $author$project$Logic$App$Types$CatastrophicFailure = 12;
var $author$project$Logic$App$Types$Garbage = function (a) {
	return {$: 7, a: a};
};
var $author$project$Logic$App$Types$IotaList = function (a) {
	return {$: 4, a: a};
};
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
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (!node.$) {
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
var $author$project$Logic$App$Stack$Stack$applyPatternToStack = F2(
	function (stack, pattern) {
		var _v0 = A2($elm$core$Array$get, 0, stack);
		if ((!_v0.$) && (_v0.a.$ === 8)) {
			var list = _v0.a.a;
			var numberOfOpenParen = 1 + $elm$core$Array$length(
				A2(
					$elm$core$Array$filter,
					function (iota) {
						if ((iota.$ === 5) && (!iota.b)) {
							var pat = iota.a;
							return pat.dv === 'open_paren';
						} else {
							return false;
						}
					},
					list));
			var numberOfCloseParen = $elm$core$Array$length(
				A2(
					$elm$core$Array$filter,
					function (iota) {
						if ((iota.$ === 5) && (!iota.b)) {
							var pat = iota.a;
							return pat.dv === 'close_paren';
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
						$author$project$Logic$App$Utils$Utils$unshift,
						A2($author$project$Logic$App$Types$Pattern, pattern, false),
						list)),
				stack);
			return (pattern.dv === 'escape') ? _Utils_Tuple2(stack, true) : ((pattern.dv === 'close_paren') ? (((pattern.dv === 'close_paren') && (_Utils_cmp(numberOfCloseParen + 1, numberOfOpenParen) > -1)) ? _Utils_Tuple2(
				A2(
					$elm$core$Array$map,
					function (iota) {
						if (iota.$ === 8) {
							var l = iota.a;
							return $author$project$Logic$App$Types$IotaList(l);
						} else {
							var otherIota = iota;
							return otherIota;
						}
					},
					stack),
				false) : _Utils_Tuple2(addToIntroList, false)) : _Utils_Tuple2(addToIntroList, false));
		} else {
			return (pattern.dv === 'escape') ? _Utils_Tuple2(stack, true) : ((pattern.dv === 'close_paren') ? _Utils_Tuple2(
				A2(
					$author$project$Logic$App$Utils$Utils$unshift,
					$author$project$Logic$App$Types$Garbage(12),
					stack),
				false) : _Utils_Tuple2(
				pattern.a(stack),
				false));
		}
	});
var $author$project$Logic$App$Stack$Stack$applyPatternsToStack = F3(
	function (stack, patterns, escapeThis) {
		applyPatternsToStack:
		while (true) {
			var _v0 = $elm$core$List$head(patterns);
			if (_v0.$ === 1) {
				return stack;
			} else {
				var pattern = _v0.a;
				if (escapeThis) {
					var $temp$stack = A2($author$project$Logic$App$Stack$Stack$addEscapedPatternIotaToStack, stack, pattern),
						$temp$patterns = A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						$elm$core$List$tail(patterns)),
						$temp$escapeThis = false;
					stack = $temp$stack;
					patterns = $temp$patterns;
					escapeThis = $temp$escapeThis;
					continue applyPatternsToStack;
				} else {
					var stackEscapeTuple = A2($author$project$Logic$App$Stack$Stack$applyPatternToStack, stack, pattern);
					var newStack = stackEscapeTuple.a;
					var escapeNext = stackEscapeTuple.b;
					var $temp$stack = newStack,
						$temp$patterns = A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						$elm$core$List$tail(patterns)),
						$temp$escapeThis = escapeNext;
					stack = $temp$stack;
					patterns = $temp$patterns;
					escapeThis = $temp$escapeThis;
					continue applyPatternsToStack;
				}
			}
		}
	});
var $elm$json$Json$Encode$float = _Json_wrap;
var $author$project$Ports$HexNumGen$call = _Platform_outgoingPort('call', $elm$json$Json$Encode$float);
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
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
var $author$project$Logic$App$Utils$GetAngleSignature$East = 2;
var $author$project$Logic$App$Utils$GetAngleSignature$Error = 6;
var $author$project$Logic$App$Utils$GetAngleSignature$Northeast = 0;
var $author$project$Logic$App$Utils$GetAngleSignature$Northwest = 1;
var $author$project$Logic$App$Utils$GetAngleSignature$Southeast = 4;
var $author$project$Logic$App$Utils$GetAngleSignature$Southwest = 5;
var $author$project$Logic$App$Utils$GetAngleSignature$West = 3;
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $author$project$Logic$App$Utils$GetAngleSignature$letterMap = _List_fromArray(
	[
		_Utils_Tuple2(
		'w',
		_Utils_Tuple2(2, 2)),
		_Utils_Tuple2(
		'a',
		_Utils_Tuple2(2, 1)),
		_Utils_Tuple2(
		'q',
		_Utils_Tuple2(2, 0)),
		_Utils_Tuple2(
		'd',
		_Utils_Tuple2(2, 5)),
		_Utils_Tuple2(
		'e',
		_Utils_Tuple2(2, 4)),
		_Utils_Tuple2(
		'e',
		_Utils_Tuple2(0, 2)),
		_Utils_Tuple2(
		'q',
		_Utils_Tuple2(0, 1)),
		_Utils_Tuple2(
		'a',
		_Utils_Tuple2(0, 3)),
		_Utils_Tuple2(
		'w',
		_Utils_Tuple2(0, 0)),
		_Utils_Tuple2(
		'd',
		_Utils_Tuple2(0, 4)),
		_Utils_Tuple2(
		'd',
		_Utils_Tuple2(1, 2)),
		_Utils_Tuple2(
		'w',
		_Utils_Tuple2(1, 1)),
		_Utils_Tuple2(
		'q',
		_Utils_Tuple2(1, 3)),
		_Utils_Tuple2(
		'e',
		_Utils_Tuple2(1, 0)),
		_Utils_Tuple2(
		'a',
		_Utils_Tuple2(1, 5)),
		_Utils_Tuple2(
		'd',
		_Utils_Tuple2(3, 0)),
		_Utils_Tuple2(
		'e',
		_Utils_Tuple2(3, 1)),
		_Utils_Tuple2(
		'w',
		_Utils_Tuple2(3, 3)),
		_Utils_Tuple2(
		'a',
		_Utils_Tuple2(3, 4)),
		_Utils_Tuple2(
		'q',
		_Utils_Tuple2(3, 5)),
		_Utils_Tuple2(
		'a',
		_Utils_Tuple2(5, 2)),
		_Utils_Tuple2(
		'd',
		_Utils_Tuple2(5, 1)),
		_Utils_Tuple2(
		'e',
		_Utils_Tuple2(5, 3)),
		_Utils_Tuple2(
		'q',
		_Utils_Tuple2(5, 4)),
		_Utils_Tuple2(
		'w',
		_Utils_Tuple2(5, 5)),
		_Utils_Tuple2(
		'q',
		_Utils_Tuple2(4, 2)),
		_Utils_Tuple2(
		'a',
		_Utils_Tuple2(4, 0)),
		_Utils_Tuple2(
		'd',
		_Utils_Tuple2(4, 3)),
		_Utils_Tuple2(
		'w',
		_Utils_Tuple2(4, 4)),
		_Utils_Tuple2(
		'e',
		_Utils_Tuple2(4, 5))
	]);
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Logic$App$Utils$GetAngleSignature$getAngleSignature = function (unflippedPath) {
	var path = $elm$core$List$reverse(unflippedPath);
	var getAngleLetter = F2(
		function (direction1, direction2) {
			return A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(
					'',
					_Utils_Tuple2(6, 6)),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (x) {
							return _Utils_eq(
								x.b,
								_Utils_Tuple2(direction1, direction2));
						},
						$author$project$Logic$App$Utils$GetAngleSignature$letterMap))).a;
		});
	var directionVector = function (_v0) {
		var x1 = _v0.bo;
		var x2 = _v0.bp;
		var y1 = _v0.bq;
		var y2 = _v0.br;
		return _Utils_Tuple2(x2 - x1, y2 - y1);
	};
	var directionMap = _List_fromArray(
		[
			_Utils_Tuple2(
			0,
			_Utils_Tuple2(1, -1)),
			_Utils_Tuple2(
			2,
			_Utils_Tuple2(2, 0)),
			_Utils_Tuple2(
			4,
			_Utils_Tuple2(1, 1)),
			_Utils_Tuple2(
			5,
			_Utils_Tuple2(-1, 1)),
			_Utils_Tuple2(
			3,
			_Utils_Tuple2(-2, 0)),
			_Utils_Tuple2(
			1,
			_Utils_Tuple2(-1, -1))
		]);
	var directionBetweenPoints = F2(
		function (point1, point2) {
			return A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(
					6,
					_Utils_Tuple2(404, 0)),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (x) {
							return _Utils_eq(
								x.b,
								directionVector(
									{bo: point1.a, bp: point2.a, bq: point1.b, br: point2.b}));
						},
						directionMap))).a;
		});
	var directionList = A3(
		$elm$core$List$map2,
		F2(
			function (pnt1, pnt2) {
				return A2(
					directionBetweenPoints,
					_Utils_Tuple2(pnt1.A, pnt1.B),
					_Utils_Tuple2(pnt2.A, pnt2.B));
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
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Logic$App$Types$Boolean = function (a) {
	return {$: 2, a: a};
};
var $author$project$Logic$App$Types$Null = {$: 6};
var $author$project$Logic$App$Types$Number = function (a) {
	return {$: 0, a: a};
};
var $author$project$Logic$App$Types$Vector = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$Logic$App$Types$IncorrectIota = 2;
var $author$project$Logic$App$Types$NotEnoughIotas = 1;
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
						if (!node.$) {
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
						v: _List_Nil,
						r: 0,
						u: A3(
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
			if (!_v0.$) {
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
				if (!_v0.$) {
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
		if (!_v0.$) {
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
var $author$project$Logic$App$Patterns$OperatorUtils$action1Input = F3(
	function (stack, inputGetter, action) {
		var newStack = A3(
			$elm$core$Array$slice,
			1,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota = A2($elm$core$Array$get, 0, stack);
		if (maybeIota.$ === 1) {
			return A2(
				$author$project$Logic$App$Utils$Utils$unshift,
				$author$project$Logic$App$Types$Garbage(1),
				newStack);
		} else {
			var iota = maybeIota.a;
			var _v1 = inputGetter(iota);
			if ((_v1.$ === 7) && (_v1.a === 2)) {
				var _v2 = _v1.a;
				return A2(
					$author$project$Logic$App$Utils$Utils$unshift,
					$author$project$Logic$App$Types$Garbage(2),
					newStack);
			} else {
				return A2(
					$elm$core$Array$append,
					action(iota),
					newStack);
			}
		}
	});
var $ianmackenzie$elm_geometry$Geometry$Types$Vector3d = $elm$core$Basics$identity;
var $ianmackenzie$elm_geometry$Vector3d$xyz = F3(
	function (_v0, _v1, _v2) {
		var x = _v0;
		var y = _v1;
		var z = _v2;
		return {p: x, q: y, H: z};
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
		case 1:
			return iota;
		case 0:
			return iota;
		default:
			return $author$project$Logic$App$Types$Garbage(2);
	}
};
var $ianmackenzie$elm_units$Quantity$Quantity = $elm$core$Basics$identity;
var $ianmackenzie$elm_units$Quantity$zero = 0;
var $ianmackenzie$elm_geometry$Vector3d$length = function (_v0) {
	var v = _v0;
	var largestComponent = A2(
		$elm$core$Basics$max,
		$elm$core$Basics$abs(v.p),
		A2(
			$elm$core$Basics$max,
			$elm$core$Basics$abs(v.q),
			$elm$core$Basics$abs(v.H)));
	if (!largestComponent) {
		return $ianmackenzie$elm_units$Quantity$zero;
	} else {
		var scaledZ = v.H / largestComponent;
		var scaledY = v.q / largestComponent;
		var scaledX = v.p / largestComponent;
		var scaledLength = $elm$core$Basics$sqrt(((scaledX * scaledX) + (scaledY * scaledY)) + (scaledZ * scaledZ));
		return scaledLength * largestComponent;
	}
};
var $ianmackenzie$elm_units$Length$meters = function (numMeters) {
	return numMeters;
};
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $ianmackenzie$elm_units$Quantity$unwrap = function (_v0) {
	var value = _v0;
	return value;
};
var $author$project$Logic$App$Patterns$Math$absLen = function (stack) {
	var action = function (iota) {
		switch (iota.$) {
			case 0:
				var number = iota.a;
				return A2(
					$elm$core$Array$repeat,
					1,
					$author$project$Logic$App$Types$Number(
						$elm$core$Basics$abs(number)));
			case 1:
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
					$author$project$Logic$App$Types$Garbage(12));
		}
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
};
var $author$project$Settings$Theme$accent1 = '#BAC5E2';
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Logic$App$Patterns$OperatorUtils$mapNothingToMissingIota = function (maybeIota) {
	if (maybeIota.$ === 1) {
		return $author$project$Logic$App$Types$Garbage(1);
	} else {
		var iota = maybeIota.a;
		return iota;
	}
};
var $author$project$Logic$App$Patterns$OperatorUtils$moveNothingsToFront = function (list) {
	var comparison = F2(
		function (a, b) {
			var checkNothing = function (x) {
				if (x.$ === 1) {
					return 1;
				} else {
					return 2;
				}
			};
			var _v0 = A2(
				$elm$core$Basics$compare,
				checkNothing(a),
				checkNothing(b));
			switch (_v0) {
				case 0:
					return 0;
				case 1:
					return 1;
				default:
					return 2;
			}
		});
	return A2($elm$core$List$sortWith, comparison, list);
};
var $author$project$Logic$App$Patterns$OperatorUtils$action2Inputs = F4(
	function (stack, inputGetter1, inputGetter2, action) {
		var newStack = A3(
			$elm$core$Array$slice,
			2,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota2 = A2($elm$core$Array$get, 0, stack);
		var maybeIota1 = A2($elm$core$Array$get, 1, stack);
		if (_Utils_eq(maybeIota1, $elm$core$Maybe$Nothing) || _Utils_eq(maybeIota2, $elm$core$Maybe$Nothing)) {
			return A2(
				$elm$core$Array$append,
				A2(
					$elm$core$Array$map,
					$author$project$Logic$App$Patterns$OperatorUtils$mapNothingToMissingIota,
					$elm$core$Array$fromList(
						$author$project$Logic$App$Patterns$OperatorUtils$moveNothingsToFront(
							_List_fromArray(
								[maybeIota1, maybeIota2])))),
				newStack);
		} else {
			var _v0 = _Utils_Tuple2(
				A2($elm$core$Maybe$map, inputGetter1, maybeIota1),
				A2($elm$core$Maybe$map, inputGetter2, maybeIota2));
			if ((!_v0.a.$) && (!_v0.b.$)) {
				var iota1 = _v0.a.a;
				var iota2 = _v0.b.a;
				return (_Utils_eq(
					iota1,
					$author$project$Logic$App$Types$Garbage(2)) || _Utils_eq(
					iota2,
					$author$project$Logic$App$Types$Garbage(2))) ? A2(
					$elm$core$Array$append,
					$elm$core$Array$fromList(
						_List_fromArray(
							[iota1, iota2])),
					newStack) : A2(
					$elm$core$Array$append,
					A2(action, iota1, iota2),
					newStack);
			} else {
				return A2(
					$author$project$Logic$App$Utils$Utils$unshift,
					$author$project$Logic$App$Types$Garbage(12),
					newStack);
			}
		}
	});
var $author$project$Logic$App$Patterns$Math$add = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			_v0$4:
			while (true) {
				switch (_v0.a.$) {
					case 0:
						switch (_v0.b.$) {
							case 0:
								var number1 = _v0.a.a;
								var number2 = _v0.b.a;
								return A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Number(number1 + number2));
							case 1:
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
					case 1:
						switch (_v0.b.$) {
							case 0:
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
							case 1:
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
				$author$project$Logic$App$Types$Garbage(12));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
};
var $ianmackenzie$elm_units$Quantity$lessThanOrEqualTo = F2(
	function (_v0, _v1) {
		var y = _v0;
		var x = _v1;
		return _Utils_cmp(x, y) < 1;
	});
var $ianmackenzie$elm_geometry$Vector3d$minus = F2(
	function (_v0, _v1) {
		var v2 = _v0;
		var v1 = _v1;
		return {p: v1.p - v2.p, q: v1.q - v2.q, H: v1.H - v2.H};
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
				case 5:
					if (_v0.b.$ === 5) {
						var _v1 = _v0.a;
						var pattern1 = _v1.a;
						var _v2 = _v0.b;
						var pattern2 = _v2.a;
						return _Utils_eq(pattern1.cW, pattern2.cW);
					} else {
						break _v0$5;
					}
				case 4:
					if (_v0.b.$ === 4) {
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
				case 1:
					if (_v0.b.$ === 1) {
						var vector1Tuple = _v0.a.a;
						var vector2Tuple = _v0.b.a;
						var vector2 = A2($ianmackenzie$elm_geometry$Vector3d$fromTuple, $ianmackenzie$elm_units$Length$meters, vector2Tuple);
						var vector1 = A2($ianmackenzie$elm_geometry$Vector3d$fromTuple, $ianmackenzie$elm_units$Length$meters, vector1Tuple);
						return A3($ianmackenzie$elm_geometry$Vector3d$equalWithin, tolerance, vector1, vector2);
					} else {
						break _v0$5;
					}
				case 0:
					if (!_v0.b.$) {
						var number1 = _v0.a.a;
						var number2 = _v0.b.a;
						return _Utils_cmp(
							$elm$core$Basics$abs(number1 - number2),
							tolerance) < 0;
					} else {
						break _v0$5;
					}
				case 3:
					if (_v0.b.$ === 3) {
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
		case 0:
			var number = iota.a;
			return _Utils_eq(
				$elm$core$Basics$round(number),
				number) ? iota : $author$project$Logic$App$Types$Garbage(2);
		case 4:
			return iota;
		default:
			return $author$project$Logic$App$Types$Garbage(2);
	}
};
var $author$project$Logic$App$Patterns$Math$andBit = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			_v0$2:
			while (true) {
				switch (_v0.a.$) {
					case 0:
						if (!_v0.b.$) {
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
					case 4:
						if (_v0.b.$ === 4) {
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
				$author$project$Logic$App$Types$Garbage(12));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, action);
};
var $author$project$Logic$App$Patterns$OperatorUtils$getBoolean = function (iota) {
	if (iota.$ === 2) {
		return iota;
	} else {
		return $author$project$Logic$App$Types$Garbage(2);
	}
};
var $author$project$Logic$App$Patterns$Math$andBool = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			if ((_v0.a.$ === 2) && (_v0.b.$ === 2)) {
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
					$author$project$Logic$App$Types$Garbage(12));
			}
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, action);
};
var $author$project$Logic$App$Patterns$OperatorUtils$getAny = function (iota) {
	return iota;
};
var $author$project$Logic$App$Patterns$OperatorUtils$getIotaList = function (iota) {
	if (iota.$ === 4) {
		return iota;
	} else {
		return $author$project$Logic$App$Types$Garbage(2);
	}
};
var $author$project$Logic$App$Patterns$Lists$append = function (stack) {
	var action = F2(
		function (listIota, iota) {
			if (listIota.$ === 4) {
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
					$author$project$Logic$App$Types$Garbage(12));
			}
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $elm$core$Basics$acos = _Basics_acos;
var $author$project$Logic$App$Patterns$OperatorUtils$getNumber = function (iota) {
	if (!iota.$) {
		return iota;
	} else {
		return $author$project$Logic$App$Types$Garbage(2);
	}
};
var $author$project$Logic$App$Patterns$Math$arccos = function (stack) {
	var action = function (iota) {
		if (!iota.$) {
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
				$author$project$Logic$App$Types$Garbage(12));
		}
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $elm$core$Basics$asin = _Basics_asin;
var $author$project$Logic$App$Patterns$Math$arcsin = function (stack) {
	var action = function (iota) {
		if (!iota.$) {
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
				$author$project$Logic$App$Types$Garbage(12));
		}
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $elm$core$Basics$atan = _Basics_atan;
var $author$project$Logic$App$Patterns$Math$arctan = function (stack) {
	var action = function (iota) {
		if (!iota.$) {
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
				$author$project$Logic$App$Types$Garbage(12));
		}
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $author$project$Logic$App$Patterns$Math$boolCoerce = function (stack) {
	var action = function (iota) {
		switch (iota.$) {
			case 0:
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
			case 6:
				return A2(
					$elm$core$Array$repeat,
					1,
					$author$project$Logic$App$Types$Boolean(false));
			case 4:
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
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $author$project$Logic$App$Patterns$Math$ceilAction = function (stack) {
	var action = function (iota) {
		if (!iota.$) {
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
				$author$project$Logic$App$Types$Garbage(12));
		}
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $author$project$Logic$App$Patterns$OperatorUtils$actionNoInput = F2(
	function (stack, action) {
		return A2($elm$core$Array$append, action, stack);
	});
var $author$project$Logic$App$Patterns$Circles$circleBoundsMax = function (stack) {
	var action = A2(
		$elm$core$Array$repeat,
		1,
		$author$project$Logic$App$Types$Vector(
			_Utils_Tuple3(0.0, 0.0, 0.0)));
	return A2($author$project$Logic$App$Patterns$OperatorUtils$actionNoInput, stack, action);
};
var $author$project$Logic$App$Patterns$Circles$circleBoundsMin = function (stack) {
	var action = A2(
		$elm$core$Array$repeat,
		1,
		$author$project$Logic$App$Types$Vector(
			_Utils_Tuple3(0.0, 0.0, 0.0)));
	return A2($author$project$Logic$App$Patterns$OperatorUtils$actionNoInput, stack, action);
};
var $author$project$Logic$App$Patterns$Circles$circleImpetusDirection = function (stack) {
	var action = A2(
		$elm$core$Array$repeat,
		1,
		$author$project$Logic$App$Types$Vector(
			_Utils_Tuple3(1.0, 0.0, 0.0)));
	return A2($author$project$Logic$App$Patterns$OperatorUtils$actionNoInput, stack, action);
};
var $elm$core$Basics$cos = _Basics_cos;
var $author$project$Logic$App$Patterns$OperatorUtils$getVector = function (iota) {
	if (iota.$ === 1) {
		return iota;
	} else {
		return $author$project$Logic$App$Types$Garbage(2);
	}
};
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$sin = _Basics_sin;
var $author$project$Logic$App$Patterns$Math$coerceAxial = function (stack) {
	var action = function (iota) {
		if (iota.$ === 1) {
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
				$author$project$Logic$App$Types$Garbage(12));
		}
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getVector, action);
};
var $author$project$Logic$App$Patterns$OperatorUtils$action3Inputs = F5(
	function (stack, inputGetter1, inputGetter2, inputGetter3, action) {
		var newStack = A3(
			$elm$core$Array$slice,
			3,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota3 = A2($elm$core$Array$get, 0, stack);
		var maybeIota2 = A2($elm$core$Array$get, 1, stack);
		var maybeIota1 = A2($elm$core$Array$get, 2, stack);
		if (_Utils_eq(maybeIota1, $elm$core$Maybe$Nothing) || (_Utils_eq(maybeIota2, $elm$core$Maybe$Nothing) || _Utils_eq(maybeIota3, $elm$core$Maybe$Nothing))) {
			return A2(
				$elm$core$Array$append,
				A2(
					$elm$core$Array$map,
					$author$project$Logic$App$Patterns$OperatorUtils$mapNothingToMissingIota,
					$elm$core$Array$fromList(
						$author$project$Logic$App$Patterns$OperatorUtils$moveNothingsToFront(
							_List_fromArray(
								[maybeIota1, maybeIota2, maybeIota3])))),
				newStack);
		} else {
			var _v0 = _Utils_Tuple3(
				A2($elm$core$Maybe$map, inputGetter1, maybeIota1),
				A2($elm$core$Maybe$map, inputGetter2, maybeIota2),
				A2($elm$core$Maybe$map, inputGetter3, maybeIota3));
			if (((!_v0.a.$) && (!_v0.b.$)) && (!_v0.c.$)) {
				var iota1 = _v0.a.a;
				var iota2 = _v0.b.a;
				var iota3 = _v0.c.a;
				return (_Utils_eq(
					iota1,
					$author$project$Logic$App$Types$Garbage(2)) || (_Utils_eq(
					iota2,
					$author$project$Logic$App$Types$Garbage(2)) || _Utils_eq(
					iota3,
					$author$project$Logic$App$Types$Garbage(2)))) ? A2(
					$elm$core$Array$append,
					$elm$core$Array$fromList(
						_List_fromArray(
							[iota1, iota2, iota3])),
					newStack) : A2(
					$elm$core$Array$append,
					A3(action, iota1, iota2, iota3),
					newStack);
			} else {
				return A2(
					$author$project$Logic$App$Utils$Utils$unshift,
					$author$project$Logic$App$Types$Garbage(12),
					newStack);
			}
		}
	});
var $author$project$Logic$App$Patterns$Math$constructVector = function (stack) {
	var action = F3(
		function (iota1, iota2, iota3) {
			var _v0 = _Utils_Tuple3(iota1, iota2, iota3);
			if (((!_v0.a.$) && (!_v0.b.$)) && (!_v0.c.$)) {
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
					$author$project$Logic$App$Types$Garbage(12));
			}
		});
	return A5($author$project$Logic$App$Patterns$OperatorUtils$action3Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $author$project$Logic$App$Patterns$Math$cosine = function (stack) {
	var action = function (iota) {
		if (!iota.$) {
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
				$author$project$Logic$App$Types$Garbage(12));
		}
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $author$project$Logic$App$Patterns$Math$deconstructVector = function (stack) {
	var action = function (iota) {
		if (iota.$ === 1) {
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
				$author$project$Logic$App$Types$Garbage(12));
		}
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getVector, action);
};
var $ianmackenzie$elm_geometry$Vector3d$cross = F2(
	function (_v0, _v1) {
		var v2 = _v0;
		var v1 = _v1;
		return {p: (v1.q * v2.H) - (v1.H * v2.q), q: (v1.H * v2.p) - (v1.p * v2.H), H: (v1.p * v2.q) - (v1.q * v2.p)};
	});
var $ianmackenzie$elm_units$Area$inSquareMeters = function (_v0) {
	var numSquareMeters = _v0;
	return numSquareMeters;
};
var $ianmackenzie$elm_geometry$Vector3d$xComponent = function (_v0) {
	var v = _v0;
	return v.p;
};
var $ianmackenzie$elm_geometry$Vector3d$yComponent = function (_v0) {
	var v = _v0;
	return v.q;
};
var $ianmackenzie$elm_geometry$Vector3d$zComponent = function (_v0) {
	var v = _v0;
	return v.H;
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
var $author$project$Logic$App$Patterns$Math$divCross = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			_v0$4:
			while (true) {
				switch (_v0.a.$) {
					case 0:
						switch (_v0.b.$) {
							case 0:
								var number1 = _v0.a.a;
								var number2 = _v0.b.a;
								return A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Number(number1 / number2));
							case 1:
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
					case 1:
						switch (_v0.b.$) {
							case 0:
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
							case 1:
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
				$author$project$Logic$App$Types$Garbage(12));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
};
var $author$project$Logic$App$Patterns$Stack$dup2 = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			return $elm$core$Array$fromList(
				_List_fromArray(
					[iota2, iota1, iota2, iota1]));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $author$project$Logic$App$Patterns$Stack$duplicate = function (stack) {
	var action = function (iota) {
		return $elm$core$Array$fromList(
			_List_fromArray(
				[iota, iota]));
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $author$project$Logic$App$Patterns$OperatorUtils$getInteger = function (iota) {
	if (!iota.$) {
		var number = iota.a;
		return _Utils_eq(
			$elm$core$Basics$round(number),
			number) ? iota : $author$project$Logic$App$Types$Garbage(2);
	} else {
		return $author$project$Logic$App$Types$Garbage(2);
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
var $author$project$Logic$App$Patterns$Stack$duplicateN = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			if (!iota2.$) {
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
							$author$project$Logic$App$Types$Garbage(12)
						]));
			}
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getInteger, action);
};
var $elm$core$Basics$e = _Basics_e;
var $author$project$Logic$App$Patterns$OperatorUtils$getEntity = function (iota) {
	if (iota.$ === 3) {
		return iota;
	} else {
		return $author$project$Logic$App$Types$Garbage(2);
	}
};
var $author$project$Logic$App$Patterns$Misc$entityPos = function (stack) {
	var action = function (_v0) {
		return A2(
			$elm$core$Array$repeat,
			1,
			$author$project$Logic$App$Types$Vector(
				_Utils_Tuple3(0.0, 0.0, 0.0)));
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, action);
};
var $author$project$Logic$App$Patterns$Math$equalTo = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			return A2(
				$elm$core$Array$repeat,
				1,
				$author$project$Logic$App$Types$Boolean(
					A2($author$project$Logic$App$Patterns$OperatorUtils$checkEquality, iota1, iota2)));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$getPatternOrPatternList = function (iota) {
	switch (iota.$) {
		case 5:
			return iota;
		case 4:
			var list = iota.a;
			return A2(
				$elm$core$List$all,
				function (i) {
					if (i.$ === 5) {
						return true;
					} else {
						return false;
					}
				},
				$elm$core$Array$toList(list)) ? iota : $author$project$Logic$App$Types$Garbage(2);
		default:
			return $author$project$Logic$App$Types$Garbage(2);
	}
};
var $author$project$Logic$App$Types$InvalidPattern = 0;
var $author$project$Settings$Theme$accent3 = '#e0b8b8';
var $author$project$Logic$App$Patterns$OperatorUtils$makeConstant = F2(
	function (iota, stack) {
		return A2($author$project$Logic$App$Utils$Utils$unshift, iota, stack);
	});
var $author$project$Logic$App$Patterns$PatternRegistry$unknownPattern = {
	a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
		$author$project$Logic$App$Types$Garbage(0)),
	S: $author$project$Settings$Theme$accent3,
	cb: 'Unknown Pattern',
	dv: '',
	cW: ''
};
var $author$project$Logic$App$Patterns$PatternRegistry$eval = function (stack) {
	var newStack = A3(
		$elm$core$Array$slice,
		1,
		$elm$core$Array$length(stack),
		stack);
	var maybeIota = A2($elm$core$Array$get, 0, stack);
	if (maybeIota.$ === 1) {
		return A2(
			$author$project$Logic$App$Utils$Utils$unshift,
			$author$project$Logic$App$Types$Garbage(1),
			newStack);
	} else {
		var iota = maybeIota.a;
		var _v1 = $author$project$Logic$App$Patterns$OperatorUtils$getPatternOrPatternList(iota);
		if ((_v1.$ === 7) && (_v1.a === 2)) {
			var _v2 = _v1.a;
			return A2(
				$author$project$Logic$App$Utils$Utils$unshift,
				$author$project$Logic$App$Types$Garbage(2),
				newStack);
		} else {
			switch (iota.$) {
				case 4:
					var list = iota.a;
					return A3(
						$author$project$Logic$App$Stack$Stack$applyPatternsToStack,
						newStack,
						$elm$core$List$reverse(
							$elm$core$Array$toList(
								A2(
									$elm$core$Array$map,
									function (i) {
										if (i.$ === 5) {
											var pattern = i.a;
											return pattern;
										} else {
											return $author$project$Logic$App$Patterns$PatternRegistry$unknownPattern;
										}
									},
									list))),
						false);
				case 5:
					var pattern = iota.a;
					return A3(
						$author$project$Logic$App$Stack$Stack$applyPatternsToStack,
						newStack,
						_List_fromArray(
							[pattern]),
						false);
				default:
					return $elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$Logic$App$Types$Garbage(12)
							]));
			}
		}
	}
};
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
var $author$project$Logic$App$Patterns$Stack$fisherman = function (stack) {
	var newStack = A3(
		$elm$core$Array$slice,
		1,
		$elm$core$Array$length(stack),
		stack);
	var maybeIota = A2($elm$core$Array$get, 0, stack);
	if (maybeIota.$ === 1) {
		return A2(
			$elm$core$Array$append,
			$elm$core$Array$fromList(
				_List_fromArray(
					[
						$author$project$Logic$App$Types$Garbage(1),
						$author$project$Logic$App$Types$Garbage(1)
					])),
			newStack);
	} else {
		var iota = maybeIota.a;
		var _v1 = $author$project$Logic$App$Patterns$OperatorUtils$getInteger(iota);
		if ((_v1.$ === 7) && (_v1.a === 2)) {
			var _v2 = _v1.a;
			return A2(
				$author$project$Logic$App$Utils$Utils$unshift,
				$author$project$Logic$App$Types$Garbage(2),
				newStack);
		} else {
			if (!iota.$) {
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
				if (maybeCaughtIota.$ === 1) {
					return A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage(1),
						stack);
				} else {
					var caughtIota = maybeCaughtIota.a;
					return A2($author$project$Logic$App$Utils$Utils$unshift, caughtIota, newNewStack);
				}
			} else {
				return $elm$core$Array$fromList(
					_List_fromArray(
						[
							$author$project$Logic$App$Types$Garbage(12)
						]));
			}
		}
	}
};
var $author$project$Logic$App$Patterns$Stack$fishermanCopy = function (stack) {
	var newStack = A3(
		$elm$core$Array$slice,
		1,
		$elm$core$Array$length(stack),
		stack);
	var maybeIota = A2($elm$core$Array$get, 0, stack);
	if (maybeIota.$ === 1) {
		return A2(
			$elm$core$Array$append,
			$elm$core$Array$fromList(
				_List_fromArray(
					[
						$author$project$Logic$App$Types$Garbage(1),
						$author$project$Logic$App$Types$Garbage(1)
					])),
			newStack);
	} else {
		var iota = maybeIota.a;
		var _v1 = $author$project$Logic$App$Patterns$OperatorUtils$getInteger(iota);
		if ((_v1.$ === 7) && (_v1.a === 2)) {
			var _v2 = _v1.a;
			return A2(
				$author$project$Logic$App$Utils$Utils$unshift,
				$author$project$Logic$App$Types$Garbage(2),
				newStack);
		} else {
			if (!iota.$) {
				var number = iota.a;
				var maybeCaughtIota = A2(
					$elm$core$Array$get,
					$elm$core$Basics$round(number),
					newStack);
				if (maybeCaughtIota.$ === 1) {
					return A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage(1),
						stack);
				} else {
					var caughtIota = maybeCaughtIota.a;
					return A2($author$project$Logic$App$Utils$Utils$unshift, caughtIota, newStack);
				}
			} else {
				return $elm$core$Array$fromList(
					_List_fromArray(
						[
							$author$project$Logic$App$Types$Garbage(12)
						]));
			}
		}
	}
};
var $author$project$Logic$App$Patterns$Math$floorAction = function (stack) {
	var action = function (iota) {
		if (!iota.$) {
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
				$author$project$Logic$App$Types$Garbage(12));
		}
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $author$project$Logic$App$Types$Entity = function (a) {
	return {$: 3, a: a};
};
var $author$project$Logic$App$Types$Player = 1;
var $author$project$Logic$App$Patterns$Selectors$getCaster = function (stack) {
	var action = A2(
		$elm$core$Array$repeat,
		1,
		$author$project$Logic$App$Types$Entity(1));
	return A2($author$project$Logic$App$Patterns$OperatorUtils$actionNoInput, stack, action);
};
var $author$project$Logic$App$Patterns$Misc$getEntityHeight = function (stack) {
	var action = function (_v0) {
		return A2(
			$elm$core$Array$repeat,
			1,
			$author$project$Logic$App$Types$Number(0));
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, action);
};
var $author$project$Logic$App$Patterns$Misc$getEntityLook = function (stack) {
	var action = function (_v0) {
		return A2(
			$elm$core$Array$repeat,
			1,
			$author$project$Logic$App$Types$Vector(
				_Utils_Tuple3(0.0, 0.0, 0.0)));
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, action);
};
var $author$project$Logic$App$Patterns$Misc$getEntityVelocity = function (stack) {
	var action = function (_v0) {
		return A2(
			$elm$core$Array$repeat,
			1,
			$author$project$Logic$App$Types$Vector(
				_Utils_Tuple3(0.0, 0.0, 0.0)));
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, action);
};
var $author$project$Logic$App$Patterns$Math$greaterThan = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			if ((!_v0.a.$) && (!_v0.b.$)) {
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
					$author$project$Logic$App$Types$Garbage(12));
			}
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $author$project$Logic$App$Patterns$Math$greaterThanOrEqualTo = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			if ((!_v0.a.$) && (!_v0.b.$)) {
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
					$author$project$Logic$App$Types$Garbage(12));
			}
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $author$project$Logic$App$Patterns$Math$ifBool = function (stack) {
	var action = F3(
		function (iota1, iota2, iota3) {
			if (iota1.$ === 2) {
				var bool = iota1.a;
				return bool ? A2($elm$core$Array$repeat, 1, iota2) : A2($elm$core$Array$repeat, 1, iota3);
			} else {
				return A2(
					$elm$core$Array$repeat,
					1,
					$author$project$Logic$App$Types$Garbage(12));
			}
		});
	return A5($author$project$Logic$App$Patterns$OperatorUtils$action3Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $author$project$Logic$App$Patterns$Math$invertBool = function (stack) {
	var action = function (iota) {
		if (iota.$ === 2) {
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
				$author$project$Logic$App$Types$Garbage(12));
		}
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, action);
};
var $author$project$Logic$App$Patterns$Math$lessThan = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			if ((!_v0.a.$) && (!_v0.b.$)) {
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
					$author$project$Logic$App$Types$Garbage(12));
			}
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $author$project$Logic$App$Patterns$Math$lessThanOrEqualTo = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			if ((!_v0.a.$) && (!_v0.b.$)) {
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
					$author$project$Logic$App$Types$Garbage(12));
			}
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $author$project$Logic$App$Patterns$Math$logarithm = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			if ((!_v0.a.$) && (!_v0.b.$)) {
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
					$author$project$Logic$App$Types$Garbage(12));
			}
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $elm$core$Basics$truncate = _Basics_truncate;
var $ianmackenzie$elm_units$Quantity$fractionalRemainderBy = F2(
	function (_v0, _v1) {
		var modulus = _v0;
		var value = _v1;
		return value - (modulus * ((value / modulus) | 0));
	});
var $author$project$Logic$App$Patterns$Math$modulo = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			if ((!_v0.a.$) && (!_v0.b.$)) {
				var number1 = _v0.a.a;
				var number2 = _v0.b.a;
				return A2(
					$elm$core$Array$repeat,
					1,
					$author$project$Logic$App$Types$Number(
						$ianmackenzie$elm_units$Quantity$unwrap(
							A2($ianmackenzie$elm_units$Quantity$fractionalRemainderBy, number2, number1))));
			} else {
				return A2(
					$elm$core$Array$repeat,
					1,
					$author$project$Logic$App$Types$Garbage(12));
			}
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $ianmackenzie$elm_geometry$Vector3d$dot = F2(
	function (_v0, _v1) {
		var v2 = _v0;
		var v1 = _v1;
		return ((v1.p * v2.p) + (v1.q * v2.q)) + (v1.H * v2.H);
	});
var $author$project$Logic$App$Patterns$Math$mulDot = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			_v0$4:
			while (true) {
				switch (_v0.a.$) {
					case 0:
						switch (_v0.b.$) {
							case 0:
								var number1 = _v0.a.a;
								var number2 = _v0.b.a;
								return A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Number(number1 * number2));
							case 1:
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
					case 1:
						switch (_v0.b.$) {
							case 0:
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
							case 1:
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
				$author$project$Logic$App$Types$Garbage(12));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
};
var $author$project$Logic$App$Patterns$PatternRegistry$noAction = function (stack) {
	return stack;
};
var $author$project$Logic$App$Patterns$Math$notEqualTo = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			return A2(
				$elm$core$Array$repeat,
				1,
				$author$project$Logic$App$Types$Boolean(
					!A2($author$project$Logic$App$Patterns$OperatorUtils$checkEquality, iota1, iota2)));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $elm$core$Bitwise$or = _Bitwise_or;
var $author$project$Logic$App$Patterns$Math$orBit = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			_v0$2:
			while (true) {
				switch (_v0.a.$) {
					case 0:
						if (!_v0.b.$) {
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
					case 4:
						if (_v0.b.$ === 4) {
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
				$author$project$Logic$App$Types$Garbage(12));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, action);
};
var $author$project$Logic$App$Patterns$Math$orBool = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			if ((_v0.a.$ === 2) && (_v0.b.$ === 2)) {
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
					$author$project$Logic$App$Types$Garbage(12));
			}
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, action);
};
var $author$project$Logic$App$Patterns$Stack$over = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			return $elm$core$Array$fromList(
				_List_fromArray(
					[iota1, iota2, iota1]));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $author$project$Logic$App$Patterns$Math$powProj = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			_v0$4:
			while (true) {
				switch (_v0.a.$) {
					case 0:
						switch (_v0.b.$) {
							case 0:
								var number1 = _v0.a.a;
								var number2 = _v0.b.a;
								return A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Number(
										A2($elm$core$Basics$pow, number1, number2)));
							case 1:
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
					case 1:
						switch (_v0.b.$) {
							case 0:
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
							case 1:
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
				$author$project$Logic$App$Types$Garbage(12));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
};
var $author$project$Logic$App$Patterns$Misc$raycast = function (stack) {
	var action = F2(
		function (_v0, _v1) {
			return A2(
				$elm$core$Array$repeat,
				1,
				$author$project$Logic$App$Types$Vector(
					_Utils_Tuple3(0.0, 0.0, 0.0)));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getVector, $author$project$Logic$App$Patterns$OperatorUtils$getVector, action);
};
var $author$project$Logic$App$Patterns$Misc$raycastAxis = function (stack) {
	var action = F2(
		function (_v0, _v1) {
			return A2(
				$elm$core$Array$repeat,
				1,
				$author$project$Logic$App$Types$Vector(
					_Utils_Tuple3(0.0, 0.0, 0.0)));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getVector, $author$project$Logic$App$Patterns$OperatorUtils$getVector, action);
};
var $author$project$Logic$App$Types$Chicken = 2;
var $author$project$Logic$App$Patterns$Misc$raycastEntity = function (stack) {
	var action = F2(
		function (_v0, _v1) {
			return A2(
				$elm$core$Array$repeat,
				1,
				$author$project$Logic$App$Types$Entity(2));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getVector, $author$project$Logic$App$Patterns$OperatorUtils$getVector, action);
};
var $author$project$Logic$App$Patterns$Stack$rotate = function (stack) {
	var action = F3(
		function (iota1, iota2, iota3) {
			return $elm$core$Array$fromList(
				_List_fromArray(
					[iota1, iota3, iota2]));
		});
	return A5($author$project$Logic$App$Patterns$OperatorUtils$action3Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $author$project$Logic$App$Patterns$Stack$rotateReverse = function (stack) {
	var action = F3(
		function (iota1, iota2, iota3) {
			return $elm$core$Array$fromList(
				_List_fromArray(
					[iota2, iota1, iota3]));
		});
	return A5($author$project$Logic$App$Patterns$OperatorUtils$action3Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $author$project$Logic$App$Patterns$Math$sine = function (stack) {
	var action = function (iota) {
		if (!iota.$) {
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
				$author$project$Logic$App$Types$Garbage(12));
		}
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $author$project$Logic$App$Patterns$Lists$singleton = function (stack) {
	var action = function (iota) {
		return A2(
			$elm$core$Array$repeat,
			1,
			$author$project$Logic$App$Types$IotaList(
				A2($elm$core$Array$repeat, 1, iota)));
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $author$project$Logic$App$Patterns$Stack$stackLength = function (stack) {
	return A2(
		$author$project$Logic$App$Utils$Utils$unshift,
		$author$project$Logic$App$Types$Number(
			$elm$core$Array$length(stack)),
		stack);
};
var $author$project$Logic$App$Patterns$Math$subtract = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			_v0$4:
			while (true) {
				switch (_v0.a.$) {
					case 0:
						switch (_v0.b.$) {
							case 0:
								var number1 = _v0.a.a;
								var number2 = _v0.b.a;
								return A2(
									$elm$core$Array$repeat,
									1,
									$author$project$Logic$App$Types$Number(number1 - number2));
							case 1:
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
					case 1:
						switch (_v0.b.$) {
							case 0:
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
							case 1:
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
				$author$project$Logic$App$Types$Garbage(12));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
};
var $author$project$Logic$App$Patterns$Stack$swap = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			return $elm$core$Array$fromList(
				_List_fromArray(
					[iota1, iota2]));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $elm$core$Basics$tan = _Basics_tan;
var $author$project$Logic$App$Patterns$Math$tangent = function (stack) {
	var action = function (iota) {
		if (!iota.$) {
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
				$author$project$Logic$App$Types$Garbage(12));
		}
	};
	return A3($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
};
var $author$project$Logic$App$Patterns$Stack$tuck = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			return $elm$core$Array$fromList(
				_List_fromArray(
					[iota2, iota1, iota2]));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getAny, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $author$project$Logic$App$Patterns$Math$xorBit = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			_v0$2:
			while (true) {
				switch (_v0.a.$) {
					case 0:
						if (!_v0.b.$) {
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
					case 4:
						if (_v0.b.$ === 4) {
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
				$author$project$Logic$App$Types$Garbage(12));
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, action);
};
var $elm$core$Basics$xor = _Basics_xor;
var $author$project$Logic$App$Patterns$Math$xorBool = function (stack) {
	var action = F2(
		function (iota1, iota2) {
			var _v0 = _Utils_Tuple2(iota1, iota2);
			if ((_v0.a.$ === 2) && (_v0.b.$ === 2)) {
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
					$author$project$Logic$App$Types$Garbage(12));
			}
		});
	return A4($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, action);
};
var $author$project$Logic$App$Patterns$PatternRegistry$patternRegistry = _List_fromArray(
	[
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'interop/gravity/get', cW: 'wawawddew'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'interop/gravity/set', cW: 'wdwdwaaqw'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'interop/pehkui/get', cW: 'aawawwawwa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'interop/pehkui/set', cW: 'ddwdwwdwwd'},
		{a: $author$project$Logic$App$Patterns$Selectors$getCaster, S: $author$project$Settings$Theme$accent1, cb: 'Mind\'s Reflection', dv: 'get_caster', cW: 'qaq'},
		{a: $author$project$Logic$App$Patterns$Misc$entityPos, S: $author$project$Settings$Theme$accent1, cb: 'Compass\' Purification', dv: 'entity_pos/eye', cW: 'aa'},
		{a: $author$project$Logic$App$Patterns$Misc$entityPos, S: $author$project$Settings$Theme$accent1, cb: 'Compass\' Purification II', dv: 'entity_pos/foot', cW: 'dd'},
		{a: $author$project$Logic$App$Patterns$Misc$getEntityLook, S: $author$project$Settings$Theme$accent1, cb: 'Alidade\'s Purification', dv: 'get_entity_look', cW: 'wa'},
		{a: $author$project$Logic$App$Patterns$Misc$getEntityHeight, S: $author$project$Settings$Theme$accent1, cb: 'Stadiometer\'s Purification', dv: 'get_entity_height', cW: 'awq'},
		{a: $author$project$Logic$App$Patterns$Misc$getEntityVelocity, S: $author$project$Settings$Theme$accent1, cb: 'Pace Purification', dv: 'get_entity_velocity', cW: 'wq'},
		{a: $author$project$Logic$App$Patterns$Misc$raycast, S: $author$project$Settings$Theme$accent1, cb: 'Archer\'s Distillation', dv: 'raycast', cW: 'wqaawdd'},
		{a: $author$project$Logic$App$Patterns$Misc$raycastAxis, S: $author$project$Settings$Theme$accent1, cb: 'Architect\'s Distillation', dv: 'raycast/axis', cW: 'weddwaa'},
		{a: $author$project$Logic$App$Patterns$Misc$raycastEntity, S: $author$project$Settings$Theme$accent1, cb: 'Scout\'s Distillation', dv: 'raycast/entity', cW: 'weaqa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: 'Waystone Reflection', dv: 'circle/impetus_pos', cW: 'eaqwqae'},
		{a: $author$project$Logic$App$Patterns$Circles$circleImpetusDirection, S: $author$project$Settings$Theme$accent1, cb: 'Lodestone Reflection', dv: 'circle/impetus_dir', cW: 'eaqwqaewede'},
		{a: $author$project$Logic$App$Patterns$Circles$circleBoundsMin, S: $author$project$Settings$Theme$accent1, cb: 'Lesser Fold Reflection', dv: 'circle/bounds/min', cW: 'eaqwqaewdd'},
		{a: $author$project$Logic$App$Patterns$Circles$circleBoundsMax, S: $author$project$Settings$Theme$accent1, cb: 'Greater Fold Reflection', dv: 'circle/bounds/max', cW: 'aqwqawaaqa'},
		{a: $author$project$Logic$App$Patterns$Stack$swap, S: $author$project$Settings$Theme$accent1, cb: 'Jester\'s Gambit', dv: 'swap', cW: 'aawdd'},
		{a: $author$project$Logic$App$Patterns$Stack$rotate, S: $author$project$Settings$Theme$accent1, cb: 'Rotation Gambit', dv: 'rotate', cW: 'aaeaa'},
		{a: $author$project$Logic$App$Patterns$Stack$rotateReverse, S: $author$project$Settings$Theme$accent1, cb: 'Rotation Gambit II', dv: 'rotate_reverse', cW: 'ddqdd'},
		{a: $author$project$Logic$App$Patterns$Stack$duplicate, S: $author$project$Settings$Theme$accent1, cb: 'Gemini Decomposition', dv: 'duplicate', cW: 'aadaa'},
		{a: $author$project$Logic$App$Patterns$Stack$over, S: $author$project$Settings$Theme$accent1, cb: 'Prospector\'s Gambit', dv: 'over', cW: 'aaedd'},
		{a: $author$project$Logic$App$Patterns$Stack$tuck, S: $author$project$Settings$Theme$accent1, cb: 'Undertaker\'s Gambit', dv: 'tuck', cW: 'ddqaa'},
		{a: $author$project$Logic$App$Patterns$Stack$dup2, S: $author$project$Settings$Theme$accent1, cb: 'Dioscuri Gambi', dv: '2dup', cW: 'aadadaaw'},
		{a: $author$project$Logic$App$Patterns$Stack$stackLength, S: $author$project$Settings$Theme$accent1, cb: 'Flock\'s Reflection', dv: 'stack_len', cW: 'qwaeawqaeaqa'},
		{a: $author$project$Logic$App$Patterns$Stack$duplicateN, S: $author$project$Settings$Theme$accent1, cb: 'Gemini Gambit', dv: 'duplicate_n', cW: 'aadaadaa'},
		{a: $author$project$Logic$App$Patterns$Stack$fisherman, S: $author$project$Settings$Theme$accent1, cb: 'Fisherman\'s Gambit', dv: 'fisherman', cW: 'ddad'},
		{a: $author$project$Logic$App$Patterns$Stack$fishermanCopy, S: $author$project$Settings$Theme$accent1, cb: 'Fisherman\'s Gambit II', dv: 'fisherman/copy', cW: 'aada'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'swizzle', cW: 'qaawdde'},
		{a: $author$project$Logic$App$Patterns$Math$add, S: $author$project$Settings$Theme$accent1, cb: 'Additive Distillation', dv: 'add', cW: 'waaw'},
		{a: $author$project$Logic$App$Patterns$Math$subtract, S: $author$project$Settings$Theme$accent1, cb: 'Subtractive Distillation', dv: 'sub', cW: 'wddw'},
		{a: $author$project$Logic$App$Patterns$Math$mulDot, S: $author$project$Settings$Theme$accent1, cb: 'Multiplicative Distillation', dv: 'mul_dot', cW: 'waqaw'},
		{a: $author$project$Logic$App$Patterns$Math$divCross, S: $author$project$Settings$Theme$accent1, cb: 'Division Distillation', dv: 'div_cross', cW: 'wdedw'},
		{a: $author$project$Logic$App$Patterns$Math$absLen, S: $author$project$Settings$Theme$accent1, cb: 'Length Purification', dv: 'abs_len', cW: 'wqaqw'},
		{a: $author$project$Logic$App$Patterns$Math$powProj, S: $author$project$Settings$Theme$accent1, cb: 'Power Distillation', dv: 'pow_proj', cW: 'wedew'},
		{a: $author$project$Logic$App$Patterns$Math$floorAction, S: $author$project$Settings$Theme$accent1, cb: 'Floor Purification', dv: 'floor', cW: 'ewq'},
		{a: $author$project$Logic$App$Patterns$Math$ceilAction, S: $author$project$Settings$Theme$accent1, cb: 'Ceiling Purification', dv: 'ceil', cW: 'qwe'},
		{a: $author$project$Logic$App$Patterns$Math$constructVector, S: $author$project$Settings$Theme$accent1, cb: 'Vector Exaltation', dv: 'construct_vec', cW: 'eqqqqq'},
		{a: $author$project$Logic$App$Patterns$Math$deconstructVector, S: $author$project$Settings$Theme$accent1, cb: 'Vector Disintegration', dv: 'deconstruct_vec', cW: 'qeeeee'},
		{a: $author$project$Logic$App$Patterns$Math$coerceAxial, S: $author$project$Settings$Theme$accent1, cb: 'Axial Purification', dv: 'coerce_axial', cW: 'qqqqqaww'},
		{a: $author$project$Logic$App$Patterns$Math$andBool, S: $author$project$Settings$Theme$accent1, cb: 'Conjunction Distillation', dv: 'and', cW: 'wdw'},
		{a: $author$project$Logic$App$Patterns$Math$orBool, S: $author$project$Settings$Theme$accent1, cb: 'Disjunction Distillation', dv: 'or', cW: 'waw'},
		{a: $author$project$Logic$App$Patterns$Math$xorBool, S: $author$project$Settings$Theme$accent1, cb: 'Exclusion Distillation', dv: 'xor', cW: 'dwa'},
		{a: $author$project$Logic$App$Patterns$Math$greaterThan, S: $author$project$Settings$Theme$accent1, cb: 'Maximus Distillation', dv: 'greater', cW: 'e'},
		{a: $author$project$Logic$App$Patterns$Math$lessThan, S: $author$project$Settings$Theme$accent1, cb: 'Minimus Distillation', dv: 'less', cW: 'q'},
		{a: $author$project$Logic$App$Patterns$Math$greaterThanOrEqualTo, S: $author$project$Settings$Theme$accent1, cb: 'Maximus Distillation II', dv: 'greater_eq', cW: 'ee'},
		{a: $author$project$Logic$App$Patterns$Math$lessThanOrEqualTo, S: $author$project$Settings$Theme$accent1, cb: 'Minimus Distillation II', dv: 'less_eq', cW: 'qq'},
		{a: $author$project$Logic$App$Patterns$Math$equalTo, S: $author$project$Settings$Theme$accent1, cb: 'Equality Distillation', dv: 'equals', cW: 'ad'},
		{a: $author$project$Logic$App$Patterns$Math$notEqualTo, S: $author$project$Settings$Theme$accent1, cb: 'Inequality Distillation', dv: 'not_equals', cW: 'da'},
		{a: $author$project$Logic$App$Patterns$Math$invertBool, S: $author$project$Settings$Theme$accent1, cb: 'Negation Purification', dv: 'not', cW: 'dw'},
		{a: $author$project$Logic$App$Patterns$Math$boolCoerce, S: $author$project$Settings$Theme$accent1, cb: 'Augur\'s Purification', dv: 'bool_coerce', cW: 'aw'},
		{a: $author$project$Logic$App$Patterns$Math$ifBool, S: $author$project$Settings$Theme$accent1, cb: 'Augur\'s Exaltation', dv: 'if', cW: 'awdd'},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Number(0.5)),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Entropy Reflection',
		dv: 'random',
		cW: 'eqqq'
	},
		{a: $author$project$Logic$App$Patterns$Math$sine, S: $author$project$Settings$Theme$accent1, cb: 'Sine Purification', dv: 'sin', cW: 'qqqqqaa'},
		{a: $author$project$Logic$App$Patterns$Math$cosine, S: $author$project$Settings$Theme$accent1, cb: 'Cosine Purification', dv: 'cos', cW: 'qqqqqad'},
		{a: $author$project$Logic$App$Patterns$Math$tangent, S: $author$project$Settings$Theme$accent1, cb: 'Tangent Purification', dv: 'tan', cW: 'wqqqqqadq'},
		{a: $author$project$Logic$App$Patterns$Math$arcsin, S: $author$project$Settings$Theme$accent1, cb: 'Inverse Sine Purification', dv: 'arcsin', cW: 'ddeeeee'},
		{a: $author$project$Logic$App$Patterns$Math$arccos, S: $author$project$Settings$Theme$accent1, cb: 'Inverse Cosine Purification', dv: 'arccos', cW: 'adeeeee'},
		{a: $author$project$Logic$App$Patterns$Math$arctan, S: $author$project$Settings$Theme$accent1, cb: 'Inverse Tangent Purification', dv: 'arctan', cW: 'eadeeeeew'},
		{a: $author$project$Logic$App$Patterns$Math$logarithm, S: $author$project$Settings$Theme$accent1, cb: 'Logarithmic Distillation', dv: 'logarithm', cW: 'eqaqe'},
		{a: $author$project$Logic$App$Patterns$Math$modulo, S: $author$project$Settings$Theme$accent1, cb: 'Modulus Distillation', dv: 'modulo', cW: 'addwaad'},
		{a: $author$project$Logic$App$Patterns$Math$andBit, S: $author$project$Settings$Theme$accent1, cb: 'Intersection Distillation', dv: 'and_bit', cW: 'wdweaqa'},
		{a: $author$project$Logic$App$Patterns$Math$orBit, S: $author$project$Settings$Theme$accent1, cb: 'Unifying Distillation', dv: 'or_bit', cW: 'waweaqa'},
		{a: $author$project$Logic$App$Patterns$Math$xorBit, S: $author$project$Settings$Theme$accent1, cb: 'Exclusionary Distillation', dv: 'xor_bit', cW: 'dwaeaqa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'not_bit', cW: 'dweaqa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'to_set', cW: 'aweaqa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: 'Reveal', dv: 'print', cW: 'de'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'explode', cW: 'aawaawaa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'explode/fire', cW: 'ddwddwdd'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'add_motion', cW: 'awqqqwaqw'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'blink', cW: 'awqqqwaq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'break_block', cW: 'qaqqqqq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'place_block', cW: 'eeeeede'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'colorize', cW: 'awddwqawqwawq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'create_water', cW: 'aqawqadaq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'destroy_water', cW: 'dedwedade'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'ignite', cW: 'aaqawawa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'extinguish', cW: 'ddedwdwd'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'conjure_block', cW: 'qqa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'conjure_light', cW: 'qqd'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'bonemeal', cW: 'wqaqwawqaqw'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'recharge', cW: 'qqqqqwaeaeaeaeaea'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'erase', cW: 'qdqawwaww'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'edify', cW: 'wqaqwd'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'beep', cW: 'adaa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'craft/cypher', cW: 'waqqqqq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'craft/trinket', cW: 'wwaqqqqqeaqeaeqqqeaeq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'craft/artifact', cW: 'wwaqqqqqeawqwqwqwqwqwwqqeadaeqqeqqeadaeqq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'potion/weakness', cW: 'qqqqqaqwawaw'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'potion/levitation', cW: 'qqqqqawwawawd'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'potion/wither', cW: 'qqqqqaewawawe'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'potion/poison', cW: 'qqqqqadwawaww'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'potion/slowness', cW: 'qqqqqadwawaw'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'sentinel/create', cW: 'waeawae'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'sentinel/destroy', cW: 'qdwdqdw'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'sentinel/get_pos', cW: 'waeawaede'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'sentinel/wayfind', cW: 'waeawaedwa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'akashic/read', cW: 'qqqwqqqqqaq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'akashic/write', cW: 'eeeweeeeede'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'halt', cW: 'aqdee'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'read', cW: 'aqqqqq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'read/entity', cW: 'wawqwqwqwqwqw'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'write', cW: 'deeeee'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'write/entity', cW: 'wdwewewewewew'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'readable', cW: 'aqqqqqe'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'readable/entity', cW: 'wawqwqwqwqwqwew'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'writable', cW: 'deeeeeq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'writable/entity', cW: 'wdwewewewewewqw'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'read/local', cW: 'qeewdweddw'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'write/local', cW: 'eqqwawqaaw'},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant($author$project$Logic$App$Types$Null),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Nullary Reflection',
		dv: 'const/null',
		cW: 'd'
	},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Boolean(true)),
		S: $author$project$Settings$Theme$accent1,
		cb: 'True Reflection',
		dv: 'const/true',
		cW: 'aqae'
	},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Boolean(false)),
		S: $author$project$Settings$Theme$accent1,
		cb: 'False Reflection',
		dv: 'const/false',
		cW: 'dedq'
	},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Vector(
				_Utils_Tuple3(1, 0, 0))),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Vector Reflection +X',
		dv: 'const/vec/px',
		cW: 'qqqqqea'
	},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Vector(
				_Utils_Tuple3(0, 1, 0))),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Vector Reflection +Y',
		dv: 'const/vec/py',
		cW: 'qqqqqew'
	},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Vector(
				_Utils_Tuple3(0, 0, 1))),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Vector Reflection +Z',
		dv: 'const/vec/pz',
		cW: 'qqqqqed'
	},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Vector(
				_Utils_Tuple3(-1, 0, 0))),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Vector Reflection -X',
		dv: 'const/vec/nx',
		cW: 'eeeeeqa'
	},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Vector(
				_Utils_Tuple3(0, -1, 0))),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Vector Reflection -Y',
		dv: 'const/vec/ny',
		cW: 'eeeeeqw'
	},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Vector(
				_Utils_Tuple3(0, 0, -1))),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Vector Reflection -Z',
		dv: 'const/vec/nz',
		cW: 'eeeeeqd'
	},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Vector(
				_Utils_Tuple3(0, 0, 0))),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Vector Reflection Zero',
		dv: 'const/vec/0',
		cW: 'qqqqq'
	},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Number($elm$core$Basics$pi)),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Arc\'s Reflection',
		dv: 'const/double/pi',
		cW: 'qdwdq'
	},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Number($elm$core$Basics$pi * 2)),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Circle\'s Reflection',
		dv: 'const/double/tau',
		cW: 'eawae'
	},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$Number($elm$core$Basics$e)),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Euler\'s Reflection',
		dv: 'const/double/e',
		cW: 'aaq'
	},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'get_entity', cW: 'qqqqqdaqa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'get_entity/animal', cW: 'qqqqqdaqaawa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'get_entity/monster', cW: 'qqqqqdaqaawq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'get_entity/item', cW: 'qqqqqdaqaaww'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'get_entity/player', cW: 'qqqqqdaqaawe'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'get_entity/living', cW: 'qqqqqdaqaawd'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'zone_entity', cW: 'qqqqqwded'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'zone_entity/animal', cW: 'qqqqqwdeddwa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'zone_entity/not_animal', cW: 'eeeeewaqaawa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'zone_entity/monster', cW: 'qqqqqwdeddwq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'zone_entity/not_monster', cW: 'eeeeewaqaawq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'zone_entity/item', cW: 'qqqqqwdeddww'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'zone_entity/not_item', cW: 'eeeeewaqaaww'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'zone_entity/player', cW: 'qqqqqwdeddwe'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'zone_entity/not_player', cW: 'eeeeewaqaawe'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'zone_entity/living', cW: 'qqqqqwdeddwd'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'zone_entity/not_living', cW: 'eeeeewaqaawd'},
		{a: $author$project$Logic$App$Patterns$Lists$append, S: $author$project$Settings$Theme$accent1, cb: 'Integration Distillation', dv: 'append', cW: 'edqde'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'concat', cW: 'qaeaq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'index', cW: 'deeed'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'for_each', cW: 'dadad'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'list_size', cW: 'aqaeaq'},
		{a: $author$project$Logic$App$Patterns$Lists$singleton, S: $author$project$Settings$Theme$accent1, cb: 'Single\'s Purification', dv: 'singleton', cW: 'adeeed'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'empty_list', cW: 'qqaeaae'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'reverse_list', cW: 'qqqaede'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'last_n_list', cW: 'ewdqdwe'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'splat', cW: 'qwaeawq'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'index_of', cW: 'dedqde'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'list_remove', cW: 'edqdewaqa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'slice', cW: 'qaeaqwded'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'modify_in_place', cW: 'wqaeaqw'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'construct', cW: 'ddewedd'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: '', dv: 'deconstruct', cW: 'aaqwqaa'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: 'Consideration', dv: 'escape', cW: 'qqqaw'},
		{
		a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
			$author$project$Logic$App$Types$OpenParenthesis($elm$core$Array$empty)),
		S: $author$project$Settings$Theme$accent1,
		cb: 'Introspection',
		dv: 'open_paren',
		cW: 'qqq'
	},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, S: $author$project$Settings$Theme$accent1, cb: 'Retrospection', dv: 'close_paren', cW: 'eee'},
		{a: $author$project$Logic$App$Patterns$PatternRegistry$eval, S: $author$project$Settings$Theme$accent1, cb: 'Hermes\' Gambit', dv: 'eval', cW: 'deaqq'}
	]);
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Logic$App$Patterns$PatternRegistry$getPatternFromName = function (name) {
	var _v0 = $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			function (regPattern) {
				return _Utils_eq(regPattern.cb, name) || (_Utils_eq(regPattern.dv, name) || _Utils_eq(regPattern.cW, name));
			},
			$author$project$Logic$App$Patterns$PatternRegistry$patternRegistry));
	if (!_v0.$) {
		var a = _v0.a;
		return _Utils_Tuple2(a, $elm$core$Platform$Cmd$none);
	} else {
		var _v1 = $elm$core$String$toFloat(name);
		if (!_v1.$) {
			var number = _v1.a;
			return _Utils_Tuple2(
				$author$project$Logic$App$Patterns$PatternRegistry$unknownPattern,
				$author$project$Ports$HexNumGen$call(number));
		} else {
			return _Utils_Tuple2($author$project$Logic$App$Patterns$PatternRegistry$unknownPattern, $elm$core$Platform$Cmd$none);
		}
	}
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Logic$App$Patterns$Misc$numberLiteral = F2(
	function (number, stack) {
		return A2(
			$author$project$Logic$App$Utils$Utils$unshift,
			$author$project$Logic$App$Types$Number(number),
			stack);
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Logic$App$Patterns$PatternRegistry$numberLiteralGenerator = F2(
	function (angleSignature, isNegative) {
		var letterMap = function (letter) {
			switch (letter) {
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
			a: $author$project$Logic$App$Patterns$Misc$numberLiteral(number),
			S: $author$project$Settings$Theme$accent1,
			cb: 'Numerical Reflection: ' + $elm$core$String$fromFloat(number),
			dv: $elm$core$String$fromFloat(number),
			cW: angleSignature
		};
	});
var $author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature = function (signature) {
	var _v0 = $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			function (regPattern) {
				return _Utils_eq(regPattern.cW, signature);
			},
			$author$project$Logic$App$Patterns$PatternRegistry$patternRegistry));
	if (!_v0.$) {
		var a = _v0.a;
		return a;
	} else {
		return A2($elm$core$String$startsWith, 'aqaa', signature) ? A2($author$project$Logic$App$Patterns$PatternRegistry$numberLiteralGenerator, signature, false) : (A2($elm$core$String$startsWith, 'dedd', signature) ? A2($author$project$Logic$App$Patterns$PatternRegistry$numberLiteralGenerator, signature, true) : _Utils_update(
			$author$project$Logic$App$Patterns$PatternRegistry$unknownPattern,
			{cb: 'Pattern ' + ('\"' + (signature + '\"')), cW: signature}));
	}
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
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
									S: $author$project$Settings$Theme$accent1,
									D: _List_Nil,
									A: (i * 2) + A2($elm$core$Basics$modBy, 2, r),
									B: r,
									bj: radius,
									a5: false,
									p: (($author$project$Components$App$Grid$spacing(scale) * i) + (($author$project$Components$App$Grid$spacing(scale) / 2) * A2($elm$core$Basics$modBy, 2, r))) + ((gridWidth - ((pointCount - 3.5) * $author$project$Components$App$Grid$spacing(scale))) / 2),
									q: ($author$project$Components$App$Grid$verticalSpacing(scale) * r) + ((gridHeight - ((rowCount - 4) * $author$project$Components$App$Grid$verticalSpacing(scale))) / 2)
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
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
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
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
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
		};
	});
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
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
					D: A2(
						$elm$core$List$map,
						function (conPoint) {
							var _v0 = conPoint.aj;
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
									aj: function () {
										var uniqueNumber = ((conPoint.B * 10000) + conPoint.A) + time;
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
						point.D)
				});
		};
		return A2(
			$elm$core$List$map,
			function (row) {
				return A2($elm$core$List$map, updateOffsets, row);
			},
			grid_);
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		var ui = model.ek;
		var settings = model.aZ;
		var grid = model.E;
		var drawing = model.E.am;
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 1:
				var panel = msg.a;
				var keys = msg.b;
				return (!keys.d3) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ek: _Utils_update(
								ui,
								{
									dO: _List_fromArray(
										[panel])
								})
						}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ek: _Utils_update(
								ui,
								{
									dO: _Utils_ap(
										ui.dO,
										_List_fromArray(
											[panel]))
								})
						}),
					$elm$core$Platform$Cmd$none);
			case 2:
				if (!msg.a.$) {
					var element = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								E: _Utils_update(
									grid,
									{
										dq: element.av.dq,
										bi: A5($author$project$Components$App$Grid$updateGridPoints, element.av._, element.av.dq, model.dU, _List_Nil, model.aZ.aQ),
										_: element.av._
									})
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 3:
				if (!msg.a.$) {
					var element = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bn: {dq: element.av.dq, _: element.av._}
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 4:
				var _v1 = msg.a;
				var x = _v1.a;
				var y = _v1.b;
				return drawing.dk ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							E: _Utils_update(
								grid,
								{
									am: _Utils_update(
										drawing,
										{
											au: $author$project$Components$App$Grid$addNearbyPoint(model)
										})
								}),
							aU: _Utils_Tuple2(x, y)
						}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aU: _Utils_Tuple2(x, y)
						}),
					$elm$core$Platform$Cmd$none);
			case 5:
				var _v2 = msg.a;
				var x = _v2.a;
				var y = _v2.b;
				var mousePos = _Utils_Tuple2(x, y);
				var closestPoint = A3($author$project$Components$App$Grid$getClosestPoint, mousePos, grid.bi, model);
				return (!closestPoint.a5) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							E: _Utils_update(
								grid,
								{
									am: _Utils_update(
										drawing,
										{
											au: _List_fromArray(
												[closestPoint]),
											dk: true
										})
								}),
							aU: mousePos
						}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 6:
				if (drawing.dk) {
					if ($elm$core$List$length(drawing.au) > 1) {
						var precedingEscapeCount = function () {
							var countEscapes = F2(
								function (patternTuple, accumulator) {
									return accumulator.b ? ((patternTuple.a.dv === 'escape') ? _Utils_Tuple2(accumulator.a + 1, true) : _Utils_Tuple2(accumulator.a, false)) : _Utils_Tuple2(accumulator.a, false);
								});
							return A3(
								$elm$core$Array$foldl,
								countEscapes,
								_Utils_Tuple2(0, true),
								model.dU).a;
						}();
						var newPattern = function () {
							var uncoloredPattern = $author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature(
								$author$project$Logic$App$Utils$GetAngleSignature$getAngleSignature(drawing.au));
							return (A2($elm$core$Basics$modBy, 2, precedingEscapeCount) === 1) ? _Utils_update(
								uncoloredPattern,
								{S: $author$project$Settings$Theme$accent5}) : uncoloredPattern;
						}();
						var newGrid = _Utils_update(
							grid,
							{
								am: _Utils_update(
									drawing,
									{au: _List_Nil, dk: false}),
								bi: A2(
									$author$project$Components$App$Grid$applyActivePathToGrid,
									model.E.bi,
									$author$project$Logic$App$PatternList$PatternArray$updateDrawingColors(
										_Utils_Tuple2(newPattern, drawing.au)).b)
							});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									E: newGrid,
									dU: A2($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern),
									d5: A3(
										$author$project$Logic$App$Stack$Stack$applyPatternsToStack,
										$elm$core$Array$empty,
										$elm$core$List$reverse(
											A2(
												$elm$core$List$map,
												function (x) {
													return x.a;
												},
												$elm$core$Array$toList(
													A2($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern)))),
										false)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									E: _Utils_update(
										grid,
										{
											am: _Utils_update(
												drawing,
												{au: _List_Nil, dk: false})
										})
								}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 7:
				var startIndex = msg.a;
				var endIndex = msg.b;
				var newPatternArray = A3($author$project$Logic$App$Utils$Utils$removeFromArray, startIndex, endIndex, model.dU);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							E: _Utils_update(
								grid,
								{
									bi: A5($author$project$Components$App$Grid$updateGridPoints, grid._, grid.dq, newPatternArray, _List_Nil, settings.aQ)
								}),
							dU: newPatternArray,
							d5: A3(
								$author$project$Logic$App$Stack$Stack$applyPatternsToStack,
								$elm$core$Array$empty,
								$elm$core$List$reverse(
									$elm$core$List$unzip(
										$elm$core$Array$toList(newPatternArray)).a),
								false)
						}),
					$elm$core$Platform$Cmd$none);
			case 8:
				var scale = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							E: _Utils_update(
								grid,
								{
									bi: A5($author$project$Components$App$Grid$updateGridPoints, grid._, grid.dq, model.dU, _List_Nil, scale)
								}),
							aZ: _Utils_update(
								settings,
								{aQ: scale})
						}),
					$elm$core$Platform$Cmd$none);
			case 9:
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
			case 10:
				var newTime = msg.a;
				var points = grid.bi;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							E: _Utils_update(
								grid,
								{
									bi: A2(
										$author$project$Components$App$Grid$updatemidLineOffsets,
										points,
										$elm$time$Time$posixToMillis(newTime))
								}),
							ed: $elm$time$Time$posixToMillis(newTime)
						}),
					$elm$core$Platform$Cmd$none);
			case 11:
				var text = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ek: _Utils_update(
								ui,
								{bS: text})
						}),
					$elm$core$Platform$Cmd$none);
			case 12:
				var name = msg.a;
				var getPattern = $author$project$Logic$App$Patterns$PatternRegistry$getPatternFromName(name);
				var newPattern = getPattern.a;
				var command = getPattern.b;
				return _Utils_eq(command, $elm$core$Platform$Cmd$none) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							dU: A2($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern),
							d5: A3(
								$author$project$Logic$App$Stack$Stack$applyPatternsToStack,
								$elm$core$Array$empty,
								$elm$core$List$reverse(
									A2(
										$elm$core$List$map,
										function (x) {
											return x.a;
										},
										$elm$core$Array$toList(
											A2($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern)))),
								false),
							ek: _Utils_update(
								ui,
								{bS: ''})
						}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, command);
			case 13:
				var number = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Ports$HexNumGen$call(number));
			case 14:
				var signature = msg.a;
				var newPattern = $author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature(signature);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							dU: A2($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern),
							d5: A3(
								$author$project$Logic$App$Stack$Stack$applyPatternsToStack,
								$elm$core$Array$empty,
								$elm$core$List$reverse(
									A2(
										$elm$core$List$map,
										function (x) {
											return x.a;
										},
										$elm$core$Array$toList(
											A2($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern)))),
								false),
							ek: _Utils_update(
								ui,
								{bS: ''})
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var suggestLength = msg.a;
				var newIndex = (_Utils_cmp(
					model.ek.d9,
					A2($elm$core$Basics$min, 3, suggestLength) - 1) > -1) ? 0 : (model.ek.d9 + 1);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ek: _Utils_update(
								ui,
								{d9: newIndex})
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Logic$App$Msg$MouseMove = function (a) {
	return {$: 4, a: a};
};
var $author$project$Logic$App$Msg$MouseUp = {$: 6};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $author$project$Logic$App$Types$StackPanel = 0;
var $author$project$Logic$App$Msg$ViewPanel = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $lattyware$elm_fontawesome$FontAwesome$IconDef = F4(
	function (prefix, name, size, paths) {
		return {dG: name, dT: paths, dY: prefix, d4: size};
	});
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$code = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'code',
	_Utils_Tuple2(640, 512),
	_Utils_Tuple2('M414.8 40.79L286.8 488.8C281.9 505.8 264.2 515.6 247.2 510.8C230.2 505.9 220.4 488.2 225.2 471.2L353.2 23.21C358.1 6.216 375.8-3.624 392.8 1.232C409.8 6.087 419.6 23.8 414.8 40.79H414.8zM518.6 121.4L630.6 233.4C643.1 245.9 643.1 266.1 630.6 278.6L518.6 390.6C506.1 403.1 485.9 403.1 473.4 390.6C460.9 378.1 460.9 357.9 473.4 345.4L562.7 256L473.4 166.6C460.9 154.1 460.9 133.9 473.4 121.4C485.9 108.9 506.1 108.9 518.6 121.4V121.4zM166.6 166.6L77.25 256L166.6 345.4C179.1 357.9 179.1 378.1 166.6 390.6C154.1 403.1 133.9 403.1 121.4 390.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4L121.4 121.4C133.9 108.9 154.1 108.9 166.6 121.4C179.1 133.9 179.1 154.1 166.6 166.6V166.6z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Internal$Icon = $elm$core$Basics$identity;
var $lattyware$elm_fontawesome$FontAwesome$present = function (icon) {
	return {a7: _List_Nil, cm: icon, bw: $elm$core$Maybe$Nothing, bJ: $elm$core$Maybe$Nothing, bW: 'img', ee: $elm$core$Maybe$Nothing, bm: _List_Nil};
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$code = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$code);
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $lattyware$elm_fontawesome$FontAwesome$Styles$css = A3(
	$elm$html$Html$node,
	'style',
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text(':root, :host {  --fa-font-solid: normal 900 1em/1 \"Font Awesome 6 Solid\";  --fa-font-regular: normal 400 1em/1 \"Font Awesome 6 Regular\";  --fa-font-light: normal 300 1em/1 \"Font Awesome 6 Light\";  --fa-font-thin: normal 100 1em/1 \"Font Awesome 6 Thin\";  --fa-font-duotone: normal 900 1em/1 \"Font Awesome 6 Duotone\";  --fa-font-brands: normal 400 1em/1 \"Font Awesome 6 Brands\";}svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {  overflow: visible;  box-sizing: content-box;}.svg-inline--fa {  display: var(--fa-display, inline-block);  height: 1em;  overflow: visible;  vertical-align: -0.125em;}.svg-inline--fa.fa-2xs {  vertical-align: 0.1em;}.svg-inline--fa.fa-xs {  vertical-align: 0em;}.svg-inline--fa.fa-sm {  vertical-align: -0.0714285705em;}.svg-inline--fa.fa-lg {  vertical-align: -0.2em;}.svg-inline--fa.fa-xl {  vertical-align: -0.25em;}.svg-inline--fa.fa-2xl {  vertical-align: -0.3125em;}.svg-inline--fa.fa-pull-left {  margin-right: var(--fa-pull-margin, 0.3em);  width: auto;}.svg-inline--fa.fa-pull-right {  margin-left: var(--fa-pull-margin, 0.3em);  width: auto;}.svg-inline--fa.fa-li {  width: var(--fa-li-width, 2em);  top: 0.25em;}.svg-inline--fa.fa-fw {  width: var(--fa-fw-width, 1.25em);}.fa-layers svg.svg-inline--fa {  bottom: 0;  left: 0;  margin: auto;  position: absolute;  right: 0;  top: 0;}.fa-layers-counter, .fa-layers-text {  display: inline-block;  position: absolute;  text-align: center;}.fa-layers {  display: inline-block;  height: 1em;  position: relative;  text-align: center;  vertical-align: -0.125em;  width: 1em;}.fa-layers svg.svg-inline--fa {  -webkit-transform-origin: center center;          transform-origin: center center;}.fa-layers-text {  left: 50%;  top: 50%;  -webkit-transform: translate(-50%, -50%);          transform: translate(-50%, -50%);  -webkit-transform-origin: center center;          transform-origin: center center;}.fa-layers-counter {  background-color: var(--fa-counter-background-color, #ff253a);  border-radius: var(--fa-counter-border-radius, 1em);  box-sizing: border-box;  color: var(--fa-inverse, #fff);  line-height: var(--fa-counter-line-height, 1);  max-width: var(--fa-counter-max-width, 5em);  min-width: var(--fa-counter-min-width, 1.5em);  overflow: hidden;  padding: var(--fa-counter-padding, 0.25em 0.5em);  right: var(--fa-right, 0);  text-overflow: ellipsis;  top: var(--fa-top, 0);  -webkit-transform: scale(var(--fa-counter-scale, 0.25));          transform: scale(var(--fa-counter-scale, 0.25));  -webkit-transform-origin: top right;          transform-origin: top right;}.fa-layers-bottom-right {  bottom: var(--fa-bottom, 0);  right: var(--fa-right, 0);  top: auto;  -webkit-transform: scale(var(--fa-layers-scale, 0.25));          transform: scale(var(--fa-layers-scale, 0.25));  -webkit-transform-origin: bottom right;          transform-origin: bottom right;}.fa-layers-bottom-left {  bottom: var(--fa-bottom, 0);  left: var(--fa-left, 0);  right: auto;  top: auto;  -webkit-transform: scale(var(--fa-layers-scale, 0.25));          transform: scale(var(--fa-layers-scale, 0.25));  -webkit-transform-origin: bottom left;          transform-origin: bottom left;}.fa-layers-top-right {  top: var(--fa-top, 0);  right: var(--fa-right, 0);  -webkit-transform: scale(var(--fa-layers-scale, 0.25));          transform: scale(var(--fa-layers-scale, 0.25));  -webkit-transform-origin: top right;          transform-origin: top right;}.fa-layers-top-left {  left: var(--fa-left, 0);  right: auto;  top: var(--fa-top, 0);  -webkit-transform: scale(var(--fa-layers-scale, 0.25));          transform: scale(var(--fa-layers-scale, 0.25));  -webkit-transform-origin: top left;          transform-origin: top left;}.fa-1x {  font-size: 1em;}.fa-2x {  font-size: 2em;}.fa-3x {  font-size: 3em;}.fa-4x {  font-size: 4em;}.fa-5x {  font-size: 5em;}.fa-6x {  font-size: 6em;}.fa-7x {  font-size: 7em;}.fa-8x {  font-size: 8em;}.fa-9x {  font-size: 9em;}.fa-10x {  font-size: 10em;}.fa-2xs {  font-size: 0.625em;  line-height: 0.1em;  vertical-align: 0.225em;}.fa-xs {  font-size: 0.75em;  line-height: 0.0833333337em;  vertical-align: 0.125em;}.fa-sm {  font-size: 0.875em;  line-height: 0.0714285718em;  vertical-align: 0.0535714295em;}.fa-lg {  font-size: 1.25em;  line-height: 0.05em;  vertical-align: -0.075em;}.fa-xl {  font-size: 1.5em;  line-height: 0.0416666682em;  vertical-align: -0.125em;}.fa-2xl {  font-size: 2em;  line-height: 0.03125em;  vertical-align: -0.1875em;}.fa-fw {  text-align: center;  width: 1.25em;}.fa-ul {  list-style-type: none;  margin-left: var(--fa-li-margin, 2.5em);  padding-left: 0;}.fa-ul > li {  position: relative;}.fa-li {  left: calc(var(--fa-li-width, 2em) * -1);  position: absolute;  text-align: center;  width: var(--fa-li-width, 2em);  line-height: inherit;}.fa-border {  border-color: var(--fa-border-color, #eee);  border-radius: var(--fa-border-radius, 0.1em);  border-style: var(--fa-border-style, solid);  border-width: var(--fa-border-width, 0.08em);  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);}.fa-pull-left {  float: left;  margin-right: var(--fa-pull-margin, 0.3em);}.fa-pull-right {  float: right;  margin-left: var(--fa-pull-margin, 0.3em);}.fa-beat {  -webkit-animation-name: fa-beat;          animation-name: fa-beat;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);          animation-timing-function: var(--fa-animation-timing, ease-in-out);}.fa-bounce {  -webkit-animation-name: fa-bounce;          animation-name: fa-bounce;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));}.fa-fade {  -webkit-animation-name: fa-fade;          animation-name: fa-fade;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));}.fa-beat-fade {  -webkit-animation-name: fa-beat-fade;          animation-name: fa-beat-fade;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));}.fa-flip {  -webkit-animation-name: fa-flip;          animation-name: fa-flip;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);          animation-timing-function: var(--fa-animation-timing, ease-in-out);}.fa-shake {  -webkit-animation-name: fa-shake;          animation-name: fa-shake;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, linear);          animation-timing-function: var(--fa-animation-timing, linear);}.fa-spin {  -webkit-animation-name: fa-spin;          animation-name: fa-spin;  -webkit-animation-delay: var(--fa-animation-delay, 0);          animation-delay: var(--fa-animation-delay, 0);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 2s);          animation-duration: var(--fa-animation-duration, 2s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, linear);          animation-timing-function: var(--fa-animation-timing, linear);}.fa-spin-reverse {  --fa-animation-direction: reverse;}.fa-pulse,.fa-spin-pulse {  -webkit-animation-name: fa-spin;          animation-name: fa-spin;  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, steps(8));          animation-timing-function: var(--fa-animation-timing, steps(8));}@media (prefers-reduced-motion: reduce) {  .fa-beat,.fa-bounce,.fa-fade,.fa-beat-fade,.fa-flip,.fa-pulse,.fa-shake,.fa-spin,.fa-spin-pulse {    -webkit-animation-delay: -1ms;            animation-delay: -1ms;    -webkit-animation-duration: 1ms;            animation-duration: 1ms;    -webkit-animation-iteration-count: 1;            animation-iteration-count: 1;    transition-delay: 0s;    transition-duration: 0s;  }}@-webkit-keyframes fa-beat {  0%, 90% {    -webkit-transform: scale(1);            transform: scale(1);  }  45% {    -webkit-transform: scale(var(--fa-beat-scale, 1.25));            transform: scale(var(--fa-beat-scale, 1.25));  }}@keyframes fa-beat {  0%, 90% {    -webkit-transform: scale(1);            transform: scale(1);  }  45% {    -webkit-transform: scale(var(--fa-beat-scale, 1.25));            transform: scale(var(--fa-beat-scale, 1.25));  }}@-webkit-keyframes fa-bounce {  0% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }  10% {    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);  }  30% {    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));  }  50% {    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);  }  57% {    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));  }  64% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }  100% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }}@keyframes fa-bounce {  0% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }  10% {    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);  }  30% {    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));  }  50% {    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);  }  57% {    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));  }  64% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }  100% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }}@-webkit-keyframes fa-fade {  50% {    opacity: var(--fa-fade-opacity, 0.4);  }}@keyframes fa-fade {  50% {    opacity: var(--fa-fade-opacity, 0.4);  }}@-webkit-keyframes fa-beat-fade {  0%, 100% {    opacity: var(--fa-beat-fade-opacity, 0.4);    -webkit-transform: scale(1);            transform: scale(1);  }  50% {    opacity: 1;    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));            transform: scale(var(--fa-beat-fade-scale, 1.125));  }}@keyframes fa-beat-fade {  0%, 100% {    opacity: var(--fa-beat-fade-opacity, 0.4);    -webkit-transform: scale(1);            transform: scale(1);  }  50% {    opacity: 1;    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));            transform: scale(var(--fa-beat-fade-scale, 1.125));  }}@-webkit-keyframes fa-flip {  50% {    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));  }}@keyframes fa-flip {  50% {    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));  }}@-webkit-keyframes fa-shake {  0% {    -webkit-transform: rotate(-15deg);            transform: rotate(-15deg);  }  4% {    -webkit-transform: rotate(15deg);            transform: rotate(15deg);  }  8%, 24% {    -webkit-transform: rotate(-18deg);            transform: rotate(-18deg);  }  12%, 28% {    -webkit-transform: rotate(18deg);            transform: rotate(18deg);  }  16% {    -webkit-transform: rotate(-22deg);            transform: rotate(-22deg);  }  20% {    -webkit-transform: rotate(22deg);            transform: rotate(22deg);  }  32% {    -webkit-transform: rotate(-12deg);            transform: rotate(-12deg);  }  36% {    -webkit-transform: rotate(12deg);            transform: rotate(12deg);  }  40%, 100% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }}@keyframes fa-shake {  0% {    -webkit-transform: rotate(-15deg);            transform: rotate(-15deg);  }  4% {    -webkit-transform: rotate(15deg);            transform: rotate(15deg);  }  8%, 24% {    -webkit-transform: rotate(-18deg);            transform: rotate(-18deg);  }  12%, 28% {    -webkit-transform: rotate(18deg);            transform: rotate(18deg);  }  16% {    -webkit-transform: rotate(-22deg);            transform: rotate(-22deg);  }  20% {    -webkit-transform: rotate(22deg);            transform: rotate(22deg);  }  32% {    -webkit-transform: rotate(-12deg);            transform: rotate(-12deg);  }  36% {    -webkit-transform: rotate(12deg);            transform: rotate(12deg);  }  40%, 100% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }}@-webkit-keyframes fa-spin {  0% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }  100% {    -webkit-transform: rotate(360deg);            transform: rotate(360deg);  }}@keyframes fa-spin {  0% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }  100% {    -webkit-transform: rotate(360deg);            transform: rotate(360deg);  }}.fa-rotate-90 {  -webkit-transform: rotate(90deg);          transform: rotate(90deg);}.fa-rotate-180 {  -webkit-transform: rotate(180deg);          transform: rotate(180deg);}.fa-rotate-270 {  -webkit-transform: rotate(270deg);          transform: rotate(270deg);}.fa-flip-horizontal {  -webkit-transform: scale(-1, 1);          transform: scale(-1, 1);}.fa-flip-vertical {  -webkit-transform: scale(1, -1);          transform: scale(1, -1);}.fa-flip-both,.fa-flip-horizontal.fa-flip-vertical {  -webkit-transform: scale(-1, -1);          transform: scale(-1, -1);}.fa-rotate-by {  -webkit-transform: rotate(var(--fa-rotate-angle, none));          transform: rotate(var(--fa-rotate-angle, none));}.fa-stack {  display: inline-block;  vertical-align: middle;  height: 2em;  position: relative;  width: 2.5em;}.fa-stack-1x,.fa-stack-2x {  bottom: 0;  left: 0;  margin: auto;  position: absolute;  right: 0;  top: 0;  z-index: var(--fa-stack-z-index, auto);}.svg-inline--fa.fa-stack-1x {  height: 1em;  width: 1.25em;}.svg-inline--fa.fa-stack-2x {  height: 2em;  width: 2.5em;}.fa-inverse {  color: var(--fa-inverse, #fff);}.sr-only,.fa-sr-only {  position: absolute;  width: 1px;  height: 1px;  padding: 0;  margin: -1px;  overflow: hidden;  clip: rect(0, 0, 0, 0);  white-space: nowrap;  border-width: 0;}.sr-only-focusable:not(:focus),.fa-sr-only-focusable:not(:focus) {  position: absolute;  width: 1px;  height: 1px;  padding: 0;  margin: -1px;  overflow: hidden;  clip: rect(0, 0, 0, 0);  white-space: nowrap;  border-width: 0;}.svg-inline--fa .fa-primary {  fill: var(--fa-primary-color, currentColor);  opacity: var(--fa-primary-opacity, 1);}.svg-inline--fa .fa-secondary {  fill: var(--fa-secondary-color, currentColor);  opacity: var(--fa-secondary-opacity, 0.4);}.svg-inline--fa.fa-swap-opacity .fa-primary {  opacity: var(--fa-secondary-opacity, 0.4);}.svg-inline--fa.fa-swap-opacity .fa-secondary {  opacity: var(--fa-primary-opacity, 1);}.svg-inline--fa mask .fa-primary,.svg-inline--fa mask .fa-secondary {  fill: black;}.fad.fa-inverse,.fa-duotone.fa-inverse {  color: var(--fa-inverse, #fff);}')
		]));
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$layerGroup = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'layer-group',
	_Utils_Tuple2(512, 512),
	_Utils_Tuple2('M232.5 5.171C247.4-1.718 264.6-1.718 279.5 5.171L498.1 106.2C506.6 110.1 512 118.6 512 127.1C512 137.3 506.6 145.8 498.1 149.8L279.5 250.8C264.6 257.7 247.4 257.7 232.5 250.8L13.93 149.8C5.438 145.8 0 137.3 0 127.1C0 118.6 5.437 110.1 13.93 106.2L232.5 5.171zM498.1 234.2C506.6 238.1 512 246.6 512 255.1C512 265.3 506.6 273.8 498.1 277.8L279.5 378.8C264.6 385.7 247.4 385.7 232.5 378.8L13.93 277.8C5.438 273.8 0 265.3 0 255.1C0 246.6 5.437 238.1 13.93 234.2L67.13 209.6L219.1 279.8C242.5 290.7 269.5 290.7 292.9 279.8L444.9 209.6L498.1 234.2zM292.9 407.8L444.9 337.6L498.1 362.2C506.6 366.1 512 374.6 512 383.1C512 393.3 506.6 401.8 498.1 405.8L279.5 506.8C264.6 513.7 247.4 513.7 232.5 506.8L13.93 405.8C5.438 401.8 0 393.3 0 383.1C0 374.6 5.437 366.1 13.93 362.2L67.13 337.6L219.1 407.8C242.5 418.7 269.5 418.7 292.9 407.8V407.8z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$layerGroup = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$layerGroup);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions = {bT: true, bZ: false};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 3, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event = F6(
	function (keys, button, clientPos, offsetPos, pagePos, screenPos) {
		return {c8: button, db: clientPos, cr: keys, dJ: offsetPos, dQ: pagePos, d2: screenPos};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton = 4;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton = 0;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton = 5;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton = 1;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton = 2;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton = 3;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId = function (id) {
	switch (id) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		default:
			return 0;
	}
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder = A2(
	$elm$json$Json$Decode$map,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId,
	A2($elm$json$Json$Decode$field, 'button', $elm$json$Json$Decode$int));
var $elm$json$Json$Decode$float = _Json_decodeFloat;
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
		return {c3: alt, de: ctrl, d3: shift};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
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
						ad: tag(ev),
						bT: options.bT,
						bZ: options.bZ
					};
				},
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'click', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $lattyware$elm_fontawesome$FontAwesome$Attributes$sm = $elm$svg$Svg$Attributes$class('fa-sm');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $lattyware$elm_fontawesome$FontAwesome$styled = F2(
	function (attributes, _v0) {
		var presentation = _v0;
		return _Utils_update(
			presentation,
			{
				a7: _Utils_ap(presentation.a7, attributes)
			});
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
	var icon = _v1.cm;
	var outer = _v1.bJ;
	return A2(
		$elm$core$Maybe$withDefault,
		icon.d4,
		A2($elm$core$Maybe$map, $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensionsInternal, outer));
};
var $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensionsInternal = function (_v0) {
	var icon = _v0.cm;
	var outer = _v0.bJ;
	return A2(
		$elm$core$Maybe$withDefault,
		icon.d4,
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
			case 0:
				var by = transform.a;
				return _Utils_update(
					combined,
					{d4: combined.d4 + by});
			case 1:
				var axis = transform.a;
				var by = transform.b;
				var _v1 = function () {
					if (!axis) {
						return _Utils_Tuple2(0, by);
					} else {
						return _Utils_Tuple2(by, 0);
					}
				}();
				var x = _v1.a;
				var y = _v1.b;
				return _Utils_update(
					combined,
					{p: combined.p + x, q: combined.q + y});
			case 2:
				var rotation = transform.a;
				return _Utils_update(
					combined,
					{d0: combined.d0 + rotation});
			default:
				var axis = transform.a;
				if (!axis) {
					return _Utils_update(
						combined,
						{dp: !combined.dp});
				} else {
					return _Utils_update(
						combined,
						{$7: !combined.$7});
				}
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize = 16;
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform = {$7: false, dp: false, d0: 0, d4: $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize, p: 0, q: 0};
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
		var innerTranslate = 'translate(' + ($elm$core$String$fromFloat(transform.p * 32) + (',' + ($elm$core$String$fromFloat(transform.q * 32) + ') ')));
		var innerRotate = 'rotate(' + ($elm$core$String$fromFloat(transform.d0) + ' 0 0)');
		var flipY = transform.dp ? (-1) : 1;
		var scaleY = (transform.d4 / $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize) * flipY;
		var flipX = transform.$7 ? (-1) : 1;
		var scaleX = (transform.d4 / $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize) * flipX;
		var innerScale = 'scale(' + ($elm$core$String$fromFloat(scaleX) + (', ' + ($elm$core$String$fromFloat(scaleY) + ') ')));
		return {
			cn: $elm$svg$Svg$Attributes$transform(
				_Utils_ap(
					innerTranslate,
					_Utils_ap(innerScale, innerRotate))),
			bJ: $elm$svg$Svg$Attributes$transform(outer),
			cG: $elm$svg$Svg$Attributes$transform(path)
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
		var paths = _v0.dT;
		if (paths.b.$ === 1) {
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
		var outer = _v0.bJ;
		var inner = _v0.cn;
		var path = _v0.cG;
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
		var icon = fullIcon.cm;
		var transforms = fullIcon.bm;
		var id = fullIcon.bw;
		var outer = fullIcon.bJ;
		var combinedTransforms = $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaningfulTransform(transforms);
		var _v0 = icon.d4;
		var width = _v0.a;
		var _v1 = $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensions(fullIcon);
		var topLevelWidth = _v1.a;
		if (!combinedTransforms.$) {
			var meaningfulTransform = combinedTransforms.a;
			var svgTransform = A3($lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$transformForSvg, topLevelWidth, width, meaningfulTransform);
			if (!outer.$) {
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
		var id = include.bw;
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
		var icon = fullIcon.cm;
		var transforms = fullIcon.bm;
		var role = fullIcon.bW;
		var id = fullIcon.bw;
		var title = fullIcon.ee;
		var outer = fullIcon.bJ;
		var attributes = fullIcon.a7;
		var contents = $lattyware$elm_fontawesome$FontAwesome$Svg$view(fullIcon);
		var _v0 = function () {
			if (!title.$) {
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
				'fa-' + icon.dG,
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
		return A2($elm$core$List$member, panel, model.ek.dO) ? _List_fromArray(
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
								return A2($author$project$Logic$App$Msg$ViewPanel, 1, event.cr);
							})
						]),
					highlightIfActive(1)),
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
								return A2($author$project$Logic$App$Msg$ViewPanel, 0, event.cr);
							})
						]),
					highlightIfActive(0)),
				_List_fromArray(
					[
						$lattyware$elm_fontawesome$FontAwesome$Styles$css,
						$lattyware$elm_fontawesome$FontAwesome$view(
						A2(
							$lattyware$elm_fontawesome$FontAwesome$styled,
							_List_fromArray(
								[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
							$lattyware$elm_fontawesome$FontAwesome$Solid$layerGroup))
					]))
			]));
};
var $author$project$Logic$App$Msg$InputPattern = function (a) {
	return {$: 12, a: a};
};
var $author$project$Logic$App$Msg$SelectNextSuggestion = function (a) {
	return {$: 15, a: a};
};
var $author$project$Logic$App$Msg$UpdatePatternInputField = function (a) {
	return {$: 11, a: a};
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
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
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
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
var $author$project$Components$App$Panels$PatternPanel$autocompleteList = A2(
	$elm$core$List$map,
	function (pat) {
		return _Utils_Tuple2(pat.cb, pat.dv);
	},
	$author$project$Logic$App$Patterns$PatternRegistry$patternRegistry);
var $elm$core$String$toLower = _String_toLower;
var $author$project$Components$App$Panels$PatternPanel$patternInputSuggestionList = function (model) {
	var inputValue = model.ek.bS;
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
			$author$project$Components$App$Panels$PatternPanel$autocompleteList)).a : _List_Nil;
};
var $author$project$Components$App$Panels$PatternPanel$patternInputAutoComplete = function (model) {
	var suggestionIndex = model.ek.d9;
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
					$author$project$Components$App$Panels$PatternPanel$patternInputSuggestionList(model)))));
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
						(name === '') ? 'owo' : name)
					]));
		});
	return _Utils_Tuple2(
		A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('autocomplete_container')
				]),
			A2(
				$elm$core$List$indexedMap,
				constructOption,
				$author$project$Components$App$Panels$PatternPanel$patternInputSuggestionList(model))),
		getHighlightedOption);
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$plus = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'plus',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$plus = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$plus);
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
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
		return {$: 7, a: a, b: b};
	});
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
var $author$project$Components$App$Panels$PatternPanel$renderPatternList = function (patternList) {
	var renderPattern = F2(
		function (index, pattern) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
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
										$elm$html$Html$Attributes$class('text')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(pattern.cb)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('move_button')
									]),
								_List_fromArray(
									[$author$project$Components$Icon$MoveButton$moveButton]))
							]))
					]));
		});
	var patterns = $elm$core$List$unzip(
		$elm$core$Array$toList(patternList)).a;
	return A2($elm$core$List$indexedMap, renderPattern, patterns);
};
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Components$App$Panels$Utils$visibilityToDisplayStyle = function (visibility) {
	return visibility ? A2($elm$html$Html$Attributes$style, 'display', 'flex') : A2($elm$html$Html$Attributes$style, 'display', 'none');
};
var $author$project$Components$App$Panels$PatternPanel$patternPanel = function (model) {
	var visibility = A2($elm$core$List$member, 1, model.ek.dO);
	var autocompleteTuple = $author$project$Components$App$Panels$PatternPanel$patternInputAutoComplete(model);
	var valueToSend = (autocompleteTuple.b !== '') ? autocompleteTuple.b : model.ek.bS;
	var isEnter = function (code) {
		return (code === 13) ? $elm$json$Json$Decode$succeed(
			_Utils_Tuple2(
				$author$project$Logic$App$Msg$InputPattern(valueToSend),
				true)) : ((code === 9) ? $elm$json$Json$Decode$succeed(
			_Utils_Tuple2(
				$author$project$Logic$App$Msg$SelectNextSuggestion(
					$elm$core$List$length(
						$author$project$Components$App$Panels$PatternPanel$patternInputSuggestionList(model))),
				true)) : $elm$json$Json$Decode$fail('not ENTER'));
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
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('pattern_draggable_container')
					]),
				$elm$core$List$reverse(
					$author$project$Components$App$Panels$PatternPanel$renderPatternList(model.dU))),
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
												$elm$html$Html$Attributes$value(model.ek.bS),
												A2(
												$elm$html$Html$Events$preventDefaultOn,
												'keydown',
												A2($elm$json$Json$Decode$andThen, isEnter, $elm$html$Html$Events$keyCode))
											]),
										_List_Nil),
										autocompleteTuple.a
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
var $author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsString = function (iota) {
	switch (iota.$) {
		case 6:
			return 'Null';
		case 0:
			var number = iota.a;
			return $elm$core$String$fromFloat(number);
		case 1:
			var _v1 = iota.a;
			var x = _v1.a;
			var y = _v1.b;
			var z = _v1.c;
			return 'Vector [' + ($elm$core$String$fromFloat(x) + (', ' + ($elm$core$String$fromFloat(y) + (', ' + ($elm$core$String$fromFloat(z) + ']')))));
		case 2:
			var bool = iota.a;
			return bool ? 'True' : 'False';
		case 3:
			return 'Entity';
		case 4:
			var list = iota.a;
			return 'List: ' + A2(
				$elm$core$String$join,
				', ',
				$elm$core$List$reverse(
					A2(
						$elm$core$List$map,
						function (item) {
							if (item.$ === 5) {
								var pattern = item.a;
								return pattern.cb;
							} else {
								var x = item;
								return $author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsString(x);
							}
						},
						$elm$core$Array$toList(list))));
		case 5:
			var pattern = iota.a;
			return pattern.cb;
		case 7:
			var mishap = iota.a;
			var mishapMessage = function () {
				switch (mishap) {
					case 0:
						return 'Invalid Pattern';
					case 1:
						return 'Not Enough Iotas';
					case 2:
						return 'Incorrect Iota';
					case 3:
						return 'Vector Out of Ambit';
					case 4:
						return 'Entity Out of Ambit';
					case 5:
						return 'Entity is Immune';
					case 6:
						return 'Mathematical Error';
					case 7:
						return 'Incorrect Item';
					case 8:
						return 'Incorrect Block';
					case 9:
						return 'Delve Too Deep';
					case 10:
						return 'Transgress Other';
					case 11:
						return 'Disallowed Action';
					default:
						return 'Catastrophic Failure';
				}
			}();
			return 'Garbage (' + (mishapMessage + ')');
		default:
			var list = iota.a;
			return 'List: ' + A2(
				$elm$core$String$join,
				', ',
				$elm$core$List$reverse(
					A2(
						$elm$core$List$map,
						function (item) {
							if (item.$ === 5) {
								var pattern = item.a;
								return pattern.cb;
							} else {
								return '';
							}
						},
						$elm$core$Array$toList(list))));
	}
};
var $elm$html$Html$ol = _VirtualDom_node('ol');
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsHtmlMsg = function (iota) {
	var string = $author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsString(iota);
	return A2($elm$core$String$startsWith, 'List: ', string) ? ((string === 'List: ') ? _List_fromArray(
		[
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('List:')
				]))
		]) : A2(
		$elm$core$List$cons,
		A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('List:')
				])),
		$elm$core$List$singleton(
			A2(
				$elm$html$Html$ol,
				_List_Nil,
				A2(
					$elm$core$List$map,
					function (str) {
						return A2(
							$elm$html$Html$li,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(str)
								]));
					},
					A2(
						$elm$core$String$split,
						', ',
						A2($elm$core$String$dropLeft, 6, string))))))) : _List_fromArray(
		[
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text(string)
				]))
		]);
};
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			v: _List_Nil,
			r: 0,
			u: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.r * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						v: A2($elm$core$List$cons, mappedLeaf, builder.v),
						r: builder.r + 1,
						u: builder.u
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $author$project$Settings$Theme$iotaColorMap = function (iota) {
	switch (iota.$) {
		case 6:
			return '#354C3F';
		case 0:
			return '#4C3541';
		case 1:
			return '#4C3541';
		case 2:
			return '#4B4C35';
		case 3:
			return '#354B4C';
		case 4:
			return '#354C3F';
		case 5:
			return '#354C3F';
		case 7:
			return '#4F3737';
		default:
			return '#4B4845';
	}
};
var $author$project$Components$App$Panels$StackPanel$renderStack = function (stack) {
	var renderIota = F2(
		function (index, iota) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('outer_box'),
						A2(
						$elm$html$Html$Attributes$style,
						'background-color',
						$author$project$Settings$Theme$iotaColorMap(iota))
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
										$author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsHtmlMsg(iota))
									]))
							]))
					]));
		});
	return $elm$core$Array$toList(
		A2($elm$core$Array$indexedMap, renderIota, stack));
};
var $author$project$Components$App$Panels$StackPanel$stackPanel = function (model) {
	var visibility = A2($elm$core$List$member, 0, model.ek.dO);
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
				$author$project$Components$App$Panels$StackPanel$renderStack(model.d5))
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
				$author$project$Components$App$Panels$StackPanel$stackPanel(model)
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
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousemove', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$defaultOptions = {bT: true, bZ: false};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$Event = F4(
	function (keys, changedTouches, targetTouches, touches) {
		return {da: changedTouches, cr: keys, ea: targetTouches, ej: touches};
	});
var $elm$json$Json$Decode$map4 = _Json_map4;
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$Touch = F4(
	function (identifier, clientPos, pagePos, screenPos) {
		return {db: clientPos, ds: identifier, dQ: pagePos, d2: screenPos};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$touchDecoder = A5(
	$elm$json$Json$Decode$map4,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$Touch,
	A2($elm$json$Json$Decode$field, 'identifier', $elm$json$Json$Decode$int),
	$mpizenberg$elm_pointer_events$Internal$Decode$clientPos,
	$mpizenberg$elm_pointer_events$Internal$Decode$pagePos,
	$mpizenberg$elm_pointer_events$Internal$Decode$screenPos);
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
						ad: tag(ev),
						bT: options.bT,
						bZ: options.bZ
					};
				},
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$eventDecoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onMove = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onWithOptions, 'touchmove', $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$defaultOptions);
var $author$project$Logic$App$Msg$SetGridScale = function (a) {
	return {$: 8, a: a};
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$arrowDownShortWide = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'arrow-down-short-wide',
	_Utils_Tuple2(576, 512),
	_Utils_Tuple2('M320 224H416c17.67 0 32-14.33 32-32s-14.33-32-32-32h-95.1c-17.67 0-32 14.33-32 32S302.3 224 320 224zM320 352H480c17.67 0 32-14.33 32-32s-14.33-32-32-32h-159.1c-17.67 0-32 14.33-32 32S302.3 352 320 352zM320 96h32c17.67 0 31.1-14.33 31.1-32s-14.33-32-31.1-32h-32c-17.67 0-32 14.33-32 32S302.3 96 320 96zM544 416h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 416 544 416zM192.4 330.7L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-6.312-6.883-14.94-10.38-23.61-10.38c-7.719 0-15.47 2.781-21.61 8.414c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C224.6 316.8 204.4 317.7 192.4 330.7z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$arrowDownShortWide = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$arrowDownShortWide);
var $author$project$Logic$App$Msg$GridDown = function (a) {
	return {$: 5, a: a};
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousedown', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onEnd = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onWithOptions, 'touchend', $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$defaultOptions);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onStart = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onWithOptions, 'touchstart', $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$defaultOptions);
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $author$project$Components$App$Grid$getGridpointFromOffsetCoordinates = F2(
	function (grid_, offsetCoords) {
		var checkMatchingOffsetCoords = function (point) {
			return _Utils_eq(
				_Utils_Tuple2(point.A, point.B),
				_Utils_Tuple2(offsetCoords.A, offsetCoords.B));
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
					pnt.aj,
					pnt.S);
			},
			point.D);
		return A2(
			$elm$core$List$map,
			function (conPnt) {
				var conPntCoords = conPnt.a;
				var betweenOffsetValues = conPnt.b;
				var color = conPnt.c;
				return {
					aj: betweenOffsetValues,
					S: color,
					bt: {bo: conPntCoords.p, bp: point.p, bq: conPntCoords.q, br: point.q}
				};
			},
			connectedPoints);
	});
var $elm$svg$Svg$Attributes$fillOpacity = _VirtualDom_attribute('fill-opacity');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $author$project$Components$App$Grid$renderLine = F4(
	function (scale, color, coordinatePair, offsetsTuple) {
		var y2 = coordinatePair.br;
		var y1 = coordinatePair.bq;
		var x2 = coordinatePair.bp;
		var x1 = coordinatePair.bo;
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
			_Utils_Tuple2(coordinatePair.bo, coordinatePair.bq),
			_Utils_Tuple2(0.0, 0.0))) && (!_Utils_eq(
			_Utils_Tuple2(coordinatePair.bp, coordinatePair.br),
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
	var points = model.E.am.au;
	return A2(
		$elm$core$List$map,
		function (x) {
			return A4($author$project$Components$App$Grid$renderLine, model.aZ.aQ, x.S, x.bt, x.aj);
		},
		A2(
			$elm$core$List$concatMap,
			$author$project$Components$App$Grid$findLinkedPoints(model.E.bi),
			points));
};
var $author$project$Components$App$Grid$renderDrawingLine = function (model) {
	var mousePos = model.aU;
	var gridOffset = model.bn._ - model.E._;
	var drawingMode = model.E.am.dk;
	var activePoint = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Components$App$Grid$emptyGridpoint,
		$elm$core$List$head(model.E.am.au));
	return drawingMode ? _List_fromArray(
		[
			A4(
			$author$project$Components$App$Grid$renderLine,
			model.aZ.aQ,
			$author$project$Settings$Theme$accent2,
			{bo: mousePos.a - gridOffset, bp: activePoint.p, bq: mousePos.b, br: activePoint.q},
			_Utils_Tuple3(
				_Utils_Tuple2(0, 0),
				_Utils_Tuple2(0, 0),
				_Utils_Tuple2(0, 0)))
		]) : _List_Nil;
};
var $author$project$Components$App$Grid$renderLines = function (model) {
	var points = model.E.bi;
	return A2(
		$elm$core$List$map,
		function (x) {
			return A4($author$project$Components$App$Grid$renderLine, model.aZ.aQ, x.S, x.bt, x.aj);
		},
		A2(
			$elm$core$List$concatMap,
			$author$project$Components$App$Grid$findLinkedPoints(points),
			$elm$core$List$concat(points)));
};
var $author$project$Components$App$Grid$renderPoint = F4(
	function (mousePos, gridOffset, scale, point) {
		var pointScale = (!point.a5) ? $elm$core$String$fromFloat(
			A2(
				$elm$core$Basics$min,
				1,
				1 / (A2(
					$author$project$Components$App$Grid$distanceBetweenCoordinates,
					mousePos,
					_Utils_Tuple2(point.p + gridOffset, point.q)) / 30))) : $elm$core$String$fromFloat(0);
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat(point.bj * 2)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromFloat(point.bj * 2)),
					$elm$svg$Svg$Attributes$viewBox('0 0 300 280'),
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromFloat(point.p - (8 * scale)) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$core$String$fromFloat(point.q - (8 * scale))),
					A2($elm$html$Html$Attributes$style, 'transform', 'scale(' + (pointScale + ')')),
					$elm$svg$Svg$Attributes$fill(point.S)
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
				]));
	});
var $author$project$Components$App$Grid$renderPoints = function (model) {
	var scale = model.aZ.aQ;
	var points = model.E.bi;
	var mousePos = model.aU;
	var gridWidth = model.E._;
	var gridOffset = model.bn._ - gridWidth;
	return A2(
		$elm$core$List$map,
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
				return $.db;
			},
			$elm$core$List$head(touchEvent.da)));
};
var $author$project$Components$App$Grid$grid = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('hex_grid'),
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.db;
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
							$elm$core$String$fromFloat(model.E.dq)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(model.E._))
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
								$elm$html$Html$Attributes$id('sort')
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
								$author$project$Logic$App$Msg$SetGridScale(model.aZ.aQ - 0.1))
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
								$author$project$Logic$App$Msg$SetGridScale(model.aZ.aQ + 0.1))
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
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('bottom_box')
					]),
				_List_Nil)
			]));
};
var $author$project$Components$App$Content$content = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('content'),
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove(
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.db;
					},
					$author$project$Logic$App$Msg$MouseMove)),
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onMove(
				A2($elm$core$Basics$composeR, $author$project$Logic$App$Utils$Utils$touchCoordinates, $author$project$Logic$App$Msg$MouseMove)),
				$elm$html$Html$Events$onMouseUp($author$project$Logic$App$Msg$MouseUp)
			]),
		_List_fromArray(
			[
				$author$project$Components$App$LeftBox$leftBox(model),
				$author$project$Components$App$Right$right(model)
			]));
};
var $author$project$Main$view = function (model) {
	return {
		c7: _List_fromArray(
			[
				$author$project$Components$App$Content$content(model)
			]),
		ee: 'Hex Studio'
	};
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{du: $author$project$Main$init, d8: $author$project$Main$subscriptions, el: $author$project$Main$update, en: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));