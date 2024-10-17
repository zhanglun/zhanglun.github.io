<script lang="ts">
  import { Home, ScrollTextIcon, Code, Baby, Sun, Moon } from "lucide-svelte";
  import { mode, toggleMode } from "mode-watcher";

  $: theme = $mode;

  type Direction = 'left' | 'right'

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
  class="grid grid-cols-5 gap-2 fixed top-4 left-1/2 translate-x-[-50%] rounded-full border border-neutral-200 bg-white p-2 z-10"
>
  <a
    href="/"
    class="flex items-center justify-center p-2 rounded-full hover:bg-gray-300"
  >
    <Home strokeWidth={1.5} size={16} />
  </a>
  <a
    href="/blog"
    class="flex items-center justify-center p-2 rounded-full hover:bg-gray-300"
  >
    <ScrollTextIcon strokeWidth={1.5} size={16} />
  </a>

  <a
    href="/projects"
    class="flex items-center justify-center p-2 rounded-full hover:bg-gray-300"
  >
    <Code strokeWidth={1.5} size={16} />
  </a>
  <a
    href="/about"
    class="flex items-center justify-center p-2 rounded-full hover:bg-gray-300"
  >
    <Baby strokeWidth={1.5} size={16} />
  </a>

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="flex items-center justify-center p-2 rounded-full hover:bg-gray-300"
    on:click={toggleTheme}
  >
    <div
        class:spin-right={spin}
      >
      {#if theme === "dark"}
        <Moon strokeWidth={1.5} size={18} />
      {:else}
        <Sun strokeWidth={1.5} size={18} />
      {/if}
      <span class="sr-only">Toggle theme</span>
    </div>
  </div>
</div>

<style>
  .spin-right {
    animation: spin 575ms cubic-bezier(0.075, 0.82, 0.17, 1.135);
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
