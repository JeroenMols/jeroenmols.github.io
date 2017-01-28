---
layout: post
title: Testing made sweet with a Mockito
published: true
comments: true
img: img/blog/droidconde16talk/droidcondetalk.png
imgcredit: Main slide of https://speakerdeck.com/jeroenmols/testing-made-sweet-with-a-mockito, images credits at end.
---
At Droidcon Berlin 2016 I had a great time talking about testing using the [Mockito](http://mockito.org/) framework. While the talk wasn't recorded unfortunately, the great folks at [Voice Republic](https://voicerepublic.com/series/droidcon-berlin-2016) recorded an audio version which you can listen to as a podcast or together with the slides.

<br>

## Talk

<script async class="speakerdeck-embed" data-id="061ea326e4b24a3aa961440fd699c481" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

<iframe width="100%" height="32%" src="https://voicerepublic.com/embed/talks/testing-made-sweet-with-a-mockito" frameborder="0" scrolling="no" allowfullscreen></iframe>

The past year has been huge for Android testing: Testing support lib, fast JVM unit tests,... Having such great tools means writing tests is a breeze! All your apps currently have >80% code coverage, right? Yay! Or wait... is it really? Is all your common Android logic (networking, databases,...) tested? Do you isolate parts of your code base to keep your tests small? And what about providing relevant testing data?

In order to achieve this, you need to make use of mocks and stubs. And that's exactly what this talk will be about: What is a mock? What's the difference between a mock and a stub? Are mocks the only way to provide relevant data for your unit tests? What do I do with all the final classes/methods in the Android SDK? How do I architect my app to make it easier to test? ...

After having adopted TDD as my main development workflow for almost a year now, I feel comfortable saying everything can be tested. Its just a matter of having someone experience show you how.

<br>

## Code
A fully working sample project with all principles is available [on Github](https://github.com/JeroenMols/MockitoExample).

- [build.gradle](https://github.com/JeroenMols/MockitoExample/blob/master/app/build.gradle) file indicating how to configure Mockito
  - testCompile: for tests run on your computer in a JVM (src/test folder)
  - androidTestCompile: for tests run on an Android device (src/androidTest folder)
- [UserTest](https://github.com/JeroenMols/MockitoExample/blob/master/app/src/test/java/com/jeroenmols/mockitoexample/UserTest.java) class demonstrating Mockito usage
  - TLDR: JVM unit tests with mockito are easy to read and write
- [UserTestAndroid](https://github.com/JeroenMols/MockitoExample/blob/master/app/src/androidTest/java/com/jeroenmols/mockitoexample/UserTestAndroid.java) class demonstrating Mockito usage on Android device
  - TLDR: Mockito can be used on Android, but need to use V1 and dexmaker
- [HandlerWrapper](https://github.com/JeroenMols/MockitoExample/blob/master/app/src/main/java/com/jeroenmols/mockitoexample/HandlerWrapper.java) class indicating how to test final methods
  - TLDR: Wrap final or statics methods with a different non static/final method
- [TestUserData](https://github.com/JeroenMols/MockitoExample/blob/master/app/src/test/java/com/jeroenmols/mockitoexample/TestUserData.java) class indicating how to provide testing data for POJO objects
  - TLDR: Override all methods with default values instead of creating a mock and stubbing them out

  <br>

## Audience

<center><a href="{{ site.blogbaseurl }}img/blog/droidconde16talk/audience.jpg"><img src="{{ site.blogbaseurl }}img/blog/droidconde16talk/audience.jpg" alt="Quite some people interested in my talk"></a></center>
