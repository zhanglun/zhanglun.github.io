// 程序化音效引擎(Web Audio,零素材文件):
// 脚步(噪声爆点)/ 开关门(振荡器滑音)/ 篝火(滤波噪声随机噼啪)。
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

  get isMuted() {
    return this.muted;
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

  /** 每帧调用:靠近篝火时随机噼啪(dt 秒,距离像素,开火时响) */
  tick(dt: number, campfireDist: number, fireLit: boolean): void {
    if (this.muted || !this.ctx) return;
    this.fireTimer -= dt;
    if (fireLit && campfireDist < 140 && this.fireTimer <= 0) {
      this.fireTimer = 0.08 + Math.random() * 0.25;
      const vol = 0.12 * Math.max(0, 1 - campfireDist / 140);
      this.crackle(vol);
    }
  }

  private noiseBurst(dur: number, freq: number, vol: number, type: BiquadFilterType) {
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
    this.noiseBurst(0.04 + Math.random() * 0.05, 1800 + Math.random() * 2400, vol, "highpass");
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
    o.frequency.exponentialRampToValueAtTime(open ? 330 : 180, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    o.connect(g).connect(this.master!);
    o.start();
    o.stop(ctx.currentTime + 0.18);
  }
}
