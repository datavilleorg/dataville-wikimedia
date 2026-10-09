import { NextResponse } from 'next/server';

// Server-side proxy to the Dataville API. Calling Dataville from here rather
// than from the browser keeps DATAVILLE_API_KEY out of client bundles.
// Without a key the request still works, at anonymous rate limits.
const DATAVILLE_API_BASE = process.env.DATAVILLE_API_BASE ?? 'https://api.dataville.com';

export async function GET(_req: Request, { params }: { params: { title: string } }) {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (process.env.DATAVILLE_API_KEY) {
    headers.Authorization = `Bearer ${process.env.DATAVILLE_API_KEY}`;
  }

  try {
    const res = await fetch(`${DATAVILLE_API_BASE}/wiki/${encodeURIComponent(params.title)}`, {
      headers,
      // Articles change at most hourly (Dataville applies Wikimedia's hourly
      // update batches), so a short cache is plenty fresh.
      next: { revalidate: 300 },
    });
    const body = await res.json();
    const retryAfter = res.headers.get('Retry-After');
    return NextResponse.json(body, {
      status: res.status,
      headers: retryAfter ? { 'Retry-After': retryAfter } : undefined,
    });
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        data: {
          code: 'DATAVILLE_UNREACHABLE',
          error:
            "Couldn't reach the Dataville API. Check your network connection and try again; if it keeps happening, contact support@dataville.com.",
        },
      },
      { status: 502 },
    );
  }
}
