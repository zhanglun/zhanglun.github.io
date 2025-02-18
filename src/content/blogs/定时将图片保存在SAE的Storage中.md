---
title: 定时将图片保存在SAE的Storage中
date: 2014-11-10 19:27:00
categories: ['解决方案']
tags: [webpy, Python]
---

>前几天一直在看Node相关的书，做了一些笔记，挂在自己的博客上。挺累的，毕竟看的是两本英文的书。而且疲了，一时间学的太猛，以至于晕头转向的。Node中我觉得有一个很麻烦的问题就是：包太多，更新速度也是参差不齐，有的一直在维护，有的已经很长时间不变化，太乱了。光一个MySQL的模块就好多好多好多个。怎么说呢，感觉模块什么的都不太需要太在意，重要的是理解Node的一些本质，虽然我现在还不清楚有些什么很重要的本质，总之慢慢来吧。

>反观python，虽然我只是也业余的python玩家，但是我也看出来了，python的很多套路都比较稳定，做起来的话踩的坑比较少，对于想我这种渴望从代码中找到成就感的屌丝来说还是很不错的。所以歇了两天之后能开始玩python

之前尝试用python来做一个网站，网站干嘛的我自己也不清楚，只想借机多了解一点后端的技术。然后我决定利用知乎日报的数据来给自己做一个“纸糊日报”。其他的什么就先不说了，之前做的时候，没有掌握Evernote的使用技巧，也就没有想着做笔记。不过现在不一样了，我有特殊的做笔记技巧。


## 问题来了：在本地开发，保存图片的尴尬
原本只是利用webpy自带的小小服务器在本地开发，但是遇到一个问题就是，抓到图片原始路径之后，没办法直接在页面上使用，因为没有权限在知乎以外的站点使用。然后我也不知道怎么解决这种问题啊，当时为了能早点看到效果，写了一个脚本把图片保存到一个指定的路径，再从这个地方引用。

那么问题来了，每过一天，打开电脑之后，我都要单独地手动地执行一次脚本，我很蛋疼！！更重要的是，如果我放到线上之后，还要把所有的图片都传上去嘛！！

## 转机：本地和SAE线上同步开发

然后我也没有什么好办法，就荒废下去了。昨天呢，突然意识到，发布到线上我也只有放在SAE啊，毕竟穷屌丝……。SAE支持Python开发，可以使用webpy这一小巧的框架；提供MySQL和Storage服务，Stroage最少都有10G的容量，这应该够了吧。
所以安排如下：

* 将本地的代码，转移到SAE上
* 将图片保存到Stroage中而不是代码目录里
* 日后可能使用MySQL服务

### 构建SAE中webpy的本地开发
webpy在本地运行和在SAE中运行有点不同，

```python
# 本地
app = web.application(urls, globals())
if __name__ == "__main__":
    app.run()


# SAE
app = web.application(urls, globals()).wsgifunc()
application = sae.create_wsgi_app(app)
```

将两者合并，我们得到一个既可以直接在本地运行，又可以直接在SAE运行的代码：

```python
app = web.application(urls, globals())
if __name__ == "__main__":
    app.run()
else:
    import sae
    application = sae.create_wsgi_app(app.wsgifunc())

```

SAE上的Python应用的入口为 `index.wsgi:application` ，也就是 `index.wsgi` 这个文件中名为 `application` 的对象。

在本地，我可以运用`code.py`，但是在SAE上的入口是`index.wsgi`。在[这篇博客](http://www.liaoxuefeng.com/article/00137389260145256f699d538ae4fd3910be06d2753b192000)上看到了解决方案，菜鸟表示，不太明白怎么回事，我还是先乖乖拷贝吧。

### 将图片存至Storage

图片的抓取就不多说了。假设已经拿到了图片的地址`http://pic4.zhimg.com/e80a34cf13d590dea72ad5e1dfb66bac.jpg`。

SAE提供了Storage的使用帮助文档，[这里是Python的文档](http://sae.sina.com.cn/doc/python/storage.html#module-sae.storage)，简单明了。

所以我的代码是酱紫的：

```python
def saveimagetostorage(url):
    # 去掉 ‘http://’
    file_path = url[6:]
    # 文件夹
    dir_path = re.match(r'/\w+(\.\w+){0,}\/', file_path).group(0)
    # 获取文件名
    file_name = file_path[len(dir_path):]

    if 'SERVER_SOFTWARE' in os.environ:
        # import sae
        from sae.storage import Bucket
        bucket = Bucket("zhihudaily")
        # 存取一个文件到bucket中
        fr = urllib.urlopen(url)
        stream = fr.read()
        bucket.put_object(dir_path[1:]+file_name, stream)
        return bucket

    else:
        mkdir(save_path)
        print file_path
        print '>>>>'
        print url
        urllib.urlretrieve(url, imagePath + file_path)
        return "LocalHost"
```
核心代码就是这些：

```python
from sae.storage import Bucket
bucket = Bucket("storage的名字")
fr = urllib.urlopen(url)
stream = fr.read()
bucket.put_object(dir_path[1:]+file_name, stream)
```

### 如何定时？

SAE提供了[Cron(wiki)](http://zh.wikipedia.org/wiki/Cron)服务，SAE的相关文档在[这里](http://sae.sina.com.cn/doc/php/cron.html)。这个Cron就是用来设置周期性被执行的指令的。之前每次都是手动的执行脚本来保存图片，麻烦的要死，既然已经可以图片存到SAE上了，何不再利用SAE提供的便利服务来定时执行保存的操作呢？

>Cron服务是SAE为开发者提供的分布式计划任务服务，用来定时触发开发者的特定动作，满足比如定时计算排行榜等需求。

>Cron的执行是以HTTP方式触发的，触发后真正执行的是用户在应用的HTTP的回调函数。Cron服务是分布式环境部署的，具有高可靠性，多点之间相互隔离且同时触发，并且通过分布式锁进行选举并最终由一个健康节点执行。

Cron的应用场景主要是让用户可以在指定的时间执行一些计划任务。
    
    * 每隔一定时间执行，如每隔2个小时执行1次。
    * 在某个特定时间点执行，如每周二晚上9:10执行。

我可以在应用的配置文件 `config.yaml` 中来添加Cron。例如：
 
    name: crontest
    version: 1
    cron:
    - description: cron_test
      url: /cron/make
      schedule: "*/5 * * * *"


添加了一个Cron任务， 该任务每5分钟执行 http://crontest.sinaapp.com/cron/make 一次。具体如何配置可以文档给出的[例子](http://sae.sina.com.cn/doc/php/cron.html#id3)

在我的代码中，我设置的是每一个小时抓取一次图片，所以是酱紫的：

    name: daily
    version: 1
    cron:
    - description: daily
      url: /api/save_image
      schedule: "0 */1 * * *"


**注意:Cron使用HTTP GET方式请求URL**



