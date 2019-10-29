!> This plugin is a fork of [Ruben Torres’s Radios to Slider](http://rubentd.com/radios-to-slider).
A bit of code is also borrowed from [Andre Ruffert’s rangeslider.js](https://rangeslider.js.org/).
Thanks to both of them for their work!

# Radioslider

A jQuery plugin to display radio buttons as a slider.

Turn this:
<div>
<input id="opt1a" name="a" type="radio" value="nice">
<label for="opt1a">Nice</label>
<input id="opt2a" name="a" type="radio" value="good" checked>
<label for="opt2a">Good</label>
<input id="opt3a" name="a" type="radio" value="swell">
<label for="opt3a">Swell</label>
<input id="opt4a" name="a" type="radio" value="nifty">
<label for="opt4a">Nifty</label>
</div>

Into this:
<div id="radios-basic">
<input id="opt1b" name="b" type="radio" value="nice">
<label for="opt1b">Nice</label>
<input id="opt2b" name="b" type="radio" value="good" checked>
<label for="opt2b">Good</label>
<input id="opt3b" name="b" type="radio" value="swell">
<label for="opt3b">Swell</label>
<input id="opt4b" name="b" type="radio" value="nifty">
<label for="opt4b">Nifty</label>
</div>

## Installation

* Via [npm](https://www.npmjs.org/) : ```npm install --save radioslider```
* Download manually on [Github](https://github.com/tcharlss/radioslider/releases/tag/v1.0.0-alpha.2)

The script is also hosted on CDNs like [unpkg](https://unpkg.com/radioslider) or [jsdelivr](https://www.jsdelivr.com/package/npm/radioslider?path=dist)

## Quick start

```html
<!-- Load the stylesheet -->
<head>
    <link rel="stylesheet" href="path/to/radioslider.min.css">
</head>

<!-- Have some radio inputs with their labels -->
<div id="radios">
    <input id="option1" name="options" type="radio" value="1">
    <label for="option1">Nice</label>

    <input id="option2" name="options" type="radio" value="2" checked>
    <label for="option2">Super</label>

    <input id="option3" name="options" type="radio" value="3">
    <label for="option3">Extra</label>
</div>

<!-- Load jQuery and radioslider, then call the function -->
<script src="path/to/jquery.min.js"></script>
<script src="path/to/jquery.radioslider.min.js"></script>
<script>
    $(function() {
        var radios = $("#radios").radioslider();
    });
</script>
```

## Examples

### Sizes

There are 2 extra sizes: `'small'` and `'tiny'`.

**Default:**

<div id="radios-medium">
<input id="opt1e" name="e" type="radio" value="nice">
<label for="opt1e">Nice</label>
<input id="opt2e" name="e" type="radio" value="good" checked>
<label for="opt2e">Good</label>
<input id="opt3e" name="e" type="radio" value="swell">
<label for="opt3e">Swell</label>
<input id="opt4e" name="e" type="radio" value="nifty">
<label for="opt4e">Nifty</label>
</div>

**Small:**

<div id="radios-small">
<input id="opt1c" name="c" type="radio" value="nice">
<label for="opt1c">Nice</label>
<input id="opt2c" name="c" type="radio" value="good" checked>
<label for="opt2c">Good</label>
<input id="opt3c" name="c" type="radio" value="swell">
<label for="opt3c">Swell</label>
<input id="opt4c" name="c" type="radio" value="nifty">
<label for="opt4c">Nifty</label>
</div>

**Tiny:**

<div id="radios-tiny">
<input id="opt1d" name="d" type="radio" value="nice">
<label for="opt1d">Nice</label>
<input id="opt2d" name="d" type="radio" value="good" checked>
<label for="opt2d">Good</label>
<input id="opt3d" name="d" type="radio" value="swell">
<label for="opt3d">Swell</label>
<input id="opt4d" name="d" type="radio" value="nifty">
<label for="opt4d">Nifty</label>
</div>

```javascript
$("#radios").radioslider({
    size: 'small' // or 'tiny'
});
```

You can easily add custom sizes by tweaking a few CSS variables:

```javascript
$("#radios").radioslider({
    size: 'extrasuperbig'
});
```

```css
.radioslider.extrasuperbig {
    --dot-size: 3em;
    --bar-padding: 0.25em;
}
```

### Fit

The fill can fit the edges. Be aware that in some cases, the labels may overflow.

<div id="radios-fit">
<input id="opt1f" name="f" type="radio" value="nice">
<label for="opt1f">Nice</label>
<input id="opt2f" name="f" type="radio" value="good" checked>
<label for="opt2f">Good</label>
<input id="opt3f" name="f" type="radio" value="swell">
<label for="opt3f">Swell</label>
<input id="opt4f" name="f" type="radio" value="nifty">
<label for="opt4f">Nifty</label>
</div>

```javascript
$("#radios").radioslider({
    fit: true
});
```

### Bidirectional

The origin of the fill can be set to any value, making the slider bidirectional. Here's an example with the center set at `'0'`.

<div id="radios-fillorigin">
<input id="opt1g" name="g" type="radio" value="-3" checked>
<label for="opt1g">-3</label>
<input id="opt2g" name="g" type="radio" value="-2">
<label for="opt2g">-2</label>
<input id="opt3g" name="g" type="radio" value="-1">
<label for="opt3g">-1</label>
<input id="opt4g" name="g" type="radio" value="0">
<label for="opt4g">0</label>
<input id="opt5g" name="g" type="radio" value="1">
<label for="opt5g">-1</label>
<input id="opt6g" name="g" type="radio" value="2">
<label for="opt6g">-2</label>
<input id="opt7g" name="g" type="radio" value="3">
<label for="opt7g">-3</label>
</div>

```javascript
$("#radios").radioslider({
    fillOrigin: '0'
});
```

### Offset center

In some special cases, it's possible to offset the center of the fill. It means that on the "negative" values, there will be no fill.

On a scale of 1 to 4, how would you rate this feature?

<div id="radios-filloffset">
<input id="opt1h" name="h" type="radio" value="-3" checked>
<label for="opt1h">I don't care</label>
<input id="opt2h" name="h" type="radio" value="-2">
<label for="opt2h">No idea</label>
<input id="opt4h" name="h" type="radio" value="1">
<label for="opt4h">1</label>
<input id="opt5h" name="h" type="radio" value="2">
<label for="opt5h">2</label>
<input id="opt6h" name="h" type="radio" value="3">
<label for="opt6h">3</label>
<input id="opt3h" name="h" type="radio" value="4">
<label for="opt3h">4</label>
</div>

```javascript
$("#radios").radioslider({
    fillOffset: '1'
});
```

### Vertical orientation

Vertical orientation is supported, the values goes from bottom to top.

In some cases you'll need to give the slider container a fixed height, otherwise the slider will shrink.

<div id="radios-vertical">
<input id="opt1i" name="i" type="radio" value="1">
<label for="opt1i">1</label>
<input id="opt2i" name="i" type="radio" value="2" checked>
<label for="opt2i">2</label>
<input id="opt3i" name="i" type="radio" value="3">
<label for="opt3i">3</label>
<input id="opt4i" name="i" type="radio" value="4">
<label for="opt4i">4</label>
</div>

```javascript
$("#radios").radioslider({
    orientation: 'vertical'
});
```


## Methods

Call the methods like this:

```html
<script>
    $(document).ready(function(){
        var radios = $("#radios").radiosider();

        // Disable inputs
        radios.radioslider('setDisabled');

        // Enable inputs
        radios.radioslider('setEnabled');

        // Retrieve value
        radios.radioslider('getValue');

        // Set value
        radios.radioslider('setValue', '3');

        // Destroy instance
        radios.radioslider('destroy');
    });
</script>
```

**Try it yourself:** [`setDisabled`](disable ':ignore') | [`setEnabled`](enable ':ignore') | [`SetValue` → 3](value ':ignore') | [`Destroy`](destroy ':ignore')

<div id="radios-methods">
<input id="opt1j" name="j" type="radio" value="1">
<label for="opt1j">1</label>
<input id="opt2j" name="j" type="radio" value="2" checked>
<label for="opt2j">2</label>
<input id="opt3j" name="j" type="radio" value="3">
<label for="opt3j">3</label>
<input id="opt4j" name="j" type="radio" value="4">
<label for="opt4j">4</label>
</div>

## Options

Option       | Values      | Default
------------ | ----------- | --------
animation    | true, false | true
orientation  | string : "horizontal" "vertical" | "horizontal"
size         | string : "small" "tiny" | ""
isDisabled   | true, false | false
fillOrigin   | string      | null
fillOffset   | string      | null
onSelect     | callback    | null

## API

Method      | Callback | Args
----------- | -------- | ----------------
setDisabled | true     | $labels, $inputs
setEnabled  | true     | $labels, $inputs
getValue    | false    | -
setValue    | false    | string
destroy     | false    |

Events        | Trigger
------------- | -------------
radiochange   | Called when a radio inputs change, after the slider have been updated
radiodisabled | Called after the inputs have been disabled
radiodenabled | Called after the inputs have been enabled

## Support

Should work on all browsers supporting flexbox properly.
CSS variables are a plus.

Firefox | Chrome | Safari | Edge | IE
--------|--------|--------|------|----
31+     | 49+    | 9.1+   |  16+ | 😂

<script>
  $('#radios-basic').radioslider();
  $('#radios-small').radioslider({size:'small'});
  $('#radios-tiny').radioslider({size:'tiny'});
  $('#radios-medium').radioslider();
  $('#radios-fit').radioslider({fit:true});
  $('#radios-fillorigin').radioslider({fillOrigin:'0'});
  $('#radios-filloffset').radioslider({fillOffset:'1'});
  $('#radios-vertical').radioslider({orientation:'vertical'});
  var $r = $('#radios-methods').radioslider();
  $('a[href=enable]').click(function(){$r.radioslider('setEnabled');return false});
  $('a[href=disable]').click(function(){$r.radioslider('setDisabled');return false});
  $('a[href=value]').click(function(){$r.radioslider('setValue', '3');return false});
  $('a[href=destroy]').click(function(){$r.radioslider('destroy');return false});
</script>
<style>
.radioslider.extrasuperbig {
    --dot-size: 4em;
    --bar-padding: 0.25em;
}
</style>