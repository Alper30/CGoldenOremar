"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendEmail, renderEmail, escHtml, siteUrl } from "@/lib/email";

// Destek yanıtı & kapatma — yetki RLS ("destek: admin günceller" →
// private.is_admin()) ile zorlanır. Yanıt müşteriye e-posta ile gider ve
// mesaja işlenir (reply_body/replied_at/status='answered').

type Result = { ok: true } | { error: string };

export async function sendSupportReply(id: string, replyBody: string): Promise<Result> {
  const body = replyBody.trim();
  if (body.length < 2) return { error: "Yanıt boş olamaz." };
  if (body.length > 4000) return { error: "Yanıt çok uzun." };

  const supabase = await createSupabaseServerClient();

  // Mesabı çek (admin RLS select) — alıcı e-postası ve konu için.
  const { data: msg, error: readErr } = await supabase
    .from("support_messages")
    .select("id, name, email, subject")
    .eq("id", id)
    .single();
  if (readErr || !msg) return { error: "Mesaj bulunamadı." };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("support_messages")
    .update({
      reply_body: body,
      replied_at: new Date().toISOString(),
      replied_by: user?.id ?? null,
      status: "answered",
    })
    .eq("id", id);
  if (error) return { error: error.message };

  // E-posta best effort — kayıt başarılıysa gönderim hatası akışı kırmaz.
  await sendEmail({
    to: msg.email,
    subject: `Yanıt: ${msg.subject}`,
    html: renderEmail({
      title: "Talebinize yanıt",
      bodyHtml: `
        <p>Merhaba ${escHtml(msg.name)},</p>
        <p>"<strong>${escHtml(msg.subject)}</strong>" konulu talebinizle ilgili yanıtımız:</p>
        <p style="white-space:pre-wrap;border-left:3px solid #C9A961;padding-left:12px;color:#4A5548">${escHtml(body)}</p>
        <p>Ek sorularınız için bu e-postayı yanıtlayabilir veya sitemizden bize ulaşabilirsiniz.</p>`,
      ctaLabel: "Golden Oremar",
      ctaUrl: siteUrl,
    }),
  });

  revalidatePath("/admin/destek");
  return { ok: true };
}

export async function closeSupport(id: string): Promise<Result> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("support_messages")
    .update({ status: "closed", closed_at: new Date().toISOString(), closed_by: user?.id ?? null })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/destek");
  return { ok: true };
}
