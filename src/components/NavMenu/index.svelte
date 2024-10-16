<script>
	import MenuItem from "./MenuItem.svelte";
  import { Home, ScrollTextIcon, Code, Moon, Sun, Baby } from "lucide-svelte";
  import { mode } from 'mode-watcher';
</script>

<div
  class="grid grid-cols-4 gap-4 fixed bottom-0 left-1/2 translate-x-[-50%] rounded-full"
>
  <MenuItem><Home strokeWidth={1.5} size={18} /></MenuItem>
  <MenuItem><ScrollTextIcon strokeWidth={1.5} size={18} /></MenuItem>
  <MenuItem><Code strokeWidth={1.5} size={18} /></MenuItem>
  <MenuItem><Baby strokeWidth={1.5} size={18} /></MenuItem>
  <div></div>
  <MenuItem>
    <Moon strokeWidth={1.5} size={18} />
    <Sun strokeWidth={1.5} size={18} />
  </MenuItem>
</div>
