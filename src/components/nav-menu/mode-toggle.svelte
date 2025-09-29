<script lang="ts">
  import MenuItem from "./MenuItem.svelte";
  import { Button } from "bits-ui";
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";

  import { mode, toggleMode } from "mode-watcher";
  $: theme = $mode;

  let spinDirection: "left" | "right" = "right";
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

<MenuItem onClick={toggleTheme}>
  <div
    class:spin-left={spin && spinDirection === "left"}
    class:spin-right={spin && spinDirection === "right"}
  >
    {#if theme === "dark"}
    <Moon
      strokeWidth={1.5}
      size={18}
    />
    {:else}
    <Sun
      strokeWidth={1.5}
      size={18}
    />
    {/if}
    <span class="sr-only">Toggle theme</span>
  </div>
</MenuItem>

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
  .spin-left {
    animation: spin2 575ms cubic-bezier(0.075, 0.82, 0.17, 1.135);
  }
  @keyframes spin2 {
    0% {
      transform: scale(0) rotate(0deg);
    }
    100% {
      transform: scale(1) rotate(-720deg);
    }
  }
</style>
