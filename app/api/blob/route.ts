import { head } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Serves files from the private Blob store to the public site.
// Only paths under uploads/ or bm-store/ are served.
export const dynamic = 'force-dynamic';

const ALLOWED = /^(uploads|bm-store)\//;

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '';

  if (!path || path.includes('..') || !ALLOWED.test(path)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const meta = await head(path);
    const dl = (meta as { downloadUrl?: string }).downloadUrl || meta.url;
    const upstream = await fetch(dl, { cache: 'no-store' });
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const headers = new Headers();
    const ct = upstream.headers.get('content-type') || meta.contentType;
    if (ct) headers.set('content-type', ct);
    const len = upstream.headers.get('content-length');
    if (len) headers.set('content-length', len);
    headers.set('cache-control', 'public, max-age=31536000, immutable');
    return new NextResponse(upstream.body, { headers });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
