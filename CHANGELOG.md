# Change Log

## 1.0.0-beta

Complete rehauling:

* Rename script and main function to `radioslider`
* Change the way to call methods: `$element.radioslider('method')`
* Rename `setDisable` method to `setDisabled` and `setEnable` to `setEnabled`
* Add `setValue` and `destroy` methods
* Make the slider fluid by default, thus removing `fitContainer` option
* Add support for vertical orientation with `orientation` option
* Add `small` and `tiny` sizes
* Add `fillOrigin`, `fillOffset` and `fit` options (≠fitContainer)
* Tweak the apparence