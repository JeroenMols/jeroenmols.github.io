---
title: Feature flags - A successful architecture
published: false
header:
  teaser: img/blog/featureflagarchitecture/featureflagarchitecture.jpg
  imgcredit: Background photo by Miguel Á. Padriñán (from Pexels), https://www.pexels.com/photo/defocused-image-of-lights-255379/, cropped with app screenshot on top
tags:
  - architecture
  - android
  - firebase
  - feature flags
---
Now that we know how feature flags can help us release faster, it's time to dive into the actual implementation details. How can we easily define feature flags? How to configure them both locally as remotely? And use them in our testing?

This post will present a simple, powerful architecture to manage feature flags and comes with a full example on Github.

> This blog post is part of a series on feature flags:
- Part 1: [Why you should care]({{ site.baseurl }}{% link blog/_posts/2019-08-13-featureflags.md %})
- Part 2: How to use
- Part 3: A successful architecture

## Creating new feature flags
As discussed in [part 1]({{ site.baseurl }}{% link blog/_posts/2019-08-13-featureflags.md %}), the easier it is to add feature flags, the more likely developers will use the system. At its core a `Feature` is something very simple:

```kotlin
interface Feature {
    val key: String
    val title: String
    val explanation: String
    val defaultValue: Boolean
}
```

It needs to have a unique `key` to reference it on your remote feature flagging tool. A `title` and `description` to help understand what it is all about. And optionally a default value, which is handy if you're using both `FeatureFlags` and `TestSettings`.

This interface can now be implemented by both a `FeatureFlag` and `TestSetting` enum:

```kotlin
enum class FeatureFlag(
        override val key: String,
        override val title: String,
        override val explanation: String,
        override val defaultValue: Boolean = true
) : Feature {
    DARK_MODE("feature.darkmode", "Dark theme", "Enabled dark mode")
}
```

```kotlin
enum class TestSetting(
        override val key: String,
        override val title: String,
        override val explanation: String,
        override val defaultValue: Boolean = false
) : Feature {
    USE_DEVELOP_PORTAL("testsetting.usedevelopportal", "Development portal", "Use developer REST endpoint"),
    DEBUG_LOGGING("testsetting.debuglogging", "Enable logging", "Print all app logging to console", defaultValue = true)
}
```

Note how a `FeatureFlag` is on by default so that it is immediately visible in developer builds, whereas `TestSettings` are off by default as they usually put the app in a specific condition to help with testing.

Both `FeatureFlag` and `TestSetting` are enums so that when you create a `when` statement over them, the Kotlin compiler can force you to handle each case explicitly. At the same time, they are not sealed classes, because we need to be able to enumerate all items, later on, to automatically generate a UI from it. (There is no way to ask a sealed class to list all it's subclasses)

> Mission accomplished: adding a new `FeatureFlag`/`TestSetting` is as easy as adding a one-liner!

## Consuming feature flags
Next, our app needs to be able to read out what value (true/false) a `Feature` is currently set to. This can be done by requesting one of the `FeatureFlagProviders` for the current value:

```kotlin
interface FeatureFlagProvider {
    val priority: Int
    fun isFeatureEnabled(feature: Feature): Boolean
    fun hasFeature(feature: Feature): Boolean
}
```

This interface will have several implementations with different priorities attached to it so that they can override each other. (more on that later)

Note how implementations don't need to provide a value for every `Feature`! This has two benefits:

- you don't accidentally rely on build-in defaults of the feature flag tool you are using (e.g. Firebase remote config returns false when it doesn't have a value)
- you can have a chain of providers (e.g. we can have a feature flag that is only locally available, not remotely).

The `RuntimeBehavior` links all `FeatureFlagProviders` together and exposes the API that should be used from within the application:

