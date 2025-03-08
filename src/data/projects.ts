import { Globe, Github } from "lucide-svelte";

export const PROJECTS = [
  {
    name: "Lettura: Follow your favorite content and never miss a story",
    description: "基于 Tauri 框架构建的跨平台 RSS 桌面阅读器，简洁美观的界面、便捷的键盘快捷键。",
    url: "https://github.com/zhanglun/lettura",
    thumbnail: "",
    logo: "/assets/lettura-icon.png",
    image: "/assets/lettura-icon.png",
    dates: "",
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
        icon: Github,
      },
    ],
  },
  {
    name: "Pavo: Easily customize and change your desktop background",
    description: "一款跨平台桌面壁纸程序，使用Bing每日一图，基于Rust Tauri开发，支持自动和手动切换壁纸。",
    url: "https://github.com/zhanglun/pavo",
    thumbnail: "",
    logo: "/assets/icon.png",
    image: "/assets/pavo.jpeg",
    dates: "",
    technologies: ["tauri", "svelte", "tailwindcss"],
    links: [
      {
        type: "Source",
        href: "https://github.com/zhanglun/pavo",
        icon: Github,
      },
    ],
  },
  {
    name: "BookWise: book wise read wise",
    description: "一款正在开发的阅读软件，目标是为用户提供更好的阅读、学习和笔记体验。",
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
        icon: Github,
      },
    ],
    dates: "",
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
    description: "为 Gatsby.js 创建的个人博客主题",
    url: "https://github.com/zhanglun/gatsby-theme-facile",
    thumbnail: "",
    logo: "/assets/icon.png",
    video: "/assets/2.webm",
    dates: "",
    technologies: ["gatsby", "react", "tailwindcss", "typescript"],
    links: [
      {
        type: "Source",
        href: "https://github.com/zhanglun/gatsby-theme-facile",
        icon: Github,
      },
    ],
  },
  {
    name: "notify",
    description: "Notify Component",
    url: "https://github.com/zhanglun/notify",
    thumbnail: "",
    logo: "/assets/icon.png",
    image: "/assets/icon.png",
    dates: "",
    technologies: ["javascript", "css", "html"],
    links: [
      {
        type: "Source",
        href: "https://github.com/zhanglun/notify",
        icon: Github,
      },
    ],
  },
  {
    name: "hexo-theme-Tinny",
    description: "A theme for Hexo",
    url: "https://github.com/zhanglun/hexo-theme-Tinny",
    thumbnail: "",
    logo: "/assets/icon.png",
    image: "/assets/icon.png",
    dates: "",
    technologies: ["hexo", "css", "html"],
    links: [
      {
        type: "Source",
        href: "https://github.com/zhanglun/hexo-theme-tinny",
        icon: Github,
      },
    ],
  },
  {
    name: "bluerobin",
    description: "online todo list based on Vue ecosystem",
    url: "https://github.com/zhanglun/bluerobin",
    thumbnail: "",
    logo: "/assets/icon.png",
    image: "/assets/bluerobin.png",
    dates: "",
    technologies: ["vue", "css", "html"],
    links: [
      {
        type: "Source",
        href: "https://github.com/zhanglun/bluerobin",
        icon: Github,
      },
    ],
  },
];
