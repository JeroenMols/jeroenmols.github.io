---
title: Kdoc for Android libraries using Dokka
published: true
header:
  teaser: img/blog/dokkacodedocumentation/kdoc.jpg
  imgcredit: Photo by picjumbo.com from Pexels, https://www.pexels.com/photo/white-printer-paper-196645/, cropped and resized
tags:
  - documentation
  - kdoc
  - dokka
  - gradle
  - kotlin
---
A great way to make your library easier to use it to generate code documentation for its public interface. The default way to do this in Kotlin is to generate KDoc using the official Dokka plugin.

This post will cover some challenges in configuring Dokka and explain some neat tricks to improve your documentation.

## Introduction
The equivalent of JavaDoc for Kotlin is called [KDoc](https://kotlinlang.org/docs/reference/kotlin-doc.html). While it is very similar to the former, it also supports inline Markup and allows to easily link to other elements using `[ ]` brackets.

```kotlin
/**
 * A group of *members*.
 *
 * This class has no useful logic;
 * it's just a documentation example.
 *
 * @param T the type of a member in this group.
 * @property name the name of this group.
 * @constructor Creates an empty group.
 */
class Group<T>(val name: String) {
    /**
     * Adds a [member] to this group.
     * @return the new size of the group.
     */
    fun add(member: T): Int { ... }
}
```

The documentation generation tool is called [Dokka](https://github.com/Kotlin/dokka). It comes with a Gradle plugin and can generate documentation in multiple formats such as JavaDoc, HTML and even Markdown optimized for Github pages! Neat!

## Basic Dokka configuration
Adding Dokka requires to define a dependency in your top-level `build.gradle` file:

```groovy
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath "org.jetbrains.dokka:dokka-gradle-plugin:0.10.1"
    }
}
repositories {
    jcenter()
}
```

And applying the plugin to the `build.gradle` of the module(s) for which you would like to generate documentation:

```groovy
apply plugin: 'org.jetbrains.dokka'

dokka {
    outputFormat = 'html' // use 'javadoc' to get standard java docs
    outputDirectory = "$buildDir/javadoc"

    configuration {
        includeNonPublic = false
        skipEmptyPackages = true
        skipDeprecated = true
        reportUndocumented = true
        jdkVersion = 8
    }
}
```

Congratulations, you can now start generating documentation for your code:

```shell
./gradlew :library:dokka
```

## Challenges
However, when your library contains several modules, there are a few interesting challenges:

1. Required to use a fat AAR plugin to include all modules in the AAR artifact
2. There is no visibility modifier to make classes only visible within the project

The first challenge causes Dokka not to include the sources of all submodules. Consequently the resulting [KDoc] only contains documentation for your main `library` module.

> Note: this is because the [fat AAR plugin](https://github.com/kezong/fat-aar-android) includes the submodules as `compileOnly` dependencies when using the `embed` dependency. (See [source code](https://github.com/kezong/fat-aar-android/blob/ab85005f7fdf37ed9802da104bcb63f9f944aee7/source/src/main/groovy/com/kezong/fataar/FatLibraryPlugin.groovy#L65))

The second challenge bloats the documentation with a lot of classes that shouldn't be part of the API:

- the `internal` modifier is too restrictive as it doesn't allow modules within the library to use each other's classes.
- the `public` modifier is not restrictive enough and exposes classes to any other project using your library.

Unfortunately, using public modifiers is currently the only way to have multiple module libraries until [issue 62121508 gets fixed](https://issuetracker.google.com/issues/62121508).

## Multi-module libraries
Luckily there is a way to directly tell Dokka what sources it should include in the documentation via the `sourceRoots` attribute.

```groovy
dokka {
    configuration {
        ...

        sourceRoots = ... // ENTER SOURCE ROOTS HERE
    }
}
```

Though this doesn't take a `String` pointing to the sources, instead it requires a wrapper object a `SourceRoot`, which has an attribute `path`. 🤔

The easiest way to create a `SourceRoot` is to create a [`GradleSourceRootImpl`](https://github.com/Kotlin/dokka/blob/0d0d41f594f1095b4ccc999cffe01a6ef9a22dbb/runners/gradle-plugin/src/main/kotlin/org/jetbrains/dokka/gradle/configurationImplementations.kt#L18) and set it's path:

```groovy
import org.jetbrains.dokka.gradle.GradleSourceRootImpl

def sourceRoot = new GradleSourceRootImpl()
sourceRoot.path = it
```

And with a bit of business logic on top, we can easily extract all sources from our directories:

```groovy
// Converts the source path Strings into SourceRoot
private List<GradleSourceRootImpl> getSourceRootsToDocument() {
    return getSourceRootsToDocumentAsStrings().collect {
        def impl = new GradleSourceRootImpl()
        impl.path = it
        impl
    }
}

private List<String> getSourceRootsToDocumentAsStrings() {
    def sources = new ArrayList<>()
    sources += "$rootDir/app/src/main/java"
    sources += getSourceDirs("$rootDir/features")
    sources += getSourceDirs("$rootDir/libraries")
    // add other locations of sources here
    sources
}

private List<String> getSourceDirs(String directoryPath) {
    file(directoryPath).listFiles()
            .findAll { it.isDirectory() && it.name != "build" } // Non build subfolders
            .collect { "${it.path}/src/main/java" } // path of main sources
            .findAll { new File(it).exists() } // only include if path exists
}
```

Note that these methods only look in the `main` source folders and that `getSourceDirs` only looks at direct subfolders.

Sadly, this doesn't work and causes compilation issues when running Dokka. (╯°□°）╯︵ ┻━┻

This can be solved by creating a new Android library module, without any source code and apply the Dokka plugin with reference to all sources there:

```groovy
import org.jetbrains.dokka.gradle.GradleSourceRootImpl

apply plugin: 'com.android.library'
apply plugin: 'org.jetbrains.dokka'

android {
    buildToolsVersion BuildConfig.buildTools
    compileSdkVersion BuildConfig.compileSdk

    defaultConfig {
        minSdkVersion BuildConfig.minSdk
        targetSdkVersion BuildConfig.targetSdk
    }
}

dokka {
    configuration {
        ...

        sourceRoots = getSourceRootsToDocument()
    }
}
```

In summary, with a bit of logic, we can make sure source files of new modules are automatically included in the documentation.

## Excluding public classes
Since Kotlin doesn't have a `project internal` visibility modifier, we need a way to exclude `public` classes from our documentation that shouldn't be exposed.

One way of doing that is moving all classes that are internal to your SDK to a package name ending with `internal`.

```kotlin
package com.jeroenmols.internal
package com.jeroenmols.api.models.internal
```

This also gives a clear indication to users of your SDK that these classes aren't supposed to be used.

> Note that you could use proguard on your final AAR to hide non-public classes using obfuscation.

Now that all classes that should be internal are grouped, they can also be excluded from the documentation:

```groovy
dokka {
    configuration {
        ...


        perPackageOption {
            prefix = "com.jeroenmols.internal"
            suppress = true
        }
    }
}
```

And more generically, all packages in each source root that end with `internal` can be filtered:

```groovy
import groovy.io.FileType

private List<String> getInternalPackages() {
    def sourceRoots = getSourceRootsToDocumentAsStrings()
    def internalPackages = new ArrayList<String>()

    for (String root in sourceRoots) {
        def subPackages = getAllSubDirectories(new File(root))
                .findAll { it.path.contains("internal") }
                .collect { it.path.split("src/main/java/")[1].replaceAll("/", ".") }
        internalPackages.addAll(subPackages)
    }
    return internalPackages
}

private List<File> getAllSubDirectories(File directory) {
    def list = new ArrayList<String>()
    directory.eachFileRecurse (FileType.DIRECTORIES) { file ->
        list << file
    }
    return list
}
```

And hooking this all together will make sure all `internal` classes are excluded:

```groovy
dokka {
    configuration {
        ...

        for (String p in getInternalPackages()) {
            perPackageOption {
                prefix = p
                suppress = true
            }
        }
    }
}
```

## Bringing it all together
Here's the full example of a Dokka configuration that includes all source from each submodule and excludes internal classes:

```groovy
import org.jetbrains.dokka.gradle.GradleSourceRootImpl

apply plugin: 'org.jetbrains.dokka'

dokka {
    outputFormat = 'html' // use 'javadoc' to get standard java docs
    outputDirectory = "$buildDir/javadoc"

    configuration {
        includeNonPublic = false
        skipEmptyPackages = true
        skipDeprecated = true
        reportUndocumented = true
        jdkVersion = 8

        sourceRoots = getSourceRootsToDocument()
        for (String p in getInternalPackages()) {
            perPackageOption {
                prefix = p
                suppress = true
            }
        }
    }
}

private List<String> getInternalPackages() {
    def sourceRoots = getSourceRootsToDocumentAsStrings()
    def internalPackages = new ArrayList<String>()

    for (String root in sourceRoots) {
        def subPackages = getAllSubDirectories(new File(root))
                .findAll { it.path.contains("internal") }
                .collect { it.path.split("src/main/java/")[1].replaceAll("/", ".") }
        internalPackages.addAll(subPackages)
    }
    return internalPackages
}

private List<File> getAllSubDirectories(File directory) {
    def list = new ArrayList<String>()
    directory.eachFileRecurse (FileType.DIRECTORIES) { file ->
        list << file
    }
    return list
}

// Converts the source path Strings into SourceRoot
private List<GradleSourceRootImpl> getSourceRootsToDocument() {
    return getSourceRootsToDocumentAsStrings().collect {
        def impl = new GradleSourceRootImpl()
        impl.path = it
        impl
    }
}

private List<String> getSourceRootsToDocumentAsStrings() {
    def sources = new ArrayList<>()
    sources += "$rootDir/app/src/main/java"
    sources += getSourceDirs("$rootDir/features")
    sources += getSourceDirs("$rootDir/libraries")
    // add other locations of sources here
    sources
}

private List<String> getSourceDirs(String directoryPath) {
    file(directoryPath).listFiles()
            .findAll { it.isDirectory() && it.name != "build" } // Non build subfolders
            .collect { "${it.path}/src/main/java" } // path of main sources
            .findAll { new File(it).exists() } // only include if path exists
}
```

## Wrap-up
This post covered how to configure [Dokka](https://github.com/Kotlin/dokka) to generate [KDoc](https://kotlinlang.org/docs/reference/kotlin-doc.html) documentation. It explained how Dokka can be used for multi-module libraries and how public classes of submodules can be excluded.

If you've made it this far you should probably follow me on [Mastodon](https://androiddev.social/@Jeroenmols). Feel free to leave a comment below!