```kotlin
object RuntimeBehavior {

    @VisibleForTesting
    internal val providers = CopyOnWriteArrayList<FeatureFlagProvider>()

    @JvmStatic
    fun isFeatureEnabled(feature: Feature): Boolean {
        return providers.filter { it.hasFeature(feature) }
                .sortedBy(FeatureFlagProvider::priority)
                .firstOrNull()
                ?.isFeatureEnabled(feature)
                ?: feature.defaultValue
    }

    @JvmStatic
    fun addProvider(provider: FeatureFlagProvider) = providers.add(provider)
}
```

Note how it takes all `FeatureFlagProviders`, removes those that don't provide a value for the `Feature` and takes the value of the first one or the default value if no provider has any.

Thanks to all of this we can now call from anywhere in the app:

```kotlin
if (RuntimeBehavior.isFeatureEnabled(FeatureFlag.DARK_MODE)) {
  // set dark theme
} else {
  // set light them
}
```

> Consuming `FeatureFlag`/`TestSetting` is as easy as asking the `RuntimeBehavior`

## Providing feature flag values
Let's have a look at the several different `FeatureFlagProviders`, why we need them and how they work.

### RuntimeFeatureFlagProvider
This provider only exists in the debug version of the app and allows to dynamically turn features on or off. It does this by keeping a `SharedPreferences` internally where it automatically stores a value for each `Feature` using its key.

```kotlin
class RuntimeFeatureFlagProvider : FeatureFlagProvider {

    private val preferences: SharedPreferences

    override val priority = MEDIUM_PRIORITY

    constructor(applicationContext: Context) {
        preferences = applicationContext.getSharedPreferences("runtime.featureflags", Context.MODE_PRIVATE)
    }

    override fun isFeatureEnabled(feature: Feature): Boolean =
        preferences.getBoolean(feature.key, feature.defaultValue)

    override fun hasFeature(feature: Feature): Boolean = true

    fun setFeatureEnabled(feature: Feature, enabled: Boolean) =
        preferences.edit().putBoolean(feature.key, enabled).apply()
}
```

Notice how this provider has a public API `setFeatureEnabled` to change the current value of a `Feature` and how every `Feature` is always configurable at runtime. (more on how that works later on)

> The `RuntimeFeatureFlagProvider` allows to locally turn any `FeatureFlag`/`TestSetting` on or off.

### StoreFeatureFlagProvider
This provider only exists in the release version of the app and defines the baseline of what `Features` are on or off. `TestSettings` aren't exposed in the release version of an app and are always off.

```kotlin
class StoreFeatureFlagProvider : FeatureFlagProvider {

    override val priority = MIN_PRIORITY

    @Suppress("ComplexMethod")
    override fun isFeatureEnabled(feature: Feature): Boolean {
        if (feature is FeatureFlag) {
           // No "else" branch here -> choosing the default option for release must be an explicit choice
            return when (feature) {
                DARK_MODE -> false
            }
        } else {
            // TestSettings should never be shipped to users
            return when (feature as TestSetting) {
                else -> false
            }
        }
    }

    override fun hasFeature(feature: Feature): Boolean = true
}
```

Notice how you must provide an explicit value for every feature toggle! This is because you never want to accidentally (=implicitly) ship an unfinished feature to users.

Finally, this makes it very easy to check what features are on or off in any given app release. And since all of this is just Kotlin code, it's easy to write a script to generate a release report with what feature toggles exist and their value.

> The `StoreFeatureFlagProvider` defines for every `Feature` whether it is on or off in the release build

### FirebaseFeatureFlagProvider
One of the most interesting things about `FeatureFlags` is that you can gradually roll them out using a remote feature flagging tool. We'll look at [Firebase Remote Config](https://firebase.google.com/docs/remote-config) as an example, but this architecture allows to use any tool.

```kotlin
class FirebaseFeatureFlagProvider(private val isDevModeEnabled: Boolean) : FeatureFlagProvider {
    private val remoteConfig: FirebaseRemoteConfig = FirebaseRemoteConfig.getInstance()

    init {
        val configSettings = FirebaseRemoteConfigSettings.Builder().setDeveloperModeEnabled(isDevModeEnabled).build()
        remoteConfig.setConfigSettings(configSettings)
    }

    override val priority: Int = MAX_PRIORITY

    override fun isFeatureEnabled(feature: Feature): Boolean =
        remoteConfig.getBoolean(feature.key)

    override fun hasFeature(feature: Feature): Boolean {
        return when (feature) {
            FeatureFlag.DARK_MODE -> true
            else -> false
        }
    }
}
```

