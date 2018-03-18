(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.autoParse = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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
  } else if (typpy(value, Object)) {
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
  } catch (e) {}

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
  var string = String(orignalValue)
  return string
}

},{"typpy":4}],2:[function(require,module,exports){
"use strict";

var noop6 = require("noop6");

(function () {
    var NAME_FIELD = "name";

    if (typeof noop6.name === "string") {
        return;
    }

    try {
        Object.defineProperty(Function.prototype, NAME_FIELD, {
            get: function get() {
                var name = this.toString().trim().match(/^function\s*([^\s(]+)/)[1];
                Object.defineProperty(this, NAME_FIELD, { value: name });
                return name;
            }
        });
    } catch (e) {}
})();

/**
 * functionName
 * Get the function name.
 *
 * @name functionName
 * @function
 * @param {Function} input The input function.
 * @returns {String} The function name.
 */
module.exports = function functionName(input) {
    return input.name;
};
},{"noop6":3}],3:[function(require,module,exports){
"use strict";

module.exports = function () {};
},{}],4:[function(require,module,exports){
"use strict";

require("function.name");

/**
 * Typpy
 * Gets the type of the input value or compares it
 * with a provided type.
 *
 * Usage:
 *
 * ```js
 * Typpy({}) // => "object"
 * Typpy(42, Number); // => true
 * Typpy.get([], "array"); => true
 * ```
 *
 * @name Typpy
 * @function
 * @param {Anything} input The input value.
 * @param {Constructor|String} target The target type.
 * It could be a string (e.g. `"array"`) or a
 * constructor (e.g. `Array`).
 * @return {String|Boolean} It returns `true` if the
 * input has the provided type `target` (if was provided),
 * `false` if the input type does *not* have the provided type
 * `target` or the stringified type of the input (always lowercase).
 */
function Typpy(input, target) {
    if (arguments.length === 2) {
        return Typpy.is(input, target);
    }
    return Typpy.get(input, true);
}

/**
 * Typpy.is
 * Checks if the input value has a specified type.
 *
 * @name Typpy.is
 * @function
 * @param {Anything} input The input value.
 * @param {Constructor|String} target The target type.
 * It could be a string (e.g. `"array"`) or a
 * constructor (e.g. `Array`).
 * @return {Boolean} `true`, if the input has the same
 * type with the target or `false` otherwise.
 */
Typpy.is = function (input, target) {
    return Typpy.get(input, typeof target === "string") === target;
};

/**
 * Typpy.get
 * Gets the type of the input value. This is used internally.
 *
 * @name Typpy.get
 * @function
 * @param {Anything} input The input value.
 * @param {Boolean} str A flag to indicate if the return value
 * should be a string or not.
 * @return {Constructor|String} The input value constructor
 * (if any) or the stringified type (always lowercase).
 */
Typpy.get = function (input, str) {

    if (typeof input === "string") {
        return str ? "string" : String;
    }

    if (null === input) {
        return str ? "null" : null;
    }

    if (undefined === input) {
        return str ? "undefined" : undefined;
    }

    if (input !== input) {
        return str ? "nan" : NaN;
    }

    return str ? input.constructor.name.toLowerCase() : input.constructor;
};

module.exports = Typpy;
},{"function.name":2}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mdW5jdGlvbi5uYW1lL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ub29wNi9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdHlwcHkvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJtb2R1bGUuZXhwb3J0cyA9IGF1dG9QYXJzZVxuXG52YXIgdHlwcHkgPSByZXF1aXJlKCd0eXBweScpXG5cbi8qKlxuICpcbiAqIEBuYW1lIHN0cmlwVHJpbUxvd2VyXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7VmFsdWV9IHZhbHVlIHN0cmlwIHRyaW0gJiBsb3dlciBjYXNlIHRoZSBzdHJpbmdcbiAqIEByZXR1cm4ge1ZhbHVlfSBwYXJzZWQgc3RyaW5nXG4gKlxuICovXG5mdW5jdGlvbiBzdHJpcFRyaW1Mb3dlciAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoL1tcIlwiJyddL2lnLCAnJykudHJpbSgpLnRvTG93ZXJDYXNlKClcbn1cbi8qKlxuICpcbiAqIEBuYW1lIHRvQm9vbGVhblxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1ZhbHVlfSB2YWx1ZSBwYXJzZSB0byBib29sZWFuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBwYXJzZWQgYm9vbGVhblxuICpcbiAqL1xuZnVuY3Rpb24gdG9Cb29sZWFuICh2YWx1ZSkge1xuICByZXR1cm4gY2hlY2tCb29sZWFuKHZhbHVlKSB8fCBmYWxzZVxufVxuLyoqXG4gKlxuICogQG5hbWUgY2hlY2tCb29sZWFuXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7VmFsdWV9IHZhbHVlIGlzIGFueSB2YWx1ZVxuICogQHJldHVybiB7Qm9vbGVhbn0gaXMgYSBib29sZWFuIHZhbHVlXG4gKlxuICovXG5mdW5jdGlvbiBjaGVja0Jvb2xlYW4gKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiAhIXZhbHVlXG4gIH1cblxuICB2YWx1ZSA9IHN0cmlwVHJpbUxvd2VyKHZhbHVlKVxuICBpZiAodmFsdWUgPT09ICd0cnVlJyB8fCB2YWx1ZSA9PT0gJzEnKSByZXR1cm4gdHJ1ZVxuICBpZiAodmFsdWUgPT09ICdmYWxzZScgfHwgdmFsdWUgPT09ICcwJykgcmV0dXJuIGZhbHNlXG5cbiAgcmV0dXJuIG51bGxcbn1cbi8qKlxuICpcbiAqIEBuYW1lIHBhcnNlT2JqZWN0XG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7VmFsdWV9IHZhbHVlIHBhcnNlIG9iamVjdFxuICogQHJldHVybiB7VmFsdWV9IHBhcnNlZCBvYmplY3RcbiAqXG4gKi9cbmZ1bmN0aW9uIHBhcnNlT2JqZWN0ICh2YWx1ZSkge1xuICBpZiAodHlwcHkodmFsdWUsIEFycmF5KSkge1xuICAgIHJldHVybiB2YWx1ZS5tYXAoZnVuY3Rpb24gKG4sIGtleSkge1xuICAgICAgcmV0dXJuIGF1dG9QYXJzZShuKVxuICAgIH0pXG4gIH0gZWxzZSBpZiAodHlwcHkodmFsdWUsIE9iamVjdCkpIHtcbiAgICBmb3IgKHZhciBuIGluIHZhbHVlKSB7XG4gICAgICB2YWx1ZVtuXSA9IGF1dG9QYXJzZSh2YWx1ZVtuXSlcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cbiAgcmV0dXJuIHt9XG59XG4vKipcbiAqXG4gKiBAbmFtZSBwYXJzZUZ1bmN0aW9uXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7VmFsdWV9IHZhbHVlIGZ1bmN0aW9uXG4gKiBAcmV0dXJuIHtWYWx1ZX0gcmV0dXJuZWQgdmFsdWUgZnJvbSB0aGUgY2FsbGVkIHZhbHVlIGZ1bmN0aW9uXG4gKlxuICovXG5mdW5jdGlvbiBwYXJzZUZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gYXV0b1BhcnNlKHZhbHVlKCkpXG59XG4vKipcbiAqXG4gKiBAbmFtZSBwYXJzZVR5cGVcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtWYWx1ZX0gdmFsdWUgaW5wdXRlZCB2YWx1ZVxuICogQHBhcmFtIHtUeXBlfSB0eXBlICBpbnB1dGVkIHR5cGVcbiAqIEByZXR1cm4ge1ZhbHVlfSBwYXJzZWQgdHlwZVxuICpcbiAqL1xuZnVuY3Rpb24gcGFyc2VUeXBlICh2YWx1ZSwgdHlwZSkge1xuICAvKipcbiAgICogIEN1cnJlbnRseSB0aGV5IHNlbmQgYSBzdHJpbmcgLSBoYW5kbGUgU3RyaW5nIG9yIE51bWJlciBvciBCb29sZWFuP1xuICAgKi9cbiAgaWYgKCh2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gdHlwZSkgfHwgdHlwcHkodmFsdWUsIHR5cGUpKSB7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICB2YXIgdHlwZU5hbWUgPSB0eXBlXG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBjb25zdHJ1Y3RvciBpbnRvIGEgc3RyaW5nXG4gICAqL1xuICBpZiAodHlwZSAmJiB0eXBlLm5hbWUpIHtcbiAgICB0eXBlTmFtZSA9IHR5cGUubmFtZS50b0xvd2VyQ2FzZSgpXG4gIH1cblxuICB0eXBlTmFtZSA9IHN0cmlwVHJpbUxvd2VyKHR5cGVOYW1lKVxuICBzd2l0Y2ggKHR5cGVOYW1lKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpXG4gICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKVxuXG4gICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgaWYgKHR5cHB5KHZhbHVlLCBGdW5jdGlvbikpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjYih2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgIH1cbiAgICBjYXNlICdkYXRlJzpcbiAgICAgIHJldHVybiBuZXcgRGF0ZSh2YWx1ZSlcbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgdmFyIGpzb25QYXJzZWRcbiAgICAgIHRyeSB7XG4gICAgICAgIGpzb25QYXJzZWQgPSBKU09OLnBhcnNlKHZhbHVlKVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIGlmICh0eXBweShqc29uUGFyc2VkLCBPYmplY3QpIHx8IHR5cHB5KGpzb25QYXJzZWQsIEFycmF5KSkge1xuICAgICAgICByZXR1cm4gYXV0b1BhcnNlKGpzb25QYXJzZWQpXG4gICAgICB9IGVsc2UgaWYgKCF0eXBweShqc29uUGFyc2VkLCAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyc2VPYmplY3QodmFsdWUpXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gdG9Cb29sZWFuKHZhbHVlKVxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gTnVtYmVyKHZhbHVlKVxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgY2FzZSAnbnVsbCc6XG4gICAgICByZXR1cm4gbnVsbFxuICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIHJldHVybiBbdmFsdWVdXG4gICAgZGVmYXVsdDpcbiAgICAgIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IHR5cGUodmFsdWUpIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgdHlwZS4nKVxuICB9XG59XG4vKipcbiAqIGF1dG9QYXJzZVxuICogYXV0by1wYXJzZSBhbnkgdmFsdWUgeW91IGhhcHBlbiB0byBzZW5kIGluXG4gKiAoU3RyaW5nLCBOdW1iZXIsIEJvb2xlYW4sIEFycmF5LCBPYmplY3QsIEZ1bmN0aW9uLCB1bmRlZmluZWQgYW5kIG51bGwpLlxuICogWW91IHNlbmQgaXQgd2Ugd2lsbCB0cnkgdG8gZmluZCBhIHdheSB0byBwYXJzZSBpdC5cbiAqIFdlIG5vdyBzdXBwb3J0IHNlbmRpbmcgaW4gYSBzdHJpbmcgb2Ygd2hhdCB0eXBlXG4gKiAoZS5nLiBcImJvb2xlYW5cIikgb3IgY29uc3RydWN0b3IgKGUuZy4gQm9vbGVhbilcbiAqXG4gKiBVc2FnZTpcbiAqXG4gKiBgYGBqc1xuICogYXV0b1BhcnNlKHt9KSAvLyA9PiBcIm9iamVjdFwiXG4gKiBhdXRvUGFyc2UoJzQyJyk7IC8vID0+IDQyXG4gKiBhdXRvUGFyc2UuZ2V0KCdbXScpOyAvLyA9PiBbXVxuICogYGBgXG4gKlxuICogQG5hbWUgYXV0b1BhcnNlXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7VmFsdWV9IGlucHV0IFRoZSBpbnB1dCB2YWx1ZS5cbiAqIEBwYXJhbSB7Q29uc3RydWN0b3J8U3RyaW5nfSB0YXJnZXQgVGhlIHRhcmdldCB0eXBlLlxuICogQHJldHVybiB7U3RyaW5nfEZ1bmN0aW9ufERhdGV8T2JqZWN0fEJvb2xlYW58TnVtYmVyfFVuZGVmaW5lZHxOdWxsfEFycmF5fVxuICovXG5mdW5jdGlvbiBhdXRvUGFyc2UgKHZhbHVlLCB0eXBlKSB7XG4gIGlmICh0eXBlKSB7XG4gICAgcmV0dXJuIHBhcnNlVHlwZSh2YWx1ZSwgdHlwZSlcbiAgfVxuICB2YXIgb3JpZ25hbFZhbHVlID0gdmFsdWVcbiAgLyoqXG4gICAqICBQUkUgUlVMRSAtIGNoZWNrIGZvciBudWxsIGJlIGNhdXNlIG51bGwgY2FuIGJlIHR5cGVvZiBvYmplY3Qgd2hpY2ggY2FuICB0aHJvdWdoIG9mZiBwYXJzaW5nXG4gICAqL1xuICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIC8qKlxuICAgKiBUWVBFT0YgU0VDVElPTiAtIFVzZSB0byBjaGVjayBhbmQgZG8gc3BlY2lmaWMgdGhpbmdzIGJhc2VkIG9mZiBvZiBrbm93IHRoZSB0eXBlXG4gICAqIENoZWNrIGFnYWluc3QgdW5kZWZpbmVkXG4gICAqL1xuICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gcGFyc2VGdW5jdGlvbih2YWx1ZSlcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBwYXJzZU9iamVjdCh2YWx1ZSlcbiAgfVxuICAvKipcbiAgICogU1RSSU5HIFNFQ1RJT04gLSBJZiB3ZSBtYWRlIGl0IHRoaXMgZmFyIHRoYXQgbWVhbnMgaXQgaXMgYSBzdHJpbmcgdGhhdCB3ZSBtdXN0IGRvIHNvbWV0aGluZyB3aXRoIHRvIHBhcnNlXG4gICAqL1xuICBpZiAodmFsdWUgPT09ICdOYU4nKSB7XG4gICAgcmV0dXJuIE5hTlxuICB9XG4gIHZhciBqc29uUGFyc2VkID0gbnVsbFxuICB0cnkge1xuICAgIGpzb25QYXJzZWQgPSBKU09OLnBhcnNlKHZhbHVlKVxuICB9IGNhdGNoIChlKSB7fVxuXG4gIGlmIChqc29uUGFyc2VkICYmIHR5cGVvZiBqc29uUGFyc2VkID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBhdXRvUGFyc2UoanNvblBhcnNlZClcbiAgfVxuICB2YWx1ZSA9IHN0cmlwVHJpbUxvd2VyKHZhbHVlKVxuICBpZiAodmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHZhbHVlID09PSAnJykge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxuICBpZiAodmFsdWUgPT09ICdudWxsJykge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgLyoqXG4gICAqIE9yZGVyIE1hdHRlciBiZWNhdXNlIGlmIGl0IGlzIGEgb25lIG9yIHplcm8gYm9vbGVhbiB3aWxsIGNvbWUgYmFjayB3aXRoIGEgYXduc2VyIHRvby4gaWYgeW91IHdhbnQgaXQgdG8gYmUgYSBib29sZWFuIHlvdSBtdXN0IHNwZWNpZnlcbiAgICovXG4gIHZhciBudW0gPSBOdW1iZXIodmFsdWUpXG4gIGlmICh0eXBweShudW0sIE51bWJlcikpIHtcbiAgICByZXR1cm4gbnVtXG4gIH1cbiAgdmFyIGJvbyA9IGNoZWNrQm9vbGVhbih2YWx1ZSlcbiAgaWYgKHR5cHB5KGJvbywgQm9vbGVhbikpIHtcbiAgICByZXR1cm4gYm9vXG4gIH1cbiAgLyoqXG4gICAqIERFRkFVTFQgU0VDVElPTiAtIGJhc2NpYWxseSBpZiB3ZSBjYXRjaCBub3RoaW5nIHdlIGFzc3VtZSB0aGF0IHlvdSBqdXN0IGhhdmUgYSBzdHJpbmdcbiAgICovXG4gIHZhciBzdHJpbmcgPSBTdHJpbmcob3JpZ25hbFZhbHVlKVxuICByZXR1cm4gc3RyaW5nXG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG5vb3A2ID0gcmVxdWlyZShcIm5vb3A2XCIpO1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIHZhciBOQU1FX0ZJRUxEID0gXCJuYW1lXCI7XG5cbiAgICBpZiAodHlwZW9mIG5vb3A2Lm5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsIE5BTUVfRklFTEQsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gdGhpcy50b1N0cmluZygpLnRyaW0oKS5tYXRjaCgvXmZ1bmN0aW9uXFxzKihbXlxccyhdKykvKVsxXTtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgTkFNRV9GSUVMRCwgeyB2YWx1ZTogbmFtZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge31cbn0pKCk7XG5cbi8qKlxuICogZnVuY3Rpb25OYW1lXG4gKiBHZXQgdGhlIGZ1bmN0aW9uIG5hbWUuXG4gKlxuICogQG5hbWUgZnVuY3Rpb25OYW1lXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGlucHV0IFRoZSBpbnB1dCBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBmdW5jdGlvbiBuYW1lLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZ1bmN0aW9uTmFtZShpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dC5uYW1lO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7fTsiLCJcInVzZSBzdHJpY3RcIjtcblxucmVxdWlyZShcImZ1bmN0aW9uLm5hbWVcIik7XG5cbi8qKlxuICogVHlwcHlcbiAqIEdldHMgdGhlIHR5cGUgb2YgdGhlIGlucHV0IHZhbHVlIG9yIGNvbXBhcmVzIGl0XG4gKiB3aXRoIGEgcHJvdmlkZWQgdHlwZS5cbiAqXG4gKiBVc2FnZTpcbiAqXG4gKiBgYGBqc1xuICogVHlwcHkoe30pIC8vID0+IFwib2JqZWN0XCJcbiAqIFR5cHB5KDQyLCBOdW1iZXIpOyAvLyA9PiB0cnVlXG4gKiBUeXBweS5nZXQoW10sIFwiYXJyYXlcIik7ID0+IHRydWVcbiAqIGBgYFxuICpcbiAqIEBuYW1lIFR5cHB5XG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7QW55dGhpbmd9IGlucHV0IFRoZSBpbnB1dCB2YWx1ZS5cbiAqIEBwYXJhbSB7Q29uc3RydWN0b3J8U3RyaW5nfSB0YXJnZXQgVGhlIHRhcmdldCB0eXBlLlxuICogSXQgY291bGQgYmUgYSBzdHJpbmcgKGUuZy4gYFwiYXJyYXlcImApIG9yIGFcbiAqIGNvbnN0cnVjdG9yIChlLmcuIGBBcnJheWApLlxuICogQHJldHVybiB7U3RyaW5nfEJvb2xlYW59IEl0IHJldHVybnMgYHRydWVgIGlmIHRoZVxuICogaW5wdXQgaGFzIHRoZSBwcm92aWRlZCB0eXBlIGB0YXJnZXRgIChpZiB3YXMgcHJvdmlkZWQpLFxuICogYGZhbHNlYCBpZiB0aGUgaW5wdXQgdHlwZSBkb2VzICpub3QqIGhhdmUgdGhlIHByb3ZpZGVkIHR5cGVcbiAqIGB0YXJnZXRgIG9yIHRoZSBzdHJpbmdpZmllZCB0eXBlIG9mIHRoZSBpbnB1dCAoYWx3YXlzIGxvd2VyY2FzZSkuXG4gKi9cbmZ1bmN0aW9uIFR5cHB5KGlucHV0LCB0YXJnZXQpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICByZXR1cm4gVHlwcHkuaXMoaW5wdXQsIHRhcmdldCk7XG4gICAgfVxuICAgIHJldHVybiBUeXBweS5nZXQoaW5wdXQsIHRydWUpO1xufVxuXG4vKipcbiAqIFR5cHB5LmlzXG4gKiBDaGVja3MgaWYgdGhlIGlucHV0IHZhbHVlIGhhcyBhIHNwZWNpZmllZCB0eXBlLlxuICpcbiAqIEBuYW1lIFR5cHB5LmlzXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7QW55dGhpbmd9IGlucHV0IFRoZSBpbnB1dCB2YWx1ZS5cbiAqIEBwYXJhbSB7Q29uc3RydWN0b3J8U3RyaW5nfSB0YXJnZXQgVGhlIHRhcmdldCB0eXBlLlxuICogSXQgY291bGQgYmUgYSBzdHJpbmcgKGUuZy4gYFwiYXJyYXlcImApIG9yIGFcbiAqIGNvbnN0cnVjdG9yIChlLmcuIGBBcnJheWApLlxuICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgLCBpZiB0aGUgaW5wdXQgaGFzIHRoZSBzYW1lXG4gKiB0eXBlIHdpdGggdGhlIHRhcmdldCBvciBgZmFsc2VgIG90aGVyd2lzZS5cbiAqL1xuVHlwcHkuaXMgPSBmdW5jdGlvbiAoaW5wdXQsIHRhcmdldCkge1xuICAgIHJldHVybiBUeXBweS5nZXQoaW5wdXQsIHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCIpID09PSB0YXJnZXQ7XG59O1xuXG4vKipcbiAqIFR5cHB5LmdldFxuICogR2V0cyB0aGUgdHlwZSBvZiB0aGUgaW5wdXQgdmFsdWUuIFRoaXMgaXMgdXNlZCBpbnRlcm5hbGx5LlxuICpcbiAqIEBuYW1lIFR5cHB5LmdldFxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0FueXRoaW5nfSBpbnB1dCBUaGUgaW5wdXQgdmFsdWUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHN0ciBBIGZsYWcgdG8gaW5kaWNhdGUgaWYgdGhlIHJldHVybiB2YWx1ZVxuICogc2hvdWxkIGJlIGEgc3RyaW5nIG9yIG5vdC5cbiAqIEByZXR1cm4ge0NvbnN0cnVjdG9yfFN0cmluZ30gVGhlIGlucHV0IHZhbHVlIGNvbnN0cnVjdG9yXG4gKiAoaWYgYW55KSBvciB0aGUgc3RyaW5naWZpZWQgdHlwZSAoYWx3YXlzIGxvd2VyY2FzZSkuXG4gKi9cblR5cHB5LmdldCA9IGZ1bmN0aW9uIChpbnB1dCwgc3RyKSB7XG5cbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiBzdHIgPyBcInN0cmluZ1wiIDogU3RyaW5nO1xuICAgIH1cblxuICAgIGlmIChudWxsID09PSBpbnB1dCkge1xuICAgICAgICByZXR1cm4gc3RyID8gXCJudWxsXCIgOiBudWxsO1xuICAgIH1cblxuICAgIGlmICh1bmRlZmluZWQgPT09IGlucHV0KSB7XG4gICAgICAgIHJldHVybiBzdHIgPyBcInVuZGVmaW5lZFwiIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmIChpbnB1dCAhPT0gaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHN0ciA/IFwibmFuXCIgOiBOYU47XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0ciA/IGlucHV0LmNvbnN0cnVjdG9yLm5hbWUudG9Mb3dlckNhc2UoKSA6IGlucHV0LmNvbnN0cnVjdG9yO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUeXBweTsiXX0=
