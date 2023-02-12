---
title: Node学习笔记-Data Sources and Flow Control
date: 2014-11-06 21:17:00
categories: ['Node.js']
tags: [笔记,Node.js]
---

>额在之前的笔记中，提到了使用middleware，设置路由，发送数据，处理请求，渲染模板等。但是这些都不足以完成一个Web应用程序，动态数据交互需要和数据库联系在一起。当用户向服务器发送一个请求，响应的服务器可能就需要向数据库发送请求，此时，之后当数据库将数据返回给服务器，服务端才能够将响应给用户。好的，在这里就涉及到了服务端的流控制（server-side flow control）

## Connecting to Database

在Node中没有的提供默认的链接数据的方法，同时又有很多类型的数据库都支持在Node中使用。至于如何选择还是要看具体情况具体分析。书上用的例子是Redis，这是一个很轻量级的数据，具体的我也不太懂。这里是它的[官网](http://redis.io/)，由于没有官方的window版本，我决定先试试用SQLite。

之前有过一个sqlite的数据文件，里面是在豆瓣电影上抓取的一点点东西，正好可以用上。

Node的包实在是太多了，往往有时候陷入选择困难症……。我选用的是叫做`sqlite3`的modules，NPM上提供的详细资料在[这里](https://www.npmjs.org/package/sqlite3)，[这里](https://github.com/mapbox/node-sqlite3/wiki/)还有其API文档。


在server.js的目录下新建`db`文件夹，里面放着待会儿要用的db文件。在Node中使用sqlite时，也要先引用它对应的module。

```js
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/douban.rdb');
```
路由的设置和之前的一样，采用`connect-route`，从数据库读取到数据完成之后，调用回调函数，回调函数中的参数`row`包含每一行的数据，

```html
<!--movie.html template-->
<h1>豆瓣电影</h1>
<dl>
    <dt>{{name}}</dt>
    <dd><img src="{{img}}" alt="{{name}}"></dd>
    <dd><a href="{{href}}">{{name}}</a></dd>
    <dd><span>{{type}}</span> &nbsp;&nbsp;<span></span></dd>
</dl>
```

```js
// server.js
// 忽略外部函数，只显示核心代码
router.get('/movie', function(req, res, next){
    var search = db.each("select * from MOVIE", function(err, row){
        console.log(row);
        var movie={
            name:row.name,
            href:row.href,
            img:row.post_url,
            type:row.type
        };
        var readable = mu.compileAndRender('movie.html', movie);
        readable.pipe(res);
    });
});
```

这应该算的上是Node中操作数据库最简单的例子，执行select语句读取数据，然后将数据渲染到模板中，呈现给用户。觉得还是有必要把sqlite3的API稍微翻译下做个笔记，不然每次都去查有点子麻烦。

## Storing Data in Files

上面讲的是从数据库中取数据，现在来说说如何存储数据。其实我觉得这些问题，只要搞明白了一个，其他的也就不怎么困难了。取数据的时候我们是先访问数据库，然后查找，找到自己需要的数据之后返回就行，大体上就是这么个过程，那么反过来存储数据就是 先准备好打算存储的数据，然后访问数据库，将要存储的数据存入数据库就行了。整个过程都依赖相应数据库modules的API，看懂了API结合着操作几次，差不多就熟练了。我觉得这也没什么好说的。

## node-sqlite3 简单的操作
>来自[node sqlite3 wiki api](https://github.com/mapbox/node-sqlite3/wiki/API)


### new sqlite3.Database(filename, [mode], [callback])

返回一个新的Database对象，并且自动打开这个数据库。没有其他间接的方法来打开数据库。

* `filename`： 正确的值是文件名，如果是“:memory:”，则在内存中创建一个匿名的数据库，匿名数据库不持久，关闭数据库程序之后内容就会消失。
* `mode`：可选参数，可以是`sqlite3.OPEN_READONLY`, `sqlite3.OPEN_READWRITE` 和 `sqlite3.OPEN_CREATE`中的一个或者多个。默认值是 `OPEN_READWRITE | OPEN_CREATE`。
* `callback`：可选参数，数据库成功打开或者打开时遇到错误调用，回调函数的第一个参数是一个err对象。当err对象为`null`时，数据库打开成功，此时触发一个没有参数的`open`事件，无论回调函数是否存在。

### sqlite3.verbose()

设置执行模式。See the wiki page on [debugging](https://github.com/developmentseed/node-sqlite3/wiki/Debugging) for more information.

### Database#close([callback])
关闭数据库

* `callback`：可选参数。当数据库成功关闭或者关闭时遇到错误调用。回调函数的第一个参数是一个err对象。当err对象为`null`时，数据库关闭成功，此时触发一个没有参数的`open`事件，无论回调函数是否存在。

## Database#run(sql, [param, ...], [callback])
执行SQL语句，然后调用回调函数。返回的是一个Database对象，可以链式调用。

* `sql`：执行的SQL语句。如果SQL语句无效，同时run方法有一个回调函数。回调函数将被调用，参数是一个包含错误信息的err对象。如果没有回调函数来处理错误，一个`error`事件会在影响到后面的数据库相关语句，导致其无法正常工作。

* `param, ...`：可选参数。当SQL语句包含占位符的时候，可以将参数在这里写出。在执行前，参数会被添加到语句中。有三种方式传递参数：直接作为函数的参数列举出来；以数组的形式；或者一个json对象。

```javascript
      // Directly in the function arguments.
      db.run("UPDATE tbl SET name = ? WHERE id = ?", "bar", 2);

      // As an array.
      db.run("UPDATE tbl SET name = ? WHERE id = ?", [ "bar", 2 ]);

      // As an object with named parameters.
      db.run("UPDATE tbl SET name = $name WHERE id = $id", {
          $id: 2,
          $name: "bar"
      });
```
 参数的键可以这么书写 `:name`, `@name` and `$name`. 建议使用 `$name`因为JS中允许使用$来声明变量。

* `callback` ：可选参数。在语句执行的任何一个步骤出错和查询执行后都会调用这个函数。遇到错误时，第一个（只有一个）参数是一个包含错误信息的err对象。如果执行成功，第一个参数是`null`。函数的上下文（this）指向的是statement对象。在第一次运行之后无妨再次运行这个statement，因为在第一次运行之后它被自动销毁了。
  如果执行成功，this对象将包含两个属性：`lastID`和`changes`，这两个属性包含这最后插入的行的ID和这条语句影响的行数（如果它们都不是undefined的话）。执行INSERT才会有lastID，执行UPDATE和DELETE才会有changes。其他情况下，这两个属性的都是不准确的，不应该被使用。
  在查询方法总，只有`.run()`的回调函数才有这两个值，其他的比如`.all()`，`.get()`等都没有这些值。

更多详情请戳[这里](https://github.com/mapbox/node-sqlite3/wiki/API)

Bye~下次再来……
