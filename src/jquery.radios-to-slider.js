(function($) {
    'use strict';

    function RadiosToSlider(element, options) {
        this.bearer = element;
        this.options = options;
        this.currentLevel = 0; //this means no level selected
        this.value = null;
        this.elements = {
            inputsWrapper: '<div class="radios-to-slider__inputs">',
            labelsWrapper: '<div class="radios-to-slider__labels">',
            bar:           '<div class="radios-to-slider__bar">',
            level:         '<ins class="radios-to-slider__level">',
            fill:          '<ins class="radios-to-slider__fill">',
            knob:          '<span class="radios-to-slider__knob">',
        };
    }

    RadiosToSlider.prototype = {

        activate: function() {
            // Get number options
            this.numOptions = this.bearer.find('input[type=radio]').length;
            // this.reset(); // helps prevent duplication
            this.addBaseStyle();
            this.addLevels();
            this.addFill();
            this.setSlider();
            this.addInteraction();
            this.setDisabled();
        },

        reset: function() {
            var $labels = this.bearer.find('label'),
                $levels = this.bearer.find('.radios-to-slider__level');

            $labels.each(function() {
                var $this = $(this);

                $this.removeClass('radios-to-slider__label');
                $this.css('left', '');
            });

            $levels.each(function() {
                $(this).remove();
            });

            // this.bearer.css('width', '');
        },

        // Add a container, a bar, wrappers for labels and radio inputs, and hides radio inputs
        addBaseStyle: function() {
            var $bearer = this.bearer,
                elements = this.elements,
                $bar,
                $inputs,
                $inputsWrapper,
                $labelsWrapper,
                $labels;

            // Container
            $bearer.addClass('radios-to-slider ' + this.options.size);
            // Bar
            $bar = $(elements.bar);
            $bearer.prepend($bar);
            $bearer.$bar = $bar;
            // Inputs
            $inputsWrapper = $(elements.inputsWrapper).hide();
            $inputs = $bearer.find('input[type=radio]');
            $inputs.wrapAll($inputsWrapper).each(function(i){
                $(this).attr('data-level', i+1);
            });
            $bearer.$inputs = $inputs;
            // Labels
            $labelsWrapper = $(elements.labelsWrapper);
            $labels = $bearer.find('label');
            $labels.each(function(i) {
                var $this = $(this);
                $this
                    .addClass('radios-to-slider__label')
                    .attr('data-level', i+1);
            }).wrapAll($labelsWrapper)
                // Copy the bar padding for alignment
                .parent()
                .css('padding-left', $bar.css('paddingLeft'))
                .css('padding-right', $bar.css('paddingRight'));
            $bearer.$labels = $labels;
        },

        // Add level indicators to DOM
        addLevels: function() {
            var $bearer = this.bearer,
                $bar = $bearer.$bar,
                elements = this.elements,
                $levels,
                levelClass;

            $bearer.find('input[type=radio]').each(function() {
                var $this = $(this);
                var $level = $(elements.level).attr('data-value', $this.val());
                $bearer.append($level);
            });
            levelClass = $(elements.level).attr('class');
            $levels = $bearer.find('.' + levelClass);
            $levels.each(function(i){
                $(this).attr('data-level', i+1);
            });
            $bearer.$levels = $levels;
            $levels.appendTo($bar);
        },

        // Add slider fill to DOM
        addFill: function() {
            var slider = this,
                elements = this.elements,
                $knob,
                $fill;

            $knob = $(elements.knob);
            $fill = $(elements.fill).append($knob);
            this.bearer.$bar.append($fill);
            this.bearer.$fill = $fill;
            this.bearer.$knob = $knob;
            if (slider.options.animation) {
                $fill.addClass('transition-enabled');
            }
        },

        // Set width of slider bar and current level
        setSlider: function() {
            var $bar = this.bearer.$bar,
                $inputs = this.bearer.$inputs,
                $levels = this.bearer.$levels,
                $labels = this.bearer.$labels,
                $fill = this.bearer.$fill,
                $knob = this.bearer.$knob,
                slider = this,
                level,
                label;

            var $inputChecked = $inputs.filter(':checked');
            if ($inputChecked.length > 0) {
                var currentLevel = $inputChecked.attr('data-level');
                // var value = $inputChecked.attr('value');
                var $level = $levels.filter('[data-level='+currentLevel+']');
                var levelPos = $level.position().left;
                var barWidth = $bar.width();
                var knobWidth = $knob.width();
                var width = levelPos + (knobWidth/2);
                var widthPercent = 100 * width / barWidth;

                // Show the fill bar and set its width
                $fill.css('visibility', 'visible');
                $fill.width(widthPercent + '%');
                slider.currentLevel = Number(currentLevel);

                // Set style for lower levels
                level = 0;
                $levels.each(function() {
                    level++;

                    var $this = $(this);

                    if (level < slider.currentLevel) {
                        $this.css('visibility', '');
                        $this.addClass('lower');
                    } else if (level === slider.currentLevel) {
                        $this.css('visibility', 'hidden');
                    } else {
                        $this.css('visibility', '');
                        $this.removeClass('lower');
                    }
                });

                // Add active style for selected label
                label = 0;
                $labels.each(function() {
                    label++;

                    var $this = $(this);

                    if (label === slider.currentLevel) {
                        $this.addClass('active');
                    } else {
                        $this.removeClass('active');
                    }
                });
            }
        },

        addInteraction: function() {
            var slider = this,
                $bearer = slider.bearer,
                $levels = $bearer.$levels,
                $inputs = $bearer.$inputs;

            // Clic on level
            $levels.on('click', function() {
                var $this = $(this),
                    value = $this.attr('data-value'),
                    level = $this.attr('data-level'),
                    radioElement = $inputs.filter('[data-level=' + level + ']');

                radioElement.prop('checked', true);

                if (slider.options.onSelect) {
                    slider.options.onSelect(radioElement, [
                        $levels,
                        $inputs
                    ]);
                }

                slider.value = value;
                $bearer.attr('data-value', value);
                slider.setSlider();
                $bearer.trigger('radiochange');
            });

            // Radio input change
            $inputs.on('change', function() {
                var $this = $(this),
                    val = $this.attr('value'),
                    level = $this.attr('data-level'),
                    radioElement = $inputs.filter('[data-level=' + level + ']');

                radioElement.prop('checked', true);

                if (slider.options.onChange) {
                    slider.options.onChange(radioElement, [
                        $levels,
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
                $bearer = slider.bearer,
                $levels = this.bearer.$levels,
                $inputs = this.bearer.$inputs;

            $.merge($levels, $inputs).each(function() {
                var $this = $(this);

                $this.prop('disabled', true).addClass('disabled');
                $this.off('click change');
            });

            if (typeof cb === 'function') {
                cb($levels, $inputs);
            }

            $bearer.trigger('radiodisabled');
        },

        setEnable: function(cb) {
            this.options.isDisable = false;

            var slider = this,
                $bearer = slider.bearer,
                $levels = this.bearer.$levels,
                $inputs = this.bearer.$inputs;

            $.merge($levels, $inputs).each(function() {
                $(this).prop('disabled', false).removeClass('disabled');
                slider.addInteraction();
            });

            if (typeof cb === 'function') {
                cb($levels, $inputs);
            }

            $bearer.trigger('radiodenabled');
        },

        getValue: function() {
            return this.value;
        }

    };

    $.fn.radiosToSlider = function(options) {
        var rtn = [],
            $this = this;

        $this.each(function() {
            options = $.extend({}, $.fn.radiosToSlider.defaults, options);

            var slider = new RadiosToSlider($(this), options);
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

    $.fn.radiosToSlider.defaults = {
        size: 'medium',
        animation: true,
        isDisable: false,
        onSelect: null
    };

})(jQuery);
