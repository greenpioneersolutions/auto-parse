/* global beforeEach, jest */
const { assert } = require('chai')

describe('Plugin system', function () {
  let autoParse
  beforeEach(function () {
    jest.resetModules()
    autoParse = require('../index.js')
  })

  it('plugin intercepts value', function () {
    autoParse.use(function (val) {
      if (val === 'special') return 42
    })
    assert.strictEqual(autoParse('special'), 42)
  })

  it('next plugin runs if previous returns undefined', function () {
    autoParse.use(function () {})
    autoParse.use(function () { return 5 })
    assert.strictEqual(autoParse('anything'), 5)
  })

  it('plugin sees type parameter', function () {
    autoParse.use(function (val, type) {
      if (type === 'boolean' && val === 'yes') return true
    })
    assert.strictEqual(autoParse('yes', 'boolean'), true)
  })
})

describe('BigInt and Symbol parsing', function () {
  const autoParse = require('../index.js')

  it('converts to BigInt when requested', function () {
    const result = autoParse('123', 'BigInt')
    assert.strictEqual(result, BigInt(123))
    assert.equal(typeof result, 'bigint')
  })

  it('throws on invalid BigInt input', function () {
    assert.throws(function () { autoParse('foo', 'BigInt') })
  })

  it('converts to Symbol when requested', function () {
    const sym = autoParse('desc', 'Symbol')
    assert.equal(typeof sym, 'symbol')
    assert.equal(sym.description, 'desc')
  })
})
