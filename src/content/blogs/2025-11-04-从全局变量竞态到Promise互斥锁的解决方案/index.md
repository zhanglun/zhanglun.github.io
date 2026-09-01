---
title: 从全局变量竞态到Promise互斥锁的解决方案
categories:
  - 技术研究
date: 2025-11-04T18:00:00.000+08:00
tags:
  - JavaScrtipt
  - Node.js
  - 笔记
draft: false
---

## 背景


最近在开发一个Node.js后端服务时，我遇到了一个令人困惑的问题。开发中需要共享数据，通过简单的全局变量维护时遇到了因为时序问题导致结果不符合预期的问题。


为了更好的说明问题，我简化了问题。现在假设我们有一个简单的全局计数器，用来统计某个操作的执行次数：


```javascript
let operationCount = 0;

app.post('/api/operation', async (req, res) => {
  const currentCount = operationCount;

  // 模拟一些异步操作
  await processUserRequest(req.body);

  operationCount = currentCount + 1;

  res.json({
    message: '操作成功',
    totalOperations: operationCount
  });
});
```


在测试时，我发起了100个并发请求，理论上计数器应该显示100，但实际结果却总是小于100，有时是97，有时是95，每次都不一样。


为什么了？问题在于，多个请求同时读取和修改同一个全局变量，由于Node.js的异步特性，导致了竞态条件。


## 理解Node.js并发请求的真相


要理解为什么会出现这个问题，我们需要了解Node.js如何处理并发请求。很多人误以为Node.js是多线程的，但实际上：


```javascript
// 假设两个请求几乎同时到达
app.post('/api/test', async (req, res) => {
  console.log(`请求 ${req.id} 开始`);

  // 关键问题：这里发生了什么？
  const current = globalValue;
  await someAsyncWork();
  globalValue = current + 1;

  console.log(`请求 ${req.id} 结束`);
});
```


**执行时序可能是这样的**：


```plain text
请求A: 读取 globalValue = 0
请求A: 开始异步操作
请求B: 读取 globalValue = 0 (此时A还没更新)
请求A: 完成异步操作，设置 globalValue = 1
请求B: 完成异步操作，设置 globalValue = 1 (应该是2!)
```


Node.js采用**单线程事件循环**模型：

- JavaScript代码在单个主线程执行
- 异步I/O操作被委托给系统内核
- 主线程通过事件循环处理回调

```javascript
// 演示代码执行流程
async function processRequest(requestId) {
  console.log(`开始处理请求 ${requestId}`);

  // 同步代码立即执行
  const startTime = Date.now();

  // 异步操作 - 主线程继续处理其他请求
  await databaseQuery();

  // 回调执行 - 回到主线程
  console.log(`请求 ${requestId} 完成`);
}

// 并发执行时：
// 1. 请求A的同步代码
// 2. 请求A遇到await，释放主线程
// 3. 请求B的同步代码
// 4. 请求B遇到await，释放主线程
// 5. 异步操作完成，回调按顺序执行
```


### 为什么全局变量会出错？


问题的根源在于**读取-修改-写入**这个操作不是原子的：


```javascript
// 这不是原子操作！
const current = globalValue;    // 读取
await processData(current);     // 处理（期间globalValue可能被修改）
globalValue = current + 1;      // 写入（可能覆盖其他请求的修改）
```


每个请求都有自己独立的执行上下文，但共享同一个全局变量。当异步操作介入时，时序就变得不可控了。


## 解决方案：安全修改全局数据的多种策略


既然发现了问题，那么如何安全地修改全局数据呢？这里有几种可行的方案：


### 原子操作 - 首选方案


如果可能，尽量使用原子操作，这是最简单有效的方案。


**Redis原子操作**：


```javascript
// 使用Redis的INCR命令
app.post('/api/operation', async (req, res) => {
  const newCount = await redis.incr('operation:count');

  await processUserRequest(req.body);

  res.json({
    message: '操作成功',
    totalOperations: newCount
  });
});
```


**数据库原子操作**：


```javascript
// MongoDB的原子更新
app.post('/api/operation', async (req, res) => {
  const result = await Counter.findOneAndUpdate(
    { name: 'operationCount' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  await processUserRequest(req.body);

  res.json({
    message: '操作成功',
    totalOperations: result.value
  });
});
```


### 分布式锁 - 复杂场景的解决方案


对于需要执行复杂业务逻辑的场景，可以使用分布式锁：


