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
	if (region.cq.ba === region.cH.ba)
	{
		return 'on line ' + region.cq.ba;
	}
	return 'on lines ' + region.cq.ba + ' through ' + region.cH.ba;
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
		impl.ej,
		impl.fH,
		impl.fr,
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
		ez: func(record.ez),
		dr: record.dr,
		da: record.da
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
		var message = !tag ? value : tag < 3 ? value.a : value.ez;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.dr;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.da) && event.preventDefault(),
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
		impl.ej,
		impl.fH,
		impl.fr,
		function(sendToApp, initialModel) {
			var view = impl.fJ;
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
		impl.ej,
		impl.fH,
		impl.fr,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.cp && impl.cp(sendToApp)
			var view = impl.fJ;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.dD);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.fz) && (_VirtualDom_doc.title = title = doc.fz);
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
	var onUrlChange = impl.eU;
	var onUrlRequest = impl.eV;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		cp: function(sendToApp)
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
							&& curr.de === next.de
							&& curr.cR === next.cR
							&& curr.c9.a === next.c9.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		ej: function(flags)
		{
			return A3(impl.ej, flags, _Browser_getUrl(), key);
		},
		fJ: impl.fJ,
		fH: impl.fH,
		fr: impl.fr
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
		? { ec: 'hidden', dG: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { ec: 'mozHidden', dG: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { ec: 'msHidden', dG: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { ec: 'webkitHidden', dG: 'webkitvisibilitychange' }
		: { ec: 'hidden', dG: 'visibilitychange' };
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
		dl: _Browser_getScene(),
		dx: {
			n: _Browser_window.pageXOffset,
			o: _Browser_window.pageYOffset,
			af: _Browser_doc.documentElement.clientWidth,
			cP: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		af: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		cP: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
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
			dl: {
				af: node.scrollWidth,
				cP: node.scrollHeight
			},
			dx: {
				n: node.scrollLeft,
				o: node.scrollTop,
				af: node.clientWidth,
				cP: node.clientHeight
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
			dl: _Browser_getScene(),
			dx: {
				n: x,
				o: y,
				af: _Browser_doc.documentElement.clientWidth,
				cP: _Browser_doc.documentElement.clientHeight
			},
			d3: {
				n: x + rect.left,
				o: y + rect.top,
				af: rect.width,
				cP: rect.height
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
	if (options.eG) { flags += 'm'; }
	if (options.dF) { flags += 'i'; }

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


// BYTES

function _Bytes_width(bytes)
{
	return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function(le, be)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be));
	});
});


// ENCODERS

function _Bytes_encode(encoder)
{
	var mutableBytes = new DataView(new ArrayBuffer($elm$bytes$Bytes$Encode$getWidth(encoder)));
	$elm$bytes$Bytes$Encode$write(encoder)(mutableBytes)(0);
	return mutableBytes;
}


// SIGNED INTEGERS

var _Bytes_write_i8  = F3(function(mb, i, n) { mb.setInt8(i, n); return i + 1; });
var _Bytes_write_i16 = F4(function(mb, i, n, isLE) { mb.setInt16(i, n, isLE); return i + 2; });
var _Bytes_write_i32 = F4(function(mb, i, n, isLE) { mb.setInt32(i, n, isLE); return i + 4; });


// UNSIGNED INTEGERS

var _Bytes_write_u8  = F3(function(mb, i, n) { mb.setUint8(i, n); return i + 1 ;});
var _Bytes_write_u16 = F4(function(mb, i, n, isLE) { mb.setUint16(i, n, isLE); return i + 2; });
var _Bytes_write_u32 = F4(function(mb, i, n, isLE) { mb.setUint32(i, n, isLE); return i + 4; });


// FLOATS

var _Bytes_write_f32 = F4(function(mb, i, n, isLE) { mb.setFloat32(i, n, isLE); return i + 4; });
var _Bytes_write_f64 = F4(function(mb, i, n, isLE) { mb.setFloat64(i, n, isLE); return i + 8; });


// BYTES

var _Bytes_write_bytes = F3(function(mb, offset, bytes)
{
	for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4)
	{
		mb.setUint32(offset + i, bytes.getUint32(i));
	}
	for (; i < len; i++)
	{
		mb.setUint8(offset + i, bytes.getUint8(i));
	}
	return offset + len;
});


// STRINGS

function _Bytes_getStringWidth(string)
{
	for (var width = 0, i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		width +=
			(code < 0x80) ? 1 :
			(code < 0x800) ? 2 :
			(code < 0xD800 || 0xDBFF < code) ? 3 : (i++, 4);
	}
	return width;
}

var _Bytes_write_string = F3(function(mb, offset, string)
{
	for (var i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		offset +=
			(code < 0x80)
				? (mb.setUint8(offset, code)
				, 1
				)
				:
			(code < 0x800)
				? (mb.setUint16(offset, 0xC080 /* 0b1100000010000000 */
					| (code >>> 6 & 0x1F /* 0b00011111 */) << 8
					| code & 0x3F /* 0b00111111 */)
				, 2
				)
				:
			(code < 0xD800 || 0xDBFF < code)
				? (mb.setUint16(offset, 0xE080 /* 0b1110000010000000 */
					| (code >>> 12 & 0xF /* 0b00001111 */) << 8
					| code >>> 6 & 0x3F /* 0b00111111 */)
				, mb.setUint8(offset + 2, 0x80 /* 0b10000000 */
					| code & 0x3F /* 0b00111111 */)
				, 3
				)
				:
			(code = (code - 0xD800) * 0x400 + string.charCodeAt(++i) - 0xDC00 + 0x10000
			, mb.setUint32(offset, 0xF0808080 /* 0b11110000100000001000000010000000 */
				| (code >>> 18 & 0x7 /* 0b00000111 */) << 24
				| (code >>> 12 & 0x3F /* 0b00111111 */) << 16
				| (code >>> 6 & 0x3F /* 0b00111111 */) << 8
				| code & 0x3F /* 0b00111111 */)
			, 4
			);
	}
	return offset;
});


// DECODER

var _Bytes_decode = F2(function(decoder, bytes)
{
	try {
		return $elm$core$Maybe$Just(A2(decoder, bytes, 0).b);
	} catch(e) {
		return $elm$core$Maybe$Nothing;
	}
});

var _Bytes_read_i8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getInt8(offset)); });
var _Bytes_read_i16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getInt16(offset, isLE)); });
var _Bytes_read_i32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getInt32(offset, isLE)); });
var _Bytes_read_u8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getUint8(offset)); });
var _Bytes_read_u16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getUint16(offset, isLE)); });
var _Bytes_read_u32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getUint32(offset, isLE)); });
var _Bytes_read_f32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getFloat32(offset, isLE)); });
var _Bytes_read_f64 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 8, bytes.getFloat64(offset, isLE)); });

var _Bytes_read_bytes = F3(function(len, bytes, offset)
{
	return _Utils_Tuple2(offset + len, new DataView(bytes.buffer, bytes.byteOffset + offset, len));
});

var _Bytes_read_string = F3(function(len, bytes, offset)
{
	var string = '';
	var end = offset + len;
	for (; offset < end;)
	{
		var byte = bytes.getUint8(offset++);
		string +=
			(byte < 128)
				? String.fromCharCode(byte)
				:
			((byte & 0xE0 /* 0b11100000 */) === 0xC0 /* 0b11000000 */)
				? String.fromCharCode((byte & 0x1F /* 0b00011111 */) << 6 | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */)
				:
			((byte & 0xF0 /* 0b11110000 */) === 0xE0 /* 0b11100000 */)
				? String.fromCharCode(
					(byte & 0xF /* 0b00001111 */) << 12
					| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
					| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
				)
				:
				(byte =
					((byte & 0x7 /* 0b00000111 */) << 18
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 12
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
						| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
					) - 0x10000
				, String.fromCharCode(Math.floor(byte / 0x400) + 0xD800, byte % 0x400 + 0xDC00)
				);
	}
	return _Utils_Tuple2(offset, string);
});

var _Bytes_decodeFailure = F2(function() { throw 0; });



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
		if (!builder.s) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.v),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.v);
		} else {
			var treeLen = builder.s * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.x) : builder.x;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.s);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.v) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.v);
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
					{x: nodeList, s: (len / $elm$core$Array$branchFactor) | 0, v: tail});
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
		return {cN: fragment, cR: host, c4: path, c9: port_, de: protocol, df: query};
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
var $author$project$Logic$App$Msg$ContextMenuMsg = function (a) {
	return {$: 45, a: a};
};
var $author$project$Logic$App$Msg$GetContentSize = function (a) {
	return {$: 3, a: a};
};
var $author$project$Logic$App$Msg$GetGrid = function (a) {
	return {$: 2, a: a};
};
var $author$project$Logic$App$Types$NoItem = 6;
var $author$project$Logic$App$Types$NoOverlay = 0;
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
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $jinjor$elm_contextmenu$ContextMenu$ContextMenu = $elm$core$Basics$identity;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $jinjor$elm_contextmenu$ContextMenu$init = _Utils_Tuple2(
	{bw: false, F: $elm$core$Maybe$Nothing},
	$elm$core$Platform$Cmd$none);
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $jinjor$elm_contextmenu$ContextMenu$Arrow = 0;
var $jinjor$elm_contextmenu$ContextMenu$Mirror = 1;
var $jinjor$elm_contextmenu$ContextMenu$RightBottom = 1;
var $jinjor$elm_contextmenu$ContextMenu$Shift = 0;
var $jinjor$elm_contextmenu$ContextMenu$Pointer = 1;
var $jinjor$elm_contextmenu$ContextMenu$defaultConfig = {dL: 'white', dR: 1, dW: 1, bX: 'initial', ed: 'rgb(240 240 240)', en: false, e_: 1, e$: 1, ff: false, af: 300};
var $author$project$Components$App$ContextMenu$Configs$winChrome = _Utils_update(
	$jinjor$elm_contextmenu$ContextMenu$defaultConfig,
	{dL: '#ffffff', dR: 0, dW: 1, ed: '#c7c5c5', en: false, e_: 0, e$: 1, ff: false});
var $author$project$Main$init = function (_v0) {
	var _v1 = $jinjor$elm_contextmenu$ContextMenu$init;
	var contextMenu = _v1.a;
	var msg = _v1.b;
	return _Utils_Tuple2(
		{
			bv: {
				d5: A2(
					$elm$core$Dict$singleton,
					'Caster',
					{ea: 6, eb: $elm$core$Maybe$Nothing}),
				et: $elm$core$Dict$empty,
				fa: $elm$core$Maybe$Nothing
			},
			dJ: $author$project$Components$App$ContextMenu$Configs$winChrome,
			dM: contextMenu,
			dZ: '',
			G: {
				au: {aH: _List_Nil, d$: false},
				d0: _List_Nil,
				cP: 0,
				ck: _List_Nil,
				af: 0
			},
			eh: _List_Nil,
			ek: 0,
			eq: $elm$core$Maybe$Nothing,
			ez: '',
			bb: _Utils_Tuple2(0.0, 0.0),
			c5: $elm$core$Array$empty,
			aU: 'Untitled',
			aV: {aN: 1.0},
			fn: $elm$core$Array$empty,
			fw: 0,
			fx: $elm$core$Array$empty,
			fy: 0,
			fG: {
				d_: _Utils_Tuple2(false, -1),
				cJ: '',
				eg: '',
				eE: -1,
				eX: 0,
				eY: _List_fromArray(
					[1]),
				eZ: false,
				bH: _List_Nil,
				c7: '',
				cj: _Utils_Tuple2(0, 0),
				fi: '',
				fs: 0
			},
			bO: {cP: 0.0, af: 0.0}
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
					$elm$browser$Browser$Dom$getElement('content')),
					A2($elm$core$Platform$Cmd$map, $author$project$Logic$App$Msg$ContextMenuMsg, msg)
				])));
};
var $author$project$Logic$App$Msg$HandleKeyboardEvent = function (a) {
	return {$: 43, a: a};
};
var $author$project$Logic$App$Msg$RecieveGeneratedNumberLiteral = function (a) {
	return {$: 14, a: a};
};
var $author$project$Logic$App$Msg$RecieveGridDrawingAsGIF = function (a) {
	return {$: 30, a: a};
};
var $author$project$Logic$App$Msg$RecieveGridDrawingAsImage = function (a) {
	return {$: 32, a: a};
};
var $author$project$Logic$App$Msg$RecieveInputBoundingBox = function (a) {
	return {$: 19, a: a};
};
var $author$project$Logic$App$Msg$RecieveInputBoundingBoxes = function (a) {
	return {$: 20, a: a};
};
var $author$project$Logic$App$Msg$RecieveMouseOverHandle = function (a) {
	return {$: 27, a: a};
};
var $author$project$Logic$App$Msg$Tick = function (a) {
	return {$: 10, a: a};
};
var $author$project$Logic$App$Msg$WindowResize = {$: 9};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $Gizra$elm_keyboard_event$Keyboard$Event$KeyboardEvent = F7(
	function (altKey, ctrlKey, key, keyCode, metaKey, repeat, shiftKey) {
		return {cy: altKey, dQ: ctrlKey, cV: key, ep: keyCode, eA: metaKey, fc: repeat, fk: shiftKey};
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
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$A = {$: 0};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Add = {$: 85};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Alt = {$: 32};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Ambiguous = function (a) {
	return {$: 89, a: a};
};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$B = {$: 1};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Backspace = {$: 38};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$C = {$: 2};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$CapsLock = {$: 34};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$ChromeSearch = {$: 59};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Command = {$: 58};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Ctrl = function (a) {
	return {$: 31, a: a};
};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$D = {$: 3};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Decimal = {$: 87};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Delete = {$: 39};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Divide = {$: 88};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Down = {$: 29};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$E = {$: 4};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Eight = {$: 52};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$End = {$: 42};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Enter = {$: 37};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Escape = {$: 36};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F = {$: 5};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F1 = {$: 62};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F10 = {$: 71};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F11 = {$: 72};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F12 = {$: 73};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F2 = {$: 63};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F3 = {$: 64};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F4 = {$: 65};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F5 = {$: 66};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F6 = {$: 67};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F7 = {$: 68};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F8 = {$: 69};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$F9 = {$: 70};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Five = {$: 49};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Four = {$: 48};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$G = {$: 6};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$H = {$: 7};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Home = {$: 43};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$I = {$: 8};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Insert = {$: 54};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$J = {$: 9};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$K = {$: 10};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$L = {$: 11};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Left = {$: 26};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$M = {$: 12};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Multiply = {$: 84};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$N = {$: 13};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Nine = {$: 53};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumLock = {$: 60};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadEight = {$: 82};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadFive = {$: 79};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadFour = {$: 78};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadNine = {$: 83};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadOne = {$: 75};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadSeven = {$: 81};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadSix = {$: 80};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadThree = {$: 77};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadTwo = {$: 76};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$NumpadZero = {$: 74};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$O = {$: 14};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$One = {$: 45};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$P = {$: 15};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$PageDown = {$: 41};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$PageUp = {$: 40};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$PauseBreak = {$: 56};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$PrintScreen = {$: 55};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Q = {$: 16};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$R = {$: 17};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Right = {$: 27};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$S = {$: 18};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$ScrollLock = {$: 61};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Seven = {$: 51};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Shift = function (a) {
	return {$: 30, a: a};
};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Six = {$: 50};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Spacebar = {$: 35};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Subtract = {$: 86};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$T = {$: 19};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Tab = {$: 33};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Three = {$: 47};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Two = {$: 46};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$U = {$: 20};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Unknown = function (a) {
	return {$: 90, a: a};
};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Up = {$: 28};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$V = {$: 21};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$W = {$: 22};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Windows = {$: 57};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$X = {$: 23};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Y = {$: 24};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Z = {$: 25};
var $SwiftsNamesake$proper_keyboard$Keyboard$Key$Zero = {$: 44};
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
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {dd: processes, dt: taggers};
	});
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
		var processes = _v0.dd;
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
		var _v0 = A2($elm$core$Dict$get, interval, state.dt);
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
var $author$project$Logic$App$Types$ElementLocation = F5(
	function (element, left, bottom, top, right) {
		return {bt: bottom, d3: element, er: left, bJ: right, fE: top};
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
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {c8: pids, ds: subs};
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
		return {cK: event, cV: key};
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
			state.c8,
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
		var key = _v0.cV;
		var event = _v0.cK;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.ds);
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
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, 0, 'keydown');
var $elm$browser$Browser$Events$Window = 1;
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
var $jinjor$elm_contextmenu$ContextMenu$Close = {$: 3};
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$Events$onMouseDown = A2($elm$browser$Browser$Events$on, 0, 'mousedown');
var $jinjor$elm_contextmenu$ContextMenu$Container = {$: 0};
var $elm$core$Basics$neq = _Utils_notEqual;
var $jinjor$elm_contextmenu$ContextMenu$shouldCloseOnClick = F2(
	function (closeOnDehover, openState) {
		if (!openState.$) {
			var hover = openState.a.by;
			return closeOnDehover ? false : (!_Utils_eq(hover, $jinjor$elm_contextmenu$ContextMenu$Container));
		} else {
			return true;
		}
	});
var $jinjor$elm_contextmenu$ContextMenu$subscriptions = function (_v0) {
	var model = _v0;
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2($jinjor$elm_contextmenu$ContextMenu$shouldCloseOnClick, model.bw, model.F) ? $elm$browser$Browser$Events$onMouseDown(
				$elm$json$Json$Decode$succeed($jinjor$elm_contextmenu$ContextMenu$Close)) : $elm$core$Platform$Sub$none
			]));
};
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
				$author$project$Ports$GetGridDrawingAsImage$recieveImage($author$project$Logic$App$Msg$RecieveGridDrawingAsImage),
				A2(
				$elm$core$Platform$Sub$map,
				$author$project$Logic$App$Msg$ContextMenuMsg,
				$jinjor$elm_contextmenu$ContextMenu$subscriptions(model.dM))
			]));
};
var $author$project$Logic$App$Types$Artifact = 1;
var $author$project$Logic$App$Types$Cypher = 2;
var $author$project$Logic$App$Types$East = 2;
var $author$project$Logic$App$Types$Focus = 3;
var $author$project$Logic$App$Msg$ImportProject = function (a) {
	return {$: 39, a: a};
};
var $author$project$Logic$App$Msg$ImportProjectFile = function (a) {
	return {$: 38, a: a};
};
var $author$project$Logic$App$Types$None = 0;
var $author$project$Logic$App$Types$Pie = 5;
var $author$project$Logic$App$Msg$SetTimelineIndex = function (a) {
	return {$: 42, a: a};
};
var $author$project$Logic$App$Types$Spellbook = 4;
var $author$project$Logic$App$Types$Trinket = 0;
var $author$project$Settings$Theme$accent1 = '#BAC5E2';
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
var $author$project$Logic$App$Grid$emptyGridpoint = {ah: '', L: _List_Nil, H: 0, A: 0, cl: 0, bq: false, n: 0, o: 0};
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
		var gridOffset = model.bO.af - model.G.af;
		var offsetCoords = _Utils_Tuple2(coordinates.a - gridOffset, coordinates.b);
		var distanceComparison = F2(
			function (a, b) {
				var _v0 = A2(
					$elm$core$Basics$compare,
					A2(
						$author$project$Components$App$Grid$distanceBetweenCoordinates,
						_Utils_Tuple2(a.n, a.o),
						offsetCoords),
					A2(
						$author$project$Components$App$Grid$distanceBetweenCoordinates,
						_Utils_Tuple2(b.n, b.o),
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
			$author$project$Logic$App$Grid$emptyGridpoint,
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
	var scale = model.aV.aN;
	var modelGrid = model.G;
	var otherNodes = A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		$elm$core$List$tail(modelGrid.au.aH));
	var prevPrevNode = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Logic$App$Grid$emptyGridpoint,
		$elm$core$List$head(otherNodes));
	var prevGridNode = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Logic$App$Grid$emptyGridpoint,
		$elm$core$List$head(modelGrid.au.aH));
	var prevNode = A2(
		$elm$core$Maybe$withDefault,
		prevGridNode,
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (point) {
					return _Utils_eq(
						_Utils_Tuple2(point.n, point.o),
						_Utils_Tuple2(prevGridNode.n, prevGridNode.o));
				},
				otherNodes)));
	var gridOffset = model.bO.af - model.G.af;
	var offsetMousePos = _Utils_Tuple2(model.bb.a - gridOffset, model.bb.b);
	var trimmedMousePos = function () {
		var relativeMousePos = {n: offsetMousePos.a - prevNode.n, o: offsetMousePos.b - prevNode.o};
		var theta = A2($elm$core$Basics$atan2, relativeMousePos.o, relativeMousePos.n);
		var trimmedMagnitude = A2(
			$elm$core$Basics$min,
			$elm$core$Basics$sqrt(
				A2($elm$core$Basics$pow, relativeMousePos.n, 2) + A2($elm$core$Basics$pow, relativeMousePos.o, 2)),
			$author$project$Components$App$Grid$spacing(scale));
		var _v0 = model.bb;
		return _Utils_Tuple2(
			(trimmedMagnitude * $elm$core$Basics$cos(theta)) + prevNode.n,
			(trimmedMagnitude * $elm$core$Basics$sin(theta)) + prevNode.o);
	}();
	var closestGridNode = A3(
		$author$project$Components$App$Grid$getClosestPoint,
		_Utils_Tuple2(trimmedMousePos.a + gridOffset, trimmedMousePos.b),
		modelGrid.ck,
		model);
	var closestPoint = A2(
		$elm$core$Maybe$withDefault,
		closestGridNode,
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (point) {
					return _Utils_eq(
						_Utils_Tuple2(point.n, point.o),
						_Utils_Tuple2(closestGridNode.n, closestGridNode.o));
				},
				modelGrid.au.aH)));
	var mouseDistanceCloseToPoint = _Utils_cmp(
		A2(
			$author$project$Components$App$Grid$distanceBetweenCoordinates,
			trimmedMousePos,
			_Utils_Tuple2(closestPoint.n, closestPoint.o)),
		$author$project$Components$App$Grid$spacing(scale) / 2) < 1;
	var pointCloseToPrevPoint = _Utils_cmp(
		A2(
			$author$project$Components$App$Grid$distanceBetweenCoordinates,
			_Utils_Tuple2(prevNode.n, prevNode.o),
			_Utils_Tuple2(closestPoint.n, closestPoint.o)),
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
					_Utils_Tuple2(pnt.H, pnt.A),
					_Utils_Tuple2(closestPoint.H, closestPoint.A));
			},
			prevNode.L)) || A2(
		$elm$core$List$any,
		function (x) {
			return x;
		},
		A2(
			$elm$core$List$map,
			function (pnt) {
				return _Utils_eq(
					_Utils_Tuple2(pnt.H, pnt.A),
					_Utils_Tuple2(prevNode.H, prevNode.A));
			},
			closestPoint.L)));
	var pointNotPrevPoint = !_Utils_eq(
		_Utils_Tuple2(prevNode.n, prevNode.o),
		_Utils_Tuple2(closestPoint.n, closestPoint.o));
	var pointPrevPrevPoint = _Utils_eq(
		_Utils_Tuple2(prevPrevNode.n, prevPrevNode.o),
		_Utils_Tuple2(closestPoint.n, closestPoint.o));
	return pointPrevPrevPoint ? A2(
		$elm$core$List$cons,
		_Utils_update(
			prevPrevNode,
			{
				L: A2(
					$elm$core$List$filter,
					function (pnt) {
						return !_Utils_eq(
							_Utils_Tuple2(pnt.H, pnt.A),
							_Utils_Tuple2(prevNode.H, prevNode.A));
					},
					prevPrevNode.L)
			}),
		A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$tail(otherNodes))) : ((mouseDistanceCloseToPoint && (pointCloseToPrevPoint && (pointNotConnectedToPrevPoint && (pointNotPrevPoint && (!closestPoint.bq))))) ? _Utils_ap(
		_List_fromArray(
			[
				closestPoint,
				_Utils_update(
				prevNode,
				{
					L: A2(
						$elm$core$List$cons,
						{
							aq: _Utils_Tuple3(
								_Utils_Tuple2(0, 0),
								_Utils_Tuple2(0, 0),
								_Utils_Tuple2(0, 0)),
							ah: $author$project$Settings$Theme$accent2,
							H: closestPoint.H,
							A: closestPoint.A
						},
						prevNode.L)
				})
			]),
		otherNodes) : modelGrid.au.aH);
};
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.v)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.v, tail);
		return (notAppended < 0) ? {
			x: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.x),
			s: builder.s + 1,
			v: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			x: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.x),
			s: builder.s + 1,
			v: $elm$core$Elm$JsArray$empty
		} : {x: builder.x, s: builder.s, v: appended});
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
		x: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		s: (len / $elm$core$Array$branchFactor) | 0,
		v: tail
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
						x: _List_Nil,
						s: 0,
						v: A3(
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
						L: A2(
							$elm$core$List$map,
							function (conPnt) {
								return _Utils_update(
									conPnt,
									{
										ah: (!patternTuple.a.cw) ? 'grey' : patternTuple.a.ah
									});
							},
							pnt.L)
					});
			},
			patternTuple.b));
};
var $author$project$Logic$App$PatternList$PatternArray$addToPatternArray = F3(
	function (model, pattern, index) {
		var patternArray = model.c5;
		var drawing = model.G.au;
		var patternDrawingPair = _Utils_Tuple2(pattern, drawing.aH);
		return A3(
			$elm_community$array_extra$Array$Extra$insertAt,
			index,
			$author$project$Logic$App$PatternList$PatternArray$updateDrawingColors(patternDrawingPair),
			patternArray);
	});
var $author$project$Settings$Theme$accent4 = '#dd6666';
var $author$project$Settings$Theme$accent5 = '#E0E3B8';
var $author$project$Logic$App$PatternList$PatternArray$applyColorToPatternFromResult = F2(
	function (pattern, result) {
		switch (result) {
			case 0:
				return _Utils_update(
					pattern,
					{ah: $author$project$Settings$Theme$accent1});
			case 1:
				return _Utils_update(
					pattern,
					{ah: $author$project$Settings$Theme$accent4});
			default:
				return _Utils_update(
					pattern,
					{ah: $author$project$Settings$Theme$accent5});
		}
	});
