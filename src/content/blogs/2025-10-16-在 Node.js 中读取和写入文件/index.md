---
title: 在 Node.js 中读取和写入文件
categories:
  - 技术研究
date: 2025-10-16T17:00:00.000+08:00
tags:
  - Node.js
  - 笔记
draft: false
---

文件操作是 Node.js 常见的使用场景。无论是构建提供静态资产的 Web 服务器、处理 CSV 文件、处理用户上传还是使用配置文件，了解如何有效地读取和写入文件都是很重要。


在 Node.js 中处理文件作的方法有多种（基于回调的 API、同步方法和基于 promise 的方法）。虽然回调和同步方法仍然有效并且偶尔有用，但如今它们的使用越来越少。时代在发展，Node.js 也在进步，它的生态系统已经转向更符合人体工程学的模式，从回调地狱和阻塞作转向更干净的`async/await`语法和基于 Promise 的非阻塞 API。


最近的工作中涉及到了一些文件相关的操作，整理了一些内容，做个记录。在本文中，我将重点介绍 Node.js 文件处理的高级方法，从使用 promise 的最简单方法开始，然后深入研究更高级的技术，例如使用文件句柄和流式处理：一种巧妙的方法，可以在不破坏应用程序的情况下处理大量文件。


## 使用 Promises (fs/promises) 读写文件


在现代 Node.js 中处理文件的最直接方法是使用 `node：fs/promises` 模块以及 `readFile（）` 和 `writeFile（）` 等函数。这为我们提供了一个干净的、基于 promise 的 API，它可以与 `async/await` 完美配合。
`readFile（）` 和 `writeFile（）` 都返回 promise，当使用 `await` 时，在异步文件作完成时将控制权交还给事件循环。当作成功完成时，事件循环将控制权交还给代码，执行将转移到下一行代码。
如果操作作失败，Promise 会拒绝并抛出错误（我们可以通过 `try/catch` 块来处理）。


### 使用 fs/promises 读取文件


以下是使用基于 Promise 的现代方法读取文件的方法：


```javascript
import { readFile } from "node:fs/promises";
try {
  const data = await readFile("config.json", "utf8");
  const config = JSON.parse(data);

  console.log("Configuration loaded:", config);
} catch (error) {
  console.error("Failed to read config file:", error.message);
}
```


The `readFile()` function loads the entire file content into memory and returns it as a string (when you specify an encoding like ‘utf8’) or as a Buffer (when no encoding is specified).
`readFile（）` 函数将整个文件内容加载到内存中，可以通过参数 encoding 指定返回字符串或者 buffer。


### 读取文件时处理错误


文件作可能失败的原因有很多：

- **ENOENT：** 文件或目录不存在
- **EACCES：** 权限被拒绝（无法读取文件）
- **EISDIR**：尝试将目录作为文件读取
- **EMFILE：** 打开的文件太多
- **JSON 解析错误** ：如果正在读取 JSON，则 `JSON.parse（）` 可能会抛出（例如，如果文件内容不是有效的 JSON）

要记得正常处理这些错误，以防止程序崩溃。


### 使用 fs/promises 写文件


编写文件也简单。下面的例子中，将一个 JavaScript 对象，将其转换为 JSON，并将其保存到文件中：


```javascript
import { writeFile } from "node:fs/promises";

try {
  const jsonData = JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
  });

  await writeFile("user-data.json", jsonData, "utf8");

  console.log("User data saved successfully!");
} catch (error) {
  console.error("Failed to save user data:", error.message);

  throw error;
}
```


`writeFile（）` 在文件不存在时创建文件，如果存在，则完全覆盖它。整个字符串内容会立即写入磁盘，因此这种方法非常适合已准备好所有数据并希望快速持久化的情况。


### 处理写入文件时的错误


同样的，文件写入作可能会因各种原因而失败：

- **EACCES：** 权限被拒绝（无法写入目录）
- **ENOSPC：** 设备上没有剩余空间（磁盘已满）
- **EROFS**：只读文件系统
- **EISDIR**：尝试写入目录而不是文件
- **ENOTDIR**：路径的一部分不是目录

### 读取和写入二进制文件


并非所有文件都是基于文本的，有时候要处理一些图片、视频之类的文件。Node.js 处理二进制数据同样优雅。


### 写入二进制数据 - 生成 WAV 文件


生成一个 1 秒钟、1000 Hz、单声道、44.1kHz 采样率、16 位深度的正弦波音频，并保存为 beep.wav 文件。例子来自网络。


