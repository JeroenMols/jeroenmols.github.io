---
title: The curious case of haunting fragments
published: true
header:
  image: img/blog/fragmentback/fragmentback.jpg
  imgcredit: Jeroen Mols
tags:
  - android
  - fragment
  - navigation
---
Executing Fragment transactions and back navigation is familiar territory for every Android developer. So did I think this concept didn't have any secrets anymore for me, until a Fragment (literally) started to haunt us...

This post will show how a seemingly simple transaction can have unintended side effects. And give a detailed explanation of how fragment transactions work.

## Problem explanation
Let's build a very simple app that shows all todays' calendar events for a particular user. This app basically consists out of 1 main screen that:

- either shows todays' events if user is logged in
- otherwise shows a placeholder + login button

![Main screens shows either list of events or a placeholder with login button]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_explanation.png){: .align-center}

Login is a multi step flow that consists out of a `UserNameFragment` and a `PasswordFragment`. After the login is successful, the app navigates back to the main screen to show the events.

[![Event app with login flow simplified]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_flow_simplified.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_flow_simplified.png)

Note that for simplicity we'll leave displaying the events out of scope and return back to the placeholder screen after successful login.

// continue here

## Why this happened

[![Event app with login flow]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_flow_ideal.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_flow_ideal.png)



[![Event app with login flow problem]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_flow_problem.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/fragmentback/app_flow_problem.png)

# Solution

## Wrap-up
Code coverage can be an incredibly powerful tool to improve the quality of your code as long as you don't blindly optimize for maximum coverage.

mention code on Github

If you've made it this far, you should probably follow me on {% include link_twitter.html %}. Feel free leave a comment below!
