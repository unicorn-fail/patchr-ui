/*!
 * Patchr UI v0.1.0
 * Copyright (c) 2016-2020 Mark Carver (https://www.drupal.org/u/markcarver)
 * Licensed under MIT (https://github.com/unicorn-fail/patchr-ui/blob/latest/LICENSE-MIT)
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PatchrUi = f()}})(function(){
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Global imports.
var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = camelize;
var regExp = /[-\s]+(.)?/g;

/**
 * Convert dash separated strings to camel cased.
 *
 * @param {String} str
 * @return {String}
 */
function camelize(str) {
  return str.replace(regExp, toUpper);
}

function toUpper(match, c) {
  return c ? c.toUpperCase() : '';
}
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportedValue = exports.supportedProperty = exports.prefix = undefined;

var _prefix = require('./prefix');

var _prefix2 = _interopRequireDefault(_prefix);

var _supportedProperty = require('./supported-property');

var _supportedProperty2 = _interopRequireDefault(_supportedProperty);

var _supportedValue = require('./supported-value');

var _supportedValue2 = _interopRequireDefault(_supportedValue);


exports['default'] = {
  prefix: _prefix2['default'],
  supportedProperty: _supportedProperty2['default'],
  supportedValue: _supportedValue2['default']
}; /**
    * CSS Vendor prefix detection and property feature testing.
    *
    * @copyright Oleg Slobodskoi 2015
    * @website https://github.com/jsstyles/css-vendor
    * @license MIT
    */

exports.prefix = _prefix2['default'];
exports.supportedProperty = _supportedProperty2['default'];
exports.supportedValue = _supportedValue2['default'];
},{"./prefix":3,"./supported-property":4,"./supported-value":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isInBrowser = require('is-in-browser');

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);


var js = ''; /**
              * Export javascript style and css style vendor prefixes.
              * Based on "transform" support test.
              */

var css = '';

// We should not do anything if required serverside.
if (_isInBrowser2['default']) {
  // Order matters. We need to check Webkit the last one because
  // other vendors use to add Webkit prefixes to some properties
  var jsCssMap = {
    Moz: '-moz-',
    // IE did it wrong again ...
    ms: '-ms-',
    O: '-o-',
    Webkit: '-webkit-'
  };
  var style = document.createElement('p').style;
  var testProp = 'Transform';

  for (var key in jsCssMap) {
    if (key + testProp in style) {
      js = key;
      css = jsCssMap[key];
      break;
    }
  }
}

/**
 * Vendor prefix string for the current browser.
 *
 * @type {{js: String, css: String}}
 * @api public
 */
exports['default'] = { js: js, css: css };
},{"is-in-browser":8}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = supportedProperty;

var _isInBrowser = require('is-in-browser');

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

var _prefix = require('./prefix');

var _prefix2 = _interopRequireDefault(_prefix);

var _camelize = require('./camelize');

var _camelize2 = _interopRequireDefault(_camelize);


var el = void 0;
var cache = {};

if (_isInBrowser2['default']) {
  el = document.createElement('p');

  /**
   * We test every property on vendor prefix requirement.
   * Once tested, result is cached. It gives us up to 70% perf boost.
   * http://jsperf.com/element-style-object-access-vs-plain-object
   *
   * Prefill cache with known css properties to reduce amount of
   * properties we need to feature test at runtime.
   * http://davidwalsh.name/vendor-prefix
   */
  var computed = window.getComputedStyle(document.documentElement, '');
  for (var key in computed) {
    if (!isNaN(key)) cache[computed[key]] = computed[key];
  }
}

/**
 * Test if a property is supported, returns supported property with vendor
 * prefix if required. Returns `false` if not supported.
 *
 * @param {String} prop dash separated
 * @return {String|Boolean}
 * @api public
 */
function supportedProperty(prop) {
  // For server-side rendering.
  if (!el) return prop;

  // We have not tested this prop yet, lets do the test.
  if (cache[prop] != null) return cache[prop];

  // Camelization is required because we can't test using
  // css syntax for e.g. in FF.
  // Test if property is supported as it is.
  if ((0, _camelize2['default'])(prop) in el.style) {
    cache[prop] = prop;
  }
  // Test if property is supported with vendor prefix.
  else if (_prefix2['default'].js + (0, _camelize2['default'])('-' + prop) in el.style) {
      cache[prop] = _prefix2['default'].css + prop;
    } else {
      cache[prop] = false;
    }

  return cache[prop];
}
},{"./camelize":1,"./prefix":3,"is-in-browser":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = supportedValue;

var _isInBrowser = require('is-in-browser');

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

var _prefix = require('./prefix');

var _prefix2 = _interopRequireDefault(_prefix);


var cache = {};
var el = void 0;

if (_isInBrowser2['default']) el = document.createElement('p');

/**
 * Returns prefixed value if needed. Returns `false` if value is not supported.
 *
 * @param {String} property
 * @param {String} value
 * @return {String|Boolean}
 * @api public
 */
function supportedValue(property, value) {
  // For server-side rendering.
  if (!el) return value;

  // It is a string or a number as a string like '1'.
  // We want only prefixable values here.
  if (typeof value !== 'string' || !isNaN(parseInt(value, 10))) return value;

  var cacheKey = property + value;

  if (cache[cacheKey] != null) return cache[cacheKey];

  // IE can even throw an error in some cases, for e.g. style.content = 'bar'
  try {
    // Test value as it is.
    el.style[property] = value;
  } catch (err) {
    cache[cacheKey] = false;
    return false;
  }

  // Value is supported as it is.
  if (el.style[property] !== '') {
    cache[cacheKey] = value;
  } else {
    // Test value with vendor prefix.
    value = _prefix2['default'].css + value;

    // Hardcode test to convert "flex" to "-ms-flexbox" for IE10.
    if (value === '-ms-flex') value = '-ms-flexbox';

    el.style[property] = value;

    // Value is supported with vendor prefix.
    if (el.style[property] !== '') cache[cacheKey] = value;
  }

  if (!cache[cacheKey]) cache[cacheKey] = false;

  // Reset style value.
  el.style[property] = '';

  return cache[cacheKey];
}
},{"./prefix":3,"is-in-browser":8}],6:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }

});

},{}],7:[function(require,module,exports){
/*
 * Hamster.js v1.1.2
 * (c) 2013 Monospaced http://monospaced.com
 * License: MIT
 */

(function(window, document){
'use strict';

/**
 * Hamster
 * use this to create instances
 * @returns {Hamster.Instance}
 * @constructor
 */
var Hamster = function(element) {
  return new Hamster.Instance(element);
};

// default event name
Hamster.SUPPORT = 'wheel';

// default DOM methods
Hamster.ADD_EVENT = 'addEventListener';
Hamster.REMOVE_EVENT = 'removeEventListener';
Hamster.PREFIX = '';

// until browser inconsistencies have been fixed...
Hamster.READY = false;

Hamster.Instance = function(element){
  if (!Hamster.READY) {
    // fix browser inconsistencies
    Hamster.normalise.browser();

    // Hamster is ready...!
    Hamster.READY = true;
  }

  this.element = element;

  // store attached event handlers
  this.handlers = [];

  // return instance
  return this;
};

/**
 * create new hamster instance
 * all methods should return the instance itself, so it is chainable.
 * @param   {HTMLElement}       element
 * @returns {Hamster.Instance}
 * @constructor
 */
Hamster.Instance.prototype = {
  /**
   * bind events to the instance
   * @param   {Function}    handler
   * @param   {Boolean}     useCapture
   * @returns {Hamster.Instance}
   */
  wheel: function onEvent(handler, useCapture){
    Hamster.event.add(this, Hamster.SUPPORT, handler, useCapture);

    // handle MozMousePixelScroll in older Firefox
    if (Hamster.SUPPORT === 'DOMMouseScroll') {
      Hamster.event.add(this, 'MozMousePixelScroll', handler, useCapture);
    }

    return this;
  },

  /**
   * unbind events to the instance
   * @param   {Function}    handler
   * @param   {Boolean}     useCapture
   * @returns {Hamster.Instance}
   */
  unwheel: function offEvent(handler, useCapture){
    // if no handler argument,
    // unbind the last bound handler (if exists)
    if (handler === undefined && (handler = this.handlers.slice(-1)[0])) {
      handler = handler.original;
    }

    Hamster.event.remove(this, Hamster.SUPPORT, handler, useCapture);

    // handle MozMousePixelScroll in older Firefox
    if (Hamster.SUPPORT === 'DOMMouseScroll') {
      Hamster.event.remove(this, 'MozMousePixelScroll', handler, useCapture);
    }

    return this;
  }
};

Hamster.event = {
  /**
   * cross-browser 'addWheelListener'
   * @param   {Instance}    hamster
   * @param   {String}      eventName
   * @param   {Function}    handler
   * @param   {Boolean}     useCapture
   */
  add: function add(hamster, eventName, handler, useCapture){
    // store the original handler
    var originalHandler = handler;

    // redefine the handler
    handler = function(originalEvent){

      if (!originalEvent) {
        originalEvent = window.event;
      }

      // create a normalised event object,
      // and normalise "deltas" of the mouse wheel
      var event = Hamster.normalise.event(originalEvent),
          delta = Hamster.normalise.delta(originalEvent);

      // fire the original handler with normalised arguments
      return originalHandler(event, delta[0], delta[1], delta[2]);

    };

    // cross-browser addEventListener
    hamster.element[Hamster.ADD_EVENT](Hamster.PREFIX + eventName, handler, useCapture || false);

    // store original and normalised handlers on the instance
    hamster.handlers.push({
      original: originalHandler,
      normalised: handler
    });
  },

  /**
   * removeWheelListener
   * @param   {Instance}    hamster
   * @param   {String}      eventName
   * @param   {Function}    handler
   * @param   {Boolean}     useCapture
   */
  remove: function remove(hamster, eventName, handler, useCapture){
    // find the normalised handler on the instance
    var originalHandler = handler,
        lookup = {},
        handlers;
    for (var i = 0, len = hamster.handlers.length; i < len; ++i) {
      lookup[hamster.handlers[i].original] = hamster.handlers[i];
    }
    handlers = lookup[originalHandler];
    handler = handlers.normalised;

    // cross-browser removeEventListener
    hamster.element[Hamster.REMOVE_EVENT](Hamster.PREFIX + eventName, handler, useCapture || false);

    // remove original and normalised handlers from the instance
    for (var h in hamster.handlers) {
      if (hamster.handlers[h] == handlers) {
        hamster.handlers.splice(h, 1);
        break;
      }
    }
  }
};

/**
 * these hold the lowest deltas,
 * used to normalise the delta values
 * @type {Number}
 */
var lowestDelta,
    lowestDeltaXY;

Hamster.normalise = {
  /**
   * fix browser inconsistencies
   */
  browser: function normaliseBrowser(){
    // detect deprecated wheel events
    if (!('onwheel' in document || document.documentMode >= 9)) {
      Hamster.SUPPORT = document.onmousewheel !== undefined ?
                        'mousewheel' : // webkit and IE < 9 support at least "mousewheel"
                        'DOMMouseScroll'; // assume remaining browsers are older Firefox
    }

    // detect deprecated event model
    if (!window.addEventListener) {
      // assume IE < 9
      Hamster.ADD_EVENT = 'attachEvent';
      Hamster.REMOVE_EVENT = 'detachEvent';
      Hamster.PREFIX = 'on';
    }

  },

  /**
   * create a normalised event object
   * @param   {Function}    originalEvent
   * @returns {Object}      event
   */
   event: function normaliseEvent(originalEvent){
    var event = {
          // keep a reference to the original event object
          originalEvent: originalEvent,
          target: originalEvent.target || originalEvent.srcElement,
          type: 'wheel',
          deltaMode: originalEvent.type === 'MozMousePixelScroll' ? 0 : 1,
          deltaX: 0,
          deltaZ: 0,
          preventDefault: function(){
            if (originalEvent.preventDefault) {
              originalEvent.preventDefault();
            } else {
              originalEvent.returnValue = false;
            }
          },
          stopPropagation: function(){
            if (originalEvent.stopPropagation) {
              originalEvent.stopPropagation();
            } else {
              originalEvent.cancelBubble = false;
            }
          }
        };

    // calculate deltaY (and deltaX) according to the event

    // 'mousewheel'
    if (originalEvent.wheelDelta) {
      event.deltaY = - 1/40 * originalEvent.wheelDelta;
    }
    // webkit
    if (originalEvent.wheelDeltaX) {
      event.deltaX = - 1/40 * originalEvent.wheelDeltaX;
    }

    // 'DomMouseScroll'
    if (originalEvent.detail) {
      event.deltaY = originalEvent.detail;
    }

    return event;
  },

  /**
   * normalise 'deltas' of the mouse wheel
   * @param   {Function}    originalEvent
   * @returns {Array}       deltas
   */
  delta: function normaliseDelta(originalEvent){
    var delta = 0,
      deltaX = 0,
      deltaY = 0,
      absDelta = 0,
      absDeltaXY = 0,
      fn;

    // normalise deltas according to the event

    // 'wheel' event
    if (originalEvent.deltaY) {
      deltaY = originalEvent.deltaY * -1;
      delta  = deltaY;
    }
    if (originalEvent.deltaX) {
      deltaX = originalEvent.deltaX;
      delta  = deltaX * -1;
    }

    // 'mousewheel' event
    if (originalEvent.wheelDelta) {
      delta = originalEvent.wheelDelta;
    }
    // webkit
    if (originalEvent.wheelDeltaY) {
      deltaY = originalEvent.wheelDeltaY;
    }
    if (originalEvent.wheelDeltaX) {
      deltaX = originalEvent.wheelDeltaX * -1;
    }

    // 'DomMouseScroll' event
    if (originalEvent.detail) {
      delta = originalEvent.detail * -1;
    }

    // Don't return NaN
    if (delta === 0) {
      return [0, 0, 0];
    }

    // look for lowest delta to normalize the delta values
    absDelta = Math.abs(delta);
    if (!lowestDelta || absDelta < lowestDelta) {
      lowestDelta = absDelta;
    }
    absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
    if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
      lowestDeltaXY = absDeltaXY;
    }

    // convert deltas to whole numbers
    fn = delta > 0 ? 'floor' : 'ceil';
    delta  = Math[fn](delta / lowestDelta);
    deltaX = Math[fn](deltaX / lowestDeltaXY);
    deltaY = Math[fn](deltaY / lowestDeltaXY);

    return [delta, deltaX, deltaY];
  }
};

if (typeof window.define === 'function' && window.define.amd) {
  // AMD
  window.define('hamster', [], function(){
    return Hamster;
  });
} else if (typeof exports === 'object') {
  // CommonJS
  module.exports = Hamster;
} else {
  // Browser global
  window.Hamster = Hamster;
}

})(window, window.document);

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});


