import React from "react"
import "./index.css";

export const Footer = () => {
  return (
    <footer className="footer">
      © {new Date().getFullYear()}, Built with
      {` `}
      <a href="https://www.gatsbyjs.com">Gatsby</a>
    </footer>
  )
}
