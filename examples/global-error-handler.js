const autoParse = require('..')

autoParse.setErrorHandler((err, value, type) => {
  console.error('Failed to parse', value, 'as', type)
  return null
})

console.log(autoParse('oops', 'BigInt'))
