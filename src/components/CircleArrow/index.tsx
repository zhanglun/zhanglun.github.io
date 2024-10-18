/* eslint-disable react/require-default-props */
import React from "react";
import * as styles from "./index.module.css";

export enum CircleArrowThemeEnum {
  dark = "dark",
  light = "light",
}
export interface CircleArrowProps {
  size?: number;
  rotate?: number;
  theme?: CircleArrowThemeEnum;
  className?: any;
}

export function CircleArrow(props: CircleArrowProps) {
  const { size = 24, rotate = 0, theme = "dark", className } = props;

  const svgStyle = {
    transform: `rotate(${rotate}deg)`,
    width: `${size * 16}px`,
    height: `${size * 16}px`,
    fill: 'none !important',
  };

  const boxClass = `
    inline-block text-0 p-1 border-[black] border leading-[0] rounded-full transition-all duration-150 ease-in-out 
     ${
       theme === "dark" ? "bg-[black] text-[white]" : "bg-[white] text-[black]"
     } 
     ${theme === "dark" ? "" : "hover:bg-[black] hover:text-[white]"} 
     ${
       theme === "dark" ? "" : "group-hover:bg-[black] group-hover:text-[white]"
     } 
     ${className}
  `;

  return (
    <div className={boxClass}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        style={svgStyle}
      >
        <path
          stroke="currentColor"
          strokeWidth="1.4"
          d="M12 3v17M19 13l-7 7-7-7"
        />
      </svg>
    </div>
  );
}
