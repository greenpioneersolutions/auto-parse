const autoParse = require('..')

autoParse.setErrorHandler((err, value, type) => {
  console.error('Failed to parse', value, 'as', type, '-', err.message)
  return null
})

console.log(autoParse('oops', 'BigInt'))
