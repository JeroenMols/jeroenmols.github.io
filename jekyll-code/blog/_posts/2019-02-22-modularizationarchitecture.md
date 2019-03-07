---
title: Modularization - Multi-module architecture
published: false
header:
  teaser: img/blog/modularizationarchitecture/modularization_architecture.jpg
  imgcredit: Photo by Clement127 under Creative Commons license (CC BY-NC-ND 2.0), https://www.flickr.com/photos/clement127/15979531229/in/photolist-qm4gV8-psTHjp-r8sByu-qyCDbr-qyeVjH-qm2TfT-rqk1Ny-qJ1gv6-pvWmo2-qXc2WN-rVaPtk-qnAGgV-qVHpxa-qfvWtQ-rmVbGE-qKCZqV-rpnk1k-qzGfAR-qtfBeD-qXGFYF-qCk82v-qEniZU-r6rPcR-rmZagg-qDxLQv-rhMC9h-rNEdMh-qvrGtY-rvNLWH-thaBRN-pKcux1-qNbfmt-s1RHzL-q8cXmp-qNkcms-r7MZrL-qM8Wk8-s8g8dp-r6rMjT-pZ5S4X-rdLsao-qfwn1E-r5QRTt-pJ7iTm-qr4XXW-rrrjvn-qNz5kX-qKeSAy-quHgFa-q7KuSE, cropped
tags:
  - modularization
  - architecture
  - software engineering
---
Now that we've established that modularization is a really good thing to strive for. How should a modularized app look like? How are the different modules connected? And how does this look for a real app?

This second part will explore a simple, yet very effective approach to modularizing apps. It will cover in depth the different kinds of modules and present the benefits of this approach.

## Preface
Disclaimer: this is by no means the only way to modularize an app, but it does offer some key benefits that we will touch upon later.

## App structure
Let's start by looking at the app you are working on: does it consists out of a main screen with several tabs/clickable elements? What happens when users click those elements? Chances are high you will open a new full-screen part of the app, often consisting out of several sub-screens to perform a particular action.

Have a look at gmail for instance:

[![Modularized architecture]({{ site.url }}{{ site.baseurl }}/img/blog/modularizationarchitecture/gmail_structure.jpg){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/modularizationarchitecture/gmail_structure.jpg)

Simplified, it consists of a main screen with an app drawer, a compose button and email items in the inbox. Clicking one of these elements leads you to a new full screen "feature":

- clicking an email -> read email feature (one screen)
- clicking compose -> write email feature (several screens)
- clicking settings (in drawer) -> settings (several screens)

> Highly simplified, apps are just a tree of (fullscreen) screens, where multiple screens often form a user flow together.

Now let's think about how the Android OS is designed to work: multiple apps can interact with each other via intents. This is actually pretty cool, as any app can request an action to be performed (e.g. take a picture) without having to know who will process that request and how it will be processed.

> The Android system simply links multiple apps together via a system of implicit intents.

What if we were to take advantage of that and split our app into several completely independent feature modules? Where each feature is decoupled using a simple "startActivityForResult" contract?

## Modularized Architecture
Unfortunately, splitting your app into several features isn't enough. As features will likely depend on some common business logic or UI components. Hence we need to introduce a third level of "library modules":

![Modularized architecture]({{ site.url }}{{ site.baseurl }}/img/blog/modularizationarchitecture/modularized_architecture.png){: .align-center}

This architecture basically splits an app into three levels of modules:

- App: links together features modules (usually only one)
- Features: self-contained, full-screen UI level features that include Espresso tests. Each feature consists of at least one activity and optionally a navigation graph. Feature modules never directly depend on each other.
- Libraries: functionality shared across multiple features. Different libraries can depend on each other

Let's investigate these three levels in depth.

### Feature modules
Probably the most important modules are feature modules. These have the following characteristics:

- an android-library module
- single activity with (optional) navigation graph <br>(multiple activities are allowed)
- respond to implicit intents and pass back a result
- never depend on other features or app
- depend on several library modules

The first key benefit is that feature modules make navigation within an app significantly easier. This is because they split the navigation problem into smaller parts:

- navigation within a feature -> handled by the feature itself
- navigation between features -> handled by the app module

Hence there is no need for very large and complex navigation controllers! Features simply split an app in logical, coherent flows.

Even more, the navigation component gives every feature a clear visual representation of its UI flow. That allows to quickly figure out what a feature does and to jump to fragment/views without having to guess/remember their name.

> Note that navigation in apps is identified as a [big challenge](https://medium.com/@emmaguy/android-modularisation-the-results-58a4bf17602e) in a public poll by [@emmaguy](https://twitter.com/@emmaguy)

Second, making features independent like this completely decouples their implementations. Hence eliminating merge conflicts across different feature teams by design!

Further, all features can also be directly started, so Espresso tests can easily test them without needing to step through other parts of the app to arrive at the feature to test. This makes tests faster and more reliable as they can only break due to bugs in the feature itself.

Finally, if you ever decide to launch a second app (or SDK), you can simply package existing features together with new ones in a new app module.

### Library modules
Libraries provide shared plumbing that is reused across several or all features. Their characteristics are:

- android library, pure Java or pure Kotlin module
- never depend on features or app
- can (but don't have to) depend on other libraries

Consequently, libraries can be very diverse: UI components, data storage, network communication, std lib,...

### App module
In order to ship an app to users, something has to link all features together: the app module.

In doing so the app module orchestrates the navigation from between features and also uses feature toggles to determine what should be enabled and what not.

These feature toggles are incredibly powerful because by shipping multiple versions of the same feature in one app (e.g. the old and rewritten version), the app module allows to gradually roll out the rewritten feature to users.

Finally, launching several apps and sharing features between them is as easy as creating a new app module.

### Practical example
While simplified, this is in essence the way the Philips Hue app is modularized:

![Modularized app example]({{ site.url }}{{ site.baseurl }}/img/blog/modularizationarchitecture/modularized_example.png){: .align-center}

All features are independent, self-contained and they don't rely on each other. There is only one single app module.

On the library level, the dependencies between libraries aren't correct, but a few interesting things to note:

- UI components: components reused across features + themes and styles
- Hue actions: contains all implicit intent actions to avoid duplication of string values. Hence actions and implicit intents are only indirectly used, via a strongly typed API (e.g. for extras).
- Translations: ideally each feature should contain its own translations, but this would require us to dynamically split the monolithic translation files from our translation agency for each feature. There is little benefit for putting in the effort right now for us.

## Wrap-up
Recapping, the proposed feature module architecture has the following benefits:

- simplifies navigation by splitting the in-feature and across feature navigation
- easy to find back screens and understand features via the navigation graph
- enable scaling teams: fewer merge conflicts between feature teams as features are decoupled
- makes test automation easier: every feature can be started directly so no need to step through the app to the feature first.
- simplifies experimenting with new technologies: quickly achieve end-to-end benefits within feature + low cost of bad technology choice (isolated from rest of the app)
- allows staged rollout of rewritten features using feature toggle

Make sure to follow me on {% include link_twitter.html %} so you don't miss the next articles in this series on modularization.
