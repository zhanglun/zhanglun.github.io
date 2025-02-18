<script lang="ts">
</script>

<section class="section project--section">
  <div class="header">
    <div class="label text-smallcaps">
      <span>/</span> ABOUT ME
    </div>
  </div>
  <div class="content">
    <slot name="content"></slot>
  </div>
</section>

<style>
  .project--section {
    row-gap: 32px;
    margin-top: 60px;
  }

  .content {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    counter-reset: label-count;
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

  .content {
    display: flex;
    gap: 24px;
  }

  .subTitle {
    color: var(--bodyTextColor, --fontColor);
    padding-top: 50px;
    padding-left: 6px;
    padding-right: 6px;
    grid-column: 1 / 15;
    grid-row: 3;
    font-size: calc(20px + ((43 - 20) * (100vw - 390px) / (1728 - 390)));
    line-height: 95%;
    font-family:
      sohne-var,
      Helvetica Neue,
      Arial,
      sans-serif;
    font-style: normal;
    font-weight: 300;
  }
</style>
