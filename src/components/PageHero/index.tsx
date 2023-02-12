import React from "react";

export interface PageHeroProps {
  title: string;
  subTitle: string;
}
export const PageHero = (props: PageHeroProps) => {
  const { title, subTitle } = props;

  return (
    <div className="mx-auto w-full grid pt-32 pb-40">
      <div className="grid gap-y-14 gap-6 relative w-full grid-cols-[repeat(12,1fr)]">
        <h1 className="m-0 text-[9.5rem] font-semibold col-[span_12] text-center tracking-tighter">
          {title}
        </h1>
        <p className="m-0 text-[2rem] font-semibold col-[4/span_6] text-center tracking-tighter">
          {subTitle}
        </p>
      </div>
    </div>
  );
};
