var simply = (function(simply) {

	simply.blog = function(name, options) {
        if (!options.template) {
            options.template = 'blog.html';
        }
        if (!options.months) {
            options.months = ['January', 'February', 'March', 'April', 'May',
                'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        }
        if (!options.sort) {
            options.sort = function(a,b) {
				if (typeof a.value['date']['value'] != 'undefined') {
					return (a.value['date']['value'] < b.value['date']['value']);
                } else if (a.value['date']['year']==b.value['date']['year']) {
                    if (a.value['date']['month']==b.value['date']['month']) {
                        return ( parseInt(a.value['date']['day']) < parseInt(b.value['date']['day']));
                    }
                    return (options.months.indexOf(a.value['date']['month']) < options.months.indexOf(b.value['date']['month']));
                }
                return (parseInt(a.value['date']['year']) < parseInt(b.value['date']['year']));
            }
        }
		if (!options.max) {
			options.max = 10;
		}
		if (!options.offset) {
			options.offset = 0;
		}
        editor.addDataSource(name, {
            load: function(list,callback) {
                index = jsonCSS.init(editor.currentData);
                var list = index.query('search > *', 'data-simply-page-template content[value="'+options.template+'"]')
                    .sort(options.sort)
					.slice(options.offset, options.offset+options.max);
                var result = [];
                for ( var i=0,l=list.length; i<l; i++) {
                    list[i].value['data-simply-path'] = list[i].key;   
                    result.push(list[i].value);
                }
                callback(result);
            },
            get: function() {
                // return an empty array to store in the data.json
                return []
            },
            save: function(stash) {
                // this is called before the data.json is saved, so we
                // can update the editor.currentData here to save
                // changes. The datasource itself will not be saved
                for (var i=0,l=stash.data.length; i<l; i++) {
                    for ( var key in stash.data[i] ) {
                        if (key!='data-simply-path') {
                            editor.currentData[stash.data[i]['data-simply-path']][key] = stash.data[i][key];
                        }
                    }
                }
                editor.data.stash();
            },
            applyOnce: true
        });
    };
})(window.simply || {});

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
	
		loadScript(options.source.script, function() {
			if (fieldList.length) {
				for ( var i=0; i<fieldList.length; i++) {
					flatpickr(fieldList[i].field, fieldList[i].options);
				}
			}
		});

		editor.field.registerType(
			selector,
			function(field) { // getter
				var date = new Date(field.value);
				return {
					value: field.value,
					day: date.getUTCDate(),
					month: date.getUTCMonth()+1,
					year: date.getUTCFullYear(),
					monthName: options.months[date.getMonth()]
				};
			},
			function(field, data) { //setter
				if (typeof data.value != 'undefined' && field.value!=data.value) {
					field.value = data.value;
					return;
				}
				//ignore other fields, as the date picker is the way to change the values
			},
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