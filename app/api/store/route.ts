import { list, put } from "@vercel/blob";
import { NextResponse } from "next/server";

// Shared cloud store: admin publishes config/products/blogs/reviews here,
// every visitor (any device/browser) reads it. Falls back to local-only
// mode when Blob is not configured.
export const dynamic = "force-dynamic";

const PATH = "bm-store/data.json";

function serverPassword(): string {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    "suhail123"
  );
}

export async function GET(): Promise<NextResponse> {
  try {
    const { blobs } = await list({ prefix: PATH });
    const hit = blobs.find((b) => b.pathname === PATH) ?? blobs[0];
    if (!hit) return NextResponse.json({ shared: false });
    const res = await fetch(hit.url, { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ shared: false });
    const data = await res.json();
    return NextResponse.json({ shared: true, data });
  } catch (error) {
    return NextResponse.json(
      { shared: false, error: (error as Error).message },
      { status: 200 }
    );
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  const key = req.headers.get("x-admin-password") || "";
  if (key !== serverPassword()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    await put(PATH, JSON.stringify(body), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
