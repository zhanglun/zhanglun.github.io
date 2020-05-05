---
title: 在 CentOS 上部署 pyspider 爬虫项目
date: 2018-10-08 23:12:03
categories:
tags: ['Python', 'Pyspider', 'CentOS']
---

## 前言

之前在腾讯云的云主机中，部署了一个pyspider爬虫项目，专门爬链家上的二手房信息。前段时间云主机被我玩坏了，重装了一次，需要重新在部署一次。之前没有记录下具体的过程，无奈只能搜索资料重来一次。乘着这次机会，在此记录下 CentOS 上 Pyspider 爬虫项目的部署过程。以后还是需要多做笔记，整理学习

<!--more-->


## 安装 Python3

在部署pyspider项目之前，需要安装Python，虽然系统自带Python2.7.5，但是我选择使用Python3。Python3的安装过程十分简单，在我之前的文章：[个人服务器常用基础配置](https://zhanglun.github.io/2018/03/09/%E4%B8%AA%E4%BA%BA%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%B8%B8%E7%94%A8%E5%9F%BA%E7%A1%80%E9%85%8D%E7%BD%AE/) 中提到过。在这里重新记录一次


### 源码安装

在安装之前，有几个依赖工具需要提前装好。

```bash
$ yum install gcc zlib-devel
```

接下来时下载源码、编译安装。

```bash
$ wget https://www.python.org/ftp/python/3.7.0/Python-3.7.0.tar.xz -O python3.7.0.tar.xz
$ tar xJf python3.7.0tar.xz
$ cd python3.7.0tar.xz
$ ./configure

// 因为我使用的是 fish-shell。其实就是 bash 中的 `make && make install`
$ make; and  make install

// 检查安装结果。输出 `/usr/local/bin/python3`
$ which python3
```

### 使用 pyenv 安装

有时多个python版本还是希望用pyenv隔离下，避免不同版本库间的影响干扰。有时为了避免固有bug的影响，希望从零开始安装一个纯净的环境，pyenv就可以发挥作用了。

#### 安装依赖的库文件

```bash
yum install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel
```

#### 安装 pyenv

```bash
git clone git://github.com/yyuu/pyenv.git ~/.pyenv
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
exec $SHELL -l
```

#### 简单使用

```bash
#查看当前版本
pyenv version

# 查看所有版本
pyenv versions

# 查看所有可安装的版本
pyenv install --list

# 安装指定版本
pyenv install 3.6.5
# 安装新版本后rehash一下
pyenv rehash

# 删除指定版本
pyenv uninstall 3.5.2

# 指定全局版本
pyenv global 3.6.5

# 指定多个全局版本, 3版本优先
pyenv global 3.6.5 2.7.14

# 实际上当你切换版本后, 相应的pip和包仓库都是会自动切换过去的
```

#### 使用Pyenv安装python

如果你试图通过pyenv安装python版本，不出意外的话一定会失败。解决方案很简单：

1. pyenv搜狐镜像源加速：http://mirrors.sohu.com/python/
2. 下载需要的版本放到~/.pyenv/cache文件夹下面
3. 然后执行 pyenv install 版本号 安装对应的python版本

简化为一条命令：

```bash
v=3.6.5;wget http://mirrors.sohu.com/python/$v/Python-$v.tar.xz -P ~/.pyenv/cache/;pyenv install $v  
```

然后通过 `pyenv global 3.6.5` 设置当前python版本，再 `pyenv rehash` 即可。此时`python`和`pip`都是python3对应的版本

通过修改pip的镜像源加速python包的下载。创建或者修改以下文件 ~/.pip/pip.conf 写入以下文件内容

```bash
[global]
index-url = http://mirrors.aliyun.com/pypi/simple
[install]
trusted-host = mirrors.aliyun.com
```

这样在使用pip来安装时，会默认调用该镜像。

## 安装 pyspider

```bash
pip install pyspider
```

关于 pyspider的使用在此不在复述，网上有很多教程。个人在使用过程中，增加了一个配置文件，最终通过一下命令启动

```
nohup pyspider -c config.json&
```

