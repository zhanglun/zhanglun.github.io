import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { CategoryLabel } from "../components/CategoryLabel"

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const siteMenu = data.site.siteMetadata?.menu || []
  const description = data.site.siteMetadata?.description || ""
  const { previous, next } = data

  return (
    <Layout
      location={location}
      title={siteTitle}
      menu={siteMenu}
      description={description}
    >
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          {post.frontmatter.categories && (
            <CategoryLabel items={post.frontmatter.categories} />
          )}
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
          className="content"
        />
        <hr />
        <footer></footer>
      </article>
      <nav className="pagination">
        {previous && (
          <Link to={previous.fields.slug} rel="prev">
            ← {previous.frontmatter.title}
          </Link>
        )}
        {next && (
          <Link to={next.fields.slug} rel="next">
            {next.frontmatter.title} →
          </Link>
        )}
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
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
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(truncate: true, pruneLength: 140)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        categories
        tags
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
        tags
        categories
        status
      }
    }
  }
`