```javascript
async function withDistributedLock(lockKey, timeout, operation) {
  const lockId = Math.random().toString(36);

  // 尝试获取锁
  const acquired = await redis.set(
    `lock:${lockKey}`,
    lockId,
    'PX', timeout, 'NX'
  );

  if (!acquired) {
    throw new Error('系统繁忙，请稍后重试');
  }

  try {
    return await operation();
  } finally {
    // 确保只有锁的持有者才能释放
    const currentLock = await redis.get(`lock:${lockKey}`);
    if (currentLock === lockId) {
      await redis.del(`lock:${lockKey}`);
    }
  }
}

// 使用分布式锁
app.post('/api/complex-operation', async (req, res) => {
  try {
    const result = await withDistributedLock('complex:operation', 5000, async () => {
      // 这里是需要互斥执行的复杂逻辑
      const currentData = await getSharedData();
      const processedData = await complexProcessing(currentData);
      await updateSharedData(processedData);
      return processedData;
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(429).json({ error: error.message });
  }
});
```


### 消息队列 - 高并发场景的选择


对于高并发场景，可以使用消息队列来串行化处理：


```javascript
const Queue = require('bull');

// 创建操作队列
const operationQueue = new Queue('operations');

// 处理队列任务
operationQueue.process(async (job) => {
  const { requestData } = job.data;

  // 这里会串行执行，不会出现竞态条件
  const currentCount = await getCurrentCount();
  await processRequest(requestData);
  const newCount = await updateCount(currentCount + 1);

  return newCount;
});

// API端点
app.post('/api/operation', async (req, res) => {
  const job = await operationQueue.add('process', {
    requestData: req.body
  });

  const result = await job.finished();
  res.json({ totalOperations: result });
});
```


## 巧妙解法：Promise Chain实现互斥锁的原理


在单进程场景下，有一个非常优雅的解决方案：基于Promise Chain的互斥锁。


### 基础实现


```javascript
class PromiseMutex {
  constructor() {
    // 初始化一个已解决的Promise作为队列起点
    this._queue = Promise.resolve();
  }

  async acquire() {
    // 保存当前队列尾部的Promise
    const previous = this._queue;

    // 创建一个新的Promise，它将在我们想要释放锁时resolve
    let releaseFunction;
    const newLock = new Promise(resolve => {
      releaseFunction = resolve;
    });

    // 将新Promise加入到队列尾部
    // 这样后续的acquire调用会等待这个Promise解决
    this._queue = this._queue.then(() => newLock);

    // 等待前面的所有操作完成
    await previous;

    // 返回释放锁的函数
    return releaseFunction;
  }
}
```


### 工作原理详解


让我们通过一个具体的例子来理解这个锁是如何工作的：


**初始状态**：


```plain text
队列: Promise.resolve() ✅ (已解决)
```


**第一个请求获取锁**：


```javascript
// 请求A调用acquire()
const previous = this._queue;        // previous = Promise.resolve() ✅
const newLock = new Promise(...);    // newLock ❌ (等待A释放)
this._queue = previous.then(() => newLock);  // 队列更新
await previous;  // ✅ 立即完成，因为previous已解决
// A获得锁，返回releaseFunction
```


此时队列状态：


```plain text
初始Promise ✅ -> 等待A释放 ❌
```


**第二个请求获取锁**：


```javascript
// 请求B调用acquire()
const previous = this._queue;        // previous = 等待A释放的Promise ❌
const newLock = new Promise(...);    // newLock ❌ (等待B释放)
this._queue = previous.then(() => newLock);  // 队列更新
await previous;  // ❌ 等待A释放锁...
// B被阻塞在这里
```


此时队列状态：


```plain text
初始Promise ✅ -> 等待A释放 ❌ -> 等待B释放 ❌
```


**第一个请求释放锁**：


```javascript
// 请求A完成工作，调用releaseFunction()
releaseFunction();  // 解决A的Promise
```


队列推进：


```plain text
初始Promise ✅ -> 等待A释放 ✅ -> 等待B释放 ❌
```


**第二个请求获得锁**：


```javascript
// B的await previous完成，获得锁
// B开始执行关键代码
```


### 完整使用示例


