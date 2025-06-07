# Auto Parse

[![npm](https://img.shields.io/npm/v/auto-parse.svg?style=flat)](https://npmjs.org/package/auto-parse)
[![downloads](https://img.shields.io/npm/dt/auto-parse.svg?style=flat)](https://npmjs.org/package/auto-parse)
[![Build Status](https://travis-ci.org/greenpioneersolutions/auto-parse.svg?branch=master)](https://travis-ci.org/greenpioneersolutions/auto-parse)
[![code style: standard](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)

A small utility that automatically converts strings and other values into the most suitable JavaScript types. It works in Node.js and in the browser, ships with an ES module build and TypeScript declarations, and allows custom extensions via a simple plugin API.

## Features

- Converts strings to numbers, booleans, objects, arrays and more
- Handles modern types like `BigInt` and `Symbol`
- Supports comma-separated numbers and leading-zero preservation
- Can strip prefix characters before parsing
- Restricts output types via `allowedTypes`
- Extensible plugin system for custom logic
- Works in browsers and Node.js with ESM and CommonJS builds
- Includes TypeScript definitions
- Parses currency strings (USD, EUR, GBP, JPY, AUD, CAD, CHF, HKD, INR and KRW built in – extend via `currencySymbols`)
- Interprets percentages like `85%`
- Detects common units such as `10px` or `3kg`
- Expands ranges like `1..5` or `1-5`
- Understands `yes`/`no` and `on`/`off` booleans
- Converts `Map:` and `Set:` strings into real objects
- Supports typed arrays
- Evaluates simple math expressions
- Recognizes common date/time formats
- Detects URLs and file-system paths
- Optional environment variable expansion
- Optional function-string parsing
- Global and per-call error-handling callbacks
- Advanced features are disabled by default and can be enabled individually

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
autoParse('$9.99', { parseCurrency: true })  // => 9.99
autoParse('10px', { parseUnits: true })      // => { value: 10, unit: 'px' }
autoParse('1..3', { parseRanges: true })     // => [1, 2, 3]
autoParse('r$5', { parseCurrency: true, currencySymbols: { 'r$': 'BRL' } }) // => 5
autoParse('\u20BA7', { parseCurrency: true, currencySymbols: { '\u20BA': 'TRY' }, currencyAsObject: true }) // => { value: 7, currency: 'TRY' }
autoParse('85%', { parsePercent: true })     // => 0.85
autoParse('yes', { booleanSynonyms: true })  // => true
autoParse('Map:[["a",1]]', { parseMapSets: true }).get('a') // => 1
autoParse('Uint8Array[1,2]', { parseTypedArrays: true })[0] // => 1
autoParse('2 + 3 * 4', { parseExpressions: true }) // => 14
autoParse('2023-06-01', { parseDates: true }) // => Date object
autoParse('http://example.com', { parseUrls: true }) // => URL instance
autoParse('./foo/bar', { parseFilePaths: true }) // => normalized path
process.env.TEST_ENV = '123'
autoParse('$TEST_ENV', { expandEnv: true }) // => 123
const double = autoParse('x => x * 2', { parseFunctionStrings: true })
double(3) // => 6
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

### Custom error handler

Use the `onError` option or a global handler to catch parsing errors and return a fallback result:

```js
autoParse('abc', {
  type: 'BigInt',
  onError (err, value, type) {
    console.warn('Could not parse', value, 'as', type)
    return 0
  }
}) // => 0
```

// Set a global handler for all subsequent parses
autoParse.setErrorHandler((err, value, type) => {
  console.error('Parsing failed:', err.message)
  return null
})

autoParse('bad', 'BigInt') // => null

### Options

Use the third `options` argument to fine‑tune parsing behavior:

```js
autoParse('0005', undefined, { preserveLeadingZeros: true }) // => '0005'
autoParse('42', undefined, { allowedTypes: ['string'] })     // => '42'
autoParse("'5", undefined, { stripStartChars: "'" })         // => 5
autoParse('385,134', undefined, { parseCommaNumbers: true }) // => 385134
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
- `parseCurrency` – enable currency string recognition.
- `parsePercent` – enable percent string recognition.
- `parseUnits` – enable unit string parsing.
- `parseRanges` – enable range string parsing.
- `booleanSynonyms` – allow `yes`, `no`, `on` and `off` to be parsed as booleans.
- `parseMapSets` – convert `Map:` and `Set:` strings.
- `parseTypedArrays` – support typed array notation.
- `parseExpressions` – evaluate simple math expressions.
- `parseDates` – recognize ISO 8601 and common local date/time strings.
- `parseUrls` – detect valid URLs and return `URL` objects.
- `parseFilePaths` – detect file-system paths and normalize them.
- `currencySymbols` – object mapping extra currency symbols to codes, e.g. `{ 'r$': 'BRL', "\u20BA": 'TRY' }`.
- `onError` – function called with `(error, value, type)` when parsing throws; its return value is used instead. Falls back to the global handler if set.

## Benchmarks (v2.4.0)

The following timings are measured on Node.js using `npm test` and represent roughly how long it takes to parse 10 000 values after warm‑up:

| Feature | Time (ms) |
| --- | ---: |
| string values | ~47 |
| JSON strings | ~6 |
| numeric strings | ~20 |
| boolean strings | ~28 |
| arrays | ~5 |
| plain objects | ~3 |
| options combined | ~6 |
| plugin hook | ~4 |
| error callback | ~4 |
| global handler | ~4 |
| date/time parse | ~5 |
| URL parse | ~5 |
| file path parse | ~5 |

Even a single parse is extremely fast:

| Feature | 1-run time (ms) |
| --- | ---: |
| string values | ~0.005 |
| JSON strings | ~0.0006 |
| numeric strings | ~0.002 |
| boolean strings | ~0.003 |
| arrays | ~0.0005 |
| plain objects | ~0.0003 |
| options combined | ~0.0006 |
| plugin hook | ~0.0004 |
| error callback | ~0.0004 |
| global handler | ~0.0004 |
| date/time parse | ~0.0005 |
| URL parse | ~0.0005 |
| file path parse | ~0.0005 |

These numbers demonstrate the parser runs in well under a millisecond for typical values, so performance should never be a concern.

## How autoParse Works

`autoParse` processes the input in several phases. First, any registered plugins
are given a chance to return a custom result. If you pass a `type` argument,
the library delegates to an internal `parseType` helper which converts the
value specifically to that constructor or primitive form.

When no explicit type is provided, the parser inspects the value itself.
Primitive numbers, booleans, dates and the like are returned immediately.
Functions are invoked, arrays and plain objects are traversed recursively, and
strings are normalized before being tested as JSON, numbers or booleans. Options
such as `allowedTypes`, `stripStartChars` and `parseCommaNumbers` tweak this
behaviour.

This layered approach makes `autoParse` suitable for many scenarios—from
parsing environment variables and CLI arguments to cleaning up user input or
query parameters. Plugins let you extend these rules so the core logic stays
fast while adapting to your own formats.

## Release Notes

Version 2.0 modernizes the project with an esbuild-powered build, ESM support,
TypeScript definitions and a plugin API. It also adds parsing for `BigInt` and
`Symbol` values. See [docs/RELEASE_NOTES_2.0.md](docs/RELEASE_NOTES_2.0.md) and
[CHANGELOG.md](CHANGELOG.md) for the full list of changes.

Version 2.1 expands automatic parsing with currency, percentages, unit and range
strings, Map and Set objects, typed arrays, simple expression evaluation and
optional environment variable and function-string handling. See
[docs/RELEASE_NOTES_2.1.md](docs/RELEASE_NOTES_2.1.md) for details.

Version 2.2 introduces optional date/time recognition. See
[docs/RELEASE_NOTES_2.2.md](docs/RELEASE_NOTES_2.2.md) for details.

Version 2.3 adds URL and file path detection. See
[docs/RELEASE_NOTES_2.3.md](docs/RELEASE_NOTES_2.3.md) for details.

Version 2.4 introduces a customizable error-handling callback. See
[docs/RELEASE_NOTES_2.4.md](docs/RELEASE_NOTES_2.4.md) for details.

## Contributing

1. Fork the repository and create a branch for your feature or fix.
2. Run `npm install` to set up dependencies.
3. Use `npm test` to run the test suite and `npm run standard` to check code style.
4. Submit a pull request describing your changes.

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for detailed guidelines.

## License

[MIT](LICENSE)