```javascript
import { writeFile } from "node:fs/promises";

/**
 *  原始音频样本编码为 WAV 文件格式
 * 把一个 Int16Array（16 位有符号整数）的原始音频样本数组，按照 WAV 文件格式封装成 Buffer
 *
 */
function encodeWavPcm16(samples, sampleRate = 44100, numChannels = 1) {
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;

  const buf = Buffer.alloc(44 + dataSize);
  let o = 0;

  // RIFF 头
  buf.write("RIFF", o);
  o += 4;
  buf.writeUInt32LE(36 + dataSize, o);
  o += 4; // file size minus 8
  buf.write("WAVE", o);
  o += 4;

  // fmt 块
  buf.write("fmt ", o);
  o += 4;
  buf.writeUInt32LE(16, o);
  o += 4;
  buf.writeUInt16LE(1, o);
  o += 2;
  buf.writeUInt16LE(numChannels, o);
  o += 2;
  buf.writeUInt32LE(sampleRate, o);
  o += 4;
  buf.writeUInt32LE(byteRate, o);
  o += 4;
  buf.writeUInt16LE(blockAlign, o);
  o += 2;
  buf.writeUInt16LE(16, o);
  o += 2; // bitsPerSample

  // data 块
  buf.write("data", o);
  o += 4;
  buf.writeUInt32LE(dataSize, o);
  o += 4;

  for (let i = 0; i < samples.length; i++, o += 2) {
    buf.writeInt16LE(samples[i], o);
  }
  return buf;
}

// 生成正弦波音频样本
function makeSine(
  durationSec,
  freq = 1000,
  sampleRate = 44100,
  numChannels = 1,
  amp = 0.3
) {
  const frames = Math.floor(durationSec * sampleRate);
  const samples = new Int16Array(frames * numChannels);
  for (let i = 0; i < frames; i++) {
    const x = Math.sin(2 * Math.PI * freq * (i / sampleRate)) * amp;
    const s = Math.max(-1, Math.min(1, x));
    const v = Math.round(s * 32767);
    for (let c = 0; c < numChannels; c++) samples[i * numChannels + c] = v;
  }
  return { samples, sampleRate, numChannels };
}

async function createBeepWav() {
  try {
    const { samples, sampleRate, numChannels } = makeSine(1.0, 1000, 44100, 1);
    const wavBuf = encodeWavPcm16(samples, sampleRate, numChannels);
    await writeFile("beep.wav", wavBuf);
    console.log("Wrote beep.wav");
  } catch (error) {
    console.error("Failed to create WAV file:", error.message);
    throw error;
  }
}

await createBeepWav();
```


在这个例子中`encodeWavPcm16（）` 函数通过构造标头和音频数据部分来创建完整的 WAV 文件结构。WAV 标头包含文件大小、音频格式、采样率和通道数等元数据，而数据部分包含实际的音频样本。`makeSine（）` 函数使用正弦波数学公式创建音频样本，生成指定频率的纯音。每个样本代表声波在特定时间点的幅度，当以正确的采样率播放时，这些数字值会重新创建原始模拟声音。


可以将任意二进制数据放入缓冲区并使用 `writeFile（）` 将其写入文件。无论是编写文本、JSON、图像、音频还是任何其他类型的数据，Node.js 都以相同的方式处理所有文件作。