var $author$project$Logic$App$Types$PatternIota = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Logic$App$Types$CatastrophicFailure = 12;
var $author$project$Logic$App$Types$Considered = 2;
var $author$project$Logic$App$Types$Failed = 1;
var $author$project$Logic$App$Types$Garbage = function (a) {
	return {$: 7, a: a};
};
var $author$project$Logic$App$Types$IncorrectIota = 2;
var $author$project$Logic$App$Types$IotaList = function (a) {
	return {$: 4, a: a};
};
var $author$project$Logic$App$Types$NotEnoughIotas = 1;
var $author$project$Logic$App$Types$Null = {$: 6};
var $author$project$Logic$App$Types$NullType = {$: 6};
var $author$project$Logic$App$Types$OpenParenthesis = function (a) {
	return {$: 8, a: a};
};
var $author$project$Logic$App$Types$Succeeded = 0;
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
					{x: nodeList, s: nodeListSize, v: jsArray});
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
		if ((!_v0.$) && (_v0.a.$ === 8)) {
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
var $author$project$Logic$App$Patterns$OperatorUtils$getIotaList = function (iota) {
	if (iota.$ === 4) {
		return $elm$core$Maybe$Just(iota);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Patterns$OperatorUtils$getPatternOrIotaList = function (iota) {
	switch (iota.$) {
		case 5:
			return $elm$core$Maybe$Just(iota);
		case 4:
			return $elm$core$Maybe$Just(iota);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Utils$Utils$isJust = function (maybe) {
	if (!maybe.$) {
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
var $elm_community$array_extra$Array$Extra$reverseToList = A2($elm$core$Array$foldl, $elm$core$List$cons, _List_Nil);
var $elm_community$array_extra$Array$Extra$reverse = A2($elm$core$Basics$composeR, $elm_community$array_extra$Array$Extra$reverseToList, $elm$core$Array$fromList);
var $author$project$Logic$App$Stack$EvalStack$applyPatternToStack = F4(
	function (stack, ctx, pattern, index) {
		var _v13 = A2($elm$core$Array$get, 0, stack);
		if ((!_v13.$) && (_v13.a.$ === 8)) {
			var list = _v13.a.a;
			var numberOfOpenParen = 1 + $elm$core$Array$length(
				A2(
					$elm$core$Array$filter,
					function (iota) {
						if ((iota.$ === 5) && (!iota.b)) {
							var pat = iota.a;
							return pat.el === 'open_paren';
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
							return pat.el === 'close_paren';
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
			if (pattern.el === 'escape') {
				return {
					B: true,
					a$: ctx,
					z: 0,
					fn: stack,
					fx: $elm$core$Array$fromList(
						_List_fromArray(
							[
								{c6: index, fn: stack}
							]))
				};
			} else {
				if (pattern.el === 'close_paren') {
					if ((pattern.el === 'close_paren') && (_Utils_cmp(numberOfCloseParen + 1, numberOfOpenParen) > -1)) {
						var newStack = A2(
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
							stack);
						return {
							B: false,
							a$: ctx,
							z: 0,
							fn: newStack,
							fx: $elm$core$Array$fromList(
								_List_fromArray(
									[
										{c6: index, fn: newStack}
									]))
						};
					} else {
						return {
							B: false,
							a$: ctx,
							z: 2,
							fn: addToIntroList,
							fx: $elm$core$Array$fromList(
								_List_fromArray(
									[
										{c6: index, fn: addToIntroList}
									]))
						};
					}
				} else {
					return {
						B: false,
						a$: ctx,
						z: 2,
						fn: addToIntroList,
						fx: $elm$core$Array$fromList(
							_List_fromArray(
								[
									{c6: index, fn: addToIntroList}
								]))
					};
				}
			}
		} else {
			if (pattern.el === 'escape') {
				return {
					B: true,
					a$: ctx,
					z: 0,
					fn: stack,
					fx: $elm$core$Array$fromList(
						_List_fromArray(
							[
								{c6: index, fn: stack}
							]))
				};
			} else {
				if (pattern.el === 'close_paren') {
					return {
						B: false,
						a$: ctx,
						z: 1,
						fn: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							A2($author$project$Logic$App$Types$PatternIota, pattern, false),
							stack),
						fx: $elm$core$Array$fromList(
							_List_fromArray(
								[
									{c6: index, fn: stack}
								]))
					};
				} else {
					if (pattern.el === 'eval') {
						var actionResult = A2($author$project$Logic$App$Stack$EvalStack$eval, stack, ctx);
						return actionResult.bh ? {
							B: false,
							a$: actionResult.a$,
							z: 0,
							fn: actionResult.fn,
							fx: A2(
								$elm$core$Array$map,
								function (x) {
									return {c6: index, fn: x};
								},
								actionResult.r)
						} : {
							B: false,
							a$: actionResult.a$,
							z: 1,
							fn: actionResult.fn,
							fx: A2(
								$elm$core$Array$map,
								function (x) {
									return {c6: index, fn: x};
								},
								actionResult.r)
						};
					} else {
						if (pattern.el === 'for_each') {
							var actionResult = A2($author$project$Logic$App$Stack$EvalStack$forEach, stack, ctx);
							return actionResult.bh ? {
								B: false,
								a$: actionResult.a$,
								z: 0,
								fn: actionResult.fn,
								fx: A2(
									$elm$core$Array$map,
									function (x) {
										return {c6: index, fn: x};
									},
									actionResult.r)
							} : {
								B: false,
								a$: actionResult.a$,
								z: 1,
								fn: actionResult.fn,
								fx: A2(
									$elm$core$Array$map,
									function (x) {
										return {c6: index, fn: x};
									},
									actionResult.r)
							};
						} else {
							var _v17 = A2($elm$core$Dict$get, pattern.fl, ctx.et);
							if (!_v17.$) {
								var _v18 = _v17.a;
								var iota = _v18.c;
								var actionResult = A2(
									$author$project$Logic$App$Stack$EvalStack$eval,
									A2($author$project$Logic$App$Utils$Utils$unshift, iota, stack),
									ctx);
								return actionResult.bh ? {
									B: false,
									a$: actionResult.a$,
									z: 0,
									fn: actionResult.fn,
									fx: A2(
										$elm$core$Array$map,
										function (x) {
											return {c6: index, fn: x};
										},
										actionResult.r)
								} : {
									B: false,
									a$: actionResult.a$,
									z: 1,
									fn: actionResult.fn,
									fx: A2(
										$elm$core$Array$map,
										function (x) {
											return {c6: index, fn: x};
										},
										actionResult.r)
								};
							} else {
								var actionResult = function () {
									var preActionResult = A2(pattern.a, stack, ctx);
									return (preActionResult.bh && $author$project$Logic$App$Utils$Utils$isJust(pattern._)) ? _Utils_update(
										preActionResult,
										{
											fn: A2(
												$author$project$Logic$App$Utils$Utils$unshift,
												A2(
													$elm$core$Maybe$withDefault,
													_Utils_Tuple2($author$project$Logic$App$Types$NullType, $author$project$Logic$App$Types$Null),
													pattern._).b,
												preActionResult.fn)
										}) : preActionResult;
								}();
								return actionResult.bh ? {
									B: false,
									a$: actionResult.a$,
									z: 0,
									fn: actionResult.fn,
									fx: $elm$core$Array$fromList(
										_List_fromArray(
											[
												{c6: index, fn: actionResult.fn}
											]))
								} : {
									B: false,
									a$: actionResult.a$,
									z: 1,
									fn: actionResult.fn,
									fx: $elm$core$Array$fromList(
										_List_fromArray(
											[
												{c6: index, fn: actionResult.fn}
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
			var maybeIota = function () {
				var _v11 = $elm$core$List$head(patterns);
				if ((!_v11.$) && (_v11.a.$ === 5)) {
					var _v12 = _v11.a;
					var pattern = _v12.a;
					var considered = _v12.b;
					return (pattern.el === 'constant') ? A2(
						$elm$core$Array$get,
						0,
						A2(pattern.a, $elm$core$Array$empty, ctx).fn) : $elm$core$Maybe$Just(
						A2($author$project$Logic$App$Types$PatternIota, pattern, considered));
				} else {
					var head = _v11;
					return head;
				}
			}();
			var introspection = function () {
				var _v10 = A2($elm$core$Array$get, 0, stack);
				if ((!_v10.$) && (_v10.a.$ === 8)) {
					return true;
				} else {
					return false;
				}
			}();
			if (maybeIota.$ === 1) {
				return {a$: ctx, aj: false, aO: false, dj: resultArray, fn: stack, fx: timeline};
			} else {
				if (maybeIota.a.$ === 5) {
					var _v9 = maybeIota.a;
					var pattern = _v9.a;
					if (considerThis) {
						var applyResult = _Utils_Tuple2(
							A2(
								$author$project$Logic$App$Stack$EvalStack$addEscapedIotaToStack,
								stack,
								A2($author$project$Logic$App$Types$PatternIota, pattern, true)),
							A2($author$project$Logic$App$Utils$Utils$unshift, 2, resultArray));
						var $temp$stackResultTuple = applyResult,
							$temp$ctx = ctx,
							$temp$patterns = A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							$elm$core$List$tail(patterns)),
							$temp$currentIndex = currentIndex + 1,
							$temp$timeline = A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							{c6: currentIndex, fn: applyResult.a},
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
						if ((pattern.el === 'halt') && stopAtErrorOrHalt) {
							return {a$: ctx, aj: false, aO: true, dj: resultArray, fn: stack, fx: timeline};
						} else {
							var applyResult = A4($author$project$Logic$App$Stack$EvalStack$applyPatternToStack, stack, ctx, pattern, currentIndex);
							if ((!stopAtErrorOrHalt) || (stopAtErrorOrHalt && (applyResult.z !== 1))) {
								var $temp$stackResultTuple = _Utils_Tuple2(
									applyResult.fn,
									A2($author$project$Logic$App$Utils$Utils$unshift, applyResult.z, resultArray)),
									$temp$ctx = applyResult.a$,
									$temp$patterns = A2(
									$elm$core$Maybe$withDefault,
									_List_Nil,
									$elm$core$List$tail(patterns)),
									$temp$currentIndex = currentIndex + 1,
									$temp$timeline = A2($elm$core$Array$append, applyResult.fx, timeline),
									$temp$considerThis = applyResult.B,
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
									a$: applyResult.a$,
									aj: true,
									aO: false,
									dj: A2($author$project$Logic$App$Utils$Utils$unshift, applyResult.z, resultArray),
									fn: applyResult.fn,
									fx: A2(
										$author$project$Logic$App$Utils$Utils$unshift,
										{c6: currentIndex, fn: applyResult.fn},
										timeline)
								};
							}
						}
					}
				} else {
					var iota = maybeIota.a;
					if (considerThis || introspection) {
						var applyResult = _Utils_Tuple2(
							A2($author$project$Logic$App$Stack$EvalStack$addEscapedIotaToStack, stack, iota),
							A2($author$project$Logic$App$Utils$Utils$unshift, 2, resultArray));
						var $temp$stackResultTuple = applyResult,
							$temp$ctx = ctx,
							$temp$patterns = A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							$elm$core$List$tail(patterns)),
							$temp$currentIndex = currentIndex + 1,
							$temp$timeline = A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							{c6: currentIndex, fn: applyResult.a},
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
						return {a$: ctx, aj: true, aO: false, dj: resultArray, fn: stack, fx: timeline};
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
		if (maybeIota.$ === 1) {
			return {
				r: $elm$core$Array$fromList(
					_List_fromArray(
						[
							A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage(1),
							newStack)
						])),
				a$: ctx,
				fn: A2(
					$author$project$Logic$App$Utils$Utils$unshift,
					$author$project$Logic$App$Types$Garbage(1),
					newStack),
				bh: false
			};
		} else {
			var iota = maybeIota.a;
			var _v5 = $author$project$Logic$App$Patterns$OperatorUtils$getPatternOrIotaList(iota);
			if (_v5.$ === 1) {
				return {
					r: $elm$core$Array$fromList(
						_List_fromArray(
							[
								A2(
								$author$project$Logic$App$Utils$Utils$unshift,
								$author$project$Logic$App$Types$Garbage(2),
								newStack)
							])),
					a$: ctx,
					fn: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage(2),
						newStack),
					bh: false
				};
			} else {
				switch (iota.$) {
					case 4:
						var list = iota.a;
						var applyResult = A3($author$project$Logic$App$Stack$EvalStack$applyToStackStopAtErrorOrHalt, newStack, ctx, list);
						return {
							r: A2(
								$elm$core$Array$map,
								function (x) {
									return x.fn;
								},
								applyResult.fx),
							a$: applyResult.a$,
							fn: A2(
								$elm$core$Array$filter,
								function (i) {
									if (i.$ === 8) {
										return false;
									} else {
										return true;
									}
								},
								applyResult.fn),
							bh: !applyResult.aj
						};
					case 5:
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
							r: A2(
								$elm$core$Array$map,
								function (x) {
									return x.fn;
								},
								applyResult.fx),
							a$: applyResult.a$,
							fn: applyResult.fn,
							bh: !applyResult.aj
						};
					default:
						return {
							r: $elm$core$Array$fromList(
								_List_fromArray(
									[
										$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$Logic$App$Types$Garbage(12)
											]))
									])),
							a$: ctx,
							fn: $elm$core$Array$fromList(
								_List_fromArray(
									[
										$author$project$Logic$App$Types$Garbage(12)
									])),
							bh: false
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
				r: $elm$core$Array$fromList(
					_List_fromArray(
						[newNewStack])),
				a$: ctx,
				fn: newNewStack,
				bh: false
			};
		} else {
			var _v0 = _Utils_Tuple2(
				A2($elm$core$Maybe$map, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, maybeIota1),
				A2($elm$core$Maybe$map, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, maybeIota2));
			if ((!_v0.a.$) && (!_v0.b.$)) {
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
									$author$project$Logic$App$Types$Garbage(2),
									iota1),
									A2(
									$elm$core$Maybe$withDefault,
									$author$project$Logic$App$Types$Garbage(2),
									iota2)
								])),
						newStack);
					return {
						r: $elm$core$Array$fromList(
							_List_fromArray(
								[newNewStack])),
						a$: ctx,
						fn: newNewStack,
						bh: false
					};
				} else {
					var _v1 = _Utils_Tuple2(iota1, iota2);
					if ((((!_v1.a.$) && (_v1.a.a.$ === 4)) && (!_v1.b.$)) && (_v1.b.a.$ === 4)) {
						var patternList = _v1.a.a.a;
						var iotaList = _v1.b.a.a;
						var applyResult = A3(
							$elm$core$Array$foldl,
							F2(
								function (iota, accumulator) {
									if (!accumulator.bV) {
										return accumulator;
									} else {
										var thothList = function () {
											var _v3 = A2($elm$core$Array$get, 0, accumulator.fn);
											if ((!_v3.$) && (_v3.a.$ === 4)) {
												var list = _v3.a.a;
												return list;
											} else {
												return $elm$core$Array$empty;
											}
										}();
										var subApplyResult = A3(
											$author$project$Logic$App$Stack$EvalStack$applyToStackStopAtErrorOrHalt,
											A2($author$project$Logic$App$Utils$Utils$unshift, iota, newStack),
											accumulator.a$,
											patternList);
										var success = (accumulator.bh && subApplyResult.aj) ? false : accumulator.bh;
										return {
											r: A2(
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
																$elm_community$array_extra$Array$Extra$reverse(subApplyResult.fn))),
														accumulator.fn),
													A2(
														$elm$core$Array$map,
														function (x) {
															return x.fn;
														},
														subApplyResult.fx)),
												accumulator.r),
											bV: ((!success) || subApplyResult.aO) ? false : true,
											a$: subApplyResult.a$,
											fn: A3(
												$elm$core$Array$set,
												0,
												$author$project$Logic$App$Types$IotaList(
													A2(
														$elm$core$Array$append,
														thothList,
														$elm_community$array_extra$Array$Extra$reverse(subApplyResult.fn))),
												accumulator.fn),
											bh: success
										};
									}
								}),
							{
								r: $elm$core$Array$empty,
								bV: true,
								a$: ctx,
								fn: A2(
									$author$project$Logic$App$Utils$Utils$unshift,
									$author$project$Logic$App$Types$IotaList($elm$core$Array$empty),
									newStack),
								bh: true
							},
							iotaList);
						return {
							r: applyResult.r,
							a$: applyResult.a$,
							fn: A2(
								$elm$core$Array$filter,
								function (i) {
									if (i.$ === 8) {
										return false;
									} else {
										return true;
									}
								},
								applyResult.fn),
							bh: applyResult.bh
						};
					} else {
						return {
							r: $elm$core$Array$fromList(
								_List_fromArray(
									[
										$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$Logic$App$Types$Garbage(12)
											]))
									])),
							a$: ctx,
							fn: $elm$core$Array$fromList(
								_List_fromArray(
									[
										$author$project$Logic$App$Types$Garbage(12)
									])),
							bh: false
						};
					}
				}
			} else {
				return {
					r: $elm$core$Array$fromList(
						_List_fromArray(
							[
								A2(
								$author$project$Logic$App$Utils$Utils$unshift,
								$author$project$Logic$App$Types$Garbage(12),
								newStack)
							])),
					a$: ctx,
					fn: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage(12),
						newStack),
					bh: false
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
var $author$project$Logic$App$Grid$applyUsedPointsToGrid = F2(
	function (gridPoints, pointsToChange) {
		var replace = function (pnt) {
			var replacedPnt = $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (activePnt) {
						return _Utils_eq(
							_Utils_Tuple2(activePnt.H, activePnt.A),
							_Utils_Tuple2(pnt.H, pnt.A));
					},
					pointsToChange));
			if (!replacedPnt.$) {
				return _Utils_update(
					pnt,
					{bq: true});
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
						{ah: $author$project$Settings$Theme$accent1, L: _List_Nil, bq: false});
				},
				row);
		},
		points);
};
var $author$project$Logic$App$Types$ErrorDirection = 6;
var $author$project$Logic$App$Types$Northeast = 0;
var $author$project$Logic$App$Types$Northwest = 1;
var $author$project$Logic$App$Types$Southeast = 4;
var $author$project$Logic$App$Types$Southwest = 5;
var $author$project$Logic$App$Types$West = 3;
var $author$project$Logic$App$Utils$DirectionMap$directionMap = _List_fromArray(
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
var $author$project$Logic$App$Utils$LetterMap$letterMap = _List_fromArray(
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
				$author$project$Logic$App$Grid$emptyGridpoint,
				{ah: point.ah, H: point.H, A: point.A, bq: true});
		};
		var gridpointToPointConnection = function (point) {
			return {
				aq: _Utils_Tuple3(
					_Utils_Tuple2(0, 0),
					_Utils_Tuple2(0, 0),
					_Utils_Tuple2(0, 0)),
				ah: pattern.ah,
				H: point.H,
				A: point.A
			};
		};
		var getbottomAndRightBound = F2(
			function (coord, accumulator) {
				var x = coord.a;
				var y = coord.b;
				return {
					bt: A2($elm$core$Basics$max, y, accumulator.bt),
					bJ: A2($elm$core$Basics$max, x, accumulator.bJ)
				};
			});
		var getNextDirection = F2(
			function (prevDirection, angle) {
				return A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(
						'',
						_Utils_Tuple2(6, 6)),
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
							2,
							$elm$core$List$head(accumulator)),
						angle),
					accumulator);
			});
		var getLeftmostAndTopmostValues = F2(
			function (coord, accumulator) {
				var x = coord.a;
				var y = coord.b;
				return {
					n: A2($elm$core$Basics$min, x, accumulator.n),
					o: A2($elm$core$Basics$min, y, accumulator.o)
				};
			});
		var directionToCoord = function (direction) {
			return A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(
					6,
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
				if (!_v1.$) {
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
							[pattern.dq, pattern.dq]),
						A2($elm$core$String$split, '', pattern.fl)))));
		var leftmostAndTopmostValues = A3(
			$elm$core$List$foldl,
			getLeftmostAndTopmostValues,
			{n: 0, o: 0},
			pathCoords);
		var coordToPointConnection = function (coord) {
			return {
				aq: _Utils_Tuple3(
					_Utils_Tuple2(0, 0),
					_Utils_Tuple2(0, 0),
					_Utils_Tuple2(0, 0)),
				ah: pattern.ah,
				H: coord.a,
				A: coord.b
			};
		};
		var connectPoints = F2(
			function (point, accumulator) {
				var prevPoint = accumulator.a;
				var drawing = accumulator.b;
				var _v0 = $elm$core$List$head(drawing);
				if (!_v0.$) {
					return A2(
						$elm$core$List$any,
						function (x) {
							return _Utils_eq(
								_Utils_Tuple2(x.H, x.A),
								_Utils_Tuple2(point.H, point.A));
						},
						drawing) ? _Utils_Tuple2(
						point,
						A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_eq(
									_Utils_Tuple2(x.H, x.A),
									_Utils_Tuple2(point.H, point.A)) ? _Utils_update(
									x,
									{
										L: A2(
											$elm$core$List$cons,
											gridpointToPointConnection(prevPoint),
											x.L)
									}) : x;
							},
							drawing)) : _Utils_Tuple2(
						point,
						A2(
							$elm$core$List$cons,
							_Utils_update(
								point,
								{
									L: _List_fromArray(
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
			_Utils_Tuple2($author$project$Logic$App$Grid$emptyGridpoint, _List_Nil),
			A2(
				$elm$core$List$map,
				function (x) {
					return pointConnectionToGridPoint(
						coordToPointConnection(x));
				},
				A3(
					$elm$core$List$foldl,
					A2(positionCoords, xOffset - leftmostAndTopmostValues.n, yOffset - leftmostAndTopmostValues.o),
					_List_Nil,
					pathCoords))).b;
		var bottomAndRightBound = A3(
			$elm$core$List$foldl,
			getbottomAndRightBound,
			{bt: 0, bJ: 0},
			A3(
				$elm$core$List$foldl,
				A2(positionCoords, xOffset - leftmostAndTopmostValues.n, yOffset - leftmostAndTopmostValues.o),
				_List_Nil,
				pathCoords));
		return {aI: bottomAndRightBound.bt, ck: grid, aC: bottomAndRightBound.bJ};
	});
var $author$project$Logic$App$Grid$updateCoords = F2(
	function (gridPoints, pointsToUpdate) {
		var update = F2(
			function (pnt, accumulator) {
				var replacedPnt = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (activePnt) {
							return _Utils_eq(
								_Utils_Tuple2(activePnt.H, activePnt.A),
								_Utils_Tuple2(pnt.H, pnt.A));
						},
						$elm$core$List$concat(gridPoints)));
				if (!replacedPnt.$) {
					var point = replacedPnt.a;
					return A2(
						$elm$core$List$cons,
						_Utils_update(
							pnt,
							{ah: $author$project$Settings$Theme$accent2, bq: true, n: point.n, o: point.o}),
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
				$elm$core$List$head(grid.ck))));
		var addPatternToGrid = F2(
			function (pattern, accumulator) {
				var attemptDrawPatternResult = A3($author$project$Logic$App$Grid$drawPattern, accumulator.cu, accumulator.aG, pattern);
				var drawPatternResult = function () {
					if (_Utils_cmp(attemptDrawPatternResult.aC, gridOffsetWidth) < 0) {
						return {
							aI: attemptDrawPatternResult.aI,
							ck: A2($author$project$Logic$App$Grid$updateCoords, grid.ck, attemptDrawPatternResult.ck),
							aC: attemptDrawPatternResult.aC,
							aG: accumulator.aG
						};
					} else {
						var drawPatternResultOld = A3($author$project$Logic$App$Grid$drawPattern, 0, accumulator.a0 + 1, pattern);
						return {
							aI: drawPatternResultOld.aI,
							ck: A2($author$project$Logic$App$Grid$updateCoords, grid.ck, drawPatternResultOld.ck),
							aC: drawPatternResultOld.aC,
							aG: accumulator.a0 + 1
						};
					}
				}();
				return {
					a0: A2($elm$core$Basics$max, accumulator.a0, drawPatternResult.aI),
					c5: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						_Utils_Tuple2(pattern, drawPatternResult.ck),
						accumulator.c5),
					ck: _Utils_ap(accumulator.ck, drawPatternResult.ck),
					cu: drawPatternResult.aC + 1,
					aG: drawPatternResult.aG
				};
			});
		var drawPatternsResult = A3(
			$elm$core$Array$foldr,
			addPatternToGrid,
			{a0: 0, c5: $elm$core$Array$empty, ck: _List_Nil, cu: 0, aG: 0},
			patterns);
		return {
			G: _Utils_update(
				grid,
				{
					d0: drawPatternsResult.ck,
					ck: A2(
						$author$project$Logic$App$Grid$applyUsedPointsToGrid,
						$author$project$Logic$App$Grid$clearGrid(grid.ck),
						drawPatternsResult.ck)
				}),
			c5: drawPatternsResult.c5
		};
	});
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {ei: index, cY: match, eJ: number, fq: submatches};
	});
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{dF: false, eG: false},
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
var $author$project$Logic$App$Types$Boolean = function (a) {
	return {$: 2, a: a};
};
var $author$project$Logic$App$Types$EntityType = {$: 3};
var $author$project$Logic$App$Types$IotaListType = function (a) {
	return {$: 4, a: a};
};
var $author$project$Logic$App$Types$MathematicalError = 6;
var $author$project$Logic$App$Types$Number = function (a) {
	return {$: 0, a: a};
};
var $author$project$Logic$App$Types$NumberType = {$: 0};
var $author$project$Logic$App$Types$Vector = function (a) {
	return {$: 1, a: a};
};
var $author$project$Logic$App$Types$VectorType = {$: 1};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
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
				case 0:
					var number = i.a;
					return $elm$core$Basics$isNaN(number) || $elm$core$Basics$isInfinite(number);
				case 1:
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
		if (maybeIota.$ === 1) {
			return {
				a$: ctx,
				fn: A2(
					$author$project$Logic$App$Utils$Utils$unshift,
					$author$project$Logic$App$Types$Garbage(1),
					newStack),
				bh: false
			};
		} else {
			var iota = maybeIota.a;
			var _v1 = inputGetter(iota);
			if (_v1.$ === 1) {
				return {
					a$: ctx,
					fn: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage(2),
						newStack),
					bh: false
				};
			} else {
				var actionResult = A2(action, iota, ctx);
				return $author$project$Logic$App$Patterns$OperatorUtils$nanOrInfinityCheck(actionResult.a) ? {
					a$: actionResult.b,
					fn: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage(6),
						stack),
					bh: false
				} : {
					a$: actionResult.b,
					fn: A2($elm$core$Array$append, actionResult.a, newStack),
					bh: true
				};
			}
		}
	});
var $ianmackenzie$elm_geometry$Geometry$Types$Vector3d = $elm$core$Basics$identity;
var $ianmackenzie$elm_geometry$Vector3d$xyz = F3(
	function (_v0, _v1, _v2) {
		var x = _v0;
		var y = _v1;
		var z = _v2;
		return {n: x, o: y, K: z};
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
			return $elm$core$Maybe$Just(iota);
		case 0:
			return $elm$core$Maybe$Just(iota);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $ianmackenzie$elm_units$Quantity$Quantity = $elm$core$Basics$identity;
var $ianmackenzie$elm_units$Quantity$zero = 0;
var $ianmackenzie$elm_geometry$Vector3d$length = function (_v0) {
	var v = _v0;
	var largestComponent = A2(
		$elm$core$Basics$max,
		$elm$core$Basics$abs(v.n),
		A2(
			$elm$core$Basics$max,
			$elm$core$Basics$abs(v.o),
			$elm$core$Basics$abs(v.K)));
	if (!largestComponent) {
		return $ianmackenzie$elm_units$Quantity$zero;
	} else {
		var scaledZ = v.K / largestComponent;
		var scaledY = v.o / largestComponent;
		var scaledX = v.n / largestComponent;
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
var $author$project$Logic$App$Patterns$Math$absLen = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v1) {
				return _Utils_Tuple2(
					function () {
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
				a$: ctx,
				fn: A2(
					$elm$core$Array$append,
					A2(
						$elm$core$Array$map,
						$author$project$Logic$App$Patterns$OperatorUtils$mapNothingToMissingIota,
						$elm$core$Array$fromList(
							$author$project$Logic$App$Patterns$OperatorUtils$moveNothingsToFront(
								_List_fromArray(
									[maybeIota1, maybeIota2])))),
					newStack),
				bh: false
			};
		} else {
			var _v0 = _Utils_Tuple2(
				A2($elm$core$Maybe$map, inputGetter1, maybeIota1),
				A2($elm$core$Maybe$map, inputGetter2, maybeIota2));
			if ((!_v0.a.$) && (!_v0.b.$)) {
				var iota1 = _v0.a.a;
				var iota2 = _v0.b.a;
				if (_Utils_eq(iota1, $elm$core$Maybe$Nothing) || _Utils_eq(iota2, $elm$core$Maybe$Nothing)) {
					return {
						a$: ctx,
						fn: A2(
							$elm$core$Array$append,
							$elm$core$Array$fromList(
								_List_fromArray(
									[
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Garbage(2),
										iota1),
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Garbage(2),
										iota2)
									])),
							newStack),
						bh: false
					};
				} else {
					var actionResult = A3(
						action,
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage(2),
							iota1),
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage(2),
							iota2),
						ctx);
					return $author$project$Logic$App$Patterns$OperatorUtils$nanOrInfinityCheck(actionResult.a) ? {
						a$: actionResult.b,
						fn: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage(6),
							stack),
						bh: false
					} : {
						a$: actionResult.b,
						fn: A2($elm$core$Array$append, actionResult.a, newStack),
						bh: true
					};
				}
			} else {
				return {
					a$: ctx,
					fn: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage(12),
						newStack),
					bh: false
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
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumberOrVector, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$getEntity = function (iota) {
	if (iota.$ === 3) {
		return $elm$core$Maybe$Just(iota);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Patterns$OperatorUtils$getVector = function (iota) {
	if (iota.$ === 1) {
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
		var y = _v0;
		var x = _v1;
		return _Utils_cmp(x, y) < 1;
	});
var $ianmackenzie$elm_geometry$Vector3d$minus = F2(
	function (_v0, _v1) {
		var v2 = _v0;
		var v1 = _v1;
		return {n: v1.n - v2.n, o: v1.o - v2.o, K: v1.K - v2.K};
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
						return _Utils_eq(pattern1.fl, pattern2.fl);
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
				number) ? $elm$core$Maybe$Just(iota) : $elm$core$Maybe$Nothing;
		case 4:
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
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, $author$project$Logic$App$Patterns$OperatorUtils$getIntegerOrList, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$getBoolean = function (iota) {
	if (iota.$ === 2) {
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
						if (listIota.$ === 4) {
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
								$author$project$Logic$App$Types$Garbage(12));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $elm$core$Basics$acos = _Basics_acos;
var $author$project$Logic$App$Patterns$OperatorUtils$getNumber = function (iota) {
	if (!iota.$) {
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
				a$: ctx,
				fn: A2(
					$elm$core$Array$append,
					A2(
						$elm$core$Array$map,
						$author$project$Logic$App$Patterns$OperatorUtils$mapNothingToMissingIota,
						$elm$core$Array$fromList(
							$author$project$Logic$App$Patterns$OperatorUtils$moveNothingsToFront(
								_List_fromArray(
									[maybeIota1, maybeIota2, maybeIota3])))),
					newStack),
				bh: false
			};
		} else {
			var _v0 = _Utils_Tuple3(
				A2($elm$core$Maybe$map, inputGetter1, maybeIota1),
				A2($elm$core$Maybe$map, inputGetter2, maybeIota2),
				A2($elm$core$Maybe$map, inputGetter3, maybeIota3));
			if (((!_v0.a.$) && (!_v0.b.$)) && (!_v0.c.$)) {
				var iota1 = _v0.a.a;
				var iota2 = _v0.b.a;
				var iota3 = _v0.c.a;
				if (_Utils_eq(iota1, $elm$core$Maybe$Nothing) || (_Utils_eq(iota2, $elm$core$Maybe$Nothing) || _Utils_eq(iota3, $elm$core$Maybe$Nothing))) {
					return {
						a$: ctx,
						fn: A2(
							$elm$core$Array$append,
							$elm$core$Array$fromList(
								_List_fromArray(
									[
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Garbage(2),
										iota1),
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Garbage(2),
										iota2),
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Garbage(2),
										iota3)
									])),
							newStack),
						bh: false
					};
				} else {
					var actionResult = A4(
						action,
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage(2),
							iota1),
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage(2),
							iota2),
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage(2),
							iota3),
						ctx);
					return $author$project$Logic$App$Patterns$OperatorUtils$nanOrInfinityCheck(actionResult.a) ? {
						a$: actionResult.b,
						fn: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage(6),
							stack),
						bh: false
					} : {
						a$: actionResult.b,
						fn: A2($elm$core$Array$append, actionResult.a, newStack),
						bh: true
					};
				}
			} else {
				return {
					a$: ctx,
					fn: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage(12),
						newStack),
					bh: false
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
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Grid$centerMidpoints = function (points) {
	var getRightmostAndBottommostValues = F2(
		function (coord, accumulator) {
			return _Utils_Tuple2(
				A2($elm$core$Basics$max, coord.a, accumulator.a),
				A2($elm$core$Basics$max, coord.b, accumulator.b));
		});
	var rightmostAndBottommostValues = A3(
		$elm$core$List$foldl,
		getRightmostAndBottommostValues,
		_Utils_Tuple2(0.0, 0.0),
		points);
	var getLeftmostAndTopmostValues = F2(
		function (coord, accumulator) {
			return _Utils_Tuple2(
				A2($elm$core$Basics$min, coord.a, accumulator.a),
				A2($elm$core$Basics$min, coord.b, accumulator.b));
		});
	var leftmostAndTopmostValues = A3(
		$elm$core$List$foldl,
		getLeftmostAndTopmostValues,
		_Utils_Tuple2(0.0, 0.0),
		points);
	var center = _Utils_Tuple2((leftmostAndTopmostValues.a + rightmostAndBottommostValues.a) / 2, (leftmostAndTopmostValues.b + rightmostAndBottommostValues.b) / 2);
	return A2(
		$elm$core$List$map,
		function (point) {
			return _Utils_Tuple2(point.a - center.a, point.b - center.b);
		},
		points);
};
var $elm$core$Basics$pi = _Basics_pi;
var $author$project$Logic$App$Patterns$Math$coerceAxial = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, _v2) {
				return _Utils_Tuple2(
					function () {
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
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$actionNoInput = F3(
	function (stack, ctx, action) {
		var actionResult = action(ctx);
		return $author$project$Logic$App$Patterns$OperatorUtils$nanOrInfinityCheck(actionResult.a) ? {
			a$: actionResult.b,
			fn: A2(
				$author$project$Logic$App$Utils$Utils$unshift,
				$author$project$Logic$App$Types$Garbage(6),
				stack),
			bh: false
		} : {
			a$: actionResult.b,
			fn: A2($elm$core$Array$append, actionResult.a, stack),
			bh: true
		};
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
						if ((_v0.a.$ === 4) && (_v0.b.$ === 4)) {
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
								$author$project$Logic$App$Types$Garbage(12));
						}
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, action);
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
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
	if (iota.$ === 4) {
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
			$elm$core$Array$toList(list)) ? $elm$core$Maybe$Just(iota) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Utils$EntityContext$getPlayerHeldItem = function (context) {
	var _v0 = A2($elm$core$Dict$get, 'Caster', context.d5);
	if (!_v0.$) {
		var heldItem = _v0.a.ea;
		return heldItem;
	} else {
		return 6;
	}
};
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
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
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$Logic$App$Utils$EntityContext$setPlayerHeldItemContent = F2(
	function (context, heldItemContent) {
		return _Utils_update(
			context,
			{
				d5: A3(
					$elm$core$Dict$update,
					'Caster',
					function (v) {
						if (!v.$) {
							var player = v.a;
							return $elm$core$Maybe$Just(
								_Utils_update(
									player,
									{eb: heldItemContent}));
						} else {
							return v;
						}
					},
					context.d5)
			});
	});
var $author$project$Logic$App$Patterns$Spells$craftArtifact = F3(
	function (requiredItem, stack, ctx) {
		var action = F3(
			function (iota1, iota2, context) {
				return _Utils_eq(
					$author$project$Logic$App$Utils$EntityContext$getPlayerHeldItem(context),
					requiredItem) ? _Utils_Tuple2(
					$elm$core$Array$empty,
					A2(
						$author$project$Logic$App$Utils$EntityContext$setPlayerHeldItemContent,
						context,
						$elm$core$Maybe$Just(iota2))) : _Utils_Tuple2(
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
						if (iota.$ === 4) {
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
								$author$project$Logic$App$Types$Garbage(12));
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
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector, action);
	});
var $author$project$Logic$App$Patterns$Spells$destroyWater = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2($elm$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});
var $elm$core$Set$diff = F2(
	function (_v0, _v1) {
		var dict1 = _v0;
		var dict2 = _v1;
		return A2($elm$core$Dict$diff, dict1, dict2);
	});
var $ianmackenzie$elm_geometry$Vector3d$cross = F2(
	function (_v0, _v1) {
		var v2 = _v0;
		var v1 = _v1;
		return {n: (v1.o * v2.K) - (v1.K * v2.o), o: (v1.K * v2.n) - (v1.n * v2.K), K: (v1.n * v2.o) - (v1.o * v2.n)};
	});
var $ianmackenzie$elm_units$Area$inSquareMeters = function (_v0) {
	var numSquareMeters = _v0;
	return numSquareMeters;
};
var $ianmackenzie$elm_geometry$Vector3d$xComponent = function (_v0) {
	var v = _v0;
	return v.n;
};
var $ianmackenzie$elm_geometry$Vector3d$yComponent = function (_v0) {
	var v = _v0;
	return v.o;
};
var $ianmackenzie$elm_geometry$Vector3d$zComponent = function (_v0) {
	var v = _v0;
	return v.K;
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
	if (!iota.$) {
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
		if (maybeIota.$ === 1) {
			return {
				a$: ctx,
				fn: A2(
					$elm$core$Array$append,
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$Logic$App$Types$Garbage(1),
								$author$project$Logic$App$Types$Garbage(1)
							])),
					newStack),
				bh: false
			};
		} else {
			var iota = maybeIota.a;
			var _v1 = $author$project$Logic$App$Patterns$OperatorUtils$getInteger(iota);
			if (_v1.$ === 1) {
				return {
					a$: ctx,
					fn: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage(2),
						newStack),
					bh: false
				};
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
						return {
							a$: ctx,
							fn: A2(
								$author$project$Logic$App$Utils$Utils$unshift,
								$author$project$Logic$App$Types$Garbage(1),
								stack),
							bh: false
						};
					} else {
						var caughtIota = maybeCaughtIota.a;
						return {
							a$: ctx,
							fn: A2($author$project$Logic$App$Utils$Utils$unshift, caughtIota, newNewStack),
							bh: true
						};
					}
				} else {
					return {
						a$: ctx,
						fn: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage(12),
							stack),
						bh: false
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
		if (maybeIota.$ === 1) {
			return {
				a$: ctx,
				fn: A2(
					$elm$core$Array$append,
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$Logic$App$Types$Garbage(1),
								$author$project$Logic$App$Types$Garbage(1)
							])),
					newStack),
				bh: false
			};
		} else {
			var iota = maybeIota.a;
			var _v1 = $author$project$Logic$App$Patterns$OperatorUtils$getInteger(iota);
			if (_v1.$ === 1) {
				return {
					a$: ctx,
					fn: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage(2),
						newStack),
					bh: false
				};
			} else {
				if (!iota.$) {
					var number = iota.a;
					var maybeCaughtIota = A2(
						$elm$core$Array$get,
						$elm$core$Basics$round(number),
						newStack);
					if (maybeCaughtIota.$ === 1) {
						return {
							a$: ctx,
							fn: A2(
								$author$project$Logic$App$Utils$Utils$unshift,
								$author$project$Logic$App$Types$Garbage(1),
								stack),
							bh: false
						};
					} else {
						var caughtIota = maybeCaughtIota.a;
						return {
							a$: ctx,
							fn: A2($author$project$Logic$App$Utils$Utils$unshift, caughtIota, newStack),
							bh: true
						};
					}
				} else {
					return {
						a$: ctx,
						fn: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage(12),
							stack),
						bh: false
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
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $author$project$Logic$App$Types$Entity = function (a) {
	return {$: 3, a: a};
};
var $author$project$Logic$App$Patterns$Selectors$getCaster = F2(
	function (stack, ctx) {
		var action = function (_v0) {
			return _Utils_Tuple2(
				A2(
					$elm$core$Array$repeat,
					1,
					$author$project$Logic$App$Types$Entity('Caster')),
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
var $author$project$Logic$App$Patterns$Misc$gravityGet = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity);
	});
var $author$project$Logic$App$Patterns$Misc$gravitySet = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$GreatSpells$brainsweep = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$GreatSpells$craftPhial = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity);
	});
var $author$project$Logic$App$Patterns$GreatSpells$createLava = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$GreatSpells$lightning = F2(
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
var $author$project$Logic$App$Patterns$Spells$sentinelCreate = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$GreatSpells$teleport = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
	});
