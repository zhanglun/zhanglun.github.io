import React from "react";
import styles from "./index.module.css";

export default function NavMenu() {
  return (
    <div className={styles.container}>
      <div className={styles.navGroup}>
        <a href="/" className={styles.navItemLink}>
          <svg
            className={styles.logoIcon}
            width="13"
            height="15"
            viewBox="0 0 13 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Home</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 14.0578L12.6296 11.302V0.942383L0 3.64711V14.0578Z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a href="/blog" className={styles.navItemLink}>
          [B] BLOG
        </a>
        <a href="/projects" className={styles.navItemLink}>
          [P] PROJECT
        </a>
        <a
          href="https://github.com/zhanglun"
          className={styles.navItemLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          [G] GITHUB
        </a>
        <a href="/about" className={styles.navItemLink}>
          [A] ABOUT
        </a>
      </div>
    </div>
  );
}
