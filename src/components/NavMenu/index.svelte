<script lang="ts">
	import ModeToggle from "./ModeToggle.svelte";
  import MenuItem from "./MenuItem.svelte";
  import { Home, ScrollTextIcon, Code, Moon, Sun, Baby } from "lucide-svelte";
  import { mode, toggleMode } from "mode-watcher";
</script>

<div
  class="grid grid-cols-5 gap-4 fixed bottom-0 left-1/2 translate-x-[-50%] rounded-full border border-neutral-200 bg-white p-2 z-10"
>
  <MenuItem><Home strokeWidth={1.5} size={18} /></MenuItem>
  <MenuItem><ScrollTextIcon strokeWidth={1.5} size={18} /></MenuItem>
  <MenuItem><Code strokeWidth={1.5} size={18} /></MenuItem>
  <MenuItem><Baby strokeWidth={1.5} size={18} /></MenuItem>

  <ModeToggle />
</div>
