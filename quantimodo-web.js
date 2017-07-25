(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.QuantiModoApi = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],3:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (value instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (isArrayBufferView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (isArrayBufferView(string) || string instanceof ArrayBuffer) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView (obj) {
  return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj)
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":2,"ieee754":4}],4:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],5:[function(require,module,exports){
(function (Buffer){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['superagent'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('superagent'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.ApiClient = factory(root.superagent);
  }
}(this, function(superagent) {
  'use strict';

  /**
   * @module ApiClient
   * @version 5.8.5
   */

  /**
   * Manages low level client-server communications, parameter marshalling, etc. There should not be any need for an
   * application to use this class directly - the *Api and model classes provide the public API for the service. The
   * contents of this file should be regarded as internal but are documented for completeness.
   * @alias module:ApiClient
   * @class
   */
  var exports = function() {
    /**
     * The base URL against which to resolve every API call's (relative) path.
     * @type {String}
     * @default https://app.quantimo.do/api
     */
    this.basePath = 'https://app.quantimo.do/api'.replace(/\/+$/, '');

    /**
     * The authentication methods to be included for all API calls.
     * @type {Array.<String>}
     */
    this.authentications = {
      'access_token': {type: 'apiKey', 'in': 'query', name: 'access_token'},
      'quantimodo_oauth2': {type: 'oauth2'}
    };
    /**
     * The default HTTP headers to be included for all API calls.
     * @type {Array.<String>}
     * @default {}
     */
    this.defaultHeaders = {};

    /**
     * The default HTTP timeout for all API calls.
     * @type {Number}
     * @default 60000
     */
    this.timeout = 60000;
  };

  /**
   * Returns a string representation for an actual parameter.
   * @param param The actual parameter.
   * @returns {String} The string representation of <code>param</code>.
   */
  exports.prototype.paramToString = function(param) {
    if (param == undefined || param == null) {
      return '';
    }
    if (param instanceof Date) {
      return param.toJSON();
    }
    return param.toString();
  };

  /**
   * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
   * NOTE: query parameters are not handled here.
   * @param {String} path The path to append to the base URL.
   * @param {Object} pathParams The parameter values to append.
   * @returns {String} The encoded path with parameter values substituted.
   */
  exports.prototype.buildUrl = function(path, pathParams) {
    if (!path.match(/^\//)) {
      path = '/' + path;
    }
    var url = this.basePath + path;
    var _this = this;
    url = url.replace(/\{([\w-]+)\}/g, function(fullMatch, key) {
      var value;
      if (pathParams.hasOwnProperty(key)) {
        value = _this.paramToString(pathParams[key]);
      } else {
        value = fullMatch;
      }
      return encodeURIComponent(value);
    });
    return url;
  };

  /**
   * Checks whether the given content type represents JSON.<br>
   * JSON content type examples:<br>
   * <ul>
   * <li>application/json</li>
   * <li>application/json; charset=UTF8</li>
   * <li>APPLICATION/JSON</li>
   * </ul>
   * @param {String} contentType The MIME content type to check.
   * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
   */
  exports.prototype.isJsonMime = function(contentType) {
    return Boolean(contentType != null && contentType.match(/^application\/json(;.*)?$/i));
  };

  /**
   * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
   * @param {Array.<String>} contentTypes
   * @returns {String} The chosen content type, preferring JSON.
   */
  exports.prototype.jsonPreferredMime = function(contentTypes) {
    for (var i = 0; i < contentTypes.length; i++) {
      if (this.isJsonMime(contentTypes[i])) {
        return contentTypes[i];
      }
    }
    return contentTypes[0];
  };

  /**
   * Checks whether the given parameter value represents file-like content.
   * @param param The parameter to check.
   * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
   */
  exports.prototype.isFileParam = function(param) {
    // fs.ReadStream in Node.js (but not in runtime like browserify)
    if (typeof window === 'undefined' &&
        typeof require === 'function' &&
        require('fs') &&
        param instanceof require('fs').ReadStream) {
      return true;
    }
    // Buffer in Node.js
    if (typeof Buffer === 'function' && param instanceof Buffer) {
      return true;
    }
    // Blob in browser
    if (typeof Blob === 'function' && param instanceof Blob) {
      return true;
    }
    // File in browser (it seems File object is also instance of Blob, but keep this for safe)
    if (typeof File === 'function' && param instanceof File) {
      return true;
    }
    return false;
  };

  /**
   * Normalizes parameter values:
   * <ul>
   * <li>remove nils</li>
   * <li>keep files and arrays</li>
   * <li>format to string with `paramToString` for other cases</li>
   * </ul>
   * @param {Object.<String, Object>} params The parameters as object properties.
   * @returns {Object.<String, Object>} normalized parameters.
   */
  exports.prototype.normalizeParams = function(params) {
    var newParams = {};
    for (var key in params) {
      if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
        var value = params[key];
        if (this.isFileParam(value) || Array.isArray(value)) {
          newParams[key] = value;
        } else {
          newParams[key] = this.paramToString(value);
        }
      }
    }
    return newParams;
  };

  /**
   * Enumeration of collection format separator strategies.
   * @enum {String}
   * @readonly
   */
  exports.CollectionFormatEnum = {
    /**
     * Comma-separated values. Value: <code>csv</code>
     * @const
     */
    CSV: ',',
    /**
     * Space-separated values. Value: <code>ssv</code>
     * @const
     */
    SSV: ' ',
    /**
     * Tab-separated values. Value: <code>tsv</code>
     * @const
     */
    TSV: '\t',
    /**
     * Pipe(|)-separated values. Value: <code>pipes</code>
     * @const
     */
    PIPES: '|',
    /**
     * Native array. Value: <code>multi</code>
     * @const
     */
    MULTI: 'multi'
  };

  /**
   * Builds a string representation of an array-type actual parameter, according to the given collection format.
   * @param {Array} param An array parameter.
   * @param {module:ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
   * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
   * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
   */
  exports.prototype.buildCollectionParam = function buildCollectionParam(param, collectionFormat) {
    if (param == null) {
      return null;
    }
    switch (collectionFormat) {
      case 'csv':
        return param.map(this.paramToString).join(',');
      case 'ssv':
        return param.map(this.paramToString).join(' ');
      case 'tsv':
        return param.map(this.paramToString).join('\t');
      case 'pipes':
        return param.map(this.paramToString).join('|');
      case 'multi':
        // return the array directly as SuperAgent will handle it as expected
        return param.map(this.paramToString);
      default:
        throw new Error('Unknown collection format: ' + collectionFormat);
    }
  };

  /**
   * Applies authentication headers to the request.
   * @param {Object} request The request object created by a <code>superagent()</code> call.
   * @param {Array.<String>} authNames An array of authentication method names.
   */
  exports.prototype.applyAuthToRequest = function(request, authNames) {
    var _this = this;
    authNames.forEach(function(authName) {
      var auth = _this.authentications[authName];
      switch (auth.type) {
        case 'basic':
          if (auth.username || auth.password) {
            request.auth(auth.username || '', auth.password || '');
          }
          break;
        case 'apiKey':
          if (auth.apiKey) {
            var data = {};
            if (auth.apiKeyPrefix) {
              data[auth.name] = auth.apiKeyPrefix + ' ' + auth.apiKey;
            } else {
              data[auth.name] = auth.apiKey;
            }
            if (auth['in'] === 'header') {
              request.set(data);
            } else {
              request.query(data);
            }
          }
          break;
        case 'oauth2':
          if (auth.accessToken) {
            request.set({'Authorization': 'Bearer ' + auth.accessToken});
          }
          break;
        default:
          throw new Error('Unknown authentication type: ' + auth.type);
      }
    });
  };

  /**
   * Deserializes an HTTP response body into a value of the specified type.
   * @param {Object} response A SuperAgent response object.
   * @param {(String|Array.<String>|Object.<String, Object>|Function)} returnType The type to return. Pass a string for simple types
   * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
   * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
   * all properties on <code>data<code> will be converted to this type.
   * @returns A value of the specified type.
   */
  exports.prototype.deserialize = function deserialize(response, returnType) {
    if (response == null || returnType == null) {
      return null;
    }
    // Rely on SuperAgent for parsing response body.
    // See http://visionmedia.github.io/superagent/#parsing-response-bodies
    var data = response.body;
    if (data == null) {
      // SuperAgent does not always produce a body; use the unparsed response as a fallback
      data = response.text;
    }
    return exports.convertToType(data, returnType);
  };

  /**
   * Callback function to receive the result of the operation.
   * @callback module:ApiClient~callApiCallback
   * @param {String} error Error message, if any.
   * @param data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Invokes the REST service using the supplied settings and parameters.
   * @param {String} path The base URL to invoke.
   * @param {String} httpMethod The HTTP method to use.
   * @param {Object.<String, String>} pathParams A map of path parameters and their values.
   * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
   * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
   * @param {Object.<String, Object>} formParams A map of form parameters and their values.
   * @param {Object} bodyParam The value to pass as the request body.
   * @param {Array.<String>} authNames An array of authentication type names.
   * @param {Array.<String>} contentTypes An array of request MIME types.
   * @param {Array.<String>} accepts An array of acceptable response MIME types.
   * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the
   * constructor for a complex type.
   * @param {module:ApiClient~callApiCallback} callback The callback function.
   * @returns {Object} The SuperAgent request object.
   */
  exports.prototype.callApi = function callApi(path, httpMethod, pathParams,
      queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts,
      returnType, callback) {

    var _this = this;
    var url = this.buildUrl(path, pathParams);
    var request = superagent(httpMethod, url);

    // apply authentications
    this.applyAuthToRequest(request, authNames);

    // set query parameters
    request.query(this.normalizeParams(queryParams));

    // set header parameters
    request.set(this.defaultHeaders).set(this.normalizeParams(headerParams));

    // set request timeout
    request.timeout(this.timeout);

    var contentType = this.jsonPreferredMime(contentTypes);
    if (contentType) {
      // Issue with superagent and multipart/form-data (https://github.com/visionmedia/superagent/issues/746)
      if(contentType != 'multipart/form-data') {
        request.type(contentType);
      }
    } else if (!request.header['Content-Type']) {
      request.type('application/json');
    }

    if (contentType === 'application/x-www-form-urlencoded') {
      request.send(this.normalizeParams(formParams));
    } else if (contentType == 'multipart/form-data') {
      var _formParams = this.normalizeParams(formParams);
      for (var key in _formParams) {
        if (_formParams.hasOwnProperty(key)) {
          if (this.isFileParam(_formParams[key])) {
            // file field
            request.attach(key, _formParams[key]);
          } else {
            request.field(key, _formParams[key]);
          }
        }
      }
    } else if (bodyParam) {
      request.send(bodyParam);
    }

    var accept = this.jsonPreferredMime(accepts);
    if (accept) {
      request.accept(accept);
    }


    request.end(function(error, response) {
      if (callback) {
        var data = null;
        if (!error) {
          data = _this.deserialize(response, returnType);
        }
        callback(error, data, response);
      }
    });

    return request;
  };

  /**
   * Parses an ISO-8601 string representation of a date value.
   * @param {String} str The date value as a string.
   * @returns {Date} The parsed date object.
   */
  exports.parseDate = function(str) {
    return new Date(str.replace(/T/i, ' '));
  };

  /**
   * Converts a value to the specified type.
   * @param {(String|Object)} data The data to convert, as a string or object.
   * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
   * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
   * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
   * all properties on <code>data<code> will be converted to this type.
   * @returns An instance of the specified type.
   */
  exports.convertToType = function(data, type) {
    switch (type) {
      case 'Boolean':
        return Boolean(data);
      case 'Integer':
        return parseInt(data, 10);
      case 'Number':
        return parseFloat(data);
      case 'String':
        return String(data);
      case 'Date':
        return this.parseDate(String(data));
      default:
        if (type === Object) {
          // generic object, return directly
          return data;
        } else if (typeof type === 'function') {
          // for model type like: User
          return type.constructFromObject(data);
        } else if (Array.isArray(type)) {
          // for array type like: ['String']
          var itemType = type[0];
          return data.map(function(item) {
            return exports.convertToType(item, itemType);
          });
        } else if (typeof type === 'object') {
          // for plain object type like: {'String': 'Integer'}
          var keyType, valueType;
          for (var k in type) {
            if (type.hasOwnProperty(k)) {
              keyType = k;
              valueType = type[k];
              break;
            }
          }
          var result = {};
          for (var k in data) {
            if (data.hasOwnProperty(k)) {
              var key = exports.convertToType(k, keyType);
              var value = exports.convertToType(data[k], valueType);
              result[key] = value;
            }
          }
          return result;
        } else {
          // for unknown type, return the data directly
          return data;
        }
    }
  };

  /**
   * Constructs a new map or array model from REST data.
   * @param data {Object|Array} The REST data.
   * @param obj {Object|Array} The target object or array.
   */
  exports.constructFromObject = function(data, obj, itemType) {
    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        if (data.hasOwnProperty(i))
          obj[i] = exports.convertToType(data[i], itemType);
      }
    } else {
      for (var k in data) {
        if (data.hasOwnProperty(k))
          obj[k] = exports.convertToType(data[k], itemType);
      }
    }
  };

  /**
   * The default API client implementation.
   * @type {module:ApiClient}
   */
  exports.instance = new exports();

  return exports;
}));

}).call(this,require("buffer").Buffer)
},{"buffer":3,"fs":1,"superagent":70}],6:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.AuthenticationApi = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';

  /**
   * Authentication service.
   * @module api/AuthenticationApi
   * @version 5.8.5
   */

  /**
   * Constructs a new AuthenticationApi. 
   * @alias module:api/AuthenticationApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v2AuthSocialAuthorizeCodeGet operation.
     * @callback module:api/AuthenticationApi~v2AuthSocialAuthorizeCodeGetCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Second Step in Social Authentication flow with JWT Token
     *  Here is the flow for how social authentication works with a JWT Token 1.**Client:** The client needs to open popup with social auth url (&#x60;https://app/quantimo.do/api/v2/auth/social/login?provider&#x3D;{provider}&amp;redirectUrl&#x3D;{url}&#x60;) of server with &#x60;provider&#x60; and &#x60;redirectUrl&#x60;. (Url should be registered with our social apps. Facebook is fine with any redirect url with the same domain base url but Google needs exact redirect url.) 2.**Server:** The QM server will redirect user to that provider to get access. 3.**Client:** After successful or failed authentication, it will be redirected to given &#x60;redirectUrl&#x60; with code or error. 4.**Client:** The client needs to get that code and needs to send an Ajax request to server at &#x60;https://app.quantimo.do/api/v2/auth/social/authorizeCode?provider&#x3D;{provider}&amp;code&#x3D;{authorizationCode}&#x60; 5.**Server:** The QM server will authorize that code from the social connection and will authenticate user and will retrieve user info. 6.**Server:** The QM server will try to find existing user by unique identity. If the user already exists then it will login. Otherwise, it will create new user and will then login. 7.**Server:** Once user is found/created, it will return a JWT token for that user in the response.
     * @param {String} code Authorization code obtained from the provider.
     * @param {String} provider The current options are &#x60;google&#x60; and &#x60;facebook&#x60;.
     * @param {module:api/AuthenticationApi~v2AuthSocialAuthorizeCodeGetCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v2AuthSocialAuthorizeCodeGet = function(code, provider, callback) {
      var postBody = null;

      // verify the required parameter 'code' is set
      if (code == undefined || code == null) {
        throw new Error("Missing the required parameter 'code' when calling v2AuthSocialAuthorizeCodeGet");
      }

      // verify the required parameter 'provider' is set
      if (provider == undefined || provider == null) {
        throw new Error("Missing the required parameter 'provider' when calling v2AuthSocialAuthorizeCodeGet");
      }


      var pathParams = {
      };
      var queryParams = {
        'code': code,
        'provider': provider
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v2/auth/social/authorizeCode', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v2AuthSocialAuthorizeTokenGet operation.
     * @callback module:api/AuthenticationApi~v2AuthSocialAuthorizeTokenGetCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Native Social Authentication
     * If you are using native authentication via Facebook or Google SDKs then you should use the following flow. 1.**Client:** Using native authentication via your native mobile app, get an access token using the instructions provided by the Facebook SDK (https://developers.facebook.com/docs/facebook-login) or Google (https://developers.google.com/identity/protocols/OAuth2) 2.**Client:** Send an Ajax request with provider name and access token on &#x60;https://app.quantimo.do/api/v2/auth/social/authorizeToken?provider&#x3D;{provider}&amp;accessToken&#x3D;{accessToken}&amp;refreshToken&#x3D;{refreshToken}&#x60; (&#x60;refreshToken&#x60; is optional) 3.**Server:** Server will try to get user info and will find existing user by unique identity. If user exist then it will do a login for that or it will create new user and will do login 4.**Server:** Once user is found/created, it will return a JWT token for that user in response 5.**Client:** After getting the JWT token to get a QM access token follow these steps and include your JWT token in them as a header (Authorization: Bearer **{yourJWThere}**) or as a url parameter (https://app.quantimo.do/api/v2/oauth/authorize?token&#x3D;{yourJWThere}).
     * @param {String} accessToken User&#39;s OAuth2 access token obtained from Google or FB native SDK
     * @param {String} provider The current options are &#x60;google&#x60; and &#x60;facebook&#x60;.
     * @param {Object} opts Optional parameters
     * @param {String} opts.refreshToken Optional refresh token obtained from Google or FB native SDK
     * @param {module:api/AuthenticationApi~v2AuthSocialAuthorizeTokenGetCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v2AuthSocialAuthorizeTokenGet = function(accessToken, provider, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'accessToken' is set
      if (accessToken == undefined || accessToken == null) {
        throw new Error("Missing the required parameter 'accessToken' when calling v2AuthSocialAuthorizeTokenGet");
      }

      // verify the required parameter 'provider' is set
      if (provider == undefined || provider == null) {
        throw new Error("Missing the required parameter 'provider' when calling v2AuthSocialAuthorizeTokenGet");
      }


      var pathParams = {
      };
      var queryParams = {
        'refreshToken': opts['refreshToken'],
        'accessToken': accessToken,
        'provider': provider
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v2/auth/social/authorizeToken', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v2AuthSocialLoginGet operation.
     * @callback module:api/AuthenticationApi~v2AuthSocialLoginGetCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * First Setp in Social Authentication flow with JWT Token
     *  Here is the flow for how social authentication works with a JWT Token 1.**Client:** The client needs to open popup with social auth url (&#x60;https://app/quantimo.do/api/v2/auth/social/login?provider&#x3D;{provider}&amp;redirectUrl&#x3D;{url}&#x60;) of server with &#x60;provider&#x60; and &#x60;redirectUrl&#x60;. (Url should be registered with our social apps. Facebook and Twitter are fine with any redirect url with the same domain base url but Google needs exact redirect url.) 2.**Server:** The QM server will redirect user to that provider to get access. 3.**Client:** After successful or failed authentication, it will be redirected to given &#x60;redirectUrl&#x60; with code or error. 4.**Client:** The client needs to get that code and needs to send an Ajax request to server at &#x60;https://app.quantimo.do/api/v2/auth/social/authorizeCode?provider&#x3D;{provider}&amp;code&#x3D;{authorizationCode}&#x60; 5.**Server:** The QM server will authorize that code from the social connection and will authenticate user and will retrieve user info. 6.**Server:** The QM server will try to find existing user by unique identity. If the user already exists then it will login. Otherwise, it will create new user and will then login. 7.**Server:** Once user is found/created, it will return a JWT token for that user in the response.
     * @param {String} redirectUrl The redirect URI is the URL within your client application that will receive the OAuth2 credentials. Url should be registered with our social apps. Facebook and Twitter are fine with any redirect url with the same domain base url but Google needs exact redirect url.
     * @param {String} provider The current options are &#x60;google&#x60; and &#x60;facebook&#x60;.
     * @param {module:api/AuthenticationApi~v2AuthSocialLoginGetCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v2AuthSocialLoginGet = function(redirectUrl, provider, callback) {
      var postBody = null;

      // verify the required parameter 'redirectUrl' is set
      if (redirectUrl == undefined || redirectUrl == null) {
        throw new Error("Missing the required parameter 'redirectUrl' when calling v2AuthSocialLoginGet");
      }

      // verify the required parameter 'provider' is set
      if (provider == undefined || provider == null) {
        throw new Error("Missing the required parameter 'provider' when calling v2AuthSocialLoginGet");
      }


      var pathParams = {
      };
      var queryParams = {
        'redirectUrl': redirectUrl,
        'provider': provider
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v2/auth/social/login', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v2Oauth2AccessTokenGet operation.
     * @callback module:api/AuthenticationApi~v2Oauth2AccessTokenGetCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a user access token
     * Client provides authorization token obtained from /api/v1/oauth2/authorize to this endpoint and receives an access token. Access token can then be used to query different API endpoints of QuantiModo. ### Request Access Token After user approves your access to the given scope form the https:/app.quantimo.do/v2/oauth2/authorize endpoint, you&#39;ll receive an authorization code to request an access token. This time make a &#x60;POST&#x60; request to &#x60;/api/v2/oauth/access_token&#x60; with parameters including: * &#x60;grant_type&#x60; Can be &#x60;authorization_code&#x60; or &#x60;refresh_token&#x60; since we are getting the &#x60;access_token&#x60; for the first time we don&#39;t have a &#x60;refresh_token&#x60; so this must be &#x60;authorization_code&#x60;. * &#x60;code&#x60; Authorization code you received with the previous request. * &#x60;redirect_uri&#x60; Your application&#39;s redirect url. ### Refreshing Access Token Access tokens expire at some point, to continue using our api you need to refresh them with &#x60;refresh_token&#x60; you received along with the &#x60;access_token&#x60;. To do this make a &#x60;POST&#x60; request to &#x60;/api/v2/oauth/access_token&#x60; with correct parameters, which are: * &#x60;grant_type&#x60; This time grant type must be &#x60;refresh_token&#x60; since we have it. * &#x60;clientId&#x60; Your application&#39;s client id. * &#x60;client_secret&#x60; Your application&#39;s client secret. * &#x60;refresh_token&#x60; The refresh token you received with the &#x60;access_token&#x60;. Every request you make to this endpoint will give you a new refresh token and make the old one expired. So you can keep getting new access tokens with new refresh tokens. ### Using Access Token Currently we support 2 ways for this, you can&#39;t use both at the same time. * Adding access token to the request header as &#x60;Authorization: Bearer {access_token}&#x60; * Adding to the url as a query parameter &#x60;?access_token&#x3D;{access_token}&#x60; You can read more about OAuth2 from [here](http://oauth.net/2/)
     * @param {String} clientId This is the unique ID that QuantiModo uses to identify your application. Obtain a client id by emailing info@quantimo.do.
     * @param {String} clientSecret This is the secret for your obtained clientId. QuantiModo uses this to validate that only your application uses the clientId.
     * @param {String} grantType Grant Type can be &#39;authorization_code&#39; or &#39;refresh_token&#39;
     * @param {String} code Authorization code you received with the previous request.
     * @param {Object} opts Optional parameters
     * @param {String} opts.responseType If the value is code, launches a Basic flow, requiring a POST to the token endpoint to obtain the tokens. If the value is token id_token or id_token token, launches an Implicit flow, requiring the use of Javascript at the redirect URI to retrieve tokens from the URI #fragment.
     * @param {String} opts.scope Scopes include basic, readmeasurements, and writemeasurements. The \&quot;basic\&quot; scope allows you to read user info (displayname, email, etc). The \&quot;readmeasurements\&quot; scope allows one to read a user&#39;s data. The \&quot;writemeasurements\&quot; scope allows you to write user data. Separate multiple scopes by a space.
     * @param {String} opts.redirectUri The redirect URI is the URL within your client application that will receive the OAuth2 credentials.
     * @param {String} opts.state An opaque string that is round-tripped in the protocol; that is to say, it is returned as a URI parameter in the Basic flow, and in the URI
     * @param {module:api/AuthenticationApi~v2Oauth2AccessTokenGetCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v2Oauth2AccessTokenGet = function(clientId, clientSecret, grantType, code, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'clientId' is set
      if (clientId == undefined || clientId == null) {
        throw new Error("Missing the required parameter 'clientId' when calling v2Oauth2AccessTokenGet");
      }

      // verify the required parameter 'clientSecret' is set
      if (clientSecret == undefined || clientSecret == null) {
        throw new Error("Missing the required parameter 'clientSecret' when calling v2Oauth2AccessTokenGet");
      }

      // verify the required parameter 'grantType' is set
      if (grantType == undefined || grantType == null) {
        throw new Error("Missing the required parameter 'grantType' when calling v2Oauth2AccessTokenGet");
      }

      // verify the required parameter 'code' is set
      if (code == undefined || code == null) {
        throw new Error("Missing the required parameter 'code' when calling v2Oauth2AccessTokenGet");
      }


      var pathParams = {
      };
      var queryParams = {
        'clientId': clientId,
        'client_secret': clientSecret,
        'grant_type': grantType,
        'code': code,
        'response_type': opts['responseType'],
        'scope': opts['scope'],
        'redirect_uri': opts['redirectUri'],
        'state': opts['state']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v2/oauth2/access_token', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v2OauthAuthorizeGet operation.
     * @callback module:api/AuthenticationApi~v2OauthAuthorizeGetCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Request Authorization Code
     * You can implement OAuth2 authentication to your application using our **OAuth2** endpoints.  You need to redirect users to &#x60;/api/v2/oauth/authorize&#x60; endpoint to get an authorization code and include the parameters below.   This page will ask the user if they want to allow a client&#39;s application to submit or obtain data from their QM account. It will redirect the user to the url provided by the client application with the code as a query parameter or error in case of an error. See the /api/v2/oauth/access_token endpoint for the next steps.
     * @param {String} clientId This is the unique ID that QuantiModo uses to identify your application. Obtain a client id by creating a free application at [https://app.quantimo.do/api/v2/apps](https://app.quantimo.do/api/v2/apps).
     * @param {String} clientSecret This is the secret for your obtained clientId. QuantiModo uses this to validate that only your application uses the clientId.  Obtain this by creating a free application at [https://app.quantimo.do/api/v2/apps](https://app.quantimo.do/api/v2/apps).
     * @param {String} responseType If the value is code, launches a Basic flow, requiring a POST to the token endpoint to obtain the tokens. If the value is token id_token or id_token token, launches an Implicit flow, requiring the use of Javascript at the redirect URI to retrieve tokens from the URI #fragment.
     * @param {String} scope Scopes include basic, readmeasurements, and writemeasurements. The \&quot;basic\&quot; scope allows you to read user info (displayname, email, etc). The \&quot;readmeasurements\&quot; scope allows one to read a user&#39;s data. The \&quot;writemeasurements\&quot; scope allows you to write user data. Separate multiple scopes by a space.
     * @param {Object} opts Optional parameters
     * @param {String} opts.redirectUri The redirect URI is the URL within your client application that will receive the OAuth2 credentials.
     * @param {String} opts.state An opaque string that is round-tripped in the protocol; that is to say, it is returned as a URI parameter in the Basic flow, and in the URI
     * @param {module:api/AuthenticationApi~v2OauthAuthorizeGetCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v2OauthAuthorizeGet = function(clientId, clientSecret, responseType, scope, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'clientId' is set
      if (clientId == undefined || clientId == null) {
        throw new Error("Missing the required parameter 'clientId' when calling v2OauthAuthorizeGet");
      }

      // verify the required parameter 'clientSecret' is set
      if (clientSecret == undefined || clientSecret == null) {
        throw new Error("Missing the required parameter 'clientSecret' when calling v2OauthAuthorizeGet");
      }

      // verify the required parameter 'responseType' is set
      if (responseType == undefined || responseType == null) {
        throw new Error("Missing the required parameter 'responseType' when calling v2OauthAuthorizeGet");
      }

      // verify the required parameter 'scope' is set
      if (scope == undefined || scope == null) {
        throw new Error("Missing the required parameter 'scope' when calling v2OauthAuthorizeGet");
      }


      var pathParams = {
      };
      var queryParams = {
        'clientId': clientId,
        'client_secret': clientSecret,
        'response_type': responseType,
        'scope': scope,
        'redirect_uri': opts['redirectUri'],
        'state': opts['state']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v2/oauth/authorize', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":5}],7:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Connector', 'model/ConnectorInfo', 'model/ConnectorInstruction'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Connector'), require('../model/ConnectorInfo'), require('../model/ConnectorInstruction'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.ConnectorsApi = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.Connector, root.QuantimodoApi.ConnectorInfo, root.QuantimodoApi.ConnectorInstruction);
  }
}(this, function(ApiClient, Connector, ConnectorInfo, ConnectorInstruction) {
  'use strict';

  /**
   * Connectors service.
   * @module api/ConnectorsApi
   * @version 5.8.5
   */

  /**
   * Constructs a new ConnectorsApi. 
   * @alias module:api/ConnectorsApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1ConnectMobileGet operation.
     * @callback module:api/ConnectorsApi~v1ConnectMobileGetCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Mobile connect page
     * This page is designed to be opened in a webview.  Instead of using popup authentication boxes, it uses redirection. You can include the user&#39;s access_token as a URL parameter like https://app.quantimo.do/api/v1/connect/mobile?access_token&#x3D;123
     * @param {String} accessToken User OAuth access token
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/ConnectorsApi~v1ConnectMobileGetCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1ConnectMobileGet = function(accessToken, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'accessToken' is set
      if (accessToken == undefined || accessToken == null) {
        throw new Error("Missing the required parameter 'accessToken' when calling v1ConnectMobileGet");
      }


      var pathParams = {
      };
      var queryParams = {
        'access_token': accessToken,
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['text/html'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/connect/mobile', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1ConnectorsConnectorNameConnectGet operation.
     * @callback module:api/ConnectorsApi~v1ConnectorsConnectorNameConnectGetCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Obtain a token from 3rd party data source
     * Attempt to obtain a token from the data provider, store it in the database. With this, the connector to continue to obtain new user data until the token is revoked.
     * @param {String} connectorName Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/ConnectorsApi~v1ConnectorsConnectorNameConnectGetCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1ConnectorsConnectorNameConnectGet = function(connectorName, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'connectorName' is set
      if (connectorName == undefined || connectorName == null) {
        throw new Error("Missing the required parameter 'connectorName' when calling v1ConnectorsConnectorNameConnectGet");
      }


      var pathParams = {
        'connectorName': connectorName
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/connectors/{connectorName}/connect', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1ConnectorsConnectorNameConnectInstructionsGet operation.
     * @callback module:api/ConnectorsApi~v1ConnectorsConnectorNameConnectInstructionsGetCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Connection Instructions
     * Returns instructions that describe what parameters and endpoint to use to connect to the given data provider.
     * @param {String} connectorName Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint.
     * @param {String} parameters JSON Array of Parameters for the request to enable connector.
     * @param {String} url URL which should be used to enable the connector.
     * @param {Boolean} usePopup Should use popup when enabling connector
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/ConnectorsApi~v1ConnectorsConnectorNameConnectInstructionsGetCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1ConnectorsConnectorNameConnectInstructionsGet = function(connectorName, parameters, url, usePopup, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'connectorName' is set
      if (connectorName == undefined || connectorName == null) {
        throw new Error("Missing the required parameter 'connectorName' when calling v1ConnectorsConnectorNameConnectInstructionsGet");
      }

      // verify the required parameter 'parameters' is set
      if (parameters == undefined || parameters == null) {
        throw new Error("Missing the required parameter 'parameters' when calling v1ConnectorsConnectorNameConnectInstructionsGet");
      }

      // verify the required parameter 'url' is set
      if (url == undefined || url == null) {
        throw new Error("Missing the required parameter 'url' when calling v1ConnectorsConnectorNameConnectInstructionsGet");
      }

      // verify the required parameter 'usePopup' is set
      if (usePopup == undefined || usePopup == null) {
        throw new Error("Missing the required parameter 'usePopup' when calling v1ConnectorsConnectorNameConnectInstructionsGet");
      }


      var pathParams = {
        'connectorName': connectorName
      };
      var queryParams = {
        'userId': opts['userId'],
        'parameters': parameters,
        'url': url,
        'usePopup': usePopup
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/connectors/{connectorName}/connectInstructions', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1ConnectorsConnectorNameConnectParameterGet operation.
     * @callback module:api/ConnectorsApi~v1ConnectorsConnectorNameConnectParameterGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ConnectorInstruction} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Connect Parameter
     * Returns instructions that describe what parameters and endpoint to use to connect to the given data provider.
     * @param {String} connectorName Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint.
     * @param {String} displayName Name of the parameter that is user visible in the form
     * @param {String} key Name of the property that the user has to enter such as username or password Connector (used in HTTP request)
     * @param {String} placeholder Placeholder hint value for the parameter input tag.
     * @param {String} type Type of input field such as those found here http://www.w3schools.com/tags/tag_input.asp
     * @param {Boolean} usePopup Should use popup when enabling connector
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.defaultValue Default parameter value
     * @param {module:api/ConnectorsApi~v1ConnectorsConnectorNameConnectParameterGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ConnectorInstruction}
     */
    this.v1ConnectorsConnectorNameConnectParameterGet = function(connectorName, displayName, key, placeholder, type, usePopup, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'connectorName' is set
      if (connectorName == undefined || connectorName == null) {
        throw new Error("Missing the required parameter 'connectorName' when calling v1ConnectorsConnectorNameConnectParameterGet");
      }

      // verify the required parameter 'displayName' is set
      if (displayName == undefined || displayName == null) {
        throw new Error("Missing the required parameter 'displayName' when calling v1ConnectorsConnectorNameConnectParameterGet");
      }

      // verify the required parameter 'key' is set
      if (key == undefined || key == null) {
        throw new Error("Missing the required parameter 'key' when calling v1ConnectorsConnectorNameConnectParameterGet");
      }

      // verify the required parameter 'placeholder' is set
      if (placeholder == undefined || placeholder == null) {
        throw new Error("Missing the required parameter 'placeholder' when calling v1ConnectorsConnectorNameConnectParameterGet");
      }

      // verify the required parameter 'type' is set
      if (type == undefined || type == null) {
        throw new Error("Missing the required parameter 'type' when calling v1ConnectorsConnectorNameConnectParameterGet");
      }

      // verify the required parameter 'usePopup' is set
      if (usePopup == undefined || usePopup == null) {
        throw new Error("Missing the required parameter 'usePopup' when calling v1ConnectorsConnectorNameConnectParameterGet");
      }


      var pathParams = {
        'connectorName': connectorName
      };
      var queryParams = {
        'userId': opts['userId'],
        'defaultValue': opts['defaultValue'],
        'displayName': displayName,
        'key': key,
        'placeholder': placeholder,
        'type': type,
        'usePopup': usePopup
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = ConnectorInstruction;

      return this.apiClient.callApi(
        '/v1/connectors/{connectorName}/connectParameter', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1ConnectorsConnectorNameDisconnectGet operation.
     * @callback module:api/ConnectorsApi~v1ConnectorsConnectorNameDisconnectGetCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete stored connection info
     * The disconnect method deletes any stored tokens or connection information from the connectors database.
     * @param {String} connectorName Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint.
     * @param {module:api/ConnectorsApi~v1ConnectorsConnectorNameDisconnectGetCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1ConnectorsConnectorNameDisconnectGet = function(connectorName, callback) {
      var postBody = null;

      // verify the required parameter 'connectorName' is set
      if (connectorName == undefined || connectorName == null) {
        throw new Error("Missing the required parameter 'connectorName' when calling v1ConnectorsConnectorNameDisconnectGet");
      }


      var pathParams = {
        'connectorName': connectorName
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/connectors/{connectorName}/disconnect', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1ConnectorsConnectorNameInfoGet operation.
     * @callback module:api/ConnectorsApi~v1ConnectorsConnectorNameInfoGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ConnectorInfo} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get connector info for user
     * Returns information about the connector such as the connector id, whether or not is connected for this user (i.e. we have a token or credentials), and its update history for the user.
     * @param {String} connectorName Lowercase system name of the source application or device. Get a list of available connectors from the /v1/connectors/list endpoint.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/ConnectorsApi~v1ConnectorsConnectorNameInfoGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ConnectorInfo}
     */
    this.v1ConnectorsConnectorNameInfoGet = function(connectorName, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'connectorName' is set
      if (connectorName == undefined || connectorName == null) {
        throw new Error("Missing the required parameter 'connectorName' when calling v1ConnectorsConnectorNameInfoGet");
      }


      var pathParams = {
        'connectorName': connectorName
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = ConnectorInfo;

      return this.apiClient.callApi(
        '/v1/connectors/{connectorName}/info', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1ConnectorsConnectorNameUpdateGet operation.
     * @callback module:api/ConnectorsApi~v1ConnectorsConnectorNameUpdateGetCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Sync with data source
     * The update method tells the QM Connector Framework to check with the data provider (such as Fitbit or MyFitnessPal) and retrieve any new measurements available.
     * @param {String} connectorName Lowercase system name of the source application or device
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/ConnectorsApi~v1ConnectorsConnectorNameUpdateGetCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1ConnectorsConnectorNameUpdateGet = function(connectorName, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'connectorName' is set
      if (connectorName == undefined || connectorName == null) {
        throw new Error("Missing the required parameter 'connectorName' when calling v1ConnectorsConnectorNameUpdateGet");
      }


      var pathParams = {
        'connectorName': connectorName
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/connectors/{connectorName}/update', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1ConnectorsListGet operation.
     * @callback module:api/ConnectorsApi~v1ConnectorsListGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Connector>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * List of Connectors
     * A connector pulls data from other data providers using their API or a screenscraper. Returns a list of all available connectors and information about them such as their id, name, whether the user has provided access, logo url, connection instructions, and the update history.
     * @param {module:api/ConnectorsApi~v1ConnectorsListGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Connector>}
     */
    this.v1ConnectorsListGet = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Connector];

      return this.apiClient.callApi(
        '/v1/connectors/list', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1IntegrationJsGet operation.
     * @callback module:api/ConnectorsApi~v1IntegrationJsGetCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get embeddable connect javascript
     * Get embeddable connect javascript. Usage:   - Embedding in applications with popups for 3rd-party authentication windows.     Use &#x60;qmSetupInPopup&#x60; function after connecting &#x60;connect.js&#x60;.   - Embedding in applications with popups for 3rd-party authentication windows.     Requires a selector to block. It will be embedded in this block.     Use &#x60;qmSetupOnPage&#x60; function after connecting &#x60;connect.js&#x60;.   - Embedding in mobile applications without popups for 3rd-party authentication.     Use &#x60;qmSetupOnMobile&#x60; function after connecting &#x60;connect.js&#x60;.     If using in a Cordova application call  &#x60;qmSetupOnIonic&#x60; function after connecting &#x60;connect.js&#x60;.
     * @param {Object} opts Optional parameters
     * @param {String} opts.clientId Your app&#39;s client id
     * @param {module:api/ConnectorsApi~v1IntegrationJsGetCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1IntegrationJsGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'clientId': opts['clientId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/x-javascript'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/integration.js', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":5,"../model/Connector":21,"../model/ConnectorInfo":22,"../model/ConnectorInstruction":24}],8:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CommonResponse', 'model/Correlation', 'model/JsonErrorResponse', 'model/PostCorrelation', 'model/PostVote', 'model/VoteDelete'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/CommonResponse'), require('../model/Correlation'), require('../model/JsonErrorResponse'), require('../model/PostCorrelation'), require('../model/PostVote'), require('../model/VoteDelete'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.CorrelationsApi = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.CommonResponse, root.QuantimodoApi.Correlation, root.QuantimodoApi.JsonErrorResponse, root.QuantimodoApi.PostCorrelation, root.QuantimodoApi.PostVote, root.QuantimodoApi.VoteDelete);
  }
}(this, function(ApiClient, CommonResponse, Correlation, JsonErrorResponse, PostCorrelation, PostVote, VoteDelete) {
  'use strict';

  /**
   * Correlations service.
   * @module api/CorrelationsApi
   * @version 5.8.5
   */

  /**
   * Constructs a new CorrelationsApi. 
   * @alias module:api/CorrelationsApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1AggregatedCorrelationsGet operation.
     * @callback module:api/CorrelationsApi~v1AggregatedCorrelationsGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Correlation>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get aggregated correlations
     * Get correlations based on the anonymized aggregate data from all QuantiModo users.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.effect Variable name of the effect variable for which the user desires correlations
     * @param {String} opts.cause Variable name of the cause variable for which the user desires correlations
     * @param {String} opts.correlationCoefficient Pearson correlation coefficient between cause and effect after lagging by onset delay and grouping by duration of action
     * @param {String} opts.onsetDelay The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
     * @param {String} opts.durationOfAction The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
     * @param {String} opts.updatedAt The time that this measurement was last updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;.  Generally, you&#39;ll be retrieving new or updated user data. To avoid unnecessary API calls, you&#39;ll want to store your last refresh time locally. Then whenever you make a request to get new data, you should limit the returned results to those updated since your last refresh by appending append &#x60;?updatedAt&#x3D;(ge)2013-01-D01T01:01:01 to your request.
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
     * @param {Number} opts.offset Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;.
     * @param {Number} opts.sort Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order.
     * @param {Boolean} opts.outcomesOfInterest Only include correlations for which the effect is an outcome of interest for the user
     * @param {module:api/CorrelationsApi~v1AggregatedCorrelationsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Correlation>}
     */
    this.v1AggregatedCorrelationsGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId'],
        'effect': opts['effect'],
        'cause': opts['cause'],
        'correlationCoefficient': opts['correlationCoefficient'],
        'onsetDelay': opts['onsetDelay'],
        'durationOfAction': opts['durationOfAction'],
        'updatedAt': opts['updatedAt'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort'],
        'outcomesOfInterest': opts['outcomesOfInterest']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Correlation];

      return this.apiClient.callApi(
        '/v1/aggregatedCorrelations', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1AggregatedCorrelationsPost operation.
     * @callback module:api/CorrelationsApi~v1AggregatedCorrelationsPostCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Store or Update a Correlation
     * Add correlation
     * @param {module:model/PostCorrelation} body Provides correlation data
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/CorrelationsApi~v1AggregatedCorrelationsPostCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1AggregatedCorrelationsPost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1AggregatedCorrelationsPost");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/aggregatedCorrelations', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1CorrelationsGet operation.
     * @callback module:api/CorrelationsApi~v1CorrelationsGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Correlation>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get correlations
     * Get correlations based on data from a single user.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.effect Variable name of the effect variable for which the user desires correlations
     * @param {String} opts.cause Variable name of the cause variable for which the user desires correlations
     * @param {String} opts.correlationCoefficient Pearson correlation coefficient between cause and effect after lagging by onset delay and grouping by duration of action
     * @param {String} opts.onsetDelay The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
     * @param {String} opts.durationOfAction The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
     * @param {String} opts.updatedAt The time that this measurement was last updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;.  Generally, you&#39;ll be retrieving new or updated user data. To avoid unnecessary API calls, you&#39;ll want to store your last refresh time locally. Then whenever you make a request to get new data, you should limit the returned results to those updated since your last refresh by appending append &#x60;?updatedAt&#x3D;(ge)2013-01-D01T01:01:01 to your request.
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
     * @param {Number} opts.offset Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;.
     * @param {Number} opts.sort Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order.
     * @param {Boolean} opts.outcomesOfInterest Only include correlations for which the effect is an outcome of interest for the user
     * @param {module:api/CorrelationsApi~v1CorrelationsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Correlation>}
     */
    this.v1CorrelationsGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId'],
        'effect': opts['effect'],
        'cause': opts['cause'],
        'correlationCoefficient': opts['correlationCoefficient'],
        'onsetDelay': opts['onsetDelay'],
        'durationOfAction': opts['durationOfAction'],
        'updatedAt': opts['updatedAt'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort'],
        'outcomesOfInterest': opts['outcomesOfInterest']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Correlation];

      return this.apiClient.callApi(
        '/v1/correlations', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet operation.
     * @callback module:api/CorrelationsApi~v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Correlation>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Search user correlations for a given cause
     * Returns average of all correlations and votes for all user cause variables for a given cause. If parameter \&quot;include_public\&quot; is used, it also returns public correlations. User correlation overwrites or supersedes public correlation.
     * @param {Number} organizationId Organization ID
     * @param {Number} userId2 User id
     * @param {String} variableName Effect variable name
     * @param {String} organizationToken Organization access token
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.includePublic Include public correlations, Can be \&quot;1\&quot; or empty.
     * @param {module:api/CorrelationsApi~v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Correlation>}
     */
    this.v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet = function(organizationId, userId2, variableName, organizationToken, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'organizationId' is set
      if (organizationId == undefined || organizationId == null) {
        throw new Error("Missing the required parameter 'organizationId' when calling v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet");
      }

      // verify the required parameter 'userId2' is set
      if (userId2 == undefined || userId2 == null) {
        throw new Error("Missing the required parameter 'userId2' when calling v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet");
      }

      // verify the required parameter 'variableName' is set
      if (variableName == undefined || variableName == null) {
        throw new Error("Missing the required parameter 'variableName' when calling v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet");
      }

      // verify the required parameter 'organizationToken' is set
      if (organizationToken == undefined || organizationToken == null) {
        throw new Error("Missing the required parameter 'organizationToken' when calling v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameCausesGet");
      }


      var pathParams = {
        'organizationId': organizationId,
        'userId': userId2,
        'variableName': variableName
      };
      var queryParams = {
        'userId': opts['userId'],
        'organization_token': organizationToken,
        'includePublic': opts['includePublic']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Correlation];

      return this.apiClient.callApi(
        '/v1/organizations/{organizationId}/users/{userId}/variables/{variableName}/causes', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet operation.
     * @callback module:api/CorrelationsApi~v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/CommonResponse>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Search user correlations for a given cause
     * Returns average of all correlations and votes for all user cause variables for a given effect. If parameter \&quot;include_public\&quot; is used, it also returns public correlations. User correlation overwrites or supersedes public correlation.
     * @param {Number} organizationId Organization ID
     * @param {Number} userId2 User id
     * @param {String} variableName Cause variable name
     * @param {String} organizationToken Organization access token
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.includePublic Include public correlations, Can be \&quot;1\&quot; or empty.
     * @param {module:api/CorrelationsApi~v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/CommonResponse>}
     */
    this.v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet = function(organizationId, userId2, variableName, organizationToken, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'organizationId' is set
      if (organizationId == undefined || organizationId == null) {
        throw new Error("Missing the required parameter 'organizationId' when calling v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet");
      }

      // verify the required parameter 'userId2' is set
      if (userId2 == undefined || userId2 == null) {
        throw new Error("Missing the required parameter 'userId2' when calling v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet");
      }

      // verify the required parameter 'variableName' is set
      if (variableName == undefined || variableName == null) {
        throw new Error("Missing the required parameter 'variableName' when calling v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet");
      }

      // verify the required parameter 'organizationToken' is set
      if (organizationToken == undefined || organizationToken == null) {
        throw new Error("Missing the required parameter 'organizationToken' when calling v1OrganizationsOrganizationIdUsersUserIdVariablesVariableNameEffectsGet");
      }


      var pathParams = {
        'organizationId': organizationId,
        'userId': userId2,
        'variableName': variableName
      };
      var queryParams = {
        'userId': opts['userId'],
        'organization_token': organizationToken,
        'include_public': opts['includePublic']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [CommonResponse];

      return this.apiClient.callApi(
        '/v1/organizations/{organizationId}/users/{userId}/variables/{variableName}/effects', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1PublicCorrelationsSearchSearchGet operation.
     * @callback module:api/CorrelationsApi~v1PublicCorrelationsSearchSearchGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Correlation>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get average correlations for variables containing search term
     * Returns the average correlations from all users for all public variables that contain the characters in the search query. Returns average of all users public variable correlations with a specified cause or effect.
     * @param {String} search Name of the variable that you want to know the causes or effects of.
     * @param {String} effectOrCause Setting this to effect indicates that the searched variable is the effect and that the causes of this variable should be returned. cause indicates that the searched variable is the cause and the effects should be returned.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {Boolean} opts.outcomesOfInterest Only include correlations for which the effect is an outcome of interest for the user
     * @param {module:api/CorrelationsApi~v1PublicCorrelationsSearchSearchGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Correlation>}
     */
    this.v1PublicCorrelationsSearchSearchGet = function(search, effectOrCause, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'search' is set
      if (search == undefined || search == null) {
        throw new Error("Missing the required parameter 'search' when calling v1PublicCorrelationsSearchSearchGet");
      }

      // verify the required parameter 'effectOrCause' is set
      if (effectOrCause == undefined || effectOrCause == null) {
        throw new Error("Missing the required parameter 'effectOrCause' when calling v1PublicCorrelationsSearchSearchGet");
      }


      var pathParams = {
        'search': search
      };
      var queryParams = {
        'userId': opts['userId'],
        'effectOrCause': effectOrCause,
        'outcomesOfInterest': opts['outcomesOfInterest']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Correlation];

      return this.apiClient.callApi(
        '/v1/public/correlations/search/{search}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1VariablesVariableNameCausesGet operation.
     * @callback module:api/CorrelationsApi~v1VariablesVariableNameCausesGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Correlation>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Search user correlations for a given effect
     * Returns average of all correlations and votes for all user cause variables for a given effect
     * @param {String} variableName Effect variable name
     * @param {module:api/CorrelationsApi~v1VariablesVariableNameCausesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Correlation>}
     */
    this.v1VariablesVariableNameCausesGet = function(variableName, callback) {
      var postBody = null;

      // verify the required parameter 'variableName' is set
      if (variableName == undefined || variableName == null) {
        throw new Error("Missing the required parameter 'variableName' when calling v1VariablesVariableNameCausesGet");
      }


      var pathParams = {
        'variableName': variableName
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Correlation];

      return this.apiClient.callApi(
        '/v1/variables/{variableName}/causes', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1VariablesVariableNameEffectsGet operation.
     * @callback module:api/CorrelationsApi~v1VariablesVariableNameEffectsGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Correlation>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Search user correlations for a given cause
     * Returns average of all correlations and votes for all user effect variables for a given cause
     * @param {String} variableName Cause variable name
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.correlationCoefficient You can use this to get effects with correlations greater than or less than 0
     * @param {module:api/CorrelationsApi~v1VariablesVariableNameEffectsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Correlation>}
     */
    this.v1VariablesVariableNameEffectsGet = function(variableName, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'variableName' is set
      if (variableName == undefined || variableName == null) {
        throw new Error("Missing the required parameter 'variableName' when calling v1VariablesVariableNameEffectsGet");
      }


      var pathParams = {
        'variableName': variableName
      };
      var queryParams = {
        'userId': opts['userId'],
        'correlationCoefficient': opts['correlationCoefficient']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Correlation];

      return this.apiClient.callApi(
        '/v1/variables/{variableName}/effects', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1VariablesVariableNamePublicCausesGet operation.
     * @callback module:api/CorrelationsApi~v1VariablesVariableNamePublicCausesGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Correlation>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Search public correlations for a given effect
     * Returns average of all correlations and votes for all public cause variables for a given effect
     * @param {String} variableName Effect variable name
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.correlationCoefficient You can use this to get causes with correlations greater than or less than 0
     * @param {module:api/CorrelationsApi~v1VariablesVariableNamePublicCausesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Correlation>}
     */
    this.v1VariablesVariableNamePublicCausesGet = function(variableName, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'variableName' is set
      if (variableName == undefined || variableName == null) {
        throw new Error("Missing the required parameter 'variableName' when calling v1VariablesVariableNamePublicCausesGet");
      }


      var pathParams = {
        'variableName': variableName
      };
      var queryParams = {
        'userId': opts['userId'],
        'correlationCoefficient': opts['correlationCoefficient']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Correlation];

      return this.apiClient.callApi(
        '/v1/variables/{variableName}/public/causes', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1VariablesVariableNamePublicEffectsGet operation.
     * @callback module:api/CorrelationsApi~v1VariablesVariableNamePublicEffectsGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Correlation>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Search public correlations for a given cause
     * Returns average of all correlations and votes for all public cause variables for a given cause
     * @param {String} variableName Cause variable name
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/CorrelationsApi~v1VariablesVariableNamePublicEffectsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Correlation>}
     */
    this.v1VariablesVariableNamePublicEffectsGet = function(variableName, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'variableName' is set
      if (variableName == undefined || variableName == null) {
        throw new Error("Missing the required parameter 'variableName' when calling v1VariablesVariableNamePublicEffectsGet");
      }


      var pathParams = {
        'variableName': variableName
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Correlation];

      return this.apiClient.callApi(
        '/v1/variables/{variableName}/public/effects', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1VotesDeletePost operation.
     * @callback module:api/CorrelationsApi~v1VotesDeletePostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete vote
     * Delete previously posted vote
     * @param {module:model/VoteDelete} body The cause and effect variable names for the predictor vote to be deleted.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/CorrelationsApi~v1VotesDeletePostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1VotesDeletePost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1VotesDeletePost");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/votes/delete', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1VotesPost operation.
     * @callback module:api/CorrelationsApi~v1VotesPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post or update vote
     * This is to enable users to indicate their opinion on the plausibility of a causal relationship between a treatment and outcome. QuantiModo incorporates crowd-sourced plausibility estimations into their algorithm. This is done allowing user to indicate their view of the plausibility of each relationship with thumbs up/down buttons placed next to each prediction.
     * @param {module:model/PostVote} body Contains the cause variable, effect variable, and vote value.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/CorrelationsApi~v1VotesPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1VotesPost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1VotesPost");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/votes', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":5,"../model/CommonResponse":19,"../model/Correlation":26,"../model/JsonErrorResponse":31,"../model/PostCorrelation":40,"../model/PostVote":41,"../model/VoteDelete":68}],9:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CommonResponse', 'model/Measurement', 'model/MeasurementDelete', 'model/MeasurementRange', 'model/MeasurementSet', 'model/MeasurementSource', 'model/MeasurementUpdate'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/CommonResponse'), require('../model/Measurement'), require('../model/MeasurementDelete'), require('../model/MeasurementRange'), require('../model/MeasurementSet'), require('../model/MeasurementSource'), require('../model/MeasurementUpdate'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.MeasurementsApi = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.CommonResponse, root.QuantimodoApi.Measurement, root.QuantimodoApi.MeasurementDelete, root.QuantimodoApi.MeasurementRange, root.QuantimodoApi.MeasurementSet, root.QuantimodoApi.MeasurementSource, root.QuantimodoApi.MeasurementUpdate);
  }
}(this, function(ApiClient, CommonResponse, Measurement, MeasurementDelete, MeasurementRange, MeasurementSet, MeasurementSource, MeasurementUpdate) {
  'use strict';

  /**
   * Measurements service.
   * @module api/MeasurementsApi
   * @version 5.8.5
   */

  /**
   * Constructs a new MeasurementsApi. 
   * @alias module:api/MeasurementsApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1MeasurementSourcesGet operation.
     * @callback module:api/MeasurementsApi~v1MeasurementSourcesGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/MeasurementSource} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get measurement sources
     * Returns a list of all the apps from which measurement data is obtained.
     * @param {module:api/MeasurementsApi~v1MeasurementSourcesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/MeasurementSource}
     */
    this.v1MeasurementSourcesGet = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = MeasurementSource;

      return this.apiClient.callApi(
        '/v1/measurementSources', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementSourcesPost operation.
     * @callback module:api/MeasurementsApi~v1MeasurementSourcesPostCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Add a data source
     * Add a life-tracking app or device to the QuantiModo list of data sources.
     * @param {module:model/MeasurementSource} body An array of names of data sources you want to add.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/MeasurementsApi~v1MeasurementSourcesPostCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1MeasurementSourcesPost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1MeasurementSourcesPost");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/measurementSources', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementsDailyGet operation.
     * @callback module:api/MeasurementsApi~v1MeasurementsDailyGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Measurement} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get daily measurements for this user
     * Measurements are any value that can be recorded like daily steps, a mood rating, or apples eaten. Supported filter parameters:&lt;ul&gt;&lt;li&gt;&lt;b&gt;value&lt;/b&gt; - Value of measurement&lt;/li&gt;&lt;li&gt;&lt;b&gt;updatedAt&lt;/b&gt; - The time that this measurement was created or last updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;&lt;/li&gt;&lt;/ul&gt;
     * @param {String} variableName Name of the variable you want measurements for
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.unitAbbreviatedName The unit your want the measurements in
     * @param {String} opts.startTime The lower limit of measurements returned (UTC Iso8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot; format)
     * @param {String} opts.endTime The upper limit of measurements returned (UTC Iso8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot; format)
     * @param {Number} opts.groupingWidth The time (in seconds) over which measurements are grouped together
     * @param {String} opts.groupingTimezone The time (in seconds) over which measurements are grouped together
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
     * @param {Number} opts.offset Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;.
     * @param {Number} opts.sort Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order.
     * @param {module:api/MeasurementsApi~v1MeasurementsDailyGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Measurement}
     */
    this.v1MeasurementsDailyGet = function(variableName, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'variableName' is set
      if (variableName == undefined || variableName == null) {
        throw new Error("Missing the required parameter 'variableName' when calling v1MeasurementsDailyGet");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId'],
        'variableName': variableName,
        'unitAbbreviatedName': opts['unitAbbreviatedName'],
        'startTime': opts['startTime'],
        'endTime': opts['endTime'],
        'groupingWidth': opts['groupingWidth'],
        'groupingTimezone': opts['groupingTimezone'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Measurement;

      return this.apiClient.callApi(
        '/v1/measurements/daily', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementsDeletePost operation.
     * @callback module:api/MeasurementsApi~v1MeasurementsDeletePostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete a measurement
     * Delete a previously submitted measurement
     * @param {module:model/MeasurementDelete} body The startTime and variableId of the measurement to be deleted.
     * @param {module:api/MeasurementsApi~v1MeasurementsDeletePostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1MeasurementsDeletePost = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1MeasurementsDeletePost");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/measurements/delete', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementsGet operation.
     * @callback module:api/MeasurementsApi~v1MeasurementsGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Measurement} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get measurements for this user
     * Measurements are any value that can be recorded like daily steps, a mood rating, or apples eaten. Supported filter parameters:&lt;ul&gt;&lt;li&gt;&lt;b&gt;value&lt;/b&gt; - Value of measurement&lt;/li&gt;&lt;li&gt;&lt;b&gt;updatedAt&lt;/b&gt; - The time that this measurement was created or last updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;&lt;/li&gt;&lt;/ul&gt;
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {Number} opts.id Measurement id
     * @param {String} opts.variableName Name of the variable you want measurements for
     * @param {String} opts.variableCategoryName Name of the variable category you want measurements for
     * @param {String} opts.sourceName ID of the source you want measurements for (supports exact name match only)
     * @param {String} opts.value Value of measurement
     * @param {String} opts.unitAbbreviatedName The unit you want the measurements returned in
     * @param {String} opts.earliestMeasurementTime The lower limit of measurements returned in ISO 8601 format or epoch seconds (unixtime)
     * @param {String} opts.latestMeasurementTime The upper limit of measurements returned in ISO 8601 format or epoch seconds (unixtime)
     * @param {String} opts.createdAt The time the measurement record was first created in the format YYYY-MM-DDThh:mm:ss. Time zone should be UTC and not local.
     * @param {String} opts.updatedAt The time the measurement record was last changed in the format YYYY-MM-DDThh:mm:ss. Time zone should be UTC and not local.
     * @param {Number} opts.groupingWidth The time (in seconds) over which measurements are grouped together
     * @param {String} opts.groupingTimezone The time (in seconds) over which measurements are grouped together
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
     * @param {Number} opts.offset Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;.
     * @param {Number} opts.sort Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order.
     * @param {module:api/MeasurementsApi~v1MeasurementsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Measurement}
     */
    this.v1MeasurementsGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId'],
        'id': opts['id'],
        'variableName': opts['variableName'],
        'variableCategoryName': opts['variableCategoryName'],
        'sourceName': opts['sourceName'],
        'value': opts['value'],
        'unitAbbreviatedName': opts['unitAbbreviatedName'],
        'earliestMeasurementTime': opts['earliestMeasurementTime'],
        'latestMeasurementTime': opts['latestMeasurementTime'],
        'createdAt': opts['createdAt'],
        'updatedAt': opts['updatedAt'],
        'groupingWidth': opts['groupingWidth'],
        'groupingTimezone': opts['groupingTimezone'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Measurement;

      return this.apiClient.callApi(
        '/v1/measurements', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementsPost operation.
     * @callback module:api/MeasurementsApi~v1MeasurementsPostCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post a new set or update existing measurements to the database
     * You can submit or update multiple measurements in a \&quot;measurements\&quot; sub-array.  If the variable these measurements correspond to does not already exist in the database, it will be automatically added.  The request body should look something like [{\&quot;measurements\&quot;:[{\&quot;startTime\&quot;:1439389320,\&quot;value\&quot;:\&quot;3\&quot;}, {\&quot;startTime\&quot;:1439389319,\&quot;value\&quot;:\&quot;2\&quot;}],\&quot;name\&quot;:\&quot;Acne (out of 5)\&quot;,\&quot;source\&quot;:\&quot;QuantiModo\&quot;,\&quot;category\&quot;:\&quot;Symptoms\&quot;,\&quot;combinationOperation\&quot;:\&quot;MEAN\&quot;,\&quot;unit\&quot;:\&quot;/5\&quot;}]
     * @param {module:model/MeasurementSet} body An array of measurements you want to insert.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/MeasurementsApi~v1MeasurementsPostCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1MeasurementsPost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1MeasurementsPost");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/measurements', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementsRangeGet operation.
     * @callback module:api/MeasurementsApi~v1MeasurementsRangeGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/MeasurementRange} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get measurements range for this user
     * Get Unix time-stamp (epoch time) of the user&#39;s first and last measurements taken.
     * @param {Object} opts Optional parameters
     * @param {String} opts.sources Enter source name to limit to specific source (varchar)
     * @param {Number} opts.user If not specified, uses currently logged in user (bigint)
     * @param {module:api/MeasurementsApi~v1MeasurementsRangeGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/MeasurementRange}
     */
    this.v1MeasurementsRangeGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'sources': opts['sources'],
        'user': opts['user']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = MeasurementRange;

      return this.apiClient.callApi(
        '/v1/measurementsRange', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1MeasurementsUpdatePost operation.
     * @callback module:api/MeasurementsApi~v1MeasurementsUpdatePostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update a measurement
     * Delete a previously submitted measurement
     * @param {module:model/MeasurementUpdate} body The id as well as the new startTime, note, and/or value of the measurement to be updated
     * @param {module:api/MeasurementsApi~v1MeasurementsUpdatePostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1MeasurementsUpdatePost = function(body, callback) {
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1MeasurementsUpdatePost");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/measurements/update', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v2MeasurementsCsvGet operation.
     * @callback module:api/MeasurementsApi~v2MeasurementsCsvGetCallback
     * @param {String} error Error message, if any.
     * @param {File} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get Measurements CSV
     * Download a CSV containing all user measurements
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/MeasurementsApi~v2MeasurementsCsvGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link File}
     */
    this.v2MeasurementsCsvGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['text/csv'];
      var returnType = File;

      return this.apiClient.callApi(
        '/v2/measurements/csv', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v2MeasurementsRequestCsvPost operation.
     * @callback module:api/MeasurementsApi~v2MeasurementsRequestCsvPostCallback
     * @param {String} error Error message, if any.
     * @param {'Number'} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post Request for Measurements CSV
     * Use this endpoint to schedule a CSV export containing all user measurements to be emailed to the user within 24 hours.
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/MeasurementsApi~v2MeasurementsRequestCsvPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link 'Number'}
     */
    this.v2MeasurementsRequestCsvPost = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = 'Number';

      return this.apiClient.callApi(
        '/v2/measurements/request_csv', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v2MeasurementsRequestPdfPost operation.
     * @callback module:api/MeasurementsApi~v2MeasurementsRequestPdfPostCallback
     * @param {String} error Error message, if any.
     * @param {'Number'} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post Request for Measurements PDF
     * Use this endpoint to schedule a PDF export containing all user measurements to be emailed to the user within 24 hours.
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/MeasurementsApi~v2MeasurementsRequestPdfPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link 'Number'}
     */
    this.v2MeasurementsRequestPdfPost = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = 'Number';

      return this.apiClient.callApi(
        '/v2/measurements/request_pdf', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v2MeasurementsRequestXlsPost operation.
     * @callback module:api/MeasurementsApi~v2MeasurementsRequestXlsPostCallback
     * @param {String} error Error message, if any.
     * @param {'Number'} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post Request for Measurements XLS
     * Use this endpoint to schedule a XLS export containing all user measurements to be emailed to the user within 24 hours.
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/MeasurementsApi~v2MeasurementsRequestXlsPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link 'Number'}
     */
    this.v2MeasurementsRequestXlsPost = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = 'Number';

      return this.apiClient.callApi(
        '/v2/measurements/request_xls', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":5,"../model/CommonResponse":19,"../model/Measurement":32,"../model/MeasurementDelete":33,"../model/MeasurementRange":34,"../model/MeasurementSet":35,"../model/MeasurementSource":36,"../model/MeasurementUpdate":37}],10:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/UserTokenFailedResponse', 'model/UserTokenRequest', 'model/UserTokenSuccessfulResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/UserTokenFailedResponse'), require('../model/UserTokenRequest'), require('../model/UserTokenSuccessfulResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.OrganizationsApi = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.UserTokenFailedResponse, root.QuantimodoApi.UserTokenRequest, root.QuantimodoApi.UserTokenSuccessfulResponse);
  }
}(this, function(ApiClient, UserTokenFailedResponse, UserTokenRequest, UserTokenSuccessfulResponse) {
  'use strict';

  /**
   * Organizations service.
   * @module api/OrganizationsApi
   * @version 5.8.5
   */

  /**
   * Constructs a new OrganizationsApi. 
   * @alias module:api/OrganizationsApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1OrganizationsOrganizationIdUsersPost operation.
     * @callback module:api/OrganizationsApi~v1OrganizationsOrganizationIdUsersPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/UserTokenSuccessfulResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get user tokens for existing users, create new users
     * Get user tokens for existing users, create new users
     * @param {Number} organizationId Organization ID
     * @param {module:model/UserTokenRequest} body Provides organization token and user ID
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/OrganizationsApi~v1OrganizationsOrganizationIdUsersPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/UserTokenSuccessfulResponse}
     */
    this.v1OrganizationsOrganizationIdUsersPost = function(organizationId, body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'organizationId' is set
      if (organizationId == undefined || organizationId == null) {
        throw new Error("Missing the required parameter 'organizationId' when calling v1OrganizationsOrganizationIdUsersPost");
      }

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1OrganizationsOrganizationIdUsersPost");
      }


      var pathParams = {
        'organizationId': organizationId
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = UserTokenSuccessfulResponse;

      return this.apiClient.callApi(
        '/v1/organizations/{organizationId}/users', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":5,"../model/UserTokenFailedResponse":53,"../model/UserTokenRequest":54,"../model/UserTokenSuccessfulResponse":56}],11:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Pairs'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Pairs'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.PairsApi = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.Pairs);
  }
}(this, function(ApiClient, Pairs) {
  'use strict';

  /**
   * Pairs service.
   * @module api/PairsApi
   * @version 5.8.5
   */

  /**
   * Constructs a new PairsApi. 
   * @alias module:api/PairsApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1PairsCsvGet operation.
     * @callback module:api/PairsApi~v1PairsCsvGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Pairs>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get pairs
     * Pairs cause measurements with effect measurements grouped over the duration of action after the onset delay.
     * @param {String} cause Original variable name for the explanatory or independent variable
     * @param {String} effect Original variable name for the outcome or dependent variable
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.causeSource Name of data source that the cause measurements should come from
     * @param {String} opts.causeUnit Abbreviated name for the unit cause measurements to be returned in
     * @param {String} opts.delay The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
     * @param {String} opts.duration The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
     * @param {String} opts.effectSource Name of data source that the effectmeasurements should come from
     * @param {String} opts.effectUnit Abbreviated name for the unit effect measurements to be returned in
     * @param {String} opts.endTime The most recent date (in epoch time) for which we should return measurements
     * @param {String} opts.startTime The earliest date (in epoch time) for which we should return measurements
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
     * @param {Number} opts.offset Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;.
     * @param {Number} opts.sort Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order.
     * @param {module:api/PairsApi~v1PairsCsvGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Pairs>}
     */
    this.v1PairsCsvGet = function(cause, effect, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'cause' is set
      if (cause == undefined || cause == null) {
        throw new Error("Missing the required parameter 'cause' when calling v1PairsCsvGet");
      }

      // verify the required parameter 'effect' is set
      if (effect == undefined || effect == null) {
        throw new Error("Missing the required parameter 'effect' when calling v1PairsCsvGet");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId'],
        'cause': cause,
        'causeSource': opts['causeSource'],
        'causeUnit': opts['causeUnit'],
        'delay': opts['delay'],
        'duration': opts['duration'],
        'effect': effect,
        'effectSource': opts['effectSource'],
        'effectUnit': opts['effectUnit'],
        'endTime': opts['endTime'],
        'startTime': opts['startTime'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Pairs];

      return this.apiClient.callApi(
        '/v1/pairsCsv', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1PairsGet operation.
     * @callback module:api/PairsApi~v1PairsGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Pairs>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get pairs
     * Pairs cause measurements with effect measurements grouped over the duration of action after the onset delay.
     * @param {String} cause Original variable name for the explanatory or independent variable
     * @param {String} effect Original variable name for the outcome or dependent variable
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.causeSource Name of data source that the cause measurements should come from
     * @param {String} opts.causeUnit Abbreviated name for the unit cause measurements to be returned in
     * @param {String} opts.delay The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
     * @param {String} opts.duration The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
     * @param {String} opts.effectSource Name of data source that the effectmeasurements should come from
     * @param {String} opts.effectUnit Abbreviated name for the unit effect measurements to be returned in
     * @param {String} opts.endTime The most recent date (in epoch time) for which we should return measurements
     * @param {String} opts.startTime The earliest date (in epoch time) for which we should return measurements
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
     * @param {Number} opts.offset Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;.
     * @param {Number} opts.sort Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order.
     * @param {module:api/PairsApi~v1PairsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Pairs>}
     */
    this.v1PairsGet = function(cause, effect, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'cause' is set
      if (cause == undefined || cause == null) {
        throw new Error("Missing the required parameter 'cause' when calling v1PairsGet");
      }

      // verify the required parameter 'effect' is set
      if (effect == undefined || effect == null) {
        throw new Error("Missing the required parameter 'effect' when calling v1PairsGet");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId'],
        'cause': cause,
        'causeSource': opts['causeSource'],
        'causeUnit': opts['causeUnit'],
        'delay': opts['delay'],
        'duration': opts['duration'],
        'effect': effect,
        'effectSource': opts['effectSource'],
        'effectUnit': opts['effectUnit'],
        'endTime': opts['endTime'],
        'startTime': opts['startTime'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Pairs];

      return this.apiClient.callApi(
        '/v1/pairs', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":5,"../model/Pairs":38}],12:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CommonResponse', 'model/InlineResponse200', 'model/InlineResponse2001', 'model/InlineResponse2002', 'model/TrackingReminder', 'model/TrackingReminderDelete', 'model/TrackingReminderNotificationSkip', 'model/TrackingReminderNotificationSnooze', 'model/TrackingReminderNotificationTrack'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/CommonResponse'), require('../model/InlineResponse200'), require('../model/InlineResponse2001'), require('../model/InlineResponse2002'), require('../model/TrackingReminder'), require('../model/TrackingReminderDelete'), require('../model/TrackingReminderNotificationSkip'), require('../model/TrackingReminderNotificationSnooze'), require('../model/TrackingReminderNotificationTrack'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.RemindersApi = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.CommonResponse, root.QuantimodoApi.InlineResponse200, root.QuantimodoApi.InlineResponse2001, root.QuantimodoApi.InlineResponse2002, root.QuantimodoApi.TrackingReminder, root.QuantimodoApi.TrackingReminderDelete, root.QuantimodoApi.TrackingReminderNotificationSkip, root.QuantimodoApi.TrackingReminderNotificationSnooze, root.QuantimodoApi.TrackingReminderNotificationTrack);
  }
}(this, function(ApiClient, CommonResponse, InlineResponse200, InlineResponse2001, InlineResponse2002, TrackingReminder, TrackingReminderDelete, TrackingReminderNotificationSkip, TrackingReminderNotificationSnooze, TrackingReminderNotificationTrack) {
  'use strict';

  /**
   * Reminders service.
   * @module api/RemindersApi
   * @version 5.8.5
   */

  /**
   * Constructs a new RemindersApi. 
   * @alias module:api/RemindersApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1TrackingReminderNotificationsGet operation.
     * @callback module:api/RemindersApi~v1TrackingReminderNotificationsGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/InlineResponse2002} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get specific pending tracking reminders
     * Specfic pending reminder instances that still need to be tracked.  
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.variableCategoryName Limit tracking reminder notifications to a specific variable category
     * @param {String} opts.createdAt When the record was first created. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format. Time zone should be UTC and not local.
     * @param {String} opts.updatedAt When the record was last updated. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format. Time zone should be UTC and not local.
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
     * @param {Number} opts.offset OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause. If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
     * @param {String} opts.sort Sort by given field. If the field is prefixed with &#39;-&#39;, it will sort in descending order.
     * @param {module:api/RemindersApi~v1TrackingReminderNotificationsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/InlineResponse2002}
     */
    this.v1TrackingReminderNotificationsGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId'],
        'variableCategoryName': opts['variableCategoryName'],
        'createdAt': opts['createdAt'],
        'updatedAt': opts['updatedAt'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = InlineResponse2002;

      return this.apiClient.callApi(
        '/v1/trackingReminderNotifications', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1TrackingReminderNotificationsSkipPost operation.
     * @callback module:api/RemindersApi~v1TrackingReminderNotificationsSkipPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Skip a pending tracking reminder
     * Deletes the pending tracking reminder
     * @param {module:model/TrackingReminderNotificationSkip} body Id of the pending reminder to be skipped or deleted
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/RemindersApi~v1TrackingReminderNotificationsSkipPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1TrackingReminderNotificationsSkipPost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1TrackingReminderNotificationsSkipPost");
      }


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/trackingReminderNotifications/skip', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1TrackingReminderNotificationsSnoozePost operation.
     * @callback module:api/RemindersApi~v1TrackingReminderNotificationsSnoozePostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Snooze a pending tracking reminder
     * Changes the reminder time to now plus one hour
     * @param {module:model/TrackingReminderNotificationSnooze} body Id of the pending reminder to be snoozed
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/RemindersApi~v1TrackingReminderNotificationsSnoozePostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1TrackingReminderNotificationsSnoozePost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1TrackingReminderNotificationsSnoozePost");
      }


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/trackingReminderNotifications/snooze', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1TrackingReminderNotificationsTrackPost operation.
     * @callback module:api/RemindersApi~v1TrackingReminderNotificationsTrackPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Track a pending tracking reminder
     * Adds the default measurement for the pending tracking reminder with the reminder time as the measurment start time
     * @param {module:model/TrackingReminderNotificationTrack} body Id of the pending reminder to be tracked
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/RemindersApi~v1TrackingReminderNotificationsTrackPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1TrackingReminderNotificationsTrackPost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1TrackingReminderNotificationsTrackPost");
      }


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/trackingReminderNotifications/track', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1TrackingRemindersDeletePost operation.
     * @callback module:api/RemindersApi~v1TrackingRemindersDeletePostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete tracking reminder
     * Delete previously created tracking reminder
     * @param {module:model/TrackingReminderDelete} body Id of reminder to be deleted
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/RemindersApi~v1TrackingRemindersDeletePostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1TrackingRemindersDeletePost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1TrackingRemindersDeletePost");
      }


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/trackingReminders/delete', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1TrackingRemindersGet operation.
     * @callback module:api/RemindersApi~v1TrackingRemindersGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/InlineResponse200} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get repeating tracking reminder settings
     * Users can be reminded to track certain variables at a specified frequency with a default value.
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.variableCategoryName Limit tracking reminders to a specific variable category
     * @param {String} opts.createdAt When the record was first created. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format. Time zone should be UTC and not local.
     * @param {String} opts.updatedAt When the record was last updated. Use UTC ISO 8601 \&quot;YYYY-MM-DDThh:mm:ss\&quot;  datetime format. Time zone should be UTC and not local.
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0. The maximum limit is 200 records.
     * @param {Number} opts.offset OFFSET says to skip that many rows before beginning to return rows to the client. OFFSET 0 is the same as omitting the OFFSET clause. If both OFFSET and LIMIT appear, then OFFSET rows are skipped before starting to count the LIMIT rows that are returned.
     * @param {String} opts.sort Sort by given field. If the field is prefixed with &#39;-&#39;, it will sort in descending order.
     * @param {module:api/RemindersApi~v1TrackingRemindersGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/InlineResponse200}
     */
    this.v1TrackingRemindersGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId'],
        'variableCategoryName': opts['variableCategoryName'],
        'createdAt': opts['createdAt'],
        'updatedAt': opts['updatedAt'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = InlineResponse200;

      return this.apiClient.callApi(
        '/v1/trackingReminders', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1TrackingRemindersPost operation.
     * @callback module:api/RemindersApi~v1TrackingRemindersPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/InlineResponse2001} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Store a Tracking Reminder
     * This is to enable users to create reminders to track a variable with a default value at a specified frequency
     * @param {Object} opts Optional parameters
     * @param {String} opts.accessToken User&#39;s OAuth2 access token
     * @param {Number} opts.userId User&#39;s id
     * @param {module:model/TrackingReminder} opts.body TrackingReminder that should be stored
     * @param {module:api/RemindersApi~v1TrackingRemindersPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/InlineResponse2001}
     */
    this.v1TrackingRemindersPost = function(opts, callback) {
      opts = opts || {};
      var postBody = opts['body'];


      var pathParams = {
      };
      var queryParams = {
        'access_token': opts['accessToken'],
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = InlineResponse2001;

      return this.apiClient.callApi(
        '/v1/trackingReminders', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":5,"../model/CommonResponse":19,"../model/InlineResponse200":28,"../model/InlineResponse2001":29,"../model/InlineResponse2002":30,"../model/TrackingReminder":42,"../model/TrackingReminderDelete":43,"../model/TrackingReminderNotificationSkip":45,"../model/TrackingReminderNotificationSnooze":46,"../model/TrackingReminderNotificationTrack":47}],13:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CommonResponse', 'model/UserTag'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/CommonResponse'), require('../model/UserTag'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.TagsApi = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.CommonResponse, root.QuantimodoApi.UserTag);
  }
}(this, function(ApiClient, CommonResponse, UserTag) {
  'use strict';

  /**
   * Tags service.
   * @module api/TagsApi
   * @version 5.8.5
   */

  /**
   * Constructs a new TagsApi. 
   * @alias module:api/TagsApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1UserTagsDeletePost operation.
     * @callback module:api/TagsApi~v1UserTagsDeletePostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete user tag or ingredient
     * Delete previously created user tags or ingredients.
     * @param {Number} taggedVariableId This is the id of the variable being tagged with an ingredient or something.
     * @param {Number} tagVariableId This is the id of the ingredient variable whose value is determined based on the value of the tagged variable.
     * @param {module:api/TagsApi~v1UserTagsDeletePostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1UserTagsDeletePost = function(taggedVariableId, tagVariableId, callback) {
      var postBody = null;

      // verify the required parameter 'taggedVariableId' is set
      if (taggedVariableId == undefined || taggedVariableId == null) {
        throw new Error("Missing the required parameter 'taggedVariableId' when calling v1UserTagsDeletePost");
      }

      // verify the required parameter 'tagVariableId' is set
      if (tagVariableId == undefined || tagVariableId == null) {
        throw new Error("Missing the required parameter 'tagVariableId' when calling v1UserTagsDeletePost");
      }


      var pathParams = {
      };
      var queryParams = {
        'taggedVariableId': taggedVariableId,
        'tagVariableId': tagVariableId
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/userTags/delete', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1UserTagsPost operation.
     * @callback module:api/TagsApi~v1UserTagsPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post or update user tags or ingredients
     * This endpoint allows users to tag foods with their ingredients.  This information will then be used to infer the user intake of the different ingredients by just entering the foods. The inferred intake levels will then be used to determine the effects of different nutrients on the user during analysis.
     * @param {module:model/UserTag} body Contains the new user tag data
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/TagsApi~v1UserTagsPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1UserTagsPost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1UserTagsPost");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/userTags', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":5,"../model/CommonResponse":19,"../model/UserTag":52}],14:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Unit', 'model/UnitCategory'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Unit'), require('../model/UnitCategory'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UnitsApi = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.Unit, root.QuantimodoApi.UnitCategory);
  }
}(this, function(ApiClient, Unit, UnitCategory) {
  'use strict';

  /**
   * Units service.
   * @module api/UnitsApi
   * @version 5.8.5
   */

  /**
   * Constructs a new UnitsApi. 
   * @alias module:api/UnitsApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1UnitCategoriesGet operation.
     * @callback module:api/UnitsApi~v1UnitCategoriesGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/UnitCategory} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get unit categories
     * Get a list of the categories of measurement units such as &#39;Distance&#39;, &#39;Duration&#39;, &#39;Energy&#39;, &#39;Frequency&#39;, &#39;Miscellany&#39;, &#39;Pressure&#39;, &#39;Proportion&#39;, &#39;Rating&#39;, &#39;Temperature&#39;, &#39;Volume&#39;, and &#39;Weight&#39;.
     * @param {module:api/UnitsApi~v1UnitCategoriesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/UnitCategory}
     */
    this.v1UnitCategoriesGet = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = UnitCategory;

      return this.apiClient.callApi(
        '/v1/unitCategories', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1UnitsGet operation.
     * @callback module:api/UnitsApi~v1UnitsGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Unit>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all available units
     * Get all available units
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {Number} opts.id Unit id
     * @param {String} opts.unitName Unit name
     * @param {String} opts.unitAbbreviatedName Restrict the results to a specific unit by providing the unit abbreviation.
     * @param {String} opts.unitCategoryName Restrict the results to a specific unit category by providing the unit category name.
     * @param {module:api/UnitsApi~v1UnitsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Unit>}
     */
    this.v1UnitsGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId'],
        'id': opts['id'],
        'unitName': opts['unitName'],
        'unitAbbreviatedName': opts['unitAbbreviatedName'],
        'unitCategoryName': opts['unitCategoryName']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Unit];

      return this.apiClient.callApi(
        '/v1/units', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1UnitsVariableGet operation.
     * @callback module:api/UnitsApi~v1UnitsVariableGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Unit>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Units for Variable
     * Get a list of all possible units to use for a given variable
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.unitName Name of Unit you want to retrieve
     * @param {String} opts.unitAbbreviatedName Abbreviated Unit Name of the unit you want
     * @param {String} opts.unitCategoryName Name of the category you want units for
     * @param {String} opts.variable Name of the variable you want units for
     * @param {module:api/UnitsApi~v1UnitsVariableGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Unit>}
     */
    this.v1UnitsVariableGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId'],
        'unitName': opts['unitName'],
        'unitAbbreviatedName': opts['unitAbbreviatedName'],
        'unitCategoryName': opts['unitCategoryName'],
        'variable': opts['variable']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Unit];

      return this.apiClient.callApi(
        '/v1/unitsVariable', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":5,"../model/Unit":48,"../model/UnitCategory":49}],15:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/User', 'model/UserTokenFailedResponse', 'model/UserTokenRequest', 'model/UserTokenSuccessfulResponse'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/User'), require('../model/UserTokenFailedResponse'), require('../model/UserTokenRequest'), require('../model/UserTokenSuccessfulResponse'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UserApi = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.User, root.QuantimodoApi.UserTokenFailedResponse, root.QuantimodoApi.UserTokenRequest, root.QuantimodoApi.UserTokenSuccessfulResponse);
  }
}(this, function(ApiClient, User, UserTokenFailedResponse, UserTokenRequest, UserTokenSuccessfulResponse) {
  'use strict';

  /**
   * User service.
   * @module api/UserApi
   * @version 5.8.5
   */

  /**
   * Constructs a new UserApi. 
   * @alias module:api/UserApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1OrganizationsOrganizationIdUsersPost operation.
     * @callback module:api/UserApi~v1OrganizationsOrganizationIdUsersPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/UserTokenSuccessfulResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get user tokens for existing users, create new users
     * Get user tokens for existing users, create new users
     * @param {Number} organizationId Organization ID
     * @param {module:model/UserTokenRequest} body Provides organization token and user ID
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/UserApi~v1OrganizationsOrganizationIdUsersPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/UserTokenSuccessfulResponse}
     */
    this.v1OrganizationsOrganizationIdUsersPost = function(organizationId, body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'organizationId' is set
      if (organizationId == undefined || organizationId == null) {
        throw new Error("Missing the required parameter 'organizationId' when calling v1OrganizationsOrganizationIdUsersPost");
      }

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1OrganizationsOrganizationIdUsersPost");
      }


      var pathParams = {
        'organizationId': organizationId
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = UserTokenSuccessfulResponse;

      return this.apiClient.callApi(
        '/v1/organizations/{organizationId}/users', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1UserMeGet operation.
     * @callback module:api/UserApi~v1UserMeGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/User} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all available units for variableGet authenticated user
     * Returns user info for the currently authenticated user.
     * @param {module:api/UserApi~v1UserMeGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/User}
     */
    this.v1UserMeGet = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = User;

      return this.apiClient.callApi(
        '/v1/user/me', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":5,"../model/User":51,"../model/UserTokenFailedResponse":53,"../model/UserTokenRequest":54,"../model/UserTokenSuccessfulResponse":56}],16:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/UserVariableDelete', 'model/UserVariables', 'model/Variable', 'model/VariableCategory', 'model/VariablesNew'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/UserVariableDelete'), require('../model/UserVariables'), require('../model/Variable'), require('../model/VariableCategory'), require('../model/VariablesNew'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.VariablesApi = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.UserVariableDelete, root.QuantimodoApi.UserVariables, root.QuantimodoApi.Variable, root.QuantimodoApi.VariableCategory, root.QuantimodoApi.VariablesNew);
  }
}(this, function(ApiClient, UserVariableDelete, UserVariables, Variable, VariableCategory, VariablesNew) {
  'use strict';

  /**
   * Variables service.
   * @module api/VariablesApi
   * @version 5.8.5
   */

  /**
   * Constructs a new VariablesApi. 
   * @alias module:api/VariablesApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1PublicVariablesGet operation.
     * @callback module:api/VariablesApi~v1PublicVariablesGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Variable} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get public variables
     * This endpoint retrieves an array of all public variables. Public variables are things like foods, medications, symptoms, conditions, and anything not unique to a particular user. For instance, a telephone number or name would not be a public variable.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {Number} opts.id Common variable id
     * @param {String} opts.category Filter data by category
     * @param {String} opts.name Original name of the variable (supports exact name match only)
     * @param {String} opts.updatedAt Filter by the last time any of the properties of the variable were changed. Uses UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;
     * @param {String} opts.source The name of the data source that created the variable (supports exact name match only). So if you have a client application and you only want variables that were last updated by your app, you can include the name of your app here
     * @param {String} opts.latestMeasurementTime Filter variables based on the last time a measurement for them was created or updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;
     * @param {String} opts.numberOfRawMeasurements Filter variables by the total number of measurements that they have. This could be used of you want to filter or sort by popularity.
     * @param {String} opts.lastSource Limit variables to those which measurements were last submitted by a specific source. So if you have a client application and you only want variables that were last updated by your app, you can include the name of your app here. (supports exact name match only)
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
     * @param {Number} opts.offset Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;.
     * @param {Number} opts.sort Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order.
     * @param {module:api/VariablesApi~v1PublicVariablesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Variable}
     */
    this.v1PublicVariablesGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId'],
        'id': opts['id'],
        'category': opts['category'],
        'name': opts['name'],
        'updatedAt': opts['updatedAt'],
        'source': opts['source'],
        'latestMeasurementTime': opts['latestMeasurementTime'],
        'numberOfRawMeasurements': opts['numberOfRawMeasurements'],
        'lastSource': opts['lastSource'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Variable;

      return this.apiClient.callApi(
        '/v1/public/variables', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1PublicVariablesSearchSearchGet operation.
     * @callback module:api/VariablesApi~v1PublicVariablesSearchSearchGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Variable} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get top 5 PUBLIC variables with the most correlations
     * Get top 5 PUBLIC variables with the most correlations containing the entered search characters. For example, search for &#39;mood&#39; as an effect. Since &#39;Overall Mood&#39; has a lot of correlations with other variables, it should be in the autocomplete list.Supported filter parameters:&lt;ul&gt;&lt;li&gt;&lt;b&gt;category&lt;/b&gt; - Category of Variable&lt;/li&gt;&lt;/ul&gt;
     * @param {String} search Search query can be some fraction of a variable name.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.variableCategoryName Filter variables by category name. The variable categories include Activity, Causes of Illness, Cognitive Performance, Conditions, Environment, Foods, Location, Miscellaneous, Mood, Nutrition, Physical Activity, Physique, Sleep, Social Interactions, Symptoms, Treatments, Vital Signs, and Work.
     * @param {String} opts.source Specify a data source name to only return variables from a specific data source.
     * @param {String} opts.effectOrCause Indicate if you only want variables that have user correlations. Possible values are effect and cause.
     * @param {String} opts.publicEffectOrCause Indicate if you only want variables that have aggregated correlations.  Possible values are effect and cause.
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
     * @param {Number} opts.offset Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;.
     * @param {Number} opts.sort Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order.
     * @param {module:api/VariablesApi~v1PublicVariablesSearchSearchGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Variable}
     */
    this.v1PublicVariablesSearchSearchGet = function(search, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'search' is set
      if (search == undefined || search == null) {
        throw new Error("Missing the required parameter 'search' when calling v1PublicVariablesSearchSearchGet");
      }


      var pathParams = {
        'search': search
      };
      var queryParams = {
        'userId': opts['userId'],
        'variableCategoryName': opts['variableCategoryName'],
        'source': opts['source'],
        'effectOrCause': opts['effectOrCause'],
        'publicEffectOrCause': opts['publicEffectOrCause'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Variable;

      return this.apiClient.callApi(
        '/v1/public/variables/search/{search}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1UserVariablesDeletePost operation.
     * @callback module:api/VariablesApi~v1UserVariablesDeletePostCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete All Measurements For Variable
     * Users can delete all of their measurements for a variable
     * @param {module:model/UserVariableDelete} variableId Id of the variable whose measurements should be deleted
     * @param {module:api/VariablesApi~v1UserVariablesDeletePostCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1UserVariablesDeletePost = function(variableId, callback) {
      var postBody = variableId;

      // verify the required parameter 'variableId' is set
      if (variableId == undefined || variableId == null) {
        throw new Error("Missing the required parameter 'variableId' when calling v1UserVariablesDeletePost");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/userVariables/delete', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1UserVariablesPost operation.
     * @callback module:api/VariablesApi~v1UserVariablesPostCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update User Settings for a Variable
     * Users can change the parameters used in analysis of that variable such as the expected duration of action for a variable to have an effect, the estimated delay before the onset of action. In order to filter out erroneous data, they are able to set the maximum and minimum reasonable daily values for a variable.
     * @param {module:model/UserVariables} userVariables Variable user settings data
     * @param {module:api/VariablesApi~v1UserVariablesPostCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1UserVariablesPost = function(userVariables, callback) {
      var postBody = userVariables;

      // verify the required parameter 'userVariables' is set
      if (userVariables == undefined || userVariables == null) {
        throw new Error("Missing the required parameter 'userVariables' when calling v1UserVariablesPost");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/userVariables', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1UserVariablesResetPost operation.
     * @callback module:api/VariablesApi~v1UserVariablesResetPostCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Reset user settings for a variable to defaults
     * Reset user settings for a variable to defaults
     * @param {module:model/UserVariableDelete} variableId Id of the variable that should be reset
     * @param {module:api/VariablesApi~v1UserVariablesResetPostCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1UserVariablesResetPost = function(variableId, callback) {
      var postBody = variableId;

      // verify the required parameter 'variableId' is set
      if (variableId == undefined || variableId == null) {
        throw new Error("Missing the required parameter 'variableId' when calling v1UserVariablesResetPost");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/userVariables/reset', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1VariableCategoriesGet operation.
     * @callback module:api/VariablesApi~v1VariableCategoriesGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/VariableCategory>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Variable categories
     * The variable categories include Activity, Causes of Illness, Cognitive Performance, Conditions, Environment, Foods, Location, Miscellaneous, Mood, Nutrition, Physical Activity, Physique, Sleep, Social Interactions, Symptoms, Treatments, Vital Signs, and Work.
     * @param {module:api/VariablesApi~v1VariableCategoriesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/VariableCategory>}
     */
    this.v1VariableCategoriesGet = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [VariableCategory];

      return this.apiClient.callApi(
        '/v1/variableCategories', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1VariablesGet operation.
     * @callback module:api/VariablesApi~v1VariablesGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Variable} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get variables with user&#39;s settings
     * Get variables for which the user has measurements. If the user has specified variable settings, these are provided instead of the common variable defaults.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {Number} opts.id Common variable id
     * @param {String} opts.category Filter data by category
     * @param {String} opts.name Original name of the variable (supports exact name match only)
     * @param {String} opts.updatedAt Filter by the last time any of the properties of the variable were changed. Uses UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;
     * @param {String} opts.source The name of the data source that created the variable (supports exact name match only). So if you have a client application and you only want variables that were last updated by your app, you can include the name of your app here
     * @param {String} opts.latestMeasurementTime Filter variables based on the last time a measurement for them was created or updated in the UTC format \&quot;YYYY-MM-DDThh:mm:ss\&quot;
     * @param {String} opts.numberOfRawMeasurements Filter variables by the total number of measurements that they have. This could be used of you want to filter or sort by popularity.
     * @param {String} opts.lastSource Limit variables to those which measurements were last submitted by a specific source. So if you have a client application and you only want variables that were last updated by your app, you can include the name of your app here. (supports exact name match only)
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
     * @param {Number} opts.offset Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;.
     * @param {Number} opts.sort Sort by given field. If the field is prefixed with &#x60;-, it will sort in descending order.
     * @param {module:api/VariablesApi~v1VariablesGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Variable}
     */
    this.v1VariablesGet = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId'],
        'id': opts['id'],
        'category': opts['category'],
        'name': opts['name'],
        'updatedAt': opts['updatedAt'],
        'source': opts['source'],
        'latestMeasurementTime': opts['latestMeasurementTime'],
        'numberOfRawMeasurements': opts['numberOfRawMeasurements'],
        'lastSource': opts['lastSource'],
        'limit': opts['limit'],
        'offset': opts['offset'],
        'sort': opts['sort']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Variable;

      return this.apiClient.callApi(
        '/v1/variables', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1VariablesPost operation.
     * @callback module:api/VariablesApi~v1VariablesPostCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create Variables
     * Allows the client to create a new variable in the &#x60;variables&#x60; table.
     * @param {module:model/VariablesNew} body Original name for the variable.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/VariablesApi~v1VariablesPostCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.v1VariablesPost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1VariablesPost");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/v1/variables', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1VariablesSearchSearchGet operation.
     * @callback module:api/VariablesApi~v1VariablesSearchSearchGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Variable>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get variables by search query
     * Get variables containing the search characters for which the currently logged in user has measurements. Used to provide auto-complete function in variable search boxes.
     * @param {String} search Search query which may be an entire variable name or a fragment of one.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {String} opts.variableCategoryName Filter variables by category name. The variable categories include Activity, Causes of Illness, Cognitive Performance, Conditions, Environment, Foods, Location, Miscellaneous, Mood, Nutrition, Physical Activity, Physique, Sleep, Social Interactions, Symptoms, Treatments, Vital Signs, and Work.
     * @param {Boolean} opts.includePublic Set to true if you would like to include public variables when no user variables are found.
     * @param {Boolean} opts.manualTracking Set to true if you would like to exlude variables like apps and website names.
     * @param {String} opts.source Specify a data source name to only return variables from a specific data source.
     * @param {String} opts.effectOrCause Indicate if you only want variables that have user correlations. Possible values are effect and cause.
     * @param {String} opts.publicEffectOrCause Indicate if you only want variables that have aggregated correlations.  Possible values are effect and cause.
     * @param {Number} opts.limit The LIMIT is used to limit the number of results returned. So if you have 1000 results, but only want to the first 10, you would set this to 10 and offset to 0.
     * @param {Number} opts.offset Since the maximum limit is 200 records, to get more than that you&#39;ll have to make multiple API calls and page through the results. To retrieve all the data, you can iterate through data by using the &#x60;limit&#x60; and &#x60;offset&#x60; query parameters.  For example, if you want to retrieve data from 61-80 then you can use a query with the following parameters, &#x60;imit&#x3D;20&amp;offset&#x3D;60&#x60;.
     * @param {module:api/VariablesApi~v1VariablesSearchSearchGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Variable>}
     */
    this.v1VariablesSearchSearchGet = function(search, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'search' is set
      if (search == undefined || search == null) {
        throw new Error("Missing the required parameter 'search' when calling v1VariablesSearchSearchGet");
      }


      var pathParams = {
        'search': search
      };
      var queryParams = {
        'userId': opts['userId'],
        'variableCategoryName': opts['variableCategoryName'],
        'includePublic': opts['includePublic'],
        'manualTracking': opts['manualTracking'],
        'source': opts['source'],
        'effectOrCause': opts['effectOrCause'],
        'publicEffectOrCause': opts['publicEffectOrCause'],
        'limit': opts['limit'],
        'offset': opts['offset']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [Variable];

      return this.apiClient.callApi(
        '/v1/variables/search/{search}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1VariablesVariableNameGet operation.
     * @callback module:api/VariablesApi~v1VariablesVariableNameGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Variable} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get info about a variable
     * Get all of the settings and information about a variable by its name. If the logged in user has modified the settings for the variable, these will be provided instead of the default settings for that variable.
     * @param {String} variableName Variable name
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/VariablesApi~v1VariablesVariableNameGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Variable}
     */
    this.v1VariablesVariableNameGet = function(variableName, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'variableName' is set
      if (variableName == undefined || variableName == null) {
        throw new Error("Missing the required parameter 'variableName' when calling v1VariablesVariableNameGet");
      }


      var pathParams = {
        'variableName': variableName
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Variable;

      return this.apiClient.callApi(
        '/v1/variables/{variableName}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":5,"../model/UserVariableDelete":59,"../model/UserVariables":61,"../model/Variable":63,"../model/VariableCategory":64,"../model/VariablesNew":66}],17:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CommonResponse', 'model/PostVote', 'model/VoteDelete'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/CommonResponse'), require('../model/PostVote'), require('../model/VoteDelete'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.VotesApi = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.CommonResponse, root.QuantimodoApi.PostVote, root.QuantimodoApi.VoteDelete);
  }
}(this, function(ApiClient, CommonResponse, PostVote, VoteDelete) {
  'use strict';

  /**
   * Votes service.
   * @module api/VotesApi
   * @version 5.8.5
   */

  /**
   * Constructs a new VotesApi. 
   * @alias module:api/VotesApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the v1VotesDeletePost operation.
     * @callback module:api/VotesApi~v1VotesDeletePostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete vote
     * Delete previously posted vote
     * @param {module:model/VoteDelete} body The cause and effect variable names for the predictor vote to be deleted.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/VotesApi~v1VotesDeletePostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1VotesDeletePost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1VotesDeletePost");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/votes/delete', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the v1VotesPost operation.
     * @callback module:api/VotesApi~v1VotesPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CommonResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Post or update vote
     * This is to enable users to indicate their opinion on the plausibility of a causal relationship between a treatment and outcome. QuantiModo incorporates crowd-sourced plausibility estimations into their algorithm. This is done allowing user to indicate their view of the plausibility of each relationship with thumbs up/down buttons placed next to each prediction.
     * @param {module:model/PostVote} body Contains the cause variable, effect variable, and vote value.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.userId User&#39;s id
     * @param {module:api/VotesApi~v1VotesPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CommonResponse}
     */
    this.v1VotesPost = function(body, opts, callback) {
      opts = opts || {};
      var postBody = body;

      // verify the required parameter 'body' is set
      if (body == undefined || body == null) {
        throw new Error("Missing the required parameter 'body' when calling v1VotesPost");
      }


      var pathParams = {
      };
      var queryParams = {
        'userId': opts['userId']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['access_token', 'quantimodo_oauth2'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CommonResponse;

      return this.apiClient.callApi(
        '/v1/votes', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":5,"../model/CommonResponse":19,"../model/PostVote":41,"../model/VoteDelete":68}],18:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CommonResponse', 'model/Connection', 'model/Connector', 'model/ConnectorInfo', 'model/ConnectorInfoHistoryItem', 'model/ConnectorInstruction', 'model/ConversionStep', 'model/Correlation', 'model/HumanTime', 'model/InlineResponse200', 'model/InlineResponse2001', 'model/InlineResponse2002', 'model/JsonErrorResponse', 'model/Measurement', 'model/MeasurementDelete', 'model/MeasurementRange', 'model/MeasurementSet', 'model/MeasurementSource', 'model/MeasurementUpdate', 'model/Pairs', 'model/Permission', 'model/PostCorrelation', 'model/PostVote', 'model/TrackingReminder', 'model/TrackingReminderDelete', 'model/TrackingReminderNotification', 'model/TrackingReminderNotificationSkip', 'model/TrackingReminderNotificationSnooze', 'model/TrackingReminderNotificationTrack', 'model/Unit', 'model/UnitCategory', 'model/Update', 'model/User', 'model/UserTag', 'model/UserTokenFailedResponse', 'model/UserTokenRequest', 'model/UserTokenRequestInnerUserField', 'model/UserTokenSuccessfulResponse', 'model/UserTokenSuccessfulResponseInnerUserField', 'model/UserVariable', 'model/UserVariableDelete', 'model/UserVariableRelationship', 'model/UserVariables', 'model/ValueObject', 'model/Variable', 'model/VariableCategory', 'model/VariableNew', 'model/VariablesNew', 'model/Vote', 'model/VoteDelete', 'api/AuthenticationApi', 'api/ConnectorsApi', 'api/CorrelationsApi', 'api/MeasurementsApi', 'api/OrganizationsApi', 'api/PairsApi', 'api/RemindersApi', 'api/TagsApi', 'api/UnitsApi', 'api/UserApi', 'api/VariablesApi', 'api/VotesApi'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('./ApiClient'), require('./model/CommonResponse'), require('./model/Connection'), require('./model/Connector'), require('./model/ConnectorInfo'), require('./model/ConnectorInfoHistoryItem'), require('./model/ConnectorInstruction'), require('./model/ConversionStep'), require('./model/Correlation'), require('./model/HumanTime'), require('./model/InlineResponse200'), require('./model/InlineResponse2001'), require('./model/InlineResponse2002'), require('./model/JsonErrorResponse'), require('./model/Measurement'), require('./model/MeasurementDelete'), require('./model/MeasurementRange'), require('./model/MeasurementSet'), require('./model/MeasurementSource'), require('./model/MeasurementUpdate'), require('./model/Pairs'), require('./model/Permission'), require('./model/PostCorrelation'), require('./model/PostVote'), require('./model/TrackingReminder'), require('./model/TrackingReminderDelete'), require('./model/TrackingReminderNotification'), require('./model/TrackingReminderNotificationSkip'), require('./model/TrackingReminderNotificationSnooze'), require('./model/TrackingReminderNotificationTrack'), require('./model/Unit'), require('./model/UnitCategory'), require('./model/Update'), require('./model/User'), require('./model/UserTag'), require('./model/UserTokenFailedResponse'), require('./model/UserTokenRequest'), require('./model/UserTokenRequestInnerUserField'), require('./model/UserTokenSuccessfulResponse'), require('./model/UserTokenSuccessfulResponseInnerUserField'), require('./model/UserVariable'), require('./model/UserVariableDelete'), require('./model/UserVariableRelationship'), require('./model/UserVariables'), require('./model/ValueObject'), require('./model/Variable'), require('./model/VariableCategory'), require('./model/VariableNew'), require('./model/VariablesNew'), require('./model/Vote'), require('./model/VoteDelete'), require('./api/AuthenticationApi'), require('./api/ConnectorsApi'), require('./api/CorrelationsApi'), require('./api/MeasurementsApi'), require('./api/OrganizationsApi'), require('./api/PairsApi'), require('./api/RemindersApi'), require('./api/TagsApi'), require('./api/UnitsApi'), require('./api/UserApi'), require('./api/VariablesApi'), require('./api/VotesApi'));
  }
}(function(ApiClient, CommonResponse, Connection, Connector, ConnectorInfo, ConnectorInfoHistoryItem, ConnectorInstruction, ConversionStep, Correlation, HumanTime, InlineResponse200, InlineResponse2001, InlineResponse2002, JsonErrorResponse, Measurement, MeasurementDelete, MeasurementRange, MeasurementSet, MeasurementSource, MeasurementUpdate, Pairs, Permission, PostCorrelation, PostVote, TrackingReminder, TrackingReminderDelete, TrackingReminderNotification, TrackingReminderNotificationSkip, TrackingReminderNotificationSnooze, TrackingReminderNotificationTrack, Unit, UnitCategory, Update, User, UserTag, UserTokenFailedResponse, UserTokenRequest, UserTokenRequestInnerUserField, UserTokenSuccessfulResponse, UserTokenSuccessfulResponseInnerUserField, UserVariable, UserVariableDelete, UserVariableRelationship, UserVariables, ValueObject, Variable, VariableCategory, VariableNew, VariablesNew, Vote, VoteDelete, AuthenticationApi, ConnectorsApi, CorrelationsApi, MeasurementsApi, OrganizationsApi, PairsApi, RemindersApi, TagsApi, UnitsApi, UserApi, VariablesApi, VotesApi) {
  'use strict';

  /**
   * QuantiModo_makes_it_easy_to_retrieve_normalized_user_data_from_a_wide_array_of_devices_and_applications___Learn_about_QuantiModo_httpsquantimo_do_check_out_our__docs_httpsgithub_comQuantiMododocs_or_contact_us_at__help_quantimo_do_httpshelp_quantimo_do_.<br>
   * The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
   * <p>
   * An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
   * <pre>
   * var QuantimodoApi = require('index'); // See note below*.
   * var xxxSvc = new QuantimodoApi.XxxApi(); // Allocate the API class we're going to use.
   * var yyyModel = new QuantimodoApi.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
   * and put the application logic within the callback function.</em>
   * </p>
   * <p>
   * A non-AMD browser application (discouraged) might do something like this:
   * <pre>
   * var xxxSvc = new QuantimodoApi.XxxApi(); // Allocate the API class we're going to use.
   * var yyy = new QuantimodoApi.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * </p>
   * @module index
   * @version 5.8.5
   */
  var exports = {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient: ApiClient,
    /**
     * The CommonResponse model constructor.
     * @property {module:model/CommonResponse}
     */
    CommonResponse: CommonResponse,
    /**
     * The Connection model constructor.
     * @property {module:model/Connection}
     */
    Connection: Connection,
    /**
     * The Connector model constructor.
     * @property {module:model/Connector}
     */
    Connector: Connector,
    /**
     * The ConnectorInfo model constructor.
     * @property {module:model/ConnectorInfo}
     */
    ConnectorInfo: ConnectorInfo,
    /**
     * The ConnectorInfoHistoryItem model constructor.
     * @property {module:model/ConnectorInfoHistoryItem}
     */
    ConnectorInfoHistoryItem: ConnectorInfoHistoryItem,
    /**
     * The ConnectorInstruction model constructor.
     * @property {module:model/ConnectorInstruction}
     */
    ConnectorInstruction: ConnectorInstruction,
    /**
     * The ConversionStep model constructor.
     * @property {module:model/ConversionStep}
     */
    ConversionStep: ConversionStep,
    /**
     * The Correlation model constructor.
     * @property {module:model/Correlation}
     */
    Correlation: Correlation,
    /**
     * The HumanTime model constructor.
     * @property {module:model/HumanTime}
     */
    HumanTime: HumanTime,
    /**
     * The InlineResponse200 model constructor.
     * @property {module:model/InlineResponse200}
     */
    InlineResponse200: InlineResponse200,
    /**
     * The InlineResponse2001 model constructor.
     * @property {module:model/InlineResponse2001}
     */
    InlineResponse2001: InlineResponse2001,
    /**
     * The InlineResponse2002 model constructor.
     * @property {module:model/InlineResponse2002}
     */
    InlineResponse2002: InlineResponse2002,
    /**
     * The JsonErrorResponse model constructor.
     * @property {module:model/JsonErrorResponse}
     */
    JsonErrorResponse: JsonErrorResponse,
    /**
     * The Measurement model constructor.
     * @property {module:model/Measurement}
     */
    Measurement: Measurement,
    /**
     * The MeasurementDelete model constructor.
     * @property {module:model/MeasurementDelete}
     */
    MeasurementDelete: MeasurementDelete,
    /**
     * The MeasurementRange model constructor.
     * @property {module:model/MeasurementRange}
     */
    MeasurementRange: MeasurementRange,
    /**
     * The MeasurementSet model constructor.
     * @property {module:model/MeasurementSet}
     */
    MeasurementSet: MeasurementSet,
    /**
     * The MeasurementSource model constructor.
     * @property {module:model/MeasurementSource}
     */
    MeasurementSource: MeasurementSource,
    /**
     * The MeasurementUpdate model constructor.
     * @property {module:model/MeasurementUpdate}
     */
    MeasurementUpdate: MeasurementUpdate,
    /**
     * The Pairs model constructor.
     * @property {module:model/Pairs}
     */
    Pairs: Pairs,
    /**
     * The Permission model constructor.
     * @property {module:model/Permission}
     */
    Permission: Permission,
    /**
     * The PostCorrelation model constructor.
     * @property {module:model/PostCorrelation}
     */
    PostCorrelation: PostCorrelation,
    /**
     * The PostVote model constructor.
     * @property {module:model/PostVote}
     */
    PostVote: PostVote,
    /**
     * The TrackingReminder model constructor.
     * @property {module:model/TrackingReminder}
     */
    TrackingReminder: TrackingReminder,
    /**
     * The TrackingReminderDelete model constructor.
     * @property {module:model/TrackingReminderDelete}
     */
    TrackingReminderDelete: TrackingReminderDelete,
    /**
     * The TrackingReminderNotification model constructor.
     * @property {module:model/TrackingReminderNotification}
     */
    TrackingReminderNotification: TrackingReminderNotification,
    /**
     * The TrackingReminderNotificationSkip model constructor.
     * @property {module:model/TrackingReminderNotificationSkip}
     */
    TrackingReminderNotificationSkip: TrackingReminderNotificationSkip,
    /**
     * The TrackingReminderNotificationSnooze model constructor.
     * @property {module:model/TrackingReminderNotificationSnooze}
     */
    TrackingReminderNotificationSnooze: TrackingReminderNotificationSnooze,
    /**
     * The TrackingReminderNotificationTrack model constructor.
     * @property {module:model/TrackingReminderNotificationTrack}
     */
    TrackingReminderNotificationTrack: TrackingReminderNotificationTrack,
    /**
     * The Unit model constructor.
     * @property {module:model/Unit}
     */
    Unit: Unit,
    /**
     * The UnitCategory model constructor.
     * @property {module:model/UnitCategory}
     */
    UnitCategory: UnitCategory,
    /**
     * The Update model constructor.
     * @property {module:model/Update}
     */
    Update: Update,
    /**
     * The User model constructor.
     * @property {module:model/User}
     */
    User: User,
    /**
     * The UserTag model constructor.
     * @property {module:model/UserTag}
     */
    UserTag: UserTag,
    /**
     * The UserTokenFailedResponse model constructor.
     * @property {module:model/UserTokenFailedResponse}
     */
    UserTokenFailedResponse: UserTokenFailedResponse,
    /**
     * The UserTokenRequest model constructor.
     * @property {module:model/UserTokenRequest}
     */
    UserTokenRequest: UserTokenRequest,
    /**
     * The UserTokenRequestInnerUserField model constructor.
     * @property {module:model/UserTokenRequestInnerUserField}
     */
    UserTokenRequestInnerUserField: UserTokenRequestInnerUserField,
    /**
     * The UserTokenSuccessfulResponse model constructor.
     * @property {module:model/UserTokenSuccessfulResponse}
     */
    UserTokenSuccessfulResponse: UserTokenSuccessfulResponse,
    /**
     * The UserTokenSuccessfulResponseInnerUserField model constructor.
     * @property {module:model/UserTokenSuccessfulResponseInnerUserField}
     */
    UserTokenSuccessfulResponseInnerUserField: UserTokenSuccessfulResponseInnerUserField,
    /**
     * The UserVariable model constructor.
     * @property {module:model/UserVariable}
     */
    UserVariable: UserVariable,
    /**
     * The UserVariableDelete model constructor.
     * @property {module:model/UserVariableDelete}
     */
    UserVariableDelete: UserVariableDelete,
    /**
     * The UserVariableRelationship model constructor.
     * @property {module:model/UserVariableRelationship}
     */
    UserVariableRelationship: UserVariableRelationship,
    /**
     * The UserVariables model constructor.
     * @property {module:model/UserVariables}
     */
    UserVariables: UserVariables,
    /**
     * The ValueObject model constructor.
     * @property {module:model/ValueObject}
     */
    ValueObject: ValueObject,
    /**
     * The Variable model constructor.
     * @property {module:model/Variable}
     */
    Variable: Variable,
    /**
     * The VariableCategory model constructor.
     * @property {module:model/VariableCategory}
     */
    VariableCategory: VariableCategory,
    /**
     * The VariableNew model constructor.
     * @property {module:model/VariableNew}
     */
    VariableNew: VariableNew,
    /**
     * The VariablesNew model constructor.
     * @property {module:model/VariablesNew}
     */
    VariablesNew: VariablesNew,
    /**
     * The Vote model constructor.
     * @property {module:model/Vote}
     */
    Vote: Vote,
    /**
     * The VoteDelete model constructor.
     * @property {module:model/VoteDelete}
     */
    VoteDelete: VoteDelete,
    /**
     * The AuthenticationApi service constructor.
     * @property {module:api/AuthenticationApi}
     */
    AuthenticationApi: AuthenticationApi,
    /**
     * The ConnectorsApi service constructor.
     * @property {module:api/ConnectorsApi}
     */
    ConnectorsApi: ConnectorsApi,
    /**
     * The CorrelationsApi service constructor.
     * @property {module:api/CorrelationsApi}
     */
    CorrelationsApi: CorrelationsApi,
    /**
     * The MeasurementsApi service constructor.
     * @property {module:api/MeasurementsApi}
     */
    MeasurementsApi: MeasurementsApi,
    /**
     * The OrganizationsApi service constructor.
     * @property {module:api/OrganizationsApi}
     */
    OrganizationsApi: OrganizationsApi,
    /**
     * The PairsApi service constructor.
     * @property {module:api/PairsApi}
     */
    PairsApi: PairsApi,
    /**
     * The RemindersApi service constructor.
     * @property {module:api/RemindersApi}
     */
    RemindersApi: RemindersApi,
    /**
     * The TagsApi service constructor.
     * @property {module:api/TagsApi}
     */
    TagsApi: TagsApi,
    /**
     * The UnitsApi service constructor.
     * @property {module:api/UnitsApi}
     */
    UnitsApi: UnitsApi,
    /**
     * The UserApi service constructor.
     * @property {module:api/UserApi}
     */
    UserApi: UserApi,
    /**
     * The VariablesApi service constructor.
     * @property {module:api/VariablesApi}
     */
    VariablesApi: VariablesApi,
    /**
     * The VotesApi service constructor.
     * @property {module:api/VotesApi}
     */
    VotesApi: VotesApi
  };

  return exports;
}));

},{"./ApiClient":5,"./api/AuthenticationApi":6,"./api/ConnectorsApi":7,"./api/CorrelationsApi":8,"./api/MeasurementsApi":9,"./api/OrganizationsApi":10,"./api/PairsApi":11,"./api/RemindersApi":12,"./api/TagsApi":13,"./api/UnitsApi":14,"./api/UserApi":15,"./api/VariablesApi":16,"./api/VotesApi":17,"./model/CommonResponse":19,"./model/Connection":20,"./model/Connector":21,"./model/ConnectorInfo":22,"./model/ConnectorInfoHistoryItem":23,"./model/ConnectorInstruction":24,"./model/ConversionStep":25,"./model/Correlation":26,"./model/HumanTime":27,"./model/InlineResponse200":28,"./model/InlineResponse2001":29,"./model/InlineResponse2002":30,"./model/JsonErrorResponse":31,"./model/Measurement":32,"./model/MeasurementDelete":33,"./model/MeasurementRange":34,"./model/MeasurementSet":35,"./model/MeasurementSource":36,"./model/MeasurementUpdate":37,"./model/Pairs":38,"./model/Permission":39,"./model/PostCorrelation":40,"./model/PostVote":41,"./model/TrackingReminder":42,"./model/TrackingReminderDelete":43,"./model/TrackingReminderNotification":44,"./model/TrackingReminderNotificationSkip":45,"./model/TrackingReminderNotificationSnooze":46,"./model/TrackingReminderNotificationTrack":47,"./model/Unit":48,"./model/UnitCategory":49,"./model/Update":50,"./model/User":51,"./model/UserTag":52,"./model/UserTokenFailedResponse":53,"./model/UserTokenRequest":54,"./model/UserTokenRequestInnerUserField":55,"./model/UserTokenSuccessfulResponse":56,"./model/UserTokenSuccessfulResponseInnerUserField":57,"./model/UserVariable":58,"./model/UserVariableDelete":59,"./model/UserVariableRelationship":60,"./model/UserVariables":61,"./model/ValueObject":62,"./model/Variable":63,"./model/VariableCategory":64,"./model/VariableNew":65,"./model/VariablesNew":66,"./model/Vote":67,"./model/VoteDelete":68}],19:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.CommonResponse = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The CommonResponse model module.
   * @module model/CommonResponse
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>CommonResponse</code>.
   * @alias module:model/CommonResponse
   * @class
   * @param status {Number} Status code
   * @param success {Boolean} 
   */
  var exports = function(status, success) {
    var _this = this;

    _this['status'] = status;

    _this['success'] = success;
  };

  /**
   * Constructs a <code>CommonResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CommonResponse} obj Optional instance to populate.
   * @return {module:model/CommonResponse} The populated <code>CommonResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'Number');
      }
      if (data.hasOwnProperty('message')) {
        obj['message'] = ApiClient.convertToType(data['message'], 'String');
      }
      if (data.hasOwnProperty('success')) {
        obj['success'] = ApiClient.convertToType(data['success'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * Status code
   * @member {Number} status
   */
  exports.prototype['status'] = undefined;
  /**
   * Message
   * @member {String} message
   */
  exports.prototype['message'] = undefined;
  /**
   * @member {Boolean} success
   */
  exports.prototype['success'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],20:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.Connection = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Connection model module.
   * @module model/Connection
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>Connection</code>.
   * @alias module:model/Connection
   * @class
   * @param connectorId {Number} The id for the connector data source for which the connection is connected
   */
  var exports = function(connectorId) {
    var _this = this;



    _this['connectorId'] = connectorId;








  };

  /**
   * Constructs a <code>Connection</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Connection} obj Optional instance to populate.
   * @return {module:model/Connection} The populated <code>Connection</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('userId')) {
        obj['userId'] = ApiClient.convertToType(data['userId'], 'Number');
      }
      if (data.hasOwnProperty('connectorId')) {
        obj['connectorId'] = ApiClient.convertToType(data['connectorId'], 'Number');
      }
      if (data.hasOwnProperty('connectStatus')) {
        obj['connectStatus'] = ApiClient.convertToType(data['connectStatus'], 'String');
      }
      if (data.hasOwnProperty('connectError')) {
        obj['connectError'] = ApiClient.convertToType(data['connectError'], 'String');
      }
      if (data.hasOwnProperty('updateRequestedAt')) {
        obj['updateRequestedAt'] = ApiClient.convertToType(data['updateRequestedAt'], 'Date');
      }
      if (data.hasOwnProperty('updateStatus')) {
        obj['updateStatus'] = ApiClient.convertToType(data['updateStatus'], 'String');
      }
      if (data.hasOwnProperty('updateError')) {
        obj['updateError'] = ApiClient.convertToType(data['updateError'], 'String');
      }
      if (data.hasOwnProperty('lastSuccessfulUpdatedAt')) {
        obj['lastSuccessfulUpdatedAt'] = ApiClient.convertToType(data['lastSuccessfulUpdatedAt'], 'Date');
      }
      if (data.hasOwnProperty('createdAt')) {
        obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Date');
      }
      if (data.hasOwnProperty('updatedAt')) {
        obj['updatedAt'] = ApiClient.convertToType(data['updatedAt'], 'Date');
      }
    }
    return obj;
  }

  /**
   * id
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * ID of user that owns this correlation
   * @member {Number} userId
   */
  exports.prototype['userId'] = undefined;
  /**
   * The id for the connector data source for which the connection is connected
   * @member {Number} connectorId
   */
  exports.prototype['connectorId'] = undefined;
  /**
   * Indicates whether a connector is currently connected to a service for a user.
   * @member {String} connectStatus
   */
  exports.prototype['connectStatus'] = undefined;
  /**
   * Error message if there is a problem with authorizing this connection.
   * @member {String} connectError
   */
  exports.prototype['connectError'] = undefined;
  /**
   * Time at which an update was requested by a user.
   * @member {Date} updateRequestedAt
   */
  exports.prototype['updateRequestedAt'] = undefined;
  /**
   * Indicates whether a connector is currently updated.
   * @member {String} updateStatus
   */
  exports.prototype['updateStatus'] = undefined;
  /**
   * Indicates if there was an error during the update.
   * @member {String} updateError
   */
  exports.prototype['updateError'] = undefined;
  /**
   * The time at which the connector was last successfully updated.
   * @member {Date} lastSuccessfulUpdatedAt
   */
  exports.prototype['lastSuccessfulUpdatedAt'] = undefined;
  /**
   * When the record was first created. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} createdAt
   */
  exports.prototype['createdAt'] = undefined;
  /**
   * When the record in the database was last updated. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} updatedAt
   */
  exports.prototype['updatedAt'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],21:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.Connector = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Connector model module.
   * @module model/Connector
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>Connector</code>.
   * @alias module:model/Connector
   * @class
   * @param id {Number} Connector ID number
   * @param name {String} Connector lowercase system name
   * @param displayName {String} Connector pretty display name
   * @param image {String} URL to the image of the connector logo
   * @param getItUrl {String} URL to a site where one can get this device or application
   * @param connected {String} True if the authenticated user has this connector enabled
   * @param connectInstructions {String} URL and parameters used when connecting to a service
   * @param lastUpdate {Number} Epoch timestamp of last sync
   * @param totalMeasurementsInLastUpdate {Number} Number of measurements obtained during latest update
   */
  var exports = function(id, name, displayName, image, getItUrl, connected, connectInstructions, lastUpdate, totalMeasurementsInLastUpdate) {
    var _this = this;

    _this['id'] = id;
    _this['name'] = name;
    _this['displayName'] = displayName;
    _this['image'] = image;
    _this['getItUrl'] = getItUrl;
    _this['connected'] = connected;
    _this['connectInstructions'] = connectInstructions;
    _this['lastUpdate'] = lastUpdate;
    _this['totalMeasurementsInLastUpdate'] = totalMeasurementsInLastUpdate;
  };

  /**
   * Constructs a <code>Connector</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Connector} obj Optional instance to populate.
   * @return {module:model/Connector} The populated <code>Connector</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('displayName')) {
        obj['displayName'] = ApiClient.convertToType(data['displayName'], 'String');
      }
      if (data.hasOwnProperty('image')) {
        obj['image'] = ApiClient.convertToType(data['image'], 'String');
      }
      if (data.hasOwnProperty('getItUrl')) {
        obj['getItUrl'] = ApiClient.convertToType(data['getItUrl'], 'String');
      }
      if (data.hasOwnProperty('connected')) {
        obj['connected'] = ApiClient.convertToType(data['connected'], 'String');
      }
      if (data.hasOwnProperty('connectInstructions')) {
        obj['connectInstructions'] = ApiClient.convertToType(data['connectInstructions'], 'String');
      }
      if (data.hasOwnProperty('lastUpdate')) {
        obj['lastUpdate'] = ApiClient.convertToType(data['lastUpdate'], 'Number');
      }
      if (data.hasOwnProperty('totalMeasurementsInLastUpdate')) {
        obj['totalMeasurementsInLastUpdate'] = ApiClient.convertToType(data['totalMeasurementsInLastUpdate'], 'Number');
      }
    }
    return obj;
  }

  /**
   * Connector ID number
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * Connector lowercase system name
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Connector pretty display name
   * @member {String} displayName
   */
  exports.prototype['displayName'] = undefined;
  /**
   * URL to the image of the connector logo
   * @member {String} image
   */
  exports.prototype['image'] = undefined;
  /**
   * URL to a site where one can get this device or application
   * @member {String} getItUrl
   */
  exports.prototype['getItUrl'] = undefined;
  /**
   * True if the authenticated user has this connector enabled
   * @member {String} connected
   */
  exports.prototype['connected'] = undefined;
  /**
   * URL and parameters used when connecting to a service
   * @member {String} connectInstructions
   */
  exports.prototype['connectInstructions'] = undefined;
  /**
   * Epoch timestamp of last sync
   * @member {Number} lastUpdate
   */
  exports.prototype['lastUpdate'] = undefined;
  /**
   * Number of measurements obtained during latest update
   * @member {Number} totalMeasurementsInLastUpdate
   */
  exports.prototype['totalMeasurementsInLastUpdate'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],22:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/ConnectorInfoHistoryItem'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./ConnectorInfoHistoryItem'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.ConnectorInfo = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.ConnectorInfoHistoryItem);
  }
}(this, function(ApiClient, ConnectorInfoHistoryItem) {
  'use strict';




  /**
   * The ConnectorInfo model module.
   * @module model/ConnectorInfo
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>ConnectorInfo</code>.
   * @alias module:model/ConnectorInfo
   * @class
   * @param id {Number} Connector ID number
   * @param connected {Boolean} True if the authenticated user has this connector enabled
   * @param error {String} Error message. Empty if connected.
   * @param history {Array.<module:model/ConnectorInfoHistoryItem>} 
   */
  var exports = function(id, connected, error, history) {
    var _this = this;

    _this['id'] = id;
    _this['connected'] = connected;
    _this['error'] = error;
    _this['history'] = history;
  };

  /**
   * Constructs a <code>ConnectorInfo</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ConnectorInfo} obj Optional instance to populate.
   * @return {module:model/ConnectorInfo} The populated <code>ConnectorInfo</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('connected')) {
        obj['connected'] = ApiClient.convertToType(data['connected'], 'Boolean');
      }
      if (data.hasOwnProperty('error')) {
        obj['error'] = ApiClient.convertToType(data['error'], 'String');
      }
      if (data.hasOwnProperty('history')) {
        obj['history'] = ApiClient.convertToType(data['history'], [ConnectorInfoHistoryItem]);
      }
    }
    return obj;
  }

  /**
   * Connector ID number
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * True if the authenticated user has this connector enabled
   * @member {Boolean} connected
   */
  exports.prototype['connected'] = undefined;
  /**
   * Error message. Empty if connected.
   * @member {String} error
   */
  exports.prototype['error'] = undefined;
  /**
   * @member {Array.<module:model/ConnectorInfoHistoryItem>} history
   */
  exports.prototype['history'] = undefined;



  return exports;
}));



},{"../ApiClient":5,"./ConnectorInfoHistoryItem":23}],23:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.ConnectorInfoHistoryItem = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ConnectorInfoHistoryItem model module.
   * @module model/ConnectorInfoHistoryItem
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>ConnectorInfoHistoryItem</code>.
   * @alias module:model/ConnectorInfoHistoryItem
   * @class
   * @param numberOfMeasurements {Number} Number of measurements
   * @param success {Boolean} True if the update was successfull
   * @param message {String} Error message.
   * @param createdAt {String} Date and time of the update in UTC time zone
   */
  var exports = function(numberOfMeasurements, success, message, createdAt) {
    var _this = this;

    _this['numberOfMeasurements'] = numberOfMeasurements;
    _this['success'] = success;
    _this['message'] = message;
    _this['createdAt'] = createdAt;
  };

  /**
   * Constructs a <code>ConnectorInfoHistoryItem</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ConnectorInfoHistoryItem} obj Optional instance to populate.
   * @return {module:model/ConnectorInfoHistoryItem} The populated <code>ConnectorInfoHistoryItem</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('numberOfMeasurements')) {
        obj['numberOfMeasurements'] = ApiClient.convertToType(data['numberOfMeasurements'], 'Number');
      }
      if (data.hasOwnProperty('success')) {
        obj['success'] = ApiClient.convertToType(data['success'], 'Boolean');
      }
      if (data.hasOwnProperty('message')) {
        obj['message'] = ApiClient.convertToType(data['message'], 'String');
      }
      if (data.hasOwnProperty('createdAt')) {
        obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'String');
      }
    }
    return obj;
  }

  /**
   * Number of measurements
   * @member {Number} numberOfMeasurements
   */
  exports.prototype['numberOfMeasurements'] = undefined;
  /**
   * True if the update was successfull
   * @member {Boolean} success
   */
  exports.prototype['success'] = undefined;
  /**
   * Error message.
   * @member {String} message
   */
  exports.prototype['message'] = undefined;
  /**
   * Date and time of the update in UTC time zone
   * @member {String} createdAt
   */
  exports.prototype['createdAt'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],24:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.ConnectorInstruction = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ConnectorInstruction model module.
   * @module model/ConnectorInstruction
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>ConnectorInstruction</code>.
   * @alias module:model/ConnectorInstruction
   * @class
   */
  var exports = function() {
    var _this = this;




  };

  /**
   * Constructs a <code>ConnectorInstruction</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ConnectorInstruction} obj Optional instance to populate.
   * @return {module:model/ConnectorInstruction} The populated <code>ConnectorInstruction</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('url')) {
        obj['url'] = ApiClient.convertToType(data['url'], 'String');
      }
      if (data.hasOwnProperty('parameters')) {
        obj['parameters'] = ApiClient.convertToType(data['parameters'], ['String']);
      }
      if (data.hasOwnProperty('usePopup')) {
        obj['usePopup'] = ApiClient.convertToType(data['usePopup'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * url
   * @member {String} url
   */
  exports.prototype['url'] = undefined;
  /**
   * parameters array
   * @member {Array.<String>} parameters
   */
  exports.prototype['parameters'] = undefined;
  /**
   * usePopup
   * @member {Boolean} usePopup
   */
  exports.prototype['usePopup'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],25:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.ConversionStep = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ConversionStep model module.
   * @module model/ConversionStep
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>ConversionStep</code>.
   * @alias module:model/ConversionStep
   * @class
   * @param operation {module:model/ConversionStep.OperationEnum} ADD or MULTIPLY
   * @param value {Number} This specifies the order of conversion steps starting with 0
   */
  var exports = function(operation, value) {
    var _this = this;

    _this['operation'] = operation;
    _this['value'] = value;
  };

  /**
   * Constructs a <code>ConversionStep</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ConversionStep} obj Optional instance to populate.
   * @return {module:model/ConversionStep} The populated <code>ConversionStep</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('operation')) {
        obj['operation'] = ApiClient.convertToType(data['operation'], 'String');
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'Number');
      }
    }
    return obj;
  }

  /**
   * ADD or MULTIPLY
   * @member {module:model/ConversionStep.OperationEnum} operation
   */
  exports.prototype['operation'] = undefined;
  /**
   * This specifies the order of conversion steps starting with 0
   * @member {Number} value
   */
  exports.prototype['value'] = undefined;


  /**
   * Allowed values for the <code>operation</code> property.
   * @enum {String}
   * @readonly
   */
  exports.OperationEnum = {
    /**
     * value: "MULTIPLY"
     * @const
     */
    "MULTIPLY": "MULTIPLY",
    /**
     * value: "ADD"
     * @const
     */
    "ADD": "ADD"  };


  return exports;
}));



},{"../ApiClient":5}],26:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.Correlation = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Correlation model module.
   * @module model/Correlation
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>Correlation</code>.
   * @alias module:model/Correlation
   * @class
   * @param cause {String} Variable name of the cause variable for which the user desires correlations.
   * @param correlationCoefficient {Number} Pearson correlation coefficient between cause and effect measurements
   * @param durationOfAction {Number} The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
   * @param effect {String} Variable name of the effect variable for which the user desires correlations.
   * @param numberOfPairs {Number} Number of points that went into the correlation calculation
   * @param onsetDelay {Number} The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
   * @param timestamp {Number} Time at which correlation was calculated
   */
  var exports = function(cause, correlationCoefficient, durationOfAction, effect, numberOfPairs, onsetDelay, timestamp) {
    var _this = this;










    _this['cause'] = cause;









    _this['correlationCoefficient'] = correlationCoefficient;



    _this['durationOfAction'] = durationOfAction;
    _this['effect'] = effect;








    _this['numberOfPairs'] = numberOfPairs;
    _this['onsetDelay'] = onsetDelay;





















    _this['timestamp'] = timestamp;






  };

  /**
   * Constructs a <code>Correlation</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Correlation} obj Optional instance to populate.
   * @return {module:model/Correlation} The populated <code>Correlation</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('averageDailyLowCause')) {
        obj['averageDailyLowCause'] = ApiClient.convertToType(data['averageDailyLowCause'], 'Number');
      }
      if (data.hasOwnProperty('averageDailyHighCause')) {
        obj['averageDailyHighCause'] = ApiClient.convertToType(data['averageDailyHighCause'], 'Number');
      }
      if (data.hasOwnProperty('averageEffect')) {
        obj['averageEffect'] = ApiClient.convertToType(data['averageEffect'], 'Number');
      }
      if (data.hasOwnProperty('averageEffectFollowingHighCause')) {
        obj['averageEffectFollowingHighCause'] = ApiClient.convertToType(data['averageEffectFollowingHighCause'], 'Number');
      }
      if (data.hasOwnProperty('averageEffectFollowingLowCause')) {
        obj['averageEffectFollowingLowCause'] = ApiClient.convertToType(data['averageEffectFollowingLowCause'], 'Number');
      }
      if (data.hasOwnProperty('averageEffectFollowingHighCauseExplanation')) {
        obj['averageEffectFollowingHighCauseExplanation'] = ApiClient.convertToType(data['averageEffectFollowingHighCauseExplanation'], 'String');
      }
      if (data.hasOwnProperty('averageEffectFollowingLowCauseExplanation')) {
        obj['averageEffectFollowingLowCauseExplanation'] = ApiClient.convertToType(data['averageEffectFollowingLowCauseExplanation'], 'String');
      }
      if (data.hasOwnProperty('averageVote')) {
        obj['averageVote'] = ApiClient.convertToType(data['averageVote'], 'Number');
      }
      if (data.hasOwnProperty('causalityFactor')) {
        obj['causalityFactor'] = ApiClient.convertToType(data['causalityFactor'], 'Number');
      }
      if (data.hasOwnProperty('cause')) {
        obj['cause'] = ApiClient.convertToType(data['cause'], 'String');
      }
      if (data.hasOwnProperty('causeVariableCategoryName')) {
        obj['causeVariableCategoryName'] = ApiClient.convertToType(data['causeVariableCategoryName'], 'String');
      }
      if (data.hasOwnProperty('causeChanges')) {
        obj['causeChanges'] = ApiClient.convertToType(data['causeChanges'], 'Number');
      }
      if (data.hasOwnProperty('causeVariableCombinationOperation')) {
        obj['causeVariableCombinationOperation'] = ApiClient.convertToType(data['causeVariableCombinationOperation'], 'String');
      }
      if (data.hasOwnProperty('causeVariableImageUrl')) {
        obj['causeVariableImageUrl'] = ApiClient.convertToType(data['causeVariableImageUrl'], 'String');
      }
      if (data.hasOwnProperty('causeVariableIonIcon')) {
        obj['causeVariableIonIcon'] = ApiClient.convertToType(data['causeVariableIonIcon'], 'String');
      }
      if (data.hasOwnProperty('causeUnit')) {
        obj['causeUnit'] = ApiClient.convertToType(data['causeUnit'], 'String');
      }
      if (data.hasOwnProperty('causeVariableDefaultUnitId')) {
        obj['causeVariableDefaultUnitId'] = ApiClient.convertToType(data['causeVariableDefaultUnitId'], 'Number');
      }
      if (data.hasOwnProperty('causeVariableId')) {
        obj['causeVariableId'] = ApiClient.convertToType(data['causeVariableId'], 'Number');
      }
      if (data.hasOwnProperty('causeVariableName')) {
        obj['causeVariableName'] = ApiClient.convertToType(data['causeVariableName'], 'String');
      }
      if (data.hasOwnProperty('correlationCoefficient')) {
        obj['correlationCoefficient'] = ApiClient.convertToType(data['correlationCoefficient'], 'Number');
      }
      if (data.hasOwnProperty('createdAt')) {
        obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Date');
      }
      if (data.hasOwnProperty('dataAnalysis')) {
        obj['dataAnalysis'] = ApiClient.convertToType(data['dataAnalysis'], 'String');
      }
      if (data.hasOwnProperty('dataSources')) {
        obj['dataSources'] = ApiClient.convertToType(data['dataSources'], 'String');
      }
      if (data.hasOwnProperty('durationOfAction')) {
        obj['durationOfAction'] = ApiClient.convertToType(data['durationOfAction'], 'Number');
      }
      if (data.hasOwnProperty('effect')) {
        obj['effect'] = ApiClient.convertToType(data['effect'], 'String');
      }
      if (data.hasOwnProperty('effectVariableCategoryName')) {
        obj['effectVariableCategoryName'] = ApiClient.convertToType(data['effectVariableCategoryName'], 'String');
      }
      if (data.hasOwnProperty('effectVariableImageUrl')) {
        obj['effectVariableImageUrl'] = ApiClient.convertToType(data['effectVariableImageUrl'], 'String');
      }
      if (data.hasOwnProperty('effectVariableIonIcon')) {
        obj['effectVariableIonIcon'] = ApiClient.convertToType(data['effectVariableIonIcon'], 'String');
      }
      if (data.hasOwnProperty('effectSize')) {
        obj['effectSize'] = ApiClient.convertToType(data['effectSize'], 'String');
      }
      if (data.hasOwnProperty('effectVariableId')) {
        obj['effectVariableId'] = ApiClient.convertToType(data['effectVariableId'], 'String');
      }
      if (data.hasOwnProperty('effectVariableName')) {
        obj['effectVariableName'] = ApiClient.convertToType(data['effectVariableName'], 'String');
      }
      if (data.hasOwnProperty('gaugeImage')) {
        obj['gaugeImage'] = ApiClient.convertToType(data['gaugeImage'], 'String');
      }
      if (data.hasOwnProperty('imageUrl')) {
        obj['imageUrl'] = ApiClient.convertToType(data['imageUrl'], 'String');
      }
      if (data.hasOwnProperty('numberOfPairs')) {
        obj['numberOfPairs'] = ApiClient.convertToType(data['numberOfPairs'], 'Number');
      }
      if (data.hasOwnProperty('onsetDelay')) {
        obj['onsetDelay'] = ApiClient.convertToType(data['onsetDelay'], 'Number');
      }
      if (data.hasOwnProperty('optimalPearsonProduct')) {
        obj['optimalPearsonProduct'] = ApiClient.convertToType(data['optimalPearsonProduct'], 'Number');
      }
      if (data.hasOwnProperty('outcomeDataSources')) {
        obj['outcomeDataSources'] = ApiClient.convertToType(data['outcomeDataSources'], 'String');
      }
      if (data.hasOwnProperty('predictorExplanation')) {
        obj['predictorExplanation'] = ApiClient.convertToType(data['predictorExplanation'], 'String');
      }
      if (data.hasOwnProperty('principalInvestigator')) {
        obj['principalInvestigator'] = ApiClient.convertToType(data['principalInvestigator'], 'String');
      }
      if (data.hasOwnProperty('qmScore')) {
        obj['qmScore'] = ApiClient.convertToType(data['qmScore'], 'Number');
      }
      if (data.hasOwnProperty('reverseCorrelation')) {
        obj['reverseCorrelation'] = ApiClient.convertToType(data['reverseCorrelation'], 'Number');
      }
      if (data.hasOwnProperty('significanceExplanation')) {
        obj['significanceExplanation'] = ApiClient.convertToType(data['significanceExplanation'], 'String');
      }
      if (data.hasOwnProperty('statisticalSignificance')) {
        obj['statisticalSignificance'] = ApiClient.convertToType(data['statisticalSignificance'], 'String');
      }
      if (data.hasOwnProperty('strengthLevel')) {
        obj['strengthLevel'] = ApiClient.convertToType(data['strengthLevel'], 'String');
      }
      if (data.hasOwnProperty('studyAbstract')) {
        obj['studyAbstract'] = ApiClient.convertToType(data['studyAbstract'], 'String');
      }
      if (data.hasOwnProperty('studyBackground')) {
        obj['studyBackground'] = ApiClient.convertToType(data['studyBackground'], 'String');
      }
      if (data.hasOwnProperty('studyDesign')) {
        obj['studyDesign'] = ApiClient.convertToType(data['studyDesign'], 'String');
      }
      if (data.hasOwnProperty('studyLimitations')) {
        obj['studyLimitations'] = ApiClient.convertToType(data['studyLimitations'], 'String');
      }
      if (data.hasOwnProperty('studyLinkDynamic')) {
        obj['studyLinkDynamic'] = ApiClient.convertToType(data['studyLinkDynamic'], 'String');
      }
      if (data.hasOwnProperty('studyLinkFacebook')) {
        obj['studyLinkFacebook'] = ApiClient.convertToType(data['studyLinkFacebook'], 'String');
      }
      if (data.hasOwnProperty('studyLinkGoogle')) {
        obj['studyLinkGoogle'] = ApiClient.convertToType(data['studyLinkGoogle'], 'String');
      }
      if (data.hasOwnProperty('studyLinkTwitter')) {
        obj['studyLinkTwitter'] = ApiClient.convertToType(data['studyLinkTwitter'], 'String');
      }
      if (data.hasOwnProperty('studyLinkStatic')) {
        obj['studyLinkStatic'] = ApiClient.convertToType(data['studyLinkStatic'], 'String');
      }
      if (data.hasOwnProperty('studyObjective')) {
        obj['studyObjective'] = ApiClient.convertToType(data['studyObjective'], 'String');
      }
      if (data.hasOwnProperty('studyResults')) {
        obj['studyResults'] = ApiClient.convertToType(data['studyResults'], 'String');
      }
      if (data.hasOwnProperty('studyTitle')) {
        obj['studyTitle'] = ApiClient.convertToType(data['studyTitle'], 'String');
      }
      if (data.hasOwnProperty('timestamp')) {
        obj['timestamp'] = ApiClient.convertToType(data['timestamp'], 'Number');
      }
      if (data.hasOwnProperty('updatedAt')) {
        obj['updatedAt'] = ApiClient.convertToType(data['updatedAt'], 'Date');
      }
      if (data.hasOwnProperty('userVote')) {
        obj['userVote'] = ApiClient.convertToType(data['userVote'], 'Number');
      }
      if (data.hasOwnProperty('valuePredictingHighOutcome')) {
        obj['valuePredictingHighOutcome'] = ApiClient.convertToType(data['valuePredictingHighOutcome'], 'Number');
      }
      if (data.hasOwnProperty('valuePredictingHighOutcomeExplanation')) {
        obj['valuePredictingHighOutcomeExplanation'] = ApiClient.convertToType(data['valuePredictingHighOutcomeExplanation'], 'String');
      }
      if (data.hasOwnProperty('valuePredictingLowOutcome')) {
        obj['valuePredictingLowOutcome'] = ApiClient.convertToType(data['valuePredictingLowOutcome'], 'Number');
      }
      if (data.hasOwnProperty('valuePredictingLowOutcomeExplanation')) {
        obj['valuePredictingLowOutcomeExplanation'] = ApiClient.convertToType(data['valuePredictingLowOutcomeExplanation'], 'String');
      }
    }
    return obj;
  }

  /**
   * 
   * @member {Number} averageDailyLowCause
   */
  exports.prototype['averageDailyLowCause'] = undefined;
  /**
   * 
   * @member {Number} averageDailyHighCause
   */
  exports.prototype['averageDailyHighCause'] = undefined;
  /**
   * 
   * @member {Number} averageEffect
   */
  exports.prototype['averageEffect'] = undefined;
  /**
   * 
   * @member {Number} averageEffectFollowingHighCause
   */
  exports.prototype['averageEffectFollowingHighCause'] = undefined;
  /**
   * 
   * @member {Number} averageEffectFollowingLowCause
   */
  exports.prototype['averageEffectFollowingLowCause'] = undefined;
  /**
   * 
   * @member {String} averageEffectFollowingHighCauseExplanation
   */
  exports.prototype['averageEffectFollowingHighCauseExplanation'] = undefined;
  /**
   * 
   * @member {String} averageEffectFollowingLowCauseExplanation
   */
  exports.prototype['averageEffectFollowingLowCauseExplanation'] = undefined;
  /**
   * Average Vote
   * @member {Number} averageVote
   */
  exports.prototype['averageVote'] = undefined;
  /**
   * 
   * @member {Number} causalityFactor
   */
  exports.prototype['causalityFactor'] = undefined;
  /**
   * Variable name of the cause variable for which the user desires correlations.
   * @member {String} cause
   */
  exports.prototype['cause'] = undefined;
  /**
   * Variable category of the cause variable.
   * @member {String} causeVariableCategoryName
   */
  exports.prototype['causeVariableCategoryName'] = undefined;
  /**
   * Number of changes in the predictor variable (a.k.a the number of experiments)
   * @member {Number} causeChanges
   */
  exports.prototype['causeChanges'] = undefined;
  /**
   * The way cause measurements are aggregated
   * @member {String} causeVariableCombinationOperation
   */
  exports.prototype['causeVariableCombinationOperation'] = undefined;
  /**
   * 
   * @member {String} causeVariableImageUrl
   */
  exports.prototype['causeVariableImageUrl'] = undefined;
  /**
   * For use in Ionic apps
   * @member {String} causeVariableIonIcon
   */
  exports.prototype['causeVariableIonIcon'] = undefined;
  /**
   * Unit of the predictor variable
   * @member {String} causeUnit
   */
  exports.prototype['causeUnit'] = undefined;
  /**
   * Unit Id of the predictor variable
   * @member {Number} causeVariableDefaultUnitId
   */
  exports.prototype['causeVariableDefaultUnitId'] = undefined;
  /**
   * 
   * @member {Number} causeVariableId
   */
  exports.prototype['causeVariableId'] = undefined;
  /**
   * Variable name of the cause variable for which the user desires correlations.
   * @member {String} causeVariableName
   */
  exports.prototype['causeVariableName'] = undefined;
  /**
   * Pearson correlation coefficient between cause and effect measurements
   * @member {Number} correlationCoefficient
   */
  exports.prototype['correlationCoefficient'] = undefined;
  /**
   * When the record was first created. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} createdAt
   */
  exports.prototype['createdAt'] = undefined;
  /**
   * How the data was analyzed
   * @member {String} dataAnalysis
   */
  exports.prototype['dataAnalysis'] = undefined;
  /**
   * How the data was obtained
   * @member {String} dataSources
   */
  exports.prototype['dataSources'] = undefined;
  /**
   * The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
   * @member {Number} durationOfAction
   */
  exports.prototype['durationOfAction'] = undefined;
  /**
   * Variable name of the effect variable for which the user desires correlations.
   * @member {String} effect
   */
  exports.prototype['effect'] = undefined;
  /**
   * Variable category of the effect variable.
   * @member {String} effectVariableCategoryName
   */
  exports.prototype['effectVariableCategoryName'] = undefined;
  /**
   * 
   * @member {String} effectVariableImageUrl
   */
  exports.prototype['effectVariableImageUrl'] = undefined;
  /**
   * For use in Ionic apps
   * @member {String} effectVariableIonIcon
   */
  exports.prototype['effectVariableIonIcon'] = undefined;
  /**
   * Magnitude of the effects of a cause indicating whether it's practically meaningful.
   * @member {String} effectSize
   */
  exports.prototype['effectSize'] = undefined;
  /**
   * Magnitude of the effects of a cause indicating whether it's practically meaningful.
   * @member {String} effectVariableId
   */
  exports.prototype['effectVariableId'] = undefined;
  /**
   * Variable name of the effect variable for which the user desires correlations.
   * @member {String} effectVariableName
   */
  exports.prototype['effectVariableName'] = undefined;
  /**
   * Illustrates the strength of the relationship
   * @member {String} gaugeImage
   */
  exports.prototype['gaugeImage'] = undefined;
  /**
   * Large image for Facebook
   * @member {String} imageUrl
   */
  exports.prototype['imageUrl'] = undefined;
  /**
   * Number of points that went into the correlation calculation
   * @member {Number} numberOfPairs
   */
  exports.prototype['numberOfPairs'] = undefined;
  /**
   * The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
   * @member {Number} onsetDelay
   */
  exports.prototype['onsetDelay'] = undefined;
  /**
   * Optimal Pearson Product
   * @member {Number} optimalPearsonProduct
   */
  exports.prototype['optimalPearsonProduct'] = undefined;
  /**
   * original name of the cause.
   * @member {String} outcomeDataSources
   */
  exports.prototype['outcomeDataSources'] = undefined;
  /**
   * HIGHER Remeron predicts HIGHER Overall Mood
   * @member {String} predictorExplanation
   */
  exports.prototype['predictorExplanation'] = undefined;
  /**
   * Mike Sinn
   * @member {String} principalInvestigator
   */
  exports.prototype['principalInvestigator'] = undefined;
  /**
   * Value representing the significance of the relationship as a function of crowdsourced insights, predictive strength, data quantity, and data quality
   * @member {Number} qmScore
   */
  exports.prototype['qmScore'] = undefined;
  /**
   * Correlation when cause and effect are reversed. For any causal relationship, the forward correlation should exceed the reverse correlation.
   * @member {Number} reverseCorrelation
   */
  exports.prototype['reverseCorrelation'] = undefined;
  /**
   * Using a two-tailed t-test with alpha = 0.05, it was determined that the change...
   * @member {String} significanceExplanation
   */
  exports.prototype['significanceExplanation'] = undefined;
  /**
   * A function of the effect size and sample size
   * @member {String} statisticalSignificance
   */
  exports.prototype['statisticalSignificance'] = undefined;
  /**
   * weak, moderate, strong
   * @member {String} strengthLevel
   */
  exports.prototype['strengthLevel'] = undefined;
  /**
   * These data suggest with a high degree of confidence...
   * @member {String} studyAbstract
   */
  exports.prototype['studyAbstract'] = undefined;
  /**
   * In order to reduce suffering through the advancement of human knowledge...
   * @member {String} studyBackground
   */
  exports.prototype['studyBackground'] = undefined;
  /**
   * This study is based on data donated by one QuantiModo user...
   * @member {String} studyDesign
   */
  exports.prototype['studyDesign'] = undefined;
  /**
   * As with any human experiment, it was impossible to control for all potentially confounding variables...
   * @member {String} studyLimitations
   */
  exports.prototype['studyLimitations'] = undefined;
  /**
   * Url for the interactive study within the web app
   * @member {String} studyLinkDynamic
   */
  exports.prototype['studyLinkDynamic'] = undefined;
  /**
   * Url for sharing the study on Facebook
   * @member {String} studyLinkFacebook
   */
  exports.prototype['studyLinkFacebook'] = undefined;
  /**
   * Url for sharing the study on Google+
   * @member {String} studyLinkGoogle
   */
  exports.prototype['studyLinkGoogle'] = undefined;
  /**
   * Url for sharing the study on Twitter
   * @member {String} studyLinkTwitter
   */
  exports.prototype['studyLinkTwitter'] = undefined;
  /**
   * Url for sharing the statically rendered study on social media
   * @member {String} studyLinkStatic
   */
  exports.prototype['studyLinkStatic'] = undefined;
  /**
   * The objective of this study is to determine...
   * @member {String} studyObjective
   */
  exports.prototype['studyObjective'] = undefined;
  /**
   * This analysis suggests that...
   * @member {String} studyResults
   */
  exports.prototype['studyResults'] = undefined;
  /**
   * N1 Study HIGHER Remeron predicts HIGHER Overall Mood
   * @member {String} studyTitle
   */
  exports.prototype['studyTitle'] = undefined;
  /**
   * Time at which correlation was calculated
   * @member {Number} timestamp
   */
  exports.prototype['timestamp'] = undefined;
  /**
   * When the record in the database was last updated. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format. Time zone should be UTC and not local.
   * @member {Date} updatedAt
   */
  exports.prototype['updatedAt'] = undefined;
  /**
   * User Vote
   * @member {Number} userVote
   */
  exports.prototype['userVote'] = undefined;
  /**
   * cause value that predicts an above average effect value (in default unit for cause variable)
   * @member {Number} valuePredictingHighOutcome
   */
  exports.prototype['valuePredictingHighOutcome'] = undefined;
  /**
   * Overall Mood, on average, 34% HIGHER after around 3.98mg Remeron
   * @member {String} valuePredictingHighOutcomeExplanation
   */
  exports.prototype['valuePredictingHighOutcomeExplanation'] = undefined;
  /**
   * cause value that predicts a below average effect value (in default unit for cause variable)
   * @member {Number} valuePredictingLowOutcome
   */
  exports.prototype['valuePredictingLowOutcome'] = undefined;
  /**
   * Overall Mood, on average, 4% LOWER after around 0mg Remeron
   * @member {String} valuePredictingLowOutcomeExplanation
   */
  exports.prototype['valuePredictingLowOutcomeExplanation'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],27:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.HumanTime = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The HumanTime model module.
   * @module model/HumanTime
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>HumanTime</code>.
   * @alias module:model/HumanTime
   * @class
   */
  var exports = function() {
    var _this = this;




  };

  /**
   * Constructs a <code>HumanTime</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/HumanTime} obj Optional instance to populate.
   * @return {module:model/HumanTime} The populated <code>HumanTime</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('date')) {
        obj['date'] = ApiClient.convertToType(data['date'], 'String');
      }
      if (data.hasOwnProperty('timezone_type')) {
        obj['timezone_type'] = ApiClient.convertToType(data['timezone_type'], 'Number');
      }
      if (data.hasOwnProperty('timezone')) {
        obj['timezone'] = ApiClient.convertToType(data['timezone'], 'String');
      }
    }
    return obj;
  }

  /**
   * date time
   * @member {String} date
   */
  exports.prototype['date'] = undefined;
  /**
   * @member {Number} timezone_type
   */
  exports.prototype['timezone_type'] = undefined;
  /**
   * timezone of date time
   * @member {String} timezone
   */
  exports.prototype['timezone'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],28:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/TrackingReminder'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./TrackingReminder'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.InlineResponse200 = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.TrackingReminder);
  }
}(this, function(ApiClient, TrackingReminder) {
  'use strict';




  /**
   * The InlineResponse200 model module.
   * @module model/InlineResponse200
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>InlineResponse200</code>.
   * @alias module:model/InlineResponse200
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>InlineResponse200</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/InlineResponse200} obj Optional instance to populate.
   * @return {module:model/InlineResponse200} The populated <code>InlineResponse200</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('success')) {
        obj['success'] = ApiClient.convertToType(data['success'], 'Boolean');
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = ApiClient.convertToType(data['data'], [TrackingReminder]);
      }
    }
    return obj;
  }

  /**
   * @member {Boolean} success
   */
  exports.prototype['success'] = undefined;
  /**
   * @member {Array.<module:model/TrackingReminder>} data
   */
  exports.prototype['data'] = undefined;



  return exports;
}));



},{"../ApiClient":5,"./TrackingReminder":42}],29:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/TrackingReminder'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./TrackingReminder'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.InlineResponse2001 = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.TrackingReminder);
  }
}(this, function(ApiClient, TrackingReminder) {
  'use strict';




  /**
   * The InlineResponse2001 model module.
   * @module model/InlineResponse2001
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>InlineResponse2001</code>.
   * @alias module:model/InlineResponse2001
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>InlineResponse2001</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/InlineResponse2001} obj Optional instance to populate.
   * @return {module:model/InlineResponse2001} The populated <code>InlineResponse2001</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('success')) {
        obj['success'] = ApiClient.convertToType(data['success'], 'Boolean');
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = TrackingReminder.constructFromObject(data['data']);
      }
    }
    return obj;
  }

  /**
   * @member {Boolean} success
   */
  exports.prototype['success'] = undefined;
  /**
   * @member {module:model/TrackingReminder} data
   */
  exports.prototype['data'] = undefined;



  return exports;
}));



},{"../ApiClient":5,"./TrackingReminder":42}],30:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/TrackingReminderNotification'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./TrackingReminderNotification'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.InlineResponse2002 = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.TrackingReminderNotification);
  }
}(this, function(ApiClient, TrackingReminderNotification) {
  'use strict';




  /**
   * The InlineResponse2002 model module.
   * @module model/InlineResponse2002
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>InlineResponse2002</code>.
   * @alias module:model/InlineResponse2002
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>InlineResponse2002</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/InlineResponse2002} obj Optional instance to populate.
   * @return {module:model/InlineResponse2002} The populated <code>InlineResponse2002</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('success')) {
        obj['success'] = ApiClient.convertToType(data['success'], 'Boolean');
      }
      if (data.hasOwnProperty('data')) {
        obj['data'] = ApiClient.convertToType(data['data'], [TrackingReminderNotification]);
      }
    }
    return obj;
  }

  /**
   * @member {Boolean} success
   */
  exports.prototype['success'] = undefined;
  /**
   * @member {Array.<module:model/TrackingReminderNotification>} data
   */
  exports.prototype['data'] = undefined;



  return exports;
}));



},{"../ApiClient":5,"./TrackingReminderNotification":44}],31:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.JsonErrorResponse = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The JsonErrorResponse model module.
   * @module model/JsonErrorResponse
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>JsonErrorResponse</code>.
   * @alias module:model/JsonErrorResponse
   * @class
   * @param status {String} Status: \"ok\" or \"error\"
   */
  var exports = function(status) {
    var _this = this;

    _this['status'] = status;

  };

  /**
   * Constructs a <code>JsonErrorResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/JsonErrorResponse} obj Optional instance to populate.
   * @return {module:model/JsonErrorResponse} The populated <code>JsonErrorResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('message')) {
        obj['message'] = ApiClient.convertToType(data['message'], 'String');
      }
    }
    return obj;
  }

  /**
   * Status: \"ok\" or \"error\"
   * @member {String} status
   */
  exports.prototype['status'] = undefined;
  /**
   * Error message
   * @member {String} message
   */
  exports.prototype['message'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],32:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/HumanTime'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./HumanTime'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.Measurement = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.HumanTime);
  }
}(this, function(ApiClient, HumanTime) {
  'use strict';




  /**
   * The Measurement model module.
   * @module model/Measurement
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>Measurement</code>.
   * @alias module:model/Measurement
   * @class
   * @param variableName {String} Name of the variable for which we are creating the measurement records
   * @param sourceName {String} Application or device used to record the measurement values
   * @param startTimeString {String} Start Time for the measurement event in UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"
   * @param value {Number} Converted measurement value in requested unit
   * @param unitAbbreviatedName {String} Abbreviated name for the unit of measurement
   */
  var exports = function(variableName, sourceName, startTimeString, value, unitAbbreviatedName) {
    var _this = this;

    _this['variableName'] = variableName;
    _this['sourceName'] = sourceName;
    _this['startTimeString'] = startTimeString;


    _this['value'] = value;


    _this['unitAbbreviatedName'] = unitAbbreviatedName;

  };

  /**
   * Constructs a <code>Measurement</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Measurement} obj Optional instance to populate.
   * @return {module:model/Measurement} The populated <code>Measurement</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('variableName')) {
        obj['variableName'] = ApiClient.convertToType(data['variableName'], 'String');
      }
      if (data.hasOwnProperty('sourceName')) {
        obj['sourceName'] = ApiClient.convertToType(data['sourceName'], 'String');
      }
      if (data.hasOwnProperty('startTimeString')) {
        obj['startTimeString'] = ApiClient.convertToType(data['startTimeString'], 'String');
      }
      if (data.hasOwnProperty('startTimeEpoch')) {
        obj['startTimeEpoch'] = ApiClient.convertToType(data['startTimeEpoch'], 'Number');
      }
      if (data.hasOwnProperty('humanTime')) {
        obj['humanTime'] = HumanTime.constructFromObject(data['humanTime']);
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'Number');
      }
      if (data.hasOwnProperty('originalValue')) {
        obj['originalValue'] = ApiClient.convertToType(data['originalValue'], 'Number');
      }
      if (data.hasOwnProperty('originalunitAbbreviatedName')) {
        obj['originalunitAbbreviatedName'] = ApiClient.convertToType(data['originalunitAbbreviatedName'], 'String');
      }
      if (data.hasOwnProperty('unitAbbreviatedName')) {
        obj['unitAbbreviatedName'] = ApiClient.convertToType(data['unitAbbreviatedName'], 'String');
      }
      if (data.hasOwnProperty('note')) {
        obj['note'] = ApiClient.convertToType(data['note'], 'String');
      }
    }
    return obj;
  }

  /**
   * Name of the variable for which we are creating the measurement records
   * @member {String} variableName
   */
  exports.prototype['variableName'] = undefined;
  /**
   * Application or device used to record the measurement values
   * @member {String} sourceName
   */
  exports.prototype['sourceName'] = undefined;
  /**
   * Start Time for the measurement event in UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"
   * @member {String} startTimeString
   */
  exports.prototype['startTimeString'] = undefined;
  /**
   * Seconds between the start of the event measured and 1970 (Unix timestamp)
   * @member {Number} startTimeEpoch
   */
  exports.prototype['startTimeEpoch'] = undefined;
  /**
   * @member {module:model/HumanTime} humanTime
   */
  exports.prototype['humanTime'] = undefined;
  /**
   * Converted measurement value in requested unit
   * @member {Number} value
   */
  exports.prototype['value'] = undefined;
  /**
   * Original value as originally submitted
   * @member {Number} originalValue
   */
  exports.prototype['originalValue'] = undefined;
  /**
   * Original Unit of measurement as originally submitted
   * @member {String} originalunitAbbreviatedName
   */
  exports.prototype['originalunitAbbreviatedName'] = undefined;
  /**
   * Abbreviated name for the unit of measurement
   * @member {String} unitAbbreviatedName
   */
  exports.prototype['unitAbbreviatedName'] = undefined;
  /**
   * Note of measurement
   * @member {String} note
   */
  exports.prototype['note'] = undefined;



  return exports;
}));



},{"../ApiClient":5,"./HumanTime":27}],33:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.MeasurementDelete = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The MeasurementDelete model module.
   * @module model/MeasurementDelete
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>MeasurementDelete</code>.
   * @alias module:model/MeasurementDelete
   * @class
   * @param variableId {Number} Variable id of the measurement to be deleted
   * @param startTime {Number} Start time of the measurement to be deleted
   */
  var exports = function(variableId, startTime) {
    var _this = this;

    _this['variableId'] = variableId;
    _this['startTime'] = startTime;
  };

  /**
   * Constructs a <code>MeasurementDelete</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MeasurementDelete} obj Optional instance to populate.
   * @return {module:model/MeasurementDelete} The populated <code>MeasurementDelete</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('variableId')) {
        obj['variableId'] = ApiClient.convertToType(data['variableId'], 'Number');
      }
      if (data.hasOwnProperty('startTime')) {
        obj['startTime'] = ApiClient.convertToType(data['startTime'], 'Number');
      }
    }
    return obj;
  }

  /**
   * Variable id of the measurement to be deleted
   * @member {Number} variableId
   */
  exports.prototype['variableId'] = undefined;
  /**
   * Start time of the measurement to be deleted
   * @member {Number} startTime
   */
  exports.prototype['startTime'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],34:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.MeasurementRange = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The MeasurementRange model module.
   * @module model/MeasurementRange
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>MeasurementRange</code>.
   * @alias module:model/MeasurementRange
   * @class
   * @param lowerLimit {Number} The timestamp of the earliest measurement for a user.
   */
  var exports = function(lowerLimit) {
    var _this = this;

    _this['lowerLimit'] = lowerLimit;

  };

  /**
   * Constructs a <code>MeasurementRange</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MeasurementRange} obj Optional instance to populate.
   * @return {module:model/MeasurementRange} The populated <code>MeasurementRange</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('lowerLimit')) {
        obj['lowerLimit'] = ApiClient.convertToType(data['lowerLimit'], 'Number');
      }
      if (data.hasOwnProperty('upperLimit')) {
        obj['upperLimit'] = ApiClient.convertToType(data['upperLimit'], 'Number');
      }
    }
    return obj;
  }

  /**
   * The timestamp of the earliest measurement for a user.
   * @member {Number} lowerLimit
   */
  exports.prototype['lowerLimit'] = undefined;
  /**
   * The timestamp of the most recent measurement for a user.
   * @member {Number} upperLimit
   */
  exports.prototype['upperLimit'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],35:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/ValueObject'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./ValueObject'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.MeasurementSet = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.ValueObject);
  }
}(this, function(ApiClient, ValueObject) {
  'use strict';




  /**
   * The MeasurementSet model module.
   * @module model/MeasurementSet
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>MeasurementSet</code>.
   * @alias module:model/MeasurementSet
   * @class
   * @param measurements {Array.<module:model/ValueObject>} Array of timestamps, values, and optional notes
   * @param variableName {String} ORIGINAL name of the variable for which we are creating the measurement records
   * @param sourceName {String} Name of the application or device used to record the measurement values
   * @param unitAbbreviatedName {String} Unit of measurement
   */
  var exports = function(measurements, variableName, sourceName, unitAbbreviatedName) {
    var _this = this;

    _this['measurements'] = measurements;
    _this['variableName'] = variableName;
    _this['sourceName'] = sourceName;


    _this['unitAbbreviatedName'] = unitAbbreviatedName;
  };

  /**
   * Constructs a <code>MeasurementSet</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MeasurementSet} obj Optional instance to populate.
   * @return {module:model/MeasurementSet} The populated <code>MeasurementSet</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('measurements')) {
        obj['measurements'] = ApiClient.convertToType(data['measurements'], [ValueObject]);
      }
      if (data.hasOwnProperty('variableName')) {
        obj['variableName'] = ApiClient.convertToType(data['variableName'], 'String');
      }
      if (data.hasOwnProperty('sourceName')) {
        obj['sourceName'] = ApiClient.convertToType(data['sourceName'], 'String');
      }
      if (data.hasOwnProperty('variableCategoryName')) {
        obj['variableCategoryName'] = ApiClient.convertToType(data['variableCategoryName'], 'String');
      }
      if (data.hasOwnProperty('combinationOperation')) {
        obj['combinationOperation'] = ApiClient.convertToType(data['combinationOperation'], 'String');
      }
      if (data.hasOwnProperty('unitAbbreviatedName')) {
        obj['unitAbbreviatedName'] = ApiClient.convertToType(data['unitAbbreviatedName'], 'String');
      }
    }
    return obj;
  }

  /**
   * Array of timestamps, values, and optional notes
   * @member {Array.<module:model/ValueObject>} measurements
   */
  exports.prototype['measurements'] = undefined;
  /**
   * ORIGINAL name of the variable for which we are creating the measurement records
   * @member {String} variableName
   */
  exports.prototype['variableName'] = undefined;
  /**
   * Name of the application or device used to record the measurement values
   * @member {String} sourceName
   */
  exports.prototype['sourceName'] = undefined;
  /**
   * Variable category name
   * @member {String} variableCategoryName
   */
  exports.prototype['variableCategoryName'] = undefined;
  /**
   * Way to aggregate measurements over time. Options are \"MEAN\" or \"SUM\". SUM should be used for things like minutes of exercise.  If you use MEAN for exercise, then a person might exercise more minutes in one day but add separate measurements that were smaller.  So when we are doing correlational analysis, we would think that the person exercised less that day even though they exercised more.  Conversely, we must use MEAN for things such as ratings which cannot be SUMMED.
   * @member {module:model/MeasurementSet.CombinationOperationEnum} combinationOperation
   */
  exports.prototype['combinationOperation'] = undefined;
  /**
   * Unit of measurement
   * @member {String} unitAbbreviatedName
   */
  exports.prototype['unitAbbreviatedName'] = undefined;


  /**
   * Allowed values for the <code>combinationOperation</code> property.
   * @enum {String}
   * @readonly
   */
  exports.CombinationOperationEnum = {
    /**
     * value: "MEAN"
     * @const
     */
    "MEAN": "MEAN",
    /**
     * value: "SUM"
     * @const
     */
    "SUM": "SUM"  };


  return exports;
}));



},{"../ApiClient":5,"./ValueObject":62}],36:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.MeasurementSource = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The MeasurementSource model module.
   * @module model/MeasurementSource
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>MeasurementSource</code>.
   * @alias module:model/MeasurementSource
   * @class
   * @param name {String} Name of the application or device.
   */
  var exports = function(name) {
    var _this = this;

    _this['name'] = name;
  };

  /**
   * Constructs a <code>MeasurementSource</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MeasurementSource} obj Optional instance to populate.
   * @return {module:model/MeasurementSource} The populated <code>MeasurementSource</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
    }
    return obj;
  }

  /**
   * Name of the application or device.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],37:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.MeasurementUpdate = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The MeasurementUpdate model module.
   * @module model/MeasurementUpdate
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>MeasurementUpdate</code>.
   * @alias module:model/MeasurementUpdate
   * @class
   * @param id {Number} Variable id of the measurement to be deleted
   */
  var exports = function(id) {
    var _this = this;

    _this['id'] = id;



  };

  /**
   * Constructs a <code>MeasurementUpdate</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MeasurementUpdate} obj Optional instance to populate.
   * @return {module:model/MeasurementUpdate} The populated <code>MeasurementUpdate</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('startTime')) {
        obj['startTime'] = ApiClient.convertToType(data['startTime'], 'Number');
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'Number');
      }
      if (data.hasOwnProperty('note')) {
        obj['note'] = ApiClient.convertToType(data['note'], 'String');
      }
    }
    return obj;
  }

  /**
   * Variable id of the measurement to be deleted
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * The new timestamp for the the event in epoch seconds (optional)
   * @member {Number} startTime
   */
  exports.prototype['startTime'] = undefined;
  /**
   * The new value of for the measurement (optional)
   * @member {Number} value
   */
  exports.prototype['value'] = undefined;
  /**
   * The new note for the measurement (optional)
   * @member {String} note
   */
  exports.prototype['note'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],38:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.Pairs = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Pairs model module.
   * @module model/Pairs
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>Pairs</code>.
   * @alias module:model/Pairs
   * @class
   * @param name {String} Category name
   */
  var exports = function(name) {
    var _this = this;

    _this['name'] = name;
  };

  /**
   * Constructs a <code>Pairs</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Pairs} obj Optional instance to populate.
   * @return {module:model/Pairs} The populated <code>Pairs</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
    }
    return obj;
  }

  /**
   * Category name
   * @member {String} name
   */
  exports.prototype['name'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],39:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.Permission = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Permission model module.
   * @module model/Permission
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>Permission</code>.
   * @alias module:model/Permission
   * @class
   * @param target {Number} Grant permission to target user or public so they may access measurements within the given parameters. TODO: Rename target to something more intuitive.
   * @param variableName {String} ORIGINAL Variable name
   * @param minTimestamp {Number} Earliest time when measurements will be accessible in epoch seconds
   * @param maxTimestamp {Number} Latest time when measurements will be accessible in epoch seconds
   * @param minTimeOfDay {Number} Earliest time of day when measurements will be accessible in epoch seconds
   * @param maxTimeOfDay {Number} Latest time of day when measurements will be accessible in epoch seconds
   * @param week {String} Maybe specifies if only weekday measurements should be accessible
   */
  var exports = function(target, variableName, minTimestamp, maxTimestamp, minTimeOfDay, maxTimeOfDay, week) {
    var _this = this;

    _this['target'] = target;
    _this['variableName'] = variableName;
    _this['minTimestamp'] = minTimestamp;
    _this['maxTimestamp'] = maxTimestamp;
    _this['minTimeOfDay'] = minTimeOfDay;
    _this['maxTimeOfDay'] = maxTimeOfDay;
    _this['week'] = week;
  };

  /**
   * Constructs a <code>Permission</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Permission} obj Optional instance to populate.
   * @return {module:model/Permission} The populated <code>Permission</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('target')) {
        obj['target'] = ApiClient.convertToType(data['target'], 'Number');
      }
      if (data.hasOwnProperty('variableName')) {
        obj['variableName'] = ApiClient.convertToType(data['variableName'], 'String');
      }
      if (data.hasOwnProperty('minTimestamp')) {
        obj['minTimestamp'] = ApiClient.convertToType(data['minTimestamp'], 'Number');
      }
      if (data.hasOwnProperty('maxTimestamp')) {
        obj['maxTimestamp'] = ApiClient.convertToType(data['maxTimestamp'], 'Number');
      }
      if (data.hasOwnProperty('minTimeOfDay')) {
        obj['minTimeOfDay'] = ApiClient.convertToType(data['minTimeOfDay'], 'Number');
      }
      if (data.hasOwnProperty('maxTimeOfDay')) {
        obj['maxTimeOfDay'] = ApiClient.convertToType(data['maxTimeOfDay'], 'Number');
      }
      if (data.hasOwnProperty('week')) {
        obj['week'] = ApiClient.convertToType(data['week'], 'String');
      }
    }
    return obj;
  }

  /**
   * Grant permission to target user or public so they may access measurements within the given parameters. TODO: Rename target to something more intuitive.
   * @member {Number} target
   */
  exports.prototype['target'] = undefined;
  /**
   * ORIGINAL Variable name
   * @member {String} variableName
   */
  exports.prototype['variableName'] = undefined;
  /**
   * Earliest time when measurements will be accessible in epoch seconds
   * @member {Number} minTimestamp
   */
  exports.prototype['minTimestamp'] = undefined;
  /**
   * Latest time when measurements will be accessible in epoch seconds
   * @member {Number} maxTimestamp
   */
  exports.prototype['maxTimestamp'] = undefined;
  /**
   * Earliest time of day when measurements will be accessible in epoch seconds
   * @member {Number} minTimeOfDay
   */
  exports.prototype['minTimeOfDay'] = undefined;
  /**
   * Latest time of day when measurements will be accessible in epoch seconds
   * @member {Number} maxTimeOfDay
   */
  exports.prototype['maxTimeOfDay'] = undefined;
  /**
   * Maybe specifies if only weekday measurements should be accessible
   * @member {String} week
   */
  exports.prototype['week'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],40:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.PostCorrelation = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The PostCorrelation model module.
   * @module model/PostCorrelation
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>PostCorrelation</code>.
   * @alias module:model/PostCorrelation
   * @class
   * @param causeVariableName {String} Cause variable name
   * @param effectVariableName {String} Effect variable name
   * @param correlation {Number} Correlation value
   */
  var exports = function(causeVariableName, effectVariableName, correlation) {
    var _this = this;

    _this['causeVariableName'] = causeVariableName;
    _this['effectVariableName'] = effectVariableName;
    _this['correlation'] = correlation;

  };

  /**
   * Constructs a <code>PostCorrelation</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PostCorrelation} obj Optional instance to populate.
   * @return {module:model/PostCorrelation} The populated <code>PostCorrelation</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('causeVariableName')) {
        obj['causeVariableName'] = ApiClient.convertToType(data['causeVariableName'], 'String');
      }
      if (data.hasOwnProperty('effectVariableName')) {
        obj['effectVariableName'] = ApiClient.convertToType(data['effectVariableName'], 'String');
      }
      if (data.hasOwnProperty('correlation')) {
        obj['correlation'] = ApiClient.convertToType(data['correlation'], 'Number');
      }
      if (data.hasOwnProperty('vote')) {
        obj['vote'] = ApiClient.convertToType(data['vote'], 'Number');
      }
    }
    return obj;
  }

  /**
   * Cause variable name
   * @member {String} causeVariableName
   */
  exports.prototype['causeVariableName'] = undefined;
  /**
   * Effect variable name
   * @member {String} effectVariableName
   */
  exports.prototype['effectVariableName'] = undefined;
  /**
   * Correlation value
   * @member {Number} correlation
   */
  exports.prototype['correlation'] = undefined;
  /**
   * Vote: 0 or 1
   * @member {Number} vote
   */
  exports.prototype['vote'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],41:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.PostVote = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The PostVote model module.
   * @module model/PostVote
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>PostVote</code>.
   * @alias module:model/PostVote
   * @class
   * @param causeVariableId {Number} Cause variable id
   * @param effectVariableId {Number} Effect variable id
   * @param vote {Boolean} Vote: 0 (for implausible) or 1 (for plausible)
   */
  var exports = function(causeVariableId, effectVariableId, vote) {
    var _this = this;

    _this['causeVariableId'] = causeVariableId;
    _this['effectVariableId'] = effectVariableId;
    _this['vote'] = vote;
  };

  /**
   * Constructs a <code>PostVote</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PostVote} obj Optional instance to populate.
   * @return {module:model/PostVote} The populated <code>PostVote</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('causeVariableId')) {
        obj['causeVariableId'] = ApiClient.convertToType(data['causeVariableId'], 'Number');
      }
      if (data.hasOwnProperty('effectVariableId')) {
        obj['effectVariableId'] = ApiClient.convertToType(data['effectVariableId'], 'Number');
      }
      if (data.hasOwnProperty('vote')) {
        obj['vote'] = ApiClient.convertToType(data['vote'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * Cause variable id
   * @member {Number} causeVariableId
   */
  exports.prototype['causeVariableId'] = undefined;
  /**
   * Effect variable id
   * @member {Number} effectVariableId
   */
  exports.prototype['effectVariableId'] = undefined;
  /**
   * Vote: 0 (for implausible) or 1 (for plausible)
   * @member {Boolean} vote
   */
  exports.prototype['vote'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],42:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.TrackingReminder = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The TrackingReminder model module.
   * @module model/TrackingReminder
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>TrackingReminder</code>.
   * @alias module:model/TrackingReminder
   * @class
   * @param variableId {Number} Id for the variable to be tracked
   * @param defaultValue {Number} Default value to use for the measurement when tracking
   * @param reminderFrequency {Number} Number of seconds between one reminder and the next
   */
  var exports = function(variableId, defaultValue, reminderFrequency) {
    var _this = this;




    _this['variableId'] = variableId;
    _this['defaultValue'] = defaultValue;



    _this['reminderFrequency'] = reminderFrequency;













  };

  /**
   * Constructs a <code>TrackingReminder</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TrackingReminder} obj Optional instance to populate.
   * @return {module:model/TrackingReminder} The populated <code>TrackingReminder</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('clientId')) {
        obj['clientId'] = ApiClient.convertToType(data['clientId'], 'String');
      }
      if (data.hasOwnProperty('userId')) {
        obj['userId'] = ApiClient.convertToType(data['userId'], 'Number');
      }
      if (data.hasOwnProperty('variableId')) {
        obj['variableId'] = ApiClient.convertToType(data['variableId'], 'Number');
      }
      if (data.hasOwnProperty('defaultValue')) {
        obj['defaultValue'] = ApiClient.convertToType(data['defaultValue'], 'Number');
      }
      if (data.hasOwnProperty('reminderStartTime')) {
        obj['reminderStartTime'] = ApiClient.convertToType(data['reminderStartTime'], 'String');
      }
      if (data.hasOwnProperty('reminderEndTime')) {
        obj['reminderEndTime'] = ApiClient.convertToType(data['reminderEndTime'], 'String');
      }
      if (data.hasOwnProperty('reminderSound')) {
        obj['reminderSound'] = ApiClient.convertToType(data['reminderSound'], 'String');
      }
      if (data.hasOwnProperty('reminderFrequency')) {
        obj['reminderFrequency'] = ApiClient.convertToType(data['reminderFrequency'], 'Number');
      }
      if (data.hasOwnProperty('popUp')) {
        obj['popUp'] = ApiClient.convertToType(data['popUp'], 'Boolean');
      }
      if (data.hasOwnProperty('sms')) {
        obj['sms'] = ApiClient.convertToType(data['sms'], 'Boolean');
      }
      if (data.hasOwnProperty('email')) {
        obj['email'] = ApiClient.convertToType(data['email'], 'Boolean');
      }
      if (data.hasOwnProperty('notificationBar')) {
        obj['notificationBar'] = ApiClient.convertToType(data['notificationBar'], 'Boolean');
      }
      if (data.hasOwnProperty('latestTrackingReminderNotificationReminderTime')) {
        obj['latestTrackingReminderNotificationReminderTime'] = ApiClient.convertToType(data['latestTrackingReminderNotificationReminderTime'], 'Date');
      }
      if (data.hasOwnProperty('lastTracked')) {
        obj['lastTracked'] = ApiClient.convertToType(data['lastTracked'], 'Date');
      }
      if (data.hasOwnProperty('startTrackingDate')) {
        obj['startTrackingDate'] = ApiClient.convertToType(data['startTrackingDate'], 'String');
      }
      if (data.hasOwnProperty('stopTrackingDate')) {
        obj['stopTrackingDate'] = ApiClient.convertToType(data['stopTrackingDate'], 'String');
      }
      if (data.hasOwnProperty('updatedAt')) {
        obj['updatedAt'] = ApiClient.convertToType(data['updatedAt'], 'Date');
      }
      if (data.hasOwnProperty('variableName')) {
        obj['variableName'] = ApiClient.convertToType(data['variableName'], 'String');
      }
      if (data.hasOwnProperty('variableCategoryName')) {
        obj['variableCategoryName'] = ApiClient.convertToType(data['variableCategoryName'], 'String');
      }
      if (data.hasOwnProperty('unitAbbreviatedName')) {
        obj['unitAbbreviatedName'] = ApiClient.convertToType(data['unitAbbreviatedName'], 'String');
      }
      if (data.hasOwnProperty('combinationOperation')) {
        obj['combinationOperation'] = ApiClient.convertToType(data['combinationOperation'], 'String');
      }
    }
    return obj;
  }

  /**
   * id
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * clientId
   * @member {String} clientId
   */
  exports.prototype['clientId'] = undefined;
  /**
   * ID of User
   * @member {Number} userId
   */
  exports.prototype['userId'] = undefined;
  /**
   * Id for the variable to be tracked
   * @member {Number} variableId
   */
  exports.prototype['variableId'] = undefined;
  /**
   * Default value to use for the measurement when tracking
   * @member {Number} defaultValue
   */
  exports.prototype['defaultValue'] = undefined;
  /**
   * Earliest time of day at which reminders should appear in UTC HH:MM:SS format
   * @member {String} reminderStartTime
   */
  exports.prototype['reminderStartTime'] = undefined;
  /**
   * Latest time of day at which reminders should appear in UTC HH:MM:SS format
   * @member {String} reminderEndTime
   */
  exports.prototype['reminderEndTime'] = undefined;
  /**
   * String identifier for the sound to accompany the reminder
   * @member {String} reminderSound
   */
  exports.prototype['reminderSound'] = undefined;
  /**
   * Number of seconds between one reminder and the next
   * @member {Number} reminderFrequency
   */
  exports.prototype['reminderFrequency'] = undefined;
  /**
   * True if the reminders should appear as a popup notification
   * @member {Boolean} popUp
   */
  exports.prototype['popUp'] = undefined;
  /**
   * True if the reminders should be delivered via SMS
   * @member {Boolean} sms
   */
  exports.prototype['sms'] = undefined;
  /**
   * True if the reminders should be delivered via email
   * @member {Boolean} email
   */
  exports.prototype['email'] = undefined;
  /**
   * True if the reminders should appear in the notification bar
   * @member {Boolean} notificationBar
   */
  exports.prototype['notificationBar'] = undefined;
  /**
   * UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  timestamp for the reminder time of the latest tracking reminder notification that has been pre-emptively generated in the database
   * @member {Date} latestTrackingReminderNotificationReminderTime
   */
  exports.prototype['latestTrackingReminderNotificationReminderTime'] = undefined;
  /**
   * UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  timestamp for the last time a measurement was received for this user and variable
   * @member {Date} lastTracked
   */
  exports.prototype['lastTracked'] = undefined;
  /**
   * Earliest date on which the user should be reminded to track in YYYY-MM-DD format
   * @member {String} startTrackingDate
   */
  exports.prototype['startTrackingDate'] = undefined;
  /**
   * Latest date on which the user should be reminded to track in YYYY-MM-DD format
   * @member {String} stopTrackingDate
   */
  exports.prototype['stopTrackingDate'] = undefined;
  /**
   * When the record in the database was last updated. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format. Time zone should be UTC and not local.
   * @member {Date} updatedAt
   */
  exports.prototype['updatedAt'] = undefined;
  /**
   * Name of the variable to be used when sending measurements
   * @member {String} variableName
   */
  exports.prototype['variableName'] = undefined;
  /**
   * Name of the variable category to be used when sending measurements
   * @member {String} variableCategoryName
   */
  exports.prototype['variableCategoryName'] = undefined;
  /**
   * Abbreviated name of the unit to be used when sending measurements
   * @member {String} unitAbbreviatedName
   */
  exports.prototype['unitAbbreviatedName'] = undefined;
  /**
   * The way multiple measurements are aggregated over time
   * @member {module:model/TrackingReminder.CombinationOperationEnum} combinationOperation
   */
  exports.prototype['combinationOperation'] = undefined;


  /**
   * Allowed values for the <code>combinationOperation</code> property.
   * @enum {String}
   * @readonly
   */
  exports.CombinationOperationEnum = {
    /**
     * value: "MEAN"
     * @const
     */
    "MEAN": "MEAN",
    /**
     * value: "SUM"
     * @const
     */
    "SUM": "SUM"  };


  return exports;
}));



},{"../ApiClient":5}],43:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.TrackingReminderDelete = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The TrackingReminderDelete model module.
   * @module model/TrackingReminderDelete
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>TrackingReminderDelete</code>.
   * @alias module:model/TrackingReminderDelete
   * @class
   * @param id {Number} Id of the PENDING reminder to be deleted
   */
  var exports = function(id) {
    var _this = this;

    _this['id'] = id;
  };

  /**
   * Constructs a <code>TrackingReminderDelete</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TrackingReminderDelete} obj Optional instance to populate.
   * @return {module:model/TrackingReminderDelete} The populated <code>TrackingReminderDelete</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
    }
    return obj;
  }

  /**
   * Id of the PENDING reminder to be deleted
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],44:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.TrackingReminderNotification = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The TrackingReminderNotification model module.
   * @module model/TrackingReminderNotification
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>TrackingReminderNotification</code>.
   * @alias module:model/TrackingReminderNotification
   * @class
   * @param id {Number} id for the specific PENDING tracking remidner
   * @param trackingReminderId {Number} id for the repeating tracking remidner
   */
  var exports = function(id, trackingReminderId) {
    var _this = this;

    _this['id'] = id;
    _this['trackingReminderId'] = trackingReminderId;















  };

  /**
   * Constructs a <code>TrackingReminderNotification</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TrackingReminderNotification} obj Optional instance to populate.
   * @return {module:model/TrackingReminderNotification} The populated <code>TrackingReminderNotification</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('trackingReminderId')) {
        obj['trackingReminderId'] = ApiClient.convertToType(data['trackingReminderId'], 'Number');
      }
      if (data.hasOwnProperty('clientId')) {
        obj['clientId'] = ApiClient.convertToType(data['clientId'], 'String');
      }
      if (data.hasOwnProperty('userId')) {
        obj['userId'] = ApiClient.convertToType(data['userId'], 'Number');
      }
      if (data.hasOwnProperty('variableId')) {
        obj['variableId'] = ApiClient.convertToType(data['variableId'], 'Number');
      }
      if (data.hasOwnProperty('pendingReminderTime')) {
        obj['pendingReminderTime'] = ApiClient.convertToType(data['pendingReminderTime'], 'Date');
      }
      if (data.hasOwnProperty('defaultValue')) {
        obj['defaultValue'] = ApiClient.convertToType(data['defaultValue'], 'Number');
      }
      if (data.hasOwnProperty('reminderSound')) {
        obj['reminderSound'] = ApiClient.convertToType(data['reminderSound'], 'String');
      }
      if (data.hasOwnProperty('popUp')) {
        obj['popUp'] = ApiClient.convertToType(data['popUp'], 'Boolean');
      }
      if (data.hasOwnProperty('sms')) {
        obj['sms'] = ApiClient.convertToType(data['sms'], 'Boolean');
      }
      if (data.hasOwnProperty('email')) {
        obj['email'] = ApiClient.convertToType(data['email'], 'Boolean');
      }
      if (data.hasOwnProperty('notificationBar')) {
        obj['notificationBar'] = ApiClient.convertToType(data['notificationBar'], 'Boolean');
      }
      if (data.hasOwnProperty('updatedAt')) {
        obj['updatedAt'] = ApiClient.convertToType(data['updatedAt'], 'Date');
      }
      if (data.hasOwnProperty('variableName')) {
        obj['variableName'] = ApiClient.convertToType(data['variableName'], 'String');
      }
      if (data.hasOwnProperty('variableCategoryName')) {
        obj['variableCategoryName'] = ApiClient.convertToType(data['variableCategoryName'], 'String');
      }
      if (data.hasOwnProperty('unitAbbreviatedName')) {
        obj['unitAbbreviatedName'] = ApiClient.convertToType(data['unitAbbreviatedName'], 'String');
      }
      if (data.hasOwnProperty('combinationOperation')) {
        obj['combinationOperation'] = ApiClient.convertToType(data['combinationOperation'], 'String');
      }
    }
    return obj;
  }

  /**
   * id for the specific PENDING tracking remidner
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * id for the repeating tracking remidner
   * @member {Number} trackingReminderId
   */
  exports.prototype['trackingReminderId'] = undefined;
  /**
   * clientId
   * @member {String} clientId
   */
  exports.prototype['clientId'] = undefined;
  /**
   * ID of User
   * @member {Number} userId
   */
  exports.prototype['userId'] = undefined;
  /**
   * Id for the variable to be tracked
   * @member {Number} variableId
   */
  exports.prototype['variableId'] = undefined;
  /**
   * UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  timestamp for the specific time the variable should be tracked in UTC.  This will be used for the measurement startTime if the track endpoint is used.
   * @member {Date} pendingReminderTime
   */
  exports.prototype['pendingReminderTime'] = undefined;
  /**
   * Default value to use for the measurement when tracking
   * @member {Number} defaultValue
   */
  exports.prototype['defaultValue'] = undefined;
  /**
   * String identifier for the sound to accompany the reminder
   * @member {String} reminderSound
   */
  exports.prototype['reminderSound'] = undefined;
  /**
   * True if the reminders should appear as a popup notification
   * @member {Boolean} popUp
   */
  exports.prototype['popUp'] = undefined;
  /**
   * True if the reminders should be delivered via SMS
   * @member {Boolean} sms
   */
  exports.prototype['sms'] = undefined;
  /**
   * True if the reminders should be delivered via email
   * @member {Boolean} email
   */
  exports.prototype['email'] = undefined;
  /**
   * True if the reminders should appear in the notification bar
   * @member {Boolean} notificationBar
   */
  exports.prototype['notificationBar'] = undefined;
  /**
   * When the record in the database was last updated. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format. Time zone should be UTC and not local.
   * @member {Date} updatedAt
   */
  exports.prototype['updatedAt'] = undefined;
  /**
   * Name of the variable to be used when sending measurements
   * @member {String} variableName
   */
  exports.prototype['variableName'] = undefined;
  /**
   * Name of the variable category to be used when sending measurements
   * @member {String} variableCategoryName
   */
  exports.prototype['variableCategoryName'] = undefined;
  /**
   * Abbreviated name of the unit to be used when sending measurements
   * @member {String} unitAbbreviatedName
   */
  exports.prototype['unitAbbreviatedName'] = undefined;
  /**
   * The way multiple measurements are aggregated over time
   * @member {module:model/TrackingReminderNotification.CombinationOperationEnum} combinationOperation
   */
  exports.prototype['combinationOperation'] = undefined;


  /**
   * Allowed values for the <code>combinationOperation</code> property.
   * @enum {String}
   * @readonly
   */
  exports.CombinationOperationEnum = {
    /**
     * value: "MEAN"
     * @const
     */
    "MEAN": "MEAN",
    /**
     * value: "SUM"
     * @const
     */
    "SUM": "SUM"  };


  return exports;
}));



},{"../ApiClient":5}],45:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.TrackingReminderNotificationSkip = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The TrackingReminderNotificationSkip model module.
   * @module model/TrackingReminderNotificationSkip
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>TrackingReminderNotificationSkip</code>.
   * @alias module:model/TrackingReminderNotificationSkip
   * @class
   * @param id {Number} Id of the PENDING reminder to be skipped
   */
  var exports = function(id) {
    var _this = this;

    _this['id'] = id;
  };

  /**
   * Constructs a <code>TrackingReminderNotificationSkip</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TrackingReminderNotificationSkip} obj Optional instance to populate.
   * @return {module:model/TrackingReminderNotificationSkip} The populated <code>TrackingReminderNotificationSkip</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
    }
    return obj;
  }

  /**
   * Id of the PENDING reminder to be skipped
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],46:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.TrackingReminderNotificationSnooze = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The TrackingReminderNotificationSnooze model module.
   * @module model/TrackingReminderNotificationSnooze
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>TrackingReminderNotificationSnooze</code>.
   * @alias module:model/TrackingReminderNotificationSnooze
   * @class
   * @param id {Number} Id of the PENDING reminder to be snoozed
   */
  var exports = function(id) {
    var _this = this;

    _this['id'] = id;
  };

  /**
   * Constructs a <code>TrackingReminderNotificationSnooze</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TrackingReminderNotificationSnooze} obj Optional instance to populate.
   * @return {module:model/TrackingReminderNotificationSnooze} The populated <code>TrackingReminderNotificationSnooze</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
    }
    return obj;
  }

  /**
   * Id of the PENDING reminder to be snoozed
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],47:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/TrackingReminderNotification'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./TrackingReminderNotification'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.TrackingReminderNotificationTrack = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.TrackingReminderNotification);
  }
}(this, function(ApiClient, TrackingReminderNotification) {
  'use strict';




  /**
   * The TrackingReminderNotificationTrack model module.
   * @module model/TrackingReminderNotificationTrack
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>TrackingReminderNotificationTrack</code>.
   * @alias module:model/TrackingReminderNotificationTrack
   * @class
   * @param trackingReminderNotification {module:model/TrackingReminderNotification} 
   */
  var exports = function(trackingReminderNotification) {
    var _this = this;

    _this['trackingReminderNotification'] = trackingReminderNotification;

  };

  /**
   * Constructs a <code>TrackingReminderNotificationTrack</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TrackingReminderNotificationTrack} obj Optional instance to populate.
   * @return {module:model/TrackingReminderNotificationTrack} The populated <code>TrackingReminderNotificationTrack</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('trackingReminderNotification')) {
        obj['trackingReminderNotification'] = TrackingReminderNotification.constructFromObject(data['trackingReminderNotification']);
      }
      if (data.hasOwnProperty('modifiedValue')) {
        obj['modifiedValue'] = ApiClient.convertToType(data['modifiedValue'], 'Number');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/TrackingReminderNotification} trackingReminderNotification
   */
  exports.prototype['trackingReminderNotification'] = undefined;
  /**
   * Optional value to be recorded instead of the tracking reminder default value
   * @member {Number} modifiedValue
   */
  exports.prototype['modifiedValue'] = undefined;



  return exports;
}));



},{"../ApiClient":5,"./TrackingReminderNotification":44}],48:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/ConversionStep'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./ConversionStep'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.Unit = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.ConversionStep);
  }
}(this, function(ApiClient, ConversionStep) {
  'use strict';




  /**
   * The Unit model module.
   * @module model/Unit
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>Unit</code>.
   * @alias module:model/Unit
   * @class
   * @param name {String} Unit name
   * @param abbreviatedName {String} Unit abbreviation
   * @param category {module:model/Unit.CategoryEnum} Unit category
   * @param conversionSteps {Array.<module:model/ConversionStep>} Conversion steps list
   */
  var exports = function(name, abbreviatedName, category, conversionSteps) {
    var _this = this;

    _this['name'] = name;
    _this['abbreviatedName'] = abbreviatedName;
    _this['category'] = category;


    _this['conversionSteps'] = conversionSteps;
  };

  /**
   * Constructs a <code>Unit</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Unit} obj Optional instance to populate.
   * @return {module:model/Unit} The populated <code>Unit</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('abbreviatedName')) {
        obj['abbreviatedName'] = ApiClient.convertToType(data['abbreviatedName'], 'String');
      }
      if (data.hasOwnProperty('category')) {
        obj['category'] = ApiClient.convertToType(data['category'], 'String');
      }
      if (data.hasOwnProperty('minimumAllowedValue')) {
        obj['minimumAllowedValue'] = ApiClient.convertToType(data['minimumAllowedValue'], 'Number');
      }
      if (data.hasOwnProperty('maximumAllowedValue')) {
        obj['maximumAllowedValue'] = ApiClient.convertToType(data['maximumAllowedValue'], 'Number');
      }
      if (data.hasOwnProperty('conversionSteps')) {
        obj['conversionSteps'] = ApiClient.convertToType(data['conversionSteps'], [ConversionStep]);
      }
    }
    return obj;
  }

  /**
   * Unit name
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Unit abbreviation
   * @member {String} abbreviatedName
   */
  exports.prototype['abbreviatedName'] = undefined;
  /**
   * Unit category
   * @member {module:model/Unit.CategoryEnum} category
   */
  exports.prototype['category'] = undefined;
  /**
   * The minimum allowed value for measurements. While you can record a value below this minimum, it will be excluded from the correlation analysis.
   * @member {Number} minimumAllowedValue
   */
  exports.prototype['minimumAllowedValue'] = undefined;
  /**
   * The maximum allowed value for measurements. While you can record a value above this maximum, it will be excluded from the correlation analysis.
   * @member {Number} maximumAllowedValue
   */
  exports.prototype['maximumAllowedValue'] = undefined;
  /**
   * Conversion steps list
   * @member {Array.<module:model/ConversionStep>} conversionSteps
   */
  exports.prototype['conversionSteps'] = undefined;


  /**
   * Allowed values for the <code>category</code> property.
   * @enum {String}
   * @readonly
   */
  exports.CategoryEnum = {
    /**
     * value: "Distance"
     * @const
     */
    "Distance": "Distance",
    /**
     * value: "Duration"
     * @const
     */
    "Duration": "Duration",
    /**
     * value: "Energy"
     * @const
     */
    "Energy": "Energy",
    /**
     * value: "Frequency"
     * @const
     */
    "Frequency": "Frequency",
    /**
     * value: "Miscellany"
     * @const
     */
    "Miscellany": "Miscellany",
    /**
     * value: "Pressure"
     * @const
     */
    "Pressure": "Pressure",
    /**
     * value: "Proportion"
     * @const
     */
    "Proportion": "Proportion",
    /**
     * value: "Rating"
     * @const
     */
    "Rating": "Rating",
    /**
     * value: "Temperature"
     * @const
     */
    "Temperature": "Temperature",
    /**
     * value: "Volume"
     * @const
     */
    "Volume": "Volume",
    /**
     * value: "Weight"
     * @const
     */
    "Weight": "Weight"  };


  return exports;
}));



},{"../ApiClient":5,"./ConversionStep":25}],49:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UnitCategory = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The UnitCategory model module.
   * @module model/UnitCategory
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>UnitCategory</code>.
   * @alias module:model/UnitCategory
   * @class
   * @param name {String} Category name
   */
  var exports = function(name) {
    var _this = this;

    _this['name'] = name;
  };

  /**
   * Constructs a <code>UnitCategory</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UnitCategory} obj Optional instance to populate.
   * @return {module:model/UnitCategory} The populated <code>UnitCategory</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
    }
    return obj;
  }

  /**
   * Category name
   * @member {String} name
   */
  exports.prototype['name'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],50:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.Update = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Update model module.
   * @module model/Update
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>Update</code>.
   * @alias module:model/Update
   * @class
   * @param userId {Number} userId
   * @param connectorId {Number} connectorId
   * @param numberOfMeasurements {Number} numberOfMeasurements
   * @param success {Boolean} success
   * @param message {String} message
   */
  var exports = function(userId, connectorId, numberOfMeasurements, success, message) {
    var _this = this;


    _this['userId'] = userId;
    _this['connectorId'] = connectorId;
    _this['numberOfMeasurements'] = numberOfMeasurements;
    _this['success'] = success;
    _this['message'] = message;


  };

  /**
   * Constructs a <code>Update</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Update} obj Optional instance to populate.
   * @return {module:model/Update} The populated <code>Update</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('userId')) {
        obj['userId'] = ApiClient.convertToType(data['userId'], 'Number');
      }
      if (data.hasOwnProperty('connectorId')) {
        obj['connectorId'] = ApiClient.convertToType(data['connectorId'], 'Number');
      }
      if (data.hasOwnProperty('numberOfMeasurements')) {
        obj['numberOfMeasurements'] = ApiClient.convertToType(data['numberOfMeasurements'], 'Number');
      }
      if (data.hasOwnProperty('success')) {
        obj['success'] = ApiClient.convertToType(data['success'], 'Boolean');
      }
      if (data.hasOwnProperty('message')) {
        obj['message'] = ApiClient.convertToType(data['message'], 'String');
      }
      if (data.hasOwnProperty('createdAt')) {
        obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Date');
      }
      if (data.hasOwnProperty('updatedAt')) {
        obj['updatedAt'] = ApiClient.convertToType(data['updatedAt'], 'Date');
      }
    }
    return obj;
  }

  /**
   * id
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * userId
   * @member {Number} userId
   */
  exports.prototype['userId'] = undefined;
  /**
   * connectorId
   * @member {Number} connectorId
   */
  exports.prototype['connectorId'] = undefined;
  /**
   * numberOfMeasurements
   * @member {Number} numberOfMeasurements
   */
  exports.prototype['numberOfMeasurements'] = undefined;
  /**
   * success
   * @member {Boolean} success
   */
  exports.prototype['success'] = undefined;
  /**
   * message
   * @member {String} message
   */
  exports.prototype['message'] = undefined;
  /**
   * When the record was first created. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} createdAt
   */
  exports.prototype['createdAt'] = undefined;
  /**
   * When the record in the database was last updated. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} updatedAt
   */
  exports.prototype['updatedAt'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],51:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.User = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The User model module.
   * @module model/User
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>User</code>.
   * @alias module:model/User
   * @class
   * @param id {Number} User id
   * @param wpId {Number} Wordpress user id
   * @param displayName {String} User display name
   * @param loginName {String} User login name
   * @param email {String} User email
   * @param token {String} User token
   * @param administrator {Boolean} Is user administrator
   */
  var exports = function(id, wpId, displayName, loginName, email, token, administrator) {
    var _this = this;

    _this['id'] = id;
    _this['wpId'] = wpId;
    _this['displayName'] = displayName;
    _this['loginName'] = loginName;
    _this['email'] = email;
    _this['token'] = token;
    _this['administrator'] = administrator;
  };

  /**
   * Constructs a <code>User</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/User} obj Optional instance to populate.
   * @return {module:model/User} The populated <code>User</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('wpId')) {
        obj['wpId'] = ApiClient.convertToType(data['wpId'], 'Number');
      }
      if (data.hasOwnProperty('displayName')) {
        obj['displayName'] = ApiClient.convertToType(data['displayName'], 'String');
      }
      if (data.hasOwnProperty('loginName')) {
        obj['loginName'] = ApiClient.convertToType(data['loginName'], 'String');
      }
      if (data.hasOwnProperty('email')) {
        obj['email'] = ApiClient.convertToType(data['email'], 'String');
      }
      if (data.hasOwnProperty('token')) {
        obj['token'] = ApiClient.convertToType(data['token'], 'String');
      }
      if (data.hasOwnProperty('administrator')) {
        obj['administrator'] = ApiClient.convertToType(data['administrator'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * User id
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * Wordpress user id
   * @member {Number} wpId
   */
  exports.prototype['wpId'] = undefined;
  /**
   * User display name
   * @member {String} displayName
   */
  exports.prototype['displayName'] = undefined;
  /**
   * User login name
   * @member {String} loginName
   */
  exports.prototype['loginName'] = undefined;
  /**
   * User email
   * @member {String} email
   */
  exports.prototype['email'] = undefined;
  /**
   * User token
   * @member {String} token
   */
  exports.prototype['token'] = undefined;
  /**
   * Is user administrator
   * @member {Boolean} administrator
   */
  exports.prototype['administrator'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],52:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UserTag = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The UserTag model module.
   * @module model/UserTag
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>UserTag</code>.
   * @alias module:model/UserTag
   * @class
   * @param taggedVariableId {Number} This is the id of the variable being tagged with an ingredient or something.
   * @param tagVariableId {Number} This is the id of the ingredient variable whose value is determined based on the value of the tagged variable.
   * @param conversionFactor {Number} Number by which we multiply the tagged variable value to obtain the tag variable (ingredient) value
   */
  var exports = function(taggedVariableId, tagVariableId, conversionFactor) {
    var _this = this;

    _this['taggedVariableId'] = taggedVariableId;
    _this['tagVariableId'] = tagVariableId;
    _this['conversionFactor'] = conversionFactor;
  };

  /**
   * Constructs a <code>UserTag</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserTag} obj Optional instance to populate.
   * @return {module:model/UserTag} The populated <code>UserTag</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('taggedVariableId')) {
        obj['taggedVariableId'] = ApiClient.convertToType(data['taggedVariableId'], 'Number');
      }
      if (data.hasOwnProperty('tagVariableId')) {
        obj['tagVariableId'] = ApiClient.convertToType(data['tagVariableId'], 'Number');
      }
      if (data.hasOwnProperty('conversionFactor')) {
        obj['conversionFactor'] = ApiClient.convertToType(data['conversionFactor'], 'Number');
      }
    }
    return obj;
  }

  /**
   * This is the id of the variable being tagged with an ingredient or something.
   * @member {Number} taggedVariableId
   */
  exports.prototype['taggedVariableId'] = undefined;
  /**
   * This is the id of the ingredient variable whose value is determined based on the value of the tagged variable.
   * @member {Number} tagVariableId
   */
  exports.prototype['tagVariableId'] = undefined;
  /**
   * Number by which we multiply the tagged variable value to obtain the tag variable (ingredient) value
   * @member {Number} conversionFactor
   */
  exports.prototype['conversionFactor'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],53:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UserTokenFailedResponse = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The UserTokenFailedResponse model module.
   * @module model/UserTokenFailedResponse
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>UserTokenFailedResponse</code>.
   * @alias module:model/UserTokenFailedResponse
   * @class
   * @param code {Number} Status code
   * @param message {String} Message
   * @param success {Boolean} 
   */
  var exports = function(code, message, success) {
    var _this = this;

    _this['code'] = code;
    _this['message'] = message;
    _this['success'] = success;
  };

  /**
   * Constructs a <code>UserTokenFailedResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserTokenFailedResponse} obj Optional instance to populate.
   * @return {module:model/UserTokenFailedResponse} The populated <code>UserTokenFailedResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('code')) {
        obj['code'] = ApiClient.convertToType(data['code'], 'Number');
      }
      if (data.hasOwnProperty('message')) {
        obj['message'] = ApiClient.convertToType(data['message'], 'String');
      }
      if (data.hasOwnProperty('success')) {
        obj['success'] = ApiClient.convertToType(data['success'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * Status code
   * @member {Number} code
   */
  exports.prototype['code'] = undefined;
  /**
   * Message
   * @member {String} message
   */
  exports.prototype['message'] = undefined;
  /**
   * @member {Boolean} success
   */
  exports.prototype['success'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],54:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/UserTokenRequestInnerUserField'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./UserTokenRequestInnerUserField'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UserTokenRequest = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.UserTokenRequestInnerUserField);
  }
}(this, function(ApiClient, UserTokenRequestInnerUserField) {
  'use strict';




  /**
   * The UserTokenRequest model module.
   * @module model/UserTokenRequest
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>UserTokenRequest</code>.
   * @alias module:model/UserTokenRequest
   * @class
   * @param organizationAccessToken {String} Organization Access token
   */
  var exports = function(organizationAccessToken) {
    var _this = this;


    _this['organizationAccessToken'] = organizationAccessToken;
  };

  /**
   * Constructs a <code>UserTokenRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserTokenRequest} obj Optional instance to populate.
   * @return {module:model/UserTokenRequest} The populated <code>UserTokenRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('user')) {
        obj['user'] = UserTokenRequestInnerUserField.constructFromObject(data['user']);
      }
      if (data.hasOwnProperty('organizationAccessToken')) {
        obj['organizationAccessToken'] = ApiClient.convertToType(data['organizationAccessToken'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/UserTokenRequestInnerUserField} user
   */
  exports.prototype['user'] = undefined;
  /**
   * Organization Access token
   * @member {String} organizationAccessToken
   */
  exports.prototype['organizationAccessToken'] = undefined;



  return exports;
}));



},{"../ApiClient":5,"./UserTokenRequestInnerUserField":55}],55:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UserTokenRequestInnerUserField = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The UserTokenRequestInnerUserField model module.
   * @module model/UserTokenRequestInnerUserField
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>UserTokenRequestInnerUserField</code>.
   * @alias module:model/UserTokenRequestInnerUserField
   * @class
   */
  var exports = function() {
    var _this = this;


  };

  /**
   * Constructs a <code>UserTokenRequestInnerUserField</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserTokenRequestInnerUserField} obj Optional instance to populate.
   * @return {module:model/UserTokenRequestInnerUserField} The populated <code>UserTokenRequestInnerUserField</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
    }
    return obj;
  }

  /**
   * WordPress user ID
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],56:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/UserTokenSuccessfulResponseInnerUserField'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./UserTokenSuccessfulResponseInnerUserField'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UserTokenSuccessfulResponse = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.UserTokenSuccessfulResponseInnerUserField);
  }
}(this, function(ApiClient, UserTokenSuccessfulResponseInnerUserField) {
  'use strict';




  /**
   * The UserTokenSuccessfulResponse model module.
   * @module model/UserTokenSuccessfulResponse
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>UserTokenSuccessfulResponse</code>.
   * @alias module:model/UserTokenSuccessfulResponse
   * @class
   * @param code {Number} Status code
   * @param message {String} Message
   * @param user {module:model/UserTokenSuccessfulResponseInnerUserField} 
   */
  var exports = function(code, message, user) {
    var _this = this;

    _this['code'] = code;
    _this['message'] = message;
    _this['user'] = user;
  };

  /**
   * Constructs a <code>UserTokenSuccessfulResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserTokenSuccessfulResponse} obj Optional instance to populate.
   * @return {module:model/UserTokenSuccessfulResponse} The populated <code>UserTokenSuccessfulResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('code')) {
        obj['code'] = ApiClient.convertToType(data['code'], 'Number');
      }
      if (data.hasOwnProperty('message')) {
        obj['message'] = ApiClient.convertToType(data['message'], 'String');
      }
      if (data.hasOwnProperty('user')) {
        obj['user'] = UserTokenSuccessfulResponseInnerUserField.constructFromObject(data['user']);
      }
    }
    return obj;
  }

  /**
   * Status code
   * @member {Number} code
   */
  exports.prototype['code'] = undefined;
  /**
   * Message
   * @member {String} message
   */
  exports.prototype['message'] = undefined;
  /**
   * @member {module:model/UserTokenSuccessfulResponseInnerUserField} user
   */
  exports.prototype['user'] = undefined;



  return exports;
}));



},{"../ApiClient":5,"./UserTokenSuccessfulResponseInnerUserField":57}],57:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UserTokenSuccessfulResponseInnerUserField = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The UserTokenSuccessfulResponseInnerUserField model module.
   * @module model/UserTokenSuccessfulResponseInnerUserField
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>UserTokenSuccessfulResponseInnerUserField</code>.
   * @alias module:model/UserTokenSuccessfulResponseInnerUserField
   * @class
   * @param id {Number} WordPress user ID
   * @param accessToken {String} User token
   */
  var exports = function(id, accessToken) {
    var _this = this;

    _this['id'] = id;
    _this['access_token'] = accessToken;
  };

  /**
   * Constructs a <code>UserTokenSuccessfulResponseInnerUserField</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserTokenSuccessfulResponseInnerUserField} obj Optional instance to populate.
   * @return {module:model/UserTokenSuccessfulResponseInnerUserField} The populated <code>UserTokenSuccessfulResponseInnerUserField</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('access_token')) {
        obj['access_token'] = ApiClient.convertToType(data['access_token'], 'String');
      }
    }
    return obj;
  }

  /**
   * WordPress user ID
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * User token
   * @member {String} access_token
   */
  exports.prototype['access_token'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],58:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UserVariable = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The UserVariable model module.
   * @module model/UserVariable
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>UserVariable</code>.
   * @alias module:model/UserVariable
   * @class
   * @param variableId {Number} ID of variable
   */
  var exports = function(variableId) {
    var _this = this;




    _this['variableId'] = variableId;




















































  };

  /**
   * Constructs a <code>UserVariable</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserVariable} obj Optional instance to populate.
   * @return {module:model/UserVariable} The populated <code>UserVariable</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('parentId')) {
        obj['parentId'] = ApiClient.convertToType(data['parentId'], 'Number');
      }
      if (data.hasOwnProperty('userId')) {
        obj['userId'] = ApiClient.convertToType(data['userId'], 'Number');
      }
      if (data.hasOwnProperty('clientId')) {
        obj['clientId'] = ApiClient.convertToType(data['clientId'], 'String');
      }
      if (data.hasOwnProperty('variableId')) {
        obj['variableId'] = ApiClient.convertToType(data['variableId'], 'Number');
      }
      if (data.hasOwnProperty('defaultUnitId')) {
        obj['defaultUnitId'] = ApiClient.convertToType(data['defaultUnitId'], 'Number');
      }
      if (data.hasOwnProperty('minimumAllowedValue')) {
        obj['minimumAllowedValue'] = ApiClient.convertToType(data['minimumAllowedValue'], 'Number');
      }
      if (data.hasOwnProperty('maximumAllowedValue')) {
        obj['maximumAllowedValue'] = ApiClient.convertToType(data['maximumAllowedValue'], 'Number');
      }
      if (data.hasOwnProperty('fillingValue')) {
        obj['fillingValue'] = ApiClient.convertToType(data['fillingValue'], 'Number');
      }
      if (data.hasOwnProperty('joinWith')) {
        obj['joinWith'] = ApiClient.convertToType(data['joinWith'], 'Number');
      }
      if (data.hasOwnProperty('onsetDelay')) {
        obj['onsetDelay'] = ApiClient.convertToType(data['onsetDelay'], 'Number');
      }
      if (data.hasOwnProperty('durationOfAction')) {
        obj['durationOfAction'] = ApiClient.convertToType(data['durationOfAction'], 'Number');
      }
      if (data.hasOwnProperty('variableCategoryId')) {
        obj['variableCategoryId'] = ApiClient.convertToType(data['variableCategoryId'], 'Number');
      }
      if (data.hasOwnProperty('updated')) {
        obj['updated'] = ApiClient.convertToType(data['updated'], 'Number');
      }
      if (data.hasOwnProperty('public')) {
        obj['public'] = ApiClient.convertToType(data['public'], 'Number');
      }
      if (data.hasOwnProperty('causeOnly')) {
        obj['causeOnly'] = ApiClient.convertToType(data['causeOnly'], 'Boolean');
      }
      if (data.hasOwnProperty('fillingType')) {
        obj['fillingType'] = ApiClient.convertToType(data['fillingType'], 'String');
      }
      if (data.hasOwnProperty('numberOfMeasurements')) {
        obj['numberOfMeasurements'] = ApiClient.convertToType(data['numberOfMeasurements'], 'Number');
      }
      if (data.hasOwnProperty('numberOfProcessedDailyMeasurements')) {
        obj['numberOfProcessedDailyMeasurements'] = ApiClient.convertToType(data['numberOfProcessedDailyMeasurements'], 'Number');
      }
      if (data.hasOwnProperty('measurementsAtLastAnalysis')) {
        obj['measurementsAtLastAnalysis'] = ApiClient.convertToType(data['measurementsAtLastAnalysis'], 'Number');
      }
      if (data.hasOwnProperty('lastUnitId')) {
        obj['lastUnitId'] = ApiClient.convertToType(data['lastUnitId'], 'Number');
      }
      if (data.hasOwnProperty('lastOriginalUnitId')) {
        obj['lastOriginalUnitId'] = ApiClient.convertToType(data['lastOriginalUnitId'], 'Number');
      }
      if (data.hasOwnProperty('lastValue')) {
        obj['lastValue'] = ApiClient.convertToType(data['lastValue'], 'Number');
      }
      if (data.hasOwnProperty('lastOriginalValue')) {
        obj['lastOriginalValue'] = ApiClient.convertToType(data['lastOriginalValue'], 'Number');
      }
      if (data.hasOwnProperty('numberOfCorrelations')) {
        obj['numberOfCorrelations'] = ApiClient.convertToType(data['numberOfCorrelations'], 'Number');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('errorMessage')) {
        obj['errorMessage'] = ApiClient.convertToType(data['errorMessage'], 'String');
      }
      if (data.hasOwnProperty('lastSuccessfulUpdateTime')) {
        obj['lastSuccessfulUpdateTime'] = ApiClient.convertToType(data['lastSuccessfulUpdateTime'], 'Date');
      }
      if (data.hasOwnProperty('standard_deviation')) {
        obj['standard_deviation'] = ApiClient.convertToType(data['standard_deviation'], 'Number');
      }
      if (data.hasOwnProperty('variance')) {
        obj['variance'] = ApiClient.convertToType(data['variance'], 'Number');
      }
      if (data.hasOwnProperty('minimumRecordedValue')) {
        obj['minimumRecordedValue'] = ApiClient.convertToType(data['minimumRecordedValue'], 'Number');
      }
      if (data.hasOwnProperty('maximumRecordedDailyValue')) {
        obj['maximumRecordedDailyValue'] = ApiClient.convertToType(data['maximumRecordedDailyValue'], 'Number');
      }
      if (data.hasOwnProperty('mean')) {
        obj['mean'] = ApiClient.convertToType(data['mean'], 'Number');
      }
      if (data.hasOwnProperty('median')) {
        obj['median'] = ApiClient.convertToType(data['median'], 'Number');
      }
      if (data.hasOwnProperty('mostCommonUnitId')) {
        obj['mostCommonUnitId'] = ApiClient.convertToType(data['mostCommonUnitId'], 'Number');
      }
      if (data.hasOwnProperty('mostCommonValue')) {
        obj['mostCommonValue'] = ApiClient.convertToType(data['mostCommonValue'], 'Number');
      }
      if (data.hasOwnProperty('numberOfUniqueDailyValues')) {
        obj['numberOfUniqueDailyValues'] = ApiClient.convertToType(data['numberOfUniqueDailyValues'], 'Number');
      }
      if (data.hasOwnProperty('numberOfChanges')) {
        obj['numberOfChanges'] = ApiClient.convertToType(data['numberOfChanges'], 'Number');
      }
      if (data.hasOwnProperty('skewness')) {
        obj['skewness'] = ApiClient.convertToType(data['skewness'], 'Number');
      }
      if (data.hasOwnProperty('kurtosis')) {
        obj['kurtosis'] = ApiClient.convertToType(data['kurtosis'], 'Number');
      }
      if (data.hasOwnProperty('latitude')) {
        obj['latitude'] = ApiClient.convertToType(data['latitude'], 'Number');
      }
      if (data.hasOwnProperty('longitude')) {
        obj['longitude'] = ApiClient.convertToType(data['longitude'], 'Number');
      }
      if (data.hasOwnProperty('location')) {
        obj['location'] = ApiClient.convertToType(data['location'], 'String');
      }
      if (data.hasOwnProperty('experimentStartTime')) {
        obj['experimentStartTime'] = ApiClient.convertToType(data['experimentStartTime'], 'Date');
      }
      if (data.hasOwnProperty('experimentEndTime')) {
        obj['experimentEndTime'] = ApiClient.convertToType(data['experimentEndTime'], 'Date');
      }
      if (data.hasOwnProperty('createdAt')) {
        obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Date');
      }
      if (data.hasOwnProperty('updatedAt')) {
        obj['updatedAt'] = ApiClient.convertToType(data['updatedAt'], 'Date');
      }
      if (data.hasOwnProperty('outcome')) {
        obj['outcome'] = ApiClient.convertToType(data['outcome'], 'Boolean');
      }
      if (data.hasOwnProperty('sources')) {
        obj['sources'] = ApiClient.convertToType(data['sources'], 'String');
      }
      if (data.hasOwnProperty('earliestSourceTime')) {
        obj['earliestSourceTime'] = ApiClient.convertToType(data['earliestSourceTime'], 'Number');
      }
      if (data.hasOwnProperty('latestSourceTime')) {
        obj['latestSourceTime'] = ApiClient.convertToType(data['latestSourceTime'], 'Number');
      }
      if (data.hasOwnProperty('earliestMeasurementTime')) {
        obj['earliestMeasurementTime'] = ApiClient.convertToType(data['earliestMeasurementTime'], 'Number');
      }
      if (data.hasOwnProperty('latestMeasurementTime')) {
        obj['latestMeasurementTime'] = ApiClient.convertToType(data['latestMeasurementTime'], 'Number');
      }
      if (data.hasOwnProperty('earliestFillingTime')) {
        obj['earliestFillingTime'] = ApiClient.convertToType(data['earliestFillingTime'], 'Number');
      }
      if (data.hasOwnProperty('latestFillingTime')) {
        obj['latestFillingTime'] = ApiClient.convertToType(data['latestFillingTime'], 'Number');
      }
      if (data.hasOwnProperty('imageUrl')) {
        obj['imageUrl'] = ApiClient.convertToType(data['imageUrl'], 'String');
      }
      if (data.hasOwnProperty('ionIcon')) {
        obj['ionIcon'] = ApiClient.convertToType(data['ionIcon'], 'String');
      }
    }
    return obj;
  }

  /**
   * ID of the parent variable if this variable has any parent
   * @member {Number} parentId
   */
  exports.prototype['parentId'] = undefined;
  /**
   * User ID
   * @member {Number} userId
   */
  exports.prototype['userId'] = undefined;
  /**
   * clientId
   * @member {String} clientId
   */
  exports.prototype['clientId'] = undefined;
  /**
   * ID of variable
   * @member {Number} variableId
   */
  exports.prototype['variableId'] = undefined;
  /**
   * ID of unit to use for this variable
   * @member {Number} defaultUnitId
   */
  exports.prototype['defaultUnitId'] = undefined;
  /**
   * The minimum allowed value for measurements. While you can record a value below this minimum, it will be excluded from the correlation analysis.
   * @member {Number} minimumAllowedValue
   */
  exports.prototype['minimumAllowedValue'] = undefined;
  /**
   * The maximum allowed value for measurements. While you can record a value above this maximum, it will be excluded from the correlation analysis.
   * @member {Number} maximumAllowedValue
   */
  exports.prototype['maximumAllowedValue'] = undefined;
  /**
   * When it comes to analysis to determine the effects of this variable, knowing when it did not occur is as important as knowing when it did occur. For example, if you are tracking a medication, it is important to know when you did not take it, but you do not have to log zero values for all the days when you haven't taken it. Hence, you can specify a filling value (typically 0) to insert whenever data is missing.
   * @member {Number} fillingValue
   */
  exports.prototype['fillingValue'] = undefined;
  /**
   * The Variable this Variable should be joined with. If the variable is joined with some other variable then it is not shown to user in the list of variables
   * @member {Number} joinWith
   */
  exports.prototype['joinWith'] = undefined;
  /**
   * The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
   * @member {Number} onsetDelay
   */
  exports.prototype['onsetDelay'] = undefined;
  /**
   * The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
   * @member {Number} durationOfAction
   */
  exports.prototype['durationOfAction'] = undefined;
  /**
   * ID of variable category
   * @member {Number} variableCategoryId
   */
  exports.prototype['variableCategoryId'] = undefined;
  /**
   * updated
   * @member {Number} updated
   */
  exports.prototype['updated'] = undefined;
  /**
   * Is variable public
   * @member {Number} public
   */
  exports.prototype['public'] = undefined;
  /**
   * A value of 1 indicates that this variable is generally a cause in a causal relationship.  An example of a causeOnly variable would be a variable such as Cloud Cover which would generally not be influenced by the behaviour of the user
   * @member {Boolean} causeOnly
   */
  exports.prototype['causeOnly'] = undefined;
  /**
   * 0 -> No filling, 1 -> Use filling-value
   * @member {String} fillingType
   */
  exports.prototype['fillingType'] = undefined;
  /**
   * Number of measurements
   * @member {Number} numberOfMeasurements
   */
  exports.prototype['numberOfMeasurements'] = undefined;
  /**
   * Number of processed measurements
   * @member {Number} numberOfProcessedDailyMeasurements
   */
  exports.prototype['numberOfProcessedDailyMeasurements'] = undefined;
  /**
   * Number of measurements at last analysis
   * @member {Number} measurementsAtLastAnalysis
   */
  exports.prototype['measurementsAtLastAnalysis'] = undefined;
  /**
   * ID of last Unit
   * @member {Number} lastUnitId
   */
  exports.prototype['lastUnitId'] = undefined;
  /**
   * ID of last original Unit
   * @member {Number} lastOriginalUnitId
   */
  exports.prototype['lastOriginalUnitId'] = undefined;
  /**
   * Last Value
   * @member {Number} lastValue
   */
  exports.prototype['lastValue'] = undefined;
  /**
   * Last original value which is stored
   * @member {Number} lastOriginalValue
   */
  exports.prototype['lastOriginalValue'] = undefined;
  /**
   * Number of correlations for this variable
   * @member {Number} numberOfCorrelations
   */
  exports.prototype['numberOfCorrelations'] = undefined;
  /**
   * status
   * @member {String} status
   */
  exports.prototype['status'] = undefined;
  /**
   * error_message
   * @member {String} errorMessage
   */
  exports.prototype['errorMessage'] = undefined;
  /**
   * When this variable or its settings were last updated
   * @member {Date} lastSuccessfulUpdateTime
   */
  exports.prototype['lastSuccessfulUpdateTime'] = undefined;
  /**
   * Standard deviation
   * @member {Number} standard_deviation
   */
  exports.prototype['standard_deviation'] = undefined;
  /**
   * Variance
   * @member {Number} variance
   */
  exports.prototype['variance'] = undefined;
  /**
   * Minimum recorded value of this variable
   * @member {Number} minimumRecordedValue
   */
  exports.prototype['minimumRecordedValue'] = undefined;
  /**
   * Maximum recorded daily value of this variable
   * @member {Number} maximumRecordedDailyValue
   */
  exports.prototype['maximumRecordedDailyValue'] = undefined;
  /**
   * Mean
   * @member {Number} mean
   */
  exports.prototype['mean'] = undefined;
  /**
   * Median
   * @member {Number} median
   */
  exports.prototype['median'] = undefined;
  /**
   * Most common Unit ID
   * @member {Number} mostCommonUnitId
   */
  exports.prototype['mostCommonUnitId'] = undefined;
  /**
   * Most common value
   * @member {Number} mostCommonValue
   */
  exports.prototype['mostCommonValue'] = undefined;
  /**
   * Number of unique daily values
   * @member {Number} numberOfUniqueDailyValues
   */
  exports.prototype['numberOfUniqueDailyValues'] = undefined;
  /**
   * Number of changes
   * @member {Number} numberOfChanges
   */
  exports.prototype['numberOfChanges'] = undefined;
  /**
   * Skewness
   * @member {Number} skewness
   */
  exports.prototype['skewness'] = undefined;
  /**
   * Kurtosis
   * @member {Number} kurtosis
   */
  exports.prototype['kurtosis'] = undefined;
  /**
   * Latitude
   * @member {Number} latitude
   */
  exports.prototype['latitude'] = undefined;
  /**
   * Longitude
   * @member {Number} longitude
   */
  exports.prototype['longitude'] = undefined;
  /**
   * Location
   * @member {String} location
   */
  exports.prototype['location'] = undefined;
  /**
   * Earliest measurement start_time to be used in analysis. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} experimentStartTime
   */
  exports.prototype['experimentStartTime'] = undefined;
  /**
   * Latest measurement start_time to be used in analysis. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} experimentEndTime
   */
  exports.prototype['experimentEndTime'] = undefined;
  /**
   * When the record was first created. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} createdAt
   */
  exports.prototype['createdAt'] = undefined;
  /**
   * When the record in the database was last updated. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} updatedAt
   */
  exports.prototype['updatedAt'] = undefined;
  /**
   * Outcome variables (those with `outcome` == 1) are variables for which a human would generally want to identify the influencing factors. These include symptoms of illness, physique, mood, cognitive performance, etc.  Generally correlation calculations are only performed on outcome variables
   * @member {Boolean} outcome
   */
  exports.prototype['outcome'] = undefined;
  /**
   * Comma-separated list of source names to limit variables to those sources
   * @member {String} sources
   */
  exports.prototype['sources'] = undefined;
  /**
   * Earliest source time
   * @member {Number} earliestSourceTime
   */
  exports.prototype['earliestSourceTime'] = undefined;
  /**
   * Latest source time
   * @member {Number} latestSourceTime
   */
  exports.prototype['latestSourceTime'] = undefined;
  /**
   * Earliest measurement time
   * @member {Number} earliestMeasurementTime
   */
  exports.prototype['earliestMeasurementTime'] = undefined;
  /**
   * Latest measurement time
   * @member {Number} latestMeasurementTime
   */
  exports.prototype['latestMeasurementTime'] = undefined;
  /**
   * Earliest filling time
   * @member {Number} earliestFillingTime
   */
  exports.prototype['earliestFillingTime'] = undefined;
  /**
   * Latest filling time
   * @member {Number} latestFillingTime
   */
  exports.prototype['latestFillingTime'] = undefined;
  /**
   * 
   * @member {String} imageUrl
   */
  exports.prototype['imageUrl'] = undefined;
  /**
   * 
   * @member {String} ionIcon
   */
  exports.prototype['ionIcon'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],59:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UserVariableDelete = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The UserVariableDelete model module.
   * @module model/UserVariableDelete
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>UserVariableDelete</code>.
   * @alias module:model/UserVariableDelete
   * @class
   * @param variableId {Number} Id of the variable whose measurements should be deleted
   */
  var exports = function(variableId) {
    var _this = this;

    _this['variableId'] = variableId;
  };

  /**
   * Constructs a <code>UserVariableDelete</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserVariableDelete} obj Optional instance to populate.
   * @return {module:model/UserVariableDelete} The populated <code>UserVariableDelete</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('variableId')) {
        obj['variableId'] = ApiClient.convertToType(data['variableId'], 'Number');
      }
    }
    return obj;
  }

  /**
   * Id of the variable whose measurements should be deleted
   * @member {Number} variableId
   */
  exports.prototype['variableId'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],60:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UserVariableRelationship = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The UserVariableRelationship model module.
   * @module model/UserVariableRelationship
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>UserVariableRelationship</code>.
   * @alias module:model/UserVariableRelationship
   * @class
   * @param confidenceLevel {String} Our confidence that a consistent predictive relationship exists based on the amount of evidence, reproducibility, and other factors
   * @param confidenceScore {Number} A quantitative representation of our confidence that a consistent predictive relationship exists based on the amount of evidence, reproducibility, and other factors
   * @param direction {String} Direction is positive if higher predictor values generally precede higher outcome values. Direction is negative if higher predictor values generally precede lower outcome values.
   * @param durationOfAction {Number} The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
   * @param outcomeVariableId {Number} Variable ID for the outcome variable
   * @param predictorVariableId {Number} Variable ID for the predictor variable
   * @param predictorUnitId {Number} ID for default unit of the predictor variable
   * @param sinnRank {Number} A value representative of the relevance of this predictor relative to other predictors of this outcome.  Usually used for relevancy sorting.
   * @param strengthLevel {String} Can be weak, medium, or strong based on the size of the effect which the predictor appears to have on the outcome relative to other variable relationship strength scores.
   * @param strengthScore {Number} A value represented to the size of the effect which the predictor appears to have on the outcome.
   * @param valuePredictingHighOutcome {Number} Value for the predictor variable (in it's default unit) which typically precedes an above average outcome value
   * @param valuePredictingLowOutcome {Number} Value for the predictor variable (in it's default unit) which typically precedes a below average outcome value
   */
  var exports = function(confidenceLevel, confidenceScore, direction, durationOfAction, outcomeVariableId, predictorVariableId, predictorUnitId, sinnRank, strengthLevel, strengthScore, valuePredictingHighOutcome, valuePredictingLowOutcome) {
    var _this = this;


    _this['confidence_level'] = confidenceLevel;
    _this['confidence_score'] = confidenceScore;
    _this['direction'] = direction;
    _this['duration_of_action'] = durationOfAction;


    _this['outcome_variableId'] = outcomeVariableId;
    _this['predictor_variableId'] = predictorVariableId;
    _this['predictor_unit_id'] = predictorUnitId;
    _this['sinn_rank'] = sinnRank;
    _this['strength_level'] = strengthLevel;
    _this['strength_score'] = strengthScore;


    _this['value_predicting_high_outcome'] = valuePredictingHighOutcome;
    _this['value_predicting_low_outcome'] = valuePredictingLowOutcome;
  };

  /**
   * Constructs a <code>UserVariableRelationship</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserVariableRelationship} obj Optional instance to populate.
   * @return {module:model/UserVariableRelationship} The populated <code>UserVariableRelationship</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('confidence_level')) {
        obj['confidence_level'] = ApiClient.convertToType(data['confidence_level'], 'String');
      }
      if (data.hasOwnProperty('confidence_score')) {
        obj['confidence_score'] = ApiClient.convertToType(data['confidence_score'], 'Number');
      }
      if (data.hasOwnProperty('direction')) {
        obj['direction'] = ApiClient.convertToType(data['direction'], 'String');
      }
      if (data.hasOwnProperty('duration_of_action')) {
        obj['duration_of_action'] = ApiClient.convertToType(data['duration_of_action'], 'Number');
      }
      if (data.hasOwnProperty('error_message')) {
        obj['error_message'] = ApiClient.convertToType(data['error_message'], 'String');
      }
      if (data.hasOwnProperty('onset_delay')) {
        obj['onset_delay'] = ApiClient.convertToType(data['onset_delay'], 'Number');
      }
      if (data.hasOwnProperty('outcome_variableId')) {
        obj['outcome_variableId'] = ApiClient.convertToType(data['outcome_variableId'], 'Number');
      }
      if (data.hasOwnProperty('predictor_variableId')) {
        obj['predictor_variableId'] = ApiClient.convertToType(data['predictor_variableId'], 'Number');
      }
      if (data.hasOwnProperty('predictor_unit_id')) {
        obj['predictor_unit_id'] = ApiClient.convertToType(data['predictor_unit_id'], 'Number');
      }
      if (data.hasOwnProperty('sinn_rank')) {
        obj['sinn_rank'] = ApiClient.convertToType(data['sinn_rank'], 'Number');
      }
      if (data.hasOwnProperty('strength_level')) {
        obj['strength_level'] = ApiClient.convertToType(data['strength_level'], 'String');
      }
      if (data.hasOwnProperty('strength_score')) {
        obj['strength_score'] = ApiClient.convertToType(data['strength_score'], 'Number');
      }
      if (data.hasOwnProperty('userId')) {
        obj['userId'] = ApiClient.convertToType(data['userId'], 'Number');
      }
      if (data.hasOwnProperty('vote')) {
        obj['vote'] = ApiClient.convertToType(data['vote'], 'String');
      }
      if (data.hasOwnProperty('value_predicting_high_outcome')) {
        obj['value_predicting_high_outcome'] = ApiClient.convertToType(data['value_predicting_high_outcome'], 'Number');
      }
      if (data.hasOwnProperty('value_predicting_low_outcome')) {
        obj['value_predicting_low_outcome'] = ApiClient.convertToType(data['value_predicting_low_outcome'], 'Number');
      }
    }
    return obj;
  }

  /**
   * id
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * Our confidence that a consistent predictive relationship exists based on the amount of evidence, reproducibility, and other factors
   * @member {String} confidence_level
   */
  exports.prototype['confidence_level'] = undefined;
  /**
   * A quantitative representation of our confidence that a consistent predictive relationship exists based on the amount of evidence, reproducibility, and other factors
   * @member {Number} confidence_score
   */
  exports.prototype['confidence_score'] = undefined;
  /**
   * Direction is positive if higher predictor values generally precede higher outcome values. Direction is negative if higher predictor values generally precede lower outcome values.
   * @member {String} direction
   */
  exports.prototype['direction'] = undefined;
  /**
   * The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
   * @member {Number} duration_of_action
   */
  exports.prototype['duration_of_action'] = undefined;
  /**
   * error_message
   * @member {String} error_message
   */
  exports.prototype['error_message'] = undefined;
  /**
   * The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
   * @member {Number} onset_delay
   */
  exports.prototype['onset_delay'] = undefined;
  /**
   * Variable ID for the outcome variable
   * @member {Number} outcome_variableId
   */
  exports.prototype['outcome_variableId'] = undefined;
  /**
   * Variable ID for the predictor variable
   * @member {Number} predictor_variableId
   */
  exports.prototype['predictor_variableId'] = undefined;
  /**
   * ID for default unit of the predictor variable
   * @member {Number} predictor_unit_id
   */
  exports.prototype['predictor_unit_id'] = undefined;
  /**
   * A value representative of the relevance of this predictor relative to other predictors of this outcome.  Usually used for relevancy sorting.
   * @member {Number} sinn_rank
   */
  exports.prototype['sinn_rank'] = undefined;
  /**
   * Can be weak, medium, or strong based on the size of the effect which the predictor appears to have on the outcome relative to other variable relationship strength scores.
   * @member {String} strength_level
   */
  exports.prototype['strength_level'] = undefined;
  /**
   * A value represented to the size of the effect which the predictor appears to have on the outcome.
   * @member {Number} strength_score
   */
  exports.prototype['strength_score'] = undefined;
  /**
   * userId
   * @member {Number} userId
   */
  exports.prototype['userId'] = undefined;
  /**
   * vote
   * @member {String} vote
   */
  exports.prototype['vote'] = undefined;
  /**
   * Value for the predictor variable (in it's default unit) which typically precedes an above average outcome value
   * @member {Number} value_predicting_high_outcome
   */
  exports.prototype['value_predicting_high_outcome'] = undefined;
  /**
   * Value for the predictor variable (in it's default unit) which typically precedes a below average outcome value
   * @member {Number} value_predicting_low_outcome
   */
  exports.prototype['value_predicting_low_outcome'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],61:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.UserVariables = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The UserVariables model module.
   * @module model/UserVariables
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>UserVariables</code>.
   * @alias module:model/UserVariables
   * @class
   * @param user {Number} User ID
   * @param variableId {Number} Common variable id
   */
  var exports = function(user, variableId) {
    var _this = this;

    _this['user'] = user;
    _this['variableId'] = variableId;









  };

  /**
   * Constructs a <code>UserVariables</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserVariables} obj Optional instance to populate.
   * @return {module:model/UserVariables} The populated <code>UserVariables</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('user')) {
        obj['user'] = ApiClient.convertToType(data['user'], 'Number');
      }
      if (data.hasOwnProperty('variableId')) {
        obj['variableId'] = ApiClient.convertToType(data['variableId'], 'Number');
      }
      if (data.hasOwnProperty('durationOfAction')) {
        obj['durationOfAction'] = ApiClient.convertToType(data['durationOfAction'], 'Number');
      }
      if (data.hasOwnProperty('fillingValue')) {
        obj['fillingValue'] = ApiClient.convertToType(data['fillingValue'], 'Number');
      }
      if (data.hasOwnProperty('joinWith')) {
        obj['joinWith'] = ApiClient.convertToType(data['joinWith'], 'String');
      }
      if (data.hasOwnProperty('maximumAllowedValue')) {
        obj['maximumAllowedValue'] = ApiClient.convertToType(data['maximumAllowedValue'], 'Number');
      }
      if (data.hasOwnProperty('minimumAllowedValue')) {
        obj['minimumAllowedValue'] = ApiClient.convertToType(data['minimumAllowedValue'], 'Number');
      }
      if (data.hasOwnProperty('onsetDelay')) {
        obj['onsetDelay'] = ApiClient.convertToType(data['onsetDelay'], 'Number');
      }
      if (data.hasOwnProperty('experimentStartTime')) {
        obj['experimentStartTime'] = ApiClient.convertToType(data['experimentStartTime'], 'String');
      }
      if (data.hasOwnProperty('experimentEndTime')) {
        obj['experimentEndTime'] = ApiClient.convertToType(data['experimentEndTime'], 'String');
      }
      if (data.hasOwnProperty('alias')) {
        obj['alias'] = ApiClient.convertToType(data['alias'], 'String');
      }
    }
    return obj;
  }

  /**
   * User ID
   * @member {Number} user
   */
  exports.prototype['user'] = undefined;
  /**
   * Common variable id
   * @member {Number} variableId
   */
  exports.prototype['variableId'] = undefined;
  /**
   * The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
   * @member {Number} durationOfAction
   */
  exports.prototype['durationOfAction'] = undefined;
  /**
   * When it comes to analysis to determine the effects of this variable, knowing when it did not occur is as important as knowing when it did occur. For example, if you are tracking a medication, it is important to know when you did not take it, but you do not have to log zero values for all the days when you haven't taken it. Hence, you can specify a filling value (typically 0) to insert whenever data is missing.
   * @member {Number} fillingValue
   */
  exports.prototype['fillingValue'] = undefined;
  /**
   * joinWith
   * @member {String} joinWith
   */
  exports.prototype['joinWith'] = undefined;
  /**
   * The maximum allowed value for measurements. While you can record a value above this maximum, it will be excluded from the correlation analysis.
   * @member {Number} maximumAllowedValue
   */
  exports.prototype['maximumAllowedValue'] = undefined;
  /**
   * The minimum allowed value for measurements. While you can record a value below this minimum, it will be excluded from the correlation analysis.
   * @member {Number} minimumAllowedValue
   */
  exports.prototype['minimumAllowedValue'] = undefined;
  /**
   * onsetDelay
   * @member {Number} onsetDelay
   */
  exports.prototype['onsetDelay'] = undefined;
  /**
   * Earliest measurement startTime that should be used in analysis. For instance, the date when you started tracking something.  Helpful in determining when to start 0 filling since we can assume the absence of a treatment measurement, for instance, indicates that the treatment was not applied rathter than simply not recorded.  Uses ISO string format
   * @member {String} experimentStartTime
   */
  exports.prototype['experimentStartTime'] = undefined;
  /**
   * Latest measurement startTime that should be used in analysis. For instance, the date when you stopped tracking something.  Helpful in determining when to stop 0 filling since we can assume the absence of a treatment measurement, for instance, indicates that the treatment was not applied rathter than simply not recorded.   Uses ISO string format
   * @member {String} experimentEndTime
   */
  exports.prototype['experimentEndTime'] = undefined;
  /**
   * User-defined display alias for variable name
   * @member {String} alias
   */
  exports.prototype['alias'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],62:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.ValueObject = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ValueObject model module.
   * @module model/ValueObject
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>ValueObject</code>.
   * @alias module:model/ValueObject
   * @class
   * @param timestamp {Number} Timestamp for the measurement event in epoch time (unixtime)
   * @param value {Number} Measurement value
   */
  var exports = function(timestamp, value) {
    var _this = this;

    _this['timestamp'] = timestamp;
    _this['value'] = value;

  };

  /**
   * Constructs a <code>ValueObject</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ValueObject} obj Optional instance to populate.
   * @return {module:model/ValueObject} The populated <code>ValueObject</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('timestamp')) {
        obj['timestamp'] = ApiClient.convertToType(data['timestamp'], 'Number');
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'Number');
      }
      if (data.hasOwnProperty('note')) {
        obj['note'] = ApiClient.convertToType(data['note'], 'String');
      }
    }
    return obj;
  }

  /**
   * Timestamp for the measurement event in epoch time (unixtime)
   * @member {Number} timestamp
   */
  exports.prototype['timestamp'] = undefined;
  /**
   * Measurement value
   * @member {Number} value
   */
  exports.prototype['value'] = undefined;
  /**
   * Optional note to include with the measurement
   * @member {String} note
   */
  exports.prototype['note'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],63:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Variable'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Variable'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.Variable = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.Variable);
  }
}(this, function(ApiClient, Variable) {
  'use strict';




  /**
   * The Variable model module.
   * @module model/Variable
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>Variable</code>.
   * @alias module:model/Variable
   * @class
   * @param name {String} User-defined variable display name.
   * @param category {String} Variable category like Mood, Sleep, Physical Activity, Treatment, Symptom, etc.
   * @param unitAbbreviatedName {String} Abbreviated name of the default unit for the variable
   * @param abbreviatedUnitId {Number} Id of the default unit for the variable
   * @param sources {String} Comma-separated list of source names to limit variables to those sources
   * @param minimumAllowedValue {Number} The minimum allowed value for measurements. While you can record a value below this minimum, it will be excluded from the correlation analysis.
   * @param maximumAllowedValue {Number} The maximum allowed value for measurements. While you can record a value above this maximum, it will be excluded from the correlation analysis.
   * @param combinationOperation {module:model/Variable.CombinationOperationEnum} Way to aggregate measurements over time. Options are \"MEAN\" or \"SUM\". SUM should be used for things like minutes of exercise.  If you use MEAN for exercise, then a person might exercise more minutes in one day but add separate measurements that were smaller.  So when we are doing correlational analysis, we would think that the person exercised less that day even though they exercised more.  Conversely, we must use MEAN for things such as ratings which cannot be SUMMED.
   * @param fillingValue {Number} When it comes to analysis to determine the effects of this variable, knowing when it did not occur is as important as knowing when it did occur. For example, if you are tracking a medication, it is important to know when you did not take it, but you do not have to log zero values for all the days when you haven't taken it. Hence, you can specify a filling value (typically 0) to insert whenever data is missing.
   * @param joinWith {String} The Variable this Variable should be joined with. If the variable is joined with some other variable then it is not shown to user in the list of variables.
   * @param joinedVariables {Array.<module:model/Variable>} Array of Variables that are joined with this Variable
   * @param parent {Number} Id of the parent variable if this variable has any parent
   * @param subVariables {Array.<module:model/Variable>} Array of Variables that are sub variables to this Variable
   * @param onsetDelay {Number} The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
   * @param durationOfAction {Number} The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
   * @param earliestMeasurementTime {Number} Earliest measurement time
   * @param latestMeasurementTime {Number} Latest measurement time
   * @param updated {Number} When this variable or its settings were last updated
   * @param causeOnly {Number} A value of 1 indicates that this variable is generally a cause in a causal relationship.  An example of a causeOnly variable would be a variable such as Cloud Cover which would generally not be influenced by the behaviour of the user.
   * @param numberOfCorrelations {Number} Number of correlations
   * @param outcome {Number} Outcome variables (those with `outcome` == 1) are variables for which a human would generally want to identify the influencing factors. These include symptoms of illness, physique, mood, cognitive performance, etc.  Generally correlation calculations are only performed on outcome variables.
   * @param rawMeasurementsAtLastAnalysis {Number} The number of measurements that a given user had for this variable the last time a correlation calculation was performed. Generally correlation values are only updated once the current number of measurements for a variable is more than 10% greater than the rawMeasurementsAtLastAnalysis.  This avoids a computationally-demanding recalculation when there's not enough new data to make a significant difference in the correlation.
   * @param numberOfRawMeasurements {Number} Number of measurements
   * @param lastUnit {String} Last unit
   * @param lastValue {Number} Last value
   * @param mostCommonValue {Number} Most common value
   * @param mostCommonUnit {String} Most common unit
   * @param lastSource {Number} Last source
   */
  var exports = function(name, category, unitAbbreviatedName, abbreviatedUnitId, sources, minimumAllowedValue, maximumAllowedValue, combinationOperation, fillingValue, joinWith, joinedVariables, parent, subVariables, onsetDelay, durationOfAction, earliestMeasurementTime, latestMeasurementTime, updated, causeOnly, numberOfCorrelations, outcome, rawMeasurementsAtLastAnalysis, numberOfRawMeasurements, lastUnit, lastValue, mostCommonValue, mostCommonUnit, lastSource) {
    var _this = this;


    _this['name'] = name;
    _this['category'] = category;
    _this['unitAbbreviatedName'] = unitAbbreviatedName;
    _this['abbreviatedUnitId'] = abbreviatedUnitId;
    _this['sources'] = sources;
    _this['minimumAllowedValue'] = minimumAllowedValue;
    _this['maximumAllowedValue'] = maximumAllowedValue;
    _this['combinationOperation'] = combinationOperation;
    _this['fillingValue'] = fillingValue;
    _this['joinWith'] = joinWith;
    _this['joinedVariables'] = joinedVariables;
    _this['parent'] = parent;
    _this['subVariables'] = subVariables;
    _this['onsetDelay'] = onsetDelay;
    _this['durationOfAction'] = durationOfAction;
    _this['earliestMeasurementTime'] = earliestMeasurementTime;
    _this['latestMeasurementTime'] = latestMeasurementTime;
    _this['updated'] = updated;
    _this['causeOnly'] = causeOnly;
    _this['numberOfCorrelations'] = numberOfCorrelations;
    _this['outcome'] = outcome;
    _this['rawMeasurementsAtLastAnalysis'] = rawMeasurementsAtLastAnalysis;
    _this['numberOfRawMeasurements'] = numberOfRawMeasurements;
    _this['lastUnit'] = lastUnit;
    _this['lastValue'] = lastValue;
    _this['mostCommonValue'] = mostCommonValue;
    _this['mostCommonUnit'] = mostCommonUnit;
    _this['lastSource'] = lastSource;


  };

  /**
   * Constructs a <code>Variable</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Variable} obj Optional instance to populate.
   * @return {module:model/Variable} The populated <code>Variable</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('category')) {
        obj['category'] = ApiClient.convertToType(data['category'], 'String');
      }
      if (data.hasOwnProperty('unitAbbreviatedName')) {
        obj['unitAbbreviatedName'] = ApiClient.convertToType(data['unitAbbreviatedName'], 'String');
      }
      if (data.hasOwnProperty('abbreviatedUnitId')) {
        obj['abbreviatedUnitId'] = ApiClient.convertToType(data['abbreviatedUnitId'], 'Number');
      }
      if (data.hasOwnProperty('sources')) {
        obj['sources'] = ApiClient.convertToType(data['sources'], 'String');
      }
      if (data.hasOwnProperty('minimumAllowedValue')) {
        obj['minimumAllowedValue'] = ApiClient.convertToType(data['minimumAllowedValue'], 'Number');
      }
      if (data.hasOwnProperty('maximumAllowedValue')) {
        obj['maximumAllowedValue'] = ApiClient.convertToType(data['maximumAllowedValue'], 'Number');
      }
      if (data.hasOwnProperty('combinationOperation')) {
        obj['combinationOperation'] = ApiClient.convertToType(data['combinationOperation'], 'String');
      }
      if (data.hasOwnProperty('fillingValue')) {
        obj['fillingValue'] = ApiClient.convertToType(data['fillingValue'], 'Number');
      }
      if (data.hasOwnProperty('joinWith')) {
        obj['joinWith'] = ApiClient.convertToType(data['joinWith'], 'String');
      }
      if (data.hasOwnProperty('joinedVariables')) {
        obj['joinedVariables'] = ApiClient.convertToType(data['joinedVariables'], [Variable]);
      }
      if (data.hasOwnProperty('parent')) {
        obj['parent'] = ApiClient.convertToType(data['parent'], 'Number');
      }
      if (data.hasOwnProperty('subVariables')) {
        obj['subVariables'] = ApiClient.convertToType(data['subVariables'], [Variable]);
      }
      if (data.hasOwnProperty('onsetDelay')) {
        obj['onsetDelay'] = ApiClient.convertToType(data['onsetDelay'], 'Number');
      }
      if (data.hasOwnProperty('durationOfAction')) {
        obj['durationOfAction'] = ApiClient.convertToType(data['durationOfAction'], 'Number');
      }
      if (data.hasOwnProperty('earliestMeasurementTime')) {
        obj['earliestMeasurementTime'] = ApiClient.convertToType(data['earliestMeasurementTime'], 'Number');
      }
      if (data.hasOwnProperty('latestMeasurementTime')) {
        obj['latestMeasurementTime'] = ApiClient.convertToType(data['latestMeasurementTime'], 'Number');
      }
      if (data.hasOwnProperty('updated')) {
        obj['updated'] = ApiClient.convertToType(data['updated'], 'Number');
      }
      if (data.hasOwnProperty('causeOnly')) {
        obj['causeOnly'] = ApiClient.convertToType(data['causeOnly'], 'Number');
      }
      if (data.hasOwnProperty('numberOfCorrelations')) {
        obj['numberOfCorrelations'] = ApiClient.convertToType(data['numberOfCorrelations'], 'Number');
      }
      if (data.hasOwnProperty('outcome')) {
        obj['outcome'] = ApiClient.convertToType(data['outcome'], 'Number');
      }
      if (data.hasOwnProperty('rawMeasurementsAtLastAnalysis')) {
        obj['rawMeasurementsAtLastAnalysis'] = ApiClient.convertToType(data['rawMeasurementsAtLastAnalysis'], 'Number');
      }
      if (data.hasOwnProperty('numberOfRawMeasurements')) {
        obj['numberOfRawMeasurements'] = ApiClient.convertToType(data['numberOfRawMeasurements'], 'Number');
      }
      if (data.hasOwnProperty('lastUnit')) {
        obj['lastUnit'] = ApiClient.convertToType(data['lastUnit'], 'String');
      }
      if (data.hasOwnProperty('lastValue')) {
        obj['lastValue'] = ApiClient.convertToType(data['lastValue'], 'Number');
      }
      if (data.hasOwnProperty('mostCommonValue')) {
        obj['mostCommonValue'] = ApiClient.convertToType(data['mostCommonValue'], 'Number');
      }
      if (data.hasOwnProperty('mostCommonUnit')) {
        obj['mostCommonUnit'] = ApiClient.convertToType(data['mostCommonUnit'], 'String');
      }
      if (data.hasOwnProperty('lastSource')) {
        obj['lastSource'] = ApiClient.convertToType(data['lastSource'], 'Number');
      }
      if (data.hasOwnProperty('imageUrl')) {
        obj['imageUrl'] = ApiClient.convertToType(data['imageUrl'], 'String');
      }
      if (data.hasOwnProperty('ionIcon')) {
        obj['ionIcon'] = ApiClient.convertToType(data['ionIcon'], 'String');
      }
    }
    return obj;
  }

  /**
   * Variable ID
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * User-defined variable display name.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Variable category like Mood, Sleep, Physical Activity, Treatment, Symptom, etc.
   * @member {String} category
   */
  exports.prototype['category'] = undefined;
  /**
   * Abbreviated name of the default unit for the variable
   * @member {String} unitAbbreviatedName
   */
  exports.prototype['unitAbbreviatedName'] = undefined;
  /**
   * Id of the default unit for the variable
   * @member {Number} abbreviatedUnitId
   */
  exports.prototype['abbreviatedUnitId'] = undefined;
  /**
   * Comma-separated list of source names to limit variables to those sources
   * @member {String} sources
   */
  exports.prototype['sources'] = undefined;
  /**
   * The minimum allowed value for measurements. While you can record a value below this minimum, it will be excluded from the correlation analysis.
   * @member {Number} minimumAllowedValue
   */
  exports.prototype['minimumAllowedValue'] = undefined;
  /**
   * The maximum allowed value for measurements. While you can record a value above this maximum, it will be excluded from the correlation analysis.
   * @member {Number} maximumAllowedValue
   */
  exports.prototype['maximumAllowedValue'] = undefined;
  /**
   * Way to aggregate measurements over time. Options are \"MEAN\" or \"SUM\". SUM should be used for things like minutes of exercise.  If you use MEAN for exercise, then a person might exercise more minutes in one day but add separate measurements that were smaller.  So when we are doing correlational analysis, we would think that the person exercised less that day even though they exercised more.  Conversely, we must use MEAN for things such as ratings which cannot be SUMMED.
   * @member {module:model/Variable.CombinationOperationEnum} combinationOperation
   */
  exports.prototype['combinationOperation'] = undefined;
  /**
   * When it comes to analysis to determine the effects of this variable, knowing when it did not occur is as important as knowing when it did occur. For example, if you are tracking a medication, it is important to know when you did not take it, but you do not have to log zero values for all the days when you haven't taken it. Hence, you can specify a filling value (typically 0) to insert whenever data is missing.
   * @member {Number} fillingValue
   */
  exports.prototype['fillingValue'] = undefined;
  /**
   * The Variable this Variable should be joined with. If the variable is joined with some other variable then it is not shown to user in the list of variables.
   * @member {String} joinWith
   */
  exports.prototype['joinWith'] = undefined;
  /**
   * Array of Variables that are joined with this Variable
   * @member {Array.<module:model/Variable>} joinedVariables
   */
  exports.prototype['joinedVariables'] = undefined;
  /**
   * Id of the parent variable if this variable has any parent
   * @member {Number} parent
   */
  exports.prototype['parent'] = undefined;
  /**
   * Array of Variables that are sub variables to this Variable
   * @member {Array.<module:model/Variable>} subVariables
   */
  exports.prototype['subVariables'] = undefined;
  /**
   * The amount of time in seconds that elapses after the predictor/stimulus event before the outcome as perceived by a self-tracker is known as the “onset delay”. For example, the “onset delay” between the time a person takes an aspirin (predictor/stimulus event) and the time a person perceives a change in their headache severity (outcome) is approximately 30 minutes.
   * @member {Number} onsetDelay
   */
  exports.prototype['onsetDelay'] = undefined;
  /**
   * The amount of time over which a predictor/stimulus event can exert an observable influence on an outcome variable’s value. For instance, aspirin (stimulus/predictor) typically decreases headache severity for approximately four hours (duration of action) following the onset delay.
   * @member {Number} durationOfAction
   */
  exports.prototype['durationOfAction'] = undefined;
  /**
   * Earliest measurement time
   * @member {Number} earliestMeasurementTime
   */
  exports.prototype['earliestMeasurementTime'] = undefined;
  /**
   * Latest measurement time
   * @member {Number} latestMeasurementTime
   */
  exports.prototype['latestMeasurementTime'] = undefined;
  /**
   * When this variable or its settings were last updated
   * @member {Number} updated
   */
  exports.prototype['updated'] = undefined;
  /**
   * A value of 1 indicates that this variable is generally a cause in a causal relationship.  An example of a causeOnly variable would be a variable such as Cloud Cover which would generally not be influenced by the behaviour of the user.
   * @member {Number} causeOnly
   */
  exports.prototype['causeOnly'] = undefined;
  /**
   * Number of correlations
   * @member {Number} numberOfCorrelations
   */
  exports.prototype['numberOfCorrelations'] = undefined;
  /**
   * Outcome variables (those with `outcome` == 1) are variables for which a human would generally want to identify the influencing factors. These include symptoms of illness, physique, mood, cognitive performance, etc.  Generally correlation calculations are only performed on outcome variables.
   * @member {Number} outcome
   */
  exports.prototype['outcome'] = undefined;
  /**
   * The number of measurements that a given user had for this variable the last time a correlation calculation was performed. Generally correlation values are only updated once the current number of measurements for a variable is more than 10% greater than the rawMeasurementsAtLastAnalysis.  This avoids a computationally-demanding recalculation when there's not enough new data to make a significant difference in the correlation.
   * @member {Number} rawMeasurementsAtLastAnalysis
   */
  exports.prototype['rawMeasurementsAtLastAnalysis'] = undefined;
  /**
   * Number of measurements
   * @member {Number} numberOfRawMeasurements
   */
  exports.prototype['numberOfRawMeasurements'] = undefined;
  /**
   * Last unit
   * @member {String} lastUnit
   */
  exports.prototype['lastUnit'] = undefined;
  /**
   * Last value
   * @member {Number} lastValue
   */
  exports.prototype['lastValue'] = undefined;
  /**
   * Most common value
   * @member {Number} mostCommonValue
   */
  exports.prototype['mostCommonValue'] = undefined;
  /**
   * Most common unit
   * @member {String} mostCommonUnit
   */
  exports.prototype['mostCommonUnit'] = undefined;
  /**
   * Last source
   * @member {Number} lastSource
   */
  exports.prototype['lastSource'] = undefined;
  /**
   * 
   * @member {String} imageUrl
   */
  exports.prototype['imageUrl'] = undefined;
  /**
   * 
   * @member {String} ionIcon
   */
  exports.prototype['ionIcon'] = undefined;


  /**
   * Allowed values for the <code>combinationOperation</code> property.
   * @enum {String}
   * @readonly
   */
  exports.CombinationOperationEnum = {
    /**
     * value: "MEAN"
     * @const
     */
    "MEAN": "MEAN",
    /**
     * value: "SUM"
     * @const
     */
    "SUM": "SUM"  };


  return exports;
}));



},{"../ApiClient":5,"./Variable":63}],64:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.VariableCategory = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The VariableCategory model module.
   * @module model/VariableCategory
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>VariableCategory</code>.
   * @alias module:model/VariableCategory
   * @class
   * @param name {String} Category name
   */
  var exports = function(name) {
    var _this = this;

    _this['name'] = name;
  };

  /**
   * Constructs a <code>VariableCategory</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/VariableCategory} obj Optional instance to populate.
   * @return {module:model/VariableCategory} The populated <code>VariableCategory</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
    }
    return obj;
  }

  /**
   * Category name
   * @member {String} name
   */
  exports.prototype['name'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],65:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.VariableNew = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The VariableNew model module.
   * @module model/VariableNew
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>VariableNew</code>.
   * @alias module:model/VariableNew
   * @class
   * @param name {String} User-defined variable display name.
   * @param category {String} Variable category like Mood, Sleep, Physical Activity, Treatment, Symptom, etc.
   * @param unit {String} Abbreviated name of the default unit for the variable
   * @param combinationOperation {module:model/VariableNew.CombinationOperationEnum} Way to aggregate measurements over time. Options are \"MEAN\" or \"SUM\". SUM should be used for things like minutes of exercise.  If you use MEAN for exercise, then a person might exercise more minutes in one day but add separate measurements that were smaller.  So when we are doing correlational analysis, we would think that the person exercised less that day even though they exercised more.  Conversely, we must use MEAN for things such as ratings which cannot be SUMMED.
   * @param parent {String} Parent
   */
  var exports = function(name, category, unit, combinationOperation, parent) {
    var _this = this;

    _this['name'] = name;
    _this['category'] = category;
    _this['unit'] = unit;
    _this['combinationOperation'] = combinationOperation;
    _this['parent'] = parent;
  };

  /**
   * Constructs a <code>VariableNew</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/VariableNew} obj Optional instance to populate.
   * @return {module:model/VariableNew} The populated <code>VariableNew</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('category')) {
        obj['category'] = ApiClient.convertToType(data['category'], 'String');
      }
      if (data.hasOwnProperty('unit')) {
        obj['unit'] = ApiClient.convertToType(data['unit'], 'String');
      }
      if (data.hasOwnProperty('combinationOperation')) {
        obj['combinationOperation'] = ApiClient.convertToType(data['combinationOperation'], 'String');
      }
      if (data.hasOwnProperty('parent')) {
        obj['parent'] = ApiClient.convertToType(data['parent'], 'String');
      }
    }
    return obj;
  }

  /**
   * User-defined variable display name.
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Variable category like Mood, Sleep, Physical Activity, Treatment, Symptom, etc.
   * @member {String} category
   */
  exports.prototype['category'] = undefined;
  /**
   * Abbreviated name of the default unit for the variable
   * @member {String} unit
   */
  exports.prototype['unit'] = undefined;
  /**
   * Way to aggregate measurements over time. Options are \"MEAN\" or \"SUM\". SUM should be used for things like minutes of exercise.  If you use MEAN for exercise, then a person might exercise more minutes in one day but add separate measurements that were smaller.  So when we are doing correlational analysis, we would think that the person exercised less that day even though they exercised more.  Conversely, we must use MEAN for things such as ratings which cannot be SUMMED.
   * @member {module:model/VariableNew.CombinationOperationEnum} combinationOperation
   */
  exports.prototype['combinationOperation'] = undefined;
  /**
   * Parent
   * @member {String} parent
   */
  exports.prototype['parent'] = undefined;


  /**
   * Allowed values for the <code>combinationOperation</code> property.
   * @enum {String}
   * @readonly
   */
  exports.CombinationOperationEnum = {
    /**
     * value: "MEAN"
     * @const
     */
    "MEAN": "MEAN",
    /**
     * value: "SUM"
     * @const
     */
    "SUM": "SUM"  };


  return exports;
}));



},{"../ApiClient":5}],66:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/VariableNew'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./VariableNew'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.VariablesNew = factory(root.QuantimodoApi.ApiClient, root.QuantimodoApi.VariableNew);
  }
}(this, function(ApiClient, VariableNew) {
  'use strict';




  /**
   * The VariablesNew model module.
   * @module model/VariablesNew
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>VariablesNew</code>.
   * New variables
   * @alias module:model/VariablesNew
   * @class
   * @extends Array
   */
  var exports = function() {
    var _this = this;
    _this = new Array();
    Object.setPrototypeOf(_this, exports);

    return _this;
  };

  /**
   * Constructs a <code>VariablesNew</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/VariablesNew} obj Optional instance to populate.
   * @return {module:model/VariablesNew} The populated <code>VariablesNew</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      ApiClient.constructFromObject(data, obj, VariableNew);

    }
    return obj;
  }




  return exports;
}));



},{"../ApiClient":5,"./VariableNew":65}],67:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.Vote = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Vote model module.
   * @module model/Vote
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>Vote</code>.
   * @alias module:model/Vote
   * @class
   * @param clientId {String} clientId
   * @param userId {Number} ID of User
   * @param causeId {Number} ID of the predictor variable
   * @param effectId {Number} ID of effect variable
   * @param value {Number} Value of Vote
   */
  var exports = function(clientId, userId, causeId, effectId, value) {
    var _this = this;


    _this['clientId'] = clientId;
    _this['userId'] = userId;
    _this['causeId'] = causeId;
    _this['effectId'] = effectId;
    _this['value'] = value;


  };

  /**
   * Constructs a <code>Vote</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Vote} obj Optional instance to populate.
   * @return {module:model/Vote} The populated <code>Vote</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Number');
      }
      if (data.hasOwnProperty('clientId')) {
        obj['clientId'] = ApiClient.convertToType(data['clientId'], 'String');
      }
      if (data.hasOwnProperty('userId')) {
        obj['userId'] = ApiClient.convertToType(data['userId'], 'Number');
      }
      if (data.hasOwnProperty('causeId')) {
        obj['causeId'] = ApiClient.convertToType(data['causeId'], 'Number');
      }
      if (data.hasOwnProperty('effectId')) {
        obj['effectId'] = ApiClient.convertToType(data['effectId'], 'Number');
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'Number');
      }
      if (data.hasOwnProperty('createdAt')) {
        obj['createdAt'] = ApiClient.convertToType(data['createdAt'], 'Date');
      }
      if (data.hasOwnProperty('updatedAt')) {
        obj['updatedAt'] = ApiClient.convertToType(data['updatedAt'], 'Date');
      }
    }
    return obj;
  }

  /**
   * id
   * @member {Number} id
   */
  exports.prototype['id'] = undefined;
  /**
   * clientId
   * @member {String} clientId
   */
  exports.prototype['clientId'] = undefined;
  /**
   * ID of User
   * @member {Number} userId
   */
  exports.prototype['userId'] = undefined;
  /**
   * ID of the predictor variable
   * @member {Number} causeId
   */
  exports.prototype['causeId'] = undefined;
  /**
   * ID of effect variable
   * @member {Number} effectId
   */
  exports.prototype['effectId'] = undefined;
  /**
   * Value of Vote
   * @member {Number} value
   */
  exports.prototype['value'] = undefined;
  /**
   * When the record was first created. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} createdAt
   */
  exports.prototype['createdAt'] = undefined;
  /**
   * When the record in the database was last updated. Use UTC ISO 8601 \"YYYY-MM-DDThh:mm:ss\"  datetime format
   * @member {Date} updatedAt
   */
  exports.prototype['updatedAt'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],68:[function(require,module,exports){
/**
 * QuantiModo
 * QuantiModo makes it easy to retrieve normalized user data from a wide array of devices and applications. [Learn about QuantiModo](https://quantimo.do), check out our [docs](https://github.com/QuantiModo/docs) or contact us at [help.quantimo.do](https://help.quantimo.do). 
 *
 * OpenAPI spec version: 5.8.5
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.QuantimodoApi) {
      root.QuantimodoApi = {};
    }
    root.QuantimodoApi.VoteDelete = factory(root.QuantimodoApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The VoteDelete model module.
   * @module model/VoteDelete
   * @version 5.8.5
   */

  /**
   * Constructs a new <code>VoteDelete</code>.
   * @alias module:model/VoteDelete
   * @class
   * @param cause {String} Cause variable name for the correlation to which the vote pertains
   * @param effect {String} Effect variable name for the correlation to which the vote pertains
   */
  var exports = function(cause, effect) {
    var _this = this;

    _this['cause'] = cause;
    _this['effect'] = effect;
  };

  /**
   * Constructs a <code>VoteDelete</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/VoteDelete} obj Optional instance to populate.
   * @return {module:model/VoteDelete} The populated <code>VoteDelete</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('cause')) {
        obj['cause'] = ApiClient.convertToType(data['cause'], 'String');
      }
      if (data.hasOwnProperty('effect')) {
        obj['effect'] = ApiClient.convertToType(data['effect'], 'String');
      }
    }
    return obj;
  }

  /**
   * Cause variable name for the correlation to which the vote pertains
   * @member {String} cause
   */
  exports.prototype['cause'] = undefined;
  /**
   * Effect variable name for the correlation to which the vote pertains
   * @member {String} effect
   */
  exports.prototype['effect'] = undefined;



  return exports;
}));



},{"../ApiClient":5}],69:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],70:[function(require,module,exports){
/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = require('component-emitter');
var RequestBase = require('./request-base');
var isObject = require('./is-object');
var isFunction = require('./is-function');
var ResponseBase = require('./response-base');
var shouldRetry = require('./should-retry');

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function(method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only verison of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
      status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD'
      ? this._parseBody(this.text ? this.text : this.xhr.response)
      : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str){
  var parse = request.parse[this.type];
  if(this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
      }
    } catch(e) {
      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (typeof pass === 'object' && pass !== null) { // pass is optional and can substitute for options
    options = pass;
  }
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto',
    }
  }

  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;
      
    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
    break;  
  }
  return this;
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, options){
  if (file) {
    if (this._data) {
      throw Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  // console.log(this._retries, this._maxRetries)
  if (this._maxRetries && this._retries++ < this._maxRetries && shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function(){
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */

Request.prototype._appendQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if (isFunction(this._sort)) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
}

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._appendQueryString();

  return this._end();
};

Request.prototype._end = function() {
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function(){
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  }
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;

    if (this.header.hasOwnProperty(field))
      xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn){
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn){
  var req = request('DELETE', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

},{"./is-function":71,"./is-object":72,"./request-base":73,"./response-base":74,"./should-retry":75,"component-emitter":69}],71:[function(require,module,exports){
/**
 * Check if `fn` is a function.
 *
 * @param {Function} fn
 * @return {Boolean}
 * @api private
 */
var isObject = require('./is-object');

function isFunction(fn) {
  var tag = isObject(fn) ? Object.prototype.toString.call(fn) : '';
  return tag === '[object Function]';
}

module.exports = isFunction;

},{"./is-object":72}],72:[function(require,module,exports){
/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;

},{}],73:[function(require,module,exports){
/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = require('./is-object');

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout(){
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, read, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options){
  if (!options || 'object' !== typeof options) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for(var option in options) {
    switch(option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;
      case 'response':
        this._responseTimeout = options.response;
        break;
      default:
        console.warn("Unknown timeout option", option);
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count){
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  return this;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function() {
  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
      self.end(function(err, res){
        if (err) innerReject(err); else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
}

RequestBase.prototype.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
}

RequestBase.prototype.ok = function(cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function(name, val) {

  // name should be either a string or an object.
  if (null === name ||  undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function(on){
  // This is browser-only functionality. Node side is no-op.
  if(on==undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function(){
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};


/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function(data){
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};


/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function(sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function(reason, timeout, errno){
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function() {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function(){
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
}

},{"./is-object":72}],74:[function(require,module,exports){

/**
 * Module dependencies.
 */

var utils = require('./utils');

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function(field){
    return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function(header){
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    } catch (err) {
        // ignore
    }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function(status){
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

    // sugar
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
};

},{"./utils":76}],75:[function(require,module,exports){
var ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'EADDRINFO',
  'ESOCKETTIMEDOUT'
];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
module.exports = function shouldRetry(err, res) {
  if (err && err.code && ~ERROR_CODES.indexOf(err.code)) return true;
  if (res && res.status && res.status >= 500) return true;
  // Superagent timeout
  if (err && 'timeout' in err && err.code == 'ECONNABORTED') return true;
  if (err && 'crossDomain' in err) return true;
  return false;
};

},{}],76:[function(require,module,exports){

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function(str){
  return str.split(/ *, */).reduce(function(obj, str){
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function(header, shouldStripCookie){
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  if (shouldStripCookie) {
    delete header['cookie'];
  }
  return header;
};
},{}]},{},[18])(18)
});