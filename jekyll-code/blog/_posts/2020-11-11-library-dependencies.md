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
Ever wondered what transitive dependencies are? How these can cause dependency conflicts? And what you can do as an SDK developer to minimize those?

This post will cover transitive dependencies for Android libraries.

> This blog post is part of a series on Android libraries:
- Part 1: Getting started
- Part 2: Modularization
- Part 3: Transitive dependencies

## Transitive dependencies
Remember how the library shipped to Maven also includes transitive dependencies?

This introduces some dynamics for apps integrating the SDK together with other dependencies:

- conflicting transitive dependency versions
- incompatible transitive dependencies

### 1. Conflicting dependency versions
Imagine if an app integrates the following two SDKs:

```
```groovy
dependencies {
  implementation "com.jeroenmols:library:1.0.0"
  implementation "com.example:anotherlibrary:2.0.0"
}
```

And that both `library` and `anotherLibary` depend on a different version of a common dependency like `OkHttp`. Now building the app would fail, because Gradle can't know what `OkHttp` version to pick.

While the app could fix this by using [Gradle dependency resolution rules](https://docs.gradle.org/current/userguide/resolution_rules.html), this isn't very user friendly to the users of the SDK.

An alternative solution is to loosen the dependency requirements of the SDK. Instead of explicitly requiring version `OkHttp` version `4.9.0`, the SDK can also require a minimum version of `4.0.0` or higher in the `pom.xml`:

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

### 2. Incompatible transitive dependencies
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

## Wrap-up
// transitive specific conclusion

While SDK and App development looks seemingly similar, the former poses some unique challenges. Modularization poses some unique challenges and transitive dependencies can be quite complex to get right.

If you've made it this far you should probably follow me on {% include link_twitter.html %}. Feel free to leave a comment below!
