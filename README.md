# [jQuery asDropdown](https://github.com/amazingSurge/jquery-asDropdown) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jquery plugin that creates a custom dropdown.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-asDropdown.js
├── jquery-asDropdown.es.js
├── jquery-asDropdown.min.js
└── css/
    ├── asDropdown.css
    └── asDropdown.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-asDropdown/master/dist/jquery-asDropdown.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-asDropdown/master/dist/jquery-asDropdown.min.js) - minified

#### Install From Bower
```sh
bower install jquery-asDropdown --save
```

#### Install From Npm
```sh
npm install jquery-asDropdown --save
```

#### Install From Yarn
```sh
yarn add jquery-asDropdown
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-asDropdown.git
cd jquery-asDropdown
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-asDropdown` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/asDropdown.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-asDropdown.js"></script>
```

#### Required HTML structure

```html
<div class="dropdown-wrap">
    <div class="dropdown-example">click me</div>
    <ul>
        <li data-value="1">items-1</li>
        <li data-value="2">items-2</li>
        <li data-value="3">items-3</li>
        <li data-value="4">items-4</li>
    </ul>
</div>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.dropdown-example').asDropdown(); 
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-asDropdown/tree/master/examples).

## Options
`jquery-asDropdown` can accept an options object to alter the way it behaves. You can see the default options by call `$.asDropdown.setDefaults()`. The structure of an options object is as follows:

```
{
  namespace: 'asDropdown',
  skin: null,
  panel: '+', //jquery selector to find content in the page, or '+' means adjacent siblings
  clickoutHide: true, //When clicking outside of the dropdown, trigger hide event
  imitateSelect: false, //let select value show in trigger bar
  select: null, //set initial select value, when imitateSelect is set to true
  data: 'value',

  //callback comes with corresponding event
  onInit: null,
  onShow: null,
  onHide: null,
  onChange: null
}
```

## Methods
Methods are called on asDropdown instances through the asDropdown method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().asDropdown('destroy');

// or
var api = $().data('asDropdown');
api.destroy();
```

#### get()
Get the dropdown value.
```javascript
var val = $().asDropdown('get');
```

#### show()
Show the dropdown functions.
```javascript
$().asDropdown('show');
```

#### hide()
Hide the dropdown functions.
```javascript
$().asDropdown('hide');
```

#### enable()
Enable the dropdown functions.
```javascript
$().asDropdown('enable');
```

#### disable()
Disable the dropdown functions.
```javascript
$().asDropdown('disable');
```

#### destroy()
Destroy the dropdown instance.
```javascript
$().asDropdown('destroy');
```

## Events
`jquery-asDropdown` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('asDropdown::ready', function (e) {
  // on instance ready
});

```

Event   | Description
------- | -----------
init    | Fires when the instance is setup for the first time.
ready   | Fires when the instance is ready for API use.
enable  | Fired when the `enable` instance method has been called.
disable | Fired when the `disable` instance method has been called.
destroy | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.asDropdown.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-asDropdown.js"></script>
<script>
  $.asDropdown.noConflict();
  // Code that uses other plugin's "$().asDropdown" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-asDropdown` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-asDropdown` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-asDropdown/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-asDropdown.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-asDropdown/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-asDropdown.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-asDropdown
[license]: https://img.shields.io/npm/l/jquery-asDropdown.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-asDropdown.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-asDropdown