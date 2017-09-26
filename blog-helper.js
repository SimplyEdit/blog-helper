function loadBlog(name, options) {
    if (!options.template) {
        options.template = 'blog.html';
    }
	if (!options.months) {
		options.months = ['January', 'February', 'March', 'April', 'May',
			'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	}
    if (!options.sort) {
        options.sort = function(a,b) {
            if (a.value['year']==b.value['year']) {
                if (a.value['month']==b.value['month']) {
                    return ( parseInt(a.value['day']) < parseInt(b.value['day']));
                }
                return (options.months.indexOf(a.value['month']) < options.months.indexOf(b.value['month']));
            }
            return (parseInt(a.value['year']) < parseInt(b.value['year']));
        }
    }
    editor.addDataSource(name, {
        load: function(list,callback) {
            index = jsonCSS.init(editor.currentData);
            var list = index.query('search > *', 'data-simply-page-template content[value="'+options.template+'"]')
                .sort(options.sort);
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
}