var $author$project$Logic$App$Patterns$PatternRegistry$greatSpellRegistry = A2(
	$elm$core$List$map,
	function (pattern) {
		return {a: pattern.a, cw: true, ah: $author$project$Settings$Theme$accent1, dX: pattern.dX, el: pattern.el, w: 0, bF: pattern.bF, _: pattern._, fl: pattern.fl, dq: pattern.dq};
	},
	_List_fromArray(
		[
			{a: $author$project$Logic$App$Patterns$GreatSpells$createLava, dX: 'Create Lava', el: 'create_lava', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qdwedadedae', dq: 2},
			{a: $author$project$Logic$App$Patterns$Spells$potion, dX: 'White Sun\'s Zenith', el: 'potion/regeneration', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqqaawawaedd', dq: 2},
			{a: $author$project$Logic$App$Patterns$Spells$potionFixedPotency, dX: 'Blue Sun\'s Zenith', el: 'potion/night_vision', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqaawawaeqdd', dq: 2},
			{a: $author$project$Logic$App$Patterns$Spells$potion, dX: 'Black Sun\'s Zenith', el: 'potion/absorption', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqaawawaeqqdd', dq: 2},
			{a: $author$project$Logic$App$Patterns$Spells$potion, dX: 'Red Sun\'s Zenith', el: 'potion/haste', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qaawawaeqqqdd', dq: 2},
			{a: $author$project$Logic$App$Patterns$Spells$potion, dX: 'Green Sun\'s Zenith', el: 'potion/strength', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aawawaeqqqqdd', dq: 2},
			{a: $author$project$Logic$App$Patterns$GreatSpells$lightning, dX: 'Summon Lightning', el: 'lightning', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'waadwawdaaweewq', dq: 2},
			{a: $author$project$Logic$App$Patterns$OperatorUtils$spellNoInput, dX: 'Summon Rain', el: 'summon_rain', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wwweeewwweewdawdwad', dq: 2},
			{a: $author$project$Logic$App$Patterns$OperatorUtils$spellNoInput, dX: 'Dispel Rain', el: 'dispel_rain', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'eeewwweeewwaqqddqdqd', dq: 2},
			{a: $author$project$Logic$App$Patterns$GreatSpells$teleport, dX: 'Greater Teleport', el: 'teleport', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wwwqqqwwwqqeqqwwwqqwqqdqqqqqdqq', dq: 2},
			{a: $author$project$Logic$App$Patterns$Spells$sentinelCreate, dX: 'Summon Greater Sentinel', el: 'sentinel/create/great', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'waeawaeqqqwqwqqwq', dq: 2},
			{a: $author$project$Logic$App$Patterns$GreatSpells$craftPhial, dX: 'Craft Phial', el: 'craft/battery', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aqqqaqwwaqqqqqeqaqqqawwqwqwqwqwqw', dq: 2},
			{a: $author$project$Logic$App$Patterns$GreatSpells$brainsweep, dX: 'Flay Mind', el: 'brainsweep', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qeqwqwqwqwqeqaeqeaqeqaeqaqded', dq: 2}
		]));
var $author$project$Logic$App$Patterns$Math$greaterThan = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
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
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Grid$gridpointToMidpoints = function (gridPoint) {
	return A2(
		$elm$core$List$map,
		function (connection) {
			return _Utils_Tuple2((gridPoint.H + connection.H) / 2, (gridPoint.A + connection.A) / 2);
		},
		gridPoint.L);
};
var $author$project$Logic$App$Patterns$Math$ifBool = F2(
	function (stack, ctx) {
		var action = F4(
			function (iota1, iota2, iota3, _v1) {
				return _Utils_Tuple2(
					function () {
						if (iota1.$ === 2) {
							var bool = iota1.a;
							return bool ? A2($elm$core$Array$repeat, 1, iota2) : A2($elm$core$Array$repeat, 1, iota3);
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage(12));
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
						if ((_v0.a.$ === 4) && (!_v0.b.$)) {
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
								$author$project$Logic$App$Types$Garbage(12));
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
						if (iota1.$ === 4) {
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
								$author$project$Logic$App$Types$Garbage(12));
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
					}(),
					ctx);
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, action);
	});
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$isEmpty(dict);
};
var $author$project$Logic$App$Patterns$Lists$lastNList = F2(
	function (stack, ctx) {
		var newStack = A3(
			$elm$core$Array$slice,
			1,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota = A2($elm$core$Array$get, 0, stack);
		if (maybeIota.$ === 1) {
			return {
				a$: ctx,
				fn: A2(
					$elm$core$Array$append,
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$Logic$App$Types$Garbage(1)
							])),
					newStack),
				bh: false
			};
		} else {
			var iota = maybeIota.a;
			var _v1 = $author$project$Logic$App$Patterns$OperatorUtils$getInteger(iota);
			if (_v1.$ === 1) {
				return {
					a$: ctx,
					fn: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage(2),
						newStack),
					bh: false
				};
			} else {
				if (!iota.$) {
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
						a$: ctx,
						fn: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage(1),
							newStack),
						bh: false
					} : {
						a$: ctx,
						fn: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$IotaList(selectedIotas),
							newNewStack),
						bh: true
					};
				} else {
					return {
						a$: ctx,
						fn: $elm$core$Array$fromList(
							_List_fromArray(
								[
									$author$project$Logic$App$Types$Garbage(12)
								])),
						bh: false
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
						if ((_v0.a.$ === 4) && (!_v0.b.$)) {
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
								$author$project$Logic$App$Types$Garbage(12));
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
						if (iota.$ === 4) {
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
								$author$project$Logic$App$Types$Garbage(12));
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
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $author$project$Logic$App$Patterns$OperatorUtils$makeConstant = F3(
	function (iota, stack, ctx) {
		return {
			a$: ctx,
			fn: A2($author$project$Logic$App$Utils$Utils$unshift, iota, stack),
			bh: true
		};
	});
var $author$project$Logic$App$Types$Backspace = 3;
var $author$project$Logic$App$Types$ClearPatterns = 1;
var $author$project$Logic$App$Types$Reset = 2;
var $author$project$Logic$App$Types$Wrap = 4;
var $author$project$Logic$App$Patterns$PatternRegistry$noAction = F2(
	function (stack, ctx) {
		return {a$: ctx, fn: stack, bh: true};
	});
var $author$project$Logic$App$Patterns$PatternRegistry$metapatternRegistry = A2(
	$elm$core$List$map,
	function (pattern) {
		return {a: pattern.a, cw: true, ah: $author$project$Settings$Theme$accent1, dX: pattern.dX, el: pattern.el, w: pattern.w, bF: pattern.bF, _: pattern._, fl: pattern.fl, dq: 2};
	},
	_List_fromArray(
		[
			{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, dX: 'Clear', el: 'clearPatterns', w: 1, bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqq'},
			{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, dX: 'Reset', el: 'resetApp', w: 2, bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqqqa'},
			{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, dX: 'Backspace', el: 'backspace', w: 3, bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qa'},
			{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, dX: 'Wrap', el: 'wrap', w: 4, bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qwqqqwq'}
		]));
var $author$project$Logic$App$Patterns$OperatorUtils$getPositiveInteger = function (iota) {
	if (!iota.$) {
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
						if ((_v0.a.$ === 4) && (!_v0.b.$)) {
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
								$author$project$Logic$App$Types$Garbage(12));
						}
					}(),
					ctx);
			});
		return A6($author$project$Logic$App$Patterns$OperatorUtils$action3Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, $author$project$Logic$App$Patterns$OperatorUtils$getPositiveInteger, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
	});
var $elm$core$Basics$truncate = _Basics_truncate;
var $ianmackenzie$elm_units$Quantity$fractionalRemainderBy = F2(
	function (_v0, _v1) {
		var modulus = _v0;
		var value = _v1;
		return value - (modulus * ((value / modulus) | 0));
	});
var $author$project$Logic$App$Patterns$Math$modulo = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, _v1) {
				return _Utils_Tuple2(
					function () {
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
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, $author$project$Logic$App$Patterns$OperatorUtils$getNumber, action);
	});
var $ianmackenzie$elm_geometry$Vector3d$dot = F2(
	function (_v0, _v1) {
		var v2 = _v0;
		var v1 = _v1;
		return ((v1.n * v2.n) + (v1.o * v2.o)) + (v1.K * v2.K);
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
						if (!iota.$) {
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
								$author$project$Logic$App$Types$Garbage(12));
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
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Logic$App$Patterns$Misc$numberLiteral = F3(
	function (number, stack, ctx) {
		return {
			a$: ctx,
			fn: A2(
				$author$project$Logic$App$Utils$Utils$unshift,
				$author$project$Logic$App$Types$Number(number),
				stack),
			bh: true
		};
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
			cw: true,
			ah: $author$project$Settings$Theme$accent1,
			dX: 'Numerical Reflection: ' + $elm$core$String$fromFloat(number),
			el: $elm$core$String$fromFloat(number),
			w: 0,
			bF: _List_Nil,
			_: $elm$core$Maybe$Nothing,
			fl: angleSignature,
			dq: 4
		};
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
							$author$project$Logic$App$Types$Garbage(12),
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
			return {a$: ctx, fn: newStack, bh: true};
		} else {
			return {
				a$: ctx,
				fn: A2(
					$elm$core$Array$append,
					stack,
					A2(
						$elm$core$Array$repeat,
						$elm$core$List$length(maskCode) - $elm$core$Array$length(stack),
						$author$project$Logic$App$Types$Garbage(1))),
				bh: false
			};
		}
	});
var $author$project$Logic$App$Types$InvalidPattern = 0;
var $author$project$Settings$Theme$accent3 = '#e0b8b8';
var $author$project$Logic$App$Patterns$PatternRegistry$unknownPattern = {
	a: F2(
		function (stack, ctx) {
			return {
				a$: ctx,
				fn: A2(
					$author$project$Logic$App$Utils$Utils$unshift,
					$author$project$Logic$App$Types$Garbage(0),
					stack),
				bh: false
			};
		}),
	cw: true,
	ah: $author$project$Settings$Theme$accent3,
	dX: 'Unknown Pattern',
	el: 'unknown',
	w: 0,
	bF: _List_Nil,
	_: $elm$core$Maybe$Nothing,
	fl: '',
	dq: 2
};
var $author$project$Logic$App$Patterns$PatternRegistry$parseBookkeeperSignature = function (signature) {
	if (signature === '') {
		return {
			a: $author$project$Logic$App$Patterns$Misc$mask(
				_List_fromArray(
					['-'])),
			cw: true,
			ah: $author$project$Settings$Theme$accent1,
			dX: 'Bookkeeper\'s Gambit: -',
			el: 'mask',
			w: 0,
			bF: _List_Nil,
			_: $elm$core$Maybe$Nothing,
			fl: signature,
			dq: 2
		};
	} else {
		var parseSignature = F2(
			function (angle, accumulatorResult) {
				if (!accumulatorResult.$) {
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
			if (!_v1.$) {
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
		if (!maskCodeResult.$) {
			var maskCode = maskCodeResult.a;
			return {
				a: $author$project$Logic$App$Patterns$Misc$mask(maskCode),
				cw: true,
				ah: $author$project$Settings$Theme$accent1,
				dX: 'Bookkeeper\'s Gambit: ' + $elm$core$String$concat(maskCode),
				el: 'mask',
				w: 0,
				bF: _List_Nil,
				_: $elm$core$Maybe$Nothing,
				fl: signature,
				dq: 2
			};
		} else {
			return $author$project$Logic$App$Patterns$PatternRegistry$unknownPattern;
		}
	}
};
var $author$project$Logic$App$Patterns$Misc$pekhuiGet = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity);
	});
var $author$project$Logic$App$Patterns$Misc$pekhuiSet = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, $author$project$Logic$App$Patterns$OperatorUtils$getNumber);
	});
var $author$project$Logic$App$Patterns$Spells$placeBlock = F2(
	function (stack, ctx) {
		return A3($author$project$Logic$App$Patterns$OperatorUtils$spell1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector);
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
var $author$project$Logic$App$Utils$EntityContext$getPlayerHeldItemContent = function (context) {
	var _v0 = A2($elm$core$Dict$get, 'Caster', context.d5);
	if (!_v0.$) {
		var heldItemContent = _v0.a.eb;
		return heldItemContent;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$Patterns$ReadWrite$read = F2(
	function (stack, ctx) {
		var action = function (context) {
			return _Utils_Tuple2(
				function () {
					var _v0 = $author$project$Logic$App$Utils$EntityContext$getPlayerHeldItem(context);
					switch (_v0) {
						case 6:
							return $elm$core$Array$empty;
						case 0:
							return $elm$core$Array$empty;
						case 2:
							return $elm$core$Array$empty;
						case 1:
							return $elm$core$Array$empty;
						case 3:
							return $elm$core$Array$fromList(
								_List_fromArray(
									[
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Null,
										$author$project$Logic$App$Utils$EntityContext$getPlayerHeldItemContent(context))
									]));
						case 4:
							return $elm$core$Array$fromList(
								_List_fromArray(
									[
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Null,
										$author$project$Logic$App$Utils$EntityContext$getPlayerHeldItemContent(context))
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
var $author$project$Logic$App$Utils$EntityContext$getEntityHeldItem = F2(
	function (context, entityName) {
		var _v0 = A2($elm$core$Dict$get, entityName, context.d5);
		if (!_v0.$) {
			var heldItem = _v0.a.ea;
			return heldItem;
		} else {
			return 6;
		}
	});
var $author$project$Logic$App$Utils$EntityContext$getEntityHeldItemContent = F2(
	function (context, entityName) {
		var _v0 = A2($elm$core$Dict$get, entityName, context.d5);
		if (!_v0.$) {
			var heldItemContent = _v0.a.eb;
			return heldItemContent;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Logic$App$Patterns$ReadWrite$readChronical = F2(
	function (stack, ctx) {
		var action = F2(
			function (iota, context) {
				if (iota.$ === 3) {
					var entity = iota.a;
					return _Utils_Tuple2(
						function () {
							var _v1 = A2($author$project$Logic$App$Utils$EntityContext$getEntityHeldItem, context, entity);
							switch (_v1) {
								case 6:
									return $elm$core$Array$empty;
								case 0:
									return $elm$core$Array$empty;
								case 2:
									return $elm$core$Array$empty;
								case 1:
									return $elm$core$Array$empty;
								case 3:
									return $elm$core$Array$fromList(
										_List_fromArray(
											[
												A2(
												$elm$core$Maybe$withDefault,
												$author$project$Logic$App$Types$Null,
												A2($author$project$Logic$App$Utils$EntityContext$getEntityHeldItemContent, context, entity))
											]));
								case 4:
									return $elm$core$Array$fromList(
										_List_fromArray(
											[
												A2(
												$elm$core$Maybe$withDefault,
												$author$project$Logic$App$Types$Null,
												A2($author$project$Logic$App$Utils$EntityContext$getEntityHeldItemContent, context, entity))
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
				} else {
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Garbage(12)),
						context);
				}
			});
		return A4($author$project$Logic$App$Patterns$OperatorUtils$action1Input, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, action);
	});
var $author$project$Logic$App$Patterns$ReadWrite$readLocal = F2(
	function (stack, ctx) {
		var action = function (context) {
			var _v0 = context.fa;
			if (_v0.$ === 1) {
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
			var _v0 = $author$project$Logic$App$Utils$EntityContext$getPlayerHeldItem(context);
			switch (_v0) {
				case 6:
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 0:
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 2:
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 1:
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 3:
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(true)),
						context);
				case 4:
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
						if (iota.$ === 4) {
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
								$author$project$Logic$App$Types$Garbage(12));
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
						if (((_v0.a.$ === 4) && (!_v0.b.$)) && (!_v0.c.$)) {
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
								$author$project$Logic$App$Types$Garbage(12));
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
						if (iota.$ === 4) {
							var list = iota.a;
							return $elm_community$array_extra$Array$Extra$reverse(list);
						} else {
							return A2(
								$elm$core$Array$repeat,
								1,
								$author$project$Logic$App$Types$Garbage(12));
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
						if (iota.$ === 4) {
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
								$author$project$Logic$App$Types$Garbage(12));
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
			var _v0 = $author$project$Logic$App$Utils$EntityContext$getPlayerHeldItem(context);
			switch (_v0) {
				case 6:
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 0:
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 2:
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 1:
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(false)),
						context);
				case 3:
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Boolean(true)),
						context);
				case 4:
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
				var _v0 = $author$project$Logic$App$Utils$EntityContext$getPlayerHeldItem(context);
				switch (_v0) {
					case 6:
						return _Utils_Tuple2(
							$elm$core$Array$fromList(
								_List_fromArray(
									[iota])),
							context);
					case 0:
						return _Utils_Tuple2(
							$elm$core$Array$fromList(
								_List_fromArray(
									[iota])),
							context);
					case 2:
						return _Utils_Tuple2(
							$elm$core$Array$fromList(
								_List_fromArray(
									[iota])),
							context);
					case 1:
						return _Utils_Tuple2(
							$elm$core$Array$fromList(
								_List_fromArray(
									[iota])),
							context);
					case 3:
						return _Utils_Tuple2(
							$elm$core$Array$empty,
							A2(
								$author$project$Logic$App$Utils$EntityContext$setPlayerHeldItemContent,
								context,
								$elm$core$Maybe$Just(iota)));
					case 4:
						return _Utils_Tuple2(
							$elm$core$Array$empty,
							A2(
								$author$project$Logic$App$Utils$EntityContext$setPlayerHeldItemContent,
								context,
								$elm$core$Maybe$Just(iota)));
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
var $author$project$Logic$App$Utils$EntityContext$setEntityHeldItemContent = F3(
	function (context, entityName, heldItemContent) {
		return _Utils_update(
			context,
			{
				d5: A3(
					$elm$core$Dict$update,
					entityName,
					function (v) {
						if (!v.$) {
							var entity = v.a;
							return $elm$core$Maybe$Just(
								_Utils_update(
									entity,
									{eb: heldItemContent}));
						} else {
							return v;
						}
					},
					context.d5)
			});
	});
var $author$project$Logic$App$Patterns$ReadWrite$writeChronical = F2(
	function (stack, ctx) {
		var action = F3(
			function (iota1, iota2, context) {
				if (iota1.$ === 3) {
					var entity = iota1.a;
					var _v1 = A2($author$project$Logic$App$Utils$EntityContext$getEntityHeldItem, context, entity);
					switch (_v1) {
						case 6:
							return _Utils_Tuple2(
								$elm$core$Array$fromList(
									_List_fromArray(
										[iota2])),
								context);
						case 0:
							return _Utils_Tuple2(
								$elm$core$Array$fromList(
									_List_fromArray(
										[iota2])),
								context);
						case 2:
							return _Utils_Tuple2(
								$elm$core$Array$fromList(
									_List_fromArray(
										[iota2])),
								context);
						case 1:
							return _Utils_Tuple2(
								$elm$core$Array$fromList(
									_List_fromArray(
										[iota2])),
								context);
						case 3:
							return _Utils_Tuple2(
								$elm$core$Array$empty,
								A3(
									$author$project$Logic$App$Utils$EntityContext$setEntityHeldItemContent,
									context,
									entity,
									$elm$core$Maybe$Just(iota2)));
						case 4:
							return _Utils_Tuple2(
								$elm$core$Array$empty,
								A3(
									$author$project$Logic$App$Utils$EntityContext$setEntityHeldItemContent,
									context,
									entity,
									$elm$core$Maybe$Just(iota2)));
						default:
							return _Utils_Tuple2(
								$elm$core$Array$fromList(
									_List_fromArray(
										[iota2])),
								context);
					}
				} else {
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Garbage(12)),
						context);
				}
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getEntity, $author$project$Logic$App$Patterns$OperatorUtils$getAny, action);
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
							fa: $elm$core$Maybe$Just(iota)
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
					}(),
					ctx);
			});
		return A5($author$project$Logic$App$Patterns$OperatorUtils$action2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, $author$project$Logic$App$Patterns$OperatorUtils$getBoolean, action);
	});
var $author$project$Logic$App$Patterns$Selectors$zoneEntity = F2(
	function (stack, ctx) {
		return A4($author$project$Logic$App$Patterns$OperatorUtils$spell2Inputs, stack, ctx, $author$project$Logic$App$Patterns$OperatorUtils$getVector, $author$project$Logic$App$Patterns$OperatorUtils$getNumber);
	});
var $author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature = F2(
	function (maybeMacros, signature) {
		var _v6 = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (regPattern) {
					return _Utils_eq(regPattern.fl, signature);
				},
				$author$project$Logic$App$Patterns$PatternRegistry$cyclic$patternRegistry()));
		if (!_v6.$) {
			var a = _v6.a;
			return a;
		} else {
			if (A2($elm$core$String$startsWith, 'aqaa', signature)) {
				return A2($author$project$Logic$App$Patterns$PatternRegistry$numberLiteralGenerator, signature, false);
			} else {
				if (A2($elm$core$String$startsWith, 'dedd', signature)) {
					return A2($author$project$Logic$App$Patterns$PatternRegistry$numberLiteralGenerator, signature, true);
				} else {
					var parseBookkeeperResult = $author$project$Logic$App$Patterns$PatternRegistry$parseBookkeeperSignature(signature);
					if (parseBookkeeperResult.el !== 'unknown') {
						return parseBookkeeperResult;
					} else {
						var getGreatSpell = function () {
							var getCenterdMidpoints = F2(
								function (sig, direction) {
									return $elm$core$Set$fromList(
										$author$project$Logic$App$Grid$centerMidpoints(
											A2(
												$elm$core$List$concatMap,
												$author$project$Logic$App$Grid$gridpointToMidpoints,
												A3(
													$author$project$Logic$App$Grid$drawPattern,
													0,
													0,
													_Utils_update(
														$author$project$Logic$App$Patterns$PatternRegistry$unknownPattern,
														{fl: sig, dq: direction})).ck)));
								});
							var greatSpellMatches = A2(
								$elm$core$List$concatMap,
								function (direction) {
									return A2(
										$elm$core$List$filter,
										function (greatSpell) {
											return $elm$core$Set$isEmpty(
												A2(
													$elm$core$Set$diff,
													A2(getCenterdMidpoints, signature, direction),
													A2(getCenterdMidpoints, greatSpell.fl, 2)));
										},
										$author$project$Logic$App$Patterns$PatternRegistry$greatSpellRegistry);
								},
								_List_fromArray(
									[0, 2, 4, 5, 3, 1]));
							return A2(
								$elm$core$Maybe$withDefault,
								_Utils_update(
									$author$project$Logic$App$Patterns$PatternRegistry$unknownPattern,
									{dX: 'Pattern ' + ('\"' + (signature + '\"')), fl: signature}),
								$elm$core$List$head(greatSpellMatches));
						}();
						if (!maybeMacros.$) {
							var macros = maybeMacros.a;
							var _v8 = A2($elm$core$Dict$get, signature, macros);
							if (!_v8.$) {
								var value = _v8.a;
								var displayName = value.a;
								var direction = value.b;
								return {a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, cw: true, ah: $author$project$Settings$Theme$accent1, dX: displayName, el: '', w: 0, bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: signature, dq: direction};
							} else {
								return getGreatSpell;
							}
						} else {
							return getGreatSpell;
						}
					}
				}
			}
		}
	});
var $author$project$Logic$App$Patterns$PatternRegistry$saveMacro = F2(
	function (stack, ctx) {
		var newStack = A3(
			$elm$core$Array$slice,
			2,
			$elm$core$Array$length(stack),
			stack);
		var maybeIota2 = A2($elm$core$Array$get, 0, stack);
		var maybeIota1 = A2($elm$core$Array$get, 1, stack);
		var getUnusedPatternIota = function (iota) {
			if (iota.$ === 5) {
				var pattern = iota.a;
				return (A2($author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature, $elm$core$Maybe$Nothing, pattern.fl).el === 'unknown') ? $elm$core$Maybe$Just(iota) : $elm$core$Maybe$Nothing;
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var action = F3(
			function (iota1, iota2, context) {
				var _v1 = _Utils_Tuple2(iota1, iota2);
				if (_v1.b.$ === 5) {
					var value = _v1.a;
					var _v2 = _v1.b;
					var key = _v2.a;
					return _Utils_Tuple2(
						$elm$core$Array$empty,
						_Utils_update(
							context,
							{
								et: A3(
									$elm$core$Dict$update,
									key.fl,
									function (val) {
										if (!val.$) {
											var _v4 = val.a;
											var displayName = _v4.a;
											return $elm$core$Maybe$Just(
												_Utils_Tuple3(displayName, key.dq, value));
										} else {
											return $elm$core$Maybe$Just(
												_Utils_Tuple3('Unnamed Macro', key.dq, value));
										}
									},
									context.et)
							}));
				} else {
					return _Utils_Tuple2(
						A2(
							$elm$core$Array$repeat,
							1,
							$author$project$Logic$App$Types$Garbage(12)),
						ctx);
				}
			});
		if (_Utils_eq(maybeIota1, $elm$core$Maybe$Nothing) || _Utils_eq(maybeIota2, $elm$core$Maybe$Nothing)) {
			return {
				a$: ctx,
				fn: A2(
					$elm$core$Array$append,
					A2(
						$elm$core$Array$map,
						$author$project$Logic$App$Patterns$OperatorUtils$mapNothingToMissingIota,
						$elm$core$Array$fromList(
							$author$project$Logic$App$Patterns$OperatorUtils$moveNothingsToFront(
								_List_fromArray(
									[maybeIota1, maybeIota2])))),
					newStack),
				bh: false
			};
		} else {
			var _v0 = _Utils_Tuple2(
				A2($elm$core$Maybe$map, $author$project$Logic$App$Patterns$OperatorUtils$getIotaList, maybeIota1),
				A2($elm$core$Maybe$map, getUnusedPatternIota, maybeIota2));
			if ((!_v0.a.$) && (!_v0.b.$)) {
				var iota1 = _v0.a.a;
				var iota2 = _v0.b.a;
				if (_Utils_eq(iota1, $elm$core$Maybe$Nothing) || _Utils_eq(iota2, $elm$core$Maybe$Nothing)) {
					return {
						a$: ctx,
						fn: A2(
							$elm$core$Array$append,
							$elm$core$Array$fromList(
								_List_fromArray(
									[
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Garbage(2),
										iota1),
										A2(
										$elm$core$Maybe$withDefault,
										$author$project$Logic$App$Types$Garbage(2),
										iota2)
									])),
							newStack),
						bh: false
					};
				} else {
					var actionResult = A3(
						action,
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage(2),
							iota1),
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Logic$App$Types$Garbage(2),
							iota2),
						ctx);
					return $author$project$Logic$App$Patterns$OperatorUtils$nanOrInfinityCheck(actionResult.a) ? {
						a$: actionResult.b,
						fn: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							$author$project$Logic$App$Types$Garbage(6),
							stack),
						bh: false
					} : {
						a$: actionResult.b,
						fn: A2($elm$core$Array$append, actionResult.a, newStack),
						bh: true
					};
				}
			} else {
				return {
					a$: ctx,
					fn: A2(
						$author$project$Logic$App$Utils$Utils$unshift,
						$author$project$Logic$App$Types$Garbage(12),
						newStack),
					bh: false
				};
			}
		}
	});
function $author$project$Logic$App$Patterns$PatternRegistry$cyclic$patternRegistry() {
	return _Utils_ap(
		$author$project$Logic$App$Patterns$PatternRegistry$metapatternRegistry,
		_Utils_ap(
			$author$project$Logic$App$Patterns$PatternRegistry$greatSpellRegistry,
			A2(
				$elm$core$List$map,
				function (pattern) {
					return {a: pattern.a, cw: true, ah: $author$project$Settings$Theme$accent1, dX: pattern.dX, el: pattern.el, w: 0, bF: pattern.bF, _: pattern._, fl: pattern.fl, dq: pattern.dq};
				},
				_List_fromArray(
					[
						{
						a: $author$project$Logic$App$Patterns$Misc$gravityGet,
						dX: 'Gravitational Purification',
						el: 'interop/gravity/get',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$VectorType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$VectorType,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(0, -1, 0)))),
						fl: 'wawawddew',
						dq: 2
					},
						{a: $author$project$Logic$App$Patterns$Misc$gravitySet, dX: 'Alter Gravity', el: 'interop/gravity/set', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wdwdwaaqw', dq: 2},
						{
						a: $author$project$Logic$App$Patterns$Misc$pekhuiGet,
						dX: 'Gulliver\'s Purification',
						el: 'interop/pehkui/get',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$NumberType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$NumberType,
								$author$project$Logic$App$Types$Number(1))),
						fl: 'aawawwawwa',
						dq: 2
					},
						{a: $author$project$Logic$App$Patterns$Misc$pekhuiSet, dX: 'Alter Scale', el: 'interop/pehkui/set', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'ddwdwwdwwd', dq: 2},
						{a: $author$project$Logic$App$Patterns$Selectors$getCaster, dX: 'Mind\'s Reflection', el: 'get_caster', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qaq', dq: 0},
						{
						a: $author$project$Logic$App$Patterns$Misc$entityPos,
						dX: 'Compass\' Purification',
						el: 'entity_pos/eye',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$VectorType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$VectorType,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(0, 0, 0)))),
						fl: 'aa',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Misc$entityPos,
						dX: 'Compass\' Purification II',
						el: 'entity_pos/foot',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$VectorType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$VectorType,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(0, 0, 0)))),
						fl: 'dd',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Misc$getEntityLook,
						dX: 'Alidade\'s Purification',
						el: 'get_entity_look',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$VectorType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$VectorType,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(0, 0, 0)))),
						fl: 'wa',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Misc$getEntityHeight,
						dX: 'Stadiometer\'s Purification',
						el: 'get_entity_height',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$NumberType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$NumberType,
								$author$project$Logic$App$Types$Number(0))),
						fl: 'awq',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Misc$getEntityVelocity,
						dX: 'Pace Purification',
						el: 'get_entity_velocity',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$VectorType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$VectorType,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(0, 0, 0)))),
						fl: 'wq',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Misc$raycast,
						dX: 'Archer\'s Distillation',
						el: 'raycast',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$VectorType, $author$project$Logic$App$Types$NullType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$VectorType,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(0, 0, 0)))),
						fl: 'wqaawdd',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Misc$raycastAxis,
						dX: 'Architect\'s Distillation',
						el: 'raycast/axis',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$VectorType, $author$project$Logic$App$Types$NullType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$VectorType,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(0, 0, 0)))),
						fl: 'weddwaa',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Misc$raycastEntity,
						dX: 'Scout\'s Distillation',
						el: 'raycast/entity',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2($author$project$Logic$App$Types$NullType, $author$project$Logic$App$Types$Null)),
						fl: 'weaqa',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$spellNoInput,
						dX: 'Waystone Reflection',
						el: 'circle/impetus_pos',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$VectorType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$VectorType,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(0, 0, 0)))),
						fl: 'eaqwqae',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$spellNoInput,
						dX: 'Lodestone Reflection',
						el: 'circle/impetus_dir',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$VectorType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$VectorType,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(0, 0, 0)))),
						fl: 'eaqwqaewede',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$spellNoInput,
						dX: 'Lesser Fold Reflection',
						el: 'circle/bounds/min',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$VectorType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$VectorType,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(0, 0, 0)))),
						fl: 'eaqwqaewdd',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$spellNoInput,
						dX: 'Greater Fold Reflection',
						el: 'circle/bounds/max',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$VectorType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$VectorType,
								$author$project$Logic$App$Types$Vector(
									_Utils_Tuple3(0, 0, 0)))),
						fl: 'aqwqawaaqa',
						dq: 2
					},
						{a: $author$project$Logic$App$Patterns$Stack$swap, dX: 'Jester\'s Gambit', el: 'swap', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aawdd', dq: 0},
						{a: $author$project$Logic$App$Patterns$Stack$rotate, dX: 'Rotation Gambit', el: 'rotate', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aaeaa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Stack$rotateReverse, dX: 'Rotation Gambit II', el: 'rotate_reverse', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'ddqdd', dq: 2},
						{a: $author$project$Logic$App$Patterns$Stack$duplicate, dX: 'Gemini Decomposition', el: 'duplicate', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aadaa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Stack$over, dX: 'Prospector\'s Gambit', el: 'over', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aaedd', dq: 2},
						{a: $author$project$Logic$App$Patterns$Stack$tuck, dX: 'Undertaker\'s Gambit', el: 'tuck', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'ddqaa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Stack$dup2, dX: 'Dioscuri Gambit', el: 'two_dup', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aadadaaw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Stack$stackLength, dX: 'Flock\'s Reflection', el: 'stack_len', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qwaeawqaeaqa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Stack$duplicateN, dX: 'Gemini Gambit', el: 'duplicate_n', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aadaadaa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Stack$fisherman, dX: 'Fisherman\'s Gambit', el: 'fisherman', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'ddad', dq: 2},
						{a: $author$project$Logic$App$Patterns$Stack$fishermanCopy, dX: 'Fisherman\'s Gambit II', el: 'fisherman/copy', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aada', dq: 2},
						{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, dX: '', el: 'swizzle', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qaawdde', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$add, dX: 'Additive Distillation', el: 'add', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'waaw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$subtract, dX: 'Subtractive Distillation', el: 'sub', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wddw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$mulDot, dX: 'Multiplicative Distillation', el: 'mul_dot', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'waqaw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$divCross, dX: 'Division Distillation', el: 'div_cross', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wdedw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$absLen, dX: 'Length Purification', el: 'abs_len', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wqaqw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$powProj, dX: 'Power Distillation', el: 'pow_proj', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wedew', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$floorAction, dX: 'Floor Purification', el: 'floor', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'ewq', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$ceilAction, dX: 'Ceiling Purification', el: 'ceil', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qwe', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$constructVector, dX: 'Vector Exaltation', el: 'construct_vec', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'eqqqqq', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$deconstructVector, dX: 'Vector Disintegration', el: 'deconstruct_vec', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qeeeee', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$coerceAxial, dX: 'Axial Purification', el: 'coerce_axial', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqqqaww', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$andBool, dX: 'Conjunction Distillation', el: 'and', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wdw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$orBool, dX: 'Disjunction Distillation', el: 'or', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'waw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$xorBool, dX: 'Exclusion Distillation', el: 'xor', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'dwa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$greaterThan, dX: 'Maximus Distillation', el: 'greater', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'e', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$lessThan, dX: 'Minimus Distillation', el: 'less', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'q', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$greaterThanOrEqualTo, dX: 'Maximus Distillation II', el: 'greater_eq', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'ee', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$lessThanOrEqualTo, dX: 'Minimus Distillation II', el: 'less_eq', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qq', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$equalTo, dX: 'Equality Distillation', el: 'equals', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'ad', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$notEqualTo, dX: 'Inequality Distillation', el: 'not_equals', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'da', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$invertBool, dX: 'Negation Purification', el: 'not', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'dw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$boolCoerce, dX: 'Augur\'s Purification', el: 'bool_coerce', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$ifBool, dX: 'Augur\'s Exaltation', el: 'if', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'awdd', dq: 2},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Number(0.5)),
						dX: 'Entropy Reflection',
						el: 'random',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'eqqq',
						dq: 2
					},
						{a: $author$project$Logic$App$Patterns$Math$sine, dX: 'Sine Purification', el: 'sin', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqqqaa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$cosine, dX: 'Cosine Purification', el: 'cos', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqqqad', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$tangent, dX: 'Tangent Purification', el: 'tan', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wqqqqqadq', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$arcsin, dX: 'Inverse Sine Purification', el: 'arcsin', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'ddeeeee', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$arccos, dX: 'Inverse Cosine Purification', el: 'arccos', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'adeeeee', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$arctan, dX: 'Inverse Tangent Purification', el: 'arctan', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'eadeeeeew', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$logarithm, dX: 'Logarithmic Distillation', el: 'logarithm', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'eqaqe', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$modulo, dX: 'Modulus Distillation', el: 'modulo', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'addwaad', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$andBit, dX: 'Intersection Distillation', el: 'and_bit', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wdweaqa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$orBit, dX: 'Unifying Distillation', el: 'or_bit', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'waweaqa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$xorBit, dX: 'Exclusionary Distillation', el: 'xor_bit', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'dwaeaqa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$notBit, dX: 'Inversion Purification', el: 'not_bit', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'dweaqa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Math$toSet, dX: 'Uniqueness Purification', el: 'to_set', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aweaqa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Misc$print, dX: 'Reveal', el: 'print', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'de', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$explode, dX: 'Explosion', el: 'explode', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aawaawaa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$explodeFire, dX: 'Fireball', el: 'explode/fire', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'ddwddwdd', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$addMotion, dX: 'Impulse', el: 'add_motion', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'awqqqwaqw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$blink, dX: 'Blink', el: 'blink', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'awqqqwaq', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$breakBlock, dX: 'Break Block', el: 'break_block', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qaqqqqq', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$placeBlock, dX: 'Place Block', el: 'place_block', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'eeeeede', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$colorize, dX: 'Internalize Pigment', el: 'colorize', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'awddwqawqwawq', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$createWater, dX: 'Create Water', el: 'create_water', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aqawqadaq', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$destroyWater, dX: 'Destroy Liquid', el: 'destroy_water', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'dedwedade', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$ignite, dX: 'Ignite Block', el: 'ignite', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aaqawawa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$extinguish, dX: 'Extinguish Area', el: 'extinguish', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'ddedwdwd', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$conjureBlock, dX: 'Conjure Block', el: 'conjure_block', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$conjureLight, dX: 'Conjure Light', el: 'conjure_light', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqd', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$bonemeal, dX: 'Overgrow', el: 'bonemeal', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wqaqwawqaqw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$recharge, dX: 'Recharge Item', el: 'recharge', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqqqwaeaeaeaeaea', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$erase, dX: 'Erase Item', el: 'erase', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qdqawwaww', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$edify, dX: 'Edify Sapling', el: 'edify', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wqaqwd', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$beep, dX: 'Make Note', el: 'beep', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'adaa', dq: 2},
						{
						a: $author$project$Logic$App$Patterns$Spells$craftArtifact(2),
						dX: 'Craft Cypher',
						el: 'craft/cypher',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'waqqqqq',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Spells$craftArtifact(0),
						dX: 'Craft Trinket',
						el: 'craft/trinket',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'wwaqqqqqeaqeaeqqqeaeq',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Spells$craftArtifact(1),
						dX: 'Craft Artifact',
						el: 'craft/artifact',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'wwaqqqqqeawqwqwqwqwqwwqqeadaeqqeqqeadaeqq',
						dq: 2
					},
						{a: $author$project$Logic$App$Patterns$Spells$potion, dX: 'White Sun\'s Nadir', el: 'potion/weakness', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqqqaqwawaw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$potionFixedPotency, dX: 'Blue Sun\'s Nadir', el: 'potion/levitation', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqqqawwawawd', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$potion, dX: 'Black Sun\'s Nadir', el: 'potion/wither', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqqqaewawawe', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$potion, dX: 'Red Sun\'s Nadir', el: 'potion/poison', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqqqadwawaww', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$potion, dX: 'Green Sun\'s Nadir', el: 'potion/slowness', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqqqadwawaw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$sentinelCreate, dX: 'Summon Sentinel', el: 'sentinel/create', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'waeawae', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$sentinelDestroy, dX: 'Banish Sentinel', el: 'sentinel/destroy', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qdwdqdw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$sentinelGetPos, dX: 'Locate Sentinel', el: 'sentinel/get_pos', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'waeawaede', dq: 2},
						{a: $author$project$Logic$App$Patterns$Spells$sentinelWayfind, dX: 'Wayfind Sentinel', el: 'sentinel/wayfind', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'waeawaedwa', dq: 2},
						{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, dX: '', el: 'akashic/read', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqwqqqqqaq', dq: 2},
						{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, dX: '', el: 'akashic/write', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'eeeweeeeede', dq: 2},
						{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, dX: 'Charon\'s Gambit', el: 'halt', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aqdee', dq: 5},
						{a: $author$project$Logic$App$Patterns$ReadWrite$read, dX: 'Scribe\'s Reflection', el: 'read', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aqqqqq', dq: 2},
						{a: $author$project$Logic$App$Patterns$ReadWrite$readChronical, dX: 'Chronicler\'s Purification', el: 'read/entity', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wawqwqwqwqwqw', dq: 2},
						{a: $author$project$Logic$App$Patterns$ReadWrite$write, dX: 'Scribe\'s Gambit', el: 'write', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'deeeee', dq: 2},
						{a: $author$project$Logic$App$Patterns$ReadWrite$writeChronical, dX: 'Chronicler\'s Gambit', el: 'write/entity', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wdwewewewewew', dq: 2},
						{a: $author$project$Logic$App$Patterns$ReadWrite$readable, dX: 'Auditor\'s Reflection', el: 'readable', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aqqqqqe', dq: 2},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Boolean(false)),
						dX: 'Auditor\'s Purification',
						el: 'readable/entity',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'wawqwqwqwqwqwew',
						dq: 2
					},
						{a: $author$project$Logic$App$Patterns$ReadWrite$writable, dX: 'Assessor\'s Reflection', el: 'writable', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'deeeeeq', dq: 2},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Boolean(false)),
						dX: 'Assessor\'s Purification',
						el: 'writable/entity',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'wdwewewewewewqw',
						dq: 2
					},
						{a: $author$project$Logic$App$Patterns$ReadWrite$readLocal, dX: 'Muninn\'s Reflection', el: 'read/local', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qeewdweddw', dq: 2},
						{a: $author$project$Logic$App$Patterns$ReadWrite$writeLocal, dX: 'Huginn\'s Gambit', el: 'write/local', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'eqqwawqaaw', dq: 2},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant($author$project$Logic$App$Types$Null),
						dX: 'Nullary Reflection',
						el: 'const/null',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'd',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Boolean(true)),
						dX: 'True Reflection',
						el: 'const/true',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'aqae',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Boolean(false)),
						dX: 'False Reflection',
						el: 'const/false',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'dedq',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Vector(
								_Utils_Tuple3(1, 0, 0))),
						dX: 'Vector Reflection +X',
						el: 'const/vec/px',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'qqqqqea',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Vector(
								_Utils_Tuple3(0, 1, 0))),
						dX: 'Vector Reflection +Y',
						el: 'const/vec/py',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'qqqqqew',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Vector(
								_Utils_Tuple3(0, 0, 1))),
						dX: 'Vector Reflection +Z',
						el: 'const/vec/pz',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'qqqqqed',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Vector(
								_Utils_Tuple3(-1, 0, 0))),
						dX: 'Vector Reflection -X',
						el: 'const/vec/nx',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'eeeeeqa',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Vector(
								_Utils_Tuple3(0, -1, 0))),
						dX: 'Vector Reflection -Y',
						el: 'const/vec/ny',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'eeeeeqw',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Vector(
								_Utils_Tuple3(0, 0, -1))),
						dX: 'Vector Reflection -Z',
						el: 'const/vec/nz',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'eeeeeqd',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Vector(
								_Utils_Tuple3(0, 0, 0))),
						dX: 'Vector Reflection Zero',
						el: 'const/vec/0',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'qqqqq',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Number($elm$core$Basics$pi)),
						dX: 'Arc\'s Reflection',
						el: 'const/double/pi',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'qdwdq',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Number($elm$core$Basics$pi * 2)),
						dX: 'Circle\'s Reflection',
						el: 'const/double/tau',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'eawae',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$Number($elm$core$Basics$e)),
						dX: 'Euler\'s Reflection',
						el: 'const/double/e',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'aaq',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$getEntity,
						dX: 'Entity Purification',
						el: 'get_entity',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2($author$project$Logic$App$Types$NullType, $author$project$Logic$App$Types$Null)),
						fl: 'qqqqqdaqa',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$getEntity,
						dX: 'Entity Purification: Animal',
						el: 'get_entity/animal',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2($author$project$Logic$App$Types$NullType, $author$project$Logic$App$Types$Null)),
						fl: 'qqqqqdaqaawa',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$getEntity,
						dX: 'Entity Purification: Monster',
						el: 'get_entity/monster',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2($author$project$Logic$App$Types$NullType, $author$project$Logic$App$Types$Null)),
						fl: 'qqqqqdaqaawq',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$getEntity,
						dX: 'Entity Purification: Item',
						el: 'get_entity/item',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2($author$project$Logic$App$Types$NullType, $author$project$Logic$App$Types$Null)),
						fl: 'qqqqqdaqaaww',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$getEntity,
						dX: 'Entity Purification: Player',
						el: 'get_entity/player',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2($author$project$Logic$App$Types$NullType, $author$project$Logic$App$Types$Null)),
						fl: 'qqqqqdaqaawe',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$getEntity,
						dX: 'Entity Purification: Living',
						el: 'get_entity/living',
						bF: _List_fromArray(
							[$author$project$Logic$App$Types$EntityType, $author$project$Logic$App$Types$NullType]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2($author$project$Logic$App$Types$NullType, $author$project$Logic$App$Types$Null)),
						fl: 'qqqqqdaqaawd',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
						dX: 'Zone Distillation: Any',
						el: 'zone_entity',
						bF: _List_fromArray(
							[
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
							]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
								$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
						fl: 'qqqqqwded',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
						dX: 'Zone Distillation: Animal',
						el: 'zone_entity/animal',
						bF: _List_fromArray(
							[
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
							]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
								$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
						fl: 'qqqqqwdeddwa',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
						dX: 'Zone Distillation: Non-Animal',
						el: 'zone_entity/not_animal',
						bF: _List_fromArray(
							[
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
							]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
								$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
						fl: 'eeeeewaqaawa',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
						dX: 'Zone Distillation: Monster',
						el: 'zone_entity/monster',
						bF: _List_fromArray(
							[
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
							]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
								$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
						fl: 'qqqqqwdeddwq',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
						dX: 'Zone Distillation: Non-Monster',
						el: 'zone_entity/not_monster',
						bF: _List_fromArray(
							[
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
							]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
								$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
						fl: 'eeeeewaqaawq',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
						dX: 'Zone Distillation: Item',
						el: 'zone_entity/item',
						bF: _List_fromArray(
							[
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
							]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
								$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
						fl: 'qqqqqwdeddww',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
						dX: 'Zone Distillation: Non-Item',
						el: 'zone_entity/not_item',
						bF: _List_fromArray(
							[
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
							]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
								$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
						fl: 'eeeeewaqaaww',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
						dX: 'Zone Distillation: Player',
						el: 'zone_entity/player',
						bF: _List_fromArray(
							[
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
							]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
								$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
						fl: 'qqqqqwdeddwe',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
						dX: 'Zone Distillation: Non-Player',
						el: 'zone_entity/not_player',
						bF: _List_fromArray(
							[
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
							]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
								$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
						fl: 'eeeeewaqaawe',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
						dX: 'Zone Distillation: Living',
						el: 'zone_entity/living',
						bF: _List_fromArray(
							[
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
							]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
								$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
						fl: 'qqqqqwdeddwd',
						dq: 2
					},
						{
						a: $author$project$Logic$App$Patterns$Selectors$zoneEntity,
						dX: 'Zone Distillation: Non-Living',
						el: 'zone_entity/not_living',
						bF: _List_fromArray(
							[
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType)
							]),
						_: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
								$author$project$Logic$App$Types$IotaList($elm$core$Array$empty))),
						fl: 'eeeeewaqaawd',
						dq: 2
					},
						{a: $author$project$Logic$App$Patterns$Lists$append, dX: 'Integration Distillation', el: 'append', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'edqde', dq: 2},
						{a: $author$project$Logic$App$Patterns$Lists$concat, dX: 'Combination Distillation', el: 'concat', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qaeaq', dq: 2},
						{a: $author$project$Logic$App$Patterns$Lists$index, dX: 'Selection Distillation', el: 'index', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'deeed', dq: 2},
						{a: $author$project$Logic$App$Patterns$Lists$listSize, dX: 'Abacus Purification', el: 'list_size', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aqaeaq', dq: 2},
						{a: $author$project$Logic$App$Patterns$Lists$singleton, dX: 'Single\'s Purification', el: 'singleton', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'adeeed', dq: 2},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$IotaList($elm$core$Array$empty)),
						dX: 'Vacant Reflection',
						el: 'empty_list',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'qqaeaae',
						dq: 2
					},
						{a: $author$project$Logic$App$Patterns$Lists$reverseList, dX: 'Retrograde Purification', el: 'reverse_list', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqaede', dq: 2},
						{a: $author$project$Logic$App$Patterns$Lists$lastNList, dX: 'Flock\'s Gambit', el: 'last_n_list', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'ewdqdwe', dq: 2},
						{a: $author$project$Logic$App$Patterns$Lists$splat, dX: 'Flock\'s Disintegration', el: 'splat', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qwaeawq', dq: 2},
						{a: $author$project$Logic$App$Patterns$Lists$indexOf, dX: 'Locator\'s Distillation', el: 'index_of', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'dedqde', dq: 2},
						{a: $author$project$Logic$App$Patterns$Lists$listRemove, dX: 'Excisor\'s Distillation', el: 'list_remove', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'edqdewaqa', dq: 2},
						{a: $author$project$Logic$App$Patterns$Lists$slice, dX: 'Selection Exaltation', el: 'slice', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qaeaqwded', dq: 2},
						{a: $author$project$Logic$App$Patterns$Lists$modifyinPlace, dX: 'Surgeon\'s Exaltation', el: 'modify_in_place', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'wqaeaqw', dq: 2},
						{a: $author$project$Logic$App$Patterns$Lists$construct, dX: 'Speaker\'s Distillation', el: 'construct', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'ddewedd', dq: 2},
						{a: $author$project$Logic$App$Patterns$Lists$deconstruct, dX: 'Speaker\'s Decomposition', el: 'deconstruct', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'aaqwqaa', dq: 2},
						{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, dX: 'Consideration', el: 'escape', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'qqqaw', dq: 3},
						{
						a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(
							$author$project$Logic$App$Types$OpenParenthesis($elm$core$Array$empty)),
						dX: 'Introspection',
						el: 'open_paren',
						bF: _List_Nil,
						_: $elm$core$Maybe$Nothing,
						fl: 'qqq',
						dq: 3
					},
						{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, dX: 'Retrospection', el: 'close_paren', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'eee', dq: 2},
						{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, dX: 'Hermes\' Gambit', el: 'eval', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'deaqq', dq: 4},
						{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, dX: 'Thoth\'s Gambit', el: 'for_each', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'dadad', dq: 0},
						{a: $author$project$Logic$App$Patterns$PatternRegistry$saveMacro, dX: 'Save Macro', el: 'save_macro', bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: 'awaawa', dq: 4}
					]))));
}
var $author$project$Logic$App$Patterns$PatternRegistry$patternRegistry = $author$project$Logic$App$Patterns$PatternRegistry$cyclic$patternRegistry();
$author$project$Logic$App$Patterns$PatternRegistry$cyclic$patternRegistry = function () {
	return $author$project$Logic$App$Patterns$PatternRegistry$patternRegistry;
};
var $author$project$Logic$App$Utils$Utils$ifThenElse = F3(
	function (conditional, a, b) {
		return conditional ? a : b;
	});
var $author$project$Logic$App$Patterns$PatternRegistry$parseBookkeeperCode = function (code) {
	if (code === '-') {
		return {
			a: $author$project$Logic$App$Patterns$Misc$mask(
				_List_fromArray(
					['-'])),
			cw: true,
			ah: $author$project$Settings$Theme$accent1,
			dX: 'Bookkeeper\'s Gambit: -',
			el: 'mask',
			w: 0,
			bF: _List_Nil,
			_: $elm$core$Maybe$Nothing,
			fl: '',
			dq: 2
		};
	} else {
		var toAngleSignature = F2(
			function (codeSegment, accumulator) {
				switch (codeSegment) {
					case '-':
						return (accumulator.U === '-') ? {U: codeSegment, fl: accumulator.fl + 'w'} : ((accumulator.U === 'v') ? {U: codeSegment, fl: accumulator.fl + 'e'} : _Utils_update(
							accumulator,
							{U: codeSegment}));
					case 'v':
						return (accumulator.U === '-') ? {U: codeSegment, fl: accumulator.fl + 'ea'} : ((accumulator.U === 'v') ? {U: codeSegment, fl: accumulator.fl + 'da'} : {U: codeSegment, fl: accumulator.fl + 'a'});
					default:
						return accumulator;
				}
			});
		var codeList = A2($elm$core$String$split, '', code);
		var signature = A3(
			$elm$core$List$foldl,
			toAngleSignature,
			{U: '', fl: ''},
			codeList).fl;
		return {
			a: $author$project$Logic$App$Patterns$Misc$mask(
				A2($elm$core$String$split, '', code)),
			cw: true,
			ah: $author$project$Settings$Theme$accent1,
			dX: 'Bookkeeper\'s Gambit: ' + code,
			el: 'mask',
			w: 0,
			bF: _List_Nil,
			_: $elm$core$Maybe$Nothing,
			fl: signature,
			dq: A3(
				$author$project$Logic$App$Utils$Utils$ifThenElse,
				A2($elm$core$String$startsWith, 'v', code),
				4,
				2)
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
					return _Utils_eq(regPattern.dX, name) || (_Utils_eq(regPattern.el, name) || _Utils_eq(regPattern.fl, name));
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
									return x.cY;
								},
								A2($elm$regex$Regex$find, $author$project$Logic$App$Utils$RegexPatterns$bookkeepersPattern, name)))));
				if (_Utils_eq(
					regexMatch,
					$elm$core$String$trim(name))) {
					return _Utils_Tuple2(
						$author$project$Logic$App$Patterns$PatternRegistry$parseBookkeeperCode(name),
						$elm$core$Platform$Cmd$none);
				} else {
					if (!maybeMacros.$) {
						var macros = maybeMacros.a;
						var _v3 = A2($elm$core$Dict$get, name, macros);
						if (!_v3.$) {
							var value = _v3.a;
							var displayName = value.a;
							var direction = value.b;
							return _Utils_Tuple2(
								{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, cw: true, ah: $author$project$Settings$Theme$accent1, dX: displayName, el: '', w: 0, bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: name, dq: direction},
								$elm$core$Platform$Cmd$none);
						} else {
							var _v5 = $elm$core$List$head(
								A2(
									$elm$core$List$filter,
									function (x) {
										var _v7 = x.b;
										var displayName = _v7.a;
										return _Utils_eq(displayName, name);
									},
									$elm$core$Dict$toList(macros)));
							if (!_v5.$) {
								var _v8 = _v5.a;
								var signature = _v8.a;
								var _v9 = _v8.b;
								var displayName = _v9.a;
								var direction = _v9.b;
								return _Utils_Tuple2(
									{a: $author$project$Logic$App$Patterns$PatternRegistry$noAction, cw: true, ah: $author$project$Settings$Theme$accent1, dX: displayName, el: '', w: 0, bF: _List_Nil, _: $elm$core$Maybe$Nothing, fl: signature, dq: direction},
									$elm$core$Platform$Cmd$none);
							} else {
								return A2($elm$regex$Regex$contains, $author$project$Logic$App$Utils$RegexPatterns$angleSignaturePattern, name) ? _Utils_Tuple2(
									A2($author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature, maybeMacros, name),
									$elm$core$Platform$Cmd$none) : _Utils_Tuple2($author$project$Logic$App$Patterns$PatternRegistry$unknownPattern, $elm$core$Platform$Cmd$none);
							}
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
							_Utils_Tuple2(activePnt.H, activePnt.A),
							_Utils_Tuple2(pnt.H, pnt.A));
					},
					pointsToAdd));
			if (!replacedPnt.$) {
				var point = replacedPnt.a;
				return _Utils_update(
					pnt,
					{ah: $author$project$Settings$Theme$accent2, L: point.L, bq: true});
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
									ah: $author$project$Settings$Theme$accent1,
									L: _List_Nil,
									H: (i * 2) + A2($elm$core$Basics$modBy, 2, r),
									A: r,
									cl: radius,
									bq: false,
									n: (($author$project$Components$App$Grid$spacing(scale) * i) + (($author$project$Components$App$Grid$spacing(scale) / 2) * A2($elm$core$Basics$modBy, 2, r))) + ((gridWidth - ((pointCount - 3.5) * $author$project$Components$App$Grid$spacing(scale))) / 2),
									o: ($author$project$Components$App$Grid$verticalSpacing(scale) * r) + ((gridHeight - ((rowCount - 4) * $author$project$Components$App$Grid$verticalSpacing(scale))) / 2)
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
		var settings = model.aV;
		var grid = model.G;
		var castingContext = model.bv;
		switch (metaActionMsg) {
			case 0:
				return model;
			case 2:
				return _Utils_update(
					model,
					{
						bv: A2($author$project$Logic$App$Utils$EntityContext$setPlayerHeldItemContent, castingContext, $elm$core$Maybe$Nothing),
						G: _Utils_update(
							grid,
							{
								ck: A5($author$project$Components$App$Grid$updateGridPoints, grid.af, grid.cP, $elm$core$Array$empty, _List_Nil, settings.aN)
							}),
						ek: 0,
						c5: $elm$core$Array$empty,
						fn: $elm$core$Array$empty,
						fx: $elm$core$Array$empty
					});
			case 1:
				return _Utils_update(
					model,
					{
						G: _Utils_update(
							grid,
							{
								ck: A5($author$project$Components$App$Grid$updateGridPoints, grid.af, grid.cP, $elm$core$Array$empty, _List_Nil, settings.aN)
							}),
						ek: 0,
						c5: $elm$core$Array$empty,
						fn: $elm$core$Array$empty,
						fx: $elm$core$Array$empty
					});
			case 3:
				var newUncoloredPatternArray = A2(
					$elm_community$array_extra$Array$Extra$removeAt,
					model.ek,
					A2($elm_community$array_extra$Array$Extra$removeAt, model.ek, model.c5));
				var stackResult = A3(
					$author$project$Logic$App$Stack$EvalStack$applyPatternsToStack,
					$elm$core$Array$empty,
					castingContext,
					$elm$core$List$reverse(
						$elm$core$List$unzip(
							$elm$core$Array$toList(newUncoloredPatternArray)).a));
				var resultArray = stackResult.dj;
				var newStack = stackResult.fn;
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
						bv: stackResult.a$,
						G: _Utils_update(
							grid,
							{
								ck: A5($author$project$Components$App$Grid$updateGridPoints, grid.af, grid.cP, newPatternArray, _List_Nil, settings.aN)
							}),
						ek: (_Utils_cmp(
							model.ek,
							$elm$core$Array$length(newPatternArray)) > 0) ? 0 : model.ek,
						c5: newPatternArray,
						fn: newStack,
						fx: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							{c6: -1, fn: $elm$core$Array$empty},
							stackResult.fx)
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
						A2($elm_community$array_extra$Array$Extra$removeAt, model.ek, model.c5)));
				var stackResult = A3(
					$author$project$Logic$App$Stack$EvalStack$applyPatternsToStack,
					$elm$core$Array$empty,
					castingContext,
					$elm$core$List$reverse(
						$elm$core$List$unzip(
							$elm$core$Array$toList(newUncoloredPatternArray)).a));
				var resultArray = stackResult.dj;
				var newStack = stackResult.fn;
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
				var drawPatternsResult = A2($author$project$Logic$App$Grid$drawPatterns, patterns, model.G);
				return _Utils_update(
					model,
					{
						bv: stackResult.a$,
						G: drawPatternsResult.G,
						c5: drawPatternsResult.c5,
						fn: newStack,
						fx: A2(
							$author$project$Logic$App$Utils$Utils$unshift,
							{c6: -1, fn: $elm$core$Array$empty},
							stackResult.fx)
					});
		}
	});
