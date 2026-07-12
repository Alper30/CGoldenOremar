"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { fmtPrice } from "@/lib/data";
import { setVendorVerified, setVendorSuspended } from "@/app/admin/saticilar/actions";

export type AdminVendor = {
  id: string;
  name: string;
  person: string;
  location: string | null;
  balance: number;
  rating: number;
  units_sold: number;
  verified: boolean;
  suspended: boolean;
};

function Row({ v }: { v: AdminVendor }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: true } | { error: string }>) {
    setErr(null);
    startTransition(async () => {
      const res = await fn();
      if ("error" in res) setErr(res.error);
      else router.refresh();
    });
  }

  return (
    <tr className={v.suspended ? "bg-red-50/40" : ""}>
      <td className="px-4 py-3 font-medium text-foreground">{v.name}</td>
      <td className="px-4 py-3 text-muted-foreground">{v.person}</td>
      <td className="px-4 py-3 text-muted-foreground">{v.location ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">
        {v.rating} · {v.units_sold} satış
      </td>
      <td className="px-4 py-3 text-right font-display text-foreground">{fmtPrice(Number(v.balance))}</td>
      <td className="px-4 py-3 text-center">
        {v.suspended ? (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">Askıda</span>
        ) : v.verified ? (
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">Doğrulandı</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => setVendorVerified(v.id, !v.verified))}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            {v.verified ? "Doğrulamayı kaldır" : "KYC doğrula"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => setVendorSuspended(v.id, !v.suspended))}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
              v.suspended
                ? "border-green-200 text-green-700 hover:bg-green-50"
                : "border-red-200 text-red-700 hover:bg-red-50"
            }`}
          >
            {v.suspended ? "Askıyı kaldır" : "Askıya al"}
          </button>
        </div>
        {err && <p className="mt-1 text-right text-xs text-red-600">{err}</p>}
      </td>
    </tr>
  );
}

export function VendorsTable({ vendors }: { vendors: AdminVendor[] }) {
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-foreground">Satıcılar</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Mağaza</th>
              <th className="px-4 py-3 font-medium">Üretici</th>
              <th className="px-4 py-3 font-medium">Konum</th>
              <th className="px-4 py-3 font-medium">Puan</th>
              <th className="px-4 py-3 text-right font-medium">Bakiye</th>
              <th className="px-4 py-3 text-center font-medium">Durum</th>
              <th className="px-4 py-3 text-right font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vendors.map((v) => (
              <Row key={v.id} v={v} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
