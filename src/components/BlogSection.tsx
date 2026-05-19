import React, { useState, useRef, useEffect } from "react";
import DirectoryToggle from "./DirectoryToggle";
import type { DirectoryToggleRef } from "./DirectoryToggle";
import LineHeader from "./LineHeader";
import dayjs from "dayjs";
import Badge from "@/components/Badge/Badge";
import styles from "./BlogSection.module.css";
import clsx from "clsx";

interface BlogSectionProps {
  posts: any[];
  prefix?: string;
  categories: [string, number][];
  tags: [string, number][];
  mode?: string;
}

export default function BlogSection({
  posts = [],
  prefix = "",
  categories = [],
  tags = [],
  mode,
}: BlogSectionProps) {
  const [list, setList] = useState([...posts]);
  const categoryToggleRef = useRef<DirectoryToggleRef>(null);
  const tagToggleRef = useRef<DirectoryToggleRef>(null);
  const [filterTags, setFilterTags] = useState<[string, number, boolean][]>([]);
  const [filterCategories, setFilterCategories] = useState<
    [string, number, boolean][]
  >([]);

  useEffect(() => {
    getListAfterFilter();
  }, [filterTags, filterCategories]);

  const getListAfterFilter = () => {
    const filterCategoriesNames = filterCategories.map(_ => _[0].toLowerCase());
    const filterTagsNames = filterTags.map(_ => _[0].toLowerCase());

    let result = [...posts];

    if (filterCategoriesNames.length) {
      result = result.filter(post => {
        return post.data.categories.some((category: any) =>
          filterCategoriesNames.includes(category?.toLowerCase())
        );
      });
    }

    if (filterTagsNames.length) {
      result = result.filter(post => {
        return post.data.tags.some((tag: any) =>
          filterTagsNames.includes(tag.toLowerCase())
        );
      });
    }

    setList(result);
  };

  const clearFilter = () => {
    setFilterTags([]);
    setFilterCategories([]);
    categoryToggleRef.current?.clear();
    tagToggleRef.current?.clear();
  };

  const handleFilterPostWithTags = (tags: [string, number, boolean][]) => {
    setFilterTags([...tags]);
  };

  const handleFilterPostWithCategories = (
    categories: [string, number, boolean][]
  ) => {
    setFilterCategories([...categories]);
  };

  return (
    <section className={clsx("section", styles.section, mode ? styles.mini : "")}>
      <div className={styles.sidebar}>
        <div className={styles.title}>
          Blog <sup>({posts.length})</sup>
        </div>
        <div className={styles.filter}>
          <LineHeader
            title="FILTERS"
            subfix="CLEAR FILTERS"
            onSubfixClick={clearFilter}
          />
          <DirectoryToggle
            ref={categoryToggleRef}
            name="Category"
            list={categories}
            onFilter={handleFilterPostWithCategories}
          />
          {mode !== "mini" && (
            <DirectoryToggle
              ref={tagToggleRef}
              className={styles.secondDir}
              name="Tag"
              list={tags}
              onFilter={handleFilterPostWithTags}
            />
          )}
        </div>
      </div>
      <div className={styles.list}>
        <div className={styles.header}>
          <div className={clsx(styles.label, styles.labelDate, "text-smallcaps")}>
            <span>/</span> DATE
          </div>
          <div className={clsx(styles.label, styles.labelTitle, "text-smallcaps")}>
            <span>/</span> TITLE
          </div>
          <div className={clsx(styles.label, styles.labelType, "text-smallcaps")}>
            <span>/</span> TYPE
          </div>
        </div>
        {list.map((post, index) => (
          <a
            key={post.id || index}
            href={`${prefix}/blog/${post.id}`}
            className={styles.listItem}
          >
            <div className={styles.listItemVisible}>
              <div className={styles.listItemDate}>
                <div className={styles.listItemDateIcon} />
                <div className={clsx(styles.listItemDateText, "text-smallcaps")}>
                  {dayjs(post.data.date).format("YYYY.M.DD")}
                </div>
              </div>
              <div className={clsx("text-md", styles.listItemTitle)}>
                {post.data.title}
              </div>
              <div className={clsx("text-smallcaps", styles.listItemType)}>
                {post.data.categories?.map((category: string, i: number) => (
                  <Badge key={i}>{category}</Badge>
                ))}
              </div>
              <svg
                className={styles.listItemButton}
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 0 5 L 10 5"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <path
                  d="M 5 0 L 5 10"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
