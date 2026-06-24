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
    chars: "braille",
    renderMode: "text",
    from: "random",
    duration: 800,
    playOnMount: true,
    trigger: "hover",
  });

  const { ref: descRef, replay: replayDesc } = useScramble({
    text: site.description,
    chars: "braille",
    renderMode: "text",
    from: "left",
    duration: 800,
    playOnMount: true,
    trigger: "hover",
  });

  const { ref: roleRef, replay: replayRole } = useScramble({
    text: "Full-stack Developer / Open Source Lover.",
    chars: "braille",
    renderMode: "text",
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
        <div ref={descRef} onClick={replayDesc}>
          {site.description}
        </div>
        <div ref={roleRef} onClick={replayRole}>
          Full-stack Developer / Open Source Lover.
        </div>
      </div>
      <PlusIcons />
    </section>
  );
}
