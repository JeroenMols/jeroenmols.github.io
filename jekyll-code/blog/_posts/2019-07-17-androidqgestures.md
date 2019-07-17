---
title: Supporting Android Q gestural navigation
published: true
header:
  teaser: img/blog/androidqgestures/androidqgestures.png
  imgcredit: Philips Hue app app screenshot, https://play.google.com/store/apps/details?id=com.philips.lighting.hue2, cropped and placed on dark background
tags:
  - ui
  - androidq
  - navigation
  - gestures
---
From Android Q onwards devices can now operate in a fully gestural system navigation mode. In that mode, there is no longer an on-screen back button, but users can instead swipe from both edges to navigate back.

In this blog post, we'll look at a case study on how we added support for these back gestures in the Philips Hue app.

## Unique Challenge
At Philips Hue we've heavily optimized the information density so users can control a maximum amount of rooms/zones (cards) within one screen:

![Philips Hue home screen design]({{ site.url }}{{ site.baseurl }}/img/blog/androidqgestures/hue_homescreen.png){: .align-center .width-half}

There are three main optimizations to make the maximum amount of cards fit:

1. The brightness slider is aligned with the bottom of the card
2. Card height is smaller when a room/zone is off
3. Brightness slider only responds to swiping the handle, not clicking on a position in the slider. This is done to avoid confusion with a card click to enter a room/zone.

Let's investigate how these created some unique challenges to prepare our app for Android Q gesture navigation.

## Edge to edge Brightness sliders
To start, as the cards go nearly edge to edge, moving the bottom aligned brightness slider isn't possible when the thumb is near the min or max. Instead, the back gesture is triggered:

![Back navigation gestures prevent from moving the brightness slider]({{ site.url }}{{ site.baseurl }}/img/blog/androidqgestures/no_exclusions.gif){: .align-center}

Fortunately, Android Q offers a way to tell the Android system that it shouldn't intercept gestures in a particular area of the screen using [`setSystemGestureExclusionRects`](https://developer.android.com/reference/android/view/View#setSystemGestureExclusionRects(java.util.List%3Candroid.graphics.Rect%3E)):

```kotlin
brightnessSlider.doOnLayout {
    val exclusions = listOf(
            Rect(0, 0, exclusionWidth, it.height), // min area
            Rect(it.width - exclusionWidth, 0, it.width, it.height) // max area
        )
    ViewCompat.setSystemGestureExclusionRects(brightnessSlider, exclusions)
}
```

In the example above, we exclude both the minimum and maximum area of the brightness slider from navigation gestures.

Important to know is that you should define the `systemGestureExclusionRects` in coordinates relative to the `View`/`ViewGroup` you are applying the exclusion `Rect`s on!

In the example above we apply them on the brightness slider so we use coordinates relative to the slider (notice the use of `width` and `height`). But we can also apply the exclusion to the parent (notice the use of `left` and `right`):

```kotlin
parent.doOnLayout {
    val exclusions = with(brightnessSlider) {
      listOf(
            Rect(left, top, exclusionWidth, bottom), // min area
            Rect(right - exclusionWidth, top, right, bottom) // max area
        )
    }
    ViewCompat.setSystemGestureExclusionRects(parent, exclusions)
}
```

