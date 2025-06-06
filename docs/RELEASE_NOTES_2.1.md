# Release Notes: Version 2.1

Version 2.1 brings many small but useful improvements to **auto-parse**.

- Currency strings like `$19.99` or `€5,50` are recognized and converted to numbers or `{ value, currency }` objects. Built-in support covers the ten most common currencies and you can extend this via `currencySymbols`.
- Percentages such as `85%` become `0.85` (or objects when `percentAsObject` is enabled).
- Unit values like `10px` or `3kg` return `{ value, unit }`.
- Ranges written as `1..5` or `1-5` expand to arrays by default.
- Boolean detection now understands `yes`, `no`, `on` and `off`.
- Special `Map:` and `Set:` strings convert into real `Map` and `Set` instances.
- Typed arrays (e.g. `Uint8Array[1,2]`) are supported.
- Simple math expressions such as `2 + 3 * 4` are evaluated.
- Optional expansion of `$ENV_VAR` placeholders before parsing.
- Optional parsing of arrow function strings into functions.
- All new features are disabled by default and can be enabled individually via options.

See the [CHANGELOG](../CHANGELOG.md) for the full history.
