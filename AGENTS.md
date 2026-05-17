# AGENTS.md - Codebase Guide for AI Agents

This document provides essential context for agentic coding agents working in this repository.

## Project Overview

**Type**: Astro blog with React components  
**Framework**: Astro 4.x  
**Styling**: Tailwind CSS  
**Languages**: TypeScript, Markdown  
**Package Manager**: pnpm

---

## Build, Lint, and Test Commands

### Development
```bash
pnpm dev          # Start dev server at localhost:3000
pnpm start        # Alias for dev
pnpm preview      # Preview production build locally
```

### Build
```bash
pnpm build        # Build production site to ./dist/
```

### Formatting & Linting
```bash
pnpm format:check # Check formatting with Prettier
pnpm format       # Auto-format with Prettier
```

### Other
```bash
pnpm cz           # Commit with commitizen (conventional commits)
pnpm download     # Download content from Notion
pnpm storybook    # Run Storybook for component development
```

### Testing

**Current Status**: No test framework is configured.

If tests are added in the future, typical commands would be:
```bash
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report
```

---

## Environment Variables

Create a `.env` file in the project root for environment-specific configuration:

```bash
# Google Site Verification (optional)
PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

Environment variables prefixed with `PUBLIC_` are exposed to client-side code.

---

## Code Style Guidelines

### Formatting (Prettier)

```json
{
  "tabWidth": 2,
  "printWidth": 80,
  "semi": true,
  "singleQuote": false,
  "jsxSingleQuote": false,
  "trailingComma": "es5",
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

- Use **2-space indentation**
- Use **double quotes** for strings
- Always use **semicolons**
- Max line width: **80 characters**

### ESLint Rules (Key Ones)

- Extends: `airbnb`, `plugin:react/recommended`, `plugin:storybook/recommended`
- `react/prop-types`: off (using TypeScript)
- `import/extensions`: off
- `import/no-unresolved`: off
- `@typescript-eslint/no-use-before-define`: error

### Rome (Secondary Linter)

- `noExplicitAny`: off (allowed)
- `noDangerouslySetInnerHtml`: off (allowed)
- `useKeyWithClickEvents`: off

---

## Import Conventions

### Path Aliases

| Alias | Maps To | Usage |
|-------|---------|-------|
| `@/` | `src/` | Components and utilities |
| `@config` | `src/config.ts` | Configuration |
| `@utils/` | `src/utils/` | Utility functions |
| `@layouts/` | `src/layouts/` | Layout components |
| `@components/` | `src/components/` | UI components |
| `@data/` | `src/data/` | Static data |
| `src/` | `src/` | Direct path (types, config) |

### Import Ordering

Follow this order (top to bottom of file):

1. **External packages** (npm modules)
2. **Astro-specific imports** (`astro:content`, `astro:transitions`)
3. **Configuration** (`@config`, `src/config`)
4. **Utilities** (`@utils/*`)
5. **Layouts** (`@layouts/*`)
6. **Components** (`@components/*`)
7. **Data** (`@data/*`)
8. **Types** (use `import type` for type-only imports)
9. **Styles** (CSS imports)

### Examples

**Astro file:**
```astro
---
import { getCollection } from "astro:content";
import { SITE } from "@config";
import Layout from "@layouts/Layout.astro";
import HomeHero from "@components/HomeHero";
import type { Frontmatter } from "src/types";
---
```

**React/TSX file:**
```tsx
import Fuse from "fuse.js";
import React, { useEffect, useRef, useState } from "react";
import slugify from "@utils/slugify";
import type { Frontmatter } from "src/types";
import { Search } from "lucide-react";
```

**TypeScript file:**
```typescript
import type { CollectionEntry } from "astro:content";
import { SITE } from "src/config";
```

---

## Naming Conventions

### File Naming

| Type | Convention | Examples |
|------|------------|----------|
| React (.tsx) | PascalCase | `Search.tsx`, `Datetime.tsx` |
| Astro (.astro) | PascalCase | `Footer.astro`, `LinkButton.astro` |
| TypeScript (.ts) | camelCase | `getSortedPosts.ts`, `slugify.ts` |
| React component folders | kebab-case dir + index | `nav-menu/index.tsx` |

### Component Naming

- **React**: `export default function ComponentName()` — function name matches file
- **Astro**: Component name derived from filename

### Variable & Function Naming

- **camelCase**: `inputVal`, `searchResults`, `handleChange`, `filterByTag`
- **PascalCase**: Component names, interface/type names
- **Underscore prefix**: Reserved word workarounds (`_class` exported as `class`)

### CSS Class Naming

- **kebab-case** for custom classes: `.nav-item-link`, `.footer-wrapper`
- **CSS variables**: `--camelCase` pattern

---

## TypeScript Guidelines

### Type Definitions

```typescript
// Use interface for object shapes
export interface Frontmatter {
  title: string;
  description: string;
  date: string;
  draft: boolean;
  tags: string[];
  categories: string[];
}

// Use type for unions, arrays, mapped types
export type SocialMedia = "Github" | "Twitter" | "LinkedIn";
export type SocialObjects = { name: SocialMedia; href: string; }[];
```

### Component Props

**React:**
```tsx
interface Props {
  searchList: SearchItem[];
}

export default function SearchBar({ searchList }: Props) { }
```

**Astro:**
```astro
---
export interface Props {
  name: string;
  count?: number;
  hideCount?: boolean;
}
const { name, count = 0, hideCount } = Astro.props;
---
```

### Type-Only Imports

Always use `import type` for type-only imports:
```typescript
import type { Frontmatter } from "src/types";
import type { CollectionEntry } from "astro:content";
```

---

## Astro Specifics

### Client Directives

When using React components in Astro files, specify hydration strategy:

- `client:load` - Load and hydrate immediately (used in this project)
- `client:idle` - Load during browser idle time
- `client:visible` - Load when element enters viewport
- `client:media` - Load when CSS media query matches
- `client:only` - Skip server rendering entirely

Example:
```astro
<HomeHero site={SITE} client:load />
```

### Content Collections

Blog posts are stored in two collections defined in `src/content/config.ts`:

- `blogs` — Local Markdown files in `src/content/blogs/`
- `notion` — Synced from Notion via `pnpm download`

Collection schema:
```typescript
const blogs = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string().or(z.date()).transform((val) => new Date(val)),
    tags: z.array(z.string()).default(["others"]),
    categories: z.array(z.string()).default(["others"]),
    draft: z.boolean().optional(),
  })
});
```

---

## Error Handling

### Current Patterns

- **Build scripts**: Use `console.error(e.message)` and continue
- **Fatal build errors**: Use `reporter.panic(message)` to halt
- **API calls**: Wrap in try-catch with logging

### Error Handling Template

```typescript
try {
  const result = await someAsyncOperation();
  return result;
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  // Decide: return null, throw, or continue
}
```

### Notes

- No custom error classes exist in this codebase
- No React error boundaries configured
- 404 page exists at `/src/pages/404.astro`
- No 500 error page exists

---

## Project Structure

```
/
├── public/              # Static assets
├── scripts/             # Build scripts (Notion sync)
├── src/
│   ├── assets/          # Asset references
│   ├── components/      # UI components (React, Astro)
│   ├── content/         # Markdown blog posts (Astro content collection)
│   ├── data/            # Static data files
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route pages
│   ├── styles/          # Global CSS
│   ├── utils/           # Utility functions
│   ├── config.ts        # Site configuration
│   └── types.ts         # Type definitions
├── astro.config.mjs     # Astro configuration
├── tailwind.config.cjs  # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json
```

---

## Important Notes

### Commit Convention

This project uses **Conventional Commits** via commitizen:
```bash
pnpm cz  # Interactive commit helper
```

### Draft Posts

Posts with `draft: true` in frontmatter are filtered out in production builds.

### Notion Integration

Run `pnpm download` to sync blog posts from Notion. The script is located at `scripts/notion/index.mjs`.

### Styling

- Tailwind CSS with custom theme configuration
- Dark mode supported via `class` strategy
- Custom CSS variables for theming in `src/styles/index.css`
