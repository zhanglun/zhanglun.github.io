import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function SectionContainer({ className = "", children }: Props) {
  return (
    <section className={`section ${className && className}`}>
      {children}
    </section>
  );
}
