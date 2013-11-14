/*
 * jquery-dropdown
 * https://github.com/amazingSurge/jquery-dropdown
 *
 * Copyright (c) 2013 amazingSurge
 * Licensed under the MIT license.
 */

/* global jQuery */

(function($) {

    var Dropdown = $.dropdown = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$parent = this.$element.parent();

        // options
        var meta_data = [];
        $.each(this.$element.data(), function(k, v) {
            var re = new RegExp("^dropdown", "i");
            if (re.test(k)) {
                meta_data[k.toLowerCase().replace(re, '')] = v;
            }
        });
        this.options = $.extend(true, {}, Dropdown.defaults, options, meta_data);
        this.namespace = this.options.namespace;
        this.classes = {
            skin: this.namespace + '_' + this.options.skin,
            show: this.namespace + '_show',
            trigger: this.namespace + '-trigger',
            mask: this.namespace + '-mask',
            panel: this.namespace + '-panel'
        };

        // skin
        if (this.options.skin !== null) {
            this.$element.addClass(this.classes.skin);
        }

        // content
        this.$panel = this._parse(this.options.panel);

        // add mask
        var $mask = $('.' + this.classes.mask);
        this.$mask =  $mask.length ? $mask : $('<div style="display:none"></div>').addClass(this.classes.mask).appendTo(this.$parent);

        //state
        this.isShow = false;
        this.enabled = true;

        //init
        this.init();
    };

    Dropdown.prototype = {
        constructor: Dropdown,
        init: function() {
            var self = this;
            this.$parent.css({position:'relative'});
            this.$element.addClass(this.namespace).addClass(this.classes.trigger);
            this.$panel.addClass(this.classes.panel);
            this.$element.on('click.dropdown', function() {
                self.toggle.call(self);
                return false;
            });
            if (typeof this.options.onInit === 'function') {
                this.options.onInit(this);
            }
            this.$element.trigger('dropdown::init', this);
        },
        show: function() {
            if (this.enabled === false) {
                return;
            }
            this._bindActionEvent();
            this.isShow = true;
            this.$element.addClass(this.classes.show);
            this.$panel.addClass(this.classes.show);
            
            this._position();

            if (typeof this.options.onShow === 'function') {
                this.options.onShow(this);
            }
            this.$element.trigger('dropdown::show', this);
        },
        hide: function() {
            this.isShow = false;
            this.$element.removeClass(this.classes.show);
            this.$panel.removeClass(this.classes.show);
            this._unbindActionEvent();
            if (typeof this.options.onHide === 'function') {
                this.options.onHide(this);
            }
            this.$element.trigger('dropdown::hide', this);
        },
        toggle: function() {
            if (this.isShow) {
                this.hide();
            } else {
                this.show();
            } 
        },
        _bindActionEvent: function() {
            var self = this;
            if (this.options.clickoutHide) {
                // this is a bit of a hack until we have a better way to close the panel
                this.$mask.css({display: 'block'}).on('click.dropdown', function() {
                    self.hide();
                    return false;
                });
                this.$panel.on('click.dropdown', 'li', function() {
                    if (typeof self.options.onChange === 'function') {
                        self.options.onChange($(this));
                    }
                    self.$element.trigger('dropdown::onChange', $(this));
                    self.hide();
                    return false;
                });
            }
            $(window).on('resize.dropdown', function() {
                self._position();
                return false;
            });
        },
        _unbindActionEvent: function() {
            this.$panel.off('click.dropdown').off('mousedown.dropdown');
            $(document).off('mousedown.dropdown');
            this.$mask.css({display: 'none'}).off('click.dropdown');
        },
        _position: function() {
            var offset = this.$element.offset(),
                height = this.$element.outerHeight(),
                width = this.$element.outerWidth(),
                panelWidth = this.$panel.outerWidth(true),
                panelHeight = this.$panel.outerHeight(true),
                top, left;

            if (panelHeight + height + offset.top > $(window).height() + $(window).scrollTop()) {
                top =  - panelHeight;
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
                top: top,
                left: left
            });
        },
        _parse: function(string) {
            if (string.indexOf('+') >= 0) {
                return this.$element.next();
            } else {
                return $(this.options.panel);
            }
        },

        // common  method
        enable: function() {
            this.enabled = true;
        },
        disable: function() {
            this.enabled = false;
        },
        destory: function() {
            this.hide();
            this.$element.off('.dropdown');
            this.$element.remove();
            $(window).off('.dropdown');
        }
    };

    Dropdown.defaults = {
        namespace: 'dropdown',
        skin: null,
        panel: '+', //jquery selector to find content in the page, or '+' means adjacent siblings
        clickoutHide: true, //When clicking outside of the dropdown, trigger hide event

        //callback comes with corresponding event
        onInit: null,
        onShow: null,
        onHide: null,
        onChange: null
    };

    $.fn.dropdown = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            return this.each(function() {
                var api = $.data(this, 'dropdown');
                if (typeof api[method] === 'function') {
                    api[method].apply(api, method_arguments);
                }
            });
        } else {
            return this.each(function() {
                if (!$.data(this, 'dropdown')) {
                    $.data(this, 'dropdown', new Dropdown(this, options));
                }
            });
        }
    };
}(jQuery));
