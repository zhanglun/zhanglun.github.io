const BASE = "/pixel";

const cur = (name: string): string => `${BASE}/img/cursor/cursor-${name}.svg`;
const fill = (id: string, frame: string): string =>
  `${BASE}/img/top/icons/animation/characters-filled/${id}/${frame}.svg`;
const ch = (id: string, frame: string): string =>
  `${BASE}/img/top/icons/animation/characters/${id}/${frame}.svg`;
const fx = (kind: string, frame: string): string =>
  `${BASE}/img/top/icons/animation/effects/${kind}/${frame}.svg`;
const icon = (name: string): string => `${BASE}/img/top/icons/list/${name}.svg`;

export type CursorKey =
  | "question"
  | "annoying"
  | "heart"
  | "robot"
  | "voice"
  | "bunjiro"
  | "mail";

export const CURSORS: Record<CursorKey, { src: string; color: string }> = {
  question: { src: cur("question"), color: "#eeff5a" },
  annoying: { src: cur("annoying"), color: "#63ddff" },
  heart: { src: cur("heart"), color: "#ff4130" },
  robot: { src: cur("robot"), color: "#63ddff" },
  voice: { src: cur("voice"), color: "#00b995" },
  bunjiro: { src: cur("bunjiro"), color: "#00b995" },
  mail: { src: cur("mail"), color: "#ff4130" },
};

export const TRAIL_DEFAULT = "#111114";

export type FaceFrames = {
  def: string;
  happy: string;
  sad: string;
  up: string[];
  down: string[];
  side: string[];
};

const faceFrames = (id: string): FaceFrames => ({
  def: fill(id, "default"),
  happy: fill(id, "happy"),
  sad: fill(id, "sad"),
  up: [1, 2, 3, 4].map(n => fill(id, `look-up-0${n}`)),
  down: [1, 2, 3, 4].map(n => fill(id, `look-down-0${n}`)),
  side: [1, 2, 3].map(n => fill(id, `side-look-0${n}`)),
});

export const FACES: Record<string, FaceFrames> = {
  "teacher-01": faceFrames("teacher-01"),
  "teacher-02": faceFrames("teacher-02"),
  "teacher-03": faceFrames("teacher-03"),
};

export const KIDS = ["kid-01", "kid-02", "kid-03"] as const;

export const kidWalk = (id: string): [string, string] => [
  ch(id, "side-turning-01"),
  ch(id, "side-turning-02"),
];

export const KID_IDLE = (id: string): string => ch(id, "default");
export const KID_HAPPY = (id: string): string => ch(id, "happy");

export const BIG_KID = {
  walk: kidWalk("big-kid"),
  def: ch("big-kid", "default"),
  happy: ch("big-kid", "happy"),
};

export const ROBOT = {
  closed: `${BASE}/img/top/icons/animation/robot-flat-filled/closed.svg`,
  open: `${BASE}/img/top/icons/animation/robot-flat-filled/open.svg`,
};

export const EFFECT = {
  heart: ["default", "effect-01", "effect-02", "effect-03"].map(f =>
    fx("heart", f)
  ),
  glitter: ["effect-01", "effect-02", "effect-03"].map(f =>
    fx("glitter-3-frame", f)
  ),
};

export const URLS = {
  mark: `${BASE}/img/top/icons/logo/mark.svg`,
  mail: icon("mail"),
  chevronDown: icon("chevron-down"),
  question: icon("question"),
  musicNote: icon("music-note"),
  handStop: icon("hand-stop"),
  heartRed: `${BASE}/img/top/icons/colored/red/list/heart.svg`,
};

export const ALL_ASSET_URLS: string[] = [
  ...Object.values(URLS),
  ...Object.values(CURSORS).map(c => c.src),
  ...Object.values(FACES).flatMap(f => [
    f.def,
    f.happy,
    f.sad,
    ...f.up,
    ...f.down,
    ...f.side,
  ]),
  ...KIDS.flatMap(id => [...kidWalk(id), KID_IDLE(id), KID_HAPPY(id)]),
  ...BIG_KID.walk,
  BIG_KID.def,
  BIG_KID.happy,
  ROBOT.closed,
  ROBOT.open,
  ...EFFECT.heart,
  ...EFFECT.glitter,
  `${BASE}/img/top/icons/animation/characters/kid-01/side-turning-01.svg`,
  `${BASE}/img/top/icons/animation/characters/kid-01/side-turning-02.svg`,
];

export class Assets {
  private map = new Map<string, HTMLImageElement>();

  get(src: string): HTMLImageElement {
    return this.map.get(src) as HTMLImageElement;
  }

  async load(
    urls: string[],
    onProgress?: (done: number, total: number) => void
  ): Promise<void> {
    const unique = [...new Set(urls)];
    let done = 0;
    await Promise.all(
      unique.map(
        src =>
          new Promise<void>(resolve => {
            const img = new Image();
            img.onload = () => {
              done += 1;
              onProgress?.(done, unique.length);
              resolve();
            };
            img.onerror = () => {
              console.error("pixel demo: missing asset", src);
              done += 1;
              onProgress?.(done, unique.length);
              resolve();
            };
            this.map.set(src, img);
            img.src = src;
          })
      )
    );
  }
}
