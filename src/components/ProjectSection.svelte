<script lang="ts">
  import ProjectCard from "./ProjectCard.svelte";
  export let prefix = "";
  export let projects = [];
</script>

<section class="section home-hero-section">
  <div class="flex flex-row my-4 items-center justify-between text-neutral-800">
    <h2 class="text-2xl font-bold">Projects</h2>
    <a href={`${prefix}/projects`} class="flex items-center gap-1 group">
      <span class="transition-all group-hover:-translate-x-2"
        >more projects</span
      >
      <!-- <ArrowUpRight
        strokeWidth={1.5}
        size={18}
        className="transition-all origin-center group-hover:translate-x-2 text-primary group-hover:-translate-y-2 "
      /> -->
    </a>
  </div>
  <div
    class="grid scroll-m-24 gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 w-full"
  >
    {#each projects.slice(0, 4) as project}
      <ProjectCard
        href={project.url}
        title={project.name}
        description={project.description}
        dates={project.dates}
        tags={project.technologies}
        image={project.image}
        video={""}
        links={project.links}
      />
    {/each}
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
