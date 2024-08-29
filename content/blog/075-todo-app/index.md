---
title: Building a full stack todo list app
tags:
 - full-stack
 - side-project
 - frontend
 - backend
date: '2023-08-29'
slug: todo-app
featureimagecaption: Screenshot of application by Jeroen Mols
---
A great way to enhance your craft is to get your hands dirty on a side project. That allows you to explore new frameworks, programming languages, and design tradeoffs.

Join me in getting better at full-stack development by building a full-stack to-do list application.

## Why?
In our daily work, we usually don't get the opportunity to design a new system from scratch. However, doing so empowers you to make a ton of interesting design decisions:

- designing the API
- choosing programming languages
- selecting frameworks
- choosing a database
- how to approach testing
- ...

While some of these decisions don't evolve much over time (e.g. API design), for others we are still constantly inventing better ways (e.g. Javascript frameworks).

## Finding a good project
Roughly speaking there are two kinds of projects you could choose to build: 

- simple project, solving an existing problem
- project solving a need for yourself/others

My previous side project was a finance manager. This would track all your equity holdings across different platforms and present a detailed overview with charts and returns.

This solved a personal need and replaced my current spreadsheet. But it also turned out to be a lot more complicated and simply a lot of work. So I never really finished it, even though I learned a lot. 

> If you're interested, you can find the finance-manager [here](https://github.com/JeroenMols/finance-manager) and the finance-server [here](https://github.com/JeroenMols/finance-server).

So this time I decided to build something simple: a to-do list application. 

It supports creating accounts, to-do lists, and to-do items with three states (todo, ongoing, done). And to make things interesting we'll disallow some state transitions: 

- ❌ todo -> done
- ❌ done -> todo.

## Backend

### Choosing a programming language
There are four main languages/frameworks I considered to build the backend:

