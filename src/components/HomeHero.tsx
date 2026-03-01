import React from "react";
import PlusIcons from "./PlusIcons";
import "./HomeHero.css";

interface Props {
  site?: {
    title?: string;
    description?: string;
  };
}

export default function HomeHero({ site = {} }: Props) {
  return (
    <section className="section home-hero-section">
      <PlusIcons />
      <div className="title">
        <h1 className="text-hero">{site.title}</h1>
      </div>
      <div className="content subTitle">{site.description}</div>
      <PlusIcons />
    </section>
  );
}
