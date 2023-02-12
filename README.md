# astro-theme-facile :construction: :WIP:

![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub](https://img.shields.io/github/license/zhanglun/astro-theme-facile?color=%232F3741&style=for-the-badge)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white&style=for-the-badge)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)

astro-theme-facile is a minimal, responsive, accessible and SEO-friendly Astro blog theme. This theme is designed and crafted based on [my personal blog](https://zhanglun.github.io/).

This theme follows best practices and provides accessibility out of the box. Light and dark mode are supported by default. Moreover, additional color schemes can also be configured.

This theme is self-documented \_ which means articles/blogs in this theme can also be considered as documentations. Read [the blog posts](https://zhanglun.github.io/blogs/) or check [the README Documentation Section](#-documentation) for more info.

## 🔥 Features

- [x] super fast performance
- [x] accessible (Keyboard/VoiceOver)
- [x] responsive (mobile ~ desktops)
- [x] SEO-friendly
- [x] light & dark mode
- [x] fuzzy search
- [x] draft posts & pagination
- [x] sitemap & rss feed
- [x] followed best practices
- [x] highly customizable
- [x] dynamic OG image generation for blog posts ([Blog Post](https://zhanglun.github.io/blogsdynamic-og-image-generation-in-astro-theme-facile-blog-posts/))

## 🚀 Project Structure

Inside of astro-theme-facile, you'll see the following folders and files:

```bash
/
├── public/
│   ├── assets/
│   │   └── logo.svg
│   │   └── logo.png
│   └── favicon.svg
│   └── astro-theme-facile-og.jpg
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── socialIcons.ts
│   ├── components/
│   ├── contents/
│   │   └── some-blog-posts.md
│   ├── layouts/
│   └── pages/
│   └── styles/
│   └── utils/
│   └── config.ts
│   └── types.ts
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Any static assets, like images, can be placed in the `public/` directory.

All blog posts are stored in `src/contents/` directory.

## 📖 Documentation

Documentation can be read in two formats\_ _markdown_ & _blog post_.

- Configuration - [markdown](src/contents/how-to-configure-astro-theme-facile-theme.md) | [blog post](https://zhanglun.github.io/blogshow-to-configure-astro-theme-facile-theme/)
- Add Posts - [markdown](src/contents/adding-new-post.md) | [blog post](https://zhanglun.github.io/blogsadding-new-posts-in-astro-theme-facile-theme/)
- Customize Color Schemes - [markdown](src/contents/customizing-astro-theme-facile-theme-color-schemes.md) | [blog post](https://zhanglun.github.io/blogscustomizing-astro-theme-facile-theme-color-schemes/)
- Predefined Color Schemes - [markdown](src/contents/predefined-color-schemes.md) | [blog post](https://zhanglun.github.io/blogspredefined-color-schemes/)

## 💻 Tech Stack

**Main Framework** - [Astro](https://astro.build/)  
**Type Checking** - [TypeScript](https://www.typescriptlang.org/)  
**Component Framework** - [ReactJS](https://reactjs.org/)  
**Styling** - [TailwindCSS](https://tailwindcss.com/)  
**UI/UX** - [Figma](https://figma.com)  
**Fuzzy Search** - [FuseJS](https://fusejs.io/)  
**Icons** - [Boxicons](https://boxicons.com/) | [Tablers](https://tabler-icons.io/)  
**Code Formatting** - [Prettier](https://prettier.io/)  
**Deployment** - [Cloudflare Pages](https://pages.cloudflare.com/)  
**Illustration in About Page** - [https://freesvgillustration.com](https://freesvgillustration.com/)

## 👨🏻‍💻 Running Locally

The easiest way to run this project locally is to run the following command in your desired directory.

```bash
# pnpm 6.x
pnpm create astro@latest --template zhanglun/astro-theme-facile

# pnpm 7+, extra double-dash is needed:
pnpm create astro@latest -- --template zhanglun/astro-theme-facile

# yarn
yarn create astro --template zhanglun/astro-theme-facile
```

## Google Site Verification (optional)

You can easily add your [Google Site Verification HTML tag](https://support.google.com/webmasters/answer/9008080#meta_tag_verification&zippy=%2Chtml-tag) in astro-theme-facile using environment variable. This step is optional. If you don't add the following env variable, the google-site-verification tag won't appear in the html `<head>` section.

```bash
# in your environment variable file (.env)
PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-site-verification-value
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                             |
| :--------------------- | :------------------------------------------------- |
| `pnpm install`          | Installs dependencies                              |
| `pnpm run dev`          | Starts local dev server at `localhost:3000`        |
| `pnpm run build`        | Build your production site to `./dist/`            |
| `pnpm run preview`      | Preview your build locally, before deploying       |
| `pnpm run format:check` | Check code format with Prettier                    |
| `pnpm run format`       | Format codes with Prettier                         |
| `pnpm run cz`           | Commit code changes with commitizen                |
| `pnpm run astro ...`    | Run CLI commands like `astro add`, `astro preview` |
| `pnpm run astro --help` | Get help using the Astro CLI                       |

## ✨ Feedback & Suggestions

If you have any suggestions/feedback, feel free to open an issue if you find bugs or want to request new features.

## 📜 License

Licensed under the MIT License, Copyright © 2023

---

Made with 🤍 by [zhanglun](https://zhanglun.xyz) 👨🏻‍💻

Thanks [Sat Naing](https://satnaing.dev/)