---
layout: post
title: A successful XML naming convention
published: true
comments: true
img: img/blog/xmlnaming/xmlnaming.png
---
Managing Android resources in a large projects is a tedious task. Something that grows out of control easily, forcing you to go to the declarations to find what you are looking for.

The simple, effective naming scheme, provides:

- easy lookup of any resource (autocomplete)
- logical, predictable names
- clean ordering of resources
- no naming conflicts

// TODO add easy to use one pager

// need a section with limitations -> refactoring does not rename resources

## Basic principle
All resource names follow a simple convention:

    <what>_<where>_<moreinfo>

The actual adoption differs slightly between different resource types. (outlined below)

#### What
Describe what it actually is, typically a standard Android view class. </br> (e.g. MainActivity -> `activity`)

#### Where
Describe where it logically belongs in the app. Classname of your Android view subclass minus the parent part. </br> (e.g. MainActivity -> `main`)

#### More info
Differentiate multiple elements in one screen with more info. </br> (e.g. `title`)

## Layouts
For layouts the general rule simplifies to:

    <what>_<where>.xml

Because the `<moreinfo>` part doesn't make much sense as there is usually only one layout per screen.

The `<what>` prefixes are limited to:

| Prefix    | Usage                     |
| --------- | ----------------------    |
| activity  | contentview for activity  |
| fragment  | view for a fragment       |
| view      | inflated by a custom view |
| item      | layout used in list/recycler/gridview |
| generic   | layout reused using the include tag   |

Examples:

- **activity_main**: content view of the MainActivity
- **fragment_articledetail**: view for the ArticleDetailFragment
- **view_menu**: layout inflated by custom view class MenuView
- **item_article**: list item in ArticleRecyclerView
- **layout_actionbar_backbutton**: layout for an actionbar with a backbutton (too simple to be a customview)

## Strings
The `<what>` part for Strings is irrelevant. So either we use `<where>` to indicate where the string will be used:

    <where>_<moreinfo>

or `generic` if the string is reused throughout the app:

    generic_<moreinfo>

Examples:

- **articledetail_title**: title of ArticleDetailFragment
- **feedback_namehint**: hint of name field in FeedbackFragment
- **generic_done**: generic "done" string

Where obviously also corresponds to a class name, just like layouts do.

## Drawables
The `<what>` part for Drawables is irrelevant. So either we use `<where>` to indicate where the drawable will be used:

    <where>_<moreinfo>_<size>

or `generic` if the drawable is reused throughout the app:

    generic_<moreinfo>_<size>

The `<size>` argument is optional and can be an actual size "24dp" or a size qualifier "small".

Examples:

- **articledetail_placeholder**: placeholder for ImageView in ArticleDetailFragment
- **generic_infoicon**: generic info icon
_ **generic_infoicon_large**: large version of generic info icon
_ **generic_infoicon_24dp**: 24dp version of generic info icon

## IDs
For IDs, the what is the actual type, followed by the screen they belong to and more info (optional) to distinguish multiple elements in one screen.

    <what>_<where>_<moreinfo>

Examples:

- **tablayout_main** -> TabLayout in MainActivity
- **textview_articledetail_title** -> title TextView in ArticleDetailFragment
- **imageview_menu_profile** -> profile image in custom MenuView

## Dimensions
Dimensions are named a bit differently, because one dimension can be used by more than one "whats"

Therefore either use:

    <what><moreinfo>     -> For global app dimensions

    <where><moreinfo>   -> For screen specific dimensions

Examples:

- toolbar_height: height of all toolbars
- menu_iconsize: size of icons in menu
- menu_profileimageheight: height of the profile image in the menu

## Wrap-up
// TODO

As always you can reach me [@molsjeroen](https://twitter.com/molsjeroen) on twitter, or leave a comment below!
