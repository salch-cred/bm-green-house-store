import { get, put } from "@vercel/blob";
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
    // Private store: stream the JSON straight from Blob (no public URL needed).
    const result = await get(PATH, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return NextResponse.json({ shared: false });
    }
    const text = await new Response(result.stream as ReadableStream).text();
    const data = JSON.parse(text);
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
      access: "private",
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
