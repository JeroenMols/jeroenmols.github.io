---
title: Implementation vs API dependency
published: true
header:
  teaser: img/blog/androidstudio3/androidstudio3.png
  imgcredit: Android Studio 3.0 launch screen, https://androidstudio.googleblog.com/2017/05/android-studio-30-canary-1-sdk-updates.html,
    cropped
tags:
- android
- tools
- gradle
date: '2017-06-14'
---

Upgrading to Android studio 3.0 territory will make building multi-module projects a lot faster, but it also means a breaking Gradle plugin API change unfortunately.

This blog post will detail all benefits of this change and guide you through the upgrade process.

## Problem situation
To understand the limitations of the old Gradle plugin 2.0 build system, consider the following project with multiple layers of modules:

![Base project with multiple modules]({{ site.url }}{{ site.baseurl }}/img/blog/androidstudio3/project.png){: .align-center}

Looking at the bottom most module, there are basically two different changes you could make:

1. Implementation change: internal change, doesn't modify the external interface of the module
2. Application binary interface (ABI) change: modify the external interface of the module

Note: In what follows, all recompiled modules will be highlighted in red.

### Implementation change
Since the external interface of the module doesn't change, Gradle will only recompile that module. All of its consuming modules will be left untouched.

![Implementation change with Gradle 2.0]({{ site.url }}{{ site.baseurl }}/img/blog/androidstudio3/project_implementation.png){: .align-center}

There is no problem in this scenario.

### ABI change
When the external interface of a module changes however, also the modules consuming that module directly need to be recompiled.

![Code change (ABI) with Gradle 2.0 compile dependencies]({{ site.url }}{{ site.baseurl }}/img/blog/androidstudio3/project_gradle_2.0_step1.png){: .align-center}

But those modules could be exposing parts of the bottom module directly through their own interface! So to be completely safe, they would also need to be recompiled. Same for the ones using those... and those... and...

Hence Gradle would effectively need to recompile all modules.

![Code change (ABI) with Gradle 2.0 compile dependencies]({{ site.url }}{{ site.baseurl }}/img/blog/androidstudio3/project_gradle_2.0_final.png){: .align-center}

Now we do have a big problem: one code change causes all modules to be recompiled. The root cause for this is that Gradle doesn't know if you leak the interface of a module through another one or not.

## Android Gradle plugin 3.0 to the rescue
The latest Android Gradle plugin now requires you to explicitly define if you leak a module's interface. Based on that it can make the right choice on what it should recompile.

As such the `compile` dependency has been deprecated and replaced by two new ones:

* `api`: you leak the interface of this module through your own interface, meaning exactly the same as the old `compile` dependency
* `implementation`: you only use this module internally and does not leak it through your interface

So now you can explicitly tell Gradle to recompile a module if the interface of a used module changes or not.

```groovy
dependencies {
  // recompile this module and all modules using this one
  // when legofy interface is modified
  api project(':legofy')

  // only recompile this module when landscapevideocamera interface is modified
  implementation project(':landscapevideocamera:1.0.0')
}
```

### Migration guide
In theory you can simply replace all `compile` dependencies with `api` dependencies, but that would still cause everything to be recompiled:

![Code change (ABI) with Gradle 3.0 api dependencies]({{ site.url }}{{ site.baseurl }}/img/blog/androidstudio3/project_gradle_2.0_final.png){: .align-center}

So better approach is to replace all `compile` dependencies with `implementation` dependencies. And only where you leak a module's interface, you should use `api`. That should cause a lot less recompilation.

![Code change (ABI) with Gradle 3.0 implementation dependencies]({{ site.url }}{{ site.baseurl }}/img/blog/androidstudio3/project_gradle_3.0.png){: .align-center}

Hopefully, this clarifies the ambiguity between `api` and `implementation`, as the official [migration guide](https://developer.android.com/studio/preview/features/new-android-plugin-migration.html#new_configurations) is quite cryptic.

### Other dependency configurations
As there was already a breaking change, the team also made use of the opportunity to finally give the other configurations proper names:

* `provided` configuration is now `compileOnly`
* `apk` configuration is now `runtimeOnly`

Just like before you can also combine these with your build variants: `debugApi`, `testImplementation`,...

## Other migration items
Android Studio 3.0 packs tons of other improvements that have finally been addressed. My favorites are:

* all Google dependencies are available via an online Maven repository
* current build variant can now be passed through to your libraries, removing the need for `publishNonDefault true`
* ...

For more information have a look at the complete [migration guide](https://developer.android.com/studio/preview/features/new-android-plugin-migration.html).

## Wrap-up
To build multi-module projects faster, the Android Gradle plugin needed a breaking API change. Always try to use the `implementation` dependency as this will cause fewer modules to be recompiled.

As always you can reach me on [Mastodon](https://androiddev.social/@Jeroenmols), or leave a comment below!
