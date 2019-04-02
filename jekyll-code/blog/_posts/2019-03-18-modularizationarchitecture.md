---
title: Modularization - A successful architecture
published: true
header:
  teaser: img/blog/modularizationarchitecture/modularization_architecture.jpg
  imgcredit: Photo by Clement127 under Creative Commons license (CC BY-NC-ND 2.0), https://www.flickr.com/photos/clement127/15979531229/in/photolist-qm4gV8-psTHjp-r8sByu-qyCDbr-qyeVjH-qm2TfT-rqk1Ny-qJ1gv6-pvWmo2-qXc2WN-rVaPtk-qnAGgV-qVHpxa-qfvWtQ-rmVbGE-qKCZqV-rpnk1k-qzGfAR-qtfBeD-qXGFYF-qCk82v-qEniZU-r6rPcR-rmZagg-qDxLQv-rhMC9h-rNEdMh-qvrGtY-rvNLWH-thaBRN-pKcux1-qNbfmt-s1RHzL-q8cXmp-qNkcms-r7MZrL-qM8Wk8-s8g8dp-r6rMjT-pZ5S4X-rdLsao-qfwn1E-r5QRTt-pJ7iTm-qr4XXW-rrrjvn-qNz5kX-qKeSAy-quHgFa-q7KuSE, cropped
tags:
  - modularization
  - architecture
  - software engineering
  - navigation
  - android
---
Now that we've established that modularization is a really good thing to strive for, how should a modularized app look like? How are the different modules connected? And how does this look for a real app?

This second part will explore a simple, yet very effective approach to modularizing apps. It will cover in depth the different kinds of modules and present the benefits of this approach.

>
This post is part of an in depth series on modularization:
- [Part 1: Why you should care]({{ site.baseurl }}{% link blog/_posts/2019-03-06-modularizationwhy.md %})
- [Part 2: A successful multi-module architecture]({{ site.baseurl }}{% link blog/_posts/2019-03-18-modularizationarchitecture.md %})
- [Part 3: Real-life example]({{ site.baseurl }}{% link blog/_posts/2019-04-02-modularizationexample.md %})

## Disclaimer
This is by no means the only way to modularize an app, but it does offer some key benefits that we will touch upon later.

## App structure
Let's start by looking at the app you are working on:

- Does it consists out of a main screen with several tabs/clickable elements?
- What happens when users click those elements?

Chances are high that will open a new full-screen part of the app, often consisting out of several sub-screens to perform a particular action.

Have a look at gmail for instance:

