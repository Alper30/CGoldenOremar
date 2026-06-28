import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSnapshot } from "@/lib/auth";
import { logoutAction } from "../giris/actions";

export const metadata = { title: "Hesabım · Golden Oremar" };

const roleLabel: Record<string, string> = {
  user: "Alıcı",
  vendor: "Satıcı / Üretici",
  admin: "Yönetici",
};

export default async function AccountPage() {
  const { user, profile } = await getAuthSnapshot();
  if (!user) redirect("/giris");

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold">
        Hesabım
      </p>
      <h1 className="mt-1 font-display text-3xl text-forest-deep">
        {profile?.full_name || "Hoş geldiniz"}
      </h1>

      <dl className="mt-8 divide-y divide-line rounded-3xl border border-line bg-card">
        <Row label="Ad soyad" value={profile?.full_name || "—"} />
        <Row label="E-posta" value={user.email || "—"} />
        <Row label="Telefon" value={profile?.phone || "—"} />
        <Row label="Hesap türü" value={roleLabel[profile?.role ?? "user"]} />
      </dl>

      {profile?.role === "user" && (
        <Link
          href="/kayit"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep"
        >
          Satıcı olmak istiyorum
        </Link>
      )}

      <form action={logoutAction} className="mt-6">
        <button
          type="submit"
          className="h-11 rounded-full border border-line px-5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          Çıkış yap
        </button>
      </form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}
