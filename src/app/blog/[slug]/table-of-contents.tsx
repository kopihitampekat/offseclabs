"use client";

import { useEffect, useState } from "react";

 type Heading = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  content: string;
};

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const extractedHeadings: Heading[] = [];
    const lines = content.split("\n");
    let index = 0;

    for (const line of lines) {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/\s*\{#[\w-]+\}\s*$/, "").trim();
        const id = `heading-${index++}`;
        extractedHeadings.push({ id, text, level });
      }
    }

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-8 hidden lg:block">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="text-xs uppercase tracking-[0.24em] text-stone-500">
          Contents
        </h3>
        <ul className="mt-4 space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`
                  block w-full text-left text-sm transition
                  ${heading.level === 2 ? "text-stone-300" : "pl-3 text-stone-500"}
                  ${
                    activeId === heading.id
                      ? "text-lime-300"
                      : "hover:text-stone-200"
                  }
                `}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
