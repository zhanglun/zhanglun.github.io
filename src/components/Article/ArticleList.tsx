import React from 'react';
// import { ArticleItem } from './ArticleItem';
import { ArticleCard } from './ArticleCard';

import './index.css';

export function ArticleList({ posts }) {
  return (
    <ul className="article-list">
      {/* {posts.map((post) => <ArticleItem post={post} key={post.id} />)} */}
      {posts.map((post) => <ArticleCard post={post} key={post.id} />)}
    </ul>
  );
}
