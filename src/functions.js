const v8 = require('v8');
const fs = require('fs')

/**
 * forEach in reverse to walk backward through an array
 */
Object.defineProperty(Array.prototype, 'forEachRev', {
  value: function (callback) {
    for (let i = this.length - 1; i >= 0; i--) {
      element = this[i]
      callback(element, i)
    }
  }
})

/**
 * find the first occurance of int in array
 */
Object.defineProperty(Array.prototype, 'findint', {
  value: function (value) {
    let found = false
    for (let i = 0; i < this.length; i++) {
      element = this[i]
      if (element === value) {
        found = element
        break
      }
    }
    return found
  }
})

/**
 * Remove element(s) from array
 * @returns array
 */
Array.prototype.remove = function () {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L]
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1)
    }
  }
  return this
}

/**
 * Choose a random element from an array.
 * @param {*} array 
 * @returns 
 */
Array.choice = function (array) {
  return array[Math.floor(Math.random() * array.length)]
}

Array.max = function (array) {
  return Math.max.apply(Math, array)
};
/**
 * 
 * Constrains a value between a minimum and maximum value.
 *
 * @method constrain
 * @param  {Number} n    number to constrain
 * @param  {Number} low  minimum limit
 * @param  {Number} high maximum limit
 * @return {Number}      constrained number
 */
let constrain = function (n, low, high) {
  return Math.max(Math.min(n, high), low);
};

/**
 * Re-maps a number from one range to another.
 * @param  {Number} n  the incoming value to be converted
 * @param  {Number} start1 lower bound of the value's current range
 * @param  {Number} stop1  upper bound of the value's current range
 * @param  {Number} start2 lower bound of the value's target range
 * @param  {Number} stop2  upper bound of the value's target range
 * @param  {Boolean} [withinBounds] constrain the value to the newly mapped range
 * @return {Number}        remapped number
 * @returns 
 */
Math.map = function (n, start1, stop1, start2, stop2, withinBounds) {
  const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
};

global.random = function (min, max) {
  let rand = Math.random();
  if (typeof min === 'undefined') {
    return rand;
  } else if (typeof max === 'undefined') {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max - min) + min;
  }
};

global.randint = function randint(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

/**
 * 
 * @param {string} msg string to log
 * @param {object} options
 * @param {string} options.level `info` | `debug` | `error`
 * @param {string} options.namespace an assigned namespace to segment the logs   
 * @param {number} options.show `false` - hide | `true` - display
 * @global`LOGGING` : required global variable that sets logging scope 
 * @global `all`, `none`, `file`, `info`, `debug`, `error` , `[...namespace]`
 */
global.log = function log(msg, { namespace = 'default', level = 'info', show = true } = {}) {
  if (show === true) console.log(msg)
  if (LOGGING === 'file') {
    let entry = '\n' + `${level} - ${new Date().toLocaleString()} - ${msg}`
    fs.appendFile('./logs/log.txt', entry, (err) => {
      if (err) console.log(err)
    })
  }
  else if (LOGGING === 'info' && level === 'info' && show === true) console.log(msg)
  else if (LOGGING === 'debug' && level === 'debug' && show === true) console.debug(msg)
  else if (LOGGING === 'error' && level === 'error' && show === true) console.error(msg)
  else if (LOGGING === 'all' && show === true) console.log(msg)
  else if (LOGGING === namespace && show === true) console.log(msg)
  else if (Array.isArray(LOGGING) && show === true) {
    let found = LOGGING.find(namedspace => namespace === namedspace)
    if (found) console.log(msg)
  }
}
global.getObject = function getObject(string) {
  try {
    return JSON.parse(string)
  } catch (error) {
    return false
  }
}

global.len = function len(object) {
  return Object.keys(object).length
}

global.clone = function clone(object) {
  return v8.deserialize(v8.serialize(object))
}
