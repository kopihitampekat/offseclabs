"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  containerSelector?: string;
};

export function TableOfContents({
  containerSelector = ".markdown-body",
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const elements = container.querySelectorAll("h2, h3");
    const extracted: Heading[] = [];

    elements.forEach((el) => {
      if (el.id) {
        extracted.push({
          id: el.id,
          text: el.textContent ?? "",
          level: parseInt(el.tagName[1], 10),
        });
      }
    });

    setHeadings(extracted);
  }, [containerSelector]);

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
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="sticky top-24 hidden xl:block">
      <div className="w-56 rounded-xl border border-white/8 bg-surface p-4">
        <h3 className="text-[10px] font-medium uppercase tracking-[0.24em] text-stone-500">
          Contents
        </h3>
        <ul className="mt-3 space-y-1.5">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => scrollTo(heading.id)}
                className={`block w-full truncate text-left text-sm transition ${
                  heading.level === 3 ? "pl-3" : ""
                } ${
                  activeId === heading.id
                    ? "text-lime-300"
                    : "text-stone-500 hover:text-stone-200"
                }`}
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
