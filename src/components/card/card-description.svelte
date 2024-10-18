<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import clsx from "clsx";

	type $$Props = HTMLAttributes<HTMLParagraphElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<p class={clsx("text-sm text-muted-foreground", className)} {...$$restProps}>
	<slot />
</p>
