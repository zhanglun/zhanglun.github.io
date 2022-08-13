import * as React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import Seo from '../components/seo';
import { PageHero } from '../components/PageHero';

function CategoryPage({ data, location }) {
  const siteTitle = data.site.siteMetadata?.title || 'Title';
  const categoryGroup = data.allMarkdownRemark.group;
  const siteMenu = data.site.siteMetadata?.menu || [];
  const description = data.site.siteMetadata?.description || '';

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
    );
  }

  return (
    <Layout
      location={location}
      title={siteTitle}
      menu={siteMenu}
      description={description}
    >
      <Seo title="纸上得来终觉浅，绝知此事要躬行·Category·分类" />
      <section className="category-page">
        <PageHero title="分类" subTitle="纸上得来终觉浅，绝知此事要躬行" />
        <div className="category-list">
          {categoryGroup.map((category) => (
            <Link
              to={`/categories/${category.fieldValue}`}
              key={category.fieldValue}
              className="category-item"
            >
              <div>
                #
                {' '}
                {category.fieldValue}
              </div>
              <div>{category.totalCount}</div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default CategoryPage;

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
`;
