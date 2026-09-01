---
title: Lettura 开发日志：SQLite 数据库迁移实践
categories:
  - 技术研究
date: 2024-11-16T21:00:00.000+08:00
tags:
  - 笔记
  - SQLite
  - Rust
draft: false
---

## 背景


在开发 [Lettura](https://github.com/lettura/lettura) RSS 阅读器的过程中，我遇到了一个数据库设计需要优化的场景。最初设计时，`feeds` 表中的 `feed_url` 字段被设置为唯一约束，但在实际使用中发现这个约束可能过于严格。为了支持更灵活的订阅源管理，我决定将其改为 `feed_url` 和 `title` 的组合唯一约束。


## 遇到的问题


在实施数据库迁移时，首先遇到了外键约束违反的错误：


```plain text
Error migrating: QueryError(..., DatabaseError(ForeignKeyViolation, "FOREIGN KEY constraint failed"))
```


这提示我需要仔细处理表之间的关联关系。


## 数据库结构分析


通过查询现有的数据库结构：


```plain text
SELECT sql
FROM sqlite_master
WHERE type='table' AND sql LIKE '%REFERENCES feeds%';
```


发现 `articles` 表通过 `feed_uuid` 字段引用了 `feeds` 表：


```plain text
CREATE TABLE articles (
    -- 其他字段...
    feed_uuid    VARCHAR  NOT NULL,
    FOREIGN KEY (feed_uuid) REFERENCES feeds (uuid)
)
```


## 解决方案


### 完整的迁移脚本


```sql
-- 首先禁用外键约束PRAGMA foreign_keys = OFF;
-- 创建新的 feeds 表CREATE TABLE feeds_new (
    id             INTEGER  NOT NULL PRIMARY KEY,
    uuid           TEXT     NOT NULL UNIQUE,
    title          TEXT     NOT NULL,
    link           TEXT     NOT NULL,
    feed_url       TEXT     NOT NULL,
    feed_type      TEXT     NOT NULL DEFAULT "",
    description    TEXT     NOT NULL DEFAULT "",
    pub_date       DATETIME NOT NULL,
    updated        DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    logo           TEXT     NOT NULL DEFAULT "",
    health_status  INTEGER  NOT NULL DEFAULT (0),
    failure_reason TEXT     NOT NULL DEFAULT "",
    sort           INTEGER  NOT NULL DEFAULT 0,
    sync_interval  INTEGER  NOT NULL DEFAULT 0,
    last_sync_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    create_date    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(feed_url, title)  -- 新的组合唯一约束);
-- 复制 feeds 数据INSERT INTO feeds_new
SELECT * FROM feeds;
-- 创建新的 articles 表CREATE TABLE articles_new (
    id           INTEGER  NOT NULL PRIMARY KEY,
    uuid         VARCHAR  NOT NULL UNIQUE,
    title        VARCHAR  NOT NULL,
    link         VARCHAR  NOT NULL,
    feed_url     VARCHAR  NOT NULL,
    feed_uuid    VARCHAR  NOT NULL,
    description  VARCHAR  NOT NULL,
    author       VARCHAR  NOT NULL,
    pub_date     DATETIME NOT NULL,
    content      VARCHAR  NOT NULL,
    create_date  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_status  INTEGER  NOT NULL DEFAULT 1,
    media_object TEXT,
    starred      INTEGER  NOT NULL DEFAULT 0,
    UNIQUE (link, title),
    FOREIGN KEY (feed_uuid) REFERENCES feeds_new(uuid)
);
-- 复制 articles 数据INSERT INTO articles_new
SELECT * FROM articles;
-- 按顺序删除旧表DROP TABLE articles;
DROP TABLE feeds;
-- 按顺序重命名新表ALTER TABLE feeds_new RENAME TO feeds;
ALTER TABLE articles_new RENAME TO articles;
-- 重新启用外键约束PRAGMA foreign_keys = ON;
```


### 技术要点

1. **外键约束处理**
    - 迁移过程中暂时禁用外键约束
    - 完成后重新启用
    - 确保数据完整性
2. **表依赖关系**
    - `articles` 表依赖于 `feeds` 表
    - 需要按正确顺序处理迁移
3. **SQLite 特性**
    - SQLite 不支持直接修改表约束
    - 需要通过创建新表和数据迁移来实现
    - 使用 ALTER TABLE RENAME 完成表重命名

## 操作顺序

1. **删除表顺序**：
    - 先删除 articles 表（子表）
    - 后删除 feeds 表（父表）
2. **重命名表顺序**：
    - 先重命名 feeds 表（父表）
    - 后重命名 articles 表（子表）

## 最佳实践总结

1. **迁移前准备**
    - 分析表关系
    - 了解现有约束
    - 数据备份
2. **迁移过程**
    - 使用事务确保原子性
    - 临时禁用外键约束
    - 严格按照依赖顺序操作
3. **迁移后检查**
    - 验证数据完整性
    - 测试新约束
    - 确认外键关系

## 结语


在 Lettura 的开发过程中，这次数据库迁移让我深入理解了 SQLite 的一些特性和限制。通过合理的规划和正确的操作顺序，成功实现了数据库结构的优化，同时保证了数据的完整性。这些经验对于其他涉及数据库迁移的场景也很有参考价值。


## 相关链接

- [Lettura GitHub 仓库](https://github.com/lettura/lettura)
- [SQLite 官方文档](https://www.sqlite.org/docs.html)
- [Diesel.rs 文档](https://diesel.rs/guides/getting-started)
