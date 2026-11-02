// 咖啡馆友链的数据源:每位朋友 = 咖啡馆里的一位村民 NPC + 友链墙一行。
// ⚠️ 下面是示例占位数据(域名 example.com 系),发布前替换成真实朋友,
// 顺便把描述改成一句「像 TA 本人会说的话」;村民外观按数组顺序取
// amelia/bob/adam,超过 3 位时咖啡馆只坐前 3 位,友链墙全列。
export interface Friend {
  name: string;
  desc: string;
  href: string;
}

export const FRIENDS: Friend[] = [
  {
    name: "云间居",
    desc: "写前端也写生活，泡咖啡的时间比写代码长。",
    href: "https://example.com",
  },
  {
    name: "山下志",
    desc: "记录爬山、做饭和折腾家庭实验室的日常。",
    href: "https://example.org",
  },
  {
    name: "夜航西飞",
    desc: "深夜写作者，更新全看月相。",
    href: "https://example.net",
  },
];
