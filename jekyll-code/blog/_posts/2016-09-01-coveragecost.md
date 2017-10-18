---
title: The hidden cost of code coverage
published: true
header:
  image: img/blog/coveragecost/coveragecost.png
  imgcredit: Photo by Steve Buissinne, https://creativecommons.org/publicdomain/zero/1.0/deed.en, cropped
tags:
  - android
  - tools
  - gradle
  - testing
---
Code coverage is an awesome way to motivate you and your team to write more tests. But did you know that simply enabling it slows down your build significantly?

This blogpost will detail why and offer an easy solution.


## Impact on build speed
Profiling your Gradle build speed can easily be done using the `--profile` option:

```groovy
./gradlew clean assembleDebug --profile
```

When profiling a project recently, I noticed something surprising in the generated report:

[![Jacoco task takes up 14% of the build time! (report located in the `build/reports/profile` folder)]({{ site.url }}{{ site.baseurl }}/img/blog/coveragecost/buildtime.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/coveragecost/buildtime.png)

The Jacoco task takes up almost 12 second, accounting for 14% of the build time!

That's crazy! Especially because our build command isn't even running any test.

Looking at our `build.gradle` file it is clear that we're not really doing anything exotic:

```groovy
buildTypes {
    debug {
        ...
        testCoverageEnabled true
    }
}
```

Yet this still causes delays in all debug builds.


## The solution
Ask yourself when do you need code coverage? At most after running unit tests, but probably only after running a CI build.

Hence we're going to introduce a very simple flag `-Pcoverage` which we can add to the build command:

```groovy
./gradlew -Pcoverage clean connectedDebugAndroidTest
```

All you need to do to make this work is a small modification to your `build.gradle` file:

```groovy
buildTypes {
    debug {
        ...
        testCoverageEnabled (project.hasProperty('coverage') ? true : false)
    }
}
```

And now code coverage will run when you add the flag and won't run when you don't add it!

>
Note that you can also add this flag to the test configuration in Android Studio if you also want to have coverage enabled while running tests locally.


## Wrap-up
Code coverage is a great way to track your testing efforts. With help of a simple flag you can easily avoid it from slowing down your normal development builds.

As always you can reach me {% include link_twitter_molsjeroen.html %} on twitter, or leave a comment below!
