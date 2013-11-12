/*! jquery select - v0.1.0 - 2013-10-09
* https://github.com/amazingSurge/jquery-select
* Copyright (c) 2013 amazingSurge; Licensed MIT */
(function($) {

    var Select = $.select = function(element, options) {
        var $opts,
            meta = {};

        this.element = element;
        this.$element = $(element).css({
            display: 'none'
        }) || $('<div></div>');
        this.$options = this.$element.find('option');
        this.$optgroups = this.$element.find('optgroup');
        this.status = {};

        meta.status = {};

        if (this.$optgroups.length !== 0) {
            $.each(this.$optgroups, function(i, v) {
                var label = $(v).attr('label');
                meta.status[label] = {};
                $.each($(v).find('option'), function(i, v) {
                    meta.status[label][$(v).attr('value')] = {};
                    meta.status[label][$(v).attr('value')].text = $(v).text();
                    if ($(v).prop('selected')) {
                        meta.value = $(v).attr('value');
                    }
                });
            });
        }

        // it's different from this.$options
        $opts = this.$element.find('> option');

        if ($opts.length !== 0) {
            $.each($opts, function(i, v) {
                meta.status[$(v).attr('value')] = {};
                meta.status[$(v).attr('value')].text = $(v).text();
                if ($(v).prop('selected')) {
                    meta.value = $(v).attr('value');
                }
            });
        }

        this.options = $.extend(true, {}, Select.defaults, options, meta);
        this.namespace = this.options.namespace;
        this.value = this.options.value;
        this.status = this.options.status;
        this.disbaled = this.options.disbaled || false;

        // flag
        this.opened = false;
        this.eventBinded = false;

        this.init();
    };

    Select.prototype = {
        constructor: Select,
        init: function() {
            var self = this,
                tpl = '<div class="' + this.namespace + '"><div class="' + this.namespace + '-trigger"><span></span><i></i></div><ul class="' + this.namespace + '-dropdown"></ul></div>';

            this.$select = $(tpl).css({position:'relative'});
            this.$trigger = this.$select.find('.' + this.namespace + '-trigger');
            this.$dropdown = this.$select.find('.' + this.namespace + '-dropdown').css({
                display: 'none'
            });

            if (this.options.skin !== null) {
                this.$select.addClass(this.namespace + '_' + this.options.skin);
            }

            $.each(this.status, function(key, value) {
                if (value.text) {
                    var $li = $('<li><a></a></li>').data('value', key).find('a').text(value.text).end();
                    $('<i></i>').addClass(value.icon).appendTo($li);
                    self.$dropdown.append($li);
                } else {
                    var $group = $('<li class="' + self.namespace + '-group"></li>').text(key);
                    self.$dropdown.append($group);

                    $.each(value, function(k, v) {
                        var $li = $('<li class="' + self.namespace + '-group-item"><a></a></li>').data('value', k).find('a').text(v.text).end();
                        self.$dropdown.append($li);
                    });
                }
            });

            this.$element.after(this.$select);
            this.$li = this.$dropdown.find('li');

            if (this.options.disbaled === true) {
                this.$trigger.addClass(this.namespace + '_disbaled');
            } else {
                this.bindEvent();
            }

            this.set(this.value);
            this.$element.trigger('select::ready', this);
        },
        bindEvent: function() {
            var self = this;

            if (this.options.trigger === 'click') {
                this.$trigger.on('click.select', function() {
                    self.position.call(self);

                    if (self.opened === true) {
                        self.hide.call(self);
                    } else {
                        self.show.call(self);
                    }

                    return false;
                });
            } else {
                this.$trigger.on('mouseenter.select', function() {
                    self.position.call(self);
                    self.show.call(self);
                    return false;
                });

                // when mouse leave from $trigger or $dropdown both can trigger mouseleave event
                // this event acquired by their parent element $select 
                this.$select.on('mouseleave.select', function() {
                    self.hide.call(self);
                    return false;
                });
            }

            this.$dropdown.delegate('li', 'mouseenter.select', function() {
                self.$element.trigger('select::option::mouseenter', self);
                return false;
            }).delegate('li', 'mouseleave.select', function() {
                self.$element.trigger('select::option::mouseleave', self);
                return false;
            }).delegate('li', 'click.select', function() {
                var value = $(this).data('value');
                if (value === undefined) {
                    return false;
                }

                self.set.call(self, value);
                return false;
            });
            this.eventBinded = true;
        },
        unbindEvent: function() {
            this.$dropdown.undelegate('.select');
            this.$trigger.off('.select');
            this.$select.off('.select');
            this.eventBinded = false;
        },
        position: function() {
            var height = this.$trigger.outerHeight(true),
                offset = this.$trigger.offset(),
                contentHeight = this.$dropdown.outerHeight(true),
                top;

            if (contentHeight + offset.top > $(window).height() + $(window).scrollTop()) {
                top = -contentHeight - parseInt(this.options.offset[0], 10);
            } else {
                top = height + parseInt(this.options.offset[0], 10);
            }

            this.$dropdown.css({
                position: 'absolute',
                top: top,
                left: 0
            });
        },
        set: function(value) {
            var self = this;

            this.$li.removeClass(this.namespace + '_selected');
            this.value = value;

            $.each(this.$options, function(i, v) {
                if ($(v).attr('value') === value) {
                    $(v).prop('selected', true);
                }
            });

            $.each(this.$li, function(i, v) {
                if ($(v).data('value') === value) {
                    $(v).addClass(self.namespace + '_selected');
                    self.$trigger.find('span').text($(v).find('a').text());

                    if ($.isFunction(self.options.onChange)) {
                        self.options.onChange(self);
                    }
                    self.$select.trigger('change', self);
                }
            });

            this.hide();
            this.$element.trigger('select::change', this);
        },
        get: function() {
            var self = this,
                value;

            $.each(this.$options, function(i, v) {
                if ($(v).attr('value') === self.value) {
                    value = $(v).text();
                }
            });

            return value;
        },

        /*
            Public Method
         */
        
        show: function() {
            this.$dropdown.css({
                display: 'block'
            });
            this.$trigger.addClass(this.namespace + '_active');
            $(document).on('click.select', $.proxy(this.hide, this));
            this.opened = true;
            this.$element.trigger('select::show', this);
            return this;
        },
        hide: function() {
            this.$dropdown.css({
                display: 'none'
            });
            this.$trigger.removeClass(this.namespace + '_active');
            $(document).off('click.select');
            this.opened = false;
            this.$element.trigger('select::hide', this);
            return this;
        },
        val: function(value) {
            if (value) {
                this.set(value);
                return this;
            } else {
                return this.get();
            }
        },
        enable: function() {
            this.disbaled = false;
            this.$trigger.removeClass(this.namespace + '_disbaled');
            return this;
        },
        disable: function() {
            this.disbaled = true;
            this.$trigger.addClass(this.namespace + '_disbaled');
            return this;
        },
        destroy: function() {
            this.$trigger.off('.select');
        }
    };

    Select.defaults = {
        namespace: 'select',
        skin: null,
        trigger: 'click', // 'hover' or 'click'
        value: 'a',
        offset: [10, 0],
        // status: {
        //     a: 'beijing',
        //     b: 'fujian',
        //     c: 'zhejiang'
        // },
        onChange: function() {}
    };

    $.fn.select = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            return this.each(function() {
                var api = $.data(this, 'select');
                if (typeof api[method] === 'function') {
                    api[method].apply(api, method_arguments);
                }
            });
        } else {
            var opts = options || {};
            opts.$group = this;
            return this.each(function() {
                if (!$.data(this, 'select')) {
                    $.data(this, 'select', new Select(this, opts));
                }
            });
        }
    };

}(jQuery));
