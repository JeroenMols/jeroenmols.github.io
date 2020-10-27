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
- Part 1: Getting started
- Part 2: Modularization
- Part 3: Transitive dependencies

## Modularization
When building an SDK, one might be inclined to modularize the SDK as [modularization has tons of benefits]({{ site.baseurl }}{% link blog/_posts/2019-03-06-modularizationwhy.md %}).

However, there are two challenges with that:

1. submodule dependencies don't get included in the `.aar` file
2. public interface of submodules gets exposed

### 1. Submodule dependencies
Imagine the following project setup:

```
├── app
├── library
└── modules
    ├── database
    └── ui-components
```

Here, the `app` module is an Android application that depends on the `library` module. And the `library` module depends on two other modules: `database` and `ui-components`.

Now when the `library` module gets built, the `.aar` artifact will only include code and resources that are in the `library` module itself. It won't include:

- any code or resources from `database` and `ui-components`
- links to its transitive dependencies (these go into the `pom.xml`)

So when the `app` module directly includes the `library` as a Maven dependency, it would crash due to missing classes from `database` and `ui-components` on its classpath.

This is, unfortunately, a limitation of the current Android Gradle plugin, and there's been a [feature request](https://issuetracker.google.com/issues/62121508) open for more than 3 years now.

There are three ways to solve this though:

1. release every submodule of your library directly to Maven
2. create a `fat .aar` that includes the submodules
3. create a single module SDK

The first solution requires to build & deploy each "affected" submodule on every code change. Hence it's mostly practical when there are a limited amount of submodules that change infrequently.

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

While the `fat .aar` solution works, it's not without its challenges either:

- It breaks on almost every major Android Gradle plugin update -> gets fixed within a few weeks after a breaking change
- It can significantly increase the binary size of your SDK due to the way it includes resources -> solvable by using `compileOnly` dependencies

This leaves the third option on the table: a single module SDK, which I honestly would recommend for small and even mid-sized SDKs.

### 2. Public interface submodules
Kotlin has four different visibility modifiers:

- private - visible inside this class only
- protected — same as private + visible in subclasses too
- internal — visible to all classes inside this module
- public — visible to all classes

Notably absent here is a modifier that's internal to the project, yet visible across different modules.

So when the `database` module wants to make its methods accessible to the `library`, it will need to mark those methods as public!

However, that won't just cause them to be `accessible` to the `library`, it will also make those methods accessible to any application using the `library`! Hence exposing SDK internals to the outside world.

While this limitation is fundamental to Kotlin (and Java), there are a few ways to mitigate this:

1. move all internal APIs to and "internal package"
2. obfuscate all non-public classes in the SDK using R8/proguard
3. create a single module SDK

The first solution is to move all classes that aren't intended for public use to a package name that has `internal` in its name. This discourages (but not prevents!) others from using it. For example [OkHttp has an okhttp.internal package](https://github.com/square/okhttp/tree/master/okhttp/src/main/kotlin/okhttp3/internal).

A more aggressive solution is to use Proguard/R8 to obfuscate each interface that isn't supposed to be public. However, this could lead to class name collisions with other libraries that do the same.

Fortunately, there is an option to repackage classes under your own namespace to avoid collisions in `proguard-rules.pro`:

```prolog
repackageclasses com.jeroenmols.internal
```

This will make sure every obfuscated class will be flattened in the package specified.

I've combined both the first and second strategy to reduce an SDK API surface. This has worked well, but just bear in mind that Proguard isn't trivial to set up correctly.

Finally, there is the third option of just building a single module SDK and using the internal modifier to restrict access. This is what I would recommend for both small and mid-sized SDKs.

_Are you noticing a pattern here?_

## Wrap-up
// modularization conclusion

While SDK and App development looks seemingly similar, the former poses some unique challenges. Modularization poses some unique challenges and transitive dependencies can be quite complex to get right.

If you've made it this far you should probably follow me on {% include link_twitter.html %}. Feel free to leave a comment below!
