/* global beforeEach, jest */
var { assert } = require('chai')

describe('v2.5 — Immutability', function () {
  var autoParse
  beforeEach(function () {
    jest.resetModules()
    autoParse = require('../index.js')
  })

  it('does not mutate input objects', function () {
    var input = { a: '1', b: 'true', c: 'hello' }
    var original = JSON.parse(JSON.stringify(input))
    autoParse(input)
    assert.deepEqual(input, original)
  })

  it('does not mutate nested objects', function () {
    var input = { a: { b: '42', c: '3' } }
    var original = JSON.parse(JSON.stringify(input))
    autoParse(input)
    assert.deepEqual(input, original)
  })

  it('does not mutate input arrays', function () {
    var input = ['1', '2', 'true']
    var original = input.slice()
    autoParse(input)
    assert.deepEqual(input, original)
  })

  it('returns a new object reference', function () {
    var input = { a: '1' }
    var result = autoParse(input)
    assert.notStrictEqual(result, input)
    assert.strictEqual(result.a, 1)
  })

  it('returns a new array reference', function () {
    var input = ['1', '2']
    var result = autoParse(input)
    assert.notStrictEqual(result, input)
    assert.deepEqual(result, [1, 2])
  })

  it('preserves Object.create(null) prototype', function () {
    var input = Object.create(null)
    input.a = '5'
    var result = autoParse(input)
    assert.strictEqual(Object.getPrototypeOf(result), null)
    assert.strictEqual(result.a, 5)
  })
})

describe('v2.5 — Circular reference detection', function () {
  var autoParse
  beforeEach(function () {
    jest.resetModules()
    autoParse = require('../index.js')
  })

  it('handles self-referencing objects without crashing', function () {
    var obj = { a: '1' }
    obj.self = obj
    assert.doesNotThrow(function () { autoParse(obj) })
  })

  it('handles mutual references without crashing', function () {
    var a = { val: '1' }
    var b = { val: '2', ref: a }
    a.ref = b
    assert.doesNotThrow(function () { autoParse(a) })
  })

  it('returns circular reference as-is', function () {
    var obj = { a: '42' }
    obj.self = obj
    var result = autoParse(obj)
    assert.strictEqual(result.a, 42)
    assert.strictEqual(result.self, obj)
  })

  it('handles arrays with circular references', function () {
    var arr = ['1', '2']
    arr.push(arr)
    assert.doesNotThrow(function () { autoParse(arr) })
  })
})

describe('v2.5 — Schema-based parsing', function () {
  var autoParse
  beforeEach(function () {
    jest.resetModules()
    autoParse = require('../index.js')
  })

  it('applies schema types to object properties', function () {
    var result = autoParse({ age: '25', active: 'true', name: 'alice' }, {
      schema: { age: 'number', active: 'boolean' }
    })
    assert.strictEqual(result.age, 25)
    assert.strictEqual(result.active, true)
    assert.strictEqual(result.name, 'alice')
  })

  it('applies schema to JSON-parsed strings', function () {
    var result = autoParse('{"count":"10","done":"false"}', {
      schema: { count: 'number', done: 'boolean' }
    })
    assert.strictEqual(result.count, 10)
    assert.strictEqual(result.done, false)
  })

  it('auto-parses keys not in schema', function () {
    var result = autoParse({ a: '42', b: 'hello' }, {
      schema: { a: 'string' }
    })
    assert.strictEqual(result.a, '42')
    assert.strictEqual(result.b, 'hello')
  })

  it('uses constructor types in schema', function () {
    var result = autoParse({ date: '2023-06-01' }, {
      schema: { date: Date }
    })
    assert.instanceOf(result.date, Date)
  })

  it('does not affect non-object parsing', function () {
    assert.strictEqual(autoParse('42', { schema: { a: 'string' } }), 42)
  })
})

describe('v2.5 — dateFormat option', function () {
  var autoParse
  beforeEach(function () {
    jest.resetModules()
    autoParse = require('../index.js')
  })

  it('defaults to US format for slash dates', function () {
    var d = autoParse('03/10/2020', { parseDates: true })
    assert.strictEqual(d.getMonth(), 2)
    assert.strictEqual(d.getDate(), 10)
  })

  it('defaults to EU format for dash dates', function () {
    var d = autoParse('10-03-2020', { parseDates: true })
    assert.strictEqual(d.getDate(), 10)
    assert.strictEqual(d.getMonth(), 2)
  })

  it('dateFormat eu forces EU interpretation for slash dates', function () {
    var d = autoParse('10/03/2020', { parseDates: true, dateFormat: 'eu' })
    assert.strictEqual(d.getDate(), 10)
    assert.strictEqual(d.getMonth(), 2)
  })

  it('dateFormat us forces US interpretation for dash dates', function () {
    var d = autoParse('03-10-2020', { parseDates: true, dateFormat: 'us' })
    assert.strictEqual(d.getMonth(), 2)
    assert.strictEqual(d.getDate(), 10)
  })

  it('dateFormat iso only parses ISO 8601 strings', function () {
    var d = autoParse('2023-06-01', { parseDates: true, dateFormat: 'iso' })
    assert.instanceOf(d, Date)
    assert.strictEqual(d.toISOString().slice(0, 10), '2023-06-01')

    var s = autoParse('03/10/2020', { parseDates: true, dateFormat: 'iso' })
    assert.strictEqual(s, '03/10/2020')

    var s2 = autoParse('10-03-2020', { parseDates: true, dateFormat: 'iso' })
    assert.strictEqual(s2, '10-03-2020')
  })

  it('still parses time strings with any dateFormat', function () {
    var d = autoParse('14:30', { parseDates: true, dateFormat: 'iso' })
    assert.instanceOf(d, Date)
    assert.strictEqual(d.getHours(), 14)
    assert.strictEqual(d.getMinutes(), 30)
  })
})

