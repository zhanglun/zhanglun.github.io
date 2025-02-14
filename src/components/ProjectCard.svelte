<script lang="ts">
  import { marked } from "marked";
  import Badge from "@/components/Badge/Badge.svelte";

  let _class = "";
  export { _class as class };
  export let title: string;
  export let href: string = "";
  export let description: string;
  export let dates: string;
  export let tags: readonly string[];
  export let link: string = "";
  export let image: string = "";
  export let video: string = "";
  export let links: { icon: any; type: string; href: string }[] = [];
</script>

<!-- Card -->
<div class="item h-full flex flex-col overflow-hidden">
  <a href={href || "#"} class="block cursor-pointer col-start-1 col-end-7">
    {#if video}
      <video
        class="pointer-events-none mx-auto h-40 w-full object-cover object-top"
        src={video}
        autoplay
        loop
        muted
      ></video>
    {:else}
      <img
        class="h-40 w-full overflow-hidden object-cover object-top"
        src={image}
        alt={title}
      />
    {/if}
  </a>
  <!-- Card Header -->
  <div class="content px-2 flex flex-col col-start-7 col-end-12 row-span-1">
    <div class="space-y-1">
      <!-- Card Title -->
      <div class="title mt-1 text-2xl">{title}</div>
      <time class="font-sans">{dates}</time>
      <div class="hidden font-sans text-xs underline print:visible">
        {link?.replace("https://", "").replace("www.", "").replace("/", "")}
      </div>
      <div
        class="description prose dark:prose-invert max-w-full text-pretty font-sans text-xs text-muted-foreground"
      >
        {@html marked(description)}
      </div>
    </div>
    <!-- Card Content -->
    <div class="mt-auto flex flex-col">
      {#if tags && tags.length > 0}
        <div class="mt-2 flex flex-wrap gap-1">
          {#each tags as tag}
            <Badge class="text-smallcaps badge">
              {tag}
            </Badge>
          {/each}
        </div>
      {/if}
    </div>
    <!-- Card Footer -->
    <div class="pb-2 flex items-center pt-2">
      {#if links && links.length > 0}
        <div class="flex flex-row flex-wrap items-start gap-1">
          {#each links as link}
            <a href={link?.href} target="_blank">
              <Badge
                class="flex gap-1 px-2 py-1 text-[10px] items-center justify-center"
              >
                <!-- {link.icon} -->
                <svelte:component
                  this={link.icon}
                  class="mb-px"
                  size={12}
                  strokeWidth={1.5}
                />
                {link.type}
              </Badge>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .item {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: span 12;
    grid-template-rows: auto;
    position: relative;
    grid-gap: 20px;
    gap: 20px;
    --overlap: calc(3px + 0.3vw);
  }

  .content:hover .title {
    background-image: linear-gradient(
      transparent var(--overlap),
      var(--highlightColor) var(--overlap)
    );
    color: var(--invertedTextColor);
  }

  .content:hover .description {
    background-image: linear-gradient(
      transparent calc(var(--overlap) * 0.6),
      var(--highlightColor) calc(var(--overlap) * 0.6)
    );
    color: var(--invertedTextColor);
  }
  .content:hover .badge {
    background: var(--highlightColor);
    color: var(--invertedTextColor);
    border-color: var(--invertedTextColor);
  }
</style>
