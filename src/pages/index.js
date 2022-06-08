import * as React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';
import { ArticleList } from '../components/Article/ArticleList';

function BlogIndex({ data, location }) {
  const siteTitle = data.site.siteMetadata?.title || 'Title';
  const posts = data.allMarkdownRemark.nodes;
  const siteMenu = data.site.siteMetadata?.menu || [];
  const description = data.site.siteMetadata?.description || '';

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle} menu={siteMenu}>
        <Seo title="All posts" />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    );
  }

  return (
    <Layout
      location={location}
      title={siteTitle}
      menu={siteMenu}
      description={description}
    >
      <Seo title="All posts" />
      <section className="article-main">
        <ArticleList posts={posts} />
      </section>
      <div className="pagination">
        {' '}
        <span />
        <Link to="/blogs/2" rel="next">
          Next Page →
        </Link>
      </div>
    </Layout>
  );
}

export default BlogIndex;

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
      limit: 20
      ) {
      nodes {
        excerpt(truncate: true, pruneLength: 140)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          title
          description
          tags
          cover
          categories
        }
      }
    }
  }
`;
