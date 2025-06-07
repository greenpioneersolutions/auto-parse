# Release Notes: Version 2.3

Version 2.3 introduces optional URL and file path parsing.

- URLs such as `https://example.com` return `URL` objects when `parseUrls` is enabled.
- File-system paths like `./foo/bar` normalize to platform-neutral strings when `parseFilePaths` is enabled.
- Both features are disabled by default and can be turned on individually via options.

See the [CHANGELOG](../CHANGELOG.md) for the full history.
