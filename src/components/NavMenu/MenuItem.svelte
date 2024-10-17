<script lang="ts">
  export let onClick: Function = null;
  export let className: Stirng = "";
</script>

<div
  class={`${className} p-2 rounded-full hover:bg-gray-300`}
  on:click={onClick}
>
  <slot />
</div>