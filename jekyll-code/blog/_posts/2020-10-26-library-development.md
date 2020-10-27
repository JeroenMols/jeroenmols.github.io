---
title: Lessons learned developing Android libraries
published: true
header:
  teaser: img/blog/librarydevelopment/librarydevelopment.jpg
  imgcredit: Photo by mentatdgt from Pexels, https://www.pexels.com/photo/library-photo-1319854/, cropped and resized
tags:
  - android
  - library
  - modularization
  - maven
  - transitive dependencies
  - gradle
  - kotlin
---
Having switched to Android SDK development over the past year, I've run into quite a few interesting and unexpected challenges.

This post will give a basic introduction to how building an SDK differs from building an application and dive deep into SDK modularity and transitive dependencies.

## Introduction to Android libraries
Before we get started, let's have a quick look at how SDK development differs from app development. If you're already familiar with these concepts, feel free to skip this section!

### Anatomy of a library
Developing a library is mostly similar to developing a submodule in a multi-module app:

```
.
├── app
└── library
```

This `library` module in your project has the `com.android.libary` plugin in its `build.gradle` file:

```groovy
apply plugin: 'com.android.library'
```

After building, the project output won't be a `.apk` file ([or `.aab`](https://developer.android.com/platform/technology/app-bundle)), but instead a `.aar` file:

```groovy
./gradlew :library:assembleRelease

=> result: library/build/outputs/aar/library-release.aar
```

This `.aar` file is is essentially a java library (`.jar`) file that also contains Android XML resources.

> Notice how a signing config isn't required to create the release variant of the Android library. In contrast to `.apk` files, `.aar` files aren't signed.

### Transitive dependencies
However, there's a bit more to this than meets the eye: the built `.aar` file doesn't contain external dependencies of the library module!

Imagine if the `library` module has the following dependency:

```groovy
dependencies {
  implementation "com.squareup.okhttp3:okhttp:4.9.0"
}
```

And that some application `demoApp` is directly using the library:

```groovy
// Gradle trick to consume .aar files from the libs folder
repositories {
    flatDir {
        dirs "libs"
    }
}

dependencies {
  releaseImplementation(name: 'library-release', ext: 'aar')
}
```

Then `demoApp` will crash at runtime as it cannot find the `OkHttp` classes on its classpath!

> Notice how this does work in the multi-module project example because then Gradle knows the `library` dependencies and includes them into the `.apk` while building.

In this example, we say that `OkHttp` is a transitive dependency of the `demoApp`. This means the `demoApp` doesn't directly have `OkHttp` as a dependency, but it indirectly gets it as a dependency through one of its dependencies (`library-release.apk`).

But how can Gradle know to include `OkHttp` in the `demoApp` after adding the `library` as a dependency?

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

In reality, there can be many more files (Javadoc, sources,...). Have a look at the Files tab of the [Maven entry for OkHttp](https://bintray.com/bintray/jcenter/com.squareup.okhttp3%3Aokhttp/4.9.0#files/com%2Fsquareup%2Fokhttp3%2Fokhttp%2F4.9.0).

Now, let's have a look at some of the things I've learned.

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

Now when the `library` module gets build, the `.aar` artifact will only include code and resources that are in the `library` module itself. It won't include:

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

The first solution is to move all classes that aren't intended for public use to a package name that has `internal` in its name. This discourages (but not prevents!) others from using it. For example [OkHttp has a okhttp.internal package](https://github.com/square/okhttp/tree/master/okhttp/src/main/kotlin/okhttp3/internal).

A more aggressive solution is to use Proguard/R8 to obfuscate each interface that isn't supposed to be public. However, this could lead to class name collisions with other libraries that do the same.

Fortunately, there is an option to repackage classes under your own namespace to avoid collisions in `proguard-rules.pro`:

```prolog
repackageclasses com.jeroenmols.internal
```

This will makes sure every obfuscated class will be flattened in the package specified.

I've combined both the first and second strategy to reduce an SDK API surface. This has worked well, but just bear in mind that Proguard isn't trivial to set up correctly.

Finally, there is the third option of just building a single module SDK and using the internal modifier to restrict access. This is what I would recommend for both small and mid-sized SDKs.

_Are you noticing a pattern here?_

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
While SDK and App development looks seemingly similar, the former poses some unique challenges. Modularization poses some unique challenges and transitive dependencies can be quite complex to get right.

If you've made it this far you should probably follow me on {% include link_twitter.html %}. Feel free to leave a comment below!
