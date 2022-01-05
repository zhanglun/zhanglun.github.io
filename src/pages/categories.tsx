import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

// @ts-ignore
import A from '../images/a.png';

const CategoryPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const categoryGroup = data.allMarkdownRemark.group
  const siteMenu = data.site.siteMetadata?.menu || []
  const description = data.site.siteMetadata?.description || ""

  if (categoryGroup.length === 0) {
    return (
      <Layout
        location={location}
        title={siteTitle}
        menu={siteMenu}
        description={description}
      >
        <Seo title="All posts" />
        <p>
          No category found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout
      location={location}
      title={siteTitle}
      menu={siteMenu}
      description={description}
    >
      <Seo title="All posts" />
      <div className="page-title">分类</div>
      <div className="category-list">
        {categoryGroup.map(category => {
          return (
            <Link
              to={`/categories/${category.fieldValue}`}
              key={category.fieldValue}
              className="category-item"
            >
              <div className="category-img">
                <img src={A} alt="" />
              </div>
              <div># {category.fieldValue}</div>
              <div>{category.totalCount}</div>
            </Link>
          )
        })}
      </div>
    </Layout>
  )
}

export default CategoryPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        menu {
          id
          name
          url
        }
      }
    }
    allMarkdownRemark {
      group(field: frontmatter___categories) {
        fieldValue
        totalCount
      }
    }
  }
`
