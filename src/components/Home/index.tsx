import React from "react";
import Icon from "../../assets/icon.png";
import { CircleArrow, CircleArrowThemeEnum } from "../CircleArrow";
import type { MarkdownInstance } from "astro";
import type { Frontmatter } from "src/types";

export interface HomeProps {
  siteInfo: any;
  menu: any;
  recentlyPosts: MarkdownInstance<Frontmatter>[];
}

export const Home = ({ siteInfo, menu }: HomeProps) => {
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
    <div className="h-screen m-auto grid items-center justify-center">
      <div>
        <div className="grid gap-10 grid-rows-[1fr_1fr]">
          <div className="grid gap-8 items-center grid-cols-[9rem_1fr]">
            <img className="w-36 h-36 rounded-full" src={Icon} alt="" />
            <h1 className="text-center text-7xl text-[var(--color-text-base) p-0 m-0">
              {siteInfo.title}
            </h1>
          </div>
          <p className="text-[2rem]">{siteInfo.description}</p>
        </div>
        <div className="grid text-lg grid-flow-col justify-items-center max-w-screen-lg">
          {renderMenu()}
        </div>
      </div>
    </div>
  );
};
