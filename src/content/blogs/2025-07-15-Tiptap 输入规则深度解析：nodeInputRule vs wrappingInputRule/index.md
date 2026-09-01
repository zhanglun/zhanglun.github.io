---
title: Tiptap 输入规则深度解析：nodeInputRule vs wrappingInputRule
categories:
  - 技术研究
date: 2025-07-15T21:12:00.000+08:00
tags:
  - tiptap
  - 笔记
draft: false
---

在 Tiptap 富文本编辑器中，输入规则（Input Rules）是实现 Markdown 风格快捷输入的核心机制。其中 `nodeInputRule` 和 `wrappingInputRule` 是两个重要的输入规则类型，它们有着不同的使用场景和行为模式。本文将深入解析它们的区别、使用场景，以及在实际开发中可能遇到的常见问题。


## 核心概念


### 什么是输入规则？


输入规则是 Tiptap 中用于监听用户输入并自动转换内容为特定节点类型的机制。当用户输入特定的文本模式时，编辑器会自动将其转换为对应的节点结构。


## nodeInputRule vs wrappingInputRule 对比


### 1. nodeInputRule - 原子节点创建器


**核心特点：**

- 创建一个**原子节点**（atom node）
- 替换匹配的文本为新的节点
- 不保留原有内容

**使用场景：**

- 创建不可编辑的原子节点
- 插入图片、视频、数学公式等
- 创建独立的组件块

**代码示例：**


```typescript
// Mermaid 图表节点
addInputRules() {
  return [
    nodeInputRule({
      find: /^```mermaid([a-z]+)?[\\s\\n]$/,
      type: this.type,
      getAttributes: () => ({ code: "" }),
    }),
  ];
}
```


**行为模式：**

1. 用户输入 ````mermaid` 并回车
2. 匹配的文本被完全替换
3. 创建一个空的 Mermaid 节点
4. 光标定位到新节点后

### 2. wrappingInputRule - 包装节点创建器


**核心特点：**

- 创建一个**包装节点**，包含现有内容
- 保留并包装匹配文本前后的内容
- 将现有内容作为子节点

**使用场景：**

- 创建可包含其他内容的容器
- 实现折叠面板、引用块等
- 包装现有文本内容

**代码示例：**


```typescript
// Details 折叠面板
addInputRules() {
  return [
    wrappingInputRule({
      find: /^:::details\\s$/,
      type: this.type,
    }),
  ];
}
```


**行为模式：**

1. 用户输入 `:::details` 并回车
2. 将当前块内容包装在 details 节点内
3. 创建 detailsSummary 和 detailsContent 子节点
4. 光标定位到内容区域

## 实际应用场景对比


### 场景一：数学公式


**使用 nodeInputRule：**


```typescript
// 行内数学公式
addInputRules() {
  return [
    nodeInputRule({
      find: /\\$([^$]+)\\$/,
      type: this.type,
      getAttributes: (match) => ({
        text: match[1].replaceAll("$", ""),
      }),
    }),
  ];
}
```


**行为：** 输入 `$E=mc^2$` → 创建原子节点，不可编辑


### 场景二：引用块


**使用 wrappingInputRule：**


```typescript
// 引用块
addInputRules() {
  return [
    wrappingInputRule({
      find: /^>\\s$/,
      type: this.type,
    }),
  ];
}
```


**行为：** 输入 `>` → 将当前段落包装为引用块，内容可编辑


## 技术实现差异


### 节点结构差异


**nodeInputRule 创建的节点：**


```json
{
  "type": "mermaid",
  "attrs": { "code": "" },
  "content": []
}
```


**wrappingInputRule 创建的节点：**


```json
{
  "type": "details",
  "attrs": { "open": false },
  "content": [
    { "type": "detailsSummary", "content": [] },
    { "type": "detailsContent", "content": [/* 原有内容 */] }
  ]
}
```


### 内容处理方式


**nodeInputRule：**

- 完全替换匹配文本
- 不保留任何原有内容
- 适合创建独立的原子组件

**wrappingInputRule：**

- 保留并重新组织内容
- 将内容作为子节点
- 适合创建容器型组件

## 常见问题与解决方案


### 问题一：原子节点内容占位符错误


**错误信息：**


```plain text
Uncaught RangeError: Content hole not allowed in a leaf node spec
```


**错误原因：**
在原子节点（`atom: true`）的 `renderHTML` 中使用了内容占位符 `0`，但原子节点不应该有内容占位符。


**错误代码：**


```typescript
export const Mermaid = Node.create({
  name: "mermaid",
  group: "block",
  // 缺少 atom: true
  content: "",

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-type": this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0, // ❌ 原子节点不能有内容占位符
    ];
  },
});
```


**正确实现：**


