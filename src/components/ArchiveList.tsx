import React from "react";
import Card from "@components/Card";
import slugify from "@utils/slugify";
import type { MarkdownInstance } from "astro";
import type { Frontmatter } from "@types";

export const ArchiveList = ({
  archiveMap,
}: {
  archiveMap: Map<string, MarkdownInstance<Frontmatter>[]>
}) => {
  return [...archiveMap.keys()].map(year => {
    return (
      <div className="relative mt-[10vw] mb-[24vw]">
          <div className="text-[36vw] font-bold tracking-[0.2] leading-[0.2] mt-0 min-w-full pointer-events-none absolute text-[#c3cad0] text-center select-none drop-shadow-[2px_2px_0_hsl(210deg_1%_69%_/_56%)]">
            {year}
          </div>
        <ul className="relative grid w-full lg:gap-y-14 lg:grid-cols-[repeat(12,1fr)] lg:gap-6">
          {archiveMap.get(year)?.map(({ frontmatter, compiledContent }) => {
            return (
              <Card
                href={`${import.meta.env.BASE_URL.slice(0, -1)}/blogs/${slugify(frontmatter)}`}
                frontmatter={frontmatter}
                rawContent={compiledContent()}
              />
            );
          })}
        </ul>
      </div>
    );
  });
};
