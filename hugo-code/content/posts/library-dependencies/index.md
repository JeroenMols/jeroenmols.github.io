---
title: Android library development - Dependencies
published: true
header:
  teaser: img/blog/librarydependencies/librarydependencies.jpg
  imgcredit: Photo by Joey Kyber from Pexels, https://www.pexels.com/photo/sea-nature-sunset-water-119562/,
    cropped and resized
tags:
- android
- library
- maven
- transitive dependencies
- gradle
- kotlin
date: '2020-11-11'
---

Ever had a build failure while integrating an SDK? Wonder how you can avoid your SDK customers having dependency conflicts? How many transitive dependencies should your SDK have?

This post will cover how transitive dependencies of an Android library affect Apps integrating it.

> This blog post is part of a series on Android libraries:
- Part 1: [Getting started]({{ site.baseurl }}{% link blog/_posts/2020-10-28-library-gettingstarted.md %})
- Part 2: [Modularization]({{ site.baseurl }}{% link blog/_posts/2020-11-04-library-modularization.md %})
- Part 3: [Transitive dependencies]({{ site.baseurl }}{% link blog/_posts/2020-11-11-library-dependencies.md %})

## Introduction
> This post assumes familiarity with transitive dependencies and how Maven handles those. You can learn all about that and much more in [the first part]({{ site.baseurl }}{% link blog/_posts/2020-10-28-library-gettingstarted.md %}) of this series.

Assume there is an existing application `CustomerApp` that is about to start using our library:

[![Customer app about to integrate a new library]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/customerapp_before.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/customerapp_before.png)

Before integration, they have a single dependency on `Another library` that transitively depends on `Transitive dependency 1`.

Now when they integrate the new `library`:

[![Customer app after integrating a new library]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/customerapp_after.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/customerapp_after.png)

They don't just start to depend on `library`, but they also depend on all its transitive dependencies `Transitive dependency 1` and `Transitive dependency 2`.

All these transitive dependencies can easily cause integration issues in the host `CustomerApp`.

This blog post will look at the two most common issues:

- conflicting transitive dependency versions
- incompatible transitive dependencies

It's important to note that when transitive dependency issues occur, the last integrated SDK will be blamed for these issues!!!

`CustomerApp` was compiling fine with `Another library`, only after adding `library` the issues occurred. So as an SDK developer, this is our problem to solve.

## Conflicting dependency versions
Imagine if `CustomerApp` integrates the following two SDKs:

```groovy
dependencies {
  implementation "com.jeroenmols:library:1.0.0"
  implementation "com.example:anotherlibrary:2.0.0"
}
```

And that both `library` and `anotherLibary` depend on a different version of a common dependency like `OkHttp`.

[![Customer app after integrating a new library]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/dependency_versions.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/dependency_versions.png)

Now building `CustomerApp` would fail, because Gradle can't know what `OkHttp` version to pick: `v3` or `v4`?

While more solutions possible, this post will cover the three most common ways this problem can be fixed:

1. Force dependency resolution in `CustomerApp`
2. Loosen dependency requirements in `library`
3. Remove transitive dependency from `library`

### 1. Force dependency resolution in `CustomerApp`
The first way to address this problem is by adding code in the `CustomerApp` to force a particular dependency version.

This can either be done by excluding the `OkHttp` version from the `library` dependency.

```groovy
implementation('com.jeroenmols:library:1.0.0') {
  exclude group: 'com.squareup.okhttp3', module: 'okhttp'
}
```

Or by forcing the resolved `OkHttp` version for all dependencies to a particular version:

```groovy
configurations.all {
  resolutionStrategy {
    force 'com.squareup.okhttp3:okhttp:4.9.0'
  }
}
```

The main advantage of this strategy is that no `library` update is required. So the developers of `CustomerApp` can apply this themselves when a conflict occurs.

However, this is incredibly dangerous as `CustomerApp` is now forcing `AnotherLibrary` to work with `OkHttp` version `4.9.0`, whereas `AnotherLibrary` was expecting `OkHttp` `3.x.x`!

And since the developers of `AnotherLibrary` never tested their SDK with the enforced version of `OkHttp`, this could cause runtime crashes (e.g. `ClassNotFoundException`), behavior differences,...

A second downside is that this puts the burden on the SDK customers (i.e. `CustomerApp`) to fix the problems arising from integrating your SDK.

