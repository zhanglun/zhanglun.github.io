// 游戏场景侧的构建期数据读取:town.astro 把 TownData 序列化在
// <script type="application/json" id="town-data"> 里,场景与 HUD 各自
// 解析(DOM 是两个模块实例间唯一可靠的共享通道,勿改回模块单例)。
// 数据缺失(理论上只有静态导出异常时)一律返回空壳,交互降级隐藏。

export interface TownDataClient {
  diary: {
    title: string;
    date: string;
    desc: string;
    href: string;
    tags: string[];
  }[];
  posts: { t: string; d: string; h: string; y: number; tags: string[] }[];
  shelves: { label: string; from: number; to: number }[];
  tags: { name: string; count: number }[];
  projects: {
    name: string;
    desc: string;
    href: string;
    tech: string;
    open: boolean;
  }[];
  stats: { posts: number; days: number; tags: number; since: string };
  socials: { name: string; href: string }[];
  quote: { text: string; from: string; href: string; date: string } | null;
  latest: { title: string; href: string; date: string; fresh: boolean } | null;
  about: { author: string; bio: string };
  guestbook: {
    repoIssue: string;
    letters: { from: string; date: string; text: string }[];
  };
}

const EMPTY: TownDataClient = {
  diary: [],
  posts: [],
  shelves: [],
  tags: [],
  projects: [],
  stats: { posts: 0, days: 0, tags: 0, since: "" },
  socials: [],
  quote: null,
  latest: null,
  about: { author: "", bio: "" },
  guestbook: { repoIssue: "", letters: [] },
};

let cached: TownDataClient | null = null;

export function townData(): TownDataClient {
  if (cached === null) {
    let parsed: TownDataClient = EMPTY;
    try {
      const raw = document.getElementById("town-data")?.textContent;
      if (raw) parsed = { ...EMPTY, ...JSON.parse(raw) };
    } catch {
      parsed = EMPTY;
    }
    cached = parsed;
  }
  return cached;
}
