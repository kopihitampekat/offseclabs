import type { MetadataRoute } from "next";
import { getAllPosts } from "@/v2/lib/posts";
import { labs, tools } from "@/v2/lib/content";
import { siteConfig } from "@/v2/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const baseUrl = siteConfig.url;

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/v2`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/v2/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/v2/labs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/v2/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/v2/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/v2/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const labPages: MetadataRoute.Sitemap = labs.map((lab) => ({
    url: `${baseUrl}/v2/labs/${lab.slug}`,
    lastModified: new Date(lab.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...labPages];
}
