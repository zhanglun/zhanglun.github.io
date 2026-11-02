// 小镇构建期数据聚合:把博客/项目/友链/站点信息压成一份 JSON,
// 由 town.astro 序列化进页面(#town-data),HUD 与游戏场景各自读取。
// 全部联动走构建期注入,无运行时 API 依赖(见 town/README.md「与博客的联动」)。

import type { CollectionEntry } from "astro:content";
import { SITE, SOCIALS } from "@config";
import { PROJECTS } from "@data/projects";
import { GUESTBOOK } from "@data/guestbook";

export interface TownPost {
  t: string; // 标题
  d: string; // 日期 YYYY.MM.DD
  h: string; // /blog/<slug>
  y: number; // 年份(书架归档分组键)
  tags: string[];
}

export interface TownShelf {
  label: string; // 书架标签:「2026」或「更早」
  from: number; // 年份区间 [from, to]
  to: number;
}

export interface TownQuote {
  text: string;
  from: string;
  href: string;
  date: string;
}

export interface TownData {
  diary: {
    title: string;
    date: string;
    desc: string;
    href: string;
    tags: string[];
  }[];
  posts: TownPost[];
  shelves: TownShelf[];
  tags: { name: string; count: number }[]; // 高频标签(广场图腾)
  projects: {
    name: string;
    desc: string;
    href: string;
    tech: string;
    open: boolean;
  }[];
  stats: { posts: number; days: number; tags: number; since: string };
  socials: { name: string; href: string }[];
  quote: TownQuote | null; // 每日一句(按日期确定性抽取)
  latest: { title: string; href: string; date: string; fresh: boolean } | null;
  about: { author: string; bio: string };
  guestbook: {
    repoIssue: string;
    letters: { from: string; date: string; text: string }[];
  };
}

// 最多 6 排书架 = 最近 5 个年份 + 「更早」兜底,覆盖全部文章
const SHELF_YEARS = 5;

const dot = (dt: Date) =>
  `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(
    dt.getDate()
  ).padStart(2, "0")}`;

export function buildTownData(sorted: CollectionEntry<"blogs">[]): TownData {
  const posts: TownPost[] = sorted.map(p => ({
    t: p.data.title,
    d: dot(p.data.date),
    h: `/blog/${p.id}`,
    y: p.data.date.getFullYear(),
    tags: p.data.tags ?? [],
  }));

  // 书架:最近 5 个年份各一排,更早的合并进「更早」
  const years = [...new Set(posts.map(p => p.y))].sort((a, b) => b - a);
  const shelves: TownShelf[] = years.slice(0, SHELF_YEARS).map(y => ({
    label: String(y),
    from: y,
    to: y,
  }));
  if (years.length > SHELF_YEARS) {
    shelves.push({ label: "更早", from: 0, to: years[SHELF_YEARS - 1] - 1 });
  }

  // 高频标签(广场图腾,最多 4 根)
  const counts = new Map<string, number>();
  for (const p of posts)
    for (const tg of p.tags) counts.set(tg, (counts.get(tg) ?? 0) + 1);
  const tags = [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // 每日一句:按当天日期确定性抽取,同一天全站一致,零运行时开销
  const now = new Date();
  const seed =
    now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const pick = sorted.length ? sorted[seed % sorted.length] : null;
  const quote: TownQuote | null =
    pick && (pick.data.description || "").trim()
      ? {
          text: pick.data.description!.replace(/\s+/g, " ").slice(0, 90),
          from: pick.data.title,
          href: `/blog/${pick.id}`,
          date: dot(pick.data.date),
        }
      : null;

  const newest = sorted[0]?.data.date;
  const oldest = sorted[sorted.length - 1]?.data.date;
  const fresh =
    newest !== undefined &&
    now.getTime() - newest.getTime() < 7 * 24 * 3600 * 1000;

  return {
    diary: sorted.slice(0, 12).map(p => ({
      title: p.data.title,
      date: dot(p.data.date),
      desc: (p.data.description || "").replace(/\s+/g, " ").slice(0, 80),
      href: `/blog/${p.id}`,
      tags: (p.data.tags ?? []).slice(0, 2),
    })),
    posts,
    shelves,
    tags,
    projects: PROJECTS.map(pr => ({
      name: pr.shortName,
      desc: pr.description.replace(/\s+/g, " ").slice(0, 56),
      href: pr.url,
      tech: pr.technologies.slice(0, 4).join(" · "),
      open: pr.open,
    })),
    stats: {
      posts: posts.length,
      days:
        newest && oldest
          ? Math.max(
              1,
              Math.ceil(
                (newest.getTime() - oldest.getTime()) / (24 * 3600 * 1000)
              )
            )
          : 0,
      tags: counts.size,
      since: oldest ? dot(oldest).slice(0, 7) : "",
    },
    // 只挑真实在用的几个社交出口,配置里大量占位项不进小镇
    socials: SOCIALS.filter(s =>
      ["Github", "Mail", "Twitter", "Instagram"].includes(s.name)
    ).map(s => ({ name: s.name, href: s.href })),
    quote,
    latest:
      newest && posts[0]
        ? {
            title: posts[0].t,
            href: posts[0].h,
            date: posts[0].d,
            fresh,
          }
        : null,
    about: { author: SITE.author, bio: SITE.description },
    guestbook: GUESTBOOK,
  };
}
