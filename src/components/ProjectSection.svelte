<script lang="ts">
  import ProjectCard from "./ProjectCard.svelte";
  export let prefix = "";
  export let projects = [];
</script>

<section class="section project--section">
  <div class="header">
    <div class="label text-smallcaps">
      <span>/</span> PROJECTS
    </div>  
  </div>
  <div class="list">
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
  .project--section {
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

  .list {
    /* grid-column: 8 / 25; */
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    align-self: start;
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
