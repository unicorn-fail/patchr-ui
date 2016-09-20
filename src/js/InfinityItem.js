// Global imports.
import {Proxy, Renderable} from 'patchr';

// Local imports.
import Infinity from './Infinity';

export default class InfinityItem extends Proxy {

  /**
   * @class InfinityItem
   *
   * @param {Infinity} infinity
   *   The Infinity instance this item belongs to.
   * @param {Renderable} item
   *   A Renderable instance.
   */
  constructor(infinity, item) {
    if (!(infinity instanceof Infinity)) {
      throw new Error(`The "infinity" argument must be an instance of Infinity: ${infinity.name}`);
    }

    if (!(item instanceof Renderable)) {
      throw new Error(`The "item" argument must be an instance of Renderable: ${item.name}`);
    }

    super(infinity.patchr);

    /**
     * An array of affixed elements.
     *
     * @type {HTMLElement[]}
     */
    this.affixed = [];

    /**
     * An array of cloned affixed elements.
     *
     * @type {HTMLElement[]}
     */
    this.affixedClone = [];

    /**
     * @type {HTMLElement}
     */
    this.element = null;

    /**
     * The height of the element, minus margins.
     *
     * @type {Number}
     */
    this.height = item.outerHeight();

    /**
     * The Infinity instance this item belongs to.
     *
     * @type {Infinity}
     */
    this.infinity = infinity;

    /**
     * @type {Renderable}
     */
    this.item = item;

    /**
     * The height of the element, plus margins.
     *
     * @type {Number}
     */
    this.totalHeight = item.outerHeight(true);

    /**
     * The Y (top) position of the element.
     *
     * @type {Number}
     */
    this.y = infinity.innerHeight;

    // Increase the infinity innerHeight.
    infinity.innerHeight += this.totalHeight;
  }

  /**
   * Attaches the InfinityItem to the DOM.
   *
   * @return {InfinityItem}
   *   The current instance.
   */
  attach() {
    if (!this.isAttached()) {
      this.render();
      this.infinity.container.appendChild(this.element);
      this.attachAffixed();
    }
    this.draw();
    return this;
  }

  /**
   * Attaches the affixed elements to the DOM.
   *
   * @return {InfinityItem}
   *   The current instance.
   */
  attachAffixed() {
    if (this.element) {
      this.detachAffixed();
      this.affixed = Array.prototype.slice.call(this.element.querySelectorAll('.patchr-affix'));
      this.affixedClone = [];
      for (let i = 0, l = this.affixed.length; i < l; i++) {
        let original = this.affixed[i];
        let clone = original.cloneNode(true);
        clone.classList.add('patchr-affixed');
        clone.style.display = 'none';
        clone.style.position = 'absolute';
        clone.style.top = `${original.offsetTop}px`;
        clone.style.left = `${original.offsetLeft}px`;
        clone.style.height = `${original.offsetHeight}px`;
        clone.style.width = `${original.offsetWidth}px`;
        clone.style.zIndex = 100;
        this.element.insertBefore(clone, this.element.firstChild);
        this.affixedClone[i] = clone;
      }
    }
    return this;
  }

  /**
   * Destroys the InfinityItem.
   *
   * @return {InfinityItem}
   *   The current instance.
   */
  destroy() {
    this.detach();
    this.affixed = [];
    this.element = null;
    return this;
  }

  /**
   * Detaches the InfinityItem from the DOM.
   *
   * @return {InfinityItem}
   *   The current instance.
   */
  detach() {
    if (this.isAttached()) {
      this.detachAffixed();
      // @todo Remove the element from memory (i.e. don't assign removed
      // element back to this.element)? This is currently stored to prevent
      // flickering, but could cause issues if thousands of items.
      this.element = this.infinity.container.removeChild(this.element);
    }
    return this;
  }

  /**
   * Detaches affixed elements from the DOM.
   *
   * @return {InfinityItem}
   *   The current instance.
   */
  detachAffixed() {
    for (let i = 0, l = this.affixed.length; i < l; i++) {
      this.affixed.splice(i, 1);
      if (this.affixedClone[i]) {
        if (this.element.contains(this.affixedClone[i])) {
          this.element.removeChild(this.affixedClone[i]);
        }
        this.affixedClone.splice(i, 1);
      }
    }
    return this;
  }

  /**
   * Updates the element's position based on current Infinity scrollTop value.
   *
   * @return {InfinityItem}
   *   The current instance.
   */
  draw() {
    let attached = this.isAttached();
    this.top = this.y - this.infinity.scrollTop;
    if (attached) {
      this.element.style.transform = `translate3d(0,${this.infinity.scrollTop * -1}px,0)`;
    }

    // Update affixed items.
    for (let i = 0, l = this.affixed.length; i < l; i++) {
      let original = this.affixed[i];
      let clone = this.affixedClone[i];
      let originalTop = this.top + original.offsetTop;
      let originalBottom = originalTop + this.height;

      // The clone affixed element is relative to the InfinityItem container.
      let cloneTop = 0;
      if (originalTop < 0) {
        cloneTop -= originalTop;
      }
      let cloneHeight = originalBottom - original.offsetHeight;
      if (cloneHeight < 0) {
        cloneTop += cloneHeight;
      }
      clone.style.display = attached && originalTop <= 0 && originalBottom >= 0 ? 'block' : 'none';
      clone.style.transform = `translate3d(0,${cloneTop}px,0)`;
    }

    return this;
  }

  /**
   * Determines if the element is currently attached to the DOM.
   *
   * @return {Boolean}
   *   True or false.
   */
  isAttached() {
    return !!(this.element && this.infinity.container.contains(this.element));
  }

  /**
   * Renders the InfinityItem.
   *
   * @return {InfinityItem}
   *   The current instance.
   */
  render() {
    // Immediately return if element is already rendered.
    if (this.element) {
      return this;
    }

    // Create a loading placeholder.
    this.element = document.createElement('div');
    this.element.classList.add('patchr-infinity-item');
    this.element.classList.add('loading');
    this.element.style.height = `${this.totalHeight}px`;
    this.element.style.width = `${this.infinity.width}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.transform = `translate3d(0,${this.infinity.scrollTop * -1}px,0)`;

    // Render the item's placeholder.
    let placeholder = this.item.renderPlaceholder();
    placeholder.children[0].addClass('patchr-affix');
    this.element.innerHTML = placeholder;
    this.attachAffixed();

    // Render the element.
    this.item.render().then(content => {
      this.element.style.height = `${this.height}px`;
      this.element.innerHTML = content;
      this.element.classList.remove('loading');
      this.attachAffixed();
      this.draw();
    });
  }

}
