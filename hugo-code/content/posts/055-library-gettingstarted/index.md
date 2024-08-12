---
title: Android library development - Getting started
published: true
header:
  teaser: img/blog/librarygettingstarted/librarygettingstarted.jpg
  imgcredit: Photo by mentatdgt from Pexels, https://www.pexels.com/photo/library-photo-1319854/,
    cropped and resized
tags:
- android
- library
- maven
- gradle
- kotlin
date: '2020-10-28'
slug: library-gettingstarted
---

Having switched to Android SDK development over the past year, I've run into quite a few interesting and unexpected challenges. So how does library development differ from app development?

This mini-series will cover the differences between SDK and App development, and explore some interesting challenges around SDK modularization and transitive dependencies.

> This blog post is part of a series on Android libraries:
- Part 1: [Getting started]({{ site.baseurl }}{% link blog/_posts/2020-10-28-library-gettingstarted.md %})
- Part 2: [Modularization]({{ site.baseurl }}{% link blog/_posts/2020-11-04-library-modularization.md %})
- Part 3: [Transitive dependencies]({{ site.baseurl }}{% link blog/_posts/2020-11-11-library-dependencies.md %})

## Introduction
Before kicking off the meat of this series, let's have a quick look at how SDK development differs from app development. If you're already familiar with these concepts, feel free to skip to the next article!

Note that the term SDK or Android library will be used interchangeably.

## Anatomy of a library
A getting started Android SDK project typically contain of at least two modules:

- `app` module to test out the SDK
- `library` module that contains all SDK code and resources

[![Project with app and library module]({{ site.url }}{{ site.baseurl }}/img/blog/librarygettingstarted/app_with_projectlibrary.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/librarygettingstarted/app_with_projectlibrary.png)

In this, the `app` module has a direct dependency on the `library` module:

```groovy
dependencies {
  implementation project(':library')
}
```

And the folder structure looks like this:

```
.
├── app
└── library
```

The `library` module has the `com.android.library` plugin in its `build.gradle` file:

```groovy
apply plugin: 'com.android.library'
```

> Notice how everything so far is exactly the same as developing a submodule in a multi-module app!

## Building a library
Similar to building the application, the library can be built using a Gradle task:

```groovy
./gradlew :library:assembleRelease
```

However, the output won't be an `.apk` file (or `.aab` [when using App Bundles](https://developer.android.com/platform/technology/app-bundle)).  Instead it will be an Android Archive (or `.aar`) file, placed in the build folder of the `library` project:

```
library/build/outputs/aar/library-release.aar
```

This `.aar` file is very similar to a Java Archive (`.jar`) file, but it can also contain Android XML resources.

> Note that `.aar` files aren't signed, so in contrast to creating an `.apk` file, no signing config is required to create the release variant of the Android library.

## Deploying a library
However, customers shouldn't directly copy-paste the SDK source code into their project. Instead, they should consume the library as a [Maven dependency](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html):

```xml
dependencies {
  implementation "com.jeroenmols:library:1.0.0"
}
```

Resulting in the following project setup:

[![App that consumes library through Maven]({{ site.url }}{{ site.baseurl }}/img/blog/librarygettingstarted/app_with_externallibrary.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/librarygettingstarted/app_with_externallibrary.png)

To make this possible, the library needs to be deployed to a public Maven repository such [Maven Central](https://search.maven.org/) or [Bintray](https://bintray.com/) (jcenter). Which can be done by configuring the Gradle publishing plugin.

> This blog post won't cover how to publish your library, instead have a look at this [great article by Andrew Kelly](https://medium.com/devnibbles/publishing-your-first-android-library-to-bintray-da08c8a76e1a) if you're looking to learn.


## External dependencies
But as the `library` evolves, it might also start depending on Maven dependencies of its own! Imagine that the `library` would also depend on `OkHttp`:

[![Project with app and library module that has an external dependency]({{ site.url }}{{ site.baseurl }}/img/blog/librarygettingstarted/library_with_externaldependency.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/librarygettingstarted/library_with_externaldependency.png)

This means that the customer application needs to depend on both `library` and `OkHttp`:

[![Project with app and library module that has an external dependency]({{ site.url }}{{ site.baseurl }}/img/blog/librarygettingstarted/app_with_library_with_externaldependency.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/librarygettingstarted/app_with_library_with_externaldependency.png)

Why?

Because `.aar` files only contain code and resources of the `library` module that was used to build it! So the `.aar` file of the library won't contain any `OkHttp` code, nor any indication that it requires `OkHttp` to run.

Consequently, customer applications need to include both the `library` and `OkHttp` as a dependency.

```xml
dependencies {
  implementation "com.jeroenmols:library:1.0.0"
  implementation "com.squareup.okhttp3:okhttp:4.9.0"
}
```

> Notice that this did work when `library` is a submodule of a project! Then the `build.gradle` file of the `library` includes the `OkHttp` dependency and Gradle will include it into the `.apk` while building.


## Transitive dependencies
Wouldn't it be nice if the `OkHttp` dependency could be automatically included in the customer application?

That way customers simply have to add:

```xml
dependencies {
  implementation "com.jeroenmols:library:1.0.0"
}
```

And get the `OkHttp` dependency indirectly through the dependency on `library`. This is what we call a transitive dependency: `OkHttp` is a transitive dependency of the `library` and hence an indirect dependency of the customer application.

But how can Gradle know to include `OkHttp` in the customer app after adding the `library` as a dependency?

That's taken care of by the `pom.xml` file that gets created when you deploy your app to a Maven repository (such a [Maven Central](https://search.maven.org/)).

Here's an example `pom.xml` for the `library`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.jeroenmols</groupId>
  <artifactId>library</artifactId>
  <version>1.0.0</version>
  <name>library</name>
  <dependencies>
    <dependency>
      <groupId>com.squareup.okhttp3</groupId>
      <artifactId>okhttp3</artifactId>
      <version>4.9.0</version>
      <scope>compile</scope>
    </dependency>
  </dependencies>
</project>
```

So when building an Android library, there are two key outputs:

- `.aar` file: a binary containing all library code and resources
- `pom.xml` file: containing all transitive dependencies

> In reality, there can be many more files (Javadoc, sources,...). Have a look at the Files tab of the [Maven entry for OkHttp](https://bintray.com/bintray/jcenter/com.squareup.okhttp3%3Aokhttp/4.9.0#files/com%2Fsquareup%2Fokhttp3%2Fokhttp%2F4.9.0).

For more information on how to generate a `pom.xml`, have a look at [this post by Marco Gomiero](https://medium.com/swlh/how-to-publish-and-distribute-your-android-library-ce845c68c7f7).

## Testing
Finally, for Android libraries with external dependencies, there will be a difference between a local build of the SDK or a Maven build.

If the SDK source code is within a project, then transitive dependencies will automatically be included when the application is built.

However, when the SDK is included through Maven, those transitive dependencies will only be included when the `pom.xml` file is properly constructed and deployed to Maven.

Therefore it is always important to test the actual SDK artifact as a Maven dependency before shipping a new release!


## Wrap-up
Android libraries are built into a special `.aar` format that includes all code and resources. For all its external dependencies, a `pom.xml` needs to be deployed alongside to the Maven repository.

Don't forget to follow me on [Mastodon](https://androiddev.social/@Jeroenmols) and enjoy reading the next post on [SDK modularization]({{ site.baseurl }}{% link blog/_posts/2020-11-04-library-modularization.md %})!

Feel free to leave a comment below!
