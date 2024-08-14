---
title: Transfer many large files from Android
published: true
tags:
- android
- adb
- backup
- files
date: '2022-12-17'
slug: pull-files-android
featureimagecaption: Photo by NegativeSpace, https://negativespace.co/white-android-mobile-device-macbook/,
  resized and cropped
---

Trying to get a large number of files from your Android phone, but Android File Transfer freezing up?

Here's what I learned trying to pull ~170 Gb from my Pixel phone.

## Pulling files from your phone
For this to work you need to [have ADB installed](https://www.xda-developers.com/install-adb-windows-macos-linux/) on your computer and [developer options enabled](https://developer.android.com/studio/debug/dev-options#enable) on your Android phone.

First, check how large the directory you're trying to pull is. Let's assume we want to pull the Camera folder:

```
adb shell
du -sh sdcard/DCIM

# Output:
171.8G	sdcard/DCIM
```

> Don't forget to run `exit` to leave the ADB shell.

If you have enough disk space, you can pull the entire folder to your computer using `adb pull`.

```
adb pull -p sdcard/DCIM/ .   
```

> Notice the `-p` option to show transfer progress


Unfortunately, I didn't have enough disk space... So instead, let's pull the files in batches, by using `find` to search for files.

For instance to find all video files:

```
adb shell find `sdcard/DCIM/Camera/*.mp4`
```

The result of `find` can then be piped into `adb pull` to transfer the files one by one to your computer.

Some possibly handy variants are:

```
# Pull all video files
adb shell find 'sdcard/DCIM/Camera/*.mp4' | xargs -n1 adb pull

# Pull all image files
adb shell find 'sdcard/DCIM/Camera/*.jpg' | xargs -n1 adb pull

# Pull al files from the past year
adb shell find 'sdcard/DCIM/Camera/PXL_2022*'

# Pull all files from the past month
adb shell find 'sdcard/DCIM/Camera/PXL_202212*'
```


## Deleting pulled files
Now that the files are pulled from your phone, you probably also want to delete them to free up phone storage.

The easiest way to do so is to delete the entire folder from your phone:

```
# Caution: this permanently deletes all your files!
adb shell rm <folder-name-here>
```

However, if you hadn't pulled all files from that folder yet, you will include data loss.

So instead of deleting the folder, we'll only delete the files that we just synced to our computer.

First list all of the files in the synced folder on your computer using `find`:

```
find . -name '*'
```

> However, you can also be more granular here if you want:
```
# List all images
find . -name '*.jpg'
```

Next, for each listed file, reconstruct the original file path on your phone using `sed`:

```
find . -name '*' | sed 's:.:sdcard/DCIM/Camera:'
```

And finally, delete those files from your phone by piping the result into `adb shell rm`:

```
find . -name '*' | sed 's:.:sdcard/DCIM/Camera:' | xargs -n1 adb shell rm $1
```

> Note I highly recommend doing a dry run first to check what files will be deleted by using `adb shell ls -l`:
```
find . -name '*' | sed 's:.:sdcard/DCIM/Camera:' | xargs -n1 adb shell ls -l $1
```

Finally, some possibly handy variants are:

```
# Delete all video files from the current folder from your phone
find . -name '*.mp4' | sed 's:.:sdcard/DCIM/Camera:' | xargs -n1 adb shell rm $1

# Delete all image files from the current folder from your phone
find . -name '*.jpg' | sed 's:.:sdcard/DCIM/Camera:' | xargs -n1 adb shell rm $1
```

## Wrap-up
Android file transfer unfortunately isn't the most reliable solution to transfer files from your phone to your computer. However, thanks to `adb` there is a fast and reliable way to get (a subset of) files from your Android device.

If this was helpful to you, consider [buying me a coffee](https://www.buymeacoffee.com/jeroen) or thanking me on [Mastodon](https://androiddev.social/@Jeroenmols) or [Twitter](https://twitter.com/molsjeroen)!
