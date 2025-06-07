# Changelog

## 2.0.0 (2025-06-05)

- Modern build powered by esbuild
- ESM distribution and TypeScript definitions
- BigInt and Symbol parsing
- Plugin API via `autoParse.use`
- Tests run on GitHub Actions with Jest

## 2.0.1 (2025-06-05)

- Add `preserveLeadingZeros` option to keep numeric strings like `"0004"` from
  being converted to numbers.
- Introduce `allowedTypes` option to restrict parsed result types.
- Add `stripStartChars` option to remove leading characters before parsing.
- Add `parseCommaNumbers` option to convert comma-separated numbers like `'1,234'`.

## 2.0.2 (2025-06-06)


- Improved performance by caching regex used for stripping start characters.
- Avoid unnecessary JSON parsing when input doesn't resemble JSON.
- Faster numeric and boolean checks.
- Added Jest-based performance benchmarks.
- Expanded benchmarks to cover all supported types, options and plugin system.
- Cleaned up variable names and documentation for clarity.

## 2.1.0 (2025-06-07)

- Currency, percent, unit and range string parsing (built-in support for 10 common currencies, extendable via `currencySymbols`)
- Yes/No and On/Off boolean synonyms
- Map, Set and typed array support
- Simple math expression evaluation
- Optional env variable expansion and function-string parsing
- Advanced features must be enabled individually via options

## 2.2.0 (2025-06-08)

- Built-in date/time recognition for ISO 8601 and common local formats
- New `parseDates` option to enable the feature

## 2.3.0 (2025-06-09)

- URL and file path detection via `parseUrls` and `parseFilePaths` options
- New examples and benchmarks covering the feature

## 2.4.0 (2025-06-10)

- Optional `onError` callback allows custom handling of parsing errors
- Global handler via `autoParse.setErrorHandler`
- Benchmarks and documentation updated
