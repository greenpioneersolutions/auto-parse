const autoParse = require('../index.js')
const chaiAssert = require('chai').assert

function Color (inputColor) {
  this.color = inputColor
}

describe('Color strings', function () {
  it('preserves #fff as a string', function () {
    chaiAssert.strictEqual(autoParse('#fff'), '#fff')
    chaiAssert.typeOf(autoParse('#fff'), 'string')
  })

  it('preserves #ABC as a string', function () {
    chaiAssert.strictEqual(autoParse('#ABC'), '#ABC')
    chaiAssert.typeOf(autoParse('#ABC'), 'string')
  })

  it('converts using Color constructor', function () {
    chaiAssert.deepEqual(autoParse('#ffcc00', Color), { color: '#ffcc00' })
  })
})

describe('Hexadecimal numbers', function () {
  const cases = {
    '0x1': 1,
    '0x1A': 26,
    '0X2F': 47,
    '0xff': 255,
    '0x10': 16,
    '0xABCDEF': 0xABCDEF
  }

  for (const hex in cases) {
    const dec = cases[hex]
    it(`${hex} => ${dec}`, function () {
      chaiAssert.strictEqual(autoParse(hex), dec)
      chaiAssert.typeOf(autoParse(hex), 'number')
    })
  }
})
