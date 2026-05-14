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
      if (!textareaRef.current || selectionStart === undefined) return;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(selectionStart, selectionStart);
    });
  }

  function insertAroundSelection(before: string, after = "", placeholder = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const nextContent =
      content.slice(0, start) + before + selected + after + content.slice(end);
    updateContent(nextContent, start + before.length + selected.length + after.length);
  }

  function insertBlock(snippet: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    updateContent(content.slice(0, start) + snippet + content.slice(start), start + snippet.length);
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

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
        throw new Error(payload.error ?? "Upload failed.");
      }

      insertBlock(`\n![${file.name}](${payload.url})\n`);
      event.target.value = "";
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const toolbarButtons = [
    { label: "H2", action: () => insertBlock("## Heading\n\n") },
    { label: "Bold", action: () => insertAroundSelection("**", "**", "bold text") },
    { label: "Code", action: () => insertAroundSelection("`", "`", "code") },
    {
      label: "Code block",
      action: () => insertBlock("\n```ts\n// code\n```\n"),
    },
    { label: "Quote", action: () => insertBlock("\n> Callout note\n\n") },
    {
      label: "List",
      action: () => insertBlock("\n- Item one\n- Item two\n\n"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-white/8 bg-surface p-3">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            className="rounded-lg border border-white/8 px-3 py-1.5 text-xs text-stone-300 transition hover:border-white/16 hover:bg-white/[0.04]"
          >
            {btn.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-lime-300/20 px-3 py-1.5 text-xs text-lime-200 transition hover:border-lime-300/40 hover:bg-lime-300/[0.06] disabled:opacity-50"
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

      {uploadError && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-3 text-sm text-rose-200">
          {uploadError}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block rounded-xl border border-white/8 bg-surface p-5">
          <span className="text-sm font-medium text-stone-200">Content</span>
          <span className="mt-1 block text-xs text-stone-500">
            Markdown with syntax highlighting support
          </span>
          <textarea
            ref={textareaRef}
            required
            name="content"
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-3 w-full rounded-lg border border-white/8 bg-black/20 px-4 py-3 text-sm leading-7 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-lime-300/40"
            placeholder="## Research note\n\nWrite your content here..."
          />
        </label>

        <div className="rounded-xl border border-white/8 bg-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-200">Preview</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-600">
              Live
            </span>
          </div>
          <div className="markdown-body mt-3 min-h-[24rem] rounded-lg border border-white/8 bg-black/20 px-4 py-3 text-sm leading-7 text-stone-300">
            {deferredContent.trim() ? (
              <Markdown remarkPlugins={[remarkGfm]}>{deferredContent}</Markdown>
            ) : (
              <p className="text-stone-600">Start writing to preview.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
