---
title: Crossroads
published: false
header:
  teaser: img/blog/crossroads/crossroads.jpeg
  imgcredit: Photo by Pixabay from Pexels, https://www.pexels.com/photo/railroad-tracks-in-city-258510/, cropped and resized
tags:
  - ssh
  - terminal
  - tips
---

After doing Android development for more than a decade, I recently found myself at a crossroads. Do I keep on building out my Android expertise? Or is it time to throw my career around?

## Background

I got bitten by the "Android bug" in 2011 and was fortunate to start developing on the platform when things were much simpler. This has allowed me to build out a deeper and more fundamental understanding of the platform than I nowadays see with other highly skilled candidates.

Android has been my passion for a really long time

In this I'm assuming you already have an SSH key setup for your enterprise Github account.

1. [Create a new SSH key and add it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
2. Update your `~/.ssh/config` file and add a new host:

```bash
Host *
  AddKeysToAgent yes
  UseKeychain yes

Host github.com
  IdentityFile ~/.ssh/id_github_rsa
  UseKeychain yes

Host github.mycompany.com
  IdentityFile ~/.ssh/id_rsa
  UseKeychain yes
```

I'm explicitly defining each host, but you could also assign a SSH key to all remaining hosts using `Host *`.

That's it!

<p style="color: #646769; background: #f2f3f3; padding: 20px;">This site is 100% tracker free, :heart: for liking my post on <a href="https://androiddev.social/@Jeroenmols/110101372976132453">Mastodon</a> or <a href="https://www.linkedin.com/posts/jeroenmols_a-privacy-friendly-rsvp-for-events-activity-7046488707721289728-VGDJ">Linkedin</a> to let me know you've read this.</p>

If this was helpful to you, consider [buying me a coffee](https://www.buymeacoffee.com/jeroen).
