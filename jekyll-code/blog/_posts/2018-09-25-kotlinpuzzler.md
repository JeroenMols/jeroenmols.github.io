---
title: A little Kotlin puzzler
published: true
header:
  teaser: img/blog/kotlinpuzzler/kotlinpuzzler.jpg
  imgcredit: Photo by Ryoji Iwata on Unsplash, https://unsplash.com/photos/5siQcvSxCP8, cropped and added Kotlin logo
tags:
  - kotlin
  - lambda
  - puzzle
---
Kotlin is an incredibly enjoyable, concise and powerful programming language. Yet sometimes also a bit confusing...

## Puzzle
Have a look at the simple class below. It simulates an ongoing operation by smoothly moving a progress bar from 0 to 100 over the course of 30 seconds:

```kotlin
class ProgressbarAnimator(private val progressBar: ProgressBar) : AnimatorUpdateListener {

    private lateinit var animator: ValueAnimator

    init {
        configureAnimator()
        animator.addUpdateListener { this }
        animator.start()
    }

    fun configureAnimator() {
        val endValue = (FPS * DURATION).toInt()
        progressBar.max = endValue

        animator = ValueAnimator.ofInt(0, endValue)
        animator.duration = DURATION
        animator.interpolator = LinearInterpolator()
    }

    override fun onAnimationUpdate(p: ValueAnimator?) {
        progressBar.progress = animator.animatedValue as Int
    }

    companion object {
        private const val FPS = 0.06
        private const val DURATION = 30 * 1000L
    }
}

```

What do you think will happen if we instantiate one of these with a given progress bar?

Well... nothing! The progress bar doesn't move at all.

Can you spot what's wrong? The error is in the following lines:

```kotlin    
init {
    configureAnimator()
    animator.addUpdateListener { this }
    animator.start()
}
```
Any luck?

...

...

...

Well this is the actual culprit:

```kotlin
animator.addUpdateListener { this }
````

There is syntactically a very subtle, yet incredibly important difference between that line and this:

```kotlin
animator.addUpdateListener(this)
```

If we change our init to the latter, then the progress bar works as expected!

# Explanation
One of the Kotlin features is that if the last argument of a method call is a lambda, you can move the lambda outside of the method invocation. (which is great for building [DSLs](https://proandroiddev.com/writing-dsls-in-kotlin-part-1-7f5d2193f277))

Consequently,

```kotlin
animator.addUpdateListener { this }
````

is equivalent to

```kotlin
animator.addUpdateListener() { this }
````

and even

```kotlin
animator.addUpdateListener({ this })
````

and by expanding the lambda, this

```kotlin
animator.addUpdateListener({ _ -> this })
````

So the reason why the progress bar wasn't working is simple. Instead of registering itself as an `AnimationUpdateListener`, it actually registered a lambda, a new function to handle the animation updates.

So every animation update the lambda `{ _ -> this }` was invoked instead of the `onAnimationUpdate` method. Thereby not doing anything, it just has the `this` object without any invocation on it.

Equivalent to writing the following function:

```kotlin
fun doNothing() {
  5
}
````

Perfectly valid syntax, but otherwise completely useless.

## Wrap-up
A very subtle difference in syntax (`{}` instead of `()`) can make a huge difference in what the code actually does. Kotlin is a very powerful programming language, but with great power comes great...

If you've made it this far you should probably follow me on {% include link_twitter.html %}. Feel free leave a comment below!
