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
  <div class="title">
    <h1 class=" text-hero">
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
  
  .title {
    grid-column: 1 / 15;
    position: relative;
    display: flex;
    flex-direction: column;
    color: var(--headingTextColor, --fontColor);
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

@media (max-width: 959px) {
  .title {
    grid-column: 1/22;

  }
  .subTitle {
    grid-column: 1/22;
  }
}
</style>
