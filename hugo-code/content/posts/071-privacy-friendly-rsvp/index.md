---
title: A privacy friendly RSVP for events
published: true
header:
  teaser: img/blog/privacy-friendly-rsvp/privacy-friendly-rsvp.jpg
  imgcredit: Photo by Nik from Unsplash, https://unsplash.com/photos/5dgHxsvJ170,
    cropped and resized
tags:
- privacy
- html
- javascript
- rsvp
date: '2023-03-28'
slug: privacy-friendly-rsvp
---


Planning an event can be stressful, and the last thing you need is worrying about your guests' privacy. But don't worry, I've got you covered with a privacy-friendly RSVP option.

## Opportunity

There exist plenty of online services (like [rsvpify](https://rsvpify.com/)) that offer a slick looking interface and a powerful dashboard to track who's coming to your event.

However, such online services require guests to provide personal information such as their name, email, phone number, and sometimes even their address.

While they may be convenient for managing responses, they can also put your guests' privacy at risk or may even use their information for marketing purposes.

## Insight

But there is a better way: good plain old email.

- No middleman
- Senders control when and if to send Email
- No fees

Let's create a simple HTML website that offers such a privacy-friendly RSVP option.

First, create an HTML file with the following code:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Privacy-Friendly RSVP</title>
  </head>
  <body>
    <button onclick="sendEmail()">RSVP</button>
    <script>
      function sendEmail() {
        window.location.href =
          'mailto:name.lastname+rsvp@gmail.com?subject=RSVP&body=I will be attending!';
      }
    </script>
  </body>
</html>
```

This code creates a basic HTML page with a single button. When the button is clicked, it will invoke a JavaScript function that directs the user to their email application and prefills the email receiver address, subject and body.

Notice how we [leverage the `+rsvp` suffix in a gmail address](https://gmail.googleblog.com/2008/03/2-hidden-ways-to-get-more-from-your.html) to allow to easily filter or label RSVP emails in your mailbox.

Off course, you can customize this code to fit your specific event by changing the email address, subject, and body text.

Guests decide what, when and whether to send. All without having to provide any personal information to a third-party service. It's simple, easy, and most importantly, respectful of your guests' privacy.

## Full example

Let's build a slightly more attractive looking RSVP page:

[![Privacy friendly RSVP desktop]({{ site.url }}{{ site.baseurl }}/img/blog/privacy-friendly-rsvp/desktop.jpg){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/privacy-friendly-rsvp/desktop.jpg)

That looks on mobile like:

[![Privacy friendly RSVP mobile]({{ site.url }}{{ site.baseurl }}/img/blog/privacy-friendly-rsvp/mobile.jpg){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/privacy-friendly-rsvp/mobile.jpg)

This can be achieved by starting from the following HTML:

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body
    background="background.jpg"
    style="
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        max-width: 800px;
        width: 90%;
        height: 90%;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 20px;
        padding: 20px;
      "
    >
      <div style="display: flex; flex-direction: column; align-items: center">
        <h1
          style="
            color: white;
            font-family: 'Courier New', Courier, monospace;
            font-size: 8em;
            margin: 0px;
          "
        >
          Party
        </h1>
        <h2
          style="
            color: white;
            font-family: 'Courier New', Courier, monospace;
            font-size: 2em;
            margin: -25 0 0 0;
          "
        >
          description
        </h2>
      </div>

      <div style="flex-grow: 1"></div>

      <div
        style="display: flex; align-items: flex-start; flex-direction: column"
      >
        <p
          style="
            color: white;
            font-family: 'Courier New', Courier, monospace;
            font-size: 1.5em;
            margin: 0px;
            padding: 0 20;
          "
        >
          Come celebrate with me
        </p>
        <p
          style="
            color: white;
            font-family: 'Courier New', Courier, monospace;
            font-size: 1.5em;
            margin: 0px;
            padding: 0 20;
          "
        >
          🗓️ date + hour
        </p>
        <p
          style="
            color: white;
            font-family: 'Courier New', Courier, monospace;
            font-size: 1.5em;
            margin: 0 0 20 0;
            padding: 0 20;
          "
        >
          🍻 and 🍟 to enjoy
        </p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2246.3233326624286!2d9.124615916552427!3d55.73551088054884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464b717428bfa99b%3A0xfba38e2c20ba313a!2sLEGOLAND%C2%AE%20Billund%20Resort!5e0!3m2!1sen!2sbe!4v1680002007769!5m2!1sen!2sbe"
          width="100%"
          height="150"
          style="border: 0"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
        <button
          style="
            padding: 8 30;
            font-family: 'Courier New', Courier, monospace;
            font-size: 1.5em;
            margin-top: 20;
            background: white;
            border: white;
            align-self: center;
          "
          id="btn-rsvp"
        >
          RSVP?
        </button>
      </div>

      <script>
        document
          .getElementById('btn-rsvp')
          .addEventListener('click', function () {
            var link =
              'mailto:name.lastname+rsvp@gmail.com' +
              '?subject=' +
              encodeURIComponent('RSVP - My party') +
              '&body=' +
              encodeURIComponent('We will be there!');
            window.location.href = link;
          });
      </script>
    </div>
  </body>
</html>
```

Just save the code above in `index.html` and add a `background.jpg` to the same folder to set your desired background.

Party on! 🎉

## Wrap up

<p style="color: #646769; background: #f2f3f3; padding: 20px;">This site is 100% tracker free, :heart: for liking my post on <a href="https://androiddev.social/@Jeroenmols/110101372976132453">Mastodon</a> or <a href="https://www.linkedin.com/posts/jeroenmols_a-privacy-friendly-rsvp-for-events-activity-7046488707721289728-VGDJ">Linkedin</a> to let me know you've read this.</p>

You don't have to sacrifice privacy for convenience when it comes to event planning. A simple HTML website with a button to send an email is a privacy-friendly RSVP alternative!

If this was helpful to you, consider [buying me a coffee](https://www.buymeacoffee.com/jeroen).
