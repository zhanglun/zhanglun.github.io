import React from "react";
import Icon from "../../images/icon.png";
import * as styles from "./index.module.css";
export interface HomeProps {
  siteMetadata: any;
}

export const Home = ({ siteMetadata }: HomeProps) => (
  <div className={styles.main}>
    <div className={styles.profile}>
      <div className={styles.headline}>
        <img className={styles.avatar} src={Icon} alt="" />
        <h1 className={styles.title}>{siteMetadata.title}</h1>
      </div>
      <p className={styles.subTitle}>
        Halo! 我是 zhanglun 👋🏼 一位软件开发工程师。
      </p>
    </div>
  </div>
);
