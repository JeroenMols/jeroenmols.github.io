---
title: Extending Mockito
published: true
header:
  image: img/blog/mockitomatchers/mockitomatchers.png
  imgcredit: Image by Andrés Nieto Porras, https://creativecommons.org/licenses/by-sa/2.0/, cropped
tags:
  - android
  - mockito
  - testing
---
Due to its clean simple api, Mockito has become world's most popular Java mocking framework. After having covered [all of its basics](https://speakerdeck.com/jeroenmols/testing-made-sweet-with-a-mockito), it's time to spice things up and start extending Mockito.

This blogpost will demonstrate the power of custom Mockito matchers.

## Problem sketch
Imagine a very simple example where a button in the UI sends a message to a User object that in its turn does the a WebService call.

![Basic architecture of our situation to test]({{ site.url }}{{ site.baseurl }}/img/blog/mockitomatchers/architecture.png){: .align-center}

We now want to verify that the User calls the `sendMessages()` method on the WebService with the appropriate arguments.


## Traditional test
The way to typically test such a scenario is to use an ArgumentCaptor that captures the ArrayList passed to `sendMessages()`. Next you can verify that the list contains the appropriate element.

```java
@Test
public void sendMessage() throws Exception {
    User user = new User(mockWebService, USER_ID, PASSWORD);
    ArgumentCaptor<List<String>> listArgumentCaptor = ArgumentCaptor.forClass(List.class);
    String expectedMessage = "Test message";

    user.sendMessage(expectedMessage);

    verify(mockWebService).sendMessages(eq(user), listArgumentCaptor.capture());
    List<String> messages = listArgumentCaptor.getValue();
    String actualMessage = messages.get(0);

    assertEquals(expectedMessage, actualMessage);
}
```

I don't even have to begin to explain how cumbersome this is!


## Custom matcher test
We can dramatically simplify this by writing our own Mockito matcher and use that as an argument in our test verification.

First we create a class called `ListContains` that implements the `ArgumentMatcher` interface. Then add a constructor that get's the expected element and implement the `matches()` method so it checks if the list contains that element.

```java
public class ListContains<T> implements ArgumentMatcher<List> {

    private final T object;

    public ListContains(T object) {
        this.object = object;
    }

    public boolean matches(List list) {
        return list.contains(object);
    }

    public String toString() {
        //printed in verification errors
        return "[list doesn't contain object]";
    }
}
```

Note that `toString()` prints an error when the verification fails.

To make the matcher syntax more intuitive you should create a new class called `ListMatchers` that provides a easy to access the matcher.

```java
public class ListMatchers {

    @Nullable
    public static <K> List listContains(K object) {
        return argThat(new ListContains<>(object));
    }
}
```

With this new custom matcher, we can simplify the test to:

```java
@Test
public void customMatchers() throws Exception {
    User user = new User(mockWebService, USER_ID, PASSWORD);
    String expectedMessage = "Test message";
    user.sendMessage(expectedMessage);

    verify(mockWebService).sendMessages(listContains(expectedMessage));
}
```

Pretty neat isn't it?


## Library
After a great suggestion from Eugen Martynov, I've decided to create a [library for all of these collection matchers](https://github.com/JeroenMols/MockitoCollectionMatchers) on Github.

All you have to do is add Jitpack to your main `build.gradle` file:

```groovy
repositories {
    maven { url "https://jitpack.io" }
}
```

And add a dependency on the library in your project `build.gradle` file:

```groovy
testCompile 'com.github.JeroenMols:MockitoCollectionMatchers:0.0.1'
```

This is very much a work in progress, so expect more matchers to come soon!


## Wrap-up
Custom matchers are a great way to simplify unit tests. In my [Mockito sample project](https://github.com/jeroenmols/mockitoexample) you can learn more about how to use Mockito and find other custom matcher examples.

As always you can reach me [@molsjeroen](https://twitter.com/molsjeroen) on twitter, or leave a comment below!
