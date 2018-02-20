---
title: Pro Android Studio - Code navigation
published: false
header:
  teaser: img/blog/androidstudioshortcuts/androidstudioshortcuts.jpg
  imgcredit: Photo by Manki Kim on Unsplash, https://unsplash.com/photos/BtHjHxh-D7I, cropped
tags:
  - androidstudio
  - tools
  - shortcuts
---
Struggling to navigate your code? There must be a better way than just search everywhere, no? How do you investigate relations between different classes? Let's learn how to navigate code in Android Studio like a pro.

Being a skillful Android developer means getting the most out of the tools at your disposal. This series will give you carefully curated list on how to better navigate and refactor code.

## TL;DR
// TODO

## Opening classes and files
cmd O -> look for classes (+explain camel casing, line numbers?)
cmd shift O -> look for all files
cmd B -> go to declaration navigate usage and implementation
cmd schift T -> toggle between test/implementation

## Analyze how classes are used/structured
cmd alt B -> go to implementations
cmd U -> go to superclass
cmd F7 -> find usages
cmd option F7 -> find usages in place

## Analyzing classes
cmd F12 -> show methods (searchable)
cmd L -> go to line
F2 go to next warning
shift F2 -> previous warning

## History
cmd E -> look at recent files
cmd ] -> jump to next position
cmd [ -> jump to previous position
shift cmd backspace -> jump to last edit

## Wrap up
If you've made it this far you should probably follow me on {% include link_twitter.html %}. Feel free leave a comment below or check out [the code](https://github.com/JeroenMols/FragmentBackNavigation) on GitHub!
