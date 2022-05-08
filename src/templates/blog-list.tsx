import React from 'react';
import { Link, graphql } from 'gatsby';
import Seo from '../components/seo';
import { ArticleList } from '../components/Article/ArticleList';
import BlogLayout from '../components/BlogLayout';

function BlogList({ data, pageContext, location }) {
  const { currentPage, numPages } = pageContext;
  // const isFirst = currentPage === 1;
  // const isLast = currentPage === numPages;
  // const prevPage = currentPage - 1 === 1 ? '/' : `/page/${(currentPage - 1).toString()}`;
  // const nextPage = `/page/${(currentPage + 1).toString()}`;

  const siteTitle = data.site.siteMetadata?.title || 'Title';
  const posts = data.allMarkdownRemark.nodes;
  const siteMenu = data.site.siteMetadata?.menu || [];
  const description = data.site.siteMetadata?.description || '';

  return (
    <BlogLayout
      location={location}
      title={siteTitle}
      description={description}
      menu={siteMenu}
    >
      <Seo title="All posts" />
      <ArticleList posts={posts} />
    </BlogLayout>
  );
}

export default BlogList;

export const BlogListQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
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
      filter: {frontmatter: {status: {eq: "publish"}}}
      limit: $limit
      skip: $skip
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          title
          status
          cover
          categories
          tags
        }
      }
    }
  }
`;
