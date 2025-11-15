import React, { useState, useRef } from 'react';
import DirectoryToggle from "../directory-toggle";
import LineHeader from "../line-header";
import dayjs from "dayjs";
import { Badge } from "../Badge/badge";
import styles from './blog-section.module.css';

interface Post {
  slug: string;
  data: {
    title: string;
    date: string;
    categories: string[];
    tags: string[];
  };
}

interface FilterItem {
  [0]: string; // name
  [1]: number; // count
  [2]: boolean; // active
}

interface BlogSectionProps {
  posts?: Post[];
  prefix?: string;
  categories?: FilterItem[];
  tags?: FilterItem[];
  mode?: string;
}

const BlogSection: React.FC<BlogSectionProps> = ({
  posts = [],
  prefix = "",
  categories = [],
  tags = [],
  mode
}) => {
  const [filterTags, setFilterTags] = useState<FilterItem[]>([]);
  const [filterCategories, setFilterCategories] = useState<FilterItem[]>([]);
  const [list, setList] = useState<Post[]>([...posts]);

  const categoryToggleRef = useRef<any>(null);
  const tagToggleRef = useRef<any>(null);

  const getListAfterFilter = () => {
    const filterCategoriesNames = filterCategories.map(_ => _[0].toLowerCase());
    const filterTagsNames = filterTags.map(_ => _[0].toLowerCase());

    let result = [...posts];

    if (filterCategoriesNames.length > 0) {
      result = result.filter(post => {
        return post.data.categories.some(category =>
          category && filterCategoriesNames.includes(category.toLowerCase())
        );
      });
    }

    if (filterTagsNames.length > 0) {
      result = result.filter(post => {
        return post.data.tags.some(tag =>
          filterTagsNames.includes(tag.toLowerCase())
        );
      });
    }

    setList(result);
  };

  const clearFilter = () => {
    setFilterTags([]);
    setFilterCategories([]);
    getListAfterFilter();

    if (categoryToggleRef.current?.clear) {
      categoryToggleRef.current.clear();
    }
    if (tagToggleRef.current?.clear) {
      tagToggleRef.current.clear();
    }
  };

  const handleFilterPostWithTags = (tags: FilterItem[]) => {
    setFilterTags([...tags]);
    getListAfterFilter();
  };

  const handleFilterPostWithCategories = (categories: FilterItem[]) => {
    setFilterCategories([...categories]);
    getListAfterFilter();
  };

  return (
    <section className={`${styles.section} ${styles.blogSection} ${mode ? styles.blogSectionMini : ''}`}>
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
            name="Category"
            list={categories}
            className=""
            onFilter={handleFilterPostWithCategories}
            ref={categoryToggleRef}
          />
          {mode !== "mini" && (
            <DirectoryToggle
              name="Tag"
              list={tags}
              className={styles.secondDir}
              onFilter={handleFilterPostWithTags}
              ref={tagToggleRef}
            />
          )}
        </div>
      </div>
      <div className={styles.list}>
        <div className={styles.header}>
          <div className={styles.label}>
            <span>/</span> DATE
          </div>
          <div className={styles.label}>
            <span>/</span> TITLE
          </div>
          <div className={styles.label}>
            <span>/</span> TYPE
          </div>
        </div>
        {list.map((post, index) => (
          <a
            key={index}
            className={styles.listItem}
            href={`${prefix}/blog/${post.slug}`}
          >
            <div className={styles.listItemVisible}>
              <div className={styles.listItemDate}>
                <div className={styles.listItemDateIcon}></div>
                <div className={styles.listItemDateText}>
                  {dayjs(post.data.date).format("YYYY.M.DD")}
                </div>
              </div>
              <div className={styles.listItemTitle}>
                {post.data.title}
              </div>
              <div className={styles.listItemType}>
                {post.data.categories.map((category, catIndex) => (
                  <Badge key={catIndex}>{category}</Badge>
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
                <path d="M 0 5 L 10 5" stroke="currentColor" strokeWidth="1"></path>
                <path
                  className={styles.AccordionButton_verticalPath}
                  d="M 5 0 L 5 10"
                  stroke="currentColor"
                  strokeWidth="1"
                ></path>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;