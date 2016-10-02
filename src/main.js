import $ from 'jquery';
import asDropdown from './asDropdown';
import info from './info';

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
