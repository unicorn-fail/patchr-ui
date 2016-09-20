// Global imports.
import $ from 'jquery';
import {Url, Utility as util} from 'patchr';

// Local imports.
import Ajax from './Ajax';
import Infinity from './Infinity';
import Modal from './Modal';
import Progress from './Progress';
import Transition from './Transition';

export default class Reviewer extends Transition {

  constructor(patchr, url) {
    super(patchr);

    /**
     * The Parser instance, if any.
     *
     * @type {Parser}
     */
    this.parser = null;

    /**
     * The Url instance for this reviewer.
     *
     * @type {Url}
     */
    this.url = Url.create(url);

    /**
     * The unique identifier for this reviewer.
     *
     * @type {String}
     */
    this.id = this.url.sha1;

    /**
     * The modal for this reviewer.
     *
     * @type {Modal}
     */
    this.modal = new Modal(patchr, {id: this.id}).setTitle('Loading...');

    /**
     * The current query parameters for the reviewer.
     *
     * @type {Object}
     */
    this.query = {};

    /**
     * The patches DOM container.
     *
     * @type {jQuery}
     */
    this.$patches = $('<div class="patchr-patches"/>').appendTo(this.modal.$content);

    /**
     * A Progress instance, if any.
     *
     * @type {Progress}
     */
    this.progress = null;
  }

  close() {
    return this.modal.close();
  }

  maximize() {
    return this.modal.maximize();
  }

  minimize() {
    return this.modal.minimize();
  }

  open() {
    return this.modal.open().then(() => this.load());
  }

  /**
   * Provide a companion parseUrl method for the browser.
   *
   * @return {Promise}
   *   A Promise object.
   */
  load() {
    if (this.parser || this.loading) {
      return this.resolve();
    }

    // Indicate that URL is loading.
    this.loading = true;

    // Create a new ajax handler.
    let ajax = new Ajax(this.patchr, this.url);

    // Ajax abort handler.
    let ajaxAbort = () => ajax.xhr.abort();

    // Ajax progress handler.
    let ajaxProgress = (e, loaded, total) => {
      if (!this.progress) {
        this.progress = new Progress(this.patchr, this.modal.$content, {
          info: this.url.filename,
          total: total
        });
      }
      this.progress.current(loaded);
    };

    this.on('ajax.progress', ajaxProgress);
    this.on('close.modal', ajaxAbort);
    return ajax.send()
      .then(content => {
        this.off('ajax.progress', ajaxProgress);
        this.off('close.modal', ajaxAbort);

        // Reset progress to indicate that the parser is initializing.
        this.progress.state('initializing');
        this.progress.current(0);
        return this.transitionEnd(this.progress.bar).then(() => content);
      })
      .then(content => this.proxy('getParser', [content, ajax.url]))
      .then(parser => {
        // Override the modal title with the URL filename.
        this.modal.setTitle(this.url.filename);
        this.parser = parser;
        this.progress.current(this.progress.total());
        return this.transitionEnd(this.progress.bar);
      })
      .then(() => this.progress.destroy())
      .then(() => this.renderPatches())
      .finally(() => {
        this.loading = false;
        this.progress = null;
      })
      .catch((e) => {
        if (ajax.aborted) {
          this.modal.$content.html('');
        }
        // Rethrow error only if user didn't abort.
        else {
          return this.reject(e);
          // @todo move into a proper error handler?
          // this.modal.$content.html(`<div class="patchr-error">${e.message}</div>`);
        }
      });
  }

  navigateToPatch(e) {
    e.preventDefault();
    e.stopPropagation();
    let $current = $(e.currentTarget).addClass('active');
    this.$patchMenu.find('a').not($current).removeClass('active');
    this.proxy('navigate', [null, {patch: $current.data('patch')}]);
  }

  renderPatches() {
    return this.resolve(this.parser.patches.length > 1 ? this.parser.renderPatchesMenu() : false)
      .then(menu => {
        if (menu) {
          this.$patchMenu = $(menu.toString());
          this.$patchMenu.delegate('a', 'click.patchr.patch.menu', this.navigateToPatch.bind(this));
          this.modal.$footer.prepend(this.$patchMenu);
          this.$patchMenu.find(`a:nth(${this.query.patch && (this.query.patch - 1) || 0})`).trigger('click.patchr.patch.menu');
        }
      })
      .then(() => {
        return this.each(this.parser.patches, (patch) => {
          let container = patch.renderContainer();
          if (this.parser.patches.length > 1) {
            container.addClass('fade');
          }
          let $patch = $(container.setAttribute('data-patch', patch.index + 1).toString());
          this.$patches.append($patch);
          new Infinity(this.patchr, $patch[0], {
            items: patch.files
          });
        });
      });
  }

  renderFileList() {
    this.fileList = new Infinity(this.patchr, {
      source: this.parser.patches
    });
  }

  renderStats() {
    return this.promise((resolve, reject) => {
      resolve(this.parser.renderDiffStats().toString());
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
  setQuery(query = {}) {
    this.query = util.isObject(query) ? query : util.deparam(query);
    // If the query
    if (this.query.patch && this.$patchMenu) {
      this.showPatch(this.query.patch);
    }
    return this;
  }

  showPatch(patch) {
    let $patches = this.$patches.children();
    this.$activePatch = $patches.filter(`[data-patch=${patch}]`);
    this.fadeOut($patches.not(this.$activePatch));
    this.fadeIn(this.$activePatch);
  }

}
