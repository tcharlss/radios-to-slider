(function($) {
    'use strict';

    var pluginName = 'radioslider',
        pluginIdentifier = 0,
        defaults = {
            size:            '',
            animation:       true,
            isDisabled:      false,
            fillOffset:      null, // Offset the fill center
            fillOrigin:      null, // Fill left and right from origin
            fit:             false, // Makes the dots fit the edges
            onSelect:        null,
            orientation:     'horizontal',
            sliderClass:     'radioslider',
            itemClass:       'radioslider__item',
            inputClass:      'radioslider__input',
            labelClass:      'radioslider__label',
            dotClass:        'radioslider__dot',
            textClass:       'radioslider__text',
            barClass:        'radioslider__bar',
            fillClass:       'radioslider__fill',
            handleClass:     'radioslider__handle',
            horizontalClass: '',
            verticalClass:   'radioslider_vertical',
            disabledClass:   'radioslider_disabled',
            fitClass:        'radioslider_fit',
            labelLowerClass: 'lower',
        },
        constants = {
            orientation: {
                horizontal: {
                    dimension: 'width',
                    direction: 'left',
                    directionStyle: 'left',
                    coordinate: 'x'
                },
                vertical: {
                    dimension: 'height',
                    direction: 'top',
                    directionStyle: 'bottom',
                    coordinate: 'y'
                }
            }
        };

    /**
     * Plugin
     * @param {String} element
     * @param {Object} options
     */
    function Plugin(element, options) {
        this.options         = $.extend( {}, defaults, options );
        this.$window         = $(window);
        this.$document       = $(document);
        this.$bearer         = $(element);
        this.orientation     = this.options.orientation;
        this.DIMENSION       = constants.orientation[this.orientation].dimension;
        this.DIRECTION       = constants.orientation[this.orientation].direction;
        this.DIRECTION_STYLE = constants.orientation[this.orientation].directionStyle;
        this.COORDINATE      = constants.orientation[this.orientation].coordinate;

        this.identifier   = 'js-' + pluginName + '-' +(pluginIdentifier++);
        this.currentLevel = 0; // This means no level selected
        this.value        = null;
        this.itemsCount   = this.$bearer.find('input[type=radio]').length;
        // this.$item        = $('<div class="' + this.options.itemClass + '">');
        // this.$dot         = $('<span class="' + this.options.dotClass + '">');
        // this.$text        = $('<span class="' + this.options.textClass + '">');
        this.$bar         = $('<div class="' + this.options.barClass + '">');
        this.$fill        = $('<div class="' + this.options.fillClass + '">');
        this.$handle      = $('<span class="' + this.options.handleClass + '">');
        this.$bar.append(this.$fill.append(this.$handle));

        this.init();
    }

    Plugin.prototype.init = function() {
        this.activate();

        if (this.onInit && typeof this.onInit === 'function') {
            this.onInit();
        }
    };

    Plugin.prototype.activate = function() {
        this.addBase();
        this.setSlider();
        this.addInteraction();
        if (this.options.isDisabled) {
            this.setDisabled();
        }
    };

    // Add container to DOM, wrap inputs and labels in containers, add bar
    Plugin.prototype.addBase = function() {
        var options = this.options,
            $bearer = this.$bearer,
            $bar    = this.$bar,
            $fill   = this.$fill,
            $items,
            $inputs,
            $labels,
            $dots;

        // Container
        $bearer
            .addClass(
                options.sliderClass +
                ' ' + options[this.orientation + 'Class'] +
                ' ' + (options.fit ? options.fitClass : '') +
                ' ' + options.size
            )
            .attr('data-radioslider', this.identifier);

        // Inputs : add class and level data
        $inputs = $bearer
            .find('> input[type=radio]')
            .each(function(i) {
                $(this)
                    .addClass(options.inputClass)
                    .attr('data-level', i+1);
            });
        this.$inputs = $inputs;

        // Labels : add class and level data, insert dots, wrap text
        $labels = $bearer
            .find('> label')
            .each(function(i) {
                var text = $(this).html(),
                    $text = $('<span class="' + options.textClass + '">').html(text),
                    $dot = $('<span class="' + options.dotClass + '">').attr('data-level', i+1);

                $(this)
                    .addClass(options.labelClass)
                    // .attr('data-level', i+1)
                    .html('')
                    .append($dot)
                    .append($text);
            });
        $dots = $bearer.find('.' + options.dotClass);
        this.$dots = $dots;
        this.$labels = $labels;

        // Items : wrap inputs and labels together
        $inputs.each(function() {
            var $item = $('<div class="' + options.itemClass + '">');
            $(this)
                .nextUntil('input')
                .addBack()
                .wrapAll($item);
        });
        $items = $bearer.find('.' + options.itemClass);
        this.$items = $items;

        // Bar
        $bearer.append($bar);
        if (this.options.animation) {
            $fill.addClass('transition-enabled');
        }
    };

    // Update the fill bar and current level based on checked radio
    Plugin.prototype.setSlider = function() {
        var slider     = this,
            options    = this.options,
            $bearer    = this.$bearer,
            $inputs    = this.$inputs,
            $fill      = this.$fill,
            $dots      = this.$dots,
            $handle    = this.$handle,
            input;

        var $inputChecked = $inputs.filter(':checked');
        if ($inputChecked.length > 0) {
            var currentLevel = Number($inputChecked.attr('data-level')),
                $dot         = $dots.filter('[data-level=' + currentLevel + ']'),
                dotPos       = $dot.position().left,
                dotWidth     = $dot.outerWidth(),
                bearerWidth  = $bearer.outerWidth(),
                handleWidth  = $handle.outerWidth(),
                width        = dotPos + (dotWidth/2) + (handleWidth/2),
                widthPercent = 100 * width / bearerWidth;

            // Show the fill bar and set its width
            $fill.css('visibility', 'visible');
            $fill.width(widthPercent + '%');
            slider.currentLevel = currentLevel;

            // Set style for lower levels
            input = 0;
            $inputs.each(function() {
                input++;

                var $this = $(this),
                    $label = $this.next('label'),
                    $dot = $this.next('label').find('.' + options.dotClass),
                    level = Number($this.attr('data-level'));

                if (level < slider.currentLevel) {
                    $dot.css('visibility', '');
                    $label.addClass(options.labelLowerClass);
                } else if (level === slider.currentLevel) {
                    // $dot.css('visibility', 'hidden');
                } else {
                    $dot.css('visibility', '');
                    $label.removeClass(options.labelLowerClass);
                }
            });
        }
    };

    // Interaction
    Plugin.prototype.addInteraction = function() {
        var slider = this,
            $bearer = this.$bearer,
            $inputs = this.$inputs;

        // Radio input change
        $inputs.on('change', function() {
            var $this = $(this),
                val   = $this.attr('value');

            $this.prop('checked', true);

            if (slider.options.onChange) {
                slider.options.onChange($this, [$inputs]);
            }

            slider.value = val;
            // $bearer.attr('data-value', val);
            slider.setSlider();
            $bearer.trigger('radiochange');
        });

    };

    // Disable the slider
    Plugin.prototype.setDisabled = function(cb) {
        this.options.isDisable = true;

        var slider        = this,
            $bearer       = slider.$bearer,
            $labels       = slider.$labels,
            $inputs       = slider.$inputs,
            disabledClass = slider.options.disabledClass;

        $.merge($labels, $inputs).each(function() {
            var $this = $(this);

            $this.prop('disabled', true);
            $this.off('click change');
        });

        if (typeof cb === 'function') {
            cb($labels, $inputs);
        }

        $bearer
            .addClass(disabledClass)
            .trigger('radiodisabled');
    };

    // Enable the slider
    Plugin.prototype.setEnabled = function(cb) {
        this.options.isDisable = false;

        var slider        = this,
            $bearer       = slider.$bearer,
            $labels       = slider.$labels,
            $inputs       = slider.$inputs,
            disabledClass = slider.options.disabledClass;

        $.merge($labels, $inputs).each(function() {
            $(this).prop('disabled', false);
            slider.addInteraction();
        });

        if (typeof cb === 'function') {
            cb($labels, $inputs);
        }

        $bearer
            .removeClass(disabledClass)
            .trigger('radiodenabled');
    };

    // Get current value
    Plugin.prototype.getValue = function() {
        return this.value;
    };

    // Destroy (WIP)
    Plugin.prototype.destroy = function() {
        this.$document.off('.' + this.identifier);
        this.$window.off('.' + this.identifier);

        this.$bearer
            .off('.' + this.identifier)
            .removeData('plugin_' + pluginName);
        this.$inputs.off('change');

        // Remove the generated markup
        this.$bearer.removeClass(
            this.options.sliderClass +
            ' ' + this.options[this.orientation + 'Class'] +
            ' ' + this.options.size
        );
        this.$dots.remove();
        this.$items.children().unwrap().each(function(){
            var $this = $(this),
                text;
            $this
                .removeAttr('data-level')
                .removeClass('radioslider__input radioslider__label radioslider__text');
            if (this.children.length >0 ) {
                text = $this.children().html();
                $this.children().remove();
                $this.html(text);
            }
        });
        this.$bar.remove();
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instanciations
    $.fn[pluginName] = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var $this = $(this),
                data  = $this.data('plugin_' + pluginName);

            // Create a new instance.
            if (!data) {
                $this.data('plugin_' + pluginName, (data = new Plugin(this, options)));
            }

            // Make it possible to access methods from public.
            // e.g `$element.rangeslider('method');`
            if (typeof options === 'string') {
                data[options].apply(data, args);
            }
        });
    };

})(jQuery);
