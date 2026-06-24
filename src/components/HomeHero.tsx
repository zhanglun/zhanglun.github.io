import React from "react";
import clsx from "clsx";
import { useScramble } from "@scrambl/react";
import PlusIcons from "./PlusIcons";
import styles from "./HomeHero.module.css";

interface HomeHeroProps {
  site: {
    title: string;
    description: string;
  };
}

export default function HomeHero({ site }: HomeHeroProps) {
  const { ref, replay } = useScramble({
    text: site.title,
    chars: "blocks",
    from: "left",
    duration: 800,
    playOnMount: true,
    trigger: "hover",
  });

  return (
    <section className={clsx("section", styles.homeHeroSection)}>
      <PlusIcons />
      <div className={styles.title}>
        <h1 ref={ref} className="text-hero" onClick={replay}>
          {site.title}
        </h1>
      </div>
      <div className={styles.subTitle}>
        {site.description}
        <div>Full-stack Developer / Open Source Lover.</div>
      </div>
      <PlusIcons />
    </section>
  );
}
