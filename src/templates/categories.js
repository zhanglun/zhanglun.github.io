import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { ArticleList } from "../components/Article/ArticleList"
import A from "../images/a.png"

const CategoryTempalte = ({ data, location, pageContext }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const siteMenu = data.site.siteMetadata?.menu || []
  const description = data.site.siteMetadata?.description || ""
  const { category, count } = pageContext
  const { nodes: posts } = data.allMarkdownRemark;

  console.log(pageContext)

  return (
    <Layout
      location={location}
      title={siteTitle}
      menu={siteMenu}
      description={description}
    >
      <Seo title="All posts" />
      <div className="category-page-header">
        <div className="category-item">
          {/* <div className="category-img">
            <img src={A} alt="" />
          </div> */}
          <div># {category.name || category}</div>
          <div>{count}</div>
        </div>
      </div>
      <div className="category-page-body">
      <ArticleList posts={posts} />
      </div>
    </Layout>
  )
}

export default CategoryTempalte

export const pageQuery = graphql`
  query categoryQuerPage ($category: String) {
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
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {frontmatter: {categories: {eq: $category }}}
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          draft
        }
      }
    }
  }
`