The most important thing to note here is that the `FirebaseFeatureFlagProvider` has the maximum priority, which means it takes precedence over any other `FeatureFlagProvider`.

However, it doesn't provide a value for all feature flags! That is because a `FeatureFlag` should only be made available to the remote feature flag tool once development for the feature is done. Otherwise, someone could accidentally expose an unfinished/broken feature to users.

Typically the lifecycle of a `FeatureFlag` is:

- Development started on new feature -> `FeatureFlag` added
- While development ongoing -> `FeatureFlag` locally available
- Development done
  - Either toggle `FeatureFlag` in `StoreFeatureFlagProvider` and roll it out to all users at once. (typically if you have a marketing campaign attached to the feature)
  - Either add the `FeatureFlag` to the `FirebaseFeatureFlagProvider` and gradually roll it out
- Rollout done -> remove `FeatureFlag` and clean up unused code

> The `RemoteFeatureFlagProvider` allows to gradually roll out finished features to users

### How the different providers work together
Whenever the `RuntimeBehavior` is initialized, it will initialize all providers:

```kotlin
object RuntimeBehavior {
    ...

    @JvmStatic
    fun initialize(context: Context, isDebugBuild: Boolean) {
        if (isDebugBuild) {
            val runtimeFeatureFlagProvider = RuntimeFeatureFlagProvider(context)
            addProvider(RuntimeFeatureFlagProvider(context))
            if (runtimeFeatureFlagProvider.isFeatureEnabled(TestSetting.DEBUG_FIREBASE)) {
                addProvider(FirebaseFeatureFlagProvider(true))
            }
        } else {
            addProvider(StoreFeatureFlagProvider())
            addProvider(FirebaseFeatureFlagProvider(false))
        }
    }
}
```

For debug builds, usually only the `RuntimeFeatureFlagProvider` is enabled, but optionally you can also enable the `FirebaseFeatureFlagProvider` so the remote feature flags can be tested.

In release, however, the `FeatureFlag` value is taken from Firebase when the `FeatureFlag` was made remotely available, otherwise, the `StoreFeatureFlagProvider` is used.

![Different FeatureFlagProviders and their priority for every build type]({{ site.url }}{{ site.baseurl }}/img/blog/featureflagarchitecture/featureflagprovider_priority.png)

## Showing the flags in a UI
Within the developer version of our app, we want to be able to both see the status of all `Features` and `TestSettings` and also toggle each one on or off. Basically, we want to automatically generate a UI like this:

![Test settings activity to dynamically configure behavior in the app]({{ site.url }}{{ site.baseurl }}/img/blog/featureflagarchitecture/testsettings.png)

To show all of the `Features`, we can simply define a custom `RecyclerView` that displays an `Array` of `Features`.

```kotlin
private class FeatureFlagAdapter<T : Feature>(
    val items: Array<T>,
    val provider: FeatureFlagProvider,
    val checkedListener: Function2<Feature, Boolean, Unit>
) : RecyclerView.Adapter<FeatureFlagViewHolder<T>>() {

    override fun getItemCount(): Int = items.size

    override fun onBindViewHolder(holder: FeatureFlagViewHolder<T>, position: Int) =
        holder.bind(items[position])

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FeatureFlagViewHolder<T> {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.item_featureflag, parent, false)
        return FeatureFlagViewHolder(itemView, provider, checkedListener)
    }
}
```

Here we leverage the fact that `FeatureFlags` and `TestSettings` are enums and pass the `FeatureFlagAdapter` either `FeatureFlag.values()` or `TestSetting.values()` so it can generate the entire list. Additionally we hand it the `RuntimeFeatureFlagProvider` to look up the current values of each `Feature` and a listener to listen when an item gets enabled/disabled.

