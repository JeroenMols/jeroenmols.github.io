---
title: Migrating away from JCenter
published: true
tags:
- android
- library
- maven
- jcenter
- bintray
- transitive dependencies
- gradle
date: '2021-02-04'
slug: migratingjcenter
featureimagecaption: Photo by William Bossen from Unsplash, https://unsplash.com/photos/CeL6SfbXCx8,
  cropped and resized
---

This week JFrog - out of nowhere - announced to completely remove their Maven repository. Since they'll pull it offline already by May 2021 (!!!) it's time to urgently migrate away. This blogpost will guide how to get started.

## Expected migrations
After the [jcenter/bintray shutdown announcement](https://jfrog.com/blog/into-the-sunset-bintray-jcenter-gocenter-and-chartcenter/), there are two main migrations steps required:

- consumed dependencies from Bintray/JCenter
- published artifacts to Bintray/JCenter

Let's have an in-depth look at both.

## Consumed dependencies from Bintray/JCenter
These are dependencies that your app or library directly uses in one of its `dependencies` blocks in `build.gradle`.

To understand what needs to happen, let's first have a look to see how Gradle fetches dependencies. Imagine a project with multiple defined repositories in the top-level `build.gradle` file:

```groovy
// Top-level build.gradle file
allprojects {
  repositories {
      google()
      jcenter()
  }
}
```

```groovy
// App (or module) level build.gradle file
dependencies {
  implementation 'com.jeroenmols:mylibrary:1.0.0'
}
```

In this example, Gradle will first look for `com.jeroenmols:mylibrary` in the `google()` Maven repository. If it can't find the artifact there, it will look in `jcenter()` instead.

> Note that `jcenter` is a superset of Maven Central. So when you request `jcenter` for a Maven artifact that it doesn't host itself, it will go and fetch it from Maven Central for you.

Two things are important to note here:

1. the order in which repositories are defined matters
2. most artifacts come from `mavenCentral()`, hosted through `jcenter()`

To fully migrate away from `jcenter()`, all we need to do is replace all `jcenter()` occurrences with `mavenCentral()` in all `build.gradle` files.

For my projects this meant:

```diff
// Top level build.gradle file
buildscript {
  repositories {
    google()
-   jcenter()
+   mavenCentral()
  }
}
...

allprojects {
  repositories {
-   jcenter()
+   mavenCentral()
  }
}
```

```diff
// buildSrc level build.gradle file
repositories {
- jcenter()
+ mavenCentral()
}
```

After replacing all repositories, we can test if our build still passes by running the following command:

```bash
./gradlew assemble assembleDebugUnitTest assembleAndroidTest --refresh-dependencies
```

This will ensure all dependencies for every build type are downloaded again. Such a "clean" build will assess whether your app can be built independently of `jcenter()`.

If this command passes, congratulations you've successfully migrated your dependencies away from `jcenter`. Nothing more to do.

When this command fails, however, it will print out all issues you may have:

```bash
* What went wrong:
Could not determine the dependencies of task ':app:lintVitalRelease'.
> Could not resolve all artifacts for configuration ':app:debugCompileClasspath'.
   > Could not find com.jeroenmols:mylibrary:1.0.0.
     Required by:
         project :app
```

This doesn't just mean we can't remove `jcenter()` from our projects yet. But keeping `jcenter()` as a repository could cause us to add even more `jcenter()` only dependencies in the future!

Fortunately there is a way to restrict the usage of `jcenter()`:

```groovy
jcenter() {
    content {
        includeModule("com.jeroenmols", "mylibrary")
    }
}
```

This will restrict Gradle to only use `jcenter()` for this single dependency. Note that you can define multiple lines of `includeModule` for each dependency that isn't available on Maven Central yet.

The benefits of this are twofold:
1. You make it explicit which `jcenter()` dependencies you still have
2. You prevent other `jcenter()` only dependencies from being added.

For each `jcenter()` dependency you still have, I recommend opening a [public Github issue](https://github.com/streem/pbandk/issues/120) to request the library author to migrate.

Bringing it all together yields:

```groovy
// Top level build.gradle file
allprojects {
  repositories {
      google()
      mavenCentral()
      jcenter() {
          content {
              includeModule("com.jeroenmols", "mylibrary")
          }
      }
  }
}
```

```groovy
// App (or module) level build.gradle file
dependencies {
  implementation 'com.jeroenmols:mylibrary:1.0.0'
}
```

With this solution, Gradle will first look for the artifact in the `google()` repository, then in `mavenCentral()` and finally in `jcenter()` if the artifact is on the explicit allow list.

## Published artifacts to Bintray/JCenter
These are artifacts you've published to `jcenter()` yourself.

Roughly there are two things that you'll need to do:

1. Change your publishing pipeline to upload new library versions to Maven Central
2. Migrate all your existing artifacts to Maven Central.

To handle the first part, I recommend [this guide](https://proandroiddev.com/publishing-your-first-android-library-to-mavencentral-be2c51330b88) by [Waseef Akhtar](https://twitter.com/waseefakhtar) on how to publish to Maven Central.

For the second part, I want to emphasize how important it is to also migrate your old artifacts. Not all your customers will be on the latest version of your library and upgrading might not be straightforward for them, especially with breaking API changes.

> Update: To help you with the migration, I've created [a script to migrate all existing artifacts from JCenter to Maven Central]({{ site.baseurl }}{% link blog/_posts/2021-03-24-migrate-artifacts-mavencentral.md %}).

But besides this customer argument, there could also be existing open source projects that are currently in low maintenance mode, but still incredibly valuable to the community as a learning resource. Would we want to break all those builds?

Finally note that, even though May 1st is still a few months away, I highly recommend you to start migrating your library as soon as feasible. This won't just decrease the burden for your customers, but I do also expect a surge in libraries being migrated to Maven central which could result in technical issues on their end. Hopefully not, of course, but better to make sure you have some extra time in your planning.

## Wrap-up
Migrating your app away from JCenter can be done by replacing all `jcenter()` references with `mavenCentral()` and adding explicit inclusions for dependencies that haven't migrated yet. For your published libraries, try to migrate as soon as possible, and don't forget to also migrate all existing artifacts.

If you've made it this far you should probably follow me on [Mastodon](https://androiddev.social/@Jeroenmols). Feel free to leave a comment below!
