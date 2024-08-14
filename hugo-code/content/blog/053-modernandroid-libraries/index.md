---
title: Modern Android - Libraries
published: false
tags:
-
date: '2020-02-06'
slug: modernandroid-libraries
featureimagecaption: Photo by FOX from Pexels, https://www.pexels.com/photo/shallow-focus-photography-of-green-grasses-during-daytime-212324/,
  cropped and resized
---

With Kotlin becoming increasingly ubiquitous and Android architecture components getting mature, the way we built Android apps has evolved quite a bit. Having worked on a greenfield project at TransferWise recently, I'd like to share my library, architecture and other choices.

This blog post series will deep dive into all choices made for the TransferWise for Banks reference application:

- Part 1 - Libraries
- Part 2 - Representing UI state
- Part 3 - Modelling navigation events
- Part 4 - Fully stateless UIs
- Part 5 - Dynamic theming
- Part 6 - Git log messages
- Part 7 - KTX functions

## Project introduction
To understand the rationale behind many choices, it's important to understand what this project was meant to accomplish and who it was targeting.

The TransferWise for banks team helps banks implement international payments into their apps. This is more challenging than you may expect, mostly due to the many legal requirements involved in transferring money from one currency to the other.

So to help banks speed up their TransferWise integration, we built a [reference backend](https://github.com/transferwise/banks-reference-backend) and [reference Android app](https://github.com/transferwise/banks-reference-android) for TransferWise for banks.

Goals of the project are to build code that:

1. Is easy to understand, even for non-Android developers (!!!)
2. Showcases how the TransferWise for banks API works and can be integrated
3. Helps banks prototype (or even build!) their TransferWise for banks integration

## Key design choices
As the main objective is to show how to integrate the TransferWise for Banks API, the architecture is kept very standard. This has the added advantage of lowering the barrier to understanding the code to non-Android developers.

### ViewModels and LiveData
The current official Android recommendations are used as the UI architecture: [View models](https://developer.android.com/topic/libraries/architecture/viewmodel) in combination with [LiveData](https://developer.android.com/topic/libraries/architecture/livedata).

```kotlin
class GetRecipientsViewModel() : ViewModel() {

    val uiState = MutableLiveData<GetRecipientsUiState>()

    fun doOnStart() = viewModelScope.launch {
        val recipients = webService.getRecipients()
        uiState.value = recipients.toUiState()
    }

    fun doOnRecipientSelected(recipient: RecipientItem) {
        ...
    }
}
```

Each screen consists of a `Fragment` and a `ViewModel` that holds the UI logic. This especially helps with unit testing as `ViewModels` don't have a complicated lifecycle. On top `ViewModels` even survive orientation changes, making it easier to support both landscape and portrait.

To communicate back to the `Fragment`, each `ViewModel` exposes a `LiveData` property called `uiState`. This has several advantages:

- no (implicit) link between `ViewModel` and `Fragment`
- UI only gets updated during visible lifecycle
- every update to the UI happens on the UI Thread
- the last `uiState` gets redelivered when the `Fragment` becomes visible again

In summary, the combination of `ViewModel` and `LiveData` simplifies handling the application lifecycle and unit testing.

### Navigation components
I'm a huge fan of the Android navigation components, especially how it allows to create a visual graph of the application:

[![International transfer navigation graph]({{ site.url }}{{ site.baseurl }}/img/blog/modernandroidlibraries/navigation_graph.png){: .align-center}]({{ site.url }}{{ site.baseurl }}/img/blog/modernandroidlibraries/navigation_graph_large.png)

Thanks to this library, you can very quickly get a good idea of what the application does, what the important screens are and how they are connected to each other.

### Coroutines
Thanks to the use of `suspend functions`, coroutines allow expressing asynchronous code just like normal code, even without the need for wrappers like `Future` or `Promise`. This makes them very easy to understand and reason about.

```kotlin
fun doOnStart() = viewModelScope.launch {
    val recipients = webService.getRecipients(targetCurrency)
    uiState.value = recipients.toUiState()
}
```

In the example above, the `doOnStart()` function is called from the UI Thread. But by wrapping it in `viewModelScope.launch{}`, it can suddenly do a network request using `Retrofit` and get its result directly in a variable `recipients`!

Notice how this happens without blocking the UI Thread!

e.g. `doOnStart()` returns immediately and the coroutine can directly pass the network request result (on the UI Thread!!!) to the `uiState` variable.

This very low barrier for entry made [Kotlin coroutines](https://kotlinlang.org/docs/reference/coroutines-overview.html) the best choice for multi-threading for this project.

Additionally, there are more advantages:

- built-in support in many popular libraries, such as `AndroidX`, `Retrofit`,...
- automatically cancellation thanks to structured concurrency by using `lifecycleScope` or `viewModelScope`
- very lightweight, less costly than Threads
- built-in support in the Kotlin programming language itself
- easy to test using special coroutine builders

### Dependency injection
To keep the code easy to understand, this project doesn't use any dependency injection framework. Hence the reader doesn't require prior knowledge of a specific dependency injection framework (Dagger, Koin,...), nor of DI frameworks in general.

Instead, manual dependency injection is used so dependencies can be mocked out during unit tests. While this works just as well, it does come at the price of more verbose constructors:

```kotlin
internal class QuoteViewModel(
    private val webService: QuoteWebService,
    private val sharedViewModel: SharedViewModel,
    private val customerId: Int,
    quote: QuoteDescription,
    private val navigationFactory: QuoteNavigationFactory,
    private val textProvider: TextProvider,
    private val errorConverter: ErrorConverter = ErrorConverter()
) : ViewModel() {
```

I like to stress here, that Dependency injection can be accomplished in many different ways, you don't need to use a powerful (and possibly complex) framework like Dagger. In fact, the entire Philips Hue Android app was built upon manual DI!

### Central repository
There is no singleton or central repository that saves the global state of the payments flow. Instead, `Fragments` get all dynamic information they need passed to them as arguments in an Android `Bundle`. The lack of a global state makes the entire payment flow robust against any lifecycle changes.

```kotlin
class GetRecipientsFragment : Fragment() {

    val args: GetRecipientsFragmentArgs by navArgs()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        binding = FragmentGetRecipientsBinding.inflate(inflater, container, false)

        val customerId = args.customerId
        val quoteId = args.quoteId
        val targetCurrency = args.targetCurrency

        ...

        return binding.root
    }
}
```

There is however global information that is passed into the `transferwise` module when it gets started (e.g. the URL of the backend service). This information is stored into the `Bundle` of the `InternationalTransferActivity` and passed on to the `Fragments` using the `SharedViewModel`.

```kotlin
class InternationalTransferActivity : AppCompatActivity() {

    companion object {
        fun createIntent(context: Context, config: BackendConfiguration) =
            Intent(context, InternationalTransferActivity::class.java).apply {
                putExtra("backendConfiguration", config)
            }
    }
}

```

### Modularization
The code base consists of a demo banking app module `app` and an international payments module `transferwise`. Finally, there is a library module `dynamicform` that helps render dynamic UI returned by various API endpoints.

```
.
└── app
    └── transferwise
        └── dynamicform
```

This split in just three modules helps with code readability:

- `app module`: simulates a demo banking application and doesn't contain any TransferWise reference code
- `transferwise module`: implementation of all code and screens to integrate the TransferWise for Banks API
- `dynamicform module`: reusable library that renders dynamic forms returned by the TransferWise for Banks API

Note that this project does follow my [modularization architecture]({{ site.baseurl }}{% link blog/_posts/2019-03-18-modularizationarchitecture.md %}), even though that wasn't the main goal.

### Other choices
Without going into too much depth, I'd like to shout out to some other interesting dependencies I've used:

- [View binding](https://developer.android.com/topic/libraries/view-binding) to access views from XML
- [Retrofit](https://square.github.io/retrofit/) to communicate to the RESTful API
- [Moshi](https://github.com/square/moshi) to deserialize JSON strings
- [Coil](https://github.com/coil-kt/coil) for image loading
- [Flow](https://kotlinlang.org/docs/reference/coroutines/flow.html) as a lightweight observable
- [Spotless](https://github.com/diffplug/spotless) to format the code and apply copyright headers
- [JUnit 5](https://junit.org/junit5/docs/current/user-guide/) to organize tests in nested tests
- [AssertJ](https://joel-costigliola.github.io/assertj/) to have more powerful and consistent assertions

## Wrap-up
Modern Android comes with great default choices to make Android development easier, especially thanks to `ViewModel`, `LiveData` and `Coroutines`.

You can find all source code for the TransferWise for Banks reference application on [GitHub](https://github.com/transferwise/banks-reference-android).

This series has plenty of other interesting stuff to talk about! Make sure to follow me on [Mastodon](https://androiddev.social/@Jeroenmols) to get the next post on representing UI state!
