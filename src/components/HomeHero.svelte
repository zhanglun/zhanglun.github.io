<script lang="ts">
  export let site = {};
</script>

<section class="section home-hero-section">
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
      ></path></svg
    ><svg
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
    ><svg
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
    ><svg
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
  </div>
  <div class="col-start-1 col-end-[15]">
    <h1 class="text-7xl font-medium mb-0">
      {site.title}
    </h1>
  </div>
  <div class="content subTitle">
    {site.description}
  </div>
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
      ></path></svg
    ><svg
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
    ><svg
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
    ><svg
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
  </div>
</section>

<style>
  .home-hero-section {
    position: relative;
    margin-top: 64px;
    --iconWidth: calc(63px + ((88 - 63) * (100vw - 390px) / (1440 - 390)));
  }

  .plusIcons {
    color: var(--plusIconColor, --fontColor);
    display: grid;
    grid-column: 1/ -1;
    grid-template-columns: subgrid;
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
    grid-column: 1 / 1;
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
