import { Link } from 'gatsby';
import React, { useState } from 'react';
import { CircleArrow } from '../CircleArrow';
import * as styles from './index.module.css';

export function ListPagination(props) {
  const {
    prevPage, nextPage, isFirst, isLast,
  } = props;

  const [prevTheme, setPrevTheme] = useState('light');
  const [nextTheme, setNextTheme] = useState('light');

  return (
    <div className={styles.pagination}>
      {!isFirst && (
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
      )}
      <span />
      {!isLast && (
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
      )}
    </div>
  );
}
