---
title: Five tips to get your code base in shape
published: true
header:
  teaser: img/blog/tacklelegacy/tacklelegacy.jpg
  imgcredit: Photo by The Creative Exchange on Unsplash, https://unsplash.com/photos/LEWYF8C5KIM, cropped
tags:
  - refactoring
  - architecture
  - software engineering
---
Are you living the dream? Is your code so clean it makes your eyes just tear a little? Can't think of anything you would still like to refactor? Never have any bugs? Using all the latest technologies?

unfortunately, most of us aren't in this state. We have bugs that haunt us, crashes at inconvenient times and sometimes 💩 simply hits the fan... So how on earth do you get out of this mess?

Well, I'm glad you ask! Here are five tips to get started.


## 1. Don't rewrite
> If only we could rewrite all of the code, we would be out of this mess in no time;

Remember that every project was a green field once, right? So why is it that all of us seem to end up in a similar state? Do you really think the previous developers didn't have the best intentions?

In reality rewrites hardly ever work out. Mainly because you are probably underestimating the complexity (corner cases) and required effort (amount of features) to rewrite everything. Hence rewriting will be incredibly time-consuming.

At the same time, you aren't focussing on maximizing user value: you'll lose tons of time rewriting stuff that wasn't problematic to begin with and users won't get any new features until the rewrite is done.

And technology isn't standing still either: two years ago we didn't have Kotlin, Jetpack, Architecture components, Navigation components,... And that's just the official Google stuff!

With deadlines slipping, users complaining (no new features) and competition catching up... will you really be able to resist not taking any shortcuts? Can you really guarantee you'll be better off?

I'm not saying rewrites never work out, but they are certainly one of the riskiest approaches to getting rid of your legacy. If you're rewriting your app, you are basically developing a new product that just happens to have the same feature set as the old app. (with all risks involved in new product development)

