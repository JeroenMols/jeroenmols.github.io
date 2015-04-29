---
layout: blog/post
title: How I created my blog
published: true
img: img/blog/jekyll.png
---

## Preface
I've been toying with the idea for quite some time to created my own website to start blogging about the things I'm passionated about. After the regular postponing cycle of a couple of months I finally decided to setup a [portfolio](http://jeroenmols.github.io) and [blog](http://jeroen.mols.github.io/blog) using Github pages and Jekyll.

As an Andorid developer, creating websites is not my strongest skill, so I came across quite some challenges. Hence the subject of my very first blogpost was not hard to find. 

> Note that not all my solutions are great - I'm experienced enough to now at least that - but sometimes you can better just do it and then learn/improve as you go. 

## Why Jekyll
For my blog I actually only had a few requirements:

- Responsive website
- Easy to setup and maintain
- No lock-in: should be possible to migrate to other platform
- Support for pagination and comments

First thing I learned was the difference between a static (e.g Jekyll) and dynamic website (e.g Wordpress) via a [great presentation](http://nilclass.com/courses/what-is-a-static-website/) by [@plusjade](https://twitter.com/plusjade).  

Because static websites are generate before they are served, which makes them a lot faster. Also they are a lot easier to set up and you can simply install and run the generator on your local machine to test the end result before deploying online. Finally, you can write all of your blogposts conveniently in Markdown and versioning via Git is a breeze. (My colleague [@inferis](https://twitter.com/inferis) even gets spelling corrections via Pull request!)

As Github pages natively supports Jekyll (and pushes for it), I didn't really spent much time on choosing which [static site generator](https://staticsitegenerators.net/) to use.

## Setting up
Installing Jekyll was really a breeze, I just had to run `gem install Jekyll` and then I could build my website `jekyll build` or serve it for preview `jekyll serve`.

> Note that both commands will generate your website in the `_site` folder, which you shouldn't add to your Git.

Instead of making a new Jekyll site, I decided to fork two existing themes:

- a very clean two column theme for my Blog: [Hyde](http://hyde.getpoole.com/)
- a realy cool theme for my Portfolio: [Freelancer](http://startbootstrap.com/template-overviews/freelancer/)

Both themes offer quite some predefined customization options via the `_config.yml` file, but for advanced theming you can also direcly edit the CSS files.

## Merging two Jekyll themes
Where I originally only wanted to have a blog, the Freelancer theme was just too cool to ignore. Hence I would need to figure out how two merge both themes.

It seemed most convenient to have my portfolio under my main url and to include my blog under a subfolder. (i.e `jeroenmols.github.io/blog`) This can be done by mergin the blog theme into the portfolio (main) theme: 

- Add a subfolder `blog/` with the `index.html` of my blog.

- Move all my portfolio posts and blog posts into separate folders:
	- all portfolio posts went into `portfolio/_posts`
	- all blog posts went into `blog/_posts`

	This allows to easily loop through all portfolio or blog posts separately: 
	
	- `{{ "{% for post in site.categories.portfolio " }}%}`
	- `{{ "{% for post in site.categories.blog " }}%}`

- Move all files `_layouts` and `_includes` from my blog into the corresponding folders of my portfolio theme.
	- Optionally you can move files into subfolders to keep things clean (`_includes/blog`), as long as you also update all references to these files. (in `_layouts/blog.html` I now refer to my includes as `blog/<original name>`)
	- Same holds true if you have naming conflicts (for instance two post layouts with the same name), you can just rename one and update all references in all files using it.
	
- Move all other folders and files into the root of the main theme
- Merge the configurations from both `_config.yml` files
	- Again you can rename conflicting configurations (or merge duplicate ones) if you update all references.

- Fix all references to not found images/css/... files in the blog theme. This is necessary because the original theme was assuming to run in the root directory, and now we moved it to a subdirectory `blog`.
	- I found that the best way to do this is to use `jekyll build` and have a look at the generated output in the `_site` directory. From this you can learn what goes wrong and fix it.

After this I could run ` Jekyll serve` and everything was working flawlessly!

...

Wait...

...

Why are my portfolio posts also showing up in my blog?

...

Damn you Jekyll! 

Turns out Jekyll does not support paginating categories and hence it will lump all posts it can find together, in my case both portfolio (unwanted) and blog (wanted). Even more, there is no plugin to add this functionality either! Pretty weird, and a huge limitation if you ask me.

So I did what every self respecting programmer would do, pray to the Stackoverflow and Github gods. And my prayers where answered by a code snippet of [benxtan](https://github.com/benxtan), which I found in an issue tracker of a very old [Jekyll pagination plugin](https://github.com/Painted-Fox/jekyll-category-pagination/issues/6). To enable this plugin, simply create a `_plugins` folder and copy the code snippit into a `category_pagination.rb` file.

>Note that the former plugin was no longer working, because it was referring to classes that were renamed/moved classes in newer Jekyll versions.

## Github and Jekyll plugins
My new shiny portfolio and blog were working flawlessly locally, but when I pushed it to Github, the pagination again included both blog and portfolio posts. Turns out that Github doesn't allow you to run custom Jekyll plugins except for a few that they have whitelisted:

>**[Plugins on GitHub Pages](http://jekyllrb.com/docs/plugins/)**
>
>GitHub Pages is powered by Jekyll. However, all Pages sites are generated using the --safe option to disable custom plugins for security reasons. Unfortunately, this means your plugins won’t work if you’re deploying to GitHub Pages.

At this point, I am/was completely stuck, because even if Jekyll would add support for category pagination, I would still need to wait for Github to update their Jekyll version.

Only option still remaining was to directly push the generated `_site` directory into my repository and to disable the Jekyll generator on Github pages. 

>Note that this is a really suboptimal solution, because this effectively means frequently pushing a high amount of auto generated files to your repo. So if anyone has a better suggestion to solve the pagination issue, please let me know!

To make this work, there are a couple of things you need to do:

- Disable Jekyll on Github pages by pushing an empty file with name `.nojekyll` to the root of your repo
- Move all auto generated content from the `_site` folder into the root of your repository, so that its `index.html` is displayed when someone browses to your main page.

This actually by itself imposes a new problem, namely where to put your Jekyll source code? I solved this by:

- move all source files to a subfolder `jekyll-source` in my main repository
- generating all static pages into `jekyll-source/_site` using `jekyll build`
- removing all files and folders from my root directory, except for the `jekyll-source` directory
- copying the entire content of `jekyll-source/_site` into my root folder

I know this is not a super solution, but it gets the job done, and I was able to automate all of this in a [release script](https://github.com/JeroenMols/jeroenmols.github.io/blob/master/jekyll-code/release) that you can run by calling `.release` from the `jekyll-source` folder.

>Note that I considered two other options:
>
>- Use a `CNAME` file to redirect my main url into a subfolder. This does not work, as the `CNAME` file can only be used for top level domains.
>- Use a placeholder `index.html` which redirect the main url into a subfolder.
>
>I didn't use any of those mechanisms as that would unnecessarily complicate my website url.


## Protips
If you really want to make your site look spectacular:

- Site icon: add the following to the head of your `index.html` page:
`<link rel="favicon-144-precomposed" sizes="144x144" href="<link_to_your_icon>">`

- Site toolbar/statusbar color on Android: add the following to the head of your `index.html` page: `<meta name="theme-color" content="<your_color_hex>">`


## Conclusion
I'm glad that I finally got my portfolio and blog up and running. My current solution might not be the best one in the world, but it is automated, maintainable and I can easily add blog posts in the future. Don't hesitate to look at my Github repo for the full source code. Hopefully the code and my post can help other to setup the same for him/her in the future.

Would I use Jekyll again if I would start over? Probably yes. 

The only real limitation I really encountered was due to the paginator combining the posts from both my portfolio and blog, which caused me to disable Jekyll completely and push the generated site directly to Github pages. While this really sucked, using another static site generator would have also forced me to do this (because Github only supports Jekyll). Furthermore my use case was already quite extreme (combining two themes) and if you stick to just one theme Jekyll is actually very convenient to use.