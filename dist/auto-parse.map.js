(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.autoParse = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
function autoParse (value, type, options) {
  if (type && typeof type === 'object') {
    options = type
    type = undefined
  }
  if (options && options.remove) {
    var valueRegExp
    if (typeof options.remove === 'object') {
      for (var i = 0; i < options.remove.length; i++) {
        valueRegExp = new RegExp((options.remove[i]), 'g')
        value = value.replace(valueRegExp, '')
      }
    } else {
      valueRegExp = new RegExp(options.remove[i], 'g')
      value = value.replace(valueRegExp, '')
    }
  }
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
                var nameMatch = this.toString().trim().match(/^function\s*([^\s(]+)/);
                var name = nameMatch ? nameMatch[1] : "";
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mdW5jdGlvbi5uYW1lL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ub29wNi9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdHlwcHkvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSBhdXRvUGFyc2VcblxudmFyIHR5cHB5ID0gcmVxdWlyZSgndHlwcHknKVxuXG4vKipcbiAqXG4gKiBAbmFtZSBzdHJpcFRyaW1Mb3dlclxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1ZhbHVlfSB2YWx1ZSBzdHJpcCB0cmltICYgbG93ZXIgY2FzZSB0aGUgc3RyaW5nXG4gKiBAcmV0dXJuIHtWYWx1ZX0gcGFyc2VkIHN0cmluZ1xuICpcbiAqL1xuZnVuY3Rpb24gc3RyaXBUcmltTG93ZXIgKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9bXCJcIicnXS9pZywgJycpLnRyaW0oKS50b0xvd2VyQ2FzZSgpXG59XG4vKipcbiAqXG4gKiBAbmFtZSB0b0Jvb2xlYW5cbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtWYWx1ZX0gdmFsdWUgcGFyc2UgdG8gYm9vbGVhblxuICogQHJldHVybiB7Qm9vbGVhbn0gcGFyc2VkIGJvb2xlYW5cbiAqXG4gKi9cbmZ1bmN0aW9uIHRvQm9vbGVhbiAodmFsdWUpIHtcbiAgcmV0dXJuIGNoZWNrQm9vbGVhbih2YWx1ZSkgfHwgZmFsc2Vcbn1cbi8qKlxuICpcbiAqIEBuYW1lIGNoZWNrQm9vbGVhblxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1ZhbHVlfSB2YWx1ZSBpcyBhbnkgdmFsdWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGlzIGEgYm9vbGVhbiB2YWx1ZVxuICpcbiAqL1xuZnVuY3Rpb24gY2hlY2tCb29sZWFuICh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gISF2YWx1ZVxuICB9XG4gIHZhbHVlID0gc3RyaXBUcmltTG93ZXIodmFsdWUpXG4gIGlmICh2YWx1ZSA9PT0gJ3RydWUnIHx8IHZhbHVlID09PSAnMScpIHJldHVybiB0cnVlXG4gIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJyB8fCB2YWx1ZSA9PT0gJzAnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIG51bGxcbn1cbi8qKlxuICpcbiAqIEBuYW1lIHBhcnNlT2JqZWN0XG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7VmFsdWV9IHZhbHVlIHBhcnNlIG9iamVjdFxuICogQHJldHVybiB7VmFsdWV9IHBhcnNlZCBvYmplY3RcbiAqXG4gKi9cbmZ1bmN0aW9uIHBhcnNlT2JqZWN0ICh2YWx1ZSkge1xuICBpZiAodHlwcHkodmFsdWUsIEFycmF5KSkge1xuICAgIHJldHVybiB2YWx1ZS5tYXAoZnVuY3Rpb24gKG4sIGtleSkge1xuICAgICAgcmV0dXJuIGF1dG9QYXJzZShuKVxuICAgIH0pXG4gIH0gZWxzZSBpZiAodHlwcHkodmFsdWUsIE9iamVjdCkgfHwgdmFsdWUuY29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgIGZvciAodmFyIG4gaW4gdmFsdWUpIHtcbiAgICAgIHZhbHVlW25dID0gYXV0b1BhcnNlKHZhbHVlW25dKVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuICByZXR1cm4ge31cbn1cbi8qKlxuICpcbiAqIEBuYW1lIHBhcnNlRnVuY3Rpb25cbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtWYWx1ZX0gdmFsdWUgZnVuY3Rpb25cbiAqIEByZXR1cm4ge1ZhbHVlfSByZXR1cm5lZCB2YWx1ZSBmcm9tIHRoZSBjYWxsZWQgdmFsdWUgZnVuY3Rpb25cbiAqXG4gKi9cbmZ1bmN0aW9uIHBhcnNlRnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiBhdXRvUGFyc2UodmFsdWUoKSlcbn1cbi8qKlxuICpcbiAqIEBuYW1lIHBhcnNlVHlwZVxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1ZhbHVlfSB2YWx1ZSBpbnB1dGVkIHZhbHVlXG4gKiBAcGFyYW0ge1R5cGV9IHR5cGUgIGlucHV0ZWQgdHlwZVxuICogQHJldHVybiB7VmFsdWV9IHBhcnNlZCB0eXBlXG4gKlxuICovXG5mdW5jdGlvbiBwYXJzZVR5cGUgKHZhbHVlLCB0eXBlKSB7XG4gIC8qKlxuICAgKiAgQ3VycmVudGx5IHRoZXkgc2VuZCBhIHN0cmluZyAtIGhhbmRsZSBTdHJpbmcgb3IgTnVtYmVyIG9yIEJvb2xlYW4/XG4gICAqL1xuICBpZiAoKHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSB0eXBlKSB8fCB0eXBweSh2YWx1ZSwgdHlwZSkpIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuICB2YXIgdHlwZU5hbWUgPSB0eXBlXG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBjb25zdHJ1Y3RvciBpbnRvIGEgc3RyaW5nXG4gICAqL1xuICBpZiAodHlwZSAmJiB0eXBlLm5hbWUpIHtcbiAgICB0eXBlTmFtZSA9IHR5cGUubmFtZS50b0xvd2VyQ2FzZSgpXG4gIH1cblxuICB0eXBlTmFtZSA9IHN0cmlwVHJpbUxvd2VyKHR5cGVOYW1lKVxuICBzd2l0Y2ggKHR5cGVOYW1lKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpXG4gICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKVxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIGlmICh0eXBweSh2YWx1ZSwgRnVuY3Rpb24pKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChjYikge1xuICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY2IodmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICB9XG4gICAgY2FzZSAnZGF0ZSc6XG4gICAgICByZXR1cm4gbmV3IERhdGUodmFsdWUpXG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIHZhciBqc29uUGFyc2VkXG4gICAgICB0cnkge1xuICAgICAgICBqc29uUGFyc2VkID0gSlNPTi5wYXJzZSh2YWx1ZSlcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICBpZiAodHlwcHkoanNvblBhcnNlZCwgT2JqZWN0KSB8fCB0eXBweShqc29uUGFyc2VkLCBBcnJheSkpIHtcbiAgICAgICAgcmV0dXJuIGF1dG9QYXJzZShqc29uUGFyc2VkKVxuICAgICAgfSBlbHNlIGlmICghdHlwcHkoanNvblBhcnNlZCwgJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgIHJldHVybiB7fVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnNlT2JqZWN0KHZhbHVlKVxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHRvQm9vbGVhbih2YWx1ZSlcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIE51bWJlcih2YWx1ZSlcbiAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIGNhc2UgJ251bGwnOlxuICAgICAgcmV0dXJuIG51bGxcbiAgICBjYXNlICdhcnJheSc6XG4gICAgICByZXR1cm4gW3ZhbHVlXVxuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0eXBlKHZhbHVlKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHR5cGUuJylcbiAgfVxufVxuLyoqXG4gKiBhdXRvUGFyc2VcbiAqIGF1dG8tcGFyc2UgYW55IHZhbHVlIHlvdSBoYXBwZW4gdG8gc2VuZCBpblxuICogKFN0cmluZywgTnVtYmVyLCBCb29sZWFuLCBBcnJheSwgT2JqZWN0LCBGdW5jdGlvbiwgdW5kZWZpbmVkIGFuZCBudWxsKS5cbiAqIFlvdSBzZW5kIGl0IHdlIHdpbGwgdHJ5IHRvIGZpbmQgYSB3YXkgdG8gcGFyc2UgaXQuXG4gKiBXZSBub3cgc3VwcG9ydCBzZW5kaW5nIGluIGEgc3RyaW5nIG9mIHdoYXQgdHlwZVxuICogKGUuZy4gXCJib29sZWFuXCIpIG9yIGNvbnN0cnVjdG9yIChlLmcuIEJvb2xlYW4pXG4gKlxuICogVXNhZ2U6XG4gKlxuICogYGBganNcbiAqIGF1dG9QYXJzZSh7fSkgLy8gPT4gXCJvYmplY3RcIlxuICogYXV0b1BhcnNlKCc0MicpOyAvLyA9PiA0MlxuICogYXV0b1BhcnNlLmdldCgnW10nKTsgLy8gPT4gW11cbiAqIGBgYFxuICpcbiAqIEBuYW1lIGF1dG9QYXJzZVxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge1ZhbHVlfSBpbnB1dCBUaGUgaW5wdXQgdmFsdWUuXG4gKiBAcGFyYW0ge0NvbnN0cnVjdG9yfFN0cmluZ30gdGFyZ2V0IFRoZSB0YXJnZXQgdHlwZS5cbiAqIEByZXR1cm4ge1N0cmluZ3xGdW5jdGlvbnxEYXRlfE9iamVjdHxCb29sZWFufE51bWJlcnxVbmRlZmluZWR8TnVsbHxBcnJheX1cbiAqL1xuZnVuY3Rpb24gYXV0b1BhcnNlICh2YWx1ZSwgdHlwZSwgb3B0aW9ucykge1xuICBpZiAodHlwZSAmJiB0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0gdHlwZVxuICAgIHR5cGUgPSB1bmRlZmluZWRcbiAgfVxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlbW92ZSkge1xuICAgIHZhciB2YWx1ZVJlZ0V4cFxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZW1vdmUgPT09ICdvYmplY3QnKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9wdGlvbnMucmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlUmVnRXhwID0gbmV3IFJlZ0V4cCgob3B0aW9ucy5yZW1vdmVbaV0pLCAnZycpXG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSh2YWx1ZVJlZ0V4cCwgJycpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlUmVnRXhwID0gbmV3IFJlZ0V4cChvcHRpb25zLnJlbW92ZVtpXSwgJ2cnKVxuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHZhbHVlUmVnRXhwLCAnJylcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGUpIHtcbiAgICByZXR1cm4gcGFyc2VUeXBlKHZhbHVlLCB0eXBlKVxuICB9XG4gIHZhciBvcmlnbmFsVmFsdWUgPSB2YWx1ZVxuICAvKipcbiAgICogIFBSRSBSVUxFIC0gY2hlY2sgZm9yIG51bGwgYmUgY2F1c2UgbnVsbCBjYW4gYmUgdHlwZW9mIG9iamVjdCB3aGljaCBjYW4gIHRocm91Z2ggb2ZmIHBhcnNpbmdcbiAgICovXG4gIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgLyoqXG4gICAqIFRZUEVPRiBTRUNUSU9OIC0gVXNlIHRvIGNoZWNrIGFuZCBkbyBzcGVjaWZpYyB0aGluZ3MgYmFzZWQgb2ZmIG9mIGtub3cgdGhlIHR5cGVcbiAgICogQ2hlY2sgYWdhaW5zdCB1bmRlZmluZWRcbiAgICovXG4gIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUgfHwgdmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gcGFyc2VGdW5jdGlvbih2YWx1ZSlcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBwYXJzZU9iamVjdCh2YWx1ZSlcbiAgfVxuICAvKipcbiAgICogU1RSSU5HIFNFQ1RJT04gLSBJZiB3ZSBtYWRlIGl0IHRoaXMgZmFyIHRoYXQgbWVhbnMgaXQgaXMgYSBzdHJpbmcgdGhhdCB3ZSBtdXN0IGRvIHNvbWV0aGluZyB3aXRoIHRvIHBhcnNlXG4gICAqL1xuICBpZiAodmFsdWUgPT09ICdOYU4nKSB7XG4gICAgcmV0dXJuIE5hTlxuICB9XG4gIHZhciBqc29uUGFyc2VkID0gbnVsbFxuICB0cnkge1xuICAgIGpzb25QYXJzZWQgPSBKU09OLnBhcnNlKHZhbHVlKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGpzb25QYXJzZWQgPSBKU09OLnBhcnNlKFxuICAgICAgICB2YWx1ZS50cmltKCkucmVwbGFjZSgvKFxcXFxcXFxcXCIpfChcXFxcXCIpL2dpLCAnXCInKS5yZXBsYWNlKC8oXFxcXG58XFxcXFxcXFxuKS9naSwgJycpLnJlcGxhY2UoLyheXCJ8XCIkKXwoXid8JyQpL2dpLCAnJylcbiAgICAgIClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBqc29uUGFyc2VkID0gSlNPTi5wYXJzZShcbiAgICAgICAgICB2YWx1ZS50cmltKCkucmVwbGFjZSgvJy9naSwgJ1wiJylcbiAgICAgICAgKVxuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG4gIH1cbiAgaWYgKGpzb25QYXJzZWQgJiYgdHlwZW9mIGpzb25QYXJzZWQgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGF1dG9QYXJzZShqc29uUGFyc2VkKVxuICB9XG4gIHZhbHVlID0gc3RyaXBUcmltTG93ZXIodmFsdWUpXG4gIGlmICh2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdmFsdWUgPT09ICcnKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG4gIGlmICh2YWx1ZSA9PT0gJ251bGwnKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICAvKipcbiAgICogT3JkZXIgTWF0dGVyIGJlY2F1c2UgaWYgaXQgaXMgYSBvbmUgb3IgemVybyBib29sZWFuIHdpbGwgY29tZSBiYWNrIHdpdGggYSBhd25zZXIgdG9vLiBpZiB5b3Ugd2FudCBpdCB0byBiZSBhIGJvb2xlYW4geW91IG11c3Qgc3BlY2lmeVxuICAgKi9cbiAgdmFyIG51bSA9IE51bWJlcih2YWx1ZSlcbiAgaWYgKHR5cHB5KG51bSwgTnVtYmVyKSkge1xuICAgIHJldHVybiBudW1cbiAgfVxuICB2YXIgYm9vID0gY2hlY2tCb29sZWFuKHZhbHVlKVxuICBpZiAodHlwcHkoYm9vLCBCb29sZWFuKSkge1xuICAgIHJldHVybiBib29cbiAgfVxuICAvKipcbiAgICogREVGQVVMVCBTRUNUSU9OIC0gYmFzY2lhbGx5IGlmIHdlIGNhdGNoIG5vdGhpbmcgd2UgYXNzdW1lIHRoYXQgeW91IGp1c3QgaGF2ZSBhIHN0cmluZ1xuICAgKi9cbiAgLy8gaWYgc3RyaW5nIC0gY29udmVydCB0byBcIlwiXG4gIHJldHVybiBTdHJpbmcob3JpZ25hbFZhbHVlKVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBub29wNiA9IHJlcXVpcmUoXCJub29wNlwiKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgTkFNRV9GSUVMRCA9IFwibmFtZVwiO1xuXG4gICAgaWYgKHR5cGVvZiBub29wNi5uYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCBOQU1FX0ZJRUxELCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZU1hdGNoID0gdGhpcy50b1N0cmluZygpLnRyaW0oKS5tYXRjaCgvXmZ1bmN0aW9uXFxzKihbXlxccyhdKykvKTtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IG5hbWVNYXRjaCA/IG5hbWVNYXRjaFsxXSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIE5BTUVfRklFTEQsIHsgdmFsdWU6IG5hbWUgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG59KSgpO1xuXG4vKipcbiAqIGZ1bmN0aW9uTmFtZVxuICogR2V0IHRoZSBmdW5jdGlvbiBuYW1lLlxuICpcbiAqIEBuYW1lIGZ1bmN0aW9uTmFtZVxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpbnB1dCBUaGUgaW5wdXQgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgZnVuY3Rpb24gbmFtZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmdW5jdGlvbk5hbWUoaW5wdXQpIHtcbiAgICByZXR1cm4gaW5wdXQubmFtZTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge307IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJmdW5jdGlvbi5uYW1lXCIpO1xuXG4vKipcbiAqIFR5cHB5XG4gKiBHZXRzIHRoZSB0eXBlIG9mIHRoZSBpbnB1dCB2YWx1ZSBvciBjb21wYXJlcyBpdFxuICogd2l0aCBhIHByb3ZpZGVkIHR5cGUuXG4gKlxuICogVXNhZ2U6XG4gKlxuICogYGBganNcbiAqIFR5cHB5KHt9KSAvLyA9PiBcIm9iamVjdFwiXG4gKiBUeXBweSg0MiwgTnVtYmVyKTsgLy8gPT4gdHJ1ZVxuICogVHlwcHkuZ2V0KFtdLCBcImFycmF5XCIpOyA9PiB0cnVlXG4gKiBgYGBcbiAqXG4gKiBAbmFtZSBUeXBweVxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0FueXRoaW5nfSBpbnB1dCBUaGUgaW5wdXQgdmFsdWUuXG4gKiBAcGFyYW0ge0NvbnN0cnVjdG9yfFN0cmluZ30gdGFyZ2V0IFRoZSB0YXJnZXQgdHlwZS5cbiAqIEl0IGNvdWxkIGJlIGEgc3RyaW5nIChlLmcuIGBcImFycmF5XCJgKSBvciBhXG4gKiBjb25zdHJ1Y3RvciAoZS5nLiBgQXJyYXlgKS5cbiAqIEByZXR1cm4ge1N0cmluZ3xCb29sZWFufSBJdCByZXR1cm5zIGB0cnVlYCBpZiB0aGVcbiAqIGlucHV0IGhhcyB0aGUgcHJvdmlkZWQgdHlwZSBgdGFyZ2V0YCAoaWYgd2FzIHByb3ZpZGVkKSxcbiAqIGBmYWxzZWAgaWYgdGhlIGlucHV0IHR5cGUgZG9lcyAqbm90KiBoYXZlIHRoZSBwcm92aWRlZCB0eXBlXG4gKiBgdGFyZ2V0YCBvciB0aGUgc3RyaW5naWZpZWQgdHlwZSBvZiB0aGUgaW5wdXQgKGFsd2F5cyBsb3dlcmNhc2UpLlxuICovXG5mdW5jdGlvbiBUeXBweShpbnB1dCwgdGFyZ2V0KSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIFR5cHB5LmlzKGlucHV0LCB0YXJnZXQpO1xuICAgIH1cbiAgICByZXR1cm4gVHlwcHkuZ2V0KGlucHV0LCB0cnVlKTtcbn1cblxuLyoqXG4gKiBUeXBweS5pc1xuICogQ2hlY2tzIGlmIHRoZSBpbnB1dCB2YWx1ZSBoYXMgYSBzcGVjaWZpZWQgdHlwZS5cbiAqXG4gKiBAbmFtZSBUeXBweS5pc1xuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge0FueXRoaW5nfSBpbnB1dCBUaGUgaW5wdXQgdmFsdWUuXG4gKiBAcGFyYW0ge0NvbnN0cnVjdG9yfFN0cmluZ30gdGFyZ2V0IFRoZSB0YXJnZXQgdHlwZS5cbiAqIEl0IGNvdWxkIGJlIGEgc3RyaW5nIChlLmcuIGBcImFycmF5XCJgKSBvciBhXG4gKiBjb25zdHJ1Y3RvciAoZS5nLiBgQXJyYXlgKS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCwgaWYgdGhlIGlucHV0IGhhcyB0aGUgc2FtZVxuICogdHlwZSB3aXRoIHRoZSB0YXJnZXQgb3IgYGZhbHNlYCBvdGhlcndpc2UuXG4gKi9cblR5cHB5LmlzID0gZnVuY3Rpb24gKGlucHV0LCB0YXJnZXQpIHtcbiAgICByZXR1cm4gVHlwcHkuZ2V0KGlucHV0LCB0eXBlb2YgdGFyZ2V0ID09PSBcInN0cmluZ1wiKSA9PT0gdGFyZ2V0O1xufTtcblxuLyoqXG4gKiBUeXBweS5nZXRcbiAqIEdldHMgdGhlIHR5cGUgb2YgdGhlIGlucHV0IHZhbHVlLiBUaGlzIGlzIHVzZWQgaW50ZXJuYWxseS5cbiAqXG4gKiBAbmFtZSBUeXBweS5nZXRcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtBbnl0aGluZ30gaW5wdXQgVGhlIGlucHV0IHZhbHVlLlxuICogQHBhcmFtIHtCb29sZWFufSBzdHIgQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSByZXR1cm4gdmFsdWVcbiAqIHNob3VsZCBiZSBhIHN0cmluZyBvciBub3QuXG4gKiBAcmV0dXJuIHtDb25zdHJ1Y3RvcnxTdHJpbmd9IFRoZSBpbnB1dCB2YWx1ZSBjb25zdHJ1Y3RvclxuICogKGlmIGFueSkgb3IgdGhlIHN0cmluZ2lmaWVkIHR5cGUgKGFsd2F5cyBsb3dlcmNhc2UpLlxuICovXG5UeXBweS5nZXQgPSBmdW5jdGlvbiAoaW5wdXQsIHN0cikge1xuXG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4gc3RyID8gXCJzdHJpbmdcIiA6IFN0cmluZztcbiAgICB9XG5cbiAgICBpZiAobnVsbCA9PT0gaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHN0ciA/IFwibnVsbFwiIDogbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodW5kZWZpbmVkID09PSBpbnB1dCkge1xuICAgICAgICByZXR1cm4gc3RyID8gXCJ1bmRlZmluZWRcIiA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXQgIT09IGlucHV0KSB7XG4gICAgICAgIHJldHVybiBzdHIgPyBcIm5hblwiIDogTmFOO1xuICAgIH1cblxuICAgIHJldHVybiBzdHIgPyBpbnB1dC5jb25zdHJ1Y3Rvci5uYW1lLnRvTG93ZXJDYXNlKCkgOiBpbnB1dC5jb25zdHJ1Y3Rvcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHlwcHk7Il19
