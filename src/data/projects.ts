import { Globe, CodeXml } from "lucide-react";

export const PROJECTS = [
  {
    name: "amber: your personal web shelf",
    shortName: "Amber",
    sprite: "/ara/projects/chest.png",
    description:
      "把网页保存成可长期阅读的个人档案：新内容先进入收件箱，安顿后上架；可按标签浏览，并从标题、正文、来源和标签中找回旧内容。",
    url: "https://github.com/zhanglun/amber",
    thumbnail: "",
    logo: "/assets/icon.png",
    image: "/assets/icon.png",
    dates: "",
    open: true,
    technologies: ["typescript", "hono", "prisma", "postgresql"],
    links: [
      {
        type: "Source",
        href: "https://github.com/zhanglun/amber",
        icon: CodeXml,
      },
    ],
  },
  {
    name: "Lettura: Follow your favorite content and never miss a story",
    shortName: "Lettura",
    sprite: "/ara/projects/crate.png",
    description:
      "基于 Tauri 框架构建的跨平台 RSS 桌面阅读器，简洁美观的界面、便捷的键盘快捷键。",
    url: "https://github.com/zhanglun/lettura",
    thumbnail: "",
    logo: "/assets/lettura-icon.png",
    image: "/assets/lettura-icon.png",
    dates: "",
    open: true,
    technologies: [
      "tauri",
      "rust",
      "react",
      "tailwindcss",
      "typescript",
      "radix UI",
    ],
    links: [
      {
        type: "Website",
        href: "https://zhanglun.github.io/lettura/",
        icon: Globe,
      },
      {
        type: "Source",
        href: "https://github.com/zhanglun/lettura",
        icon: CodeXml,
      },
    ],
  },
  {
    name: "Pavo: Easily customize and change your desktop background",
    shortName: "Pavo",
    sprite: "/ara/projects/flower.png",
    description:
      "一款跨平台桌面壁纸程序，使用Bing每日一图，基于Rust Tauri开发，支持自动和手动切换壁纸。",
    url: "https://github.com/zhanglun/pavo",
    thumbnail: "",
    logo: "/assets/icon.png",
    image: "/assets/pavo.jpeg",
    dates: "",
    open: true,
    technologies: ["tauri", "svelte", "tailwindcss"],
    links: [
      {
        type: "Source",
        href: "https://github.com/zhanglun/pavo",
        icon: CodeXml,
      },
    ],
  },
  {
    name: "BookWise: book wise read wise",
    shortName: "BookWise",
    sprite: "/ara/projects/shelf.png",
    description:
      "一款正在开发的阅读软件，目标是为用户提供更好的阅读、学习和笔记体验。",
    url: "https://github.com/zhanglun/bookwise",
    thumbnail: "",
    logo: "/assets/icon.png",
    video: "/assets/1.webm",
    links: [
      {
        type: "Website",
        href: "https://zhanglun.github.io/bookwise/",
        icon: Globe,
      },
      {
        type: "Source",
        href: "https://github.com/zhanglun/bookwise",
        icon: CodeXml,
      },
    ],
    dates: "",
    open: true,
    technologies: [
      "electron",
      "postgreSQL",
      "pglite",
      "react",
      "tailwindcss",
      "typescript",
      "radix UI",
    ],
  },
  {
    name: "Gatsby blog theme",
    shortName: "Facile",
    sprite: "/ara/projects/book.png",
    description:
      "给 Gatsby 用的博客主题。列表、标签和正文排版先在这一套里定下来；这份日志后来也从它长出来。",
    url: "https://github.com/zhanglun/gatsby-theme-facile",
    thumbnail: "",
    logo: "/assets/icon.png",
    video: "/assets/2.webm",
    dates: "",
    open: false,
    technologies: ["gatsby", "react", "tailwindcss", "typescript"],
    links: [
      {
        type: "Source",
        href: "https://github.com/zhanglun/gatsby-theme-facile",
        icon: CodeXml,
      },
    ],
  },
  {
    name: "notify",
    shortName: "Notify",
    sprite: "/ara/projects/sign.png",
    description:
      "给网页加一条会自己出现、停一会儿再走开的通知。当时用来提示操作结果，铺已经收了，源码还在。",
    url: "https://github.com/zhanglun/notify",
    thumbnail: "",
    logo: "/assets/icon.png",
    image: "/assets/icon.png",
    dates: "",
    open: false,
    technologies: ["javascript", "css", "html"],
    links: [
      {
        type: "Source",
        href: "https://github.com/zhanglun/notify",
        icon: CodeXml,
      },
    ],
  },
  {
    name: "hexo-theme-Tinny",
    shortName: "Tinny",
    sprite: "/ara/projects/well.png",
    description:
      "给 Hexo 用的极简主题，管列表和文章页。静态博客还靠生成器的时候开的铺，现在只留源码。",
    url: "https://github.com/zhanglun/hexo-theme-Tinny",
    thumbnail: "",
    logo: "/assets/icon.png",
    image: "/assets/icon.png",
    dates: "",
    open: false,
    technologies: ["hexo", "css", "html"],
    links: [
      {
        type: "Source",
        href: "https://github.com/zhanglun/hexo-theme-tinny",
        icon: CodeXml,
      },
    ],
  },
  {
    name: "bluerobin",
    shortName: "BlueRobin",
    sprite: "/ara/projects/sack.png",
    description:
      "浏览器里的待办清单，用 Vue 把事项记在线上。练手铺，开过一阵，现在不当日常工具了。",
    url: "https://github.com/zhanglun/bluerobin",
    thumbnail: "",
    logo: "/assets/icon.png",
    image: "/assets/bluerobin.png",
    dates: "",
    open: false,
    technologies: ["vue", "css", "html"],
    links: [
      {
        type: "Source",
        href: "https://github.com/zhanglun/bluerobin",
        icon: CodeXml,
      },
    ],
  },
];
