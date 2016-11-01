/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const server = __webpack_require__(15).createServer()
	const books = __webpack_require__(21)

	function setOnline(req, res, next)
	{
	    req.online = true
	    next()
	}

	server.use(setOnline)

	server.use('/books', books.middleware())

	const log = (...args) =>
	{
	    // console.log(...args)
	}

	server.get('/users', (req, res) =>
	{
	    log(`get:/users`)
	    res.status(200).send([])
	})

	// server.all('/users*', (req, res) =>
	// {
	//     res.status(200).send(`catching all`)
	// })

	// server.use('/users', (req, res) =>
	// {
	//     res.status(200).send(`request highjacked with server#use, request method [${req.method}]`)
	// })

	server.post('/users', (req, res) =>
	{
	    log(`post:/users`)
	    res.status(200).send(`user ${req.body.name} created`)
	})

	server.put('/users/:id(\\d)', (req, res) =>
	{
	    log(`put:/users:id`)
	    res.status(200).send(`user ${req.body.name}, with id ${req.params.id}, updated`)
	})

	server.delete('/users/:id(\\d)', (req, res) =>
	{
	    log(`delete:/users:id`)
	    res.status(200).send(`user deleted with id ${req.params.id}`)
	})

	server.send('update-stuff', ['new stuff'])


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php

	// Unique ID creation requires a high quality random # generator.  We feature
	// detect to determine the best RNG source, normalizing to a function that
	// returns 128-bits of randomness, since that's what's usually required
	var _rng = __webpack_require__(4);

	// Maps for number <-> hex string conversion
	var _byteToHex = [];
	var _hexToByte = {};
	for (var i = 0; i < 256; i++) {
	  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	  _hexToByte[_byteToHex[i]] = i;
	}

	// **`parse()` - Parse a UUID into it's component bytes**
	function parse(s, buf, offset) {
	  var i = (buf && offset) || 0, ii = 0;

	  buf = buf || [];
	  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	    if (ii < 16) { // Don't overflow!
	      buf[i + ii++] = _hexToByte[oct];
	    }
	  });

	  // Zero out remaining bytes if string was short
	  while (ii < 16) {
	    buf[i + ii++] = 0;
	  }

	  return buf;
	}

	// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	function unparse(buf, offset) {
	  var i = offset || 0, bth = _byteToHex;
	  return  bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}

	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html

	// random #'s we need to init node and clockseq
	var _seedBytes = _rng();

	// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	var _nodeId = [
	  _seedBytes[0] | 0x01,
	  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	];

	// Per 4.2.2, randomize (14 bit) clockseq
	var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

	// Previous uuid creation time
	var _lastMSecs = 0, _lastNSecs = 0;

	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];

	  options = options || {};

	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }

	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }

	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;

	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;

	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;

	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;

	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;

	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;

	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;

	  // `node`
	  var node = options.node || _nodeId;
	  for (var n = 0; n < 6; n++) {
	    b[i + n] = node[n];
	  }

	  return buf ? buf : unparse(b);
	}

	// **`v4()` - Generate random UUID**

	// See https://github.com/broofa/node-uuid for API details
	function v4(options, buf, offset) {
	  // Deprecated - 'format' argument, as supported in v1.2
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || _rng)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ii++) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || unparse(rnds);
	}

	// Export public API
	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;
	uuid.parse = parse;
	uuid.unparse = unparse;

	module.exports = uuid;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	var rng;

	var crypto = global.crypto || global.msCrypto; // for IE 11
	if (crypto && crypto.getRandomValues) {
	  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
	  // Moderately fast, high quality
	  var _rnds8 = new Uint8Array(16);
	  rng = function whatwgRNG() {
	    crypto.getRandomValues(_rnds8);
	    return _rnds8;
	  };
	}

	if (!rng) {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var  _rnds = new Array(16);
	  rng = function() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return _rnds;
	  };
	}

	module.exports = rng;


	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict'

	module.exports = {
	    REST: 'ipc-rest',
	    EVENT: 'ipc-event',
	    CONNECT: 'ipc-connect',
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict'

	module.exports = ['get', 'post', 'put', 'delete']


/***/ },
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const pathToRegexp = __webpack_require__(13)

	const utils = module.exports = {}

	utils.pathMatch = function pathMatch(path, options)
	{
	    options = options || {}

	    return (url, params) =>
	    {
	        let keys = []
	        params = params || {}

	        let regexp = pathToRegexp(path, keys, options)

	        let result = regexp.exec(url)

	        if(result === null) return false

	        let match = result.shift()

	        keys.forEach((key, i) =>
	        {
	            params[key.name] = result[i]
	        })

	        return { match, params }
	    }
	}

	utils.exposePromise = function exposePromise()
	{
	    let __resolver,
	        __rejector,
	        __promise = new Promise((resolve, reject) =>
	        {
	            __resolver = resolve
	            __rejector = reject
	        })

	    __promise.resolve = __resolver
	    __promise.reject = __rejector

	    return __promise
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var isarray = __webpack_require__(14)

	/**
	 * Expose `pathToRegexp`.
	 */
	module.exports = pathToRegexp
	module.exports.parse = parse
	module.exports.compile = compile
	module.exports.tokensToFunction = tokensToFunction
	module.exports.tokensToRegExp = tokensToRegExp

	/**
	 * The main path matching regexp utility.
	 *
	 * @type {RegExp}
	 */
	var PATH_REGEXP = new RegExp([
	  // Match escaped characters that would otherwise appear in future matches.
	  // This allows the user to escape special characters that won't transform.
	  '(\\\\.)',
	  // Match Express-style parameters and un-named parameters with a prefix
	  // and optional suffixes. Matches appear as:
	  //
	  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
	  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
	  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
	  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
	].join('|'), 'g')

	/**
	 * Parse a string for the raw tokens.
	 *
	 * @param  {string}  str
	 * @param  {Object=} options
	 * @return {!Array}
	 */
	function parse (str, options) {
	  var tokens = []
	  var key = 0
	  var index = 0
	  var path = ''
	  var defaultDelimiter = options && options.delimiter || '/'
	  var res

	  while ((res = PATH_REGEXP.exec(str)) != null) {
	    var m = res[0]
	    var escaped = res[1]
	    var offset = res.index
	    path += str.slice(index, offset)
	    index = offset + m.length

	    // Ignore already escaped sequences.
	    if (escaped) {
	      path += escaped[1]
	      continue
	    }

	    var next = str[index]
	    var prefix = res[2]
	    var name = res[3]
	    var capture = res[4]
	    var group = res[5]
	    var modifier = res[6]
	    var asterisk = res[7]

	    // Push the current path onto the tokens.
	    if (path) {
	      tokens.push(path)
	      path = ''
	    }

	    var partial = prefix != null && next != null && next !== prefix
	    var repeat = modifier === '+' || modifier === '*'
	    var optional = modifier === '?' || modifier === '*'
	    var delimiter = res[2] || defaultDelimiter
	    var pattern = capture || group

	    tokens.push({
	      name: name || key++,
	      prefix: prefix || '',
	      delimiter: delimiter,
	      optional: optional,
	      repeat: repeat,
	      partial: partial,
	      asterisk: !!asterisk,
	      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
	    })
	  }

	  // Match any characters still remaining.
	  if (index < str.length) {
	    path += str.substr(index)
	  }

	  // If the path exists, push it onto the end.
	  if (path) {
	    tokens.push(path)
	  }

	  return tokens
	}

	/**
	 * Compile a string to a template function for the path.
	 *
	 * @param  {string}             str
	 * @param  {Object=}            options
	 * @return {!function(Object=, Object=)}
	 */
	function compile (str, options) {
	  return tokensToFunction(parse(str, options))
	}

	/**
	 * Prettier encoding of URI path segments.
	 *
	 * @param  {string}
	 * @return {string}
	 */
	function encodeURIComponentPretty (str) {
	  return encodeURI(str).replace(/[\/?#]/g, function (c) {
	    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
	  })
	}

	/**
	 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
	 *
	 * @param  {string}
	 * @return {string}
	 */
	function encodeAsterisk (str) {
	  return encodeURI(str).replace(/[?#]/g, function (c) {
	    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
	  })
	}

	/**
	 * Expose a method for transforming tokens into the path function.
	 */
	function tokensToFunction (tokens) {
	  // Compile all the tokens into regexps.
	  var matches = new Array(tokens.length)

	  // Compile all the patterns before compilation.
	  for (var i = 0; i < tokens.length; i++) {
	    if (typeof tokens[i] === 'object') {
	      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
	    }
	  }

	  return function (obj, opts) {
	    var path = ''
	    var data = obj || {}
	    var options = opts || {}
	    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

	    for (var i = 0; i < tokens.length; i++) {
	      var token = tokens[i]

	      if (typeof token === 'string') {
	        path += token

	        continue
	      }

	      var value = data[token.name]
	      var segment

	      if (value == null) {
	        if (token.optional) {
	          // Prepend partial segment prefixes.
	          if (token.partial) {
	            path += token.prefix
	          }

	          continue
	        } else {
	          throw new TypeError('Expected "' + token.name + '" to be defined')
	        }
	      }

	      if (isarray(value)) {
	        if (!token.repeat) {
	          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
	        }

	        if (value.length === 0) {
	          if (token.optional) {
	            continue
	          } else {
	            throw new TypeError('Expected "' + token.name + '" to not be empty')
	          }
	        }

	        for (var j = 0; j < value.length; j++) {
	          segment = encode(value[j])

	          if (!matches[i].test(segment)) {
	            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
	          }

	          path += (j === 0 ? token.prefix : token.delimiter) + segment
	        }

	        continue
	      }

	      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

	      if (!matches[i].test(segment)) {
	        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
	      }

	      path += token.prefix + segment
	    }

	    return path
	  }
	}

	/**
	 * Escape a regular expression string.
	 *
	 * @param  {string} str
	 * @return {string}
	 */
	function escapeString (str) {
	  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
	}

	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {string} group
	 * @return {string}
	 */
	function escapeGroup (group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1')
	}

	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {!RegExp} re
	 * @param  {Array}   keys
	 * @return {!RegExp}
	 */
	function attachKeys (re, keys) {
	  re.keys = keys
	  return re
	}

	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {string}
	 */
	function flags (options) {
	  return options.sensitive ? '' : 'i'
	}

	/**
	 * Pull out keys from a regexp.
	 *
	 * @param  {!RegExp} path
	 * @param  {!Array}  keys
	 * @return {!RegExp}
	 */
	function regexpToRegexp (path, keys) {
	  // Use a negative lookahead to match only capturing groups.
	  var groups = path.source.match(/\((?!\?)/g)

	  if (groups) {
	    for (var i = 0; i < groups.length; i++) {
	      keys.push({
	        name: i,
	        prefix: null,
	        delimiter: null,
	        optional: false,
	        repeat: false,
	        partial: false,
	        asterisk: false,
	        pattern: null
	      })
	    }
	  }

	  return attachKeys(path, keys)
	}

	/**
	 * Transform an array into a regexp.
	 *
	 * @param  {!Array}  path
	 * @param  {Array}   keys
	 * @param  {!Object} options
	 * @return {!RegExp}
	 */
	function arrayToRegexp (path, keys, options) {
	  var parts = []

	  for (var i = 0; i < path.length; i++) {
	    parts.push(pathToRegexp(path[i], keys, options).source)
	  }

	  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

	  return attachKeys(regexp, keys)
	}

	/**
	 * Create a path regexp from string input.
	 *
	 * @param  {string}  path
	 * @param  {!Array}  keys
	 * @param  {!Object} options
	 * @return {!RegExp}
	 */
	function stringToRegexp (path, keys, options) {
	  return tokensToRegExp(parse(path, options), keys, options)
	}

	/**
	 * Expose a function for taking tokens and returning a RegExp.
	 *
	 * @param  {!Array}          tokens
	 * @param  {(Array|Object)=} keys
	 * @param  {Object=}         options
	 * @return {!RegExp}
	 */
	function tokensToRegExp (tokens, keys, options) {
	  if (!isarray(keys)) {
	    options = /** @type {!Object} */ (keys || options)
	    keys = []
	  }

	  options = options || {}

	  var strict = options.strict
	  var end = options.end !== false
	  var route = ''
	  var lastToken = tokens[tokens.length - 1]
	  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

	  // Iterate over the tokens and create our regexp string.
	  for (var i = 0; i < tokens.length; i++) {
	    var token = tokens[i]

	    if (typeof token === 'string') {
	      route += escapeString(token)
	    } else {
	      var prefix = escapeString(token.prefix)
	      var capture = '(?:' + token.pattern + ')'

	      keys.push(token)

	      if (token.repeat) {
	        capture += '(?:' + prefix + capture + ')*'
	      }

	      if (token.optional) {
	        if (!token.partial) {
	          capture = '(?:' + prefix + '(' + capture + '))?'
	        } else {
	          capture = prefix + '(' + capture + ')?'
	        }
	      } else {
	        capture = prefix + '(' + capture + ')'
	      }

	      route += capture
	    }
	  }

	  // In non-strict mode we allow a slash at the end of match. If the path to
	  // match already ends with a slash, we remove it for consistency. The slash
	  // is valid at the end of a path match, not in the middle. This is important
	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
	  if (!strict) {
	    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
	  }

	  if (end) {
	    route += '$'
	  } else {
	    // In non-ending mode, we need the capturing groups to match as much as
	    // possible by using a positive lookahead to the end or next path segment.
	    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
	  }

	  return attachKeys(new RegExp('^' + route, flags(options)), keys)
	}

	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array can be passed in for the keys, which will hold the
	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
	 *
	 * @param  {(string|RegExp|Array)} path
	 * @param  {(Array|Object)=}       keys
	 * @param  {Object=}               options
	 * @return {!RegExp}
	 */
	function pathToRegexp (path, keys, options) {
	  if (!isarray(keys)) {
	    options = /** @type {!Object} */ (keys || options)
	    keys = []
	  }

	  options = options || {}

	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, /** @type {!Array} */ (keys))
	  }

	  if (isarray(path)) {
	    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
	  }

	  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
	}


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const context = __webpack_require__(16)
	const Server = __webpack_require__(17)
	const Router = __webpack_require__(19)

	function Transport(ctx)
	{
	    this.receivers = {}
	    this.ctx = ctx

	    this.ctx.onmessage = event =>
	    {
	        let message = event.data

	        if (!Array.isArray(message))
	        {
	            console.error(`message from client is not array`, message)
	            return
	        }

	        let channel = message.shift()
	        let request = message[0]

	        if (this.receivers.hasOwnProperty(channel))
	        {
	            event.sender = this
	            this.receivers[channel].callback(event, request)
	        }
	        else
	        {
	            // console.info(`channel "${channel}" has no receiver attached`)
	        }
	    }

	    return this
	}

	Transport.prototype.on = function on(channel, callback)
	{
	    this.receivers[channel] = { channel, callback }
	}

	Transport.prototype.emit = function emit(channel, response)
	{
	    response = JSON.parse(JSON.stringify(response))
	    this.ctx.postMessage([channel, response])
	}

	Transport.prototype.send = function send(channel, response)
	{
	    this.emit(channel, response)
	}

	function createServer()
	{
	    const transport = new Transport(context.get())
	    const server = new Server(transport)

	    return server
	}

	function createRouter(...args)
	{
	    return new Router(...args)
	}

	module.exports = { createServer, createRouter }


