<script lang="ts">
  import { Home, ScrollTextIcon, Code, Baby, Sun, Moon } from "lucide-svelte";
  import { mode, toggleMode } from "mode-watcher";

  $: theme = $mode;

  type Direction = "left" | "right";

  let spinDirection: Direction = "right";
  let spin = false;

  function triggerSpin(duration: number) {
    spin = true;
    setTimeout(() => (spin = false), duration);
  }

  function toggleTheme() {
    triggerSpin(650);

    toggleMode();
  }
</script>

<div
  class="fixed left-1/2 top-0 z-2 w-full max-w-[1728px] translate-x-[-50%] flex gap-1 justify-between p-3"
>
  <div class="flex gap-[2px]">
    <a href="/" class="nav-item-link">
      <svg
        class="logo-icon"
        width="13"
        height="15"
        viewBox="0 0 13 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 14.0578L12.6296 11.302V0.942383L0 3.64711V14.0578Z"
          fill="currentColor"
        ></path></svg
      >
    </a>
    <a href="/blog" class="nav-item-link">
      [B] BLOG
    </a>

    <a href="/projects" class="nav-item-link">
      [P] PROJECT 
    </a>
    <a href="https://github.com/zhanglun" class="nav-item-link">
      [G] GITHUB
    </a>
    <a href="/about" class="nav-item-link">
      [A] ABOUT
    </a>
  </div>

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- <div class="nav-item-link" on:click={toggleTheme}>
    <div class:spin-right={spin}>
      {#if theme === "dark"}
        <Moon strokeWidth={1.5} size={18} />
      {:else}
        <Sun strokeWidth={1.5} size={18} />
      {/if}
      <span class="sr-only">Toggle theme</span>
    </div>
  </div> -->
</div>

<style>
  .spin-right {
    animation: spin 575ms cubic-bezier(0.075, 0.82, 0.17, 1.135);
  }

  .logo-icon {
    display: block;
    color: var(--buttonColor);
  }
  .nav-item-link {
    background: var(--navButtonBG);
    padding: 5px 8px;
    display: flex;
    border-radius: 2px;
    align-items: center;
    justify-content: center;
    font-family: sohne-mono;
    text-transform: uppercase;
    color: var(--buttonColor);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);

    color: var(--squareTextColor,--fontColor);
    font-family: sohne-mono;
    font-size: 12px;
    font-style: normal;
    font-weight: 300;
    letter-spacing: -.012em;
    text-transform: uppercase
  }

  .nav-item-link:hover {
    background: var(--highlightColor);
    color: var(--invertedTextColor);
  }

  @keyframes spin {
    0% {
      transform: scale(0) rotate(0deg);
    }
    100% {
      transform: scale(1) rotate(720deg);
    }
  }
</style>
