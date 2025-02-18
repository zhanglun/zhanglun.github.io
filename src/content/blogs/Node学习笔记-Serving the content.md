---
title: Node学习笔记-Serving the content
date: 2014-10-28 19:40:00
categories: ['学习笔记']
tags: [笔记,Node.js]

---

## Node中的MiddleWare

>In the context of a web server, middleware is a layer between the guts
of the server and the code you’re writing to run on it that provides a set
of abstractions anyone writing code for the platform will be likely to
need. It differs from other modules you might pull into your application
in that it exists as a buffer between Node and your app, not a utility used
within your app.

在一个Web服务器的上下文中，中间件是服务器和你写在其上运行的代码的中间一层，为那些编写代码的人提供一组抽象（a set of abstractions）。它不同于其他那些引入到你的应用中的模块，middleware作为一个缓存区存在于Node与你的应用之间，

Connect 是最受欢迎的Node中间件框架，为其他的web 框架比如Express提供了基础。Connect提供的工具之一就是 static 模块，用于处理静态文件，如果我们添加了Connect，对静态文件的引用可以酱紫：

```js
var connect = require('connect');
var app = connect();

app.use(function middleware1(req, res, next) {
  // middleware 1
  next();
});

app.use(function middleware2(req, res, next) {
  // middleware 2
  next();
});
```
[Github:](https://github.com/senchalabs/connect)


## Receiving Data from the Querystring

向服务端传送数据最简单的办法就是在url中添加querystring，这种方式不需要在客户端做太多操作。

Node官方提供了一个叫做`querystring`的模块，我们不需要做太多的工作就能够很轻松的解析出querystring中的数据，我们要做的一件事请就是“trim the querystring”，因为querystring模块提供了解析querystring字段的方法`parse()`,当时没有已经将querystring从URl中分离出来。

```js
var http = require("http"),
querystring = require("querystring");
http.createServer(function(req, res) {
    // parse everything after the "?" into key/value pairs
    var qs = querystring.parse(req.url.split("?")[1]),
    // property names are the same as in the querystring
    userName = qs.firstName + " " + qs.lastName,
    html = "<!doctype html>" +
    "<html><head><title>Hello " + userName + "</title></head>" +
    "<body><h1>Hello, " + userName + "!</h1></body></html>";
    res.end(html);
}).listen(8000);
```

## Routing and Receiving Data from a Path

`Routing`是中间件提供的另一个功能，但是自己实现起来也不是很复杂。Routing可以让我们解析出除了querystring之外的URL路径中的数据。一个最简单的route包含三个部分：一个request方法；一个route匹配的模式（正则表达式）和一个请求匹配成功时调用的回调函数。

要解析URL，必须引入URL模块

```js
var url = require("url");
```

前面讲到的使用querystring的例子，可以修改成Route版，通过检查URL来寻找信息。假设我们的路径是“sayhello/firstname/lastname”

```js
var http = require("http"),
    url = require("url");
http.createServer(function(req, res) {
    // split out parts of the path
    var path = url.parse(req.url).pathname.split("/");
    // handle GET requests to /sayHello/

    if (req.method == "GET" && path[1] == "sayHello") {
        var userName = path[2] + " " + path[3],
        html = "<!doctype html>" +
        "<html><head><title>Hello " + userName + "</title></head>" +
        "<body><h1>Hello, " + userName + "!</h1></body></html>";
        res.end(html);
    }
}).listen(8000);
```

但是可以看到这样的代码是多么的不健壮，根本没有拓展性可言。我们可以使用Connect来提高代码的可用性。

## Receiving Data from a POST

最传统的获取用户数据的方式就是接受来自表单的一个POST请求，这可能不是你使用Node时做的第一件事，但是这个还是一件很必要的事情。亲自尝试使用Node处理POST请求时，可以很好的感受到Node与其他服务端开发的不同之处。`ServerRequest` 对象（回调函数中的req参数）的属性，没有包含POST传递过来的参数，但是它是一个`EventEmitter`-事件发射器。它是Node中的一个基本的对象，其作用就像它的名字一样-发射事件。我们不是去检查req的属性是否含有传递过来的数据，而是添加一个事件监听器来监听请求。


所有的事件发射器的监听器，包括`ServerRequest`的监听器，都通过 on() 创建，这个方法至少需要一个事件的类型和一个回调函数作为参数（addListener()方法也是一样）。请求的数据将会出现在chunk中，我们不用等待接收完所有的数据就可执行后面的代码。现在，创建一个监听器，用于数据的接受，请求的结束和保存所有的数据块。但是只有在请求完成之后才能显示数据。

```js
var http = require("http"),
    fs = require("fs"),
    querystring = require("querystring");
    http.createServer(function(req, res) {
    var data = "";
    // serve static form
    if (req.method == "GET") {
        getFile(__dirname + "/public/simpleForm.html", res);
    }
    // handle form post
    if (req.method == "POST") {
        req.on("data", function(chunk) {
            // append received data
            data += chunk;
        });
        req.on("end", function() {
            // get key/value pairs from received data
            var params = querystring.parse(data),
            userName = params.firstName + " " + params.lastName,
            html = "<!doctype html>" +
            "<html><head><title>Hello " + userName + "</title></head>" +
            "<body><h1>Hello, " + userName + "!</h1></body></html>";
            res.end(html);
        });
    }
}).listen(8000);
```

同样的我们也可以利用中间件来完成，可以使用 `bodyParse`。


