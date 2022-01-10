---
title: "single-spa源码解析-registerApplication和start"
date: 2020-11-21T21:28:13+08:00
draft: false
---

首先将问题简化，假定主应用和子应用都已经准备好的情况下，针对应用的注册和启动这两个关键操作进行分析。

在主应用中只需要调用`registerApplication`即可注册子应用，调用`start`启动主应用。比如下面的例子

```js
// single-spa-config.js
import { registerApplication, start } from 'single-spa';

// 使用简单参数
registerApplication(
  'app2', 
  () => import('src/app2/main.js'),
  (location) => location.pathname.startsWith('/app2'),
  { some: 'value' },
);

// 使用对象参数
registerApplication({
  name: 'app1',
  app: () => import('src/app1/main.js'),
  activeWhen: '/app1',
  customProps: {
    some: 'value',
  }
);

start();
```

## registerApplication 

先让我们来看一下函数签名

```js
registerApplication(
  appNameOrConfig,
  appOrLoadApp,
  activeWhen,
  customProps
)
```

可以传四个参数，也能传递一个对象。对象参数的效果与四个参数效果一样。因为在 `registerApplication` 函数的顶部就会执行来一个序列化参数的操作，统一将参数转换成约定 `registration`。

```js
// src/application/apps.js
export function registerApplication(
  appNameOrConfig,
  appOrLoadApp,
  activeWhen,
  customProps
) {
  const registration = sanitizeArguments(
    appNameOrConfig,
    appOrLoadApp,
    activeWhen,
    customProps
  );
  ...
}
```

### 序列化参数

`sanitizeArguments`这个方法里面的逻辑不复杂，简单来说就是将各参数序列化成需要的类型。

```js
function sanitizeArguments(
  appNameOrConfig,
  appOrLoadApp,
  activeWhen,
  customProps
) {
  const usingObjectAPI = typeof appNameOrConfig === "object";

  const registration = {
    name: null,
    loadApp: null,
    activeWhen: null,
    customProps: null,
  };

  if (usingObjectAPI) {
    validateRegisterWithConfig(appNameOrConfig);
    registration.name = appNameOrConfig.name;
    registration.loadApp = appNameOrConfig.app;
    registration.activeWhen = appNameOrConfig.activeWhen;
    registration.customProps = appNameOrConfig.customProps;
  } else {

// 校验各参数类型，如果不通过就抛出错误。
    validateRegisterWithArguments(
      appNameOrConfig,
      appOrLoadApp,
      activeWhen,
      customProps
    );
    registration.name = appNameOrConfig;
    registration.loadApp = appOrLoadApp;
    registration.activeWhen = activeWhen;
    registration.customProps = customProps;
  }

  registration.loadApp = sanitizeLoadApp(registration.loadApp);
  registration.customProps = sanitizeCustomProps(registration.customProps);
  registration.activeWhen = sanitizeActiveWhen(registration.activeWhen);

  return registration;
}
```

### 将应用注入

参数序列化之后，先调用 `getAppNames` 方法检查是否存在重复注册的子应用，如果有则抛出错误

```js
if (getAppNames().indexOf(registration.name) !== -1)
  throw Error(
    formatErrorMessage(
      21,
      __DEV__ &&
      `There is already an app registered with name ${registration.name}`,
      registration.name
    )
  );
```

如果不存在重复注册的应用，接下来就将所有的应用注册到 apps 数组中，执行 `reroute()`

```js
apps.push(
  assign(
    {
      loadErrorTime: null,
      status: NOT_LOADED,
      parcels: {},
      devtools: {
        overlays: {
          options: {},
          selectors: [],
        },
      },
    },
    registration
  )
);

if (isInBrowser) {
  ensureJQuerySupport();
  reroute();
}
```

## start

因为`start`方法和`registeApplication`方法最后都调用了`reroute`，`start`的代码比较少，所以先介绍start方法。

