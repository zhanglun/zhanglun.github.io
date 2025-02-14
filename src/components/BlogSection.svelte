<script lang="ts">
  export let posts = [];
</script>

<section class="section blog--section">
  <div class="title">
    Blog
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

  </div>
</section>

<style>
  .blog--section {
    row-gap: 32px;
    margin-top: 60px;
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

  .header {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    border-bottom: .5px solid var(--sectionLabels, --fontColor);
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
    grid-column: 1/3
  }

  .label__title {
    grid-column: 3/18
  }

  .label__type {
    grid-column: 18/24

  }
</style>
