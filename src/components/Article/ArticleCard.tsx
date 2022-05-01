// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Link } from 'gatsby';

export function ArticleCard({ post }) {
  const title = post.frontmatter.title || post.fields.slug;
  const frontmatter = post.frontmatter || {};

  return (
    <li key={post.fields.slug}>
      <article
        className="article-card"
        itemScope
        itemType="http://schema.org/Article"
      >
        <div className="article-card__cover">
          <img src={frontmatter.cover} alt="post.cover" />
        </div>
        <Link
          className="article-card__body"
          to={post.fields.slug}
          itemProp="url"
        >
          {frontmatter.categories.length > 0 && (
            <div className="article-card__categories">
              {frontmatter.categories.map((category) => (
                // <Link
                //   className="article-card__category"
                //   to={`/categories/${category}`}
                //   key={category}
                // >
                //   {category}
                // </Link>
                <span
                  className="article-card__category"
                  key={category}
                >
                  {category}
                </span>
              ))}
            </div>
          )}
          <time>{frontmatter.date}</time>
          <h2
            className="article-card__title"
            itemProp="headline"
          >
            {title}
          </h2>
          {frontmatter.tags.length > 0 && (
            <div className="article-card__tags">
              {frontmatter.tags.map((tag) => <span className="article-card__tag" key={tag}>{tag}</span>)}
            </div>
          )}
        </Link>
        {/* <section> */}
        {/*  <p */}
        {/*    dangerouslySetInnerHTML={{ */}
        {/*      __html: post.frontmatter.description || post.excerpt, */}
        {/*    }} */}
        {/*    itemProp="description" */}
        {/*  /> */}
        {/* </section> */}
        {/* <footer> */}
        {/*  <Link to={post.fields.slug} itemProp="url" className="read-more"> */}
        {/*    READ MORE */}
        {/*  </Link> */}
        {/* </footer> */}
      </article>
    </li>
  );
}
