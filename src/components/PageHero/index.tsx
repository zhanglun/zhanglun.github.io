import React from 'react';
import * as styles from './index.module.css';

export interface PageHeroProps {
  title: string;
  subTitle: string;
}
export const PageHero = (props: PageHeroProps) => {
  const { title, subTitle } = props;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subTitle}>{subTitle}</p>
      </div>
    </div>
  );
};
