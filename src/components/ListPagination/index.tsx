import { Link } from 'gatsby';
import React, { useState } from 'react';
import { CircleArrow } from '../CircleArrow';
import * as styles from './index.module.css';

export interface ListPaginationProps {
  prevPage?: string,
  nextPage?: string,
  isFirst?: boolean,
  isLast?: boolean,
}
export function ListPagination(props: ListPaginationProps) {
  const {
    prevPage = '', nextPage = '', isFirst = false, isLast = false,
  } = props;

  const [prevTheme, setPrevTheme] = useState('light');
  const [nextTheme, setNextTheme] = useState('light');

  const renderPrevItem = () => {
    if (!isFirst) {
      return (
        <Link
          className={styles.paginationItem}
          to={prevPage}
          rel="prev"
          onMouseOver={() => setPrevTheme('dark')}
          onMouseOut={() => setPrevTheme('light')}
        >
          <CircleArrow size={16} rotate={90} theme={prevTheme} />
          {' '}
          <span className={styles.paginationItemPrev}>Previous Page</span>
        </Link>
      );
    }
    return null;
  };

  const renderNextItem = () => {
    if (!isLast) {
      return (
        <Link
          className={styles.paginationItem}
          to={nextPage}
          rel="next"
          onMouseOver={() => setNextTheme('dark')}
          onMouseOut={() => setNextTheme('light')}
        >
          <span className={styles.paginationItemNext}>Next Page</span>
          {' '}
          <CircleArrow size={16} rotate={-90} theme={nextTheme} />
        </Link>
      );
    }
    return null;
  };

  return (
    <div className={styles.pagination}>
      {renderPrevItem()}
      {renderNextItem()}
    </div>
  );
}
