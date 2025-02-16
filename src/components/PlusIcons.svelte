<script lang="ts">
</script>

<div class="plusIcons">
  <svg
    class="plusIcons_icon"
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ><path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3.5 4.5V8H4.5V4.5H8V3.5H4.5V0H3.5V3.5H0V4.5H3.5Z"
      fill="currentColor"
    ></path>
  </svg>
  <svg
    class="plusIcons_icon"
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ><path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3.5 4.5V8H4.5V4.5H8V3.5H4.5V0H3.5V3.5H0V4.5H3.5Z"
      fill="currentColor"
    ></path>
  </svg>
  <svg
    class="plusIcons_icon"
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ><path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3.5 4.5V8H4.5V4.5H8V3.5H4.5V0H3.5V3.5H0V4.5H3.5Z"
      fill="currentColor"
    ></path></svg
  >
  <svg
    class="plusIcons_icon"
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ><path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3.5 4.5V8H4.5V4.5H8V3.5H4.5V0H3.5V3.5H0V4.5H3.5Z"
      fill="currentColor"
    ></path>
  </svg>
</div>

<style>
  .plusIcons {
    color: var(--plusIconColor, --fontColor);
    display: grid;
    grid-column: 1/ -1;
    grid-template-columns: subgrid;
    padding: 14px 0;
  }

  .plusIcons img:first-of-type,
  .plusIcons svg:first-of-type {
    grid-column: 1 / 1;
    grid-row: 1;
  }

  .plusIcons img:nth-of-type(2n),
  .plusIcons svg:nth-of-type(2n) {
    grid-column: 16 / 16;
    grid-row: 1;
  }

  .plusIcons img:nth-of-type(3n),
  .plusIcons svg:nth-of-type(3n) {
    grid-column: 22 / 22;
    grid-row: 1;
  }

  .plusIcons img:nth-of-type(4n),
  .plusIcons svg:nth-of-type(4n) {
    grid-column: -1 / -1;
    grid-row: 1;
    justify-self: end;
    transform: traslateX(-50%);
  }

  .plusIcons_icon {
    display: block;
    color: var(--plusIconColor);
    transform: translateX(-50%);
  }

  @media (max-width: 959px) {
    .plusIcons img:first-of-type,
    .plusIcons svg:first-of-type {
      grid-column: 1/1;
    }

    .plusIcons img:nth-of-type(2n),
    .plusIcons svg:nth-of-type(2n) {
      grid-column: 13/13;
    }

    .plusIcons img:nth-of-type(3n),
    .plusIcons svg:nth-of-type(3n) {
      display: none;
    }

    .plusIcons img:nth-of-type(4n),
    .plusIcons svg:nth-of-type(4n) {
      grid-column: -1/-1;
    }

    .BlogPostHero_caption__IxlSE {
      grid-column: -3/-1;
    }
  }

  @media (max-width: 759px) {
    .plusIcons img:nth-of-type(2),
    .plusIcons svg:nth-of-type(2) {
      grid-column: 6/6;
    }
  }
</style>
