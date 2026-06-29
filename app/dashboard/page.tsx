import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSnapshot } from "@/lib/auth";
import { logoutAction } from "../giris/actions";

export const metadata = { title: "Panelim · Golden Oremar" };

const roleLabel: Record<string, string> = {
  user: "Alıcı",
  vendor: "Satıcı / Üretici",
  admin: "Yönetici",
};

export default async function DashboardPage() {
  // Korumalı: oturum yoksa anasayfaya yönlendir.
  const { user, profile } = await getAuthSnapshot();
  if (!user) redirect("/");

  const role = profile?.role ?? "user";

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold">Panelim</p>
      <h1 className="mt-1 font-display text-3xl text-forest-deep">
        {profile?.full_name || "Hoş geldiniz"}
      </h1>
      <p className="mt-2 text-sm text-muted">Hesabınıza başarıyla giriş yaptınız.</p>

      <dl className="mt-8 divide-y divide-line rounded-3xl border border-line bg-card">
        <Row label="E-posta" value={user.email || "—"} />
        <Row label="Hesap türü" value={roleLabel[role]} />
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/hesabim"
          className="inline-flex h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep"
        >
          Hesap & Siparişlerim
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="h-11 rounded-full border border-line px-5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            Çıkış yap
          </button>
        </form>
      </div>
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
