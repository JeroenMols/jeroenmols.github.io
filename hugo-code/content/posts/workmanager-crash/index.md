---
title: The curious case of crashing Workers
published: true
header:
  teaser: img/blog/workmanager-crash/workmanager-crash.jpg
  imgcredit: Photo by Markus Spiske from Unsplash, https://unsplash.com/photos/8CWoXxaqGrs,
    cropped and resized
tags:
- workmanager
- crash
date: '2022-04-27'
---

WorkManager is great to schedule background work on Android. However, since scheduled work lives outside of the app lifecycle, you might run into unexpected crashes.

Read on to learn why and how to prevent this.

## How to crash WorkManager
Reading [the documentation](https://developer.android.com/topic/libraries/architecture/workmanager), it is clear that `WorkManager` is a worry-free solution to background work:

> WorkManager is the recommended solution for persistent work. Work is persistent when it remains scheduled through app restarts and system reboots.

That's very neat!

So if we schedule some work, for instance upload a crash:

```kotlin
val workerClass = CrashUploadWorker::class.java
WorkManager.getInstance(application)
    .enqueue(OneTimeWorkRequest.Builder(workerClass).build())
```

We can be sure that WorkManager will handle it for us, even when the app closes it self immediately after the crash.

However, `WorkManager` assumes that the `Worker` class will always exist in our application. So if we ship a new version of our application that either:

- removes the `CrashUploadWorker`
- renames the `CrashUploadWorker` to `CrashReportWorker`
- moves the `CrashUploadWorker` to a new package

We might get a `ClassNotFoundException` crash after installing the update!

```
java.lang.Error: java.lang.ClassNotFoundException: com.example.CrashUploadWorker
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1119)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:588)
        at java.lang.Thread.run(Thread.java:818)
```

This happens, because `WorkManager` lives in a separate process (Google Play Services) and will always try to complete its work. It will try to instantiate `CrashUploadWorker`, but that no longer exists in our application.

Unfortunately [I had to learn this the hard way](https://github.com/plaid/plaid-link-android/issues/201).

> Notice the usage of "might": a crash isn't guaranteed and will only happen if there was unfinished work pending while the app got updated.

## How not to crash WorkManager
The first thing you can try is to cancel all pending work for the `Worker` you removed/renamed:

```kotlin
workManager.cancelAllWorkByTag("crash_upload")
```

This approach can be subject to race conditions as `Workmanager` might still retry to execute the scheduled work before you had the chance to cancel. (depending on where you call this)

Another downside of this approach is that this will drop scheduled work, causing data loss. Depending on your unique use case that may or may not be acceptable.

An alternative approach is to keep the original `CrashUploadWorker` class and modify that to handle the changing requirements:

- drop the work (empty implementation)
- migrate and schedule the new worker class

```kotlin
internal class CrashUploadWorker(
  appContext: Context,
  workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

  override suspend fun doWork(): Result {
    // Schedule new worker class
    val workerClass = CrashReportWorker::class.java
    WorkManager.getInstance(appContext)
      .enqueue(OneTimeWorkRequest.Builder(workerClass).build())
    return Result.success()
  }
}
```

Once you stop scheduling work using the old `Worker`, you can mark it to be removed after all your customers have updated and migrated.

Finally, here's what a migration plan could look like:

- Release 1: Add new worker and migrate all work
- Release 5: Cancel all remaining work using old `Worker` (causes data loss!)
- Release 10: Remove old `Worker` (causes crashes!)

## Using WorkerFactory
An alternative approach is to provide a custom `WorkerFactory` to handle the migration to the new class.

> Thanks to [Pietro Maggi](https://twitter.com/pfmaggi) and Steffan Davies for suggesting this approach

To do so, first [disable automatic `WorkManager` initialization](https://developer.android.com/topic/libraries/architecture/workmanager/advanced/custom-configuration#on-demand):

```xml
<provider
   android:name="androidx.startup.InitializationProvider"
   android:authorities="${applicationId}.androidx-startup"
   android:exported="false"
   tools:node="merge">
   <!-- If you are using androidx.startup to initialize other components -->
   <meta-data
       android:name="androidx.work.WorkManagerInitializer"
       android:value="androidx.startup"
       tools:node="remove" />
</provider>
```

Then initialize the `WorkManager` in your `Application#onCreate` or `ContentProvider`:

```kotlin
val configuration = Configuration.Builder()
    .setWorkerFactory(MigrateWorkerFactory())
    .build()
WorkManager.initialize(appContext, configuration)
```

And create your own [`WorkerFactory`](https://developer.android.com/reference/androidx/work/WorkerFactory) that schedules the new worker:

```kotlin
class MigrateWorkerFactory() : WorkerFactory() {

  override fun createWorker(
    appContext: Context,
    workerClassName: String,
    workerParameters: WorkerParameters
  ): ListenableWorker? {
    if (workerClassName = "com.example.CrashUploadWorker") {
      return CrashReportWorker(appContext, workerParameters)
    }
    ...
  }
}
```

This has the upside of not needing to keep the old `Worker` class around, but comes with some extra complexity of manual `WorkManager` initialization.

## Wrap-up
`WorkManager` is a very handy tool to handle background work, but be careful with removing or renaming `Workers`.

If you've made it this far you should probably follow me on [Mastodon](https://androiddev.social/@Jeroenmols). Feel free to leave a comment below!
