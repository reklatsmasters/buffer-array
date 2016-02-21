# buffer-array
[![travis](https://travis-ci.org/ReklatsMasters/buffer-array.svg)](https://travis-ci.org/ReklatsMasters/buffer-array)
[![npm](https://img.shields.io/npm/v/buffer-array.svg)](https://npmjs.org/package/buffer-array)
[![license](https://img.shields.io/npm/l/buffer-array.svg)](https://npmjs.org/package/buffer-array)
[![downloads](https://img.shields.io/npm/dm/buffer-array.svg)](https://npmjs.org/package/buffer-array)
[![Code Climate](https://codeclimate.com/github/ReklatsMasters/buffer-array/badges/gpa.svg)](https://codeclimate.com/github/ReklatsMasters/buffer-array)
[![Test Coverage](https://codeclimate.com/github/ReklatsMasters/buffer-array/badges/coverage.svg)](https://codeclimate.com/github/ReklatsMasters/buffer-array)

The Buffer with Array API

## Example
```js
const ba = require('buffer-array')

var buf = ba(4)

ba.push(new Buffer([0, 0x0a]))
var x = ba.popInt16BE() // x == 10
```

## API

* **`constructor(data: Buffer): BufferArray`**
* **`constructor(size: Number): BufferArray`**

Create new instance of `buffer-array` with fixed-size buffer

#### `push(data: Buffer): bool`
Write buffer `data` to the end

* **`pushDoubleBE(data: Number): bool`**
* **`pushDoubleLE(data: Number): bool`**
* **`pushFloatBE(data:  Number): bool`**
* **`pushFloatLE(data:  Number): bool`**
* **`pushInt32BE(data:  Number): bool`**
* **`pushInt32LE(data:  Number): bool`**
* **`pushInt16BE(data:  Number): bool`**
* **`pushInt16LE(data:  Number): bool`**
* **`pushUInt32BE(data: Number): bool`**
* **`pushUInt32LE(data: Number): bool`**
* **`pushUInt16BE(data: Number): bool`**
* **`pushUInt16LE(data: Number): bool`**
* **`pushInt8(data:  Number): bool`**
* **`pushUInt8(data: Number): bool`**

Write fixed-size number to the end

#### `pop(size: Number): Buffer`
Read `size` bytes from the end and return buffer. Return `undefined` if out of bounds.

* **`popDoubleBE(): Number`**
* **`popDoubleLE(): Number`**
* **`popFloatBE():  Number`**
* **`popFloatLE():  Number`**
* **`popInt32BE():  Number`**
* **`popInt32LE():  Number`**
* **`popInt16BE():  Number`**
* **`popInt16LE():  Number`**
* **`popUInt32BE(): Number`**
* **`popUInt32LE(): Number`**
* **`popUInt16BE(): Number`**
* **`popUInt16LE(): Number`**
* **`popInt8():  Number`**
* **`popUInt8(): Number`**

Read fixed-size number from the end. Return `undefined` if out of bounds.

#### `shift(size: Number): Buffer`
Read `size` bytes from the beginning and return buffer. Return `undefined` if out of bounds.

* **`shiftDoubleBE(): Number`**
* **`shiftDoubleLE(): Number`**
* **`shiftFloatBE():  Number`**
* **`shiftFloatLE():  Number`**
* **`shiftInt32BE():  Number`**
* **`shiftInt32LE():  Number`**
* **`shiftInt16BE():  Number`**
* **`shiftInt16LE():  Number`**
* **`shiftUInt32BE(): Number`**
* **`shiftUInt32LE(): Number`**
* **`shiftUInt16BE(): Number`**
* **`shiftUInt16LE(): Number`**
* **`shiftInt8():  Number`**
* **`shiftUInt8(): Number`**

Read fixed-size number from the beginning. Return `undefined` if out of bounds.

#### `unshift(data: Buffer): bool`
Write buffer `data` to the beginning

* **`unshiftDoubleBE(data: Number): bool`**
* **`unshiftDoubleLE(data: Number): bool`**
* **`unshiftFloatBE(data:  Number): bool`**
* **`unshiftFloatLE(data:  Number): bool`**
* **`unshiftInt32BE(data:  Number): bool`**
* **`unshiftInt32LE(data:  Number): bool`**
* **`unshiftInt16BE(data:  Number): bool`**
* **`unshiftInt16LE(data:  Number): bool`**
* **`unshiftUInt32BE(data: Number): bool`**
* **`unshiftUInt32LE(data: Number): bool`**
* **`unshiftUInt16BE(data: Number): bool`**
* **`unshiftUInt16LE(data: Number): bool`**
* **`unshiftInt8(data:  Number): bool`**
* **`unshiftUInt8(data: Number): bool`**

Write fixed-size number to the beginning

## License
MIT, 2016 (c) Dmitry Tsvettsikh
