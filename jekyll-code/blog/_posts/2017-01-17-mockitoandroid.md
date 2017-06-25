---
title: Using Mockito 2.x on Android
published: true
header:
  image: img/blog/mockitoandroid/mockitoandroid.png
  imgcredit: Android logo by Google, https://creativecommons.org/licenses/by/3.0/, cropped. Mockito logo, https://github.com/mockito/mockito, unmodified.
tags:
  - android
  - mockito
  - testing
---
The Mockito team is on fire lately! Not only did they add support to mock final classes and methods, but now they allow running Mockito directly onto an actual Android device.

Time to convert our Mockito 1.x projects to 2.x!

## History
It has always been possible to run Mockito on Android devices and emulators. This however required using a tool called `Dexmaker` to help Mockito generate classes in the Android virtual machine.

While this approach worked fine, there was one big caveat: `Dexmaker` wasn't actively maintained. Consequently it was only compatible with Mockito 1.x so you couldn't use the new stuff while running tests on an Android device.

Further this extra dependency made your `build.gradle` look like this:

```groovy
dependencies {
    ...

    testCompile 'org.mockito:mockito-core:2.6.3'

    androidTestCompile 'org.mockito:mockito-core:1.10.19'
    androidTestCompile 'com.crittercism.dexmaker:dexmaker:1.4'
    androidTestCompile 'com.crittercism.dexmaker:dexmaker-dx:1.4'
    androidTestCompile 'com.crittercism.dexmaker:dexmaker-mockito:1.4'
}
```

Notice the 2.x version for the unit tests and the 1.x version for the instrumentation tests.

Fortunately, Mockito 2.6.0 changed that:

<center><blockquote class="twitter-tweet" data-lang="nl"><p lang="en" dir="ltr">We have just released Mockito 2.6 with native support for Android. On Android, just use the mockito-android dependency. Test code stays!</p>&mdash; Rafael Winterhalter (@rafaelcodes) <a href="https://twitter.com/rafaelcodes/status/819525418231496705">12 januari 2017</a></blockquote></center>

<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>


## Mockito 2.6.0+
The latest release added a new artifact `mockito-android` next to the existing `mockito-core` artifact.

So to convert your existing instrumentation tests, just remove the `Dexmaker` dependencies and replace the `mockito-core` dependency with its `mockito-android` equivalent:

```groovy
dependencies {
    ...

    testCompile 'org.mockito:mockito-core:2.6.3'

    androidTestCompile 'org.mockito:mockito-android:2.6.3'
}
```

Simple, elegant and future proof!

Finally, please be aware that Mockito 2.x has some [behavior changes](https://github.com/mockito/mockito/wiki/What%27s-new-in-Mockito-2#incompatible). The one you're most likely going to run into while migrating is that `anyX()` and `any(SomeType.class)` matchers now reject null values.


## Wrap-up
Finally Mockito has first class support for Android instrumentation tests! I've also updated my [Mockito sample project](https://github.com/jeroenmols/mockitoexample) where you can see how it works and learn more about how to use Mockito.

As always you can reach me [@molsjeroen](https://twitter.com/molsjeroen) on twitter, or leave a comment below!
