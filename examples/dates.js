const autoParse = require('..')

console.log('ISO:', autoParse('2023-06-01T12:00:00Z', { parseDates: true }))
console.log('US:', autoParse('03/10/2020 2:30 PM', { parseDates: true }))
console.log('Time:', autoParse('13:45', { parseDates: true }))