var $MartinSStewart$elm_serialize$Serialize$DataCorrupted = {$: 1};
var $elm$bytes$Bytes$Encode$getWidth = function (builder) {
	switch (builder.$) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 4;
		case 3:
			return 1;
		case 4:
			return 2;
		case 5:
			return 4;
		case 6:
			return 4;
		case 7:
			return 8;
		case 8:
			var w = builder.a;
			return w;
		case 9:
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_width(bs);
	}
};
var $elm$bytes$Bytes$LE = 0;
var $elm$bytes$Bytes$Encode$write = F3(
	function (builder, mb, offset) {
		switch (builder.$) {
			case 0:
				var n = builder.a;
				return A3(_Bytes_write_i8, mb, offset, n);
			case 1:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i16, mb, offset, n, !e);
			case 2:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i32, mb, offset, n, !e);
			case 3:
				var n = builder.a;
				return A3(_Bytes_write_u8, mb, offset, n);
			case 4:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u16, mb, offset, n, !e);
			case 5:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u32, mb, offset, n, !e);
			case 6:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f32, mb, offset, n, !e);
			case 7:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f64, mb, offset, n, !e);
			case 8:
				var bs = builder.b;
				return A3($elm$bytes$Bytes$Encode$writeSequence, bs, mb, offset);
			case 9:
				var s = builder.b;
				return A3(_Bytes_write_string, mb, offset, s);
			default:
				var bs = builder.a;
				return A3(_Bytes_write_bytes, mb, offset, bs);
		}
	});
var $elm$bytes$Bytes$Encode$writeSequence = F3(
	function (builders, mb, offset) {
		writeSequence:
		while (true) {
			if (!builders.b) {
				return offset;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$builders = bs,
					$temp$mb = mb,
					$temp$offset = A3($elm$bytes$Bytes$Encode$write, b, mb, offset);
				builders = $temp$builders;
				mb = $temp$mb;
				offset = $temp$offset;
				continue writeSequence;
			}
		}
	});
var $elm$bytes$Bytes$Encode$encode = _Bytes_encode;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $MartinSStewart$elm_serialize$Serialize$replaceFromUrl = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('[-_]'));
var $elm$bytes$Bytes$Encode$Seq = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$getWidths = F2(
	function (width, builders) {
		getWidths:
		while (true) {
			if (!builders.b) {
				return width;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$width = width + $elm$bytes$Bytes$Encode$getWidth(b),
					$temp$builders = bs;
				width = $temp$width;
				builders = $temp$builders;
				continue getWidths;
			}
		}
	});
