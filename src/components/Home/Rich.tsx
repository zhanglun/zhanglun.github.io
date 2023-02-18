import React from "react";
import type { MarkdownInstance } from "astro";
import type { Frontmatter } from "src/types";
import slugify from "@utils/slugify";
import Icon from "../../assets/icon.png";
import Scene from "../../assets/blob-scene-haikei.svg";
import Steps from "../../assets/layered-steps-haikei.svg";
import Waves from "../../assets/layered-waves-haikei.svg";
import { CircleArrow, CircleArrowThemeEnum } from "../CircleArrow";

export interface HomeProps {
  siteInfo: any;
  menu: any;
  recentlyPosts: MarkdownInstance<Frontmatter>[];
}

export const RichHome = ({ siteInfo, menu, recentlyPosts }: HomeProps) => {
  console.log(recentlyPosts[0].frontmatter);
  const renderMenu = () =>
    menu.map((item: any, idx: number) => (
      <a
        className="flex items-center leading-none group"
        href={import.meta.env.BASE_URL.slice(0, -1) + item.url}
        key={item.id}
      >
        <span className="mr-3">{item.name}</span>
        <CircleArrow
          className="opacity-0 group-hover:opacity-100"
          rotate={-125}
          size={1.2}
          theme={CircleArrowThemeEnum.dark}
        />
      </a>
    ));

  return (
    <div className="max-w-screen-2xl context m-auto">
      <div className="grid items-center justify-center pt-24 pb-8">
        <div className="grid gap-10 grid-rows-[1fr_1fr]">
          <div className="grid gap-8 items-center grid-cols-[9rem_1fr]">
            <img className="w-36 h-36 rounded-full" src={Icon} alt="" />
            <h1 className="text-center text-7xl text-[var(--color-text-base) p-0 m-0">
              {siteInfo.title}
            </h1>
          </div>
          <p className="text-[2rem]">{siteInfo.description}</p>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold">Recently Posted</h2>
        <div className="mt-8 grid grid-cols-12 gap-8 grid-rows-2">
          <div className="grid gap-3 sm:col-span-12 xl:col-span-6 row-span-2">
            <img className="rounded-2xl" src={Scene} alt="" />
            <div>
              <span className="before:content-[' '] flex items-center text-[0.875rem] font-normal before:mr-1 before:block before:h-2 before:w-2 before:rounded-2xl before:bg-[currentColor]">{recentlyPosts[0].frontmatter.categories}</span>
              <a
                href={`${import.meta.env.BASE_URL.slice(0, -1)}/blogs/${slugify(recentlyPosts[0].frontmatter)}`}
                className="block pt-3 pb-4 text-[1.125rem] font-semibold text-[var(--color-text-base)]">
                <h2 className="text-2xl font-medium leading-none tracking-normal decoration-dashed hover:underline">
                  {recentlyPosts[0].frontmatter.title}
                </h2>
              </a>
              <p className="break-all text-sm leading-tight tracking-tighter text-gray-500">{recentlyPosts[0].frontmatter.description}</p>
            </div>
          </div>
          <div className="relative sm:col-span-12 xl:col-span-6 grid gap-3 grid-cols-12">
            <img className="rounded-2xl col-span-5" src={Steps} alt="" />
            <div className="col-span-7">
              <span className="before:content-[' '] flex items-center text-[0.875rem] font-normal before:mr-1 before:block before:h-2 before:w-2 before:rounded-2xl before:bg-[currentColor]">{recentlyPosts[1].frontmatter.categories}</span>
              <a
                href={`${import.meta.env.BASE_URL.slice(0, -1)}/blogs/${slugify(recentlyPosts[1].frontmatter)}`}
                className="block pt-3 pb-4 text-[1.125rem] font-semibold text-[var(--color-text-base)]">
                <h2 className="text-2xl font-medium leading-none tracking-normal decoration-dashed hover:underline">
                  {recentlyPosts[1].frontmatter.title}
                </h2>
              </a>
              <p className="break-all text-sm leading-tight tracking-tighter text-gray-500">
                {recentlyPosts[1].frontmatter.description}
              </p>
            </div>
          </div>
          <div className="relative sm:col-span-12 xl:col-span-6 grid gap-3 grid-cols-12">
            <img className="rounded-2xl col-span-5" src={Waves} alt="" />
            <div className="col-span-7">
              <span className="before:content-[' '] flex items-center text-[0.875rem] font-normal before:mr-1 before:block before:h-2 before:w-2 before:rounded-2xl before:bg-[currentColor]">{recentlyPosts[2].frontmatter.categories}</span>
              <a
                href={`${import.meta.env.BASE_URL.slice(0, -1)}/blogs/${slugify(recentlyPosts[2].frontmatter)}`}
                className="block pt-3 pb-4 text-[1.125rem] font-semibold text-[var(--color-text-base)]">
                <h2 className="text-2xl font-medium leading-none tracking-normal decoration-dashed hover:underline">
                  {recentlyPosts[2].frontmatter.title}
                </h2>
              </a>
              <p className="break-all text-sm leading-tight tracking-tighter text-gray-500">
                {recentlyPosts[2].frontmatter.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <ul>
        {recentlyPosts.map(({ frontmatter, compiledContent }, idx) => {
          return <Card key={idx}
            href={`${import.meta.env.BASE_URL.slice(0, -1)}/blogs/${slugify(frontmatter)}`}
            frontmatter={frontmatter}
            rawContent={compiledContent()}
          />
        })}
      </ul> */}
    </div >
  );
};
