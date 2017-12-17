---
title: The curious case of haunting fragments
published: true
header:
  image: img/blog/fragmentback/fragmentback.jpg
  imgcredit: Photo by Pixabay, https://www.pexels.com/photo/night-building-forest-trees-42263/, cropped
tags:
  - android
  - fragment
  - navigation
---
Fragment transactions and back navigation are familiar for every Android developer. So did I think this concept didn't have any secrets anymore for me, until a Fragment (literally) started to haunt us...

This post will show how a seemingly simple transaction can have unintended side effects. And give a detailed explanation of how fragment transactions work.

## Problem explanation
Let's build a very simple app that shows all todays' calendar events for a particular user. This app basically consists out of 1 main screen that:

- either shows todays' events if user is logged in
- otherwise shows a placeholder + login button

![Main screens shows either list of events or a placeholder with login button]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_explanation.png){: .align-center}

Login is a multi step flow that consists out of a `UserNameFragment` and a `PasswordFragment`. After the login is successful, the app navigates back to the main screen to show the events.

[![Event app with login flow simplified]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_flow_simplified.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_flow_simplified.png)

Note that for simplicity we'll leave displaying the events out of scope and return back to the placeholder screen after successful login.

A very simple implementation for all FragmentTransactions could be:

```kotlin
transaction.replace(TodayFragment())
transaction.replace(UserNameFragment()).addToBackStack(null)
transaction.replace(PasswordFragment())
```

Where we only add the `UserNameFragment` to the back stack to simplify back navigation. This way one single back would always take the user back to the `TodayFragment`, making it super easy to navigate back when login was successful.

```kotlin
fun onLoginSuccess() {
  activity.onBackPressed()
}
```

But that gives surprising results:

![Password fragment is back to haunt us]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/fragmentback_ghost.gif){: .align-center}

The `PasswordFragment` is back to haunt us!

## Investigation
Let's have another look at the sequence of transactions that takes place:

```kotlin
transaction.replace(todayFragment)
transaction.replace(userNameFragment).addToBackStack(null)
transaction.replace(passwordFragment)
```

Since a replace is just a combination of `remove()` and `add()` we can rewrite this to:

```kotlin
transaction.remove(null).add(todayFragment)
transaction.remove(todayFragment).add(userNameFragment.addToBackStack(null)
transaction.remove(userNameFragment).replace(passwordFragment)
```

Now it is important to know that the FragmentTransactionManager only saves the FragmentTransactions that were executed, not the Fragments themselves!

Consequently when you press back in the `PasswordFragment`, it won't show all Fragments that where present before the Transaction! Instead it will revert the previous Transaction that was added to the back stack:

```kotlin
transaction.remove(todayFragment).add(userNameFragment).addToBackStack(null)
```

Which will then be executed in reverse:

```kotlin
transaction.remove(userNameFragment).add(todayFragment)
```

But because we are on the `PasswordFragment`, which has replace the `UserNameFragment`, there is no `UserNameFragment` in this situation!

```kotlin
transaction.remove(null).add(todayFragment)
```

Hence nothing is removed and the `TodayFragment` is added leaving the users with both the `PasswordFragment` and `TodayFragment`.

![Haunting password fragment]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_haunting.png){: .align-center}

# Solution

[![Event app with login flow]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_flow_ideal.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_flow_ideal.png)



[![Event app with login flow problem]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_flow_problem.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_flow_problem.png)

## Wrap-up
Code coverage can be an incredibly powerful tool to improve the quality of your code as long as you don't blindly optimize for maximum coverage.

mention code on Github

If you've made it this far, you should probably follow me on {% include link_twitter.html %}. Feel free leave a comment below!