### 2. Loosen dependency requirements in `library`
A better solution is to loosen the dependency requirements of the `library`.

Instead of explicitly requiring version `OkHttp` version `4.9.0`, the SDK can also require a minimum version of `4.0.0` or higher in the `pom.xml`:

```xml
...
<dependencies>
  <dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp3</artifactId>
    <version>[4.0.0,)</version>
    <scope>compile</scope>
  </dependency>
</dependencies>
```

Notice how the `OkHttp` version is now specified as `[4.0.0,)` meaning any version of `4.0.0` or higher is supported.

In order to achieve this using Gradle, the `publishing` block of SDK `build.gradle` needs to contain the following:

```groovy
pom.withXml {
  def dependencies = asNode().appendNode('dependencies')
  configurations.getByName("releaseCompileClasspath").getResolvedConfiguration().getFirstLevelModuleDependencies().each {
    ...
    def dependency = dependencies.appendNode('dependency')
    if (it.moduleGroup.contains('okhttp3')) {
        dependency.appendNode('version', "[4.0.0,)")
    } else {
        dependency.appendNode('version', it.moduleVersion)
    }
  }
}
```

The main advantage of this strategy is that this doesn't require any action from the `CustomerApp`.

On the other hand, this increases the testing burden for the developers of `library` to ensure compatibility with all supported versions of `OkHttp`.

Also, imagine `OkHttp` release a new major version `5.x.x` with massive breaking API changes. What version of `OkHttp` would `library` then support and force their customers to adopt?

