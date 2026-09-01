export interface PostSummary {
  path: string;
  title: string;
  date: string;
  draft: boolean;
  tags: string[];
  categories: string[];
}

export interface PostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  categories: string[];
  draft: boolean;
  ogImage?: string;
  cover?: string;
  description?: string;
}

export interface PostContent {
  path: string;
  sha: string;
  frontmatter: PostFrontmatter;
  body: string;
}

export interface SavePostInput {
  frontmatter: PostFrontmatter;
  body: string;
  sha?: string;
}
