import React from 'react';
import { Link } from 'gatsby';

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
        <Link
          to={post.fields.slug}
          itemProp="url"
          className="article-item-title"
        >
          <div className="article-item-header">
            <span className="article-item-category">{frontmatter.categories}</span>
            <div className="article-item-header__arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
              >
                <path stroke="currentColor" strokeWidth="1.4" d="M12 3v17M19 13l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <span itemProp="headline" className="article-item__text">{title}</span>
        </Link>
        {/* <small>{post.frontmatter.date}</small> */}
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
