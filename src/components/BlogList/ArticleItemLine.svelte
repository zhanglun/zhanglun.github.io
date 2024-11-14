<script lang="ts">
  import type { Frontmatter } from "@types";
  import dayjs from "dayjs";
  interface Props {
    href?: string;
    key?: any;
    frontmatter: Frontmatter;
    secHeading?: boolean;
    rawContent?: string;
  }
  const { href, frontmatter, rawContent } = $props();
  const { title } = frontmatter;
</script>

<li class="group-hover/list:opacity-50 hover:!opacity-100 transition-all">
  <article class="group " itemScope itemType="http://schema.org/Article">
    <a {href} itemProp="url" class="text-[black] block text-base py-2">
      <div class="flex justify-between items-center relative gap-4">
        <span
          class="items-center flex font-normal before:content-[' '] before:bg-[currentColor]
          before:rounded-2xl before:block before:w-2 before:h-2 shrink-0"
        ></span>
        <span
          itemProp="headline"
          class="max-w-[calc(100%-250px)] md:max-w-[calc(100%-250px)] text-[black] block text-base group-hover:underline shrink-0 text-ellipsis overflow-hidden whitespace-nowrap"
        >
          {title}
        </span>
        <div
          class="h-[1px] w-full bg-stone-100 shrink-1 transition-colors duration-[300ms] ease-in-out"
        ></div>
        <div class="shrink-0 font-mono text-xs text-neutral-400 ">
          {dayjs(frontmatter.date).format("YYYY-MM-DD")}
        </div>
        <div
          class="bg-[black] rounded-full text-[white] fill-[white] text-[0] opacity-0 p-1 scale-50 transition-all -rotate-[135deg]
            group-hover:opacity-100 group-hover:scale-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            class="fill-transparent"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.4"
              d="M12 3v17M19 13l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      <div
        class="ml-6 mt-1 text-xs text-neutral-400 flex items-center gap-2"
      >
        <span>{frontmatter.categories}</span>
        <span>/</span>
        <span>{frontmatter.tags?.join(",")}</span>
      </div>
    </a>
  </article>
</li>
