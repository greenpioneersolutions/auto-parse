/* global test, expect, describe */
const autoParse = require('../index.js')

function benchmark (fn) {
  const start = process.hrtime.bigint()
  fn()
  const end = process.hrtime.bigint()
  return Number(end - start) / 1e6
}

describe('Performance', () => {
  test('parse string performance', () => {
    for (let i = 0; i < 1000; i++) {
      autoParse('  "42"  ')
    }
    const time = benchmark(() => {
      for (let i = 0; i < 10000; i++) {
        autoParse('  "42"  ')
      }
    })
    console.log('string parse time', time)
    // allow extra time for CI machines
    expect(time).toBeLessThan(300)
  })

  test('parse object string performance', () => {
    for (let i = 0; i < 100; i++) {
      autoParse('{"a":1,"b":2}')
    }

    const time = benchmark(() => {
      for (let i = 0; i < 1000; i++) {
        autoParse('{"a":1,"b":2}')
      }
    })
    console.log('object string parse time', time)
    // CI hardware runs slower, so give it more headroom
    expect(time).toBeLessThan(50)
  })

  test('parse number performance', () => {
    for (let i = 0; i < 1000; i++) {
      autoParse('123')
    }
    const time = benchmark(() => {
      for (let i = 0; i < 10000; i++) {
        autoParse('123')
      }
    })
    console.log('number parse time', time)
    expect(time).toBeLessThan(300)
  })

  test('parse boolean performance', () => {
    for (let i = 0; i < 1000; i++) {
      autoParse('true')
    }
    const time = benchmark(() => {
      for (let i = 0; i < 10000; i++) {
        autoParse('true')
      }
    })
    console.log('boolean parse time', time)
    expect(time).toBeLessThan(300)
  })

  test('parse array performance', () => {
    for (let i = 0; i < 100; i++) {
      autoParse('[1,2,3]')
    }
    const time = benchmark(() => {
      for (let i = 0; i < 1000; i++) {
        autoParse('[1,2,3]')
      }
    })
    console.log('array parse time', time)
    expect(time).toBeLessThan(60)
  })

  test('parse object performance', () => {
    const obj = { a: '1', b: '2' }
    for (let i = 0; i < 100; i++) {
      autoParse(obj)
    }
    const time = benchmark(() => {
      for (let i = 0; i < 1000; i++) {
        autoParse(obj)
      }
    })
    console.log('object parse time', time)
    expect(time).toBeLessThan(60)
  })

  test('options performance', () => {
    for (let i = 0; i < 100; i++) {
      autoParse('001,234', {
        parseCommaNumbers: true,
        stripStartChars: '0',
        preserveLeadingZeros: true,
        allowedTypes: ['string']
      })
    }
    const time = benchmark(() => {
      for (let i = 0; i < 1000; i++) {
        autoParse('001,234', {
          parseCommaNumbers: true,
          stripStartChars: '0',
          preserveLeadingZeros: true,
          allowedTypes: ['string']
        })
      }
    })
    console.log('options parse time', time)
    expect(time).toBeLessThan(80)
  })

  test('plugin performance', () => {
    const ap = require('../index.js')
    ap.use(v => (v === 'plug' ? 1 : undefined))
    for (let i = 0; i < 1000; i++) {
      ap('plug')
    }
    const time = benchmark(() => {
      for (let i = 0; i < 10000; i++) {
        ap('plug')
      }
    })
    console.log('plugin parse time', time)
    expect(time).toBeLessThan(300)
  })

  test('expression performance', () => {
    for (let i = 0; i < 1000; i++) {
      autoParse('2 + 3 * 4', { parseExpressions: true })
    }
    const time = benchmark(() => {
      for (let i = 0; i < 10000; i++) {
        autoParse('2 + 3 * 4', { parseExpressions: true })
      }
    })
    console.log('expression parse time', time)
    expect(time).toBeLessThan(300)
  })

  test('date parse performance', () => {
    for (let i = 0; i < 1000; i++) {
      autoParse('2023-06-01T12:00:00Z', { parseDates: true })
    }
    const time = benchmark(() => {
      for (let i = 0; i < 10000; i++) {
        autoParse('2023-06-01T12:00:00Z', { parseDates: true })
      }
    })
    console.log('date parse time', time)
    expect(time).toBeLessThan(300)
  })

  test('url parse performance', () => {
    for (let i = 0; i < 1000; i++) {
      autoParse('https://example.com', { parseUrls: true })
    }
    const time = benchmark(() => {
      for (let i = 0; i < 10000; i++) {
        autoParse('https://example.com', { parseUrls: true })
      }
    })
    console.log('url parse time', time)
    expect(time).toBeLessThan(300)
  })

  test('file path parse performance', () => {
    for (let i = 0; i < 1000; i++) {
      autoParse('./foo/bar', { parseFilePaths: true })
    }
    const time = benchmark(() => {
      for (let i = 0; i < 10000; i++) {
        autoParse('./foo/bar', { parseFilePaths: true })
      }
    })
    console.log('path parse time', time)
    expect(time).toBeLessThan(300)
  })

  test('error callback performance', () => {
    const opts = { type: 'BigInt', onError: () => 0 }
    for (let i = 0; i < 1000; i++) {
      autoParse('bad', opts)
    }
    const time = benchmark(() => {
      for (let i = 0; i < 10000; i++) {
        autoParse('bad', opts)
      }
    })
    console.log('error callback time', time)
    expect(time).toBeLessThan(300)
  })

  test('global handler performance', () => {
    autoParse.setErrorHandler(() => 0)
    for (let i = 0; i < 1000; i++) {
      autoParse('bad', 'BigInt')
    }
    const time = benchmark(() => {
      for (let i = 0; i < 10000; i++) {
        autoParse('bad', 'BigInt')
      }
    })
    console.log('global handler time', time)
    expect(time).toBeLessThan(300)
    autoParse.setErrorHandler(null)
  })
})
