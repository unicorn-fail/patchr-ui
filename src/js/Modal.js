// Global imports.
import $ from 'jquery';

// Local imports.
import _ from './Utility';
import Transition from './Transition';

export default class Modal extends Transition {

  constructor(patchr, options) {
    // Because we need to get any passed transition options from the
    // Patchr instance, we cannot simply pass this to super above.
    super(patchr);

    // Set the options.
    this.options = _.extend(true, {}, this.options, Modal.defaults, this.getPatchrOption('modal'), options);

    this.originalTitle = window.document.title;

    this.minimized = false;

    this.$body = $('body');

    this.$backdrop = null;

    this.visible = false;

    this.$wrapper = $('<div class="patchr-modal-wrapper patchr-reset" tabindex="-1" role="dialog"/>');
    if (this.getOption('animate')) {
      this.$wrapper.addClass('fade');
    }

    this.$modal = $('<div class="patchr-modal" role="dialog"/>').appendTo(this.$wrapper);

    this.$header = $('<div class="patchr-modal-header"/>').appendTo(this.$modal);
    this.$controls = $('<div class="patchr-modal-controls"/>').appendTo(this.$header);

    if (this.getOption('controls.minimize')) {
      this.$controls.append('<button type="button" class="patchr-btn minimize" data-action="minimize" aria-label="Minimize"><span class="dui-icon dui-icon--minimize" aria-hidden="true"></span></button>');
    }

    if (this.getOption('controls.maximize')) {
      this.$controls.append('<button type="button" class="patchr-btn maximize" data-action="maximize" aria-label="Maximize"><span class="dui-icon dui-icon--maximize" aria-hidden="true"></span></button>');
    }

    if (this.getOption('controls.close')) {
      this.$controls.append('<button type="patchr-btn button" class="close" data-action="close" aria-label="Close"><span class="dui-icon dui-icon--close" aria-hidden="true"></span></button>');
    }

    this.$title = $('<h2 class="patchr-modal-title patchr-overflow"/>').appendTo(this.$header);

    this.$content = $('<div class="patchr-modal-content patchr-wrapper"/>').html(this.getOption('content', '')).appendTo(this.$modal);
    this.$footer = $('<div class="patchr-modal-footer"/>').html(this.getOption('footer', '')).appendTo(this.$modal);

    this.id = this.getOption('id');

    if (this.id) {
      this.$wrapper.attr('id', this.id);
    }

    if (!this.$wrapper.parent().length) {
      this.$wrapper.appendTo(this.$body);
    }

    this.scrollMouseDown = false;

    this.$wrapper.delegate('[data-action="close"]', 'click.close.patchr.modal', this.close.bind(this));
    this.$wrapper.delegate('[data-action="maximize"]', 'click.maximize.patchr.modal', this.maximize.bind(this));
    this.$wrapper.delegate('[data-action="minimize"]', 'click.minimize.patchr.modal', this.minimize.bind(this));

    this
      .on('scroll.mousedown', (e, scrollbar) => {
        this.scrollMouseDown = true;
      })
      .on('scroll.mouseup', (e, scrollbar) => {
        this.scrollMouseDown = false;
      })
    ;

    // Prevent clicks from bubbling up.
    this.$modal.bind('mouseup.close.patchr.modal touchend.close.patchr.modal', (e) => {
      if (!this.scrollMouseDown && (e.target === this.$modal[0] || $.contains(this.$modal[0], e.target))) {
        e.stopPropagation();
      }
    });

    // Allow the backdrop to close the modal.
    if (this.getOption('backdrop')) {
      this.$wrapper.bind('mouseup.close.patchr.modal touchend.close.patchr.modal', (e) => {
        if (!this.scrollMouseDown && e.target === this.$wrapper[0]) {
          this.close();
        }
      });
    }
  }

  getTitle() {
    if (!this.title) {
      this.title = this.getOption('title');
    }
    return this.title;
  }

