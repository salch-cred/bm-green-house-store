import { get } from '@vercel/blob';
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
    const result = await get(path, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const headers = new Headers();
    if (result.blob.contentType) headers.set('content-type', result.blob.contentType);
    headers.set('cache-control', 'public, max-age=31536000, immutable');
    return new NextResponse(result.stream as ReadableStream, { headers });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
