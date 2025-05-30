<script lang="ts">
  import DirectoryToggle from "./DirectoryToggle.svelte";
  import LineHeader from "./LineHeader.svelte";
  import dayjs from "dayjs";
  import Badge from "@/components/Badge/Badge.svelte";

  const {
    posts = [],
    prefix = "",
    categories = [],
    tags = [],
    mode,
  } = $props();

  let filterTags = [];
  let filterCategories = [];
  let list = $state([...posts]);
  let CategoryToggle: any;
  let TagToggle: any;

  function getListAfterFilter() {
    const filterCategoriesNames = filterCategories.map(_ => _[0].toLowerCase());
    const filterTagsNames = filterTags.map(_ => _[0].toLowerCase());

    let result = [...posts];

    if (filterCategoriesNames.length) {
      result = result.filter(post => {
        return post.data.categories.some(category =>
          filterCategoriesNames.includes(category?.toLowerCase())
        );
      });
    }

    if (filterTagsNames.length) {
      result = result.filter(post => {
        return post.data.tags.some(tag =>
          filterTagsNames.includes(tag.toLowerCase())
        );
      });
    }

    list = result;
  }

  function clearFilter() {
    filterTags = [];
    filterCategories = [];
    getListAfterFilter();

    CategoryToggle.clear();
    TagToggle.clear();
  }

  function handleFilterPostWithTags(tags: [string, number, boolean][]) {
    filterTags = [...tags];
    getListAfterFilter();
  }

  function handleFilterPostWithCategories(
    categories: [string, number, boolean][]
  ) {
    filterCategories = [...categories];
    getListAfterFilter();
  }
</script>

<section class={`section blog--section ${mode ? "blog--section--mini" : ""}`}>
  <div class="sidebar">
    <div class="title">Blog <sup>({posts.length})</sup></div>
    <div class="filter">
      <LineHeader
        title="FILTERS"
        subfix="CLEAR FILTERS"
        onSubfixClick={() => {
          clearFilter();
        }}
      />
      <DirectoryToggle
        name="Catetory"
        list={categories}
        className=""
        onFilter={handleFilterPostWithCategories}
        bind:this={CategoryToggle}
      />
      {#if mode !== "mini"}
        <DirectoryToggle
          name="Tag"
          list={tags}
          className="secondDir"
          onFilter={handleFilterPostWithTags}
          bind:this={TagToggle}
        />
      {/if}
    </div>
  </div>
  <div class="list">
    <div class="header">
      <div class="label label__date text-smallcaps">
        <span>/</span> DATE
      </div>
      <div class="label label__title text-smallcaps">
        <span>/</span> TITLE
      </div>
      <div class="label label__type text-smallcaps">
        <span>/</span> TYPE
      </div>
    </div>
    {#each list as post}
      <a class="list__item" href={`${prefix}/blog/${post.slug}`}>
        <div class="list__item-visible">
          <div class="list__item-date">
            <div class="list__item-date__icon"></div>
            <div class="list__item-date__text text-smallcaps">
              {dayjs(post.data.date).format("YYYY.M.DD")}
            </div>
          </div>
          <div class="text-md list__item-title">
            {post.data.title}
          </div>
          <div class="text-smallcaps list__item-type">
            {#each post.data.categories as category}
              <Badge>{category}</Badge>
            {/each}
          </div>

          <svg
            class="list__item-button"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ><path d="M 0 5 L 10 5" stroke="currentColor" stroke-width="1"
            ></path><path
              class="AccordionButton_verticalPath__2lCIc"
              d="M 5 0 L 5 10"
              stroke="currentColor"
              stroke-width="1"
            ></path></svg
          >
        </div>
      </a>
    {/each}
  </div>
</section>

<style>
  .blog--section {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1/-1;
    grid-row-gap: 36px;
    row-gap: 36px;
    @media (min-width: 760px) {
      padding-top: 93px;
      row-gap: 24px;
    }
    @media (min-width: 960px) {
      row-gap: 56px;
    }
  }
  .sidebar {
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
    align-self: start;
    grid-column: 1 / -1;
    grid-row: 1 / 3;
    grid-row-gap: 56px;
    row-gap: 56px;

    @media (min-width: 960px) {
      position: -webkit-sticky;
      position: sticky;
      top: var(--stickyOffset);
      grid-column: 1 / 7;
    }
  }
  .blog--section--mini .sidebar {
    grid-column: 1/5;
  }

  .title {
    grid-column: 1 / 14;
    display: flex;
    color: var(--headingTextColor, --fontColor);
    font-size: calc(54px + ((114 - 54) * (100vw - 390px) / (1728 - 390)));
    font-style: normal;
    font-weight: 300;
    line-height: 84%;
    letter-spacing: -0.06em;
  }

  .title sup {
    color: var(--counterColor, --fontColor);
    font-size: calc(12px + ((20 - 12) * (100vw - 390px) / (1728 - 390)));
    line-height: 100%;
    letter-spacing: -0.03em;
    vertical-align: top;
    margin-left: 8px;
  }

  .list {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    align-self: start;
    @media (min-width: 960px) {
      grid-column: 8 / 25;
      grid-row: 2/4;
    }
  }

  @media (min-width: 960px) {
    .blog--section--mini .list {
      grid-column: 6 / 25;
    }
  }

  .list__item-visible {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    padding: 10px 0;
    align-items: center;
    cursor: pointer;
    grid-column-gap: 4px;
    column-gap: 4px;
    grid-row-gap: 7px;
    row-gap: 7px;
    border: none;
    background: none;
    text-align: left;
    &:hover {
      background: var(--highlightColor);
    }
  }

  .header {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    border-bottom: 0.5px solid var(--sectionLabels, --fontColor);
    padding-bottom: 6px;
    align-self: start;
    line-height: 1;

    @media (max-width: 759px) {
      display: none;
    }
  }

  .label {
    color: var(--sectionLabels, --fontColor);
    display: flex;
    gap: 4px;
    grid-column: 1 / -1;
  }

  .label__date {
    grid-column: 1/3;
  }

  .label__title {
    grid-column: 3/15;
    @media (min-width: 760px) {
      grid-column: 3/15;
    }
  }

  .label__type {
    grid-column: 15/18;
    @media (min-width: 760px) {
      grid-column: 15/-2;
    }
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
    grid-column: 3 / 14;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: hidden;
    line-height: 1.2;

    @media (min-width: 760px) {
      grid-column: 3/15;
    }
  }

  .list__item-type {
    grid-column: 15/17;
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

  .filter {
    position: sticky;
    top: var(--stickyOffset);
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / 7;
    grid-row-gap: 16px;
    row-gap: 16px;
    align-self: start;
  }

  @media (max-width: 959px) {
    .filter {
      position: relative;
      top: 0;
      grid-column: 1/-1;
      row-gap: 0;
    }
  }
</style>
