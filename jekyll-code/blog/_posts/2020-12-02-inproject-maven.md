---
title: Test library releases using an in project Maven repository
published: true
header:
  teaser: img/blog/inprojectmaven/inprojectmaven.jpg
  imgcredit: Photo by Andy Makely on Unsplash, https://unsplash.com/photos/0cn3wuj6Cmw, cropped and resized
tags:
  - android
  - library
  - maven
  - transitive dependencies
  - gradle
  - kotlin
---
Short, powerful post on how to test the release version of libraries directly within a project without having to deploy them to Maven first.

As a bonus, there will also be an open-source example showcasing all of this in action.


## Problem description
In (Android) library development, the local development setup differs from how customers integrate the library.

Local development uses a module dependency:

```groovy
dependencies {
    implementation project(':library')
}
```

Customers integrate through Maven:

```groovy
dependencies {
    implementation `com.jeroenmols.lib:library:1.0.0`
}
```

Now because both integration mechanisms are fundamentally different, they can also lead to different results.

Wouldn't it be great if you could test the Maven version of your library directly in your project?

Let's do that!

That avoids deploying the library to Maven, makes testing more realistic, and speeds up release testing considerably.

## Core idea
What we'll try to accomplish is to mimic a local `Maven` repository within your Android project. That allows integrating the release build similar to an external Maven build:

```groovy
dependencies {
    // in-project build from current code
    releaseImplementation 'com.jeroenmols.lib:library:local'

    // version from Maven
    releaseImplementation 'com.jeroenmols.lib:library:1.0.0'
}
```

To accomplish this we'll:

- add a build flag to toggle between local and external build
- create a release artifact and `pom.xml` with a special version
- create a `Maven` like folder structure in `app/libs`
- add `Maven` metadata files and symlinks to the build outputs
- include the local Maven repository


## Implementation
In the `app` level `build.gradle` file, split the `lib` dependency between `debug` and `release` variant:

```groovy
dependencies {
    debugImplementation project(':lib')

    def releaseVersion = project.hasProperty("external_version") ? project.external_version : "local"
    releaseImplementation "com.jeroenmols.lib:library:$releaseVersion"

    ...
}
```

In the `lib` level `build.gradle` file, toggle the published version between `local` and external version:

```groovy
publishing {
    publications {
        aar(MavenPublication) {
            ...

            groupId = 'com.jeroenmols.lib'
            artifactId = 'library'
            version = project.hasProperty("external_version") ? project.external_version : "local"
        }
    }
}
```

Create a local Maven repository in the `libs` folder of the `app` module:

```bash
$ mkdir -p app/libs/<group-id-slash-separated>/<artifact-id>/local
# example: $ mkdir -p app/libs/com/jeroenmols/lib/library/local/
```

Go into the `artifact-id` folder and create a new file `maven-metadata-local.xml`:

```bash
$ cd app/libs/<group-id-slash-separated>/<artifact-id>
$ touch maven-metadata-local.xml

# example: $ cd app/libs/com/jeroenmols/lib/library/
#          $ touch maven-metadata-local.xml
```

Copy the following content into the `maven-metadata-local.xml` and replace the placeholders with your `groupId` and `artifactId`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<metadata>
  <groupId>GROUP ID HERE</groupId>
  <artifactId>ARTIFACT ID HERE</artifactId>
  <versioning>
    <latest>local</latest>
    <release>local</release>
    <versions>
      <version>local</version>
    </versions>
  </versioning>
</metadata>
```

Create symbolic links to the `aar` and `pom.xml` files.

> Note that the file names and paths need to match exactly or this won't work!

```bash
// Make sure the output files exist, so we can symlink them
$ ./gradlew generatePomFileForAarPublication assembleRelease

$ cd app/libs/<group-id-slash-separated>/<artifact-id>

$ ln -s <path-to-lib-build>/outputs/aar/<aar-file-name> <artifact-id>-local.aar
$ ln -s <path-to-lib-build>/publications/aar/pom-default.xml <artifact-id>-local.pom
# example: ln -s ../../../../../../../lib/build/outputs/aar/lib-release.aar library-local.aar
#          ln -s ../../../../../../../lib/build/publications/aar/pom-default.xml library-local.pom
```

Add the local repository to the `app` level `build.gradle` file:

```groovy
repositories {
    maven { url "$projectDir/libs" }
}
```

And make sure the `library` dependencies are built when running an `app` release build by adding to the `app` level `build.gradle` file:

```groovy
afterEvaluate {
    preReleaseBuild.dependsOn(":lib:assembleRelease")
    preReleaseBuild.dependsOn(":lib:generatePomFileForAarPublication")
}
```

That's it!

You can now test your release variant locally by changing the build variant of the `app` project to `release` in Android studio and clicking run. Or you can test an external Maven version by invoking:

```bash
./gradlew assembleRelease -Pexternal_version=1.0.0
```

## Wrap-up
I hope this neat little trick is helpful to test your libraries. I've also [open sourced a sample project](https://github.com/JeroenMols/LibraryExample/pull/1/files) that demonstrates this concept.

If you've made it this far you should probably follow me on {% include link_twitter.html %}. Feel free to leave a comment below!