The `FeatureFlagViewHolder` simply binds the properties of the `Feature` to the view, requests the current value from the `FeatureFlagProvider` and connects a listener to the switch:

```kotlin
private class FeatureFlagViewHolder<T : Feature>(
    view: View,
    val provider: FeatureFlagProvider,
    val checkedListener: Function2<Feature, Boolean, Unit>
) : RecyclerView.ViewHolder(view) {

    fun bind(feature: T) {
        title.text = feature.title
        description.text = feature.explanation
        switch.isChecked = provider.isFeatureEnabled(feature)
        switch.setOnCheckedChangeListener { switch, isChecked ->
                if (switch.isPressed) checkedListener.invoke(feature, isChecked) }
    }
}
```

The listener passed into the `FeatureFlagAdapter` simply changes the value of the `Feature` on the `RuntimeFeatureFlagProvider` and show a `SnackBar` to restart the app so the new value is properly applied:

```kotlin
val checkedListener = { feature: Feature, enabled: Boolean ->
    runtimeFeatureFlagProvider.setFeatureEnabled(feature, enabled)
    requestRestart()
}
```

```kotlin
private fun requestRestart() {
    val msg = "In order for changes to reflect please restart the app via settings"
    Snackbar.make(view!!, msg, Snackbar.LENGTH_INDEFINITE)
        .setActionTextColor(Color.RED)
        .setAction("Force Stop") { exitProcess(-1) }
        .show()
}
```

All that's left is wrapping all this into a `TestSettingsActivity` with a separate launch icon and move these UI classes to the debug build type (or a module that is only included as a debug dependency) so the `Activity` isn't available in release builds.

Now we have a very powerful, easy to use UI framework to dynamically configure the behavior of our app. By just adding a single line `FeatureFlag` or `TestSetting` it instantly shows up in our UI.

> Debug builds have a UI to toggle all `FeatureFlags` and `TestSettings` on or off that gets fully automatically generated.

Note that we use a `RecyclerView` instead of a `PreferenceFragmentCompat` which makes the UI looks inconsistent for a settings screen. We do this because the androidx preference library is optimized for showing preferences defined in XML and connecting them to shared preferences. Whereas we want to show preferences defined in code and connect them to a `FeatureFlagProvider`.

## Remote feature flags
Whilst talking about the `FirebaseFeatureFlagProvider` before, there is one important aspect that we didn't cover: how to refresh the local `FeatureFlag` cache with new remote values. Some feature flag tools do that for you automatically, but for others (like Firebase Remote Config), you need to trigger that process manually.

A way to make that fit into our architecture is to define an additional interface `RemoteFeatureFlagProvider` that every `FeatureFlagProvider` for a remote tool should implement.

```kotlin
interface RemoteFeatureFlagProvider {
    fun refreshFeatureFlags()
}
```

Now we just need to expand the `FirebaseFeatureFlagProvider` with this interface and implement `refreshFeatureFlags`:

```kotlin
class FirebaseFeatureFlagProvider(private val isDevModeEnabled: Boolean) :
    FeatureFlagProvider, RemoteFeatureFlagProvider {
    ...

    override fun refreshFeatureFlags() {
        remoteConfig.fetch(getCacheExpirationSeconds(isDevModeEnabled)).addOnCompleteListener { task ->
            if (task.isSuccessful) {
                // After config data is successfully fetched, it must be activated before newly fetched values are returned.
                remoteConfig.activateFetched()
            }
        }
    }

    private fun getCacheExpirationSeconds(isDevModeEnabled: Boolean): Long =
        if (isDevModeEnabled) ONE_SECOND else ONE_HOUR
}
```

Then we expose a new function on the `RuntimeBehavior` to refresh all remote feature flag providers at the same time whenever you want in your app lifecycle.

