<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import clsx from "clsx";

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<div
  class={clsx(
    "rounded-lg border bg-card text-card-foreground shadow-sm",
    className
  )}
  {...$$restProps}
>
  <slot />
</div>
