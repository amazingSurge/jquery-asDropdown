# jQuery asDropdown

The powerful jQuery plugin that creates a custom asDropdown. <a href="http://amazingsurge.github.io/jquery-asDropdown/">Project page and demos</a><br />
Download: <a href="https://github.com/amazingSurge/jquery-asDropdown/archive/master.zip">jquery-asDropdown-master.zip</a>

***

## Features

* **Extremely fast**
* **Option group support**
* **Javascript only 4KB compressed**
* **Lightweight size** — 1 kb gzipped

## Dependencies
* <a href="http://jquery.com/" target="_blank">jQuery 1.83+</a>

## Usage

Import this libraries:
* jQuery
* jquery-asDropdown.min.js

And CSS:
* jquery-asDropdown.css - desirable if you have not yet connected one


Create base html element:
```html
<select class="custom-select">
    <option value="a">beijing</option>
    <option value="b">fujian</option>
    <option value="c">zhejiang</option>
    <option value="d">tianjin</option>
    <option value="e">shanghai</option>
</select>
```

Initialize asDropdown:
```javascript
$('.custom-asDropdown').asDropdown({skin: 'simple'});
```

Or initialize asDropdown with custom settings:
```javascript
$(".custom-asDropdown").asDropdown({
        namespace: 'asDropdown',
        skin: 'simple',
        trigger: 'click', // 'hover' or 'click'
        value: 'a',
        offset: [0, 0],
        status: {
            a: 'beijing',
            b: 'fujian',
            c: 'zhejiang'
        },
        onChange: function() {}
});
```



## Settings

```javascript
    //Optional property,set a namspace for css class, for example, we have <code>.select_active
    //</code> class for active effect, if namespace set to 'as-select', then it will be <code>.
    //as-select_active</code>
    namespace: '.select',

    //Optional property, set transition effect, it works after you load specified skin file
    skin: 'simple',

    //Optional property, the way to active select, optioal 'hover
    trigger: 'click',

    //Optional property, set the value of bar that element have no option when select initilized
    value: 'a',

    //Optional property, set the offset between bar and comment
    offset: [0,0]

    //Optional property, set the status of elements,for example 
    //<code>a:beijing</code> means the element's value is 'a',
    //the text is 'beijing'
    status: {
         a: 'beijing',
         b: 'fujian',
         c: 'zhejiang'
    },

    //callback when element is seted refresh
    Onchange: function(){}
```

## Public methods

jquery select has different methods , we can use it as below :
```javascript
// show comment
$(".custom-select").select("show");

// hide comment
$(".custom-select").select("hide");

// set element's status
$(".custom-select").select("set");

// get option's value
$(".custom-select").select("get");

// bar enable be actived
$(".custom-select").select("enable");

// bar can't be actived 
$(".custom-select").select("disable");

// remove all event
$(".custom-select").select("destroy");
```

## Event / Callback

* <code>change</code>: trigger when select chage

how to use event:
```javascript
$(document).on('change', function(event,instance) {
    // instance means current select instance 
    // some stuff
});
```

## Browser support
jquery-select is verified to work in Internet Explorer 7+, Firefox 2+, Opera 9+, Google Chrome and Safari browsers. Should also work in many others.

Mobile browsers (like Opera mini, Chrome mobile, Safari mobile, Android browser and others) is coming soon.

## Changes

| Version | Notes                                                            |
|---------|------------------------------------------------------------------|
|     ... | ...                                                              |

## Author
[amazingSurge](http://amazingSurge.com)

## License
jQuery-select plugin is released under the <a href="https://github.com/amazingSurge/jquery-select/blob/master/LICENCE.GPL" target="_blank">GPL licence</a>.


