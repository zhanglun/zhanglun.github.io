import React from 'react';
import { ArticleItem } from './ArticleItem';

import './index.css';

export function ArticleList({ posts }) {
  return (
    <ul className="article-list">
      {posts.map((post) => <ArticleItem post={post} key={post.id} />)}
    </ul>
  );
}
