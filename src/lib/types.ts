export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  readingTime: number;
};

export type AdminPost = Post & {
  published: boolean;
};

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
