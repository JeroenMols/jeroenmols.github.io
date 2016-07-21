---
layout: post
title: Turn Android into an awesome cycling GPS
published: true
comments: true
img: img/blog/cyclinggps/cyclinggps.png
---
Cycling is all about exploring: visiting new places and making existing routes more fun with better streets. So there must be an app that allows to plan your route and start cycling right? Think again... there is currently no solution that offers turn by turn navigation for cyclists.

As I had an old Android device laying around, I decided to repurpose that and convert it into a GPS that:

- tracks my activity
- imports gpx tracks created on my computer
- offers turn by turn navigation (screen + voice)

This blogpost will detail how I use [OsmAnd](https://play.google.com/store/apps/details?id=net.osmand) and [Dropsync](https://play.google.com/store/apps/details?id=com.ttxapps.dropsync) to create new tracks with minimal effort. Further I'll also describe the gear I use in order to make this work.

<br>

## Gear
<center><a href="{{ site.blogbaseurl }}img/blog/cyclinggps/gear.png"><img src="{{ site.blogbaseurl }}img/blog/cyclinggps/gear.png" alt="Cycling GPS gear"></a></center>

To build your own GPS, you'll need the following:

1. Android phone - I use my Nexus 5, but any Android device will do
2. Bicycle GPS mount - I use [this one](http://www.dx.com/p/universal-bike-bicycle-mount-cell-phones-bracket-holder-stand-black-208712#.V5DBF5O7hBc)
3. Rainproof case - I use [these](http://www.dx.com/p/universal-waterproof-bag-case-cover-dry-bag-for-iphone-htc-translucent-3-pcs-318004#.V5DBRpO7hBe)

<br>

## Create tracks
To explore new places, you need a great tool to create cycling routes. I personally use [Strava](https://www.strava.com/) because it has a "global Heatmap" and also supports "segments" where most people cycle. It is a great way to figure out popular cycling streets and help you plan a great route. Note that you can do all of this using a free account, but with a [premium subscription](https://www.strava.com/premium) you will get lots more.

To create routes, just go to "My routes" and select "Create new route":

<center><a href="{{ site.blogbaseurl }}img/blog/cyclinggps/routes.png"><img src="{{ site.blogbaseurl }}img/blog/cyclinggps/routes.png" alt="Create a new route"></a></center>

The global Heatmap indicates where most people cycle:

<center><a href="{{ site.blogbaseurl }}img/blog/cyclinggps/heatmap.png"><img src="{{ site.blogbaseurl }}img/blog/cyclinggps/heatmap.png" alt="The global Heatmap indicates where most people cycle"></a></center>

Segments are often challenging parts to cycle, that contain a leaderboard:

<center><a href="{{ site.blogbaseurl }}img/blog/cyclinggps/segments.png"><img src="{{ site.blogbaseurl }}img/blog/cyclinggps/segments.png" alt="Segments are often challenging parts to cycle, that contain a leaderboard"></a></center>

Once you created a route, you can export it to a `gpx` file format. Note that it doesn't matter which GPS you choose to do the export.

<center><a href="{{ site.blogbaseurl }}img/blog/cyclinggps/export.png"><img src="{{ site.blogbaseurl }}img/blog/cyclinggps/export.png" alt="Tracks can be exported into a gpx file format"></a></center>
<br>

## Configure OsmAnd
[OsmAnd](https://play.google.com/store/apps/details?id=net.osmand) offers both turn by turn navigation and storing maps offline. This is ideal to save bandwidth or for phones without a sim card (like mine). It is completely free to use, but there is also a [premium version](https://play.google.com/store/apps/details?id=net.osmand.plus) if you want to support this awesome project.

Getting it to work with `gpx` files is tricky and hence I will guide you through it.

First of all install [OsmAnd](https://play.google.com/store/apps/details?id=net.osmand) (or [OsmAnd+](https://play.google.com/store/apps/details?id=net.osmand.plus)). When you open the app, press "skip" and don't download any maps. This is because they would end up in a private directory. Open the hamburger menu, go to "Settings" and open "General settings".

<center><a href="{{ site.blogbaseurl }}img/blog/cyclinggps/osmand1.png"><img src="{{ site.blogbaseurl }}img/blog/cyclinggps/osmand1.png" alt="Skip downloading maps and go to general settings"></a></center>

Now we're going to change the directory in which OsmAnd stores all of its files. Use "Data storage folder", click the "edit icon" and select "Shared memory" as the data storage folder. This will put all files in an "osmand" directory on the root of your internal storage. Accept the permission when promted to allow OsmAnd to create and write to that folder.

<center><a href="{{ site.blogbaseurl }}img/blog/cyclinggps/osmand2.png"><img src="{{ site.blogbaseurl }}img/blog/cyclinggps/osmand2.png" alt="Change the folder in which maps are downloaded to the shared folder"></a></center>

Next go ahead and download the maps for the areas in which you will be cycling. When prompted for a storage folder, again select "Shared memory".

<center><a href="{{ site.blogbaseurl }}img/blog/cyclinggps/osmand3.png"><img src="{{ site.blogbaseurl }}img/blog/cyclinggps/osmand3.png" alt="Download the maps you need to the shared folder"></a></center>

<br>

## Automatically sync tracks using Dropbox
Getting new tracks on your phone can be quite a hassle. Therefore we'll automate this process so you can add new tracks to your phone by only using your computer.

First of all, create a new folder in your [Dropbox](https://www.dropbox.com/) account called "Cycling".

<center><a href="{{ site.blogbaseurl }}img/blog/cyclinggps/dropbox.png"><img src="{{ site.blogbaseurl }}img/blog/cyclinggps/dropbox.png" alt="Dropbox folder that will contain all tracks"></a></center>

Then install the app [Dropsync](https://play.google.com/store/apps/details?id=com.ttxapps.dropsync) (or [Dropsync pro](https://play.google.com/store/apps/details?id=com.ttxapps.dropsync.pro)). Next configure it so that it automatically syncs any file you put in the Dropbox folder into the correct folder on the Android phone.

Open Dropsync, login with your Dropbox account and select "let me create my own folder pair". As the local folder choose "osmand/tracks" and as the remote folder "Cycling". Then select "Download mirror" as the sync method and enable sync. Save the changes and wait for the sync to complete.

<center><a href="{{ site.blogbaseurl }}img/blog/cyclinggps/dropsync.png"><img src="{{ site.blogbaseurl }}img/blog/cyclinggps/dropsync.png" alt="Configure Dropsync to put the GPX files in the correct folder on the Android phone"></a></center>

Now all you have to do is export a track from Strava, move it into the Dropbox folder and it will autmagically appear in OsmAnd on your GPS!

<br>

## Turn by turn navigation
Finally you're ready to start using your synced tracks for turn by turn navigation.

Open OsmAnd and press the "globe" icon in the top left corner. Scroll down a bit and select "GPX track..." to choose the track you want to display. Exit the screen and start navigation by pressing the "navigation" icon in the bottom left corner.

<center><a href="{{ site.blogbaseurl }}img/blog/cyclinggps/osmand4.png"><img src="{{ site.blogbaseurl }}img/blog/cyclinggps/osmand4.png" alt="Select a track (gpx file) and start navigation"></a></center>

Enjoy your turn by turn navigation!

<center><a href="{{ site.blogbaseurl }}img/blog/cyclinggps/osmand5.png"><img src="{{ site.blogbaseurl }}img/blog/cyclinggps/osmand5.png" alt="Select a track (gpx file) and start navigation"></a></center>

<br>

## Tips and tricks
I'll update this section as I discover new handy features/tricks to make the GPS even more usefull.

- Remove the lockscreen: go to "Device Settings" > "Security" and set the "Screen lock" to "none". This will enable you to simply press the power key to turn on your screen.

<br>

## Wrap-up
In a few very simple steps we created a complete cycling GPS solution that provides turn by turn navigation and offline maps. Creating tracks is done using Strava and export using a Dropbox folder so that they automatically appear on your GPS device.

As always you can reach me [@molsjeroen](https://twitter.com/molsjeroen) on twitter, or leave a comment below!
