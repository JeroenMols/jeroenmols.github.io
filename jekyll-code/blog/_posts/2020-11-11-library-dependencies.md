---
title: Android library development - Dependencies
published: true
header:
  teaser: img/blog/librarydependencies/librarydependencies.jpg
  imgcredit: Photo by Joey Kyber from Pexels, https://www.pexels.com/photo/sea-nature-sunset-water-119562/, cropped and resized
tags:
  - android
  - library
  - maven
  - transitive dependencies
  - gradle
  - kotlin
---
Ever had a build failure while integrating an SDK? Wonder how you can avoid your customers having dependency conflicts with your SDK? How many transitive dependencies should your SDK have?

This post will cover how transitive dependencies of an Android library affect Apps integrating it.

> This blog post is part of a series on Android libraries:
- Part 1: Getting started
- Part 2: Modularization
- Part 3: Transitive dependencies

## Introduction
> This post assumes familiarity with transitive dependencies and how Maven handles those. You can learn all about that and much more in [the first part]({{ site.baseurl }}{% link blog/_posts/2020-10-28-library-gettingstarted.md %}) of this series.

Assume there is an existing application `CustomerApp` that is about to start using our library:

[![Customer app about to integrate a new library]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/customerapp_before.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/customerapp_before.png)

Up to know, they have a single dependency on `Another library` that transitively depends on `Transitive dependency 1`.

Now when they integrate our library:

[![Customer app after integrating a new library]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/customerapp_after.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/librarydependencies/customerapp_after.png)

They don't just start to depend on a new `library`, but they also depend on all our transitive dependencies `Transitive dependency 1` and ` Transitive dependency 2`.

While `Another library` and `library` could be incompatible (e.g. both define same class in same package), this isn't very likely. However, the same can't be said from their transitive dependencies.

This blog post will look at the two most common issues:

- conflicting transitive dependency versions
- incompatible transitive dependencies

But it's important to stress that `library` will be blamed for these issues!!! Because before integrating `library`, `CustomerApp` was compiling just fine.

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

Now building `CustomerApp` would fail, because Gradle can't know what `OkHttp` version to pick.

While more options possible, this post will cover the three most common ways this problem can be fixed:

1. Force dependency resolution in `CustomerApp`
2. Loosen dependency requirements in `library`
3. Remove transitive dependency from `library`

### 1. Force dependency resolution in `CustomerApp`
The first way to address this problem is by adding code in the `CustomerApp` to force a particular dependency version.

This can either be done by excluding the `OkHttp` version from the `library` dependency.

```
implementation('com.jeroenmols:library:1.0.0') {
  exclude group: 'com.squareup.okhttp3', module: 'okhttp'
}
```

Or by forcing the resolved `OkHttp` version for all dependencies to a particular version:

```
configurations.all {
  resolutionStrategy {
    force 'com.squareup.okhttp3:okhttp:4.9.0'
  }
}
```

The main advantage of this strategy is that the developers of `CustomerApp` can apply this themselves when a conflict occurs without needing to wait for a `library` update.

However, this is incredibly dangerous as `CustomerApp` is now forcing `AnotherLibrary` to work with `OkHttp` version `4.9.0`, whereas `AnotherLibrary` was expecting `OkHttp` `3.x.x`!

This could cause runtime crashes (e.g. `ClassNotFoundException`) or subtle bugs due to behavior differences between dependency versions. The key takeaway here is that the developers of `AnotherLibrary` never tested their SDK with the enforced version of `OkHttp`

A second downside is that this puts the burden on your customers to fix the problems arising from integrating your SDK.

### 2. Loosen dependency requirements in `library`
A better solution is to loosen the dependency requirements of the `library`. Instead of explicitly requiring version `OkHttp` version `4.9.0`, the SDK can also require a minimum version of `4.0.0` or higher in the `pom.xml`:

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

The main advantage is that this doesn't require any action from the `CustomerApp`.

As main drawback, this increases the testing burden on `library` to ensure compatibility with all minor versions of `OkHttp`.

Also, imagine `OkHttp` release a new major version `5.x.x` with massive breaking API changes. Then there is no easy way for `library` to support both versions. Hence `library` would still have to choose what version to support, very likely creating dependency conflicts with other libraries. (that either update eager or conservative)

### 3. Remove transitive dependency from `library`
While obvious, this actually is a highly effective way of reducing transitive dependency conflicts. At the cost obviously of requiring more code in the library itself.

This is also the only proposed solution that would be able to fully handle breaking API changes of a particular dependency.

## Incompatible transitive dependencies
// TODO start from here

Similar to conflicting dependency versions, dependencies could even be incompatible.

Take for instance [protocol buffers](https://developers.google.com/protocol-buffers), which has two different artifacts:

- `protobuf-java`
- `protobuf-javalite` (optimized for Android)

These artifacts are mostly similar but optimized for different use cases.

And because they define the same/similar classes in the same namespace, they can't both be present in the same app or compilation would fail.

Note that even high profile libraries such as Firebase performance monitoring `19.0.1` use the wrong non-optimized protobuf artifact!

So what to do when a dependency of the SDK relies on the wrong transitive dependency?

Fortunately, Maven has the power to exclude transitive dependencies from dependencies:

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

Or in the `publishing` block of the `build.gradle`:

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

Finally, whenever a dependency conflict occurs, there is one Gradle command that will be a lifesaver while debugging:

```
./gradlew :library:dependencies
```

## Investigate dependency conflicts

## A dependency strategy

## Wrap-up
// transitive specific conclusion

While SDK and App development looks seemingly similar, the former poses some unique challenges. Modularization poses some unique challenges and transitive dependencies can be quite complex to get right.

If you've made it this far you should probably follow me on {% include link_twitter.html %}. Feel free to leave a comment below!
