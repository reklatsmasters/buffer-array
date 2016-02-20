'use strict'

const test = require('tape')
const BufferArray = require('./')

test('constructor', function(t) {  
  var ba1 = new BufferArray(5)
  var ba2 = new BufferArray(new Array(5))
  var ba3 = new BufferArray(new Buffer(5))
  var ba4 = BufferArray(5)
  
  t.equal(ba1._buf.length, 5)
  t.equal(ba2._buf.length, 5)
  t.equal(ba3._buf.length, 5)
  t.equal(ba3._pos, ba3._buf.length)
  t.equal(ba4._buf.length, 5)
  
  t.end()
})

test('method `length`', function(t) {  
  var ba = new BufferArray(5)
 
  t.equal(ba.length, 5)
  t.end()
})

test('method `seek`', function(t) {  
  var ba1 = new BufferArray(5)  
  t.equal(ba1.seek(), 0)
  
  ba1.seek(2)
  t.equal(ba1.seek(), 2)
  
  t.end()
})

test('method `clear`', function(t) {  
  var b = new Buffer(3);
  b[0] = 13
  b[1] = 27
  b[2] = 19
  
  var ba = new BufferArray(b)
  ba.seek(1)
  ba.clear()
  
  t.ok(ba.toBuffer().equals(new Buffer([0,0,0])), 'buffers should be equals')
  t.equal(ba.seek(), 0)
  
  t.end()
})

test('method `push`', function(t) {
  var ba = new BufferArray(5)
  
  t.ok(ba.push(new Buffer([13, 17])))
  t.ok(ba.push(new Buffer([23, 12])))  
  t.equal(ba.seek(), 4)
  
  var ba_b = ba.toBuffer().slice(0, 4)
  t.ok(ba_b.equals(new Buffer([13, 17, 23, 12])), 'buffers should be equals')
  
  t.notOk(ba.push(new Buffer([33, 7])), 'out of bounds')
  t.equal(ba.seek(), 4)
  
  t.end()
})

test('method `pop`', function(t) {
  var ba = new BufferArray(new Buffer([13, 17, 23, 12]))
  
  var out = ba.pop(3)
  
  t.equal(ba.seek(), 1)
  t.ok(out.equals(new Buffer([17, 23, 12])), 'buffers should be equals')
  t.ok(ba.toBuffer().equals(new Buffer([13, 0, 0, 0])), 'buffers should be equals')
  t.notOk(ba.pop(2))
  
  t.end()
})

test('method `push*`', function(t) {
  var ba = new BufferArray(3)
  
  t.ok(ba.pushInt16BE(10))
  var int16 = ba.toBuffer().slice(0, 2)
  
  t.ok(int16.equals(new Buffer([0, 0x0a])), 'buffers should be equals')
  t.end()
})

test('method `pop*`', function(t) {
  var ba = new BufferArray(3)  
  ba.pushInt16BE(10)
  
  var out = ba.popInt16BE()
  
  t.equal(out, 10)
  t.equal(ba.seek(), 0)
  
  var out2 = ba.popInt16BE()
  t.equal(out2, void 0)
  t.equal(ba.seek(), 0)
  
  t.end()
})