---
title: "为Promise增加abort方法"
date: 2020-01-16T19:50:24+08:00
draft: false
---

对于Promise而言只有三个状态： `Pending`， `Resolve` 和 `Reject`。在任意时刻，一个Promise只能是处于这三个状态中的任意一个，且一旦状态变为`Resolve`或者`Reject`之后，状态不能再修改。
有时候我们需要在Promsie从Pending状态变成`Resolve`或者`Reject`之前，停止执行对应的Promsie。就像是将Promise的状态修改为`Stop`或者`Abort`。常见的例子：
1. 发送异步请求时，在请求返回之前直接结束当前任务的逻辑
2. 多个任务并发时，停止执行未处理完成的任务

既然Promise不支持，那我们能否通过其提供的接口来实现一个`Abort`方法呢？可以使用`Promise.race`方法的特点来模拟实现。`Promise.race(iterable)` 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then((value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
});
```

可以使用`Promise.race()`来构造一个“竞争关系”，将想abort的Promise和一个内置的Promise，放在race中执行，而内置的Promsie立马返回 `Resovled` 或者 `Reject` ，从而将另外一个Pomise的执行停止。

```js
let PromiseWithAbort = function(promise){
  let _abort = null;
  let Pabort = new Promise((resolved, reject)=>{
    _abort = function(reason ='abort !'){
      console.warn(reason);
      reject(reason);
    }
  });

  let race = Promise.race([promise, Pabort]);
  
  race.abort = _abort;
  console.log(promise, Pabort);

  return race;
}

let p1= new Promise(res=>{
  setTimeout(()=>{
    res('p1 success');
  },2000)
})

let testP = PromiseWithAbort(p1);

testP.then(res=>{
  console.log('success:', res);
},error=>{
  console.log('error:', error);
})

testP.abort();
```

或者重新包装一个新的Promise

```js
class PromiseWithAbort {
  constructor(fn){
    let _abort = null;
    let _p = new Promise((resolved, reject)=>{
      fn.call(null,resolved, reject);
      _abort = function(error = 'abort'){ 
        reject(error); 
      }
    })

    _p.abort = _abort;

    return _p;
  }
}

let testP = new PromiseWithAbort((resolved, reject)=>{
  setTimeout(() => {
    res(1);
  },1000);
});

testP.then( (resolved)=>{
  console.log('resolved:', resolved);
}, (reject) =>{
  console.log('reject:', reject);
});

testP.abort();
//结果： rej: abort
```
