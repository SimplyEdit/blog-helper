# blog-helper
A small script to show the latest blog posts

## Requirements

This blog scripts works with [SimplyEdit](https://simplyedit.io) websites. It assumes all blog posts are available in the data.json, which is how most SimplyEdit websites work.
It also needs the json-css library.

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
				<span data-simply-field="day">08</span>
				<span data-simply-field="month">September</span>
				<span data-simply-field="year">2016</span>
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
you can use the blog-helper.js script provided in this repository:


```
<script src="/js/json-css.js"></script>
<script src="/js/blog-helper.js"></script>
<script>
	loadBlog('blog', {
		'template': 'blog.html'
	});
</script>
```

The first parameter is the name of the `data-source`, in this case 'blog',
since that is the name after `data-simply-data`. The second parameter is a
list of options. One of them is the name of the template for a blog post.

The blog-helper script search through the entire website (the data.json
file) for pages with the template `blog.html`. Then it sorts those pages
based on the day/month/year fields in them. If no day is set, the page will
be added at the top of the list.

The blog-helper script also makes sure that anything you edit/add in the
articles list, will also be saved back to the blog posts. So you can add
fields which are only visibile and used in the template for the list of
articles, but not in the blog post itself.

The default setup assumes the months are written in english, but you can
pass on a list of month names like this:

```
<script>
	loadBlog('blog', {
		'months': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep',
			'Oct','Nov','Dec']
	});
</script>
```

The order of the names must be the order of the months.

You can also write your own sorting routine:

```
<script>
	loadBlog('blog',{
		'sort': function(a,b) {
			return a.value['timestamp'] < b.value['timestamp'];
		}
	});
</script>
```

# Advanced options

There is nothing to stop an editor from making a typo in the name of the
month. But you can force the month names by using a select input:

```
<div data-simply-list="articles" data-simply-data="blog">
	<template>
		<article>
	 		<time>
				<span data-simply-field="day">08</span>
				<span data-simply-field="month" data-simply-hidden>September</span>
				<select class="blog-edit-month" data-simply-field="month" data-simply-content="fixed">
					<option>January</option>
					<option>February</option>
					<option>March</option>
					<option>April</option>
					<option>May</option>
					<option>June</option>
					<option>July</option>
					<option>August</option>
					<option>September</option>
					<option>October</option>
					<option>November</option>
					<option>December</option>
				</select>
				<span data-simply-field="year">2016</span>
			</time>
   			<a href="#" data-simply-field="data-simply-path" data-simply-content="fixed">
   				<h3 data-simply-field="title">title</h3>
			</a>
			<p data-simply-field="summary">summary</p>
		</article>	
	</template>
</div>
```

Now you probably want to hide the select input when not in edit mode, so 
add this to your stylesheet:

```
.blog-edit-month {
	display: none;
}
body[data-simply-edit] .blog-edit-month {
	display: block;
}
```

