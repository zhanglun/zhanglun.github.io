import React from "react"
import { ArticleItem } from "./ArticleItem"

import "./index.css"

export const ArticleList = ({ posts }) => {
  return (
    <ul className="article-list">
      {posts.map((post, idx) => {
        return <ArticleItem post={post} key={idx} />
      })}
    </ul>
  )
}
