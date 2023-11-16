import React from "react";
import { projects } from "./projectData";

export const Lab = () => {
  
  return <div>
    <div className="max-w-screen-2xl mx-auto context grid grid-cols-[1fr_1fr_1fr] gap-[3.75rem_2rem]">
      {projects.map((item, idx) => (
        <div className="w-full group cursor-pointer">
          <div className="" />
          <h2 className="flex items-center text-xl leading-none mb-2">
            <a className="group-hover:underline mr-3" target="_blank" href={item.url}>{item.name}</a>
            <div className="bg-[var(--color-text-base)] rounded-full text-[white] fill-[white] text-[0] opacity-0 p-1 scale-50 transition-all -rotate-[135deg]
            group-hover:opacity-100 group-hover:scale-90">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                className="fill-transparent"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="1.4"
                  d="M12 3v17M19 13l-7 7-7-7"
                />
              </svg>
            </div>
          </h2>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  </div>;
};
