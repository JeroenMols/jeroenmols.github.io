---
title: Android library development - Modularization
published: true
header:
  teaser: img/blog/librarymodularization/librarymodularization.jpg
  imgcredit: Photo by cottonbro from Pexels, https://www.pexels.com/photo/blue-and-black-audio-mixer-5658528/, cropped and resized
tags:
  - android
  - library
  - modularization
  - maven
  - gradle
  - kotlin
---
With modularization being all the hype, should you also modularize an SDK? Are fat aar files really needed? And how do you prevent internal APIs from being exposed on your public interface?

This post will cover all things modularization for Android libraries.

> This blog post is part of a series on Android libraries:
- Part 1: [Getting started]({{ site.baseurl }}{% link blog/_posts/2020-10-28-library-gettingstarted.md %})
- Part 2: [Modularization]({{ site.baseurl }}{% link blog/_posts/2020-11-04-library-modularization.md %})
- Part 3: [Transitive dependencies]({{ site.baseurl }}{% link blog/_posts/2020-11-11-library-dependencies.md %})

## Introduction
When building an SDK, one might be inclined to modularize the SDK as [modularization has tons of benefits]({{ site.baseurl }}{% link blog/_posts/2019-03-06-modularizationwhy.md %}).

However, there are two challenges with that:

1. submodule dependencies don't get included in the `.aar` file
2. public interface of submodules gets exposed

## Submodule dependencies
Imagine the following project setup:

```
├── app
├── library
└── modules
    ├── database
    └── ui-components
```

Here, the `app` module is an Android application that depends on the `library` module. And the `library` module depends on two other modules: `database` and `ui-components`.

[Remember that]({{ site.baseurl }}{% link blog/_posts/2020-10-28-library-gettingstarted.md %}) when a `library` module gets built, the `.aar` artifact will only include code and resources that are in the `library` module itself. It won't include:

- any code or resources from `database` and `ui-components`
- links to its transitive dependencies (these go into the `pom.xml`)

So when the `app` module directly includes the `library` as a Maven dependency, it would crash due to missing classes from `database` and `ui-components` on its classpath.

This is, unfortunately, a limitation of the current Android Gradle plugin, and there's been a [feature request](https://issuetracker.google.com/issues/62121508) open for more than 3 years now that's still unaddressed

There are three ways to solve this though:

1. release every submodule of your library directly to Maven
2. create a `fat .aar` that includes the submodules
3. create a single module SDK

### 1. Release submodules to Maven
Instead of publishing `library` to Maven, we could also publish `database` and `ui-components`. This way the `library` module can include them as a direct Maven dependency and add it as a transitive dependency to its `pom.xml`

```groovy
dependencies {
  implementation "com.jeroenmols:database:1.0.0"
  implementation "com.jeroenmols:ui-components:1.0.0"
}
```

However, this adds quite a bit of extra complexity. Because when a change is made to the `database` module, it now first has to be built, published and version updated in the `library` module before that module sees the changes.

This obviously has a significant impact on the day to day workflow for developers on the project! Moreover, it's mostly practical when there are a limited amount of submodules that only change infrequently.

These challenges don't mean this approach can't be successful though. The Android Jetpack libraries are the living proof of that, but it's also adopted by for instance the [Square In-App payments SDK](https://sdk.squareup.com/public/android/com/squareup/sdk/in-app-payments/).

### 2. Fat AAR
In the `fat .aar` solution, code and resources of the submodules are bundled into the main SDK module, hence creating a `fat .aar`. This can be done by using an external Gradle plugin such as [fat-aar-android](https://github.com/kezong/fat-aar-android).

To create a `fat .aar`, apply a plugin to the `build.gradle` file of the `library` and change its dependencies from `implementation` to `embed`:

```groovy
apply plugin: 'com.kezong.fat-aar'

...

dependencies {
    embed project(path: ':modules:database', configuration:'default')
    embed project(path: ':modules:ui-components', configuration:'default')
}
```

While the `fat .aar` solution works, it's not without its challenges either.

For starters, the `fat .aar` plugin breaks on almost every minor Android Gradle plugin update! This is because it hooks itself into particular tasks of the Android Gradle plugin and these very often get renamed/moved. However, the project maintainer does a stellar job at fixing those within a few weeks after the breaking change.


Also, because of the way `fat .aar` references dependencies from submodules, it can significantly increase the binary size of your SDK. There is a way to solve that by using `compileOnly` for SDK submodule dependencies, but I'm not going to cover that in-depth here.

### 3. Single module SDK
Quite obvious, but with a single module SDK this problem simply doesn't exist.

## Public interface pollution by submodules
Kotlin has four different visibility modifiers:

- `private` - visible inside this class only
- `protected` — same as private + visible in subclasses too
- `internal` — visible to all classes inside this module
- `public` — visible to all classes

Notably absent here is a modifier that's internal to the project, yet visible across different modules.

So when the `database` module wants to make its methods accessible to the `library`, it will need to mark those methods as public!

However, that won't just cause them to be `accessible` to the `library`, it will also make those methods accessible to any application using the `library`! Hence exposing SDK internals to the outside world.

While this limitation is fundamental to Kotlin (and Java), there are a few ways to mitigate this:

1. move all internal APIs to an "internal package"
2. obfuscate all non-public classes in the SDK using R8/proguard
3. create a single module SDK

### 1. Internal package
The first solution is to move all classes that aren't intended for public use to a package name that has `internal` in its name. This discourages (but not prevents!) others from using it.

```kotlin
package com.jeroenmols.internal.database
```

For example OkHttp has an [okhttp.internal package](https://github.com/square/okhttp/tree/master/okhttp/src/main/kotlin/okhttp3/internal).

### 2. Proguard/R8
A more aggressive solution is to use Proguard/R8 to obfuscate each interface that isn't supposed to be public.

```kotlin
a.a.a
```

However, these class names no longer have a unique package prefix! Hence this could lead to class name collisions with other libraries that do the same.

Fortunately, there is an option to repackage classes under your own namespace to avoid collisions in `proguard-rules.pro`:

```prolog
repackageclasses com.jeroenmols.internal
```

This will make sure every obfuscated class will be flattened in the package specified.

```kotlin
com.jeroenmols.internal.a
```

The main downside of this approach is that Proguard/R8 isn't trivial to set up correctly, so expect some frustration and test well.

> Note: both these strategies aren't mutually exclusive! I've successfully combined both to reduce an SDK API surface.

### 3. Single module SDK
Finally, there is the third option of building a single module SDK and using the internal modifier to prevent classes/methods from being exposed publicly.

## Recommendation
While modularization is almost always a good idea for an App, the same can't be said for SDKs. This is mainly because the tooling is lacking proper support for building Android libraries.

Therefore I recommend making small and even mid-sized SDKs single module and organize code in packages instead.

Whenever an SDK grows larger, it likely contains parts that could also be useful as a stand-alone library. Hence it might make sense to split the SDK and develop and deploy a few small spin-offs.

Multi modules SDKs should be avoided as much as possible.

## Wrap-up
Modularizing SDKs on Android unfortunately creates significant issues with packaging and restricting visibility of code. Therefore single module SDKs should be preferred.

Don't forget to follow me on {% include link_twitter.html %} and don't miss the last part about [transitive dependencies]({{ site.baseurl }}{% link blog/_posts/2020-11-11-library-dependencies.md %})!

Feel free to leave a comment below!
