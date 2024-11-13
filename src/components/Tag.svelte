<script lang="ts">
  // export let name: string;
  // export let count: number = 0;
  // export let hideCount?: Boolean;
  // export let onClick: () => void;

  interface Props {
    name: string;
    count: number;
    hideCount?: Boolean;
    onClick: () => void;
  }

  const { name, count, hideCount, onClick } = $props();
  function handleClick() {
    console.log('onClick called');
    onClick();
  }
</script>

<button
  class="px-2.5 py-1 rounded-lg text-xs text-orange-600 font-medium bg-orange-50/80 capitalize flex items-center gap-2 border border-orange-200"
  onclick={handleClick}
>
  <span class="text-xs">{name}</span>
  {#if !hideCount}
    <span class="text-[10px]">{count}</span>
  {/if}
</button>
