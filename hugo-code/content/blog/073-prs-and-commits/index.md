---
title: Gaming the pull request review system
published: true
tags:
- pullrequest
- commit
- engineering
date: '2023-06-26'
slug: prs-and-commits
featureimagecaption: Photo by Alexey Savchenko on Unsplash, https://unsplash.com/photos/k4Akpt5-Sfk,
  cropped and resized
---


As developers, we love to build cool things and ship them as fast as reasonably possible. And to get that done, here are a few things you can do to "game the system".

## Pull requests

Put yourself in the shoes of the reviewer, how would you like your pull requests (PR) to be served?

I like mine:

- nice and small, so they're less intimidating to review and hence will be reviewed faster
- with a great description, context about why it's built this way, and considered alternatives help to understand and learn
- visual with a screenshot (before/after visual change) or a graph (conversion change) or table (comparison)
- already reviewed, comments by the author add extra context and helpful insights to review the code

Doing all the above is extra work, but will speed up reviews, reduce rework and improve the feedback loop.

So be selfish and put in the extra work to craft stellar PRs!

This won't just make you happier and more productive, but it will also increase your overall impact by helping to inform others and creating an excellent historical reference.

## Commits

Much of the above is also valid for commit messages:

- small commits are easier to review since changes are more correlated and have extra context (i.e. commit message)
- great commit messages add extra context and reasoning behind commit changes (optimize for Git bisect)

However, at my current company, we squash all commits before merging.

So I've personally given up on my commit size and message hygiene and moved my efforts to the PR level instead.

## Wrap up

{{< alert icon="code" >}}
  {{< notrackers 
    mastodon="110612136335930968" 
    linkedin="jeroenmols_gaming-the-pull-request-review-system-activity-7079176881228406784-uR2v" 
    >}}
{{< /alert >}}

Sometimes it's good to be a little selfish! Optimize your pull requests to be reviewed as quickly as possible and increase your overall impact and happiness.

If this was helpful to you, consider [buying me a coffee](https://www.buymeacoffee.com/jeroen).