var isBrowser = exports.isBrowser = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && (typeof document === "undefined" ? "undefined" : _typeof(document)) === 'object' && document.nodeType === 9;

exports.default = isBrowser;
},{}],9:[function(require,module,exports){
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Navigo", [], factory);
	else if(typeof exports === 'object')
		exports["Navigo"] = factory();
	else
		root["Navigo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function isPushStateAvailable() {
	  return !!(typeof window !== 'undefined' && window.history && window.history.pushState);
	}
	
	function Navigo(r, useHash, hash) {
	  this.root = null;
	  this._routes = [];
	  this._useHash = useHash;
	  this._hash = typeof hash === 'undefined' ? '#' : hash;
	  this._paused = false;
	  this._destroyed = false;
	  this._lastRouteResolved = null;
	  this._notFoundHandler = null;
	  this._defaultHandler = null;
	  this._usePushState = !useHash && isPushStateAvailable();
	  this._onLocationChange = this._onLocationChange.bind(this);
	  this._genericHooks = null;
	  this._historyAPIUpdateMethod = 'pushState';
	
	  if (r) {
	    this.root = useHash ? r.replace(/\/$/, '/' + this._hash) : r.replace(/\/$/, '');
	  } else if (useHash) {
	    this.root = this._cLoc().split(this._hash)[0].replace(/\/$/, '/' + this._hash);
	  }
	
	  this._listen();
	  this.updatePageLinks();
	}
	
	function clean(s) {
	  if (s instanceof RegExp) return s;
	  return s.replace(/\/+$/, '').replace(/^\/+/, '^/');
	}
	
	function regExpResultToParams(match, names) {
	  if (names.length === 0) return null;
	  if (!match) return null;
	  return match.slice(1, match.length).reduce(function (params, value, index) {
	    if (params === null) params = {};
	    params[names[index]] = decodeURIComponent(value);
	    return params;
	  }, null);
	}
	
	function replaceDynamicURLParts(route) {
	  var paramNames = [],
	      regexp;
	
	  if (route instanceof RegExp) {
	    regexp = route;
	  } else {
	    regexp = new RegExp(route.replace(Navigo.PARAMETER_REGEXP, function (full, dots, name) {
	      paramNames.push(name);
	      return Navigo.REPLACE_VARIABLE_REGEXP;
	    }).replace(Navigo.WILDCARD_REGEXP, Navigo.REPLACE_WILDCARD) + Navigo.FOLLOWED_BY_SLASH_REGEXP, Navigo.MATCH_REGEXP_FLAGS);
	  }
	  return { regexp: regexp, paramNames: paramNames };
	}
	
	function getUrlDepth(url) {
	  return url.replace(/\/$/, '').split('/').length;
	}
	
	function compareUrlDepth(urlA, urlB) {
	  return getUrlDepth(urlB) - getUrlDepth(urlA);
	}
	
	function findMatchedRoutes(url) {
	  var routes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	
	  return routes.map(function (route) {
	    var _replaceDynamicURLPar = replaceDynamicURLParts(clean(route.route)),
	        regexp = _replaceDynamicURLPar.regexp,
	        paramNames = _replaceDynamicURLPar.paramNames;
	
	    var match = url.replace(/^\/+/, '/').match(regexp);
	    var params = regExpResultToParams(match, paramNames);
	
	    return match ? { match: match, route: route, params: params } : false;
	  }).filter(function (m) {
	    return m;
	  });
	}
	
	function match(url, routes) {
	  return findMatchedRoutes(url, routes)[0] || false;
	}
	
	function root(url, routes) {
	  var matched = routes.map(function (route) {
	    return route.route === '' || route.route === '*' ? url : url.split(new RegExp(route.route + '($|\/)'))[0];
	  });
	  var fallbackURL = clean(url);
	
	  if (matched.length > 1) {
	    return matched.reduce(function (result, url) {
	      if (result.length > url.length) result = url;
	      return result;
	    }, matched[0]);
	  } else if (matched.length === 1) {
	    return matched[0];
	  }
	  return fallbackURL;
	}
	
	function isHashChangeAPIAvailable() {
	  return !!(typeof window !== 'undefined' && 'onhashchange' in window);
	}
	
	function extractGETParameters(url) {
	  return url.split(/\?(.*)?$/).slice(1).join('');
	}
	
	function getOnlyURL(url, useHash, hash) {
	  var onlyURL = url,
	      split;
	  var cleanGETParam = function cleanGETParam(str) {
	    return str.split(/\?(.*)?$/)[0];
	  };
	
	  if (typeof hash === 'undefined') {
	    // To preserve BC
	    hash = '#';
	  }
	
	  if (isPushStateAvailable() && !useHash) {
	    onlyURL = cleanGETParam(url).split(hash)[0];
	  } else {
	    split = url.split(hash);
	    onlyURL = split.length > 1 ? cleanGETParam(split[1]) : cleanGETParam(split[0]);
	  }
	
	  return onlyURL;
	}
	
	function manageHooks(handler, hooks, params) {
	  if (hooks && (typeof hooks === 'undefined' ? 'undefined' : _typeof(hooks)) === 'object') {
	    if (hooks.before) {
	      hooks.before(function () {
	        var shouldRoute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        if (!shouldRoute) return;
	        handler();
	        hooks.after && hooks.after(params);
	      }, params);
	    } else if (hooks.after) {
	      handler();
	      hooks.after && hooks.after(params);
	    }
	    return;
	  }
	  handler();
	};
	
	function isHashedRoot(url, useHash, hash) {
	  if (isPushStateAvailable() && !useHash) {
	    return false;
	  }
	
	  if (!url.match(hash)) {
	    return false;
	  }
	
	  var split = url.split(hash);
	
	  if (split.length < 2 || split[1] === '') {
	    return true;
	  }
	
	  return false;
	};
	
	Navigo.prototype = {
	  helpers: {
	    match: match,
	    root: root,
	    clean: clean,
	    getOnlyURL: getOnlyURL
	  },
	  navigate: function navigate(path, absolute) {
	    var to;
	
	    path = path || '';
	    if (this._usePushState) {
	      to = (!absolute ? this._getRoot() + '/' : '') + path.replace(/^\/+/, '/');
	      to = to.replace(/([^:])(\/{2,})/g, '$1/');
	      history[this._historyAPIUpdateMethod]({}, '', to);
	      this.resolve();
	    } else if (typeof window !== 'undefined') {
	      path = path.replace(new RegExp('^' + this._hash), '');
	      window.location.href = window.location.href.replace(/#$/, '').replace(new RegExp(this._hash + '.*$'), '') + this._hash + path;
	    }
	    return this;
	  },
	  on: function on() {
	    var _this = this;
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    if (typeof args[0] === 'function') {
	      this._defaultHandler = { handler: args[0], hooks: args[1] };
	    } else if (args.length >= 2) {
	      if (args[0] === '/') {
	        var func = args[1];
	
	        if (_typeof(args[1]) === 'object') {
	          func = args[1].uses;
	        }
	
	        this._defaultHandler = { handler: func, hooks: args[2] };
	      } else {
	        this._add(args[0], args[1], args[2]);
	      }
	    } else if (_typeof(args[0]) === 'object') {
	      var orderedRoutes = Object.keys(args[0]).sort(compareUrlDepth);
	
	      orderedRoutes.forEach(function (route) {
	        _this.on(route, args[0][route]);
	      });
	    }
	    return this;
	  },
	  off: function off(handler) {
	    if (this._defaultHandler !== null && handler === this._defaultHandler.handler) {
	      this._defaultHandler = null;
	    } else if (this._notFoundHandler !== null && handler === this._notFoundHandler.handler) {
	      this._notFoundHandler = null;
	    }
	    this._routes = this._routes.reduce(function (result, r) {
	      if (r.handler !== handler) result.push(r);
	      return result;
	    }, []);
	    return this;
	  },
	  notFound: function notFound(handler, hooks) {
	    this._notFoundHandler = { handler: handler, hooks: hooks };
	    return this;
	  },
	  resolve: function resolve(current) {
	    var _this2 = this;
	
	    var handler, m;
	    var url = (current || this._cLoc()).replace(this._getRoot(), '');
	
	    if (this._useHash) {
	      url = url.replace(new RegExp('^\/' + this._hash), '/');
	    }
	
	    var GETParameters = extractGETParameters(current || this._cLoc());
	    var onlyURL = getOnlyURL(url, this._useHash, this._hash);
	
	    if (this._paused) return false;
	
	    if (this._lastRouteResolved && onlyURL === this._lastRouteResolved.url && GETParameters === this._lastRouteResolved.query) {
	      if (this._lastRouteResolved.hooks && this._lastRouteResolved.hooks.already) {
	        this._lastRouteResolved.hooks.already(this._lastRouteResolved.params);
	      }
	      return false;
	    }
	
	    m = match(onlyURL, this._routes);
	
	    if (m) {
	      this._callLeave();
	      this._lastRouteResolved = {
	        url: onlyURL,
	        query: GETParameters,
	        hooks: m.route.hooks,
	        params: m.params,
	        name: m.route.name
	      };
	      handler = m.route.handler;
	      manageHooks(function () {
	        manageHooks(function () {
	          m.route.route instanceof RegExp ? handler.apply(undefined, _toConsumableArray(m.match.slice(1, m.match.length))) : handler(m.params, GETParameters);
	        }, m.route.hooks, m.params, _this2._genericHooks);
	      }, this._genericHooks, m.params);
	      return m;
	    } else if (this._defaultHandler && (onlyURL === '' || onlyURL === '/' || onlyURL === this._hash || isHashedRoot(onlyURL, this._useHash, this._hash))) {
	      manageHooks(function () {
	        manageHooks(function () {
	          _this2._callLeave();
	          _this2._lastRouteResolved = { url: onlyURL, query: GETParameters, hooks: _this2._defaultHandler.hooks };
	          _this2._defaultHandler.handler(GETParameters);
	        }, _this2._defaultHandler.hooks);
	      }, this._genericHooks);
	      return true;
	    } else if (this._notFoundHandler) {
	      manageHooks(function () {
	        manageHooks(function () {
	          _this2._callLeave();
	          _this2._lastRouteResolved = { url: onlyURL, query: GETParameters, hooks: _this2._notFoundHandler.hooks };
	          _this2._notFoundHandler.handler(GETParameters);
	        }, _this2._notFoundHandler.hooks);
	      }, this._genericHooks);
	    }
	    return false;
	  },
	  destroy: function destroy() {
	    this._routes = [];
	    this._destroyed = true;
	    clearTimeout(this._listeningInterval);
	    if (typeof window !== 'undefined') {
	      window.removeEventListener('popstate', this._onLocationChange);
	      window.removeEventListener('hashchange', this._onLocationChange);
	    }
	  },
	  updatePageLinks: function updatePageLinks() {
	    var self = this;
	
	    if (typeof document === 'undefined') return;
	
	    this._findLinks().forEach(function (link) {
	      if (!link.hasListenerAttached) {
	        link.addEventListener('click', function (e) {
	          var location = self.getLinkPath(link);
	
	          if (!self._destroyed) {
	            e.preventDefault();
	            self.navigate(location.replace(/\/+$/, '').replace(/^\/+/, '/'));
	          }
	        });
	        link.hasListenerAttached = true;
	      }
	    });
	  },
	  generate: function generate(name) {
	    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    var result = this._routes.reduce(function (result, route) {
	      var key;
	
	      if (route.name === name) {
	        result = route.route;
	        for (key in data) {
	          result = result.toString().replace(':' + key, data[key]);
	        }
	      }
	      return result;
	    }, '');
	
	    return this._useHash ? this._hash + result : result;
	  },
	  link: function link(path) {
	    return this._getRoot() + path;
	  },
	  pause: function pause() {
	    var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	    this._paused = status;
	    if (status) {
	      this._historyAPIUpdateMethod = 'replaceState';
	    } else {
	      this._historyAPIUpdateMethod = 'pushState';
	    }
	  },
	  resume: function resume() {
	    this.pause(false);
	  },
	  historyAPIUpdateMethod: function historyAPIUpdateMethod(value) {
	    if (typeof value === 'undefined') return this._historyAPIUpdateMethod;
	    this._historyAPIUpdateMethod = value;
	    return value;
	  },
	  disableIfAPINotAvailable: function disableIfAPINotAvailable() {
	    if (!isPushStateAvailable()) {
	      this.destroy();
	    }
	  },
	  lastRouteResolved: function lastRouteResolved() {
	    return this._lastRouteResolved;
	  },
	  getLinkPath: function getLinkPath(link) {
	    return link.pathname || link.getAttribute('href');
	  },
	  hooks: function hooks(_hooks) {
	    this._genericHooks = _hooks;
	  },
	
	  _add: function _add(route) {
	    var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	    var hooks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	
	    if (typeof route === 'string') {
	      route = encodeURI(route);
	    }
	    if ((typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object') {
	      this._routes.push({
	        route: route,
	        handler: handler.uses,
	        name: handler.as,
	        hooks: hooks || handler.hooks
	      });
	    } else {
	      this._routes.push({ route: route, handler: handler, hooks: hooks });
	    }
	    return this._add;
	  },
	  _getRoot: function _getRoot() {
	    if (this.root !== null) return this.root;
	    this.root = root(this._cLoc().split('?')[0], this._routes);
	    return this.root;
	  },
	  _listen: function _listen() {
	    var _this3 = this;
	
	    if (this._usePushState) {
	      window.addEventListener('popstate', this._onLocationChange);
	    } else if (isHashChangeAPIAvailable()) {
	      window.addEventListener('hashchange', this._onLocationChange);
	    } else {
	      var cached = this._cLoc(),
	          current = void 0,
	          _check = void 0;
	
	      _check = function check() {
	        current = _this3._cLoc();
	        if (cached !== current) {
	          cached = current;
	          _this3.resolve();
	        }
	        _this3._listeningInterval = setTimeout(_check, 200);
	      };
	      _check();
	    }
	  },
	  _cLoc: function _cLoc() {
	    if (typeof window !== 'undefined') {
	      if (typeof window.__NAVIGO_WINDOW_LOCATION_MOCK__ !== 'undefined') {
	        return window.__NAVIGO_WINDOW_LOCATION_MOCK__;
	      }
	      return clean(window.location.href);
	    }
	    return '';
	  },
	  _findLinks: function _findLinks() {
	    return [].slice.call(document.querySelectorAll('[data-navigo]'));
	  },
	  _onLocationChange: function _onLocationChange() {
	    this.resolve();
	  },
	  _callLeave: function _callLeave() {
	    if (this._lastRouteResolved && this._lastRouteResolved.hooks && this._lastRouteResolved.hooks.leave) {
	      this._lastRouteResolved.hooks.leave();
	    }
	  }
	};
	
	Navigo.PARAMETER_REGEXP = /([:*])(\w+)/g;
	Navigo.WILDCARD_REGEXP = /\*/g;
	Navigo.REPLACE_VARIABLE_REGEXP = '([^\/]+)';
	Navigo.REPLACE_WILDCARD = '(?:.*)';
	Navigo.FOLLOWED_BY_SLASH_REGEXP = '(?:\/$|$)';
	Navigo.MATCH_REGEXP_FLAGS = '';
	
	exports.default = Navigo;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;

},{}],10:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);



}).call(this,require('_process'))
},{"_process":11}],11:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],12:[function(require,module,exports){
(function (global){
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"performance-now":10}],13:[function(require,module,exports){
/**
 * Transition-end mapping
 */

var map = {
  'WebkitTransition' : 'webkitTransitionEnd',
  'MozTransition' : 'transitionend',
  'OTransition' : 'oTransitionEnd',
  'msTransition' : 'MSTransitionEnd',
  'transition' : 'transitionend'
};

/**
 * Expose `transitionend`
 */

var el = document.createElement('p');

for (var transition in map) {
  if (null != el.style[transition]) {
    module.exports = map[transition];
    break;
  }
}

},{}],14:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", {
  value: true
});


