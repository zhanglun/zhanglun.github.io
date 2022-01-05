import React from "react"
import "./index.css"

type CategoryListProps = {
  items: { name: string }[]
}

export const CategoryLabel = (props: CategoryListProps) => {
  const { items } = props

  return (
    <div className="article-category-list">
      {items.map((category, idx) => {
        return (
          <span className="article-category" key={idx}>
            {category}
          </span>
        )
      })}
    </div>
  )
}
