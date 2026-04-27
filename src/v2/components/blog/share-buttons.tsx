"use client";

import { siteConfig } from "@/v2/lib/config";

type ShareButtonsProps = {
  title: string;
  slug: string;
};

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const url = `${siteConfig.url}/v2/blog/${slug}`;
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
        Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-stone-400 transition hover:border-white/16 hover:text-white"
      >
        Twitter
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-stone-400 transition hover:border-white/16 hover:text-white"
      >
        LinkedIn
      </a>
      <button
        onClick={() => navigator.clipboard.writeText(url)}
        className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-stone-400 transition hover:border-white/16 hover:text-white"
      >
        Copy link
      </button>
    </div>
  );
}
