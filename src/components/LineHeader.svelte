<script lang="ts">
  export let title = "";
  export let subfix = "";
  export let onSubfixClick = () => {};
</script>

<div class="lineHeader">
  <div class="lineHeader__label text-smallcaps">
    <span>/</span>
    {title}
  </div>
  {#if subfix}
    <div class="lineHeader__subfix text-smallcaps" onclick={onSubfixClick}>
      {subfix}
    </div>
  {/if}
</div>

<style>
  .lineHeader {
    grid-column: 1/-1;
    display: grid;
    grid-template-columns: subgrid;
    border-bottom: 0.5px solid var(--sectionLabels, --fontColor);
    padding-bottom: 6px;
    align-self: start;
    line-height: 1;
  }

  .lineHeader__label {
    color: var(--sectionLabels, --fontColor);
    display: flex;
    gap: 4px;
    grid-column: 1 / 3;
  }

  .lineHeader__subfix {
    color: var(--sectionLabels, --fontColor);
    display: flex;
    gap: 4px;
    grid-column: 3 / -1; 
    justify-self: flex-end;
    cursor: pointer;
  }
</style>