```typescript
export const Mermaid = Node.create({
  name: "mermaid",
  group: "block",
  atom: true,        // ✅ 明确声明为原子节点
  draggable: true,   // ✅ 启用拖拽功能
  content: "",

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-type": this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      // ✅ 原子节点不包含内容占位符
    ];
  },
});
```


### 问题二：节点无法拖拽


**原因：**

- 缺少 `draggable: true` 属性
- 节点类型配置不正确

**解决方案：**


```typescript
export const MyNode = Node.create({
  name: "myNode",
  group: "block",
  atom: true,        // 原子节点
  draggable: true,   // 启用拖拽
  content: "",       // 空内容
});
```


### 问题三：输入规则不触发


**可能原因：**

1. 正则表达式匹配失败
2. 节点类型未正确注册
3. 输入规则优先级问题

**调试方法：**


```typescript
addInputRules() {
  return [
    nodeInputRule({
      find: /^```mermaid([a-z]+)?[\\s\\n]$/,
      type: this.type,
      getAttributes: (match) => {
        console.log('Input rule matched:', match); // 调试日志
        return ({ code: "" });
      },
    }),
  ];
}
```


## 选择指南


### 何时使用 nodeInputRule？


✅ **适用场景：**

- 创建独立的、不可编辑的组件
- 插入媒体内容（图片、视频、音频）
- 创建数学公式、图表等特殊内容
- 需要原子性操作的节点

❌ **不适用场景：**

- 需要包含其他内容的容器
- 需要保留用户输入的内容
- 需要嵌套结构的组件

### 何时使用 wrappingInputRule？


✅ **适用场景：**

- 创建可包含其他内容的容器
- 实现折叠面板、引用块等
- 需要包装现有内容的场景
- 创建有层次结构的组件

❌ **不适用场景：**

- 创建独立的原子组件
- 不需要保留原有内容
- 简单的替换操作

## 实际项目中的应用


### 项目中的 Mermaid 实现


```typescript
// 使用 nodeInputRule 创建原子节点
export const Mermaid = Node.create({
  name: "mermaid",
  group: "block",
  atom: true,        // 原子节点
  draggable: true,   // 可拖拽
  content: "",       // 空内容

  addInputRules() {
    return [
      nodeInputRule({
        find: /^```mermaid([a-z]+)?[\\s\\n]$/,
        type: this.type,
        getAttributes: () => ({ code: "" }),
      }),
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-type": this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      // 原子节点不包含内容占位符
    ];
  },
});
```


### 项目中的 Details 实现


```typescript
// 使用 wrappingInputRule 创建包装节点
export const Details = Node.create({
  name: "details",
  group: "block",
  content: "detailsSummary detailsContent+", // 包含子节点

  addInputRules() {
    return [
      wrappingInputRule({
        find: /^:::details\\s$/,
        type: this.type,
      }),
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "details",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0, // 非原子节点可以包含内容占位符
    ];
  },
});
```


## 最佳实践


### 1. 原子节点设计原则


```typescript
// ✅ 正确的原子节点实现
export const AtomicNode = Node.create({
  name: "atomicNode",
  group: "block",
  atom: true,        // 必须
  draggable: true,   // 如果需要拖拽
  content: "",       // 必须为空

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-type": this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      // 不要包含内容占位符
    ];
  },
});
```


### 2. 包装节点设计原则


```typescript
// ✅ 正确的包装节点实现
export const WrapperNode = Node.create({
  name: "wrapperNode",
  group: "block",
  content: "block+", // 定义允许的内容

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-type": this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0, // 可以包含内容占位符
    ];
  },
});
```


### 3. 输入规则设计原则


```typescript
// ✅ 清晰的输入规则
addInputRules() {
  return [
    nodeInputRule({
      find: /^```(\\w+)\\s$/,  // 明确的匹配模式
      type: this.type,
      getAttributes: (match) => ({
        language: match[1],
      }),
    }),
  ];
}
```


## 总结


`nodeInputRule` 和 `wrappingInputRule` 是 Tiptap 中两种不同的输入规则类型，它们服务于不同的使用场景：

- **nodeInputRule**：创建原子节点，完全替换内容，适合独立组件
- **wrappingInputRule**：创建包装节点，保留并组织内容，适合容器组件

### 关键要点：

1. **原子节点（****`atom: true`****）**：
    - 不能有内容占位符 `0`
    - `content` 必须为空字符串
    - 适合创建独立的、不可编辑的组件
2. **包装节点**：
    - 可以有内容占位符 `0`
    - `content` 定义允许的子节点类型
    - 适合创建容器型组件
3. **常见错误**：
    - 原子节点使用内容占位符 → `Content hole not allowed in a leaf node spec`
    - 缺少 `draggable: true` → 无法拖拽
    - 正则表达式错误 → 输入规则不触发

理解这两种输入规则的区别和正确使用方式，有助于我们更好地设计 Tiptap 扩展，提供更符合用户期望的编辑体验，同时避免常见的实现错误。

