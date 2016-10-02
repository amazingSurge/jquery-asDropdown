/**
* jquery asDropdown v0.2.0
* https://github.com/amazingSurge/jquery-asDropdown
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryAsDropdownEs = mod.exports;
  }
})(this,

  function(_jquery) {
    'use strict';

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ?

      function(obj) {
        return typeof obj;
      }
      :

      function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;

          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);

        if (staticProps)
          defineProperties(Constructor, staticProps);

        return Constructor;
      };
    }();

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

    var NAMESPACE$1 = 'asDropdown';

    /**
     * Plugin constructor
     **/

    var asDropdown = function() {
      function asDropdown(element) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, asDropdown);

        this.element = element;
        this.$element = (0, _jquery2.default)(element);
        this.$parent = this.$element.parent();

        // options
        var meta_data = [];
        _jquery2.default.each(this.$element.data(),

          function(k, v) {
            var re = new RegExp("^asDropdown", "i");

            if (re.test(k)) {
              meta_data[k.toLowerCase().replace(re, '')] = v;
            }
          }
        );
        this.options = _jquery2.default.extend({}, DEFAULTS, options, meta_data);

        this.namespace = this.options.namespace;
        this.classes = {
          skin: this.namespace + '_' + this.options.skin,
          show: this.namespace + '_show',
          trigger: this.namespace + '-trigger',
          mask: this.namespace + '-mask',
          wrapper: this.namespace + '-wrapper',
          panel: this.namespace + '-panel',
          disabled: this.namespace + '_disabled'
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

      _createClass(asDropdown, [{
        key: 'init',
        value: function init() {
          var self = this;
          this.$parent.addClass(this.classes.wrapper);
          this.$element.addClass(this.namespace).addClass(this.classes.trigger);
          this.$panel.addClass(this.classes.panel);

          this.$element.on(this.eventName('click'),

            function() {
              self.toggle.call(self);

              return false;
            }
          );

          this.$panel.on(this.eventName('click'), 'li',

            function() {
              self.set((0, _jquery2.default)(this).data(self.options.data));
              self.hide();

              return false;
            }
          );

          if (this.options.select !== null) {
            this.set(this.options.select);
          }

          this._trigger('ready');
          this.initialized = true;
        }
      }, {
        key: '_trigger',
        value: function _trigger(eventType) {
          var _ref;

          for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            params[_key - 1] = arguments[_key];
          }

          var data = (_ref = [this]).concat.apply(_ref, params);

          // event
          this.$element.trigger(NAMESPACE$1 + '::' + eventType, data);

          // callback
          eventType = eventType.replace(/\b\w+\b/g,

            function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            }
          );
          var onFunction = 'on' + eventType;

          if (typeof this.options[onFunction] === 'function') {
            var _options$onFunction;

            (_options$onFunction = this.options[onFunction]).apply.apply(_options$onFunction, [this].concat(params));
          }
        }
      }, {
        key: 'eventName',
        value: function eventName(events) {
          if (typeof events !== 'string' || events === '') {

            return '.' + this.options.namespace;
          }
          events = events.split(' ');

          var length = events.length;

          for (var i = 0; i < length; i++) {
            events[i] = events[i] + '.' + this.options.namespace;
          }

          return events.join(' ');
        }
      }, {
        key: 'show',
        value: function show() {
          var self = this;

          if (this.disabled) {

            return;
          }

          if (this.options.clickoutHide) {
            this._generateMask();
          }

          (0, _jquery2.default)(window).on(this.eventName('resize'),

            function() {
              self._position();

              return false;
            }
          );
          this.isShow = true;
          this.$element.addClass(this.classes.show);
          this.$panel.addClass(this.classes.show);

          this._position();
          this._trigger('show');
        }
      }, {
        key: 'hide',
        value: function hide() {
          this.isShow = false;

          if (this.options.clickoutHide) {
            this._clearMask();
          }

          this.$element.removeClass(this.classes.show);
          this.$panel.removeClass(this.classes.show);
          (0, _jquery2.default)(document).off(this.eventName('mousedown'));

          this._trigger('hide');
        }
      }, {
        key: 'set',
        value: function set(value) {
          var _this = this;

          if (this.options.imitateSelect) {
            var _ret = function() {
              var $item = null;
              var self = _this;

              self.$panel.children().each(

                function() {
                  if ((0, _jquery2.default)(this).data(self.options.data) === value) {
                    $item = (0, _jquery2.default)(this);
                    self.value = value;
                  }
                }
              );

              if (!$item) {

                return {
                  v: void 0
                };
              }
              _this.$element.text($item.text());

              if (_this.$children.length) {
                _this.$children.appendTo(_this.$element);
              }
            }();

            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")

              return _ret.v;
          }

          if (this.initialized) {
            this._trigger('change', [value]);
          }
        }
      }, {
        key: '_generateMask',
        value: function _generateMask() {
          var self = this;
          this.$mask = (0, _jquery2.default)('<div></div>').addClass(this.classes.mask).show().appendTo('body');
          this.$mask.on(this.eventName('click'),

            function() {
              self.hide();

              return false;
            }
          );
        }
      }, {
        key: '_clearMask',
        value: function _clearMask() {
          if (this.$mask) {
            this.$mask.off(this.eventName());
            this.$mask.remove();
            this.$mask = null;
          }
        }
      }, {
        key: 'toggle',
        value: function toggle() {
          if (this.isShow) {
            this.hide();
          } else {
            this.show();
          }
        }
      }, {
        key: '_position',
        value: function _position() {
          var offset = this.$element.offset();
          var height = this.$element.outerHeight();
          var width = this.$element.outerWidth();
          var panelWidth = this.$panel.outerWidth(true);
          var panelHeight = this.$panel.outerHeight(true);
          var top = void 0;
          var left = void 0;

          if (panelHeight + height + offset.top > (0, _jquery2.default)(window).height() + (0, _jquery2.default)(window).scrollTop()) {
            top = -panelHeight;
          } else {
            top = height;
          }

          if (panelWidth + offset.left > (0, _jquery2.default)(window).width() + (0, _jquery2.default)(window).scrollLeft()) {
            left = width - panelWidth;
          } else {
            left = 0;
          }
          this.$panel.css({
            position: 'absolute',
            top: top,
            left: left
          });
        }
      }, {
        key: '_parse',
        value: function _parse(string) {
          if (string.includes('+')) {

            return this.$element.next();
          } else {

            return (0, _jquery2.default)(this.options.panel);
          }
        }
      }, {
        key: 'get',
        value: function get() {
          return this.value;
        }
      }, {
        key: 'update',
        value: function update(html) {
          this.$panel.html(html);
        }
      }, {
        key: 'enable',
        value: function enable() {
          this.disabled = false;
          this.$wrapper.removeClass(this.classes.disabled);
        }
      }, {
        key: 'disable',
        value: function disable() {
          this.disabled = true;
          this.$wrapper.addClass(this.classes.disabled);
        }
      }, {
        key: 'destory',
        value: function destory() {
          this.hide();
          this.$element.off(this.eventName());
          this.$element.remove();
          (0, _jquery2.default)(window).off(this.eventName());
        }
      }], [{
        key: 'setDefaults',
        value: function setDefaults(options) {
          _jquery2.default.extend(DEFAULTS, _jquery2.default.isPlainObject(options) && options);
        }
      }]);

      return asDropdown;
    }();

    var info = {
      version: '0.2.0'
    };

    var NAMESPACE = 'asDropdown';
    var OtherAsScrollbar = _jquery2.default.fn.asDropdown;

    var jQueryasDropdown = function jQueryasDropdown(options) {
      var _this2 = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (typeof options === 'string') {
        var _ret2 = function() {
          var method = options;

          if (/^_/.test(method)) {

            return {
              v: false
            };
          } else if (/^(get)/.test(method)) {
            var instance = _this2.first().data(NAMESPACE);

            if (instance && typeof instance[method] === 'function') {

              return {
                v: instance[method].apply(instance, args)
              };
            }
          } else {

            return {
              v: _this2.each(

                function() {
                  var instance = _jquery2.default.data(this, NAMESPACE);

                  if (instance && typeof instance[method] === 'function') {
                    instance[method].apply(instance, args);
                  }
                }
              )
            };
          }
        }();

        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object")

          return _ret2.v;
      }

      return this.each(

        function() {
          if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
            (0, _jquery2.default)(this).data(NAMESPACE, new asDropdown(this, options));
          }
        }
      );
    };

    _jquery2.default.fn.asDropdown = jQueryasDropdown;

    _jquery2.default.asDropdown = _jquery2.default.extend({
      setDefaults: asDropdown.setDefaults,
      noConflict: function noConflict() {
        _jquery2.default.fn.asDropdown = OtherAsScrollbar;

        return jQueryasDropdown;
      }
    }, info);
  }
);