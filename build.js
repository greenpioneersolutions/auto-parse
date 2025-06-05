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