var $elm$bytes$Bytes$Encode$sequence = function (builders) {
	return A2(
		$elm$bytes$Bytes$Encode$Seq,
		A2($elm$bytes$Bytes$Encode$getWidths, 0, builders),
		builders);
};
var $elm$bytes$Bytes$BE = 1;
var $danfishgold$base64_bytes$Encode$isValidChar = function (c) {
	if ($elm$core$Char$isAlphaNum(c)) {
		return true;
	} else {
		switch (c) {
			case '+':
				return true;
			case '/':
				return true;
			default:
				return false;
		}
	}
};
var $danfishgold$base64_bytes$Encode$unsafeConvertChar = function (_char) {
	var key = $elm$core$Char$toCode(_char);
	if ((key >= 65) && (key <= 90)) {
		return key - 65;
	} else {
		if ((key >= 97) && (key <= 122)) {
			return (key - 97) + 26;
		} else {
			if ((key >= 48) && (key <= 57)) {
				return ((key - 48) + 26) + 26;
			} else {
				switch (_char) {
					case '+':
						return 62;
					case '/':
						return 63;
					default:
						return -1;
				}
			}
		}
	}
};
var $elm$bytes$Bytes$Encode$U16 = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt16 = $elm$bytes$Bytes$Encode$U16;
var $elm$bytes$Bytes$Encode$U8 = function (a) {
	return {$: 3, a: a};
};
var $elm$bytes$Bytes$Encode$unsignedInt8 = $elm$bytes$Bytes$Encode$U8;
var $danfishgold$base64_bytes$Encode$encodeCharacters = F4(
	function (a, b, c, d) {
		if ($danfishgold$base64_bytes$Encode$isValidChar(a) && $danfishgold$base64_bytes$Encode$isValidChar(b)) {
			var n2 = $danfishgold$base64_bytes$Encode$unsafeConvertChar(b);
			var n1 = $danfishgold$base64_bytes$Encode$unsafeConvertChar(a);
			if ('=' === d) {
				if ('=' === c) {
					var n = (n1 << 18) | (n2 << 12);
					var b1 = n >> 16;
					return $elm$core$Maybe$Just(
						$elm$bytes$Bytes$Encode$unsignedInt8(b1));
				} else {
					if ($danfishgold$base64_bytes$Encode$isValidChar(c)) {
						var n3 = $danfishgold$base64_bytes$Encode$unsafeConvertChar(c);
						var n = ((n1 << 18) | (n2 << 12)) | (n3 << 6);
						var combined = n >> 8;
						return $elm$core$Maybe$Just(
							A2($elm$bytes$Bytes$Encode$unsignedInt16, 1, combined));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}
			} else {
				if ($danfishgold$base64_bytes$Encode$isValidChar(c) && $danfishgold$base64_bytes$Encode$isValidChar(d)) {
					var n4 = $danfishgold$base64_bytes$Encode$unsafeConvertChar(d);
					var n3 = $danfishgold$base64_bytes$Encode$unsafeConvertChar(c);
					var n = ((n1 << 18) | (n2 << 12)) | ((n3 << 6) | n4);
					var combined = n >> 8;
					var b3 = n;
					return $elm$core$Maybe$Just(
						$elm$bytes$Bytes$Encode$sequence(
							_List_fromArray(
								[
									A2($elm$bytes$Bytes$Encode$unsignedInt16, 1, combined),
									$elm$bytes$Bytes$Encode$unsignedInt8(b3)
								])));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $danfishgold$base64_bytes$Encode$encodeChunks = F2(
	function (input, accum) {
		encodeChunks:
		while (true) {
			var _v0 = $elm$core$String$toList(
				A2($elm$core$String$left, 4, input));
			_v0$4:
			while (true) {
				if (!_v0.b) {
					return $elm$core$Maybe$Just(accum);
				} else {
					if (_v0.b.b) {
						if (_v0.b.b.b) {
							if (_v0.b.b.b.b) {
								if (!_v0.b.b.b.b.b) {
									var a = _v0.a;
									var _v1 = _v0.b;
									var b = _v1.a;
									var _v2 = _v1.b;
									var c = _v2.a;
									var _v3 = _v2.b;
									var d = _v3.a;
									var _v4 = A4($danfishgold$base64_bytes$Encode$encodeCharacters, a, b, c, d);
									if (!_v4.$) {
										var enc = _v4.a;
										var $temp$input = A2($elm$core$String$dropLeft, 4, input),
											$temp$accum = A2($elm$core$List$cons, enc, accum);
										input = $temp$input;
										accum = $temp$accum;
										continue encodeChunks;
									} else {
										return $elm$core$Maybe$Nothing;
									}
								} else {
									break _v0$4;
								}
							} else {
								var a = _v0.a;
								var _v5 = _v0.b;
								var b = _v5.a;
								var _v6 = _v5.b;
								var c = _v6.a;
								var _v7 = A4($danfishgold$base64_bytes$Encode$encodeCharacters, a, b, c, '=');
								if (_v7.$ === 1) {
									return $elm$core$Maybe$Nothing;
								} else {
									var enc = _v7.a;
									return $elm$core$Maybe$Just(
										A2($elm$core$List$cons, enc, accum));
								}
							}
						} else {
							var a = _v0.a;
							var _v8 = _v0.b;
							var b = _v8.a;
							var _v9 = A4($danfishgold$base64_bytes$Encode$encodeCharacters, a, b, '=', '=');
							if (_v9.$ === 1) {
								return $elm$core$Maybe$Nothing;
							} else {
								var enc = _v9.a;
								return $elm$core$Maybe$Just(
									A2($elm$core$List$cons, enc, accum));
							}
						}
					} else {
						break _v0$4;
					}
				}
			}
			return $elm$core$Maybe$Nothing;
		}
	});
var $danfishgold$base64_bytes$Encode$encoder = function (string) {
	return A2(
		$elm$core$Maybe$map,
		A2($elm$core$Basics$composeR, $elm$core$List$reverse, $elm$bytes$Bytes$Encode$sequence),
		A2($danfishgold$base64_bytes$Encode$encodeChunks, string, _List_Nil));
};
var $danfishgold$base64_bytes$Encode$toBytes = function (string) {
	return A2(
		$elm$core$Maybe$map,
		$elm$bytes$Bytes$Encode$encode,
		$danfishgold$base64_bytes$Encode$encoder(string));
};
var $danfishgold$base64_bytes$Base64$toBytes = $danfishgold$base64_bytes$Encode$toBytes;
var $MartinSStewart$elm_serialize$Serialize$decode = function (base64text) {
	var strlen = $elm$core$String$length(base64text);
	var replaceChar = function (rematch) {
		var _v0 = rematch.cY;
		if (_v0 === '-') {
			return '+';
		} else {
			return '/';
		}
	};
	if (!strlen) {
		return $elm$core$Maybe$Just(
			$elm$bytes$Bytes$Encode$encode(
				$elm$bytes$Bytes$Encode$sequence(_List_Nil)));
	} else {
		var hanging = A2($elm$core$Basics$modBy, 4, strlen);
		var ilen = (!hanging) ? 0 : (4 - hanging);
		return $danfishgold$base64_bytes$Base64$toBytes(
			A3(
				$elm$regex$Regex$replace,
				$MartinSStewart$elm_serialize$Serialize$replaceFromUrl,
				replaceChar,
				_Utils_ap(
					base64text,
					A2($elm$core$String$repeat, ilen, '='))));
	}
};
var $MartinSStewart$elm_serialize$Serialize$SerializerOutOfDate = {$: 2};
var $elm$bytes$Bytes$Decode$Decoder = $elm$core$Basics$identity;
var $elm$bytes$Bytes$Decode$andThen = F2(
	function (callback, _v0) {
		var decodeA = _v0;
		return F2(
			function (bites, offset) {
				var _v1 = A2(decodeA, bites, offset);
				var newOffset = _v1.a;
				var a = _v1.b;
				var _v2 = callback(a);
				var decodeB = _v2;
				return A2(decodeB, bites, newOffset);
			});
	});
var $elm$bytes$Bytes$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0;
		return A2(_Bytes_decode, decoder, bs);
	});
var $MartinSStewart$elm_serialize$Serialize$getBytesDecoderHelper = function (_v0) {
	var m = _v0;
	return m.P;
};
var $elm$bytes$Bytes$Decode$succeed = function (a) {
	return F2(
		function (_v0, offset) {
			return _Utils_Tuple2(offset, a);
		});
};
var $elm$bytes$Bytes$Decode$unsignedInt8 = _Bytes_read_u8;
var $MartinSStewart$elm_serialize$Serialize$version = 1;
var $MartinSStewart$elm_serialize$Serialize$decodeFromBytes = F2(
	function (codec, bytes_) {
		var decoder = A2(
			$elm$bytes$Bytes$Decode$andThen,
			function (value) {
				return (value <= 0) ? $elm$bytes$Bytes$Decode$succeed(
					$elm$core$Result$Err($MartinSStewart$elm_serialize$Serialize$DataCorrupted)) : (_Utils_eq(value, $MartinSStewart$elm_serialize$Serialize$version) ? $MartinSStewart$elm_serialize$Serialize$getBytesDecoderHelper(codec) : $elm$bytes$Bytes$Decode$succeed(
					$elm$core$Result$Err($MartinSStewart$elm_serialize$Serialize$SerializerOutOfDate)));
			},
			$elm$bytes$Bytes$Decode$unsignedInt8);
		var _v0 = A2($elm$bytes$Bytes$Decode$decode, decoder, bytes_);
		if (!_v0.$) {
			var value = _v0.a;
			return value;
		} else {
			return $elm$core$Result$Err($MartinSStewart$elm_serialize$Serialize$DataCorrupted);
		}
	});
var $MartinSStewart$elm_serialize$Serialize$decodeFromString = F2(
	function (codec, base64) {
		var _v0 = $MartinSStewart$elm_serialize$Serialize$decode(base64);
		if (!_v0.$) {
			var bytes_ = _v0.a;
			return A2($MartinSStewart$elm_serialize$Serialize$decodeFromBytes, codec, bytes_);
		} else {
			return $elm$core$Result$Err($MartinSStewart$elm_serialize$Serialize$DataCorrupted);
		}
	});
var $author$project$Logic$App$ImportExport$ImportExportProject$ProjectData = F3(
	function (patternArray, castingContext, projectName) {
		return {bv: castingContext, c5: patternArray, aU: projectName};
	});
var $author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedCastingContext = F3(
	function (ravenmind, entities, macros) {
		return {d5: entities, et: macros, fa: ravenmind};
	});
var $author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedCastingContextEntity = F2(
	function (heldItem, heldItemContent) {
		return {ea: heldItem, eb: heldItemContent};
	});
var $MartinSStewart$elm_serialize$Serialize$RecordCodec = $elm$core$Basics$identity;
var $MartinSStewart$elm_serialize$Serialize$getBytesEncoderHelper = function (_v0) {
	var m = _v0;
	return m.av;
};
var $MartinSStewart$elm_serialize$Serialize$getJsonDecoderHelper = function (_v0) {
	var m = _v0;
	return m.S;
};
var $MartinSStewart$elm_serialize$Serialize$getJsonEncoderHelper = function (_v0) {
	var m = _v0;
	return m.ay;
};
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $elm$bytes$Bytes$Decode$map2 = F3(
	function (func, _v0, _v1) {
		var decodeA = _v0;
		var decodeB = _v1;
		return F2(
			function (bites, offset) {
				var _v2 = A2(decodeA, bites, offset);
				var aOffset = _v2.a;
				var a = _v2.b;
				var _v3 = A2(decodeB, bites, aOffset);
				var bOffset = _v3.a;
				var b = _v3.b;
				return _Utils_Tuple2(
					bOffset,
					A2(func, a, b));
			});
	});
var $MartinSStewart$elm_serialize$Serialize$field = F3(
	function (getter, codec, _v0) {
		var recordCodec = _v0;
		return {
			P: A3(
				$elm$bytes$Bytes$Decode$map2,
				F2(
					function (f, x) {
						var _v1 = _Utils_Tuple2(f, x);
						if (!_v1.a.$) {
							if (!_v1.b.$) {
								var fOk = _v1.a.a;
								var xOk = _v1.b.a;
								return $elm$core$Result$Ok(
									fOk(xOk));
							} else {
								var err = _v1.b.a;
								return $elm$core$Result$Err(err);
							}
						} else {
							var err = _v1.a.a;
							return $elm$core$Result$Err(err);
						}
					}),
				recordCodec.P,
				$MartinSStewart$elm_serialize$Serialize$getBytesDecoderHelper(codec)),
			av: function (v) {
				return A2(
					$elm$core$List$cons,
					A2(
						$MartinSStewart$elm_serialize$Serialize$getBytesEncoderHelper,
						codec,
						getter(v)),
					recordCodec.av(v));
			},
			bx: recordCodec.bx + 1,
			S: A3(
				$elm$json$Json$Decode$map2,
				F2(
					function (f, x) {
						var _v2 = _Utils_Tuple2(f, x);
						if (!_v2.a.$) {
							if (!_v2.b.$) {
								var fOk = _v2.a.a;
								var xOk = _v2.b.a;
								return $elm$core$Result$Ok(
									fOk(xOk));
							} else {
								var err = _v2.b.a;
								return $elm$core$Result$Err(err);
							}
						} else {
							var err = _v2.a.a;
							return $elm$core$Result$Err(err);
						}
					}),
				recordCodec.S,
				A2(
					$elm$json$Json$Decode$index,
					recordCodec.bx,
					$MartinSStewart$elm_serialize$Serialize$getJsonDecoderHelper(codec))),
			ay: function (v) {
				return A2(
					$elm$core$List$cons,
					A2(
						$MartinSStewart$elm_serialize$Serialize$getJsonEncoderHelper,
						codec,
						getter(v)),
					recordCodec.ay(v));
			}
		};
	});
var $MartinSStewart$elm_serialize$Serialize$Codec = $elm$core$Basics$identity;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $MartinSStewart$elm_serialize$Serialize$finishRecord = function (_v0) {
	var codec = _v0;
	return {
		P: codec.P,
		av: A2(
			$elm$core$Basics$composeR,
			codec.av,
			A2($elm$core$Basics$composeR, $elm$core$List$reverse, $elm$bytes$Bytes$Encode$sequence)),
		S: codec.S,
		ay: A2(
			$elm$core$Basics$composeR,
			codec.ay,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$reverse,
				$elm$json$Json$Encode$list($elm$core$Basics$identity)))
	};
};
var $MartinSStewart$elm_serialize$Serialize$CustomTypeCodec = $elm$core$Basics$identity;
var $MartinSStewart$elm_serialize$Serialize$customType = function (match) {
	return {
		P: function (_v0) {
			return $elm$core$Basics$identity;
		},
		ax: 0,
		S: function (_v1) {
			return $elm$core$Basics$identity;
		},
		bA: match,
		cY: match
	};
};
var $MartinSStewart$elm_serialize$Serialize$build = F4(
	function (encoder_, decoder_, jsonEncoder, jsonDecoder) {
		return {P: decoder_, av: encoder_, S: jsonDecoder, ay: jsonEncoder};
	});
var $MartinSStewart$elm_serialize$Serialize$endian = 1;
var $elm$bytes$Bytes$Decode$unsignedInt16 = function (endianness) {
	return _Bytes_read_u16(!endianness);
};
var $MartinSStewart$elm_serialize$Serialize$finishCustomType = function (_v0) {
	var am = _v0;
	return A4(
		$MartinSStewart$elm_serialize$Serialize$build,
		A2(
			$elm$core$Basics$composeR,
			am.cY,
			function (_v1) {
				var _v2 = _v1;
				var a = _v2.a;
				return a;
			}),
		A2(
			$elm$bytes$Bytes$Decode$andThen,
			function (tag) {
				return A2(
					am.P,
					tag,
					$elm$bytes$Bytes$Decode$succeed(
						$elm$core$Result$Err($MartinSStewart$elm_serialize$Serialize$DataCorrupted)));
			},
			$elm$bytes$Bytes$Decode$unsignedInt16($MartinSStewart$elm_serialize$Serialize$endian)),
		A2(
			$elm$core$Basics$composeR,
			am.bA,
			function (_v3) {
				var _v4 = _v3;
				var a = _v4.b;
				return a;
			}),
		A2(
			$elm$json$Json$Decode$andThen,
			function (tag) {
				return A2(
					am.S,
					tag,
					$elm$json$Json$Decode$succeed(
						$elm$core$Result$Err($MartinSStewart$elm_serialize$Serialize$DataCorrupted)));
			},
			A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$int)));
};
var $MartinSStewart$elm_serialize$Serialize$VariantEncoder = $elm$core$Basics$identity;
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $MartinSStewart$elm_serialize$Serialize$variant = F5(
	function (matchPiece, matchJsonPiece, decoderPiece, jsonDecoderPiece, _v0) {
		var am = _v0;
		var jsonEnc = function (v) {
			return _Utils_Tuple2(
				$elm$bytes$Bytes$Encode$sequence(_List_Nil),
				A2(
					$elm$json$Json$Encode$list,
					$elm$core$Basics$identity,
					A2(
						$elm$core$List$cons,
						$elm$json$Json$Encode$int(am.ax),
						v)));
		};
		var jsonDecoder_ = F2(
			function (tag, orElse) {
				return _Utils_eq(tag, am.ax) ? jsonDecoderPiece : A2(am.S, tag, orElse);
			});
		var enc = function (v) {
			return _Utils_Tuple2(
				$elm$bytes$Bytes$Encode$sequence(
					A2(
						$elm$core$List$cons,
						A2($elm$bytes$Bytes$Encode$unsignedInt16, $MartinSStewart$elm_serialize$Serialize$endian, am.ax),
						v)),
				$elm$json$Json$Encode$null);
		};
		var decoder_ = F2(
			function (tag, orElse) {
				return _Utils_eq(tag, am.ax) ? decoderPiece : A2(am.P, tag, orElse);
			});
		return {
			P: decoder_,
			ax: am.ax + 1,
			S: jsonDecoder_,
			bA: am.bA(
				matchJsonPiece(jsonEnc)),
			cY: am.cY(
				matchPiece(enc))
		};
	});
var $MartinSStewart$elm_serialize$Serialize$variant0 = function (ctor) {
	return A4(
		$MartinSStewart$elm_serialize$Serialize$variant,
		function (c) {
			return c(_List_Nil);
		},
		function (c) {
			return c(_List_Nil);
		},
		$elm$bytes$Bytes$Decode$succeed(
			$elm$core$Result$Ok(ctor)),
		$elm$json$Json$Decode$succeed(
			$elm$core$Result$Ok(ctor)));
};
var $author$project$Logic$App$ImportExport$ImportExportProject$heldItemCodec = $MartinSStewart$elm_serialize$Serialize$finishCustomType(
	A2(
		$MartinSStewart$elm_serialize$Serialize$variant0,
		6,
		A2(
			$MartinSStewart$elm_serialize$Serialize$variant0,
			5,
			A2(
				$MartinSStewart$elm_serialize$Serialize$variant0,
				4,
				A2(
					$MartinSStewart$elm_serialize$Serialize$variant0,
					3,
					A2(
						$MartinSStewart$elm_serialize$Serialize$variant0,
						2,
						A2(
							$MartinSStewart$elm_serialize$Serialize$variant0,
							1,
							A2(
								$MartinSStewart$elm_serialize$Serialize$variant0,
								0,
								$MartinSStewart$elm_serialize$Serialize$customType(
									F8(
										function (trinketEncoder, artifactEncoder, cypherEncoder, focusEncoder, spellbookEncoder, pieEncoder, noItemEncoder, value) {
											switch (value) {
												case 0:
													return trinketEncoder;
												case 1:
													return artifactEncoder;
												case 2:
													return cypherEncoder;
												case 3:
													return focusEncoder;
												case 4:
													return spellbookEncoder;
												case 5:
													return pieEncoder;
												default:
													return noItemEncoder;
											}
										}))))))))));
var $author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedBoolean = function (a) {
	return {$: 2, a: a};
};
var $author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedEntity = function (a) {
	return {$: 3, a: a};
};
var $author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedGarbage = function (a) {
	return {$: 7, a: a};
};
var $author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedIotaList = function (a) {
	return {$: 4, a: a};
};
var $author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedNull = {$: 6};
var $author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedNumber = function (a) {
	return {$: 0, a: a};
};
var $author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedOpenParenthesis = function (a) {
	return {$: 8, a: a};
};
var $author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedPatternIota = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedVector = function (a) {
	return {$: 1, a: a};
};
var $elm$bytes$Bytes$Encode$U32 = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt32 = $elm$bytes$Bytes$Encode$U32;
var $MartinSStewart$elm_serialize$Serialize$listEncode = F2(
	function (encoder_, list_) {
		return $elm$bytes$Bytes$Encode$sequence(
			A2(
				$elm$core$List$cons,
				A2(
					$elm$bytes$Bytes$Encode$unsignedInt32,
					$MartinSStewart$elm_serialize$Serialize$endian,
					$elm$core$List$length(list_)),
				A2($elm$core$List$map, encoder_, list_)));
	});
var $elm$bytes$Bytes$Decode$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$bytes$Bytes$Decode$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$bytes$Bytes$Decode$map = F2(
	function (func, _v0) {
		var decodeA = _v0;
		return F2(
			function (bites, offset) {
				var _v1 = A2(decodeA, bites, offset);
				var aOffset = _v1.a;
				var a = _v1.b;
				return _Utils_Tuple2(
					aOffset,
					func(a));
			});
	});
var $MartinSStewart$elm_serialize$Serialize$listStep = F2(
	function (decoder_, _v0) {
		var n = _v0.a;
		var xs = _v0.b;
		return (n <= 0) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(
				$elm$core$Result$Ok(
					$elm$core$List$reverse(xs)))) : A2(
			$elm$bytes$Bytes$Decode$map,
			function (x) {
				if (!x.$) {
					var ok = x.a;
					return $elm$bytes$Bytes$Decode$Loop(
						_Utils_Tuple2(
							n - 1,
							A2($elm$core$List$cons, ok, xs)));
				} else {
					var err = x.a;
					return $elm$bytes$Bytes$Decode$Done(
						$elm$core$Result$Err(err));
				}
			},
			decoder_);
	});
var $elm$bytes$Bytes$Decode$loopHelp = F4(
	function (state, callback, bites, offset) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var decoder = _v0;
			var _v1 = A2(decoder, bites, offset);
			var newOffset = _v1.a;
			var step = _v1.b;
			if (!step.$) {
				var newState = step.a;
				var $temp$state = newState,
					$temp$callback = callback,
					$temp$bites = bites,
					$temp$offset = newOffset;
				state = $temp$state;
				callback = $temp$callback;
				bites = $temp$bites;
				offset = $temp$offset;
				continue loopHelp;
			} else {
				var result = step.a;
				return _Utils_Tuple2(newOffset, result);
			}
		}
	});
var $elm$bytes$Bytes$Decode$loop = F2(
	function (state, callback) {
		return A2($elm$bytes$Bytes$Decode$loopHelp, state, callback);
	});
var $elm$bytes$Bytes$Decode$unsignedInt32 = function (endianness) {
	return _Bytes_read_u32(!endianness);
};
var $MartinSStewart$elm_serialize$Serialize$list = function (codec) {
	return A4(
		$MartinSStewart$elm_serialize$Serialize$build,
		$MartinSStewart$elm_serialize$Serialize$listEncode(
			$MartinSStewart$elm_serialize$Serialize$getBytesEncoderHelper(codec)),
		A2(
			$elm$bytes$Bytes$Decode$andThen,
			function (length) {
				return A2(
					$elm$bytes$Bytes$Decode$loop,
					_Utils_Tuple2(length, _List_Nil),
					$MartinSStewart$elm_serialize$Serialize$listStep(
						$MartinSStewart$elm_serialize$Serialize$getBytesDecoderHelper(codec)));
			},
			$elm$bytes$Bytes$Decode$unsignedInt32($MartinSStewart$elm_serialize$Serialize$endian)),
		$elm$json$Json$Encode$list(
			$MartinSStewart$elm_serialize$Serialize$getJsonEncoderHelper(codec)),
		A2(
			$elm$json$Json$Decode$map,
			A2(
				$elm$core$List$foldr,
				F2(
					function (value, state) {
						var _v0 = _Utils_Tuple2(value, state);
						if (_v0.b.$ === 1) {
							return state;
						} else {
							if (!_v0.a.$) {
								var ok = _v0.a.a;
								var okState = _v0.b.a;
								return $elm$core$Result$Ok(
									A2($elm$core$List$cons, ok, okState));
							} else {
								var error = _v0.a.a;
								return $elm$core$Result$Err(error);
							}
						}
					}),
				$elm$core$Result$Ok(_List_Nil)),
			$elm$json$Json$Decode$list(
				$MartinSStewart$elm_serialize$Serialize$getJsonDecoderHelper(codec))));
};
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $MartinSStewart$elm_serialize$Serialize$mapHelper = F3(
	function (fromBytes_, toBytes_, codec) {
		return A4(
			$MartinSStewart$elm_serialize$Serialize$build,
			function (v) {
				return A2(
					$MartinSStewart$elm_serialize$Serialize$getBytesEncoderHelper,
					codec,
					toBytes_(v));
			},
			A2(
				$elm$bytes$Bytes$Decode$map,
				fromBytes_,
				$MartinSStewart$elm_serialize$Serialize$getBytesDecoderHelper(codec)),
			function (v) {
				return A2(
					$MartinSStewart$elm_serialize$Serialize$getJsonEncoderHelper,
					codec,
					toBytes_(v));
			},
			A2(
				$elm$json$Json$Decode$map,
				fromBytes_,
				$MartinSStewart$elm_serialize$Serialize$getJsonDecoderHelper(codec)));
	});
