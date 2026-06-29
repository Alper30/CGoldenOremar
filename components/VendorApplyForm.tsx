"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "./store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ArrowRightIcon, ShieldIcon, VerifiedIcon } from "./icons";

type Application = { status: string; reject_reason: string | null } | null;

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">{children}</div>;
}

export function VendorApplyForm({
  signedIn,
  role,
  application,
  defaults,
}: {
  signedIn: boolean;
  role: string | null;
  application: Application;
  defaults: { name: string; phone: string };
}) {
  const { t, toast } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    store_name: "",
    person: defaults.name,
    tc_no: "",
    iban: "",
    phone: defaults.phone,
    province: "",
    district: "",
    story: "",
  });
  const [docFront, setDocFront] = useState<File | null>(null);
  const [docBack, setDocBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const upd = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  if (!signedIn) {
    return (
      <Shell>
        <StateCard title={t("soLoginFirst")} href="/giris" label={t("coGoLogin")} />
      </Shell>
    );
  }
  if (role === "vendor") {
    return (
      <Shell>
        <StateCard title={t("soAlreadyVendor")} href="/satici-panel" label={t("soGoPanel")} good />
      </Shell>
    );
  }
  if (submitted || application?.status === "pending") {
    // Yeni gönderim → "alındı"; zaten beklemedeki başvuru → "inceleniyor".
    return (
      <Shell>
        <StateCard
          title={submitted ? t("soDone") : t("soPending")}
          href="/hesabim"
          label={t("navAccount")}
          good
        />
      </Shell>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!docFront || !docBack || !selfie) {
      toast(t("coError"));
      return;
    }
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("auth");

      const upload = async (file: File, kind: string) => {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${user.id}/${kind}-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("kyc").upload(path, file, {
          upsert: true,
        });
        if (error) throw error;
        return path;
      };

      const [frontPath, backPath, selfiePath] = await Promise.all([
        upload(docFront, "belge-on"),
        upload(docBack, "belge-arka"),
        upload(selfie, "selfie"),
      ]);

      const { error } = await supabase.from("vendor_applications").insert({
        user_id: user.id,
        store_name: form.store_name,
        person: form.person,
        tc_no: form.tc_no,
        iban: form.iban,
        phone: form.phone,
        province: form.province,
        district: form.district,
        story: form.story || null,
        document_url: frontPath,
        document_back_url: backPath,
        selfie_url: selfiePath,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("[apply]", err);
      toast(t("coError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <p className="text-xs font-semibold uppercase tracking-wider text-gold">
        {t("soTitle")}
      </p>
      <h1 className="mt-1 font-display text-3xl text-forest-deep sm:text-4xl">
        {t("soTitle")}
      </h1>
      <p className="mt-2 text-muted">{t("soSub")}</p>

      {application?.status === "rejected" && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {t("soRejected")} {application.reject_reason}
        </div>
      )}

      <form onSubmit={submit} className="mt-6 rounded-3xl border border-line bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label={t("soStore")} value={form.store_name} onChange={upd("store_name")} required />
          </div>
          <Field label={t("soPerson")} value={form.person} onChange={upd("person")} required />
          <Field label={t("soPhone")} value={form.phone} onChange={upd("phone")} required />
          <Field label={t("soTc")} value={form.tc_no} onChange={upd("tc_no")} required pattern="\d{11}" />
          <Field label={t("soIban")} value={form.iban} onChange={upd("iban")} required />
          <Field label={t("soProvince")} value={form.province} onChange={upd("province")} required />
          <Field label={t("soDistrict")} value={form.district} onChange={upd("district")} required />
          <div className="sm:col-span-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-forest-deep">{t("soStory")}</span>
              <textarea
                value={form.story}
                onChange={(e) => upd("story")(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold"
              />
            </label>
          </div>
          <div className="sm:col-span-2">
            <div className="rounded-2xl border border-line bg-cream/60 p-4">
              <p className="text-sm font-semibold text-forest-deep">{t("soKycTitle")}</p>
              <p className="mt-0.5 text-xs text-muted">{t("soKycSub")}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <PhotoField
                  step={1}
                  label={t("soDocFront")}
                  hint={t("soUploadHint")}
                  uploaded={t("soUploaded")}
                  file={docFront}
                  onChange={setDocFront}
                />
                <PhotoField
                  step={2}
                  label={t("soDocBack")}
                  hint={t("soUploadHint")}
                  uploaded={t("soUploaded")}
                  file={docBack}
                  onChange={setDocBack}
                />
                <PhotoField
                  step={3}
                  label={t("soSelfie")}
                  hint={t("soUploadHint")}
                  uploaded={t("soUploaded")}
                  file={selfie}
                  onChange={setSelfie}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-bg px-4 py-3 text-xs text-gold-deep">
          <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0" />
          {t("soKvkk")}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep disabled:opacity-60"
        >
          {busy ? t("soSubmitting") : t("soSubmit")}
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </form>
    </Shell>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  pattern,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  pattern?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-forest-deep">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        pattern={pattern}
        className="h-11 w-full rounded-xl border border-line bg-cream px-3.5 text-sm text-ink outline-none focus:border-gold"
      />
    </label>
  );
}

// Tek bir fotoğraf alanı: tıklayınca kamera / galeri / dosya seçeneği sunar
// (accept="image/*" + capture YOK → mobilde "Fotoğraf Çek / Galeri / Dosya"
// menüsü çıkar). Seçilince önizleme + onay işareti gösterir.
function PhotoField({
  step,
  label,
  hint,
  uploaded,
  file,
  onChange,
}: {
  step: number;
  label: string;
  hint: string;
  uploaded: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  // Önizleme URL'i dosyadan türetilir (setState-in-effect'ten kaçınmak için
  // useMemo); değişince/unmount'ta eski URL temizlenir.
  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <label className="relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border-2 border-dashed border-line bg-card text-center transition-colors hover:border-gold/60">
      <input
        type="file"
        accept="image/*"
        required
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="sr-only"
      />
      {preview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={label} className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-success text-white">
            <VerifiedIcon className="h-3.5 w-3.5" />
          </span>
          <span className="absolute inset-x-0 bottom-0 bg-forest-deep/75 py-1 text-[11px] font-semibold text-cream">
            {label} · {uploaded}
          </span>
        </>
      ) : (
        <>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-bg text-sm font-bold text-gold-deep">
            {step}
          </span>
          <span className="px-2 text-xs font-semibold text-forest-deep">{label}</span>
          <span className="px-3 text-[10px] leading-tight text-muted">{hint}</span>
        </>
      )}
    </label>
  );
}

function StateCard({
  title,
  href,
  label,
  good,
}: {
  title: string;
  href: string;
  label: string;
  good?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-line bg-card p-10 text-center">
      <span
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
          good ? "bg-green-600 text-white" : "bg-amber-bg text-gold-deep"
        }`}
      >
        <VerifiedIcon className="h-7 w-7" />
      </span>
      <p className="mt-4 text-lg font-medium text-forest-deep">{title}</p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-cream hover:bg-gold-deep"
      >
        {label}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
