import "server-only";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { ComponentPropsWithoutRef } from "react";

type MarkdownContentProps = Omit<
  ComponentPropsWithoutRef<typeof Markdown>,
  "remarkPlugins" | "rehypePlugins"
> & {
  children: string;
};

export function MarkdownContent({ children, ...props }: MarkdownContentProps) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
      ]}
      {...props}
    />
  );
}
