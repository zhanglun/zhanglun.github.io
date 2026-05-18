import React from "react";
import clsx from "clsx";
import styles from "./AboutSection.module.css";

interface AboutSectionProps {
  children?: React.ReactNode;
}

export default function AboutSection({ children }: AboutSectionProps) {
  return (
    <section className={clsx("section", styles.section)}>
      <div className={styles.header}>
        <div className={`${styles.label} text-smallcaps`}>
          <span>/</span> ABOUT ME
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
