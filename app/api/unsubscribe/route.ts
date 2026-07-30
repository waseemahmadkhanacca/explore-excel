import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { unsubscribe, type D1Database } from '@/lib/subscribers';

interface Env {
  DB?: D1Database;
}

/**
 * One-click unsubscribe.
 *
 * Accepts POST because mail clients honouring List-Unsubscribe-Post send one,
 * and GET so the link also works when clicked directly in an email body.
 */
async function handle(token: string) {
  if (!token) {
    return NextResponse.json({ error: 'Missing token.' }, { status: 400 });
  }

  // Bindings live on the Workers env object, never on process.env — see the
  // matching comment in app/api/subscribe/route.ts for why.
  let db: D1Database | undefined;
  try {
    db = (getCloudflareContext().env as unknown as Env).DB;
  } catch {
    db = ((process.env as unknown) as Env).DB;
  }

  if (!db) {
    return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  }
  const done = await unsubscribe(db, token);
  if (!done) {
    return NextResponse.json({ error: 'That link is not valid.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  let token = url.searchParams.get('token') ?? '';
  if (!token) {
    try {
      const body = (await request.json()) as { token?: string };
      token = String(body.token ?? '');
    } catch {
      /* fall through to the empty-token error */
    }
  }
  return handle(token);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  return handle(url.searchParams.get('token') ?? '');
}
