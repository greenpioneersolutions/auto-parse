const esbuild = require('esbuild')

esbuild.buildSync({
  entryPoints: ['index.js'],
  bundle: true,
  format: 'cjs',
  outfile: 'dist/auto-parse.js'
})

esbuild.buildSync({
  entryPoints: ['index.js'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/auto-parse.esm.js'
})

esbuild.buildSync({
  entryPoints: ['index.js'],
  bundle: true,
  format: 'iife',
  globalName: 'autoParse',
  minify: true,
  outfile: 'dist/auto-parse.min.js'
})

esbuild.buildSync({
  entryPoints: ['index.js'],
  bundle: true,
  format: 'cjs',
  sourcemap: true,
  outfile: 'dist/auto-parse.map.js'
})