在处理这样的二进制数据时，使用 Node.js [Buffer](https://nodejs.org/api/buffer.html) 对象来组织和作二进制数据。缓冲区是一个固定大小的字节序列，它提供了一种直接处理二进制数据的方法。它类似于整数数组，但专门设计用于有效处理原始二进制数据。
在 WAV 示例中，使用 `Buffer.alloc（）` 创建所需大小的缓冲区，然后使用 `writeUInt32LE（）` 和 `writeInt16LE（）` 等方法以小端格式在特定位置写入特定数据类型。


### 读取二进制数据 - 解析 WAV 文件头


在此示例中，读取 WAV 文件以确定其持续时间（以毫秒为单位）。这需要将文件内容读取为二进制数据，然后进行二进制数据处理。
我们将解析 WAV 标头以提取采样率和数据大小等信息，然后使用以下公式计算持续时间：`（dataSize / byteRate） * 1000`。


```javascript
import { readFile } from "node:fs/promises";

function decodeWavHeader(buffer) {
  if (
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WAVE"
  ) {
    throw new Error("Not a RIFF/WAVE file");
  }

  let offset = 12;
  let fmt = null;
  let dataOffset = null;
  let dataSize = null;

  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const payload = offset + 8;

    if (id === "fmt ") {
      fmt = {
        audioFormat: buffer.readUInt16LE(payload + 0),
        numChannels: buffer.readUInt16LE(payload + 2),
        sampleRate: buffer.readUInt32LE(payload + 4),
        byteRate: buffer.readUInt32LE(payload + 8),
        blockAlign: buffer.readUInt16LE(payload + 12),
        bitsPerSample: buffer.readUInt16LE(payload + 14),
      };
    } else if (id === "data") {
      dataOffset = payload;
      dataSize = size;
      break;
    }

    offset = payload + size + (size % 2);
  }

  if (!fmt || dataOffset == null) throw new Error("Missing fmt or data chunk");
  return { ...fmt, dataOffset, dataSize };
}

async function getWavDuration(filePath) {
  if (!filePath) {
    throw new Error("File path is required");
  }

  try {
    const buf = await readFile(filePath);
    const hdr = decodeWavHeader(buf);

    // duration (ms) = (dataSize / byteRate) * 1000
    const durationMs = Math.round((hdr.dataSize / hdr.byteRate) * 1000);
    console.log(`Duration: ${durationMs}ms`);
    return durationMs;
  } catch (error) {
    console.error("Failed to read WAV file:", error.message);
    throw error;
  }
}

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node read-wav-duration.js <wav-file-path>");
  process.exit(1);
}

await getWavDuration(filePath);
```


在这个例子中，从现有 WAV 文件中读取和解析二进制数据。`decodeWavHeader（）` 函数演示了如何通过读取文件结构中预定位置的字节来从二进制数据中提取特定信息。


该函数使用 `readUInt32LE（）` 和 `readUInt16LE（）` 等 Buffer 方法将原始字节解释为特定数据类型。例如，字节 22-23 包含通道数，字节 24-27 包含采样率，字节 40-43 包含音频数据的大小。通过了解 WAV 文件格式规范，可以定位并提取这些值。不同的文件格式有不同的规范，按需实现即可。


持续时间计算结合了几条元数据：将总音频数据大小除以字节速率（字节数/秒）得到持续时间（以秒为单位），然后乘以 1000 转换为毫秒。


上面的例子很好地演示了如何通过文件格式和基本的数学计算，从二进制数据中获取到想要的数据。


### 二进制文件复杂性


这是一个非常简单的示例，显示仅使用 Node.js 内置函数进行基本的二进制作。我们可以在这里手动处理 WAV 格式，因为我们正在创建一个具有已知参数的最小单通道 PCM 文件。


对于现实世界的音频应用程序，通常使用像 [Howler.js](https://howlerjs.com/) 这样的综合库来处理多种音频格式和高级音频功能的复杂性。


### 使用 Promise 进行并发文件操作


读取和写入单个文件很有用，但是如果需要处理多个文件怎么办？


### 同时读取多个文件


```javascript
import { readFile } from "node:fs/promises";

const configFiles = [
  "config/database.json",
  "config/api.json",
  "config/logging.json",
  "config/feature-flags.json",
];

try {
  const promises = configFiles.map((file) =>
    readFile(file, "utf8").then(JSON.parse)
  );

  const [databaseConfig, apiConfig, loggingConfig, featureFlagsConfig] =
    await Promise.all(promises);

  console.log("Successfully loaded config files", {
    databaseConfig,
    apiConfig,
    loggingConfig,
    featureFlagsConfig,
  });
} catch (error) {
  console.error("Failed to read config files:", error.message);
}
```


上面的例子是常见的 Promise 用法。首先映射文件名数组以创建 Promise 数组。每个 promise 代表读取文件并解析其 JSON 内容的完整作。`readFile（filename， 'utf8'）` 返回一个 promise，该 promise 解析为原始文件内容作为字符串。然后，我们将 `.then（JSON.parse）` 链接到该 Promise，这会创建一个新的 Promise，该 Promise 将解析为从 JSON 解析为 JavaScript 值（可能是一个对象）的文件内容。


### 同时写入多个文件


```javascript
import { mkdir, writeFile } from "node:fs/promises";

async function generateReports(data) {
  const reports = [
    {
      filename: "reports/daily-summary.json",
      content: JSON.stringify(data.daily, null, 2),
    },
    {
      filename: "reports/weekly-summary.json",
      content: JSON.stringify(data.weekly, null, 2),
    },
    {
      filename: "reports/monthly-summary.json",
      content: JSON.stringify(data.monthly, null, 2),
    },
    {
      filename: "reports/yearly-summary.json",
      content: JSON.stringify(data.yearly, null, 2),
    },
  ];

  try {
    // Write all files concurrently
    const promises = reports.map(({ filename, content }) =>
      writeFile(filename, content, "utf8")
    );
    await Promise.all(promises);

    console.log(`Successfully generated ${reports.length} report files`);
  } catch (error) {
    console.error("Failed to write report files:", error.message);
    throw error;
  }
}

// Usage
const reportData = {
  daily: { sales: 1000, visitors: 250 },
  weekly: { sales: 7000, visitors: 1750 },
  monthly: { sales: 30000, visitors: 7500 },
  yearly: { sales: 365000, visitors: 91250 },
};

await mkdir("reports", { recursive: true }); // Ensure reports directory exists
await generateReports(reportData);
```


创建一个报告对象数组，每个对象都包含一个文件名和内容，然后使用 `.map（）` 将其转换为 `writeFile（）` 承诺数组。这里的关键模式是相同的：同时启动所有写入作（当我们创建 promises 数组时），然后使用 `Promise.all（）` 等待所有作完成。


这种方法对于生成多个相关文件（例如报告、日志或配置文件）特别有用。所有文件都是并发写入的，与逐个写入相比，这显着提高了性能。


如果任何写入作失败，则整个批处理都会失败，这通常是应作为一个单元创建的相关文件的所需行为。


### Promise.all() 与 Promise.allSettled()


在这些示例中，我们使用 `Promise.all（），` 因为如果任何配置文件加载失败或任何报告写入失败，就无法继续。但是，如果可以允许一个或多个错误（例如加载可选配置文件或处理一批用户上传），则最好使用 `Promise.allSettled（）。`


**主要区别：**

- **`Promise.all（）`**：快速失败 - 当任何 Promise 拒绝时立即拒绝
- **`Promise.allSettled（）`**：等待所有承诺完成，无论它们成功还是失败

### 使用目录


在前面的例子中，用到了 `mkdir（）` 函数在将文件写入目录之前创建一个目录。除此之外，还有其他的方法可以让我们实现文件的遍历或者动态创建目录。来看下面的例子，结合了几个文件系统操作。


```javascript
import { mkdir, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

async function processDirectory(dirPath) {
  try {
    // 如果目录不存在就创建
    await mkdir("processed", { recursive: true });

    // 访问目录中的文件列表
    const files = await readdir(dirPath);

    for (const file of files) {
      const filePath = join(dirPath, file);
      const stats = await stat(filePath);

      if (stats.isFile()) {
        console.log(`Processing file: ${file} (${stats.size} bytes)`);
      }
    }
  } catch (error) {
    console.error("Directory processing failed:", error.message);
    throw error;
  }
}

await processDirectory("./uploads");
```


这个例子中展示了在文件处理时高频使用的几个重要 Node.js API。

- **`mkdir('processed', { recursive: true })`** 创建一个名为“processed”的新目录。 `递归：true` 类似于 Unix 系统中的 `mkdir -p`。如果目录已存在，不会出错。
- **`readdir（dirPath）`** 读取目录的内容并返回文件和目录名称的数组。这是 `ls` 或 `dir` 命令的异步等效项，返回指定目录中所有内容的列表。
- **`stat（filePath）`** 检索有关文件或目录的详细信息，包括大小、创建时间、修改时间以及它是文件还是目录。返回的 stats 对象提供 `isFile（）` 、`isDirectory（）` 等方法和 `size` 等属性。
- **`join（dirPath， file）`** 安全地将目录和文件名组合成一个完整的路径，在不同作系统上正确处理路径分隔符（Windows 使用 `\\`，类 Unix 系统使用 `/`）。

### 引用与脚本相关的文件


在 Node.js 应用程序中处理文件时，通常需要引用相对于当前脚本位置的文件。现代 Node.js 提供了 `import.meta.dirname`（类似于旧 `__dirname`）来获取当前模块的目录：


```javascript
import { readFile } from "node:fs/promises";
import { join } from "node:path";

async function loadConfig() {
  try {
    // 从当前目录读取config.json
    const configPath = join(import.meta.dirname, "config.json");
    const configData = await readFile(configPath, "utf8");
    return JSON.parse(configData);
  } catch (error) {
    console.error("Failed to load config:", error.message);
    throw error;
  }
}

async function loadTemplate() {
  // 从当目录中的templates中访问email.html
  const templatePath = join(import.meta.dirname, "templates", "email.html");
  return await readFile(templatePath, "utf8");
}

const config = await loadConfig();
const emailTemplate = await loadTemplate();
```


这种方法比使用 `“./config.json”` 等相对路径可靠得多，因为 `import.meta.dirname` 始终引用包含脚本文件的目录，无论 Node.js 进程是从哪里开始的。这可以防止脚本在从自己的目录运行时工作，但在从其他地方运行时失败的常见问题。


### 异步与同步文件操作：何时使用哪个


Node.js 还提供文件作的同步版本，例如 `readFileSync（）` 和 `writeFileSync（）：`


```javascript
import { readFileSync, writeFileSync } from "node:fs";

try {
  const data = readFileSync("config.json", "utf8");
  const config = JSON.parse(data);

  console.log("Configuration loaded:", config);
} catch (error) {
  console.error("Failed to read config file:", error.message);
}

try {
  const userData = { name: "John Doe", email: "john@example.com" };
  const jsonData = JSON.stringify(userData);

  writeFileSync("user-data.json", jsonData, "utf8");

  console.log("User data saved successfully!");
} catch (error) {
  console.error("Failed to save user data:", error.message);
}
```


这些函数是同步的：它们会阻止事件循环，直到操作完成。


**我的建议：我通常更倾向于尽可能使用异步方法以保持一致性。** 这可以保持代码库的统一性，并防止在意外位置意外阻塞事件循环。Node.js 增加了对**顶级 await** 的支持（能够在异步函数之外使用 `await`），因此使用异步文件作与使用同步文件作一样简单。


但是，如果关心极致的性能，在某些情况下，同步方法更适合。同步方法有时会稍快一些，因为它们不需要将控制权交还给事件循环，例如，在读取文件的情况下，文件系统作完成后，文件的内容立即可用，而无需等待事件循环捕获事件并将控制权交还给我们的代码。


简而言之，具体情况具体分析。


Never Use Sync Methods in Concurrent Environments


### 永远不要在并发环境中使用同步方法


**不要在并发环境（如 Web 服务器）中使用同步方法。** 当同步读取或写入文件时，会阻止事件循环，在此期间不会处理其他用户请求。


这可能会给用户带来明显的延迟 - 如果文件作需要 100 毫秒，则在此期间尝试访问服务器的每个用户都将遇到 100 毫秒的延迟。在 Web 应用程序中，这是不可接受的。


**安全同步方法：**

- CLI 工具和脚本
- 构建流程
- 非并发应用程序

**尽量避免在以下情况下使用同步方法：**

- Web 服务器（Express、Fastify 等）
- 实时应用程序
- 任何并发环境

## 处理大文件


`readFile`方法读取文件的时候，会将所有内容立刻加载到内存中。在读取大文件时，可能会导致几个问题：

1. **内存不足错误** \- 程序可能会崩溃
2. **性能差** \- 内存使用率高会影响其他操作

### 大文件的内存注意事项


虽然 Node.js 增加了缓冲区限制（理论最大值现在约为 9 PB，而 32 位架构的原始限制为 ~1GB，64 位架构的原始限制为 ~2GB），但一次性将大量文件加载到内存中依然是不合理的。


可以检查系统上的当前缓冲区限制：


```javascript
import buffer from "node:buffer";

console.log("Max buffer size:", buffer.constants.MAX_LENGTH);
console.log("Max string length:", buffer.constants.MAX_STRING_LENGTH);

const maxSizeGB = (buffer.constants.MAX_LENGTH / (1024 * 1024 * 1024)).toFixed(
  2
);
console.log(`That's approximately ${maxSizeGB} GB`);
```


尽管理论上 Node.js 可以处理非常大的缓冲区，但尝试将大文件读入内存可能会导致实际问题：


```javascript
import { readFile } from "node:fs/promises";

try {
  console.log("Attempting to read large file...");
  const hugeFile = await readFile("massive-dataset.csv", "utf8");
  console.log("File loaded successfully!");
} catch (error) {
  if (error.code === "ERR_FS_FILE_TOO_LARGE") {
    console.log("File exceeds buffer limits!");
  } else if (error.code === "ENOMEM") {
    console.log("Not enough memory available!");
  } else {
    console.log("Error loading file:", error.message);
  }
}
```


即使在技术上可行的情况下，一次将大量文件加载到内存中，可能导致内存压力、性能下降和用户体验不佳。可以使用流或文件句柄以增量方式处理大文件。


## 使用文件句柄进行高级 Node.js 文件作


那么如何在不耗尽内存的情况下处理这些海量文件呢？当需要对文件作进行更多控制时，Node.js 提供使用文件句柄的较低级别 API。


这种方法允许您以增量方式读取和写入文件，从而对内存使用进行细粒度控制。


### 打开和使用文件句柄


```javascript
import { open } from "node:fs/promises";

async function readFileInChunks(filePath) {
  let fileHandle;

  try {
    // 打开一个文件句柄
    fileHandle = await open(filePath, "r");

    const chunkSize = 1024; // 每次访问 1KB
    const buffer = Buffer.alloc(chunkSize);
    let position = 0;
    let totalBytesRead = 0;

    while (true) {
      // 从当前位置访问chunk
      const result = await fileHandle.read(buffer, 0, chunkSize, position);

      if (result.bytesRead === 0) {
        // 结束
        break;
      }

      // 处理 chunk
      const chunk = buffer.subarray(0, result.bytesRead);
      console.log(
        `>>> Read ${result.bytesRead} bytes:`,
        chunk.toString("utf8")
      );

      position += result.bytesRead;
      totalBytesRead += result.bytesRead;
    }

    console.log(`>>> Total bytes read: ${totalBytesRead}`);
  } catch (error) {
    console.error("Error reading file:", error.message);
    throw error;
  } finally {
    // 总是在结束之后关闭句柄
    if (fileHandle) {
      await fileHandle.close();
    }
  }
}

await readFileInChunks("large-file.txt");
```


这个例子演示了在 Node.js 中使用文件句柄的核心概念。`open（）` 函数创建一个文件句柄，表示与文件的连接，将 `“r”` 作为第二个参数传递，以指示我们要打开文件进行读取。


`read（）` 方法允许我们从文件中的特定位置读取特定数量的字节。在循环中，一次读取 1KB 的块，在移动到下一个块之前处理每个块。无论文件大小如何，这种方法都可以保持较低的内存使用量和可预测性。


最重要的是，需要确保清理资源，无论一切顺利还是出现错误，都会执行清理代码（调用 `fileHandle.close（）`），
始终关闭文件句柄，未能关闭文件句柄可能会导致资源泄漏，并最终导致应用程序用完可用的文件描述符。


### 增量写入文件


假设我们需要一个包含一百万个唯一优惠券代码的文件，以便以后打印。将它们全部预加载到内存中会很浪费，因此我们流式传输工作：小批量生成代码并将每个批次附加到文件中。


```javascript
import { open } from "node:fs/promises";

function generateVoucherCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function generateVoucherFile(filePath, totalVouchers) {
  let fileHandle;

  try {
    fileHandle = await open(filePath, "w");

    const chunkSize = 1000; // Generate 1000 vouchers per chunk
    let position = 0;
    let vouchersGenerated = 0;

    while (vouchersGenerated < totalVouchers) {
      const vouchersInThisChunk = Math.min(
        chunkSize,
        totalVouchers - vouchersGenerated
      );
      const vouchers = [];

      for (let i = 0; i < vouchersInThisChunk; i++) {
        vouchers.push(generateVoucherCode());
      }

      const chunk = vouchers.join("\\n") + "\\n";
      const buffer = Buffer.from(chunk, "utf8");

      const result = await fileHandle.write(buffer, 0, buffer.length, position);

      position += result.bytesWritten;
      vouchersGenerated += vouchersInThisChunk;

      console.log(`Generated ${vouchersGenerated}/${totalVouchers} vouchers`);
    }

    console.log(`Successfully generated ${totalVouchers} voucher codes!`);
  } catch (error) {
    console.error("Error generating voucher file:", error.message);
    throw error;
  } finally {
    if (fileHandle) {
      await fileHandle.close();
    }
  }
}

await generateVoucherFile("voucher-codes.txt", 1_000_000);
```


这个例子展示了如何在不占用内存的情况下有效地生成和写入大量数据。`open（）` 函数创建一个带有 `'w'` 标志的文件句柄，该文件将打开文件进行写入（如果文件不存在，则创建它，如果存在，则截断它）。


`write（）` 方法获取一个缓冲区并将其写入特定位置的文件。在示例中，手动跟踪位置并在每次写入作后递增位置。
这可确保每个凭证代码块按顺序写入文件，而不会覆盖以前的数据。


这种方法的精妙之处在于，无论生成的是 100 万个代码还是 1000 万个代码，我们在任何给定时间都只在内存中保留 1,000 个优惠券代码。这使内存使用量保持恒定且可预测。


就像读取一样，使用 `finally` 块来确保文件句柄通过 `fileHandle.close（）` 正确关闭，从而防止资源泄漏并允许 Node.js 清理文件描述符。


### 为什么文件句柄是低级的 API


虽然文件句柄可以让你精确控制，但它们需要手动管理很多细节：

- **缓冲区管理** \- 需要分配和管理缓冲区
- **位置跟踪** \- 必须跟踪读/写位置
- **错误处理** \- 要处理的更复杂的错误场景
- **资源清理** \- 必须记住关闭文件句柄

这种低级方法很强大，但很冗长。对于大多数用例，有一个更好的解决方案：**Node.js 流** 。


## Node.js 流：内存高效的文件处理


文件句柄为我们提供了控制权，但它们需要大量的手动工作。流提供了低级文件操作的内存效率，并且 API 更加人性化。它们非常适合处理大型文件，无需将所有内容加载到内存中。


### 了解 Stream 的优势


流具有几个关键优势：

1. **内存效率** \- 逐块处理数据
2. **可组合性** \- 将多个作链接在一起
3. **背压处理** \- 自动管理快速生产者和慢速消费者
4. **事件驱动** \- 在数据可用时对其做出反应

### 使用流读取文件


现在来构建一个 CLI 实用程序，它获取任意大小的文本文件并计算其中的字符数和行数，同时几乎不使用任何内存。


```javascript
import { createReadStream } from "node:fs";

async function processLargeFile(filePath) {
  const readStream = createReadStream(filePath, {
    encoding: "utf8",
  });

  let lineCount = 0;
  let charCount = 0;

  readStream.on("data", (chunk) => {
    charCount += chunk.length;
    lineCount += (chunk.match(/\\n/g) || []).length;

    console.log(`Processed chunk: ${chunk.length} characters`);
  });

  readStream.on("end", () => {
    console.log(`File processing complete!`);
    console.log(`Total characters: ${charCount}`);
    console.log(`Total lines: ${lineCount}`);
  });

  readStream.on("error", (error) => {
    console.error("Stream error:", error.message);
  });
}

await processLargeFile("huge-log-file.txt");
```


使用 `createReadStream（）` 创建一个可读的流，并设置事件处理程序来处理数据流过。


这里的主要优点是我们以增量方式处理文件 - 每个块在读取后立即被处理，而无需等待整个文件加载到内存中。这使得使用恒定的、可预测的内存量处理任何大小的文件成为可能。
流发出三个重要事件： `数据` （当块可用时）、 `结束` （当整个文件被读取时）和`错误` （如果出现问题）。


此模式非常适合分析日志文件、处理 CSV 数据或任何需要检查文件内容而无需立即将所有内容加载到内存中的场景。


### UTF-8 编码和多字节字符处理


将数据分块到任意字节窗口（默认为 64KB）可能会截断块之间的多字节字符。通过指定`编码： 'utf8'`，流会自动为我们处理多字节 UTF-8 字符。


例如，一个 2 字节字符的第一个字节可能位于一个块的末尾，第二个字节位于下一个块的开头。


Node.js 会处理好 - 它会将不完整的多字节字符从一个块移动到下一个块，因此每个块都保证包含一个有效的 UTF-8 字符串。


### 使用流写入文件


现在用流的方式实现优惠券代码生成器。


```javascript
import { once } from "node:events";
import { createWriteStream } from "node:fs";

function generateVoucherCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function generateVoucherFile(filePath, totalVouchers) {
  const writeStream = createWriteStream(filePath);

  const chunkSize = 1000;
  let vouchersGenerated = 0;
  let hasError = false;

  writeStream.on("error", (err) => {
    console.error("Error writing to file:", err);
    hasError = true;
  });

  while (vouchersGenerated < totalVouchers && !hasError) {
    const vouchersInThisChunk = Math.min(
      chunkSize,
      totalVouchers - vouchersGenerated
    );
    const vouchers = [];

    for (let i = 0; i < vouchersInThisChunk; i++) {
      vouchers.push(generateVoucherCode());
    }

    const chunk = `${vouchers.join("\\n")}\\n`;
    const buffer = Buffer.from(chunk, "utf8");

    const canContinue = writeStream.write(buffer);
    if (!canContinue) {
      await once(writeStream, "drain");
    }

    vouchersGenerated += vouchersInThisChunk;

    console.log(`Generated ${vouchersGenerated}/${totalVouchers} vouchers`);
  }

  console.log(`Successfully generated ${totalVouchers} voucher codes!`);
  writeStream.end();
}

await generateVoucherFile("voucher-codes.txt", 1_000_000);
```


`createWriteStream（）` 函数创建一个可写流，可以以增量方式向其提供数据。与之前的文件句柄方法不同，不需要手动跟踪文件位置 - 流在每次写入后自动为我们推进其内部游标。


在这个例子中，没有使用 try/catch 块，而是设置了一个设置 `hasError` 标志的错误事件处理程序。这种事件驱动的方法使流能够自然地管理错误传播。


`canContinue` 变量涉及到一个重要概念： **背压处理** 。当 `writeStream.write（）` 返回 `false` 时，表示内部缓冲区已满，我们应该暂停直到 'drain' 事件触发。这可以防止在我们生成数据的速度超过写入磁盘的速度时内存积累。


相比文件句柄版本，在流版本中，我们消除了手动位置跟踪，简化了控制流程，并且实现了自动缓冲。


### 流合成和处理


流最强大的功能之一是它们的可组合性 - 可以组合不同的流来创建复杂的数据处理管道：


```javascript
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

function generateVoucherCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

class VoucherGeneratorStream extends Readable {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _read(_size) {
    const chunk = `${generateVoucherCode()}\\n`;
    this.push(chunk);
  }
}

const totalVouchers = 1_000_000;
const sourceStream = new VoucherGeneratorStream().take(totalVouchers);
const destinationStream = createWriteStream("voucher-codes.txt");

try {
  await pipeline(sourceStream, destinationStream);
  console.log(`Successfully generated ${totalVouchers} voucher codes!`);
} catch (err) {
  console.error("Pipeline failed:", err);
}
```


相比之前的凭证生成器，这个例子提供了更简洁、更易读的实现。来看看是什么让这种方法更加优雅：


**自定义可读流** ：我们创建一个 `VoucherGeneratorStream` 类，用于扩展 Node.js 的`可读`流。每当流需要更多数据时，就会调用 `_read（）` 方法 - 它每次调用生成一个凭证代码并将其推送到流。在构造函数中使用 `objectMode： true`，它告诉流将每个凭证字符串视为一个单独的块，而不是尝试将多个字符串缓冲在一起。


有**限制的无尽流** ： `VoucherGeneratorStream` 本质上是无穷无尽的 - 它会一直生成优惠券代码。这就是 `.take（totalVouchers）` 函数的使用场景。将无尽流限制在恰好 100 万个凭证，一旦达到该限制就会自动结束流。

> 截止到 Node.js v25.0.0, 这个方法依然是实验性的。

drain**自动管道管理** ：`pipeline（）` 函数是奇迹发生的地方。它将凭证生成器流连接到文件写入流，自动处理数据流、背压和错误传播。当生成器生成数据的速度快于文件写入速度时，`pipeline（）` 会自动暂停生成器，直到文件流赶上，无需手动 `canContinue` 检查或`drain`事件处理。


### 何时使用流


在以下情况是最佳选择：

- **处理大文件** （超过 100MB 的任何文件）
- **实时数据处理** （日志、实时数据馈送）
- **内存有限** （云函数、容器）
- **需要可组合性** （多个处理步骤）
- **处理未知文件大小** （用户上传、网络数据）

## Node.js 文件作：最佳实践总结


至此，本文从简单的基于 Promise 的方法到高级流模式，涵盖了 Node.js 中的文件操作。下面是总结的一些指导原则，可做参考：

1. **结合实际场景，选择正确的方法** ：
- **小文件 （< 100MB）：** 将 `fs/promises` 与 `readFile（）` 和 `writeFile（）` 一起使用
- **大文件或未知大小** ：将流与 `createReadStream（）` 和 `createWriteStream（）` 一起使用
- **需要精确控制** ：使用带有 `open（）` 和手动读/写作的文件句柄
- **CLI 工具和脚本** ：可以接受同步方法（`readFileSync（）`、`writeFileSync（）`）
- **Web 服务器和并发应用** ：尽量使用异步方法，有些场景可以考虑同步，比如加载小文件或者一些配置。
1. **利用并发性获得更好的性能** ：
- 当所有操作都必须成功时，使用 `Promise.all（）`
- 当可以容忍部分失败时，使用 `Promise.allSettled（）`
- 尽可能同时读取/写入多个文件
1. **处理特定错误** ：

    处理特定的错误代码以向用户提供有意义的反馈或采取特定的纠正措施是一种很好的做法：


    ```javascript
    try {
      // 文件操作
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("File not found");
      } else if (error.code === "EACCES") {
        console.log("Permission denied");
      } else if (error.code === "ENOSPC") {
        console.log("No space left on device");
      } else {
        console.log("Unexpected error:", error.message);
      }
    }
    ```

2. 对**流使用适当的缓冲区大小** ：

    Stream 对象会将数据分块加载到内部缓冲区中。默认块大小为 64KB（如果使用对象模式，则为 16 个对象），这对于大多数用例来说是一个很好的平衡。但是，您可以在创建流时调整 `highWaterMark` 选项，以根据需求优化性能。在处理大量数据时，如果可以分配更多内存，则增加块大小可以减少 I/O 作次数并提高吞吐量。


    ```javascript
    const stream = createReadStream(path, {
      highWaterMark: 128 * 1024, // 128KB chunks
    });
    ```

3. **始终清理资源** ：

    使用文件句柄或流时，确保在结束的时候关闭句柄，防止避免资源泄漏。使用 `finally` 块或事件处理程序来保证即使遇到错误也能进行清理。


    ```javascript
    try {
      const handle = await open(path, 'r')
    } finally {
      await handle?.close()
    }
    
    stream.on('error', () => stream.destroy())
    ```


    使用 `pipeline（）` 时，它会自动。


    ```javascript
    await pipeline(source, transform, destination)
    ```

4. **使用现代 JavaScript 模式** ：
    - 并发作的数组解构
    - 用于数据转换的 Promise 链
    - 使用 `try/catch` 块正确处理错误
