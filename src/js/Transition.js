// Global imports.
import $ from 'jquery';
import {Proxy} from 'patchr';

// Local imports.
import _ from './Utility';

export default class Transition extends Proxy {

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
  constructor(patchr, options) {
    super(patchr);

    // Because we need to get any passed transition options from the
    // Patchr instance, we cannot simply pass this to super above.
    this.options = _.extend(true, {}, {
      animate: !!this.getPatchrOption('animate', Transition.defaults.animate),
      transition: this.getPatchrOption('transition', Transition.defaults.transition)
    }, options);
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
  fadeIn(element, duration = null) {
    return this.promise((resolve, reject) => {
      let $element = $(element);
      if (!this.getOption('animate')) {
        $element.show();
        return resolve();
      }
      return this.transitionEnd(_.forceReflow($element.addClass('fade')).addClass('in'), duration).then(resolve);
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
  fadeOut(element, duration = null) {
    return this.promise((resolve, reject) => {
      let $element = $(element);
      if (!this.getOption('animate')) {
        $element.hide();
        return resolve();
      }
      return this.transitionEnd($element.removeClass('in'), duration).then(resolve);
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
  transitionEnd(element, duration = null) {
    return this.promise((resolve, reject) => {
      let $element = $(element);

      // Immediately resolve if there is no transition support or animation
      // has been disabled.
      let end = _.getTransitionEvent('end');
      if (!end || !this.getOption('animate')) {
        return resolve();
      }

      // Attempt to use the element's own transition duration value, if it can
      // be determined. Otherwise use the fallback duration option, if set.
      duration = duration || parseFloat(_.forceReflow($element).css('transition-duration')) * 1000;
      if (isNaN(duration)) {
        duration = this.getOption('transition.fallbackDuration');
      }

      let invoked = false;
      $element.one(end, () => {
        invoked = true;
        resolve();
      });
      setTimeout(() => {
        if (!invoked) {
          $element.trigger(end);
        }
      }, duration || 0);
    });
  }

}

/**
 * The default options for Transition.
 *
 * @type {Object}
 */
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
