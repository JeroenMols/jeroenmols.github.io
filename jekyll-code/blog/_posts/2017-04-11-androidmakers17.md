---
layout: post
title: Android Makers FR recap
published: true
comments: true
img: img/blog/androidmakers17/androidmakers.png
imgcredit: Android Makers logo and website background, http://androidmakers.fr/, merged together
---
After organizing Droidcon Paris for several year, the organizers decided to move on and experiment with a new format. This didn't just result in a well organized conference, but also in a fresh new vibe whilst still feeling familiar.

In this post I'd like to share some general themes, my personal highlights and all of the slides I could gather from socials.

<br>

## Details matter
<center><a href="{{ site.blogbaseurl }}img/blog/androidmakers17/launchscreen.png"><img src="{{ site.blogbaseurl }}img/blog/androidmakers17/launchscreen.png" alt="Make sure your app doesn't launch with a blank screen"></a></center>

Building a world class app doesn't just require good engineering practices, but you literally have to handle details on every front.

My key takeaways:

- Learn and optimize your app launch time:</br>`adb shell am start -W <packagename>/. <activityname>`
- Never share a file directly via an intent, always copy it first
- Prefer `https://` as the scheme for direct links
- Hard-coded encryption keys can be easily found in byte code:</br> grep for `Ljavax/crypto`
- API design is basically designing future regrets

<br>

## Productivity
<center><a href="{{ site.blogbaseurl }}img/blog/androidmakers17/testingpyramid.png"><img src="{{ site.blogbaseurl }}img/blog/androidmakers17/testingpyramid.png" alt="The Android testing pyramid"></a></center>

As projects get more complex, it becomes crucial (for your own sanity) to have the right engineering practices in place. Try and leverage your continuous integration to automatically build, test and statically analyze your pull requests before merging.

My key takeaways:

- Testability must be taken into account from project start
- Many git conflicts can be resolved automatically with proper tooling
- Use pre launch reports before going to production
- Naming things is hard, yet super important

</br>

## Programming languages
Challenging the traditional way of app development has gotten a new spark thanks to Kotlin and the rise of other cross platform tools. There is definitely no silver bullet yet, but it's good to see the community stay open minded.

My key takeaways:

- Every Android developer hates WebViews
- With incremental builds, Kotlin compiles as fast as Java
- React native is JavaScript rendered to a native UI</br>(not ready for primetime yet, wait for 1.0 version)
- Any Android dev can develop for Android Things (runs Activities!)

</br>

## Organizer recap
Relive the conference through the organizers eyes, they did a great job at summarizing each day. Clicking each moment will expand more details.

<a class="twitter-moment" href="https://twitter.com/i/moments/851372466341629952?limit=3">Android Makers 2017 - Day 1</a> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

</br>

<a class="twitter-moment" href="https://twitter.com/i/moments/851650664644194304?limit=3">Android Makers - Day 2</a> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

</br>

## Conference slides
While the conference organizers will publish all slides very soon, I can image that quite a few people are already looking for a sneak preview. Hence I bundled everything I could already gather from socials.

- [The ART of organizing resources](https://speakerdeck.com/jeroenmols/the-art-of-organizing-resources) by Jeroen Mols
- [Remote, lonely and productive](https://speakerdeck.com/malmstein/remote-and-lonely) by David González
- [Launch Screens: From a Tap to Your App](https://speakerdeck.com/cyrilmottier/launch-screens-from-a-tap-to-your-app) by Cyril Mottier
- [The evolution of Android notification](https://speakerdeck.com/jeremiemartinez/the-evolution-of-android-notification) by Jeremie Martinez
- [Deep Android Integrations](https://speakerdeck.com/tysmith/deep-android-integrations) by Ty Smith
- [Develop a weather app with Kotlin](https://speakerdeck.com/baresse/develop-a-weather-app-with-kotlin-androidmakers-17) by Laurent Baresse
- [Merge like it's 2099](https://speakerdeck.com/xgouchet/merge-like-its-2099-androidmakers-2017) by Xavier Gouchet
- [RxJava est mort, vive RxJava 2](https://speakerdeck.com/dwursteisen/rxjava-est-mort-vive-rxjava-2) by David Wursteisen
- [Taking care of your UI tests](https://speakerdeck.com/florianmski/taking-care-of-your-ui-tests) by Florian Mierzejewski
- [Dependency Injection in Android - Best Practices](https://www.slideshare.net/VasiliyZukanov/dependency-injection-in-android-74836565?trk=v-feed) by Vasiliy Zukanov
- [Toothpick: a fresh approach to Dependency Injection on Android](https://speakerdeck.com/stephanenicolas/toothpick-a-fresh-approach-to-dependency-injection-di-on-android) by Stéphane Nicolas and Daniel Molinero Reguera
- [Streamlining Payments on Mobile](https://speakerdeck.com/mathieu_calba/streamlining-payments-on-mobile) by Mathieu Calba
- [Heat the Neurons of Your Smartphone with Deep Learning](https://speakerdeck.com/jinqian/heat-the-neurons-of-your-smartphone-with-deep-learning) by Qian Jin and Yoann Benoit
- [Testable Android Architecture](https://speakerdeck.com/ecgreb/testable-android-architecture-android-makers-france) by Chuck Greb
- [Develop your next app with kotlin](https://www.slideshare.net/arnaudgiuliani) by Arnaud Giuliani
- [Make or brake… using Gradle](https://speakerdeck.com/smarkovik/make-or-break) by Stanojko Markovik
- [Getting the most of Android obfuscation tools](https://speakerdeck.com/renaudboulard/getting-the-most-of-android-obfuscation-tools) by Renaud Boulard
- [Intro to Google Assistant and Actions on Google](https://speakerdeck.com/elainedb/intro-to-google-assistant-and-actions-on-google) by Elaine Dias Batista and Wajdi Ben Rabah
- [Actions on Google workshop](https://speakerdeck.com/elainedb/actions-on-google-workshop) by Elaine Dias Batista and Wajdi Ben Rabah
- [Modern Android: How to ditch Activities & Fragments](https://docs.google.com/presentation/d/1Ehc6B78kWnX23W1SZvUtpP42LMsSJwdEvD0WIkgACmk/edit#slide=id.p) by Fabien Devos
- [Kotlin in the real world](https://speakerdeck.com/rpradal/kotlin-in-the-real-world) by Rémi Pradal
- [One Year of Clean Architecture - The Good, The Bad and The Bob](https://www.slideshare.net/OCTOTechnology/one-year-of-clean-architecture-the-good-the-bad-and-the-bob) by Gabriel Adgeg and Dorian Lamande
- [Le root : un inconnu chez soi?](https://speakerdeck.com/perfectslayer/le-root-un-inconnu-chez-soi) by Bruce Bujon
- [ExoPlayer, player multimédia pour vos applications et la réalité virtuelle](https://speakerdeck.com/oleur/exoplayer-player-multimedia-pour-les-applications-et-la-realite-virtuelle) by Julien Salvi
- [Le design mobile c’est pas facile](https://www.slideshare.net/aerilys/le-design-mobile-cest-pas-facile-74910698) by Quentin Sallat

<br>

## Credits
<center><a href="{{ site.blogbaseurl }}img/blog/androidmakers17/team.jpg"><img src="{{ site.blogbaseurl }}img/blog/androidmakers17/team.jpg" alt="The awesome Android makers organizing team"></a></center>

Thanks to the entire Android Makers team for organizing a great conference and to all sponsors for supporting. Hope to see you all next year!
