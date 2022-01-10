---
title: Node学习笔记-Server-Side Templates
date: 2014-11-03 13:39:00
categories: ['Node.js']
tags: [笔记,Node.js]
---

> 因为各种版本的更新，文中的例子可能失效无法运行。毕竟***Node for Front-End Developer***这本书已经出现很久了。

## Creating a Dynamic Page

不像其他的服务端语言开发，Node没有暗示你需要使用任何的模板引擎来创建动态页面。有很多JS模板引擎，而且这个数量还在增加。所以有很多选择的对象。使用哪一个模板引擎并不重要，重要的是你需要什么样子的引擎，什么样子的引擎适合你。

当你在选择模板引擎的时候，你可能需要考虑吧下面的这几个问题：

* 是否需要除了JavaScript之外其他的语言
    - 如果是，你将没法在客户端上使用
* 是否依赖已经存在DOM结构
    - 如果是，你需要在Node中预先编写一端DOM来使用它，这个很easy，但是多走了一步
* 在模板第一次渲染之前，是否允许模板一次编译完成并缓存
    - 如果你想在前台解析所有的模板或者你渲染的模板会重复使用多次，你可能会比较关心这个
* 模板中可以使用多少逻辑
    - 一些模板的提供少量的逻辑处理，有些允许在模板中编写JS代码块。不同模板的不同特性将影响到你的结构，值得去做点研究

为了简单化，我们使用Mustache模板引擎。如果你没有使用过任何的JS模板引擎，Mustache是一个好的开始，因为它站在逻辑与非逻辑中间，它提供了一系列方法，但是又能使用完整的JavaScript。再者，它的语法也用在其他的一些模板引擎中，对你来说是个好事。



我们的第一个服务端模板是这样一个包含表单的页面，用以编辑用户的相关信息 和一个接受提交的页面。

```html
<!--edit.html-->

<h1>{{pageheader}}</h1>
<form action="/" method="POST">
    <label>First name:
        <input type="text" name="firstName" value="{{firstName}}" />
    </label>
    <label>Last name:
        <input type="text" name="lastName" value="{{lastName}}" />
    </label>
    <input type="submit" value="Save" />
</form>

<!--result.html-->
<h1>Edit finish!</h1>
<p>Hello，Mr.{{firstname}}</p>
```

双花括号是模板的定义符号，告诉Mustache在页面渲染的时候在何处填充传递过来的数据。
使用Mustache之前，需要使用npm安装Mustache，具体的可以去[官网](http://mustache.github.io/)查看,然后修改代码去渲染一个模板文件。

```js
var http = require("http"),
    path = require("path"),
    connect = require("connect");

var app = connect();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


var mu = require("mu2");
mu.root = __dirname + "/public/";

app.use('/edit', function(req, res){

    var view={
        pagetitle:"edit your profile",
        pageheader:"This page is perpare for everyone!",
    };
    var readable = mu.compileAndRender('edit.html', view);
    readable.pipe(res);
});

app.use("/api/users/edit", function(req, res){
    mu.clearCache(); // 暂时禁用模版缓存
    res.writeHead({
        "Content-Type":"text/html"
    });
    if(req.method == "POST"){
        if (!req.body){
            res.writeHead(400);
            res.end("Server is missing!");
        }
        // POST 的数据
        var userName = {
            firstname: req.body.firstName,
            lastname: req.body.lastName
        };

        var readable = mu.compileAndRender('result.html', userName);

        readable.pipe(res); // 关于stream的更多用法，要找时间看看
    }

    if(req.method == "GET"){

        res.writeHead(200);
        res.end("Hey! Don't visit this page !");   
    }
});

http.createServer(app).listen(3000);

```


假设我们将 edit.html 文件保存在 public 目录中，上述的代码将会将内容转换为文本流保存到一个变量中，一旦模板完全加载，便将传递过来的信息渲染成HTML。然后再将最后的HTML输出。


**注意：** Mustache的具体使用方法请看官方给出的教程：[官网](http://mustache.github.io/)。

## Partial Templates

在站点中，都会有很多相同的部分，比如导航，页脚或者其他的一些页面组件会在多个页面上出现。笨一点的话就是把HTML每个都复制粘贴一遍，但是将它们作为一个个简单的可共享的模板进行管理比起复制粘贴来说，更加的方便，有利于管理和维护。

对于一些静态文件，如果我们不想重复的在每个模板中引用，我们可以为站点设置一个默认的模板，里面包含了静态文件的引用。对于页面上不同的内容，可以为其留下空间，在需要的时候利用它们。
不同模板的嵌套采用不同的处理方法，当然具体的用法还是参照官网最直接。

不只是html模板，如果我们想动态生成CSS（比如修改主题）或者JavaScript，同样可以使用模板来操作，修改文件类型就可以了。因为读取文件的时候将其看到做是一些字符串，这对Node的解析来说没有什么区别。

例如，我们想利用Mustache根据用户定义的值来修改CSS文件，实现的方法与前面描述的加载HTML模板简直是一模一样，只不过requirejs请求的文件变成了CSS文件而已。假设从一个POST请求中接收到了修改样式的参数，然后根据这些参数来请求不同的CSS。

Node里面的各种模块好蛋疼 ==!(未完……)
