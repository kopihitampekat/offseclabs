import { getAllPosts } from "@/v2/lib/posts";
import { labs } from "@/v2/lib/content";
import { siteConfig } from "@/v2/lib/config";

export async function GET() {
  const posts = await getAllPosts();
  const baseUrl = siteConfig.url;

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}/v2</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <atom:link href="${baseUrl}/v2/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/v2/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/v2/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(post.excerpt)}</description>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`
      )
      .join("")}
    ${labs
      .map(
        (lab) => `
    <item>
      <title>${escapeXml(lab.title)}</title>
      <link>${baseUrl}/v2/labs/${lab.slug}</link>
      <guid isPermaLink="true">${baseUrl}/v2/labs/${lab.slug}</guid>
      <pubDate>${new Date(lab.date).toUTCString()}</pubDate>
      <category>${escapeXml(lab.category)}</category>
      <description>${escapeXml(lab.excerpt)}</description>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
