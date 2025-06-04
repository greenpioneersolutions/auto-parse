const autoParse = require('..')

console.log('BigInt:', autoParse('9007199254740991', BigInt))
console.log('Symbol:', typeof autoParse('desc', Symbol))
console.log('Date:', autoParse('1989-11-30', Date))
