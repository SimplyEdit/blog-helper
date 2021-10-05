var simply = (function(simply) {

    simply.datePicker = function(selector, options) {
        
        function loadStyleSheet(url) {
            var s = document.createElement('link');
            s.rel = 'stylesheet';
            s.href= url;
            document.getElementsByTagName('head')[0].appendChild(s);
        }
        
        /* This method loads a scipt url and calls a callback when the script is loaded. */
        function loadScript(url, callback) {
            if (url) {
                var s = document.createElement('script');
                s.src = url;
                document.getElementsByTagName('head')[0].appendChild(s);
                var done = false;
                s.onload = s.onreadystatechange = function() {
                    if (!done && (!this.readyState || this.readyState==='loaded' || this.readyState==='complete') ) {
                        done = true;
                        callback(); 
                    }
                    s.onload = s.onreadystatechange = null;
                };
            } else if (callback) {
                // just in case the url for flatpickr is empty, e.g. when it was already loaded and so excluded in the config
                callback();
            }
        }

        function findURL() {
            var scripts = document.querySelectorAll('script[src]');
            for (var i=0; i<scripts.length; i++ ) {
                if ( scripts[i].src.match(/datepicker\.js/) ) {
                    return scripts[i].src;
                }
            }
            return '/js/datepicker.js';
        }

        /* This method tries to initialize a field with flatpickr, if available
           Otherwise it adds it to a list for later initialization
        */
        var fieldList = [];
        function addFlatpickr(field, options) {
            if (typeof flatpickr == 'undefined') {
                fieldList.push({field: field, options: options});
            } else {
                flatpickr(field, options);
            }
        }

        if (typeof selector == 'undefined' || !selector) {
            selector = 'input.flatpickr';
        }
        if (typeof options == 'undefined') {
            options = {};
        }
        if (typeof options.months == 'undefined') {
            options.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        }
        if (typeof options.source == 'undefined') {
            options.source = {
                'style'  : 'https://unpkg.com/flatpickr/dist/flatpickr.min.css',
                'script' : 'https://unpkg.com/flatpickr',
                'theme'  : 'https://unpkg.com/flatpickr/dist/themes/airbnb.css'
            };
        }
        if (options.source.style) {
            loadStyleSheet(options.source.style);
        }
        if (options.source.theme) {
            loadStyleSheet(options.source.theme);
        }
        var url = findURL().replace(/datepicker\.js/,'datepicker.css');
        loadStyleSheet(url);
    
        loadScript(options.source.script, function() {
            if (fieldList.length) {
                for ( var i=0; i<fieldList.length; i++) {
                    flatpickr(fieldList[i].field, fieldList[i].options);
                }
            }
        });

        if (!editor.transformers) {
            editor.transformers = {};
        }
        editor.transformers['day'] = {
            render: function(data) {
                if (data.value) {
                    data = data.value;
                }
                this.originalValue = data;
                if (!data) {
                    var date = new Date();
                } else {
                    var date = new Date(data);
                }
                return date.getUTCDate();
            },
            extract: function(data) {
                return this.originalValue;
            }
        };
        editor.transformers['month'] = {
            render: function(data) {
                if (data.value) {
                    data = data.value;
                }
                this.originalValue = data;
                if (!data) {
                    var date = new Date();
                } else {
                    var date = new Date(data);
                }
                return date.getUTCMonth()+1;
            },
            extract: function(data) {
                return this.originalValue;
            }
        };
        editor.transformers['monthName'] = {
            render: function(data) {
                if (data.value) {
                    data = data.value;
                }
                this.originalValue = data;
                if (!data) {
                    var date = new Date();
                } else {
                    var date = new Date(data);
                }
                return options.months[date.getUTCMonth()];
            },
            extract: function(data) {
                return this.originalValue;
            }
        };
        editor.transformers['year'] = {
            render: function(data) {
                if (data.value) {
                    data = data.value;
                }
                this.originalValue = data;
                if (!data) {
                    var date = new Date();
                } else {
                    var date = new Date(data);
                }
                return date.getUTCFullYear();
            },
            extract: function(data) {
                return this.originalValue;
            }
        };            

        editor.field.registerType(
            selector,
            null, 
            null, 
            function(field) { //makeEditable
                // registerType must be called immediately, before the content from data.json is loaded
                // but flatpickr is not yet loaded, so we can't initialize it yet, instead add this field
                // and options to a list for later initialization
                addFlatpickr(field, options);
            }
        );
    };

    return simply;

})(window.simply || {});