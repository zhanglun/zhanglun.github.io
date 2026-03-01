import React from "react";
import "./index.css";

export default function NavMenu() {
  return (
    <div className="fixed left-1/2 top-0 z-2 w-full max-w-[1728px] translate-x-[-50%] flex gap-1 justify-between p-3">
      <div className="flex gap-[2px]">
        <a href="/" className="nav-item-link">
          <svg
            className="logo-icon"
            width="13"
            height="15"
            viewBox="0 0 13 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 14.0578L12.6296 11.302V0.942383L0 3.64711V14.0578Z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a href="/blog" className="nav-item-link">
          {" "}
          [B] BLOG{" "}
        </a>
        <a href="/projects" className="nav-item-link">
          {" "}
          [P] PROJECT{" "}
        </a>
        <a href="https://github.com/zhanglun" className="nav-item-link">
          {" "}
          [G] GITHUB{" "}
        </a>
        <a href="/about" className="nav-item-link">
          {" "}
          [A] ABOUT{" "}
        </a>
      </div>

      {/* Theme toggle - commented out in original */}
      {/* <div className="nav-item-link" onClick={toggleTheme}>
        <div className={spin ? 'spin-right' : ''}>
          {theme === "dark" ? (
            <Moon strokeWidth={1.5} size={18} />
          ) : (
            <Sun strokeWidth={1.5} size={18} />
          )}
          <span className="sr-only">Toggle theme</span>
        </div>
      </div> */}
    </div>
  );
}
