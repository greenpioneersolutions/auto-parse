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
    for (let i = 0; i < 1000; i++) autoParse('  "42"  ')
    const time = benchmark(() => {
      for (let i = 0; i < 10000; i++) {
        autoParse('  "42"  ')
      }
    })
    console.log('string parse time', time)
    expect(time).toBeLessThan(50)
  })

  test('parse object string performance', () => {
    for (let i = 0; i < 100; i++) autoParse('{"a":1,"b":2}')
    const time = benchmark(() => {
      for (let i = 0; i < 1000; i++) {
        autoParse('{"a":1,"b":2}')
      }
    })
    console.log('object string parse time', time)
    expect(time).toBeLessThan(13)
  })
})
