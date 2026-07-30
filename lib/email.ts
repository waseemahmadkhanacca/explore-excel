import { SITE } from './schema';

/**
 * Email delivery.
 *
 * Resend is the transport. Everything user-visible is built here so the wording,
 * the unsubscribe link and the plain-text alternative stay in one place.
 *
 * Two things are non-negotiable in every message: a working unsubscribe link,
 * and a plain-text part. The first is a legal requirement for UK and EU
 * recipients; the second stops the message being treated as spam by filters
 * that distrust HTML-only mail.
 */

const FROM = 'Explore Excel <hello@exploreexcel.com>';

export interface TemplateEmailInput {
  to: string;
  templateTitle: string;
  templateSummary: string;
  downloadUrl: string;
  unsubscribeToken: string;
}

function unsubscribeUrl(token: string): string {
  return `${SITE.url}/unsubscribe/?token=${token}`;
}

function htmlBody(input: TemplateEmailInput): string {
  const unsub = unsubscribeUrl(input.unsubscribeToken);
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#fafaf8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#141414;">
  <div style="max-width:520px;margin:0 auto;padding:32px 24px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
      <div style="width:30px;height:30px;border-radius:6px;background:#0f6e56;"></div>
      <span style="font-size:17px;font-weight:600;">Explore<span style="color:#0f6e56;">Excel</span></span>
    </div>

    <h1 style="font-size:22px;line-height:1.3;margin:0 0 14px;">Here is your ${escapeHtml(input.templateTitle)}</h1>

    <p style="font-size:15px;line-height:1.6;color:#4a4a48;margin:0 0 22px;">
      ${escapeHtml(input.templateSummary)}
    </p>

    <a href="${input.downloadUrl}"
       style="display:inline-block;background:#0f6e56;color:#ffffff;text-decoration:none;
              padding:12px 22px;border-radius:8px;font-size:15px;font-weight:500;">
      Download the file
    </a>

    <p style="font-size:14px;line-height:1.6;color:#4a4a48;margin:26px 0 0;">
      Every template has a Read me sheet explaining how it works and where its limits are.
      Blue cells are yours to fill in; everything else calculates.
    </p>

    <p style="font-size:14px;line-height:1.6;color:#4a4a48;margin:16px 0 0;">
      If something in it is wrong, tell me and it gets fixed.
    </p>

    <hr style="border:none;border-top:1px solid #e4e4e0;margin:30px 0 18px;">

    <p style="font-size:12px;line-height:1.5;color:#6b6b6b;margin:0;">
      You are receiving this because you asked for this file at exploreexcel.com.
      <a href="${unsub}" style="color:#0f6e56;">Unsubscribe</a> at any time — one click, no questions.
    </p>
  </div>
</body></html>`;
}

function textBody(input: TemplateEmailInput): string {
  return [
    `Here is your ${input.templateTitle}`,
    '',
    input.templateSummary,
    '',
    `Download: ${input.downloadUrl}`,
    '',
    'Every template has a Read me sheet explaining how it works and where its',
    'limits are. Blue cells are yours to fill in; everything else calculates.',
    '',
    'If something in it is wrong, tell me and it gets fixed.',
    '',
    '---',
    'You are receiving this because you asked for this file at exploreexcel.com.',
    `Unsubscribe: ${unsubscribeUrl(input.unsubscribeToken)}`,
  ].join('\n');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendTemplateEmail(
  input: TemplateEmailInput,
  apiKey: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [input.to],
        subject: `Your ${input.templateTitle} template`,
        html: htmlBody(input),
        text: textBody(input),
        headers: {
          // Lets mail clients offer unsubscribe in their own interface, which
          // materially reduces spam complaints.
          'List-Unsubscribe': `<${unsubscribeUrl(input.unsubscribeToken)}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, error: `Resend responded ${res.status}: ${detail.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export { htmlBody as _htmlBody, textBody as _textBody, unsubscribeUrl as _unsubscribeUrl };
