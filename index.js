module.exports = autoParse

var typpy = require('typpy')

/**
 *
 * @name stripTrimLower
 * @function
 * @param {Value} value strip trim & lower case the string
 * @return {Value} parsed string
 *
 */
function stripTrimLower (value) {
  return value.replace(/[""'']/ig, '').trim().toLowerCase()
}
/**
 *
 * @name toBoolean
 * @function
 * @param {Value} value parse to boolean
 * @return {Boolean} parsed boolean
 *
 */
function toBoolean (value) {
  return checkBoolean(value) || false
}
/**
 *
 * @name checkBoolean
 * @function
 * @param {Value} value is any value
 * @return {Boolean} is a boolean value
 *
 */
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
/**
 *
 * @name parseObject
 * @function
 * @param {Value} value parse object
 * @return {Value} parsed object
 *
 */
function parseObject (value) {
  if (typpy(value, Array)) {
    return value.map(function (n, key) {
      return autoParse(n)
    })
  } else if (typpy(value, Object) || value.constructor === undefined) {
    for (var n in value) {
      value[n] = autoParse(value[n])
    }
    return value
  }
  return {}
}
/**
 *
 * @name parseFunction
 * @function
 * @param {Value} value function
 * @return {Value} returned value from the called value function
 *
 */
function parseFunction (value) {
  return autoParse(value())
}
/**
 *
 * @name parseType
 * @function
 * @param {Value} value inputed value
 * @param {Type} type  inputed type
 * @return {Value} parsed type
 *
 */
function parseType (value, type) {
  /**
   *  Currently they send a string - handle String or Number or Boolean?
   */
  if ((value && value.constructor === type) || typpy(value, type)) {
    return value
  }
  var typeName = type
  /**
   * Convert the constructor into a string
   */
  if (type && type.name) {
    typeName = type.name.toLowerCase()
  }

  typeName = stripTrimLower(typeName)
  switch (typeName) {
    case 'string':
      if (typeof value === 'object') return JSON.stringify(value)
      return String(value)
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
        return autoParse(jsonParsed)
      } else if (!typpy(jsonParsed, 'undefined')) {
        return {}
      }
      return parseObject(value)
    case 'boolean':
      return toBoolean(value)
    case 'number':
      return Number(value)
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
/**
 * autoParse
 * auto-parse any value you happen to send in
 * (String, Number, Boolean, Array, Object, Function, undefined and null).
 * You send it we will try to find a way to parse it.
 * We now support sending in a string of what type
 * (e.g. "boolean") or constructor (e.g. Boolean)
 *
 * Usage:
 *
 * ```js
 * autoParse({}) // => "object"
 * autoParse('42'); // => 42
 * autoParse.get('[]'); // => []
 * ```
 *
 * @name autoParse
 * @function
 * @param {Value} input The input value.
 * @param {Constructor|String} target The target type.
 * @return {String|Function|Date|Object|Boolean|Number|Undefined|Null|Array}
 */
function autoParse (value, type) {
  if (type) {
    return parseType(value, type)
  }
  var orignalValue = value
  /**
   *  PRE RULE - check for null be cause null can be typeof object which can  through off parsing
   */
  if (value === null) {
    return null
  }
  /**
   * TYPEOF SECTION - Use to check and do specific things based off of know the type
   * Check against undefined
   */
  if (value === void 0) {
    return undefined
  }
  if (value instanceof Date || value instanceof RegExp) {
    return value
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
  /**
   * STRING SECTION - If we made it this far that means it is a string that we must do something with to parse
   */
  if (value === 'NaN') {
    return NaN
  }
  var jsonParsed = null
  try {
    jsonParsed = JSON.parse(value)
  } catch (e) {
    try {
      jsonParsed = JSON.parse(
        value.trim().replace(/(\\\\")|(\\")/gi, '"').replace(/(\\n|\\\\n)/gi, '').replace(/(^"|"$)|(^'|'$)/gi, '')
      )
    } catch (e) {
      try {
        jsonParsed = JSON.parse(
          value.trim().replace(/'/gi, '"')
        )
      } catch (e) {}
    }
  }
  if (jsonParsed && typeof jsonParsed === 'object') {
    return autoParse(jsonParsed)
  }
  value = stripTrimLower(value)
  if (value === 'undefined' || value === '') {
    return undefined
  }
  if (value === 'null') {
    return null
  }
  /**
   * Order Matter because if it is a one or zero boolean will come back with a awnser too. if you want it to be a boolean you must specify
   */
  var num = Number(value)
  if (typpy(num, Number)) {
    return num
  }
  var boo = checkBoolean(value)
  if (typpy(boo, Boolean)) {
    return boo
  }
  /**
   * DEFAULT SECTION - bascially if we catch nothing we assume that you just have a string
   */
  // if string - convert to ""
  return String(orignalValue)
}