```javascript
const mutex = new PromiseMutex();
let sharedCounter = 0;

async function safeIncrement(workerId) {
  // 获取锁
  const release = await mutex.acquire();

  try {
    console.log(`[Worker ${workerId}] 获得锁，当前值: ${sharedCounter}`);

    // 模拟一些处理时间
    await new Promise(resolve => setTimeout(resolve, 100));

    // 安全地更新共享数据
    const oldValue = sharedCounter;
    sharedCounter = oldValue + 1;

    console.log(`[Worker ${workerId}] 完成，新值: ${sharedCounter}`);

    return sharedCounter;
  } finally {
    // 确保总是释放锁
    release();
    console.log(`[Worker ${workerId}] 释放锁`);
  }
}

// 测试并发
async function runTest() {
  console.log('开始并发测试...');

  const workers = [];
  for (let i = 1; i <= 5; i++) {
    workers.push(safeIncrement(i));
  }

  await Promise.all(workers);
  console.log(`测试完成，最终结果: ${sharedCounter}`); // 总是5
}

runTest();
```


输出结果：


```plain text
开始并发测试...
[Worker 1] 获得锁，当前值: 0
[Worker 1] 完成，新值: 1
[Worker 1] 释放锁
[Worker 2] 获得锁，当前值: 1
[Worker 2] 完成，新值: 2
[Worker 2] 释放锁
[Worker 3] 获得锁，当前值: 2
...（依次执行）
测试完成，最终结果: 5
```


### 为什么Promise Chain能实现互斥锁？


这种方案的精妙之处在于它充分利用了JavaScript的语言特性：

1. **单线程保证**：JavaScript的单线程特性确保了对`this._queue`的修改是原子的，不会有真正的内存竞态条件。
2. **Promise的微任务队列**：Promise的`.then()`回调总是在微任务队列中顺序执行，这保证了操作的严格顺序。
3. **异步串行化**：通过构建Promise链，我们将并发的异步操作转换为严格的串行执行。
4. **无忙等待**：与传统的自旋锁不同，这种方法不会消耗CPU周期，而是利用事件循环的自然调度。

### 高级特性扩展


**带超时的锁**：


```javascript
class TimedMutex extends PromiseMutex {
  async acquire(timeout = 5000) {
    const release = await Promise.race([
      super.acquire(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('获取锁超时')), timeout)
      )
    ]);
    return release;
  }
}
```


**自动释放的锁**：


```javascript
async function withMutex(mutex, operation) {
  const release = await mutex.acquire();
  try {
    return await operation();
  } finally {
    release();
  }
}

// 使用更简洁
await withMutex(mutex, async () => {
  // 受保护的代码块
  sharedCounter++;
});
```


从最初遇到的全局变量竞态问题，到深入理解Node.js的并发模型，再到探索多种解决方案，最后发现Promise Chain互斥锁这个优雅的解法，整个过程让我对Node.js的异步编程有了更深的理解。


**关键收获**：

1. **理解并发模型**：Node.js的单线程+事件循环模型决定了其特殊的并发特性
2. **识别竞态条件**：全局变量的"读取-修改-写入"操作在异步环境下不是原子的
3. **选择合适的方案**：根据场景选择原子操作、分布式锁、消息队列或Promise互斥锁
4. **欣赏语言特性**：Promise Chain互斥锁充分利用了JavaScript的异步特性，实现简洁而强大

Promise Chain互斥锁虽然只适用于单进程场景，但在微服务架构和容器化部署的今天，单进程解决方案仍然具有重要的实用价值。它提醒我们，有时候最优雅的解决方案就隐藏在我们日常使用的语言特性之中。


## 拓展阅读

> 因为我有过Rust、Python的开发经历，实战中也遇到过类似的问题，所以想横向对比一下不同语言中的差别。下面的内容来自AI总结：

### 多语言并发编程对比：Go、Python、Rust如何处理共享数据竞态


### Go语言：基于CSP模型的并发哲学


Go语言最著名的特性就是其原生的并发支持，基于CSP（Communicating Sequential Processes）理论：


```go
package main

import (
    "fmt"
    "sync"
    "time"
)

// 危险的全局变量用法
var globalCounter int = 0

func unsafeIncrement(wg *sync.WaitGroup) {
    defer wg.Done()
    current := globalCounter
    // 模拟一些工作
    time.Sleep(10 * time.Millisecond)
    globalCounter = current + 1
}

func main() {
    var wg sync.WaitGroup

    // 启动100个goroutine
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go unsafeIncrement(&wg)
    }

    wg.Wait()
    fmt.Printf("最终结果: %d (期望: 100)\\n", globalCounter)
    // 输出可能是: 最终结果: 87 (期望: 100)
}
```


### Go的解决方案


**使用互斥锁（Mutex）**


