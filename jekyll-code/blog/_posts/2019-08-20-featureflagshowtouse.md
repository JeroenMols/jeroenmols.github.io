---
title: Feature Flags - How to use
published: true
header:
  teaser: img/blog/featureflagshowtouse/featureflagshowtouse.jpg
  imgcredit: Photo by SpaceX on Unsplash, https://unsplash.com/photos/OHOU-5UVIYQ, cropped
tags:
  - android
  - firebase
  - feature flags
  - software engineering
  - tools
---
Empowered with what feature flags are and why they are useful, let's see how we can actually integrate them into an app. And how can we roll them out to our users?

This mini-series will explain the benefits of using feature flags and propose a handy architecture that enables local feature flag configuration, remote configuration, and easy testability.

> This blog post is part of a series on feature flags:
- Part 1: [Why you should care]({{ site.baseurl }}{% link blog/_posts/2019-08-13-featureflags.md %})
- Part 2: [How to use]({{ site.baseurl }}{% link blog/_posts/2019-08-20-featureflagshowtouse.md %})
- Part 3: [A successful architecture]({{ site.baseurl }}{% link blog/_posts/2019-09-12-featureflagsarchitecture.md %})

## Integrating feature flags
Roughly there are two ways you could use a feature flag: for new features and existing features.

### New features
Let's start with the easiest way: use feature flags for new features. A new feature typically includes some UI that's either in a new screen (e.g. a complete new tab) or a new part of a screen (e.g. new social provider in login). In these cases the feature flag is usually a single if statement that shows/hides that part of the UI.

For instance, at Philips Hue, we built a new feature to configure the start-up behavior of your lights and the feature toggle just showed/hid the menu item that gave access to the feature.

```kotlin
if (isFeatureEnabled(POWER_ON_BEHAVIOR)) {
    menuitem.visibility = View.VISIBLE
} else {
    menuitem.visibility = View.GONE
}
```

![Feature flagging a new feature by showing or hiding a menu item]({{ site.url }}{{ site.baseurl }}/img/blog/featureflagshowtouse/featureflag_menuitem.png)

The same principle can also be used for showing an extra tab or an extra UI element that gives access to the new feature. Some features might even require several if statements in several locations, but try to avoid that if you can as that complicates things.

### Existing features
While refactoring existing code, on the other hand, the situation is slightly more complex. In the ideal case, there is an old code path that you simply replace with a new one:

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

Notice how you need to duplicate existing code before refactoring start! If not, you can no longer toggle the feature off and all the feature flag benefits disappear...

Ideally you should do every refactoring behind a feature flag, but the simply isn't practical. Sometimes the overhead of keeping the original code path intact is simply too big for a minor refactoring. Or some code can even be so interconnected that it's impossible to cleanly surround one code path with a feature flag.

The best way to handle these cases is to think impact based: if you're refactoring a crucial part of your business logic then you should take more actions to ensure nothing accidentally breaks. This can either be splitting the refactoring into several small steps (and shipping them), using a feature flag or both.

To give you an example, at Philips Hue we replaced our Geofence implementation with a new one a while ago. Here the `IntentService` handling the geofence starts with an if statement that runs either the old or new code. Note that there are also extra analytics in place to monitor and compare the behavior.

```kotlin

class GeofenceIntentService : IntentService() {

    override fun onHandleIntent(intent: Intent?) {
        if (isFeatureEnabled(GEOFENCE_REWRITE)) {
            GeofenceRewrite.onHandleIntent(intent)
        } else {
            LegacyGeofence.onHandleIntent(intent)
        }
    }
}

```

## Rollout
What would you choose: a big bang feature release to all users or gradually rolling out a feature? Well, thanks to the [first post]({{ site.baseurl }}{% link blog/_posts/2019-08-13-featureflags.md %}) we know the second option is a lot less risky.

In reality, however, your marketing department might want to create some buzz around the newly launched feature. In that case, you must do a big bang roll out to all users or some users reading the announcement wouldn't have access to the feature yet!

To combine the best of both worlds, you can strive to roll out as many features as possible in a gradual fashion. That typically applies to:

- small new features (e.g. more stock images)
- refactoring of critical business logic (e.g. geofence IntentService rewrite)
- rewrites of existing features (no visible change to the users)

A key aspect in doing this successfully is adding extra analytics events, defining clear KPIs and putting a dashboard in place to monitor everything.

![Dashboard to monitor the roll out of a new feature]({{ site.url }}{{ site.baseurl }}/img/blog/featureflagshowtouse/dashboard.png)

In the above dashboard, the performance of both old and rewritten features is measured. The Y-axis indicates how many users successfully completed the feature and the X-axis shows how long it took them to complete it. Here the rewritten feature clearly outperform the old feature and we should fully remove the old one in the next release.

When you can't roll out a feature gradually, you can still derisk its launch using remote feature flags. Just make sure to wrap up feature development early so you have time to use a remote feature flag to test it in your beta community. This allows learning how the code behaves in the wild, while still allowing you to promote that exact build to production (with feature flag turned off).

![How to roll out a feature flag in a non gradual, big bang fashion]({{ site.url }}{{ site.baseurl }}/img/blog/featureflagshowtouse/featureflags_rolloutnongradual.jpg)

Once confident that the feature works well in beta, you can hardcode the feature flag to be on in the next app release. Better to still leave both code paths in your code base at this stage though, that still provides an easy way to hotfix, you never know. Once the code is behaving properly in production, you can remove the old code path.

Finally, note that it's crucial to roll out features as quickly as possible. This is because feature flags can create a lot of confusion around what feature flags are "on" or "off" in production and after a while you can even get dependencies between different feature flags! Like always releasing fast is key to reducing the complexity, followed by a swift clean up of rolled out feature flags.

## Wrap-up
Feature flags can help in releasing new features and improvements on existing functionality. Always try to roll out features gradually, if that's not possible, rely on your beta community to test the feature prior to release,

Make sure you follow me on [Mastodon](https://androiddev.social/@Jeroenmols) or continue to [part 3]({{ site.baseurl }}{% link blog/_posts/2019-09-12-featureflagsarchitecture.md %}) to learn more about an architecture to integrate feature flags into your app.
