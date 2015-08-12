---
layout: post
title: Getting the most out of Artifactory
published: false
comments: true
img: img/blog/artifactory2.png
---

In my previous [blogpost]({% post_url 2015-08-06-artifactory %}) I described how to set up your own private Maven repository with Artifactory in 30 minutes. Today we will make things more interesting and take our setup to the next level.

You will learn how to:

- handle library projects with dependencies
- configure custom repositories
- manage user access
- securely provide username and password
- work with snapshot and release builds

Note that the material presented here can quite easily be extended to be applicable in a broader scope beyond Android.

All source code is available on Github as usual.

## Library projects with dependencies
Imagine if your Android library project itself has dependencies. In that case
the application using the library wouldn't be able to compile until it provides all dependencies the library requires.

To better understand this, consider the a new library `AwesomeAdvancedLibrary`, which makes use of [Guava](https://github.com/google/guava) to *awesomize* a `String`. When including this library we want the application to be agnostic of the fact that the library is using Guava. Hence we do not want to have anything like this:

```groovy
dependencies {
    compile 'com.jeroenmols.awesomeadvancedlibrary:awesomeadvancedlibrary:1.0.0'
    compile 'com.google.guava:guava:18.0'
}
```


One `compile` dependency should suffice to use the library.

> **Important note on including dependencies**
>
> You can skip this if you want, just some extra context
>
>Including dependencies in your library is not always a good idea, because this can generate a dependency conflict in the using app. I only choose Guava to have a simple sample, but it is actually a very bad example. This is because it is a utility library, which means it is quite likely that an app would also want to use it.
>
> A better example would be a universal *analytics* library, which offers a universal API to track analytics and redirects all calls internally to one or more analytics providers. For this case packaging dependencies makes sense, because no other part of the app will talk to the dependency directly. It also hides implementation details, so the app doesn't need to be modified when switching to a new provider.

Imagine if we would simply resort to the buildscript we had in my previous [blogpost]({% post_url 2015-08-06-artifactory %}). While compiling the library the `Guava` dependency will not be included, because the would make it unnecessarily large. Instead, the compiler will tell the library: "don't worry about this dependency, the app will provide it for you."

The app on the other hand wouldn't have a clue which dependencies the library actually needs (how would it?) and hence the app will compile just fine. However, it would crash at runtime while trying to access the Library with the following exception:

```Java
08-09 20:49:46.096  28892-28892/? E/AndroidRuntime﹕ FATAL EXCEPTION: main
Process: com.jeroenmols.awesomeadvancedapplication, PID: 28892
java.lang.NoClassDefFoundError: Failed resolution of: Lcom/google/common/base/CharMatcher;
    at com.jeroenmols.awesomeadvancedlibrary.AwesomeConvertor.toAwesome(AwesomeConvertor.java:11)
```

In order to solve this, we need to ensure that the `pom.xml` file of the library contains the right dependencies. This can be done by manually adding the `pom.withXml{}` element to the `publish task` in our `build.gradle` file:

```groovy
publishing {
    publications {
        aar(MavenPublication) {
            groupId packageName
            version = libraryVersion
            artifactId project.getName()
            artifact("$buildDir/outputs/aar/${project.getName()}-release.aar")

            pom.withXml {
                def dependencies = asNode().appendNode('dependencies')
                configurations.getByName("_releaseCompile").getResolvedConfiguration().getFirstLevelModuleDependencies().each {
                    def dependency = dependencies.appendNode('dependency')
                    dependency.appendNode('groupId', it.moduleGroup)
                    dependency.appendNode('artifactId', it.moduleName)
                    dependency.appendNode('version', it.moduleVersion)
                }
            }
        }
    }
}
```

Note that while you could similarly also add repositories for artifacts in this way to the `pom.xml`, Gradle itself [won't look](https://discuss.gradle.org/t/resolving-problem-when-maven-repo-contains-pom-but-not-jar/7174) for repositories in that file. Therefore if you use libraries from 3rd party repositories, you will still always need those repositories to the `build.gradle` of your app.

## Securely provide username and password
Obviously we do not want to store our username and password in plain text in any file that we check in to our version control system. So to make sure we hide that, create a `gradle.properties` file in the root of your project and add the following content:

```groovy
artifactory_username=admin
artifactory_password=password
```

Then in your `build.gradle` file, refer to the properties like this:

```groovy
username = artifactory_username
password = artifactory_password
```

Now it is important to realize what we've done: "we obfuscated the password, so it is not immediately obvious what the password is anymore". However if you check in the `gradle.properties` file into version control, then people will still be able to see your password. Therefore you must do one or the following:

- Don't add `gradle.properties` to your version control system. (add it to your `.gitignore` file instead)
- Move the `gradle.properties` to the base `~/.gradle` folder on your hard drive. I personally recommend this approach as you can never accidentally check in your username and password.

## Working with Snapshot and Release builds
While the Artifactory Gradle plugin doesn't have support for snapshot/release builds out of the box, we can easily add this functionality by relying on the artifact version:

- For release builds: use symantic versioning e.g. `1.0.0`
- For Snapshot builds: use symantic versioning with `-SNAPSHOT` suffix e.g. `1.0.0-SNAPSHOT`

We can then direct each one to a different repository in Artifactory by changing the repository key as follows:

```groovy
repoKey = libraryVersion.endsWith('SNAPSHOT') ? 'libs-snapshot-local' : 'libs-release-local'
 ```

On the application side we then need to add two different Maven urls so we can refer to artifacts in both repositories.

```groovy
allprojects {
    repositories {
      maven { url "http://localhost:8081/artifactory/libs-release-local" }
      maven { url "http://localhost:8081/artifactory/libs-snapshot-local" }
    }
}
```

Referencing artifacts is exactly the same as before, just don't forget to add the `-SNAPSHOT` suffix for snapshot artifacts.

Alternatively we can also create a `virtual` repository in Artifactory which wraps around both repositories so we only have to add one URL to our app. This is a very elegant solution, but does create a dependency of your source code on your Artifactory setup.

1. Login to Artifactory and go to admin > repositories > virtual
  <center><a href="{{ site.blogbaseurl }}img/blog/artifactory2_virtualrepo1.png"><img src="{{ site.blogbaseurl }}img/blog/artifactory2_virtualrepo1.png" alt="All virtual repositories can be found under admin - repositories - virtual"></a></center>
2. Create a new virtual maven repository which contains both `libs-release-local` and `libs-snapshot-local`
  <center><a href="{{ site.blogbaseurl }}img/blog/artifactory2_virtualrepo2.png"><img src="{{ site.blogbaseurl }}img/blog/artifactory2_virtualrepo2.png" alt="Create a new virtual maven repository which contains both libs-release-local and libs-snapshot-local"></a></center>
3. In the top level `build.gradle` of your application, add the following repository:

  ```groovy
  allprojects {
      repositories {
        maven { url "http://localhost:8081/artifactory/libs-local" }
      }
  }
  ```
