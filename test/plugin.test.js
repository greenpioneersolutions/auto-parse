/* global beforeEach, jest */
const { assert } = require('chai')

describe('Additional plugin tests', function () {
  let autoParse
  beforeEach(function () {
    jest.resetModules()
    autoParse = require('../index.js')
  })

  it('runs plugins in registration order', function () {
    const calls = []
    autoParse.use(function () { calls.push('first') })
    autoParse.use(function () { calls.push('second') })
    autoParse('value')
    assert.deepEqual(calls, ['first', 'second'])
  })

  it('stops processing when a plugin returns a value', function () {
    const calls = []
    autoParse.use(function () { calls.push('first'); return 1 })
    autoParse.use(function () { calls.push('second'); return 2 })
    assert.strictEqual(autoParse('anything'), 1)
    assert.deepEqual(calls, ['first'])
  })

  it('treats null as a valid result', function () {
    autoParse.use(function (val) { if (val === 'nothing') return null })
    autoParse.use(function () { return 'unused' })
    assert.strictEqual(autoParse('nothing'), null)
  })
})
