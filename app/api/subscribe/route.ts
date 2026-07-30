import { NextResponse } from 'next/server';
import { getTemplate } from '@/lib/templates';
import { sendTemplateEmail } from '@/lib/email';
import {
  addSubscriber,
  isValidEmail,
  normaliseEmail,
  type D1Database,
} from '@/lib/subscribers';
import { SITE } from '@/lib/schema';

export const runtime = 'edge';

/**
 * Rate limiting.
 *
 * In-memory, so each edge instance keeps its own count and the real limit is
 * higher than the number below. That is acceptable for a signup form — the
 * cost of an extra signup is nil — but it would not be for the AI route.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count++;
  return true;
}

interface Env {
  DB?: D1Database;
  RESEND_API_KEY?: string;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown';

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  let email: string;
  let slug: string;
  let consented: boolean;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    email = String(body.email ?? '');
    slug = String(body.template ?? '');
    consented = body.consent === true;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'That does not look like an email address.' }, { status: 400 });
  }
  if (!consented) {
    return NextResponse.json({ error: 'Please tick the consent box first.' }, { status: 400 });
  }

  const template = getTemplate(slug);
  if (!template) {
    return NextResponse.json({ error: 'Unknown template.' }, { status: 404 });
  }

  // Cloudflare injects bindings on the request context; locally they are absent.
  const env = (process.env as unknown) as Env;
  const apiKey = env.RESEND_API_KEY;
  const db = env.DB;

  if (!apiKey || !db) {
    return NextResponse.json(
      {
        error:
          'Email delivery is not configured yet. Set RESEND_API_KEY and bind the D1 database.',
      },
      { status: 503 }
    );
  }

  let token: string;
  try {
    const result = await addSubscriber(db, email, `template:${slug}`);
    token = result.token;
  } catch {
    return NextResponse.json({ error: 'Could not record your request.' }, { status: 500 });
  }

  const sent = await sendTemplateEmail(
    {
      to: normaliseEmail(email),
      templateTitle: template.title,
      templateSummary: template.summary,
      downloadUrl: `${SITE.url}${template.file}`,
      unsubscribeToken: token,
    },
    apiKey
  );

  if (!sent.ok) {
    // The subscriber is recorded, so this is recoverable — say so plainly
    // rather than pretending the whole thing failed.
    return NextResponse.json(
      { error: 'We saved your request but could not send the email. Please try again shortly.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
