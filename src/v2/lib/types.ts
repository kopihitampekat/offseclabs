import type { Post } from "@/lib/posts";

export type { Post, AdminPost } from "@/lib/posts";

export type Lab = {
  slug: string;
  title: string;
  platform: "htb" | "thm" | "pg" | "custom";
  difficulty: "easy" | "medium" | "hard" | "insane";
  category: string;
  excerpt: string;
  content: string;
  tags: string[];
  date: string;
};

export type Tool = {
  slug: string;
  name: string;
  description: string;
  githubUrl?: string;
  tags: string[];
};

export type PaginatedResult<T> = {
  items: T[];
  hasMore: boolean;
  nextCursor: string | null;
};