describe('v2.5 — Security', function () {
  var autoParse
  beforeEach(function () {
    jest.resetModules()
    autoParse = require('../index.js')
  })

  it('expression parser rejects non-numeric characters', function () {
    var result = autoParse('process.exit(1)', { parseExpressions: true })
    assert.strictEqual(result, 'process.exit(1)')
  })

  it('expression parser rejects variable references', function () {
    var result = autoParse('globalThis', { parseExpressions: true })
    assert.strictEqual(result, 'globalThis')
  })

  it('expression parser rejects constructor access', function () {
    var result = autoParse('constructor.constructor("return this")()', { parseExpressions: true })
    assert.strictEqual(result, 'constructor.constructor("return this")()')
  })

  it('expression parser only allows safe math', function () {
    assert.strictEqual(autoParse('2 + 3', { parseExpressions: true }), 5)
    assert.strictEqual(autoParse('10 / 2', { parseExpressions: true }), 5)
    assert.strictEqual(autoParse('(3 + 2) * 4', { parseExpressions: true }), 20)
  })
})

describe('v2.5 — Edge cases', function () {
  var autoParse
  beforeEach(function () {
    jest.resetModules()
    autoParse = require('../index.js')
  })

  it('Infinity string stays as string', function () {
    assert.strictEqual(autoParse('Infinity'), 'Infinity')
  })

  it('-Infinity string stays as string', function () {
    assert.strictEqual(autoParse('-Infinity'), '-Infinity')
  })

  it('handles whitespace-only strings', function () {
    assert.strictEqual(autoParse('   '), undefined)
  })

  it('handles deeply nested objects', function () {
    var input = { a: { b: { c: { d: '42' } } } }
    var result = autoParse(input)
    assert.strictEqual(result.a.b.c.d, 42)
  })

  it('handles empty objects', function () {
    assert.deepEqual(autoParse({}), {})
  })

  it('handles empty arrays', function () {
    assert.deepEqual(autoParse([]), [])
  })

  it('handles mixed nested arrays and objects', function () {
    var input = { list: ['1', { val: 'true' }] }
    var result = autoParse(input)
    assert.strictEqual(result.list[0], 1)
    assert.strictEqual(result.list[1].val, true)
  })

  it('range parsing with large ranges caps gracefully', function () {
    var result = autoParse('1..1000', { parseRanges: true })
    assert.strictEqual(result.length, 1000)
    assert.strictEqual(result[0], 1)
    assert.strictEqual(result[999], 1000)
  })

  it('negative currency values return original string', function () {
    var result = autoParse('-$19.99', { parseCurrency: true })
    assert.strictEqual(result, '-$19.99')
  })

  it('negative percents parse correctly', function () {
    assert.strictEqual(autoParse('-50%', { parsePercent: true }), -0.5)
  })

  it('negative range values work', function () {
    assert.deepEqual(autoParse('-3..-1', { parseRanges: true }), [-3, -2, -1])
  })

  it('reverse range values work', function () {
    assert.deepEqual(autoParse('3..1', { parseRanges: true }), [3, 2, 1])
  })
})

describe('v2.5 — Option interactions', function () {
  var autoParse
  beforeEach(function () {
    jest.resetModules()
    autoParse = require('../index.js')
  })

  it('stripStartChars with parseCommaNumbers', function () {
    var result = autoParse('#1,000', { stripStartChars: '#', parseCommaNumbers: true })
    assert.strictEqual(result, 1000)
  })

  it('allowedTypes blocks schema-parsed values that do not match', function () {
    var result = autoParse({ a: '42' }, {
      schema: { a: 'number' },
      allowedTypes: ['object']
    })
    assert.deepEqual(result, { a: 42 })
  })

  it('preserveLeadingZeros with schema ignores schema for that key', function () {
    var result = autoParse({ code: '007', val: '42' }, {
      schema: { val: 'number' }
    })
    assert.strictEqual(result.code, 7)
    assert.strictEqual(result.val, 42)
  })
})
