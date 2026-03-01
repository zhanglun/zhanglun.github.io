import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LineHeader from "./LineHeader";
import Badge from "./Badge/Badge";
import PlusIcons from "./PlusIcons";
import dayjs from "dayjs";
import "./BlogDetail.css";

interface Post {
  title?: string;
}

interface RemarkPluginFrontmatter {
  minutesRead?: string;
}

interface Props {
  post?: Post;
  date?: string | Date;
  categories?: string[];
  tags?: string[];
  remarkPluginFrontmatter?: RemarkPluginFrontmatter;
  prefix?: string;
  children?: React.ReactNode;
}

export default function BlogDetail({
  post = {},
  date = new Date(),
  categories = [],
  tags = [],
  remarkPluginFrontmatter = {},
  prefix = "",
  children,
}: Props) {
  const [visible, setVisible] = useState(true);

  const heroSectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heroElement = heroSectionRef.current;
    if (!heroElement) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      console.log("🚀 ~ callback ~ entries:", entries[0].intersectionRatio);
      if (entries[0].isIntersecting) {
        setVisible(false);
        if (titleRef.current) {
          titleRef.current.style.opacity = "0";
        }
      } else {
        setVisible(true);
        if (titleRef.current) {
          titleRef.current.style.opacity = "1";
        }
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px",
      threshold: 1,
    });

    observer.observe(heroElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <section className="section hero--section" ref={heroSectionRef}>
        <PlusIcons />
        <div className="title">
          <h1 className="text-hero">{post.title}</h1>
        </div>
        <PlusIcons />
      </section>
      <section className="section body--section">
        <div className="sidebar">
          <AnimatePresence>
            {visible && (
              <motion.div
                ref={titleRef}
                className="text-lg smart-title"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {post.title}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="metadata">
            <LineHeader title="METADATA" />
            <div className="metadata__item text-smallcaps">
              <span>Date: </span>
              <span>{dayjs(date).format("YYYY.M.DD HH:mm")}</span>
            </div>
            <div className="metadata__item text-smallcaps">
              <span>Categories: </span>
              <span>
                {categories.map((category, index) => (
                  <Badge key={index}>{category}</Badge>
                ))}
              </span>
            </div>
            <div className="metadata__item text-smallcaps">
              <span>READING TIME: </span>
              <span>{remarkPluginFrontmatter.minutesRead}</span>
            </div>
            <div className="metadata__item text-smallcaps">
              <span>Tags: </span>
              <span className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <Badge key={index}>{tag}</Badge>
                ))}
              </span>
            </div>
          </div>
        </div>
        <div className="article">
          <LineHeader title="ARTICLE" />
          <div className="articleBody">{children}</div>
        </div>
      </section>
    </>
  );
}
