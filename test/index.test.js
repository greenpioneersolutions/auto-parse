const autoParse = require('../index.js')
const chaiAssert = require('chai').assert

function Color (inputColor) {
  this.color = inputColor
}

function parse (ret) {
  // Test case from here - https://github.com/greenpioneersolutions/auto-parse/issues/16
  return Object.keys(ret).sort().reduce((result, key) => {
    const value = ret[key]
    result[key] = value
    return result
  }, Object.create(null))
}

describe('Auto Parse', function () {
  describe('Strings', function () {
    it('Green Pioneer', function () {
      chaiAssert.equal(autoParse('Green Pioneer'), 'Green Pioneer')
      chaiAssert.typeOf(autoParse('Green Pioneer'), 'string')
    })
    it('Green Pioneer Solutions', function () {
      chaiAssert.equal(autoParse('Green Pioneer Solutions'), 'Green Pioneer Solutions')
      chaiAssert.typeOf(autoParse('Green Pioneer Solutions'), 'string')
    })
    it('True or False', function () {
      chaiAssert.equal(autoParse('True or False'), 'True or False')
      chaiAssert.typeOf(autoParse('True or False'), 'string')
    })
    it('123 Numbers', function () {
      chaiAssert.equal(autoParse('123 Numbers'), '123 Numbers')
      chaiAssert.typeOf(autoParse('123 Numbers'), 'string')
    })
    it('$group', function () {
      chaiAssert.equal(autoParse('$group'), '$group')
      chaiAssert.typeOf(autoParse('$group'), 'string')
    })
    it('a11y', function () {
      chaiAssert.equal(autoParse('a11y'), 'a11y')
      chaiAssert.typeOf(autoParse('a11y'), 'string')
    })
    it('$group:test', function () {
      chaiAssert.equal(autoParse('$group:test'), '$group:test')
      chaiAssert.typeOf(autoParse('$group:test'), 'string')
    })
    it('got a question?', function () {
      chaiAssert.equal(autoParse('got a question?'), 'got a question?')
      chaiAssert.typeOf(autoParse('got a question?'), 'string')
    })
  })
  describe('Number', function () {
    it('hexadecimals String to Number', function () {
      chaiAssert.equal(autoParse('0xFF'), 255)
    })
    it('dots String to Number', function () {
      chaiAssert.equal(autoParse('.42'), 0.42)
    })
    it('octals String to Number', function () {
      chaiAssert.equal(autoParse('0o123'), 83)
    })
    it('binary number String to Number', function () {
      chaiAssert.equal(autoParse('0b1101'), 13)
    })
    it('Exponent String to Number', function () {
      chaiAssert.equal(autoParse('7e3'), 7000)
    })
    it('26 String to Number', function () {
      chaiAssert.equal(autoParse('26'), 26)
      chaiAssert.typeOf(autoParse('26'), 'number')
    })
    it('1 String to Number', function () {
      chaiAssert.equal(autoParse('1'), 1)
      chaiAssert.typeOf(autoParse('1'), 'number')
    })
    it('0 String to Number', function () {
      chaiAssert.equal(autoParse('0'), 0)
      chaiAssert.typeOf(autoParse('0'), 'number')
    })
    it('preserves leading zeros when requested', function () {
      chaiAssert.equal(
        autoParse('0000035', { preserveLeadingZeros: true }),
        '0000035'
      )
      chaiAssert.typeOf(
        autoParse('0000035', { preserveLeadingZeros: true }),
        'string'
      )
    })
    it('respects allowedTypes option', function () {
      chaiAssert.equal(
        autoParse('42', { allowedTypes: ['string'] }),
        '42'
      )
      chaiAssert.typeOf(
        autoParse('42', { allowedTypes: ['string'] }),
        'string'
      )
    })
    it('allows numbers when included in allowedTypes', function () {
      chaiAssert.strictEqual(autoParse('42', { allowedTypes: ['number'] }), 42)
      chaiAssert.typeOf(autoParse('42', { allowedTypes: ['number'] }), 'number')
    })
    it('returns original when parsed type not allowed', function () {
      chaiAssert.strictEqual(autoParse('true', { allowedTypes: ['number'] }), 'true')
    })
    it('supports arrays and objects in allowedTypes', function () {
      chaiAssert.deepEqual(autoParse('[1,2]', { allowedTypes: ['array'] }), [1, 2])
      chaiAssert.deepEqual(autoParse('{"a":1}', { allowedTypes: ['object'] }), { a: 1 })
    })
    it('strips starting characters before parsing', function () {
      chaiAssert.equal(
        autoParse('#123', { stripStartChars: '#' }),
        123
      )
    })
    it('strips multiple characters', function () {
      chaiAssert.equal(autoParse('$$$7', { stripStartChars: '$' }), 7)
      chaiAssert.equal(autoParse("'42", { stripStartChars: "'" }), 42)
    })
    it('strips from a set of characters', function () {
      chaiAssert.equal(
        autoParse('@@100', { stripStartChars: ['@', '#'] }),
        100
      )
      chaiAssert.equal(
        autoParse('#@50', { stripStartChars: ['@', '#'] }),
        50
      )
    })
    it('parses numbers with commas when enabled', function () {
      chaiAssert.equal(
        autoParse('385,134', { parseCommaNumbers: true }),
        385134
      )
    })
    it('handles multi-comma numbers', function () {
      chaiAssert.equal(
        autoParse('1,234,567', { parseCommaNumbers: true }),
        1234567
      )
      chaiAssert.equal(
        autoParse('10,000,000.01', { parseCommaNumbers: true }),
        10000000.01
      )
    })
    it('ignores comma parsing when disabled', function () {
      chaiAssert.strictEqual(autoParse('1,234,567'), '1,234,567')
    })
    it('26 Number to Number', function () {
      chaiAssert.equal(autoParse(26), 26)
      chaiAssert.typeOf(autoParse(26), 'number')
    })
    it('1 Number to Number', function () {
      chaiAssert.equal(autoParse(1), 1)
      chaiAssert.typeOf(autoParse(1), 'number')
    })
    it('0 Number to Number', function () {
      chaiAssert.equal(autoParse(0), 0)
      chaiAssert.typeOf(autoParse(0), 'number')
    })
  })
  describe('Boolean', function () {
    it('true Boolean to Boolean', function () {
      chaiAssert.equal(autoParse(true), true)
      chaiAssert.typeOf(autoParse(true), 'boolean')
    })
    it('false Boolean to Boolean', function () {
      chaiAssert.equal(autoParse(false), false)
      chaiAssert.typeOf(autoParse(false), 'boolean')
    })
    it('true String to Boolean', function () {
      chaiAssert.equal(autoParse('true'), true)
      chaiAssert.typeOf(autoParse('true'), 'boolean')
    })
    it('false String to Boolean', function () {
      chaiAssert.equal(autoParse('false'), false)
      chaiAssert.typeOf(autoParse('false'), 'boolean')
    })
    it('True String to Boolean', function () {
      chaiAssert.equal(autoParse('True'), true)
      chaiAssert.typeOf(autoParse('True'), 'boolean')
    })
    it('TrUe String o Boolean', function () {
      chaiAssert.equal(autoParse('TrUe'), true)
      chaiAssert.typeOf(autoParse('TrUe'), 'boolean')
    })
  })
  describe('Array', function () {
    it(`"['2332','2343','2343','2342','3233']"`, function () {
      const data = "['2332','2343','2343','2342','3233']"
      chaiAssert.equal(autoParse(data)[0], 2332)
      chaiAssert.typeOf(autoParse(data)[0], 'number')
      chaiAssert.equal(autoParse(data)[1], 2343)
      chaiAssert.typeOf(autoParse(data)[1], 'number')
      chaiAssert.equal(autoParse(data)[2], 2343)
      chaiAssert.typeOf(autoParse(data)[2], 'number')
      chaiAssert.equal(autoParse(data)[3], 2342)
      chaiAssert.typeOf(autoParse(data)[3], 'number')
      chaiAssert.equal(autoParse(data)[4], 3233)
      chaiAssert.typeOf(autoParse(data)[4], 'number')
    })
    it(`'["80", 92, "23", "TruE",false]'`, function () {
      const data = `'["80", 92, "23", "TruE",false]'`
      chaiAssert.equal(autoParse(data)[0], 80)
      chaiAssert.typeOf(autoParse(data)[0], 'number')
      chaiAssert.equal(autoParse(data)[1], 92)
      chaiAssert.typeOf(autoParse(data)[1], 'number')
      chaiAssert.equal(autoParse(data)[2], 23)
      chaiAssert.typeOf(autoParse(data)[2], 'number')
      chaiAssert.equal(autoParse(data)[3], true)
      chaiAssert.typeOf(autoParse(data)[3], 'boolean')
      chaiAssert.equal(autoParse(data)[4], false)
      chaiAssert.typeOf(autoParse(data)[4], 'boolean')
    })
    it(`'["80", 92, "23", "TruE",false]'`, function () {
      const data = '["80", 92, "23", "TruE",false]'
      chaiAssert.equal(autoParse(data)[0], 80)
      chaiAssert.typeOf(autoParse(data)[0], 'number')
      chaiAssert.equal(autoParse(data)[1], 92)
      chaiAssert.typeOf(autoParse(data)[1], 'number')
      chaiAssert.equal(autoParse(data)[2], 23)
      chaiAssert.typeOf(autoParse(data)[2], 'number')
      chaiAssert.equal(autoParse(data)[3], true)
      chaiAssert.typeOf(autoParse(data)[3], 'boolean')
      chaiAssert.equal(autoParse(data)[4], false)
      chaiAssert.typeOf(autoParse(data)[4], 'boolean')
    })
    it(`"['80', 92, '23', 'TruE',false]"`, function () {
      const data = "['80', 92, '23', 'TruE',false]"
      chaiAssert.equal(autoParse(data)[0], 80)
      chaiAssert.typeOf(autoParse(data)[0], 'number')
      chaiAssert.equal(autoParse(data)[1], 92)
      chaiAssert.typeOf(autoParse(data)[1], 'number')
      chaiAssert.equal(autoParse(data)[2], 23)
      chaiAssert.typeOf(autoParse(data)[2], 'number')
      chaiAssert.equal(autoParse(data)[3], true)
      chaiAssert.typeOf(autoParse(data)[3], 'boolean')
      chaiAssert.equal(autoParse(data)[4], false)
      chaiAssert.typeOf(autoParse(data)[4], 'boolean')
    })
    it('`["80", 92, "23", "TruE",false]`', function () {
      const data = `["80", 92, "23", "TruE", false]`
      chaiAssert.equal(autoParse(data)[0], 80)
      chaiAssert.typeOf(autoParse(data)[0], 'number')
      chaiAssert.equal(autoParse(data)[1], 92)
      chaiAssert.typeOf(autoParse(data)[1], 'number')
      chaiAssert.equal(autoParse(data)[2], 23)
      chaiAssert.typeOf(autoParse(data)[2], 'number')
      chaiAssert.equal(autoParse(data)[3], true)
      chaiAssert.typeOf(autoParse(data)[3], 'boolean')
      chaiAssert.equal(autoParse(data)[4], false)
      chaiAssert.typeOf(autoParse(data)[4], 'boolean')
    })
    it('["80", 92, "23", "TruE",false]', function () {
      const data = ['80', 92, '23', 'TruE', false]
      chaiAssert.equal(autoParse(data)[0], 80)
      chaiAssert.typeOf(autoParse(data)[0], 'number')
      chaiAssert.equal(autoParse(data)[1], 92)
      chaiAssert.typeOf(autoParse(data)[1], 'number')
      chaiAssert.equal(autoParse(data)[2], 23)
      chaiAssert.typeOf(autoParse(data)[2], 'number')
      chaiAssert.equal(autoParse(data)[3], true)
      chaiAssert.typeOf(autoParse(data)[3], 'boolean')
      chaiAssert.equal(autoParse(data)[4], false)
      chaiAssert.typeOf(autoParse(data)[4], 'boolean')
    })
  })
  describe('Object', function () {
    const data = {
      name: 'jason',
      age: '50',
      admin: 'true',
      parents: [
        {
          name: 'Alice',
          age: '75',
          dead: 'false'
        },
        {
          name: 'Bob',
          age: '80',
          dead: 'true'
        }
      ],
      grade: ['80', '90', '100']
    }
    it(JSON.stringify(data), function () {
      chaiAssert.equal(autoParse(data).name, 'jason')
      chaiAssert.typeOf(autoParse(data).name, 'string')
      chaiAssert.equal(autoParse(data).age, 50)
      chaiAssert.typeOf(autoParse(data).age, 'number')
      chaiAssert.equal(autoParse(data).admin, true)
      chaiAssert.typeOf(autoParse(data).admin, 'boolean')
      chaiAssert.equal(autoParse(data).grade[0], 80)
      chaiAssert.typeOf(autoParse(data).grade[0], 'number')
      chaiAssert.equal(autoParse(data).grade[1], 90)
      chaiAssert.typeOf(autoParse(data).grade[1], 'number')
      chaiAssert.equal(autoParse(data).grade[2], 100)
      chaiAssert.typeOf(autoParse(data).grade[2], 'number')
      chaiAssert.typeOf(autoParse(data).grade[2], 'number')
      chaiAssert.equal(autoParse(data).parents[0].name, 'Alice')
      chaiAssert.equal(autoParse(data).parents[0].age, 75)
    })
    it('parsing Object.create(null) Objects', function () {
      const value = autoParse(parse({ order: 'asc', orderBy: '1', filterOn: 'true' }))
      chaiAssert.deepEqual(value, { order: 'asc', orderBy: 1, filterOn: true })
      chaiAssert.typeOf(value.order, 'string')
      chaiAssert.typeOf(value.orderBy, 'number')
      chaiAssert.typeOf(value.filterOn, 'boolean')
    })
  })
  describe('Date', function () {
    it('new Date', function () {
      const value = new Date // eslint-disable-line
      chaiAssert.equal(autoParse(value), value)
      chaiAssert.instanceOf(autoParse(value), Date)
    })
    it('new Date()', function () {
      const value = new Date()
      chaiAssert.equal(autoParse(value), value)
      chaiAssert.instanceOf(autoParse(value), Date)
    })
    it('new Date()', function () {
      const value = new Date('1989-12-01')
      chaiAssert.deepEqual(autoParse(value), value)
      chaiAssert.instanceOf(autoParse(value), Date)
    })
  })
  describe('Regex', function () {
    it('/\w+/', function () { // eslint-disable-line 
      const regex1 = /\w+/
      chaiAssert.equal(autoParse(regex1), regex1)
      chaiAssert.instanceOf(autoParse(regex1), RegExp)
    })
    it('new RegExp("\\w+")', function () {
      const regex2 = new RegExp('\\w+')
      chaiAssert.equal(autoParse(regex2), regex2)
      chaiAssert.instanceOf(autoParse(regex2), RegExp)
    })
  })
  describe('Function', function () {
    it('return "9" to 9', function () {
      const data = function () {
        return '9'
      }
      chaiAssert.equal(autoParse(data), 9)
      chaiAssert.typeOf(autoParse(data), 'number')
    })
    it('return "jason" to "jason"', function () {
      const data = function () {
        return 'jason'
      }
      chaiAssert.equal(autoParse(data), 'jason')
      chaiAssert.typeOf(autoParse(data), 'string')
    })
    it('return "true" to true', function () {
      const data = function () {
        return 'true'
      }
      chaiAssert.equal(autoParse(data), true)
      chaiAssert.typeOf(autoParse(data), 'boolean')
    })
  })
  describe('Undefined', function () {
    it('undefined to undefined', function () {
      chaiAssert.equal(autoParse(undefined), undefined)
      chaiAssert.typeOf(autoParse(undefined), 'undefined')
    })
    it('Undefined String to Undefined', function () {
      chaiAssert.equal(autoParse('Undefined'), undefined)
      chaiAssert.typeOf(autoParse('Undefined'), 'undefined')
    })
    it('  "" ', function () {
      chaiAssert.equal(autoParse(''), undefined)
      chaiAssert.typeOf(autoParse(''), 'undefined')
    })
  })
  describe('Null', function () {
    it('null to Null', function () {
      chaiAssert.equal(autoParse('null'), null)
      chaiAssert.typeOf(autoParse('null'), 'null')
    })
    it('Null String to Null', function () {
      chaiAssert.equal(autoParse('Null'), null)
      chaiAssert.typeOf(autoParse('Null'), 'null')
    })
  })
  describe('parse as json', function () {
    it('{}', function () {
      chaiAssert.deepEqual(autoParse('{}'), {})
    })
    it('[]', function () {
      chaiAssert.deepEqual(autoParse('[]'), [])
    })
    it('["42"]', function () {
      chaiAssert.deepEqual(autoParse('["42"]'), [42])
    })
    it('{test:"{"name":"gps"}"}', function () {
      chaiAssert.deepEqual(autoParse({test:'{\\"name\\": \"greenpioneer\",\n \"company\": true,\n \\"customers\\": 1000}'}), { // eslint-disable-line
        test: {
          name: 'greenpioneer',
          company: true,
          customers: 1000
        }
      })
    })
    it('\\n', function () {
      chaiAssert.deepEqual(autoParse('{\\"name\\": \"greenpioneer\",\n \"company\": true,\n \\"customers\\": 1000}'), { // eslint-disable-line
        name: 'greenpioneer',
        company: true,
        customers: 1000
      })
    })
    it('\\"', function () {
      chaiAssert.deepEqual(autoParse('{\\"name\\": \"greenpioneer\",\"company\": true,\\"customers\\": 1000}'), { // eslint-disable-line
        name: 'greenpioneer',
        company: true,
        customers: 1000
      })
    })
    it('"{}"', function () {
      chaiAssert.deepEqual(autoParse('"{"name": "greenpioneer","company": true,"customers": 1000}"'), { // eslint-disable-line
        name: 'greenpioneer',
        company: true,
        customers: 1000
      })
    })
  })
  describe('handle NaNs', function () {
    it('NaN', function () {
      chaiAssert.deepEqual(autoParse(NaN), NaN)
    })
    it('NaN', function () {
      chaiAssert.deepEqual(autoParse('NaN'), NaN)
    })
  })
  describe('Convert Type', function () {
    it('to color', function () {
      chaiAssert.deepEqual(autoParse('#AAA', Color), {
        color: '#AAA'
      })
    })
    it('to Date', function () {
      chaiAssert.deepEqual(autoParse('1989-12-01', Date), new Date('1989-12-01'))
      chaiAssert.instanceOf(autoParse('1989-12-01', Date), Date)
      chaiAssert.deepEqual(autoParse('1989-12-01', 'date'), new Date('1989-12-01'))
      chaiAssert.instanceOf(autoParse('1989-12-01', 'date'), Date)
    })
    it('* to String', function () {
      const data = function () {
        return '9'
      }
      chaiAssert.equal(autoParse(1234, String), '1234')
      chaiAssert.equal(autoParse('1234', 'String'), '1234')
      chaiAssert.equal(autoParse(1234, 'String'), '1234')
      chaiAssert.equal(autoParse('true', 'String'), 'true')
      chaiAssert.equal(autoParse(true, 'String'), 'true')
      chaiAssert.equal(autoParse([], 'String'), '[]')
      chaiAssert.equal(autoParse({}, 'String'), '{}')
      chaiAssert.equal(autoParse(data, 'String'), 'function () {\n        return \'9\';\n      }')
    })
    it('function to function', function () {
      const data = function () {
        return '9'
      }
      chaiAssert.equal(autoParse(data, 'function'), data)
    })
    it('* to object', function () {
      const data = {
        name: 'jason',
        age: '50',
        admin: 'true',
        parents: [
          {
            name: 'Alice',
            age: '75',
            dead: 'false'
          },
          {
            name: 'Bob',
            age: '80',
            dead: 'true'
          }
        ],
        grade: ['80', '90', '100']
      }
      chaiAssert.equal(autoParse(data, 'object').name, 'jason')
      chaiAssert.equal(autoParse(data, Object).name, 'jason')
      chaiAssert.typeOf(autoParse(data, 'object').name, 'string')
      chaiAssert.equal(autoParse(data, 'object').age, 50)
      chaiAssert.typeOf(autoParse(data, 'object').age, 'number')
      chaiAssert.equal(autoParse(data, 'object').admin, true)
      chaiAssert.typeOf(autoParse(data, 'object').admin, 'boolean')
      chaiAssert.equal(autoParse(data, 'object').grade[0], 80)
      chaiAssert.typeOf(autoParse(data, 'object').grade[0], 'number')
      chaiAssert.equal(autoParse(data, 'object').grade[1], 90)
      chaiAssert.typeOf(autoParse(data, 'object').grade[1], 'number')
      chaiAssert.equal(autoParse(data, 'object').grade[2], 100)
      chaiAssert.typeOf(autoParse(data, 'object').grade[2], 'number')
      chaiAssert.equal(autoParse(data, 'object').parents[0].name, 'Alice')
      chaiAssert.equal(autoParse(data, 'object').parents[0].age, 75)
      chaiAssert.deepEqual(autoParse('{}', 'object'), {})
      chaiAssert.deepEqual(autoParse('[]', 'object'), [])
      chaiAssert.deepEqual(autoParse('["42"]', 'object'), [42])
    })
    it('* to boolean', function () {
      chaiAssert.equal(autoParse(1, Boolean), true)
      chaiAssert.equal(autoParse(1, 'Boolean'), true)
      chaiAssert.equal(autoParse(0, 'Boolean'), false)
      chaiAssert.equal(autoParse('1', 'Boolean'), true)
      chaiAssert.equal(autoParse('0', 'Boolean'), false)
      chaiAssert.equal(autoParse('TrUe', 'Boolean'), true)
      chaiAssert.equal(autoParse('False', 'Boolean'), false)
      chaiAssert.equal(autoParse(true, 'Boolean'), true)
      chaiAssert.equal(autoParse(false, 'Boolean'), false)
      chaiAssert.equal(autoParse('foo', 'Boolean'), false)
    })
    it('* to number', function () {
      chaiAssert.equal(autoParse(1, 'Number'), 1)
      chaiAssert.equal(autoParse(0, 'Number'), 0)
      chaiAssert.equal(autoParse(0, Number), 0)
      chaiAssert.equal(autoParse('1', Number), 1)
      chaiAssert.equal(autoParse('1', 'Number'), 1)
      chaiAssert.equal(autoParse('0', 'Number'), 0)
      chaiAssert.equal(autoParse('0o123', 'Number'), 83)
      chaiAssert.equal(autoParse('0b10', 'Number'), 2)
      chaiAssert.equal(autoParse('0xFF', 'Number'), 255)
      chaiAssert.equal(autoParse('7e3', 'Number'), 7000)
      chaiAssert.equal(autoParse('.42', 'Number'), 0.42)
    })
    it('* to undefined', function () {
      chaiAssert.equal(autoParse(1, 'Undefined'), undefined)
      chaiAssert.equal(autoParse(0, 'Undefined'), undefined)
      chaiAssert.equal(autoParse('1', 'Undefined'), undefined)
      chaiAssert.equal(autoParse('0', 'Undefined'), undefined)
    })
    it('* to null', function () {
      chaiAssert.equal(autoParse(1, 'Null'), null)
      chaiAssert.equal(autoParse(0, 'Null'), null)
      chaiAssert.equal(autoParse('1', 'Null'), null)
      chaiAssert.equal(autoParse('0', 'Null'), null)
    })
    it('same type to same type', function () {
      chaiAssert.deepEqual(autoParse([42], Array), [42])
      chaiAssert.deepEqual(autoParse({ name: 'greenpioneer' }, Object), { name: 'greenpioneer' })
      chaiAssert.equal(autoParse(true, Boolean), true)
      chaiAssert.equal(autoParse('test', String), 'test')
      chaiAssert.equal(autoParse(1234, Number), 1234)
    })
  })
})
