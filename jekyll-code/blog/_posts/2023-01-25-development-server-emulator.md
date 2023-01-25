---
title: Android emulator access to local server
published: true
header:
  teaser: img/blog/developmentserveremulator/cover.jpg
  imgcredit: Screenshot of Google Chrome on Android emulator, resized and cropped
tags:
  - android
  - adb
  - emulator
  - localhost
  - server
---
How can you connect your app on an Android emulator to a development server running on the localhost of your computer?

## The problem
Since Android emulators create their own virtual network, they cannot access devices on your local network.

This means:
- `localhost` refers to the emulator, not your laptop
- local IP addresses `192.168.1.xxx` are not accessible
- local MDNS addresses `jmols.local` are not accessible

So accessing our development server at `https://jmols.local:3000` results in the following error:

[![Error trying to connect to the connect to a local network IP/MDNS address]({{ site.url }}{{ site.baseurl }}/img/blog/developmentserveremulator/error.png)]({{ site.url }}{{ site.baseurl }}/img/blog/developmentserveremulator/error.png){: .align-center}

## Method 1: the loopback address
The simplest solution is to change the server URL in your app and point it to `10.0.2.2`. This is a [special alias to your host loopback interface](https://developer.android.com/studio/run/emulator-networking#networkaddresses) (127.0.0.1 on your development machine).

So instead of loading `https://jmols.local:3000`, our app will load `https://10.0.2.2:3000` instead.

That fixes the emulator, but now our app no longer works on real devices. (since the loopback IP doesn't exist there).

Can we find a single solution that works on both emulators and devices?

## Method 2: redirect the emulator
In this solution, we'll instruct the emulator to redirect the IP address from the host machine to the loopback IP address automatically. We'll do this by editing the `etc/hosts` file on the Android emulator.

First, we need to ensure the `etc/hosts` file is writable:

1. Create a new emulator (non Google Play services, so we have access to root)
1. Find the emulator AVD name of the emulator
```
emulator -list-avds
```
1. Start your emulator from the command line with the option to enable a writable system
```
emulator -avd "<AVD_NAME_HERE>" -writable-system
```
1. Run ADB as root
```
adb root
```
1. Disable verified boot
```
adb disable-verity
```
1. Reboot the device
```
adb reboot
```
1. Wait for the device to be rebooted (ready when `adb shell` works)
1. Run ADB as root (again)
```
adb root
```
1. Remount partitions as read-write
```
adb remount
```

Now we can overwrite the `etc/hosts` file!

1. First get the existing hosts file
```
adb pull etc/hosts
```
1. Add an entry to direct your local server domain to the loopback address: `10.0.2.2   <YOUR_LOCAL_HOSTNAME>`. Your hostfile should look like this:

```
127.0.0.1       localhost
::1             ip6-localhost
10.0.2.2        jmols.local
```

1. Save and push the file back to the emulator:
```
adb push hosts etc/hosts
```

Now our emulator can access our development server at `https://jmols.local:3000`!

> Notice how this solution can easily be generalized to any IP address on your local network.

## Wrap-up
After jumping through some Android emulator hoops to make `etc/hosts` writable, we successfully connected the emulator to our development server by linking our local address to the loopback address.

If this was helpful to you, consider [buying me a coffee](https://www.buymeacoffee.com/jeroen) or thanking me on [Mastodon](https://androiddev.social/@Jeroenmols) or [Twitter](https://twitter.com/molsjeroen)!
