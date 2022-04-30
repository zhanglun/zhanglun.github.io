import * as React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/CleanLayout';
import Seo from '../components/seo';

function BlogPostTemplate({ data, location }) {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata?.title || 'Title';
  const siteMenu = data.site.siteMetadata?.menu || [];
  const description = data.site.siteMetadata?.description || '';
  const { previous, next } = data;

  console.log(post);

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
      <section className="article-section">
        <aside className="article-aside">
          <div className="article-aside__item">
            <div className="aside-item__title">Published</div>
            <div className="aside-item__content">
              <time>{post.frontmatter.date}</time>
            </div>
          </div>
          {post.frontmatter.categories.length > 0 && (
            <div className="article-aside__item">
              <div className="aside-item__title">Category</div>
              <div className="aside-item__content">
                {post.frontmatter.categories.map((category) => (
                  <div
                    className="category-item"
                    key={category}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>
          )}
          {post.frontmatter.tags.length > 0 && (
            <div className="article-aside__item">
              <div className="aside-item__title">Tags</div>
              <div className="aside-item__content">
                {post.frontmatter.tags.map((tag) => <div className="tag-item" key={tag}>{tag}</div>)}
              </div>
            </div>
          )}
        </aside>
        <article
          className="blog-post"
          itemScope
          itemType="http://schema.org/Article"
        >
          <header>
            <h1 itemProp="headline">{post.frontmatter.title}</h1>
          </header>
          {post.frontmatter.cover
              && <img className="article-cover" alt={post.frontmatter.cover} src={post.frontmatter.cover} />}
          <section
            dangerouslySetInnerHTML={{ __html: post.html }}
            itemProp="articleBody"
            className="content"
          />
        </article>
        <nav className="pagination">
          {previous ? (
            <Link to={previous.fields.slug} className="prev" rel="prev">
              ←
              {' '}
              {previous.frontmatter.title}
            </Link>
          ) : (
            <span className="prev" />
          )}
          {next ? (
            <Link to={next.fields.slug} className="next" rel="next">
              {next.frontmatter.title}
              {' '}
              →
            </Link>
          ) : (
            <span className="next" />
          )}
        </nav>
      </section>
    </Layout>
  );
}

export default BlogPostTemplate;

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
      html
      tableOfContents
      headings {
        id
        depth
        value
      }
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        cover
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
`;
