(function($) {
    'use strict';

    var pluginName = 'radioslider',
        pluginNumber = 0,
        defaults = {
            size:            '', // General slider size
            animation:       true, // Enable fill animation
            isDisabledd:      false, // Make the inputs disabled
            fillOffset:      null, // Offset the fill center
            fillOrigin:      null, // Make the fill bidirectional
            fit:             false, // Fit the edges
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
            horizontalClass: 'radioslider_horizontal',
            verticalClass:   'radioslider_vertical',
            fitClass:        'radioslider_fit',
            animationClass:  'radioslider_animated',
            dotUnderClass:   'under',
            inverseClass:    'inverse',
            activeClass:     'active',
            focusClass:      'focused',
            disabledClass:   'disabled',
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
        pluginNumber++;

        this.$window         = $(window);
        this.$document       = $(document);
        this.$bearer         = $(element);
        this.options         = $.extend( {}, defaults, options, this.$bearer.data() );
        this.orientation     = this.options.orientation;
        this.DIMENSION       = constants.orientation[this.orientation].dimension;
        this.DIRECTION       = constants.orientation[this.orientation].direction;
        this.DIRECTION_STYLE = constants.orientation[this.orientation].directionStyle;
        this.COORDINATE      = constants.orientation[this.orientation].coordinate;

        this.number          = pluginNumber;
        this.identifier      = pluginName + '-' + pluginNumber;
        this.level           = 0; // This means no level selected
        this.value           = null;
        this.levelsCount     = this.$bearer.find('input[type=radio]').length;
        // this.$item        = $('<div class="' + this.options.itemClass + '">');
        // this.$dot         = $('<span class="' + this.options.dotClass + '">');
        // this.$text        = $('<span class="' + this.options.textClass + '">');
        this.$bar            = $('<span class="' + this.options.barClass + '">');
        this.$fill           = $('<span class="' + this.options.fillClass + '">');
        this.$handle         = $('<span class="' + this.options.handleClass + '">');
        this.$bar
            .append(this.$fill.css('visibility', 'hidden'))
            .append(this.$handle);

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
        if (this.options.isDisabledd) {
            this.setDisabled();
        }
    };

    // Add container to DOM, wrap inputs and labels in containers, add bar
    Plugin.prototype.addBase = function() {
        var options = this.options,
            $bearer = this.$bearer,
            $bar    = this.$bar,
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
                ' ' + (options.animation ? options.animationClass : '') +
                ' ' + (options.size ? options.sliderClass + '_' + options.size : '')
            )
            .attr('data-radioslider', this.number);

        // Inputs : add class and level data
        // Store the initial disabled inputs
        $inputs = $bearer
            .find('> input[type=radio]')
            .each(function(i) {
                $(this)
                    .addClass(options.inputClass)
                    .attr('data-level', i+1);
            });
        this.$inputs = $inputs;
        this.$inputsDisabled = this.$bearer.find('> input[type=radio][disabled]');

        // Labels : add class and level data, insert dots, wrap text
        $labels = $bearer
            .find('> label')
            .each(function(i) {
                var level,
                    value,
                    text,
                    $text,
                    $dot;

                text  = $(this).html();
                $text = $('<span class="' + options.textClass + '">').html(text);
                level = i+1;
                value = $inputs.filter('[data-level=' + level + ']').attr('value');
                $dot  = $('<span class="' + options.dotClass + '">')
                    .attr('data-level', level)
                    .attr('data-value', value);

                $(this)
                    .addClass(options.labelClass)
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
            // Add disabled class
            if ($(this).attr('disabled') === 'disabled') {
                $(this).parent().addClass(options.disabledClass);
            }
        });
        $items = $bearer.find('.' + options.itemClass);
        this.$items = $items;
        // If vertical, inverse order
        if (this.orientation === 'vertical') {
            $items.each(function(i, el){
                $bearer.prepend(el);
            });
        }

        // Bar
        $bearer.append($bar);
    };

    // Update the fill bar and current level based on checked radio
    Plugin.prototype.setSlider = function() {
        var $inputChecked = this.$inputs.filter(':checked');

        if ($inputChecked.length > 0) {
            var options    = this.options,
                $inputs    = this.$inputs,
                $bar       = this.$bar,
                $fill      = this.$fill,
                $handle    = this.$handle,
                fillOrigin = options.fillOrigin,
                fillOffset = options.fillOffset,
                $handleOrigin,
                currentValue,
                currentLevel,
                originLevel,
                lowLevel,
                highLevel,
                dotPos,
                originPos,
                // handleOffset,
                barOffset,
                fillDimension,
                fillDirection,
                input;

            // Put active class
            $inputChecked.next('.'+options.labelClass).addClass(options.activeClass).parents('.'+options.itemClass).addClass(options.activeClass);
            $inputs.not($inputChecked).next('.'+options.labelClass).removeClass(options.activeClass).parents('.'+options.itemClass).removeClass(options.activeClass);

            // Get elements dimensions
            currentLevel     = Number($inputChecked.attr('data-level'));
            currentValue     = this.getValueFromLevel(currentLevel);
            dotPos           = this.getPositionFromValue(currentValue);
            barOffset        = this.getBarOffset(); // half bar height/width
            // handleOffset     = this.getHandleOffset(); // half handle height/width

            // Set fill dimensions and position
            // If different origin
            if (
                fillOrigin !== null && (originPos = this.getPositionFromValue(fillOrigin)) || fillOffset !== null && (originPos = this.getPositionFromValue(fillOffset))
            ) {
                originLevel = fillOrigin !== null ? this.getLevelFromValue(fillOrigin) : this.getLevelFromValue(fillOffset);
                $fill.css('opacity', '').addClass('offseted');

                // Insert a secondary handle at the offset origin
                if (!this.$handleOrigin) {
                    $handleOrigin = $('<span class="' + this.options.handleClass + ' ' + options.handleClass + '_origin">');
                    this.$handleOrigin = $handleOrigin;
                    $fill.after($handleOrigin);
                    $handleOrigin[0].style[this.DIRECTION_STYLE] = this.dimensionToPercent(originPos/* - handleOffset*/) + '%';
                } else {
                    $handleOrigin = this.$handleOrigin;
                }

                // Positive direction
                if (currentLevel >= originLevel) {
                    $bar.removeClass(options.inverseClass);
                    $handleOrigin.removeClass(options.inverseClass).css('opacity', '');
                    switch (this.orientation) {
                        case 'horizontal':
                            fillDimension = dotPos - originPos/* + (barOffset * 2)*/;
                            fillDirection = originPos/* - barOffset*/;
                            break;
                        case 'vertical':
                            fillDimension = dotPos - originPos;
                            fillDirection = originPos;
                            break;
                    }
                // Inverse with fillorigin
                } else if (fillOrigin !== null) {
                    $bar.addClass(options.inverseClass);
                    $handleOrigin.addClass(options.inverseClass);
                    switch (this.orientation) {
                        case 'horizontal':
                            fillDimension = originPos - dotPos/* + (barOffset * 2)*/;
                            fillDirection = dotPos/* - barOffset*/;
                            break;
                        case 'vertical':
                            fillDimension = originPos + dotPos;
                            fillDirection = dotPos;
                            break;
                    }
                // Inverse with filloffset
                } else {
                    $handleOrigin.css('opacity', 0);
                    $fill.css('opacity', 0);
                    fillDimension = barOffset * 2;
                    fillDirection = dotPos/* - barOffset*/;
                }
            // If normal origin
            } else  {
                fillDimension = dotPos/* + barOffset*/;
                fillDirection = 0;
            }

            // Show the fill bar
            $fill.css('visibility', '');
            $fill[0].style[this.DIRECTION_STYLE] = this.dimensionToPercent(fillDirection) + '%';
            if (this.orientation === 'vertical') {
                $fill[0].style[this.DIMENSION] = 100 - this.dimensionToPercent(fillDimension) + '%';
                $handle[0].style[this.DIRECTION_STYLE] = 100 - this.dimensionToPercent(dotPos/* - handleOffset*/) + '%';
            } else {
                $fill[0].style[this.DIMENSION] = this.dimensionToPercent(fillDimension) + '%';
                $handle[0].style[this.DIRECTION_STYLE] = this.dimensionToPercent(dotPos/* - handleOffset*/) + '%';
            }

            // Update globals
            this.level = currentLevel;
            this.value = currentValue;

            // Set style for lower levels
            input = 0;
            lowLevel = originLevel ? Math.min(originLevel, currentLevel) : 1;
            highLevel = originLevel ? Math.max(originLevel, currentLevel) : currentLevel;
            $inputs.each(function() {
                input++;

                var $this       = $(this),
                    $dot        = $this.next('label').find('.' + options.dotClass),
                    level       = Number($this.attr('data-level')),
                    ignoreUnder = (fillOffset !== null && currentLevel < originLevel);

                // Current level
                if (level === currentLevel) {
                    $dot.css('opacity', '0');
                // Outside the fill
                } else if (level < lowLevel || level > highLevel || ignoreUnder) {
                    $dot
                        .css('opacity', '')
                        .removeClass(options.dotUnderClass);
                // Under the fill
                } else {
                    $dot
                        .css('opacity', '')
                        .addClass(options.dotUnderClass);
                }
            });
        }
    };

    // Interaction
    Plugin.prototype.addInteraction = function() {
        var slider  = this,
            $bearer = this.$bearer,
            $inputs = this.$inputs,
            $handle = this.$handle;

        // Radio input change
        $inputs.on('change.' + slider.identifier, function() {

            $(this).prop('checked', true);

            if (slider.options.onSelect) {
                slider.options.onSelect($(this), [$inputs]);
            }

            slider.setSlider();
            $bearer.trigger('radiochange', { origin: slider.identifier });
        }).on('focusin.' + slider.identifier, function() {
            $handle.addClass(slider.options.focusClass);
        }).on('focusout.' + slider.identifier, function() {
            $handle.removeClass(slider.options.focusClass);
        });

    };

    // Disable the slider
    Plugin.prototype.setDisabled = function(callback) {
        this.options.isDisabled = true;

        var slider        = this,
            $bearer       = slider.$bearer,
            $labels       = slider.$labels,
            $inputs       = slider.$inputs,
            disabledClass = slider.options.disabledClass;

        // Add disabled attribute and cancel click and change events
        $.merge($labels, $inputs).each(function() {
            $(this).off('click change');
        });
        $inputs.each(function() {
            $(this)
                .prop('disabled', true)
                .parent().addClass(disabledClass);
        });

        if (typeof callback === 'function') {
            callback($labels, $inputs);
        }

        $bearer
            .addClass(disabledClass)
            .trigger('radiodisabled', { origin: this.identifier });
    };

    // Enable the slider
    Plugin.prototype.setEnabled = function(callback) {
        this.options.isDisabled = false;

        var slider        = this,
            $bearer       = slider.$bearer,
            $labels       = slider.$labels,
            $inputs       = slider.$inputs,
            disabledClass = slider.options.disabledClass;

        // Remove the disabled attribute except those which were already here on init
        $inputs.not(slider.$inputsDisabled).each(function() {
            $(this)
                .prop('disabled', false)
                .parent().removeClass(disabledClass);
        });

        // Add interaction back
        slider.addInteraction();

        if (typeof callback === 'function') {
            callback($labels, $inputs);
        }

        $bearer
            .trigger('radiodenabled', { origin: this.identifier })
            .removeClass(disabledClass);
    };

    // Get current value
    Plugin.prototype.getValue = function() {
        return this.value;
    };

    // Set the value
    Plugin.prototype.setValue = function(value) {
        if (value !== this.value) {
            this.$inputs
                .filter('[value=' + value + ']')
                .trigger('click', { origin: this.identifier });
        }
    };

    // Get level from value
    Plugin.prototype.getLevelFromValue = function(value) {
        var level;

        level = Number(this.$inputs.filter('[value="' + value + '"]').attr('data-level'));
        level = (!Number.isNaN(level)) ? level : 0;

        return level;
    };

    // Get value from level
    Plugin.prototype.getValueFromLevel = function(level) {
        var value;

        value = this.$inputs.filter('[data-level=' + level + ']').attr('value');

        return value;
    };

    // Get the position of center of the dot corresponding to a value
    Plugin.prototype.getPositionFromValue = function(value) {
        var position, dimensions, dimension, $dot;

        if (($dot = this.$dots.filter('[data-value="' + value + '"]')) && $dot.length > 0) {
            dimensions = {
                width:  $dot.outerWidth(),
                height: $dot.outerHeight(),
            };
            dimension = dimensions[this.DIMENSION];
            position = $dot.position()[this.DIRECTION] + dimension/2;
        }
        position = (!Number.isNaN(position)) ? position : 0;

        return position;
    };

    // Get the position offset of the handle (eg. half its length)
    /*
    Plugin.prototype.getHandleOffset = function() {
        var handleDimensions,
            handleDimension,
            offset;

        handleDimensions = {
            width:  this.$handle.outerWidth(),
            height: this.$handle.outerHeight(),
        };
        handleDimension = handleDimensions[this.DIMENSION];
        offset          = handleDimension / 2;
        offset          = (!Number.isNaN(offset)) ? offset : 0;

        return offset;
    };
    */

    // Get the position offset of the bar (eg. half its length)
    Plugin.prototype.getBarOffset = function() {
        var barDimensions,
            barDimension,
            offset;

        // Yes, dimensions are switched on purpose
        barDimensions = {
            width:  this.$bar.outerHeight(),
            height: this.$bar.outerWidth(),
        };
        barDimension = barDimensions[this.DIMENSION];
        offset       = barDimension / 2;
        offset       = (!Number.isNaN(offset)) ? offset : 0;

        return offset;
    };

    // Convert a dimension to a percentage of the bearer length
    Plugin.prototype.dimensionToPercent = function(dimension) {
        var bearerDimensions,
            bearerDimension,
            percent;

        bearerDimensions = {
            width: this.$bearer.outerWidth(),
            height: this.$bearer.outerHeight(),
        };
        bearerDimension = bearerDimensions[this.DIMENSION];
        percent = dimension * 100 / bearerDimension;

        return percent;
    };

    // Destroy
    Plugin.prototype.destroy = function() {
        var options = this.options;

        // Remove event handlers
        this.$document.off('.' + this.identifier);
        this.$window.off('.' + this.identifier);
        this.$bearer.off('.' + this.identifier).removeData('plugin_' + pluginName);
        this.$inputs.off('.' + this.identifier);

        // Remove the generated markup
        this.$bearer
            .removeAttr('data-radioslider')
            .removeClass(
                options.sliderClass + ' ' +
                options[this.orientation + 'Class'] + ' ' +
                options.fitClass + ' ' +
                options.animationClass + ' ' +
                options.sliderClass + '_' + options.size
            );
        this.$dots.remove();
        this.$bar.remove();
        this.$items.children().unwrap().each(function(){
            var $this = $(this),
                text;
            $this
                .removeAttr('data-level')
                .removeClass(options.inputClass + ' ' + options.labelClass + ' ' + options.textClass);
            if (this.children.length >0 ) {
                text = $this.children().html();
                $this.children().remove();
                $this.html(text);
            }
        });
        this.$bearer.find('[class=""]').removeAttr('class');
        
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
            // e.g `$element.radioslider('method');`
            if (typeof options === 'string') {
                data[options].apply(data, args);
            }
        });
    };

})(jQuery);