At any rate, we can only apply the exclusion `Rect`s once the view is laid out, hence we wrap the `setSystemGestureExclusionRects` with the awesome [`doOnLayout` method](https://developer.android.com/reference/kotlin/androidx/core/view/package-summary#doonlayout) from Android KTX.

While the width of the exclusion area can be determined by adding an `OnApplyWindowInsetsListener` and taking the `getSystemGestureInsets` from the returned insets, you can also simplify this and use a hardcoded dimension that is at least 20dp.

Finally, note that you need to use at least androidx.core version 1.2.0 or higher in order for the [ViewCompat API](https://developer.android.com/reference/androidx/core/view/ViewCompat#getSystemGestureExclusionRects(android.view.View)) to be available. If you're not ready to jump on 1.2.0 yet, you can always surround it with an API level check (make sure to use compile SDK Q).

```kotlin
if (Build.VERSION.SDK_INT >= Q) {
    val exclusions = with(brightnessSlider) {
        listOf(
            Rect(0, 0, exclusionWidth, height),
            Rect(width - exclusionWidth, 0, width, height)
        )
    }
    brightnessSlider.setSystemGestureExclusionRects(exclusions)
}
```

## Exclusion limitations
Android Q only allows excluding a maximum of 200dp from each edge from back navigation. Otherwise, apps could exclude both full edges and completely break the back navigation.

Unfortunately, this creates a problem for us as our screen can show up to 8 cards at any given point in time. Hence we would require almost double the allowed maximum assuming our brightness slider has a 48dp height!!!

Requesting too much area exclusion area, will cause the topmost cards not to have any exclusion as Android grants the exclusions from top to bottom:

<script async class="speakerdeck-embed" data-slide="82" data-id="62721c9fa7ca493aad3dd38f978dacf9" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

So how do we solve this?

First of all, the thumb of the brightness slider can only be at one edge at any given point in time, so the very first thing we can do is only exclude a brightness slider edge when the thumb is there:

```kotlin
brightnessSlider.doOnLayout {
    if (isThumbNearMin()) {
        ViewCompat.setSystemGestureExclusionRects(it, getMinExclustionRect())
    } else if (isThumbNearMax()) {
        ViewCompat.setSystemGestureExclusionRects(it, getMaxExclusionRect())
    } else {
        ViewCompat.setSystemGestureExclusionRects(it, emptyList())
    }
}
```

This doesn't just improve the user experience (by supporting back gestures on most cards), but it also significantly reduces the likelihood that we request more than the max exclusion area. Only when more than 5 cards are at full brightness or minimum brightness we would still exceed!

Secondly, when cards are off (and the brightness slider is at 0 alpha), we also shouldn't ask for any exclusions of such a slider:

```
if (!switch.checked) {
    ViewCompat.setSystemGestureExclusionRects(brightnessSlider, emptyList())
}
```

The end result is pretty neat:

![Back navigation gestures with min/max exclusions for brightness slider]({{ site.url }}{{ site.baseurl }}/img/blog/androidqgestures/minmax_exclusions.gif){: .align-center}

- When thumb is near max/min: you can swipe back from the opposite edge
- When thumb is not near max/min: you can swipe back from both edges

## Crosstalk with brightness sliders
Unfortunately, all isn't good just yet in, because in very rare cases back navigation would still accidentally causee `onTouchEvent` of our custom brightness slider to also be called:

![Back navigation gestures first causes brightness slider to jump to max before navigating back]({{ site.url }}{{ site.baseurl }}/img/blog/androidqgestures/crosstalk_exclusion.gif){: .align-center}

Imagine a user opening our app, lowering the brightness of a room and then navigating back just to see the brightness jumping back to 100% right before the app exits... infuriating!

To fix this we decided to detect whether a swipe gesture is being performed near the min/max of the brightness slider while the thumb isn't there. In that case, the system should handle the navigate back and we should ignore the touch:

```kotlin
private fun isTouchInterferingWithBackNavigation(touchX: Float): Boolean {
    if (Build.VERSION.SDK_INT < Q) return false

    val positionOnSlider = (getProgressForXPosition(touchX) - min).toFloat() / (max - min)
    val slideGestureNearMinNotOnThumb = positionOnSlider < 0.1f && !isThumbNearMin
    val slideGestureNearMaxNotOnThumb = positionOnSlider > 0.9f && !isThumbNearMax
    return slideGestureNearMinNotOnThumb || slideGestureNearMaxNotOnThumb
}
```

Ignoring the touch is as easy as just returning false in the `onTouchEvent` method:

```kotlin
when (ev.getAction() and MotionEvent.ACTION_MASK) {
    MotionEvent.ACTION_DOWN -> {
        if (isTouchInterferingWithBackNavigation(x)) {
            return false
        }
        ...
}
```

Note that this does impact the UX of our brightness slider as touch only works near the edges when the thumb is there. But this is a trade-off we made to avoid the thumb from accidentally jumping to the wrong position while navigating back.

Finally, we have the exact behavior we were looking for!

## Wrap-up
Android Q gesture navigation will impact how users interact with our apps. For most apps, this should work out of the box, but in rare cases, the system gesture exclusion API can help whitelist parts of your app where touch is required to work near the edges.

Hopefully, you had an interesting read! If you want to get notified when I post new interesting content, you should probably follow me on {% include link_twitter.html %}. Feel free to leave a comment below!
