/* eslint-disable react/require-default-props */
import React from 'react';
import * as styles from './index.module.css';

export enum CircleArrowThemeEnum {
  'dark', 'light'
}
export interface CircleArrowProps {
  size?: number,
  rotate?: number,
  theme?: CircleArrowThemeEnum,
}

export function CircleArrow(props: CircleArrowProps) {
  const { size = 24, rotate = 0, theme = 'dark' } = props;

  const style = {
    transform: `rotate(${rotate}deg)`,
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div className={`${styles.circle} ${styles[theme]}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        style={style}
      >
        <path stroke="currentColor" strokeWidth="1.4" d="M12 3v17M19 13l-7 7-7-7" />
      </svg>
    </div>
  );
}
