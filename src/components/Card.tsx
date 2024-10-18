import Datetime from "./Datetime";
import type { Frontmatter } from "src/types";

export interface Props {
  href?: string;
  frontmatter: Frontmatter;
  secHeading?: boolean;
  rawContent?: string;
}

const styles = {
  cardContainer: "relative lg:col-[span_4] sm:col-[span_2]",
  titleLink:
    "text-[var(--color-text-base)] block text-[1.125rem] font-semibold pt-3 pb-4",
  // titleLink:
  //   `block text-accent
  //   font-medium text-2xl underline-offset-4
  //   decoration-dashed
  //   mb-2
  //   focus-visible:no-underline focus-visible:underline-offset-0`,
  titleHeading:
    "tracking font-medium text-lg decoration-dashed hover:underline",
};

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  return (
    <li className={styles.cardContainer}>
      <span
        className="items-center flex text-[0.875rem] font-normal before:content-[' '] before:bg-[currentColor]
          before:rounded-2xl before:block before:mr-1 before:w-2 before:h-2"
      >
        {frontmatter.categories}
      </span>
      <a href={href} className={styles.titleLink}>
        {secHeading ? (
          <h2 className="tracking-normal leading-none font-medium text-2xl decoration-dashed hover:underline">
            {frontmatter.title}
          </h2>
        ) : (
          <h3 className={styles.titleHeading}>{frontmatter.title}</h3>
        )}
      </a>
      <p className="break-all tracking-tighter leading-tight text-sm">
        {frontmatter.description}
      </p>
    </li>
  );
}