var $MartinSStewart$elm_serialize$Serialize$array = function (codec) {
	return A3(
		$MartinSStewart$elm_serialize$Serialize$mapHelper,
		$elm$core$Result$map($elm$core$Array$fromList),
		$elm$core$Array$toList,
		$MartinSStewart$elm_serialize$Serialize$list(codec));
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $MartinSStewart$elm_serialize$Serialize$bool = A4(
	$MartinSStewart$elm_serialize$Serialize$build,
	function (value) {
		if (value) {
			return $elm$bytes$Bytes$Encode$unsignedInt8(1);
		} else {
			return $elm$bytes$Bytes$Encode$unsignedInt8(0);
		}
	},
	A2(
		$elm$bytes$Bytes$Decode$map,
		function (value) {
			switch (value) {
				case 0:
					return $elm$core$Result$Ok(false);
				case 1:
					return $elm$core$Result$Ok(true);
				default:
					return $elm$core$Result$Err($MartinSStewart$elm_serialize$Serialize$DataCorrupted);
			}
		},
		$elm$bytes$Bytes$Decode$unsignedInt8),
	$elm$json$Json$Encode$bool,
	A2($elm$json$Json$Decode$map, $elm$core$Result$Ok, $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$bytes$Bytes$Decode$float64 = function (endianness) {
	return _Bytes_read_f64(!endianness);
};
var $elm$bytes$Bytes$Encode$F64 = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$float64 = $elm$bytes$Bytes$Encode$F64;
var $MartinSStewart$elm_serialize$Serialize$float = A4(
	$MartinSStewart$elm_serialize$Serialize$build,
	$elm$bytes$Bytes$Encode$float64($MartinSStewart$elm_serialize$Serialize$endian),
	A2(
		$elm$bytes$Bytes$Decode$map,
		$elm$core$Result$Ok,
		$elm$bytes$Bytes$Decode$float64($MartinSStewart$elm_serialize$Serialize$endian)),
	$elm$json$Json$Encode$float,
	A2($elm$json$Json$Decode$map, $elm$core$Result$Ok, $elm$json$Json$Decode$float));
var $MartinSStewart$elm_serialize$Serialize$lazy = function (f) {
	return A4(
		$MartinSStewart$elm_serialize$Serialize$build,
		function (value) {
			return A2(
				$MartinSStewart$elm_serialize$Serialize$getBytesEncoderHelper,
				f(0),
				value);
		},
		A2(
			$elm$bytes$Bytes$Decode$andThen,
			function (_v0) {
				return $MartinSStewart$elm_serialize$Serialize$getBytesDecoderHelper(
					f(0));
			},
			$elm$bytes$Bytes$Decode$succeed(0)),
		function (value) {
			return A2(
				$MartinSStewart$elm_serialize$Serialize$getJsonEncoderHelper,
				f(0),
				value);
		},
		A2(
			$elm$json$Json$Decode$andThen,
			function (_v1) {
				return $MartinSStewart$elm_serialize$Serialize$getJsonDecoderHelper(
					f(0));
			},
			$elm$json$Json$Decode$succeed(0)));
};
var $author$project$Logic$App$Types$DelveTooDeep = 9;
var $author$project$Logic$App$Types$DisallowedAction = 11;
var $author$project$Logic$App$Types$EntityIsImmune = 5;
var $author$project$Logic$App$Types$EntityOutOfAmbit = 4;
var $author$project$Logic$App$Types$IncorrectBlock = 8;
var $author$project$Logic$App$Types$IncorrectItem = 7;
var $author$project$Logic$App$Types$TransgressOther = 10;
var $author$project$Logic$App$Types$VectorOutOfAmbit = 3;
var $author$project$Logic$App$ImportExport$ImportExportProject$mishapCodec = $MartinSStewart$elm_serialize$Serialize$finishCustomType(
	A2(
		$MartinSStewart$elm_serialize$Serialize$variant0,
		12,
		A2(
			$MartinSStewart$elm_serialize$Serialize$variant0,
			11,
			A2(
				$MartinSStewart$elm_serialize$Serialize$variant0,
				10,
				A2(
					$MartinSStewart$elm_serialize$Serialize$variant0,
					9,
					A2(
						$MartinSStewart$elm_serialize$Serialize$variant0,
						8,
						A2(
							$MartinSStewart$elm_serialize$Serialize$variant0,
							7,
							A2(
								$MartinSStewart$elm_serialize$Serialize$variant0,
								6,
								A2(
									$MartinSStewart$elm_serialize$Serialize$variant0,
									5,
									A2(
										$MartinSStewart$elm_serialize$Serialize$variant0,
										4,
										A2(
											$MartinSStewart$elm_serialize$Serialize$variant0,
											3,
											A2(
												$MartinSStewart$elm_serialize$Serialize$variant0,
												2,
												A2(
													$MartinSStewart$elm_serialize$Serialize$variant0,
													1,
													A2(
														$MartinSStewart$elm_serialize$Serialize$variant0,
														0,
														$MartinSStewart$elm_serialize$Serialize$customType(
															function (invalidpatternencoder) {
																return function (notenoughiotasencoder) {
																	return function (incorrectiotaencoder) {
																		return function (vectoroutofambitencoder) {
																			return function (entityoutofambitencoder) {
																				return function (entityisimmuneencoder) {
																					return function (mathematicalerrorencoder) {
																						return function (incorrectitemencoder) {
																							return function (incorrectblockencoder) {
																								return function (delvetoodeepencoder) {
																									return function (transgressotherencoder) {
																										return function (disallowedactionencoder) {
																											return function (catastrophicfailureencoder) {
																												return function (value) {
																													switch (value) {
																														case 0:
																															return invalidpatternencoder;
																														case 1:
																															return notenoughiotasencoder;
																														case 2:
																															return incorrectiotaencoder;
																														case 3:
																															return vectoroutofambitencoder;
																														case 4:
																															return entityoutofambitencoder;
																														case 5:
																															return entityisimmuneencoder;
																														case 6:
																															return mathematicalerrorencoder;
																														case 7:
																															return incorrectitemencoder;
																														case 8:
																															return incorrectblockencoder;
																														case 9:
																															return delvetoodeepencoder;
																														case 10:
																															return transgressotherencoder;
																														case 11:
																															return disallowedactionencoder;
																														default:
																															return catastrophicfailureencoder;
																													}
																												};
																											};
																										};
																									};
																								};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															})))))))))))))));
var $author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedPattern = F3(
	function (signature, active, startDirection) {
		return {cw: active, fl: signature, dq: startDirection};
	});
var $author$project$Logic$App$ImportExport$ImportExportProject$directionCodec = $MartinSStewart$elm_serialize$Serialize$finishCustomType(
	A2(
		$MartinSStewart$elm_serialize$Serialize$variant0,
		6,
		A2(
			$MartinSStewart$elm_serialize$Serialize$variant0,
			5,
			A2(
				$MartinSStewart$elm_serialize$Serialize$variant0,
				4,
				A2(
					$MartinSStewart$elm_serialize$Serialize$variant0,
					3,
					A2(
						$MartinSStewart$elm_serialize$Serialize$variant0,
						2,
						A2(
							$MartinSStewart$elm_serialize$Serialize$variant0,
							1,
							A2(
								$MartinSStewart$elm_serialize$Serialize$variant0,
								0,
								$MartinSStewart$elm_serialize$Serialize$customType(
									F8(
										function (northeastEncoder, northwestEncoder, eastEncoder, westEncoder, southeastEncoder, southwestEncoder, errorDirectionEncoder, value) {
											switch (value) {
												case 0:
													return northeastEncoder;
												case 1:
													return northwestEncoder;
												case 2:
													return eastEncoder;
												case 3:
													return westEncoder;
												case 4:
													return southeastEncoder;
												case 5:
													return southwestEncoder;
												default:
													return errorDirectionEncoder;
											}
										}))))))))));
var $MartinSStewart$elm_serialize$Serialize$record = function (ctor) {
	return {
		P: $elm$bytes$Bytes$Decode$succeed(
			$elm$core$Result$Ok(ctor)),
		av: function (_v0) {
			return _List_Nil;
		},
		bx: 0,
		S: $elm$json$Json$Decode$succeed(
			$elm$core$Result$Ok(ctor)),
		ay: function (_v1) {
			return _List_Nil;
		}
	};
};
var $elm$bytes$Bytes$Encode$getStringWidth = _Bytes_getStringWidth;
var $elm$bytes$Bytes$Decode$string = function (n) {
	return _Bytes_read_string(n);
};
var $elm$bytes$Bytes$Encode$Utf8 = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$string = function (str) {
	return A2(
		$elm$bytes$Bytes$Encode$Utf8,
		_Bytes_getStringWidth(str),
		str);
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $MartinSStewart$elm_serialize$Serialize$string = A4(
	$MartinSStewart$elm_serialize$Serialize$build,
	function (text) {
		return $elm$bytes$Bytes$Encode$sequence(
			_List_fromArray(
				[
					A2(
					$elm$bytes$Bytes$Encode$unsignedInt32,
					$MartinSStewart$elm_serialize$Serialize$endian,
					$elm$bytes$Bytes$Encode$getStringWidth(text)),
					$elm$bytes$Bytes$Encode$string(text)
				]));
	},
	A2(
		$elm$bytes$Bytes$Decode$andThen,
		function (charCount) {
			return A2(
				$elm$bytes$Bytes$Decode$map,
				$elm$core$Result$Ok,
				$elm$bytes$Bytes$Decode$string(charCount));
		},
		$elm$bytes$Bytes$Decode$unsignedInt32($MartinSStewart$elm_serialize$Serialize$endian)),
	$elm$json$Json$Encode$string,
	A2($elm$json$Json$Decode$map, $elm$core$Result$Ok, $elm$json$Json$Decode$string));
var $author$project$Logic$App$ImportExport$ImportExportProject$patternCodec = $MartinSStewart$elm_serialize$Serialize$finishRecord(
	A3(
		$MartinSStewart$elm_serialize$Serialize$field,
		function ($) {
			return $.dq;
		},
		$author$project$Logic$App$ImportExport$ImportExportProject$directionCodec,
		A3(
			$MartinSStewart$elm_serialize$Serialize$field,
			function ($) {
				return $.cw;
			},
			$MartinSStewart$elm_serialize$Serialize$bool,
			A3(
				$MartinSStewart$elm_serialize$Serialize$field,
				function ($) {
					return $.fl;
				},
				$MartinSStewart$elm_serialize$Serialize$string,
				$MartinSStewart$elm_serialize$Serialize$record($author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedPattern)))));
var $MartinSStewart$elm_serialize$Serialize$triple = F3(
	function (codecFirst, codecSecond, codecThird) {
		return $MartinSStewart$elm_serialize$Serialize$finishRecord(
			A3(
				$MartinSStewart$elm_serialize$Serialize$field,
				function (_v2) {
					var c = _v2.c;
					return c;
				},
				codecThird,
				A3(
					$MartinSStewart$elm_serialize$Serialize$field,
					function (_v1) {
						var b = _v1.b;
						return b;
					},
					codecSecond,
					A3(
						$MartinSStewart$elm_serialize$Serialize$field,
						function (_v0) {
							var a = _v0.a;
							return a;
						},
						codecFirst,
						$MartinSStewart$elm_serialize$Serialize$record(
							F3(
								function (a, b, c) {
									return _Utils_Tuple3(a, b, c);
								}))))));
	});
var $MartinSStewart$elm_serialize$Serialize$result1 = F2(
	function (ctor, value) {
		if (!value.$) {
			var ok = value.a;
			return $elm$core$Result$Ok(
				ctor(ok));
		} else {
			var err = value.a;
			return $elm$core$Result$Err(err);
		}
	});
var $MartinSStewart$elm_serialize$Serialize$variant1 = F2(
	function (ctor, m1) {
		return A4(
			$MartinSStewart$elm_serialize$Serialize$variant,
			F2(
				function (c, v) {
					return c(
						_List_fromArray(
							[
								A2($MartinSStewart$elm_serialize$Serialize$getBytesEncoderHelper, m1, v)
							]));
				}),
			F2(
				function (c, v) {
					return c(
						_List_fromArray(
							[
								A2($MartinSStewart$elm_serialize$Serialize$getJsonEncoderHelper, m1, v)
							]));
				}),
			A2(
				$elm$bytes$Bytes$Decode$map,
				$MartinSStewart$elm_serialize$Serialize$result1(ctor),
				$MartinSStewart$elm_serialize$Serialize$getBytesDecoderHelper(m1)),
			A2(
				$elm$json$Json$Decode$map,
				$MartinSStewart$elm_serialize$Serialize$result1(ctor),
				A2(
					$elm$json$Json$Decode$index,
					1,
					$MartinSStewart$elm_serialize$Serialize$getJsonDecoderHelper(m1))));
	});
var $MartinSStewart$elm_serialize$Serialize$result2 = F3(
	function (ctor, v1, v2) {
		var _v0 = _Utils_Tuple2(v1, v2);
		if (!_v0.a.$) {
			if (!_v0.b.$) {
				var ok1 = _v0.a.a;
				var ok2 = _v0.b.a;
				return $elm$core$Result$Ok(
					A2(ctor, ok1, ok2));
			} else {
				var err = _v0.b.a;
				return $elm$core$Result$Err(err);
			}
		} else {
			var err = _v0.a.a;
			return $elm$core$Result$Err(err);
		}
	});
var $MartinSStewart$elm_serialize$Serialize$variant2 = F3(
	function (ctor, m1, m2) {
		return A4(
			$MartinSStewart$elm_serialize$Serialize$variant,
			F3(
				function (c, v1, v2) {
					return c(
						_List_fromArray(
							[
								A2($MartinSStewart$elm_serialize$Serialize$getBytesEncoderHelper, m1, v1),
								A2($MartinSStewart$elm_serialize$Serialize$getBytesEncoderHelper, m2, v2)
							]));
				}),
			F3(
				function (c, v1, v2) {
					return c(
						_List_fromArray(
							[
								A2($MartinSStewart$elm_serialize$Serialize$getJsonEncoderHelper, m1, v1),
								A2($MartinSStewart$elm_serialize$Serialize$getJsonEncoderHelper, m2, v2)
							]));
				}),
			A3(
				$elm$bytes$Bytes$Decode$map2,
				$MartinSStewart$elm_serialize$Serialize$result2(ctor),
				$MartinSStewart$elm_serialize$Serialize$getBytesDecoderHelper(m1),
				$MartinSStewart$elm_serialize$Serialize$getBytesDecoderHelper(m2)),
			A3(
				$elm$json$Json$Decode$map2,
				$MartinSStewart$elm_serialize$Serialize$result2(ctor),
				A2(
					$elm$json$Json$Decode$index,
					1,
					$MartinSStewart$elm_serialize$Serialize$getJsonDecoderHelper(m1)),
				A2(
					$elm$json$Json$Decode$index,
					2,
					$MartinSStewart$elm_serialize$Serialize$getJsonDecoderHelper(m2))));
	});
function $author$project$Logic$App$ImportExport$ImportExportProject$cyclic$iotaCodec() {
	return $MartinSStewart$elm_serialize$Serialize$finishCustomType(
		A3(
			$MartinSStewart$elm_serialize$Serialize$variant1,
			$author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedOpenParenthesis,
			$MartinSStewart$elm_serialize$Serialize$array(
				$MartinSStewart$elm_serialize$Serialize$lazy(
					function (_v2) {
						return $author$project$Logic$App$ImportExport$ImportExportProject$cyclic$iotaCodec();
					})),
			A3(
				$MartinSStewart$elm_serialize$Serialize$variant1,
				$author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedGarbage,
				$author$project$Logic$App$ImportExport$ImportExportProject$mishapCodec,
				A2(
					$MartinSStewart$elm_serialize$Serialize$variant0,
					$author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedNull,
					A4(
						$MartinSStewart$elm_serialize$Serialize$variant2,
						$author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedPatternIota,
						$author$project$Logic$App$ImportExport$ImportExportProject$patternCodec,
						$MartinSStewart$elm_serialize$Serialize$bool,
						A3(
							$MartinSStewart$elm_serialize$Serialize$variant1,
							$author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedIotaList,
							$MartinSStewart$elm_serialize$Serialize$array(
								$MartinSStewart$elm_serialize$Serialize$lazy(
									function (_v1) {
										return $author$project$Logic$App$ImportExport$ImportExportProject$cyclic$iotaCodec();
									})),
							A3(
								$MartinSStewart$elm_serialize$Serialize$variant1,
								$author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedEntity,
								$MartinSStewart$elm_serialize$Serialize$string,
								A3(
									$MartinSStewart$elm_serialize$Serialize$variant1,
									$author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedBoolean,
									$MartinSStewart$elm_serialize$Serialize$bool,
									A3(
										$MartinSStewart$elm_serialize$Serialize$variant1,
										$author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedVector,
										A3($MartinSStewart$elm_serialize$Serialize$triple, $MartinSStewart$elm_serialize$Serialize$float, $MartinSStewart$elm_serialize$Serialize$float, $MartinSStewart$elm_serialize$Serialize$float),
										A3(
											$MartinSStewart$elm_serialize$Serialize$variant1,
											$author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedNumber,
											$MartinSStewart$elm_serialize$Serialize$float,
											$MartinSStewart$elm_serialize$Serialize$customType(
												function (numberEncoder) {
													return function (vectorEncoder) {
														return function (booleanEncoder) {
															return function (entityEncoder) {
																return function (iotaListEncoder) {
																	return function (patternIotaEncoder) {
																		return function (nullEncoder) {
																			return function (garbageEncoder) {
																				return function (openParenthesisEncoder) {
																					return function (value) {
																						switch (value.$) {
																							case 0:
																								var number = value.a;
																								return numberEncoder(number);
																							case 1:
																								var vector = value.a;
																								return vectorEncoder(vector);
																							case 2:
																								var _boolean = value.a;
																								return booleanEncoder(_boolean);
																							case 3:
																								var entity = value.a;
																								return entityEncoder(entity);
																							case 4:
																								var list = value.a;
																								return iotaListEncoder(list);
																							case 5:
																								var pattern = value.a;
																								var considered = value.b;
																								return A2(patternIotaEncoder, pattern, considered);
																							case 6:
																								return nullEncoder;
																							case 7:
																								var mishap = value.a;
																								return garbageEncoder(mishap);
																							default:
																								var list = value.a;
																								return openParenthesisEncoder(list);
																						}
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												})))))))))));
}
var $author$project$Logic$App$ImportExport$ImportExportProject$iotaCodec = $author$project$Logic$App$ImportExport$ImportExportProject$cyclic$iotaCodec();
$author$project$Logic$App$ImportExport$ImportExportProject$cyclic$iotaCodec = function () {
	return $author$project$Logic$App$ImportExport$ImportExportProject$iotaCodec;
};
var $MartinSStewart$elm_serialize$Serialize$maybe = function (justCodec) {
	return $MartinSStewart$elm_serialize$Serialize$finishCustomType(
		A3(
			$MartinSStewart$elm_serialize$Serialize$variant1,
			$elm$core$Maybe$Just,
			justCodec,
			A2(
				$MartinSStewart$elm_serialize$Serialize$variant0,
				$elm$core$Maybe$Nothing,
				$MartinSStewart$elm_serialize$Serialize$customType(
					F3(
						function (nothingEncoder, justEncoder, value) {
							if (value.$ === 1) {
								return nothingEncoder;
							} else {
								var value_ = value.a;
								return justEncoder(value_);
							}
						})))));
};
var $author$project$Logic$App$ImportExport$ImportExportProject$castingContextentityCodec = $MartinSStewart$elm_serialize$Serialize$finishRecord(
	A3(
		$MartinSStewart$elm_serialize$Serialize$field,
		function ($) {
			return $.eb;
		},
		$MartinSStewart$elm_serialize$Serialize$maybe($author$project$Logic$App$ImportExport$ImportExportProject$iotaCodec),
		A3(
			$MartinSStewart$elm_serialize$Serialize$field,
			function ($) {
				return $.ea;
			},
			$author$project$Logic$App$ImportExport$ImportExportProject$heldItemCodec,
			$MartinSStewart$elm_serialize$Serialize$record($author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedCastingContextEntity))));
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $MartinSStewart$elm_serialize$Serialize$tuple = F2(
	function (codecFirst, codecSecond) {
		return $MartinSStewart$elm_serialize$Serialize$finishRecord(
			A3(
				$MartinSStewart$elm_serialize$Serialize$field,
				$elm$core$Tuple$second,
				codecSecond,
				A3(
					$MartinSStewart$elm_serialize$Serialize$field,
					$elm$core$Tuple$first,
					codecFirst,
					$MartinSStewart$elm_serialize$Serialize$record($elm$core$Tuple$pair))));
	});
var $MartinSStewart$elm_serialize$Serialize$dict = F2(
	function (keyCodec, valueCodec) {
		return A3(
			$MartinSStewart$elm_serialize$Serialize$mapHelper,
			$elm$core$Result$map($elm$core$Dict$fromList),
			$elm$core$Dict$toList,
			$MartinSStewart$elm_serialize$Serialize$list(
				A2($MartinSStewart$elm_serialize$Serialize$tuple, keyCodec, valueCodec)));
	});
var $author$project$Logic$App$ImportExport$ImportExportProject$castingContextCodec = $MartinSStewart$elm_serialize$Serialize$finishRecord(
	A3(
		$MartinSStewart$elm_serialize$Serialize$field,
		function ($) {
			return $.et;
		},
		A2(
			$MartinSStewart$elm_serialize$Serialize$dict,
			$MartinSStewart$elm_serialize$Serialize$string,
			A3($MartinSStewart$elm_serialize$Serialize$triple, $MartinSStewart$elm_serialize$Serialize$string, $author$project$Logic$App$ImportExport$ImportExportProject$directionCodec, $author$project$Logic$App$ImportExport$ImportExportProject$iotaCodec)),
		A3(
			$MartinSStewart$elm_serialize$Serialize$field,
			function ($) {
				return $.d5;
			},
			A2($MartinSStewart$elm_serialize$Serialize$dict, $MartinSStewart$elm_serialize$Serialize$string, $author$project$Logic$App$ImportExport$ImportExportProject$castingContextentityCodec),
			A3(
				$MartinSStewart$elm_serialize$Serialize$field,
				function ($) {
					return $.fa;
				},
				$MartinSStewart$elm_serialize$Serialize$maybe($author$project$Logic$App$ImportExport$ImportExportProject$iotaCodec),
				$MartinSStewart$elm_serialize$Serialize$record($author$project$Logic$App$ImportExport$ImportExportProject$SimplifiedCastingContext)))));
var $author$project$Logic$App$ImportExport$ImportExportProject$patternArrayCodec = $MartinSStewart$elm_serialize$Serialize$array($author$project$Logic$App$ImportExport$ImportExportProject$patternCodec);
var $author$project$Logic$App$ImportExport$ImportExportProject$projectCodec = $MartinSStewart$elm_serialize$Serialize$finishRecord(
	A3(
		$MartinSStewart$elm_serialize$Serialize$field,
		function ($) {
			return $.aU;
		},
		$MartinSStewart$elm_serialize$Serialize$string,
		A3(
			$MartinSStewart$elm_serialize$Serialize$field,
			function ($) {
				return $.bv;
			},
			$author$project$Logic$App$ImportExport$ImportExportProject$castingContextCodec,
			A3(
				$MartinSStewart$elm_serialize$Serialize$field,
				function ($) {
					return $.c5;
				},
				$author$project$Logic$App$ImportExport$ImportExportProject$patternArrayCodec,
				$MartinSStewart$elm_serialize$Serialize$record($author$project$Logic$App$ImportExport$ImportExportProject$ProjectData)))));
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Logic$App$ImportExport$ImportExportProject$decodeProjectData = function (encodedProjectData) {
	return $elm$core$Result$toMaybe(
		A2($MartinSStewart$elm_serialize$Serialize$decodeFromString, $author$project$Logic$App$ImportExport$ImportExportProject$projectCodec, encodedProjectData));
};
var $elm$file$File$Select$file = F2(
	function (mimes, toMsg) {
		return A2(
			$elm$core$Task$perform,
			toMsg,
			_File_uploadOne(mimes));
	});
var $author$project$Components$App$Grid$genDrawnPointsFromPatternArray = function (patternArray) {
	return A2(
		$elm$core$List$concatMap,
		$elm$core$Tuple$second,
		$elm$core$Array$toList(patternArray));
};
var $author$project$Logic$App$Utils$GetAngleSignature$getAngleSignatureAndStartDir = function (unflippedPath) {
	var path = $elm$core$List$reverse(unflippedPath);
	var getAngleLetter = F2(
		function (direction1, direction2) {
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(
					$elm$core$Maybe$map,
					$elm$core$Tuple$first,
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (x) {
								return _Utils_eq(
									x.b,
									_Utils_Tuple2(direction1, direction2));
							},
							$author$project$Logic$App$Utils$LetterMap$letterMap))));
		});
	var directionVector = function (_v0) {
		var x1 = _v0.bP;
		var x2 = _v0.bQ;
		var y1 = _v0.bR;
		var y2 = _v0.bS;
		return _Utils_Tuple2(x2 - x1, y2 - y1);
	};
	var directionBetweenPoints = F2(
		function (point1, point2) {
			return A2(
				$elm$core$Maybe$withDefault,
				6,
				A2(
					$elm$core$Maybe$map,
					$elm$core$Tuple$first,
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (x) {
								return _Utils_eq(
									x.b,
									directionVector(
										{bP: point1.a, bQ: point2.a, bR: point1.b, bS: point2.b}));
							},
							$author$project$Logic$App$Utils$DirectionMap$directionMap))));
		});
	var directionList = A3(
		$elm$core$List$map2,
		F2(
			function (pnt1, pnt2) {
				return A2(
					directionBetweenPoints,
					_Utils_Tuple2(pnt1.H, pnt1.A),
					_Utils_Tuple2(pnt2.H, pnt2.A));
			}),
		path,
		A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$tail(path)));
	return _Utils_Tuple2(
		$elm$core$String$concat(
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
					$elm$core$List$tail(directionList)))),
		A2(
			$elm$core$Maybe$withDefault,
			2,
			$elm$core$List$head(directionList)));
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
			var name = iota.a;
			return 'Entity \"' + (name + '\"');
		case 4:
			var list = iota.a;
			return 'List: ' + A2(
				$elm$core$String$join,
				', ',
				A2(
					$elm$core$List$map,
					function (item) {
						if (item.$ === 5) {
							var pattern = item.a;
							return pattern.dX;
						} else {
							var x = item;
							return $author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsString(x);
						}
					},
					$elm$core$Array$toList(list)));
		case 5:
			var pattern = iota.a;
			return pattern.dX;
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
				A2(
					$elm$core$List$map,
					function (item) {
						if (item.$ === 5) {
							var pattern = item.a;
							return pattern.dX;
						} else {
							var x = item;
							return $author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsString(x);
						}
					},
					$elm$core$Array$toList(list)));
	}
};
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			x: _List_Nil,
			s: 0,
			v: A3(
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
					var offset = builder.s * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						x: A2($elm$core$List$cons, mappedLeaf, builder.x),
						s: builder.s + 1,
						v: builder.v
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
		return {eK: offsetHeight, eM: offsetWidth, e2: pageX, e3: pageY};
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
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
										return val.cY;
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
										return val.cY;
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
	var millis = _v0;
	return millis;
};
var $author$project$Ports$GetElementBoundingBoxById$requestBoundingBox = _Platform_outgoingPort('requestBoundingBox', $elm$json$Json$Encode$string);
var $author$project$Ports$GetElementBoundingBoxById$requestBoundingBoxes = _Platform_outgoingPort(
	'requestBoundingBoxes',
	$elm$json$Json$Encode$list($elm$json$Json$Encode$string));
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
var $author$project$Logic$App$PatternList$PatternArray$setDrawingColor = F2(
	function (drawing, color) {
		return A2(
			$elm$core$List$map,
			function (pnt) {
				return _Utils_update(
					pnt,
					{
						L: A2(
							$elm$core$List$map,
							function (conPnt) {
								return _Utils_update(
									conPnt,
									{ah: color});
							},
							pnt.L)
					});
			},
			drawing);
	});
var $author$project$Logic$App$Utils$EntityContext$setEntityHeldItem = F3(
	function (context, entityName, item) {
		return _Utils_update(
			context,
			{
				d5: A3(
					$elm$core$Dict$update,
					entityName,
					function (v) {
						if (!v.$) {
							var entity = v.a;
							return $elm$core$Maybe$Just(
								_Utils_update(
									entity,
									{ea: item}));
						} else {
							return v;
						}
					},
					context.d5)
			});
	});
var $author$project$Logic$App$Grid$sortPatterns = function (model) {
	var drawPatternsResult = A2(
		$author$project$Logic$App$Grid$drawPatterns,
		A2($elm$core$Array$map, $elm$core$Tuple$first, model.c5),
		model.G);
	return _Utils_update(
		model,
		{G: drawPatternsResult.G, c5: drawPatternsResult.c5});
};
var $elm$file$File$Download$string = F3(
	function (name, mime, content) {
		return A2(
			$elm$core$Task$perform,
			$elm$core$Basics$never,
			A3(_File_download, name, mime, content));
	});
var $elm$file$File$toString = _File_toString;
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
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
var $author$project$Logic$App$ImportExport$ImportExportProject$unSimplifyPattern = F2(
	function (macros, simplifiedPattern) {
		var pattern = A2(
			$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature,
			$elm$core$Maybe$Just(macros),
			simplifiedPattern.fl);
		return _Utils_update(
			pattern,
			{cw: simplifiedPattern.cw, dq: simplifiedPattern.dq});
	});
var $author$project$Logic$App$ImportExport$ImportExportProject$unSimplifyIota = F2(
	function (macros, simplifiedIota) {
		switch (simplifiedIota.$) {
			case 0:
				var number = simplifiedIota.a;
				return $author$project$Logic$App$Types$Number(number);
			case 1:
				var vector = simplifiedIota.a;
				return $author$project$Logic$App$Types$Vector(vector);
			case 2:
				var _boolean = simplifiedIota.a;
				return $author$project$Logic$App$Types$Boolean(_boolean);
			case 3:
				var entity = simplifiedIota.a;
				return $author$project$Logic$App$Types$Entity(entity);
			case 4:
				var list = simplifiedIota.a;
				return $author$project$Logic$App$Types$IotaList(
					A2(
						$elm$core$Array$map,
						$author$project$Logic$App$ImportExport$ImportExportProject$unSimplifyIota(macros),
						list));
			case 5:
				var pattern = simplifiedIota.a;
				var considered = simplifiedIota.b;
				return A2(
					$author$project$Logic$App$Types$PatternIota,
					A2($author$project$Logic$App$ImportExport$ImportExportProject$unSimplifyPattern, macros, pattern),
					considered);
			case 6:
				return $author$project$Logic$App$Types$Null;
			case 7:
				var mishap = simplifiedIota.a;
				return $author$project$Logic$App$Types$Garbage(mishap);
			default:
				var list = simplifiedIota.a;
				return $author$project$Logic$App$Types$OpenParenthesis(
					A2(
						$elm$core$Array$map,
						$author$project$Logic$App$ImportExport$ImportExportProject$unSimplifyIota(macros),
						list));
		}
	});
var $author$project$Logic$App$ImportExport$ImportExportProject$unSimplifyCastingContext = function (simplifiedCastingContext) {
	var macrosLayer1 = A2(
		$elm$core$Dict$map,
		F2(
			function (_v5, macro) {
				var displayName = macro.a;
				var startDirection = macro.b;
				var iota = macro.c;
				return _Utils_Tuple3(
					displayName,
					startDirection,
					A2($author$project$Logic$App$ImportExport$ImportExportProject$unSimplifyIota, $elm$core$Dict$empty, iota));
			}),
		simplifiedCastingContext.et);
	var macros = A2(
		$elm$core$Dict$map,
		F2(
			function (_v1, macro) {
				var displayName = macro.a;
				var startDirection = macro.b;
				var iota = macro.c;
				return _Utils_Tuple3(
					displayName,
					startDirection,
					function () {
						if (iota.$ === 4) {
							var iotaList = iota.a;
							return $author$project$Logic$App$Types$IotaList(
								A2(
									$elm$core$Array$map,
									function (i) {
										if (i.$ === 5) {
											var pattern = i.a;
											var considered = i.b;
											return A2(
												$author$project$Logic$App$Types$PatternIota,
												A2(
													$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature,
													$elm$core$Maybe$Just(macrosLayer1),
													pattern.fl),
												considered);
										} else {
											return i;
										}
									},
									iotaList));
						} else {
							return iota;
						}
					}());
			}),
		macrosLayer1);
	return {
		d5: $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (entry) {
					var name = entry.a;
					var heldItem = entry.b.ea;
					var heldItemContent = entry.b.eb;
					return _Utils_Tuple2(
						name,
						{
							ea: heldItem,
							eb: A2(
								$elm$core$Maybe$map,
								$author$project$Logic$App$ImportExport$ImportExportProject$unSimplifyIota(macros),
								heldItemContent)
						});
				},
				$elm$core$Dict$toList(simplifiedCastingContext.d5))),
		et: macros,
		fa: A2(
			$elm$core$Maybe$map,
			$author$project$Logic$App$ImportExport$ImportExportProject$unSimplifyIota(macros),
			simplifiedCastingContext.fa)
	};
};
var $author$project$Logic$App$ImportExport$ImportExportProject$unsimplifyProjectData = function (projectData) {
	var castingContext = $author$project$Logic$App$ImportExport$ImportExportProject$unSimplifyCastingContext(projectData.bv);
	return {
		bv: castingContext,
		c5: A2(
			$elm$core$Array$map,
			$author$project$Logic$App$ImportExport$ImportExportProject$unSimplifyPattern(castingContext.et),
			projectData.c5),
		aU: projectData.aU
	};
};
var $elm_community$array_extra$Array$Extra$update = F2(
	function (index, alter) {
		return function (array) {
			var _v0 = A2($elm$core$Array$get, index, array);
			if (_v0.$ === 1) {
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
var $jinjor$elm_contextmenu$ContextMenu$None = {$: 2};
var $jinjor$elm_contextmenu$ContextMenu$Open = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $jinjor$elm_contextmenu$ContextMenu$setHoverState = F2(
	function (hover, openState) {
		return A2(
			$elm$core$Maybe$map,
			function (_v0) {
				var mouse = _v0.bD;
				var window = _v0.bO;
				var context = _v0.h;
				return {h: context, by: hover, bD: mouse, bO: window};
			},
			openState);
	});
var $jinjor$elm_contextmenu$ContextMenu$enterContainer = function (openState) {
	return A2($jinjor$elm_contextmenu$ContextMenu$setHoverState, $jinjor$elm_contextmenu$ContextMenu$Container, openState);
};
var $jinjor$elm_contextmenu$ContextMenu$ItemIndex = function (a) {
	return {$: 1, a: a};
};
var $jinjor$elm_contextmenu$ContextMenu$enterItem = F2(
	function (index, openState) {
		return A2(
			$jinjor$elm_contextmenu$ContextMenu$setHoverState,
			$jinjor$elm_contextmenu$ContextMenu$ItemIndex(index),
			openState);
	});
var $jinjor$elm_contextmenu$ContextMenu$leaveContainer = function (openState) {
	return A2($jinjor$elm_contextmenu$ContextMenu$setHoverState, $jinjor$elm_contextmenu$ContextMenu$None, openState);
};
var $jinjor$elm_contextmenu$ContextMenu$leaveItem = function (openState) {
	return A2($jinjor$elm_contextmenu$ContextMenu$setHoverState, $jinjor$elm_contextmenu$ContextMenu$Container, openState);
};
var $jinjor$elm_contextmenu$ContextMenu$Size = F2(
	function (width, height) {
		return {cP: height, af: width};
	});
var $elm$browser$Browser$Dom$getViewport = _Browser_withWindow(_Browser_getViewport);
var $jinjor$elm_contextmenu$ContextMenu$windowSize = A2(
	$elm$core$Task$map,
	function (v) {
		return A2($jinjor$elm_contextmenu$ContextMenu$Size, v.dx.af, v.dx.cP);
	},
	$elm$browser$Browser$Dom$getViewport);
var $jinjor$elm_contextmenu$ContextMenu$update = F2(
	function (msg, _v0) {
		update:
		while (true) {
			var model = _v0;
			switch (msg.$) {
				case 0:
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 1:
					var context = msg.a;
					var mouse = msg.b;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$core$Task$perform,
							A2($jinjor$elm_contextmenu$ContextMenu$Open, context, mouse),
							$jinjor$elm_contextmenu$ContextMenu$windowSize));
				case 2:
					var context = msg.a;
					var mouse = msg.b;
					var window = msg.c;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								F: $elm$core$Maybe$Just(
									{h: context, by: $jinjor$elm_contextmenu$ContextMenu$None, bD: mouse, bO: window})
							}),
						$elm$core$Platform$Cmd$none);
				case 3:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{F: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none);
				case 4:
					var index = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								F: A2($jinjor$elm_contextmenu$ContextMenu$enterItem, index, model.F)
							}),
						$elm$core$Platform$Cmd$none);
				case 5:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								F: $jinjor$elm_contextmenu$ContextMenu$leaveItem(model.F)
							}),
						$elm$core$Platform$Cmd$none);
				case 6:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								F: $jinjor$elm_contextmenu$ContextMenu$enterContainer(model.F)
							}),
						$elm$core$Platform$Cmd$none);
				default:
					if (model.bw) {
						var $temp$msg = $jinjor$elm_contextmenu$ContextMenu$Close,
							$temp$_v0 = _Utils_update(
							model,
							{
								F: $jinjor$elm_contextmenu$ContextMenu$leaveContainer(model.F)
							});
						msg = $temp$msg;
						_v0 = $temp$_v0;
						continue update;
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									F: $jinjor$elm_contextmenu$ContextMenu$leaveContainer(model.F)
								}),
							$elm$core$Platform$Cmd$none);
					}
			}
		}
	});
