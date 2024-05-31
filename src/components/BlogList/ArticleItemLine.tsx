import React from "react";
import type { Frontmatter } from "@types";
import dayjs from "dayjs";

export interface Props {
  href?: string;
  key?: any;
  frontmatter: Frontmatter;
  secHeading?: boolean;
  rawContent?: string;
}

export function ArticleItemLine({ href, frontmatter, rawContent }: Props) {
  const { title } = frontmatter;
  console.log("%c Line:15 🥒 frontmatter", "color:#4fff4B", frontmatter);

  return (
    <li className="group-hover/list:opacity-50 hover:!opacity-100">
      <article
        className="group "
        itemScope
        itemType="http://schema.org/Article"
      >
        <a
          href={href}
          itemProp="url"
          className="text-[var(--color-text-base)] block text-base py-2"
        >
          <div className="flex justify-between items-center relative gap-4">
            <span
              className="items-center flex font-normal before:content-[' '] before:bg-[currentColor]
          before:rounded-2xl before:block before:w-2 before:h-2 shrink-0"
            ></span>
            <span
              itemProp="headline"
              className="max-w-[calc(100%-100px)] md:max-w-[calc(100%-118px)] text-[var(--color-text-base)] block text-base group-hover:underline shrink-0 text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {title}
            </span>
            <div className="h-[1px] w-full bg-stone-100 shrink-1 transition-colors duration-[300ms] ease-in-out"></div>
            <div className="shrink-0 font-mono text-xs text-neutral-400 ">
              {dayjs(frontmatter.date).format("YYYY-MM-DD")}
            </div>
            <div
              className="bg-[var(--color-text-base)] rounded-full text-[white] fill-[white] text-[0] opacity-0 p-1 scale-50 transition-all -rotate-[135deg]
            group-hover:opacity-100 group-hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                className="fill-transparent"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="1.4"
                  d="M12 3v17M19 13l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div className="ml-6 mt-1 text-xs text-neutral-400 flex items-center gap-2">
            <span>{frontmatter.categories}</span>
            <span>/</span>
            <span>{frontmatter.tags?.join(",")}</span>
          </div>
        </a>
      </article>
    </li>
  );
}
