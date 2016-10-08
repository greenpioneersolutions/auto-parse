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
[downloads-image]: https://img.shields.io/npm/dm/auto-parse.svg?style=flat
[downloads-url]: https://npmjs.org/package/auto-parse

## Installation
```sh
npm install auto-parse --save
```

## Why Auto Parse
Auto parse was built to solve the simple use cause of auto parsing data. I
know there are lots of ways to parse out there and the reason you would use
this one over any other one is if you cant control what users are sending you.
Sometimes you need to know what they ment even if they capitalize, put in extra
spaces or everything came as a string in a object.

## How to use Auto Parse

```js
// Lodash Mixin
var autoParse = require('auto-parse')
 _.mixin({'autoParse':autoParse})
// Require, Delcare & Call
var autoParse = require('auto-parse')
console.log(autoParse('Green Pioneer')) // Parses as a String
```

Check the Usage examples out below

## What is Auto Parse

`auto-parse` any value you happen to send in (`String`, `Number`, `Boolean`,
`Array`, `Object`, `Function`, `undefined` and `null`). You send it we will
try to find a way to parse it.

## Usage

```js
var autoParse = require('auto-parse')

autoParse('Green Pioneer') // Parses as a String
autoParse('26')// Parses as a Number
autoParse('TrUe ')// Parses as a Boolean
autoParse(['80', '92', '23', 'TruE', false]) // Parses as a Array
autoParse({
  name: 'jason', // Parses as a String
  age: '50',// Parses as a Number
  admin: 'true',// Parses as a Boolean
  grade: ['80', '90', '100']// Parses as a Array full of Numbers
}) // Parses as a Object
autoParse(function () {
  return '9'
})// Parses as a Number
autoParse(' Undefined ')// Parses as a undefined
autoParse(' Null ')// Parses as a null
autoParse('{}') // Parses as a json
autoParse('["42"]') // Parses as a json
autoParse('NaN') // Parses as a NaN
```

[Check out JS Fiddle Example](https://jsfiddle.net/greenpioneer/4y744xyd/)


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
