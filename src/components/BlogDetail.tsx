import React, { type ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import LineHeader from "./LineHeader";
import dayjs from "dayjs";
import Badge from "@/components/Badge/Badge";
import PlusIcons from "./PlusIcons";
import styles from "./BlogDetail.module.css";

interface BlogDetailProps {
  title: string;
  pubDate: Date;
  tags: string[];
  categories: string[];
  readingTime: string;
  children: ReactNode;
}

export default function BlogDetail({
  title,
  pubDate,
  tags,
  categories,
  readingTime,
  children,
}: BlogDetailProps) {
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const smartTitleRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const heroEl = heroSectionRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      },
      { rootMargin: "0px", threshold: 1 }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  return (
    <article className={styles.section}>
      <PlusIcons />
      <div className={styles.heroSection} ref={heroSectionRef}>
        <h1 className={`${styles.title} text-hero`}>{title}</h1>
      </div>
      <PlusIcons />

      <div className={styles.bodySection}>
        <aside className={styles.sidebar}>
          <div
            ref={smartTitleRef}
            className={clsx(
              styles.smartTitle,
              !visible && styles.smartTitleHidden,
              "text-lg"
            )}
          >
            {title}
          </div>
          <div className={styles.metadata}>
            <LineHeader title="METADATA" />
            <div className={`${styles.metadataItem} text-smallcaps`}>
              <span>Date: </span>
              <time>{dayjs(pubDate).format("YYYY.M.DD HH:mm")}</time>
            </div>
            <div className={`${styles.metadataItem} text-smallcaps`}>
              <span>Categories: </span>
              <span>
                {categories.map((category, index) => (
                  <Badge key={index}>{category}</Badge>
                ))}
              </span>
            </div>
            <div className={`${styles.metadataItem} text-smallcaps`}>
              <span>READING TIME: </span>
              <span>{readingTime}</span>
            </div>
            <div className={`${styles.metadataItem} text-smallcaps`}>
              <span>Tags: </span>
              <span className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <Badge key={index}>{tag}</Badge>
                ))}
              </span>
            </div>
          </div>
        </aside>

        <div className={styles.article}>
          <LineHeader title="ARTICLE" />
          <div className="articleBody">
            <div className="articleBody">
              {children}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
