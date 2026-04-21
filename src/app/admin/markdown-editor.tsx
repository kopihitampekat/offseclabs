"use client";

import { useDeferredValue, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownEditorProps = {
  defaultValue?: string;
};

export function MarkdownEditor({ defaultValue = "" }: MarkdownEditorProps) {
  const [content, setContent] = useState(defaultValue);
  const deferredContent = useDeferredValue(content);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <label className="block rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <span className="text-sm font-medium text-stone-200">Content</span>
        <span className="mt-2 block text-sm leading-7 text-stone-400">
          Markdown is supported for headings, lists, code blocks, tables, and
          links.
        </span>
        <textarea
          required
          name="content"
          rows={18}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-lime-300/50"
          placeholder={"## Research note\n\nWrite paragraphs, lists, and code blocks in Markdown."}
        />
      </label>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-stone-200">Preview</span>
          <span className="text-xs uppercase tracking-[0.24em] text-stone-500">
            Live markdown
          </span>
        </div>
        <div className="markdown-body mt-4 min-h-[28rem] rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm leading-7 text-stone-300">
          {deferredContent.trim() ? (
            <Markdown remarkPlugins={[remarkGfm]}>{deferredContent}</Markdown>
          ) : (
            <p className="text-stone-500">
              Start writing to preview the published article format.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
