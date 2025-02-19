import { Globe, Github } from "lucide-svelte";

export const PROJECTS = [
  {
    name: "Lettura",
    description: "基于 Tauri 的跨平台 RSS 桌面阅读器",
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
    name: "Pavo",
    description: "跨平台的桌面壁纸程序",
    url: "https://github.com/zhanglun/pavo",
    thumbnail: "",
    logo: "/assets/icon.png",
    image: "/assets/pavo.jpeg",
    dates: "",
    technologies: ["tauri", "yew", "tailwindcss"],
    links: [
      {
        type: "Source",
        href: "https://github.com/zhanglun/pavo",
        icon: Github,
      },
    ],
  },
  {
    name: "BookWise",
    description: "book wise read wise",
    url: "https://github.com/zhanglun/bookwise",
    thumbnail: "",
    logo: "/assets/icon.png",
    image: "/assets/icon.png",
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
    image: "/assets/icon.png",
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
