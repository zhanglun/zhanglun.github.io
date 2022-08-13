import React from 'react';
import { Link } from 'gatsby';
import Icon from '../../images/icon.png';
import * as styles from './index.module.css';
import { CircleArrow, CircleArrowThemeEnum } from '../CircleArrow';

export interface HomeProps {
  siteMetadata: any;
  menu: any;
}

export const Home = ({ siteMetadata, menu }: HomeProps) => {
  const renderMenu = () => menu.map((item: any, idx: number) => (
    <Link
      className={`${styles.menuItem} theme-${idx + 1}`}
      to={item.url}
      key={item.id}
    >
      {item.name}
      {' '}
      <CircleArrow rotate={-125} size={12} theme={CircleArrowThemeEnum.dark} />
    </Link>
  ));

  return (
    <div className={styles.main}>
      <div>
        <div className={styles.profile}>
          <div className={styles.headline}>
            <img className={styles.avatar} src={Icon} alt="" />
            <h1 className={styles.title}>{siteMetadata.title}</h1>
          </div>
          <p className={styles.subTitle}>
            Halo! 我是 zhanglun 👋🏼 一位软件开发工程师。
          </p>
        </div>
        <div className={styles.menu}>{renderMenu()}</div>
      </div>
    </div>
  );
};
