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
- strongly typed resources

This blogpost will explain the mechanism, its advantages, limitations and provide an easy to use cheat sheet.

<br>

## Basic principle
All resource names follow a simple convention, with minor differences between different resource types. (outlined below)

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/whatwheredescriptionsize.jpg" alt="what_where_description_size">

#### &lt;WHAT&gt;
Typically a standard Android view class. Limited set of options per resource type (see below). </br> (e.g. MainActivity -> `activity`)

#### &lt;WHERE&gt;
Describe where it logically belongs in the app. Resources used in multiple screens use `all`, all others use the custom part of the Android view subclass they are in. </br> (e.g. MainActivity -> `main`, ArticleDetailFragment -> `articledetail`)

#### &lt;DESCRIPTION&gt;
Differentiate multiple elements in one screen. </br> (e.g. `title`)

#### &lt;SIZE&gt; (optional)
Either a precise size or size bucket. Optionally used for drawables and dimensions. </br>  (e.g. `24dp`, `small`))

<center><a href="{{ site.blogbaseurl }}img/blog/resourcenaming/resourcenaming_cheatsheet.png"><img src="{{ site.blogbaseurl }}img/blog/resourcenaming/resourcenaming_cheatsheet.png" alt="Resource naming cheat sheet"></a></center>

<br>

## Advantages

1. **Ordering of resources by screen** <br>
  The `WHERE` part describes what screen a resource belongs to. Hence it is easy to get all IDs, drawables, dimensions,... for a particular screen.
2. **Strongly typed resource IDs** <br>
  For resource IDs, the `WHAT` describes the class name of the xml element it belongs to. This makes is easy to what to cast your `findViewById()` calls to.
3. **Better resource organizing** <br>
  File browsers/project navigator usually sort files alphabetically. This means layouts and drawables are grouped by their `WHAT` (activity, fragment,..) and `WHERE` prefix respectively. A simple Android Studio plugin/feature can now display these resources as if they were in their own folder.
4. **More efficient autocomplete** <br>
  Because resource names are far more predictable, using the IDE's autocomplete becomes even easier. Usually entering the `WHAT` or `WHERE` is sufficient to narrow autocomplete down to a limited set of options.
5. **No more name conflicts** <br>
  Similar resources in different screens are either `all` or have a different `WHERE`. A fixed naming scheme avoids all naming collisions.
6. **Cleaner resource names** <br>
  Overall all resources will be named more logical, causing a cleaner Android project.
7. **Tools support** <br>
  This naming scheme could be easily supported by the Android Studio offering features such as: lint rules to enforce these names, refactoring support when you change a `WHAT` or `WHERE`, better resource visualisation in project view,...

<br>

## Layouts
Layouts are relatively simple, as there usually are only a few layouts per screen. Therefore the rule can be simplified to:

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

<br>

## Strings
The `<WHAT>` part for Strings is irrelevant. So either we use `<WHERE>` to indicate where the string will be used:

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/strings.png" alt="where_description.xml">

or `all` if the string is reused throughout the app:

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/strings2.png" alt="all_description.xml">

Examples:

- **articledetail_title**: title of ArticleDetailFragment
- **feedback_explanation**: feedback explanation in FeedbackFragment
- **feedback_namehint**: hint of name field in FeedbackFragment
- **all_done**: generic "done" string

`<WHERE>` obviously is the same for all resources in the same view.

<br>

## Drawables
The `<WHAT>` part for Drawables is irrelevant. So either we use `<WHERE>` to indicate where the drawable will be used:

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/drawables.png" alt="where_description_size.xml">

or `all` if the drawable is reused throughout the app:

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/drawables2.png" alt="all_description_size.xml">

Optionally you can add a `<SIZE>` argument, which can be an actual size "24dp" or a size qualifier "small".

Examples:

- **articledetail_placeholder**: placeholder in ArticleDetailFragment
- **all_infoicon**: generic info icon
- **all_infoicon_large**: large version of generic info icon
- **all_infoicon_24dp**: 24dp version of generic info icon

<br>

## IDs
For IDs, `<WHAT>` is the class name of the xml element it belongs to. Next is the screen the ID is in, followed by an optional description to distinguish similar elements in one screen.

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/ids.png" alt="what_where_description.xml">

Examples:

- **tablayout_main** -> TabLayout in MainActivity
- **imageview_menu_profile** -> profile image in custom MenuView
- **textview_articledetail_title** -> title TextView in ArticleDetailFragment

<br>

## Dimensions
Apps should only define a limited set of dimensions, which are constantly reused. This makes most dimensions `all` by default.

Therefore you should mostly use:

<img src="{{ site.blogbaseurl }}img/blog/resourcenaming/dimensions2.png" alt="what_all_description_size.xml">

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
| elevation | elevation in dp             |
| keyline   | absolute keyline measured from view edge in dp |
| textsize  | size of text in sp        |

Note that this list only contains the most used `<WHAT>`s. Other dimensions qualifiers like: rotation, scale,... are usually only used in drawables and as such less reused.

Examples:

- **height_toolbar**: height of all toolbars
- **keyline_listtext**: listitem text is aligned at this keyline
- **textsize_medium**: medium size of all text
- **size_menu_icon**: size of icons in menu
- **height_menu_profileimage**: height of profile image in menu

<br>

## Known limitations
1. **Screens need to have unique names**<br>
To avoid collisions in the `<WHERE>` argument, View (like) classes must have unique names. Therefore you cannot have a "MainActivity" and a "MainFragment", because the "Main" prefix would no longer uniquely identify one `<WHERE>`.

2. **Refactoring not supported**<br>
Changing class names does not change along resource names when refactoring. So if you rename "MainActivity" to "ContentActivity", the layout "activity_main" won't be renamed to "activity_content". Hopefully Android Studio will one day add support for this.

3. **Not all resource types supported**<br>
The proposed scheme currently does not yet support all resource types. For some resources this is because they are less frequently used and tend to be very varied (e.g. raw and assets). For other resources this is because they are a lot harder to generalize (e.g. themes/styles/colors/animations).

    Your apps colors palette likely wants to reuse the terminology of your design philosophy. Animations can range from modest (fade) to very exotic. Themes and styles already have a naming scheme that allows you to implicitly inherit properties.

<br>

## Wrap-up
That's it! A clean simple and easy to use resource naming scheme. Don't forget to download the <a href="{{ site.blogbaseurl }}img/blog/resourcenaming/resourcenaming_cheatsheet.png">cheat sheet</a> for easy reference!

Even though this scheme doesn't (yet) cover all resource types, it does provide an easy to use solution for where most naming pain currently is. In a future blogpost I'll also make a suggestion for the other ones.

Let me know what you think by contacting me [@molsjeroen](https://twitter.com/molsjeroen) on twitter, or leaving a comment below!
