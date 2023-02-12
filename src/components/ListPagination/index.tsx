import React, { useState } from "react";
import { CircleArrow, CircleArrowThemeEnum } from "../CircleArrow";

export interface ListPaginationProps {
  prevPage?: string;
  prevPageTitle?: string;
  nextPage?: string;
  nextPageTitle?: string;
}
export function ListPagination(props: ListPaginationProps) {
  const {
    prevPage = "",
    prevPageTitle = "Previous Page",
    nextPage = "",
    nextPageTitle = "Next Page",
  } = props;

  const [prevTheme, setPrevTheme] = useState(CircleArrowThemeEnum.light);
  const [nextTheme, setNextTheme] = useState(CircleArrowThemeEnum.light);
  const styles = {
    prev: 'relative leading-none ml-4 text-sm group-hover:after:scale-x-100',
    next: 'relative leading-none mr-4 text-sm group-hover:after:scale-x-100',
    pseudoLine: 'after:content-[" "] after:block after:absolute after:bottom-[-2px] after:w-full after:h-[1px] after:bg-[currentColor] after:scale-x-0 after:origin-right after:transition-transform',
  }

  const renderPrevItem = () => {
    if (prevPage) {
      return (
        <a
          className="flex items-center justify-between text-[var(--color-text-base)] group hover:underline"
          href={prevPage}
          rel="prev"
          aria-label="Previous"
          onMouseOver={() => setPrevTheme(CircleArrowThemeEnum.dark)}
          onMouseOut={() => setPrevTheme(CircleArrowThemeEnum.light)}
        >
          <CircleArrow size={1.3} rotate={90} theme={prevTheme} />{" "}
          <span className={styles.prev + ' ' + styles.pseudoLine + ' ' + 'after:left-0 after:origin-right'}>
            {prevPageTitle}
          </span>
        </a>
      );
    }
    return null;
  };

  const renderNextItem = () => {
    if (nextPage) {
      return (
        <a
          className="flex items-center justify-between text-[var(--color-text-base)] group hover:underline"
          href={nextPage}
          rel="next"
          aria-label="Next"
          onMouseOver={() => setNextTheme(CircleArrowThemeEnum.dark)}
          onMouseOut={() => setNextTheme(CircleArrowThemeEnum.light)}
        >
          <span className={styles.next + ' ' + styles.pseudoLine + ' ' + 'after:right-0 after:origin-left'}>
            {nextPageTitle}
          </span>{" "}
          <CircleArrow size={1.3} rotate={-90} theme={nextTheme} />
        </a>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center justify-between w-full">
      {renderPrevItem()}
      <span />
      {renderNextItem()}
    </div>
  );
}
