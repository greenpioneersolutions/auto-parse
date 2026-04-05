# Release Notes -- v2.5.0

Version 2.5 is a **hardening release** focused on correctness, safety, and
developer experience. There are no breaking changes to the public API.

## Highlights

### Immutable parsing

`autoParse` no longer mutates input objects or arrays. Previous versions would
overwrite property values in-place; v2.5 always returns a new copy. This makes
it safe to pass the same object to `autoParse` multiple times or to keep a
reference to the original data.

### Circular reference safety

Passing a self-referencing object (e.g. `obj.self = obj`) no longer causes an
infinite loop. Circular references are detected via a `WeakSet` and returned
as-is.

### Schema-based parsing

The new `schema` option lets you declare the expected type for each key in an
object:

```js
autoParse('{"age":"25","active":"true","name":"alice"}', {
  schema: { age: 'number', active: 'boolean' }
})
// => { age: 25, active: true, name: 'alice' }
```

Keys not listed in the schema are auto-parsed as usual. This is particularly
useful for configuration files, query strings, and form data.

### Configurable date format

A new `dateFormat` option resolves the ambiguity between US (MM/DD) and
European (DD/MM) date strings:

- `'us'` -- all slash and dash dates use month-first ordering
- `'eu'` -- all slash and dash dates use day-first ordering
- `'iso'` -- only ISO 8601 (`YYYY-MM-DD`) dates are parsed; slash/dash dates
  remain strings

When omitted, the default behaviour is unchanged: slash dates use US ordering
and dash dates use EU ordering.

### Regex cache cap

The internal cache for compiled `stripStartChars` regular expressions is now
capped at 100 entries. When the limit is reached, the oldest entry is evicted.
This prevents unbounded memory growth in long-running processes that use many
distinct strip-character sets.

### Stronger TypeScript definitions

The type declarations now include overloads for common conversions:

```ts
autoParse('42', Number)   // => number
autoParse('hi', String)   // => string
autoParse('true', Boolean) // => boolean
```

### ESM export fix

`autoParse.setErrorHandler` is now properly re-exported from the ESM entry
point (`index.mjs`).

### Security documentation

The README now includes a **Security Considerations** section with guidance on
the safety characteristics of each opt-in feature, especially
`parseExpressions`, `parseFunctionStrings`, and `expandEnv`.

## Upgrading

No breaking changes. Install the new version and all existing code will
continue to work. The only observable difference is that input objects and
arrays are no longer mutated -- if any code relied on the mutation side effect,
it should read the return value instead.
