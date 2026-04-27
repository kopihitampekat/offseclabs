import { getPostBySlug } from "@/v2/lib/posts";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function OpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "#0a0a0a",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px",
          }}
        >
          <div
            style={{
              color: "#bef264",
              fontSize: 24,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: 24,
            }}
          >
            OffSecLabs
          </div>
          <div
            style={{
              color: "#fafaf9",
              fontSize: 48,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            Offensive Security Research
          </div>
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "48px 56px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#bef264",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              color: "#bef264",
              fontSize: 18,
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              fontWeight: 500,
            }}
          >
            OffSecLabs
          </div>
          <div
            style={{
              color: "#a8a29e",
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: "0.24em",
            }}
          >
            {post.category}
          </div>
        </div>
        <div
          style={{
            color: "#fafaf9",
            fontSize: 52,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            {post.tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  color: "#d6d3d1",
                  fontSize: 14,
                  padding: "8px 16px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              color: "#a8a29e",
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}
          >
            {post.date}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
