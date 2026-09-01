---
title: 修改commit的作者信息要几步呢？
categories:
  - 技术应用
date: 2023-07-26T12:00:00.000+08:00
tags:
  - 日记
draft: false
---

我有两台Mac，一台mac mini在家使用，一台macbook用于工作，偶尔周末也会开发一些side project代码。有时候我会从不同的设备向github仓库push代码。在macbook上开发时，如果我没有对github的仓库设置我的个人用户名和邮箱，当我push代码时，会使用配置在全局的工作使用的git帐号信息。


在github上看到自己的工作帐号时，总是感觉不舒服。如何修改commit信息中的帐号呢？


在创建commit的时候，可以通过增加参数`—author`设置本次commit的作者信息。


```bash
git commit -m "my commit" --author "zhanglun <zhanglun1410@gmail.com>"
```


如果commit已经创建了，想对其记录中的作者信息进行修改，可以使用`—amend`参数。


```bash
git commit --amend --author "zhanglun <zhanglun1410@gmail.com>"
```


还可以使用rebase编辑commit的作者，不过使用rebase时，其实也是—amend的应用。


如果commit已经push到远端，则可能需要一些小技巧了，下面的几个步骤就是通过替换commit来实现修改提交者帐号信息的能力。


1、首先，找到记录中想替换的comimit。


```bash
git log --abbrev-commit
```


```bash
commit b123892 (HEAD -> master, origin/master, origin/HEAD)
Author: thewrongname <someone@else.com>
Date:   Thu Aug 27 10:10:33 2020 -0500

    Commit from another computer!

commit a928338
Author: dev.logfetch <dev.logfetch@gmail.com>
Date:   Thu Aug 27 00:28:07 2020 -0500

    Commit from my personal computer!

...
```


假设我们想将第一个commit `b123892`的作者修改成第二个commit相同的作者。先切换到这个commit。


```bash
git checkout b123892
```


2、修改作者。


```bash
git commit --amend --author "logfetch <dev.logfetch@gmail.com>"
```


3、接下来回到第一步所在的分支


```bash
# git checkout branch_name
git checkout master
```


```bash
Warning: you are leaving 1 commit behind, not connected to
any of your branches:
    c894824 Commit from another computer!
```


`c894824`是新创建的commit。


4、使用新commit替换旧commit


```bash
# git replace old_hash new_hash
git replace b123892 c894824
```


5、基于新的commit重写未来的commit


```bash
git filter-branch -- --all
```


6、删除掉被替换的commit


```bash
# git replace -d old_hash
git replace -d b123892
```


建议在执行push操作之前，使用log命令检查之前的操作是否成功。


### 参考

- [https://logfetch.com/git-change-author/](https://logfetch.com/git-change-author/)
- [https://git-scm.com/book/zh/v2/Git-工具-重写历史](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E9%87%8D%E5%86%99%E5%8E%86%E5%8F%B2)
