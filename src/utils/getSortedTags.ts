import type { CollectionEntry } from "astro:content";

const getSortedTags = (posts: CollectionEntry<"blogs" | "notion">[]) => {
    let tags: string[] = [];
    const filteredPosts = posts.filter(({ data }) => !data.draft);
    filteredPosts.forEach((post) => {
        tags = [...tags, ...post.data.tags]
            .map((tag) => tag)
            .filter(
                (value: string, index: number, self: string[]) =>
                    self.indexOf(value) === index
            );
    });
    return tags;
};

export default getSortedTags;