var _patchr = (typeof window !== "undefined" ? window['Patchr'] : typeof global !== "undefined" ? global['Patchr'] : null);

var _navigator = (typeof window !== "undefined" ? window['navigator'] : typeof global !== "undefined" ? global['navigator'] : null);

var _navigator2 = _interopRequireDefault(_navigator);





var Ajax = function (_Proxy) {
  _inherits(Ajax, _Proxy);

  /**
   * @class Ajax
   *
   * @param {Patchr} patchr
   *   The Patchr instance.
   * @param {Url|String} url
   *   The URL to load.
   */
  function Ajax(patchr, url) {
    _classCallCheck(this, Ajax);

    /**
     * Flag indicating if the request was aborted.
     *
     * @type {Boolean}
     */
    var _this = _possibleConstructorReturn(this, (Ajax.__proto__ || Object.getPrototypeOf(Ajax)).call(this, patchr));

    _this.aborted = false;

    /**
     * Flag indicating if the request is currently being sent.
     *
     * @type {Boolean}
     */
    _this.active = false;

    /**
     * The Url instance.
     *
     * @type {Url}
     */
    _this.url = _patchr.Url.create(url);

    /**
     * The XMLHttpRequest instance.
     *
     * @type {XMLHttpRequest}
     */
    _this.xhr = new XMLHttpRequest();

    _this.xhr.onabort = function (e) {
      return _this.abort(e);
    };

    // Progress handler.
    _this.xhr.onprogress = function (e) {
      return _this.progress(e);
    };

    // Error handler.
    _this.xhr.onerror = function (e) {
      return _this.complete(e);
    };

    // Success handler.
    _this.xhr.onload = function (e) {
      return _this.complete(e);
    };
    return _this;
  }

  /**
   * The abort handler.
   *
   * @param {Event} e
   *   The event.
   */


  _createClass(Ajax, [{
    key: 'abort',
    value: function abort(e) {
      this.aborted = true;
      this.active = false;
      this.emitError();
    }

    /**
     * The completion handler.
     *
     * @param {Event} e
     *   The event.
     */

  }, {
    key: 'complete',
    value: function complete(e) {
      if (this.xhr.readyState === 4) {
        this.active = false;
        if (this.xhr.status === 200) {
          var size = parseInt(this.xhr.getResponseHeader('content-length'), 10);
          if (!isNaN(size) && size) {
            this.url.size = size;
          }
          this.url.type = this.xhr.getResponseHeader('content-type') || null;
          this.emit('ajax.success', this, this.xhr.responseText);
        } else {
          this.emitError();
        }
      }
    }

    /**
     * Constructs an error message based on the current XHR state.
     */

  }, {
    key: 'emitError',
    value: function emitError() {
      var message = void 0;
      if (this.aborted) {
        message = this.t('The request has been aborted.');
      } else {
        message = this.xhr.status === 404 ? this.t('The requested file does not exist.') : this.t('Unable to load the request file.');
        message += _navigator2.default && _navigator2.default.onLine === false ? ' ' + this.t('You appear to be offline.') : '';
      }
      this.emit('ajax.error', this, new Error(message));
    }

    /**
     * The progress handler.
     *
     * @param {ProgressEvent<Event>} e
     *   The event.
     */

  }, {
    key: 'progress',
    value: function progress(e) {
      this.emit('ajax.progress', e.loaded, e.total);
    }

    /**
     * Sends the ajax request.
     *
     * @return {Promise}
     *   A promise object.
     */

  }, {
    key: 'send',
    value: function send() {
      var _this2 = this;

      var error = void 0;
      var success = void 0;
      var off = void 0;
      return this.promise(function (fulfill, reject) {
        // Bind the necessary listeners to handle the Promise fulfillment or
        // rejection based on whether it is for this Ajax instance.
        error = function error(e, ajax, _error) {
          return ajax === _this2 && reject(_error);
        };
        success = function success(e, ajax, content) {
          return ajax === _this2 && fulfill(content);
        };
        off = function off(content) {
          _this2.off('ajax.error', error);
          _this2.off('ajax.success', success);
          return content;
        };
        _this2.on('ajax.error', error);
        _this2.on('ajax.success', success);

        if (_this2.emit('ajax.beforeSend', _this2)) {
          _this2.active = true;
          _this2.xhr.open('GET', _this2.url, true);
          _this2.xhr.send();
        }
      }).then(off);
    }
  }]);

  return Ajax;
}(_patchr.Proxy);

exports.default = Ajax;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});



var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _InfinityItem = require('./InfinityItem');

var _InfinityItem2 = _interopRequireDefault(_InfinityItem);

var _Scrollable2 = require('./Scrollable');

var _Scrollable3 = _interopRequireDefault(_Scrollable2);






var Infinity = function (_Scrollable) {
  _inherits(Infinity, _Scrollable);

  /**
   * @class Infinity
   *
   * @param {Patchr} patchr
   *   The Patchr instance.
   * @param {HTMLElement} element
   *   The element to attach the this new Infinity instance to.
   * @param {Object} [options={}]
   *   Additional options to configure the new Infinity instance.
   */
  function Infinity(patchr, element, options) {
    _classCallCheck(this, Infinity);

    // Because we need to get any passed infinity options from the
    // Patchr instance, we cannot simply pass this to super above.
    var _this = _possibleConstructorReturn(this, (Infinity.__proto__ || Object.getPrototypeOf(Infinity)).call(this, patchr, element));

    _this.options = _Utility2.default.extend(true, {}, _this.options, Infinity.defaults, _this.getPatchrOption('infinity', {}), options);

    /**
     * Number of container height multipliers used to keep items in the DOM.
     *
     * @type {Number}
     */
    _this.buffer = _this.getOption('buffer') || 1;

    /**
     * An array of InfinityItem instances.
     *
     * @type {InfinityItem[]}
     */
    _this.items = [];

    /**
     * An array of visible InfinityItem instances.
     *
     * @type {InfinityItem[]}
     */
    _this.visibleItems = [];

    _this.container.classList.add('patchr-infinity');

    // Add any passed items.
    var items = _this.getOption('items', []);
    for (var i = 0, l = items.length; i < l; i++) {
      _this.add(items[i]);
    }

    // Resize and draw after items have been added.
    _this.resize();
    _this.draw();
    return _this;
  }

  /**
   * Adds a Renderable item to this Infinity instance.
   *
   * @param {Renderable} renderable
   *   A Renderable instance.
   */


  _createClass(Infinity, [{
    key: 'add',
    value: function add(renderable) {
      this.items.push(renderable instanceof _InfinityItem2.default ? renderable : new _InfinityItem2.default(this, renderable));
    }

    /**
     * {@inheritDoc}
     */

  }, {
    key: 'draw',
    value: function draw() {
      var _this2 = this;

      // Update scrollbar.
      _get(Infinity.prototype.__proto__ || Object.getPrototypeOf(Infinity.prototype), 'draw', this).call(this);

      // Update visible items.
      _Utility2.default.animationFrame(function () {
        var buffer = _this2.height * _this2.buffer;
        var previousItems = _this2.visibleItems;
        _this2.visibleItems = [];
        var firstIndex = null;
        for (var i = 0, l = _this2.items.length; i < l; i++) {
          var item = _this2.items[i];
          var top = _this2.scrollTop - buffer;
          var bottom = _this2.scrollTop + _this2.height + buffer;
          if (item.y + item.height >= top && item.y <= bottom) {
            if (firstIndex === null) {
              firstIndex = i;
            }
            _this2.visibleItems.push(item.attach());
          }
        }

        // If there's only 1 visible item, then it's a massive item that takes
        // up the whole container height buffer distance. Instead, switch the
        // buffer to load the next N items.
        if (_this2.visibleItems.length === 1) {
          var nextItems = _this2.items.slice(firstIndex, firstIndex + _this2.buffer);
          for (var _i = 0, _l = nextItems.length; _i < _l; _i++) {
            _this2.visibleItems.push(nextItems[_i].attach());
          }
        }

        // Detach any previous items.
        for (var _i2 = 0, _l2 = previousItems.length; _i2 < _l2; _i2++) {
          var _item = previousItems[_i2];
          if (_Utility2.default.indexOf(_this2.visibleItems, _item) === -1) {
            _item.detach();
          }
        }
      });
    }
  }]);

  return Infinity;
}(_Scrollable3.default);

