import React from "react";
import type { Frontmatter } from "@types";
import dayjs from "dayjs";

export interface Props {
  href?: string;
  frontmatter: Frontmatter;
  secHeading?: boolean;
  rawContent?: string;
}

export function ArticleItemLine({ href, frontmatter, rawContent }: Props) {
  const { title } = frontmatter;

  return (
    <li className="mt-2">
      <article
        className=" group"
        itemScope
        itemType="http://schema.org/Article"
      >
        <a
          href={href}
          itemProp="url"
          className="text-[var(--color-text-base)] block text-[1.125rem] py-3"
        >
          <div className="flex justify-between items-center relative gap-4">
            <span
              className="items-center flex font-normal before:content-[' '] before:bg-[currentColor]
          before:rounded-2xl before:block before:w-2 before:h-2 shrink-0"
            >
            </span>
            <span
              itemProp="headline"
              className="text-[var(--color-text-base)] block text-[1.125rem] font-semibold group-hover:underline shrink-0"
            >
              {title}
            </span>
            <div className="h-[1px] w-full bg-stone-100 shrink-1 transition-colors duration-[300ms] ease-in-out"></div>
            <div className="shrink-0 font-mono text-sm text-text-lvl-4">
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
          <div className="ml-6 mt-1 text-sm text-neutral-500 flex items-center gap-2">
              <span>{frontmatter.categories}</span>
              <span>/</span>
              <span>{frontmatter.tags.join(',')}</span>
          </div>
          {/* <p className=" text-base font-normal pt-4">
            {frontmatter.description}
          </p> */}
        </a>
        {/* <small>{frontmatter.date}</small>  */}
      </article>
    </li>
  );
}
