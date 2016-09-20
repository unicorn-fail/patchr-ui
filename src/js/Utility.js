// Global imports.
import $ from 'jquery';
import cssVendor from 'css-vendor';
import domready from 'domready';
import {Utility as _} from 'patchr';
import raf from 'raf';
import transitionend from 'transitionend-property';

const styleSupported = function (property, value) {
  property = cssVendor.supportedProperty(property);
  return property && cssVendor.supportedValue(property, value) ? property : false;
};

const cssSupport = {
  translate: styleSupported('transform', 'translate(1px, 1px)'),
  translate3d: styleSupported('transform', 'translate3d(1px, 1px, 1px)'),
  transition: styleSupported('transition', 'all 300ms linear')
};

const transitionEvents = {end: transitionend || false};

const Utility = _.extend(_, {

  animationFrame(callback) {
    raf(callback);
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
  forceReflow(element) {
    raf(() => {
      let elements = element instanceof $ ? element.toArray() : [].concat(element);
      for (let i = 0, l = elements.length; i < l; i++) {
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
  getTransitionEvent(type = 'end') {
    return transitionEvents[type] || false;
  },

  isHtmlElement: (element) => {
    return element instanceof HTMLElement;
  },

  /**
   * Executes a function when the DOM is ready.
   *
   * @param {Function} fn
   *   The function to execute.
   */
  ready(fn) {
    domready(fn);
  }

});

export default Utility;
