var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// index.js
var require_auto_parse = __commonJS({
  "index.js"(exports, module) {
    module.exports = autoParse;
    var plugins = [];
    var globalOnError = null;
    function isType(value, type) {
      if (typeof type === "string") {
        if (type.toLowerCase() === "array")
          return Array.isArray(value);
        if (type.toLowerCase() === "null")
          return value === null;
        if (type.toLowerCase() === "undefined")
          return value === void 0;
        return typeof value === type.toLowerCase();
      }
      if (type === Array)
        return Array.isArray(value);
      if (type === Number)
        return typeof value === "number" && !Number.isNaN(value);
      if (type === String)
        return typeof value === "string";
      if (type === Boolean)
        return typeof value === "boolean";
      if (type === Object)
        return typeof value === "object" && value !== null && !Array.isArray(value);
      if (type === null)
        return value === null;
      return value instanceof type;
    }
    function runPlugins(value, type, options) {
      for (let i = 0; i < plugins.length; i++) {
        const res = plugins[i](value, type, options);
        if (res !== void 0)
          return res;
      }
      return void 0;
    }
    function getTypeName(value) {
      if (value === null)
        return "null";
      if (Array.isArray(value))
        return "array";
      if (value instanceof Date)
        return "date";
      if (value instanceof RegExp)
        return "regexp";
      if (typeof value === "bigint")
        return "bigint";
      if (typeof value === "symbol")
        return "symbol";
      return typeof value;
    }
    function returnIfAllowed(val, options, fallback) {
      if (options && Array.isArray(options.allowedTypes)) {
        const type = getTypeName(val);
        if (!options.allowedTypes.includes(type)) {
          return fallback;
        }
      }
      return val;
    }
    autoParse.use = function(fn) {
      if (typeof fn === "function")
        plugins.push(fn);
    };
    autoParse.setErrorHandler = function(fn) {
      globalOnError = typeof fn === "function" ? fn : null;
    };
    var _stripCache = /* @__PURE__ */ new Map();
    var QUOTE_RE = /['"]/g;
    function getStripRegex(chars) {
      let re = _stripCache.get(chars);
      if (!re) {
        const escaped = chars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        re = new RegExp("^[" + escaped + "]+");
        _stripCache.set(chars, re);
      }
      return re;
    }
    function stripTrimLower(value, options = {}) {
      if (options.stripStartChars && typeof value === "string") {
        const chars = Array.isArray(options.stripStartChars) ? options.stripStartChars.join("") : String(options.stripStartChars);
        value = value.replace(getStripRegex(chars), "");
      }
      return value.replace(QUOTE_RE, "").trim().toLowerCase();
    }
    function toBoolean(value, options) {
      return checkBoolean(value, options) || false;
    }
    function checkBoolean(value, options) {
      if (!value) {
        return false;
      }
      if (typeof value === "number" || typeof value === "boolean") {
        return !!value;
      }
      value = stripTrimLower(value, options);
      const extras = options && options.booleanSynonyms;
      if (value === "true" || value === "1" || extras && (value === "yes" || value === "on"))
        return true;
      if (value === "false" || value === "0" || extras && (value === "no" || value === "off"))
        return false;
      return null;
    }
    function parseObject(value, options) {
      if (Array.isArray(value)) {
        return value.map(function(n, key) {
          return autoParse(n, options);
        });
      } else if (typeof value === "object" || value.constructor === void 0) {
        for (const n in value) {
          value[n] = autoParse(value[n], options);
        }
        return value;
      }
      return {};
    }
    function parseFunction(value, options) {
      return autoParse(value(), options);
    }
    var CURRENCY_SYMBOLS = {
      "$": "USD",
      "\u20AC": "EUR",
      "\xA3": "GBP",
      "\xA5": "JPY",
      "A$": "AUD",
      "C$": "CAD",
      "CHF": "CHF",
      "HK$": "HKD",
      "\u20B9": "INR",
      "\u20A9": "KRW"
    };
    function parseCurrencyString(str, options) {
      const symbols = Object.assign({}, CURRENCY_SYMBOLS, options && options.currencySymbols);
      for (const sym of Object.keys(symbols)) {
        const re = new RegExp("^" + sym.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "\\s?([0-9]+(?:[.,][0-9]+)?)$");
        const m = re.exec(str);
        if (m) {
          const num = parseFloat(m[1].replace(",", "."));
          if (options && options.currencyAsObject) {
            return { value: num, currency: symbols[sym] };
          }
          return num;
        }
      }
      return null;
    }
    function parsePercentString(str, options) {
      const m = /^([-+]?\d+(?:\.\d+)?)%$/.exec(str);
      if (m) {
        const val = Number(m[1]) / 100;
        if (options && options.percentAsObject)
          return { value: val, percent: true };
        return val;
      }
      return null;
    }
    function parseUnitString(str) {
      if (/^0[box]/i.test(str))
        return null;
      const m = /^(-?\d+(?:\.\d+)?)([a-z%]+)$/i.exec(str);
      if (m)
        return { value: Number(m[1]), unit: m[2] };
      return null;
    }
    function parseRangeString(str, options) {
      const m = /^(-?\d+(?:\.\d+)?)\s*(?:\.\.|-)\s*(-?\d+(?:\.\d+)?)$/.exec(str);
      if (m) {
        const start = Number(m[1]);
        const end = Number(m[2]);
        if (options && options.rangeAsObject)
          return { start, end };
        const arr = [];
        const step = start <= end ? 1 : -1;
        for (let i = start; step > 0 ? i <= end : i >= end; i += step)
          arr.push(i);
        return arr;
      }
      return null;
    }
    function parseTypedArrayString(str, options) {
      const m = /^([A-Za-z0-9]+Array)\[(.*)\]$/.exec(str);
      if (m && typeof globalThis[m[1]] === "function") {
        const arr = autoParse(`[${m[2]}]`, options);
        if (Array.isArray(arr))
          return new globalThis[m[1]](arr);
      }
      return null;
    }
    function parseMapSetString(str, options) {
      if (/^Map:/i.test(str)) {
        const inner = str.slice(4).trim();
        const arr = autoParse(inner, options);
        return new Map(arr);
      }
      if (/^Set:/i.test(str)) {
        const inner = str.slice(4).trim();
        const arr = autoParse(inner, options);
        return new Set(arr);
      }
      return null;
    }
    function parseDateTimeString(str) {
      const iso = /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;
      if (iso.test(str)) {
        const d = new Date(str);
        if (!Number.isNaN(d.getTime()))
          return d;
      }
      let m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*([AP]M))?)?$/i.exec(str);
      if (m) {
        let [, month, day, year, h, min, sec, ap] = m;
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        if (h !== void 0) {
          h = Number(h);
          if (ap) {
            ap = ap.toLowerCase();
            if (ap === "pm" && h < 12)
              h += 12;
            if (ap === "am" && h === 12)
              h = 0;
          }
          date.setHours(h, Number(min), Number(sec || 0), 0);
        }
        return date;
      }
      m = /^(\d{1,2})-(\d{1,2})-(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(str);
      if (m) {
        const [, day, month, year, h, min, sec] = m;
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        if (h !== void 0) {
          date.setHours(Number(h), Number(min), Number(sec || 0), 0);
        }
        return date;
      }
      m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*([AP]M))?$/i.exec(str);
      if (m) {
        let [, h, min, sec, ap] = m;
        h = Number(h);
        if (ap) {
          ap = ap.toLowerCase();
          if (ap === "pm" && h < 12)
            h += 12;
          if (ap === "am" && h === 12)
            h = 0;
        }
        const date = /* @__PURE__ */ new Date();
        date.setHours(h, Number(min), Number(sec || 0), 0);
        return date;
      }
      return null;
    }
    function parseUrlString(str) {
      try {
        return new URL(str);
      } catch (e) {
        return null;
      }
    }
    function parseFilePathString(str) {
      const re = /^(?:[A-Za-z]:[\\/]|\\\\|\.{1,2}[\\/]|~[\\/]|\/)/;
      if (re.test(str)) {
        return str.replace(/\\+/g, "/").replace(/\/+/g, "/");
      }
      return null;
    }
    function parseExpressionString(str) {
      if (/^[0-9+\-*/() %.]+$/.test(str) && /[+\-*/()%]/.test(str)) {
        try {
          return Function("return (" + str + ")")();
        } catch (e) {
        }
      }
      return null;
    }
    function parseFunctionString(str) {
      if (/^\s*(\(?\w*\)?\s*=>)/.test(str)) {
        try {
          return Function("return (" + str + ")")();
        } catch (e) {
        }
      }
      return null;
    }
    function expandEnvVars(str) {
      return str.replace(/\$([A-Z0-9_]+)/gi, function(m, name) {
        return process.env[name] || "";
      });
    }
    function parseType(value, type, options = {}) {
      let typeName = type;
      try {
        if (value && value.constructor === type || isType(value, type) && typeName !== "object" && typeName !== "array") {
          return value;
        }
        if (type && type.name) {
          typeName = type.name.toLowerCase();
        }
        typeName = stripTrimLower(typeName);
        switch (typeName) {
          case "string":
            if (typeof value === "object")
              return JSON.stringify(value);
            return String(value);
          case "function":
            if (isType(value, Function)) {
              return value;
            }
            return function(cb) {
              if (typeof cb === "function") {
                cb(value);
              }
              return value;
            };
          case "date":
            return new Date(value);
          case "object":
            let jsonParsed;
            if (typeof value === "string" && /^['"]?[[{]/.test(value.trim())) {
              try {
                jsonParsed = JSON.parse(value);
              } catch (e) {
              }
            }
            if (isType(jsonParsed, Object) || isType(jsonParsed, Array)) {
              return autoParse(jsonParsed, options);
            } else if (!isType(jsonParsed, "undefined")) {
              return {};
            }
            return parseObject(value, options);
          case "boolean":
            return toBoolean(value, options);
          case "number":
            if (options.parseCommaNumbers && typeof value === "string") {
              const normalized = value.replace(/,/g, "");
              if (!Number.isNaN(Number(normalized)))
                return Number(normalized);
            }
            return Number(value);
          case "bigint":
            return BigInt(value);
          case "symbol":
            return Symbol(value);
          case "undefined":
            return void 0;
          case "null":
            return null;
          case "array":
            return [value];
          case "map":
            return new Map(autoParse(value, options));
          case "set":
            return new Set(autoParse(value, options));
          case "url":
            return new URL(value);
          case "path":
          case "filepath":
            return parseFilePathString(String(value)) || String(value);
          default:
            if (typeof type === "function") {
              if (/Array$/.test(type.name)) {
                const arr = autoParse(value, options);
                if (Array.isArray(arr))
                  return new type(arr);
              }
              return new type(value);
            }
            throw new Error("Unsupported type.");
        }
      } catch (err) {
        if (options && typeof options.onError === "function") {
          return returnIfAllowed(options.onError(err, value, type), options, value);
        }
        if (typeof globalOnError === "function") {
          return returnIfAllowed(globalOnError(err, value, type), options, value);
        }
        throw err;
      }
    }
    function autoParse(value, typeOrOptions) {
      let type;
      let options;
      if (typeOrOptions && typeof typeOrOptions === "object" && !Array.isArray(typeOrOptions) && !(typeOrOptions instanceof Function)) {
        options = typeOrOptions;
        type = options.type;
      } else {
        type = typeOrOptions;
        options = {};
      }
      try {
        const pluginVal = runPlugins(value, type, options);
        if (pluginVal !== void 0) {
          return returnIfAllowed(pluginVal, options, value);
        }
        if (type) {
          return returnIfAllowed(parseType(value, type, options), options, value);
        }
        const originalValue = value;
        if (typeof value === "string" && options.stripStartChars) {
          const chars = Array.isArray(options.stripStartChars) ? options.stripStartChars.join("") : String(options.stripStartChars);
          value = value.replace(getStripRegex(chars), "");
        }
        if (value === null) {
          return returnIfAllowed(null, options, originalValue);
        }
        if (value === void 0) {
          return returnIfAllowed(void 0, options, originalValue);
        }
        if (value instanceof Date || value instanceof RegExp) {
          return returnIfAllowed(value, options, originalValue);
        }
        if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") {
          return returnIfAllowed(value, options, originalValue);
        }
        if (typeof value === "function") {
          return returnIfAllowed(parseFunction(value, options), options, originalValue);
        }
        if (typeof value === "object") {
          return returnIfAllowed(parseObject(value, options), options, originalValue);
        }
        if (value === "NaN") {
          return returnIfAllowed(NaN, options, originalValue);
        }
        let jsonParsed = null;
        const trimmed = typeof value === "string" ? value.trim() : "";
        if (options.expandEnv) {
          const expanded = expandEnvVars(trimmed);
          if (expanded !== trimmed) {
            return returnIfAllowed(autoParse(expanded, options), options, originalValue);
          }
        }
        let mapSet;
        if (options.parseMapSets) {
          mapSet = parseMapSetString(trimmed, options);
          if (mapSet)
            return returnIfAllowed(mapSet, options, originalValue);
        }
        if (/^['"]?[[{]/.test(trimmed)) {
          try {
            jsonParsed = JSON.parse(trimmed);
          } catch (e) {
            try {
              jsonParsed = JSON.parse(
                trimmed.replace(/(\\\\")|(\\")/gi, '"').replace(/(\\n|\\\\n)/gi, "").replace(/(^"|"$)|(^'|'$)/gi, "")
              );
            } catch (e2) {
              try {
                jsonParsed = JSON.parse(trimmed.replace(/'/gi, '"'));
              } catch (e3) {
              }
            }
          }
        }
        if (jsonParsed && typeof jsonParsed === "object") {
          return returnIfAllowed(autoParse(jsonParsed, options), options, originalValue);
        }
        if (options.parseTypedArrays) {
          const typedArr = parseTypedArrayString(trimmed, options);
          if (typedArr)
            return returnIfAllowed(typedArr, options, originalValue);
        }
        if (options.parseCurrency) {
          const currency = parseCurrencyString(trimmed, options);
          if (currency !== null)
            return returnIfAllowed(currency, options, originalValue);
        }
        if (options.parsePercent) {
          const percent = parsePercentString(trimmed, options);
          if (percent !== null)
            return returnIfAllowed(percent, options, originalValue);
        }
        if (options.parseUnits) {
          const unit = parseUnitString(trimmed);
          if (unit)
            return returnIfAllowed(unit, options, originalValue);
        }
        if (options.parseRanges) {
          const range = parseRangeString(trimmed, options);
          if (range)
            return returnIfAllowed(range, options, originalValue);
        }
        if (options.parseExpressions) {
          const expr = parseExpressionString(trimmed);
          if (expr !== null)
            return returnIfAllowed(expr, options, originalValue);
        }
        if (options.parseFunctionStrings) {
          const fn = parseFunctionString(trimmed);
          if (fn)
            return returnIfAllowed(fn, options, originalValue);
        }
        if (options.parseDates) {
          const dt = parseDateTimeString(trimmed);
          if (dt)
            return returnIfAllowed(dt, options, originalValue);
        }
        if (options.parseUrls) {
          const u = parseUrlString(trimmed);
          if (u)
            return returnIfAllowed(u, options, originalValue);
        }
        if (options.parseFilePaths) {
          const p = parseFilePathString(trimmed);
          if (p)
            return returnIfAllowed(p, options, originalValue);
        }
        value = stripTrimLower(trimmed, Object.assign({}, options, { stripStartChars: false }));
        if (value === "undefined" || value === "") {
          return returnIfAllowed(void 0, options, originalValue);
        }
        if (value === "null") {
          return returnIfAllowed(null, options, originalValue);
        }
        let numValue = value;
        if (options.parseCommaNumbers && typeof numValue === "string" && numValue.includes(",")) {
          const normalized = numValue.replace(/,/g, "");
          if (!Number.isNaN(Number(normalized))) {
            numValue = normalized;
          }
        }
        const num = Number(numValue);
        if (!Number.isNaN(num)) {
          if (options.preserveLeadingZeros && /^0+\d+$/.test(value)) {
            return returnIfAllowed(String(originalValue), options, originalValue);
          }
          return returnIfAllowed(num, options, originalValue);
        }
        const boo = checkBoolean(value, options);
        if (boo !== null) {
          return returnIfAllowed(boo, options, originalValue);
        }
        return returnIfAllowed(String(originalValue), options, originalValue);
      } catch (err) {
        if (options && typeof options.onError === "function") {
          return returnIfAllowed(options.onError(err, value, type), options, value);
        }
        if (typeof globalOnError === "function") {
          return returnIfAllowed(globalOnError(err, value, type), options, value);
        }
        throw err;
      }
    }
  }
});
export default require_auto_parse();
