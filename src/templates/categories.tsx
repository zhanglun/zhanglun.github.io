import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';
import { ArticleList } from '../components/Article/ArticleList';
import { PageHero } from '../components/PageHero';

function CategoryTempalte({ data, location, pageContext }) {
  const siteTitle = data.site.siteMetadata?.title || 'Title';
  const siteMenu = data.site.siteMetadata?.menu || [];
  const description = data.site.siteMetadata?.description || '';
  const { category, count } = pageContext;
  const { nodes: posts } = data.allMarkdownRemark;

  console.log(pageContext);

  return (
    <Layout
      location={location}
      title={siteTitle}
      menu={siteMenu}
      description={description}
    >
      <Seo title="All posts" />
      <PageHero title={`#${category.name || category}`} subTitle={count} />
      <div className="category-page-body">
        <ArticleList posts={posts} />
      </div>
    </Layout>
  );
}

export default CategoryTempalte;

export const pageQuery = graphql`
  query categoryQueryPage ($category: String) {
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
        excerpt(truncate: true, pruneLength: 140)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          title
          description
          status
          cover
          categories
          tags
        }
      }
    }
  }
`;
