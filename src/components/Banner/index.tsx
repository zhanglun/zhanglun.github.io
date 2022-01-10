import React from "react"
import "./index.css"

export const Banner = ({ description }) => {
  return (
    <div className="banner">
      <div className="banner-title">{description}</div>
    </div>
  )
}
