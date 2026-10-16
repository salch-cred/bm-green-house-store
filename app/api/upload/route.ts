import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Uploads into the (private) Blob store and returns a same-origin proxy URL.
// Direct public URLs don't work on a private store, so browsers load media
// through /api/blob?path=... instead.
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  try {
    const clean = filename.replace(/[^\w.\-() ]+/g, '_').slice(0, 120) || 'file';
    const blob = await put(`uploads/${Date.now()}-${clean}`, request.body as ReadableStream<Uint8Array>, {
      access: 'private',
    });
    return NextResponse.json({
      ...blob,
      url: `/api/blob?path=${encodeURIComponent(blob.pathname)}`,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
