---
title: How dangerous permissions sneak into apps
published: true
header:
  teaser: img/blog/phonestatepermission/phonestatepermission.jpg
  imgcredit: Photo by Skitterphoto on Pexels, https://www.pexels.com/photo/brown-wooden-mouse-trap-with-cheese-bait-on-top-633881/,
    cropped
tags:
- android
- permissions
- modules
- manifest
- post-mortem
date: '2018-08-02'
---

This is a post-mortem where the very dangerous permission, `READ_PHONE_STATE`, unintentionally sneaked into our app. Here's how this could happen, how we debugged and finally how we solved it.

## Prologue
Sprint comes to an end and we're happy to deliver a new release of our app. After rolling it out to our beta community without issues, we move ahead to production.

While everything looks fine at first, after a while we see users complaining:

![Users complaining: Why does this app want to know if I'm in a phone call and who I'm calling?]({{ site.url }}{{ site.baseurl }}/img/blog/phonestatepermission/userreview.png){: .align-center}

Honestly we were completely taken aback by this... But sure enough looking at the play store:

![Google play store permissions]({{ site.url }}{{ site.baseurl }}/img/blog/phonestatepermission/permissionsoverview.png){: .align-center}

## Root cause
If you ever run into a similar issue, the Android Studio merged manifest view is the way to go. Just open your manifest and click the `Merged manifest` tab at the bottom.

![Google play store permissions]({{ site.url }}{{ site.baseurl }}/img/blog/phonestatepermission/mergedmanifest.png){: .align-center }

Sure enough, the `READ_PHONE_STATE` permission is there.

Unfortunately, this view couldn't help us find where the permission was merged from:

- Double-clicking the permission led us back to normal manifest view
- Color coding palette is so subtle that we couldn't see what color the permission was highlighted in

<p><center><img style="width: 85%" src="{{ site.url }}{{ site.baseurl }}/img/blog/phonestatepermission/mergedmanifestcolors.png" alt="Color highlighting of manifest merger needs an extremely trained eye to map it on the legend"></center></p>

Fortunately, the manifest merger also prints a log file to `build/outputs/logs` that describes where everything is merged from.

<p><center><img style="width: 85%" src="{{ site.url }}{{ site.baseurl }}/img/blog/phonestatepermission/manifestmerger.png" alt="Output logs of the manifest merger are located at build/outputs/logs"></center></p>

This file gave a clear answer:

```text
uses-permission#android.permission.READ_PHONE_STATE
IMPLIED from /app/src/debug/AndroidManifest.xml:8:1-15:12
reason: hue.libraries.translations has a targetSdkVersion < 4
```

Wow... That's nasty!

A while ago we decided to move all our translations to a new module, with an empty manifest and a bare-bones `build.gradle` file:

```groovy
apply plugin: 'com.android.library'

android {
    compileSdkVersion Config.compileSdk
}
```

And because we didn't explicitly set the targetSdk, a targetSdk of 1 is assumed and hence we end up with a [dangerous permission](https://developer.android.com/reference/android/Manifest.permission.html#READ_PHONE_STATE)!

To be fair, the documentation does warn you about this:

![Google play store permissions]({{ site.url }}{{ site.baseurl }}/img/blog/phonestatepermission/permissiondisclaimer.png){: .align-center}

But still... wow!

## Solution
While a solution could be to simply set the targetSdk in our translations module. This wouldn't prevent something similar from happening in the future.

Therefore we decided to set the targetSdk (and others) for all our modules in the top level `build.gradle` file. This also keeps submodule `build.gradle` files lean.

```groovy
subprojects {
    afterEvaluate { project ->
        if (project.plugins.findPlugin('android') ?: project.plugins.findPlugin('android-library')) {
            android {
                buildToolsVersion Config.buildTools
                compileSdkVersion Config.compileSdk

                defaultConfig {
                    minSdkVersion Config.minSdk
                    targetSdkVersion Config.compileSdk
                }

                compileOptions {
                    sourceCompatibility Config.javaVersion
                    targetCompatibility Config.javaVersion
                }
            }
        }
    }
}
```

Additionally, we also wanted to protect ourselves against 3rd party library developers that could make this mistake. To do so, you can inform the manifest merger to remove the permission while merging by adding the following to your manifest:

```xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" tools:node="remove"/>
```

That is overkill you say?

Well, [Firebase](https://github.com/firebase/quickstart-unity/issues/68) AND [Google play services](https://developers.google.com/android/guides/releases#november_2016_version_100) already made this booboo in the past.

... wow!

## Wrap-up
Not explicitly setting your target SDK version will cause a dangerous permission to sneak into your app. Make sure you set the target SDK in every module and protect yourself from 3rd party libraries.

If you've made it this far you should probably follow me on [Mastodon](https://androiddev.social/@Jeroenmols). Feel free leave a comment below!
