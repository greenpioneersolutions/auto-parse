const autoParse = require('..')

console.log('URL:', autoParse('https://example.com', { parseUrls: true }))
console.log('Path:', autoParse('./foo/bar', { parseFilePaths: true }))
