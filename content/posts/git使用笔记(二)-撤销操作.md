---
title: git 使用笔记(二)-撤销操作
date: 2014-07-22 21:09:00  
tags: [Git, 笔记]

---

###撤消操作

在最近使用 git 的过程中，有时候遇到这样的一个问题：习惯性的 "add -A"，这会将所有的修改都添加到暂存区，可是有两个文件的修改暂时不想添加的呀，这该怎么办？git 提供了一些撤销操作的方法。比如：

#####取消已经暂存的修改

就像前面说的，习惯性的 "add -A" 将暂时不想添加的修改添加到了暂存区。而取消已经暂存的修改的方法，git 已经在你每次使用 `git status` 查看文件状态的时候给出了解决方案，

    ➜  hexo-theme git:(master) ✗ git status
    On branch master
    Your branch is ahead of 'origin/master' by 2 commits.
      (use "git push" to publish your local commits)

    Changes to be committed:
      (use "git reset HEAD <file>..." to unstage)

        modified:   processing/README.md
        modified:   processing/layout/_partial/navigation.jade
        modified:   processing/layout/_widget/archive.jade
        modified:   processing/layout/_widget/categories.jade
        modified:   processing/source/css/_base/base.scss
        modified:   processing/source/css/_base/variables.scss
        modified:   processing/source/css/_partial/navigation.scss
        modified:   processing/source/css/style.scss

可以使用 git reset HEAD <file>... 的方式取消暂存。

    ➜  hexo-theme git:(master) ✗ git reset HEAD *
    Unstaged changes after reset:
    M	processing/README.md
    M	processing/layout/_partial/navigation.jade
    M	processing/layout/_widget/archive.jade
    M	processing/layout/_widget/categories.jade
    M	processing/source/css/_base/base.scss
    M	processing/source/css/_base/variables.scss
    M	processing/source/css/_partial/navigation.scss
    M	processing/source/css/style.scss
    
这时再使用 `git status` 查看文件状态可以看到

    ➜  hexo-theme git:(master) ✗ git status
    On branch master
    Your branch is ahead of 'origin/master' by 2 commits.
      (use "git push" to publish your local commits)

    Changes not staged for commit:
      (use "git add <file>..." to update what will be committed)
      (use "git checkout -- <file>..." to discard changes in working directory)

    	modified:   processing/README.md
    	modified:   processing/layout/_partial/navigation.jade
    	modified:   processing/layout/_widget/archive.jade
    	modified:   processing/layout/_widget/categories.jade
    	modified:   processing/source/css/_base/base.scss
    	modified:   processing/source/css/_base/variables.scss
    	modified:   processing/source/css/_partial/navigation.scss
    	modified:   processing/source/css/style.scss

    no changes added to commit (use "git add" and/or "git commit -a")
    
可以看到，现在所有的修改都没有被暂存。

#####取消对文件的修改

有一次，我正修复一个bug，修改本地仓库的一个文件，还没有完成时，同伴告诉我他已经修改好了，并且已经提交到远程了。我停下手头的工作，准备 pull ，这时候意识到，如果直接 pull，merge 的时候必然会冲突，因为我和同事同时修改了同一个文件的差不多相同的地方。但是我自己修改了文件很多地方，一味的 CTRL+Z 也难以解决问题，此时我需要将我修改的文件返回到修改之前的状态。很凑巧的是，在执行 `git status` 时，同样也给出了具体的撤销方法。

    ➜  hexo-theme git:(master) git status
    On branch master
    Your branch is up-to-date with 'origin/master'.

    Changes not staged for commit:
      (use "git add <file>..." to update what will be committed)
      (use "git checkout -- <file>..." to discard changes in working directory)

	    modified:   processing/layout/_widget/archive.jade
    	modified:   processing/layout/_widget/categories.jade
	    modified:   processing/layout/_widget/tags.jade
    	modified:   processing/layout/layout.jade
	    modified:   processing/source/css/_base/base.scss

    no changes added to commit (use "git add" and/or "git commit -a")

使用 `git checkout -- <filename>` 来取消工作目录中的修改。

    ➜  hexo-theme git:(master) ✗ git checkout -- *
    ➜  hexo-theme git:(master) git status
    On branch master
    Your branch is up-to-date with 'origin/master'.

    nothing to commit, working directory clean

效果显而易见！！这条命令有些危险，所有对文件的修改都没有了。如果一个不小心将自己需要的修改 discard 了，那就只有哭了……

#####修改最后一次的提交
有时候在提交时，发现自己漏掉或者多选了几个文件，亦或者提交信息写错了，想要撤销刚才的提交操作，可以使用 `--amend` 这个选项，重新提交

    ➜  hexo-theme git:(master) ✗ git add -A
    ➜  hexo-theme git:(master) ✗ git commit -m "commit wrong"
    [master ebcbab2] commit wrong
     4 files changed, 78 insertions(+), 106 deletions(-)
     rewrite processing/source/css/_base/base.scss (64%)
     
发现自己提交了一个 "commit wrong" 的错误提交信息，也不用太紧张，输入指令

    git commit --amend 
    
之后，会跳转到命令行中的 vim 中，提示你修改提交信息。只要没有推送到远程端，一切都好说～
