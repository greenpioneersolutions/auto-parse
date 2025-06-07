const autoParse = require('../index.js')
const { assert } = require('chai')

describe('Date/time parsing', function () {
  it('parses ISO dates', function () {
    const d = autoParse('2023-06-01T12:00:00Z', { parseDates: true })
    assert.instanceOf(d, Date)
    assert.strictEqual(d.toISOString(), '2023-06-01T12:00:00.000Z')
  })

  it('parses US dates', function () {
    const d = autoParse('03/10/2020', { parseDates: true })
    assert.instanceOf(d, Date)
    assert.strictEqual(d.getFullYear(), 2020)
    assert.strictEqual(d.getMonth(), 2)
    assert.strictEqual(d.getDate(), 10)
  })

  it('parses time strings', function () {
    const d = autoParse('13:45', { parseDates: true })
    assert.instanceOf(d, Date)
    assert.strictEqual(d.getHours(), 13)
    assert.strictEqual(d.getMinutes(), 45)
  })

  it('defaults to string when disabled', function () {
    assert.strictEqual(autoParse('2023-06-01'), '2023-06-01')
  })
})
