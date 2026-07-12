import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendEmail, renderEmail, fmtTRY, escHtml, siteUrl } from "@/lib/email";

// Platformun destek/operasyon gelen kutusu — randevu/iletişim bildirimleri buraya.
const adminInbox = process.env.ADMIN_EMAIL ?? "info@goldenoremar.com";

// Sipariş/KYC olaylarında e-posta bildirimi. Tümü "best effort":
// hata durumunda loglar, asla üst akışı (ödeme, kargo, onay) kırmaz.
// E-posta adresleri auth.users'ta olduğundan service-role zorunludur;
// yoksa bildirim sessizce atlanır.

type Admin = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

async function emailOf(admin: Admin, userId: string): Promise<string | null> {
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error || !data?.user?.email) return null;
  return data.user.email;
}

function getAdminOrSkip(context: string): Admin | null {
  const admin = createSupabaseAdminClient();
  if (!admin) console.log(`[notify] atlandı (service-role yok): ${context}`);
  return admin;
}

const shortId = (id: string) => id.slice(0, 8).toUpperCase();

// Ödeme tamamlandı → alıcıya sipariş onayı + her satıcıya "yeni sipariş".
export async function notifyOrderPaid(orderId: string) {
  try {
    const admin = getAdminOrSkip(`orderPaid ${orderId}`);
    if (!admin) return;

    const [{ data: order }, { data: items }, { data: vendors }] = await Promise.all([
      admin
        .from("orders")
        .select("id, buyer_id, grand_total, shipping_total, ship_name, ship_line, ship_district, ship_province")
        .eq("id", orderId)
        .single(),
      admin
        .from("order_items")
        .select("name, qty, line_total, vendor_id")
        .eq("order_id", orderId),
      admin
        .from("order_vendors")
        .select("vendor_id, items_subtotal, shipping_fee, vendor_profiles(name, user_id)")
        .eq("order_id", orderId),
    ]);
    if (!order) return;

    const itemRows = (items ?? [])
      .map((i) => `<li>${escHtml(i.name)} × ${i.qty} — <strong>${fmtTRY(i.line_total)}</strong></li>`)
      .join("");

    // Alıcı: sipariş onayı
    const buyerEmail = await emailOf(admin, order.buyer_id);
    if (buyerEmail) {
      await sendEmail({
        to: buyerEmail,
        subject: `Siparişiniz alındı · #${shortId(order.id)}`,
        html: renderEmail({
          title: "Siparişiniz alındı, üreticiye iletildi",
          bodyHtml: `
            <p>Ödemeniz güvenli havuza alındı; siz teslimatı onaylayana kadar üreticiye aktarılmaz.</p>
            <ul style="padding-left:18px;margin:12px 0">${itemRows}</ul>
            <p>Toplam: <strong>${fmtTRY(order.grand_total)}</strong>${Number(order.shipping_total) > 0 ? ` (kargo ${fmtTRY(order.shipping_total)} dâhil)` : ""}</p>
            <p>Teslimat: ${escHtml(order.ship_name)} — ${escHtml(order.ship_line)}, ${escHtml(order.ship_district)}/${escHtml(order.ship_province)}</p>
            <p>Üretici kargoya verdiğinde takip numarasıyla tekrar haber vereceğiz.</p>`,
          ctaLabel: "Siparişimi Görüntüle",
          ctaUrl: `${siteUrl}/siparis/${order.id}`,
        }),
      });
    }

    // Satıcılar: yeni sipariş bildirimi (her satıcıya yalnız kendi kalemleri)
    for (const ov of vendors ?? []) {
      const vp = ov.vendor_profiles as unknown as { name: string; user_id: string | null } | null;
      if (!vp?.user_id) continue;
      const vendorEmail = await emailOf(admin, vp.user_id);
      if (!vendorEmail) continue;
      const vendorItems = (items ?? [])
        .filter((i) => i.vendor_id === ov.vendor_id)
        .map((i) => `<li>${escHtml(i.name)} × ${i.qty} — <strong>${fmtTRY(i.line_total)}</strong></li>`)
        .join("");
      await sendEmail({
        to: vendorEmail,
        subject: `Yeni sipariş · #${shortId(order.id)}`,
        html: renderEmail({
          title: "Yeni bir sipariş aldınız",
          bodyHtml: `
            <p>Merhaba ${escHtml(vp.name)},</p>
            <ul style="padding-left:18px;margin:12px 0">${vendorItems}</ul>
            <p>Ürün tutarı: <strong>${fmtTRY(ov.items_subtotal)}</strong></p>
            <p>Lütfen ürünü hazırlayıp satıcı panelinden <strong>kargo takip numarasını</strong> girin — takip numarası girilmeden sipariş "kargolandı" durumuna geçmez ve ödeme süreci başlamaz.</p>`,
          ctaLabel: "Satıcı Paneline Git",
          ctaUrl: `${siteUrl}/satici-panel/siparisler`,
        }),
      });
    }
  } catch (err) {
    console.error("[notify] orderPaid hatası:", err);
  }
}

