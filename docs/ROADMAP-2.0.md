# Roadmap to 2.0

This document tracks ideas for a potential 2.0 release of **auto-parse**.

- **Modernize tooling** – replace the Browserify/Uglify build with a modern bundler such as Rollup or esbuild and update development dependencies.
- **Add TypeScript support** – ship type declarations or rewrite the library in TypeScript.
- **ESM compatibility** – publish an ES module build alongside CommonJS to ease consumption in modern environments.
- **Extend parsing features** – support newer JavaScript types like `Symbol` and `BigInt`.
- **Flexible parsing strategy** – expose hooks or a plugin mechanism for custom parsing logic.
- **Simplify dependency footprint** – remove the `typpy` dependency in favor of native type checks.
- **Improve testing and CI** – adopt a modern test framework (e.g. Jest) and automate tests via GitHub Actions.
- **Documentation updates** – maintain a CHANGELOG and provide migration notes for breaking changes.

These enhancements would modernize the project and make the upgrade to version 2.0 compelling for users.
