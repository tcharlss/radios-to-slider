/**
 * radiosToSlider v0.3.2
 * jquery plugin to create a slider using a list of radio buttons
 * (c)2014 Rubén Torres - rubentdlh@gmail.com
 * Released under the MIT license
 */

(function($) {
    function RadiosToSlider(element, options) {
        this.bearer = element;
        this.options = options;
        this.currentLevel = 0; //this means no level selected
        this.value = null;
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

            var slider = this;
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

        //Add a container, a bar, wrappers for labels and radio inputs, and hides radio inputs
        addBaseStyle: function() {
            var label = 0,
                slider = this;

            // Container
            this.bearer.addClass("radios-to-slider " + this.options.size);
            // Bar
            var $bar = $('<div class="radios-to-slider__bar">');
            this.bearer.prepend($bar);
            this.bearer.$bar = $bar;
            // Inputs
            var $inputs = this.bearer.find('input[type=radio]');
            var $inputsWrapper = $('<div class="radios-to-slider__inputs">').hide();
            this.bearer.find($inputs).wrapAll($inputsWrapper);
            this.bearer.$inputs = $inputs;
            // Labels
            var $labelsWrapper = $('<div class="radios-to-slider__labels">');
            var $labels = this.bearer.find('label');
            this.bearer.$labels = $labels;
            $labels.each(function() {
                var $this = $(this);
                $this.addClass('radios-to-slider__label');
                label++;
            }).wrapAll($labelsWrapper).parent()
                .css('padding-left', $bar.css('paddingLeft'))
                .css('padding-right', $bar.css('paddingRight'));
        },

        //Add level indicators to DOM
        addLevels: function() {
            var $bearer = this.bearer,
                level = 0,
                slider = this,
                $bar = $bearer.$bar;

            $bearer.find('input[type=radio]').each(function(i) {
                var $this = $(this);
                var $level = $("<ins class='radios-to-slider__level' data-radio='" + $this.attr('id') + "' data-value=" + $this.val() + "></ins>");
                $bearer.append($level);
            });
            var $levels = $bearer.find('.radios-to-slider__level');
            $bearer.$levels = $levels;
            $levels.appendTo($bar);
        },

        //Add slider fill to DOM
        addFill: function() {
            var $knob = $("<span class='radios-to-slider__knob'></span>");
            var $fill = $("<ins class='radios-to-slider__fill'></ins>").append($knob);
            this.bearer.$bar.append($fill);
            this.bearer.$fill = $fill;
            this.bearer.$knob = $knob;
        },

        //set width of slider bar and current level
        setSlider: function() {
            var $bar = this.bearer.$bar,
                $inputs = this.bearer.$inputs,
                $levels = this.bearer.$levels,
                $labels = this.bearer.$labels,
                $fill = this.bearer.$fill,
                $knob = this.bearer.$knob,
                radio = 1,
                slider = this,
                label;

            $inputs.each(function() {
                var $this = $(this),
                    radioId = $this.attr('id');

                if ($this.prop('checked')) {
                    var value = $this.attr('value'),
                        $level = $levels.filter('[data-value='+value+']'),
                        levelPos = $level.position().left,
                        barWidth = $bar.width(),
                        knobWidth = $knob.width(),
                        width = levelPos + (knobWidth/2);
                        widthPercent = 100 * width / barWidth;

                    $fill.css('visibility', 'visible');
                    $fill.width(widthPercent + '%');
                    slider.currentLevel = radio;
                }

                if (slider.options.animation) {
                    $fill.addClass('transition-enabled');
                }

                radio++;
            });

            //Set style for lower levels
            label = 0;
            $levels.each(function() {
                label++;

                var $this = $(this);

                if (label < slider.currentLevel) {
                    $this.css('visibility', 'visible');
                    $this.addClass('radios-to-slider__level_lower');
                } else if (label == slider.currentLevel) {
                    $this.css('visibility', 'hidden');
                } else {
                    $this.css('visibility', 'visible');
                    $this.removeClass('radios-to-slider__level_lower');
                }
            });

            //Add bold style for selected label
            label = 0;
            $labels.each(function() {
                label++;

                var $this = $(this);

                if (label == slider.currentLevel) {
                    $this.addClass('active');
                } else {
                    $this.removeClass('active');
                }
            });
        },

        addInteraction: function() {
            var slider = this,
                $bearer = slider.bearer,
                $levels = $bearer.$levels,
                $inputs = $bearer.$inputs;

            $levels.on('click', function() {
                var $this = $(this),
                    val = $this.attr('data-value'),
                    radioId = $this.attr('data-radio'),
                    radioElement = $bearer.find('#' + radioId);

                radioElement.prop('checked', true);

                if (slider.options.onSelect) {
                    slider.options.onSelect(radioElement, [
                        $levels,
                        $inputs
                    ]);
                }

                slider.value = val;
                $bearer.attr('data-value', val);

                slider.setSlider();

                $bearer.trigger('radiochange');
            });

            $inputs.on('change', function() {
                var $this = $(this),
                    val = $this.attr('value'),
                    radioId = $this.attr('data-radio'),
                    radioElement = $bearer.find('#' + radioId);

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

        setDisabled: function(isDisable, cb) {
            if (!this.options.isDisable) return;

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

            if (typeof cb === "function") {
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

            if (typeof cb === "function") {
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
