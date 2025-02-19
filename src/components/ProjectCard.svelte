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
  <a href={href || "#"} class="block cursor-pointer aspect-square image">
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
        class="w-full overflow-hidden object-cover object-top"
        src={image}
        alt={title}
      />
    {/if}
  </a>
  <!-- Card Header -->
  <div class="content px-2 flex flex-col col-start-7 col-end-12 row-span-1">
    <div class="">
      <!-- Card Title -->
      <span class="title mt-1 mb-3 text-3xl">{title}</span>
      <span class="hidden font-sans text-xs underline print:visible">
        {link?.replace("https://", "").replace("www.", "").replace("/", "")}
      </span>
      <div class="mt-4 mb-4">
        <!-- {@html marked(description)} -->
        <span class="description">{description}</span>
      </div>
    </div>
    <!-- Card Content -->
    <div class="mt-auto flex flex-col">
      {#if tags && tags.length > 0}
        <div class="mt-2 mb-4 flex flex-wrap gap-1">
          {#each tags as tag}
            <Badge>
              {tag}
            </Badge>
          {/each}
        </div>
      {/if}
    </div>
    <!-- Card Footer -->
    <div class="grid grid-cols-2 gap-1">
      {#if links && links.length > 0}
        {#each links as link}
          <a href={link?.href} target="_blank" class="buttonSm">
            {link.type}
          </a>
        {/each}
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
    /* --overlap: calc(3px + 0.3vw); */
    --overlap: 0px;
  }

  .image {
    position: relative;
    background: var(--artBackground);
    cursor: -webkit-grab;
    cursor: grab;
    grid-column: 1 / 7;
    grid-row: span 2;
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
      transparent calc(var(--overlap) * 0.5),
      var(--highlightColor) calc(var(--overlap) * 0.5)
    );
    color: var(--invertedTextColor);
  }

  .content:hover :global(.badge) {
    background: var(--highlightColor);
    color: var(--invertedTextColor);
    border-color: var(--invertedTextColor);
  }

  @media (max-width: 959px) {
    .item {
      grid-column: 1/-1;
    }

    .image {
      grid-column: 1/8;
    }

    .content {
      grid-column: 8/-2;
    }
  }

  @media (max-width: 759px) {
    .item {
      row-gap: 8px;
    }

    .image {
      grid-column: 1/-1;
      grid-row: 1;
    }

    .content {
      grid-column: 1/-1;
      grid-row: 2;
    }
  }
</style>