var $author$project$Logic$App$Macros$UpdateMacroReferences$updateMacroReferences = function (model) {
	var castingContext = model.bv;
	var newerMacroDict = A2(
		$elm$core$Dict$map,
		F2(
			function (_v6, macro) {
				var displayName = macro.a;
				var startDirection = macro.b;
				var iota = macro.c;
				return _Utils_Tuple3(
					displayName,
					startDirection,
					function () {
						if (iota.$ === 4) {
							var iotaList = iota.a;
							return $author$project$Logic$App$Types$IotaList(
								A2(
									$elm$core$Array$map,
									function (i) {
										if (i.$ === 5) {
											var pattern = i.a;
											var considered = i.b;
											return A2(
												$author$project$Logic$App$Types$PatternIota,
												A2(
													$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature,
													$elm$core$Maybe$Just(castingContext.et),
													pattern.fl),
												considered);
										} else {
											return i;
										}
									},
									iotaList));
						} else {
							return iota;
						}
					}());
			}),
		castingContext.et);
	var newPatternArray = A2(
		$elm$core$Array$map,
		function (tuple) {
			var pattern = tuple.a;
			var gridpoints = tuple.b;
			var _v4 = A2($elm$core$Dict$get, pattern.fl, newerMacroDict);
			if (!_v4.$) {
				var _v5 = _v4.a;
				var displayName = _v5.a;
				return _Utils_Tuple2(
					_Utils_update(
						pattern,
						{dX: displayName}),
					gridpoints);
			} else {
				return _Utils_Tuple2(pattern, gridpoints);
			}
		},
		model.c5);
	var updateIota = function (iota) {
		switch (iota.$) {
			case 5:
				var pattern = iota.a;
				var considered = iota.b;
				var _v1 = A2($elm$core$Dict$get, pattern.fl, newerMacroDict);
				if (!_v1.$) {
					var _v2 = _v1.a;
					var displayName = _v2.a;
					return A2(
						$author$project$Logic$App$Types$PatternIota,
						_Utils_update(
							pattern,
							{dX: displayName}),
						considered);
				} else {
					return A2($author$project$Logic$App$Types$PatternIota, pattern, considered);
				}
			case 4:
				var list = iota.a;
				return $author$project$Logic$App$Types$IotaList(
					updateIotaArray(list));
			case 8:
				var list = iota.a;
				return $author$project$Logic$App$Types$OpenParenthesis(
					updateIotaArray(list));
			default:
				return iota;
		}
	};
	var updateIotaArray = function (iotaArray) {
		return A2($elm$core$Array$map, updateIota, iotaArray);
	};
	return _Utils_update(
		model,
		{
			bv: A2(
				$author$project$Logic$App$Utils$EntityContext$setPlayerHeldItemContent,
				_Utils_update(
					castingContext,
					{
						et: newerMacroDict,
						fa: A2($elm$core$Maybe$map, updateIota, castingContext.fa)
					}),
				A2(
					$elm$core$Maybe$map,
					updateIota,
					$author$project$Logic$App$Utils$EntityContext$getPlayerHeldItemContent(castingContext))),
			c5: newPatternArray,
			fn: updateIotaArray(model.fn)
		});
};
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
			var newGrid = A2($author$project$Logic$App$Grid$applyUsedPointsToGrid, oldGrid, drawing);
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
					L: A2(
						$elm$core$List$map,
						function (conPoint) {
							var _v0 = conPoint.aq;
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
									aq: function () {
										var uniqueNumber = ((conPoint.A * 10000) + conPoint.H) + time;
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
						point.L)
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
			var ui = model.fG;
			var settings = model.aV;
			var patternArray = model.c5;
			var grid = model.G;
			var drawing = model.G.au;
			var castingContext = model.bv;
			switch (msg.$) {
				case 0:
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 1:
					var panel = msg.a;
					var keys = msg.b;
					return (!keys.fj) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{
										eY: _List_fromArray(
											[panel])
									})
							}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{
										eY: _Utils_ap(
											ui.eY,
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
									G: _Utils_update(
										grid,
										{
											cP: element.d3.cP,
											ck: A5($author$project$Components$App$Grid$updateGridPoints, element.d3.af, element.d3.cP, model.c5, _List_Nil, model.aV.aN),
											af: element.d3.af
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
									bO: {cP: element.d3.cP, af: element.d3.af}
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 4:
					var _v1 = msg.a;
					var x = _v1.a;
					var y = _v1.b;
					return drawing.d$ ? _Utils_Tuple2(
						_Utils_update(
							model,
							{
								G: _Utils_update(
									grid,
									{
										au: _Utils_update(
											drawing,
											{
												aH: $author$project$Components$App$Grid$addNearbyPoint(model)
											})
									}),
								bb: _Utils_Tuple2(x, y)
							}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bb: _Utils_Tuple2(x, y)
							}),
						$elm$core$Platform$Cmd$none);
				case 5:
					var _v2 = msg.a;
					var x = _v2.a;
					var y = _v2.b;
					var mousePos = _Utils_Tuple2(x, y);
					var closestPoint = A3($author$project$Components$App$Grid$getClosestPoint, mousePos, grid.ck, model);
					return (!closestPoint.bq) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{
								G: _Utils_update(
									grid,
									{
										au: _Utils_update(
											drawing,
											{
												aH: _List_fromArray(
													[closestPoint]),
												d$: true
											})
									}),
								bb: mousePos
							}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 6:
					if (drawing.d$) {
						if ($elm$core$List$length(drawing.aH) > 1) {
							var newGrid = _Utils_update(
								grid,
								{
									au: _Utils_update(
										drawing,
										{aH: _List_Nil, d$: false})
								});
							var _v3 = $author$project$Logic$App$Utils$GetAngleSignature$getAngleSignatureAndStartDir(drawing.aH);
							var signature = _v3.a;
							var startDir = _v3.b;
							var directionlessPattern = A2(
								$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature,
								$elm$core$Maybe$Just(model.bv.et),
								signature);
							var newPattern = _Utils_update(
								directionlessPattern,
								{dq: startDir});
							var newUncoloredPatternArray = A3($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern, model.ek);
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
											A3($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern, model.ek)))));
							var newStack = stackResult.fn;
							var resultArray = stackResult.dj;
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
							var newModel = A2(
								$author$project$Logic$App$Patterns$MetaActions$applyMetaAction,
								_Utils_update(
									model,
									{
										bv: stackResult.a$,
										G: newGrid,
										ek: (_Utils_cmp(
											model.ek,
											$elm$core$Array$length(model.c5)) > 0) ? 0 : model.ek,
										c5: newPatternArray,
										fn: newStack,
										fx: A2(
											$author$project$Logic$App$Utils$Utils$unshift,
											{c6: -1, fn: $elm$core$Array$empty},
											stackResult.fx)
									}),
								newPattern.w);
							return A2(
								$author$project$Main$update,
								$author$project$Logic$App$Msg$SetTimelineIndex(
									$elm$core$Array$length(newModel.fx)),
								$author$project$Logic$App$Macros$UpdateMacroReferences$updateMacroReferences(newModel));
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										G: _Utils_update(
											grid,
											{
												au: _Utils_update(
													drawing,
													{aH: _List_Nil, d$: false})
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
					var newUncoloredPatternArray = A3($author$project$Logic$App$Utils$Utils$removeFromArray, startIndex, endIndex, model.c5);
					var stackResult = A3(
						$author$project$Logic$App$Stack$EvalStack$applyPatternsToStack,
						$elm$core$Array$empty,
						castingContext,
						$elm$core$List$reverse(
							$elm$core$List$unzip(
								$elm$core$Array$toList(newUncoloredPatternArray)).a));
					var resultArray = stackResult.dj;
					var newStack = stackResult.fn;
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
							$elm$core$Array$length(stackResult.fx) + 1),
						_Utils_update(
							model,
							{
								bv: stackResult.a$,
								G: _Utils_update(
									grid,
									{
										ck: A5($author$project$Components$App$Grid$updateGridPoints, grid.af, grid.cP, newPatternArray, _List_Nil, settings.aN)
									}),
								ek: (_Utils_cmp(
									model.ek,
									$elm$core$Array$length(newPatternArray)) > 0) ? 0 : ((_Utils_cmp(model.ek, endIndex) < 0) ? A2($elm$core$Basics$max, model.ek, 0) : A2($elm$core$Basics$max, model.ek - 1, 0)),
								c5: newPatternArray,
								fn: newStack,
								fx: A2(
									$author$project$Logic$App$Utils$Utils$unshift,
									{c6: -1, fn: $elm$core$Array$empty},
									stackResult.fx)
							}));
				case 8:
					var scale = msg.a;
					var $temp$msg = $author$project$Logic$App$Msg$SetTimelineIndex(model.fy),
						$temp$model = $author$project$Logic$App$Grid$sortPatterns(
						_Utils_update(
							model,
							{
								G: _Utils_update(
									grid,
									{
										ck: A5($author$project$Components$App$Grid$updateGridPoints, grid.af, grid.cP, model.c5, _List_Nil, scale)
									}),
								aV: _Utils_update(
									settings,
									{aN: scale})
							}));
					msg = $temp$msg;
					model = $temp$model;
					continue update;
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
					var drawnPoints = grid.d0;
					var autocompleteIndex = (model.fG.c7 === '') ? 0 : model.fG.fs;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								G: _Utils_update(
									grid,
									{
										d0: A2(
											$author$project$Components$App$Grid$updatemidLineOffsets,
											drawnPoints,
											$elm$time$Time$posixToMillis(newTime))
									}),
								fw: $elm$time$Time$posixToMillis(newTime),
								fG: _Utils_update(
									ui,
									{fs: autocompleteIndex})
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Ports$GetElementBoundingBoxById$requestBoundingBox('#add_pattern_input'),
									$author$project$Ports$CheckMouseOverDragHandle$requestCheckMouseOverDragHandle(0),
									$author$project$Ports$GetElementBoundingBoxById$requestBoundingBoxes(
									$elm$core$Array$toList(
										A2(
											$elm$core$Array$indexedMap,
											F2(
												function (index, _v4) {
													return '[data-index=\"' + ($elm$core$String$fromInt(index) + '\"]');
												}),
											model.c5)))
								])));
				case 11:
					var text = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{c7: text})
							}),
						$elm$core$Platform$Cmd$none);
				case 12:
					var name = msg.a;
					var newImportQueue = (name !== '') ? A2(
						$elm$core$List$cons,
						A2(
							$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromName,
							$elm$core$Maybe$Just(model.bv.et),
							name),
						model.eh) : model.eh;
					return A2(
						$author$project$Main$updatePatternArrayFromQueue,
						model.ek,
						_Utils_update(
							model,
							{eh: newImportQueue}));
				case 13:
					var number = msg.a;
					return _Utils_Tuple2(
						model,
						$author$project$Ports$HexNumGen$sendNumber(number));
				case 14:
					var signature = msg.a;
					var newPattern = A2(
						$author$project$Logic$App$Patterns$PatternRegistry$getPatternFromSignature,
						$elm$core$Maybe$Just(model.bv.et),
						signature);
					return A2(
						$author$project$Main$updatePatternArrayFromQueue,
						model.ek,
						_Utils_update(
							model,
							{
								eh: A2(
									$elm$core$List$cons,
									_Utils_Tuple2(newPattern, $elm$core$Platform$Cmd$none),
									model.eh)
							}));
				case 15:
					var suggestLength = msg.a;
					var newIndex = (model.fG.fs <= 0) ? (A2($elm$core$Basics$min, 3, suggestLength) - 1) : (model.fG.fs - 1);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{fs: newIndex})
							}),
						$elm$core$Platform$Cmd$none);
				case 16:
					var suggestLength = msg.a;
					var newIndex = (_Utils_cmp(
						model.fG.fs,
						A2($elm$core$Basics$min, 3, suggestLength) - 1) > -1) ? 0 : (model.fG.fs + 1);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{fs: newIndex})
							}),
						$elm$core$Platform$Cmd$none);
				case 17:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{fs: 0})
							}),
						$elm$core$Platform$Cmd$none);
				case 18:
					var id = msg.a;
					return _Utils_Tuple2(
						model,
						$author$project$Ports$GetElementBoundingBoxById$requestBoundingBox(id));
				case 19:
					var result = msg.a;
					if (!result.$) {
						var value = result.a;
						return (value.d3 === '#add_pattern_input') ? _Utils_Tuple2(
							_Utils_update(
								model,
								{
									fG: _Utils_update(
										ui,
										{
											cj: _Utils_Tuple2(value.er, value.bt)
										})
								}),
							$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 20:
					var resultList = msg.a;
					var handleResult = function (result) {
						if (!result.$) {
							var value = result.a;
							return (value.fE + value.bt) / 2;
						} else {
							return 0.0;
						}
					};
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{
										bH: A2($elm$core$List$map, handleResult, resultList)
									})
							}),
						$elm$core$Platform$Cmd$none);
				case 21:
					var index = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{
										d_: _Utils_Tuple2(true, index),
										eE: index
									})
							}),
						$elm$core$Platform$Cmd$none);
				case 22:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{
										d_: _Utils_Tuple2(false, -1),
										eE: -1
									})
							}),
						$elm$core$Platform$Cmd$none);
				case 23:
					var eventJson = msg.b;
					var event = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$mouseMoveDecoder, eventJson);
					var mousePos = function () {
						if (!event.$) {
							var value = event.a;
							return _Utils_Tuple2(value.e2, value.e3);
						} else {
							return _Utils_Tuple2(0.0, 0.0);
						}
					}();
					var closestElementToMouseY = A2(
						$elm$core$Maybe$withDefault,
						_Utils_Tuple2(
							$elm$core$List$length(model.fG.bH),
							0),
						$elm$core$List$head(
							A2(
								$elm$core$List$sortWith,
								F2(
									function (a, b) {
										var _v7 = A2($elm$core$Basics$compare, a.b, b.b);
										switch (_v7) {
											case 0:
												return 0;
											case 1:
												return 1;
											default:
												return 2;
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
										model.fG.bH))))).a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bb: mousePos,
								fG: _Utils_update(
									ui,
									{eE: closestElementToMouseY})
							}),
						$elm$core$Platform$Cmd$none);
				case 24:
					var event = msg.a;
					var mouseEvent = event.eD;
					var mousePos = mouseEvent.dI;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bb: mousePos}),
						$elm$core$Platform$Cmd$none);
				case 25:
					var originIndex = model.fG.d_.b;
					var index = (_Utils_cmp(model.fG.eE, originIndex) > 0) ? (model.fG.eE - 1) : model.fG.eE;
					var newUncoloredPatternArray = function () {
						var _v9 = A2($elm$core$Array$get, originIndex, patternArray);
						if (!_v9.$) {
							var element = _v9.a;
							return A3(
								$elm_community$array_extra$Array$Extra$insertAt,
								index,
								element,
								A3($author$project$Logic$App$Utils$Utils$removeFromArray, originIndex, originIndex + 1, model.c5));
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
					var newStack = stackResult.fn;
					var resultArray = stackResult.dj;
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
							$elm$core$Array$length(stackResult.fx) + 1),
						$author$project$Logic$App$Grid$sortPatterns(
							_Utils_update(
								model,
								{
									bv: stackResult.a$,
									G: _Utils_update(
										grid,
										{
											ck: A5($author$project$Components$App$Grid$updateGridPoints, grid.af, grid.cP, newPatternArray, _List_Nil, settings.aN)
										}),
									c5: newPatternArray,
									fn: newStack,
									fx: A2(
										$author$project$Logic$App$Utils$Utils$unshift,
										{c6: -1, fn: $elm$core$Array$empty},
										stackResult.fx),
									fG: _Utils_update(
										ui,
										{
											d_: _Utils_Tuple2(false, -1),
											eE: -1
										})
								})));
				case 26:
					var id = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{fi: id})
							}),
						$elm$core$Platform$Cmd$none);
				case 27:
					var bool = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{eZ: bool})
							}),
						$elm$core$Platform$Cmd$none);
				case 28:
					var entityName = msg.a;
					var itemString = msg.b;
					var item = function () {
						switch (itemString) {
							case 'Trinket':
								return 0;
							case 'Cypher':
								return 2;
							case 'Artifact':
								return 1;
							case 'Spellbook':
								return 4;
							case 'Focus':
								return 3;
							case 'Pie':
								return 5;
							default:
								return 6;
						}
					}();
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bv: A3(
									$author$project$Logic$App$Utils$EntityContext$setEntityHeldItemContent,
									A3($author$project$Logic$App$Utils$EntityContext$setEntityHeldItem, castingContext, entityName, item),
									entityName,
									$elm$core$Maybe$Nothing)
							}),
						$elm$core$Platform$Cmd$none);
				case 29:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dZ: ''}),
						$author$project$Ports$GetGridDrawingAsGif$requestGIF(0));
				case 30:
					var src = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dZ: src}),
						$elm$file$File$Download$url(src));
				case 31:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dZ: ''}),
						$author$project$Ports$GetGridDrawingAsImage$requestImage(0));
				case 32:
					var src = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dZ: src}),
						$elm$file$File$Download$url(src));
				case 33:
					var index = msg.a;
					var replacementPattern = msg.b;
					var newUncoloredPatternArray = A3(
						$elm_community$array_extra$Array$Extra$update,
						index,
						function (patternTuple) {
							var d = patternTuple.b;
							return _Utils_Tuple2(replacementPattern, d);
						},
						model.c5);
					var stackResult = A3(
						$author$project$Logic$App$Stack$EvalStack$applyPatternsToStack,
						$elm$core$Array$empty,
						castingContext,
						$elm$core$List$reverse(
							$elm$core$List$unzip(
								$elm$core$Array$toList(newUncoloredPatternArray)).a));
					var resultArray = stackResult.dj;
					var newStack = stackResult.fn;
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
							$elm$core$Array$length(stackResult.fx) + 1),
						_Utils_update(
							model,
							{
								bv: stackResult.a$,
								G: _Utils_update(
									grid,
									{
										ck: A5($author$project$Components$App$Grid$updateGridPoints, grid.af, grid.cP, newPatternArray, _List_Nil, settings.aN)
									}),
								c5: newPatternArray,
								fn: newStack,
								fx: A2(
									$author$project$Logic$App$Utils$Utils$unshift,
									{c6: -1, fn: $elm$core$Array$empty},
									stackResult.fx)
							}));
				case 34:
					var index = msg.a;
					return _Utils_eq(model.ek, index) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{ek: 0}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{ek: index}),
						$elm$core$Platform$Cmd$none);
				case 35:
					var string = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{eg: string})
							}),
						$elm$core$Platform$Cmd$none);
				case 36:
					var string = msg.a;
					var importQueue = A2($author$project$Logic$App$ImportExport$ImportParser$parseInput, string, model.bv.et);
					return A2(
						$author$project$Main$updatePatternArrayFromQueue,
						model.ek,
						_Utils_update(
							model,
							{
								eh: importQueue,
								fG: _Utils_update(
									ui,
									{eg: '', eX: 0})
							}));
				case 37:
					return _Utils_Tuple2(
						model,
						A2($elm$file$File$Select$file, _List_Nil, $author$project$Logic$App$Msg$ImportProjectFile));
				case 38:
					var file = msg.a;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$core$Task$perform,
							$author$project$Logic$App$Msg$ImportProject,
							$elm$file$File$toString(file)));
				case 39:
					var encoded = msg.a;
					var maybeProjectData = A2(
						$elm$core$Maybe$map,
						$author$project$Logic$App$ImportExport$ImportExportProject$unsimplifyProjectData,
						$author$project$Logic$App$ImportExport$ImportExportProject$decodeProjectData(encoded));
					if (!maybeProjectData.$) {
						var projectData = maybeProjectData.a;
						var importQueue = $elm$core$List$reverse(
							$elm$core$Array$toList(
								A2(
									$elm$core$Array$map,
									function (pattern) {
										return _Utils_Tuple2(pattern, $elm$core$Platform$Cmd$none);
									},
									projectData.c5)));
						return A2(
							$author$project$Main$updatePatternArrayFromQueue,
							model.ek,
							_Utils_update(
								model,
								{bv: projectData.bv, eh: importQueue, c5: $elm$core$Array$empty, aU: projectData.aU, fn: $elm$core$Array$empty}));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 40:
					var overlay = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{eX: overlay})
							}),
						$elm$core$Platform$Cmd$none);
				case 41:
					var text = msg.a;
					var name = msg.b;
					var mimeType = msg.c;
					return _Utils_Tuple2(
						model,
						A3($elm$file$File$Download$string, name, mimeType, text));
				case 42:
					var index = msg.a;
					var timeline = ($elm$core$Array$length(model.fx) < 2) ? A2(
						$elm$core$Array$repeat,
						2,
						{c6: -1, fn: $elm$core$Array$empty}) : model.fx;
					var timelinePatternIndex = (index >= 0) ? A2(
						$elm$core$Maybe$withDefault,
						$elm$core$Array$length(timeline),
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.c6;
							},
							A2(
								$elm$core$Array$get,
								index,
								$elm_community$array_extra$Array$Extra$reverse(timeline)))) : (-1);
					var greyDrawingsPatternArray = $elm_community$array_extra$Array$Extra$reverse(
						$elm$core$Array$fromList(
							A2(
								$elm$core$List$map,
								function (indexTuple) {
									var patternIndex = indexTuple.a;
									var tuple = indexTuple.b;
									var pat = tuple.a;
									var draw = tuple.b;
									return (_Utils_cmp(timelinePatternIndex, patternIndex) < 0) ? _Utils_Tuple2(
										pat,
										A2($author$project$Logic$App$PatternList$PatternArray$setDrawingColor, draw, 'gray')) : tuple;
								},
								$elm$core$Array$toIndexedList(
									$elm_community$array_extra$Array$Extra$reverse(model.c5)))));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								G: _Utils_update(
									grid,
									{
										d0: $author$project$Components$App$Grid$genDrawnPointsFromPatternArray(greyDrawingsPatternArray),
										ck: A5($author$project$Components$App$Grid$updateUsedGridPoints, grid.af, grid.cP, greyDrawingsPatternArray, _List_Nil, settings.aN)
									}),
								fn: _Utils_eq(
									index,
									$elm$core$Array$length(timeline)) ? model.fn : A2(
									$elm$core$Maybe$withDefault,
									$elm$core$Array$empty,
									A2(
										$elm$core$Maybe$map,
										function ($) {
											return $.fn;
										},
										A2(
											$elm$core$Array$get,
											index,
											$elm_community$array_extra$Array$Extra$reverse(timeline)))),
								fy: index
							}),
						$elm$core$Platform$Cmd$none);
				case 43:
					var event = msg.a;
					var timeline = ($elm$core$Array$length(model.fx) < 2) ? A2(
						$elm$core$Array$repeat,
						2,
						{c6: -1, fn: $elm$core$Array$empty}) : model.fx;
					if (event.cy && _Utils_eq(
						event.cV,
						$elm$core$Maybe$Just('ArrowRight'))) {
						var $temp$msg = $author$project$Logic$App$Msg$SetTimelineIndex(
							A2(
								$elm$core$Basics$min,
								$elm$core$Array$length(timeline) - 2,
								model.fy + 1)),
							$temp$model = model;
						msg = $temp$msg;
						model = $temp$model;
						continue update;
					} else {
						if (event.cy && _Utils_eq(
							event.cV,
							$elm$core$Maybe$Just('ArrowLeft'))) {
							var $temp$msg = $author$project$Logic$App$Msg$SetTimelineIndex(
								A2(
									$elm$core$Basics$min,
									$elm$core$Array$length(timeline) - 3,
									A2($elm$core$Basics$max, -1, model.fy - 1))),
								$temp$model = model;
							msg = $temp$msg;
							model = $temp$model;
							continue update;
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					}
				case 44:
					var signature = msg.a;
					var newName = msg.b;
					var newMacroDict = A3(
						$elm$core$Dict$update,
						signature,
						$elm$core$Maybe$map(
							function (value) {
								var direction = value.b;
								var iota = value.c;
								return _Utils_Tuple3(newName, direction, iota);
							}),
						model.bv.et);
					return _Utils_Tuple2(
						$author$project$Logic$App$Macros$UpdateMacroReferences$updateMacroReferences(
							_Utils_update(
								model,
								{
									bv: _Utils_update(
										castingContext,
										{et: newMacroDict})
								})),
						$elm$core$Platform$Cmd$none);
				case 45:
					var message = msg.a;
					var _v16 = A2($jinjor$elm_contextmenu$ContextMenu$update, message, model.dM);
					var contextMenu = _v16.a;
					var cmd = _v16.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dM: contextMenu}),
						A2($elm$core$Platform$Cmd$map, $author$project$Logic$App$Msg$ContextMenuMsg, cmd));
				case 46:
					var sig = msg.a;
					var index = msg.b;
					var patterns = A2(
						$elm$core$List$map,
						function (pat) {
							return _Utils_Tuple2(pat, $elm$core$Platform$Cmd$none);
						},
						function () {
							var _v17 = A2($elm$core$Dict$get, sig, model.bv.et);
							if ((!_v17.$) && (_v17.a.c.$ === 4)) {
								var _v18 = _v17.a;
								var patternList = _v18.c.a;
								return $elm$core$Array$toList(
									A2(
										$elm$core$Array$map,
										function (iota) {
											if (iota.$ === 5) {
												var pattern = iota.a;
												return pattern;
											} else {
												var i = iota;
												return {
													a: $author$project$Logic$App$Patterns$OperatorUtils$makeConstant(i),
													cw: true,
													ah: $author$project$Settings$Theme$accent1,
													dX: 'Constant: ' + $author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsString(i),
													el: 'constant',
													w: 0,
													bF: _List_Nil,
													_: $elm$core$Maybe$Nothing,
													fl: '',
													dq: 2
												};
											}
										},
										patternList));
							} else {
								return _List_Nil;
							}
						}());
					return A2(
						$author$project$Main$updatePatternArrayFromQueue,
						index,
						_Utils_update(
							model,
							{
								eh: patterns,
								c5: A3($author$project$Logic$App$Utils$Utils$removeFromArray, index, index + 1, model.c5)
							}));
				case 47:
					var name = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aU: name}),
						$elm$core$Platform$Cmd$none);
				case 48:
					var name = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bv: _Utils_update(
									castingContext,
									{
										d5: A2($elm$core$Dict$remove, name, castingContext.d5)
									})
							}),
						$elm$core$Platform$Cmd$none);
				case 49:
					var name = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bv: _Utils_update(
									castingContext,
									{
										d5: A3(
											$elm$core$Dict$insert,
											name,
											{ea: 6, eb: $elm$core$Maybe$Nothing},
											castingContext.d5)
									})
							}),
						$elm$core$Platform$Cmd$none);
				default:
					var string = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								fG: _Utils_update(
									ui,
									{cJ: string})
							}),
						$elm$core$Platform$Cmd$none);
			}
		}
	});
var $author$project$Main$updatePatternArrayFromQueue = F2(
	function (insertionPoint, model) {
		if ($elm$core$List$length(model.eh) > 0) {
			var ui = model.fG;
			var getPattern = A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2($author$project$Logic$App$Patterns$PatternRegistry$unknownPattern, $elm$core$Platform$Cmd$none),
				$elm$core$List$head(model.eh));
			var newPattern = getPattern.a;
			var newUncoloredPatternArray = A3($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern, insertionPoint);
			var command = getPattern.b;
			var castingContext = model.bv;
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
							A3($author$project$Logic$App$PatternList$PatternArray$addToPatternArray, model, newPattern, insertionPoint)))));
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
				stackResult.dj);
			var patterns = A2(
				$elm$core$Array$map,
				function (x) {
					return x.a;
				},
				newPatternArray);
			var drawPatternsResult = A2($author$project$Logic$App$Grid$drawPatterns, patterns, model.G);
			return _Utils_eq(command, $elm$core$Platform$Cmd$none) ? A2(
				$author$project$Main$updatePatternArrayFromQueue,
				insertionPoint,
				A2(
					$author$project$Logic$App$Patterns$MetaActions$applyMetaAction,
					_Utils_update(
						model,
						{
							bv: stackResult.a$,
							G: drawPatternsResult.G,
							eh: A2(
								$elm$core$Maybe$withDefault,
								_List_Nil,
								$elm$core$List$tail(model.eh)),
							ek: (_Utils_cmp(
								model.ek,
								$elm$core$Array$length(model.c5)) > 0) ? 0 : model.ek,
							c5: drawPatternsResult.c5,
							fn: stackResult.fn,
							fx: A2(
								$author$project$Logic$App$Utils$Utils$unshift,
								{c6: -1, fn: $elm$core$Array$empty},
								stackResult.fx),
							fG: _Utils_update(
								ui,
								{c7: ''})
						}),
					newPattern.w)) : _Utils_Tuple2(
				_Utils_update(
					model,
					{
						eh: A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							$elm$core$List$tail(model.eh))
					}),
				command);
		} else {
			return A2(
				$author$project$Main$update,
				$author$project$Logic$App$Msg$SetTimelineIndex(
					$elm$core$Array$length(model.fx)),
				$author$project$Logic$App$Macros$UpdateMacroReferences$updateMacroReferences(model));
		}
	});
var $author$project$Logic$App$Msg$MouseMove = function (a) {
	return {$: 4, a: a};
};
var $author$project$Logic$App$Msg$MouseUp = {$: 6};
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$Logic$App$Msg$Download = F3(
	function (a, b, c) {
		return {$: 41, a: a, b: b, c: c};
	});
var $author$project$Logic$App$Types$ExportTextOverlay = 2;
var $author$project$Logic$App$Msg$SetImportInputValue = function (a) {
	return {$: 35, a: a};
};
var $author$project$Logic$App$Msg$ViewOverlay = function (a) {
	return {$: 40, a: a};
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
			return pattern.fl;
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
			var _v0 = pattern.el;
			switch (_v0) {
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
							A2(applyIndent, indentDepth, pattern.dX),
							lines));
			}
		});
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
	return {$: 0, a: a};
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
	return {$: 1, a: a};
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
	if (model.fG.eX !== 2) {
		return _List_Nil;
	} else {
		var patternText = $author$project$Logic$App$ImportExport$ExportAsText$exportPatternsAsLineList(
			A2($elm$core$Array$map, $elm$core$Tuple$first, model.c5)) + ('\n-----------------------\n' + $author$project$Logic$App$ImportExport$ExportAsGiveCommand$exportAsGiveCommand(
			A2($elm$core$Array$map, $elm$core$Tuple$first, model.c5)));
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
								$elm$html$Html$Attributes$value(model.fG.eg),
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
										A3($author$project$Logic$App$Msg$Download, patternText, 'Hex.hexcasting', 'text/plain'))
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
										$author$project$Logic$App$Msg$ViewOverlay(0))
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
	return {$: 36, a: a};
};
var $author$project$Logic$App$Types$ImportTextOverlay = 1;
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$Components$App$Overlays$ImportTextOverlay$importTextOverlay = function (model) {
	return (model.fG.eX !== 1) ? _List_Nil : _List_fromArray(
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
							$elm$html$Html$Attributes$value(model.fG.eg)
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
									$author$project$Logic$App$Msg$ImportText(model.fG.eg))
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
									$author$project$Logic$App$Msg$ViewOverlay(0))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Cancel')
								]))
						]))
				]))
		]);
};
var $author$project$Logic$App$Types$ConfigHexPanel = 2;
var $author$project$Logic$App$Types$FilePanel = 3;
var $author$project$Logic$App$Types$LibraryPanel = 4;
var $author$project$Logic$App$Types$StackPanel = 0;
var $author$project$Logic$App$Msg$ViewPanel = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $lattyware$elm_fontawesome$FontAwesome$IconDef = F4(
	function (prefix, name, size, paths) {
		return {eH: name, e4: paths, e8: prefix, fm: size};
	});
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$book = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'book',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M448 336v-288C448 21.49 426.5 0 400 0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-31.1c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM143.1 128h192C344.8 128 352 135.2 352 144C352 152.8 344.8 160 336 160H143.1C135.2 160 128 152.8 128 144C128 135.2 135.2 128 143.1 128zM143.1 192h192C344.8 192 352 199.2 352 208C352 216.8 344.8 224 336 224H143.1C135.2 224 128 216.8 128 208C128 199.2 135.2 192 143.1 192zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Internal$Icon = $elm$core$Basics$identity;
var $lattyware$elm_fontawesome$FontAwesome$present = function (icon) {
	return {bs: _List_Nil, bz: icon, bZ: $elm$core$Maybe$Nothing, ca: $elm$core$Maybe$Nothing, co: 'img', fz: $elm$core$Maybe$Nothing, bN: _List_Nil};
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
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions = {da: true, dr: false};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 3, a: a};
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
		return {dE: button, dI: clientPos, a8: keys, eL: offsetPos, e1: pagePos, fh: screenPos};
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
		return {dz: alt, dP: ctrl, fj: shift};
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
						ez: tag(ev),
						da: options.da,
						dr: options.dr
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
		var presentation = _v0;
		return _Utils_update(
			presentation,
			{
				bs: _Utils_ap(presentation.bs, attributes)
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
	var icon = _v1.bz;
	var outer = _v1.ca;
	return A2(
		$elm$core$Maybe$withDefault,
		icon.fm,
		A2($elm$core$Maybe$map, $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensionsInternal, outer));
};
var $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensionsInternal = function (_v0) {
	var icon = _v0.bz;
	var outer = _v0.ca;
	return A2(
		$elm$core$Maybe$withDefault,
		icon.fm,
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
					{fm: combined.fm + by});
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
					{n: combined.n + x, o: combined.o + y});
			case 2:
				var rotation = transform.a;
				return _Utils_update(
					combined,
					{fe: combined.fe + rotation});
			default:
				var axis = transform.a;
				if (!axis) {
					return _Utils_update(
						combined,
						{d9: !combined.d9});
				} else {
					return _Utils_update(
						combined,
						{d8: !combined.d8});
				}
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize = 16;
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform = {d8: false, d9: false, fe: 0, fm: $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize, n: 0, o: 0};
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
		var innerTranslate = 'translate(' + ($elm$core$String$fromFloat(transform.n * 32) + (',' + ($elm$core$String$fromFloat(transform.o * 32) + ') ')));
		var innerRotate = 'rotate(' + ($elm$core$String$fromFloat(transform.fe) + ' 0 0)');
		var flipY = transform.d9 ? (-1) : 1;
		var scaleY = (transform.fm / $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize) * flipY;
		var flipX = transform.d8 ? (-1) : 1;
		var scaleX = (transform.fm / $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize) * flipX;
		var innerScale = 'scale(' + ($elm$core$String$fromFloat(scaleX) + (', ' + ($elm$core$String$fromFloat(scaleY) + ') ')));
		return {
			cS: $elm$svg$Svg$Attributes$transform(
				_Utils_ap(
					innerTranslate,
					_Utils_ap(innerScale, innerRotate))),
			ca: $elm$svg$Svg$Attributes$transform(outer),
			c4: $elm$svg$Svg$Attributes$transform(path)
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
		var paths = _v0.e4;
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
		var outer = _v0.ca;
		var inner = _v0.cS;
		var path = _v0.c4;
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
		var icon = fullIcon.bz;
		var transforms = fullIcon.bN;
		var id = fullIcon.bZ;
		var outer = fullIcon.ca;
		var combinedTransforms = $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaningfulTransform(transforms);
		var _v0 = icon.fm;
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
		var id = include.bZ;
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
		var icon = fullIcon.bz;
		var transforms = fullIcon.bN;
		var role = fullIcon.co;
		var id = fullIcon.bZ;
		var title = fullIcon.fz;
		var outer = fullIcon.ca;
		var attributes = fullIcon.bs;
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
				'fa-' + icon.eH,
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
		return A2($elm$core$List$member, panel, model.fG.eY) ? _List_fromArray(
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
								return A2($author$project$Logic$App$Msg$ViewPanel, 1, event.a8);
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
								return A2($author$project$Logic$App$Msg$ViewPanel, 0, event.a8);
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
								return A2($author$project$Logic$App$Msg$ViewPanel, 4, event.a8);
							})
						]),
					highlightIfActive(4)),
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
								return A2($author$project$Logic$App$Msg$ViewPanel, 2, event.a8);
							})
						]),
					highlightIfActive(2)),
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
								return A2($author$project$Logic$App$Msg$ViewPanel, 3, event.a8);
							})
						]),
					highlightIfActive(3)),
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
var $author$project$Logic$App$Msg$AddEntity = function (a) {
	return {$: 49, a: a};
};
var $author$project$Logic$App$Msg$ChangeHeldItem = F2(
	function (a, b) {
		return {$: 28, a: a, b: b};
	});
var $author$project$Logic$App$Msg$RemoveEntity = function (a) {
	return {$: 48, a: a};
};
var $author$project$Logic$App$Msg$UpdateEntityInputField = function (a) {
	return {$: 50, a: a};
};
var $author$project$Logic$App$Utils$GetHeldItemAsString$getHeldItemAsString = function (heldItem) {
	switch (heldItem) {
		case 0:
			return 'Trinket';
		case 2:
			return 'Cypher';
		case 1:
			return 'Artifact';
		case 4:
			return 'Spellbook';
		case 3:
			return 'Focus';
		case 5:
			return 'Pie';
		default:
			return 'NoItem';
	}
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$option = _VirtualDom_node('option');
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$plus = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'plus',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$plus = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$plus);
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
												$elm$html$Html$Attributes$class('text'),
												A2($elm$html$Html$Attributes$style, 'margin-right', '6.8px')
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
			case 4:
				var list = iota.a;
				return renderList(list);
			case 8:
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
												$elm$html$Html$Attributes$class('text'),
												A2($elm$html$Html$Attributes$style, 'margin-right', '6.8px')
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
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$trash = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'trash',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$trash = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$trash);
var $author$project$Components$App$Panels$ConfigHexPanel$entitiesSection = function (model) {
	var generateEntitySection = function (entry) {
		var name = entry.a;
		var heldItem = entry.b.ea;
		var heldItemContent = entry.b.eb;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('entity_section')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('stored_iota_label'),
									$elm$html$Html$Events$onClick(
									$author$project$Logic$App$Msg$RemoveEntity(name))
								]),
							_List_fromArray(
								[
									$lattyware$elm_fontawesome$FontAwesome$Styles$css,
									$lattyware$elm_fontawesome$FontAwesome$view(
									A2(
										$lattyware$elm_fontawesome$FontAwesome$styled,
										_List_fromArray(
											[$lattyware$elm_fontawesome$FontAwesome$Attributes$sm]),
										$lattyware$elm_fontawesome$FontAwesome$Solid$trash))
								])),
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('stored_iota_label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(name + ':')
								]))
						])),
					A2(
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
											$elm$html$Html$Events$onInput(
											$author$project$Logic$App$Msg$ChangeHeldItem(name)),
											$elm$html$Html$Attributes$value(
											$author$project$Logic$App$Utils$GetHeldItemAsString$getHeldItemAsString(heldItem))
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
									if (!heldItemContent.$) {
										var iota = heldItemContent.a;
										return $author$project$Components$App$Panels$ConfigHexPanel$renderIotaBox(iota);
									} else {
										return _List_Nil;
									}
								}()))
						]))
				]));
	};
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('entities_section')
			]),
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('entities_label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Entities:')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('input_label_box')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$value(model.fG.cJ),
									$elm$html$Html$Events$onInput($author$project$Logic$App$Msg$UpdateEntityInputField)
								]),
							_List_Nil),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('add_button'),
									$elm$html$Html$Events$onClick(
									$author$project$Logic$App$Msg$AddEntity(model.fG.cJ))
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
				]),
			A2(
				$elm$core$List$map,
				generateEntitySection,
				A2(
					$elm$core$List$filter,
					function (entry) {
						var name = entry.a;
						return name !== 'Caster';
					},
					$elm$core$Dict$toList(model.bv.d5)))));
};
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
								$elm$html$Html$Events$onInput(
								$author$project$Logic$App$Msg$ChangeHeldItem('Caster')),
								$elm$html$Html$Attributes$value(
								$author$project$Logic$App$Utils$GetHeldItemAsString$getHeldItemAsString(
									$author$project$Logic$App$Utils$EntityContext$getPlayerHeldItem(model.bv)))
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
						var _v0 = $author$project$Logic$App$Utils$EntityContext$getPlayerHeldItemContent(model.bv);
						if (!_v0.$) {
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
						var _v0 = model.bv.fa;
						if (!_v0.$) {
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
	var visibility = A2($elm$core$List$member, 2, model.fG.eY);
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
				$author$project$Components$App$Panels$ConfigHexPanel$ravenmindSection(model),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('divider')
					]),
				_List_Nil),
				$author$project$Components$App$Panels$ConfigHexPanel$entitiesSection(model)
			]));
};
var $author$project$Logic$App$Msg$ChangeMacroName = F2(
	function (a, b) {
		return {$: 44, a: a, b: b};
	});
var $author$project$Logic$App$Msg$InputPattern = function (a) {
	return {$: 12, a: a};
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
var $author$project$Components$App$Panels$MacroPanel$renderIotaBox = function (iota) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('iota_box')
						]),
					A3($author$project$Logic$App$Utils$GetIotaValue$getIotaValueAsHtmlMsg, 0, iota, 0))
				]))
		]);
};
var $lattyware$elm_fontawesome$FontAwesome$Attributes$xs = $elm$svg$Svg$Attributes$class('fa-xs');
var $author$project$Components$App$Panels$MacroPanel$renderMacroDict = function (model) {
	var renderEntry = function (entry) {
		var signature = entry.a;
		var _v1 = entry.b;
		var displayName = _v1.a;
		var iota = _v1.c;
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
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('stored_iota_label'),
									A2($elm$html$Html$Attributes$style, 'margin-right', '0'),
									$elm$html$Html$Attributes$value(displayName),
									$elm$html$Html$Events$onInput(
									$author$project$Logic$App$Msg$ChangeMacroName(signature))
								]),
							_List_Nil),
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
	};
	return A2(
		$elm$core$List$intersperse,
		A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('divider')
				]),
			_List_Nil),
		A2(
			$elm$core$List$map,
			renderEntry,
			$elm$core$Dict$toList(model.bv.et)));
};
var $author$project$Components$App$Panels$MacroPanel$macroPanel = function (model) {
	var visibility = A2($elm$core$List$member, 4, model.fG.eY);
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
			$author$project$Components$App$Panels$MacroPanel$renderMacroDict(model)));
};
var $author$project$Logic$App$Msg$SelectNextSuggestion = function (a) {
	return {$: 16, a: a};
};
var $author$project$Logic$App$Msg$SelectPreviousSuggestion = function (a) {
	return {$: 15, a: a};
};
var $author$project$Logic$App$Msg$SetFocus = function (a) {
	return {$: 26, a: a};
};
var $author$project$Logic$App$Msg$UpdatePatternInputField = function (a) {
	return {$: 11, a: a};
};
var $author$project$Logic$App$Msg$DragOver = F2(
	function (a, b) {
		return {$: 23, a: a, b: b};
	});
var $author$project$Logic$App$Msg$Drop = {$: 25};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$MoveOnDrop = 1;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $author$project$Components$App$Panels$PatternPanel$dropTargetConfig = {
	d1: 1,
	eO: $elm$core$Basics$always($author$project$Logic$App$Msg$Drop),
	eQ: $elm$core$Maybe$Nothing,
	eR: $elm$core$Maybe$Nothing,
	eS: $author$project$Logic$App$Msg$DragOver
};
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$Event = F2(
	function (dataTransfer, mouseEvent) {
		return {dS: dataTransfer, eD: mouseEvent};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$DataTransfer = F3(
	function (files, types, dropEffect) {
		return {d1: dropEffect, d7: files, bo: types};
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
						ez: tag(ev),
						da: true,
						dr: true
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
						ez: tag(value),
						da: true,
						dr: true
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
					config.eS(config.d1))),
				$elm$core$Maybe$Just(
				A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$on, 'drop', config.eO)),
				A2(
				$elm$core$Maybe$map,
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$on('dragenter'),
				config.eQ),
				A2(
				$elm$core$Maybe$map,
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$on('dragleave'),
				config.eR)
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
		return _Utils_Tuple2(pat.dX, pat.el);
	},
	$author$project$Logic$App$Patterns$PatternRegistry$patternRegistry);
var $elm$core$String$toLower = _String_toLower;
var $author$project$Components$App$PatternAutoComplete$patternInputSuggestionList = function (model) {
	var inputValue = model.fG.c7;
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
	var suggestionIndex = model.fG.fs;
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
						$elm$core$String$fromInt(model.fG.cj.a) + 'px'),
						A2(
						$elm$html$Html$Attributes$style,
						'top',
						$elm$core$String$fromInt(model.fG.cj.b) + 'px')
					]),
				(_Utils_eq(
					model.fG.cj,
					_Utils_Tuple2(0, 0)) || (model.fG.fi === '')) ? _List_fromArray(
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
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $author$project$Logic$App$Msg$NoOp = {$: 0};
var $author$project$Logic$App$Types$PatternItem = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $author$project$Logic$App$Msg$RemoveFromPatternArray = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Logic$App$Msg$SetInsertionPoint = function (a) {
	return {$: 34, a: a};
};
var $author$project$Logic$App$Msg$UpdatePatternOuptut = F2(
	function (a, b) {
		return {$: 33, a: a, b: b};
	});
var $author$project$Logic$App$Msg$DragEnd = {$: 22};
var $author$project$Logic$App$Msg$DragStart = F3(
	function (a, b, c) {
		return {$: 21, a: a, b: b, c: c};
	});
var $author$project$Components$App$Panels$PatternPanel$draggedSourceConfig = function (id) {
	return {
		d2: {dO: false, es: false, eF: true},
		eN: $elm$core$Maybe$Nothing,
		eP: $elm$core$Basics$always($author$project$Logic$App$Msg$DragEnd),
		eT: $author$project$Logic$App$Msg$DragStart(id)
	};
};
var $author$project$Logic$App$Utils$GetIotaValue$getIotaFromString = function (string) {
	return (string === 'Null') ? $author$project$Logic$App$Types$Null : ((string === 'Entity') ? $author$project$Logic$App$Types$Entity('Caster') : ((string === 'Vector') ? $author$project$Logic$App$Types$Vector(
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
		case 6:
			return 'Null';
		case 0:
			return 'Number';
		case 1:
			return 'Vector';
		case 2:
			return 'Boolean';
		case 3:
			return 'Entity';
		case 4:
			var iotaType = iota.a;
			return 'List: ' + $author$project$Logic$App$Utils$GetIotaValue$getIotaTypeAsString(iotaType);
		case 5:
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
var $author$project$Logic$App$Utils$Utils$insert = F3(
	function (i, value, list) {
		return _Utils_ap(
			A2($elm$core$List$take, i, list),
			A2(
				$elm$core$List$cons,
				value,
				A2($elm$core$List$drop, i, list)));
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
						ez: tag(value),
						da: false,
						dr: true
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
					config.eT(config.d2))),
				$elm$core$Maybe$Just(
				A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$on, 'dragend', config.eP)),
				A2(
				$elm$core$Maybe$map,
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$on('drag'),
				config.eN)
			]));
};
var $jinjor$elm_contextmenu$ContextMenu$NoOp = {$: 0};
var $jinjor$elm_contextmenu$ContextMenu$RequestOpen = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $jinjor$elm_contextmenu$ContextMenu$Position = F2(
	function (x, y) {
		return {n: x, o: y};
	});
