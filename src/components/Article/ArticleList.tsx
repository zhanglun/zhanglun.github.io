import React, { useCallback, useEffect, useRef } from 'react';
import { ArticleCard } from './ArticleCard';
import './index.css';

const useDebounce = (fn: any, wait: number, immediate: boolean = false, dep = []) => {
  const { current } = useRef({ fn, timer: null });
  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  return useCallback((...args) => {
    if (current.timer) {
      clearTimeout(current.timer);
    }

    if (immediate && !current.timer) {
      current.fn.call(this, ...args);
    }

    current.timer = setTimeout(() => {
      current.fn.call(this, ...args);
    }, wait);
  }, dep);
};

export function ArticleList({ posts }) {
  const articleListRef = useRef(null);

  const setTransformOffset = (elem: HTMLElement, offset: number) => {
    const el = elem;
    el.style.transform = `translate3d(-${offset}px, 0, 0)`;
  };

  const handleScroll = () => {
    const yOffset = window.scrollY;
    setTransformOffset(articleListRef.current, yOffset);
  };

  const delayScroll = useDebounce(handleScroll, 50);

  useEffect(() => {
    if (!articleListRef) {
      return;
    }

    const height = articleListRef.current.offsetWidth;
    document.body.style.height = `${height}px`;

    window.addEventListener('scroll', delayScroll);

    // eslint-disable-next-line consistent-return
    return () => {
      document.body.style.height = null;
      window.removeEventListener('scroll', delayScroll);
    };
  }, []);

  return (
    <ul className="article-list" ref={articleListRef}>
      {/* {posts.map((post) => <ArticleItem post={post} key={post.id} />)} */}
      {posts.map((post) => <ArticleCard post={post} key={post.frontmatter.title} />)}
    </ul>
  );
}