```
object RuntimeBehavior {
    fun refreshFeatureFlags() {
        providers.filter { it is RemoteFeatureFlagProvider }.forEach { (it as RemoteFeatureFlagProvider).refreshFeatureFlags() }
    }
}
```

Since Firebase Remote Config internally throttles refresh requests, it's safe to call the `refreshFeatureFlags` method on every app resume.

> The `RemoteFeatureFlagProvider` offers the generic ability to refresh values for all remote feature flagging tools.

## Testing feature flags
During automated unit or espresso tests, you sometimes need to enable/disable particular features. Even that is simple with this architecture, just make a `TestFeatureFlagProvider`:

```kotlin
object TestFeatureFlagProvider : FeatureFlagProvider {

    private val features = HashMap<Feature, Boolean>()

    override val priority = TEST_PRIORITY

    override fun isFeatureEnabled(feature: Feature): Boolean = features[feature]!!

    override fun hasFeature(feature: Feature): Boolean = features.containsKey(feature)

    fun setFeatureEnabled(feature: Feature, enabled: Boolean) = features.put(feature, enabled)

    fun clearFeatures() = features.clear()
}
```

With its `TEST_PRIORITY` it takes precedence over all other `FeatureFlagProviders` and exposes an API to dynamically enable/disable features and to clear its state after each test.

```kotlin
@Test
fun withFeatureFlags() {
    TestFeatureFlagProvider.enableFeature(DARK_MODE)

    // do test here
}

@After
fun tearDown() {
    TestFeatureFlagProvider.clearFeatures()
}
```

And this extra provider gets added during the debug initialization in the `RuntimeBehavior`:

```kotlin
object RuntimeBehavior {

    @VisibleForTesting
    internal val providers = CopyOnWriteArrayList<FeatureFlagProvider>()

    fun initialize(context: Context, isDebugBuild: Boolean) {
        if (isDebugBuild) {
            val runtimeFeatureFlagProvider = RuntimeFeatureFlagProvider(context)
            addProvider(runtimeFeatureFlagProvider)
            addProvider(TestFeatureFlagProvider)
            if (runtimeFeatureFlagProvider.isFeatureEnabled(TestSetting.DEBUG_FIREBASE)) {
                addProvider(FirebaseFeatureFlagProvider(true))
            }
        } else {
            addProvider(StoreFeatureFlagProvider())
            addProvider(FirebaseFeatureFlagProvider(false))
        }
    }
}
```

> The `TestFeatureFlagProvider` allows to turn `FeatureFlags` or `TestSettings` on during unit/instrumentation tests.

## Putting it all together
When we look at all of the classes involved we get the following overview:

![Feature flag architecture]({{ site.url }}{{ site.baseurl }}/img/blog/featureflagarchitecture/featureflag_architecture.png)

While that might seem a bit overwhelming, it consists of a lot of very small classes that are very easy to understand:

- `RuntimeBehavior`: to easily consume feature flags
- `FeatureFlagProvider`: to provide values during debug, release or testing
- `Feature`: one-line definition of `FeatureFlags` or `TestSettings`

And based on these classes, a local UI is automagically generated to toggle the `Features` on/off in debug builds!

I've created a full Github sample project where you can see all code in action [here](https://github.com/JeroenMols/FeatureFlagExample)

## Bonus
When combining this Feature Flag architecture with my previous [modularization architecture]({{ site.baseurl }}{% link blog/_posts/2019-03-18-modularizationarchitecture.md %}), all UI classes can be moved to their own feature module `test-settings` that is only included into the `app` module for debug builds:

```groovy
dependencies {
    debugImplementation project(':features:test-settings')
}
```

This does require all feature flag business logic to move to a library module `feature-flags`, but the end result is a very clean!

## Wrap-up
With just a few simple classes we've been able to build a powerful feature flagging architecture. In that it's very easy to add new features, there is support for both local and remote feature flags, feature flags are testable and a local UI for enabling/disabling feature flags is automatically generated.

If you've made it this far you should probably follow me on {% include link_twitter.html %}. Feel free leave a comment below!
