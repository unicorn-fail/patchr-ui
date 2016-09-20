// Global imports.
import {Utility as util} from 'patchr';
import Hamster from 'hamsterjs';

// Local imports.
import Transition from './Transition';

export default class ScrollBar extends Transition {

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
  constructor(patchr, element, options = {}) {
    super(patchr);

    if (!(element instanceof HTMLElement)) {
      throw new Error(`The "element" argument passed must be an instance of HTMLElement: ${element}`);
    }

    // Because we need to get any passed infinity options from the
    // Patchr instance, we cannot simply pass this to super above.
    this.options = util.extend(true, {}, this.options, ScrollBar.defaults, this.getPatchrOption('scrollBar', {}), options);

    /**
     * @type {HTMLElement}
     */
    this.bar = document.createElement('div');
    this.bar.classList.add('patchr-scroll-bar');

    /**
     * The bar margin.
     *
     * @type {Number}
     */
    this.barMargin = this.getOption('bar.margin');

    /**
     * The bar minimum height.
     *
     * @type {Number}
     */
    this.barMinHeight = this.getOption('bar.minHeight');

    /**
     * The bar width.
     *
     * @type {Number}
     */
    this.barWidth = this.getOption('bar.width');

    /**
     * The containing element.
     *
     * @type {HTMLElement}
     */
    this.container = element;

    /**
     * The total height.
     *
     * @type {Number}
     */
    this.height = 0;

    /**
     * The current length.
     *
     * @type {Number}
     */
    this.length = 1;

    /**
     * Flag indicating if user initiated manual scrolling
     * (mousedown/touchstart).
     *
     * @type {Boolean}
     */
    this.manuallyScrolling = false;

    /**
     * The current position.
     *
     * @type {Number}
     */
    this.position = 0;

    /**
     * @type {HTMLElement}
     */
    this.track = document.createElement('div');
    this.trackWidth = this.barWidth + this.barMargin * 2;
    this.track.classList.add('patchr-scroll-track');
    this.track.classList.add('fade');
    this.track.style.width = (this.trackWidth - 2) + 'px';
    this.track.appendChild(this.bar);
    element.appendChild(this.track);

    /**
     * The total width.
     *
     * @type {Number}
     */
    this.width = 0;

    /**
     * Determines if browser supports passive events.
     *
     * @type {Boolean|Object}
     */
    this.passive = false;
    try {
      let opts = Object.defineProperty({}, 'passive', {
        get: () => {
          this.passive = {passive: true};
        }
      });
      window.addEventListener('test', null, opts);
    }
    catch (e) {
      // Intentionally left empty.
    }

    // Add listener for wheel event (based on browser support).
    Hamster(element).wheel(this.wheel.bind(this), this.passive);

    // Bind listeners to the BODY DOM element for a more natural feel.
    document.body.addEventListener('mousedown', this.down.bind(this), this.passive);
    document.body.addEventListener('mousemove', this.move.bind(this), this.passive);
    document.body.addEventListener('mouseup', this.up.bind(this), this.passive);
    document.body.addEventListener('touchstart', this.down.bind(this), this.passive);
    document.body.addEventListener('touchmove', this.move.bind(this), this.passive);
    document.body.addEventListener('touchend', this.up.bind(this), this.passive);
    window.addEventListener('resize', this.resize.bind(this), this.passive);
    this.resize();

    /**
     * The timer instance.
     *
     * @type {Number}
     */
    this.timer = null;
  }

  destroy() {
    this.destroyTimer();
    document.body.removeEventListener('mousedown', this.down.bind(this), this.passive);
    document.body.removeEventListener('mousemove', this.move.bind(this), this.passive);
    document.body.removeEventListener('mouseup', this.up.bind(this), this.passive);
    document.body.removeEventListener('touchstart', this.down.bind(this), this.passive);
    document.body.removeEventListener('touchmove', this.move.bind(this), this.passive);
    document.body.removeEventListener('touchend', this.up.bind(this), this.passive);

    // Add listener for wheel event (based on browser support).
    Hamster(this.container).unwheel(void 0, this.passive);

    this.container.removeChild(this.track);
    this.container = null;
    this.track = null;
    this.bar = null;
  }

