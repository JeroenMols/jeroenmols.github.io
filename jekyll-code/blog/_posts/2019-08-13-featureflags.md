---
title: Feature Flags - Why you should care
published: false
header:
  teaser: img/blog/featureflags/featureflags.jpg
  imgcredit: Photo by Gabriel on Unsplash, https://unsplash.com/photos/iynyPZ8shPk, cropped
tags:
  - android
  - firebase
  - feature flags
  - software engineering
  - tools
---
One of the key ingredients to speed up modern software development is using feature flags. However, they can still be quite a drag to integrate into your app as existing feature flag frameworks mostly focus on the remote toggling aspect of feature flags.

This mini-series will explain what the benefits of using feature flags are and propose a handy architecture that enables local feature flag configuration, remote configuration, and easy testability.

> This blog post is of a series on feature flags:
- Part 1: Why you should care
- Part 2: A successful architecture

## Why feature Flags
The key benefit of using feature flags is that they decouple development from app releases. This doesn't just mean that features can already be merged when they are still incomplete, but even completed features can remain hidden for a while until you are ready to release them.

Let's see how that helps developers: when adding a feature flag, incomplete features can already be merged! That's handy because now we don't need to fully develop a feature before merging it. Hence we can split a feature into many smaller increments and merge those branches one by one.

![Thanks to feature flags, development of new features can be split into many small increments]({{ site.url }}{{ site.baseurl }}/img/blog/featureflags/smaller_branches.png)

These smaller branches aren't just easier to review (fewer files), but their difference with master is smaller so they are a lot easier to merge (fewer merge conflicts). And the easier it is to merge pull requests, the faster that will happen and the faster development will move ahead.

Secondly, feature flags also help with releasing: because feature flags allow hiding new features from users, your app can still release with the feature off if testing finds a last-minute issue on a particular new feature.

Even more, when a feature is ready to ship, you can gradually roll it out to new users and make a data-driven decision on whether it should be rolled out further. That dramatically de-risks rolling out new features. At Philips Hue, we recently rewrote one of our most important screens and rolled it out over 10 days to make sure users weren't negatively impacted.

Finally, there are commercial benefits: new features that are time-critical can already be built ahead of time and then only launched when you are ready to announce them. This was especially useful at Philips Hue where we need to time app launches together with new product introductions.

Also, improvements to new features can be built side by side the old feature and using A/B tests you can then decide which feature should remain.

## Requirements of good feature flags
Now that we know that feature flags can be quite useful, let's take a minute and think about what we need to make feature flags work.

First and foremost: it must be incredibly easy to add a new feature flag. The easier that is, the more you will do it and the more you'll benefit from them. In the next post, we'll see how we can define feature flags using one single line of code!

Next, we need to be able to toggle feature flags both locally and remotely. For developer (debug) builds, you want predictable, easy access to feature flags. Hence there should be some screen in the app where you can see the current state of all feature flags and toggle them. Ideally, this UI should even be auto-generated.

