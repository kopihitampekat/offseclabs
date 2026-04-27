"use client";

import { useState, type ReactNode } from "react";

export function CodeBlockCopyButton() {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    const pre = document.activeElement
      ?.closest("div")
      ?.querySelector("pre");
    if (!pre) return;

    const code = pre.querySelector("code");
    const text = code?.textContent ?? pre.textContent ?? "";

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleClick}
      className="code-copy-btn rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-stone-400 transition hover:bg-white/10 hover:text-white"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function CodeBlockWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="group relative">
      {children}
      <div className="code-copy-btn absolute right-3 top-3">
        <CodeBlockCopyButton />
      </div>
    </div>
  );
}
