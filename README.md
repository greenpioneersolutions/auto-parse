# Auto Parse

[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]
[![dependencies](https://david-dm.org/greenpioneersolutions/auto-parse.svg)](https://david-dm.org/greenpioneersolutions/auto-parse)
[![npm-issues](https://img.shields.io/github/issues/greenpioneersolutions/auto-parse.svg)](https://github.com/greenpioneersolutions/auto-parse/issues)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/greenpioneersolutions/auto-parse.svg?branch=master)](https://travis-ci.org/greenpioneersolutions/auto-parse)
[![js-standard-style](https://nodei.co/npm/auto-parse.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/auto-parse.png?downloads=true&downloadRank=true&stars=true)

[npm-image]: https://img.shields.io/npm/v/auto-parse.svg?style=flat
[npm-url]: https://npmjs.org/package/auto-parse
[downloads-image]: https://img.shields.io/npm/dt/auto-parse.svg?style=flat
[downloads-url]: https://npmjs.org/package/auto-parse

## What is Auto Parse

`auto-parse` any value you happen to send in (`String`, `Number`, `Boolean`,
`Array`, `Object`, `Function`, `undefined` and `null`). You send it we will
try to find a way to parse it. We now support sending in a string of what type (e.g. "boolean") or constructor (e.g. Boolean)

## Installation
```sh
npm install auto-parse --save
```

## Documentation

### autoParse(input, type)

#### Params
- **Anything** `input`: The input value you want parsed
- **Constructor|String** `type`: The type. It could be a string (e.g. "array") or a constructor (e.g. Array).
	
#### Return
- **Parsed Value** Could return String, Number, Boolean, Object, Array, Null, NaN, Undefined & Date 


#### Usage

```js
var autoParse = require('auto-parse')
// Strings
autoParse('Green Pioneer') => 'Green Pioneer'
// Booleans
autoParse('TrUe ') => true
autoParse(false) => false
// Functions
autoParse(function () {
  return '9'
}) => 9
// Null &  Undefined
autoParse(' Undefined ') => undefined
autoParse(' Null ') => null
// Objects & Arrays
autoParse(['80', '92', '23', 'TruE', false]) => [80, 92, 23, true, false]
autoParse({
  name: 'jason', // Parses as a String
  age: '50',// Parses as a Number
  admin: 'true',// Parses as a Boolean
  grade: ['80', '90', '100']// Parses as a Array full of Numbers
}) => {name:'jason',age:50,admin:true,grade:[80,90,100]}
autoParse('{}') => {}
autoParse('["42"]')  => [42]
// Numbers
autoParse('NaN') => NaN
autoParse('26') => 26
// hexadecimals
autoParse('0xFF') => 255
// dots
autoParse('.42') => 0.42
// octals
autoParse('0o123') =>  83
// binary number
autoParse('0b1101') =>  13
// exponent 
autoParse('7e3') =>  7000

// Set Type
autoParse(1, 'Boolean')  =>  true
autoParse(0, 'Number')  =>   0
autoParse(1, Boolean)  =>  true
autoParse(0, Number)  =>   0
autoParse(1234, String)  =>  '1234'
// dates
autoParse('1989-11-30', 'date')  =>  Thu Nov 30 1989 18:00:00 GMT-0600 (CST)
autoParse('1989-11-30', Date)  =>  Thu Nov 30 1989 18:00:00 GMT-0600 (CST)
// Passing Functions to type
function Color (inputColor) {
  this.color = inputColor
}
autoParse('#AAA', Color)  =>  {color: '#AAA'}
```
- [Check out Run Kit Example](https://runkit.com/greenpioneer/auto-parse)
- [Check out JS Fiddle Example](https://jsfiddle.net/greenpioneer/4y744xyd/)

#### Other Uses
``` js
// Lodash Mixin
var autoParse = require('auto-parse')
 _.mixin({'autoParse':autoParse})
```

## License

The MIT License (MIT)

Copyright (c) 2014-2017 Green Pioneer

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Created by ![Green Pioneer](http://greenpioneersolutions.com/img/icons/apple-icon-180x180.png)

#### This is [on GitHub](https://github.com/greenpioneersolutions/auto-parse)
#### Find us [on GitHub](https://github.com/greenpioneersolutions)
#### Find us [on Twitter](https://twitter.com/greenpioneerdev)
#### Find us [on Facebook](https://www.facebook.com/Green-Pioneer-Solutions-1023752974341910)
#### Find us [on The Web](http://greenpioneersolutions.com/)
