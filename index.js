module.exports = autoParse

const plugins = []

function isType (value, type) {
  if (typeof type === 'string') {
    if (type.toLowerCase() === 'array') return Array.isArray(value)
    if (type.toLowerCase() === 'null') return value === null
    if (type.toLowerCase() === 'undefined') return value === undefined
    // eslint-disable-next-line valid-typeof
    return typeof value === type.toLowerCase()
  }
  if (type === Array) return Array.isArray(value)
  if (type === Number) return typeof value === 'number' && !Number.isNaN(value)
  if (type === String) return typeof value === 'string'
  if (type === Boolean) return typeof value === 'boolean'
  if (type === Object) return typeof value === 'object' && value !== null && !Array.isArray(value)
  if (type === null) return value === null
  return value instanceof type
}

function runPlugins (value, type, options) {
  for (let i = 0; i < plugins.length; i++) {
    const res = plugins[i](value, type, options)
    if (res !== undefined) return res
  }
  return undefined
}

function getTypeName (value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (value instanceof Date) return 'date'
  if (value instanceof RegExp) return 'regexp'
  // eslint-disable-next-line valid-typeof
  if (typeof value === 'bigint') return 'bigint'
  // eslint-disable-next-line valid-typeof
  if (typeof value === 'symbol') return 'symbol'
  return typeof value
}

function returnIfAllowed (val, options, fallback) {
  if (options && Array.isArray(options.allowedTypes)) {
    const type = getTypeName(val)
    if (!options.allowedTypes.includes(type)) {
      return fallback
    }
  }
  return val
}

autoParse.use = function (fn) {
  if (typeof fn === 'function') plugins.push(fn)
}

/**
 *
 * @name stripTrimLower
 * @function
 * @param {Value} value strip trim & lower case the string
 * @return {Value} parsed string
 *
 */
