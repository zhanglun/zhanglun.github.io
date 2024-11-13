<script lang="ts">
  import Tag from "@/components/Tag.svelte";
  import type { CollectionEntry } from "astro:content";

  interface Props {
    allPosts: CollectionEntry<"blogs" | "notion">[];
    tags: [string, number][];
  }

  const { allPosts, tags } = $props();
  const prefix = import.meta.env.BASE_URL.slice(0, -1);

  let filterPosts = [...allPosts];

  function filterByTag(tag: string) {
    console.log("🚀 ~ file: Blog.astro:22 ~ filterByTag ~ tag:", tag);

    filterPosts = allPosts.filter(post => post.data.tags.includes(tag));
  }
</script>

<div className="m-auto">
  <div class="mt-8 gap-x-2 gap-y-2 flex cursor-pointer flex-wrap">
    {#each tags as tag}
      <Tag
        name={tag[0]}
        count={tag[1]}
        onClick={() => {
          filterByTag(tag[0]);
        }}
      />
    {/each}
  </div>
  <ul className="w-full">
    {#each filterPosts as { data, slug }}
      <li>{data.title}</li>
    {/each}
  </ul>
</div>
