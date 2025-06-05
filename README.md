# Auto Parse

[![npm](https://img.shields.io/npm/v/auto-parse.svg?style=flat)](https://npmjs.org/package/auto-parse)
[![downloads](https://img.shields.io/npm/dt/auto-parse.svg?style=flat)](https://npmjs.org/package/auto-parse)
[![Build Status](https://travis-ci.org/greenpioneersolutions/auto-parse.svg?branch=master)](https://travis-ci.org/greenpioneersolutions/auto-parse)
[![code style: standard](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)

A small utility that automatically converts strings and other values into the most suitable JavaScript types. It works in Node.js and in the browser, ships with an ES module build and TypeScript declarations, and allows custom extensions via a simple plugin API.

## Features

- Parses numbers, booleans, objects, arrays and more
- Understands modern types like `BigInt` and `Symbol`
- Plugin system for custom parsing logic
- Works in browsers and Node.js
- Ships with ESM support and `.d.ts` definitions

## Installation

```bash
npm install auto-parse
# or
yarn add auto-parse
```

## Quick Start

```js
const autoParse = require('auto-parse')

autoParse('42')        // => 42
autoParse('TrUe')      // => true
autoParse('{"a":1}') // => { a: 1 }
autoParse('0005')      // => 5
autoParse('0005', undefined, { preserveLeadingZeros: true }) // => '0005'
autoParse('#42', undefined, { stripStartChars: '#' }) // => 42
autoParse('42', undefined, { allowedTypes: ['string'] }) // => '42'
autoParse('385,134', undefined, { parseCommaNumbers: true }) // => 385134
```

### ES module usage

```js
import autoParse from 'auto-parse'

autoParse('[1, "2", "3"]') // => [1, 2, 3]
```

### Plugins

```js
import autoParse from 'auto-parse'

// Register a custom parser
autoParse.use(value => {
  if (value === 'color:red') return { color: '#FF0000' }
})

autoParse('color:red') // => { color: '#FF0000' }
```

More examples can be found in the [`examples/`](examples) directory.

## API

`autoParse(value, [type], [options])`

- **value** – the value to parse
- **type** *(optional)* – a constructor or string name to force the output type

`autoParse.use(fn)` – register a plugin. The function receives `(value, type, options)` and should return `undefined` to skip or the parsed value.

**options**

- `preserveLeadingZeros` – when `true`, numeric strings like `'0004'` remain strings instead of being converted to numbers.
- `allowedTypes` – array of type names that the result is allowed to be. If the parsed value is not one of these types, the original value is returned.
- `stripStartChars` – characters to remove from the beginning of input strings before parsing.
- `parseCommaNumbers` – when `true`, strings with comma separators are converted to numbers.

## Release Notes

Version 2.0 modernizes the project with an esbuild-powered build, ESM support,
TypeScript definitions and a plugin API. It also adds parsing for `BigInt` and
`Symbol` values. See [docs/RELEASE_NOTES_2.0.md](docs/RELEASE_NOTES_2.0.md) and
[CHANGELOG.md](CHANGELOG.md) for the full list of changes.

## Contributing

1. Fork the repository and create a branch for your feature or fix.
2. Run `npm install` to set up dependencies.
3. Use `npm test` to run the test suite and `npm run standard` to check code style.
4. Submit a pull request describing your changes.

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for detailed guidelines.

## License

[MIT](LICENSE)
