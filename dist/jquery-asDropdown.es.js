/**
* jquery asDropdown v0.2.0
* https://github.com/amazingSurge/jquery-asDropdown
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
import $ from 'jquery';

var DEFAULTS = {
  namespace: 'asDropdown',
  skin: null,
  panel: '+', //jquery selector to find content in the page, or '+' means adjacent siblings
  clickoutHide: true, //When clicking outside of the dropdown, trigger hide event
  imitateSelect: false, //let select value show in trigger bar
  select: null, //set initial select value, when imitateSelect is set to true
  data: 'value',

  //callback comes with corresponding event
  onInit: null,
  onShow: null,
  onHide: null,
  onChange: null
};

const NAMESPACE$1 = 'asDropdown';

/**
 * Plugin constructor
 **/
class asDropdown {
  constructor(element, options = {}) {
    this.element = element;
    this.$element = $(element);
    this.$parent = this.$element.parent();

    // options
    const meta_data = [];
    $.each(this.$element.data(), (k, v) => {
      const re = new RegExp("^asDropdown", "i");
      if (re.test(k)) {
        meta_data[k.toLowerCase().replace(re, '')] = v;
      }
    });
    this.options = $.extend( {}, DEFAULTS, options, meta_data);

    this.namespace = this.options.namespace;
    this.classes = {
      skin: `${this.namespace}_${this.options.skin}`,
      show: `${this.namespace}_show`,
      trigger: `${this.namespace}-trigger`,
      mask: `${this.namespace}-mask`,
      wrapper: `${this.namespace}-wrapper`,
      panel: `${this.namespace}-panel`,
      disabled: `${this.namespace}_disabled`
    };

    // skin
    if (this.options.skin !== null) {
      this.$element.addClass(this.classes.skin);
    }

    this.$children = this.$element.children();

    // content
    this.$panel = this._parse(this.options.panel);

    //state
    this.isShow = false;
    this.disabled = false;
    this.initialized = false;
    //init
    this._trigger('init');
    this.init();
  }

  init() {
    const self = this;
    this.$parent.addClass(this.classes.wrapper);
    this.$element.addClass(this.namespace).addClass(this.classes.trigger);
    this.$panel.addClass(this.classes.panel);

    this.$element.on(this.eventName('click'), () => {
      self.toggle.call(self);
      return false;
    });

    this.$panel.on(this.eventName('click'), 'li', function() {
      self.set($(this).data(self.options.data));
      self.hide();
      return false;
    });

    if (this.options.select !== null) {
      this.set(this.options.select);
    }

    this._trigger('ready');
    this.initialized = true;
  }

  _trigger(eventType, ...params) {
    let data = [this].concat(...params);

    // event
    this.$element.trigger(`${NAMESPACE$1}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    let onFunction = `on${eventType}`;

    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, ...params);
    }
  }

  eventName(events) {
    if (typeof events !== 'string' || events === '') {
      return `.${this.options.namespace}`;
    }
    events = events.split(' ');

    let length = events.length;
    for (let i = 0; i < length; i++) {
      events[i] = `${events[i]}.${this.options.namespace}`;
    }
    return events.join(' ');
  }

  show() {
    const self = this;
    if (this.disabled) {
      return;
    }
    if (this.options.clickoutHide) {
      this._generateMask();
    }

    $(window).on(this.eventName('resize'), () => {
      self._position();
      return false;
    });
    this.isShow = true;
    this.$element.addClass(this.classes.show);
    this.$panel.addClass(this.classes.show);

    this._position();
    this._trigger('show');
  }

  hide() {
    this.isShow = false;
    if (this.options.clickoutHide) {
      this._clearMask();
    }

    this.$element.removeClass(this.classes.show);
    this.$panel.removeClass(this.classes.show);
    $(document).off(this.eventName('mousedown'));

    this._trigger('hide');
  }

  set(value) {
    if (this.options.imitateSelect) {
      let $item = null;
      const self = this;

      self.$panel.children().each(function() {
        if ($(this).data(self.options.data) === value) {
          $item = $(this);
          self.value = value;
        }
      });
      if (!$item) {
        return;
      }
      this.$element.text($item.text());
      if (this.$children.length) {
        this.$children.appendTo(this.$element);
      }
    }
    if (this.initialized) {
      this._trigger('change', [value]);
    }
  }

  _generateMask() {
    const self = this;
    this.$mask = $('<div></div>').addClass(this.classes.mask).show().appendTo('body');
    this.$mask.on(this.eventName('click'), () => {
      self.hide();
      return false;
    });
  }

  _clearMask() {
    if (this.$mask) {
      this.$mask.off(this.eventName());
      this.$mask.remove();
      this.$mask = null;
    }
  }

  toggle() {
    if (this.isShow) {
      this.hide();
    } else {
      this.show();
    }
  }

  _position() {
    const offset = this.$element.offset();
    const height = this.$element.outerHeight();
    const width = this.$element.outerWidth();
    const panelWidth = this.$panel.outerWidth(true);
    const panelHeight = this.$panel.outerHeight(true);
    let top;
    let left;

    if (panelHeight + height + offset.top > $(window).height() + $(window).scrollTop()) {
      top = -panelHeight;
    } else {
      top = height;
    }
    if (panelWidth + offset.left > $(window).width() + $(window).scrollLeft()) {
      left = width - panelWidth;
    } else {
      left = 0;
    }
    this.$panel.css({
      position: 'absolute',
      top,
      left
    });
  }

  _parse(string) {
    if (string.includes('+')) {
      return this.$element.next();
    } else {
      return $(this.options.panel);
    }
  }

  get() {
    return this.value;
  }

  update(html) {
    this.$panel.html(html);
  }

  enable() {
    this.disabled = false;
    this.$wrapper.removeClass(this.classes.disabled);
  }

  disable() {
    this.disabled = true;
    this.$wrapper.addClass(this.classes.disabled);
  }

  destory() {
    this.hide();
    this.$element.off(this.eventName());
    this.$element.remove();
    $(window).off(this.eventName());
  }

  static setDefaults(options) {
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }
}

var info = {
  version:'0.2.0'
};

const NAMESPACE = 'asDropdown';
const OtherAsScrollbar = $.fn.asDropdown;

const jQueryasDropdown = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)/.test(method))) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAMESPACE)) {
      $(this).data(NAMESPACE, new asDropdown(this, options));
    }
  });
};

$.fn.asDropdown = jQueryasDropdown;

$.asDropdown = $.extend({
  setDefaults: asDropdown.setDefaults,
  noConflict: function() {
    $.fn.asDropdown = OtherAsScrollbar;
    return jQueryasDropdown;
  }
}, info);
