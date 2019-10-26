/*prout*/(function($) {
    'use strict';

    function Radioslider(element, options) {
        this.bearer = element;
        this.options = options;
        this.currentLevel = 0; //this means no level selected
        this.value = null;
        this.elements = {
            option:        '<div class="radioslider__option">',
            dot:           '<span class="radioslider__dot">',
            content:       '<span class="radioslider__content">',
            bar:           '<div class="radioslider__bar">',
            fill:          '<div class="radioslider__fill">',
            knob:          '<span class="radioslider__knob">',
            inputClass:    'radioslider__input',
            labelClass:    'radioslider__label',
            lowerClass:    'lower',
            disabledClass: 'disabled'
        };
    }

    Radioslider.prototype = {

        activate: function() {
            // Get number options
            this.numOptions = this.bearer.find('input[type=radio]').length;
            this.addBaseStyle();
            this.addBar();
            this.setSlider();
            this.addInteraction();
            this.setDisabled();
        },

        // Add a container to DOM, wrap inputs and labels in containers
        addBaseStyle: function() {
            var $bearer = this.bearer,
                elements = this.elements,
                $options,
                $inputs,
                $labels;

            // Container
            $bearer.addClass('radioslider ' + this.options.size);
            // Inputs : add class and level data
            $inputs = $bearer
                .find('> input[type=radio]')
                .each(function(i) {
                    $(this)
                        .addClass(elements.inputClass)
                        .attr('data-level', i+1);
                });
            $bearer.$inputs = $inputs;
            // Labels : add class and level data, insert dots
            $labels = $bearer
                .find('> label')
                .each(function(i) {
                    var text = $(this).html(),
                        $content = $(elements.content).html(text),
                        $dot = $(elements.dot);
                    $(this)
                        .addClass(elements.labelClass)
                        .attr('data-level', i+1)
                        .html('')
                        .append($dot)
                        .append($content);
                });
            $bearer.$labels = $labels;
            // Wrap inputs and labels together
            $options = $inputs.each(function() {
                $(this)
                    .nextUntil('input')
                    .addBack()
                    .wrapAll(elements.option);
            });
            $bearer.$options = $options;
        },

        // Add slider bar, fill and knob to DOM
        addBar: function() {
            var slider = this,
                $bearer = this.bearer,
                elements = this.elements,
                $bar,
                $fill,
                $knob;

            $knob = $(elements.knob);
            $fill = $(elements.fill);
            $bar = $(elements.bar);
            $fill.append($knob);
            $bar.append($fill);
            $bearer.append($bar);
            this.bearer.$bar = $bar;
            this.bearer.$fill = $fill;
            this.bearer.$knob = $knob;
            if (slider.options.animation) {
                $fill.addClass('transition-enabled');
            }
        },

        // Set width of slider bar and current level
        setSlider: function() {
            var slider = this,
                elements = this.elements,
                $bearer = this.bearer,
                $inputs = $bearer.$inputs,
                $labels = $bearer.$labels,
                $fill = $bearer.$fill,
                $knob = $bearer.$knob,
                dotClass = $(elements.dot).attr('class'),
                lowerClass = elements.lowerClass,
                input,
                label;

            var $inputChecked = $inputs.filter(':checked');
            if ($inputChecked.length > 0) {
                var currentLevel = $inputChecked.attr('data-level');
                var inputPos = $inputChecked.position().left;
                var bearerWidth = $bearer.width();
                var knobWidth = $knob.width();
                var width = inputPos + (knobWidth/2);
                var widthPercent = 100 * width / bearerWidth;

                // Show the fill bar and set its width
                $fill.css('visibility', 'visible');
                $fill.width(widthPercent + '%');
                slider.currentLevel = Number(currentLevel);

                // Set style for lower levels
                input = 0;
                $inputs.each(function() {
                    input++;

                    var $this = $(this),
                        $label = $this.next('label'),
                        $dot = $this.next('label').find('.'+dotClass);

                    if (input < slider.currentLevel) {
                        $dot.css('visibility', '');
                        $label.addClass(lowerClass);
                    } else if (input === slider.currentLevel) {
                        $dot.css('visibility', 'hidden');
                    } else {
                        $dot.css('visibility', '');
                        $label.removeClass(lowerClass);
                    }
                });
            }
        },

        addInteraction: function() {
            var slider = this,
                $bearer = slider.bearer,
                $inputs = $bearer.$inputs;

            // Radio input change
            $inputs.on('change', function() {
                var $this = $(this),
                    val = $this.attr('value'),
                    level = $this.attr('data-level'),
                    radioElement = $inputs.filter('[data-level=' + level + ']');

                radioElement.prop('checked', true);

                if (slider.options.onChange) {
                    slider.options.onChange(radioElement, [
                        $inputs
                    ]);
                }

                slider.value = val;
                $bearer.attr('data-value', val);
                slider.setSlider();
                $bearer.trigger('radiochange');
            });

        },

        setDisabled: function() {
            if (!this.options.isDisable) {
                return;
            }

            this.setDisable();
        },

        setDisable: function(cb) {
            this.options.isDisable = true;

            var slider = this,
                elements = this.elements,
                $bearer = slider.bearer,
                $labels = $bearer.$labels,
                $inputs = $bearer.$inputs,
                disabledClass = elements.disabledClass;

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
        },

        setEnable: function(cb) {
            this.options.isDisable = false;

            var slider = this,
                elements = this.elements,
                $bearer = slider.bearer,
                $labels = $bearer.$labels,
                $inputs = $bearer.$inputs,
                disabledClass = elements.disabledClass;

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
        },

        getValue: function() {
            return this.value;
        }

    };

    $.fn.radioslider = function(options) {
        var rtn = [],
            $this = this;

        $this.each(function() {
            options = $.extend({}, $.fn.radioslider.defaults, options);

            var slider = new Radioslider($(this), options);
            slider.activate();

            rtn.push({
                bearer: slider.bearer,
                setDisable: slider.setDisable.bind(slider),
                setEnable: slider.setEnable.bind(slider),
                getValue: slider.getValue.bind(slider)
            });
        });

        return rtn;
    };

    $.fn.radioslider.defaults = {
        size: '',
        animation: true,
        isDisable: false,
        onSelect: null
    };

})(jQuery);
