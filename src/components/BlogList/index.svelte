<script lang="ts">
  import Tag from "@/components/Tag.svelte";
  import ArticleItemLine from "./ArticleItemLine.svelte";
  import type { CollectionEntry } from "astro:content";

  interface Props {
    allPosts: CollectionEntry<"blogs" | "notion">[];
    tags: [string, number][];
  }

  const { allPosts, tags } = $props();
  const prefix = import.meta.env.BASE_URL.slice(0, -1);

  let filterPosts = $state([...allPosts]);
  let currentTag = $state("");

  function filterByTag(tag: string) {
    console.log("🚀 ~ file: Blog.astro:22 ~ filterByTag ~ tag:", tag);

    if (tag === currentTag) {
      currentTag = ''
    } else {
      currentTag = tag
    }

    filterPosts = currentTag ? allPosts.filter(post => post.data.tags.includes(currentTag)) : allPosts;
  }
</script>

<div class="w-[42rem">
  <div class="gap-x-2 gap-y-2 flex cursor-pointer flex-wrap">
    {#each tags as tag}
      <Tag
        name={tag[0]}
        count={tag[1]}
        selected={currentTag === tag[0]}
        onClick={() => {
          filterByTag(tag[0]);
        }}
      />
    {/each}
  </div>
  <ul class="w-[42rem] mt-8">
    {#each filterPosts as { data, slug }}
      <ArticleItemLine href={`${prefix}/blog/${slug}`} frontmatter={data} />
    {/each}
  </ul>
</div>
