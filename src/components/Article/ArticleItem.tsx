import React from 'react';
import { Link } from 'gatsby';
import { CategoryLabel } from '../CategoryLabel';

export function ArticleItem({ post }) {
  const title = post.frontmatter.title || post.fields.slug;
  const frontmatter = post.frontmatter || {};

  return (
    <li key={post.fields.slug}>
      <article
        className="article-list-item"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          {frontmatter.categories && (
            <CategoryLabel items={frontmatter.categories} />
          )}
          <h2>
            <Link
              to={post.fields.slug}
              itemProp="url"
              className="article-item-title hover-underline"
            >
              <span itemProp="headline">{title}</span>
            </Link>
          </h2>
          <small>{post.frontmatter.date}</small>
        </header>
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
