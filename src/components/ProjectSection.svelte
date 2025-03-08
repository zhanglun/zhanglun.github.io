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
        tags={project.technologies}
        image={project.image}
        video={project.video}
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
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    align-self: start;
    gap: 50px 24px;
  }

</style>
