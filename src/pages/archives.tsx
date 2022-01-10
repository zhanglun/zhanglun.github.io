import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const ArchivePage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const postGroup = data.allMarkdownRemark.group.slice(0).reverse()
  const siteMenu = data.site.siteMetadata?.menu || []
  const description = data.site.siteMetadata?.description || ""

  // Gatsby group不支持sort，先在逻辑中排序。有能力之后再提交PR给 Gatsby
  postGroup.forEach((group) => {
    const { nodes } = group;
    
    group.nodes = nodes.sort((a, b) => {
      const aDate = a.frontmatter.date || '';
      const bDate = b.frontmatter.date || '';

      if (aDate > bDate) {
        return -1;
      } else {
        return 1;
      }

      return 0;
    });
  });

  if (postGroup.length === 0) {
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
      <div className="page-title"></div>
      {postGroup.map((archive, idx) => {
        return (
          <div className="archive-item" key={idx}>
            <div className="archive-item-head">
              <div className="archive-year">{archive.fieldValue}</div>
            </div>
            <ul className="archive-item-list">
              {archive.nodes.map(node => {
                const date = `${(node.fields.month + "").padStart(2, "0")}-${(
                  node.fields.day + ""
                ).padStart(2, "0")}`

                return (
                  <li key={node.fields.slug}>
                    <span className="archive-date">{date}</span>
                    <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </Layout>
  )
}

export default ArchivePage

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
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { status: { eq: "publish" } } }
    ) {
      group(field: fields___year) {
        fieldValue
        totalCount
        nodes {
          frontmatter {
            date
            title
            status
            categories
          }
          fields {
            slug
            year
            month
            day
          }
        }
      }
    }
  }
`
