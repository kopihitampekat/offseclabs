"use client";

import { useDeferredValue, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownEditorProps = {
  defaultValue?: string;
};

export function MarkdownEditor({ defaultValue = "" }: MarkdownEditorProps) {
  const [content, setContent] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const deferredContent = useDeferredValue(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateContent(nextContent: string, selectionStart?: number) {
    setContent(nextContent);

    window.requestAnimationFrame(() => {
      if (!textareaRef.current || selectionStart === undefined) {
        return;
      }

      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(selectionStart, selectionStart);
    });
  }

  function insertAroundSelection(before: string, after = "", placeholder = "") {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const nextContent =
      content.slice(0, start) + before + selected + after + content.slice(end);
    const nextCursor = start + before.length + selected.length + after.length;

    updateContent(nextContent, nextCursor);
  }

  function insertBlock(snippet: string) {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const nextContent = content.slice(0, start) + snippet + content.slice(start);
    const nextCursor = start + snippet.length;

    updateContent(nextContent, nextCursor);
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Image upload failed.");
      }

      const imageMarkdown = `\n![${file.name}](${payload.url})\n`;
      insertBlock(imageMarkdown);
      event.target.value = "";
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Image upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <button
          type="button"
          onClick={() => insertBlock("## Heading\n\n")}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-200 transition hover:border-white/25 hover:bg-white/[0.06]"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertAroundSelection("**", "**", "bold text")}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-200 transition hover:border-white/25 hover:bg-white/[0.06]"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => insertAroundSelection("`", "`", "inline code")}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-200 transition hover:border-white/25 hover:bg-white/[0.06]"
        >
          Code
        </button>
        <button
          type="button"
          onClick={() => insertBlock("\n```ts\n// code block\n```\n")}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-200 transition hover:border-white/25 hover:bg-white/[0.06]"
        >
          Code block
        </button>
        <button
          type="button"
          onClick={() => insertBlock("\n> Callout note\n\n")}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-200 transition hover:border-white/25 hover:bg-white/[0.06]"
        >
          Quote
        </button>
        <button
          type="button"
          onClick={() => insertBlock("\n- List item\n- List item\n\n")}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-200 transition hover:border-white/25 hover:bg-white/[0.06]"
        >
          List
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full border border-lime-300/20 px-4 py-2 text-sm text-lime-200 transition hover:border-lime-300/40 hover:bg-lime-300/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Image"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {uploadError ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-400/[0.08] p-4 text-sm leading-7 text-rose-100">
          {uploadError}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <span className="text-sm font-medium text-stone-200">Content</span>
          <span className="mt-2 block text-sm leading-7 text-stone-400">
            Markdown is supported for headings, lists, code blocks, tables,
            links, and uploaded images from Vercel Blob.
          </span>
          <textarea
            ref={textareaRef}
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
    </div>
  );
}
