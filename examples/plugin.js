const autoParse = require('..')

autoParse.use((value) => {
  if (value === 'color:red') {
    return { color: '#FF0000' }
  }
})

console.log(autoParse('color:red'))