```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type SafeCounter struct {
    mu    sync.Mutex
    value int
}

func (c *SafeCounter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    current := c.value
    time.Sleep(10 * time.Millisecond)
    c.value = current + 1
}

func (c *SafeCounter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.value
}

func main() {
    var wg sync.WaitGroup
    counter := &SafeCounter{}

    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            counter.Increment()
        }()
    }

    wg.Wait()
    fmt.Printf("安全计数结果: %d\\n", counter.Value()) // 总是100
}
```


**使用Channel（Go的推荐方式）**


```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func channelBasedCounter() {
    var wg sync.WaitGroup
    ch := make(chan int, 1) // 缓冲为1的channel

    // 初始化计数器
    ch <- 0

    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()

            // 从channel读取当前值
            current := <-ch
            time.Sleep(10 * time.Millisecond)

            // 写回新值
            ch <- current + 1
        }()
    }

    wg.Wait()
    final := <-ch
    close(ch)
    fmt.Printf("Channel方式结果: %d\\n", final) // 总是100
}

// 更优雅的worker池模式
func workerPoolCounter() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // 启动worker
    for w := 0; w < 10; w++ {
        go worker(w, jobs, results)
    }

    // 发送任务
    for j := 0; j < 100; j++ {
        jobs <- j
    }
    close(jobs)

    // 收集结果
    total := 0
    for a := 0; a < 100; a++ {
        total += <-results
    }

    fmt.Printf("Worker池结果: %d\\n", total)
}

func worker(id int, jobs <-chan int, results chan<- int) {
    for range jobs {
        // 每个worker处理自己的计数，无共享状态
        results <- 1
    }
}
```


**原子操作**


```go
package main

import (
    "fmt"
    "sync"
    "sync/atomic"
    "time"
)

func atomicCounter() {
    var wg sync.WaitGroup
    var counter int32 = 0

    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            time.Sleep(10 * time.Millisecond)
            atomic.AddInt32(&counter, 1)
        }()
    }

    wg.Wait()
    fmt.Printf("原子操作结果: %d\\n", atomic.LoadInt32(&counter)) // 总是100
}
```


### Python：GIL下的并发世界


### Python的全局解释器锁（GIL）


Python有一个著名的特性——全局解释器锁（GIL），这影响了其并发模型：


```python
import threading
import time

# 危险的全局变量
global_counter = 0

def unsafe_increment():
    global global_counter
    current = global_counter
    time.sleep(0.01)  # 模拟I/O操作
    global_counter = current + 1

def test_unsafe_counter():
    threads = []
    for _ in range(100):
        t = threading.Thread(target=unsafe_increment)
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

    print(f"不安全计数结果: {global_counter}")  # 可能不是100

# 由于GIL，即使是这种情况也可能出现问题
```


### Python的解决方案


**使用 threading.Lock**


```python
import threading
import time

class SafeCounter:
    def __init__(self):
        self._value = 0
        self._lock = threading.Lock()

    def increment(self):
        with self._lock:
            current = self._value
            time.sleep(0.01)
            self._value = current + 1

    @property
    def value(self):
        with self._lock:
            return self._value

def test_safe_counter():
    counter = SafeCounter()
    threads = []

    for _ in range(100):
        t = threading.Thread(target=counter.increment)
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

    print(f"安全计数结果: {counter.value}")  # 总是100
```


**使用 multiprocessing（绕过GIL）**


```python
import multiprocessing
import time

def worker(counter, lock):
    with lock:
        current = counter.value
        time.sleep(0.01)
        counter.value = current + 1

def test_multiprocessing_counter():
    # 使用Manager创建共享变量
    with multiprocessing.Manager() as manager:
        counter = manager.Value('i', 0)
        lock = manager.Lock()

        processes = []
        for _ in range(100):
            p = multiprocessing.Process(target=worker, args=(counter, lock))
            p.start()
            processes.append(p)

        for p in processes:
            p.join()

        print(f"多进程结果: {counter.value}")  # 总是100
```


**使用 asyncio 和异步锁**


```python
import asyncio

class AsyncSafeCounter:
    def __init__(self):
        self._value = 0
        self._lock = asyncio.Lock()

    async def increment(self):
        async with self._lock:
            current = self._value
            await asyncio.sleep(0.01)  # 异步sleep
            self._value = current + 1

    @property
    def value(self):
        return self._value

async def test_async_counter():
    counter = AsyncSafeCounter()

    # 创建100个并发任务
    tasks = [asyncio.create_task(counter.increment()) for _ in range(100)]
    await asyncio.gather(*tasks)

    print(f"异步计数结果: {counter.value}")  # 总是100
```


