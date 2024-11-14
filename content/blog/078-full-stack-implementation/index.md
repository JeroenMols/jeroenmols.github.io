---
title: Learning full stack - Implementation details
tags:
 - full-stack
 - side-project
 - frontend
 - backend
date: '2024-11-14'
slug: full-stack-implementation
featureimagecaption: Photo by Kelly Sikkema on Unsplash, https://unsplash.com/photos/white-printer-paper-on-brown-wooden-table-9OGNpJPVMZ8, resized and cropped
series: ["Full stack development"]
series_order: 3
---
To conclude my series on full-stack development, this part will look at the implementation, design choices, what worked well and what didn't.

This builds on the to-do list project proposed in [part 1]({{< ref "076-full-stack-project" >}}) and the tech stack described in [part 2]({{< ref "077-full-stack-technology" >}}).

## API design

The API was designed with REST principles, focusing on user and to-do list management. The endpoints are as follows:

- `POST /users/register` - Register a new user
- `POST /users/login` - User login
- `POST /todolists` - Create a new todo list
- `GET /todolists/{list_id}` - Get a specific todo list
- `POST /todos` - Create a new todo item
- `PUT /todos/{todo_id}` - Update a todo item

Notice how all resource names are plural.

The `/users` deviate slightly from the others as I felt they were different from the others: they are non-authenticated and not designed for other interactions beyond `POST`.

However, if I would design these again, I would use:

- `POST /users` - Create a new user
- `POST /tokens` - Create a login token

This makes it more natural to support editing users or revoking/expiring tokens later on.


