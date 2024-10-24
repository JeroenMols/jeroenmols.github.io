---
title: Pro Android Studio - Taming the interface
published: true
tags:
- androidstudio
- tools
- shortcuts
- navigation
date: '2018-07-16'
slug: androidstudioshortcuts3
series: ["Android Studio shortcuts"]
series_order: 3
featureimagecaption: Photo by Patrick Fore on Unsplash, https://unsplash.com/photos/YS_51ncQL5o,
  cropped
---

Not only can anything in Android Studio be controlled with a keyboard shortcut, it offers many more simple tricks to make you more productive.

To conclude this series, we will look at how you can control the interface, invoke every (!) action and point you to even more advanced features.


## TL;DR
I strongly suggest you look at the examples below, but a quick reference is always useful.

* `⌥ + number`: open/close views
* `⇧ + ⌘ + ↑`: enlarge view
* `⇧ + ⌘ + ↓`: shrink view
* `⇧ + ⌘ + →`: enlarge side view
* `⇧ + ⌘ + ←`: shrink side view
* `⇧ + ⌘ + F12`: close all views

* `⇧ + ⌘ + ]`: next tab
* `⇧ + ⌘ + [`: previous tab
* `^ + ⇧ + →`: text view (xml layout editing)
* `^ + ⇧ + ←`: design view (visual layout editing)
* `⌥ + letter`: invoke button

* `⌘ + ⇧ + A`: action lookup

## Taming the interface
Using your keyboard is always more efficient than using a mouse. This is because you can make use of all your fingers at the same time + you don't have to switch between mouse and keyboard.

Wouldn't it be cool if we never have to use our mouse again?

First of all you can use `⌥ + number` to open/close different Android Studio views (e.g. Logcat, Project view,...)

![Use `⌥ + number` to open/close different Android Studio views](openviews.gif "Use `⌥ + number` to open/close different Android Studio views")

You can shrink/enlarge the views above using `⇧ + ⌘ + ↑` and `⇧ + ⌘ + ↓` respectively,

![Use `⇧ + ⌘ + ↑` and `⇧ + ⌘ + ↓` to shrink or enlarge views](expandshrinkviews.gif "Use `⇧ + ⌘ + ↑` and `⇧ + ⌘ + ↓` to shrink or enlarge views")

Note that this will also work with `⇧ + ⌘ + →` and `⇧ + ⌘ + ←` for side views.

Or close all views with `⇧ + ⌘ + F12` to have a clutter free interface,

![Use `⇧ + ⌘ + F12` to close all views](closeallviews.gif "Use `⇧ + ⌘ + F12` to close all views")

When you have multiple tabs open, `⇧ + ⌘ + [` and `⇧ + ⌘ + ]` come in handy to cycle between tabs.

![Use `⇧ + ⌘ + [` and `⇧ + ⌘ + ]` to cycle between tabs](changetabs.gif "Use `⇧ + ⌘ + [` and `⇧ + ⌘ + ]` to cycle between tabs")

If you're designing layouts, you can use `^ + ⇧ + →` and `^ + ⇧ + ←` to switch between design and text view.

![Use `^ + ⇧ + →` and `^ + ⇧ + ←` to switch between design and text view](switchdesignxml.gif "Use `^ + ⇧ + →` and `^ + ⇧ + ←` to switch between design and text view")

And whenever you have a dialog open you can use `⌥` to highlight what letters you can press to invoke the respective buttons. E.g. in the example below `⌥ + R` is used to press the replace button.

![Use `⌥` to highlight what letters you can press to invoke the respective buttons](controlinterface.gif "Use `⌥` to highlight what letters you can press to invoke the respective buttons")

Note that pressing `⌥` helps in a lot more situations such as in the find and replace window. (notice the subtle underline)

![Pressing `⌥` reveals you can use `⌥ + p` to replace the next occurrence](althighlighting.gif "Pressing `⌥` reveals you can use `⌥ + p` to replace the next occurrence")

## Shortcut lookup
If there is one shortcut you should really remember, then that is `⌘ + ⇧ + A`. That one allows you to invoke any Android Studio action using your keyboard.

![Use `⌘ + ⇧ + A` to search for any action.](searchactions.gif "Use `⌘ + ⇧ + A` to search for any action.")

Note that this also serves as a useful shortcut lookup tool. Next to every action the corresponding shortcut will be displayed (if there is one).

## Additional reads
Android Studio is incredibly powerful and hence this blog post series couldn't cover everything. However, if I piqued your interest, have a look at these references:

- [Using multicursor in Android studio](http://kevinpelgrims.com/blog/2017/12/29/using-multicursor-in-android-studio/) by Kevin Pelgrims
- [Permantent function keys in Android Studio with Macbook pro Touchbar](https://medium.com/@geapi/permanent-function-keys-intellij-macbook-pro-w-touchbar-d6fc78781b90) By Georg Apitz
- [Structural search and replace](https://afterecho.uk/blog/structural-search-and-replace-in-android-studio.html) by Darren
- [Android studio live templates](https://medium.com/google-developers/writing-more-code-by-writing-less-code-with-android-studio-live-templates-244f648d17c7) by Retro Meier
- [Postfix code completion](https://www.vojtechruzicka.com/intellij-idea-tips-tricks-postfix-code-completion/) by Vojtech Ruzicka's

## Wrap up
Investing time to really learn Android Studio can mean a big productivity boost. Start with `⌘ + ⇧ + A`, learn the corresponding shortcuts and challenge yourself to use your mouse less.

This was the last part in my series to get the most out of Android Studio.

If you've made it this far you should probably follow me on [Mastodon](https://androiddev.social/@Jeroenmols). Feel free leave a comment below!
