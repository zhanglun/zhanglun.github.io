---
title: '使用Firebase构建云端应用:创建项目和用户管理'
date: 2016-12-14 21:06:12
categories: ['技术学习']
tags: ['React', 'JavaScript']
---

在构建自己的在线云工具应用时，我使用 Firebase 为自己的“无后端项目”提供服务，把在开发期间接触到的一些内容整理在一起，制成系列笔记。这个过程有两个好处：巩固知识点，整理开发过程的思路。因为前端开发是自己所熟悉的领域，所以先从 Firebase 入手，将后端的一些知识点提前梳理理顺，避免后续的学习过程中的卡壳而导致无法坚持。今天第一期：创建项目和用户管理。

<!--more-->


### 什么是 Firebase

Firebase 原本是一家实时后端数据库创业公司，为提供一个实时响应的数据服务。后被 Google 收购，该平台适用在IOS、Android、web前端等各种跨平台上，对于没有数据库处理经验的开发者，只需使用自己熟悉的语言将数据放在Firebase上，再通过Firebase提供的API即可实现实时数据同步。同时 Google 在新版的 Firebase 中包含开发、成长与营收三阶段，并整合分析工具，不过分析工具目前只针对移动 App，网页的话可以继续使用 Google Analytics。

何谓“实时数据库”？简单粗暴的理解就是，数据库中数据的变动会互动通知到客户端。同一账号在客户端 A出操作，客户端 B 会收到相应的通知。根据我在浏览器中的调试，发现在 Web 端 原来是用的 WebSocket。考虑到写数据时遇到的无网络连接问题，Firebase的数据库API使用了本地缓存，使得在离线状态下也能保持读写不失败，并且会在网络恢复连接时和服务器进行同步。

Firebase 提供了四种 SDK: Android，IOS, Web 和 C++。我将使用 Web 端 SDK 开发一个无后端的笔记应用。

### 关联应用

