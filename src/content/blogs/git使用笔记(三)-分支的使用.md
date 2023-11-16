---
title: Git 使用笔记(三)-分支的使用
date: 2014-09-14 16:06:00
tags: ["Git", "笔记"]

---

## 简单介绍

之前说过，每次修改之后，Git 并不是保存这些修改之后的差异变化，实际上就像一个照相机一样，将修改后的文件拍下作为文件快照，记录在一个微型的文件系统中。在 Git 中提交时，会保存一个提交对象，这个对象包含一个暂存内容快照的指针。而 Git 中的分支其本质上是一个指向 commit 对象的可变的指针，使用 master 作为分支的默认名字，通常指向的是最新的一次提交。

每次的提交，Git 把他们穿起来连成一条线，而主分支master就在这条线上随着提交测更新移动，而 HEAD 指向master，表示我们当前处在 master 分支上（不好意思，直接就用廖雪峰老师的图了，他的教程请戳[这里](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)）

<!--![images](http://ncuey-crispelite.stor.sinaapp.com/18333fig0304-tn.png) -->

创建一个叫做 dev 分支，这个分支默认会只想当前你所处在的提交对象上，切换到这个分支上后，HEAD 便指向了 dev。

<!--![images](http://ncuey-crispelite.stor.sinaapp.com/new-branch-dev.png) -->

从这个时候开始，对工作区的操作都只是在 dev 分支上发生了，在 dev 的上提交一次之后，master 指向原来的那个提交对象，而 dev 会指向最新的提交对象。我们称：master 落后了 dev 一个 commit。当我们试图将 master 指向 dev 当前的提交时，这个操作就是合并分支。

在上述的这几个过程中，工作区的内容没有变化，整个过程就是修改几个指针而已，几乎就是瞬间完成。

## 创建与合并

创建一个 crisp 分支，然后切换到这个分支：

```bash
git checkout -b crisp
Switched to a new branch 'crisp'
```

`git checkout -b` 表示创建并切换分支，相当于将下面两步操作合并成一步来做

```bash
git branch crisp 		// 创建分支
git checkout crisp		// 切换到指定的分支
```
	
同时，可以用 `git branch` 查看分支，这个命令会列出所有的分支，在当前的分支前面会表上一个 * 号。

分支与分支之间相互独立，彼此绝缘，所以可以在 主分支master的基础上分出若干个分支，进行不同的操作，比如不同模块的开发，bug的修复等，工作完成之后合并到主分支就行了。怎么合并分支呢？

假设我们正在 dev 分之上开发，当开发完成后，在这个分之上提交代码

```bash
git add .
git commit -m "dev 开发完成！"
```
	
此时的提交是在 dev 分支上的提交，当你切回 master 上是，dev 上的修改你都看不到。此时的 master 如果没有人提交过的话，则停留在切换分支之前的那个提交点上，也就是落后与 dev 分支。这个时候我们就需要将分支合并了。

```bash
git checkout master		// 先切回 master 分支 
git merge dev 			// 手动将dev 分支上的提交合并到 master 上
```
	
当某一个分支不在需要的时候，可以将它删除

```bash
git branch -d branchname
```
	
小小的总结一下：

```bash
查看分支：git branch

创建分支：git branch name

切换分支：git checkout name

创建+切换分支：git checkout -b name

合并某分支到当前分支：git merge name

删除分支：git branch -d name
```
	
	 
	
	






	