var $jinjor$elm_contextmenu$ContextMenu$position = A3(
	$elm$json$Json$Decode$map2,
	$jinjor$elm_contextmenu$ContextMenu$Position,
	A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'clientY', $elm$json$Json$Decode$float));
var $jinjor$elm_contextmenu$ContextMenu$openIf = F3(
	function (condition, transform, context) {
		return condition ? A2(
			$elm$html$Html$Events$custom,
			'contextmenu',
			A2(
				$elm$json$Json$Decode$map,
				function (msg) {
					return {ez: msg, da: true, dr: true};
				},
				A2(
					$elm$json$Json$Decode$map,
					transform,
					A2(
						$elm$json$Json$Decode$map,
						$jinjor$elm_contextmenu$ContextMenu$RequestOpen(context),
						$jinjor$elm_contextmenu$ContextMenu$position)))) : A2(
			$elm$html$Html$Events$on,
			'contextmenu',
			$elm$json$Json$Decode$succeed(
				transform($jinjor$elm_contextmenu$ContextMenu$NoOp)));
	});
var $jinjor$elm_contextmenu$ContextMenu$open = F2(
	function (transform, context) {
		return A3($jinjor$elm_contextmenu$ContextMenu$openIf, true, transform, context);
	});
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
var $author$project$Components$App$Panels$PatternPanel$renderPatternList = F9(
	function (patternList, dragoverIndex, dragstartIndex, overDragHandle, insertionPoint, macroDict, timeline, timelineIndex, castingContext) {
		var patterns = $elm$core$List$unzip(
			$elm$core$Array$toList(patternList)).a;
		var fixedTimeline = ($elm$core$Array$length(timeline) < 2) ? A2(
			$elm$core$Array$repeat,
			2,
			{c6: -1, fn: $elm$core$Array$empty}) : timeline;
		var timelinePatternIndex = (timelineIndex >= 0) ? A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Array$length(timeline),
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.c6;
				},
				A2(
					$elm$core$Array$get,
					timelineIndex,
					$elm_community$array_extra$Array$Extra$reverse(fixedTimeline)))) : (-1);
		var renderPattern = F2(
			function (index, pattern) {
				var opacity = ((!pattern.cw) || (_Utils_cmp(
					($elm$core$Array$length(patternList) - index) - 1,
					timelinePatternIndex) > 0)) ? A2($elm$html$Html$Attributes$style, 'opacity', '50%') : A2($elm$html$Html$Attributes$style, '', '');
				var isMacro = $author$project$Logic$App$Utils$Utils$isJust(
					A2($elm$core$Dict$get, pattern.fl, macroDict));
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
										A3(
										$author$project$Logic$App$Utils$Utils$ifThenElse,
										isMacro,
										A2($elm$html$Html$Attributes$style, 'background-color', '#4C3541'),
										A2($elm$html$Html$Attributes$style, 'background-color', 'var(--primary_lightest)')),
										$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick(
										function (event) {
											return A3(
												$author$project$Logic$App$Utils$Utils$ifThenElse,
												event.a8.fj,
												$author$project$Logic$App$Msg$SetInsertionPoint(index),
												$author$project$Logic$App$Msg$NoOp);
										}),
										A2(
										$jinjor$elm_contextmenu$ContextMenu$open,
										$author$project$Logic$App$Msg$ContextMenuMsg,
										A4($author$project$Logic$App$Types$PatternItem, pattern.cw, isMacro, pattern, index))
									]),
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
											]) : _List_Nil))),
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
													opacity
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(pattern.dX)
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
								($elm$core$List$length(pattern.bF) > 0) ? A2(
									$elm$core$List$cons,
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('output_option_box'),
												opacity
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
																pattern._).a)),
														$elm$html$Html$Events$onInput(
														function (str) {
															return A2(
																$author$project$Logic$App$Msg$UpdatePatternOuptut,
																index,
																_Utils_update(
																	pattern,
																	{
																		_: $elm$core$Maybe$Just(
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
													pattern.bF))
											])),
									function () {
										var _v0 = pattern._;
										_v0$4:
										while (true) {
											if (!_v0.$) {
												switch (_v0.a.a.$) {
													case 1:
														if (_v0.a.b.$ === 1) {
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
																			opacity
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
																									_: $elm$core$Maybe$Just(
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
																			opacity
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
																									_: $elm$core$Maybe$Just(
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
																			opacity
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
																									_: $elm$core$Maybe$Just(
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
															break _v0$4;
														}
													case 0:
														if (!_v0.a.b.$) {
															var _v4 = _v0.a;
															var _v5 = _v4.a;
															return _List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('output_option_box'),
																			A2($elm$html$Html$Attributes$style, 'grid-template-columns', '2.1fr 3fr'),
																			opacity
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
																									_: $elm$core$Maybe$Just(
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
																				pattern.bF))
																		]))
																]);
														} else {
															break _v0$4;
														}
													case 3:
														if (_v0.a.b.$ === 3) {
															var _v6 = _v0.a;
															var _v7 = _v6.a;
															return _List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('output_option_box'),
																			A2($elm$html$Html$Attributes$style, 'grid-template-columns', '2.1fr 3fr'),
																			opacity
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$label,
																			_List_Nil,
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Entity:')
																				])),
																			A2(
																			$elm$html$Html$select,
																			_List_fromArray(
																				[
																					$elm$html$Html$Events$onInput(
																					function (str) {
																						return A2(
																							$author$project$Logic$App$Msg$UpdatePatternOuptut,
																							index,
																							_Utils_update(
																								pattern,
																								{
																									_: $elm$core$Maybe$Just(
																										_Utils_Tuple2(
																											$author$project$Logic$App$Types$EntityType,
																											$author$project$Logic$App$Types$Entity(str)))
																								}));
																					})
																				]),
																			A2(
																				$elm$core$List$map,
																				function (name) {
																					return A2(
																						$elm$html$Html$option,
																						_List_Nil,
																						_List_fromArray(
																							[
																								$elm$html$Html$text(name)
																							]));
																				},
																				A2(
																					$elm$core$List$cons,
																					'Caster',
																					A2(
																						$elm$core$List$filter,
																						function (x) {
																							return x !== 'Caster';
																						},
																						$elm$core$Dict$keys(castingContext.d5)))))
																		]))
																]);
														} else {
															break _v0$4;
														}
													case 4:
														if ((_v0.a.a.a.$ === 3) && (_v0.a.b.$ === 4)) {
															var _v8 = _v0.a;
															var _v9 = _v8.a.a;
															return _List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('output_option_box'),
																			A2($elm$html$Html$Attributes$style, 'grid-template-columns', '2.1fr 3fr'),
																			opacity
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
																									_: $elm$core$Maybe$Just(
																										_Utils_Tuple2(
																											$author$project$Logic$App$Types$IotaListType($author$project$Logic$App$Types$EntityType),
																											$author$project$Logic$App$Types$IotaList(
																												A2(
																													$elm$core$Array$repeat,
																													A2(
																														$elm$core$Maybe$withDefault,
																														0,
																														$elm$core$String$toInt(str)),
																													$author$project$Logic$App$Types$Entity('Generic Entity')))))
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
																				pattern.bF))
																		]))
																]);
														} else {
															break _v0$4;
														}
													default:
														break _v0$4;
												}
											} else {
												break _v0$4;
											}
										}
										return _List_Nil;
									}()) : _List_Nil))
						]));
			});
		var list = _Utils_ap(
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
		return (!(!insertionPoint)) ? A3(
			$author$project$Logic$App$Utils$Utils$insert,
			insertionPoint,
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('insertion_point')
					]),
				_List_Nil),
			list) : list;
	});
var $author$project$Components$App$Panels$PatternPanel$patternPanel = function (model) {
	var visibility = A2($elm$core$List$member, 1, model.fG.eY);
	var autocompleteTuple = $author$project$Components$App$PatternAutoComplete$patternInputAutoComplete(model);
	var valueToSend = (autocompleteTuple.b !== '') ? autocompleteTuple.b : model.fG.c7;
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
						$elm$html$Html$text('Patterns')
					])),
				A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id('pattern_draggable_container'),
					$mpizenberg$elm_pointer_events$Html$Events$Extra$Drag$onDropTarget($author$project$Components$App$Panels$PatternPanel$dropTargetConfig)),
				$elm$core$List$reverse(
					A9($author$project$Components$App$Panels$PatternPanel$renderPatternList, model.c5, model.fG.eE, model.fG.d_.b, model.fG.eZ, model.ek, model.bv.et, model.fx, model.fy, model.bv))),
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
												$elm$html$Html$Attributes$value(model.fG.c7),
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
var $author$project$Logic$App$Msg$RequestGridDrawingAsGIF = {$: 29};
var $author$project$Logic$App$Msg$RequestGridDrawingAsImage = {$: 31};
var $author$project$Components$App$Panels$FilePanel$saveExportPanel = function (model) {
	var visibility = A2($elm$core$List$member, 3, model.fG.eY);
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
						$author$project$Logic$App$Msg$ViewOverlay(1))
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
						$author$project$Logic$App$Msg$ViewOverlay(2))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(' • Export Patterns')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('seperator')
					]),
				_List_Nil),
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
	var visibility = A2($elm$core$List$member, 0, model.fG.eY);
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
						$elm$html$Html$text('Stack')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('scroll_container')
					]),
				$author$project$Components$App$Panels$StackPanel$renderStack(model.fn))
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
				$author$project$Components$App$Panels$MacroPanel$macroPanel(model)
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
		return {dH: changedTouches, a8: keys, ft: targetTouches, fF: touches};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$Touch = F4(
	function (identifier, clientPos, pagePos, screenPos) {
		return {dI: clientPos, ee: identifier, e1: pagePos, fh: screenPos};
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
						ez: tag(ev),
						da: options.da,
						dr: options.dr
					};
				},
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$eventDecoder));
	});
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
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$defaultOptions = {da: true, dr: false};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onEnd = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onWithOptions, 'touchend', $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$defaultOptions);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onStart = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onWithOptions, 'touchstart', $mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$defaultOptions);
var $author$project$Components$App$Grid$getGridpointFromOffsetCoordinates = F2(
	function (grid_, offsetCoords) {
		var checkMatchingOffsetCoords = function (point) {
			return _Utils_eq(
				_Utils_Tuple2(point.H, point.A),
				_Utils_Tuple2(offsetCoords.H, offsetCoords.A));
		};
		return A2(
			$elm$core$Maybe$withDefault,
			$author$project$Logic$App$Grid$emptyGridpoint,
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
					pnt.aq,
					pnt.ah);
			},
			point.L);
		return A2(
			$elm$core$List$map,
			function (conPnt) {
				var conPntCoords = conPnt.a;
				var betweenOffsetValues = conPnt.b;
				var color = conPnt.c;
				return {
					aq: betweenOffsetValues,
					ah: color,
					bW: {bP: conPntCoords.n, bQ: point.n, bR: conPntCoords.o, bS: point.o}
				};
			},
			connectedPoints);
	});
var $elm$svg$Svg$Attributes$fillOpacity = _VirtualDom_attribute('fill-opacity');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $author$project$Components$App$Grid$renderLine = F4(
	function (scale, color, coordinatePair, offsetsTuple) {
		var y2 = coordinatePair.bS;
		var y1 = coordinatePair.bR;
		var x2 = coordinatePair.bQ;
		var x1 = coordinatePair.bP;
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
			_Utils_Tuple2(coordinatePair.bP, coordinatePair.bR),
			_Utils_Tuple2(0.0, 0.0))) && (!_Utils_eq(
			_Utils_Tuple2(coordinatePair.bQ, coordinatePair.bS),
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
	var points = model.G.au.aH;
	return A2(
		$elm$core$List$map,
		function (x) {
			return A4($author$project$Components$App$Grid$renderLine, model.aV.aN, x.ah, x.bW, x.aq);
		},
		A2(
			$elm$core$List$concatMap,
			$author$project$Components$App$Grid$findLinkedPoints(model.G.ck),
			points));
};
var $author$project$Components$App$Grid$renderDrawingLine = function (model) {
	var mousePos = model.bb;
	var gridOffset = model.bO.af - model.G.af;
	var drawingMode = model.G.au.d$;
	var activePoint = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Logic$App$Grid$emptyGridpoint,
		$elm$core$List$head(model.G.au.aH));
	return drawingMode ? _List_fromArray(
		[
			A4(
			$author$project$Components$App$Grid$renderLine,
			model.aV.aN,
			$author$project$Settings$Theme$accent2,
			{bP: mousePos.a - gridOffset, bQ: activePoint.n, bR: mousePos.b, bS: activePoint.o},
			_Utils_Tuple3(
				_Utils_Tuple2(0, 0),
				_Utils_Tuple2(0, 0),
				_Utils_Tuple2(0, 0)))
		]) : _List_Nil;
};
var $author$project$Components$App$Grid$renderLines = function (model) {
	var points = model.G.d0;
	return A2(
		$elm$core$List$map,
		function (x) {
			return A4($author$project$Components$App$Grid$renderLine, model.aV.aN, x.ah, x.bW, x.aq);
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
		var pointScale = (!point.bq) ? (A2(
			$elm$core$Basics$min,
			1,
			1 / (A2(
				$author$project$Components$App$Grid$distanceBetweenCoordinates,
				mousePos,
				_Utils_Tuple2(point.n + gridOffset, point.o)) / 30)) * scale) : 0;
		return (pointScale > 0.05) ? _List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(point.cl * 2)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(point.cl * 2)),
						$elm$svg$Svg$Attributes$viewBox('0 0 300 280'),
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2(
						$elm$html$Html$Attributes$style,
						'left',
						$elm$core$String$fromFloat(point.n - (8 * scale)) + 'px'),
						A2(
						$elm$html$Html$Attributes$style,
						'top',
						$elm$core$String$fromFloat(point.o - (8 * scale)) + 'px'),
						A2(
						$elm$html$Html$Attributes$style,
						'transform',
						'scale(' + ($elm$core$String$fromFloat(pointScale) + ')')),
						$elm$svg$Svg$Attributes$fill(point.ah)
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
var $author$project$Components$App$Grid$renderPoints = function (model) {
	var scale = model.aV.aN;
	var mousePos = model.bb;
	var mouseOffsetCoordY = $elm$core$Basics$floor(
		mousePos.b / $author$project$Components$App$Grid$verticalSpacing(scale));
	var points = A2(
		$elm$core$List$take,
		14,
		A2($elm$core$List$drop, mouseOffsetCoordY - 7, model.G.ck));
	var gridWidth = model.G.af;
	var gridOffset = model.bO.af - gridWidth;
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
				return $.dI;
			},
			$elm$core$List$head(touchEvent.dH)));
};
var $author$project$Components$App$Grid$grid = function (model) {
	var scale = model.aV.aN;
	var gridHeight = model.G.cP;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('hex_grid'),
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.dI;
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
							$elm$core$String$fromFloat(model.G.cP)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(model.G.af)),
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
	var timelineLength = $elm$core$Array$length(model.fx);
	var spacing = (model.G.af - 50) / (timelineLength - 1);
	var setSpecificAttributes = F2(
		function (scale, index) {
			return _Utils_eq(index, timelineLength - 1) ? _List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$core$String$fromFloat(model.G.af - 30) + 'px'),
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
		model.fy,
		$elm$core$Array$length(model.fx));
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
							_Utils_eq(index, model.fy + 1) || (currentTime && _Utils_eq(index + 1, timelineLength)),
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
										_Utils_eq(index, model.fy + 1) || (currentTime && _Utils_eq(index + 1, timelineLength)),
										$elm$svg$Svg$Attributes$class('timeline_point_outline_selected'),
										$elm$svg$Svg$Attributes$class('timeline_point_outline')),
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2(
										$elm$html$Html$Attributes$style,
										'top',
										$elm$core$String$fromInt(44) + 'px'),
										A3(
										$author$project$Logic$App$Utils$Utils$ifThenElse,
										_Utils_eq(index, model.fy + 1) || (currentTime && _Utils_eq(index + 1, timelineLength)),
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
										_Utils_eq(index, model.fy + 1) || (currentTime && _Utils_eq(index + 1, timelineLength)),
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
										_Utils_eq(index, model.fy + 1) || (currentTime && _Utils_eq(index + 1, timelineLength)),
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
						fx: ($elm$core$Array$length(model.fx) < 2) ? A2(
							$elm$core$Array$repeat,
							2,
							{c6: -1, fn: $elm$core$Array$empty}) : model.fx
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
								$author$project$Logic$App$Msg$SetGridScale(model.aV.aN - 0.1))
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
								$author$project$Logic$App$Msg$SetGridScale(model.aV.aN + 0.1))
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
				{da: false, dr: false},
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.dI;
					},
					$author$project$Logic$App$Msg$MouseMove)),
				A3(
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Touch$onWithOptions,
				'touchmove',
				{da: false, dr: false},
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
var $author$project$Logic$App$Msg$ExpandMacro = F2(
	function (a, b) {
		return {$: 46, a: a, b: b};
	});
var $jinjor$elm_contextmenu$ContextMenu$Item = $elm$core$Basics$identity;
var $jinjor$elm_contextmenu$ContextMenu$Text = function (a) {
	return {$: 0, a: a};
};
var $jinjor$elm_contextmenu$ContextMenu$defaultItemHeight = 20;
var $jinjor$elm_contextmenu$ContextMenu$item = function (s) {
	return {
		bU: $jinjor$elm_contextmenu$ContextMenu$Text(s),
		at: false,
		cP: $elm$core$Basics$floor($jinjor$elm_contextmenu$ContextMenu$defaultItemHeight),
		bz: $elm$core$Maybe$Nothing,
		bg: ''
	};
};
var $author$project$Components$App$ContextMenu$ContextMenu$toItemGroups = function (context) {
	var isActive = context.a;
	var isMacro = context.b;
	var pattern = context.c;
	var index = context.d;
	return _List_fromArray(
		[
			_Utils_ap(
			_List_fromArray(
				[
					_Utils_Tuple2(
					$jinjor$elm_contextmenu$ContextMenu$item('Set Insertion Point Above'),
					$author$project$Logic$App$Msg$SetInsertionPoint(index + 1)),
					_Utils_Tuple2(
					$jinjor$elm_contextmenu$ContextMenu$item('Set Insertion Point Below'),
					$author$project$Logic$App$Msg$SetInsertionPoint(index)),
					A3(
					$author$project$Logic$App$Utils$Utils$ifThenElse,
					isActive,
					_Utils_Tuple2(
						$jinjor$elm_contextmenu$ContextMenu$item('Disable Pattern'),
						$author$project$Logic$App$Msg$NoOp),
					_Utils_Tuple2(
						$jinjor$elm_contextmenu$ContextMenu$item('Enable Pattern'),
						$author$project$Logic$App$Msg$NoOp))
				]),
			A3(
				$author$project$Logic$App$Utils$Utils$ifThenElse,
				isMacro,
				_List_fromArray(
					[
						_Utils_Tuple2(
						$jinjor$elm_contextmenu$ContextMenu$item('Expand Macro'),
						A2($author$project$Logic$App$Msg$ExpandMacro, pattern.fl, index))
					]),
				_List_Nil))
		]);
};
var $jinjor$elm_contextmenu$ContextMenu$EnterContainer = {$: 6};
var $jinjor$elm_contextmenu$ContextMenu$LeaveContainer = {$: 7};
var $jinjor$elm_contextmenu$ContextMenu$containerBorderWidth = 1;
var $jinjor$elm_contextmenu$ContextMenu$containerPadding = 4;
var $jinjor$elm_contextmenu$ContextMenu$partitionMargin = 6;
var $jinjor$elm_contextmenu$ContextMenu$partitionWidth = 1;
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $jinjor$elm_contextmenu$ContextMenu$calculateMenuHeight = function (groups) {
	var partitions = ($elm$core$List$length(groups) - 1) * (($jinjor$elm_contextmenu$ContextMenu$partitionMargin * 2) + $jinjor$elm_contextmenu$ContextMenu$partitionWidth);
	var items = $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (items_) {
				return $elm$core$List$sum(
					A2(
						$elm$core$List$map,
						function (_v0) {
							var item_ = _v0;
							return item_.cP;
						},
						items_));
			},
			groups));
	var containerPaddings = $jinjor$elm_contextmenu$ContextMenu$containerPadding * 2;
	var containerBorders = $jinjor$elm_contextmenu$ContextMenu$containerBorderWidth * 2;
	return ((containerBorders + containerPaddings) + partitions) + items;
};
var $jinjor$elm_contextmenu$ContextMenu$calculateX = F5(
	function (direction, overflow, windowWidth, menuWidth, x) {
		return A2(
			$elm$core$Basics$max,
			0,
			function () {
				if (!direction) {
					return ((x - menuWidth) < 0) ? ((!overflow) ? 0 : x) : (x - menuWidth);
				} else {
					return (_Utils_cmp(x + menuWidth, windowWidth) > 0) ? ((!overflow) ? (windowWidth - menuWidth) : (x - menuWidth)) : x;
				}
			}());
	});
var $jinjor$elm_contextmenu$ContextMenu$calculateY = F4(
	function (overflow, windowHeight, menuHeight, y) {
		return A2(
			$elm$core$Basics$max,
			0,
			(_Utils_cmp(y + menuHeight, windowHeight) > 0) ? ((!overflow) ? (windowHeight - menuHeight) : (y - menuHeight)) : y);
	});
var $jinjor$elm_contextmenu$Styles$borderColor = '#ccc';
var $jinjor$elm_contextmenu$Styles$px = function (n) {
	return $elm$core$String$fromFloat(n) + 'px';
};
var $jinjor$elm_contextmenu$Styles$container = F9(
	function (containerColor, borderWidth, padding, rounded, width, left, top, fontFamily, fontSize) {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'border-style', 'solid'),
				A2(
				$elm$html$Html$Attributes$style,
				'border-width',
				$jinjor$elm_contextmenu$Styles$px(borderWidth)),
				A2($elm$html$Html$Attributes$style, 'border-color', $jinjor$elm_contextmenu$Styles$borderColor),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2(
				$elm$html$Html$Attributes$style,
				'top',
				$jinjor$elm_contextmenu$Styles$px(top)),
				A2(
				$elm$html$Html$Attributes$style,
				'left',
				$jinjor$elm_contextmenu$Styles$px(left)),
				A2(
				$elm$html$Html$Attributes$style,
				'width',
				$jinjor$elm_contextmenu$Styles$px(width)),
				A2(
				$elm$html$Html$Attributes$style,
				'z-index',
				$elm$core$String$fromFloat(2147483647 - 10)),
				A2($elm$html$Html$Attributes$style, 'background-color', containerColor),
				A2($elm$html$Html$Attributes$style, 'cursor', 'default'),
				A2($elm$html$Html$Attributes$style, 'box-shadow', '0px 3px 8px 0px rgba(0,0,0,0.3)'),
				A2(
				$elm$html$Html$Attributes$style,
				'padding',
				$jinjor$elm_contextmenu$Styles$px(padding) + ' 0'),
				A2(
				$elm$html$Html$Attributes$style,
				'border-radius',
				rounded ? $jinjor$elm_contextmenu$Styles$px(padding) : ''),
				A2($elm$html$Html$Attributes$style, 'font-family', fontFamily),
				A2(
				$elm$html$Html$Attributes$style,
				'font-size',
				$jinjor$elm_contextmenu$Styles$px(fontSize))
			]);
	});
var $jinjor$elm_contextmenu$ContextMenu$fontSize = 13;
var $jinjor$elm_contextmenu$ContextMenu$getItemIndex = function (hover) {
	if (hover.$ === 1) {
		var index = hover.a;
		return $elm$core$Maybe$Just(index);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $jinjor$elm_contextmenu$ContextMenu$EnterItem = function (a) {
	return {$: 4, a: a};
};
var $jinjor$elm_contextmenu$ContextMenu$LeaveItem = {$: 5};
var $jinjor$elm_contextmenu$ContextMenu$disabledTextColor = 'rgb(200, 200, 200)';
var $jinjor$elm_contextmenu$Styles$icon = function (size) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
			A2(
			$elm$html$Html$Attributes$style,
			'margin-left',
			$jinjor$elm_contextmenu$Styles$px((-size) - 4)),
			A2($elm$html$Html$Attributes$style, 'top', '2px')
		]);
};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$html$Html$Events$onMouseDown = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mousedown',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseEnter = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseenter',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseLeave = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseleave',
		$elm$json$Json$Decode$succeed(msg));
};
var $jinjor$elm_contextmenu$Styles$row = F8(
	function (hoverColor, disabledTextColor, invertText, usePointer, lineHeight, hovered, disabled, hasShortCut) {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative'),
				A2($elm$html$Html$Attributes$style, 'padding', '0 18px 0 28px'),
				A2(
				$elm$html$Html$Attributes$style,
				'background-color',
				hovered ? hoverColor : ''),
				A2(
				$elm$html$Html$Attributes$style,
				'height',
				$jinjor$elm_contextmenu$Styles$px(lineHeight)),
				A2(
				$elm$html$Html$Attributes$style,
				'color',
				disabled ? disabledTextColor : ((hovered && invertText) ? '#fff' : '')),
				A2(
				$elm$html$Html$Attributes$style,
				'cursor',
				((!disabled) && usePointer) ? 'pointer' : ''),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2(
				$elm$html$Html$Attributes$style,
				'justify-content',
				hasShortCut ? 'space-between' : '')
			]);
	});
var $jinjor$elm_contextmenu$Styles$shortcut = F3(
	function (color, lineHeight, hovered) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$Attributes$style,
				'line-height',
				$jinjor$elm_contextmenu$Styles$px(lineHeight)),
				A2(
				$elm$html$Html$Attributes$style,
				'color',
				hovered ? '' : color)
			]);
	});
var $jinjor$elm_contextmenu$ContextMenu$shortcutTextColor = 'rgb(200, 200, 200)';
var $jinjor$elm_contextmenu$Styles$text = function (lineHeight) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$Attributes$style,
			'line-height',
			$jinjor$elm_contextmenu$Styles$px(lineHeight)),
			A2($elm$html$Html$Attributes$style, 'text-overflow', 'ellipsis'),
			A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
			A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap')
		]);
};
var $jinjor$elm_contextmenu$ContextMenu$itemView = F6(
	function (config, transform, hoverIndex, groupIndex, index, _v0) {
		var item_ = _v0.a;
		var msg = _v0.b;
		var icon_ = function () {
			var _v2 = item_.bz;
			if (!_v2.$) {
				var _v3 = _v2.a;
				var icon__ = _v3.a;
				var color = _v3.b;
				return A2(
					$elm$html$Html$map,
					$elm$core$Basics$never,
					A2(
						$elm$html$Html$div,
						$jinjor$elm_contextmenu$Styles$icon($jinjor$elm_contextmenu$ContextMenu$fontSize),
						_List_fromArray(
							[
								A2(
								icon__,
								item_.at ? $jinjor$elm_contextmenu$ContextMenu$disabledTextColor : color,
								$elm$core$Basics$floor($jinjor$elm_contextmenu$ContextMenu$fontSize))
							])));
			} else {
				return $elm$html$Html$text('');
			}
		}();
		var hovered = _Utils_eq(
			hoverIndex,
			$elm$core$Maybe$Just(
				_Utils_Tuple2(groupIndex, index)));
		var shortCut = A2(
			$elm$html$Html$div,
			A3($jinjor$elm_contextmenu$Styles$shortcut, $jinjor$elm_contextmenu$ContextMenu$shortcutTextColor, item_.cP, hovered),
			_List_fromArray(
				[
					$elm$html$Html$text(item_.bg)
				]));
		var styles = A8(
			$jinjor$elm_contextmenu$Styles$row,
			config.ed,
			$jinjor$elm_contextmenu$ContextMenu$disabledTextColor,
			config.en,
			config.dR === 1,
			item_.cP,
			hovered,
			item_.at,
			$elm$core$String$trim(item_.bg) !== '');
		var events = item_.at ? _List_Nil : _List_fromArray(
			[
				$elm$html$Html$Events$onMouseEnter(
				transform(
					$jinjor$elm_contextmenu$ContextMenu$EnterItem(
						_Utils_Tuple2(groupIndex, index)))),
				$elm$html$Html$Events$onMouseLeave(
				transform($jinjor$elm_contextmenu$ContextMenu$LeaveItem)),
				$elm$html$Html$Events$onMouseDown(msg)
			]);
		var content = function () {
			var _v1 = item_.bU;
			if (!_v1.$) {
				var s = _v1.a;
				return A2(
					$elm$html$Html$div,
					$jinjor$elm_contextmenu$Styles$text(item_.cP),
					_List_fromArray(
						[
							$elm$html$Html$text(s)
						]));
			} else {
				var toHtml = _v1.a;
				return toHtml(item_.at);
			}
		}();
		return A2(
			$elm$html$Html$div,
			_Utils_ap(styles, events),
			_List_fromArray(
				[
					icon_,
					A2($elm$html$Html$map, $elm$core$Basics$never, content),
					shortCut
				]));
	});
var $jinjor$elm_contextmenu$ContextMenu$itemGroupView = F5(
	function (config, transform, hoverIndex, groupIndex, items) {
		return A2(
			$elm$core$List$indexedMap,
			A4($jinjor$elm_contextmenu$ContextMenu$itemView, config, transform, hoverIndex, groupIndex),
			items);
	});
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $jinjor$elm_contextmenu$Styles$partition = F2(
	function (borderWidth, margin) {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'border-bottom-style', 'solid'),
				A2(
				$elm$html$Html$Attributes$style,
				'border-bottom-width',
				$jinjor$elm_contextmenu$Styles$px(1)),
				A2($elm$html$Html$Attributes$style, 'border-bottom-color', $jinjor$elm_contextmenu$Styles$borderColor),
				A2($elm$html$Html$Attributes$style, 'border-top', 'none'),
				A2(
				$elm$html$Html$Attributes$style,
				'margin',
				$jinjor$elm_contextmenu$Styles$px(margin) + ' 0')
			]);
	});
var $jinjor$elm_contextmenu$ContextMenu$partition = A2(
	$elm$html$Html$hr,
	A2($jinjor$elm_contextmenu$Styles$partition, $jinjor$elm_contextmenu$ContextMenu$partitionWidth, $jinjor$elm_contextmenu$ContextMenu$partitionMargin),
	_List_Nil);
var $jinjor$elm_contextmenu$ContextMenu$joinGroupsWithPartition = function (groups) {
	return A3(
		$elm$core$List$foldr,
		F2(
			function (group, prev) {
				if (!prev.$) {
					var items = prev.a;
					return $elm$core$Maybe$Just(
						_Utils_ap(
							group,
							A2($elm$core$List$cons, $jinjor$elm_contextmenu$ContextMenu$partition, items)));
				} else {
					return $elm$core$Maybe$Just(group);
				}
			}),
		$elm$core$Maybe$Nothing,
		groups);
};
var $jinjor$elm_contextmenu$ContextMenu$menuWidthWithBorders = function (menuWidth) {
	return menuWidth + ($jinjor$elm_contextmenu$ContextMenu$containerBorderWidth * 2);
};
var $jinjor$elm_contextmenu$ContextMenu$view = F4(
	function (config, transform, toItemGroups, _v0) {
		var model = _v0;
		var _v1 = model.F;
		if (!_v1.$) {
			var mouse = _v1.a.bD;
			var window = _v1.a.bO;
			var hover = _v1.a.by;
			var context = _v1.a.h;
			var groups = toItemGroups(context);
			var groupsView = A2(
				$elm$core$List$indexedMap,
				A3(
					$jinjor$elm_contextmenu$ContextMenu$itemGroupView,
					config,
					transform,
					$jinjor$elm_contextmenu$ContextMenu$getItemIndex(hover)),
				groups);
			var itemGroups = A2(
				$elm$core$List$map,
				$elm$core$List$map($elm$core$Tuple$first),
				groups);
			var _v2 = $jinjor$elm_contextmenu$ContextMenu$joinGroupsWithPartition(groupsView);
			if (!_v2.$) {
				var items = _v2.a;
				var y_ = A4(
					$jinjor$elm_contextmenu$ContextMenu$calculateY,
					config.e$,
					window.cP,
					$jinjor$elm_contextmenu$ContextMenu$calculateMenuHeight(itemGroups),
					mouse.o);
				var x_ = A5(
					$jinjor$elm_contextmenu$ContextMenu$calculateX,
					config.dW,
					config.e_,
					window.af,
					$jinjor$elm_contextmenu$ContextMenu$menuWidthWithBorders(config.af),
					mouse.n);
				return A2(
					$elm$html$Html$div,
					_Utils_ap(
						A9($jinjor$elm_contextmenu$Styles$container, config.dL, $jinjor$elm_contextmenu$ContextMenu$containerBorderWidth, $jinjor$elm_contextmenu$ContextMenu$containerPadding, config.ff, config.af, x_, y_, config.bX, $jinjor$elm_contextmenu$ContextMenu$fontSize),
						_List_fromArray(
							[
								$elm$html$Html$Events$onMouseEnter(
								transform($jinjor$elm_contextmenu$ContextMenu$EnterContainer)),
								$elm$html$Html$Events$onMouseLeave(
								transform($jinjor$elm_contextmenu$ContextMenu$LeaveContainer))
							])),
					items);
			} else {
				return $elm$html$Html$text('');
			}
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Main$view = function (model) {
	return {
		dD: _List_fromArray(
			[
				$author$project$Components$App$Content$content(model),
				A4($jinjor$elm_contextmenu$ContextMenu$view, model.dJ, $author$project$Logic$App$Msg$ContextMenuMsg, $author$project$Components$App$ContextMenu$ContextMenu$toItemGroups, model.dM)
			]),
		fz: 'Hex Studio'
	};
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{ej: $author$project$Main$init, fr: $author$project$Main$subscriptions, fH: $author$project$Main$update, fJ: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));