import React from "react";
import Badge from "./Badge/Badge";
import "./ProjectCard.css";

interface LinkItem {
  icon: any;
  type: string;
  href: string;
}

interface Props {
  className?: string;
  title: string;
  href?: string;
  description: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: LinkItem[];
}

export default function ProjectCard({
  className = "",
  title,
  href = "",
  description,
  tags,
  link = "",
  image = "",
  video = "",
  links = [],
}: Props) {
  return (
    <div className={`item h-full flex flex-col ${className}`}>
      <a
        href={href || "#"}
        className="block cursor-pointer aspect-square image row-span-1"
      >
        <div className="h-full flex items-center justify-center my-logo">
          <div className="my-logo-text">{title.slice(0, 1)}</div>
        </div>
      </a>
      {/* Card Header */}
      <div className="content px-2 flex flex-col row-span-1">
        <div>
          {/* Card Title */}
          <span className="title mt-1 mb-3 text-3xl">{title}</span>
          <span className="hidden font-sans text-xs underline print:visible">
            {link?.replace("https://", "").replace("www.", "").replace("/", "")}
          </span>
          <div className="mt-4 mb-4">
            <span className="description">{description}</span>
          </div>
        </div>
        {/* Card Content */}
        <div className="mt-auto flex flex-col">
          {tags && tags.length > 0 && (
            <div className="mt-2 mb-4 flex flex-wrap gap-1">
              {tags.map(tag => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}
        </div>
        {/* Card Footer */}
        <div className="grid grid-cols-2 gap-1">
          {links &&
            links.length > 0 &&
            links.map((linkItem, index) => (
              <a
                key={index}
                href={linkItem?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="buttonSm"
              >
                {linkItem.type}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
