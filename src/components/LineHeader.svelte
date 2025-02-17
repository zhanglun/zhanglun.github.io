<script lang="ts">
  export let title = "";
</script>

<div class="lineHeader">
  <div class="lineHeader__label text-smallcaps">
    <span>/</span>
    {title}
  </div>
</div>

<style>
  .lineHeader {
    grid-column: 1/-1;
    display: grid;
    grid-template-columns: subgrid;
    border-bottom: 0.5px solid var(--sectionLabels, --fontColor);
    padding-bottom: 6px;
    align-self: start;
  }

  .lineHeader__label {
    color: var(--sectionLabels, --fontColor);
    display: flex;
    gap: 4px;
    grid-column: 1 / -1;
  }
</style>
