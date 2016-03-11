'use strict'

class BufferArray {
  /**
   * @param size {Buffer|Number|Array}
   */
  constructor(size) {
    this._buf = new Buffer(size)
    this._pos = 0

    if (Buffer.isBuffer(size)) {
      this._pos = this._buf.length
    }
  }

  /**
   * Set pointer position
   * @param pos {Number} optional
   * @returns {Number|void}
   */
  seek(pos) {
    if (!arguments.length) {
      return this._pos
    }

    this._pos = pos
  }

  /**
   * Write raw buffer to the end
   * @param buf {Buffer}
   * @returns {Boolean}
   */
  push(buf) {
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('Expected buffer')
    }

    if (out_of_bounds_in(this._buf, this._pos, buf.length)) {
      return false
    }

    buf.copy(this._buf, this._pos)
    this._pos = this._pos + buf.length

    return true
  }

  /**
   * Read `size` bytes from the end
   * @param size {Number}
   * @returns {Buffer|Boolean}
   */
  pop(size) {
    if (out_of_bounds_out(this._pos, size)) {
      return false
    }

    var bout = new Buffer(size)
    this._buf.copy(bout, 0, this._pos - size, this._pos)

    this._pos = this._pos - size
    this._buf.fill(0, this._pos)

    return bout
  }

  /**
   * Write raw buffer to the beginning
   * @param {Buffer} buf
   * @returns {Boolean}
   */
  unshift(buf) {
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('Expected buffer')
    }

    if (out_of_bounds_in(this._buf, this._pos, buf.length)) {
      return false
    }

    if (this._pos > 0) {
      let b = this._buf.slice(0, this._pos)
      b.copy(this._buf, buf.length)
    }

    buf.copy(this._buf, 0)
    this._pos = this._pos + buf.length

    return true
  }

  /**
   * Read `size` bytes from the beginning
   * @param size {Number}
   * @returns {Buffer|Boolean}
   */
  shift(size) {
    if (out_of_bounds_out(this._pos, size)) {
      return false
    }

    var bout = new Buffer(size)
    this._buf.copy(bout)

    shift_buffer(this._buf, this._pos, size)

    this._pos = this._pos - size
    this._buf.fill(0, this._pos)

    return bout
  }

  /**
   * @returns {Number}
   */
  get length() {
    return this._buf.length
  }

  /**
   * clear internal buffer
   */
  clear() {
    this._buf.fill(0)
    this._pos = 0
  }

  /**
   * convert buffer-array to Buffer
   * @returns {Buffer}
   */
  toBuffer() {
    return this._buf
  }
}

/**
 * return true if out of bounds
 * @param buf {Buffer}
 * @param pos {Number}
 * @param size {Number}
 * @returns {Boolean}
 */
function out_of_bounds_in(buf, pos, size) {
  return pos + size > buf.length
}

/**
 * return true if out of bounds
 * @param pos {Number}
 * @param size {Number}
 * @returns {Boolean}
 */
function out_of_bounds_out(pos, size) {
  return pos - size < 0
}

const methods = {
    'DoubleBE'  : 8
  , 'DoubleLE'  : 8
  , 'FloatBE'   : 4
  , 'FloatLE'   : 4
  , 'Int32BE'   : 4
  , 'Int32LE'   : 4
  , 'UInt32BE'  : 4
  , 'UInt32LE'  : 4
  , 'Int16BE'   : 2
  , 'Int16LE'   : 2
  , 'UInt16BE'  : 2
  , 'UInt16LE'  : 2
  , 'Int8'      : 1
  , 'UInt8'     : 1
}

/**
 * factory of `push*` methods
 * @param method {String}
 * @param size {Number}
 * @returns {Function}
 * @private
 */
function _push(method, size) {
  return function(value) {
    if (out_of_bounds_in(this._buf, this._pos, size)) {
      return false
    }

    this._buf[method](value, this._pos)
    this._pos = this._pos + size

    return true
  }
}

/**
 * factory of `pop*` methods
 * @param method {String}
 * @param size {Number}
 * @returns {Function}
 * @private
 */
function _pop(method, size) {
  return function() {
    if (out_of_bounds_out(this._pos, size)) {
      return
    }

    var value = this._buf[method](this._pos - size)
    this._pos = this._pos - size
    this._buf.fill(0, this._pos)

    return value
  }
}

/**
 * factory of `unshift*` methods
 * @param method {String}
 * @param size {Number}
 * @returns {Function}
 * @private
 */
function _unshift(method, size) {
  return function (value) {
    if (out_of_bounds_in(this._buf, this._pos, size)) {
      return false
    }

    if (this._pos > 0) {
      let buf = this._buf.slice(0, this._pos)
      buf.copy(this._buf, size)
    }

    this._buf[method](value, 0)
    this._pos = this._pos + size

    return true
  }
}

/**
 * factory of `shift*` methods
 * @param method {String}
 * @param size {Number}
 * @returns {Function}
 * @private
 */
function _shift(method, size) {
  return function () {
    if (out_of_bounds_out(this._pos, size)) {
      return
    }

    var value = this._buf[method](0)

    shift_buffer(this._buf, this._pos, size)

    this._pos = this._pos - size
    this._buf.fill(0, this._pos)

    return value
  }
}

/**
 * move data from `source` buffer to the beginning
 * @param source {Buffer}
 * @param pos {Number}
 * @param size {Number}
 */
function shift_buffer(source, pos, size) {
  if (pos > 0) {
    let buf = source.slice(size, pos)
    buf.copy(source, 0)
  }
}

for(let m of Object.keys(methods)) {
  BufferArray.prototype['push'+m]  = _push('write' + m, methods[m])
  BufferArray.prototype['pop'+m]   = _pop('read' + m, methods[m])
  BufferArray.prototype['shift' + m] = _shift('read' + m, methods[m])
  BufferArray.prototype['unshift'+m] = _unshift('write' + m, methods[m])
}

/**
 * @param size {Buffer|Number|Array}
 * @returns {BufferArray}
 */
module.exports = function ba(size) {
  return new BufferArray(size)
}
