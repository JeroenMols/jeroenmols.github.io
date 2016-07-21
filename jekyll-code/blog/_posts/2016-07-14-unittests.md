---
layout: post
title: Write awesome unit tests
published: false
comments: true
img: img/blog/unittests/unittests.png
---
If you can write code, you can also write unit test. Writing awesome tests on the other hand is a different story. Don't fool yourself: Unit testing code is production code that you will need to maintain, refactor and build upon for years to come.

This blogpost aims at providing three very simple rules that will significantly ramp up your testing game. These will reduce test code maintenance and increase the feedback/value you get from a failing test.

<br>

## Run ludicrously fast
The only reason you write unit tests is to run them. This has two benefits:

1. confirm that something is working properly
2. detect when something stopped working

In summary, tests are your safety net, the main weapon against regression. They make sure bugs remain fixed and allow you to refactor your code.

There is one caveat however: for tests to do their job, you need to run them!

Every time they run, they give you feedback about the code. And the shorter you can get your feedback loop, the sooner you'll notice bugs and the easier (=cheaper) it will be to fix. That means you don't just want to run them before every release, nor on a daily basis, but literally after every change you make.

The more you run your test, the more value you'll get from them.

Now the amount of times you'll run your tests is inversely proportional to the time it takes for all tests to complete. Consequently for you to run your tests often, they need to run fast... ludicrously fast.

Not in one minute, not even in 10 seconds, but your entire test suite should pass in less than a second!

This means you'll have to:

- run your tests on a JVM instead of on a device
- only test isolated pieces of business logic
- don't include UI, database or network tests in your main test suite

<br>

## Small and focussed tests
// TODO

<br>

## 100% reliable

<br>

## Wrap-up
//TODO

As always you can reach me [@molsjeroen](https://twitter.com/molsjeroen) on twitter, or leave a comment below!