Read more about challenges while rewriting by [Chad Fowler](http://chadfowler.com/2006/12/27/the-big-rewrite.html), [Joel Spolsky](https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/), [Jeroen Moons](https://blog.intracto.com/paying-technical-debt-how-to-rescue-legacy-code-through-refactoring) or [Jo Van Eyck](https://jvaneyck.wordpress.com/2015/03/12/the-big-rewrite/).

## 2. Release, release, release
> If it hurts, do it more often; Jez Humble

One thing that all legacy code has in common is that it's poorly tested. Hence it can be very hard to control the impact of code changes.

Ever been in the situation where a simple code clean up, suddenly broke a seemingly unrelated feature elsewhere in the app?

Or maybe you wanted to release a new update to the field, but your test team just kept on finding issues? Causing release candidate to be created after release candidate?

Such a lack of control over regression, unfortunately, isn't uncommon. And while your natural instinct might be to just test each release longer manually, that just creates different problems:

- slower time to market due to longer test cycles
- decreased release frequency due to more test overhead
- harder to fix bugs, because they are found later
- more overhead with Git branches (where does this fix go?)
- working on several releases in parallel
- frustrated testers
- ...

The problem here is that you're actually fundamentally accepting you don't trust your app anymore. You start to rely on release testing to find bugs, implicitly taking away the responsibility from developers to not break things.

Counterintuitively, however, you should release more often instead of less.

Having smaller releases increases awareness of what changes were made in each release. Hence bugs can be easily tracked back to code changes and testing can be better focussed on the parts changed.

Also having fewer lines of code changed in every release will simply cause fewer bugs to be introduced. And the more often you do something, the better you'll become at doing it.

Finally, developers will get feedback faster as their code ends up in production sooner. That makes them more accountable, causing quality to go up.

At Philips Hue, we now release every two weeks and it has gotten so normal that we barely think about it.

## 3. Divide and conquer
> It's easier to build several smaller things than to build one big thing;

While most developers tend to like spaghetti, they aren't quite as fond of spaghetti code. This is because, in a spaghetti codebase, everything is connected to everything else.

This has several challenges:

- changing things is hard: one small clean up leads to changes in another file, requiring changes somewhere else, cascading into a world of pain.
- making changes in one place has unintended side effects
- difficult to introduce new technologies (e.g. RXJava)
- hard to scale up team: developers will often change the same files causing a lot of merge conflicts

What you are really missing, in this case, is having clearly defined contracts between different parts of your code. And the implementation of several parts is tightly coupled together.

So why don't you split your big monolith in several, fully decoupled feature modules? This doesn't just speed up builds, allow you to do instant apps, but it also allows to aggressively improve your app.

Once you split a feature off, the rest of the app becomes completely agnostic of the internal implementation of such a feature, which means you can:

- either refactor the feature
- fully rewrite the feature
- or leave the feature as-is (not a problem to solve now)

This allows you to quickly and aggressively get your app into good shape, focussing on those parts that need attention most. Even rewriting parts of your app suddenly becomes possible as you can derisk their roll-out with a feature toggle!

## 4. Master your tools
> The right tools for the right Job;

If you read any [book on refactoring](https://www.amazon.com/gp/product/0131177052/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0131177052&linkCode=as2&tag=jrnmls-20&linkId=e757dc2fcc803f637c8cd5c3d89c281e), you’ll quickly learn that one of the main prerequisites of it is to have proper tests in place. As mentioned above, legacy code usually either has no tests or is poorly tested.

Now I don’t really want to dive into any particular refactoring strategies here, but a great way to reduce regression while refactoring is to automate as much of the process as possible.

By this time I hope nobody renames classes by hand anymore? (e.g. rename class, rename constructors, rename file,...) But did you also know Android studio can also move code, extract methods, inline interfaces,...?

Really really powerful stuff there. And it doesn’t just reduce regression, it also removes a lot of dull repetitive work from your plate allowing you to focus on the interesting challenges.

I can help you get started with posts on [code navigation]({{ site.baseurl }}{% link blog/_posts/2018-02-22-androidstudioshortcuts.md %}) and [refactoring]({{ site.baseurl }}{% link blog/_posts/2018-04-26-androidstudioshortcuts2.md %}) in Android Studio.

## 5. Have faith
> We choose to go to the Moon, not because it is easy, but because it is hard; JFK

Incrementally refactoring your app and rewriting parts of it isn't going to be easy. It definitely won't be a walk in the park.

Especially refactoring can easily leave you unfulfilled: If you clean up the code in different places, it can easily feel insignificant, like your work barely made a dent in the bigger picture.

Please know that you are not alone. The age of small apps is behind us for quite some time now. And software often looks deceptively simple, yet can be extremely hard.

Bear with us, you'll manage. Even if you fail a few times along the way, at least you are trying (and learning!). There is light at the end of the tunnel, things will go better if you persist, one step at a time.

Finally, know that you are learning an invaluable skill: maintaining software whilst improving and building further upon it. Trust me, these refactoring skills will prove to be invaluable for the rest of your career.

## Wrap-up
There is no silver bullet to magically improve your code base, especially not rewriting. But by learning your tools, slicing your app in several modules and releasing often you will succeed if you have faith.

If you've made it this far you should probably follow me on {% include link_twitter.html %}. Feel free leave a comment below!

## Further reads
If I've piqued your interest and you would like to learn more, I can highly recommend the following books:

- [Working effectively with legacy code](https://www.amazon.com/gp/product/0131177052/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0131177052&linkCode=as2&tag=jrnmls-20&linkId=e757dc2fcc803f637c8cd5c3d89c281e) by Michael Feathers: Excellent book on how to refactor legacy code with amazing chapter names like "I Don’t Have Much Time and I Have to Change It" and "I Need to Make a Change, but I Don’t Know What Tests to Write"
- [Continuous Delivery: Reliable Software Releases Through Build, Test, and Deployment Automation](https://www.amazon.com/gp/product/0321601912/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0321601912&linkCode=as2&tag=jrnmls-20&linkId=6118692c28efd4239f6e14c430bbd871) by Jez Humble and David Farley: Great book if you'd like to learn more about continuous delivery and what the benefits could be for your team/organization.
- [Test Driven Development: By Example](https://www.amazon.com/gp/product/0321146530/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0321146530&linkCode=as2&tag=jrnmls-20&linkId=b785589aa73d26e7dcddfb1a1d70d3d0) by Kent Beck: While tackling legacy code, writing automated tests is of the utmost importance. This book provides a really nice introduction to test-driven development from its inventor Kent Beck.
