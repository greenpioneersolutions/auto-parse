const autoParse = require('../index.js')
const { assert } = require('chai')

describe('New 2.1 features', function () {
  it('parses currency strings', function () {
    const opts = { parseCurrency: true }
    assert.strictEqual(autoParse('$19.99', opts), 19.99)
    assert.deepEqual(autoParse('€5,50', { parseCurrency: true, currencyAsObject: true }), { value: 5.5, currency: 'EUR' })
    assert.strictEqual(autoParse('£100', opts), 100)
    assert.strictEqual(autoParse('r$10', { parseCurrency: true, currencySymbols: { 'r$': 'BRL' } }), 10)
    assert.deepEqual(
      autoParse('\u20BA7', { parseCurrency: true, currencySymbols: { '\u20BA': 'TRY' }, currencyAsObject: true }),
      { value: 7, currency: 'TRY' }
    )
  })

  it('does not parse currency when symbol appears mid-string', function () {
    const opts = { parseCurrency: true }
    assert.strictEqual(autoParse('price is $5 today', opts), 'price is $5 today')
  })

  it('parses percent strings', function () {
    assert.strictEqual(autoParse('85%', { parsePercent: true }), 0.85)
  })

  it('parses unit strings', function () {
    assert.deepEqual(autoParse('10px', { parseUnits: true }), { value: 10, unit: 'px' })
  })

  it('parses range strings', function () {
    assert.deepEqual(autoParse('1..3', { parseRanges: true }), [1, 2, 3])
  })

  it('recognizes yes/no/on/off booleans', function () {
    const opts = { booleanSynonyms: true }
    assert.strictEqual(autoParse('yes', opts), true)
    assert.strictEqual(autoParse('off', opts), false)
  })

  it('parses Map and Set strings', function () {
    const opts = { parseMapSets: true }
    const m = autoParse('Map:[["a",1],["b",2]]', opts)
    assert.instanceOf(m, Map)
    assert.strictEqual(m.get('a'), 1)
    const s = autoParse('Set:[1,2]', opts)
    assert.instanceOf(s, Set)
    assert.strictEqual(s.has(2), true)
  })

  it('parses typed array strings', function () {
    const ta = autoParse('Uint8Array[1,2,3]', { parseTypedArrays: true })
    assert.instanceOf(ta, Uint8Array)
    assert.strictEqual(ta[1], 2)
  })

  it('evaluates simple expressions', function () {
    assert.strictEqual(autoParse('2 + 3 * 4', { parseExpressions: true }), 14)
  })

  it('expands environment variables', function () {
    process.env.TEST_ENV = '123'
    assert.strictEqual(autoParse('$TEST_ENV', { expandEnv: true }), 123)
  })

  it('parses function strings', function () {
    const fn = autoParse('x => x * 2', { parseFunctionStrings: true })
    assert.strictEqual(fn(3), 6)
  })

  it('defaults to basic parsing when features are not enabled', function () {
    assert.strictEqual(autoParse('$5'), '$5')
    assert.strictEqual(autoParse('yes'), 'yes')
  })
})
