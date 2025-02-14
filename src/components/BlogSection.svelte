<script lang="ts">
  import dayjs from "dayjs";
  import Badge from "@/components/Badge/Badge.svelte";
  export let posts = [];
</script>

<section class="section blog--section">
  <div class="title">Blog</div>
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
    {#each posts as post}
      <div class="list__item">
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
      </div>
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
    margin-top: 100px;
    @media (min-width: 760px) {
      margin-top: 160px;
      row-gap: 56px;
    }
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

  .list {
    /* grid-column: 8 / 25; */
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    align-self: start;
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
    margin-top: -4px;
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
