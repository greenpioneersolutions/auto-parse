# Auto Parse

[![npm](https://img.shields.io/npm/v/auto-parse.svg?style=flat)](https://npmjs.org/package/auto-parse)
[![downloads](https://img.shields.io/npm/dt/auto-parse.svg?style=flat)](https://npmjs.org/package/auto-parse)
[![Node.js CI](https://github.com/greenpioneersolutions/auto-parse/actions/workflows/node.yml/badge.svg)](https://github.com/greenpioneersolutions/auto-parse/actions/workflows/node.yml)
[![code style: standard](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)

A small utility that automatically converts strings and other values into the most suitable JavaScript types. It works in Node.js and in the browser, ships with an ES module build and TypeScript declarations, and allows custom extensions via a simple plugin API.

## Features

- Converts strings to numbers, booleans, objects, arrays and more
- Handles modern types like `BigInt` and `Symbol`
- Supports comma-separated numbers and leading-zero preservation
- Can strip prefix characters before parsing
- Restricts output types via `allowedTypes`
- Schema-based parsing for structured objects
- Extensible plugin system for custom logic
- Works in browsers and Node.js with ESM and CommonJS builds
- Includes TypeScript definitions with typed overloads
- Parses currency strings (USD, EUR, GBP, JPY, AUD, CAD, CHF, HKD, INR and KRW built in -- extend via `currencySymbols`)
- Interprets percentages like `85%`
- Detects common units such as `10px` or `3kg`
- Expands ranges like `1..5` or `1-5`
- Understands `yes`/`no` and `on`/`off` booleans
- Converts `Map:` and `Set:` strings into real objects
- Supports typed arrays
- Evaluates simple math expressions
- Recognizes common date/time formats with configurable `dateFormat`
- Detects URLs and file-system paths
- Optional environment variable expansion
- Optional function-string parsing
- Global and per-call error-handling callbacks
- Immutable -- never mutates your input objects or arrays
- Circular reference safe
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
autoParse('{"a":1}')   // => { a: 1 }
autoParse('0005')      // => 5
autoParse('0005', { preserveLeadingZeros: true })   // => '0005'
autoParse('#42', { stripStartChars: '#' })           // => 42
autoParse('42', { allowedTypes: ['string'] })        // => '42'
autoParse('385,134', { parseCommaNumbers: true })    // => 385134
autoParse('$9.99', { parseCurrency: true })          // => 9.99
autoParse('10px', { parseUnits: true })              // => { value: 10, unit: 'px' }
autoParse('1..3', { parseRanges: true })             // => [1, 2, 3]
autoParse('85%', { parsePercent: true })             // => 0.85
autoParse('yes', { booleanSynonyms: true })          // => true
autoParse('Map:[["a",1]]', { parseMapSets: true }).get('a') // => 1
autoParse('Uint8Array[1,2]', { parseTypedArrays: true })[0] // => 1
autoParse('2 + 3 * 4', { parseExpressions: true })  // => 14
autoParse('2023-06-01', { parseDates: true })        // => Date object
autoParse('http://example.com', { parseUrls: true }) // => URL instance
autoParse('./foo/bar', { parseFilePaths: true })     // => normalized path
```

### ES module usage

```js
import autoParse from 'auto-parse'

autoParse('[1, "2", "3"]') // => [1, 2, 3]
```

### Schema-based parsing

Use `schema` to declare the expected type for each key. Keys not listed in the schema are auto-parsed as usual:

```js
autoParse('{"age":"25","active":"true","name":"alice"}', {
  schema: { age: 'number', active: 'boolean' }
})
// => { age: 25, active: true, name: 'alice' }
```

Schemas also work with direct object input:

```js
autoParse({ port: '3000', debug: 'true', host: 'localhost' }, {
  schema: { port: 'number', debug: 'boolean' }
})
// => { port: 3000, debug: true, host: 'localhost' }
```

### Date format control

Slash and dash date strings can be ambiguous. Use `dateFormat` to control how they are interpreted:

```js
// Default: slash = US (MM/DD), dash = EU (DD-MM)
autoParse('03/10/2020', { parseDates: true })                       // => March 10
autoParse('10-03-2020', { parseDates: true })                       // => March 10

// Force EU interpretation for all formats
autoParse('03/10/2020', { parseDates: true, dateFormat: 'eu' })     // => October 3

// Force US interpretation for all formats
autoParse('10-03-2020', { parseDates: true, dateFormat: 'us' })     // => October 3

// Strict ISO 8601 only (rejects slash/dash dates)
autoParse('2023-06-01', { parseDates: true, dateFormat: 'iso' })    // => Date
autoParse('03/10/2020', { parseDates: true, dateFormat: 'iso' })    // => '03/10/2020'
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

// Set a global handler for all subsequent parses
autoParse.setErrorHandler((err, value, type) => {
  console.error('Parsing failed:', err.message)
  return null
})

autoParse('bad', 'BigInt') // => null
```

### Options

Pass options as the second argument:

```js
autoParse('0005', { preserveLeadingZeros: true }) // => '0005'
autoParse('42', { allowedTypes: ['string'] })     // => '42'
autoParse("'5", { stripStartChars: "'" })         // => 5
autoParse('385,134', { parseCommaNumbers: true }) // => 385134
```

You can also force a type while using options by including `type` in the options object:

```js
autoParse('42', { type: 'string', allowedTypes: ['string'] }) // => '42'
```

More examples can be found in the [`examples/`](examples) directory.

## API

`autoParse(value, [typeOrOptions])`

- **value** -- the value to parse
- **typeOrOptions** *(optional)* -- a constructor, string type name, or an options object

`autoParse.use(fn)` -- register a plugin. The function receives `(value, type, options)` and should return `undefined` to skip or the parsed value.

`autoParse.setErrorHandler(fn)` -- set a global error handler. The function receives `(err, value, type)` and its return value is used as the result. Pass `null` to remove.

**Options**

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `preserveLeadingZeros` | `boolean` | `false` | Keep numeric strings like `'0004'` as strings. |
| `allowedTypes` | `string[]` | -- | Restrict parsed result to these types. Returns original value otherwise. |
| `stripStartChars` | `string \| string[]` | -- | Characters to remove from the beginning of strings before parsing. |
| `parseCommaNumbers` | `boolean` | `false` | Convert comma-separated numbers like `'1,234'` to numbers. |
| `parseCurrency` | `boolean` | `false` | Recognize currency strings. |
| `parsePercent` | `boolean` | `false` | Recognize percent strings. |
| `parseUnits` | `boolean` | `false` | Parse unit strings like `'10px'`. |
| `parseRanges` | `boolean` | `false` | Parse range strings like `'1..5'`. |
| `booleanSynonyms` | `boolean` | `false` | Allow `yes`, `no`, `on`, `off` as booleans. |
| `parseMapSets` | `boolean` | `false` | Convert `Map:` and `Set:` strings. |
| `parseTypedArrays` | `boolean` | `false` | Support typed array notation. |
| `parseExpressions` | `boolean` | `false` | Evaluate simple math expressions. |
| `parseDates` | `boolean` | `false` | Recognize date/time strings. |
| `parseUrls` | `boolean` | `false` | Detect valid URLs and return `URL` objects. |
| `parseFilePaths` | `boolean` | `false` | Detect file-system paths and normalize them. |
| `parseFunctionStrings` | `boolean` | `false` | Parse arrow function strings. **See Security below.** |
| `expandEnv` | `boolean` | `false` | Replace `$VAR` with `process.env.VAR`. |
| `dateFormat` | `'us' \| 'eu' \| 'iso'` | -- | Control how slash/dash dates are interpreted. |
| `schema` | `Record<string, string \| Constructor>` | -- | Map of property names to target types for structured parsing. |
| `currencySymbols` | `Record<string, string>` | -- | Extra currency symbols to codes, e.g. `{ 'r$': 'BRL' }`. |
| `currencyAsObject` | `boolean` | `false` | Return `{ value, currency }` instead of a plain number. |
| `percentAsObject` | `boolean` | `false` | Return `{ value, percent: true }` instead of a plain number. |
| `rangeAsObject` | `boolean` | `false` | Return `{ start, end }` instead of an array. |
| `onError` | `function` | -- | Per-call error handler `(err, value, type) => fallback`. |
| `type` | `string \| Constructor` | -- | Force the output to a specific type. |

## Security Considerations

auto-parse is designed to be safe by default. All advanced features are opt-in and disabled unless you explicitly enable them.

**Safe by default:** Core parsing (strings, numbers, booleans, JSON, arrays, objects) uses standard JavaScript constructors (`Number()`, `JSON.parse()`, etc.) and does not execute arbitrary code.

**`parseExpressions`** uses the `Function()` constructor but is guarded by a strict character whitelist that only allows digits, arithmetic operators, parentheses, spaces, decimal points, and the `%` operator. It cannot access variables, globals, or call functions.

**`parseFunctionStrings`** uses the `Function()` constructor to compile arrow function strings into callable functions. Because the function body is not restricted, **this option can execute arbitrary code**. Only enable it when you fully trust the input source. For most use cases, the plugin API (`autoParse.use()`) is a safer alternative for custom parsing logic.

**`expandEnv`** reads from `process.env`. Ensure the input does not contain variable names that could leak sensitive environment values.

## Benchmarks (v2.5.0)

The following timings are measured on Node.js using `npm test` and represent roughly how long it takes to parse 10 000 values after warm-up:

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

When a `schema` is provided and the value is an object, each key listed in the
schema is converted using the declared type while all other keys are auto-parsed
as usual. This makes `autoParse` a convenient choice for parsing configuration
files, query strings, and form data where you know the expected shape.

Objects and arrays are never mutated -- `autoParse` always returns new copies.
Circular references are detected and returned as-is instead of causing infinite
recursion.

This layered approach makes `autoParse` suitable for many scenarios -- from
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

Version 2.5 is a hardening release: immutable parsing, circular reference
safety, schema-based type declarations, configurable date formats, capped
internal caches, stronger TypeScript definitions, and a security documentation
overhaul. See [docs/RELEASE_NOTES_2.5.md](docs/RELEASE_NOTES_2.5.md) for
details.

## Contributing

1. Fork the repository and create a branch for your feature or fix.
2. Run `npm install` to set up dependencies.
3. Use `npm test` to run the test suite and `npm run standard` to check code style.
4. Submit a pull request describing your changes.

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for detailed guidelines.

## License

[MIT](LICENSE)