exports.default = Infinity;


Infinity.defaults = {

  /**
   * Number of container height multipliers used to keep items in the DOM.
   *
   * @type {Number}
   */
  buffer: 5,

  /**
   * An array of Renderable or InfinityItem instances.
   *
   * @type {Renderable[]|InfinityItem[]}
   */
  items: []

};

},{"./InfinityItem":16,"./Scrollable":23,"./Utility":25}],16:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", {
  value: true
});


var _patchr = (typeof window !== "undefined" ? window['Patchr'] : typeof global !== "undefined" ? global['Patchr'] : null);

var _Infinity = require('./Infinity');

var _Infinity2 = _interopRequireDefault(_Infinity);






// Local imports.


var InfinityItem = function (_Proxy) {
  _inherits(InfinityItem, _Proxy);

  /**
   * @class InfinityItem
   *
   * @param {Infinity} infinity
   *   The Infinity instance this item belongs to.
   * @param {Renderable} item
   *   A Renderable instance.
   */
  function InfinityItem(infinity, item) {
    _classCallCheck(this, InfinityItem);

    if (!(infinity instanceof _Infinity2.default)) {
      throw new Error('The "infinity" argument must be an instance of Infinity: ' + infinity.name);
    }

    if (!(item instanceof _patchr.Renderable)) {
      throw new Error('The "item" argument must be an instance of Renderable: ' + item.name);
    }

    /**
     * An array of affixed elements.
     *
     * @type {HTMLElement[]}
     */
    var _this = _possibleConstructorReturn(this, (InfinityItem.__proto__ || Object.getPrototypeOf(InfinityItem)).call(this, infinity.patchr));

    _this.affixed = [];

    /**
     * An array of cloned affixed elements.
     *
     * @type {HTMLElement[]}
     */
    _this.affixedClone = [];

    /**
     * @type {HTMLElement}
     */
    _this.element = null;

    /**
     * The height of the element, minus margins.
     *
     * @type {Number}
     */
    _this.height = item.outerHeight();

    /**
     * The Infinity instance this item belongs to.
     *
     * @type {Infinity}
     */
    _this.infinity = infinity;

    /**
     * @type {Renderable}
     */
    _this.item = item;

    /**
     * The height of the element, plus margins.
     *
     * @type {Number}
     */
    _this.totalHeight = item.outerHeight(true);

    /**
     * The Y (top) position of the element.
     *
     * @type {Number}
     */
    _this.y = infinity.innerHeight;

    // Increase the infinity innerHeight.
    infinity.innerHeight += _this.totalHeight;
    return _this;
  }

  /**
   * Attaches the InfinityItem to the DOM.
   *
   * @return {InfinityItem}
   *   The current instance.
   */


  _createClass(InfinityItem, [{
    key: 'attach',
    value: function attach() {
      if (!this.isAttached()) {
        this.render();
        this.infinity.container.appendChild(this.element);
        this.attachAffixed();
      }
      this.draw();
      return this;
    }

    /**
     * Attaches the affixed elements to the DOM.
     *
     * @return {InfinityItem}
     *   The current instance.
     */

  }, {
    key: 'attachAffixed',
    value: function attachAffixed() {
      if (this.element) {
        this.detachAffixed();
        this.affixed = Array.prototype.slice.call(this.element.querySelectorAll('.patchr-affix'));
        this.affixedClone = [];
        for (var i = 0, l = this.affixed.length; i < l; i++) {
          var original = this.affixed[i];
          var clone = original.cloneNode(true);
          clone.classList.add('patchr-affixed');
          clone.style.display = 'none';
          clone.style.position = 'absolute';
          clone.style.top = original.offsetTop + 'px';
          clone.style.left = original.offsetLeft + 'px';
          clone.style.height = original.offsetHeight + 'px';
          clone.style.width = original.offsetWidth + 'px';
          clone.style.zIndex = 100;
          this.element.insertBefore(clone, this.element.firstChild);
          this.affixedClone[i] = clone;
        }
      }
      return this;
    }

    /**
     * Destroys the InfinityItem.
     *
     * @return {InfinityItem}
     *   The current instance.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.detach();
      this.affixed = [];
      this.element = null;
      return this;
    }

    /**
     * Detaches the InfinityItem from the DOM.
     *
     * @return {InfinityItem}
     *   The current instance.
     */

  }, {
    key: 'detach',
    value: function detach() {
      if (this.isAttached()) {
        this.detachAffixed();
        // @todo Remove the element from memory (i.e. don't assign removed
        // element back to this.element)? This is currently stored to prevent
        // flickering, but could cause issues if thousands of items.
        this.element = this.infinity.container.removeChild(this.element);
      }
      return this;
    }

    /**
     * Detaches affixed elements from the DOM.
     *
     * @return {InfinityItem}
     *   The current instance.
     */

  }, {
    key: 'detachAffixed',
    value: function detachAffixed() {
      for (var i = 0, l = this.affixed.length; i < l; i++) {
        this.affixed.splice(i, 1);
        if (this.affixedClone[i]) {
          if (this.element.contains(this.affixedClone[i])) {
            this.element.removeChild(this.affixedClone[i]);
          }
          this.affixedClone.splice(i, 1);
        }
      }
      return this;
    }

    /**
     * Updates the element's position based on current Infinity scrollTop value.
     *
     * @return {InfinityItem}
     *   The current instance.
     */

  }, {
    key: 'draw',
    value: function draw() {
      var attached = this.isAttached();
      this.top = this.y - this.infinity.scrollTop;
      if (attached) {
        this.element.style.transform = 'translate3d(0,' + this.infinity.scrollTop * -1 + 'px,0)';
      }

      // Update affixed items.
      for (var i = 0, l = this.affixed.length; i < l; i++) {
        var original = this.affixed[i];
        var clone = this.affixedClone[i];
        var originalTop = this.top + original.offsetTop;
        var originalBottom = originalTop + this.height;

        // The clone affixed element is relative to the InfinityItem container.
        var cloneTop = 0;
        if (originalTop < 0) {
          cloneTop -= originalTop;
        }
        var cloneHeight = originalBottom - original.offsetHeight;
        if (cloneHeight < 0) {
          cloneTop += cloneHeight;
        }
        clone.style.display = attached && originalTop <= 0 && originalBottom >= 0 ? 'block' : 'none';
        clone.style.transform = 'translate3d(0,' + cloneTop + 'px,0)';
      }

      return this;
    }

    /**
     * Determines if the element is currently attached to the DOM.
     *
     * @return {Boolean}
     *   True or false.
     */

  }, {
    key: 'isAttached',
    value: function isAttached() {
      return !!(this.element && this.infinity.container.contains(this.element));
    }

    /**
     * Renders the InfinityItem.
     *
     * @return {InfinityItem}
     *   The current instance.
     */

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      // Immediately return if element is already rendered.
      if (this.element) {
        return this;
      }

      // Create a loading placeholder.
      this.element = document.createElement('div');
      this.element.classList.add('patchr-infinity-item');
      this.element.classList.add('loading');
      this.element.style.height = this.totalHeight + 'px';
      this.element.style.width = this.infinity.width + 'px';
      this.element.style.top = this.y + 'px';
      this.element.style.transform = 'translate3d(0,' + this.infinity.scrollTop * -1 + 'px,0)';

      // Render the item's placeholder.
      var placeholder = this.item.renderPlaceholder();
      placeholder.children[0].addClass('patchr-affix');
      this.element.innerHTML = placeholder;
      this.attachAffixed();

      // Render the element.
      this.item.render().then(function (content) {
        _this2.element.style.height = _this2.height + 'px';
        _this2.element.innerHTML = content;
        _this2.element.classList.remove('loading');
        _this2.attachAffixed();
        _this2.draw();
      });
    }
  }]);

  return InfinityItem;
}(_patchr.Proxy);

exports.default = InfinityItem;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Infinity":15}],17:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", {
  value: true
});


var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _Transition2 = require('./Transition');

var _Transition3 = _interopRequireDefault(_Transition2);






// Local imports.


var Modal = function (_Transition) {
  _inherits(Modal, _Transition);

  function Modal(patchr, options) {
    _classCallCheck(this, Modal);

    // Set the options.
    var _this = _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).call(this, patchr));
    // Because we need to get any passed transition options from the
    // Patchr instance, we cannot simply pass this to super above.


    _this.options = _Utility2.default.extend(true, {}, _this.options, Modal.defaults, _this.getPatchrOption('modal'), options);

    _this.originalTitle = window.document.title;

    _this.minimized = false;

    _this.$body = (0, _jquery2.default)('body');

    _this.$backdrop = null;

    _this.visible = false;

    _this.$wrapper = (0, _jquery2.default)('<div class="patchr-modal-wrapper patchr-reset" tabindex="-1" role="dialog"/>');
    if (_this.getOption('animate')) {
      _this.$wrapper.addClass('fade');
    }

    _this.$modal = (0, _jquery2.default)('<div class="patchr-modal" role="dialog"/>').appendTo(_this.$wrapper);

    _this.$header = (0, _jquery2.default)('<div class="patchr-modal-header"/>').appendTo(_this.$modal);
    _this.$controls = (0, _jquery2.default)('<div class="patchr-modal-controls"/>').appendTo(_this.$header);

    if (_this.getOption('controls.minimize')) {
      _this.$controls.append('<button type="button" class="patchr-btn minimize" data-action="minimize" aria-label="Minimize"><span class="dui-icon dui-icon--minimize" aria-hidden="true"></span></button>');
    }

    if (_this.getOption('controls.maximize')) {
      _this.$controls.append('<button type="button" class="patchr-btn maximize" data-action="maximize" aria-label="Maximize"><span class="dui-icon dui-icon--maximize" aria-hidden="true"></span></button>');
    }

    if (_this.getOption('controls.close')) {
      _this.$controls.append('<button type="patchr-btn button" class="close" data-action="close" aria-label="Close"><span class="dui-icon dui-icon--close" aria-hidden="true"></span></button>');
    }

    _this.$title = (0, _jquery2.default)('<h2 class="patchr-modal-title patchr-overflow"/>').appendTo(_this.$header);

    _this.$content = (0, _jquery2.default)('<div class="patchr-modal-content patchr-wrapper"/>').html(_this.getOption('content', '')).appendTo(_this.$modal);
    _this.$footer = (0, _jquery2.default)('<div class="patchr-modal-footer"/>').html(_this.getOption('footer', '')).appendTo(_this.$modal);

    _this.id = _this.getOption('id');

    if (_this.id) {
      _this.$wrapper.attr('id', _this.id);
    }

    if (!_this.$wrapper.parent().length) {
      _this.$wrapper.appendTo(_this.$body);
    }

    _this.scrollMouseDown = false;

    _this.$wrapper.delegate('[data-action="close"]', 'click.close.patchr.modal', _this.close.bind(_this));
    _this.$wrapper.delegate('[data-action="maximize"]', 'click.maximize.patchr.modal', _this.maximize.bind(_this));
    _this.$wrapper.delegate('[data-action="minimize"]', 'click.minimize.patchr.modal', _this.minimize.bind(_this));

    _this.on('scroll.mousedown', function (e, scrollbar) {
      _this.scrollMouseDown = true;
    }).on('scroll.mouseup', function (e, scrollbar) {
      _this.scrollMouseDown = false;
    });

    // Prevent clicks from bubbling up.
    _this.$modal.bind('mouseup.close.patchr.modal touchend.close.patchr.modal', function (e) {
      if (!_this.scrollMouseDown && (e.target === _this.$modal[0] || _jquery2.default.contains(_this.$modal[0], e.target))) {
        e.stopPropagation();
      }
    });

    // Allow the backdrop to close the modal.
    if (_this.getOption('backdrop')) {
      _this.$wrapper.bind('mouseup.close.patchr.modal touchend.close.patchr.modal', function (e) {
        if (!_this.scrollMouseDown && e.target === _this.$wrapper[0]) {
          _this.close();
        }
      });
    }
    return _this;
  }

  _createClass(Modal, [{
    key: 'getTitle',
    value: function getTitle() {
      if (!this.title) {
        this.title = this.getOption('title');
      }
      return this.title;
    }
  }, {
    key: 'setTitle',
    value: function setTitle() {
      var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getTitle();

      this.title = title;
      this.$title.html(title);
      if (this.visible && !this.minimized) {
        this.setDocumentTitle(title);
      }
      return this;
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      return this.visible ? this.close() : this.open();
    }
  }, {
    key: 'open',
    value: function open() {
      var _this2 = this;

      if (this.minimized) {
        return this.maximize();
      }
      if (this.visible) {
        return this.resolve(this);
      }
      return this.emit('open.modal', this).then(function () {
        _this2.$body.addClass('patchr-modal-open');

        _this2.escape();
        _this2.setDocumentTitle();

        return _this2.showBackdrop();
      }).then(function () {
        _this2.$wrapper.scrollTop(0);

        // Wait for modal to fade in.
        return _this2.fadeIn(_this2.$wrapper);
      }).then(function () {
        _this2.visible = true;
        return _this2.emit('opened.modal', _this2);
      }).then(function () {
        return _this2.resolve(_this2);
      });
    }
  }, {
    key: 'setDocumentTitle',
    value: function setDocumentTitle() {
      var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getTitle();

      var template = this.getOption('templates.documentTitle');
      if (title && template) {
        if (this.getPatchrOption('comments')) {
          title = '\uD83D\uDCAC ' + title; // Unicode speech bubble;
        }
        window.document.title = _Utility2.default.template(template, {
          title: title,
          original: this.originalTitle
        });
      }
    }
  }, {
    key: 'restoreDocumentTitle',
    value: function restoreDocumentTitle() {
      window.document.title = this.originalTitle;
    }
  }, {
    key: 'close',
    value: function close() {
      var _this3 = this;

      if (!this.visible) {
        return this.resolve(this);
      }
      return this.emit('close.modal', this).then(function () {
        _this3.escape();
        _this3.removeBackdrop();
        return _this3.fadeOut(_this3.$wrapper);
      }).then(function () {
        _this3.$body.removeClass('patchr-modal-open');
        _this3.$wrapper.removeClass('minimized');
        _this3.restoreDocumentTitle();
        _this3.minimized = false;
        _this3.visible = false;
      }).then(function () {
        return _this3.emit('closed.modal', _this3);
      }).then(function () {
        return _this3.resolve(_this3);
      });
    }
  }, {
    key: 'maximize',
    value: function maximize() {
      var _this4 = this;

      if (!this.minimized) {
        return this.resolve(this);
      }
      return this.emit('maximize.modal', this).then(function () {
        _this4.$body.addClass('patchr-modal-open');
        return _this4.showBackdrop();
      }).then(function () {
        _this4.escape();
        _this4.setDocumentTitle();
        return _this4.transitionEnd(_this4.$wrapper.removeClass('minimized'));
      }).then(function () {
        _this4.minimized = false;
        return _this4.emit('maximized.modal', _this4);
      }).then(function () {
        return _this4.resolve(_this4);
      });
    }
  }, {
    key: 'minimize',
    value: function minimize() {
      var _this5 = this;

      if (this.minimized) {
        return this.resolve(this);
      }
      return this.emit('minimize.modal', this).then(function () {
        _this5.escape();
        _this5.restoreDocumentTitle();
        _this5.$wrapper.addClass('minimized');
        return _this5.removeBackdrop();
      }).then(function () {
        _this5.$body.removeClass('patchr-modal-open');
        _this5.minimized = true;
        return _this5.emit('minimized.modal', _this5);
      }).then(function () {
        return _this5.resolve(_this5);
      });
    }
  }, {
    key: 'escape',
    value: function escape() {
      var _this6 = this;

      if (this.visible && this.options.keyboard) {
        this.$wrapper.bind('keydown.close.patchr.modal', function (e) {
          if (e.which === 27) {
            _this6.close();
          }
        });
      } else if (!this.visible) {
        this.$wrapper.unbind('keydown.close.patchr.modal');
      }
    }
  }, {
    key: 'removeBackdrop',
    value: function removeBackdrop() {
      var _this7 = this;

      if (!this.$backdrop) {
        return this.resolve();
      }
      return this.fadeOut(this.$backdrop).then(function () {
        if (_this7.$backdrop) {
          _this7.$backdrop.remove();
        }
        _this7.$backdrop = null;
      });
    }
  }, {
    key: 'showBackdrop',
    value: function showBackdrop() {
      var _this8 = this;

      if (!this.getOption('backdrop')) {
        return this.resolve();
      }
      return this.promise(function (resolve, reject) {
        _this8.$backdrop = (0, _jquery2.default)(document.createElement('div')).addClass('patchr-modal-backdrop').appendTo(_this8.$body);
        _this8.fadeIn(_this8.$backdrop, 1).then(resolve);
      });
    }
  }]);

  return Modal;
}(_Transition3.default);

