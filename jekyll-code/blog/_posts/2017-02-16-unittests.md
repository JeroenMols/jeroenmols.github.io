---
layout: post
title: Write awesome unit tests
published: true
comments: true
img: img/blog/unittests/unittests.png
imgcredit: Alberto G., https://creativecommons.org/licenses/by/2.0/, cropped
---
If you can code, you can also write unit tests. Writing awesome tests on the other hand is a different story. Don't fool yourself: Unit testing code is production code that you will need to maintain, refactor and build upon for years to come.

This blogpost aims at providing three very simple rules that will significantly ramp up your testing game. Every rule is followed by pragmatic tips so you can easily start implementing.

<br>

## 1. Run ludicrously fast
The only reason you write unit tests is to run them. This has two benefits:

1. confirm that something is working properly
2. detect when something stopped working

In summary, tests are your safety net, the main weapon against regression. They make sure bugs remain fixed and allow you to refactor your code.

There is one caveat however: for tests to do their job, you need to run them!

Every time they run, they give you feedback about the code. And the shorter you can get your feedback loop, the sooner you'll notice bugs and the easier (=cheaper) it will be to fix. That means you don't just want to run them before every release, nor on a daily basis, but literally after every change you make.

> The more you run your test, the more value you'll get from them.

Now the less time you have to wait for your tests to run, the more often you're going to run them. Consequently for you to run your tests often, they need to run fast... ludicrously fast.

Not in one minute, not even in 10 seconds, but your entire test suite should pass in less than a second!

This means you'll have to:

- run your tests on a JVM instead of on a device
- only test isolated pieces of business logic
- don't include UI, database or network tests in your main test suite
- don't use wait/sleep statements in tests

<br>

## 2. Small and focussed tests
Always write your tests with failures in mind. This means explicitly designing your tests to catch bugs in your apps.

Given a bug, would you prefer:

- one bug -> multiple tests fail
- one bug -> exactly one test fails

Bingo, the second one, because that simplifies debugging. In case of a failing test you just look at the test name to see what went wrong.

```java
@Test
public void logInShouldFailWithWrongPassword() throws Exception {
  // Test code
}
```

>For every bug, exactly one test must fail. The root cause of failure should be described by the test name.

This forces you to only check for one thing per test and will lead to smaller tests that are easier to understand, easier to explain and easier to maintain.

That's why a good test should be small (=few lines of code) and focussed (=only test for one thing), just like any other method in our codebase.

This means you'll have to:

- write tests with only one single assert/verify statement
- have more small tests instead of fewer big ones
- clearly describe the cause of failure in test names

<br>

## 3. 100% reliable
Tests are your safety net, so whenever that tells you something is wrong... you'll have to take it seriously. That means dropping everything to go and fix that failing test.

Obviously that's quite frustrating as you're eager to build a feature and suddenly you have to start fire fighting somewhere else.

Now imagine analyzing the problem for a couple of hours, not finding anything wrong, rerunning the tests (out of desperation) and every test suddenly passes...

>The most frustrating thing for a developer is waisting time on random errors that are fixed by a clean or IDE restart

And if more tests behave the same way... you'll loose trust in your entire test suite. You stop taking failures seriously and stop having the benefits from your test suit altogether.

That's why all your test need to be 100% reliable and only fail when there is actually a problem.

This means you'll have to:

- run your tests on a JVM (connection to device can break)
- mock network communication during tests
- move UI/integration tests out of your unit test suite

<br>

## Wrap-up
The more you run your unit tests, the more value you'll get from them. Awesome unit tests facilitate exactly that by being fast, focussed and super reliable.

As always you can reach me [@molsjeroen](https://twitter.com/molsjeroen) on twitter, or leave a comment below!
