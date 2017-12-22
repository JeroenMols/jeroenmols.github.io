---
title: Droidcon Berlin recap
published: true
header:
  teaser: img/blog/droidconde16/droidconde.png
  imgcredit: Droidcon Berlin logo, https://de.droidcon.com/, added background
tags:
  - android
  - conference
  - droidcon
---
Having founded the entire Droidcon franchise in 2009, Droidcon Berlin is a magical conference to be at. Not only do they have an awesome lineup of speakers (including yours truly). But they also organize great after hour events. Further they're the first conference ever where I didn't have any Wi-Fi issues (looking at you #io16).

As there were four different tracks, it was obviously not possible to attend every session. But I did notice some general themes and would like to share my personal highlights with you.


## Architecture
While Android is maturing as a platform, developers are also professionalizing their applications. Every growing apps mean that testability, maintenance and refactoring is only increasing in importance.

My key takeaways:

- MVP is a UI pattern not an architecture
- All dependencies should point in one direction
- Don't be dogmatic
- Users don't care about your architecture


## IoT
![Philips Hue Coffee]({{ site.url }}{{ site.baseurl }}/img/blog/droidconde16/iotcoffee.jpg){: .align-center}

Interest in IoT products is steadily increasing, but as a developer it is still not easy to create IoT apps. Properly handling things like Bluetooth LE keeps on being plagued by device specific issues. And seemingly simple problems like properly handling a user sign in are still extremely complex.

My key takeaways:

- When using BT LE, only support API 21 or higher
- Handle all bluetooth LE callbacks on separate HandlerThread
- Firebase can handle all sign in complexity for you


## Designing for the next billion
![Designing for the next billion]({{ site.url }}{{ site.baseurl }}/img/blog/droidconde16/nextbillion.jpg){: .align-center}

Where we used to be educated that "a developer phone is not a user phone", this message is now morphing towards people in emerging markets. Designing for such markets doesn't only require functional changes like developing for offline first, but it even requires you to completely think your UX.

My key takeaways:

- access to cheap fast internet is not a given
- battery life is even more precious in emerging countries
- understandable UX when smartphone is your first computer


## Other hot topics
![You can use alpha values for button states in XML]({{ site.url }}{{ site.baseurl }}/img/blog/droidconde16/alphastates.jpg){: .align-center}

Besides these, also a lot of attention was spent on testing and tooling. There were great talks about styling, theming and creating custom views. And many sessions also dived deeper into optimizing your apps performance. Bit unfortunate that there weren't any more talks on the new Android N features.

My key takeaways:

- You can use alpha values for button states in XML
- Use overlay themes instead of changing text colors
- Tests should be fast, focussed and reliable
- It maybe worth to convert an existing app to RXJava, but keep it contained to particular layers. (e.g. Webservice)


## Sketchnoting
![Corey Leigh Latislaw creating a sketch note]({{ site.url }}{{ site.baseurl }}/img/blog/droidconde16/sketchnoting.jpg){: .align-center}

Sketch notes are really awesome! In this, creative people summarize a talk into a very cool one pager. This doesn't only look great, but it's also by far the easiest way to get a high level view of a talk.

At Droidcon both [Corey Leigh Latislaw](https://twitter.com/corey_latislaw) and [Teresa Holfeld](https://twitter.com/TeresaHolfeld) were actively creating sketch notes. You should check their twitter feeds for the awesome content they created.

Just a sample:

<center><blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Offline First by <a href="https://twitter.com/glynn_bird">@glynn_bird</a> at <a href="https://twitter.com/hashtag/droidconDe?src=hash">#droidconDe</a>. <a href="https://twitter.com/hashtag/sketchnote?src=hash">#sketchnote</a> <a href="https://t.co/SkeriMsigT">pic.twitter.com/SkeriMsigT</a></p>&mdash; Corey Leigh Latislaw (@corey_latislaw) <a href="https://twitter.com/corey_latislaw/status/743390864660135937">June 16, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></center>

<center><blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Themes and Styles demystified: talk by <a href="https://twitter.com/chrisbanes">@chrisbanes</a> <a href="https://twitter.com/hashtag/droidconDE?src=hash">#droidconDE</a> <a href="https://twitter.com/hashtag/sketchnotes?src=hash">#sketchnotes</a> <a href="https://t.co/mXNcW8lGRS">pic.twitter.com/mXNcW8lGRS</a></p>&mdash; Teresa Holfeld (@TeresaHolfeld) <a href="https://twitter.com/TeresaHolfeld/status/743438928666034176">June 16, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></center>

Thanks for both of them for creating such great summaries.


## Conference slides
While the conference organizers will publish all slides very soon, I can image that quite a few people are already looking for a sneak preview. Hence I bundled everything I could already gather from socials.

- [Testing made sweet with a Mockito](https://speakerdeck.com/jeroenmols/testing-made-sweet-with-a-mockito) by Jeroen Mols
- [Reverse engineering is not just for hackers](https://speakerdeck.com/jonreeve/reverse-engineering-is-not-just-for-hackers) by Jon Reeve
- [Refactoring Plaid - A reactive MVP approach](https://speakerdeck.com/sockeqwe/refactoring-plaid-a-reactive-mvp-approach) by Hannes Dorfmann
- [Android & IoT](https://speakerdeck.com/aselims/android-and-iot-at-droidconde-16) by Selim Salman
- [Unit testing without Robolectric](http://www.slideshare.net/dpreussler/unit-testing-without-robolectric-droidcon-berlin-2016) by
Danny Preussler
- [#Perfmatters for Android](https://speakerdeck.com/alosdev/perfmatters-for-android-droidcon-berlin-2016) by Hasan Hosgel
- [Life of Android Enterprise Developers in the age of Android for Work](https://speakerdeck.com/nibble/life-of-android-enterprise-developers-in-the-age-of-android-for-work) by Pietro Maggi
- [The 2016 Android Developer Toolbox](http://www.slideshare.net/Nilhcem/the-2016-android-developer-toolbox-berlin) by Gautier Mechling
- [Practical Bluetooth Low Energy on Android](https://speakerdeck.com/erikhellman/practical-bluetooth-low-energy-on-android) by Erik Hellman
- [Contextual Communications And Why You Should Care](http://www.slideshare.net/MarcosPlacona/contextual-communications-and-why-you-should-care-droidcon-de) by Marcos Placona
- [Deep dive into Android Data Binding](https://speakerdeck.com/radzio/deep-dive-into-android-data-binding) by Radek Piekarz
- [Let's get physical](https://docs.google.com/presentation/d/1Fldq6lWkrVeBdDyPwMQ7jkItZ1m2XMpDXQzu3IwbSE8/edit#slide=id.p) by Albrecht Noll and Pascal Welsch
- [Testing Why? When? How?](http://www.slideshare.net/polanskitomasz) by Tomasz Polański
- [Adopting RxJava on Airbnb Android](https://speakerdeck.com/felipecsl/adopting-rxjava-on-airbnb-android) by Felipe Lima
- [Elegant?? Unit Testing](https://speakerdeck.com/guardiola31337/elegant-unit-testing-droidcon-berlin-2016) by Pablo Guardiola
- [Material design custom views](https://docs.google.com/presentation/d/1JaTb9KDMtE9-9g9zRIXKzLB5WwGVVEI8F-wGtNSo-0c/edit#slide=id.ge54df3a86_0_53) by Said Tahsin Dane
- [Android TV: Building apps with Google's Leanback Library](https://photos.google.com/share/AF1QipPpuNyuATl-Ae09WzlXkxyHXxoOxZ_-uXLKB4uALR3bG3vnpcYLl2UIAKoNYGzd-g?key=X0o2U3EyLVdRWkxfQm9hUG5uZGUtN0wwc2UwTnpB) by Joe Birch
- [Screenshot your Entire App](https://speakerdeck.com/scompt/screenshot-your-entire-app) by Edward Dale
- [Little helpers for Android development with Kotlin](http://www.slideshare.net/AgentK/little-helpers-for-android-development-with-kotlin) by Kai Koenig
- [Effective Android Development](https://speakerdeck.com/sergiiz/effective-android-development) by Sergii Zhuk
- [Android is the World Phone](https://speakerdeck.com/colabug/android-is-the-world-phone-droidcon-berlin) by Corey Latislaw
- [Loving lean layouts](https://speakerdeck.com/randomlytyping/babbq-2015-loving-lean-layouts) by Huyen Tue Dao
- [Let it flow - unidirectional data flow architecture on Android](https://speakerdeck.com/dorvaryn/let-it-flow) by Benjamin Augustin
- [We're all UX!](https://speakerdeck.com/lyslydia/were-all-ux) by Lydia Selimalhigazi and Caroline Smith
- [10 ways to analyse runtime failure using Classy Shark](http://www.slideshare.net/seamaster29/classshark-android-and-java-executables-browser) by Boris Farber


## Credits
Thanks to the entire Droidcon Berlin team for organizing such a great conference and to all sponsors for their support. Keep up the awesome job!
