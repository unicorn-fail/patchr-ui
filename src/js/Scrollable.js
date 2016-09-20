// Local imports.
import _ from './Utility';
import ScrollBar from './ScrollBar';
import Transition from './Transition';

export default class Scrollable extends Transition {

  constructor(patchr, element, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error(`The "element" argument passed must be an instance of HTMLElement: ${element}`);
    }

    super(patchr, options);

    /**
     * @type {HTMLElement}
     */
    this.container = document.createElement('div');
    this.container.classList.add('patchr-scrollable');
    _.forceReflow(element).appendChild(this.container);

    /**
     * The inner height.
     *
     * @type {Number}
     */
    this.innerHeight = 0;

    /**
     * The previous scrollTop position.
     *
     * @type {number}
     */
    this.previousScrollTop = -1;

    /**
     * The ScrollBar instance.
     *
     * Note: must be created after container and inner are attached to the DOM.
     *
     * @type {ScrollBar}
     */
    this.scrollbar = new ScrollBar(patchr, this.container);

    /**
     * The current scrollTop position.
     *
     * @type {number}
     */
    this.scrollTop = 0;

    // Listen for scrolling events.
    this
      .on('scroll.pageUp', this.proxyScrollEvent('scrollPageUp'))
      .on('scroll.pageDown', this.proxyScrollEvent('scrollPageDown'))
      .on('scroll.to', this.proxyScrollEvent('scrollTo'))
      .on('scroll.wheel', this.proxyScrollEvent('scrollWheel'))
    ;

    // Listen for window resize event.
    window.addEventListener('resize', this.resize.bind(this), false);

    this.resize();
  }

  /**
   * Updates the Scrollable container.
   */
  draw() {
    _.animationFrame(() => {
      this.scrollbar.setLength(this.height / this.innerHeight);
      this.scrollbar.setPosition(this.scrollTop / (this.innerHeight - this.height));
    });
  }

  proxyScrollEvent(method) {
    return (e, scrollbar, ...args) => {
      // Only proxy if the scrollbar instance passed is the same as this one.
      if (scrollbar === this.scrollbar) {
        this[method].apply(this, [e, scrollbar].concat(args));
      }
    };
  }

  resize() {
    this.position = this.container.getBoundingClientRect();
    this.width = this.position.width;
    this.height = this.position.height;
    this.pageOffset = this.height / 2 * 40;
    this.scrollbar.resize();
  }

  scrollPageDown() {
    this.setScrollTop(this.scrollTop + this.pageOffset);
  }

  scrollPageUp() {
    this.setScrollTop(this.scrollTop - this.pageOffset);
  }

  scrollTo(e, scrollbar, scrollTo) {
    this.setScrollTop(scrollTo * (this.innerHeight - this.height));
  }

  scrollWheel(e, scrollbar, wheel) {
    this.setScrollTop(this.scrollTop + wheel.pixelY);
  }

  setScrollTop(scrollTop = null) {
    if (scrollTop === null) {
      return this.scrollTop;
    }
    this.previousScrollTop = this.scrollTop;
    this.scrollTop = Math.max(Math.min(parseFloat(scrollTop), this.innerHeight - this.height), 0);
    if (isNaN(this.scrollTop) || this.scrollTop < 0) {
      this.scrollTop = 0;
    }
    else if (this.scrollTop > this.innerHeight - this.height) {
      this.scrollTop = this.innerHeight - this.height;
    }
    // Redraw if the scrollTop has changed.
    if (this.previousScrollTop !== this.scrollTop) {
      this.draw();
    }
  }

}

Scrollable.defaults = {};
