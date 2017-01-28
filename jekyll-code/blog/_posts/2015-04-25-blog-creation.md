---
layout: post
title: How I created my blog
published: true
comments: true
img: img/blog/jekyll.png
imgcredit: Image by Jekyll, https://choosealicense.com/licenses/cc-by-4.0/, cropped
---
For quite some months, I've been planning to create a website and start blogging about the things I'm passionate about. Last week, I finally decided to setup a [portfolio](http://jeroenmols.github.io) and [blog](http://jeroen.mols.github.io/blog) using GitHub pages and Jekyll.

Since I'm an Android and not a web developer, the first blogging subject wasn't hard to find: challenges I came across in setting up this website and blog.

> **Disclaimer:** Eventually I had to use a workaround - that's why I don't build websites professionally - but I strongly believe in a *Just do It* mentality and then learn/improve as you go.

## Why Jekyll
Keeping it simple, I only had few requirements for my blog:

- Responsive website
- Easy to setup and maintain
- No lock-in: able to migrate to other platforms
- Support for pagination and comments

First thing I learned was the difference between a static (e.g. Jekyll) and dynamic website (e.g. Wordpress) via a [great presentation](http://nilclass.com/courses/what-is-a-static-website/) by [@plusjade](https://twitter.com/plusjade).

The main advantage of static websites is their loading speed because all pages are generated before they are served. Installing the generator on your local machine is simple, making it easy to test your site before deploying online. Posts are written in Markdown, so no HTML clutter nor extra tools needed. Just a text generator and Git to conveniently version all changes.

>**Protip:** One of my colleagues [@inferis](https://twitter.com/inferis) even gets spelling corrections via Pull request!

As GitHub pages natively supports Jekyll, I didn't really spent much time on choosing which [static site generator](https://staticsitegenerators.net/) to use.

## Setting up
Installing Jekyll was really a breeze, I just had to run `gem install Jekyll` and then I could build my website using `jekyll build` or test it locally using `jekyll serve`.

> **Note:** both commands will generate your website in the `_site` folder, which you shouldn't add to version control!

Instead of making a new Jekyll site, I decided to fork two existing themes:

- [Hyde](http://hyde.getpoole.com/): a clean two-column theme for my Blog
- [Freelancer](http://startbootstrap.com/template-overviews/freelancer/): to have a cool portfolio

Both themes offer quite some predefined customization options via the `_config.yml` file, but for advanced theming you can also directly edit the CSS files.

## Merging two Jekyll themes
Where I originally only wanted to have a blog, the Freelancer theme was just too cool to ignore. Consequently merging two themes was one of the first things I had to do.

It seemed most convenient to have my portfolio under my main url and to include my blog under a subfolder (i.e. `jeroenmols.github.io/blog`).

To do this I merged the blog theme into the portfolio (main) theme:

- Add a subfolder `blog/` with the `index.html` of my blog.

- Move all my portfolio posts and blog posts into separate folders:
	- all portfolio posts went into `portfolio/_posts`
	- all blog posts went into `blog/_posts`

	This allows to easily loop through all portfolio or blog posts separately:

	- `{{ "{% for post in site.categories.portfolio " }}%}`
	- `{{ "{% for post in site.categories.blog " }}%}`

- Move all files in `_layouts` and `_includes` from my blog into the corresponding folders of my portfolio theme.
	- Optionally you can move files into subfolders to keep things clean (`_includes/blog`), as long as you also update all references to these files. (in `_layouts/blog.html` I now refer to my includes as `blog/<original name>`)
	- Same holds true if you have naming conflicts (for instance two layouts with the same name), you can just rename one and update all references in all files using it.

- Move all other folders and files into the root of the main theme

- Merge the configurations from both `_config.yml` files
	- Again you can rename conflicting configurations (or merge duplicate ones) if you update all references.

- Fix all references to not found images/css/... files in the blog theme. This is necessary because the original theme was assuming to run in the root directory, and now we moved it to a subdirectory `blog/`.
	- I found that the best way to do this is to run `jekyll build` and have a look at the generated output in the `_site` directory. From this you can learn what's wrong and fix it.

After this I could run `Jekyll serve` and everything worked flawlessly!

...

Wait...

...

Why are my portfolio posts also showing up in my blog?

...

Damn you Jekyll!

Turns out Jekyll does not support paginating categories and hence it will lump all posts it finds together, in my case both portfolio (unwanted) and blog (wanted). Even more, there is no plugin to add this functionality either! Pretty weird, and a huge limitation if you ask me.

So I did what every self-respecting programmer would do: pray to the Stackoverflow and GitHub gods. And my prayers where answered by a code snippet of [benxtan](https://github.com/benxtan), which I found in an issue tracker of a very old [Jekyll pagination plugin](https://github.com/Painted-Fox/jekyll-category-pagination/issues/6). To enable this plugin, simply create a `_plugins` folder and copy the code snippet into a `category_pagination.rb` file.

>**Note**: the former plugin was no longer working, because it was referring to classes that were renamed/moved classes in newer Jekyll versions.

## GitHub and Jekyll plugins
My new shiny portfolio and blog were working locally, but when I pushed it to GitHub, the pagination again included both blog and portfolio posts. Turns out that GitHub doesn't allow you to run custom Jekyll plugins except for a few that they have whitelisted.

>**[Plugins on GitHub Pages](http://jekyllrb.com/docs/plugins/)**
>
>GitHub Pages is powered by Jekyll. However, all Pages sites are generated using the --safe option to disable custom plugins for security reasons. Unfortunately, this means your plugins won’t work if you’re deploying to GitHub Pages.

At this point, I am/was completely stuck, because even if Jekyll would add support for category pagination, I would still need to wait for GitHub to update their Jekyll version.

Only option remaining was to directly push the generated `_site` directory into my repository and to disable the Jekyll generator on GitHub pages.

>Note that this is a really suboptimal solution, because this effectively means pushing a high amount of auto-generated files to your repo, frequently. So if anyone has a better suggestion to solve the pagination issue, please let me know!

To make this work, there are a couple of things you need to do:

- Disable Jekyll on GitHub pages by pushing an empty file with name `.nojekyll` to the root of your repo

- Move all auto generated content from the `_site` folder into the root of your repository, so that its `index.html` is displayed when someone browses to your main page.

This actually by itself imposes a new problem, namely where to put your Jekyll source code? I solved this by:

- move all source files to a subfolder `jekyll-source` in my main repository

- generating all static pages into `jekyll-source/_site` using `jekyll build`

- removing all files and folders from my root directory, except for the `jekyll-source` directory

- copying the entire content of `jekyll-source/_site` into my root folder

I know this is not a great solution, but it gets the job done, and I was able to automate all of this in a [release script](https://github.com/JeroenMols/jeroenmols.github.io/blob/master/jekyll-code/release) that you can run by calling `.release` from the `jekyll-source` folder.

>**Note**: I also considered two other options:
>
>- Use a `CNAME` file to redirect my main url into a subfolder. This does not work, as the `CNAME` file can only be used for top-level domains.
>- Use a placeholder `index.html` which redirect the main url into a subfolder.
>
>I didn't use any of those mechanisms as that would unnecessarily complicate my website url.


## Protips
If you really want to make your site look spectacular:

- Site icon: add the following to the head of your `index.html` page:
`<link rel="favicon-144-precomposed" sizes="144x144" href="<link_to_your_icon>">`

- Site toolbar/status bar color on Android: add the following to the head of your `index.html` page: `<meta name="theme-color" content="<your_color_hex>">`


## Conclusion
I'm glad that I finally got my portfolio and blog up and running. My current solution might not be the best one in the world, but it is automated, maintainable and I can easily add blog posts in the future. Don't hesitate to look at my [GitHub repo](https://github.com/JeroenMols/jeroenmols.github.io) for the full source code. Hopefully the code and my post can help others to setup the same in the future.

Would I use Jekyll again if I would start over? Probably yes.

The only real limitation I ran into was due to the paginator combining the posts from both my portfolio and blog. This caused me to disable Jekyll completely and push the generated site directly to GitHub pages. While this really sucked, using another static site generator would also have forced me to do this (because GitHub only supports Jekyll). Furthermore combining two themes is already quite advanced, and if you stick to just one theme Jekyll is actually very convenient to use.
