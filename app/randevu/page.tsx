"use client";

import { useState } from "react";
import Link from "next/link";
import { submitBooking } from "./actions";
import {
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  VerifiedIcon,
  ArrowRightIcon,
  LeafIcon,
} from "@/components/icons";

const experiences = [
  { name: "Çiftlik Turu", desc: "Üretim alanlarımızı yerinde gezin." },
  { name: "Üretim Ziyareti", desc: "Süreçleri adım adım izleyin." },
  { name: "Peynir Yapım Deneyimi", desc: "Tulum peynirini kendiniz yapın." },
  { name: "Bal Hasadı Deneyimi", desc: "Kovandan kavanoza bal hasadı." },
  { name: "Süt Üretimi Turu", desc: "Otlaktan sofraya süt yolculuğu." },
  { name: "Organik Bahçe Turu", desc: "Bahçede mevsim ürünlerini keşfedin." },
  { name: "Doğal Ürün Tadımı", desc: "Yöresel lezzetleri tadın." },
];

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];

type Form = {
  experienceType: string;
  numberOfGuests: number;
  bookingDate: string;
  bookingTime: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const empty: Form = {
  experienceType: "",
  numberOfGuests: 1,
  bookingDate: "",
  bookingTime: "",
  name: "",
  email: "",
  phone: "",
  notes: "",
};

const todayStr = () => new Date().toISOString().split("T")[0];

export default function BookingPage() {
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof Form, string>> = {};
    if (!form.experienceType) e.experienceType = "Lütfen bir deneyim seçin";
    if (!form.numberOfGuests || form.numberOfGuests < 1)
      e.numberOfGuests = "En az 1 misafir";
    if (!form.bookingDate) e.bookingDate = "Tarih seçiniz";
    else if (form.bookingDate < todayStr())
      e.bookingDate = "Geçmiş bir tarih seçilemez";
    if (!form.bookingTime) e.bookingTime = "Saat seçiniz";
    if (!form.name.trim()) e.name = "Ad soyad zorunludur";
    if (!form.email.trim()) e.email = "E-posta zorunludur";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Geçerli bir e-posta giriniz";
    if (!form.phone.trim()) e.phone = "Telefon zorunludur";
    else if (!/^0\d{10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "0 ile başlayan 11 haneli numara giriniz";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    setBusy(true);
    const res = await submitBooking({
      experienceType: form.experienceType,
      guests: form.numberOfGuests,
      date: form.bookingDate,
      time: form.bookingTime,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.replace(/\s/g, ""),
      notes: form.notes.trim() || undefined,
    });
    setBusy(false);
    if ("error" in res) setSubmitError(res.error);
    else setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-white">
          <VerifiedIcon className="h-8 w-8" />
        </span>
        <h1 className="mt-5 font-display text-3xl text-forest-deep">
          Randevunuz oluşturuldu!
        </h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
          <strong className="text-forest">{form.experienceType}</strong> için{" "}
          {form.bookingDate} · {form.bookingTime} talebinizi aldık. En kısa
          sürede sizinle iletişime geçeceğiz.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              setForm(empty);
              setDone(false);
              setSubmitError(null);
            }}
            className="rounded-full border border-line bg-card px-6 py-3 text-sm font-semibold text-forest transition-colors hover:border-forest/40"
          >
            Yeni randevu
          </button>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep"
          >
            Ürünleri keşfet
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Başlık */}
      <section className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-cream">
            <LeafIcon className="h-4 w-4" />
            Üreticiyle Tanışın
          </p>
          <h1 className="mt-4 font-display text-4xl text-forest-deep lg:text-5xl">
            Randevu Al
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Doğal üretim süreçlerimizi yerinde görmek, çiftlik turu yapmak veya
            özel deneyimlerimize katılmak için randevu oluşturun.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <form onSubmit={onSubmit} className="space-y-10">
          {/* Deneyim seçimi */}
          <div>
            <h2 className="font-display text-2xl text-forest-deep">
              1. Deneyiminizi seçin
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {experiences.map((x) => {
                const active = form.experienceType === x.name;
                return (
                  <button
                    type="button"
                    key={x.name}
                    onClick={() => set("experienceType", x.name)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? "border-gold bg-amber-bg/60 ring-1 ring-gold"
                        : "border-line bg-card hover:border-gold/40"
                    }`}
                  >
                    <p className="font-display text-base text-forest-deep">
                      {x.name}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {x.desc}
                    </p>
                  </button>
                );
              })}
            </div>
            {errors.experienceType && (
              <p className="mt-2 text-sm text-red-600">{errors.experienceType}</p>
            )}
          </div>

          {/* Tarih / saat / kişi */}
          <div>
            <h2 className="font-display text-2xl text-forest-deep">
              2. Tarih &amp; saat
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Field label="Randevu Tarihi" icon={CalendarIcon} error={errors.bookingDate}>
                <input
                  type="date"
                  min={todayStr()}
                  value={form.bookingDate}
                  onChange={(e) => set("bookingDate", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Randevu Saati" icon={ClockIcon} error={errors.bookingTime}>
                <select
                  value={form.bookingTime}
                  onChange={(e) => set("bookingTime", e.target.value)}
                  disabled={!form.bookingDate}
                  className={`${inputCls} disabled:opacity-50`}
                >
                  <option value="">
                    {form.bookingDate ? "Saat seçiniz" : "Önce tarih seçiniz"}
                  </option>
                  {timeSlots.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Misafir Sayısı" icon={UsersIcon} error={errors.numberOfGuests}>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={form.numberOfGuests}
                  onChange={(e) => set("numberOfGuests", Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* İletişim */}
          <div>
            <h2 className="font-display text-2xl text-forest-deep">
              3. İletişim bilgileriniz
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Field label="Ad Soyad" error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Adınız Soyadınız"
                  className={inputCls}
                />
              </Field>
              <Field label="E-posta" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="ornek@email.com"
                  className={inputCls}
                />
              </Field>
              <Field label="Telefon" error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Ek Notlar (opsiyonel)">
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Varsa özel isteklerinizi yazabilirsiniz…"
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
          </div>

          <div className="border-t border-line pt-6">
            {submitError && (
              <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
            >
              {busy ? "Gönderiliyor…" : "Randevu Oluştur"}
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-gold";

function Field({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon?: typeof CalendarIcon;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-forest-deep">
        {Icon && <Icon className="h-4 w-4 text-gold" />}
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
