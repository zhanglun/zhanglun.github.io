import * as React from 'react';
import { Link, graphql, PageProps } from 'gatsby';
import Layout from '../components/layout';
import Seo from '../components/seo';
import { PageHero } from '../components/PageHero';

type DataProps = {
  site: {
    siteMetadata: {
      title: string;
      menu?: any[];
      description?: string;
    };
  };
  allMarkdownRemark: {
    nodes: any[];
    group: {
      nodes: any[];
    }[];
  };
};

type PageContextType = {
  currentPage: number;
  numPages: number;
};

function ArchivePage({
  data,
  location,
}: PageProps<DataProps, PageContextType>) {
  const siteTitle = data.site.siteMetadata?.title || 'Title';
  const postGroup = data.allMarkdownRemark.group.slice(0).reverse();
  const siteMenu = data.site.siteMetadata?.menu || [];
  const description = data.site.siteMetadata?.description || '';

  console.log(postGroup);

  // Gatsby group不支持sort，先在逻辑中排序。
  postGroup.forEach((group) => {
    const { nodes } = group;

    group.nodes = nodes.sort((a, b) => {
      const aDate = a.frontmatter.date || '';
      const bDate = b.frontmatter.date || '';

      if (aDate > bDate) {
        return -1;
      }
      return 1;
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
        <p>No category found.</p>
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
      <section className="archive-page">
        <div className="archive-page__container">
          <PageHero title="归档" subTitle="花有重开日，人无再少年" />
          {postGroup.map((archive) => (
            <div className="archive-section" key={archive.fieldValue}>
              <div className="archive-section__head">
                <div className="archive-section__year">{archive.fieldValue}</div>
              </div>
              <ul className="archive-posts">
                {archive.nodes.map((node) => {
                  const date = `${`${node.fields.month}`.padStart(
                    2,
                    '0',
                  )}-${`${node.fields.day}`.padStart(2, '0')}`;

                  return (
                    <li key={node.fields.slug} className="archive-posts__item">
                      <h3 className="archive-page__post-title">
                        <Link to={node.fields.slug}>
                          {node.frontmatter.title}
                        </Link>
                      </h3>
                      <span className="archive-page__post-date">{date}</span>
                      <p className="archive-page__post-excerpt">{node.excerpt}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default ArchivePage;

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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
          excerpt(truncate: true, pruneLength: 80)
        }
      }
    }
  }
`;
