import React from "react";
import type { MarkdownInstance } from "astro";
import type { Frontmatter } from "src/types";
import slugify from "@utils/slugify";
import Icon from "../../assets/icon.png";

export interface HomeProps {
  siteInfo: any;
  menu: any;
  recentlyPosts: MarkdownInstance<Frontmatter>[];
}

export const RichHome = ({ siteInfo, menu, recentlyPosts }: HomeProps) => {
  return (
    <div className="max-w-screen-2xl context m-auto grid items-center justify-center">
      <div className="grid items-center justify-center pt-40 pb-28">
        <div className="grid gap-10 grid-rows-1">
          <div className="grid gap-8 items-center grid-rows-[1fr_1fr] sm:grid-cols-[9rem_1fr] sm:grid-rows-1">
            <img className="w-36 h-36 rounded-full m-auto" src={Icon} alt="" />
            <h1 className=" p-0 m-0 text-center text-5xl sm:text-7xl text-[var(--color-text-base)">
              {siteInfo.title}
            </h1>
          </div>
          <p className="text-[1.5rem] sm:text-[2rem]">{siteInfo.description}</p>
        </div>
      </div>
      <div className="my-24">
        <h2 className="text-2xl font-bold">Recently Posted</h2>
        <div className="mt-8 grid gap-8 grid-rows-3 sm:grid-cols-12 sm:grid-rows-2">
          {recentlyPosts.map((post) => (<div className="grid gap-3 sm:col-span-12 xl:col-span-6 row-span-2">
            <div>
              <span className="before:content-[' '] flex items-center text-[0.875rem] font-normal before:mr-1 before:block before:h-2 before:w-2 before:rounded-2xl before:bg-[currentColor]">
                {post.frontmatter.categories}
              </span>
              <a
                href={`${import.meta.env.BASE_URL.slice(0, -1)}/blogs/${slugify(
                  post.frontmatter
                )}`}
                className="block pt-3 pb-4 text-[1.125rem] font-semibold text-[var(--color-text-base)]"
              >
                <h2 className="text-2xl font-medium leading-none tracking-normal decoration-dashed hover:underline">
                  {post.frontmatter.title}
                </h2>
              </a>
              <p className="break-all text-sm leading-tight tracking-tighter text-gray-500">
                {post.frontmatter.description}
              </p>
            </div>
          </div>)
          )}
        </div>
      </div>
    </div>
  );
};