### Rust：内存安全并发的编译时保证


### Rust的所有权系统和并发


Rust最强大的特性之一就是在编译时防止数据竞争：


```rust
use std::thread;
use std::time::Duration;

// 这个代码甚至无法编译！Rust会阻止数据竞争
fn unsafe_counter() {
    let mut counter = 0;

    let handles: Vec<_> = (0..100).map(|_| {
        thread::spawn(|| {
            let current = counter;  // 错误！counter被多个线程借用
            thread::sleep(Duration::from_millis(10));
            counter = current + 1;  // 错误！
        })
    }).collect();

    for handle in handles {
        handle.join().unwrap();
    }

    println!("最终结果: {}", counter);
}
// 编译错误：多个线程不能同时可变借用counter
```


### Rust的解决方案


**使用 Mutex 和 Arc**


```rust
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

fn safe_mutex_counter() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..100 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            // 获取锁
            let mut num = counter.lock().unwrap();
            thread::sleep(Duration::from_millis(10));
            *num += 1;
            // 锁在离开作用域时自动释放
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Mutex计数结果: {}", *counter.lock().unwrap()); // 总是100
}
```


**使用原子操作**


```rust
use std::sync::atomic::{AtomicI32, Ordering};
use std::sync::Arc;
use std::thread;
use std::time::Duration;

fn atomic_counter() {
    let counter = Arc::new(AtomicI32::new(0));
    let mut handles = vec![];

    for _ in 0..100 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            thread::sleep(Duration::from_millis(10));
            counter.fetch_add(1, Ordering::SeqCst);
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("原子计数结果: {}", counter.load(Ordering::SeqCst)); // 总是100
}
```


**使用消息传递（Rust的推荐方式）**


```rust
use std::thread;
use std::sync::mpsc; // 多生产者，单消费者
use std::time::Duration;

fn channel_based_counter() {
    let (tx, rx) = mpsc::channel();
    let mut handles = vec![];

    // 启动计数线程
    let counter_handle = thread::spawn(move || {
        let mut count = 0;
        while let Ok(_) = rx.recv() {
            count += 1;
        }
        count
    });

    // 启动100个工作线程
    for _ in 0..100 {
        let tx = tx.clone();
        let handle = thread::spawn(move || {
            thread::sleep(Duration::from_millis(10));
            tx.send(()).unwrap();
        });
        handles.push(handle);
    }

    // 等待所有工作线程完成
    for handle in handles {
        handle.join().unwrap();
    }

    // 关闭发送端
    drop(tx);

    let result = counter_handle.join().unwrap();
    println!("Channel计数结果: {}", result); // 总是100
}
```


### 语言对比与哲学差异


### 并发哲学总结


| 语言          | 并发哲学                           | 主要机制                                | 内存安全保证      |
| ----------- | ------------------------------ | ----------------------------------- | ----------- |
| **Go**      | "不要通过共享内存来通信，而要通过通信来共享内存"      | Goroutines, Channels                | 运行时检查       |
| **Python**  | "有GIL的简单并发，复杂情况用多进程"           | threading, asyncio, multiprocessing | GIL + 运行时检查 |
| **Rust**    | " fearless concurrency - 无畏并发" | 所有权系统, 借用检查器                        | 编译时保证       |
| **Node.js** | "单线程事件循环 + 工作线程"               | Event Loop, Promise, Worker Threads | 单线程保证       |


### 通用最佳实践

1. **优先使用消息传递**：在可能的情况下，使用channel/queue而不是共享内存
2. **使用不可变数据**：尽可能使用不可变数据结构
3. **限制共享状态**：设计时尽量减少需要共享的状态
4. **适当的锁粒度**：锁的范围要足够小，但不能太小导致性能问题

### 语言特定建议


**Go:**


```go
// 好的做法：使用channel
func processRequests(requests <-chan Request, results chan<- Result) {
    for req := range requests {
        result := process(req)
        results <- result
    }
}

// 避免：过度使用共享内存和锁
```


**Python:**


```python
# 好的做法：使用线程池和future
from concurrent.futures import ThreadPoolExecutor

def process_data(data):
    # 处理数据
    return processed_data

with ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(process_data, data_list))
```


**Rust:**


```rust
// 好的做法：使用RAII和作用域锁
fn process_data(data: &Data) -> Result<ProcessedData> {
    // 不需要显式释放锁
    let guard = data_lock.lock().unwrap();
    // 使用guard访问数据
    Ok(process(guard))
}
```

