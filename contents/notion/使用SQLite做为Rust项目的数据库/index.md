---
title: 使用SQLite做为Rust项目的数据库
categories: 技术应用
status: publish
date: 2022-01-21T22:28:00.000+08:00
tags:
  - SQLite
  - Rust
cover: https://www.notion.so/images/page-cover/met_goya_1789.jpg

---


在使用 Rust 开发应用时，需要用到 SQLite 做为应用的本地数据库。在目前Rust的生态中，SQLite相关的 Crate 还是挺多的。我选择了 [**Diesel**](https://github.com/diesel-rs/diesel) 这个ORM库。原因无他，文档全，star多，使用相对简单。本文我将通过一个简单的案例，演示如何使用 Diesel，在 SQLite 中实现对数据的 CRUD。

## 安装依赖

首先将Diesel添加到项目依赖中，Diesel推荐使用 `.env` 文件来管理项目的环境变量，所以还需要再加上 dotenv这个工具。

```yaml
[dependencies]
diesel = { version = "1.4.4", features = ["postgres"] }
dotenv = "0.15.0"
```

初次之外，Diesel提供一个独立的命令行工具：diesel-cli，用以帮助管理项目。这是一个独立的包，不会影响项目的结构和代码。只需要安装在系统中即可。

```yaml
cargo install diesel-cli
```

diesel 是一个支持MySQL，PostgreSQL和SQLite的ORM工具。这三种数据库都有各自的依赖。

- [**libpq**](https://www.postgresql.org/docs/current/libpq.html) PostgreSQL 依赖的客户端二进制

- [**libmysqlclient**](https://dev.mysql.com/doc/c-api/8.0/en/c-api-implementations.html)  MySQL 依赖的客户端二进制

- [**libsqlite3**](https://www.sqlite.org/index.html) SQlite 依赖的客户端二进制

默认情况下，diesel-cli 在安装时会检查这些依赖，你可以事先在你的操作系统中安装好对应的依赖，也可以在安装cli时使用`-no-default-features` 跳过。你也可以在安装时指定对应的数据库。

```bash
cargo install diesel_cli --no-default-features --features postgres
cargo install diesel_cli --no-default-features --features sqlite
```

## 在项目中设置Diesel

Diesel 通过设置的环境变量 **DATABASE_URL** 找到我们的数据库。在项目中创建 `.env` 文件做为项目的环境相关的配置文件，通过dotenv来解析。比如，将SQLite的DB文件放在项目根目录中。

```yaml
echo DATABASE_URL=./my.db > .env
```

然后为项目添加依赖。

```json
[dependencies]
diesel = { version = "^1.1.0", features = ["sqlite"] }
dotenv = "0.9.0"
```

接下来就可以初始化数据库，创建脚本了。

```bash
diesel setup
diesel migration generate create_posts
```

如果一切顺利的话，项目中会出现一个 `my.db` 文件和一个 `migrations` 目录。在 `migrations`
目录中有一个`up.sql`和一个`down.sql`。`migrations` 中文件可以帮我们在项目开发过程中，高效演进和完善数据库模型。当你在对数据库进行migration时，实际上是执行了这个版本中的`up.sql`。而在回滚时，执行的则是`down.sql`。

另外 setup 时还会创建一个`diesel.toml` 。这是 diesel-cli 在当前项目中的配置文件，CLI 默认会从Cargo.toml文件所在的目录中查找这个文件。当然你也可以通过环境变 **DIESEL_CONFIG_FILE**修改。配置文件在创建时会自动填入以下配置，这段配置指定了 diesel 创建的数据库 schema 保存的文件路径。

```sql
[print_schema]
file = "src/schema.rs"
```

## 创建数据库模型

接下来创建第一个版本的数据库模型。分别修改`up.sql` 和`down.sql`。

```sql
CREATE TABLE posts (
  id INTEGER NOT NULL PRIMARY KEY,
  title VARCHAR NOT NULL,
  body TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT 'f'
)
```

```sql
DROP TABLE channels
```

SQL语句准备就绪，我们可以试着使用这个版本。

```sql
diesel migration run 
```

通常来说，如果命令执行成功，会在 src 目录下创建一个 `schema.rs`。

```rust
table! {
    posts (id) {
        id -> Integer,
        title -> Text,
        body -> Text,
        published -> Bool,
    }
}
```

> 前文提到过数据库schema输出的路径可以通过diesel.toml 设置

每次执行 diesel migration run 或者 diesel migration redo 时，新的schema都会创建并输出到目录中。

## 写点代码试试

现在项目准备就绪了，我们写一点Rust代码，实现post数据的展示。首先先实现数据库的连接。

### 连接数据库，创建 Post 结构体

在`src/lib.rs`中实现连接数据库的逻辑。

```rust
pub mod schema;
pub mod models;
#[macro_use]
extern crate diesel;
extern crate dotenv;

use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use dotenv::dotenv;
use std::env;

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}
```

然后在`src/models.rs`中创建刚才声明的两个 Module。

```rust
#[derive(Queryable)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub body: String,
    pub published: bool,
}
```

`#[derive(Queryable)]` 将生成从 SQL 查询加载 Post 结构所需的所有代码。数据库的schema由Diesel自动创建，这一点已经在前文中提及，这里就不再赘述。

### 读取 Post 数据

接下来实现一个简单的数据读取的过程。新建文件`src/bin/show_posts.rs` ，这个文件做的事情是连接数据库、查询数据和输出数据。

```rust
extern crate diesel_demo;
extern crate diesel;

use self::diesel_demo::*;
use self::models::*;
use self::diesel::prelude::*;

fn main() {
    use diesel_demo::schema::posts::dsl::*;

    let connection = establish_connection();
    let results = posts.filter(published.eq(true))
        .limit(5)
        .load::<Post>(&connection)
        .expect("Error loading posts");

    println!("Displaying {} posts", results.len());
    for post in results {
        println!("{}", post.title);
        println!("----------\n");
        println!("{}", post.body);
    }
}
```

试着执行`cargo run --bin show_posts`看看效果，编译通过之后控制台会输出以下内容：

```bash
Displaying 0 posts
```

### 写入 Post 数据

因为现在数据库中还没有数据，我们需要创建Post数据。首先在`src/models.rs`中定义结构体`NewPost`，然后在`src/lib.rs`中实现`create_post`。

```rust
use super::schema::posts;

#[derive(Insertable)]
#[table_name="posts"]
pub struct NewPost<'a> {
    pub title: &'a str,
    pub body: &'a str,
}
```

```rust
use self::models::{Post, NewPost};

pub fn create_post<'a>(conn: &SqliteConnection, title: &'a str, body: &'a str) -> usize {
    use schema::posts;

    let new_post = NewPost {
        title,
        body,
    };

    diesel::insert_into(posts::table)
        .values(&new_post)
        .execute(conn)
        .expect("Error saving new post")
}
```

现在已经万事俱备，接下来新建`src/bin/write_post.rs`，实现写入一条Post的逻辑。

```rust
extern crate diesel_demo;
extern crate diesel;

use self::diesel_demo::*;
use std::io::{stdin, Read};

fn main() {
    let connection = establish_connection();

    println!("What would you like your title to be?");
    let mut title = String::new();
    stdin().read_line(&mut title).unwrap();
    let title = &title[..(title.len() - 1)]; // Drop the newline character
    println!("\nOk! Let's write {} (Press {} when finished)\n", title, EOF);
    let mut body = String::new();
    stdin().read_to_string(&mut body).unwrap();

    let post = create_post(&connection, title, &body);
    println!("\nSaved draft {} with id {}", title, post.id);
}

#[cfg(not(windows))]
const EOF: &'static str = "CTRL+D";

#[cfg(windows)]
const EOF: &'static str = "CTRL+Z";
```

首先创建一个数据库的连接，在打印一句提示语之后，调用Rust内置的stdin，获取IO输入。最后使用两个条件编译，针对不同系统绑定结束的快捷键。

让我们试着执行写入逻辑的脚本`cargo run --bin write_post`。如果编译成功的话，你可以在控制台进行用户交互了。下图是一个演示效果的截图。

![](images/779b1e07ee39b94e.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=1c84a7b45a4c7aa203b4a2cf4720b26db360e6265382b8686c331644eba75dc9&X-Amz-SignedHeaders=host&x-id=GetObject)

### 修改记录的数据

现在我们已经成功写入了一条数据，但是执行`cargo run --bin show_posts` 并不会返回我们预期的数据。因为上一步虽然写入了一条Post数据，但是数据的`published`默认是`false`。而show_posts中数据查询的逻辑是`.filter(published.eq(true))` ，这样无法查找出想要的数据，我们需要提供修改数据的能力。新建`src/bin/publish_post.rs`，对数据进行修改。

```rust
extern crate diesel_demo;
extern crate diesel;

use self::diesel::prelude::*;
use self::diesel_demo::*;
use self::models::Post;
use std::env::args;

fn main() {
    use diesel_demo::schema::posts::dsl::{posts, published};

    let id = args().nth(1).expect("publish_post requires a post id")
        .parse::<i32>().expect("Invalid ID");
    let connection = &mut establish_connection();

    let _ = diesel::update(posts.find(id))
        .set(published.eq(true))
        .execute(connection)
        .expect(&format!("Unable to find post {}", id));

    let post: models::Post = posts
        .find(id)
        .first(connection)
        .unwrap_or_else(|_| panic!("Unable to find post {}", id));
    println!("Published post {}", post.title);
}
```

执行 `cargo run --bin publish_post 1`

![](images/9134c35c628f67c0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=a74cce1a1bb1d1faf6cb4639fc249c9efe0fb825804885236c3ce6b47f42334d&X-Amz-SignedHeaders=host&x-id=GetObject)

数据修改成功！再次执行 show_post 命令查看返回的结果。

![](images/ec96be125b72af5e.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=d3bb3f02e7e84a74996192ed44fd32239e29e416a28447657e7a9d38a8eebae8&X-Amz-SignedHeaders=host&x-id=GetObject)

### 删除 Post 数据

到目前为止，CRUD中的”CRU”都已经实现了，现在就差最后的“D”，也就是删除操作了。按照前面的思路，我们依样画葫芦，创建`src/bin/delete_post.rs`，在这个文件中实现数据库数据的删除。

```rust
use diesel::prelude::*;
use diesel_demo_step_3_sqlite::*;
use std::env::args;

fn main() {
    use diesel_demo_step_3_sqlite::schema::posts::dsl::*;

    let target = args().nth(1).expect("Expected a target to match against");
    let pattern = format!("%{}%", target);

    let connection = &mut establish_connection();
    let num_deleted = diesel::delete(posts.filter(title.like(pattern)))
        .execute(connection)
        .expect("Error deleting posts");

    println!("Deleted {} posts", num_deleted);
}
```

执行 `cargo run --bin delete_post Good` 将会删除数据。

## 结束语

Diesel 是一个相当不错的ORM库，社区活跃，文档详细。针对不同类型数据的接入都有详细的代码案例，极大降低了学习和使用的成本。未来将结合具体的案例展示更加详细和深入的使用教程。
