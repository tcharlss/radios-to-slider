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
            horizontalClass: 'radioslider_horizontal',
            verticalClass:   'radioslider_vertical',
            disabledClass:   'radioslider_disabled',
            fitClass:        'radioslider_fit',
            animationClass:  'radioslider_animated',
            dotUnderClass:   'under',
            inverseClass:    'inverse',
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

        this.identifier      = 'js-' + pluginName + '-' +(pluginIdentifier++);
        this.level           = 0; // This means no level selected
        this.value           = null;
        this.levelsCount     = this.$bearer.find('input[type=radio]').length;
        // this.$item        = $('<div class="' + this.options.itemClass + '">');
        // this.$dot         = $('<span class="' + this.options.dotClass + '">');
        // this.$text        = $('<span class="' + this.options.textClass + '">');
        this.$bar            = $('<div class="' + this.options.barClass + '">');
        this.$fill           = $('<div class="' + this.options.fillClass + '">');
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
        if (this.options.isDisabled) {
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
        });
        $items = $bearer.find('.' + options.itemClass);
        this.$items = $items;

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
                handleOffset,
                barOffset,
                fillDimension,
                fillDirection,
                input;

            // Get elements dimensions
            currentLevel     = Number($inputChecked.attr('data-level'));
            currentValue     = this.getValueFromLevel(currentLevel);
            dotPos           = this.getPositionFromValue(currentValue);
            handleOffset     = this.getHandleOffset(); // half handle height/width
            barOffset        = this.getBarOffset(); // half bar height/width

            // Set fill dimensions and position
            // If different origin
            if (
                fillOrigin !== null && (originPos = this.getPositionFromValue(fillOrigin))
                || fillOffset !== null && (originPos = this.getPositionFromValue(fillOffset))
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
            $fill[0].style[this.DIMENSION] = this.dimensionToPercent(fillDimension) + '%';
            $fill[0].style[this.DIRECTION_STYLE] = this.dimensionToPercent(fillDirection) + '%';
            $handle[0].style[this.DIRECTION_STYLE] = this.dimensionToPercent(dotPos/* - handleOffset*/) + '%';

            // Update value
            this.level = currentLevel;
            this.value = currentValue;

            // Set style for lower levels
            input = 0;
            lowLevel = originLevel ? Math.min(originLevel, currentLevel) : 1,
            highLevel = originLevel ? Math.max(originLevel, currentLevel) : currentLevel;
            $inputs.each(function() {
                input++;

                var $this       = $(this),
                    $label      = $this.next('label'),
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
        var slider = this,
            $bearer = this.$bearer,
            $inputs = this.$inputs;

        // Radio input change
        $inputs.on('change', function() {

            $(this).prop('checked', true);

            if (slider.options.onChange) {
                slider.options.onChange($this, [$inputs]);
            }

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

    // Set the value
    Plugin.prototype.setValue = function(value) {
        if (value !== this.value) {
            this.$inputs
                .filter('[value=' + value + ']')
                .trigger('click');
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
            position = $dot.position()[this.DIRECTION_STYLE] + dimension/2;
        }
        position = (!Number.isNaN(position)) ? position : 0;

        return position;
    };

    // Get the position offset of the handle (eg. half its length)
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
            // e.g `$element.radioslider('method');`
            if (typeof options === 'string') {
                data[options].apply(data, args);
            }
        });
    };

})(jQuery);
