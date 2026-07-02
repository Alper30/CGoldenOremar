"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  ChatIcon,
  MailIcon,
  PinIcon,
  ClockIcon,
  ArrowRightIcon,
  VerifiedIcon,
} from "@/components/icons";

type Loc = "turkey" | "europe";

const contactInfo = {
  turkey: {
    label: "Türkiye",
    whatsapp: "0537 959 48 51",
    waLink: "https://wa.me/905379594851",
    email: "info@golden.com",
    address: ["Yeşiltaş Köyü No: 72", "Dağlıca", "Yüksekova, Hakkâri, Türkiye"],
    note: "Ziyaret etmek isterseniz önceden haber vermenizi öneririz.",
    phonePlaceholder: "05XX XXX XX XX",
    hours: ["Pazartesi – Cuma: 09:00 – 18:00", "Cumartesi: 09:00 – 14:00", "Pazar: Kapalı"],
  },
  europe: {
    label: "Avrupa",
    whatsapp: "+41 77 944 85 56",
    waLink: "https://wa.me/41779448556",
    email: "info@golden.com",
    address: ["Route de Lussy 14", "1312 Eclépens", "Lausanne, İsviçre"],
    note: "Ziyaret etmek isterseniz randevu almanızı öneririz.",
    phonePlaceholder: "+41 XX XXX XX XX",
    hours: ["Pazartesi – Cuma: 09:00 – 17:00", "Cumartesi: 10:00 – 14:00", "Pazar: Kapalı"],
  },
} as const;

const subjects = [
  "Sipariş Sorgulama",
  "Ürün Bilgisi",
  "Müşteri Desteği",
  "İş Birliği",
  "Diğer",
];

export default function ContactPage() {
  const [loc, setLoc] = useState<Loc>("turkey");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const info = contactInfo[loc];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const supabase = createSupabaseBrowserClient();
    const { error: insErr } = await supabase.from("support_messages").insert({
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || null,
      subject: String(fd.get("subject") ?? "").trim(),
      body: String(fd.get("body") ?? "").trim(),
    });
    setBusy(false);
    if (insErr) {
      setError("Mesaj gönderilemedi. Lütfen alanları kontrol edip tekrar deneyin.");
      return;
    }
    setSent(true);
  };

  return (
    <div>
      {/* Başlık */}
      <section className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            Bize Ulaşın
          </p>
          <h1 className="mt-2 font-display text-4xl text-forest-deep lg:text-5xl">
            İletişim
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Sorularınız, önerileriniz veya destek için bizimle iletişime
            geçebilirsiniz. Türkiye ve Avrupa hattımız hizmetinizde.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Sol: bilgiler */}
          <div className="space-y-6">
            {/* Lokasyon seçici */}
            <div className="rounded-2xl border border-line bg-card p-2">
              <div className="grid grid-cols-2 gap-2">
                {(["turkey", "europe"] as Loc[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLoc(l)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      loc === l
                        ? "bg-forest text-cream"
                        : "text-forest hover:bg-canvas"
                    }`}
                  >
                    {contactInfo[l].label}
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href={info.waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded-2xl border border-line bg-card p-5 transition-colors hover:border-gold/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-bg text-gold-deep">
                <ChatIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-forest-deep">WhatsApp</p>
                <p className="text-sm text-ink/90">{info.whatsapp}</p>
                <p className="mt-0.5 text-xs text-muted">
                  7/24 WhatsApp üzerinden bize ulaşabilirsiniz
                </p>
              </div>
            </a>

            {/* E-posta */}
            <a
              href={`mailto:${info.email}`}
              className="flex items-start gap-4 rounded-2xl border border-line bg-card p-5 transition-colors hover:border-gold/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-bg text-gold-deep">
                <MailIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-forest-deep">E-posta</p>
                <p className="text-sm text-ink/90">{info.email}</p>
                <p className="mt-0.5 text-xs text-muted">
                  E-posta ile bizimle iletişime geçin
                </p>
              </div>
            </a>

            {/* Adres */}
            <div className="flex items-start gap-4 rounded-2xl border border-line bg-card p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-bg text-gold-deep">
                <PinIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-forest-deep">Adres</p>
                <div className="text-sm text-ink/90">
                  {info.address.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted">{info.note}</p>
              </div>
            </div>

            {/* Çalışma saatleri */}
            <div className="flex items-start gap-4 rounded-2xl border border-line bg-card p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-bg text-gold-deep">
                <ClockIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-forest-deep">
                  Çalışma Saatleri · {info.label}
                </p>
                <div className="mt-1 text-sm text-muted">
                  {info.hours.map((h) => (
                    <p key={h}>{h}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Hızlı butonlar */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={info.waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-success px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <ChatIcon className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={`mailto:${info.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep"
              >
                <MailIcon className="h-4 w-4" />
                E-posta
              </a>
            </div>
          </div>

          {/* Sağ: form */}
          <div className="rounded-[1.5rem] border border-line bg-card p-6 sm:p-8">
            <h2 className="font-display text-2xl text-forest-deep">Mesaj Gönderin</h2>
            <p className="mt-1 text-sm text-muted">
              Formu doldurun, en kısa sürede size dönüş yapalım.
            </p>

            {sent ? (
              <div className="mt-6 rounded-2xl border border-success/30 bg-success/10 p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success text-white">
                  <VerifiedIcon className="h-6 w-6" />
                </span>
                <p className="mt-3 font-display text-xl text-forest-deep">
                  Mesajınız gönderildi!
                </p>
                <p className="mt-1 text-sm text-muted">
                  En kısa sürede size dönüş yapacağız.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 text-sm font-semibold text-gold hover:text-gold-deep"
                >
                  Yeni mesaj gönder
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <Field label="Ad Soyad" required>
                  <input
                    type="text"
                    name="name"
                    required
                    minLength={2}
                    placeholder="Adınız ve soyadınız"
                    className={inputCls}
                  />
                </Field>
                <Field label="E-posta" required>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ornek@email.com"
                    className={inputCls}
                  />
                </Field>
                <Field label="Telefon">
                  <input
                    type="tel"
                    name="phone"
                    placeholder={info.phonePlaceholder}
                    className={inputCls}
                  />
                </Field>
                <Field label="Konu" required>
                  <select name="subject" required defaultValue="" className={inputCls}>
                    <option value="" disabled>
                      Konu seçiniz
                    </option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Mesajınız" required>
                  <textarea
                    name="body"
                    required
                    minLength={5}
                    rows={5}
                    placeholder="Mesajınızı buraya yazabilirsiniz…"
                    className={`${inputCls} resize-none`}
                  />
                </Field>
                {error && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep disabled:opacity-60"
                >
                  {busy ? "Gönderiliyor…" : "Mesajı Gönder"}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Randevu CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 rounded-[1.5rem] border border-line bg-canvas px-8 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-display text-2xl text-forest-deep">
              Üretimi yerinde görmek ister misiniz?
            </h3>
            <p className="mt-1 text-muted">
              Çiftlik turu, bal hasadı ve peynir yapım deneyimleri için randevu
              oluşturun.
            </p>
          </div>
          <Link
            href="/randevu"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep"
          >
            Randevu Al
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-gold";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-forest-deep">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {children}
    </label>
  );
}