// Satıcı kargoladı → alıcıya takip numarası.
export async function notifyShipped(orderVendorId: string) {
  try {
    const admin = getAdminOrSkip(`shipped ${orderVendorId}`);
    if (!admin) return;

    const { data: ov } = await admin
      .from("order_vendors")
      .select("id, order_id, tracking_no, tracking_carrier, orders(buyer_id), vendor_profiles(name)")
      .eq("id", orderVendorId)
      .single();
    if (!ov?.tracking_no) return;

    const buyerId = (ov.orders as unknown as { buyer_id: string } | null)?.buyer_id;
    if (!buyerId) return;
    const buyerEmail = await emailOf(admin, buyerId);
    if (!buyerEmail) return;

    const vendorName =
      (ov.vendor_profiles as unknown as { name: string } | null)?.name ?? "Üretici";

    await sendEmail({
      to: buyerEmail,
      subject: `Siparişiniz kargoda · #${shortId(ov.order_id)}`,
      html: renderEmail({
        title: "Siparişiniz yola çıktı",
        bodyHtml: `
          <p><strong>${escHtml(vendorName)}</strong> siparişinizi kargoya verdi.</p>
          <p>Kargo firması: <strong>${escHtml(ov.tracking_carrier ?? "—")}</strong><br>
          Takip numarası: <strong>${escHtml(ov.tracking_no)}</strong></p>
          <p>Teslim aldığınızda sipariş sayfanızdan onaylamayı unutmayın — onayınız üreticiye ödemenin aktarılmasını sağlar.</p>`,
        ctaLabel: "Kargoyu Takip Et",
        ctaUrl: `${siteUrl}/siparis/${ov.order_id}`,
      }),
    });
  } catch (err) {
    console.error("[notify] shipped hatası:", err);
  }
}

// Yeni randevu talebi → platform gelen kutusuna bildirim (best effort).
export async function notifyNewBooking(b: {
  experience_type: string;
  guests: number;
  booking_date: string;
  booking_time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string | null;
}) {
  try {
    await sendEmail({
      to: adminInbox,
      subject: `Yeni randevu talebi · ${b.experience_type}`,
      html: renderEmail({
        title: "Yeni randevu / deneyim talebi",
        bodyHtml: `
          <p><strong>${escHtml(b.experience_type)}</strong></p>
          <p>Tarih: <strong>${escHtml(b.booking_date)}</strong> · Saat: <strong>${escHtml(b.booking_time)}</strong> · Misafir: <strong>${b.guests}</strong></p>
          <p>Ad Soyad: ${escHtml(b.name)}<br>
          E-posta: ${escHtml(b.email)}<br>
          Telefon: ${escHtml(b.phone)}</p>
          ${b.notes ? `<p>Not: ${escHtml(b.notes)}</p>` : ""}`,
        ctaLabel: "Yönetim Panelinde Aç",
        ctaUrl: `${siteUrl}/admin/randevular`,
      }),
    });
  } catch (err) {
    console.error("[notify] booking hatası:", err);
  }
}

// KYC başvurusu karara bağlandı → başvurana onay/red e-postası.
export async function notifyKycDecision(applicationId: string) {
  try {
    const admin = getAdminOrSkip(`kyc ${applicationId}`);
    if (!admin) return;

    const { data: app } = await admin
      .from("vendor_applications")
      .select("id, user_id, person, store_name, status, reject_reason")
      .eq("id", applicationId)
      .single();
    if (!app || (app.status !== "approved" && app.status !== "rejected")) return;

    const email = await emailOf(admin, app.user_id);
    if (!email) return;

    if (app.status === "approved") {
      await sendEmail({
        to: email,
        subject: "Satıcı başvurunuz onaylandı",
        html: renderEmail({
          title: "Tebrikler, mağazanız açıldı!",
          bodyHtml: `
            <p>Merhaba ${escHtml(app.person)},</p>
            <p>Kimlik doğrulamanız tamamlandı ve <strong>${escHtml(app.store_name)}</strong> mağazanız yayına hazır. Artık ürünlerinizi ekleyebilir, satmaya başlayabilirsiniz.</p>
            <p>İlk adımlar: satıcı panelinden ürünlerinizi ekleyin — moderasyon onayından sonra vitrine çıkar.</p>`,
          ctaLabel: "Satıcı Paneline Git",
          ctaUrl: `${siteUrl}/satici-panel`,
        }),
      });
    } else {
      await sendEmail({
        to: email,
        subject: "Satıcı başvurunuz hakkında",
        html: renderEmail({
          title: "Başvurunuz bu haliyle onaylanamadı",
          bodyHtml: `
            <p>Merhaba ${escHtml(app.person)},</p>
            <p><strong>${escHtml(app.store_name)}</strong> için yaptığınız satıcı başvurusu incelendi ancak onaylanamadı.</p>
            ${app.reject_reason ? `<p>Gerekçe: ${escHtml(app.reject_reason)}</p>` : ""}
            <p>Eksikleri giderip yeniden başvurabilirsiniz. Sorularınız için destek kanallarımızdan bize ulaşın.</p>`,
          ctaLabel: "Yeniden Başvur",
          ctaUrl: `${siteUrl}/satici-ol`,
        }),
      });
    }
  } catch (err) {
    console.error("[notify] kyc hatası:", err);
  }
}
