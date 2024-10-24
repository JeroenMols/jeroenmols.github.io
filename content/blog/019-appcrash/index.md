---
title: Why your app should crash
published: true
tags:
- android
- crashes
- architecture
- cleancode
date: '2017-03-08'
slug: appcrash
featureimagecaption: Photo by Kenny Louie, https://creativecommons.org/licenses/by/2.0/,
  cropped
---

Too many times I've seen developers trying to avoid crashes at all cost. But are unhandled exceptions really that bad? And are null checks really the answer?

Actually, sometimes you want your app to crash. This post will explain why and give some practical tips.


## Prologue
In this post I focus on null checks for simplicity, but this can easily be generalized to any other edge case.


## The null check architecture
Let's say we have a simple application that shows a list of sports player:

```java
public void showPlayers(List<Player> soccerPlayers) {
  // some awesome code here
}
```

In a happy scenario, this will work, but what happens if the list is null?

Obviously can add an infamous null check:

```java
public void showPlayers(List<Player> soccerPlayers) {
  if (soccerPlayers == null) return;

  // some awesome code here
}
```

All settled!

Oh wait... the list can also be empty:

```java
public void showPlayers(List<Player> soccerPlayers) {
  if (soccerPlayers == null || soccerPlayers.isEmpty()) return;

  // some awesome code here
}
```

And what about the five layers of architecture `soccerPlayers` gets passed through below the UI? Should we also duplicate our checks in each of those layers in those?

Before you know it you'll have null checks everywhere!


## The null check problem
Obviously, null checks clutter your code significantly.

But that's not the only problem! Because once you're used to using them, you'll use them everywhere!

```java
public void showPlayers(List<Player> soccerPlayers) {
  if (soccerPlayers == null) return;

  if (myRecyclerView == null) return;

  if (myRecyclerView.getAdapter() == null) return;

  // some awesome code here
}
```

Even when you don't need them, you'll still add them!

Let that sink in for a second...

What is the exact problem here?

> An "innocent" null check can easily mask a bigger, more fundamental issue

Should `soccerPlayers` actually ever be null there in the first place? Or is it the responsibility of the lower levels of your app to return an empty list instead?

And what should happen when the `soccerPlayers` is actually null? Surely showing the user a completely blank screen by doing a `return`, right?

The latter actually means that your app will stop working "silently" in production without you having any way of detecting that!


## Crashes to the rescue
> If an app gets into a state it wasn't designed for, it should crash. There is no general way of handling that.

Methods shouldn't check their inputs for every possible scenario that can theoretically occur. Instead, you should carefully consider what the input can actually be and only prepare for that.

If your app gets in a state you didn't design it for, wouldn't that be something you would like to know ASAP?

Well in come our beloved exceptions!

Unhandled exceptions are great because they:

- notify you immediately by crashing the app
- highlight the problem instead of dying silently
- have a trace to pinpoint the problem
- are automatically backed up to your crashreporting

This obviously doens't mean that your app should crash for your users! All I'm saying is that if there is a problem in my app, I'd rather know about it by getting a crash report instead of not knowing.

Crash or not, for the end user it's the same: their app is broken.

And be reassured, you won't start bothering users with more crashes! Before rolling out to production you still have several safety nets: developer testing, QA department, beta testing, staged rollout,...

So even with this strategy, you can still get to 99,9% crash free users.

<center><blockquote class="twitter-tweet" data-conversation="none" data-lang="nl"><p lang="en" dir="ltr"><a href="https://twitter.com/molsjeroen">@molsjeroen</a> <a href="https://twitter.com/Jan_Joris">@Jan_Joris</a> we have maybe 100s of throw new IllegalStateException in our code base and our crash-free rate is 99.9%</p>&mdash; Said Tahsin Dane (@tasomaniac) <a href="https://twitter.com/tasomaniac/status/839943184729923586">9 maart 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></center>


## Practical tips
To clarify this approach and to help you kickstart implementing it:

1. Always design your app to be robust against any input outside of your control: responses from webservices, data entered in UI, incoming intents,...
2. Ensure data integrity at the point of entry in your app. This way invalid data (null, empty,...) cannot occur anywhere else in your app and you don't have to check for it.
3. If you're unsure a certain error situation can occur somewhere, assume it won't! During testing you'll find out (`RuntimeException`) if you're right.
4. If a certain method cannot be called in production, can only be called once,... throw an IllegalStateException.
5. Always test thoroughly before shipping to all your users. You'll catch the feared "crashes" before your users do.


## Wrap-up
Instead of being afraid of crashes, you should embrace them to find errors in your apps fasters. Crashes not only make errors immediately visible, they also offer a convenient way of debugging them via the stacktrace.

As always you can reach me on [Mastodon](https://androiddev.social/@Jeroenmols), or leave a comment below!
