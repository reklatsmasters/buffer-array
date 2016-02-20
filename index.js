'use strict'

class BufferArray {
  constructor(size) {
    if (!(this instanceof BufferArray)) {
      return new BufferArray(size)
    }
    
    this._buf = new Buffer(size)
    this._pos = 0
    
    if (Buffer.isBuffer(size)) {
      this._pos = this._buf.length
    }
  }
  
  /**
   * Set pointer position
   * @param {number} pos
   */
  seek(pos) {
    if (!arguments.length) {
      return this._pos
    }
    
    this._pos = pos
  }

  /**
   * Write raw buffer to the end
   * @param {buffer} buf
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
   */
  pop(size) {
    if (out_of_bounds_out(this._pos, size)) {
      return
    }
    
    var bout = new Buffer(size)
    this._buf.copy(bout, 0, this._pos - size, this._pos)
    
    this._pos = this._pos - size
    this._buf.fill(0, this._pos)

    return bout
  }
  
  get length() {
    return this._buf.length
  }
  
  clear() {
    this._buf.fill(0)
    this._pos = 0
  }
  
  toBuffer() {
    return this._buf
  }
}

/**
 * true if out of bounds
 */
function out_of_bounds_in(buf, pos, size) {
  return pos + size >= buf.length
}

/**
 * true if out of bounds
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

for(let m of Object.keys(methods)) {
  BufferArray.prototype['push'+m] = _push('write' + m, methods[m])
  BufferArray.prototype['pop' +m] = _pop('read'  + m, methods[m])
}

module.exports = function ba(size) {
  return new BufferArray(size)
}