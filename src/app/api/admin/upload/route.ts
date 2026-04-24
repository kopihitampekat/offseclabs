import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const clientIp = getClientIp(request) ?? "unknown";
  const rateLimitResult = rateLimit(`upload:${clientIp}`, 5, 60_000);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many uploads. Please try again in a minute." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateLimitResult.resetAt),
        },
      }
    );
  }

  const session = await requireAdminSession();

  if (!session.ok) {
    return NextResponse.json({ error: session.reason }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image file was provided." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image uploads are supported." },
      { status: 400 },
    );
  }

  if (file.size > 4_000_000) {
    return NextResponse.json(
      { error: "Image uploads must be smaller than 4 MB." },
      { status: 400 },
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");

  const blob = await put(`offseclabs/${Date.now()}-${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({
    url: blob.url,
    pathname: blob.pathname,
  });
}