exports.default = Modal;


Modal.defaults = {
  controls: {
    close: true,
    maximize: true,
    minimize: true
  },
  backdrop: true,
  keyboard: true,
  templates: {
    documentTitle: '{{ title }} | {{ original }}'
  },
  show: true
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Transition":24,"./Utility":25}],18:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", {
  value: true
});


var _patchr = (typeof window !== "undefined" ? window['Patchr'] : typeof global !== "undefined" ? global['Patchr'] : null);

var _prismjs = (typeof window !== "undefined" ? window['Prism'] : typeof global !== "undefined" ? global['Prism'] : null);

var _prismjs2 = _interopRequireDefault(_prismjs);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _Reviewer = require('./Reviewer');

var _Reviewer2 = _interopRequireDefault(_Reviewer);

var _Router = require('./Router');

var _Router2 = _interopRequireDefault(_Router);






// Local imports.


var PatchrUi = function (_Patchr) {
  _inherits(PatchrUi, _Patchr);

  /**
   * @class PatchrUi
   *
   * @param {Object} [options]
   *   A object of options to set for the PatchrUi instance.
   *
   * @extends {Patchr}
   *
   * @constructor
   */
  function PatchrUi() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PatchrUi);

    /**
     * The active reviewer, if any.
     *
     * @type {Reviewer}
     */
    var _this = _possibleConstructorReturn(this, (PatchrUi.__proto__ || Object.getPrototypeOf(PatchrUi)).call(this, _Utility2.default.extend(true, {}, PatchrUi.defaults, options)));

    _this.activeReviewer = null;

    /**
     * Flag indicating whether the instance has been initialized.
     *
     * @type {Boolean}
     */
    _this.initialized = false;

    /**
     * An array of Reviewer instances.
     *
     * @type {Object<String, Reviewer>}
     */
    _this.reviewers = {};

    /**
     * The Router instance.
     *
     * @type {Router}
     */
    _this.router = null;

    // Initialize the instance.
    _this.init();
    return _this;
  }

  _createClass(PatchrUi, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      // Add a comment button to each line.
      if (this.getOption('comments')) {
        this.on('render.line.end', function (e, line) {
          var code = line.rendered.children[2];
          if (code) {
            code.prepend('<button type="button" class="patchr-btn patchr-btn--secondary add-comment" data-action="addComment" aria-label="' + this.t('Add Comment') + '"><span class="dui-icon dui-icon--plus" aria-hidden="true"></span></button>');
          }
        });
      }

      // Convert any passed URLs into proper Url objects.
      this.setUrls(this.getOption('urls', []));

      this.on('render.file.end', function (e, file) {
        file.rendered.children[0].addClass('patchr-affix');
      })
      // Clear route when a modal is closed or minimized.
      .on('closed.modal minimized.modal', function (e, modal) {
        if (_this2.activeReviewer && _this2.activeReviewer.modal === modal) {
          _this2.router.clear();
          if (e.type === 'closed') {
            _this2.activeReviewer = null;
          }
        }
      }).on('maximized.modal', function (e, modal) {
        if (_this2.activeReviewer && _this2.activeReviewer.modal === modal) {
          _this2.router.redirect(_this2.activeReviewer.url.sha1);
        }
      });

      // Create a new Router instance.
      this.router = new _Router2.default(this);
      var prefix = this.router.getPrefix();

      // Create a URL loader route.
      this.router.addRoute(prefix + '/:url', this.loadUrl.bind(this));

      // Create a generic route that will remove the active modal.
      this.router.addRoute('*', function () {
        if (_this2.activeModal) {
          if (_this2.activeModal.visible) {
            _this2.activeModal.hide();
          }
          _this2.activeModal = null;
        }
      });
    }

    /**
     * Callback for the "{{prefix}}/:url" route.
     *
     * @param {Object} params
     *   The route parameters.
     * @param {String} [query='']
     *   A query string, if any.
     *
     * @return {Boolean}
     *   True or false if the route should resolve.
     */

  }, {
    key: 'loadUrl',
    value: function loadUrl(params) {
      var _this3 = this;

      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      // Convert query string into an object.
      query = _Utility2.default.deparam(query);

      // Get the URL.
      var url = this.getUrl(decodeURIComponent(params.url));

      // If a Url object could not be found, do not resolve.
      if (!url) {
        this.router.clear();
        return false;
      }

      // Retrieve the reviewer.
      var reviewer = this.getReviewer(url);

      // Set the active query.
      reviewer.setQuery(query);

      // Load the modal from the URL.
      if (this.activeReviewer && this.activeReviewer !== reviewer) {
        this.activeReviewer.close().then(function () {
          reviewer.open();
          _this3.activeReviewer = reviewer;
        });
      } else {
        reviewer.open().then(function () {
          _this3.activeReviewer = reviewer;
        });
      }
    }
  }, {
    key: 'navigate',
    value: function navigate() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.router.navigate(url, query);
    }

    /**
     * Sets URLs for the PatchrUi instance.
     *
     * @param {Url[]|String[]|Object[]} urls
     *   An array of Url objects. You can also pass an array of strings
     *   that contain the URL to a file or an array of objects where there is at
     *   least a single "url" property. Either of these will be converted into a
     *   proper Url object.
     * @param {Boolean} [merge=false]
     *   Flag indicating whether the urls should be merged onto the existing
     *   array. If merge is not `true`, then the entire array is replaced.
     *
     * @return {PatchrUi}
     *   The PatchrUi instance.
     *
     * @chainable
     */

  }, {
    key: 'setUrls',
    value: function setUrls(urls, merge) {
      for (var i = 0, l = urls.length; i < l; i++) {
        if (!(urls[i] instanceof _patchr.Url)) {
          urls[i] = new _patchr.Url(urls[i]);
        }
      }
      this.options.urls = merge ? this.options.urls.concat(urls) : urls;
      return this;
    }

    /**
     * Retrieves an existing Url object or creates a new one if not found.
     *
     * @param {String} [string=null]
     *   A string, can either be a URL or an SHA1 digest.
     *
     * @return {Url|null}
     *   The Url object that existed or was created from a valid URL or
     *   null if a valid Url object could not be found or created.
     */

  }, {
    key: 'getUrl',
    value: function getUrl() {
      var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var url = null;
      if (string && _Utility2.default.isSha1(string)) {
        url = this.options.urls.filter(function (url) {
          return url.sha1 === string;
        })[0] || null;
      } else if (string && _Utility2.default.isUrl(string)) {
        url = this.options.urls.filter(function (url) {
          return url.url === string;
        })[0] || null;
        if (!url) {
          url = new _patchr.Url(string);
          this.options.urls.push(url);
        }
      }
      return url;
    }

    /**
     * Loads a reviewer for a URL, creating one if necessary.
     *
     * @param {Url|String} url
     *   A Url object or a URL string.
     *
     * @return {Reviewer}
     *   A Reviewer instance.
     */

  }, {
    key: 'getReviewer',
    value: function getReviewer(url) {
      url = _patchr.Url.create(url);
      if (!this.reviewers[url.sha1]) {
        this.reviewers[url.sha1] = new _Reviewer2.default(this, url);
      }
      return this.reviewers[url.sha1];
    }
  }]);

  return PatchrUi;
}(_patchr.Patchr);

exports.default = PatchrUi;


PatchrUi.__version__ = '0.1.0';

/**
 * The default options for a PatchrUi instance.
 *
 * @type {Object}
 */
PatchrUi.defaults = {

  /**
   * Flag indicating whether or not comment support should be enabled.
   *
   * Note: this is disabled by default since it requires additional code
   * (from whatever is implementing this instance) to retrieve from this UI
   * and then store the them somewhere; likely on a server or page comment.
   *
   * @type {Boolean}
   */
  comments: false,

  /**
   * Attempt to set the default code highlighter to PrismJS.
   *
   * @type {Prism|*}
   */
  highlighter: _prismjs2.default || null,

  throbber: '<div class="patchr-throbber fade" data-state="loading"><div class="c c1"></div><div class="c c2"></div><div class="c c3"></div><div class="c c4"></div><div class="c c5"></div><div class="c c6"></div><div class="c c7"></div><div class="c c8"></div><div class="c c9"></div></div>',

  /**
   * An array of Url objects.
   *
   * You can also pass an array of strings that contain the URL to a file or
   * an array of objects where there is at least a single "url" property.
   *
   * Either of these will be converted into a proper Url object.
   *
   * @type {Url[]|String[]|Object[]}
   */
  urls: [],

  transitionDuration: 300
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Reviewer":20,"./Router":21,"./Utility":25}],19:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", {
  value: true
});


var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _Transition2 = require('./Transition');

var _Transition3 = _interopRequireDefault(_Transition2);






// Local imports.