On the other hand, for production (release) builds, you want to be able to remotely toggle the feature flags. Hence they should also be remotely available, which is typically provided by a framework like [Firebase Remote Config](https://firebase.google.com/docs/remote-config).

In terms of feature flag values, we are going to restrict ourselves to just boolean flags. Having binary values keeps things simple, both from a development perspective as conceptually: something is either on or off. Once you have several coexisting feature flags, the configuration can become quite confusing with just binary values, let alone if strings or integers are allowed. This simplification also allows to elegantly generate the UI for our feature flags later on.

We do need more than just feature flags though! Apps typically also have a dynamic configuration that you only use in the debug build type: logging, leak canary, espresso idling resources, development backend, bypass onboarding, simulate a crash... All of these are "test settings" that facilitate testing or debugging your app. Wouldn't it be nice if you could also turn these on or off using a built-in UI?

![Feature flags allow to toggle features on or off, whereas test stettings allow to dynamically configure the behavior of the app]({{ site.url }}{{ site.baseurl }}/img/blog/featureflags/testsettings.png){: .align-center .width-half}

Tests settings don't just ease development and testing, but they also reduce the need to build flavors. Instead of having a separate flavor for leak canary or logging or espresso idling resources or ... these now become a configuration that you can turn on or off on demand!

That is pretty handy, because typically for debug builds you want to have complete predictability: you don't want your debug build to suddenly behave differently because a remote feature flag has changed. (that would make your tests wildly flaky) But you also want to test that your remote feature flagging is working. However, thanks to test settings you can just enable/disable the remote feature flagging on demand!

Contrary to feature flags, test settings are long-lived and are never shipped directly to users.

Finally, we should be able to easily toggle feature flags on/off in automated tests and we don't want to lock ourselves into a particular framework. So it should be easy to swap to a different remote feature flag tool later on.

> Wrapping it all up, feature flags should be:
> - very easy to add
> - locally and remotely available
> - binary in value
> - cater for both features and test settings
> - configurable for automated tests
> - agnostic of the used remote feature flag tool

## Integrating feature flags
Roughly there are two ways you could use a feature flag: for new features and existing features.

The easiest to use feature flags is for new features as this can often be neatly integrated into the UI, often even with a single if statement. For instance, at Philips Hue, we built a new feature to configure the start-up behavior of your lights and the feature toggle just showed/hid the menu item that gave access to the feature.

```kotlin
if (isFeatureEnabled(POWER_ON_BEHAVIOR)) {
    menuitem.visibility = View.VISIBLE
} else {
    menuitem.visibility = View.GONE
}
```

![Feature flagging a new feature by showing or hiding a menu item]({{ site.url }}{{ site.baseurl }}/img/blog/featureflags/featureflag_menuitem.png)

The same principle can also be used for showing an extra tab or an extra UI element and give access to the new feature. Some features might even require several if statements in several locations, but try to keep the number of ifs per feature to a minimum.

While refactoring existing code, on the other hand, the situation is slightly more complex. In the ideal case, there is an old code path that you simply replace by a new one:

```kotlin
fun withLegacy() {
    if (isFeatureEnabled(LOGIC_REFACTOR)) {
        var code = NewLogic()
        code.with(UnitTests())
    } else {
        var code = LegacyLogic()
        code.with(OutUnitTests())
    }
}
```

While you ideally want to do every refactoring behind a feature flag, that wouldn't be very practical. This is because the overhead involved in creating the feature flag and adding monitoring analytics can be too big for minor refactorings. And sometimes code can simply be so interconnected with everything else that you can't cleanly surround one code path with a feature flag.

The best way to handle these cases is to think impact based: if you're refactoring a crucial part of your business logic then you should take more actions to ensure nothing accidentally breaks. Here splitting the refactoring into several small steps (and shipping them), or using a feature flag might be wise.

To give you an example, at Philips Hue we replaced our Geofence implementation with a new one a while ago. Here the `IntentService` handling the geofence starts with an if statement that either runs the old or new code and there are extra analytics in place to monitor the behavior.

## Rollout
When you can choose between doing a big bang feature release or gradually rolling out a feature, I'm sure most would prefer to have the latter. However, life isn't always as simple and in reality, your marketing department might want to create some buzz around the newly launched feature. In that case, it's not that handy if it isn't available to all users yet.

To combine the best of both worlds, you can strive to roll out as many features as possible in a gradual fashion. That typically applies to small new features, refactorings of critical business logic or rewrites of existing features. A key aspect in doing this successfully is adding extra analytics events, defining clear KPIs and putting a dashboard in place to monitor everything.

![Dashboard to monitor the roll out of a new feature]({{ site.url }}{{ site.baseurl }}/img/blog/featureflags/dashboard.png)

When you can't roll out a feature gradually, you can still derisk its launch using remote feature flags. Just make sure to wrap up feature development early so you have time to use a remote feature flag to test it in your beta community. This allows learning how it behaves in the wild, while still allowing you to promote that exact build to production (with feature flag turned off).

Once confident that the feature works well in beta, you can hardcode the feature flag to be on in the next app release. Make sure though to only remove the feature flag from your codebase and clean up the code once you see the feature working well for all users. That still provides a way out, you never know.

Finally, note that it's crucial to roll out features as quickly as possible. This is because feature flags can create a lot of confusion around what feature flags are on or of in production and after a while you can even get dependencies between different feature flags! Like always releasing fast is key to reducing the complexity, followed by a swift clean up of rolled out feature flags.

## Wrap-up
Feature flags are an incredibly powerful tool to speed up development: they allow to merge incomplete features and derisk app release by allowing gradual rollouts. They should be incredibly easy to add, usable in automated tests and you should be able to toggle them remotely for production use and locally for development and testing.

Make sure you follow me on {% include link_twitter.html %} so you don't miss part 2 were will discuss an architecture to integrate feature flags into your app.
