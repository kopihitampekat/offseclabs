import "server-only";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { ComponentPropsWithoutRef } from "react";

const prettyCodeOptions = {
  theme: "github-dark-default",
  keepBackground: true,
  defaultLang: "plaintext",
};

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
        [rehypePrettyCode, prettyCodeOptions],
      ]}
      components={{
        pre: ({ children, ...preProps }) => (
          <div className="relative group">
            <pre {...preProps}>{children}</pre>
          </div>
        ),
      }}
      {...props}
    />
  );
}