var Progress = function (_Transition) {
  _inherits(Progress, _Transition);

  function Progress(patchr, container) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Progress);

    // Set the options.
    var _this = _possibleConstructorReturn(this, (Progress.__proto__ || Object.getPrototypeOf(Progress)).call(this, patchr));

    _this.options = _Utility2.default.extend(true, {}, _this.options, Progress.defaults, _this.getPatchrOption('progress'), options);

    /**
     * @type {HTMLElement}
     */
    _this.container = container instanceof _jquery2.default ? container[0] : container;

    // Ensure the element passed is a DOM element.
    _Utility2.default.typeCheck(_this.container, HTMLElement);

    var temp = document.createElement('div');
    temp.innerHTML = _this.getPatchrOption('throbber');

    /**
     * @type {HTMLElement}
     */
    _this.throbber = temp.firstChild;

    /**
     * @type {HTMLElement}
     */
    _this.wrapper = document.createElement('div');
    _this.wrapper.classList.add('patchr-progress');
    _this.wrapper.classList.add('fade');

    /**
     * @type {HTMLElement}
     */
    _this.bar = document.createElement('div');
    _this.bar.classList.add('patchr-progress-bar');
    _this.wrapper.appendChild(_this.bar);

    _this.container.appendChild(_this.throbber);
    _this.container.appendChild(_this.wrapper);
    _this.fadeIn(_this.throbber);
    _this.fadeIn(_this.wrapper);
    return _this;
  }

  _createClass(Progress, [{
    key: 'current',
    value: function current() {
      var _current = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (_current !== null) {
        return this.setOption('current', _current).update();
      }
      return this.getOption('current');
    }

    /**
     * Destroys the Progress instance.
     *
     * @return {Promise}
     *   A Promise object.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this2 = this;

      this.fadeOut(this.throbber).then(function () {
        if (_this2.container.contains(_this2.throbber)) {
          _this2.container.removeChild(_this2.throbber);
        }
        _this2.throbber = null;
      });
      return this.fadeOut(this.wrapper).then(function () {
        if (_this2.container.contains(_this2.wrapper)) {
          _this2.container.removeChild(_this2.wrapper);
        }
        _this2.wrapper = null;
        _this2.bar = null;
      });
    }
  }, {
    key: 'increase',
    value: function increase() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      return this.current(this.current() + value);
    }
  }, {
    key: 'info',
    value: function info() {
      var _info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (_info !== null) {
        return this.setOption('info', _info).update();
      }
      return this.getOption('info');
    }
  }, {
    key: 'percent',
    value: function percent() {
      return Math.ceil(Math.round(100 / this.total() * this.current()));
    }
  }, {
    key: 'state',
    value: function state() {
      var _state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (_state !== null) {
        return this.setOption('state', _state).update();
      }
      return this.getOption('state');
    }
  }, {
    key: 'total',
    value: function total() {
      var _total = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (_total !== null) {
        return this.setOption('total', _total).update();
      }
      return this.getOption('total');
    }
  }, {
    key: 'update',
    value: function update() {
      var _this3 = this;

      _Utility2.default.animationFrame(function () {
        var percent = _this3.percent();
        _this3.throbber.setAttribute('data-state', _this3.state());
        _this3.wrapper.setAttribute('data-state', _this3.state());
        _this3.bar.setAttribute('data-percent', percent);
        _this3.bar.setAttribute('data-info', _this3.info());
        _this3.bar.style.width = percent + '%';
      });
      return this;
    }
  }]);

  return Progress;
}(_Transition3.default);

exports.default = Progress;


Progress.defaults = {

  current: 0,

  /**
   * @type {HTMLElement}
   */
  element: null,

  info: null,
  state: 'loading',
  total: 100

};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Transition":24,"./Utility":25}],20:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", {
  value: true
});


var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

var _patchr = (typeof window !== "undefined" ? window['Patchr'] : typeof global !== "undefined" ? global['Patchr'] : null);

var _Ajax = require('./Ajax');

var _Ajax2 = _interopRequireDefault(_Ajax);

var _Infinity = require('./Infinity');

var _Infinity2 = _interopRequireDefault(_Infinity);

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _Progress = require('./Progress');

var _Progress2 = _interopRequireDefault(_Progress);

var _Transition2 = require('./Transition');

var _Transition3 = _interopRequireDefault(_Transition2);






// Local imports.


var Reviewer = function (_Transition) {
  _inherits(Reviewer, _Transition);

  function Reviewer(patchr, url) {
    _classCallCheck(this, Reviewer);

    /**
     * The Parser instance, if any.
     *
     * @type {Parser}
     */
    var _this = _possibleConstructorReturn(this, (Reviewer.__proto__ || Object.getPrototypeOf(Reviewer)).call(this, patchr));

    _this.parser = null;

    /**
     * The Url instance for this reviewer.
     *
     * @type {Url}
     */
    _this.url = _patchr.Url.create(url);

    /**
     * The unique identifier for this reviewer.
     *
     * @type {String}
     */
    _this.id = _this.url.sha1;

    /**
     * The modal for this reviewer.
     *
     * @type {Modal}
     */
    _this.modal = new _Modal2.default(patchr, { id: _this.id }).setTitle('Loading...');

    /**
     * The current query parameters for the reviewer.
     *
     * @type {Object}
     */
    _this.query = {};

    /**
     * The patches DOM container.
     *
     * @type {jQuery}
     */
    _this.$patches = (0, _jquery2.default)('<div class="patchr-patches"/>').appendTo(_this.modal.$content);

    /**
     * A Progress instance, if any.
     *
     * @type {Progress}
     */
    _this.progress = null;
    return _this;
  }

  _createClass(Reviewer, [{
    key: 'close',
    value: function close() {
      return this.modal.close();
    }
  }, {
    key: 'maximize',
    value: function maximize() {
      return this.modal.maximize();
    }
  }, {
    key: 'minimize',
    value: function minimize() {
      return this.modal.minimize();
    }
  }, {
    key: 'open',
    value: function open() {
      var _this2 = this;

      return this.modal.open().then(function () {
        return _this2.load();
      });
    }

    /**
     * Provide a companion parseUrl method for the browser.
     *
     * @return {Promise}
     *   A Promise object.
     */

  }, {
    key: 'load',
    value: function load() {
      var _this3 = this;

      if (this.parser || this.loading) {
        return this.resolve();
      }

      // Indicate that URL is loading.
      this.loading = true;

      // Create a new ajax handler.
      var ajax = new _Ajax2.default(this.patchr, this.url);

      // Ajax abort handler.
      var ajaxAbort = function ajaxAbort() {
        return ajax.xhr.abort();
      };

      // Ajax progress handler.
      var ajaxProgress = function ajaxProgress(e, loaded, total) {
        if (!_this3.progress) {
          _this3.progress = new _Progress2.default(_this3.patchr, _this3.modal.$content, {
            info: _this3.url.filename,
            total: total
          });
        }
        _this3.progress.current(loaded);
      };

      this.on('ajax.progress', ajaxProgress);
      this.on('close.modal', ajaxAbort);
      return ajax.send().then(function (content) {
        _this3.off('ajax.progress', ajaxProgress);
        _this3.off('close.modal', ajaxAbort);

        // Reset progress to indicate that the parser is initializing.
        _this3.progress.state('initializing');
        _this3.progress.current(0);
        return _this3.transitionEnd(_this3.progress.bar).then(function () {
          return content;
        });
      }).then(function (content) {
        return _this3.proxy('getParser', [content, ajax.url]);
      }).then(function (parser) {
        // Override the modal title with the URL filename.
        _this3.modal.setTitle(_this3.url.filename);
        _this3.parser = parser;
        _this3.progress.current(_this3.progress.total());
        return _this3.transitionEnd(_this3.progress.bar);
      }).then(function () {
        return _this3.progress.destroy();
      }).then(function () {
        return _this3.renderPatches();
      }).finally(function () {
        _this3.loading = false;
        _this3.progress = null;
      }).catch(function (e) {
        if (ajax.aborted) {
          _this3.modal.$content.html('');
        }
        // Rethrow error only if user didn't abort.
        else {
            return _this3.reject(e);
            // @todo move into a proper error handler?
            // this.modal.$content.html(`<div class="patchr-error">${e.message}</div>`);
          }
      });
    }
  }, {
    key: 'navigateToPatch',
    value: function navigateToPatch(e) {
      e.preventDefault();
      e.stopPropagation();
      var $current = (0, _jquery2.default)(e.currentTarget).addClass('active');
      this.$patchMenu.find('a').not($current).removeClass('active');
      this.proxy('navigate', [null, { patch: $current.data('patch') }]);
    }
  }, {
    key: 'renderPatches',
    value: function renderPatches() {
      var _this4 = this;

      return this.resolve(this.parser.patches.length > 1 ? this.parser.renderPatchesMenu() : false).then(function (menu) {
        if (menu) {
          _this4.$patchMenu = (0, _jquery2.default)(menu.toString());
          _this4.$patchMenu.delegate('a', 'click.patchr.patch.menu', _this4.navigateToPatch.bind(_this4));
          _this4.modal.$footer.prepend(_this4.$patchMenu);
          _this4.$patchMenu.find('a:nth(' + (_this4.query.patch && _this4.query.patch - 1 || 0) + ')').trigger('click.patchr.patch.menu');
        }
      }).then(function () {
        return _this4.each(_this4.parser.patches, function (patch) {
          var container = patch.renderContainer();
          if (_this4.parser.patches.length > 1) {
            container.addClass('fade');
          }
          var $patch = (0, _jquery2.default)(container.setAttribute('data-patch', patch.index + 1).toString());
          _this4.$patches.append($patch);
          new _Infinity2.default(_this4.patchr, $patch[0], {
            items: patch.files
          });
        });
      });
    }
  }, {
    key: 'renderFileList',
    value: function renderFileList() {
      this.fileList = new _Infinity2.default(this.patchr, {
        source: this.parser.patches
      });
    }
  }, {
    key: 'renderStats',
    value: function renderStats() {
      var _this5 = this;

      return this.promise(function (resolve, reject) {
        resolve(_this5.parser.renderDiffStats().toString());
      });
    }

    /**
     * Sets the query parameters for the reviewer.
     *
     * @param {Object|String} query
     *   The query parameters to set. If a string is passed, it will be parsed
     *   into an object.
     *
     * @return {Reviewer}
     *   The current instance.
     */

  }, {
    key: 'setQuery',
    value: function setQuery() {
      var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.query = _patchr.Utility.isObject(query) ? query : _patchr.Utility.deparam(query);
      // If the query
      if (this.query.patch && this.$patchMenu) {
        this.showPatch(this.query.patch);
      }
      return this;
    }
  }, {
    key: 'showPatch',
    value: function showPatch(patch) {
      var $patches = this.$patches.children();
      this.$activePatch = $patches.filter('[data-patch=' + patch + ']');
      this.fadeOut($patches.not(this.$activePatch));
      this.fadeIn(this.$activePatch);
    }
  }]);

  return Reviewer;
}(_Transition3.default);

exports.default = Reviewer;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Ajax":14,"./Infinity":15,"./Modal":17,"./Progress":19,"./Transition":24}],21:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", {
  value: true
});


var _patchr = (typeof window !== "undefined" ? window['Patchr'] : typeof global !== "undefined" ? global['Patchr'] : null);

var _navigo = require('navigo');

var _navigo2 = _interopRequireDefault(_navigo);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);






// Local imports.