const _stripCache = new Map()
const QUOTE_RE = /['"]/g
function getStripRegex (chars) {
  let re = _stripCache.get(chars)
  if (!re) {
    const escaped = chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    re = new RegExp('^[' + escaped + ']+')
    _stripCache.set(chars, re)
  }
  return re
}

function stripTrimLower (value, options = {}) {
  if (options.stripStartChars && typeof value === 'string') {
    const chars = Array.isArray(options.stripStartChars)
      ? options.stripStartChars.join('')
      : String(options.stripStartChars)
    value = value.replace(getStripRegex(chars), '')
  }
  return value.replace(QUOTE_RE, '').trim().toLowerCase()
}
/**
 *
 * @name toBoolean
 * @function
 * @param {Value} value parse to boolean
 * @return {Boolean} parsed boolean
 *
 */
function toBoolean (value, options) {
  return checkBoolean(value, options) || false
}
/**
 *
 * @name checkBoolean
 * @function
 * @param {Value} value is any value
 * @return {Boolean} is a boolean value
 *
 */
function checkBoolean (value, options) {
  if (!value) {
    return false
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return !!value
  }
  value = stripTrimLower(value, options)
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
function parseObject (value, options) {
  if (Array.isArray(value)) {
    return value.map(function (n, key) {
      return autoParse(n, undefined, options)
    })
  } else if (typeof value === 'object' || value.constructor === undefined) {
    for (const n in value) {
      value[n] = autoParse(value[n], undefined, options)
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
function parseFunction (value, options) {
  return autoParse(value(), undefined, options)
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
function parseType (value, type, options = {}) {
  let typeName = type
  /**
   *  Currently they send a string - handle String or Number or Boolean?
   */
  if ((value && value.constructor === type) || (isType(value, type) && typeName !== 'object' && typeName !== 'array')) {
    return value
  }
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
      if (isType(value, Function)) {
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
      let jsonParsed
      if (typeof value === 'string' && /^['"]?[[{]/.test(value.trim())) {
        try {
          jsonParsed = JSON.parse(value)
        } catch (e) {}
      }
      if (isType(jsonParsed, Object) || isType(jsonParsed, Array)) {
        return autoParse(jsonParsed, undefined, options)
      } else if (!isType(jsonParsed, 'undefined')) {
        return {}
      }
      return parseObject(value, options)
    case 'boolean':
      return toBoolean(value, options)
    case 'number':
      if (options.parseCommaNumbers && typeof value === 'string') {
        const normalized = value.replace(/,/g, '')
        if (!Number.isNaN(Number(normalized))) return Number(normalized)
      }
      return Number(value)
    case 'bigint':
      return BigInt(value)
    case 'symbol':
      return Symbol(value)
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
function autoParse (value, type, options = {}) {
  const pluginVal = runPlugins(value, type, options)
  if (pluginVal !== undefined) {
    return returnIfAllowed(pluginVal, options, value)
  }
  if (type) {
    return returnIfAllowed(parseType(value, type, options), options, value)
  }
  const originalValue = value
  if (typeof value === 'string' && options.stripStartChars) {
    const chars = Array.isArray(options.stripStartChars)
      ? options.stripStartChars.join('')
      : String(options.stripStartChars)
    value = value.replace(getStripRegex(chars), '')
  }
  /**
   *  PRE RULE - check for null be cause null can be typeof object which can  through off parsing
   */
  if (value === null) {
    return returnIfAllowed(null, options, originalValue)
  }
  /**
   * TYPEOF SECTION - Use to check and do specific things based off of know the type
   * Check against undefined
   */
  if (value === void 0) {
    return returnIfAllowed(undefined, options, originalValue)
  }
  if (value instanceof Date || value instanceof RegExp) {
    return returnIfAllowed(value, options, originalValue)
  }
  // eslint-disable-next-line valid-typeof
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint' || typeof value === 'symbol') {
    return returnIfAllowed(value, options, originalValue)
  }
  if (typeof value === 'function') {
    return returnIfAllowed(parseFunction(value, options), options, originalValue)
  }
  if (typeof value === 'object') {
    return returnIfAllowed(parseObject(value, options), options, originalValue)
  }
  /**
   * STRING SECTION - If we made it this far that means it is a string that we must do something with to parse
   */
  if (value === 'NaN') {
    return returnIfAllowed(NaN, options, originalValue)
  }
  let jsonParsed = null
  const trimmed = typeof value === 'string' ? value.trim() : ''
  if (/^['"]?[[{]/.test(trimmed)) {
    try {
      jsonParsed = JSON.parse(trimmed)
    } catch (e) {
      try {
        jsonParsed = JSON.parse(
          trimmed.replace(/(\\\\")|(\\")/gi, '"').replace(/(\\n|\\\\n)/gi, '').replace(/(^"|"$)|(^'|'$)/gi, '')
        )
      } catch (e) {
        try {
          jsonParsed = JSON.parse(trimmed.replace(/'/gi, '"'))
        } catch (e) {}
      }
    }
  }
  if (jsonParsed && typeof jsonParsed === 'object') {
    return returnIfAllowed(autoParse(jsonParsed, undefined, options), options, originalValue)
  }
  value = stripTrimLower(trimmed, Object.assign({}, options, { stripStartChars: false }))
  if (value === 'undefined' || value === '') {
    return returnIfAllowed(undefined, options, originalValue)
  }
  if (value === 'null') {
    return returnIfAllowed(null, options, originalValue)
  }
  /**
   * Order Matter because if it is a one or zero boolean will come back with a awnser too. if you want it to be a boolean you must specify
   */
  let numValue = value
  if (options.parseCommaNumbers && typeof numValue === 'string' && numValue.includes(',')) {
    const normalized = numValue.replace(/,/g, '')
    if (!Number.isNaN(Number(normalized))) {
      numValue = normalized
    }
  }
  const num = Number(numValue)
  if (!Number.isNaN(num)) {
    if (options.preserveLeadingZeros && /^0+\d+$/.test(value)) {
      return returnIfAllowed(String(originalValue), options, originalValue)
    }
    return returnIfAllowed(num, options, originalValue)
  }
  const boo = checkBoolean(value, options)
  if (boo !== null) {
    return returnIfAllowed(boo, options, originalValue)
  }
  /**
   * DEFAULT SECTION - bascially if we catch nothing we assume that you just have a string
   */
  // if string - convert to ""
  return returnIfAllowed(String(originalValue), options, originalValue)
}
