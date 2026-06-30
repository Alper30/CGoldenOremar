import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Yardımlı kayıt (assisted onboarding, CLAUDE.md §8.3.3) — operatör, akıllı telefonu
// olmayan üretici ADINA hesap + KYC başvurusu oluşturur, sonra onaylar.
//
// Güvenlik:
// - Çağıran ZORUNLU admin (kendi oturum çereziyle profil rolü doğrulanır).
// - auth kullanıcısı yalnızca service-role ile oluşturulur (sunucuda, gizli anahtar).
// - Onay, mevcut DENETLENMİŞ approve_vendor_application RPC'siyle ADMİN oturumunda
//   yapılır (reviewed_by = admin) → ayrı bir ayrıcalıklı yol açılmaz.
export const dynamic = "force-dynamic";

const onlyDigits = (s: string) => (s || "").replace(/\D/g, "");
const normIban = (s: string) => (s || "").replace(/\s/g, "").toUpperCase();

export async function POST(req: NextRequest) {
  // 1) Çağıran admin mi?
  const userClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });

  const { data: prof } = await userClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (prof?.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Sunucu yapılandırması eksik (service-role)" },
      { status: 503 },
    );
  }

  // 2) Girdi doğrulama
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });

  const email = String(body.email || "").trim().toLowerCase();
  const fullName = String(body.full_name || "").trim();
  const phone = String(body.phone || "").trim();
  const storeName = String(body.store_name || "").trim();
  const tcNo = onlyDigits(body.tc_no);
  const iban = normIban(body.iban);
  const province = String(body.province || "").trim() || null;
  const district = String(body.district || "").trim() || null;
  const story = String(body.story || "").trim() || null;

  if (!email.includes("@")) return bad("Geçerli bir e-posta girin");
  if (fullName.length < 3) return bad("Ad soyad girin");
  if (!storeName) return bad("Mağaza adı girin");
  if (tcNo.length !== 11) return bad("TC kimlik no 11 haneli olmalı");
  if (!/^TR[0-9]{24}$/.test(iban)) return bad("IBAN 'TR' + 24 rakam olmalı");
  if (!phone) return bad("Telefon girin");

  // 3) Auth kullanıcısı oluştur (e-posta onaylı; üretici sonra şifre sıfırlar)
  const tempPassword = crypto.randomUUID() + "Aa1!";
  const { data: created, error: cErr } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    password: tempPassword,
    user_metadata: { full_name: fullName, phone },
  });
  if (cErr || !created?.user) {
    const dup = (cErr?.message || "").toLowerCase().includes("already");
    return NextResponse.json(
      { error: dup ? "Bu e-posta zaten kayıtlı" : cErr?.message || "Hesap oluşturulamadı" },
      { status: dup ? 409 : 500 },
    );
  }
  const newUserId = created.user.id;

  // 4) KYC başvurusu (service-role; RLS atlanır). Profil trigger ile oluşur.
  const { data: app, error: aErr } = await admin
    .from("vendor_applications")
    .insert({
      user_id: newUserId,
      store_name: storeName,
      person: fullName,
      tc_no: tcNo,
      iban,
      phone,
      province,
      district,
      story,
      status: "pending",
    })
    .select("id")
    .single();
  if (aErr || !app) {
    // Telafi: yarım kalan auth kullanıcısını temizle.
    await admin.auth.admin.deleteUser(newUserId).catch(() => {});
    return NextResponse.json(
      { error: aErr?.message || "Başvuru oluşturulamadı" },
      { status: 500 },
    );
  }

  // 5) Onay — admin oturumuyla denetlenmiş RPC (vendor_profile + role=vendor + audit)
  const { data: vendorId, error: apErr } = await userClient.rpc(
    "approve_vendor_application",
    { p_app_id: app.id },
  );
  if (apErr) {
    return NextResponse.json(
      { error: "Hesap açıldı fakat onay başarısız: " + apErr.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, userId: newUserId, vendorId });
}

function bad(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}
