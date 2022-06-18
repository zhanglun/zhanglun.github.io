import React from 'react';
import * as styles from './index.module.css';

export interface HomeProps {
  siteMetadata: any
}

export const Home = ({
  siteMetadata,
}: HomeProps) => (
  <div className={styles.main}>
    <h1 className={styles.title}>{siteMetadata.title}</h1>
    <p className={styles.subTitle}>还没设计好 🤡🤡🤡 </p>
  </div>
);
