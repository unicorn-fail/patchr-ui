// Global imports.
import {Patchr, Url} from 'patchr';
import Prism from 'prismjs';

// Local imports.
import _ from './Utility';
import Reviewer from './Reviewer';
import Router from './Router';

export default class PatchrUi extends Patchr {

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
  constructor(options = {}) {
    super(_.extend(true, {}, PatchrUi.defaults, options));

    /**
     * The active reviewer, if any.
     *
     * @type {Reviewer}
     */
    this.activeReviewer = null;

    /**
     * Flag indicating whether the instance has been initialized.
     *
     * @type {Boolean}
     */
    this.initialized = false;

    /**
     * An array of Reviewer instances.
     *
     * @type {Object<String, Reviewer>}
     */
    this.reviewers = {};

    /**
     * The Router instance.
     *
     * @type {Router}
     */
    this.router = null;

    // Initialize the instance.
    this.init();
  }

  init() {
    // Add a comment button to each line.
    if (this.getOption('comments')) {
      this.on('render.line.end', function (e, line) {
        let code = line.rendered.children[2];
        if (code) {
          code.prepend(`<button type="button" class="patchr-btn patchr-btn--secondary add-comment" data-action="addComment" aria-label="${this.t('Add Comment')}"><span class="dui-icon dui-icon--plus" aria-hidden="true"></span></button>`);
        }
      });
    }

    // Convert any passed URLs into proper Url objects.
    this.setUrls(this.getOption('urls', []));

    this
      .on('render.file.end', (e, file) => {
        file.rendered.children[0].addClass('patchr-affix');
      })
      // Clear route when a modal is closed or minimized.
      .on('closed.modal minimized.modal', (e, modal) => {
        if (this.activeReviewer && this.activeReviewer.modal === modal) {
          this.router.clear();
          if (e.type === 'closed') {
            this.activeReviewer = null;
          }
        }
      })
      .on('maximized.modal', (e, modal) => {
        if (this.activeReviewer && this.activeReviewer.modal === modal) {
          this.router.redirect(this.activeReviewer.url.sha1);
        }
      })
    ;

    // Create a new Router instance.
    this.router = new Router(this);
    let prefix = this.router.getPrefix();

    // Create a URL loader route.
    this.router.addRoute(`${prefix}/:url`, this.loadUrl.bind(this));

    // Create a generic route that will remove the active modal.
    this.router.addRoute('*', () => {
      if (this.activeModal) {
        if (this.activeModal.visible) {
          this.activeModal.hide();
        }
        this.activeModal = null;
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
  loadUrl(params, query = '') {
    // Convert query string into an object.
    query = _.deparam(query);

    // Get the URL.
    let url = this.getUrl(decodeURIComponent(params.url));

    // If a Url object could not be found, do not resolve.
    if (!url) {
      this.router.clear();
      return false;
    }

    // Retrieve the reviewer.
    let reviewer = this.getReviewer(url);

    // Set the active query.
    reviewer.setQuery(query);

    // Load the modal from the URL.
    if (this.activeReviewer && this.activeReviewer !== reviewer) {
      this.activeReviewer.close().then(() => {
        reviewer.open();
        this.activeReviewer = reviewer;
      });
    }
    else {
      reviewer.open().then(() => {
        this.activeReviewer = reviewer;
      });
    }
  }

  navigate(url = null, query = {}) {
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
  setUrls(urls, merge) {
    for (let i = 0, l = urls.length; i < l; i++) {
      if (!(urls[i] instanceof Url)) {
        urls[i] = new Url(urls[i]);
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
  getUrl(string = null) {
    let url = null;
    if (string && _.isSha1(string)) {
      url = this.options.urls.filter((url) => url.sha1 === string)[0] || null;
    }
    else if (string && _.isUrl(string)) {
      url = this.options.urls.filter((url) => url.url === string)[0] || null;
      if (!url) {
        url = new Url(string);
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
  getReviewer(url) {
    url = Url.create(url);
    if (!this.reviewers[url.sha1]) {
      this.reviewers[url.sha1] = new Reviewer(this, url);
    }
    return this.reviewers[url.sha1];
  }

}

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
  highlighter: Prism || null,

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
