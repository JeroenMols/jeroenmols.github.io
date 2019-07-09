---
title: Modularization - How to approach
published: true
header:
  teaser: img/blog/modularizationhow/modularization_how.jpg
  imgcredit: Photo by Clement127 under Creative Commons license (CC BY-NC-ND 2.0), https://www.flickr.com/photos/clement127/15004844674, cropped
tags:
  - modularization
  - architecture
  - software engineering
  - how to
---
Now that we have a clear idea of how a modularized app could look like how can this be applied to an existing app?

Part four will dive deeper into how existing apps can be sliced and how you can gradually migrate to a fully modularized architecture.

>
This post is part of an in depth series on modularization:
- [Part 1: Why you should care]({{ site.baseurl }}{% link blog/_posts/2019-03-06-modularizationwhy.md %})
- [Part 2: A successful multi-module architecture]({{ site.baseurl }}{% link blog/_posts/2019-03-18-modularizationarchitecture.md %})
- [Part 3: Real-life example]({{ site.baseurl }}{% link blog/_posts/2019-04-02-modularizationexample.md %})
- [Part 4: How to approach]({{ site.baseurl }}{% link blog/_posts/2019-04-24-modularizationhow.md %})
- [Part 5: Lessons learned]({{ site.baseurl }}{% link blog/_posts/2019-06-12-modularizationtips.md %})

## Modularization strategy
Roughly speaking there are two strategies you can take:

- convert the old app to a library and pull code up
- keep the old app and push code down

### Pull code up
![Modularized app example]({{ site.url }}{{ site.baseurl }}/img/blog/modularizationhow/modularisation_pullup.png){: .align-center}

In this approach, the old app gets converted to an Android library module and a new app module is created on top of that. This allows to gradually pull up code (features and libraries) from the old app module into a new module.

When all code is pulled up, the old app module is removed and what's left is the [architecture]({{ site.baseurl }}{% link blog/_posts/2019-03-18-modularizationarchitecture.md %}) we were striving for.

Conceptually this is very simple and it has one huge advantage: (almost) no dependency problems!

All old code is in the `old app module` and new modules are only created on top of that. Hence, those modules will always have access to all legacy files they depend on, even if those files weren't migrated to a proper module yet.

E.g. a new feature can easily access the analytics framework, even if there isn't an analytics module yet. This is because all old analytics code is already in the `old app module` that the feature depends on.

There are also some disadvantages, unfortunately:

- renaming/moving the old app module is a huge upfront change and could cause a lot of merge conflicts => can be avoided by not moving/renaming the app module
- need to convert all references to view IDs from `R.id.***` to `R2.id.***` when using [Butterknife](https://github.com/JakeWharton/butterknife). This is because the Android build system dynamically changes IDs of resources in libraries to avoid ID conflicts while merging libraries together in the app
- features need to be modularized first and only after libraries can be extracted. E.g. hard to extract all analytics up to an `analytics library` when some features that are still in `old app module` still need to access that.

At Philips Hue, we heavily used Butterknife so this approach turned out to be impractical for us. Mainly due to the large number of upfront changes to prepare the `old app module`.

### Push code down
![Modularized app example]({{ site.url }}{{ site.baseurl }}/img/blog/modularizationhow/modularisation_pushdown.png){: .align-center}

Alternatively, the old `app module` can also just remain in place and modules are extracted from that downwards one by one.

At first, this is quite a bit more challenging because all the common plumbing (UI components, analytics, storage,... ) is still in the upper `app module` and isn't accessible by lower modules. e.g. It's hard to pull out a feature that relies on analytics if the analytics code is still in the `app module`.

On the plus side, this method aggressively forces you to modularize: you will easily run into actual dependency problems that must be solved before you can continue. E.g. add a new or extract a `feature module` will force you to extract common logic first (e.g. network layer)

Hence common plumbing must be modularized on the short term and cannot be parked in a single huge core module for a long time. But once these key `plumbing modules` are extracted, the rest of the modularization will become a lot easier.

And because moving code down is harder than moving it up, only the essential code parts will be moved down at first. Resulting in smaller steps, enabling a better grip on the entire modularisation process.

Finally, this way of modularisation allows to clean up the code base bottom up: move part code down -> convert to Kotlin -> make idiomatic -> rinse and repeat. It's a lot easier to set architecture goals (e.g. % Kotlin, % test coverage,...) for smaller parts of your code base than for huge monolithic modules.

> Note: Introducing new technologies (e.g. coroutines, rxjava) is usually also easier bottom up. This is because modules making use of these can directly access "cleaned up interfaces" instead of wrapping old ones to fit the new paradigms. So you start benefitting from the end-to-end benefits of the new technologies sooner in your app.

At Philips Hue, we decided to go for this approach, mainly because it forced us to think better about our `library modules` upfront and it also avoided a huge refactoring due to Butterknife.

## Considerations
Regardless of what strategy you decide two follow, here are a few things you should take into consideration:

### Try to make a big initial push
Only once you reach a critical mass of modules, you will start reaping the benefits. (build times, easier to understand code,...) Therefore try to define a few key modules and put them in place as soon as possible.

At Philips Hue these were:
- UI components (incl themes and styles)
- SDK wrapper (Hue system domain model)
- Translations
- Analytics

### Api clean up
Modularizing an existing app will be quite the challenge and you will uncover dependencies between classes that shouldn't be have been there. Cutting these might be non-trivial and could result in splitting classes, introducing adapters,...

Hence clean up work cannot be avoided while modularizing. But try to keep that cleanup work focussed as much as possible to the API of the modules. Once they are clean/fixed you'll be able to refactor/replace their internals easily later on.

Also, try to aggressively restrict the visibility of the non-public interface to private or internal. This decouples modules and again facilitates doing an internal module clean up later without affecting the rest of the code base.

Sometimes, however, a simple interface clean up can blow up and result in tons of code changes somewhere. At this point, it could become impractical to completely clean up the entire interface when all you need is just to extract a simple module.

That's fine, just mark the old API as deprecated and provide a new API next to that one. Don't be afraid to postpone other problems when you are trying to solve the modularization one.

### General code improvements
While doing all this work, nearly all parts of the code will be touched at some point. This generates a unique opportunity to finally do some of the improvements that were on your backlog for quite some time like:

- conversion to Kotlin
- add (more) unit tests
- ...

## Wrap-up
Generally speaking, there are two strategies to modularize an existing app: pull code up or push code down. Make sure to make a big initial push towards modularization to reap the benefits as soon as possible, clean up the module APIs and see if you can take some code improvements along.

Make sure to follow me on {% include link_twitter.html %} and read on to learn some tips and lessons learned while modularizing [in part 5]({{ site.baseurl }}{% link blog/_posts/2019-06-12-modularizationtips.md %}).
