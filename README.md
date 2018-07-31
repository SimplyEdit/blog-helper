# SimplyEdit extensions
## A set of scripts that extend simplyedit with CMS functions

## blog.js
A small script to show the latest blog posts

## Requirements

This blog scripts works with [SimplyEdit](https://simplyedit.io) websites. It assumes all blog posts are available in the data.json, which is how most SimplyEdit websites work.
It also needs the [json-css](https://github.com/SimplyEdit/json-css) library.

## Usage

First you'll need a blog post page template. So in the /templates/ folder 
create a new file with the name 'blog.html'. You can choose a different 
name, just make sure to use that name instead of 'blog.html' in the
remainder of this readme.

Create the blog.html file just like normal, with all the data-simply-field
and data-simply-list stuff you need. Add the simply-edit.js script like
normal. But add the following custom settings:

```
<script>
    var seSettings = {
        'pageTemplate': {
            templates: [
                {name: 'Default', template: 'index.html'},
                {name: 'Blog post', template: 'blog.html'}
            ]
        }
    };
</script>
<script src="//cdn.simplyedit.io/1/simply-edit.js"
    data-simply-endpoint="/"
    data-simply-images="/img/"
    data-simply-files="/files"
    data-api-key="your-api-key"
    data-simply-settings="seSettings"
></script>
```

Now you can create a page and choose the 'Blog post' template.

Next edit the `index.html` template and add the following in a suitable
place:

```
<div data-simply-list="articles" data-simply-data="blog">
    <template>
        <article>
            <time>
                <span data-simply-field="date.day">08</span>
                <span data-simply-field="date.month">September</span>
                <span data-simply-field="date.year">2016</span>
            </time>
            <a href="#" data-simply-field="data-simply-path" data-simply-content="fixed">
                <h3 data-simply-field="title">title</h3>
            </a>
            <p data-simply-field="summary">summary</p>
        </article>    
    </template>
</div>
```

The `data-simply-data` attribute tells SimplyEdit to use a 'Datasource',
which is a fancy way of saying you've got a list of data from somewhere
other than the default `data.json`. 

You can then write your own code to load and save that data. In this case
you can use the blog.js script provided in this repository:


```
<script src="/js/json-css.js"></script>
<script src="/js/simply/blog.js"></script>
<script>
    simply.blog('blog', {
        'template': 'blog.html'
    });
</script>
```

The first parameter is the name of the `data-source`, in this case 'blog',
since that is the name after `data-simply-data`. The second parameter is a
list of options. One of them is the name of the template for a blog post.

The blog script searches through the entire website (the data.json
file) for pages with the template `blog.html`. Then it sorts those pages
based on the day/month/year fields in them. If no day is set, the page will
be added at the top of the list.

The blog script also makes sure that anything you edit/add in the
articles list, will also be saved back to the blog posts. So you can add
fields which are only visibile and used in the template for the list of
articles, but not in the blog post itself.

The blog articles will be sorted on the date by default. For this to work
you must use the `date.day`, `date.month` and `date.year` field names.

The default setup assumes the months are written in english, but you can
pass on a list of month names like this:

```
<script>
    simply.blog('blog', {
        'months': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep',
            'Oct','Nov','Dec']
    });
</script>
```

The order of the names must be the order of the months.

You can also write your own sorting routine:

```
<script>
    simply.blog('blog',{
        'sort': function(a,b) {
            return a.value['date']['timestamp'] < b.value['date']['timestamp'];
        }
    });
</script>
```

## datepicker.js

This script allows you to use a nice datepicker in the SimplyEdit editor. You 
can combine this with the blog.js script so that you get nice readable dates, while
making sure the dates entered are always valid.

The datepicker script uses the excellent flatpickr datepicker. If you haven't
included this yourself, it will automatically be included from the unpkg.com CDN.

You can include it like this:

```
<script src="/js/simply/datepicker.js"></script>
<script>
    simply.datePicker();
</script>
```

This will automatically add a datepicker to all input elements with the class name
'flatpickr'. But you can specify a different selector if you want, e.g:

```
    simply.datePicker('a.date');
```

To use the datePicker with the blog script, change your blog datasource template
to something like this:

```
<div data-simply-list="articles" data-simply-data="blog">
    <template>
        <article>
            <time class="flatpickr">
                <input class="flatpickr" type="text" data-simply-field="date">
                <span data-simply-field="date" data-simply-transformer="day">08</span>
                <span data-simply-field="date" data-simply-transformer="monthName">September</span>
                <span data-simply-field="date" data-simply-transformer="year">2016</span>
            </time>
            <a href="#" data-simply-field="data-simply-path" data-simply-content="fixed">
                <h3 data-simply-field="title">title</h3>
            </a>
            <p data-simply-field="summary">summary</p>
        </article>    
    </template>
</div>
```

And add the following CSS to your stylesheet:

```
time.flatpickr {
    position: relative;
}
time.flatpickr input.flatpickr {
    border: 0;
    color: transparent;
    background: transparent;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    margin: 0;
}
```

This CSS makes the flatpickr date input transparent and overlays it over
the human readable day, month and year spans. When you click on them, the
datepicker will open and upon change, the day, month and year will be
updated as well. 

The transformers will change the date value, which looks like this: '2017-11-05'
to the day, month, year or monthName when rendering.

You can change the month names, just like in the blog.js script, like this:

```
<script>
    simply.datepicker('input.fatpickr', {
        'months': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep',
            'Oct','Nov','Dec']
    });
</script>
```