  setLength(length = null) {
    if (length !== null) {
      this.length = Math.max(Math.min(1, length), 0);
    }
    this.length = Math.max(this.length * this.height, this.barMinHeight);
    this.bar.style.height = this.length + 'px';
  }

  setPosition(position = null) {
    if (position !== null) {
      this.position = Math.max(Math.min(1, position), 0);
    }
    this.position = this.position * this.getEmpty();
    this.bar.style.top = this.position + 'px';
  }

  down(e) {
    let touch = window.TouchEvent && e instanceof window.TouchEvent;

    // Immediately return if not this instance's bar or track element.
    if (!touch && e.target !== this.bar && e.target !== this.track) {
      return;
    }
    let offsetY = this.getOffset(e).y;
    if (touch || e.target === this.bar) {
      e.stopPropagation();
      this.manuallyScrolling = true;
      this.scrollTop = offsetY;
      this.emit('scroll.mousedown', this);
    }
    else if (e.target === this.track) {
      e.stopPropagation();
      if (offsetY < this.position) {
        this.emit('scroll.pageUp', this);
      }
      else if (offsetY > (this.position + this.length)) {
        this.emit('scroll.pageDown', this);
      }
    }
  }

  getEmpty() {
    return this.height - this.length;
  }

  getOffset(event) {
    let e = window.TouchEvent && event instanceof window.TouchEvent ? event.changedTouches[0] : event;
    let target = e.currentTarget || e.srcElement || e.target;
    let cx = e.clientX || 0;
    let cy = e.clientY || 0;
    let rect = target === window || target === document || target === document.body ? {left: 0, top: 0} : target.getBoundingClientRect();
    return {
      x: cx - rect.left,
      y: cy - rect.top
    };
  }

  move(e) {
    let touch = window.TouchEvent && e instanceof window.TouchEvent;

    // Keep ScrollBar visible if user is moving over bar or track DOM element.
    if (!touch && !this.manuallyScrolling && (e.target === this.bar || e.target === this.track)) {
      this.show();
    }
    else if (this.manuallyScrolling) {
      e.stopPropagation();
      let scrollTo = this.getEmpty();
      if (scrollTo) {
        let offsetY = this.getOffset(e).y;
        scrollTo = touch || e.target === this.bar ? (this.position + offsetY - this.scrollTop) / scrollTo : (offsetY - this.scrollTop) / scrollTo;
      }
      this.emit('scroll.to', this, scrollTo)
        .then(() => this.setPosition(scrollTo))
        .then(() => this.show());
    }
  }

  up(e) {
    if (this.manuallyScrolling) {
      e.stopPropagation();
      this.move(e);
      this.manuallyScrolling = false;
      this.emit('scroll.mouseup', this).then(() => this.hide());
    }
  }

  hide() {
    this.destroyTimer();
    if (!this.manuallyScrolling) {
      this.destroyTimer();
      if (this.track.classList.contains('in')) {
        return this.fadeOut(this.track);
      }
      else {
        return this.resolve(this.track);
      }
    }
  }

  destroyTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = null;
  }

  resize() {
    let position = this.container.getBoundingClientRect();
    this.width = position.width;
    this.height = position.height;
    this.setLength();
    this.setPosition();
  }

  show() {
    // Immediately return if there is no empty space in the track.
    if (!this.getEmpty()) {
      return this.resolve(this.track);
    }

    this.destroyTimer();
    let promise = this.track.classList.contains('in') ? this.resolve(this.track) : this.fadeIn(this.track);
    return promise.then(() => {
      this.timer = setTimeout(() => {
        this.hide();
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
  wheel(wheel, delta, deltaX, deltaY) {
    // The deltaX and deltaY properties inside the wheel object are not the same
    // as the arguments passed here (which are the correct values).
    let x = Math.abs(deltaX);
    let y = Math.abs(deltaY);
    wheel.deltaX = deltaX;
    wheel.deltaY = deltaY;
    wheel.pixelX = deltaX < 0 ? x : -x;
    wheel.pixelY = deltaY < 0 ? y : -y;
    this.emit('scroll.wheel', this, wheel).then(() => wheel.pixelY !== 0 && this.show());
  }

}

ScrollBar.defaults = {
  bar: {
    minHeight: 25,
    margin: 3,
    width: 12
  }
};
