"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { Post } from "@/v2/lib/types";

type SearchDialogProps = {
  posts: Post[];
};

export function SearchDialog({ posts }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "excerpt", "tags", "category"],
        threshold: 0.3,
        includeScore: true,
      }),
    [posts]
  );

  const results = useMemo(() => {
    if (!query.trim()) return posts.slice(0, 8);
    return fuse.search(query).map((r) => r.item);
  }, [fuse, posts, query]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setActiveIndex(0);
    }
  }, [open]);

  function handleSelect(post: Post) {
    setOpen(false);
    setQuery("");
    router.push(`/v2/blog/${post.slug}`);
  }

  function handleKeyNav(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      handleSelect(results[activeIndex]);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => {
          setOpen(false);
          setQuery("");
        }}
      />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-2xl">
        <div className="flex items-center border-b border-white/[0.06] px-4">
          <svg
            className="h-4 w-4 text-stone-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyNav}
            placeholder="Search posts..."
            className="w-full bg-transparent px-3 py-4 text-sm text-stone-100 outline-none placeholder:text-stone-500"
          />
          <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-stone-500 sm:inline">
            ESC
          </kbd>
        </div>

        <ul className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-stone-500">
              No results found.
            </li>
          ) : (
            results.map((post, i) => (
              <li key={post.slug}>
                <button
                  onClick={() => handleSelect(post)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                    i === activeIndex
                      ? "bg-white/5 text-white"
                      : "text-stone-300 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{post.title}</p>
                    <p className="truncate text-xs text-stone-500">
                      {post.category} · {post.readingTime} min
                    </p>
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2 text-[10px] text-stone-600">
          <span>Navigate with arrow keys</span>
          <span>Enter to select</span>
        </div>
      </div>
    </div>
  );
}
