# Release Notes: Version 2.2

Version 2.2 adds optional date and time parsing to **auto-parse**.

- ISO 8601 strings like `2023-04-05T12:00:00Z` are recognized automatically.
- Localized formats such as `03/10/2020` or `10-03-2020 14:30` are supported.
- Standalone times like `8:45 PM` return `Date` objects for the current day.
- Enable via the `parseDates` option. It is disabled by default.

See the [CHANGELOG](../CHANGELOG.md) for a detailed history.
