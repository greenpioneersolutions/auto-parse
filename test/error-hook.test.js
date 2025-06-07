const autoParse = require('../index.js')
const { assert } = require('chai')

describe('Error handling hook', function () {
  it('invokes onError when parsing throws', function () {
    let called = false
    const result = autoParse('abc', { type: 'BigInt',
      onError (err, value, type) {
        called = true
        assert.instanceOf(err, Error)
        assert.strictEqual(value, 'abc')
        assert.strictEqual(type, 'BigInt')
        return 0
      }
    })
    assert.strictEqual(result, 0)
    assert.strictEqual(called, true)
  })

  it('rethrows when no onError is provided', function () {
    assert.throws(() => autoParse('abc', 'BigInt'))
  })

  it('uses global error handler when none is provided', function () {
    let called = false
    autoParse.setErrorHandler((err, value, type) => {
      called = true
      assert.instanceOf(err, Error)
      assert.strictEqual(value, 'abc')
      assert.strictEqual(type, 'BigInt')
      return 1n
    })
    const result = autoParse('abc', 'BigInt')
    assert.strictEqual(result, 1n)
    assert.strictEqual(called, true)
    autoParse.setErrorHandler(null)
  })
})