  setTitle(title = this.getTitle()) {
    this.title = title;
    this.$title.html(title);
    if (this.visible && !this.minimized) {
      this.setDocumentTitle(title);
    }
    return this;
  }

  toggle() {
    return this.visible ? this.close() : this.open();
  }

  open() {
    if (this.minimized) {
      return this.maximize();
    }
    if (this.visible) {
      return this.resolve(this);
    }
    return this.emit('open.modal', this)
      .then(() => {
        this.$body.addClass('patchr-modal-open');

        this.escape();
        this.setDocumentTitle();

        return this.showBackdrop();
      })
      .then(() => {
        this.$wrapper.scrollTop(0);

        // Wait for modal to fade in.
        return this.fadeIn(this.$wrapper);
      })
      .then(() => {
        this.visible = true;
        return this.emit('opened.modal', this);
      })
      .then(() => this.resolve(this));
  }

  setDocumentTitle(title = this.getTitle()) {
    let template = this.getOption('templates.documentTitle');
    if (title && template) {
      if (this.getPatchrOption('comments')) {
        title = `\uD83D\uDCAC ${title}`; // Unicode speech bubble;
      }
      window.document.title = _.template(template, {
        title: title,
        original: this.originalTitle
      });
    }
  }

  restoreDocumentTitle() {
    window.document.title = this.originalTitle;
  }

  close() {
    if (!this.visible) {
      return this.resolve(this);
    }
    return this.emit('close.modal', this)
      .then(() => {
        this.escape();
        this.removeBackdrop();
        return this.fadeOut(this.$wrapper);
      })
      .then(() => {
        this.$body.removeClass('patchr-modal-open');
        this.$wrapper.removeClass('minimized');
        this.restoreDocumentTitle();
        this.minimized = false;
        this.visible = false;
      })
      .then(() => this.emit('closed.modal', this))
      .then(() => this.resolve(this));
  }

  maximize() {
    if (!this.minimized) {
      return this.resolve(this);
    }
    return this.emit('maximize.modal', this)
      .then(() => {
        this.$body.addClass('patchr-modal-open');
        return this.showBackdrop();
      })
      .then(() => {
        this.escape();
        this.setDocumentTitle();
        return this.transitionEnd(this.$wrapper.removeClass('minimized'));
      })
      .then(() => {
        this.minimized = false;
        return this.emit('maximized.modal', this);
      })
      .then(() => this.resolve(this));

  }

  minimize() {
    if (this.minimized) {
      return this.resolve(this);
    }
    return this.emit('minimize.modal', this)
      .then(() => {
        this.escape();
        this.restoreDocumentTitle();
        this.$wrapper.addClass('minimized');
        return this.removeBackdrop();
      })
      .then(() => {
        this.$body.removeClass('patchr-modal-open');
        this.minimized = true;
        return this.emit('minimized.modal', this);
      })
      .then(() => this.resolve(this));
  }

  escape() {
    if (this.visible && this.options.keyboard) {
      this.$wrapper.bind('keydown.close.patchr.modal', (e) => {
        if (e.which === 27) {
          this.close();
        }
      });
    }
    else if (!this.visible) {
      this.$wrapper.unbind('keydown.close.patchr.modal');
    }
  }

  removeBackdrop() {
    if (!this.$backdrop) {
      return this.resolve();
    }
    return this.fadeOut(this.$backdrop).then(() => {
      if (this.$backdrop) {
        this.$backdrop.remove();
      }
      this.$backdrop = null;
    });
  }

  showBackdrop() {
    if (!this.getOption('backdrop')) {
      return this.resolve();
    }
    return this.promise((resolve, reject) => {
      this.$backdrop = $(document.createElement('div')).addClass('patchr-modal-backdrop').appendTo(this.$body);
      this.fadeIn(this.$backdrop, 1).then(resolve);
    });
  }

}

Modal.defaults = {
  controls: {
    close: true,
    maximize: true,
    minimize: true
  },
  backdrop: true,
  keyboard: true,
  templates: {
    documentTitle: '{{ title }} | {{ original }}'
  },
  show: true
};

