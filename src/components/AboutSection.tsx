import React from "react";
import "./AboutSection.css";

interface Props {
  children?: React.ReactNode;
}

export default function AboutSection({ children }: Props) {
  return (
    <section className="section project--section">
      <div className="header">
        <div className="label text-smallcaps">
          <span>/</span> ABOUT ME
        </div>
      </div>
      <div className="content">{children}</div>
    </section>
  );
}
