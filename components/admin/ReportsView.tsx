"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { fmtPrice } from "@/lib/data";

export type ReportOrderVendor = {
  id: string;
  created_at: string;
  escrow_status: string;
  items_subtotal: number;
  shipping_fee: number;
  commission_amount: number;
  net_amount: number;
  vendor_profiles: { name: string } | null;
};

export type ReportPayout = {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  processed_at: string | null;
  vendor_profiles: { name: string } | null;
};

export type ReportTxn = {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  created_at: string;
  vendor_profiles: { name: string } | null;
};

const TXN_LABEL: Record<string, string> = {
  sale: "Satış",
  commission: "Komisyon",
  payout: "Ödeme (payout)",
  refund: "İade",
  adjustment: "Düzeltme",
};

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "short", timeStyle: "short" }).format(
    new Date(iso),
  );

// Excel'in Türkçe karakterleri doğru açması için BOM'lu CSV üretir ve indirir.
function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => {
    let s = String(v);
    // Formül enjeksiyonu önlemi: Excel'in formül olarak yorumladığı önekleri
    // (= + - @ sekme/CR) tek tırnakla etkisizleştir — "=HYPERLINK(...)" gibi
    // bir satıcı adı, admin'in makinesinde kod/istek çalıştıramaz.
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv =
    "﻿" + [headers, ...rows].map((r) => r.map(esc).join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ExportButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
    >
      <Download className="size-3.5" />
      {label}
    </button>
  );
}

export function ReportsView({
  orderVendors,
  payouts,
  txns,
}: {
  orderVendors: ReportOrderVendor[];
  payouts: ReportPayout[];
  txns: ReportTxn[];
}) {
  const [sortKey, setSortKey] = useState<"revenue" | "orders" | "commission">("revenue");

  // Finans özeti — iade edilenler ciroya sayılmaz.
  const summary = useMemo(() => {
    const active = orderVendors.filter((ov) => ov.escrow_status !== "refunded");
    const revenue = active.reduce((s, ov) => s + Number(ov.items_subtotal) + Number(ov.shipping_fee), 0);
    const commission = active.reduce((s, ov) => s + Number(ov.commission_amount), 0);
    const net = active.reduce((s, ov) => s + Number(ov.net_amount), 0);
    const inEscrow = orderVendors
      .filter((ov) => ["pending", "shipped", "delivered", "disputed"].includes(ov.escrow_status))
      .reduce((s, ov) => s + Number(ov.net_amount), 0);
    const paidOut = payouts
      .filter((p) => p.status === "paid")
      .reduce((s, p) => s + Number(p.amount), 0);
    return { revenue, commission, net, inEscrow, paidOut };
  }, [orderVendors, payouts]);

  // Satıcı bazında toplama.
  const vendorRows = useMemo(() => {
    const map = new Map<
      string,
      { name: string; orders: number; revenue: number; commission: number; net: number; released: number }
    >();
    for (const ov of orderVendors) {
      if (ov.escrow_status === "refunded") continue;
      const name = ov.vendor_profiles?.name ?? "—";
      const row =
        map.get(name) ??
        { name, orders: 0, revenue: 0, commission: 0, net: 0, released: 0 };
      row.orders += 1;
      row.revenue += Number(ov.items_subtotal) + Number(ov.shipping_fee);
      row.commission += Number(ov.commission_amount);
      row.net += Number(ov.net_amount);
      if (ov.escrow_status === "released") row.released += Number(ov.net_amount);
      map.set(name, row);
    }
    const rows = [...map.values()];
    rows.sort((a, b) =>
      sortKey === "orders" ? b.orders - a.orders
      : sortKey === "commission" ? b.commission - a.commission
      : b.revenue - a.revenue,
    );
    return rows;
  }, [orderVendors, sortKey]);

  const cards = [
    { label: "Toplam Ciro", value: summary.revenue },
    { label: "Platform Komisyonu", value: summary.commission },
    { label: "Satıcı Net Hak Ediş", value: summary.net },
    { label: "Emanette (escrow) Bekleyen", value: summary.inEscrow },
    { label: "Ödenen Payout", value: summary.paidOut },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Satış, komisyon ve satıcı performansı — tüm zamanlar
        </p>
        <div className="flex flex-wrap gap-2">
          <ExportButton
            label="Satıcı Raporu (CSV)"
            onClick={() =>
              downloadCsv(
                "satici-raporu.csv",
                ["Satıcı", "Sipariş", "Ciro", "Komisyon", "Net", "Serbest Bırakılan"],
                vendorRows.map((r) => [r.name, r.orders, r.revenue.toFixed(2), r.commission.toFixed(2), r.net.toFixed(2), r.released.toFixed(2)]),
              )
            }
          />
          <ExportButton
            label="İşlem Dökümü (CSV)"
            onClick={() =>
              downloadCsv(
                "islem-dokumu.csv",
                ["Tarih", "Satıcı", "Tür", "Tutar", "Açıklama"],
                txns.map((t) => [
                  fmtDate(t.created_at),
                  t.vendor_profiles?.name ?? "—",
                  TXN_LABEL[t.type] ?? t.type,
                  Number(t.amount).toFixed(2),
                  t.description ?? "",
                ]),
              )
            }
          />
          <ExportButton
            label="Payout Listesi (CSV)"
            onClick={() =>
              downloadCsv(
                "payout-listesi.csv",
                ["Talep Tarihi", "Satıcı", "Tutar", "Durum", "Ödenme Tarihi"],
                payouts.map((p) => [
                  fmtDate(p.created_at),
                  p.vendor_profiles?.name ?? "—",
                  Number(p.amount).toFixed(2),
                  p.status === "paid" ? "Ödendi" : p.status === "pending" ? "Bekliyor" : p.status,
                  p.processed_at ? fmtDate(p.processed_at) : "—",
                ]),
              )
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Card key={c.label} className="gap-1 py-4">
            <CardHeader className="pb-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-foreground">{fmtPrice(c.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Satıcı Performansı</h2>
          <div className="flex gap-1 text-xs">
            {(
              [
                ["revenue", "Ciroya göre"],
                ["orders", "Siparişe göre"],
                ["commission", "Komisyona göre"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSortKey(key)}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${
                  sortKey === key
                    ? "bg-gold/15 text-gold"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Satıcı</th>
                <th className="px-4 py-3 text-right font-medium">Sipariş</th>
                <th className="px-4 py-3 text-right font-medium">Ciro</th>
                <th className="px-4 py-3 text-right font-medium">Komisyon</th>
                <th className="px-4 py-3 text-right font-medium">Net</th>
                <th className="px-4 py-3 text-right font-medium">Serbest Bırakılan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vendorRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    Henüz raporlanacak satış yok.
                  </td>
                </tr>
              )}
              {vendorRows.map((r) => (
                <tr key={r.name}>
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-right">{r.orders}</td>
                  <td className="px-4 py-3 text-right">{fmtPrice(r.revenue)}</td>
                  <td className="px-4 py-3 text-right">{fmtPrice(r.commission)}</td>
                  <td className="px-4 py-3 text-right">{fmtPrice(r.net)}</td>
                  <td className="px-4 py-3 text-right">{fmtPrice(r.released)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
