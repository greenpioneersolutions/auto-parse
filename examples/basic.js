const autoParse = require('..')

console.log('Boolean:', autoParse('TrUe'))
console.log('Number:', autoParse('42'))
console.log('Array:', autoParse('["1", "2", "3"]'))
console.log('Object:', autoParse('{"a":"1","b":false}'))
