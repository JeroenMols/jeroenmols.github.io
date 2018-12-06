---
title: Can you fix the test?
published: true
header:
  teaser: img/blog/fixthetest/fixthetest.jpg
  imgcredit: Photo by Daniel Cheung on Unsplash, https://unsplash.com/photos/ZqqlOZyGG7g, cropped
tags:
  - testing
  - kotlin
  - cleancode
---
Learning from analyzing code is one of the greatest ways to improve your skills. Can you spot the mistakes in the tests below?

This post brings a fun little quiz for both testing gurus as novices, with a deep dive into the how and why of awesome tests.

## Case 1: sugary
```kotlin
// Instrumented test, run on Android device.
@RunWith(AndroidJUnit4::class)
class CalculatorTest : TestCase() {

    fun test_sumShouldAddNumbers() {
        val sum = Calculator().sum(1, 2)

        assertThat(sum).isEqualTo(3)
    }
}
```

Take a good look at the test above and think what you would do differently.

...

Don't worry, I'll wait.

...

Ready?

Well there are actually quite some things wrong with this test, but the main problem is the syntax:

- `CalculatorTest` inherits from `TestCase`
-  `test_sumShouldAddNumbers()` is prefixed with `test`

This is actually the old [JUnit3](http://junit.sourceforge.net/junit3.8.1/) syntax, whereas Android currently supports [JUnit4](https://junit.org/junit4/) (and even [JUnit5](https://junit.org/junit5/)).

In these newer frameworks, the inheritance and prefixing are not required. All you have to do is annotate each test method with `@Test`.

```kotlin
// Instrumented test, run on Android device.
@RunWith(AndroidJUnit4::class)
class CalculatorTest {

    @Test
    fun sumShouldAddNumbers() {
        val sum = Calculator().sum(1, 2)

        assertThat(sum).isEqualTo(3)
    }
}
```

Interestingly enough the JUnit4 conversion enables two additional optimizations:

- since `test` prefix is not required for test methods, we can use the backtick notation in Kotlin to make more descriptive test names (e.g. \`sum of 1 and 2 should equal 3\`)
- since we are only using JUnit4 now, there is no need to declare `@RunWith(AndroidJUnit4::class)` as this is only required to run both JUnit3 and 4 tests in the same file

This dramatically clarifies our test:

```kotlin
class CalculatorTest {

    @Test
    fun `sum of 1 and 2 should equal 3`() {
        val sum = Calculator().sum(1, 2)

        assertThat(sum).isEqualTo(3)
    }
}
```

Note that the test above also doesn't need to be run on an Android device as it doesn't use the Instrumentation framework.

The `@RunWith()` annotation was only added to be able to explain what `AndroidJunit4` does.

> TL;DR All you need is @Test annotations on test methods

## Case 2: exceptional
```kotlin
@Test
fun `divide by zero should throw an exception`() {
    try {
        Calculator().divide(1, 0)
        fail("No exception thrown")
    } catch (e: RuntimeException) {
    }
}
```

Alright, now that you're warmed up, have a good look at the next test.

...

Going for a quick coffee brb...

...

Trying to catch the exception yourself and making the test fail subsequently is quite verbose, no?

There is actually a better way of doing this, by using the `expected` annotation.

```kotlin
@Test (expected = RuntimeException::class)
fun `divide by zero should throw an exception`() {
    Calculator().divide(1, 0)
}
```

This doesn't just amount to less code to write (and maintain) but you'll also get a proper error message out of the box.

```text
java.lang.AssertionError: Expected exception: java.lang.RuntimeException
```

> TL;DR Use @Test (expected = ...) for expected exceptions

## Case 3: assertive
```kotlin
@Test
fun `should ask WebService to login`() {
    val result = User(mockWebService).login()

    verify(mockWebService).login()
    verify(mockWebService, never()).logout()
}
```

An example with mocks this time! Can you spot the improvement?

...

I'm not mocking you, I promise! ;)

...

Imagine for a second that the test above fails... What could be the cause of that?

There are actually a few different possibilities:

- either `login()` was not called
- or `logout()` was called
- or both of the above

Because the test can fail for multiple reasons, you can never conclude from the failure output what the problem is. Instead you have to dive deeper into each failing test, which can be quite time consuming and frustrating.

Wouldn't it be nice if every tests would just fail for one single reason?

```kotlin
@Test
fun `login should ask WebService to login`() {
    val result = User(mockWebService).login()

    verify(mockWebService).login()
}

@Test
fun `login shouldn't ask WebService to logout`() {
    val result = User(mockWebService).login()

    verify(mockWebService, never()).logout()
}
```

If one of those fail, the test message will immediate tell you what's going wrong!

This actually isn't the only reason why you should only use one single assert/verify per test:

- JUnit4 stops test execution after the first failure: so if the first assert fails, the following ones aren't executed! Consequently you don't know how many problems there are on test failure.

- Too many assertions can make code nearly impossible to refactor: To fully test a login functionality, you probably need over 10 tests (username null, wrong password,...), right? Imagine that every single test also explicitly checks that logout isn't called on login... What happens now if your requirement changes and you need to support immediate logout after login? (e.g. For Android Wear) Then you would have to refactor all those tests!!!

> TL;DR Use only one assert/verify per test

## Case 4: divided
```kotlin
@Test
fun `should do multiple calculations`() {
    val calculator = Calculator()
    val sum = calculator.sum(1, 2)

    val division = calculator.divide(sum, 3)

    assertThat(division).isEqualTo(1f)
}
```

...

You know the drill...

...

Let's step through the test: first it calculates the sum of 1 and 2, followed by a division of the result by 3.

Why are we testing that sequence? Mathematical operations (add/divide) aren't supposed to have side effects (and influence each other), right?

Even more, the interface of `Calculator` makes that clear: both `sum()` and `divide()` take all parameters they need as an input to produce an output.

So if `sum()` and `divide()` are already tested, there really isn't an added benefit of testing the sequence, right?

Instead, there are quite some disadvantages:

- the combined test is harder to understand (more steps)
- the combined test can fail due to multiple reasons (causing more failure analysis effort).
- it's unclear what combinations of steps should be tested and which ones not (where do you stop?)
- not really a unit test

Hence this test should be split it two:

```kotlin
@Test
fun `sum of 1 and 2 should be 3`() {
    val sum = Calculator().sum(1, 2)

    assertThat(sum).isEqualTo(3)
}

@Test
fun `division of 3 and 3 should be 1f`() {
    val division = Calculator().divide(3, 3)

    assertThat(division).isEqualTo(1f)
}
```

> TL;DR Only unit test one method per test

## Case 5: readable
```kotlin
class WebServiceTest {

    lateinit var webService: WebService

    @Before
    fun setUp() {
        webService = WebServiceTestHelper.createWebService()
    }

    @Test
    fun `login should fail when wrong password`() {
        val result = webService.login()
        checkLoginFailed(result)
    }
}
```

Let's make things slightly more interesting...

...

Any ideas?

...

In order to understand what's bad about this test, you need to imagine a lot more tests in the same file.

If you where to encounter the test above somewhere in a file with a lot more tests, it would take you quite some time to figure out what's going on:

- Need to look at `setUp()` method to understand where the WebService under test is coming from
- Need to open `WebServiceTestHelper`to understand the WebService initialization
- Need to open `checkLoginFailed()` method to see how a failed login is identified

That's a lot of work!

The problem here is that the reader constantly has to exit the test method to figure out what's going on.

Removing the `setUp` method, inlining the `WebServiceTestHelper` and the `checkLoginFailed()` method yields the following.

```kotlin
class WebServiceTest {

    @Test
    fun `loginHasFailed`() {
var webService = WebService()
        webService.setUserCredentials("email@google.com", “wrong_pwd”)

        val result = webService.login()

        assertThat(result.isSuccess).isFalse()
    }
}
```

Notice how easy it has now become to understand what's going on in the test!

But wouldn't that lead to quite some code duplication you say? Well, I'm glad you ask. YES! But even though testing code is also production code, the [same rules don't](https://mtlynch.io/good-developers-bad-tests/) completely apply.

It is fine for test code to have duplication, magic numbers/strings, long method names,...  Readability and ease of fixing failures are what matter most.

> TL;DR Always keep the reader within the test function


## Case 6: trustworthy
```kotlin
@Test
fun `should properly format time`() {
    val expectedTime = FORMAT.format(Date())

    val formattedTime = TimeFormatter().currentFormattedTime

    assertEquals(expectedTime, formattedTime)
}

companion object {
    private val FORMAT = SimpleDateFormat("HH:mm:ss:SSS")
}
```

And the final contender of the day is...

...

Any ideas?

...

Simply put, this test is flaky. It will only fail very rarely, but still it will.

Reason for this is that the `expectedTime` isn't the time used by the `TimeFormatter` and hence there will be a slight difference (~ ns) between both. When rounding works against us, this could actually end up in a real formatted ms difference.

And flakiness in tests, well... no matter how infrequent, we should have a [zero tolerance policy]({{ site.baseurl }}{% link blog/_posts/2017-02-16-unittests.md%}) towards them. This is because flakiness can completely destroy the confidence of the team in the test suite.

Fortunately this can easily be fixed by passing the current time into the `TimeFormatter`.

```kotlin
@Test
fun `should properly format time`() {
    val now = Date()
    val expectedTime = FORMAT.format(now)

    val formattedTime = TimeFormatter(now).currentFormattedTime

    assertEquals(expectedTime, formattedTime)
}

companion object {
    private val FORMAT = SimpleDateFormat("HH:mm:ss:SSS")
}
```

> TL;DR Tests should never randomly fail

## Wrap-up
Putting it all together, great tests follow the following principles:

- All you need is @Test annotations on test methods
- Use @Test (expected = ...) for expected exceptions
- Only one assert/verify per test
- Only unit test one method per test
- Always keep the reader within the test function
- Tests should never randomly fail

Check out my slides/video to learn more about [awesome unit tests](https://speakerdeck.com/jeroenmols/write-awesome-unit-tests).

If you've made it this far you should probably follow me on {% include link_twitter.html %}. Feel free leave a comment below!
