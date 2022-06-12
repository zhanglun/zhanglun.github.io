import React from 'react';
import './index.css';

type CategoryListProps = {
  items: string[]
}

export function CategoryLabel(props: CategoryListProps) {
  const { items } = props;

  return (
    <div className="article-category-list">
      {items.map((category) => (
        <span className="article-category" key={category}>
          {category}
        </span>
      ))}
    </div>
  );
}
