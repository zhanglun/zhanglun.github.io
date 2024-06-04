import type { SocialObjects } from "./types";

export const SITE = {
  website: "https://zhanglun.github.io",
  title: "张小伦的网络日志",
  author: "zhanglun",
  description: "Halo! 我是 zhanglun 👋🏼 一位软件开发工程师。",
  ogImage: "site-image.png",
  lightAndDarkMode: true,
  postPerPage: 8,
  social: {
    twitter: "zhanglun1410",
  },
};
export const MENU = [
  {
    id: "home",
    name: "Home",
    url: "/",
  },
  {
    id: "blogs",
    name: "Blogs",
    url: "/blogs",
  },
  {
    id: "archive",
    name: "Archive",
    url: "/archive",
  },
  {
    id: "projects",
    name: "Projects",
    url: "/projects",
  },
  {
    id: "about",
    name: "About",
    url: "/about",
  },
];

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 30,
  height: 30,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/zhanglun",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://github.com/zhanglun",
    linkTitle: `${SITE.title} on Facebook`,
    active: false,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/zhanglun1410/",
    linkTitle: `${SITE.title} on Instagram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: false,
  },
  {
    name: "Mail",
    href: "mailto:zhanglun1410@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/zhanglun1410",
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
  {
    name: "Twitch",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on YouTube`,
    active: false,
  },
  {
    name: "WhatsApp",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on WhatsApp`,
    active: false,
  },
  {
    name: "Snapchat",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Snapchat`,
    active: false,
  },
  {
    name: "Pinterest",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Pinterest`,
    active: false,
  },
  {
    name: "TikTok",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on TikTok`,
    active: false,
  },
  {
    name: "CodePen",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on CodePen`,
    active: false,
  },
  {
    name: "Discord",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Discord`,
    active: false,
  },
  {
    name: "GitLab",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on GitLab`,
    active: false,
  },
  {
    name: "Reddit",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Reddit`,
    active: false,
  },
  {
    name: "Skype",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Skype`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Steam`,
    active: false,
  },
  {
    name: "Telegram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Telegram`,
    active: false,
  },
  {
    name: "Mastodon",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Mastodon`,
    active: false,
  },
];

export const PROJECTS = [
  {
    name: "Lettura",
    description: "基于 Tauri 的跨平台 RSS 桌面阅读器",
    url: "https://github.com/zhanglun/lettura",
    thumbnail: "",
    logo: "/assets/lettura-icon.png",
  },
  {
    name: "BookWise",
    description: "book wise read wise",
    url: "https://github.com/zhanglun/bookwise",
    thumbnail: "",
    logo: "/assets/icon.png",
  },
  {
    name: "Gatsby blog theme",
    description: "为Gatsby.js创建的个人博客主题",
    url: "https://github.com/zhanglun/gatsby-theme-facile",
    thumbnail: "",
    logo: "/assets/icon.png",
  },
  {
    name: "Pavo",
    description: "跨平台的桌面壁纸程序",
    url: "https://github.com/zhanglun/pavo",
    thumbnail: "",
    logo: "/assets/icon.png",
  },
  {
    name: 'notify',
    description: 'Notify Component',
    url: 'https://github.com/zhanglun/notify',
    thumbnail: "",
    logo: "/assets/icon.png",
  },
  {
    name: 'hexo-theme-Tinny',
    description: 'A theme for Hexo',
    url: 'https://github.com/zhanglun/hexo-theme-Tinny',
    thumbnail: "",
    logo: "/assets/icon.png",
  },
  {
    name: 'bluerobin',
    description: 'online todo list based on Vue ecosystem',
    url: 'https://github.com/zhanglun/bluerobin',
    thumbnail: "",
    logo: "/assets/icon.png",
  },
];