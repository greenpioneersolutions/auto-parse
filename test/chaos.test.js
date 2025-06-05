const autoParse = require('../index.js')
const { assert } = require('chai')

function randomValue (depth = 0) {
  if (depth > 2) return Math.random()
  const generators = [
    () => Math.random(),
    () => String(Math.random()),
    () => Math.random() > 0.5,
    () => [randomValue(depth + 1), randomValue(depth + 1)],
    () => ({ a: randomValue(depth + 1), b: randomValue(depth + 1) }),
    () => null,
    () => undefined,
    () => function () { return randomValue(depth + 1) }
  ]
  return generators[Math.floor(Math.random() * generators.length)]()
}

describe('Chaos testing', function () {
  it('autoParse handles random inputs without throwing', function () {
    for (let i = 0; i < 1000; i++) {
      const val = randomValue()
      assert.doesNotThrow(function () { autoParse(val) })
    }
  })

  it('autoParse is idempotent', function () {
    for (let i = 0; i < 100; i++) {
      const val = randomValue()
      const once = autoParse(val)
      assert.deepEqual(autoParse(once), once)
    }
  })
})
