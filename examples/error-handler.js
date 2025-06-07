const autoParse = require('..')

const result = autoParse('abc', {
  type: 'BigInt',
  onError (err, value, type) {
    console.warn('Could not parse', value, 'as', type, '-', err.message)
    return 0
  }
})

console.log('result:', result)
