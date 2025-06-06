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
