---
title: Using multiple SSH keys for Github and Github enterprise
published: true
tags:
- ssh
- terminal
- tips
date: '2023-02-06'
slug: multiple-ssh-keys
featureimagecaption: Photo by Samantha Lam from Unsplash, https://unsplash.com/photos/zFy6fOPZEu0,
  cropped and resized
---

Looking to configure multiple SSH keys on the same computer? For instance to use a different SSH key for your public and enterprise Github contributions.

This quick little post will show you how to do that.

## Steps
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

{{< alert icon="code" >}}
  {{< notrackers 
    mastodon="109819480309091738" 
    linkedin="jeroenmols_using-multiple-ssh-keys-for-github-and-github-activity-7028447120680484864-xeNw" 
    >}}
{{< /alert >}}

If this was helpful to you, consider [buying me a coffee](https://www.buymeacoffee.com/jeroen).