import React from 'react';
import * as style from './index.module.css';

export interface ProjectItemProps {
  name: string;
  description: string;
  url: string;
}

export interface ProjectProps {
  list: ProjectItemProps[];
}

export const ProjectCards = (props: ProjectProps) => {
  const { list } = props;
  return (
    <div className={style.list}>
      {list.map((item, idx) => (
        <div className={style.item}>
          <div className={[style.image, style[`project${idx + 1}`]].join(' ')} />
          <h2><a href={item.url}>{item.name}</a></h2>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};
