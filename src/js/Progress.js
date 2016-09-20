// Global imports.
import $ from 'jquery';

// Local imports.
import _ from './Utility';
import Transition from './Transition';

export default class Progress extends Transition {

  constructor(patchr, container, options = {}) {
    super(patchr);

    // Set the options.
    this.options = _.extend(true, {}, this.options, Progress.defaults, this.getPatchrOption('progress'), options);

    /**
     * @type {HTMLElement}
     */
    this.container = container instanceof $ ? container[0] : container;

    // Ensure the element passed is a DOM element.
    _.typeCheck(this.container, HTMLElement);

    let temp = document.createElement('div');
    temp.innerHTML = this.getPatchrOption('throbber');

    /**
     * @type {HTMLElement}
     */
    this.throbber = temp.firstChild;

    /**
     * @type {HTMLElement}
     */
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('patchr-progress');
    this.wrapper.classList.add('fade');

    /**
     * @type {HTMLElement}
     */
    this.bar = document.createElement('div');
    this.bar.classList.add('patchr-progress-bar');
    this.wrapper.appendChild(this.bar);

    this.container.appendChild(this.throbber);
    this.container.appendChild(this.wrapper);
    this.fadeIn(this.throbber);
    this.fadeIn(this.wrapper);
  }

  current(current = null) {
    if (current !== null) {
      return this.setOption('current', current).update();
    }
    return this.getOption('current');
  }

  /**
   * Destroys the Progress instance.
   *
   * @return {Promise}
   *   A Promise object.
   */
  destroy() {
    this.fadeOut(this.throbber).then(() => {
      if (this.container.contains(this.throbber)) {
        this.container.removeChild(this.throbber);
      }
      this.throbber = null;
    });
    return this.fadeOut(this.wrapper).then(() => {
      if (this.container.contains(this.wrapper)) {
        this.container.removeChild(this.wrapper);
      }
      this.wrapper = null;
      this.bar = null;
    });
  }

  increase(value = 0) {
    return this.current(this.current() + value);
  }

  info(info = null) {
    if (info !== null) {
      return this.setOption('info', info).update();
    }
    return this.getOption('info');
  }

  percent() {
    return Math.ceil(Math.round((100 / this.total()) * this.current()));
  }

  state(state = null) {
    if (state !== null) {
      return this.setOption('state', state).update();
    }
    return this.getOption('state');
  }

  total(total = null) {
    if (total !== null) {
      return this.setOption('total', total).update();
    }
    return this.getOption('total');
  }

  update() {
    _.animationFrame(() => {
      let percent = this.percent();
      this.throbber.setAttribute('data-state', this.state());
      this.wrapper.setAttribute('data-state', this.state());
      this.bar.setAttribute('data-percent', percent);
      this.bar.setAttribute('data-info', this.info());
      this.bar.style.width = percent + '%';
    });
    return this;
  }

}

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
