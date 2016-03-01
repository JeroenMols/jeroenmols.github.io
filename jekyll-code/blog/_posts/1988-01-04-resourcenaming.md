---
layout: post
title: A successful XML naming convention
published: true
comments: true
img: img/blog/resourcenaming/resourcenaming.png
---
Managing Android resources in large projects is tedious and grows out of control easily. This lack of XML namespaces frustrates us all, so let's introduce a simple scheme that will elegantly solve all your pains.

- easy lookup of any resource (autocomplete)
- logical, predictable names
- clean ordering of resources
- no naming conflicts

The cheat sheet below provides everything as an easy reference:

<center><a href="{{ site.blogbaseurl }}img/blog/resourcenaming/resourcenaming_cheatsheet.jpg"><img src="{{ site.blogbaseurl }}img/blog/resourcenaming/resourcenaming_cheatsheet.jpg" alt="Resource naming cheat sheet"></a></center>

<br><br>

## Basic principle
All resource names follow a simple convention, with minor differences between different resource types. (outlined below)

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/whatwheredescriptionsize.jpg" alt="what_where_description_size">

#### &lt;WHAT&gt;
Typically a standard Android view class. Limited set of options per resource type (see below). </br> (e.g. MainActivity -> `activity`)

#### &lt;WHERE&gt;
Describe where it logically belongs in the app. Custom part of Android view subclass or "generic" </br> (e.g. MainActivity -> `main`)

#### &lt;DESCRIPTION&gt;
Differentiate multiple elements in one screen. </br> (e.g. `title`)

#### &lt;SIZE&gt; (optional)
Either a precise size or size bucket. Optionally used for drawables and dimensions. </br>  (e.g. `24dp`, `small`))

<br><br>

## Advantages

1. **Ordering of resources by screen** <br>
  The `WHERE` part describes what screen a resource belongs to. Hence it is easy to get all IDs, drawables, dimensions,... for a particular screen.
2. **Strongly typed resource IDs** <br>
  For resource IDs, the `WHAT` describes the class name of the xml element it belongs to. Therefore you always know what class you need to cast your `findViewById()` calls to.
3. **Better resource organizing** <br>
  File browsers/project navigator usually sort files alphabetically. This means layouts and drawables are grouped by their `WHAT` (activity, fragment,..) and `WHERE` prefix respectively. A simple Android Studio plugin/feature can now display these resources as if they where in there own folder.
3. **Better autocomplete** <br>
  Because resource names are far more predictable, using the IDE's autocomplete becomes even better. Usually entering the `WHAT` or `WHERE` is sufficient to narrow autocomplete down to a limited set of options.
4. **No more name conflicts** <br>
  Similar resources in different are either `generic` or have a different `WHERE`. A fixed naming scheme avoids all naming collisions.
5. **Cleaner resource names** <br>
  Overall all resources will be named more logical, causing a cleaner Android project.
6. **Tools support** <br>
  This naming scheme could be easily supported by the Android Studio offering features such as: lint rules to enforce theses names, refactoring support when you change a `WHAT` or `WHERE`, better resource visualisation in project view,...

<br><br>

## Layouts
Layouts are relatively simple, as there is usually only one per screen. Therefore the rule can be simplified to:

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/layouts.png" alt="what_where.xml">

Where `<WHAT>` is one of the following:

| Prefix    | Usage                     |
| --------- | ----------------------    |
| activity  | contentview for activity  |
| fragment  | view for a fragment       |
| view      | inflated by a custom view |
| item      | layout used in list/recycler/gridview |
| layout   | layout reused using the include tag   |

Examples:

- **activity_main**: content view of the MainActivity
- **fragment_articledetail**: view for the ArticleDetailFragment
- **view_menu**: layout inflated by custom view class MenuView
- **item_article**: list item in ArticleRecyclerView
- **layout_actionbar_backbutton**: layout for an actionbar with a backbutton (too simple to be a customview)

<br><br>

## Strings
The `<WHAT>` part for Strings is irrelevant. So either we use `<WHERE>` to indicate where the string will be used:

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/strings.png" alt="where_description.xml">

or `generic` if the string is reused throughout the app:

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/strings2.png" alt="generic_description.xml">

Examples:

- **articledetail_title**: title of ArticleDetailFragment
- **feedback_namehint**: hint of name field in FeedbackFragment
- **generic_done**: generic "done" string

`<WHERE>` obviously is the same for all resources in the same view.

<br><br>

## Drawables
The `<WHAT>` part for Drawables is irrelevant. So either we use `<WHERE>` to indicate where the drawable will be used:

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/drawables.png" alt="where_description_size.xml">

or `generic` if the drawable is reused throughout the app:

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/drawables2.png" alt="generic_description_size.xml">

Optionally you can add a `<SIZE>` argument, which can be an actual size "24dp" or a size qualifier "small".

Examples:

- **articledetail_placeholder**: placeholder in ArticleDetailFragment
- **generic_infoicon**: generic info icon
- **generic_infoicon_large**: large version of generic info icon
- **generic_infoicon_24dp**: 24dp version of generic info icon

<br><br>

## IDs
For IDs, `<WHAT>` is the class name of the xml element it belongs to. Next is the screen the id is in, followed by an optional description to distinguish similar elements in one screen.

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/ids.png" alt="what_where_description.xml">

Examples:

- **tablayout_main** -> TabLayout in MainActivity
- **imageview_menu_profile** -> profile image in custom MenuView
- **textview_articledetail_title** -> title TextView in ArticleDetailFragment

<br><br>

## Dimensions
Apps should only define a limited set of dimensions, which are constantly reused. This makes most dimensions `generic` by default.

Therefore you should mostly use:

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/dimensions2.png" alt="what_generic_description_size.xml">

and optionally use the screen specific variant:

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/dimensions.png" alt="what_where_description_size.xml">

Where `<WHAT>` is one of the following:

| Prefix    | Usage                     |
| --------- | ----------------------    |
| width     | width in dp               |
| height    | height in dp              |
| size      | if width == height        |
| margin    | margin in dp              |
| padding   | padding in dp             |
| keyline   | absolute keyline measured from view edge in dp |
| textsize  | size of text in sp        |

Examples:

- **height_toolbar**: height of all toolbars
- **keyline_listtext**: listitem text is aligned at this keyline
- **textsize_medium**: medium size of all text
- **size_menu_icon**: size of icons in menu
- **height_menu_profileimage**: height of profile image in menu

<br><br>

## Wrap-up
That's it! A clean simple and easy to use resource naming scheme.

I haven't included assets, nor raw resources as they are very varied and less used. Therefore it doesn't make much sense to "force" them into one common sheme.

Let me know what you think by contacting me [@molsjeroen](https://twitter.com/molsjeroen) on twitter, or leaving a comment below!
