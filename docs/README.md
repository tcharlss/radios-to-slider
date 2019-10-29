# Radioslider

A jQuery plugin to display radio buttons as a slider.

Basically, it turns this:
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

!> This plugin is a fork of [Ruben Torres’s Radio to Slider](http://rubentd.com/radios-to-slider).
A bit of code is also borrowed from [Andre Ruffert’s rangeslider.js](https://rangeslider.js.org/).
Thanks to both of them for their work!

## Installation

TODO

## Quick start

```html
<!-- Load the stylesheet -->
<head>
    <link rel="stylesheet" href="path/to/radioslider/radioslider.min.css">
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
<script src="path/to/jquery/jquery.min.js"></script>
<script src="path/to/radioslider/jquery.radioslider.min.js"></script>
<script>
    $(function() {
        var radios = $("#radios").radioslider();
    });
</script>
```

## Examples

### Sizes

The default size is equivalent to `'medium'`. There are 2 others sizes: `'small'` and `'tiny'`.

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

The fill bar can fit the extremities. Be aware that in some cases, the labels may overflow.

```javascript
$("#radios").radioslider({
    fit: true
});
```

### Bidirectional

The origin of the bill bar can be set to any value. Here's an example with the center at `'0'`.

```javascript
$("#radios").radioslider({
    fillOrigin: '0'
});
```

### Offset center

For some special cases, it's possible to offset the center of the fill bar. It means that on the "negative" values, there will be no fill bar.

```javascript
$("#radios").radioslider({
    fillOffset: '0'
});
```

### Vertical orientation

Vertical orientation is supported. In that case the values goes from bottom to top.

```javascript
$("#radios").radioslider({
    orientation: 'vertical'
});
```


## Usage

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

Events        | Triggered
------------- | -------------
radiochange   | If triggered [click, change] events
radiodisabled | When disabling radios
radiodenabled | When enabling radios

## Support

Should work on all browsers supporting flexbox properly.
CSS variables are a plus.

Firefox | Chrome | Safari | Edge | IE
--------|--------|--------|------|----
31+     | 49+    | 9.1+   |  16+ | 😂

<script>
  console.log(2333)
</script>
