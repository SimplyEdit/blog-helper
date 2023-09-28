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
                if (typeof a.value['date'] == 'undefined'||typeof b.value['date']=='undefined') {
                    return 0;
                }
                if (typeof a.value['date'] === 'string' && typeof b.value['date'] === 'string') {
                    a = Date.parse(a.value['date']);
                    b = Date.parse(b.value['date']);
                    return a<b;
                } else if (typeof a.value['date']['value'] != 'undefined') {
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
                var list = index.query('search > *', 'data-simply-page-template content[value="'+options.template+'"], data-simply-page-template[value="'+options.template+'"]')
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
				let documentPath = editor.data.getDataPath(document);
                for (var i=0,l=stash.data.length; i<l; i++) {
					let path = stash.data[i]['data-simply-path'];
					if (path == documentPath) {
						continue;
					}
                    for ( var key in stash.data[i] ) {
                        if (key!='data-simply-path') {
                            editor.currentData[path][key] = stash.data[i][key];
                        }
                    }
                }
                editor.data.stash();
            }
        });
    };

    return simply;

})(window.simply || {});