var Router = function (_Proxy) {
  _inherits(Router, _Proxy);

  function Router(patchr) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Router);

    // Set the options.
    var _this = _possibleConstructorReturn(this, (Router.__proto__ || Object.getPrototypeOf(Router)).call(this, patchr));

    _this.options = _Utility2.default.extend(true, {}, _this.options, Router.defaults, _this.getPatchrOption('router'), options);

    /**
     * Flag indicating whether the instance has been initialized.
     *
     * @type {Boolean}
     */
    _this.initialized = false;

    /**
     * The Navigo router instance.
     *
     * @type {Navigo}
     */
    _this.navigo = null;

    /**
     * The route handlers.
     *
     * @type {Object}
     */
    _this.routes = null;

    // Initialize the instance.
    _this.init();
    return _this;
  }

  _createClass(Router, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      if (this.initialized) {
        return;
      }

      // Reset the route handlers.
      this.routes = {};

      // Initialize a new Navigo instance.
      this.navigo = new _navigo2.default();

      var prefix = this.getPrefix();

      // Remove any hash prefix.
      var hashedRoutePrefixRegExp = new RegExp('#/?' + prefix.substr(1) + '/');
      if (typeof window !== 'undefined' && window.history && window.history.replaceState && window.location.href.match(hashedRoutePrefixRegExp)) {
        window.history.replaceState({}, '', window.location.href.replace(hashedRoutePrefixRegExp, prefix + '/'));
      }

      // Routes should only be added and then resolved when the DOM is ready
      // since navigating to a route essentially manipulates the DOM.
      _Utility2.default.ready(function () {
        _this2.navigo.on(_this2.routes).resolve();
        _this2.initialized = true;
      });
    }
  }, {
    key: 'addRoute',
    value: function addRoute(route, fn) {
      if (!_Utility2.default.isFunction(fn)) {
        throw new TypeError('The "fn" argument must be a valid callback of the type "Function": ' + fn);
      }
      this.routes[route] = fn;
    }
  }, {
    key: 'clear',
    value: function clear() {
      // Clear out the last resolved route so it will actual fire the handler.
      this.navigo._lastRouteResolved = false;
      this.navigo.navigate('');

      // Remove any lingering forward slashes.
      if (/\/$/.test(window.location.href) && typeof window !== 'undefined' && window.history && window.history.replaceState) {
        window.history.replaceState({}, '', window.location.href.replace(/\/$/, ''));
      }
    }
  }, {
    key: 'getPrefix',
    value: function getPrefix() {
      var prefix = this.getOption('prefix', '');
      if (prefix) {
        prefix = '/' + (prefix[0] === '/' ? prefix.substr(1) : prefix);
      }
      return prefix;
    }

    /**
     * Navigate to a route.
     *
     * @param {String|Url} url
     *   The URL to navigate to.
     * @param {Object} [query={}]
     *   A query string object (GET parameters).
     * @param {Boolean} [redirect]
     *   Flag indicating whether to redirect the browser URL instead of actually
     *   firing the route handler. Defaults to true if the router instance has
     *   not yet been initialized, false otherwise.
     */

  }, {
    key: 'navigate',
    value: function navigate() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var redirect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !this.initialized;

      query = _Utility2.default.param(query);
      url = this.proxy('getUrl', [url]);
      if (url) {
        // Clear out the last resolved route so it will actual fire the handler.
        this.navigo._lastRouteResolved = null;
        url = encodeURIComponent(url[this.getOption('sha1', !!this.getPatchrOption('urls').length) ? 'sha1' : 'url']);
      } else if (this.navigo._lastRouteResolved && query) {
        url = this.navigo._lastRouteResolved.url;
      }

      if (url) {
        if (query) {
          url += '?' + query;
        }
        var prefix = this.getPrefix();
        url = prefix + '/' + url.replace(new RegExp('^' + prefix + '/?'), '');
        if (redirect) {
          this.navigo.pause(true);
        }
        this.navigo.navigate(url);
        if (redirect) {
          this.navigo.pause(false);
        }
      }
    }

    /**
     * Redirects the browser URL to a route without firing the handler.
     *
     * @param {String|Url} url
     *   The URL to navigate to.
     * @param {Object} [query={}]
     *   A query string object (GET parameters).
     */

  }, {
    key: 'redirect',
    value: function redirect() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.navigate(url, query, true);
    }
  }]);

  return Router;
}(_patchr.Proxy);

exports.default = Router;


Router.defaults = {

  /**
   * The route prefix.
   *
   * @type {String}
   */
  prefix: 'patch',

  /**
   * Flag determining whether or not URLs should be redirect to their SHA1.
   *
   * If not set, this value will be determined automatically based on whether
   * there have been provided maps for both SHA1 digests and URLs (above).
   *
   * Note: while this option can forcefully be enabled, any URLs that have been
   * redirected to the SHA1 may not work if a user shares the link to others,
   * e.g. the SHA1 cannot be reverse engineered to a URL that isn't known.
   *
   * @type {Boolean}
   */
  sha1: null

};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Utility":25,"navigo":9}],22:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", {
  value: true
});


var _patchr = (typeof window !== "undefined" ? window['Patchr'] : typeof global !== "undefined" ? global['Patchr'] : null);

var _hamsterjs = require('hamsterjs');

var _hamsterjs2 = _interopRequireDefault(_hamsterjs);

var _Transition2 = require('./Transition');

var _Transition3 = _interopRequireDefault(_Transition2);






// Local imports.


var ScrollBar = function (_Transition) {
  _inherits(ScrollBar, _Transition);

  /**
   * @class ScrollBar
   *
   * @param {Patchr} patchr
   *   The Patchr instance.
   * @param {HTMLElement} element
   *   The element to attach the this new ScrollBar instance to.
   * @param {Object} [options={}]
   *   Additional options to configure the new ScrollBar instance.
   */
  function ScrollBar(patchr, element) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, ScrollBar);

    var _this = _possibleConstructorReturn(this, (ScrollBar.__proto__ || Object.getPrototypeOf(ScrollBar)).call(this, patchr));

    if (!(element instanceof HTMLElement)) {
      throw new Error('The "element" argument passed must be an instance of HTMLElement: ' + element);
    }

    // Because we need to get any passed infinity options from the
    // Patchr instance, we cannot simply pass this to super above.
    _this.options = _patchr.Utility.extend(true, {}, _this.options, ScrollBar.defaults, _this.getPatchrOption('scrollBar', {}), options);

    /**
     * @type {HTMLElement}
     */
    _this.bar = document.createElement('div');
    _this.bar.classList.add('patchr-scroll-bar');

    /**
     * The bar margin.
     *
     * @type {Number}
     */
    _this.barMargin = _this.getOption('bar.margin');

    /**
     * The bar minimum height.
     *
     * @type {Number}
     */
    _this.barMinHeight = _this.getOption('bar.minHeight');

    /**
     * The bar width.
     *
     * @type {Number}
     */
    _this.barWidth = _this.getOption('bar.width');

    /**
     * The containing element.
     *
     * @type {HTMLElement}
     */
    _this.container = element;

    /**
     * The total height.
     *
     * @type {Number}
     */
    _this.height = 0;

    /**
     * The current length.
     *
     * @type {Number}
     */
    _this.length = 1;

    /**
     * Flag indicating if user initiated manual scrolling
     * (mousedown/touchstart).
     *
     * @type {Boolean}
     */
    _this.manuallyScrolling = false;

    /**
     * The current position.
     *
     * @type {Number}
     */
    _this.position = 0;

    /**
     * @type {HTMLElement}
     */
    _this.track = document.createElement('div');
    _this.trackWidth = _this.barWidth + _this.barMargin * 2;
    _this.track.classList.add('patchr-scroll-track');
    _this.track.classList.add('fade');
    _this.track.style.width = _this.trackWidth - 2 + 'px';
    _this.track.appendChild(_this.bar);
    element.appendChild(_this.track);

    /**
     * The total width.
     *
     * @type {Number}
     */
    _this.width = 0;

    /**
     * Determines if browser supports passive events.
     *
     * @type {Boolean|Object}
     */
    _this.passive = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function get() {
          _this.passive = { passive: true };
        }
      });
      window.addEventListener('test', null, opts);
    } catch (e) {}
    // Intentionally left empty.


    // Add listener for wheel event (based on browser support).
    (0, _hamsterjs2.default)(element).wheel(_this.wheel.bind(_this), _this.passive);

    // Bind listeners to the BODY DOM element for a more natural feel.
    document.body.addEventListener('mousedown', _this.down.bind(_this), _this.passive);
    document.body.addEventListener('mousemove', _this.move.bind(_this), _this.passive);
    document.body.addEventListener('mouseup', _this.up.bind(_this), _this.passive);
    document.body.addEventListener('touchstart', _this.down.bind(_this), _this.passive);
    document.body.addEventListener('touchmove', _this.move.bind(_this), _this.passive);
    document.body.addEventListener('touchend', _this.up.bind(_this), _this.passive);
    window.addEventListener('resize', _this.resize.bind(_this), _this.passive);
    _this.resize();

    /**
     * The timer instance.
     *
     * @type {Number}
     */
    _this.timer = null;
    return _this;
  }

  _createClass(ScrollBar, [{
    key: 'destroy',
    value: function destroy() {
      this.destroyTimer();
      document.body.removeEventListener('mousedown', this.down.bind(this), this.passive);
      document.body.removeEventListener('mousemove', this.move.bind(this), this.passive);
      document.body.removeEventListener('mouseup', this.up.bind(this), this.passive);
      document.body.removeEventListener('touchstart', this.down.bind(this), this.passive);
      document.body.removeEventListener('touchmove', this.move.bind(this), this.passive);
      document.body.removeEventListener('touchend', this.up.bind(this), this.passive);

      // Add listener for wheel event (based on browser support).
      (0, _hamsterjs2.default)(this.container).unwheel(void 0, this.passive);

      this.container.removeChild(this.track);
      this.container = null;
      this.track = null;
      this.bar = null;
    }
  }, {
    key: 'setLength',
    value: function setLength() {
      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (length !== null) {
        this.length = Math.max(Math.min(1, length), 0);
      }
      this.length = Math.max(this.length * this.height, this.barMinHeight);
      this.bar.style.height = this.length + 'px';
    }
  }, {
    key: 'setPosition',
    value: function setPosition() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (position !== null) {
        this.position = Math.max(Math.min(1, position), 0);
      }
      this.position = this.position * this.getEmpty();
      this.bar.style.top = this.position + 'px';
    }
  }, {
    key: 'down',
    value: function down(e) {
      var touch = window.TouchEvent && e instanceof window.TouchEvent;

      // Immediately return if not this instance's bar or track element.
      if (!touch && e.target !== this.bar && e.target !== this.track) {
        return;
      }
      var offsetY = this.getOffset(e).y;
      if (touch || e.target === this.bar) {
        e.stopPropagation();
        this.manuallyScrolling = true;
        this.scrollTop = offsetY;
        this.emit('scroll.mousedown', this);
      } else if (e.target === this.track) {
        e.stopPropagation();
        if (offsetY < this.position) {
          this.emit('scroll.pageUp', this);
        } else if (offsetY > this.position + this.length) {
          this.emit('scroll.pageDown', this);
        }
      }
    }
  }, {
    key: 'getEmpty',
    value: function getEmpty() {
      return this.height - this.length;
    }
  }, {
    key: 'getOffset',
    value: function getOffset(event) {
      var e = window.TouchEvent && event instanceof window.TouchEvent ? event.changedTouches[0] : event;
      var target = e.currentTarget || e.srcElement || e.target;
      var cx = e.clientX || 0;
      var cy = e.clientY || 0;
      var rect = target === window || target === document || target === document.body ? { left: 0, top: 0 } : target.getBoundingClientRect();
      return {
        x: cx - rect.left,
        y: cy - rect.top
      };
    }
  }, {
    key: 'move',
    value: function move(e) {
      var _this2 = this;

      var touch = window.TouchEvent && e instanceof window.TouchEvent;

      // Keep ScrollBar visible if user is moving over bar or track DOM element.
      if (!touch && !this.manuallyScrolling && (e.target === this.bar || e.target === this.track)) {
        this.show();
      } else if (this.manuallyScrolling) {
        e.stopPropagation();
        var scrollTo = this.getEmpty();
        if (scrollTo) {
          var offsetY = this.getOffset(e).y;
          scrollTo = touch || e.target === this.bar ? (this.position + offsetY - this.scrollTop) / scrollTo : (offsetY - this.scrollTop) / scrollTo;
        }
        this.emit('scroll.to', this, scrollTo).then(function () {
          return _this2.setPosition(scrollTo);
        }).then(function () {
          return _this2.show();
        });
      }
    }
  }, {
    key: 'up',
    value: function up(e) {
      var _this3 = this;

      if (this.manuallyScrolling) {
        e.stopPropagation();
        this.move(e);
        this.manuallyScrolling = false;
        this.emit('scroll.mouseup', this).then(function () {
          return _this3.hide();
        });
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.destroyTimer();
      if (!this.manuallyScrolling) {
        this.destroyTimer();
        if (this.track.classList.contains('in')) {
          return this.fadeOut(this.track);
        } else {
          return this.resolve(this.track);
        }
      }
    }
  }, {
    key: 'destroyTimer',
    value: function destroyTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = null;
    }
  }, {
    key: 'resize',
    value: function resize() {
      var position = this.container.getBoundingClientRect();
      this.width = position.width;
      this.height = position.height;
      this.setLength();
      this.setPosition();
    }
  }, {
    key: 'show',
    value: function show() {
      var _this4 = this;

      // Immediately return if there is no empty space in the track.
      if (!this.getEmpty()) {
        return this.resolve(this.track);
      }

      this.destroyTimer();
      var promise = this.track.classList.contains('in') ? this.resolve(this.track) : this.fadeIn(this.track);
      return promise.then(function () {
        _this4.timer = setTimeout(function () {
          _this4.hide();
        }, 2000);
      });
    }

    /**
     * @param {Object} wheel
     *   The normalized Hamster wheel "Event" object.
     * @param {Number} delta
     *   The direction moved.
     * @param {Number} deltaX
     *   The amount of pixels moved for the X axis.
     * @param {Number} deltaY
     *   The amount of pixels moved for the Y axis.
     */

  }, {
    key: 'wheel',
    value: function wheel(_wheel, delta, deltaX, deltaY) {
      var _this5 = this;

      // The deltaX and deltaY properties inside the wheel object are not the same
      // as the arguments passed here (which are the correct values).
      var x = Math.abs(deltaX);
      var y = Math.abs(deltaY);
      _wheel.deltaX = deltaX;
      _wheel.deltaY = deltaY;
      _wheel.pixelX = deltaX < 0 ? x : -x;
      _wheel.pixelY = deltaY < 0 ? y : -y;
      this.emit('scroll.wheel', this, _wheel).then(function () {
        return _wheel.pixelY !== 0 && _this5.show();
      });
    }
  }]);

  return ScrollBar;
}(_Transition3.default);

