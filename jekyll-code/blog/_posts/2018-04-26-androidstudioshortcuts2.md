---
title: Pro Android Studio - Refactoring
published: true
header:
  teaser: img/blog/androidstudioshortcuts2/androidstudioshortcuts2.jpg
  imgcredit: Photo by Ant Rozetsky on Unsplash, https://unsplash.com/photos/io7dX_1EFCg, cropped
tags:
  - androidstudio
  - tools
  - shortcuts
---
Refactoring can be tedious and easily introduce bugs. The main reason for this is the number of manual steps involved: rename, move, copy-paste,... So wouldn't it make sense to automate this and have Android Studio do all the work for you?

This post will zoom in on the most useful refactoring options of Android Studio. Enabling you to refactor more confidently, introduce fewer bugs and increase overall quality as also variables, documentation, etc. will be updated.

>
This post is part of a series with practical examples on how you to get the most out of Android Studio:
- [Part 1: Code navigation]({{ site.baseurl }}{% link blog/_posts/2018-02-22-androidstudioshortcuts.md %})
- [Part 2: Refactoring]({{ site.baseurl }}{% link blog/_posts/2018-04-26-androidstudioshortcuts2.md %})


## TL;DR
I strongly suggest you look at the examples below, but a quick reference is always useful.

* `⌘ + D`: duplicate line
* `⌘ + backspace`: delete line
* `⌘ + ↑`: move line up
* `⌘ + ↓`: move line down
* `⇧ + ⌘ + ↑`: move method up
* `⇧ + ⌘ + ↓`: move method down

* `⇧ + F6`: rename
* `⌘ + F6`: change method signature
* `F6`: move

* `⌥ + ⌘ + V`: extract variable
* `⌥ + ⌘ + M`: extract method
* `⌥ + ⌘ + P`: extract method parameter
* `⌥ + ⌘ + F`: extract property (or field)
* `⌥ + ⌘ + C`: extract constant (java only)
* `⌥ + ⌘ + N`: inline
* `^ + T`: open refactoring menu

* `⌥ + enter`: quick fix

