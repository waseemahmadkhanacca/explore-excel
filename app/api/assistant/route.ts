import { NextResponse } from 'next/server';

/**
 * Rate limiting.
 *
 * This in-memory map is a starting point, not a solution — on Cloudflare
 * each edge instance keeps its own copy, so the real limit is higher than
 * the number below. Before this route sees public traffic, move the counter
 * to Cloudflare KV or Durable Objects.
 *
 * Gating this properly matters: an ungated LLM endpoint on a public page is
 * a standing invitation to have your API quota drained by a scraper.
 */
const WINDOW_MS = 60 * 60 * 1000;

/**
 * Five per hour, not twelve.
 *
 * Gemini's free tier allows 1,000 requests per day on Flash-Lite. Because this
 * counter lives in memory per edge instance rather than globally, the effective
 * limit across the fleet is higher than the number here — so it is set
 * conservatively. At five, one visitor cannot meaningfully dent the daily
 * quota; at twelve, a handful could exhaust it before lunch.
 */
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_PER_WINDOW - 1 };
  }

  if (entry.count >= MAX_PER_WINDOW) {
    return { ok: false, remaining: 0 };
  }

  entry.count++;
  return { ok: true, remaining: MAX_PER_WINDOW - entry.count };
}

/**
 * Flash-Lite rather than Flash: the free tier allows roughly 1,000 requests per
 * day against Flash's 250, and writing an Excel formula does not need Flash's
 * extra reasoning.
 *
 * A warning about billing. Enabling billing on a Google Cloud project silently
 * removes that project's free tier entirely, and every call then bills from the
 * first token — including calls that would have fitted inside the free quota.
 * This is unlike most other Google Cloud services, which keep the free tier
 * after billing is switched on. Leave this project on the free tier unless you
 * have decided to pay, and check the model name against Google's current
 * pricing page before changing it, since the free line-up moves.
 */
const MODEL = 'gemini-2.5-flash-lite';

const SYSTEM_PROMPT = `You write Microsoft Excel formulas.

Rules:
- Return ONLY valid JSON, no markdown fences, no preamble.
- Shape: {"formula": string, "explanation": string, "caution": string｜null}
- "formula" starts with = and uses generic ranges like A2:A100 unless the user gives specific cells.
- "explanation" is two or three plain sentences. Assume a competent professional who does not know this particular function. No exclamation marks, no "simply", no "easy".
- "caution" names one real failure mode for this formula (mismatched range sizes, numbers stored as text, version compatibility) or is null if there is nothing worth flagging.
- Prefer modern functions (XLOOKUP, FILTER, TEXTJOIN) but note when they need Excel 365 or 2021.
- If the request is not about Excel, set formula to null and say so in explanation.`;

interface AssistantResponse {
  formula: string | null;
  explanation: string;
  caution: string | null;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown';

  const limit = rateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'You have reached the hourly limit. Try again later.' },
      { status: 429 }
    );
  }

  let prompt: string;
  try {
    const body = (await request.json()) as { prompt?: unknown };
    prompt = String(body.prompt ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ error: 'Describe what you need first.' }, { status: 400 });
  }
  if (prompt.length > 500) {
    return NextResponse.json(
      { error: 'Keep it under 500 characters.' },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'The assistant is not configured yet.' },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 700,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'The assistant is unavailable right now.' },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const cleaned = raw.replace(/```json|```/g, '').trim();

    let parsed: AssistantResponse;
    try {
      parsed = JSON.parse(cleaned) as AssistantResponse;
    } catch {
      return NextResponse.json(
        { error: 'Could not read the response. Try rephrasing.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ...parsed, remaining: limit.remaining });
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
