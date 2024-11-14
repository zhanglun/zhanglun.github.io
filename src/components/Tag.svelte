<script lang="ts">
  import { clsx } from "clsx";
  interface Props {
    name: string;
    count: number;
    selected?: Boolean;
    hideCount?: Boolean;
    onClick: () => void;
  }

  const { name, count, hideCount, onClick, selected } = $props();
  function handleClick() {
    console.log("onClick called");
    onClick();
  }
</script>

<button
  class={clsx(
    "px-2.5 py-1 rounded-lg text-xsfont-medium  capitalize flex items-center gap-2 border ",
    {
      "text-orange-600 bg-orange-50/80 hover:bg-orange-100 border-orange-200":
        !selected,
    },
    {
      "bg-orange-600 text-white border-orange-600 hover:text-orange-100 hover:bg-orange-600":
        selected,
    }
  )}
  onclick={handleClick}
>
  <span class="text-xs">{name}</span>
  {#if !hideCount}
    <span class="text-[10px]">{count}</span>
  {/if}
</button>
