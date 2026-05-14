import "server-only";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { ComponentPropsWithoutRef } from "react";
import { CodeBlock } from "@/components/blog/code-block";

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
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const content = String(children).trim();

          if (match) {
            return <CodeBlock language={match[1]}>{content}</CodeBlock>;
          }

          return (
            <code
              className="rounded border border-white/8 bg-white/[0.04] px-1.5 py-0.5 text-[0.9em] font-mono text-[#f5f5f4]"
              {...props}
            >
              {children}
            </code>
          );
        },
        pre({ children }) {
          return <>{children}</>;
        },
      }}
      {...props}
    />
  );
}
