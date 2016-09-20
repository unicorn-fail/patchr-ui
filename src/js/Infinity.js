// Local imports.
import _ from './Utility';
import InfinityItem from './InfinityItem';
import Scrollable from './Scrollable';

export default class Infinity extends Scrollable {

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
  constructor(patchr, element, options) {
    super(patchr, element);

    // Because we need to get any passed infinity options from the
    // Patchr instance, we cannot simply pass this to super above.
    this.options = _.extend(true, {}, this.options, Infinity.defaults, this.getPatchrOption('infinity', {}), options);

    /**
     * Number of container height multipliers used to keep items in the DOM.
     *
     * @type {Number}
     */
    this.buffer = this.getOption('buffer') || 1;

    /**
     * An array of InfinityItem instances.
     *
     * @type {InfinityItem[]}
     */
    this.items = [];

    /**
     * An array of visible InfinityItem instances.
     *
     * @type {InfinityItem[]}
     */
    this.visibleItems = [];

    this.container.classList.add('patchr-infinity');

    // Add any passed items.
    let items = this.getOption('items', []);
    for (let i = 0, l = items.length; i < l; i++) {
      this.add(items[i]);
    }

    // Resize and draw after items have been added.
    this.resize();
    this.draw();
  }

  /**
   * Adds a Renderable item to this Infinity instance.
   *
   * @param {Renderable} renderable
   *   A Renderable instance.
   */
  add(renderable) {
    this.items.push(renderable instanceof InfinityItem ? renderable : new InfinityItem(this, renderable));
  }

  /**
   * {@inheritDoc}
   */
  draw() {
    // Update scrollbar.
    super.draw();

    // Update visible items.
    _.animationFrame(() => {
      let buffer = this.height * this.buffer;
      let previousItems = this.visibleItems;
      this.visibleItems = [];
      let firstIndex = null;
      for (let i = 0, l = this.items.length; i < l; i++) {
        let item = this.items[i];
        let top = this.scrollTop - buffer;
        let bottom = this.scrollTop + this.height + buffer;
        if (item.y + item.height >= top && item.y <= bottom) {
          if (firstIndex === null) {
            firstIndex = i;
          }
          this.visibleItems.push(item.attach());
        }
      }

      // If there's only 1 visible item, then it's a massive item that takes
      // up the whole container height buffer distance. Instead, switch the
      // buffer to load the next N items.
      if (this.visibleItems.length === 1) {
        let nextItems = this.items.slice(firstIndex, firstIndex + this.buffer);
        for (let i = 0, l = nextItems.length; i < l; i++) {
          this.visibleItems.push(nextItems[i].attach());
        }
      }

      // Detach any previous items.
      for (let i = 0, l = previousItems.length; i < l; i++) {
        let item = previousItems[i];
        if (_.indexOf(this.visibleItems, item) === -1) {
          item.detach();
        }
      }
    });
  }

}

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
