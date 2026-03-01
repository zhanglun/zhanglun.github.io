import React, { useState, useRef } from "react";
import DirectoryToggle, { type DirectoryToggleRef } from "./DirectoryToggle";
import LineHeader from "./LineHeader";
import Badge from "./Badge/Badge";
import dayjs from "dayjs";
import clsx from "clsx";
import "./BlogSection.css";

interface Post {
  slug: string;
  data: {
    title: string;
    date: string | Date;
    categories: string[];
    tags: string[];
  };
}

interface Props {
  posts?: Post[];
  prefix?: string;
  categories?: [string, number][];
  tags?: [string, number][];
  mode?: string;
}

export default function BlogSection({
  posts = [],
  prefix = "",
  categories = [],
  tags = [],
  mode,
}: Props) {
  const [filterTags, setFilterTags] = useState<[string, number, boolean][]>([]);
  const [filterCategories, setFilterCategories] = useState<
    [string, number, boolean][]
  >([]);
  const [list, setList] = useState<Post[]>([...posts]);

  const categoryToggleRef = useRef<DirectoryToggleRef>(null);
  const tagToggleRef = useRef<DirectoryToggleRef>(null);

  const getListAfterFilter = (
    currentFilterCategories: [string, number, boolean][],
    currentFilterTags: [string, number, boolean][]
  ) => {
    const filterCategoriesNames = currentFilterCategories.map(_ =>
      _[0].toLowerCase()
    );
    const filterTagsNames = currentFilterTags.map(_ => _[0].toLowerCase());

    let result = [...posts];

    if (filterCategoriesNames.length) {
      result = result.filter(post => {
        return post.data.categories.some(category =>
          filterCategoriesNames.includes(category?.toLowerCase())
        );
      });
    }

    if (filterTagsNames.length) {
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
    getListAfterFilter([], []);

    categoryToggleRef.current?.clear();
    tagToggleRef.current?.clear();
  };

  const handleFilterPostWithTags = (tags: [string, number, boolean][]) => {
    setFilterTags([...tags]);
    getListAfterFilter(filterCategories, tags);
  };

  const handleFilterPostWithCategories = (
    categories: [string, number, boolean][]
  ) => {
    setFilterCategories([...categories]);
    getListAfterFilter(categories, filterTags);
  };

  return (
    <section
      className={clsx("section blog--section", mode && "blog--section--mini")}
    >
      <div className="sidebar">
        <div className="title">
          Blog <sup>({posts.length})</sup>
        </div>
        <div className="filter">
          <LineHeader
            title="FILTERS"
            subfix="CLEAR FILTERS"
            onSubfixClick={() => {
              clearFilter();
            }}
          />
          <DirectoryToggle
            ref={categoryToggleRef}
            name="Catetory"
            list={categories}
            className=""
            onFilter={handleFilterPostWithCategories}
          />
          {mode !== "mini" && (
            <DirectoryToggle
              ref={tagToggleRef}
              name="Tag"
              list={tags}
              className="secondDir"
              onFilter={handleFilterPostWithTags}
            />
          )}
        </div>
      </div>
      <div className="list">
        <div className="header">
          <div className="label label__date text-smallcaps">
            <span>/</span> DATE
          </div>
          <div className="label label__title text-smallcaps">
            <span>/</span> TITLE
          </div>
          <div className="label label__type text-smallcaps">
            <span>/</span> TYPE
          </div>
        </div>
        {list.map(post => (
          <a
            key={post.slug}
            className="list__item"
            href={`${prefix}/blog/${post.slug}`}
          >
            <div className="list__item-visible">
              <div className="list__item-date">
                <div className="list__item-date__icon"></div>
                <div className="list__item-date__text text-smallcaps">
                  {dayjs(post.data.date).format("YYYY.M.DD")}
                </div>
              </div>
              <div className="text-md list__item-title">{post.data.title}</div>
              <div className="text-smallcaps list__item-type">
                {post.data.categories.map((category, index) => (
                  <Badge key={index}>{category}</Badge>
                ))}
              </div>
              <svg
                className="list__item-button"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 0 5 L 10 5" stroke="currentColor" strokeWidth="1" />
                <path
                  className="AccordionButton_verticalPath__2lCIc"
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