### Debug endpoint
A handy trick I found was adding a [`/debug` endpoint](https://github.com/JeroenMols/tasks/blob/main/backend/routes/debug.go), which allows to easily inspect the database:

```bash
 curl http://localhost:8080/debug | jq 
```

This returns the database:

```
func (u *Debug) Debug(w http.ResponseWriter, _ *http.Request) {
 net.Success(w, u.database)
}
```

Which gets serialized to JSON, because it's just an in-memory struct:

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

Fun fact: I initially wanted to pass the token as part of the POST body, which keeps [requests "simple"](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests) and prevents [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) from being enforced. But then I realized GET requests don't have a body so... 😅 

To handle CORS, I implemented a [CORS middleware](https://github.com/JeroenMols/tasks/blob/main/backend/net/cors.go). It took me a while to get this working since you need to return early to handle browser preflight requests.

```go
func CorsMiddleware(next http.Handler, origin string) http.Handler {
 return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
 w.Header().Set("Access-Control-Allow-Origin", origin)
 w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT")
 w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
 w.Header().Set("Access-Control-Allow-Credentials", "true")
 w.Header().Set("Content-Type", "application/json")

        if r.Method == http.MethodOptions {
 // Early return for CORS preflight
 w.WriteHeader(http.StatusNoContent)
 return
 }

 next.ServeHTTP(w, r)
 })
}
```

## Backend

### Code structure
The backed code consists of 4 packages:

- [db](https://github.com/JeroenMols/tasks/tree/main/backend/db) -> database layer
- [net](https://github.com/JeroenMols/tasks/tree/main/backend/net) -> http middleware and utilities
- [routes](https://github.com/JeroenMols/tasks/tree/main/backend/routes) -> all routes
- [util](https://github.com/JeroenMols/tasks/tree/main/backend/util) -> utitlites (mainly for testability)

The [main.go](https://github.com/JeroenMols/tasks/blob/main/backend/main.go) file is the entry point that defines all routes and starts the server. To better learn Go, I chose the built-in [net/http.ServeMux](https://tip.golang.org/doc/go1.22) over a framework like [Gin](https://gin-gonic.com/). 

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
}
```

### Routes
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

### In-memory database
The in-memory database is a struct consisting of several maps to store all data:

```go
type InMemoryDatabase struct {
 Users         map[string]User
 AccessTokens  map[string]AccessToken
 TodoLists     map[string]TodoList
 TodoItems     map[string]TodoItem
 TodoItemOrder []string
}
```

Whenever a resource is created, the database generates a UUID and uses that as the key to store resources in a map.

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

This makes storing/getting resources incredibly easy, but it did end up biting me quite hard. Since maps aren't ordered collections, to-do items would be returned in a random order, which was very hard to debug.

To solve this, I had to add an additional `TodoItemOrder` slice to keep track of the order of `TodoItem` in each `TodoList`. Which is not great, and a real database would have solved this for me out of the box with auto-incrementing IDs.

The [database.go](https://github.com/JeroenMols/tasks/blob/main/backend/db/database.go) defines the CRUD operations on all resources.

### Identifiers
To [uniquely identify](https://github.com/JeroenMols/tasks/blob/main/backend/util/util.go#L11) all resources I used `base58` encoded identifiers. This is a cool scheme for identifiers as it results in relatively short identifiers that avoid ambiguous characters. 

I used prefixes to identify the resource type: `usr`, `tkn`, `lst`, and `tdo`.

```go
"usr_Fq8uKUngJmHfUjKvf66TdJ"
"tkn_5Ao9yEgb8Cp2ba7Rab7ntn"
"lst_PhKGbn4dDPARkeSVqDVm3E"
"tdo_gkGPiPuvTjx2Dr3fpQqFaQ"
```

Since these are URL safe, a future web app could just expose these in the different page URL paths.

### Business logic
To make things more interesting, we wanted to disallow certain TODO state transitions:

- ❌ todo -> done
- ❌ done -> todo

Typically you want to enforce such data integrity as close to your database layer as possible. For instance, using a [SQL constraint](https://www.postgresql.org/docs/current/ddl-constraints.html) or a [trigger](https://www.postgresql.org/docs/16/sql-createtrigger.html).

However, given that we don't have a real database, this logic is built into the application code:

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

### Code structure
The front end consists of three main folders:

- [components](https://github.com/JeroenMols/tasks/tree/main/frontend/src/renderer/src/components) -> the three screens + error banner
- [net](https://github.com/JeroenMols/tasks/tree/main/frontend/src/renderer/src/net) -> models and logic for network requests
- [utils](https://github.com/JeroenMols/tasks/tree/main/frontend/src/renderer/src/utils)

`App.svelte` contains the main logic to decide what's being shown:

```svelte
{#if todoList != null}
 <Todo {accessToken} todoListId={todoList} />
{:else if accessToken != null}
 <ChooseList {accessToken} {onListSelected} />
{:else}
 <LogIn {onLogIn} />
{/if}
```

Whenever the user logs in, the `Login` component calls `onLogIn` on the main App such that the token can be stored in local storage:

```svelte
<script>
 let accessToken: string | null = localStorage.getItem('access_token')

 const onLogIn = (token: string) => {
 console.log('Received token:', token)
 localStorage.setItem('access_token', token)
 accessToken = token
 }
</script>
```

This keeps users logged in across Electron app restarts.

All validations are done on the backend, but the frontend also has [some minor validations](https://github.com/JeroenMols/tasks/blob/main/frontend/src/renderer/src/net/requests.ts#L17) to speed up error handling.


### End-to-End Tests
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

I did run into a few challenges...

#### Make end-to-end tests easy to run
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
 "test:unit": "vitest"
 }
}
```

Now tests can be run simply using `npm run test:e2e`

#### Reset state before tests
A big drawback of remembering sessions across app starts is that the user could still be logged in when the app starts. Solving this after each test run is not sufficient as local, manual testing could also cause the user to be logged in.

So I needed to find a way to clear the [localstorage](https://github.com/JeroenMols/tasks/blob/main/frontend/src/renderer/src/App.svelte#L6) in an Electron app before starting a test run. While this would be super easy in a browser, I couldn't find a good way to do that on Electron. And to this day I'm still not sure if that's because I'm missing something or because Playwrights support for Electron is still in beta.


So I ended up resorting to a hacky, mac only, solution that force clears the app cache:

```bash
# Clear the app cache of the Electron app
rm -r ~/Library/Application\ Support/frontend-electron
```

#### Result
![End-to-end tests in action](e2etests.gif)

## Wrap up

{{< alert icon="code" >}}
{{< notrackers mastodon="113480623702912726" linkedin="jeroenmols_learning-full-stack-implementation-details-activity-7262759679158579200-zuC-" >}}
{{< /alert >}}

Overall I think the project turned out quite well and I'm happy with most of the choices I made. You can find all [source code on Github](https://github.com/JeroenMols/tasks) and try it out for yourself!

On the backend, Go turned out to be really fast and fairly easy to learn. Though the lack of inheritance is weird and its verbosity makes it not a pleasure to look at. I can understand Go's appeal now though.

Svelte was a real treat! It's so much simpler and more expressive than React is and I found it an utter joy to use. Vite indeed turned out to be fast and Playwright incredibly cool, just a shame that Electron isn't well supported.

From a time perspective, I spent around 40 hours coding and 12 hours on this blog series, and I have two shippable artifacts to show! 🙌 So I'm pretty happy with how this project turned out and especially what I learned.

Special thanks to Daniel Gollahon for proofreading an early draft of this post and offering many thoughtful suggestions.

If this was helpful to you, consider [buying me a coffee](https://www.buymeacoffee.com/jeroen).