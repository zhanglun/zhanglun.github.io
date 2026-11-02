// 程序化音效引擎(Web Audio,零素材文件):
// 脚步(噪声爆点)/ 开关门(振荡器滑音)/ 篝火(滤波噪声随机噼啪)/
// 环境层(白昼鸟鸣、夜晚虫鸣、雨天噪声循环,随场景昼夜与天气切换)。
// 默认静音,HUD 🔊 开关持久化 town-sound;AudioContext 在首次开启时创建
// (浏览器自动播放策略要求用户手势,开启按钮本身就是手势)。

export class TownAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private fireGain: GainNode | null = null;
  private fireSrc: AudioBufferSourceNode | null = null;
  private muted = true;
  private stepTimer = 0;
  private fireTimer = 0;
  // 环境层:场景每帧经 setAmbient/setRain 同步状态,本类只负责发声
  private ambKind: "birds" | "crickets" | null = null;
  private ambTimer = 0.5;
  private rainSrc: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  private raining = false;

  get isMuted() {
    return this.muted;
  }

  /** 场景同步环境音:白昼晴 = 鸟鸣,夜晚晴 = 虫鸣,雨中不给鸣虫 */
  setAmbient(kind: "birds" | "crickets" | null): void {
    this.ambKind = kind;
    this.ambTimer = Math.min(this.ambTimer, 0.6);
  }

  /** 雨声循环(滤波白噪声,音量压低) */
  setRain(on: boolean): void {
    if (on === this.raining) return;
    this.raining = on;
    if (this.muted || !this.ctx) return;
    if (on) {
      const ctx = this.ctx;
      const n = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, n, ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const flt = ctx.createBiquadFilter();
      flt.type = "lowpass";
      flt.frequency.value = 850;
      const g = ctx.createGain();
      g.gain.value = 0.055;
      src.connect(flt).connect(g).connect(this.master!);
      src.start();
      this.rainSrc = src;
      this.rainGain = g;
    } else {
      try {
        this.rainSrc?.stop();
      } catch {}
      this.rainSrc = null;
      this.rainGain = null;
    }
  }

  toggle(): boolean {
    this.muted = !this.muted;
    try {
      localStorage.setItem("town-sound", this.muted ? "off" : "on");
    } catch {}
    if (this.muted) {
      this.master?.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.05);
    } else {
      this.ensureCtx();
      this.master!.gain.setTargetAtTime(0.5, this.ctx!.currentTime, 0.05);
      // 静音期间场景仍会同步 raining 状态;开声时若正在雨中,补建雨声循环
      if (this.raining && !this.rainSrc) {
        this.raining = false;
        this.setRain(true);
      }
    }
    return !this.muted;
  }

  /** 从持久化恢复静音状态;返回是否开启 */
  restore(): boolean {
    try {
      this.muted = localStorage.getItem("town-sound") !== "on";
    } catch {}
    if (!this.muted) this.ensureCtx();
    return !this.muted;
  }

  private ensureCtx() {
    if (this.ctx) return;
    const AC = window.AudioContext ?? (window as never as typeof AudioContext);
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
  }

  /** 每帧调用:靠近篝火时随机噼啪 + 环境层调度(dt 秒,距离像素,开火时响) */
  tick(dt: number, campfireDist: number, fireLit: boolean): void {
    if (this.muted || !this.ctx) return;
    this.fireTimer -= dt;
    if (fireLit && campfireDist < 140 && this.fireTimer <= 0) {
      this.fireTimer = 0.08 + Math.random() * 0.25;
      const vol = 0.12 * Math.max(0, 1 - campfireDist / 140);
      this.crackle(vol);
    }
    // 环境层调度:鸟鸣稀疏(3-9s),虫鸣密集(0.9-2.3s)
    if (this.ambKind) {
      this.ambTimer -= dt;
      if (this.ambTimer <= 0) {
        if (this.ambKind === "birds") {
          this.birdChirp();
          this.ambTimer = 3 + Math.random() * 6;
        } else {
          this.cricket();
          this.ambTimer = 0.9 + Math.random() * 1.4;
        }
      }
    }
  }

  /** 鸟鸣:2-3 个短促滑音音节 */
  private birdChirp(): void {
    const ctx = this.ctx!;
    const syllables = 2 + ((Math.random() * 2) | 0);
    for (let s = 0; s < syllables; s++) {
      const t0 = ctx.currentTime + s * (0.12 + Math.random() * 0.06);
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      const base = 2500 + Math.random() * 900;
      o.frequency.setValueAtTime(base, t0);
      o.frequency.linearRampToValueAtTime(base + 500, t0 + 0.05);
      o.frequency.linearRampToValueAtTime(base - 200, t0 + 0.1);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(0.028, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);
      o.connect(g).connect(this.master!);
      o.start(t0);
      o.stop(t0 + 0.13);
    }
  }

  /** 虫鸣:高频三连短脉冲 */
  private cricket(): void {
    const ctx = this.ctx!;
    for (let p = 0; p < 3; p++) {
      const t0 = ctx.currentTime + p * 0.07;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = 4200 + Math.random() * 300;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(0.018, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.045);
      o.connect(g).connect(this.master!);
      o.start(t0);
      o.stop(t0 + 0.06);
    }
  }

  private noiseBurst(
    dur: number,
    freq: number,
    vol: number,
    type: BiquadFilterType
  ) {
    const ctx = this.ctx!;
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const flt = ctx.createBiquadFilter();
    flt.type = type;
    flt.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = vol;
    src.connect(flt).connect(g).connect(this.master!);
    src.start();
  }

  private crackle(vol: number) {
    this.noiseBurst(
      0.04 + Math.random() * 0.05,
      1800 + Math.random() * 2400,
      vol,
      "highpass"
    );
  }

  /** 脚步:行走节奏调用(草地沙沙) */
  footstep(): void {
    if (this.muted || !this.ctx) return;
    this.noiseBurst(0.07, 500 + Math.random() * 300, 0.1, "lowpass");
  }

  /** 开门/关门:短木扣 */
  door(open: boolean): void {
    if (this.muted || !this.ctx) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(open ? 220 : 320, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(
      open ? 330 : 180,
      ctx.currentTime + 0.12
    );
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    o.connect(g).connect(this.master!);
    o.start();
    o.stop(ctx.currentTime + 0.18);
  }
}
