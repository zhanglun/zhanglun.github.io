<script lang="ts">
  import PlusIcons from '@/components/PlusIcons.svelte';
  export let site = {};
</script>

<section class="section home-hero-section">
  <PlusIcons />
  <div class="title">
    <h1 class="text-hero">
      {site.title}
    </h1>
  </div>
  <div class="content subTitle">
    {site.description}
  </div>
  <PlusIcons />

</section>

<style>
  .home-hero-section {
    position: relative;
    margin-top: 64px;
    --iconWidth: calc(63px + ((88 - 63) * (100vw - 390px) / (1440 - 390)));
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
