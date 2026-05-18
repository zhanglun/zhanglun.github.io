import React from "react";
import Badge from "@/components/Badge/Badge";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  title: string;
  href?: string;
  description: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: { icon: any; type: string; href: string }[];
}

export default function ProjectCard({
  title,
  href = "",
  description,
  tags,
  link = "",
  image = "",
  video = "",
  links = [],
}: ProjectCardProps) {
  return (
    <div className={`${styles.item} h-full flex flex-col`}>
      <a
        href={href || "#"}
        className={`block cursor-pointer aspect-square ${styles.image}`}
      >
        <div
          className={`h-full flex items-center justify-center ${styles.myLogo}`}
        >
          <div className={styles.myLogoText}>{title.slice(0, 1)}</div>
        </div>
      </a>

      <div className={`${styles.content} px-2 flex flex-col`}>
        <div>
          <span className={styles.title}>{title}</span>
          <span className="hidden font-sans text-xs underline print:visible">
            {link?.replace("https://", "").replace("www.", "").replace("/", "")}
          </span>
          <div className="mt-4 mb-4">
            <span className={styles.description}>{description}</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col">
          {tags && tags.length > 0 && (
            <div className="mt-2 mb-4 flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <Badge key={index}>{tag}</Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1">
          {links && links.length > 0 && (
            <>
              {links.map((linkItem, index) => (
                <a
                  key={index}
                  href={linkItem?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.buttonSm}
                >
                  {linkItem.type}
                </a>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
