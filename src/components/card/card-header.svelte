<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import clsx from "clsx";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class={clsx("flex flex-col space-y-1.5 p-6", className)} {...$$restProps}>
	<slot />
</div>