> Note that `OkHttp` actually solves this problem by [including the version in their package name](https://jakewharton.com/java-interoperability-policy-for-major-version-updates/):
> ```groovy
> package com.square.okhttp3
```
> and Maven coordinates:
> ```groovy
> implementation 'com.squareup.okhttp3:okhttp3:4.9.0'
> ```
> So for `OkHttp` different major versions can coexist in `CustomerApp`, but this isn't true for all other SDKs.

### 3. Remove transitive dependency from `library`
While obvious, this actually is a highly effective way of reducing transitive dependency conflicts. Downside is that the library needs more code to solve the challenges the dependency would.

This is also the only proposed solution that would be able to fully handle breaking API changes of a particular dependency that doesn't support major versions to coexist.

## Incompatible transitive dependencies
Similar to conflicting dependency versions, dependencies can be downright incompatible.

Take for instance [protocol buffers](https://developers.google.com/protocol-buffers), which has two different artifacts:

- `protobuf-java`
- `protobuf-javalite` (optimized for Android)

These artifacts are mostly similar but optimized for different use cases.

So for a `CustomerApp` with two `libraries` dependencies that transitive rely on a different `protobuf` artifact:

[![Customer app with incompatible transitive dependencies]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/dependency_incompatible.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/dependency_incompatible.png)

Compilation will fail! Because both `protobuf-java` and `protobuf-javalite` define the same/similar classes in the same namespace:

```
$ ./gradlew clean assembleDebug
> Task :app:checkDebugDuplicateClasses FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':myproject:checkReleaseDuplicateClasses'.
> 1 exception was raised by workers:
  java.lang.RuntimeException: Duplicate class com.google.protobuf.AbstractMessageLite found in modules protobuf-java-3.11.1.jar (com.google.protobuf:protobuf-java:3.11.1) and protobuf-javalite-3.11.0.jar (com.google.protobuf:protobuf-javalite:3.11.0)
  Duplicate class com.google.protobuf.AbstractMessageLite$Builder found in modules protobuf-java-3.11.1.jar (com.google.protobuf:protobuf-java:3.11.1) and protobuf-javalite-3.11.0.jar (com.google.protobuf:protobuf-javalite:3.11.0)
  Duplicate class com.google.protobuf.AbstractMessageLite$Builder$LimitedInputStream found in modules protobuf-java-3.11.1.jar (com.google.protobuf:protobuf-java:3.11.1) and protobuf-javalite-3.11.0.jar (com.google.protobuf:protobuf-javalite:3.11.0)
     ...
```

And unfortunately for `protobuf`, this issue is very common: even Firebase performance monitoring `19.0.7` (April 2020 !!!) relied on an even different, incompatible, 4 year old `protobuf` artifact!

```groovy
+--- com.google.firebase:firebase-perf:19.0.7
|    +--- com.google.firebase:firebase-config:19.0.4
|    |    +--- com.google.firebase:firebase-abt:19.0.0
|    |    |    \--- com.google.protobuf:protobuf-lite:3.0.1
```

So what to do when a transitive dependency of the SDK relies on the wrong dependency?

Let's have a look at three possible solutions:

1. Substitute dependency in `CustomerApp`
2. Remove dependency from transitive dependency of `library`
3. Remove transitive dependency from `library`

### 1. Substitute dependency in `CustomerApp`
Similar to handling conflicting dependency versions, the `CustomerApp` can exclude the dependency:

```groovy
implementation('com.jeroenmols:library:1.0.0') {
  exclude group: 'com.google.protobuf', module: 'protobuf-java'
}
```

Or force the dependency to be substituted:

```groovy
allprojects {
  configurations.all {
    resolutionStrategy.dependencySubstitution {
      substitute module('com.google.protobuf:protobuf-lite') with module('com.google.protobuf:protobuf-javalite')
    }
  }
}
```

These solutions have similar advantages and disadvantages as solution 1 for conflicting versions.

### 2. Remove dependency from transitive dependency
Let's look at a more interesting approach.

We'll take [`pbandk`](https://github.com/streem/pbandk) as an example, a very promising `Kotlin` code generator and runtime for Protocol buffers.

Imagine that `library` depends on `pbandk`, which unfortunately depends on the non-optimized version of `protobuf`, causing a build failure when integrated into the `CustomerApp`:

[![Library dependency has incompatible transitive dependency]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/dependency_incompatible_pbandk.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/dependency_incompatible_pbandk.png)

Now to fix this, we need to ensure that `protobuf-java` doesn't get transitively added to `CustomerApp` after adding a dependency on `library`.

So we'll have to add a dependency exclusion to the `library`'s `pom.xml`:

```xml
...
<dependencies>
  <dependency>
    <groupId>pro.streem.pbandk</groupId>
    <artifactId>pbandk-runtime-jvm</artifactId>
    <version>0.9.0</version>
    <exclusions>
      <exclusion>
        <groupId>com.google.protobuf</groupId>
        <artifactId>protobuf-java</artifactId>
      </exclusion>
    </exclusions>
  </dependency>
</dependencies>
```

This can be done by modifying the `publishing` block of the `library`'s `build.gradle`:

```groovy
pom.withXml {
  def dependencies = asNode().appendNode('dependencies')
  configurations.getByName("releaseCompileClasspath").getResolvedConfiguration().getFirstLevelModuleDependencies().each {
    ...
    def dependency = dependencies.appendNode('dependency')
    if (it.moduleName.contains("pbandk")) {
        dependency.appendNode('version', it.moduleVersion)
        def exclusions = dependency.appendNode('exclusions')
        def protobufExclusion = exclusions.appendNode('exclusion')
        protobufExclusion.appendNode('groupId', "com.google.protobuf")
        protobufExclusion.appendNode('artifactId', "protobuf-java")
    } else {
        dependency.appendNode('version', it.moduleVersion)
    }
  }
}
```

And don't forget to also add `protobuf-javalite` as a direct transitive dependency to the `library`. This is needed to ensure the SDK also works in apps that don't rely on `protobuf-javalite` yet.

[![Library dependency has incompatible transitive dependency]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/dependency_incompatible_pbandkfix.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/dependency_incompatible_pbandkfix.png)

> Note that the `pbandk` example is just as an illustration. The library is still under active development and there is an [open issue](https://github.com/streem/pbandk/issues/91) to address this.

### 3. Remove transitive dependency from `library`
Similar to solving dependency version conflicts, incompatibilities can also be solved by removing the transitive dependency altogether. Again with the disadvantage of having to write more code in the `library`.


## Investigate dependency conflicts
Finally, whenever a dependency conflict occurs, there is one Gradle command that will be a lifesaver while debugging:

```
./gradlew :library:dependencies
```

Which will give you a detailed overview of how each transitive dependency ends up in your classpath:

```groovy
$ ./gradlew --console plain :app:dependencies --configuration releaseRuntimeClasspath

> Task :app:dependencies

------------------------------------------------------------
Project :app
------------------------------------------------------------

releaseRuntimeClasspath - Runtime classpath of compilation 'release' (target  (androidJvm)).
+--- org.jetbrains.kotlin:kotlin-stdlib:1.3.72
|    +--- org.jetbrains.kotlin:kotlin-stdlib-common:1.3.72
|    \--- org.jetbrains:annotations:13.0
+--- androidx.core:core-ktx:1.3.2
|    +--- org.jetbrains.kotlin:kotlin-stdlib:1.3.71 -> 1.3.72 (*)
|    +--- androidx.annotation:annotation:1.1.0
|    \--- androidx.core:core:1.3.2
|         \--- ...
+--- androidx.appcompat:appcompat:1.2.0
|    +--- androidx.annotation:annotation:1.1.0
|    +--- androidx.core:core:1.3.0 -> 1.3.2 (*)
|    +--- androidx.cursoradapter:cursoradapter:1.0.0
|    |    \--- ...
|    +--- androidx.fragment:fragment:1.1.0
|    |    \--- ...
|    +--- androidx.appcompat:appcompat-resources:1.2.0
|    |    \--- ...
|    |   
|    +--- androidx.drawerlayout:drawerlayout:1.0.0
|    |    \--- ...
|    \--- androidx.collection:collection:1.0.0 -> 1.1.0 (*)
+--- com.google.android.material:material:1.2.1
|    +--- androidx.annotation:annotation:1.0.1 -> 1.1.0
|    +--- androidx.appcompat:appcompat:1.1.0 -> 1.2.0 (*)
|    +--- androidx.cardview:cardview:1.0.0
|    |    \--- ...
|    +--- androidx.coordinatorlayout:coordinatorlayout:1.1.0
|    |    \--- ...
|    +--- androidx.core:core:1.2.0 -> 1.3.2 (*)
|    +--- androidx.annotation:annotation-experimental:1.0.0
|    +--- androidx.fragment:fragment:1.0.0 -> 1.1.0 (*)
|    +--- androidx.lifecycle:lifecycle-runtime:2.0.0 -> 2.1.0 (*)
|    +--- androidx.recyclerview:recyclerview:1.0.0 -> 1.1.0
|    |    \--- ...
|    +--- androidx.transition:transition:1.2.0
|    |    \--- ...
|    +--- androidx.vectordrawable:vectordrawable:1.1.0 (*)
|    \--- androidx.viewpager2:viewpager2:1.0.0
|         \--- ...
\--- androidx.constraintlayout:constraintlayout:1.1.3
     \--- androidx.constraintlayout:constraintlayout-solver:1.1.3

(*) - dependencies omitted (listed previously)
```

Notice the sheer amount of dependencies that the standard Android project template already has!

## Recommendation
Transitive SDK dependencies can create very challenging issues. These tend to be hard to predict as they only pop up for certain combinations of dependencies in a `CustomerApp`.

Worse even, their blame might be pushed onto the wrong SDK. And your SDK might be blamed for a conflict caused by an obsolete transitive `Firebase` dependency.

The only foolproof way to solve these issues is to not use any transitive dependencies for your `library`.

And while that's likely not very practical, here's a few tips to avoid transitive dependency problems:

- minimize transitive dependencies
  - often it's easy to write your own (minimal) solution
  - focus on commonly used dependencies (e.g. OkHttp) -> `CustomerApp` likely has this already
  - investigate breaking changes are handled
- specify minimum versions instead of specific ones
- only rely on stable transitive dependencies (no RC, Beta or Alpha)
- use android optimized dependencies

Finally, to combat device fragmentation, Android has a rich set of [Jetpack libraries](https://developer.android.com/jetpack). These have become so ubiquitous, that it's close to impossible not to rely on them when developing an Android app or SDK.

Therefore, and thanks to their amazing track record of backward compatibility, it's fine to rely on `AndroidX` dependencies. Most tips above remain valid (e.g. min version, no alpha's,...) and keep in mind that some `AndroidX` libraries may need Google play services in order to work.

## Wrap-up
Transitive dependencies problems only occur when a `CustomerApp` has certain combinations of dependencies. This makes them hard to predict and quite disruptive for both the SDK as app developers.

Try to reduce the `library`'s transitive dependencies to a minimum and focus on popular, Android optimized dependencies.

If you've made it this far you should probably follow me on [Mastodon](https://androiddev.social/@Jeroenmols). Feel free to leave a comment below!
