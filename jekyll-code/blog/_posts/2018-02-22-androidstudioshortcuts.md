---
title: Pro Android Studio - Code navigation
published: true
header:
  teaser: img/blog/androidstudioshortcuts/androidstudioshortcuts.jpg
  imgcredit: Photo by Manki Kim on Unsplash, https://unsplash.com/photos/BtHjHxh-D7I, cropped
tags:
  - androidstudio
  - tools
  - shortcuts
---
Struggling to navigate your code? Getting lost in deep inheritance hierarchies? Hard time figuring out relations between classes? Let's learn how to navigate code in Android Studio like a pro.

Being a skilled Android developer means getting the most out of the tools at your disposal. While there are plenty resources listing shortcuts, it's often hard to make sense and master those.

Therefore this series aims to be a practical guide with clear examples on how to better navigate and refactor code. It will effectively cover how I personally use Android Studio.

>
This post is part of a series with practical examples on how you to get the most out of Android Studio:
- [Part 1: Code navigation]({{ site.baseurl }}{% link blog/_posts/2018-02-22-androidstudioshortcuts.md %})
- [Part 2: Refactoring]({{ site.baseurl }}{% link blog/_posts/2018-04-26-androidstudioshortcuts2.md %})


## TL;DR
I strongly suggest you look at the examples below, but a quick reference is always useful.

* `⌘ + O`: find class
* `⌘ + ⌥ + O`: find symbol
* `⌘ + ⇧ + O`: find file
* `⇧ + ⌘ + T`: go to/from test

* `⌘ + ⌥ + F7`: show usages
* `⌘ + U`: jump to superclass/defining method
* `⌘ + ⌥ + B`: jump to subclass/overridden method
* `^ + H`: show class hierarchy

* `⌘ + F12`: show methods
* `⌘ + B`: go to declaration
* `F2`: next error/warning
* `⇧ + F2`: previous error/warning
* `⌘ + L`: go to line

* `⌘ + E`: show recent files
* `⌘ + [`: to previous code position
* `⌘ + ]`: to next code position
* `⌘ + ⇧ + backspace`: to last code edit


Windows equivalents can be found [here](https://developer.android.com/studio/intro/keyboard-shortcuts.html).

## Opening classes and files
Better than search everywhere is telling Android Studio what you are looking for:

* `⌘ + O`: a class
* `⌘ + ⌥ + O`: a symbol
* `⌘ + ⇧ + O`: a file

This makes search a lot faster and returns fewer, more relevant results!

Searched for classes but needed a file? Just hit `⌘ + ⇧ + O` while open to dynamically swap between modes. You can even use [Camel Casing](https://en.wikipedia.org/wiki/Camel_case) to quickly find `AlbumActivityTest` by typing `AlAT` or directly jump to a line number by adding `:`.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts/openclassandfiles.gif"
       alt="Open classes, symbols or files"/>
  <figcaption>Open classes, symbols or files</figcaption>
</figure>

Already found the class you were looking for, but quickly want to go to the test? Go to the class declaration and use `⇧ + ⌘ + T`. It even suggests to create a new test and also works from the test.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts/navigatetest.gif"
       alt="Navigate between test and class with ⌘ + T"/>
  <figcaption>Navigate between test and class with ⌘ + T</figcaption>
</figure>

## Relationships between classes
If you want to figure out where a class is being used? `⌘ + ⌥ + F7` shows it in a handy pop over. Note that you can show the same info in the find tab using `⌘ + F7` for a more static view.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts/classusages.gif"
       alt="Show class usages with ⌘ + ⌥ + F7"/>
  <figcaption>Show class usages with ⌘ + ⌥ + F7</figcaption>
</figure>

Inheritance hierarchies are typically easy to get lost in.

Did you know you can use `⌘ + U` to jump to the super class or `⌘ + ⌥ + B` to go to a sub class? It even works for method overrides!

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts/supersubclass.gif"
       alt="Navigate between super- and subclasses"/>
  <figcaption>Navigate between super- and subclasses</figcaption>
</figure>

Finally, `^ + H` dumps out the entire class hierarchy in a handy overview.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts/classhierarchy.png"
       alt="Show class hierarchy with ^ + H"/>
  <figcaption>Show class hierarchy with ^ + H</figcaption>
</figure>

## Structure of classes
Use `⌘ + F12` to show all methods and properties of a class. Like any other view in Android Studio, even this one is searchable.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts/showmethods.gif"
       alt="Show class methods and properties with ⌘ + F12"/>
  <figcaption>Show class methods and properties with ⌘ + F12</figcaption>
</figure>

Come across a member in code? With `⌘ + B` you can immediately jump to where it is defined. Tapping `⌘ + B` a second time shows you where it is used.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts/gotodeclaration.gif"
       alt="Analyze class usages with ⌘ + ⌥ + F7"/>
  <figcaption>Go to declaration and show usages with ⌘ + B</figcaption>
</figure>

Be it a failing build due to multiple errors, or you scroll away from broken code under development. Compilation errors are common and can be hard to navigate to.

Using `F2` and `⇧ + F2`, however, will let you jump back and forth between all errors in a file. If there are none, those keys will do the same for all warnings.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts/nexterror.gif"
       alt="Navigate between errors/warnings in a file"/>
  <figcaption>Navigate between errors/warnings in a file</figcaption>
</figure>

Know the exact line number? Then `⌘ + L` is the shortcut for you.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts/gotoline.gif"
       alt="Go to a specific line in a file with ⌘ + L"/>
  <figcaption>Go to a specific line in a file with ⌘ + L</figcaption>
</figure>

## History
With all these new code navigation superpowers, there is one critical element missing: how do you find your way back to where you started?

One of the well-known options is to use `⌘ + E` to list your recently opened files.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts/recentnavigation.gif"
       alt="List recently opened files with ⌘ + E"/>
  <figcaption>List recently opened files with ⌘ + E</figcaption>
</figure>

However, when clicking through code you can also use `⌘ + [` and `⌘ + ]` to take a step back or forth respectively.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts/previousnextnavigation.gif"
       alt="Navigate between previous visited code"/>
  <figcaption>Navigate between previous visited code</figcaption>
</figure>

And finally, if you just want to continue coding where you left off, use `⌘ + ⇧ + backspace` to jump to where you made the last code edit.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts/previousedit.gif"
       alt="Navigate to the last edited code with ⌘ + ⇧ + backspace"/>
  <figcaption>Navigate to the last edited code with ⌘ + ⇧ + backspace</figcaption>
</figure>

## Wrap up
This was part one of my series to get the most out of Android Studio, feel free to continue reading [the second part]({{ site.baseurl }}{% link blog/_posts/2018-04-26-androidstudioshortcuts2.md %}).

If you've made it this far you should probably follow me on {% include link_twitter.html %}.

Special thanks to Antonio Leiva, all gifs are made with code from his open source project [Bandhook](https://github.com/antoniolg/Bandhook-Kotlin).
