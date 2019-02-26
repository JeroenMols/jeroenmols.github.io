---
title: MacOS update could not be installed
published: true
header:
  teaser: img/blog/macosupdate/macosupdate.png
  imgcredit: Photo by Graham Perrin, https://user-images.githubusercontent.com/192271/27255121-5811f2b4-538f-11e7-8117-9401bc9a7a80.png, cropped
tags:
  - macos
  - update
  - troubleshooting
---
Tonight after a routine MacOS update (10.13.2) disaster struck and my Mac got stuck in an update boot loop. After a few hours of panic, reading online and trial & error I managed to resolve it. Here's what I did in the hope it also helps someone else.

## Steps
From the "MacOS could not be installed on your computer" screen:

- Press and hold "option" key and click restart
- In the "Startup disk selection" screen, use the arrow keys to select your main hard drive (not the MacOS update)
- Wait for your Mac to boot normally
- Download the latest [combo update](https://support.apple.com/downloads/macos) directly from Apple. (this is a full system image, not an incremental update)
- Open and install the update
- Grab a snickers, this will take a while

My environment: 2017 Macbook pro 15" Touch Bar with MacOS 10.13.1 (High Sierra) installed and tried to update to 10.13.2 using the App Store.

If this was helpful to you, consider [buying me a coffee](https://www.buymeacoffee.com/jeroen) or thanking me at {% include link_twitter_molsjeroen.html %} on twitter!
