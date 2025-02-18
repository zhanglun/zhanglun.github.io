<script lang="ts">
  import LineHeader from "./LineHeader.svelte";
  import dayjs from "dayjs";
  import Badge from "@/components/Badge/Badge.svelte";
  import PlusIcons from "@/components/PlusIcons.svelte";

  const {
    post = {},
    date = new Date(),
    categories = [],
    tags = [],
    remarkPluginFrontmatter = {},
    prefix = "",
  } = $props();
</script>

<section class="section hero--section">
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
    <div class="text-lg smart-title">
      {post.title}
    </div>
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
      <slot name="content"></slot>
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

    .aboutAuthor,
    .additionalResources,
    .articleBody {
      grid-column: 1/14;
    }

    .articleBody li,
    .articleBody p {
      font-size: 18px;
    }
  }

  @media (min-width: 1400px) {
    .aboutAuthor,
    .additionalResources,
    .articleBody {
      grid-column: 1/13;
    }
  }

  .articleBody {
    grid-column: 1/-1;
    display: flex;
    flex-direction: column;
    counter-reset: label-count;
  }

  .articleBody pre,
  .articleBody > p {
    margin: 24px 0 0;
  }

  .articleBody > h2,
  .articleBody > h3,
  .articleBody > h4,
  .articleBody > h5,
  .articleBody > h6 {
    margin: 40px 0 0;
    & strong {
      font-weight: 300;
    }
  }

  .articleBody > :first-child {
    margin: 0;
  }

  .label__date {
    grid-column: 1/3;
  }

  .label__title {
    grid-column: 3/18;
  }

  .label__type {
    grid-column: 18/24;
  }

  .list__item {
    display: grid;
    grid-template-columns: subgrid;
    border-bottom: 0.5px solid var(--borderColor, --fontColor);
    color: var(--listItemText);
    grid-column: 1 / -1;
  }

  .list__item-date {
    grid-column: 1 / 3;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .list__item-date__icon {
    width: 8px;
    height: 8px;
    min-width: 8px;
    min-height: 8px;
    margin-top: 0.5px;
    background-color: var(--squareTextColor);
  }
  .list__item-date__text {
    color: var(--squareTextColor, --fontColor);
  }
  .list__item-title {
    grid-column: 3 / 18;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: hidden;
    line-height: 1.2;
  }

  .list__item-type {
    grid-column: 18/19;
    grid-row: 1;
    justify-self: start;
    align-self: center;
  }

  .list__item-button {
    grid-column: -2/-1;
    grid-row: 2;
    align-self: center;
    justify-self: end;
  }

  @media (max-width: 759px) {
    .list__item-title {
      grid-column: 1/-2;
    }

    .list__item-type {
      display: none;
    }
  }
  @media (min-width: 760px) {
    .list__item-button {
      grid-row: 1;
    }
  }
</style>
