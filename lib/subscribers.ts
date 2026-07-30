/**
 * Subscriber storage.
 *
 * Backed by Cloudflare D1 in production. The interface is deliberately small so
 * the backing store can change without touching the API routes.
 *
 * On GDPR: the site targets UK and EU readers, so consent has to be recorded,
 * not assumed. Every row carries what the person opted into, when, and from
 * where, plus a token that lets them leave without contacting anyone. Those
 * fields are the compliance requirement — retrofitting them later means
 * reconstructing consent you never captured.
 */

export interface Subscriber {
  email: string;
  /** What they asked for — a template slug, or 'newsletter'. */
  source: string;
  /** ISO timestamp of consent. */
  subscribedAt: string;
  /** Exact wording they agreed to, stored so it can be evidenced later. */
  consentText: string;
  /** Opaque token used for one-click unsubscribe. */
  unsubscribeToken: string;
  /** Set when they leave; the row is kept as proof of the request. */
  unsubscribedAt?: string | null;
}

export const CONSENT_TEXT =
  'I would like to receive the file I requested, plus occasional emails about ' +
  'new Excel templates and guides. I can unsubscribe at any time.';

/** Cloudflare D1 binding, injected by the runtime. */
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<{ success: boolean }>;
  all<T = unknown>(): Promise<{ results: T[] }>;
}

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS subscribers (
  email             TEXT PRIMARY KEY,
  source            TEXT NOT NULL,
  subscribed_at     TEXT NOT NULL,
  consent_text      TEXT NOT NULL,
  unsubscribe_token TEXT NOT NULL UNIQUE,
  unsubscribed_at   TEXT
);
CREATE INDEX IF NOT EXISTS idx_token ON subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_source ON subscribers(source);
`;

/** RFC-5322 is impractical to implement; this rejects what actually matters. */
export function isValidEmail(email: string): boolean {
  const e = email.trim();
  if (e.length < 5 || e.length > 254) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return false;
  if (e.includes('..')) return false;
  return true;
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function makeToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function addSubscriber(
  db: D1Database,
  email: string,
  source: string
): Promise<{ created: boolean; token: string }> {
  const normalised = normaliseEmail(email);

  const existing = await db
    .prepare('SELECT unsubscribe_token, unsubscribed_at FROM subscribers WHERE email = ?')
    .bind(normalised)
    .first<{ unsubscribe_token: string; unsubscribed_at: string | null }>();

  if (existing) {
    // Someone who previously left and is asking again has re-consented.
    if (existing.unsubscribed_at) {
      await db
        .prepare(
          'UPDATE subscribers SET unsubscribed_at = NULL, subscribed_at = ?, source = ?, consent_text = ? WHERE email = ?'
        )
        .bind(new Date().toISOString(), source, CONSENT_TEXT, normalised)
        .run();
    }
    return { created: false, token: existing.unsubscribe_token };
  }

  const token = makeToken();
  await db
    .prepare(
      'INSERT INTO subscribers (email, source, subscribed_at, consent_text, unsubscribe_token) VALUES (?, ?, ?, ?, ?)'
    )
    .bind(normalised, source, new Date().toISOString(), CONSENT_TEXT, token)
    .run();

  return { created: true, token };
}

export async function unsubscribe(db: D1Database, token: string): Promise<boolean> {
  const row = await db
    .prepare('SELECT email FROM subscribers WHERE unsubscribe_token = ?')
    .bind(token)
    .first<{ email: string }>();
  if (!row) return false;

  await db
    .prepare('UPDATE subscribers SET unsubscribed_at = ? WHERE unsubscribe_token = ?')
    .bind(new Date().toISOString(), token)
    .run();
  return true;
}
