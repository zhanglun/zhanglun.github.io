import React, { useEffect, useRef } from 'react';
import { Link, graphql, PageProps } from 'gatsby';

import Layout from '../components/CleanLayout';
import Seo from '../components/seo';
import { ListPagination } from '../components/ListPagination';

type DataType = {
  site: {
    siteMetadata: {
      title: string;
      menu?: any[];
      description?: string;
    };
  };
  allMarkdownRemark: {
    nodes: any[];
  };
  previous?: any;
  next?: any;
  markdownRemark: any;
};

function BlogPostTemplate({ data, location }: PageProps<DataType>) {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata?.title || 'Title';
  const siteMenu = data.site.siteMetadata?.menu || [];
  const description = data.site.siteMetadata?.description || '';
  const { previous, next } = data;
  const headingRef = useRef<any>([]);
  const linkRef = useRef<any>([]);

  const updateLinks = (visibleId: string) => {
    linkRef.current.forEach((link: HTMLAnchorElement) => {
      link.classList.remove('visible');
      const href = link.getAttribute('href') as string;

      if (href.indexOf(visibleId) > -1) {
        link.classList.add('visible');
      }
    });
  };

  const handleObserver = (entries: any[]) => {
    entries.forEach((entry) => {
      const { target, isIntersecting, intersectionRatio } = entry;

      if (isIntersecting && intersectionRatio >= 1) {
        const visibleId = target.id;
        updateLinks(visibleId);
      }
    });
  };

  useEffect(() => {
    const headings = document.querySelectorAll('.heading');

    if (headings) {
      headingRef.current = headings;
      linkRef.current = document.querySelectorAll('.aside-toc a');

      const observer = new IntersectionObserver(handleObserver, {
        threshold: 1,
      });

      if (headingRef.current) {
        headingRef.current.forEach((anchor: any) => observer.observe(anchor));
      }
      return () => {
        observer.disconnect();
      };
    }

    return undefined;
  }, []);

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
                {post.frontmatter.categories.map((category: string) => (
                  <Link
                    className="category-item"
                    to={`/categories/${category}`}
                    key={category}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {post.frontmatter.tags.length > 0 && (
            <div className="article-aside__item">
              <div className="aside-item__title">Tags</div>
              <div className="aside-item__content">
                {post.frontmatter.tags.map((tag: string) => (
                  <div className="tag-item" key={tag}>
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}
          {post.tableOfContents && (
            <div className="article-aside__item">
              <div className="aside-item__title">Content</div>
              <div className="aside-item__content">
                <div className="aside-toc">
                  {post.headings.map((heading: any) => (
                    <a
                      key={heading.id}
                      href={`#${decodeURIComponent(heading.id)}`}
                      className={`aside-toc__link aside-toc__link--depth-${heading.depth}`}
                    >
                      {heading.value}
                    </a>
                  ))}
                </div>
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
          {post.frontmatter.cover && (
            <img
              className="article-cover"
              alt={post.frontmatter.cover}
              src={post.frontmatter.cover}
            />
          )}
          <section
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: post.html }}
            itemProp="articleBody"
            className="content"
          />
        </article>
        <div className="pagination">
          <ListPagination
            prevPage={previous ? previous.fields.slug : null}
            prevPageTitle={previous ? previous.frontmatter.title : null}
            nextPage={next ? next.fields.slug : ''}
            nextPageTitle={next ? next.frontmatter.title : ''}
          />
        </div>
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
