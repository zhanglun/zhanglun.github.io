import React from "react";
import clsx from "clsx";
import PlusIcons from "./PlusIcons";
import styles from "./HomeHero.module.css";

interface HomeHeroProps {
  site: {
    title: string;
    description: string;
  };
}

export default function HomeHero({ site }: HomeHeroProps) {
  return (
    <section className={clsx("section", styles.homeHeroSection)}>
      <PlusIcons />
      <div className={styles.title}>
        <h1 className="text-hero">{site.title}</h1>
      </div>
      <div className={styles.subTitle}>
        {site.description}
        <div>Full-stack Developer / Open Source Lover.</div>
      </div>
      <PlusIcons />
    </section>
  );
}
