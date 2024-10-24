---
title: Learning full stack - Technology choices
tags:
 - full-stack
 - side-project
 - frontend
 - backend
date: '2024-10-24'
slug: full-stack-technology
featureimagecaption: Photo by Kelly Sikkema on Unsplash, https://unsplash.com/photos/yellow-flower-on-gray-surface-pXmyDPziB8w, resized and cropped
series: ["Full stack development"]
series_order: 2
---
Building a new Full Stack project from scratch entails making a lot of technology choices. Join me in learning which I made for my to-do list side project and why.

## Architecture
We plan on building a full stack to-do list application, of which the requirements can be found in [part 1]({{< ref "076-full-stack-project" >}}). 

The system architecture looks like this:

![Architecture diagram](architecture.png)

Let's look at the technology choices for these.

## Backend

### Programming language
These are the languages/frameworks I considered for the backend:

- [NodeJS](https://nodejs.org/en) with [ExpressJS](https://expressjs.com/) and [TypeScript](https://www.typescriptlang.org/)
- [Ruby on Rails](https://rubyonrails.org/)
- [Go(lang)](https://go.dev/)

#### NodeJS
NodeJS is cross-platform JavaScript runtime with a vibrant community of open-source libraries. What drew me to node last time the allure of using the same language across the frontend and backend. 

And while I was able to reuse my data models and validation code across, there was one thing that bugged me: Javascript requires all database and network access to happen asynchronously.

```js
async function getUser(userId) {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    return user.rows[0];
}
```

While not a big deal in this example, it gets tedious when you need to [wrap callback-based interfaces](https://github.com/JeroenMols/finance-server/blob/main/src/http-promise.ts) to fit the async/await model. This "promise" boilerplate doesn't make Node feel like the right tool.

#### Ruby on Rails
Ruby on Rails was very appealing, because it's such a complete framework to quickly bootstrap a side project. I've heard so many great things about Rails, and even the people I know using it tend to be very happy.

Had my goal been to quickly build something polished, I would have chosen Rails. However, with this project I wanted to make and learn from my design choices. And hence I wanted to go less batteries included. It also didn't help that I already use Ruby extensively at work.

#### Go(lang)
So I decided to use Go as my backend language. It has quite some appealing characteristics, like static typing, built-in concurrency, fast compilation, and near-native performance.

An advantage over Javascript is that database access and network requests are synchronously:

```go
func (db *Database) GetUser(userId string) (*User, error) {
    user := &User{}
    err := db.QueryRow("SELECT * FROM users WHERE id = ?", userId).Scan(&user.ID, &user.Name)
    return user, err
}
```

Go's speed does come at the cost of being verbose and not very feature-rich (especially compared to Kotlin). Still, many big tech (like [Plaid](https://plaid.com/)) use it and hence I was interested to learn.


## Database
The to-do list application has three main resources `Users`, `TodoLists`, and `TodoItems`. These are related and we expect queries such as:

- Give me all the Todo's in list X
- Give me all the Lists for User Y
- ....

There are no special super-latency data requirements or need to store massive amounts of data. So a relational datatbase suits well due to it's reliability, proven track record, and large community of experts to hire.

However, I wanted this project to be super easy to run and hence went with a simple in-memory database. This avoids the need to [install, configure and load up a schema](https://github.com/JeroenMols/finance-server?tab=readme-ov-file#setup-database) in a database server.

That simplies the system architecture to:

![To-do list application architecture without database](architecture_no_db.png)


The [database interface](https://github.com/JeroenMols/tasks/blob/main/backend/db/database.go#L9) is designed to allow future replacement with a SQL database like [PostgreSQL](https://www.postgresql.org/).

```go
type Database interface {
    CreateUser(name string) *User
    GetUser(userId string) (*User, error)
    CreateAccessToken(accountNumber string) *AccessToken
    GetAccessToken(token string) (*AccessToken, error)
    CreateTodoList() *TodoList
    CreateTodo(listId string, description string, user string) *TodoItem
    UpdateTodo(todo *TodoItem) (*TodoItem, error)
    GetTodo(todoId string) (*TodoItem, error)
    GetTodos(listId string) (*[]TodoItem, error)
}
```

## Frontend
Given my limited front-end experience, my main focus here was learning new technologies.

### Programming language
Contrary to the backend, JavaScript/Typescript seems to be the clear choice for the Frontend. I decided to go with [Typescript](https://www.typescriptlang.org/), because static types make programming easier and can use static analysis to catch bugs during compile time.

### Choosing a framework
> If you're not very familiar with Frontend frameworks like me, I highly recommend this [20 min video comparing the same app across 10 JS frameworks](https://www.youtube.com/watch?v=cuHDQhDhvPE).

By far the most used framework is React, followed by Vue, Angular, and Svelte (see [npm trends](https://npmtrends.com/@angular/core-vs-react-vs-svelte-vs-vue)). Since I am already familiar with React, I wanted to experiment with something new.

Selfishly I wanted to go for the cool kid on the block, Svelte, especially since it [stands out](https://survey.stackoverflow.co/2024/technology#2-web-frameworks-and-technologies) in terms of developer happiness.

Unlike React, which operates primarily through a virtual DOM, Svelte compiles your code to efficient, imperative JavaScript at build time, resulting in faster applications.

This gives `.svelte` files a unique structure:

```svelte
<script lang="ts">
  // typescript code here
</script>

// html elements here

<style>
 // CSS code here
</style>
```

Svelte also has a unique syntax to interact between code and HTML:

```svelte
{#if todos.length == 0}
  <h1>Nothing to do</h1>
{:else}
  <h1>Your tasks 🚀</h1>
  <ul class="task-list">
 {#each todos as todo}
      <li class="task-item">
        <h2>{todo.description}</h2>
      </li>
 {/each}
  </ul>
{/if}
```

I also decided to [wrap my application in electron](https://www.electronjs.org/) so I could run it as a native Mac or Windows application.

### Vite
Instead of [Webpack](https://webpack.js.org/), I decided to use [Vite](https://vitejs.dev/) (and [Vitest](https://vitest.dev/)) to have the fastest possible developer experience. Specifically, I used [Electron-vite](https://electron-vite.org/).

I didn't do a scientific comparison, but Vite felt snappier for this small application.


### Playwright
I also decided to use [PlayWright](https://playwright.dev/) for end 2 end tests, I'm espcecially impressed with [the trace viewer](https://playwright.dev/docs/trace-viewer-intro) that allows you to go back and forward in time to debug your tests.

![Playwright trace viewer](playwright.png)

Tests are written pretty declaratively:

```typescript
import { expect, test } from '@playwright/test';

test('login', async ({ page }) => {
	await page.goto('/');

	// Login
	await page.getByText('Create Account').isVisible()
	await page.getByRole('textbox').fill('jeroen')
	await page.screenshot({ path: 'screenshots/intro.png' })
  
	await page.getByRole('button').click()
});
```

Unfortunately though, [Playwright support for Electron is still experimental](https://playwright.dev/docs/api/class-electron) and hence the trace viewer didn't end up working for this project.

### Eslint and Prettier
And finally we have the usual suspects: [EsLint](https://eslint.org/) and [Prettier](https://prettier.io/)

## Wrap up

<p style="color: #646769; background: #f2f3f3; padding: 20px;">This site is 100% tracker free, :heart: for liking my post on <a href="https://androiddev.social/@Jeroenmols/110770683160145866">Mastodon</a> or <a href="https://www.linkedin.com/posts/jeroenmols_fullstack-android-dns-activity-7089323809362604032-Tu2C?utm_source=share&utm_medium=member_desktop">Linkedin</a> to let me know you've read this.</p>

Even for a relatively simple to-do list application, there are a ton of technological choices that have to be made. My main focus here was getting exposed to as many new technologies as possible.
