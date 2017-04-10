module.exports = parse

var _ = require('lodash')
var typpy = require('typpy')

function stripTrimLower (value) {
  return _.replace(_.trim(_.toLower(value)), /[""'']/ig, '')
}

// function isBoolean (value) {
//   return !(checkBoolean(value) === null)
// }

function toBoolean (value) {
  return checkBoolean(value) || false
}

function checkBoolean (value) {
  if (!value) {
    return false
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return !!value
  }

  value = stripTrimLower(value)
  if (value === 'true' || value === '1') return true
  if (value === 'false' || value === '0') return false

  return null
}

function parseObject (value) {
  if (typpy(value, Array)) {
    return _.map(value, function (n, key) {
      return parse(n)
    })
  } else if (typpy(value, Object)) {
    return _.forIn(value, function (n, key) {
      value[key] = parse(n)
    })
  }

  return {}
}

function parseFunction (value) {
  return parse(value())
}

function parseType (value, type) {
  // Currently they send a string - handle String or Number or Boolean?
  if ((value && value.constructor === type) || typpy(value, type)) {
    return value
  }

  var typeName = type
  // Convert the constructor into a string
  if (type && type.name) {
    typeName = type.name.toLowerCase()
  }

  typeName = stripTrimLower(typeName)
  switch (typeName) {
    case 'string':
      if (typeof value === 'object') return JSON.stringify(value)
      return _.toString(value)

    case 'function':
      if (typpy(value, Function)) {
        return value
      }

      return function (cb) {
        if (typeof cb === 'function') {
          cb(value)
        }
        return value
      }

    case 'date':
      return new Date(value)

    case 'object':
      var jsonParsed
      try {
        jsonParsed = JSON.parse(value)
      } catch (e) {}

      if (typpy(jsonParsed, Object) || typpy(jsonParsed, Array)) {
        return parse(jsonParsed)
      } else if (!typpy(jsonParsed, 'undefined')) {
        return {}
      }

      return parseObject(value)

    case 'boolean':
      return toBoolean(value)

    case 'number':
      return _.toNumber(value)

    case 'undefined':
      return undefined

    case 'null':
      return null

    case 'array':
      return [value]

    default:
      if (typeof type === 'function') {
        return new type(value) // eslint-disable-line
      }
      throw new Error('Unsupported type.')
  }
}

function parse (value, type) {
  if (type) {
    return parseType(value, type)
  }

  var orignalValue = value

  // PRE RULE - check for null be cause null can be typeof object which can  through off parsing
  if (value === null) {
    return null
  }

  // TYPEOF SECTION - Use to check and do specific things based off of know the type
  // Check against undefined
  if (value === void 0) {
    return undefined
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'function') {
    return parseFunction(value)
  }

  if (typeof value === 'object') {
    return parseObject(value)
  }

  // STRING SECTION - If we made it this far that means it is a string that we must do something with to parse
  if (value === 'NaN') {
    return NaN
  }

  var jsonParsed = null
  try {
    jsonParsed = JSON.parse(value)
  } catch (e) {}

  if (jsonParsed && typeof jsonParsed === 'object') {
    return parse(jsonParsed)
  }

  value = stripTrimLower(value)

  if (value === 'undefined' || value === '') {
    return undefined
  }

  if (value === 'null') {
    return null
  }

  // Order Matter because if it is a one or zero boolean will come back with a awnser too. if you want it to be a boolean you must specify
  var num = _.toNumber(value)
  if (typpy(num, Number)) {
    return num
  }

  var boo = checkBoolean(value)
  if (typpy(boo, Boolean)) {
    return boo
  }

  // DEFUALT SECTION - bascially if we catch nothing we assume that you just have a string
  var string = _.toString(orignalValue)
  return string
}