- [NodeJS](https://nodejs.org/en) with [ExpressJS](https://expressjs.com/) and [TypeScript](https://www.typescriptlang.org/)
- [Ruby on Rails](https://rubyonrails.org/)
- [Python](https://www.python.org/)
- [Go(lang)](https://go.dev/)

NodeJS has excellent open-source framework support. It also allows to reuse validation code or data models across the front and backend. However, it requires all database and network access to happen asynchronously. 

```javascript
async function getUser(userId) {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    return user.rows[0];
}
```

While not a big deal in this example, it gets tedious when you need to [wrap callback-based interfaces](https://github.com/JeroenMols/finance-server/blob/main/src/http-promise.ts) to fit the async/await model. This "promise" boilerplate doesn't make Node feel like the right tool.

Ruby on Rails was a very very appealing choice, it's incredibly powerful and very opinionated. However, it felt like an all-or-nothing choice and I already had my eye on a Frontend framework. Furthermore, I already knew Ruby...

In all honesty, I never really considered Python as a serious option. It's a great language for quick scripting (like the [advent of code](https://github.com/JeroenMols/AdventOfCode2021)) but I couldn't see myself building a serious backend in Python.

So I decided to use Go as my backend language. It has quite some appealing characteristics, like static typing, built-in concurrency, fast compilation, and near-native performance. Also, database access and network requests can be done synchronously.  

```go
func (db *Database) GetUser(userId string) (*User, error) {
    user := &User{}
    err := db.QueryRow("SELECT * FROM users WHERE id = ?", userId).Scan(&user.ID, &user.Name)
    return user, err
}
```

Go isn't perfect though, it tends to be quite verbose and the language isn't as feature-rich (especially not compared to Kotlin). However, it's the language [Plaid](https://plaid.com/), and many other big tech, use so I was interested to learn.


### Choosing a database
The application we're planning to build has three main resources: `Users`, `TodoLists`, and `TodoItems`. These are related and we expect queries such as:

- Give me all the Todo's in list X
- Give me all the Lists for User Y
- ....

Not only does this data look relational (expect join operations), but there are also no special super-latency data requirements or need to store massive amounts of data. 

So a relational database suits well. These kinds of databases are highly reliable, have a proven track record, and have a large community of experts to hire.

However, to keep the project small, I chose an in-memory variant. This reduces project setup and simplifies testing by allowing quick resets between tests. The [database interface](https://github.com/JeroenMols/tasks/blob/main/backend/db/database.go#L9) was designed to allow future replacement with a SQL database like [PostgreSQL](https://www.postgresql.org/).

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

### API design

The API was designed with REST principles, focusing on user and to-do list management. The endpoints are as follows:

- `POST /users/register` - Register a new user
- `POST /users/login` - User login
- `POST /todolists` - Create a new todo list
- `GET /todolists/{list_id}` - Get a specific todo list
- `POST /todos` - Create a new todo item
- `PUT /todos/{todo_id}` - Update a todo item

Notice how all resource names are plural.

The `/users` deviate slightly from the others as I felt they were different from the others: they are non-authenticated and not designed for other interactions. 

However, if I would design these again, I would use:

- `POST /users` - Create a new user
- `POST /tokens` - Create a login token

This makes it more natural to support editing users or revoking/expiring tokens later on.

Finally, I also added a [`/debug` endpoint](https://github.com/JeroenMols/tasks/blob/main/backend/routes/debug.go) to easily inspect the database:

```bash
 curl http://localhost:8080/debug | jq 
```

```json
{
  "Users": {
    "usr_Fq8uKUngJmHfUjKvf66TdJ": {
      "Id": "usr_Fq8uKUngJmHfUjKvf66TdJ",
      "Name": "Jeroen"
 }
 },
  "AccessTokens": {
    "tkn_5Ao9yEgb8Cp2ba7Rab7ntn": {
      "UserId": "usr_Fq8uKUngJmHfUjKvf66TdJ",
      "Token": "tkn_5Ao9yEgb8Cp2ba7Rab7ntn"
 }
 },
  "TodoLists": {
    "lst_PhKGbn4dDPARkeSVqDVm3E": {
      "Id": "lst_PhKGbn4dDPARkeSVqDVm3E"
 }
 },
  "TodoItems": {
    "tdo_gkGPiPuvTjx2Dr3fpQqFaQ": {
      "Id": "tdo_gkGPiPuvTjx2Dr3fpQqFaQ",
      "ListId": "lst_PhKGbn4dDPARkeSVqDVm3E",
      "UserId": "usr_Fq8uKUngJmHfUjKvf66TdJ",
      "UpdatedAt": "2024-08-01T22:34:14.727375+02:00",
      "Description": "Write blog post about this project",
      "Status": "ongoing"
 }
 },
  "TodoItemOrder": [
    "tdo_gkGPiPuvTjx2Dr3fpQqFaQ"
 ]
}
```

### Security
Endpoints are secured using an access token, passed in the authorization header without the `bearer` prefix (which I should have done).

```bash
curl -X POST "http://localhost:8080/todolists" \
 -H "Authorization: $TOKEN" \
     -d '{}'
```

An [authentication middleware](https://github.com/JeroenMols/tasks/blob/main/backend/net/auth.go) checks the authentication for all requests:

```go
var nonAuthenticatedEndpoints = []string{"/users/register", "/users/login"}

func AuthenticationMiddleware(next http.Handler, database db.Database) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if slices.Contains(nonAuthenticatedEndpoints, r.URL.Path) {
            next.ServeHTTP(w, r)
            return
 }

        if _, err := database.GetAccessToken(r.Header.Get("Authorization")); err != nil {
            HaltUnauthorized(w, err.Error())
            return
 }
        next.ServeHTTP(w, r)
 })
}
```

Note that I initially wanted to pass the token as part of the POST body. That would encrypt it so it cannot be read by man-in-the-middle. However, GET requests don't have a body so.... 😅

An important consequence of passing tokens in a header is that this causes the browsers to enforce [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)!

To handle this, I implemented a [CORS middleware](https://github.com/JeroenMols/tasks/blob/main/backend/net/cors.go). It took me a while to get this working since you need to return early to handle browser preflight requests.

```go
func CorsMiddleware(next http.Handler, origin string) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", origin)
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT")
        w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        w.Header().Set("Content-Type", "application/json")

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)
            return
 }

        next.ServeHTTP(w, r)
 })
}
```

### Backend structure
The backed code consists of 4 packages:

- [db](https://github.com/JeroenMols/tasks/tree/main/backend/db) -> database layer
- [net](https://github.com/JeroenMols/tasks/tree/main/backend/net) -> http middleware and utilities
- [routes](https://github.com/JeroenMols/tasks/tree/main/backend/routes) -> all routes
- [util](https://github.com/JeroenMols/tasks/tree/main/backend/util) -> utitlites (mainly for testability)

The [main.go](https://github.com/JeroenMols/tasks/blob/main/backend/main.go) file is the entry point that defines all routes and starts the server. To better learn Go, I chose the improved built-in [net/http.ServeMux](https://tip.golang.org/doc/go1.22) over a framework like [Gin](https://gin-gonic.com/). 

```go
func main() {
    mux := http.NewServeMux()
    database := db.CreateDatabase()

    users := routes.CreateUsers(database)
    mux.HandleFunc("POST /users/register", users.Register)
    
    handler := net.AuthenticationMiddleware(mux, database)

    err := http.ListenAndServe("localhost:8080", handler)
    if err != nil {
        fmt.Println(err.Error())
 }
```

Routes are each implemented in their file with one handler function per endpoint. Each handler parses the body, does some additional validations, updates the database, and returns a result.

```go
func (u *Users) Register(w http.ResponseWriter, r *http.Request) {
    body, err := net.ParseBody[registerRequest](r)
    if err != nil {
        net.HaltBadRequest(w, err.Error())
        return
 }

    if !regexp.MustCompile(userNameRegex).MatchString(body.Name) {
        net.HaltBadRequest(w, "invalid user name")
        return
 }

    user := u.database.CreateUser(body.Name)
    response := registerResponse{
        UserId: user.Id,
 }

    net.Success(w, response)
}
```

The in-memory database consists of several maps to store all data:

```go
type InMemoryDatabase struct {
    Users         map[string]User
    AccessTokens  map[string]AccessToken
    TodoLists     map[string]TodoList
    TodoItems     map[string]TodoItem
    TodoItemOrder []string
}
```

Notice how I had a `TodoItemOrder` slice to keep track of the order of `TodoItem` in each `TodoList`. This turned out to be a rather hard-to-debug artifact of not using an actual database with auto-incrementing IDs.

And an interface function for each CRUD operation on each resource:

```go
func (d *InMemoryDatabase) CreateUser(name string) *User {
    user := User{
        Id:   d.generateUuid("usr"),
        Name: name,
 }
    d.Users[user.Id] = user
    return &user
}
```

### Business logic
Somewhere/somehow we need to check whether a `TodoItem` state transition is allowed or not. Typically you want to enforce such data integrity as close to your database layer as possible. For instance, using a [SQL constraint](https://www.postgresql.org/docs/current/ddl-constraints.html).

However, constraints can only validate:
- whether all columns of the inserted/updated row are valid
- whether the combination of values in all columns is valid
- whether the row violates unique constraint with other rows

To validate that the updated row has a valid status, given the row it will update, we need to use a [trigger](https://www.postgresql.org/docs/16/sql-createtrigger.html). Triggers are unfortunately not as obvious as constraints, and many triggers in a database can make it hard to reason about data integrity.

So instead of using a trigger, I decided to build the data validation in application code, right above the database layer.

```go
func (t *Todos) Update(w http.ResponseWriter, r *http.Request) {
 ...

    err = item.ChangeStatus(body.Status)
    if err != nil {
        net.HaltBadRequest(w, err.Error())
        return
 }
}
```

And the data model has the [business logic](https://github.com/JeroenMols/tasks/blob/main/backend/db/models.go#L32) implemented:

```go
func (t *TodoItem) ChangeStatus(newStatus string) error {
    if t.Status == "todo" || t.Status == "done" {
        if newStatus == "ongoing" {
            t.Status = newStatus
            return nil
 }
        return errors.New(fmt.Sprintf("invalid status transition from %s to %s", t.Status, newStatus))
 } else if t.Status == "ongoing" {
        if newStatus == "done" || newStatus == "todo" {
            t.Status = newStatus
            return nil
 }
        return errors.New(fmt.Sprintf("invalid status transition from %s to %s", t.Status, newStatus))
 }
    return errors.New(fmt.Sprintf("invalid status transition from %s to %s", t.Status, newStatus))
}
```

Like most other classes in the backed, this [business logic also has unit tests](https://github.com/JeroenMols/tasks/blob/main/backend/db/models_test.go):

```go
func TestTodoItem_ChangeStatus(t *testing.T) {
    tests := []struct {
        oldStatus string
        newStatus string
        error     bool
 }{
        // Allowed transitions
 {
            oldStatus: "todo",
            newStatus: "ongoing",
            error:     false,
 },
 ...
        // Disallowed transitions
 {
            oldStatus: "todo",
            newStatus: "done",
            error:     true,
 },
 ...
 }

    for _, tt := range tests {
        t.Run(fmt.Sprintf("from %s to %s", tt.oldStatus, tt.newStatus), func(t *testing.T) {
            item := TodoItem{
                Id:          "fake_id",
                UpdatedAt:   util.FakeTime(2021, 1, 1),
                Description: "fake description",
                Status:      tt.oldStatus,
                UserId:      "fake_user",
 }

            err := item.ChangeStatus(tt.newStatus)
            if err != nil || tt.error {
                expected := fmt.Sprintf("invalid status transition from %s to %s", tt.oldStatus, tt.newStatus)
                assert.Equal(t, tt.error, true)
                assert.Equal(t, expected, err.Error())
 } else {
                assert.Equal(t, tt.newStatus, item.Status)
 }
 })
 }
}
```

## Frontend
### Choosing a framework
> If you're not very familiar with Frontend frameworks like me, I highly recommend this [20 min video comparing the same app across 10 JS frameworks](https://www.youtube.com/watch?v=cuHDQhDhvPE).

By far the most used framework is React, followed by Vue, Angular, and Svelte (see [npm trends](https://npmtrends.com/@angular/core-vs-react-vs-svelte-vs-vue)). Since I am already familiar with React, I wanted to experiment with something new.

Looking at the StackOverflow developer survey, [Svelte stands out](https://survey.stackoverflow.co/2024/technology#2-web-frameworks-and-technologies) in terms of developer happiness. 

I also decided to [wrap my application in electron](https://www.electronjs.org/) so I could run it as a native Mac or Windows application.

### Other tools
Given my limited front-end experience, my main focus here was learning new technologies.

Instead of [Webpack](https://webpack.js.org/), I decided to use [Vite](https://vitejs.dev/) (and [Vitest](https://vitest.dev/)) to have the fastest possible developer experience. Specifically, I used [Electron-vite](https://electron-vite.org/).

I didn't do a scientific comparison, but Vite felt snappier for this small application.

I also decided to use [PlayWright](https://playwright.dev/) for end 2 end tests, mainly because of the [the trace viewer](https://playwright.dev/docs/trace-viewer-intro) that allows you to go back and forward in time to debug your tests. Unfortunately though, [Playwright support for Electron is still experimental](https://playwright.dev/docs/api/class-electron) and the trace viewer didn't work.

And finally we have the usual suspects: [Typescript](https://www.typescriptlang.org/), [EsLint](https://eslint.org/) and [Prettier](https://prettier.io/)

### Svelte code
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

### Frontend structure
The front end consists of three main folders:

- [components](https://github.com/JeroenMols/tasks/tree/main/frontend/src/renderer/src/components) -> the three screens + error banner
- [net](https://github.com/JeroenMols/tasks/tree/main/frontend/src/renderer/src/net) -> models and logic for network requests
- [utils](https://github.com/JeroenMols/tasks/tree/main/frontend/src/renderer/src/utils)

App.svelte contains the main logic to decide what's being shown:

```svelte
{#if todoList != null}
  <Todo {accessToken} todoListId={todoList} />
{:else if accessToken != null}
  <ChooseList {accessToken} {onListSelected} />
{:else}
  <LogIn {onLogIn} />
{/if}
```

All validations are done on the backend, but the frontend also has [some minor validations](https://github.com/JeroenMols/tasks/blob/main/frontend/src/renderer/src/net/requests.ts#L17) to speed up error handling.

### End-to-End Tests
To get the end-to-end tests running, there were two main challenges:

1. Starting the server
2. Clearing [localstorage](https://github.com/JeroenMols/tasks/blob/main/frontend/src/renderer/src/App.svelte#L6)

To start the server when the tests run, I created two new scripts: one to [start the server](https://github.com/JeroenMols/tasks/blob/main/backend/start_server.sh) and one to [run the end-to-end tests](https://github.com/JeroenMols/tasks/blob/main/frontend/run_e2e_tests.sh):

```bash
#!/bin/bash

# Start the backend server
(cd ../backend && ./start_server.sh)&
BACKEND_PID=$!

# Build and run tests
npm run build
npx playwright test --reporter=html

# Kill the backend server
kill $BACKEND_PID &> /dev/null
kill $(pgrep -f go-build) > /dev/null
```

This script is also aliased in the package.json file:

```json
 {
 "scripts": {
    "test:e2e": "./run_e2e_tests.sh",
 }
 }
```

I couldn't find an easy way to clear the local storage, so I had to resort to a hacky, mac only, solution that force clears the app cache:

```bash
# Clear the app cache of the Electron app
rm -r ~/Library/Application\ Support/frontend-electron
```

Here's a snippet of [the end-to-end test](https://github.com/JeroenMols/tasks/blob/main/frontend/tests/end2end.spec.js) to get an idea of how it looks like:

```js
test('end 2 end test', async () => {
  const electronApp = await electron.launch({ args: ['.'] })
  const window = await electronApp.firstWindow()

  // Login
  await window.getByText('Create Account').isVisible()
  await window.getByRole('textbox').fill('jeroen')
  await window.screenshot({ path: 'screenshots/intro.png' })

  await electronApp.close()
}
```

## Wrap up

<p style="color: #646769; background: #f2f3f3; padding: 20px;">This site is 100% tracker free, :heart: for liking my post on <a href="https://androiddev.social/@Jeroenmols/110770683160145866">Mastodon</a> or <a href="https://www.linkedin.com/posts/jeroenmols_fullstack-android-dns-activity-7089323809362604032-Tu2C?utm_source=share&utm_medium=member_desktop">Linkedin</a> to let me know you've read this.</p>

Overall I think the project turned out quite well and I'm happy with most of the choices I made. You can find all [source code on Github](https://github.com/JeroenMols/tasks) and try it out for yourself!

On the backend, Go turned out to be really fast and fairly easy to learn. Though the lack of inheritance is weird and it's verbosity makes it not a pleasure to look at. I can understand Go's appeal now though.

Svelte was a real treat! It's so much simpler and more expressive than React is and I found it an utter joy to use. Vite indeed turned out to be fast and Playwright incredibly cool, just a shame that Electron isn't well supported.

From a time perspective, I spent around 40 hours coding and 5 hours on this blog post, and I have two shippable artifacts to show for! 🙌 So I'm pretty happy with how this project turned out and especially what I learned.

If this was helpful to you, consider [buying me a coffee](https://www.buymeacoffee.com/jeroen).
