---
title: Verify Github profile link on Mastodon
published: true
header:
  teaser: img/blog/mastodonverifygithub/mastodon-verify-github.png
  imgcredit: Mastodon logo and screenshot of Mastodon Androiddev.social instance,
    https://commons.wikimedia.org/wiki/File:Mastodon_logotype_%28simple%29_new_hue.svg
    and androiddev.social, resized, cropped and composed together
tags:
- mastodon
- github
- tips
date: '2022-11-26'
slug: mastodon-verify-github
---

Looking to get a fancy verified checkmark on Mastodon for your Github account?

This post details how I made this work.

## Steps
> Before I get started, huge thanks to [Simon Wilson](https://fedi.simonwillison.net/@simon) for inspiring me with the original idea.

In his [excellent post](https://til.simonwillison.net/mastodon/verifying-github-on-mastodon) Simon details how to leverage the `your-username.github.io` static webpage to prove Github domain ownership.

The idea is that proving I own `jeroenmols.github.io` is equivalent to proving ownership of `github.com/jeroenmols`.

However, I can't simply redirect [jeroenmols.github.io](https://jeroenmols.github.io) to my Github profile as I already host my [my personal website](https://jeroenmols.com) on that domain. (I use a [CNAME record](https://github.com/JeroenMols/jeroenmols.github.io/blob/master/CNAME) to make both domains equivalent).

Consequently, Simon's approach didn't work for me. Now what?

Well instead of redirecting the entire domain, I decided to redirect a sub-page. To do this, I:

1. Added a new page `https://jeroenmols.com/github`
2. Included the Mastodon verification tag: `<link href="https://androiddev.social/@jeroenmols" rel="me">`
3. Have the page redirect to my Github profile
4. Use the domain `jeroenmols.github.io/github` on my Mastodon profile

The webpage content looks like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting to github.com/jeroenmols /</title>
    <meta http-equiv="refresh" content="0; URL=https://github.com/jeroenmols">
    <link href="https://github.com/jeroenmols" rel="me">
    <link href="https://jeroenmols.com" rel="me">
    <link href="https://androiddev.social/@jeroenmols" rel="me">
  </head>
  <body />
</html>

```

And my [Mastodon profile](https://androiddev.social/@Jeroenmols), now looks like this:

![Mastondon profile](mastodon-profile.png)

That's it!

If this was helpful to you, consider [buying me a coffee](https://www.buymeacoffee.com/jeroen) or thanking me on [Mastodon](https://androiddev.social/@Jeroenmols) or [Twitter](https://twitter.com/molsjeroen)!