/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict'

	let ctx
	let is = ''

	if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
	{
	    ctx = self
	    is = 'worker'
	}
	else
	{
	    ctx = window
	    is = 'window'
	}

	module.exports = {
	    get: () => ctx,
	    is: search => search == is,
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const channels = __webpack_require__(5)
	const methods = __webpack_require__(6)
	const Response = __webpack_require__(18)
	const Router = __webpack_require__(19)

	const supportedOutputHandlers = ['send', 'broadcast']

	// FIXME: should return an instantiated server, not the constructor
	const Server = module.exports = function Server(transport)
	{
	    if (!(this instanceof Server)) return new Server(transport)

	    if (transport === undefined) throw new TypeError(`Server.constructor expects to receive a transport`)

	    this.router = new Router()
	    this.transport = transport

	    supportedOutputHandlers.forEach(outputHandler =>
	    {
	        createMethod.call(this, outputHandler)
	    })

	    this.transport.on(channels.REST, (event, request) =>
	    {
	        let response = new Response()
	        response.ipc = { channel: channels.REST, sender: event.sender }
	        response.id = request.id

	        this.router.handle(request, response)
	    })

	    return this
	}

	methods.concat(['all', 'use']).forEach(method =>
	{
	    Server.prototype[method] = function (...args)
	    {
	        return this.router[method](...args)
	    }
	})

	function createMethod(outputHandler)
	{
	    if (typeof this.transport[outputHandler] == 'function')
	    {
	        this[outputHandler] = function (url, body)
	        {
	            let response = new Response(true)
	            response.ipc = { channel: channels.EVENT }
	            response.url = url
	            response.body = body

	            this.transport[outputHandler](channels.EVENT, response)
	        }
	    }
	}


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const uuid = __webpack_require__(3)

	const Response = module.exports = function Response(autoGenerateId)
	{
	    this.id = autoGenerateId ? uuid.v4() : null
	    this.statusCode
	    this.ipc = { channel: '', sender: null }
	    this.next

	    return this
	}

	Response.prototype.status = function status(code)
	{
	    this.statusCode = code
	    return this
	}

	Response.prototype.send = function send(body)
	{
	    this.body = body
	    this.status = this.statusCode
	    this.ipc.sender.send(this.ipc.channel, this)

	    if (typeof this.next == 'function')
	    {
	        this.next()
	    }
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const methods = __webpack_require__(6)
	const Route = __webpack_require__(20)

	const Router = module.exports = function Router()
	{
	    if (!(this instanceof Router)) return new Router()

	    this.routes = []
	    this.routeIdx

	    return this
	}

	methods.concat('all').forEach(method =>
	{
	    Router.prototype[method] = function (path, ...handlers)
	    {
	        if (typeof path != 'string') throw new TypeError(`Router.${method}() requires a path as the first parameter`)

	        if (handlers.length)
	        {
	            if (!handlers.every(handler => typeof handler == 'function')) throw new TypeError(`Router.${method}() requires middlewares to be of type "function"`)
	        }

	        let route = new Route(method, path)
	        route.addHandlers(handlers)
	        this.routes.push(route)

	        return this
	    }
	})

	Router.prototype.use = function use(...handlers)
	{
	    let path = typeof handlers[0] == 'string' ? handlers.shift() : '/'
	    let route = new Route('all', path, { end: false })
	    route.useHandler = true

	    if (!handlers.length) throw new TypeError(`Router.use() requires middleware functions`)

	    if (!handlers.every(handler => typeof handler == 'function')) throw new TypeError(`Router.use() requires middlewares to be of type "function"`)

	    route.addHandlers(handlers)
	    this.routes.push(route)
	}

	Router.prototype.handle = function handle(req, res, parentNext)
	{
	    let self = this
	    self.routeIdx = 0 // reset index
	    next()

	    function next()
	    {
	        // no matching route found
	        if (self.routeIdx >= self.routes.length) return

	        let route = self.routes[self.routeIdx]
	        let match = route.match(req.method, req.url)

	        self.routeIdx++

	        if (!match) return next()

	        route.handle(req, res, next)
	    }
	}

	// implement the middleware interface
	Router.prototype.middleware = function middleware()
	{
	    let self = this

	    return function routerAsMiddleware(req, res, next)
	    {
	        return self.handle(req, res, next)
	    }
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const utils = __webpack_require__(12)
	const methods = __webpack_require__(6)

	const Route = module.exports = function Route(method, path, regexpOptions = {})
	{
	    this.method = method
	    this.path = path
	    this.params = {}
	    this.baseUrl
	    this.pathMatcher = utils.pathMatch(path, regexpOptions)

	    this.handlers = []
	    this.handlerIdx

	    return this
	}

	Route.prototype.addHandlers = function addHandlers(handlers)
	{
	    this.handlers = this.handlers.concat(handlers)
	}

	Route.prototype.match = function match(method, path)
	{
	    // only accept requests that match the route's method
	    // or any request when this.method is set to all
	    if (this.method != method && this.method != 'all') return false

	    let result = this.pathMatcher(path)

	    if (result === false) return false

	    this.baseUrl = result.match
	    this.params = result.params

	    return true
	}

	Route.prototype.handle = function handle(req, res, routerNext)
	{
	    // TODO: if route has been created with #use() then, remove this.basePath from req.url

	    req.params = this.params
	    req.baseUrl = this.baseUrl

	    req.originalUrl = req.originalUrl || req.url

	    if (this.useHandler)
	    {
	        req.url = req.url.slice(req.baseUrl.length)
	    }

	    this.handlerIdx = 0

	    let self = this
	    next()

	    function next(err)
	    {
	        // console.log(`next being called by`, req, res)
	        if (err == 'route') return routerNext()

	        if (self.handlerIdx >= self.handlers.length) return routerNext()

	        let fn = self.handlers[self.handlerIdx]

	        // if (self.handlerIdx == self.handlers.length - 1)
	        // {
	        //     let fnMethods = Object.keys(fn)
	        //     let fnIsRouter = methods.concat(['all', 'use', 'handle']).every(method => fnMethods.includes(method))
	        //
	        //     if (fnIsRouter)
	        //     {
	        //         routerNext()
	        //     }
	        // }

	        self.handlerIdx++

	        res.next = next

	        fn(req, res, next)
	    }
	}


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	const router = __webpack_require__(15).createRouter()
	const pages = __webpack_require__(22)

	router.use('/pages', pages.middleware())

	router.get('/:id([\\d]+)', (req, res) =>
	{
	    // console.log(`get:/books/:id`)
	    res.status(200).send([`book with id ${req.params.id}`])
	})

	// router.send('pages', 'new page')

	module.exports = router


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	const router = __webpack_require__(15).createRouter()

	router.get('/:id([\\d]+)', (req, res) =>
	{
	    console.log(`req.online`, req.online)
	    // console.log(`get:/books/pages`)
	    res.status(200).send([`page with id ${req.params.id}`])
	})

	module.exports = router


/***/ }
/******/ ]);