<script lang="ts">
  import { type Variant, badgeVariants } from "./index.js";
  import clsx from "clsx";

  let className: string | undefined | null = undefined;
  export let href: string | undefined = undefined;
  export let variant: Variant = "default";
  export { className as class };
</script>

<svelte:element
  this={href ? "a" : "span"}
  {href}
  class={clsx(badgeVariants({ variant, className }))}
  {...$$restProps}
>
  <slot />
</svelte:element>
