const autoParse = require('../index.js')
const chaiAssert = require('chai').assert

describe('Generated bulk tests', function () {
  describe('Numeric strings to numbers', function () {
    for (let i = 0; i < 300; i++) {
      it(`"${i}" => ${i}`, function () {
        chaiAssert.strictEqual(autoParse(String(i)), i)
        chaiAssert.typeOf(autoParse(String(i)), 'number')
      })
    }
  })
})
