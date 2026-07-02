import "server-only";

// E-posta gönderim katmanı (Resend REST API).
// RESEND_API_KEY tanımlı değilse gönderim sessizce atlanır ve loglanır —
// böylece e-posta yapılandırılmadan da tüm akışlar çalışmaya devam eder.

import { siteUrl } from "@/lib/site";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? "Golden Oremar <bildirim@goldenoremar.com>";

export const emailEnabled = Boolean(apiKey);

export { siteUrl };

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!apiKey) {
    console.log(`[email] atlandı (RESEND_API_KEY yok): "${subject}" → ${to}`);
    return { ok: true, skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    if (!res.ok) {
      console.error(`[email] gönderilemedi (${res.status}): "${subject}" → ${to}`, await res.text());
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error(`[email] hata: "${subject}" → ${to}`, err);
    return { ok: false };
  }
}

// Marka renkleriyle basit, e-posta istemcisi dostu (inline-style, tablo) şablon.
export function renderEmail({
  title,
  bodyHtml,
  ctaLabel,
  ctaUrl,
}: {
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const cta =
    ctaLabel && ctaUrl
      ? `<tr><td style="padding:24px 32px 0">
           <a href="${ctaUrl}" style="display:inline-block;background:#C9A961;color:#FFFDF7;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:999px">${ctaLabel}</a>
         </td></tr>`
      : "";
  return `<!doctype html>
<html lang="tr"><body style="margin:0;padding:0;background:#F5F1E8">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1E8;padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFFDF7;border-radius:16px;border:1px solid #E5DFD0;font-family:Arial,Helvetica,sans-serif">
  <tr><td style="padding:28px 32px 0">
    <span style="font-size:22px;font-weight:700;color:#1E3A2B">Golden</span>
    <span style="font-size:22px;font-weight:700;color:#C9A961"> Oremar</span>
  </td></tr>
  <tr><td style="padding:20px 32px 0">
    <h1 style="margin:0;font-size:19px;line-height:1.4;color:#1E3A2B">${title}</h1>
  </td></tr>
  <tr><td style="padding:14px 32px 0;font-size:14px;line-height:1.7;color:#4A5548">${bodyHtml}</td></tr>
  ${cta}
  <tr><td style="padding:28px 32px 32px;font-size:12px;line-height:1.6;color:#8B9188;border-top:1px solid #E5DFD0;margin-top:24px">
    Bu e-posta Golden Oremar pazaryerinden gönderildi.<br>
    Doğrudan üreticiden, güvenli havuz ödemesiyle. · <a href="${siteUrl}" style="color:#C9A961">${siteUrl.replace(/^https?:\/\//, "")}</a>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export const fmtTRY = (n: number) =>
  `₺${Number(n).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`;

// E-posta HTML'ine giren KULLANICI KAYNAKLI her değer (ürün/mağaza/kişi adı,
// takip no vb.) bununla kaçırılmalı — satıcı adına "<img onerror=…>" yazan
// birinin alıcı e-postasına HTML enjekte etmesini önler.
export const escHtml = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
