---
title: Lettura开发日志-添加快捷键操作
categories:
  - 技术应用
date: 2023-04-20T14:00:00.000+08:00
tags:
  - 笔记
  - Rust
  - Tauri
draft: false
---

[Lettura](https://github.com/zhanglun/lettura) 是一个开源的RSS阅读器，是我的开源项目。目前还在开发中，但是已经发布了测试版本，欢迎下载[https://github.com/zhanglun/lettura/releases](https://github.com/zhanglun/lettura/releases) 体验。


在现代应用程序中，快捷键操作是提高用户体验和生产力的重要组成部分。在我开发的基于Tauri的桌面RSS阅读器Lettura中，添加了全局快捷键功能，以便用户可以更快速、更方便地操作应用程序。在本文中，我将分享添加全局快捷键操作的原因、实现快捷键操作的方式、使用React Hook实现全局快捷键功能、提供的快捷操作以及未来的增加操作。最后，我将介绍如何实现用户自定义修改快捷键。


## 添加快捷键操作的原因


Lettura是一个基于Tauri的桌面RSS阅读器，使用Web技术开发。在开发过程中，我发现用户经常需要快速执行某些常见操作，如切换到下一篇文章、标记文章为已读或未读、刷新订阅等。为了提高用户体验和生产力，我决定添加全局快捷键功能，以便用户可以更快速、更方便地执行这些常见操作。


在Web开发中可以使用JavaScript事件监听器：我们可以使用JavaScript监听键盘事件，并在按下特定键组合时触发相应的操作。这种方式的好处是它很简单，不需要任何额外的库或框架。但是，它的缺点是它只能在应用程序处于活动状态时工作，并且容易与其他应用程序的快捷键冲突。


如果我们正在使用Electron框架，我们可以使用Electron的remote模块来注册全局快捷键。这种方式的好处是它可以在应用程序处于非活动状态时工作，并且不会与其他应用程序的快捷键冲突。但是，这种方式只适用于Electron应用程序，并且在Tauri应用程序中不适用。


Tauri 提供了一个全局快捷键 API，可以让开发者在应用程序中注册全局快捷键。在应用程序启动时，可以使用 Tauri API 将需要的快捷键与对应的操作绑定起来。这种方式的好处是可以在应用程序的任何地方使用快捷键，而不需要在具体的组件中为每个组件单独注册快捷键。


Tauri API 还提供了监听键盘事件的功能，可以使用它来实现快捷键操作。在应用程序中，可以使用 Tauri API 监听键盘事件，当用户按下特定的键时，执行相应的操作。这种方式的好处是可以在应用程序的任何组件中使用快捷键，而不需要为每个组件单独注册快捷键。


在Tauri中还可以注册菜单项快捷键。在应用程序中，可以使用 Tauri API 将快捷键与菜单项绑定起来，当用户按下特定的快捷键时，执行对应的菜单项操作。这种方式的好处是可以为应用程序的菜单项注册快捷键，提高用户体验。


### 我是怎么做的


在Lettura中，我使用了React Hook来实现全局快捷键功能。具体来说，我使用了useEffect Hook来监听键盘事件，并在按下特定键组合时执行相应的操作。以下是实现全局快捷键的代码片段：


```javascript
import { useEffect, useRef } from "react";

type ShortcutCallback = (event: KeyboardEvent) => void;

type ShortcutEntry = {
  keys: string | string[];
  callback: ShortcutCallback;
  context?: any;
};

type ShortcutMap = Map<string, ShortcutEntry>;

export const useShortcut = () => {
  const shortcutsRef = useRef<ShortcutMap>(new Map());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = getShortcut(event);

      if (shortcut) {
        const matchedShortcut = shortcutsRef.current.get(shortcut);

        if (matchedShortcut) {
          event.preventDefault();
          const { callback, context } = matchedShortcut;
          callback.call(context, event);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function normalizeKey(key: string) {
    const isUpperCase = key === key.toUpperCase() && key !== key.toLowerCase();

    return isUpperCase ? `_${key.toLowerCase()}` : key.toLowerCase();
  }

  function getShortcut(event: KeyboardEvent) {
    const parts = [];

    // if (event.ctrlKey) parts.push('ctrl');
    // if (event.shiftKey) parts.push('shift');
    // if (event.altKey) parts.push('alt');

    parts.push(normalizeKey(event.key));

    return parts.join("+");
  }

  function registerShortcut(
    shortcut: string | string[],
    callback: ShortcutCallback,
    context?: any,
  ) {
    shortcut = Array.isArray(shortcut) ? shortcut : [shortcut];
    shortcut.forEach((key) => {
      shortcutsRef.current.set(normalizeKey(key), {
        keys: shortcut,
        callback,
        context,
      });
    });
  }

  function unregisterShortcut(shortcut: string | string[]) {
    shortcut = Array.isArray(shortcut) ? shortcut : [shortcut];
    shortcut.forEach((key) => {
      shortcutsRef.current.delete(normalizeKey(key));
    });
  }

  return { registerShortcut, unregisterShortcut };
};
```


上面的代码是一个 React 自定义 Hook，名为 `useShortcut`。它提供了一种简单的方式来注册和注销快捷键，并在快捷键按下时执行回调函数。


该 Hook 使用了 useEffect 和 useRef 两个 React Hook，以及三个类型别名：ShortcutCallback、ShortcutEntry 和 ShortcutMap。

- ShortcutCallback 是一个函数类型，它接受一个 KeyboardEvent 类型的参数并返回 void。
- ShortcutEntry 是一个对象类型，包含 keys、callback 和 context 三个属性。
- ShortcutMap 是一个 Map 类型，键为字符串，值为 ShortcutEntry 类型的对象。

useShortcut Hook 返回一个对象，其中包含两个函数：registerShortcut 和 unregisterShortcut。registerShortcut 函数接受三个参数：shortcut、callback 和 context（可选），其中 shortcut 可以是一个字符串或字符串数组，表示快捷键的组成部分；callback 是一个函数，表示当快捷键被按下时需要执行的操作；context 是一个可选的任意类型，表示回调函数的上下文。unregisterShortcut 函数接受一个与 registerShortcut 函数相同的参数，用于注销已注册的快捷键。


最后在 useEffect Hook 中注册了一个事件监听器，监听全局的键盘按下事件。当键盘按下时，它调用 getShortcut 函数来获取当前按下的键和修饰键的组合，然后在 shortcutsRef 中查找与之匹配的快捷键，如果找到则执行对应的回调函数，并阻止默认行为。


在组件中可以使用useEffect注册和取消快捷键的监听。


```javascript
useEffect(() => {
    registerShortcut("o", () => openInBrowser());

    return () => {
      unregisterShortcut("o");
    };
  }, []);
```


截止到目前，在Lettura中，我提供了以下全局快捷键操作：

- 切换到下一篇文章：使用快捷键`n`
- 切换到上一篇文章：使用快捷键`N`或者`Shift+n`
- 文章向下滚动：使用快捷键`j`
- 文章向上滚动：使用快捷键`k`
- 在浏览器中打开页面：使用快捷键`o`

在未来，我计划增加以下全局快捷键操作：

- 搜索文章：使用快捷键S
- 打开设置：使用快捷键O
- 添加新订阅：使用快捷键A
- 标记文章为已读或未读：使用快捷键G
- 刷新订阅：使用快捷键R

如果要实现用户自定义修改快捷键，应该怎么做呢？可以提供一个设置页面，允许用户为每个操作选择自己喜欢的键盘组合。在Lettura中，我们可以使用tauri API来读取和写入用户偏好设置，并在用户更改偏好设置时重新注册全局快捷键。这块暂时先不进行开发。


实现全局快捷键功能时，我们需要考虑一些细节。首先，我们需要确保全局快捷键不会与其他应用程序中的全局快捷键冲突。其次，我们需要确保全局快捷键在应用程序未激活时也能正常工作。最后，我们需要确保全局快捷键在应用程序关闭时被正确地释放。在Lettura中，还是使用传统的Web方式来注册快捷键，页面或者组件销毁时，注册事件就会被取消。相对来说比较简单。


对于工具类的应用来说，全局快捷键功能是一个非常有用的功能。

