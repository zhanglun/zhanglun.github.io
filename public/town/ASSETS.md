# /town 素材来源

- `sv/` — **Serene Village revamped** by LimeZu（itch.io），16x16 像素素材。
  由 `scripts/extract-town-sv.mjs` 从原始 tileset（Serene_Village_16x16.png）
  按包围盒裁切；门/篝火/动态水面(water-waves,14 帧,备用)来自包内
  Animated stuff；`lake.png` 湖心岛为表内湖泊区块(40,50 起 180x80)
  垫 12 列草底合成 + 左右切边方齿草岸封盖（草/深水色取自同表）。
  许可：**CC-BY 4.0**（https://creativecommons.org/licenses/by/4.0/ ）——
  可自由使用、修改、再分发，须署名。来源：https://limezu.itch.io/serenevillagerevamped
- `char/` — 村民待机动画，来自 **Modern Interiors Free** by LimeZu
  （https://limezu.itch.io/moderninteriors ，Characters_free/ 目录原样复制）。
  ⚠️ 免费版 LICENSE 为**仅非商业**使用；本站为个人非商业博客。若站点引入
  广告等商业行为，需购买完整版或移除该目录。
- `animal/` — 野生动物（兔/狐/鹿/野猪/黑松鸡）与牧场动物（羊/猪/公鸡/火鸡/牛），
  来自 CraftPix 免费包 **Free Top-Down Hunt Animals** 与 **Free Top-Down Animals Farm**：
  https://craftpix.net/freebies/free-top-down-hunt-animals-pixel-sprite-pack/
  https://craftpix.net/freebies/free-top-down-animals-farm-pixel-art-sprites/
  由 `scripts/extract-town-craftpix.mjs` 把 32px 帧缩 50% 回 16px
  （牛为 64px 帧缩半回 32px；源 zip 在 `~/Downloads/素材/`，
  解压到 /tmp/craftpix-src 后重跑脚本幂等）。
- `furn/` — 室内家具 9 件（书架/厨房置物架/高柜/单人床/台钳工作台/
  圆桌餐位/炼金台/洗漱角/红地毯），来自 CraftPix 免费包
  **Main Character's Home – Free Top-Down Pixel Art Asset**：
  https://craftpix.net/freebies/main-characters-home-free-top-down-pixel-art-asset/
  16px 原生网格直接裁切（Interior.png，坐标由连通域扫描+放大目检定界，
  勿凭直觉改）。
- `ui/panel.png` — **Free Basic Pixel Art UI for RPG**（CraftPix）的素面面板
  48x40 切片，HUD 纸面容器 border-image 九宫格用（CSS slice 5）：
  https://craftpix.net/freebies/free-basic-pixel-art-ui-for-rpg/
- `gen/` — **程序化生成**纹理（`scripts/make-slime.mjs` 的史莱姆、
  木箱/木桶），本站原创绘制，无授权限制。

已移除：Mystic Woods 免费版（非商业 + 禁再分发，公开仓库属灰色地带，
2026-10-25 起被 SV/MI 方案替换）；更早的 Kenney Tiny 系列、Tiny 16 Basic、
Ara 站内素材、Pixels AGPL 角色一并移除。

游戏代码原创；架构模式受 Pixels 开源客户端启发，未复制其代码。

## 许可说明

- `sv/`：CC-BY 4.0，署名 LimeZu 即可（本文件即署名）。
- `char/`：Modern Interiors 免费版，仅非商业，来源已注明。
- `animal/`、`ui/`：**CraftPix Freebie License**（craftpix.net/file-licenses/）：
  可商用、免署名、无限项目；**禁止再分发源文件**（提交公开仓库与 MI 免费版
  同属灰区，商业化盘点时一并处理）；禁止用于训练 AI 模型。
- `gen/`：本站原创，无授权限制。