[![Modularized architecture]({{ site.url }}{{ site.baseurl }}/img/blog/modularizationarchitecture/gmail_structure.jpg){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/modularizationarchitecture/gmail_structure.jpg)

Simplified, it consists of a main screen (inbox) with an app drawer, a compose button and email items in the inbox. Clicking one of these elements leads you to a new full screen "feature":

- clicking an email -> read email feature (one screen)
- clicking compose -> write email feature (several screens)
- clicking settings (in drawer) -> settings (several screens)

> Highly simplified, apps are just a tree of (fullscreen) screens, where multiple screens often form a user flow together.

Let's call all these "user flows" features.

Now let's think about how the Android OS is designed to work: multiple apps can interact with each other via intents. This is actually pretty cool, as any app can request an action to be performed (e.g. take a picture) without having to know who will process that request and how it will be processed.

> The Android system simply links multiple apps together via a system of implicit intents.

What if we were to take advantage of both these observations and split our app into several completely independent feature modules? Where each feature is decoupled using a simple "startActivityForResult" contract?

## Modularized Architecture
While splitting your app into several features, all of those features will likely depend on some common business logic or UI components. Hence we need to introduce a third level of "library modules".

Bringing that all together yields:

![Modularized architecture with one App module, several features modules and several library modules]({{ site.url }}{{ site.baseurl }}/img/blog/modularizationarchitecture/modularized_architecture.png){: .align-center}

This architecture basically splits an app into three levels of modules:

- App: links together features modules (usually only one)
- Features: self-contained, full-screen UI level features that include Espresso tests. Each feature consists of at least one activity and optionally a navigation graph. Feature modules never directly depend on each other.
- Libraries: functionality shared across multiple features. Different libraries can depend on each other

Let's investigate these three levels in depth.

## Feature modules
Probably the most important modules are feature modules. These have the following characteristics:

- an android-library module
- single activity with (optional) navigation graph <br>(multiple activities are allowed)
- respond to implicit intents and pass back a result
- never depend on other features or app
- depend on several library modules

Feature modules correspond with full screen, coherent user facing functionality in the app: e.g. user login, app settings, picture cropping,...

### Navigation

> Note that navigation in apps is identified as a [big challenge](https://medium.com/@emmaguy/android-modularisation-the-results-58a4bf17602e) in a public poll by [@emmaguy](https://twitter.com/@emmaguy)

The first key benefit is that feature modules make navigation within an app significantly easier. This is because they split the navigation problem into smaller parts:

- navigation within a feature -> handled by the feature itself
- navigation between features -> handled by the app module

Hence there is no need for very large and complex navigation controllers! Features simply split an app in logical, coherent flows.

Even more, the navigation component gives every feature a clear visual representation of its UI flow. That allows to quickly figure out what a feature does. E.g. What does the game feature do?

![Navigation within a feature]({{ site.url }}{{ site.baseurl }}/img/blog/modularizationarchitecture/feature_navigation.png){: .align-center}

 Finally no more guessing how a particular screen was named, just jump to the right feature, look for the screen and you'll find the fragment/views without having to guess/remember their name.

### Scaling
Second, making features independent like this completely decouples their implementations. Hence eliminating merge conflicts across different feature teams by design!

Experimenting with new technologies also becomes a lot easier: you can easily benefit from new tech end to end within a single feature. Evaluate if it's beneficial for your team and in case of a bad choice, all effects are contained within a single modules!

And should you ever decide to launch a second app (or SDK), you can simply package existing features together with new ones in a new app module.

### Testing
Because all features can be started directly using an intent, there is no need for Espresso to step through other parts of the app to arrive at the feature to test.

This not only makes tests simpler and faster, but fewer steps also make them more reliable and tests can no longer break due to bugs in other features!

## Library modules
Libraries provide shared plumbing that is reused across several or all features. Their characteristics are:

- android library, pure Java or pure Kotlin module
- never depend on features or app
- can (but don't have to) depend on other libraries

Consequently, libraries can be very diverse: e.g. UI components, data storage, network communication, std lib,...

Where features are a "vertical slice" of the app, libraries are a "horizontal slice", providing functionality to several other modules.

## App module
In order to ship an app to users, something has to link all features together: the app module.

In doing so the app module orchestrates the navigation from between features. It uses feature toggles to determine what should be enabled and what not.

These feature toggles are incredibly powerful because by shipping multiple versions of the same feature in one app (e.g. the old and rewritten version), the app module allows to gradually roll out the rewritten feature to users.

```kotlin
if (isRewriteFeatureEnabled) {
    startActivityForResult(Intent("rewritten_feature"))
} else {
    startActivityForResult(Intent("feature"))
}
```

Finally, launching several apps and sharing features between them is as easy as creating a new app module.

## Wrap-up
Recapping, this simple, three-layered architecture of app, features and libraries has the the following benefits:

- simplifies navigation by splitting the in-feature and across feature navigation
- makes it easy to find back screens and understand features (especially when using the navigation graph)
- enables scaling teams: fewer merge conflicts between feature teams as features are decoupled
- makes test automation easier: features can be started directly, no need to step through the app to the feature first
- simplifies experimenting with new technologies: quickly achieve end-to-end benefits within feature + low cost of bad technology choice (isolated from rest of the app)
- allows staged rollout of rewritten features using feature toggles

Make sure to follow me on {% include link_twitter.html %} and let's study a detailed example of this architecture [in part 3]({{ site.baseurl }}{% link blog/_posts/2019-04-02-modularizationexample.md %}).