```js
// src/start.js
import { reroute } from "./navigation/reroute.js";
import { formatErrorMessage } from "./applications/app-errors.js";
import { setUrlRerouteOnly } from "./navigation/navigation-events.js";
import { isInBrowser } from "./utils/runtime-environment.js";

let started = false;

export function start(opts) {
  started = true;
  if (opts && opts.urlRerouteOnly) {
    setUrlRerouteOnly(opts.urlRerouteOnly);
  }
  if (isInBrowser) {
    reroute();
  }
}

export function isStarted() {
  return started;
}

if (isInBrowser) {
  setTimeout(() => {
    if (!started) {
      console.warn(
        formatErrorMessage(
          1,
          __DEV__ &&
            `singleSpa.start() has not been called, 5000ms after single-spa was loaded. Before start() is called, apps can be declared and loaded, but not bootstrapped or mounted.`
        )
      );
    }
  }, 5000);
}
```

首先申明了一个 `started` 变量作为应用启动的标记，默认是 `false`，表示未启动。`isStarted()`返回这个标记，用来判断当前应用的状态。

start`方法接受一个options参数，目前只有一个配置：urlRerouteOnly。默认是false。如果设置成true，调用history.pushState() 和 history.replaceState() 时不会触发 reroute，除非客户端路由真的发生了变化。设置为true时在某些时候会有更好的性能。

`urlRerouteOnly`会在navigation-events中使用，后面再讲。

在文件的最后作了一个超时检测，在代码执行5s后`isStarted`状态依旧是`false`时抛出一个警告。

接下来看一下核心方法Reroute

## reroute

默认设置 `appChangeUnderway`为`false`。函数每次执行时都会判断`appChangeUnderway`。`appChangeUnderway`为`true`时表示当前有`reroute`的任务正在执行(reroute被调用了并且其中的promsie任务还没结束），此时返回一个Promise，内部将resolve，reject和reoute的第二个参数一起 push 到`peopleWaitingOnAppChange`中，等当前reroute对应的任务执行完成之后在作为 `pendingPromise` 参数继续执行。

```js
if (appChangeUnderway) {
  return new Promise((resolve, reject) => {
    peopleWaitingOnAppChange.push({
      resolve,
      reject,
      eventArguments,
    });
  });
}
```

但是`appChangeUnderway`初始值是`false`，在什么时候被修改成true的呢？接着往下看。

调用`getAppChanges()`方法将注册的应用按照当前各自的生命周期分组:

1. 加载失败（LOAD_ERROR) 的app放入appToUnload
2. 未下载（NOT_LOADED)和下载中（LOADING_SOURCE_CODE)的app放入 appsToLoad
3. 未引导（NOT_BOOTSTRAPPED)和未挂载（NOT_MOUNTED)的app放入appsToUnload或者appsToMount
4. 已挂载（MOUNTED)的app放入appsToUnmount

未引导（NOT_BOOTSTRAPPED)和未挂载（NOT_MOUNTED)的app会多加一个判断，当前window.location匹配activeWhen规则时放入appToMount数组，否则放入appsToUnload。

分组完毕之后，判断前文提到的started状态。如果started为true，将appChangeUnderway也设置为true，然后将app按照toUnload，toLoad,toUnmount和toMount的分组数组合并在一起，保存到appsThatChanged数组中。最后调用 performAppChanges 方法，返回执行的结果。如果started为false，将ToLoad的app赋值给appsThatChanged，然后调用loadApps方法，并返回执行的结果。

### loadApps 和 performAppChanges

#### loadApps 

先来看较为简单的loadApps()方法。

```js
function loadApps() {
  return Promise.resolve().then(() => {
    const loadPromises = appsToLoad.map(toLoadPromise);

    return (
      Promise.all(loadPromises)
        .then(callAllEventListeners)
        // there are no mounted apps, before start() is called, so we always return []
        .then(() => [])
        .catch((err) => {
          callAllEventListeners();
          throw err;
        })
    );
  });
}
```

`loadApps`只有在启动的时候会调用一次，此时`started` 为 `false`。这个方法具体做了什么事情呢？

遍历appsToLoad中的app，最后返回一个Promise数组，通过Promise.all()一次性全部调用将app的状态设置为 `LOADING_SOURCE_CODE`，然后检查参数中的生命周期函数，将这些函数挂载到app上。然后再调用 `callAllEventListeners` 方法，劫持 `hashchange` 和`popstate`这两个事件。

#### performAppChanges

如果应用已经启动，即 `started`为 `true` 时，逻辑会进入到 `performAppChanges` 方法，这个方法有点长。

```js
function performAppChanges() {
  return Promise.resolve().then(() => {
    // https://github.com/single-spa/single-spa/issues/545
    window.dispatchEvent(
      new CustomEvent(
        appsThatChanged.length === 0
          ? "single-spa:before-no-app-change"
          : "single-spa:before-app-change",
        getCustomEventDetail(true)
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        "single-spa:before-routing-event",
        getCustomEventDetail(true, { cancelNavigation })
      )
    );

    if (navigationIsCanceled) {
      window.dispatchEvent(
        new CustomEvent(
          "single-spa:before-mount-routing-event",
          getCustomEventDetail(true)
        )
      );
      finishUpAndReturn();
      navigateToUrl(oldUrl);
      return;
    }

    const unloadPromises = appsToUnload.map(toUnloadPromise);

    const unmountUnloadPromises = appsToUnmount
      .map(toUnmountPromise)
      .map((unmountPromise) => unmountPromise.then(toUnloadPromise));

    const allUnmountPromises = unmountUnloadPromises.concat(unloadPromises);

    const unmountAllPromise = Promise.all(allUnmountPromises);

    unmountAllPromise.then(() => {
      window.dispatchEvent(
        new CustomEvent(
          "single-spa:before-mount-routing-event",
          getCustomEventDetail(true)
        )
      );
    });

    /* We load and bootstrap apps while other apps are unmounting, but we
      * wait to mount the app until all apps are finishing unmounting
      */
    const loadThenMountPromises = appsToLoad.map((app) => {
      return toLoadPromise(app).then((app) =>
        tryToBootstrapAndMount(app, unmountAllPromise)
      );
    });

    /* These are the apps that are already bootstrapped and just need
      * to be mounted. They each wait for all unmounting apps to finish up
      * before they mount.
      */
    const mountPromises = appsToMount
      .filter((appToMount) => appsToLoad.indexOf(appToMount) < 0)
      .map((appToMount) => {
        return tryToBootstrapAndMount(appToMount, unmountAllPromise);
      });
    return unmountAllPromise
      .catch((err) => {
        callAllEventListeners();
        throw err;
      })
      .then(() => {
        /* Now that the apps that needed to be unmounted are unmounted, their DOM navigation
          * events (like hashchange or popstate) should have been cleaned up. So it's safe
          * to let the remaining captured event listeners to handle about the DOM event.
          */
        callAllEventListeners();

        return Promise.all(loadThenMountPromises.concat(mountPromises))
          .catch((err) => {
            pendingPromises.forEach((promise) => promise.reject(err));
            throw err;
          })
          .then(finishUpAndReturn);
      });
  });
}
```

可以看到，这个方法也是放在一个 `Promise.resolve()`中。首先触发了一些自定义事件，然后根据应用状态分别创建了对应取消操作的Promise数组。需要被移除的应用 `appToUnLoad`创建了`unLoadPromises`，需要被卸载的应用`appsToUnmount`先创建卸载的`toUnmountPromise`，再创建 `unLoadPromise`。最后将所有的Promise合并成一个数组通过Promise.all执行，执行完成之后触发`single-spa:before-mount-routing-event`事件。

至此，需要unmount和unload的app执行过程都结束了，接下来如法炮制开始load和mount对应的应用。使用 `appToLoad` 和 `appToMount` 创建一个Promise数组，通过Promise.all执行。在app对应状态变更完成之后，调用 `tryToBootstrapAndMount`完成引导并挂载应用。

```js
function tryToBootstrapAndMount(app, unmountAllPromise) {
  if (shouldBeActive(app)) {
    return toBootstrapPromise(app).then((app) =>
      unmountAllPromise.then(() =>
        shouldBeActive(app) ? toMountPromise(app) : app
      )
    );
  } else {
    return unmountAllPromise.then(() => app);
  }
}
```

引导并挂载成功之后触发一次`single-spa:routing-event`事件，根据变化的app数量决定触发`single-spa:no-app-change`事件还是`single-spa:app-change`事件。最后将`appChangeUnderway`设置为`false`，保证后续的reroute()调用能够执行，此时也标志着当前这次reroute调用的执行已结束，最后检查当前是否还有pengding中的任务，有的话继续执行。

```js
if (peopleWaitingOnAppChange.length > 0) {
  /* While we were rerouting, someone else triggered another reroute that got queued.
    * So we need reroute again.
    */
  const nextPendingPromises = peopleWaitingOnAppChange;
  peopleWaitingOnAppChange = [];
  reroute(nextPendingPromises);
}
```