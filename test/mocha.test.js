var autoParse = require('../index.js')

function Color (inputColor) {
  this.color = inputColor
}

var assert = require('chai').assert
describe('Auto Parse', function () {
  describe('Strings', function () {
    it('Green Pioneer', function () {
      assert.equal(autoParse('Green Pioneer'), 'Green Pioneer')
      assert.typeOf(autoParse('Green Pioneer'), 'string')
    })
    it('Green Pioneer Solutions', function () {
      assert.equal(autoParse('Green Pioneer Solutions'), 'Green Pioneer Solutions')
      assert.typeOf(autoParse('Green Pioneer Solutions'), 'string')
    })
    it('True or False', function () {
      assert.equal(autoParse('True or False'), 'True or False')
      assert.typeOf(autoParse('True or False'), 'string')
    })
    it('123 Numbers', function () {
      assert.equal(autoParse('123 Numbers'), '123 Numbers')
      assert.typeOf(autoParse('123 Numbers'), 'string')
    })
    it('$group', function () {
      assert.equal(autoParse('$group'), '$group')
      assert.typeOf(autoParse('$group'), 'string')
    })
    it('a11y', function () {
      assert.equal(autoParse('a11y'), 'a11y')
      assert.typeOf(autoParse('a11y'), 'string')
    })
    it('$group:test', function () {
      assert.equal(autoParse('$group:test'), '$group:test')
      assert.typeOf(autoParse('$group:test'), 'string')
    })
    it('got a question?', function () {
      assert.equal(autoParse('got a question?'), 'got a question?')
      assert.typeOf(autoParse('got a question?'), 'string')
    })
  })
  describe('Number', function () {
    it('hexadecimals String to Number', function () {
      assert.equal(autoParse('0xFF'), 255)
    })
    it('dots String to Number', function () {
      assert.equal(autoParse('.42'), 0.42)
    })
    it('octals String to Number', function () {
      assert.equal(autoParse('0o123'), 83)
    })
    it('binary number String to Number', function () {
      assert.equal(autoParse('0b1101'), 13)
    })
    it('Exponent String to Number', function () {
      assert.equal(autoParse('7e3'), 7000)
    })
    it('26 String to Number', function () {
      assert.equal(autoParse('26'), 26)
      assert.typeOf(autoParse('26'), 'number')
    })
    it('1 String to Number', function () {
      assert.equal(autoParse('1'), 1)
      assert.typeOf(autoParse('1'), 'number')
    })
    it('0 String to Number', function () {
      assert.equal(autoParse('0'), 0)
      assert.typeOf(autoParse('0'), 'number')
    })
    it('26 Number to Number', function () {
      assert.equal(autoParse(26), 26)
      assert.typeOf(autoParse(26), 'number')
    })
    it('1 Number to Number', function () {
      assert.equal(autoParse(1), 1)
      assert.typeOf(autoParse(1), 'number')
    })
    it('0 Number to Number', function () {
      assert.equal(autoParse(0), 0)
      assert.typeOf(autoParse(0), 'number')
    })
  })
  describe('Boolean', function () {
    it('true Boolean to Boolean', function () {
      assert.equal(autoParse(true), true)
      assert.typeOf(autoParse(true), 'boolean')
    })
    it('false Boolean to Boolean', function () {
      assert.equal(autoParse(false), false)
      assert.typeOf(autoParse(false), 'boolean')
    })
    it('true String to Boolean', function () {
      assert.equal(autoParse('true'), true)
      assert.typeOf(autoParse('true'), 'boolean')
    })
    it('false String to Boolean', function () {
      assert.equal(autoParse('false'), false)
      assert.typeOf(autoParse('false'), 'boolean')
    })
    it('True String to Boolean', function () {
      assert.equal(autoParse('True'), true)
      assert.typeOf(autoParse('True'), 'boolean')
    })
    it('TrUe String o Boolean', function () {
      assert.equal(autoParse('TrUe'), true)
      assert.typeOf(autoParse('TrUe'), 'boolean')
    })
  })
  describe('Array', function () {
    it('["80", 92, "23", "TruE",false]', function () {
      var data = ['80', 92, '23', 'TruE', false]
      assert.equal(autoParse(data)[0], 80)
      assert.typeOf(autoParse(data)[0], 'number')
      assert.equal(autoParse(data)[1], 92)
      assert.typeOf(autoParse(data)[1], 'number')
      assert.equal(autoParse(data)[2], 23)
      assert.typeOf(autoParse(data)[2], 'number')
      assert.equal(autoParse(data)[3], true)
      assert.typeOf(autoParse(data)[3], 'boolean')
      assert.equal(autoParse(data)[4], false)
      assert.typeOf(autoParse(data)[4], 'boolean')
    })
  })
  describe('Object', function () {
    var data = {
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
      assert.equal(autoParse(data).name, 'jason')
      assert.typeOf(autoParse(data).name, 'string')
      assert.equal(autoParse(data).age, 50)
      assert.typeOf(autoParse(data).age, 'number')
      assert.equal(autoParse(data).admin, true)
      assert.typeOf(autoParse(data).admin, 'boolean')
      assert.equal(autoParse(data).grade[0], 80)
      assert.typeOf(autoParse(data).grade[0], 'number')
      assert.equal(autoParse(data).grade[1], 90)
      assert.typeOf(autoParse(data).grade[1], 'number')
      assert.equal(autoParse(data).grade[2], 100)
      assert.typeOf(autoParse(data).grade[2], 'number')
      assert.typeOf(autoParse(data).grade[2], 'number')
      assert.equal(autoParse(data).parents[0].name, 'Alice')
      assert.equal(autoParse(data).parents[0].age, 75)
    })
  })
  describe('Function', function () {
    it('return "9" to 9', function () {
      var data = function () {
        return '9'
      }
      assert.equal(autoParse(data), 9)
      assert.typeOf(autoParse(data), 'number')
    })
    it('return "jason" to "jason"', function () {
      var data = function () {
        return 'jason'
      }
      assert.equal(autoParse(data), 'jason')
      assert.typeOf(autoParse(data), 'string')
    })
    it('return "true" to true', function () {
      var data = function () {
        return 'true'
      }
      assert.equal(autoParse(data), true)
      assert.typeOf(autoParse(data), 'boolean')
    })
  })
  describe('Undefined', function () {
    it('undefined to undefined', function () {
      assert.equal(autoParse(undefined), undefined)
      assert.typeOf(autoParse(undefined), 'undefined')
    })
    it('Undefined String to Undefined', function () {
      assert.equal(autoParse('Undefined'), undefined)
      assert.typeOf(autoParse('Undefined'), 'undefined')
    })
    it('  "" ', function () {
      assert.equal(autoParse(''), undefined)
      assert.typeOf(autoParse(''), 'undefined')
    })
  })
  describe('Null', function () {
    it('null to Null', function () {
      assert.equal(autoParse('null'), null)
      assert.typeOf(autoParse('null'), 'null')
    })
    it('Null String to Null', function () {
      assert.equal(autoParse('Null'), null)
      assert.typeOf(autoParse('Null'), 'null')
    })
  })
  describe('parse as json', function () {
    it('{}', function () {
      assert.deepEqual(autoParse('{}'), {})
    })
    it('[]', function () {
      assert.deepEqual(autoParse('[]'), [])
    })
    it('["42"]', function () {
      assert.deepEqual(autoParse('["42"]'), [42])
    })
  })
  describe('handle NaNs', function () {
    it('NaN', function () {
      assert.deepEqual(autoParse(NaN), NaN)
    })
    it('NaN', function () {
      assert.deepEqual(autoParse('NaN'), NaN)
    })
  })
  describe('Convert Type', function () {
    it('to color', function () {
      assert.deepEqual(autoParse('#AAA', Color), {
        color: '#AAA'
      })
    })
    it('to Date', function () {
      assert.deepEqual(autoParse('1989-12-01', Date), new Date('1989-12-01'))
      assert.deepEqual(autoParse('1989-12-01', 'date'), new Date('1989-12-01'))
    })
    it('* to String', function () {
      var data = function () {
        return '9'
      }
      assert.equal(autoParse(1234, String), '1234')
      assert.equal(autoParse('1234', 'String'), '1234')
      assert.equal(autoParse(1234, 'String'), '1234')
      assert.equal(autoParse('true', 'String'), 'true')
      assert.equal(autoParse(true, 'String'), 'true')
      assert.equal(autoParse([], 'String'), '[]')
      assert.equal(autoParse({}, 'String'), '{}')
      assert.equal(autoParse(data, 'String'), "function () {\n        return '9'\n      }")
    })
    it('function to function', function () {
      var data = function () {
        return '9'
      }
      assert.equal(autoParse(data, 'function'), data)
    })
    it('* to object', function () {
      var data = {
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
        assert.equal(autoParse(data, 'object').name, 'jason')
        assert.equal(autoParse(data, Object).name, 'jason')
        assert.typeOf(autoParse(data, 'object').name, 'string')
        assert.equal(autoParse(data, 'object').age, 50)
        assert.typeOf(autoParse(data, 'object').age, 'number')
        assert.equal(autoParse(data, 'object').admin, true)
        assert.typeOf(autoParse(data, 'object').admin, 'boolean')
        assert.equal(autoParse(data, 'object').grade[0], 80)
        assert.typeOf(autoParse(data, 'object').grade[0], 'number')
        assert.equal(autoParse(data, 'object').grade[1], 90)
        assert.typeOf(autoParse(data, 'object').grade[1], 'number')
        assert.equal(autoParse(data, 'object').grade[2], 100)
        assert.typeOf(autoParse(data, 'object').grade[2], 'number')
        assert.typeOf(autoParse(data, 'object').grade[2], 'number')
        assert.equal(autoParse(data, 'object').parents[0].name, 'Alice')
        assert.equal(autoParse(data, 'object').parents[0].age, 75)
      })
      it('{}', function () {
        assert.deepEqual(autoParse('{}', 'object'), {})
      })
      it('[]', function () {
        assert.deepEqual(autoParse('[]', 'object'), [])
      })
      it('["42"]', function () {
        assert.deepEqual(autoParse('["42"]', 'object'), [42])
      })
    })
    it('* to boolean', function () {
      assert.equal(autoParse(1, Boolean), true)
      assert.equal(autoParse(1, 'Boolean'), true)
      assert.equal(autoParse(0, 'Boolean'), false)
      assert.equal(autoParse('1', 'Boolean'), true)
      assert.equal(autoParse('0', 'Boolean'), false)
      assert.equal(autoParse('TrUe', 'Boolean'), true)
      assert.equal(autoParse('False', 'Boolean'), false)
      assert.equal(autoParse(true, 'Boolean'), true)
      assert.equal(autoParse(false, 'Boolean'), false)
      assert.equal(autoParse('foo', 'Boolean'), false)
    })
    it('* to number', function () {
      assert.equal(autoParse(1, 'Number'), 1)
      assert.equal(autoParse(0, 'Number'), 0)
      assert.equal(autoParse(0, Number), 0)
      assert.equal(autoParse('1', Number), 1)
      assert.equal(autoParse('1', 'Number'), 1)
      assert.equal(autoParse('0', 'Number'), 0)
      assert.equal(autoParse('0o123', 'Number'), 83)
      assert.equal(autoParse('0b10', 'Number'), 2)
      assert.equal(autoParse('0xFF', 'Number'), 255)
      assert.equal(autoParse('7e3', 'Number'), 7000)
      assert.equal(autoParse('.42', 'Number'), 0.42)
    })
    it('* to undefined', function () {
      assert.equal(autoParse(1, 'Undefined'), undefined)
      assert.equal(autoParse(0, 'Undefined'), undefined)
      assert.equal(autoParse('1', 'Undefined'), undefined)
      assert.equal(autoParse('0', 'Undefined'), undefined)
    })
    it('* to null', function () {
      assert.equal(autoParse(1, 'Null'), null)
      assert.equal(autoParse(0, 'Null'), null)
      assert.equal(autoParse('1', 'Null'), null)
      assert.equal(autoParse('0', 'Null'), null)
    })
    it('same type to same type', function () {
      assert.deepEqual(autoParse([42], Array), [42])
      assert.deepEqual(autoParse({name: 'greenpioneer'}, Object), {name: 'greenpioneer'})
      assert.equal(autoParse(true, Boolean), true)
      assert.equal(autoParse('test', String), 'test')
      assert.equal(autoParse(1234, Number), 1234)
    })
  })
})
