---
title: Learning full stack - Project
tags:
 - full-stack
 - side-project
 - frontend
 - backend
date: '2024-10-24'
slug: full-stack-project
featureimagecaption: Photo by Element5 Digital on Unsplash, https://unsplash.com/photos/red-apple-fruit-on-four-pyle-books-OyCl7Y4y0Bk, resized and cropped
series: ["Full stack development"]
series_order: 1
---
After pivoting my career to full stack development, I still have little experience with foundational full stack design choices. Hence I decided to built that out using a few side projects. 

Follow me along in this series to learn why, how and what I learned.

## A brief history
After a decade of mobile development, my learning started stalling, which drove me to joining a full stack team. 

This meant learning a lot of new things: 

- new languages: Ruby, Typescript
- SQL databases, especially migrations
- deploying code
- mutation testing
- running development servers
- ...

Fortunately, my new team mentored me to learn all this on the job. Huge credit to the [Cognito team](https://cognitohq.com/) for taking a chance on me!

However, after a while I started wondering:

{{< alert icon="fork">}}
Am I effective at Full Stack? Or is it just this specific role within this company?
{{< /alert >}}

## The missing piece
Since I joined an existing project, all fundamental design choices had already been made. And most of my work centers around working within those constraints.

This is quite different from my mobile days, where I used to be a driving force behind all architecture and technical choices.

And the reason I could, is because I started off small, and incrementally moved on to much larger and complicated systems. Along the way I made a lot of design choices, including a lot of mistakes, and those incrementally deepend my deep Android knowledge.

On full stack however, I just jumped in and hence don't have much experience with:

- API design
- Server language choice
- Choosing a frontend framework
- Selecting a Database
- Approach testing
- Security
- ...

So I identified this as growth area: I want to be able to found new full stack projects myself. This is when I started thinking about building a side project.

> Disclaimer: side projects aren't the only way to learn new things. And time spend on a side project, means time not spend on other things (i.e. my family). This explains why I'm writing this, to multiply my keystrokes and hopefully help others to learn.

## Finance manager project
My first take was building something cool that I would use myself: a Finance manger. It keeps track of your equities across different platforms in one graphical overview.

{{< gallery >}}
  <img src="finance_manager_login.png" class="grid-w50" />
  <img src="finance_manager_overview.png" class="grid-w50" />
{{< /gallery >}}

This project is built using a [React](https://react.dev/) frontend with [TypeScript](https://www.typescriptlang.org/), a [Node.js](https://nodejs.org/en) backend running [Express JS](https://expressjs.com/) and a [PostgreSQL database](https://www.postgresql.org/). I use random UUIDs to represent accounts (no PII required!), tokens to secure access, reuse the data models across the frontend + backend and deployed the result to Heroku.

Oh yeah, and there's also an easter egg! 😎

![Easter egg when you open Google Chrome developer tools](easter_egg.png)

While fun, this project turned out to be quite a bit more work than expected and unfortunately I never really finished it.

If you're interested, you can find the finance-manager [here](https://github.com/JeroenMols/finance-manager) and the finance-server [here](https://github.com/JeroenMols/finance-server).

## Todo list project
Fast forward almost two years, and I was ready for another attempt. To get my "being done" fix this time, I focussed on something simpler: a [to-do list application](https://github.com/JeroenMols/tasks). 

These were my goals:

- supports accounts & authentication
- accounts have one or more to-do lists
- to-do list have items with three states (todo, ongoing, done)
- items can only move from todo > ongoing > done > todo

{{< gallery >}}
  <img src="todo_intro.png" class="grid-w50" />
  <img src="todo_lists.png" class="grid-w50" />
  <img src="todo_todos.png" class="grid-w50" />
{{< /gallery >}}

Sounds boring? 

Hell yes! But this series isn't about the specific app, it's about the technology choices (part 2) and the implementation details (part 3).

## Wrap up

<p style="color: #646769; background: #f2f3f3; padding: 20px;">This site is 100% tracker free, :heart: for liking my post on <a href="https://androiddev.social/@Jeroenmols/110770683160145866">Mastodon</a> or <a href="https://www.linkedin.com/posts/jeroenmols_fullstack-android-dns-activity-7089323809362604032-Tu2C?utm_source=share&utm_medium=member_desktop">Linkedin</a> to let me know you've read this.</p>

After pivoting my career to a Full Stack, I used side projects to deepen my understanding of this new field. While side project are incredibly time consuming, they are a hands on tool to learn new things. 

Read on in part 2 on the technology choices I made for my todo list application.