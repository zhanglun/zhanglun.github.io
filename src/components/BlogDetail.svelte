<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import LineHeader from "./LineHeader.svelte";
  import dayjs from "dayjs";
  import Badge from "@/components/Badge/Badge.svelte";
  import PlusIcons from "@/components/PlusIcons.svelte";
  import { onMount } from "svelte";

  const {
    post = {},
    date = new Date(),
    categories = [],
    tags = [],
    remarkPluginFrontmatter = {},
    prefix = "",
  } = $props();

  let visible = $state(true);

  let heroSectionElement: HTMLElement;
  let titleElement: HTMLElement;

  onMount(async () => {
    let callback = (entries, observer) => {
      console.log("🚀 ~ callback ~ entries:", entries[0].intersectionRatio);
      if (entries[0].isIntersecting) {
        visible = false;
        titleElement.style.opacity = 0;
      } else {
        visible = true;
        titleElement.style.opacity = 1;
      }
    };
    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px",
      threshold: 1,
    });

    observer.observe(heroSectionElement);
  });
</script>

<section class="section hero--section" bind:this={heroSectionElement}>
  <PlusIcons />
  <div class="title">
    <h1 class="text-hero">
      {post.title}
    </h1>
  </div>
  <PlusIcons />
</section>
<section class="section body--section">
  <div class="sidebar">
    {#if visible}
      <div
        class="text-lg smart-title"
        transition:slide
        bind:this={titleElement}
      >
        {post.title}
      </div>
    {/if}
    <div class="metadata">
      <LineHeader title="METADATA" />
      <div class="metadata__item text-smallcaps">
        <span>Date: </span>
        <span>{dayjs(date).format("YYYY.M.DD HH:mm")}</span>
      </div>
      <div class="metadata__item text-smallcaps">
        <span>Categories: </span>
        <span>
          {#each categories as category}
            <Badge>{category}</Badge>
          {/each}
        </span>
      </div>
      <div class="metadata__item text-smallcaps">
        <span>READING TIME: </span>
        <span>{remarkPluginFrontmatter.minutesRead}</span>
      </div>
      <div class="metadata__item text-smallcaps">
        <span>Tags: </span>
        <span class="flex flex-wrap gap-1">
          {#each tags as tag}
            <Badge>{tag}</Badge>
          {/each}
        </span>
      </div>
    </div>
  </div>
  <div class="article">
    <LineHeader title="ARTICLE" />
    <div class="articleBody">
      <slot name="content" class="articleBody"></slot>
    </div>
  </div>
</section>

<style>
  .section {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    grid-template-rows: auto;
  }

  .hero--section {
    position: relative;
    margin-top: 80px;
    --iconWidth: calc(63px + ((88 - 63) * (100vw - 390px) / (1440 - 390)));
  }

  .body--section {
    row-gap: 56px;
    margin-top: 56px;
  }

  .title {
    grid-row: 2;
    grid-column: 1 / 8;
    font-size: calc(54px + ((114 - 54) * (100vw - 390px) / (1728 - 390)));
    font-style: normal;
    font-weight: 300;
    line-height: 92%;
    letter-spacing: -0.06em;

    @media (min-width: 760px) {
      grid-column: 1/14;
    }

    @media (min-width: 960px) {
      grid-column: 1/22;
    }
  }

  .sidebar {
    grid-column: 1/-1;
    display: grid;
    grid-template-columns: subgrid;
    align-self: start;
    row-gap: 24px;
    @media (min-width: 960px) {
      top: var(--stickyOffset);
      position: -webkit-sticky;
      position: sticky;
      grid-column: 1/7;
    }
  }

  .smart-title {
    grid-column: 1/-1;
    word-break: break-word;
  }

  .article {
    grid-column: 1/-1;
    display: grid;
    grid-template-columns: subgrid;
    align-self: start;
    grid-row-gap: 16px;
    row-gap: 16px;
  }

  .metadata {
    grid-column: 1/-1;
  }

  .metadata__item {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 16px;
    row-gap: 16px;
    padding: 12px 0;
    border-bottom: 1px dotted var(--dottedBorderColor);
  }

  @media (min-width: 960px) {
    .article {
      grid-column: 8/25;
    }
    
  }
</style>
