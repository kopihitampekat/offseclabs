"use client";

import { useState, type ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Supported languages
const languages = [
  "javascript",
  "typescript",
  "python",
  "bash",
  "shell",
  "json",
  "yaml",
  "markdown",
  "rust",
  "go",
  "css",
  "html",
] as const;

type CodeBlockProps = {
  language?: string;
  children: string;
};

export function CodeBlock({ language = "text", children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const lang = languages.includes(language as (typeof languages)[number])
    ? language
    : "text";

  return (
    <div className="group relative">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 rounded-lg border border-white/10 bg-[#1e1e1e] px-2.5 py-1 text-xs text-stone-400 opacity-0 transition hover:text-white group-hover:opacity-100"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <SyntaxHighlighter
        language={lang}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: "1rem",
          border: "1px solid rgba(255,255,255,0.08)",
          fontSize: "0.875rem",
          lineHeight: "1.7",
          background: "rgba(0,0,0,0.3)",
        }}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-ibm-plex-mono), ui-monospace, monospace",
          },
        }}
      >
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  );
}

// Code component for react-markdown
export function Code({ children, className }: { children: ReactNode; className?: string }) {
  const content = typeof children === "string" ? children : "";

  // If we're in a pre block (code fence), use syntax highlighting
  if (className?.includes("language-")) {
    const match = /language-(\w+)/.exec(className || "");
    const lang = match ? match[1] : "text";
    return <CodeBlock language={lang}>{content}</CodeBlock>;
  }

  // Inline code
  return (
    <code
      className="rounded border border-white/8 bg-white/[0.04] px-1.5 py-0.5 text-[0.9em] font-mono text-[#f5f5f4]"
    >
      {children}
    </code>
  );
}
