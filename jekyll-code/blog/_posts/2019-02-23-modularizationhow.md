---
title: Modularization - How to approach
published: false
header:
  teaser: img/blog/modularizationhow/modularization_how.jpg
  imgcredit: Photo by Clement127 under Creative Commons license (CC BY-NC-ND 2.0), https://www.flickr.com/photos/clement127/15004844674, cropped
tags:
  - modularization
  - architecture
  - software engineering
---
Now that we clearly know how a modularized app should look like, how can this be applied to an existing app? Surely it won't be trivial to cut a large existing app in pieces, right?

Part three will dive deeper into how existing apps can be sliced and how you can gradually migrate to a modularized architecture.

## Modularization strategy
Roughly speaking there are two strategies you can take:

- convert the old app to a library and pull code up
- push code down from your old app

### Pull code up
![Modularized app example]({{ site.url }}{{ site.baseurl }}/img/blog/modularizationhow/modularisation_pullup.png){: .align-center}

In this approach, the old app gets converted to an Android library module and a new app module is created on top of that. This allows to gradually pull up code from the old app module into a new module. When all code is pulled up, the old app module is removed.

Conceptually this is very simple and it has one huge advantage: no upwards dependency problems! All old code is in a `library module` (old app) and new modules are only created on top of that. Hence, those modules will always have access to all (legacy) files they depend on, even if those files weren't migrated to a proper module yet.

E.g. a new feature can easily access the analytics framework, even if there isn't an analytics module yet. This is because all old analytics code is already in a  `library module` that the feature depends on.

There are also some disadvantages, unfortunately:

- big upfront change required if the old app module gets renamed/moved potentially causing a lot of merge conflicts => can be avoided by not moving/renaming the app module
- need to convert all references to view IDs from `R.id.***` to `R2.id.***` when using [Butterknife](https://github.com/JakeWharton/butterknife). This is because the Android build system dynamically changes IDs of resources in libraries to avoid ID conflicts while merging libraries together in the app

As we were heavily relying on Butterknife, the latter changes were so huge that we decided not to follow this approach.

### Push code down
![Modularized app example]({{ site.url }}{{ site.baseurl }}/img/blog/modularizationhow/modularisation_pushdown.png){: .align-center}

Alternatively, the old app just remains in place and modules are extracted from that downwards one by one.

At first, this is quite a bit more challenging because all the common plumbing (UI components, analytics, storage,... ) is still in the upper app module and isn't accessible by lower modules. e.g. It's hard to pull out a feature that relies on analytics if the analytics code is still in the app module.

On the plus side, this method aggressively drives modularisation: you will run into actual dependency problems trying to modularise that must be solved before you can continue.

Hence common plumbing must be modularized on the short term and cannot be parked in a single huge core module for a long time. But once these key `plumbing modules` are in place, also the key challenges of modularisation are addressed.

And because moving code down is harder than moving it up, only the essential code parts will be moved down at first. Resulting in smaller steps, enabling a better grip on the entire modularisation process.

Finally, this way of modularisation allows to clean up the code base bottom up: move part code down -> convert to Kotlin -> make idiomatic -> rinse and repeat. Usually, this is also helpful in introducing new technologies, as all subsequent modules will then benefit from the cleaned interfaces from there onwards.

At Philips Hue, we decided to go for this approach, mainly because it forced us to think better about our `plumbing modules` upfront and it also avoided a huge refactoring due to Butterknife.

## Considerations
Regardless of what strategy you decide two follow, here are a few things you should take into consideration:

### Try to make a big initial push
Only once you reach a critical mass of modules, you will start reaping the benefits. (build times, easier to understand code,...) Therefore try to define a few key modules and put them in place asap.

For us these were:
- UI components (incl themes and styles)
- SDK wrapper (Hue system domain model)
- Translations
- Analytics

### Interface clean up
Modularizing an existing app will be quite the challenge and you will uncover dependencies between classes that shouldn't be there at all. Cutting these might be non-trivial and could result in splitting classes, introducing interfaces,...

Hence clean up work cannot be avoided while modularizing. But try to keep that cleanup work focussed as much as possible to the interface of your module and try to aggressively restrict the visibility of the non-public interface to private or internal. This decouples modules and will enable you to do an internal module clean up later on without affecting the rest of the code base.

Sometimes, however, a simple interface clean up could blow up and result in tons of code changes somewhere else making it impractical to do it at the time of modularization. That's fine, just mark the old interface as deprecated and provide the new interface next to that one. Don't be afraid to postpone other problems when you are trying to solve the modularization one.

### General code improvements
While doing all this work, nearly all parts of the code will be touched at some point. This generates a unique opportunity to finally do some of the improvements that were on your backlog for quite some time like:

- conversion to Kotlin
- add (more) unit tests
- ...

## Wrap-up
Generally speaking there are two strategies to modularize an existing app: pull code up or push code down from the old app. Make sure to make an initial big push towards modularization to reap the benefits as soon as possible, clean up the interfaces and see if you can take some code improvements along.

Make sure to follow me on {% include link_twitter.html %} so you don't miss the next articles in this series on modularization.
