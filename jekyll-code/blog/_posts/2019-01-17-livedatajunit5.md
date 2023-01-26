---
title: Testing LiveData in JUnit 4 and JUnit 5
published: true
header:
  teaser: img/blog/livedatajunit5/livedatajunit5.jpg
  imgcredit: Photo by James Pond on Unsplash, https://unsplash.com/photos/HUiSySuofY0, cropped
tags:
  - testing
  - architecture
  - livedata
---
Architecture components are one of the most exciting things that happened to Android in the past years. But how do you effectively go about and testing this?

## Problem statement
One of the interesting problems LiveData solves is to ensure the observer is always called on the main thread. This happens in the following ways:

- `setValue()`: crashes if not called from main thread
- `postValue()`: swaps to main thread and is safe to be called from any background thread

Now what happens if you call any of these methods in a junit test?

When calling `livedata.setValue()` or `livedata.value =` you get:

```
java.lang.RuntimeException:
Method getMainLooper in android.os.Looper not mocked.
```

Or alternatively when `unitTests.returnDefaultValues = true` is on:

```
java.lang.NullPointerException
at androidx.arch.core.executor.DefaultTaskExecutor.isMainThread(DefaultTaskExecutor.java:74)
```

This makes sense, because JVM unit tests don't know anything about the Android main thread! Hence all unit test are executed on a random (background) thread.

> Note that this is true in general. The main Thread is just a concept provided by most UI frameworks to avoid race conditions while updating the UI. E.g. on Android the main thread is provided by the Android Framework, for Java applications the main thread is provided by Swing (for instance).

When calling `livedata.postValue()`, you get similar results.

However here the problem is even more fundamental as this can never work. Even if the main thread would exist in the test, then the actual value update would happen asynchronously from the test, causing the asserts to happen before the value is actually updated.

## JUnit 4
Solving this means doing two things:

- don't update live data on the main thread
- update live data immediately (don't post value)

Fortunately the architecture components team has provided a JUnit rule to do exactly that:

```kotlin
class ExampleUnitTest {

    @get:Rule
    val rule = InstantTaskExecutorRule()

    @Test
    fun `my test`() {
        val mutableLiveData = MutableLiveData<String>()

        mutableLiveData.postValue("test")

        assertEquals("test", mutableLiveData.value)
    }
}
```

All you have to do is add a `InstantTaskExecutorRule()` to the class containing ViewModel and add the following Gradle dependency:

```groovy
dependencies {
    testImplementation 'android.arch.core:core-testing:1.1.1'
}
```

## JUnit 5
This doesn't work for JUnit 5 however as the concept of `Rule` and `TestRunner` are merged into one single concept of [`Extensions`](https://junit.org/junit5/docs/current/user-guide/#extensions).

Hence we can create a similar extension like the `InstantTaskExecutorRule`:

```kotlin
import androidx.arch.core.executor.ArchTaskExecutor
import androidx.arch.core.executor.TaskExecutor
import org.junit.jupiter.api.extension.AfterEachCallback
import org.junit.jupiter.api.extension.BeforeEachCallback
import org.junit.jupiter.api.extension.ExtensionContext

class InstantExecutorExtension : BeforeEachCallback, AfterEachCallback {

    override fun beforeEach(context: ExtensionContext?) {
        ArchTaskExecutor.getInstance()
            .setDelegate(object : TaskExecutor() {
                override fun executeOnDiskIO(runnable: Runnable) = runnable.run()

                override fun postToMainThread(runnable: Runnable) = runnable.run()

                override fun isMainThread(): Boolean = true
            })
    }

    override fun afterEach(context: ExtensionContext?) {
        ArchTaskExecutor.getInstance().setDelegate(null)
    }

}
```

This basically does two things:

- set a delegate before each test that updates live data values immediately on the calling thread
- remove the delegate after each tests to avoid influencing other tests.

Using this, the JUnit 4 test can easily be converted to JUnit 5:

```kotlin
@ExtendWith(InstantExecutorExtension::class)
class PhotosViewModelTest {

    @Test
    fun `my test`() {
        val mutableLiveData = MutableLiveData<String>()

        mutableLiveData.postValue("test")

        assertEquals("test", mutableLiveData.value)
    }
```

Voila! That's it.

## Wrap-up
In order to test LiveData, it's values need to be directly updated on the calling thread. This can be done using
a rule in JUnit 4 or an extension in JUnit 5.

If you've made it this far you should probably follow me on [Mastodon](https://androiddev.social/@Jeroenmols). Feel free leave a comment below!