Windows equivalents can be found [here](https://developer.android.com/studio/intro/keyboard-shortcuts.html).


## Code manipulation
In order to speed up development, you want to reduce the amount of typing to a minimum. While autocomplete definitely helps, sometimes it's faster to directly manipulate lines:

* `⌘ + D`: duplicate line
* `⌘ + backspace`: delete line

These shortcuts will work regardless of the cursor position in the line.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/duplicatedelete.gif"
       alt="Duplicate and delete lines"/>
  <figcaption>Duplicate and delete lines</figcaption>
</figure>

After duplicating you can simply move code up/down by using `⌘ + ↑` and `⌘ + ↓` for lines, or `⇧ + ⌘ + ↑` and `⇧ + ⌘ + ↓` for methods.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/movelineblock.gif"
       alt="Move lines and methods up/down"/>
  <figcaption>Move lines and methods up/down</figcaption>
</figure>

Both combined provide a powerful way of extending code: you duplicate a line, edit it and move it to its location.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/editlines.gif"
       alt="Quick edit lines via duplicate and move"/>
  <figcaption>Quick edit lines via duplicate and move</figcaption>
</figure>


## Rename, update and move
Renaming classes is very involved: rename class definition, rename the file and update all references and documentation. Fortunately `⇧ + F6` does all of that for you.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/renameclass.gif"
       alt="Rename anything with ⇧ + F6"/>
  <figcaption>Rename anything with ⇧ + F6</figcaption>
</figure>

This doesn't just work for classes, but also for methods, variables, fields,...

Similarly `⌘ + F6` allows you to update the signature of a method. This is especially useful to add, remove or reorder new parameters to the method definition.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/changesignature.gif"
       alt="Change method signature with ⌘ + F6"/>
  <figcaption>Change method signature with ⌘ + F6</figcaption>
</figure>

Note how you can specify a default value so all existing method consumers will be updated by Android Studio! Use `⌘ + ↑` and `⌘ + ↓` to quickly reorder parameters.

Finally, you can move classes to their own file or to another package using `F6`. This works for all top-level declarations and Java static methods/constants.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/moveclass.gif"
       alt="Move classes with F6"/>
  <figcaption>Move classes with F6</figcaption>
</figure>


## Refactoring
To clean up code it is often handy to convert values into variables with a meaningful name. This is easy using `⌥ + ⌘ + V`.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/extractvariable.gif"
       alt="Extract variable with ⌥ + ⌘ + V"/>
  <figcaption>Extract variable with ⌥ + ⌘ + V</figcaption>
</figure>

Note that you can either replace one or all occurrences.

Similarly, you can extract code into a method with `⌥ + ⌘ + M` and give it an easy to understand name.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/extractmethod.gif"
       alt="Extract method with ⌥ + ⌘ + M"/>
  <figcaption>Extract method with ⌥ + ⌘ + M</figcaption>
</figure>

You can even convert a variable to a parameter that is injected into the method using `⌥ + ⌘ + P`.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/extractparameter.gif"
       alt="Extract parameter with ⌥ + ⌘ + P"/>
  <figcaption>Extract parameter with ⌥ + ⌘ + P</figcaption>
</figure>

If this makes another parameter obsolete, then it will be automatically removed from the method signature.

Same holds true to create properties, by using `⌥ + ⌘ + F`.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/extractproperty.gif"
       alt="Extract property with ⌥ + ⌘ + F"/>
  <figcaption>Extract property with ⌥ + ⌘ + F</figcaption>
</figure>

Note that for Java you can also use `⌥ + ⌘ + C` to extract a static final field. This isn't available for Kotlin however.

Besides extracting, you can also do the inverse operation: inlining `⌥ + ⌘ + N`. This is available for almost everything you can extract: methods, variables, properties,...

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/inlinevariablesmethods.gif"
       alt="Inline method or variable with ⌥ + ⌘ + N"/>
  <figcaption>Inline method or variable with ⌥ + ⌘ + N</figcaption>
</figure>

Inlining gives you the option to inline it only in one place or everywhere. Plus you can optionally still keep the inlined variable or method.

While the above refactorings are the most commonly used ones, Android Studio actually offers quite a lot more if you press `^ + T`:

<figure style="width: 50%" class="align-center">
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/refactoroptions.png"
       alt="All refactoring options"/>
  <figcaption>All refactoring options</figcaption>
</figure>

I strongly encourage you to experiment with these and learn how they work. Good knowledge of these can dramatically speed up your development and reduce mistakes.

## Android studio quick fixes
With `⌥ + enter` Android Studio is able to quickly fix a number of common issues: add imports, remove unused method, remove unused parameter, restrict access modifiers,...

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/quickfixes.gif"
       alt="Quick fix problems with ⌥ + enter"/>
  <figcaption>Quick fix problems with ⌥ + enter</figcaption>
</figure>

This quick fix option is significantly more powerful than you might think. Have a look at the function below:

```kotlin
fun shouldFollowAuthorOnTwitter(isBadBlogPost: Boolean, hasReadArticle: Boolean): Boolean {
    val isBlogJeroen = true

    if (isBlogJeroen) {
        if (!isBadBlogPost && hasReadArticle) {
            return true
        }
    }
    return false
}
```

Not easy to understand, is it?

Let's now use Android Studio to simplify this complex code for us.

<figure>
  <img src="{{ site.url }}{{ site.baseurl }}/img/blog/androidstudioshortcuts2/simplifyifs.gif"
       alt="Simplify if statements"/>
  <figcaption>Simplify if statements</figcaption>
</figure>

Pretty cool, no?

Even better: this procedure is 100% safe!!! This is because we've offloaded all correctness checks and code changes to our IDE.

## Wrap up
Refactoring can be tedious and easily introduce bugs. Therefore we should automate as much as we can using Android Studio.

This was part two of my series to get the most out of Android Studio. If you're interested in the next posts it's probably best to follow me on {% include link_twitter.html %}.
