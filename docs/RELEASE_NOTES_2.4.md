# Release Notes: Version 2.4

Version 2.4 introduces customizable error handling.

- New `onError` option lets you intercept parsing errors. The callback receives
  `(error, value, type)` and should return the fallback result.
- Useful for falling back to defaults or logging issues without throwing.
- `autoParse.setErrorHandler()` registers a global fallback for any parse.
- Example:

  ```js
  autoParse('bad', {
    type: 'BigInt',
    onError () { return 0 }
  })
  ```

- Benchmarks and documentation updated to cover the feature.

See the [CHANGELOG](../CHANGELOG.md) for the full history.
