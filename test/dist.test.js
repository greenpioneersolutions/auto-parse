/* global beforeAll */
var fs = require('fs')
var path = require('path')
var vm = require('vm')
var { assert } = require('chai')

var distDir = path.join(__dirname, '..', 'dist')

describe('dist/ builds', function () {
  describe('auto-parse.js (CJS)', function () {
    var autoParse
    beforeAll(function () {
      autoParse = require(path.join(distDir, 'auto-parse.js'))
    })

    it('exports a function', function () {
      assert.typeOf(autoParse, 'function')
    })

    it('parses strings to numbers', function () {
      assert.strictEqual(autoParse('42'), 42)
    })

    it('parses strings to booleans', function () {
      assert.strictEqual(autoParse('true'), true)
      assert.strictEqual(autoParse('false'), false)
    })

    it('parses JSON strings', function () {
      assert.deepEqual(autoParse('{"a":1}'), { a: 1 })
      assert.deepEqual(autoParse('[1,2,3]'), [1, 2, 3])
    })

    it('handles null and undefined', function () {
      assert.strictEqual(autoParse('null'), null)
      assert.strictEqual(autoParse('undefined'), undefined)
    })

    it('supports options', function () {
      assert.strictEqual(autoParse('0005', { preserveLeadingZeros: true }), '0005')
      assert.strictEqual(autoParse('42', { allowedTypes: ['string'] }), '42')
    })

    it('supports schema parsing', function () {
      var result = autoParse({ age: '25', active: 'true' }, {
        schema: { age: 'number', active: 'boolean' }
      })
      assert.strictEqual(result.age, 25)
      assert.strictEqual(result.active, true)
    })

    it('does not mutate input', function () {
      var input = { a: '1' }
      var original = JSON.parse(JSON.stringify(input))
      autoParse(input)
      assert.deepEqual(input, original)
    })

    it('has use() method', function () {
      assert.typeOf(autoParse.use, 'function')
    })

    it('has setErrorHandler() method', function () {
      assert.typeOf(autoParse.setErrorHandler, 'function')
    })
  })

  describe('auto-parse.map.js (CJS with sourcemap)', function () {
    var autoParse
    beforeAll(function () {
      autoParse = require(path.join(distDir, 'auto-parse.map.js'))
    })

    it('exports a function', function () {
      assert.typeOf(autoParse, 'function')
    })

    it('parses strings to numbers', function () {
      assert.strictEqual(autoParse('42'), 42)
    })

    it('parses strings to booleans', function () {
      assert.strictEqual(autoParse('true'), true)
    })

    it('parses JSON strings', function () {
      assert.deepEqual(autoParse('{"a":1}'), { a: 1 })
    })

    it('supports schema parsing', function () {
      var result = autoParse({ val: '10' }, { schema: { val: 'number' } })
      assert.strictEqual(result.val, 10)
    })

    it('has a corresponding .map file', function () {
      var mapFile = path.join(distDir, 'auto-parse.map.js.map')
      assert.strictEqual(fs.existsSync(mapFile), true)
      var contents = JSON.parse(fs.readFileSync(mapFile, 'utf8'))
      assert.strictEqual(contents.version, 3)
      assert.isArray(contents.sources)
    })
  })

  describe('auto-parse.min.js (IIFE minified)', function () {
    var autoParse
    beforeAll(function () {
      var code = fs.readFileSync(path.join(distDir, 'auto-parse.min.js'), 'utf8')
      var sandbox = { module: { exports: {} }, exports: {}, globalThis: globalThis, WeakSet: WeakSet }
      vm.runInNewContext(code, sandbox)
      autoParse = sandbox.autoParse
    })

    it('exposes autoParse global', function () {
      assert.ok(autoParse, 'autoParse should be defined')
    })

    it('exports a callable function', function () {
      assert.typeOf(autoParse, 'function')
    })

    it('parses strings to numbers', function () {
      assert.strictEqual(autoParse('42'), 42)
    })

    it('parses strings to booleans', function () {
      assert.strictEqual(autoParse('true'), true)
    })

    it('parses JSON strings', function () {
      assert.deepEqual(autoParse('{"a":1}'), { a: 1 })
    })

    it('handles null and undefined', function () {
      assert.strictEqual(autoParse('null'), null)
      assert.strictEqual(autoParse('undefined'), undefined)
    })

    it('supports options', function () {
      assert.strictEqual(autoParse('0005', { preserveLeadingZeros: true }), '0005')
    })

    it('is minified (smaller than CJS)', function () {
      var minSize = fs.statSync(path.join(distDir, 'auto-parse.min.js')).size
      var cjsSize = fs.statSync(path.join(distDir, 'auto-parse.js')).size
      assert.isBelow(minSize, cjsSize, 'minified should be smaller than CJS')
    })
  })

  describe('auto-parse.esm.js (ES module)', function () {
    var code
    beforeAll(function () {
      code = fs.readFileSync(path.join(distDir, 'auto-parse.esm.js'), 'utf8')
    })

    it('file exists and is non-empty', function () {
      assert.isAbove(code.length, 0)
    })

    it('contains export default', function () {
      assert.include(code, 'export')
    })

    it('uses export default as public API', function () {
      assert.match(code, /export\s+default/)
    })

    it('does not use require() as a public import', function () {
      // esbuild wraps CJS internally but the public API should be ESM
      assert.notMatch(code, /^const .* = require\(/m)
    })

    it('contains core parsing logic', function () {
      assert.include(code, 'autoParse')
      assert.include(code, 'parseObject')
      assert.include(code, 'WeakSet')
      assert.include(code, 'schema')
    })
  })

  describe('all dist files exist', function () {
    var expected = [
      'auto-parse.js',
      'auto-parse.esm.js',
      'auto-parse.min.js',
      'auto-parse.map.js',
      'auto-parse.map.js.map'
    ]

    expected.forEach(function (file) {
      it(file + ' exists', function () {
        var fullPath = path.join(distDir, file)
        assert.strictEqual(fs.existsSync(fullPath), true, file + ' should exist in dist/')
      })
    })

    it('no unexpected files in dist/', function () {
      var actual = fs.readdirSync(distDir).sort()
      assert.deepEqual(actual, expected.sort())
    })
  })
})