exports.default = ScrollBar;


ScrollBar.defaults = {
  bar: {
    minHeight: 25,
    margin: 3,
    width: 12
  }
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Transition":24,"hamsterjs":7}],23:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});


var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);

var _ScrollBar = require('./ScrollBar');

var _ScrollBar2 = _interopRequireDefault(_ScrollBar);

var _Transition2 = require('./Transition');

var _Transition3 = _interopRequireDefault(_Transition2);






var Scrollable = function (_Transition) {
  _inherits(Scrollable, _Transition);

  function Scrollable(patchr, element) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Scrollable);

    if (!(element instanceof HTMLElement)) {
      throw new Error('The "element" argument passed must be an instance of HTMLElement: ' + element);
    }

    /**
     * @type {HTMLElement}
     */
    var _this = _possibleConstructorReturn(this, (Scrollable.__proto__ || Object.getPrototypeOf(Scrollable)).call(this, patchr, options));

    _this.container = document.createElement('div');
    _this.container.classList.add('patchr-scrollable');
    _Utility2.default.forceReflow(element).appendChild(_this.container);

    /**
     * The inner height.
     *
     * @type {Number}
     */
    _this.innerHeight = 0;

    /**
     * The previous scrollTop position.
     *
     * @type {number}
     */
    _this.previousScrollTop = -1;

    /**
     * The ScrollBar instance.
     *
     * Note: must be created after container and inner are attached to the DOM.
     *
     * @type {ScrollBar}
     */
    _this.scrollbar = new _ScrollBar2.default(patchr, _this.container);

    /**
     * The current scrollTop position.
     *
     * @type {number}
     */
    _this.scrollTop = 0;

    // Listen for scrolling events.
    _this.on('scroll.pageUp', _this.proxyScrollEvent('scrollPageUp')).on('scroll.pageDown', _this.proxyScrollEvent('scrollPageDown')).on('scroll.to', _this.proxyScrollEvent('scrollTo')).on('scroll.wheel', _this.proxyScrollEvent('scrollWheel'));

    // Listen for window resize event.
    window.addEventListener('resize', _this.resize.bind(_this), false);

    _this.resize();
    return _this;
  }

  /**
   * Updates the Scrollable container.
   */


  _createClass(Scrollable, [{
    key: 'draw',
    value: function draw() {
      var _this2 = this;

      _Utility2.default.animationFrame(function () {
        _this2.scrollbar.setLength(_this2.height / _this2.innerHeight);
        _this2.scrollbar.setPosition(_this2.scrollTop / (_this2.innerHeight - _this2.height));
      });
    }
  }, {
    key: 'proxyScrollEvent',
    value: function proxyScrollEvent(method) {
      var _this3 = this;

      return function (e, scrollbar) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        // Only proxy if the scrollbar instance passed is the same as this one.
        if (scrollbar === _this3.scrollbar) {
          _this3[method].apply(_this3, [e, scrollbar].concat(args));
        }
      };
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.position = this.container.getBoundingClientRect();
      this.width = this.position.width;
      this.height = this.position.height;
      this.pageOffset = this.height / 2 * 40;
      this.scrollbar.resize();
    }
  }, {
    key: 'scrollPageDown',
    value: function scrollPageDown() {
      this.setScrollTop(this.scrollTop + this.pageOffset);
    }
  }, {
    key: 'scrollPageUp',
    value: function scrollPageUp() {
      this.setScrollTop(this.scrollTop - this.pageOffset);
    }
  }, {
    key: 'scrollTo',
    value: function scrollTo(e, scrollbar, _scrollTo) {
      this.setScrollTop(_scrollTo * (this.innerHeight - this.height));
    }
  }, {
    key: 'scrollWheel',
    value: function scrollWheel(e, scrollbar, wheel) {
      this.setScrollTop(this.scrollTop + wheel.pixelY);
    }
  }, {
    key: 'setScrollTop',
    value: function setScrollTop() {
      var scrollTop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (scrollTop === null) {
        return this.scrollTop;
      }
      this.previousScrollTop = this.scrollTop;
      this.scrollTop = Math.max(Math.min(parseFloat(scrollTop), this.innerHeight - this.height), 0);
      if (isNaN(this.scrollTop) || this.scrollTop < 0) {
        this.scrollTop = 0;
      } else if (this.scrollTop > this.innerHeight - this.height) {
        this.scrollTop = this.innerHeight - this.height;
      }
      // Redraw if the scrollTop has changed.
      if (this.previousScrollTop !== this.scrollTop) {
        this.draw();
      }
    }
  }]);

  return Scrollable;
}(_Transition3.default);

exports.default = Scrollable;


Scrollable.defaults = {};

},{"./ScrollBar":22,"./Transition":24,"./Utility":25}],24:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", {
  value: true
});


var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

var _patchr = (typeof window !== "undefined" ? window['Patchr'] : typeof global !== "undefined" ? global['Patchr'] : null);

var _Utility = require('./Utility');

var _Utility2 = _interopRequireDefault(_Utility);






// Local imports.


var Transition = function (_Proxy) {
  _inherits(Transition, _Proxy);

  /**
   * @class Transition
   *
   * @param {Patchr} patchr
   *   The Patchr instance.
   * @param {Object} [options={}]
   *   The options specific to this proxied instance.
   *
   * @constructor
   */
  function Transition(patchr, options) {
    _classCallCheck(this, Transition);

    // Because we need to get any passed transition options from the
    // Patchr instance, we cannot simply pass this to super above.
    var _this = _possibleConstructorReturn(this, (Transition.__proto__ || Object.getPrototypeOf(Transition)).call(this, patchr));

    _this.options = _Utility2.default.extend(true, {}, {
      animate: !!_this.getPatchrOption('animate', Transition.defaults.animate),
      transition: _this.getPatchrOption('transition', Transition.defaults.transition)
    }, options);
    return _this;
  }

  /**
   * Fades an element in.
   *
   * @param {HTMLElement|jQuery} element
   *   The element to fade in.
   * @param {Number} [duration=null]
   *   Override the duration that is determined from the element or the
   *   fallbackDuration option.
   *
   * @chainable
   *
   * @return {*}
   *   The instance that invoked this method.
   */


  _createClass(Transition, [{
    key: 'fadeIn',
    value: function fadeIn(element) {
      var _this2 = this;

      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.promise(function (resolve, reject) {
        var $element = (0, _jquery2.default)(element);
        if (!_this2.getOption('animate')) {
          $element.show();
          return resolve();
        }
        return _this2.transitionEnd(_Utility2.default.forceReflow($element.addClass('fade')).addClass('in'), duration).then(resolve);
      });
    }

    /**
     * Fades an element out.
     *
     * @param {HTMLElement|jQuery} element
     *   The element to fade in.
     * @param {Number} [duration=null]
     *   Override the duration that is determined from the element or the
     *   fallbackDuration option.
     *
     * @chainable
     *
     * @return {*}
     *   The instance that invoked this method.
     */

  }, {
    key: 'fadeOut',
    value: function fadeOut(element) {
      var _this3 = this;

      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.promise(function (resolve, reject) {
        var $element = (0, _jquery2.default)(element);
        if (!_this3.getOption('animate')) {
          $element.hide();
          return resolve();
        }
        return _this3.transitionEnd($element.removeClass('in'), duration).then(resolve);
      });
    }

    /**
     * Executes a callback when a CSS transition has ended for an element.
     *
     * @param {HTMLElement|jQuery} element
     *   The element to target.
     * @param {Number} [duration=null]
     *   Override the duration that is determined from the element or the
     *   fallbackDuration option.
     *
     * @see http://blog.alexmaccaw.com/css-transitions
     *
     * @return {Promise}
     *   A Promise object.
     */

  }, {
    key: 'transitionEnd',
    value: function transitionEnd(element) {
      var _this4 = this;

      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.promise(function (resolve, reject) {
        var $element = (0, _jquery2.default)(element);

        // Immediately resolve if there is no transition support or animation
        // has been disabled.
        var end = _Utility2.default.getTransitionEvent('end');
        if (!end || !_this4.getOption('animate')) {
          return resolve();
        }

        // Attempt to use the element's own transition duration value, if it can
        // be determined. Otherwise use the fallback duration option, if set.
        duration = duration || parseFloat(_Utility2.default.forceReflow($element).css('transition-duration')) * 1000;
        if (isNaN(duration)) {
          duration = _this4.getOption('transition.fallbackDuration');
        }

        var invoked = false;
        $element.one(end, function () {
          invoked = true;
          resolve();
        });
        setTimeout(function () {
          if (!invoked) {
            $element.trigger(end);
          }
        }, duration || 0);
      });
    }
  }]);

  return Transition;
}(_patchr.Proxy);

/**
 * The default options for Transition.
 *
 * @type {Object}
 */


exports.default = Transition;
Transition.defaults = {

  /**
   * Flag determining if callbacks should wait for transitions to finish.
   *
   * @type {Boolean}
   */
  animate: true,

  /**
   * An object containing the transition options.
   *
   * @type {Object}}
   */
  transition: {

    /**
     * The duration, in milliseconds, that should pass before attempting to
     * manually invoke the callback as a fallback. By default, the element's
     * own transition duration will be used if it can be determined.
     *
     * @type {Number}
     */
    fallbackDuration: 300

  }

};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Utility":25}],25:[function(require,module,exports){
(function (global){
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

var _cssVendor = require('css-vendor');

var _cssVendor2 = _interopRequireDefault(_cssVendor);

var _domready = require('domready');

var _domready2 = _interopRequireDefault(_domready);

var _patchr = (typeof window !== "undefined" ? window['Patchr'] : typeof global !== "undefined" ? global['Patchr'] : null);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _transitionendProperty = require('transitionend-property');

var _transitionendProperty2 = _interopRequireDefault(_transitionendProperty);


// Global imports.
var styleSupported = function styleSupported(property, value) {
  property = _cssVendor2.default.supportedProperty(property);
  return property && _cssVendor2.default.supportedValue(property, value) ? property : false;
};

var cssSupport = {
  translate: styleSupported('transform', 'translate(1px, 1px)'),
  translate3d: styleSupported('transform', 'translate3d(1px, 1px, 1px)'),
  transition: styleSupported('transition', 'all 300ms linear')
};

var transitionEvents = { end: _transitionendProperty2.default || false };

var Utility = _patchr.Utility.extend(_patchr.Utility, {
  animationFrame: function animationFrame(callback) {
    (0, _raf2.default)(callback);
  },


  cssSupport: cssSupport,

  /**
   * Forces the element to reflow.
   *
   * @param {HTMLElement|jQuery|HTMLElement[]} element
   *   The element(s) to reflow.
   *
   * @return {HTMLElement|jQuery|HTMLElement[]}
   *   The original element parameter passed.
   */
  forceReflow: function forceReflow(element) {
    (0, _raf2.default)(function () {
      var elements = element instanceof _jquery2.default ? element.toArray() : [].concat(element);
      for (var i = 0, l = elements.length; i < l; i++) {
        elements[i].offsetWidth; // eslint-disable-line
      }
    });
    return element;
  },


  /**
   * Retrieves the browser supported transition event for a given type.
   *
   * @param {String} [type='end']
   *   The type of transition event to return. Note: this currently defaults to
   *   "end" because there is no real support for any other type of transition
   *   event in any browser. This may change, one day.
   *
   * @return {String|false}
   *   The browser supported transition event name for provided type or `false`.
   */
  getTransitionEvent: function getTransitionEvent() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'end';

    return transitionEvents[type] || false;
  },


  isHtmlElement: function isHtmlElement(element) {
    return element instanceof HTMLElement;
  },

  /**
   * Executes a function when the DOM is ready.
   *
   * @param {Function} fn
   *   The function to execute.
   */
  ready: function ready(fn) {
    (0, _domready2.default)(fn);
  }
});

exports.default = Utility;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"css-vendor":2,"domready":6,"raf":12,"transitionend-property":13}],26:[function(require,module,exports){
var _PatchrUi = require('./PatchrUi');

var _PatchrUi2 = _interopRequireDefault(_PatchrUi);


module.exports = function (options) {
  return new _PatchrUi2.default(options);
};

module.exports.__version__ = _PatchrUi2.default.__version__;
module.exports.defaults = _PatchrUi2.default.defaults;
module.exports.PatchrUi = _PatchrUi2.default;

},{"./PatchrUi":18}]},{},[26])(26)
});
