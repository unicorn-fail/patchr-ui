// Global imports.
import {Proxy} from 'patchr';
import Navigo from 'navigo';

// Local imports.
import _ from './Utility';

export default class Router extends Proxy {

  constructor(patchr, options = {}) {
    super(patchr);

    // Set the options.
    this.options = _.extend(true, {}, this.options, Router.defaults, this.getPatchrOption('router'), options);

    /**
     * Flag indicating whether the instance has been initialized.
     *
     * @type {Boolean}
     */
    this.initialized = false;

    /**
     * The Navigo router instance.
     *
     * @type {Navigo}
     */
    this.navigo = null;

    /**
     * The route handlers.
     *
     * @type {Object}
     */
    this.routes = null;

    // Initialize the instance.
    this.init();
  }

  init() {
    if (this.initialized) {
      return;
    }

    // Reset the route handlers.
    this.routes = {};

    // Initialize a new Navigo instance.
    this.navigo = new Navigo();

    let prefix = this.getPrefix();

    // Remove any hash prefix.
    let hashedRoutePrefixRegExp = new RegExp('#/?' + prefix.substr(1) + '/');
    if (typeof window !== 'undefined' && window.history && window.history.replaceState && window.location.href.match(hashedRoutePrefixRegExp)) {
      window.history.replaceState({}, '', window.location.href.replace(hashedRoutePrefixRegExp, prefix + '/'));
    }

    // Routes should only be added and then resolved when the DOM is ready
    // since navigating to a route essentially manipulates the DOM.
    _.ready(() => {
      this.navigo.on(this.routes).resolve();
      this.initialized = true;
    });
  }

  addRoute(route, fn) {
    if (!_.isFunction(fn)) {
      throw new TypeError(`The "fn" argument must be a valid callback of the type "Function": ${fn}`);
    }
    this.routes[route] = fn;
  }

  clear() {
    // Clear out the last resolved route so it will actual fire the handler.
    this.navigo._lastRouteResolved = false;
    this.navigo.navigate('');

    // Remove any lingering forward slashes.
    if (/\/$/.test(window.location.href) && typeof window !== 'undefined' && window.history && window.history.replaceState) {
      window.history.replaceState({}, '', window.location.href.replace(/\/$/, ''));
    }
  }

  getPrefix() {
    let prefix = this.getOption('prefix', '');
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
  navigate(url = null, query = {}, redirect = !this.initialized) {
    query = _.param(query);
    url = this.proxy('getUrl', [url]);
    if (url) {
      // Clear out the last resolved route so it will actual fire the handler.
      this.navigo._lastRouteResolved = null;
      url = encodeURIComponent(url[this.getOption('sha1', !!this.getPatchrOption('urls').length) ? 'sha1' : 'url']);
    }
    else if (this.navigo._lastRouteResolved && query) {
      url = this.navigo._lastRouteResolved.url;
    }

    if (url) {
      if (query) {
        url += `?${query}`;
      }
      let prefix = this.getPrefix();
      url = prefix + '/' + url.replace(new RegExp(`^${prefix}/?`), '');
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
  redirect(url = null, query = {}) {
    this.navigate(url, query, true);
  }

}

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
