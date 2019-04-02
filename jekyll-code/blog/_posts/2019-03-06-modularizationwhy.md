---
title: Modularization - Why you should care
published: true
header:
  teaser: img/blog/modularizationwhy/modularization_why.jpg
  imgcredit: Photo by Clement127 under Creative Commons license (CC BY-NC-ND 2.0), https://www.flickr.com/photos/clement127/15074072753/in/photolist-oY3yE6-pCoFVW-oY3xhX-oY3tF8-pUB3jK-zrkR2h, cropped
tags:
  - modularization
  - architecture
  - software engineering
---
Modularizing your app seems to be all the hype these days. But why should you actually care? What are the benefits for you and your team? How should a modularized app look like? And how do you start splitting your app?

Part one of this blog post series will deep dive into the problems modularization solves and the unique opportunities it offers.

>
This post is part of an in depth series on modularization:
- [Part 1: Why you should care]({{ site.baseurl }}{% link blog/_posts/2019-03-06-modularizationwhy.md %})
- [Part 2: A successful multi-module architecture]({{ site.baseurl }}{% link blog/_posts/2019-03-18-modularizationarchitecture.md %})
- [Part 3: Real-life example]({{ site.baseurl }}{% link blog/_posts/2019-04-02-modularizationexample.md %})

## Why
There is no short answer to this question, modularisation really has a lot going for it:

1. Speeds up builds
2. Enable on demand delivery
3. Simplify development
4. Reuse modules across apps
5. Experiment with new technologies
6. Scale development teams
7. Enables refactoring
8. Simplifies test automation

Let's investigate these benefits more in depth.

### 1. Speeds up builds
Highly simplified, Gradle does two things to speed up builds:

1. Cache work it did before so it doesn't have to do it again
2. Try to do as much work as possible in parallel

Both of these strategies aren't effective for single module apps as every code change, makes it impossible to reuse the already generated (cached) compiled code artifact and hence all code has to be recompiled again sequentially.

With multiple modules, however, Gradle can build several modules in parallel and avoid building modules that have no code changed it already has a cached artifact for. This speeds up your incremental builds and even your clean builds if you use the [Gradle build cache](https://gradle.com/build-cache/).

> Note: modules sometimes need to be recompiled even if they don't have direct code changes, but because a dependency changed. More info [here](https://jeroenmols.com/blog/2017/06/14/androidstudio3/).

### 2. Enable on demand delivery
While you could argue that app size isn't a major concern in most western countries, the same cannot be said for all parts of the world. But no matter where your users are, saving bandwidth and on device storage is a nice thing to do.

Recent years however, Android has added support for some interesting new deployment options:

- [Instant apps](https://developer.android.com/topic/google-play-instant/) allow users to run apps without installing them.
- [On demand delivery](https://developer.android.com/studio/projects/dynamic-delivery) allows to ship a smaller app with fewer features and download new features on the fly when the user starts accessing those

Modularizing your app is the very first step in being able to add support for these. Even if you aren't considering these use cases today, it's a big win if your architecture is already prepared to add them later on.

### 3. Simplify development
As covered in my [previous post]({{ site.baseurl }}{% link blog/_posts/2019-02-20-tacklelegacy.md %}), modularization helps to get rid of or to avoid spaghetti code. In a modularized world you could still have spaghetti (within modules), but at least it would be multiple smaller, easily digestible portions.

A clear contract between the modules won't just decouple everything, avoiding that one change causes side effects somewhere else. But it also forces you to group code in smaller coherent parts. That makes the code easier to read, understand and consequently, maintenance will also become a lot easier.

It's always easier to build several small things than trying to build one huge thing.

### 4. Reuse modules across apps
Even if your business has no plans to launch several apps in the near future, preparing for that still makes sense:

- should your business be successful, you have a head start launching a second app/product!
- maybe someday you want to involve 3rd party developers on your platform and make an SDK
- or perhaps you want to expose full app flows to 3rd party developers. (e.g. Firebase remote login)<br>At Philips Hue, for instance, our bridge discovery flow could potentially bootstrap any 3rd party Hue app)
- and why wouldn't you step up your game and contribute a few of those shine modules back to the open source community?

Striving to make modules reusable across apps is a great thing to strive for, even if you never end up actually doing it.

### 5. Experiment with new technologies
The Android landscape is evolving at a rapid pace: just two years ago we didn't have Kotlin, Jetpack, Architecture components, Navigation components, ... and that's just the official Google stuff!

How on earth can you keep up with that in your app, while avoiding [hype driven development](https://blog.daftcode.pl/hype-driven-development-3469fc2e9b22)? Because making the wrong technology or architecture choice could haunt you for several months or even years!

Again modularisation comes in to save the day. What if you just contain the new tech/architecture to a single module? That makes integrating the technology (e.g. RXJava) a lot easier and you can experience the full benefits of the technology by converting an entire module end to end. Hence you can rapidly experiment and if the choice turns out not to work for you, it won't be that much work to revert it.

Enabling experimentation with new technologies isn't the only benefit. Modules also help to avoid technology lock-in! What if you go all in react native and Facebook pulls official support? Containing technology choices to modules gives you room to see how a technology matures before going all in.

### 6. Scale development teams
The more people that work on a code base, the more files will be modified concurrently causing a hell of merge conflicts. And let's face it, every conflict you solve is like flipping a coin hoping it falls on the right side, so regression is a real issue here.

Again modularisation softens the blow because if you split your app in a smart way, you can delegate the ownership of particular feature modules to particular teams/people. Completely avoiding concurrent modifications, or at least limiting those problems to a smaller set of modules.

But this isn't the only kind of scaling that modularisation enables: you can even outsource development of particular feature modules to an external company as your app won't be affected by the (lower) quality of the code inside of those modules.

### 7. Enables refactoring
Monolithic apps are usually very hard to change or improve (see above). This is mainly because cleaning up code in one place can easily have unforeseen side effects somewhere else.

But there is a second reason why monoliths are hard to refactor: there is no easy way to gradually roll out your improvements!

Ideally, you want to refactor or rebuilt all functionality behind a feature toggle, so you can first verify that everything works (at least on par) before rolling it out to everyone. Risk reduction like this is key, especially if your app directly impacts the revenue stream of your business.

Gradually rolling out improvements will still be challenging, even in a fully modularized app. But with the right split (see below) you can at least solve this problem for some use cases.

### 8. Simplifies test automation
Besides unit tests and UI tests, it is also important to automate the key user flows to ensure they keep on working. On Android, we typically use Espresso for this kind of integration tests.

Now imagine we want to test the payment flow in a taxi application. Do you really want every test to:

1. log in a user first first
2. enter a destination on the map
3. pick the preferred taxi
4. pay for the ride (👈 interesting part)

No! Because this would not only make the test very slow (# steps), but it also makes them all fail when a bug appears in the login flow.

On the other hand, modularization (if done well) can enable the payment flow to be tested without having to step through other parts of the app. This speeds up tests, simplifies test setup and increases their reliability.

## Wrap-up
Modularization is incredibly powerful to speed up your builds, simplify development and fundamentally scale your team. On top of that, it enables interesting use cases such as instant apps and makes it easier to experiment with new technologies.

Make sure to follow me on {% include link_twitter.html %} and learn how to architect a multi module app [by reading part 2]({{ site.baseurl }}{% link blog/_posts/2019-03-18-modularizationarchitecture.md %}).
