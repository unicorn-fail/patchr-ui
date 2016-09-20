import {Url, Proxy} from 'patchr';
import navigator from 'navigator';

export default class Ajax extends Proxy {

  /**
   * @class Ajax
   *
   * @param {Patchr} patchr
   *   The Patchr instance.
   * @param {Url|String} url
   *   The URL to load.
   */
  constructor(patchr, url) {
    super(patchr);

    /**
     * Flag indicating if the request was aborted.
     *
     * @type {Boolean}
     */
    this.aborted = false;

    /**
     * Flag indicating if the request is currently being sent.
     *
     * @type {Boolean}
     */
    this.active = false;

    /**
     * The Url instance.
     *
     * @type {Url}
     */
    this.url = Url.create(url);

    /**
     * The XMLHttpRequest instance.
     *
     * @type {XMLHttpRequest}
     */
    this.xhr = new XMLHttpRequest();

    this.xhr.onabort = (e) => this.abort(e);

    // Progress handler.
    this.xhr.onprogress = (e) => this.progress(e);

    // Error handler.
    this.xhr.onerror = (e) => this.complete(e);

    // Success handler.
    this.xhr.onload = (e) => this.complete(e);
  }

  /**
   * The abort handler.
   *
   * @param {Event} e
   *   The event.
   */
  abort(e) {
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
  complete(e) {
    if (this.xhr.readyState === 4) {
      this.active = false;
      if (this.xhr.status === 200) {
        let size = parseInt(this.xhr.getResponseHeader('content-length'), 10);
        if (!isNaN(size) && size) {
          this.url.size = size;
        }
        this.url.type = this.xhr.getResponseHeader('content-type') || null;
        this.emit('ajax.success', this, this.xhr.responseText);
      }
      else {
        this.emitError();
      }
    }
  }

  /**
   * Constructs an error message based on the current XHR state.
   */
  emitError() {
    let message;
    if (this.aborted) {
      message = this.t('The request has been aborted.');
    }
    else {
      message = this.xhr.status === 404 ? this.t('The requested file does not exist.') : this.t('Unable to load the request file.');
      message += navigator && navigator.onLine === false ? ' ' + this.t('You appear to be offline.') : '';
    }
    this.emit('ajax.error', this, new Error(message));
  }

  /**
   * The progress handler.
   *
   * @param {ProgressEvent<Event>} e
   *   The event.
   */
  progress(e) {
    this.emit('ajax.progress', e.loaded, e.total);
  }

  /**
   * Sends the ajax request.
   *
   * @return {Promise}
   *   A promise object.
   */
  send() {
    let error;
    let success;
    let off;
    return this.promise((fulfill, reject) => {
      // Bind the necessary listeners to handle the Promise fulfillment or
      // rejection based on whether it is for this Ajax instance.
      error = (e, ajax, error) => ajax === this && reject(error);
      success = (e, ajax, content) => ajax === this && fulfill(content);
      off = (content) => {
        this.off('ajax.error', error);
        this.off('ajax.success', success);
        return content;
      };
      this.on('ajax.error', error);
      this.on('ajax.success', success);

      if (this.emit('ajax.beforeSend', this)) {
        this.active = true;
        this.xhr.open('GET', this.url, true);
        this.xhr.send();
      }
    }).then(off);
  }

}
