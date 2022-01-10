---
title: 使用python抓取知乎日报的API数据
date: 2014-10-08 20:12:00
categories: ['Python']
tags: ["Python", "笔记"]

---

使用 `urllib2` 抓取数据时，最简单的方法是：
    
    
    import urllib2, json
    def getStartImage():
        stream = urllib2.urlopen('http://news-at.zhihu.com/api/3/start-image/1080*1776')
        start_image = json.load(stream)
        start_image = json.dumps(start_image, encoding='utf-8')
        return start_image
    

使用`urllib2.urlopen`打开参数中给出的url，返回一个 `instance`（匿名的object）。  
因为这个链接本该返回的是json数据，所以可以用json库提供的`json.load`方法将对象实例解析成一个字典，直接return的话，返回的是一个字典转化成的字符串。使用`json.dumps()`将dict转换成一个json对象，参数中`encoding='utf-8'`，指定编码格式。

<!--![](http://ncuey-crispelite.stor.sinaapp.com/1413276441112.png) -->

但是这种方法往往会遇到 `HTTP Error: 403 Forbidden`，因为网站禁止爬虫抓去该网站的数据。可以在请求中添加 `http header`，伪装成一个浏览器发出的请求。这里需要用到 urllib2 提供的一个类`Reuqest`:
    
    
    urllib2.Request(url[, data][, headers][, origin_req_host][, unverifiable])
    

这个类是一个url请求的抽象化,其具体的使用细节可以参照[这里](https://docs.python.org/2/library/urllib2.html)，在这里就不说了。
    
    
    import urllib2, json
    # 设置header
    headers = {'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6)Gecko/20091201 Firefox/3.5.6'}
    
    def getStartImage():
        req = urllib2.Request(url = 'http://news-at.zhihu.com/api/3/start-image/1080*1776', headers = headers)
        stream = urllib2.urlopen(req)
        start_image = json.load(stream)
        start_image = json.dumps(start_image, encoding='utf-8')
        return start_image

