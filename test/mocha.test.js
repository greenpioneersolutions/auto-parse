var autoParse = require('../index.js')

var assert = require('chai').assert
describe('Auto Parse', function () {
  describe('Strings', function () {
    it('Green Pioneer', function (done) {
      assert.equal(autoParse('Green Pioneer'), 'Green Pioneer')
      assert.typeOf(autoParse('Green Pioneer'), 'string')
      done()
    })
    it('Green Pioneer Solutions', function (done) {
      assert.equal(autoParse('Green Pioneer Solutions'), 'Green Pioneer Solutions')
      assert.typeOf(autoParse('Green Pioneer Solutions'), 'string')
      done()
    })
    it('True or False', function (done) {
      assert.equal(autoParse('True or False'), 'True or False')
      assert.typeOf(autoParse('True or False'), 'string')
      done()
    })
    it('123 Numbers', function (done) {
      assert.equal(autoParse('123 Numbers'), '123 Numbers')
      assert.typeOf(autoParse('123 Numbers'), 'string')
      done()
    })
    it('$group', function (done) {
      assert.equal(autoParse('$group'), '$group')
      assert.typeOf(autoParse('$group'), 'string')
      done()
    })
    it('a11y', function (done) {
      assert.equal(autoParse('a11y'), 'a11y')
      assert.typeOf(autoParse('a11y'), 'string')
      done()
    })
    it('$group:test', function (done) {
      assert.equal(autoParse('$group:test'), '$group:test')
      assert.typeOf(autoParse('$group:test'), 'string')
      done()
    })
    it('got a question?', function (done) {
      assert.equal(autoParse('got a question?'), 'got a question?')
      assert.typeOf(autoParse('got a question?'), 'string')
      done()
    })
  })
  describe('Number', function () {
    it('26 String to Number', function (done) {
      assert.equal(autoParse('26'), 26)
      assert.typeOf(autoParse('26'), 'number')
      done()
    })
    it('1 String to Number', function (done) {
      assert.equal(autoParse('1'), 1)
      assert.typeOf(autoParse('1'), 'number')
      done()
    })
    it('0 String to Number', function (done) {
      assert.equal(autoParse('0'), 0)
      assert.typeOf(autoParse('0'), 'number')
      done()
    })
    it('26 Number to Number', function (done) {
      assert.equal(autoParse(26), 26)
      assert.typeOf(autoParse(26), 'number')
      done()
    })
    it('1 Number to Number', function (done) {
      assert.equal(autoParse(1), 1)
      assert.typeOf(autoParse(1), 'number')
      done()
    })
    it('0 Number to Number', function (done) {
      assert.equal(autoParse(0), 0)
      assert.typeOf(autoParse(0), 'number')
      done()
    })
  })
  describe('Boolean', function () {
    it('true Boolean to Boolean', function (done) {
      assert.equal(autoParse(true), true)
      assert.typeOf(autoParse(true), 'boolean')
      done()
    })
    it('false Boolean to Boolean', function (done) {
      assert.equal(autoParse(false), false)
      assert.typeOf(autoParse(false), 'boolean')
      done()
    })
    it('true String to Boolean', function (done) {
      assert.equal(autoParse('true'), true)
      assert.typeOf(autoParse('true'), 'boolean')
      done()
    })
    it('false String to Boolean', function (done) {
      assert.equal(autoParse('false'), false)
      assert.typeOf(autoParse('false'), 'boolean')
      done()
    })
    it('True String to Boolean', function (done) {
      assert.equal(autoParse('True'), true)
      assert.typeOf(autoParse('True'), 'boolean')
      done()
    })
    it('TrUe Stringt o Boolean', function (done) {
      assert.equal(autoParse('TrUe'), true)
      assert.typeOf(autoParse('TrUe'), 'boolean')
      done()
    })
  })
  describe('Array', function () {
    it('["80", 92, "23", "TruE",false]', function (done) {
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
      done()
    })
  })
  describe('Object', function () {
    it('{name: "jason",age: "50",admin: "true",grade:["80", "90", "100"]}', function (done) {
      var data = {
        name: 'jason',
        age: '50',
        admin: 'true',
        grade: ['80', '90', '100']
      }
      assert.equal(autoParse(data)['name'], 'jason')
      assert.typeOf(autoParse(data)['name'], 'string')
      assert.equal(autoParse(data)['age'], 50)
      assert.typeOf(autoParse(data)['age'], 'number')
      assert.equal(autoParse(data)['admin'], true)
      assert.typeOf(autoParse(data)['admin'], 'boolean')
      assert.equal(autoParse(data)['grade'][0], 80)
      assert.typeOf(autoParse(data)['grade'][0], 'number')
      assert.equal(autoParse(data)['grade'][1], 90)
      assert.typeOf(autoParse(data)['grade'][1], 'number')
      assert.equal(autoParse(data)['grade'][2], 100)
      assert.typeOf(autoParse(data)['grade'][2], 'number')
      done()
    })
  })
  describe('Function', function () {
    it('return "9" to 9', function (done) {
      var data = function () {
        return '9'
      }
      assert.equal(autoParse(data), 9)
      assert.typeOf(autoParse(data), 'number')
      done()
    })
    it('return "jason" to "jason"', function (done) {
      var data = function () {
        return 'jason'
      }
      assert.equal(autoParse(data), 'jason')
      assert.typeOf(autoParse(data), 'string')
      done()
    })
    it('return "true" to true', function (done) {
      var data = function () {
        return 'true'
      }
      assert.equal(autoParse(data), true)
      assert.typeOf(autoParse(data), 'boolean')
      done()
    })
  })
  describe('Undefined', function () {
    it('undefined to undefined', function (done) {
      assert.equal(autoParse(undefined), undefined)
      assert.typeOf(autoParse(undefined), 'undefined')
      done()
    })
    it('Undefined String to Undefined', function (done) {
      assert.equal(autoParse('Undefined'), undefined)
      assert.typeOf(autoParse('Undefined'), 'undefined')
      done()
    })
    it('  "" ', function (done) {
      assert.equal(autoParse(''), undefined)
      assert.typeOf(autoParse(''), 'undefined')
      done()
    })
  })
  describe('Null', function () {
    it('null to Null', function (done) {
      assert.equal(autoParse('null'), null)
      assert.typeOf(autoParse('null'), 'null')
      done()
    })
    it('Null String to Null', function (done) {
      assert.equal(autoParse('Null'), null)
      assert.typeOf(autoParse('Null'), 'null')
      done()
    })
  })
})
