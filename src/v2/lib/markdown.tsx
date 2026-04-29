import "server-only";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { ComponentPropsWithoutRef } from "react";
import { CodeBlock } from "@/v2/components/blog/code-block";

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

          // If it's a code block (has language), use SyntaxHighlighter
          if (match) {
            return (
              <CodeBlock language={match[1]}>{content}</CodeBlock>
            );
          }

          // Inline code
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
          // Pre is handled by the code component above for code blocks
          // For non-code content in pre, just render as-is
          return <>{children}</>;
        },
      }}
      {...props}
    />
  );
}