在使用 Firebase 作为后端数据库之前，需要登录 [Firebase 的控制台](https://console.firebase.google.com/)，添加一个 Firebase 的网络应用。你可选择新建一个应用，或者导入一个现有的 Google 项目。

创建完应用之后，进入应用的控制面板，在 ‘https://console.firebase.google.com/project/your-app-id/overview’ 中可以看到硕大的绑定入口“将 Firebase 添加到您的网页应用”，点击之后，将给处的 JavaScript 添加到 HTML 文件中。

```html
 <script src="https://www.gstatic.com/firebasejs/3.4.0/firebase.js"></script>
  <script>
    // Initialize Firebase
    let config = {
      apiKey: '<your-api-key>',
      authDomain: '<your-auth-domain>',
      databaseURL: '<your-database-url>',
      storageBucket: '<your-storage-bucket>'
    };
    firebase.initializeApp(config);
  </script>
```

当然也可通过 npm 安装 Firebase 的 SDK [npm link](https://www.npmjs.com/package/firebase)，然后通过 Webpack 等工具打包。

```bash
npm install --save firebase
```

引入 Firebase

```js
let firebase = require('firebase');
let app = firebase.initializeApp({ ... });
```

完整的 Firebase 客户端包包含了Firebase 的 Authentication, Realtime Database, Storage 和 Cloud Messaging。上面的代码将会把这些功能全部引入。可以将这些功能以独立组件的形式引入，减少代码量。

* firebase-app 核心代码（必需）
* firebase-auth Authentication（可选）
* firebase-database Realtime Database（可选）
* firebase-storage Storage（可选）
* firebase-messaging Cloud Messagin（可选）

在这个案例中 Cloud Messaging 针对的是移动端，所以不引入。

```js
let firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
 
let app = firebase.initializeApp({ ... });
// ...
```

完成上述步骤之后，你已经可以在环境中使用 firebase 提供的各种接口了。

### 用户

大多数应用都需要了解用户的身份。知道用户的身份可以让应用将用户数据安全地保存在云中并跨所有用户设备提供相同的个性化体验。
Firebase Authentication 提供后端服务、易用 SDK 和现成 UI 库来向应用验证用户的身份。它支持使用密码、深受欢迎的联合用户身份提供商（如 Google、Facebook 和 Twitter）等方法进行身份验证。

本次案例使用第三方登录，不使用 Firebase 提供的 UI库，有兴趣的朋友可以自己去试试 [https://github.com/firebase/FirebaseUI-Web](https://github.com/firebase/FirebaseUI-Web)。


在添加了 Firebase应用之后，打开console的 Authentication，在登录方法中开启需要的登录提供商。这里我选择了“电子邮件地址/密码”和“Github“两种方式。

#### 创建基于密码的帐户

在用户填写表单注册时，完成所需的任何新帐户验证步骤，例如验证新帐号密码键入正确，或者检查账号是否已经存在。然后
将邮件地址和密码传递到 createUserWithEmailAndPassword 方法中来创建新帐户：

```js
firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
  // Handle Errors here.
  let errorCode = error.code;
  let errorMessage = error.message;
  // ...
});
```

用户首次登录后，便会建立一个新用户帐户并链接至该用户登录时使用的凭据，即用户名和密码，或身份验证提供程序信息。此新帐户存储在 Firebase 项目中，可用于跨项目中的每个应用识别用户，无论该用户如何登录。

#### 使用 Github 账号登录

在console 中的登录方式中启用 github 登录之后，需要添加从 GitHub 获得的 OAuth 2.0 客户端 ID 和客户端密钥。同时将你的 Github 应用的授权回调地址设置为 Firebase OAuth 重定向 URI（例如 my-app-12345.firebaseapp.com/__/auth/handler）。[Github 的应用配置](https://github.com/settings/developers)

上述前期工作准备就绪之后，可以开始使用 Firebase SDK 来使用登录流程。

先创建一个 GitHub 提供程序对象的实例：

```js
let provider = new firebase.auth.GithubAuthProvider();
```

然后是一个可选的步骤：从身份验证提供程序中指定您想请求的其他 OAuth 2.0 范围。调用 Provider 实例的 addScope方法来添加范围。例如：

```js
provider.addScope('repo');
```

详细参数可以参考[身份验证提供程序文档](https://developer.github.com/v3/oauth/#scopes)。

接下来，使用 GitHub 提供程序对象进行 Firebase 身份验证。可以提示用户，让其通过打开弹出式窗口或重定向登录页面的方法以自己的 GitHub account 登录。移动设备最好使用重定向方法。要用弹出式窗口的方法登录，调用 signInWithPopup：

```js
firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a GitHub Access Token. You can use it to access the GitHub API.
  let token = result.credential.accessToken;
  // The signed-in user info.
  let user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  let errorCode = error.code;
  let errorMessage = error.message;
  // The email of the user's account used.
  let email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  let credential = error.credential;
  // ...
});
```
你可以检索 GitHub 提供程序的 OAuth 令牌，使用该令牌可通过 GitHub API 提取额外数据。
还可以通过这种方法捕获并处理错误。[获取错误代码列表](https://firebase.google.com/docs/reference/js/firebase.auth.Auth?hl=zh-cn#signInWithPopup)。

如果要用重定向登录页面的方法登录，则调用 signInWithRedirect：

```js
firebase.auth().signInWithRedirect(provider);
```

不仅如此，你还可以在页面加载时通过调用 getRedirectResult 检索 GitHub 提供程序的 OAuth 令牌：

```js
firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    let token = result.credential.accessToken;
    // ...
  }
  // The signed-in user info.
  let user = result.user;
}).catch(function(error) {
  // Handle Errors here.
  let errorCode = error.code;
  let errorMessage = error.message;
  // The email of the user's account used.
  let email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  let credential = error.credential;
  // ...
});
```

当然，你也可以手动处理登录流程。 在 GitHub 登录流程结束后，你会收到一个 OAuth 2.0 访问令牌。在用户使用 GitHub 成功登录之后，先使用 OAuth 2.0 访问令牌换取 Firebase 凭据：

```js
let credential = firebase.auth.GithubAuthProvider.credential(token);
```

然后使用 Firebase 凭据进行 Firebase 身份验证：

```js
firebase.auth().signInWithCredential(credential).catch(function(error) {
  // Handle Errors here.
  let errorCode = error.code;
  let errorMessage = error.message;
  // The email of the user's account used.
  let email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  let credential = error.credential;
  // ...
});
```

除了前面提到的邮箱密码验证，第三方 OAuth 验证之外，Firebase 还支持自定义身份认证系统和匿名身份验证，这里不讲，有兴趣和需求的朋友可以自己去了解。

#### 其他用户管理操作的支持

要注销用户，调用 signOut：

```js
firebase.auth().signOut().then(() => {
  // Sign-out successful.
}, function(error) {
  // An error happened.
});
```

除此之外，SDK 还提供了一系列用户管理的方法。

* 获取当前登录的用户

获取当前用户的推荐方法是在 Auth 对象上调用`onAuthStateChanged`方法，这可确保在您获取当前用户时，Auth 对象不会处于中间状态，例如初始化。既要么未登录，要么已登录。

```js
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
  }
});
```

也可以使用 currentUser 属性获取当前已登录的用户。 如果用户没有登录，currentUser 则为 null：

```js
let user = firebase.auth().currentUser;

if (user) {
  // User is signed in.
} else {
  // No user is signed in.
}
```
不过有一点要注意，currentUser 还可能由于 auth 对象尚未完成初始化而为 null。 如果使用观察程序跟踪用户登录状态，则无需处理该情况。
当获取到用户对象的实例之后，可以访问实例上的一些属性，以及调用实例上的一些方法对用户进行一些操作，比如：

* 要获取用户的个人资料信息：

```js
let user = firebase.auth().currentUser;
let name, email, photoUrl, uid;

if (user != null) {
  name = user.displayName;
  email = user.email;
  photoUrl = user.photoURL;
  uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                   // this value to authenticate with your backend server, if
                   // you have one. Use User.getToken() instead.
}
```

* 获取用户的特定于提供程序的个人资料信息(登录提供程序中获取检索到的个人资料信息)

```js
let user = firebase.auth().currentUser;

if (user != null) {
  user.providerData.forEach(function (profile) {
    console.log("Sign-in provider: "+profile.providerId);
    console.log("  Provider-specific UID: "+profile.uid);
    console.log("  Name: "+profile.displayName);
    console.log("  Email: "+profile.email);
    console.log("  Photo URL: "+profile.photoURL);
  });
}
```

* 更新用户个人资料(显示名称和头像地址)

```js
let user = firebase.auth().currentUser;

user.updateProfile({
  displayName: "Jane Q. User",
  photoURL: "https://example.com/jane-q-user/profile.jpg"
}).then(function() {
  // Update successful.
}, function(error) {
  // An error happened.
});
```

* 设置电子邮件地址

```js
let user = firebase.auth().currentUser;

user.updateEmail("user@example.com").then(function() {
  // Update successful.
}, function(error) {
  // An error happened.
});
```
**要设置用户的电子邮件地址，该用户必须最近登录过**。在 Firebase 控制台的"Authentication"的"Email Templates"页面中允许自定义使用的电子邮件模板。


* 设置用户密码

```js
let user = firebase.auth().currentUser;
let newPassword = getASecureRandomPassword();

user.updatePassword(newPassword).then(function() {
  // Update successful.
}, function(error) {
  // An error happened.
});
```

* 删除用户

也可以在控制台中手动删除用户

```js
let user = firebase.auth().currentUser;

user.delete().then(function() {
  // User deleted.
}, function(error) {
  // An error happened.
});
```


有些安全敏感性操作，比如删除帐户、设置主电子邮件地址和更改密码，需要用户最近登录过才能执行。如果要执行这些操作中的某一项，而用户只是在很久以前登录过，操作便出错。发生这种错误时，需要从用户获取新登录凭据，将该凭据传给 reauthenticate ，对该用户重新进行身份验证。

```js
let user = firebase.auth().currentUser;
let credential;

// Prompt the user to re-provide their sign-in credentials

user.reauthenticate(credential).then(function() {
  // User re-authenticated.
}, function(error) {
  // An error happened.
});
```


### 结束

如此一来，我的应用已经可以支持邮箱密码登录，github 账号登录。而且用户的管理操作也有很直接明了的方法。当用户添加之后，接下来就可以围绕用户设计出需要的数据结构了。下回：数据结构的定义及数据的操作，敬请期待

