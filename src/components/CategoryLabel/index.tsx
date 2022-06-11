import React from 'react';
import './index.css';

type CategoryListProps = {
  items: string[]
}

export function CategoryLabel(props: CategoryListProps) {
  const { items } = props;

  return (
    <div className="article-category-list">
      {items.map((category, idx) => (
        <span className="article-category" key={idx}>
          {category}
        </span>
      ))}
    </div>
  );
}
