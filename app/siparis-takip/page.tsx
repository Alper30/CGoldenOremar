"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  SearchIcon,
  TruckIcon,
  PinIcon,
  ClockIcon,
  VerifiedIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "@/components/icons";

const TrackingMap = dynamic(
  () => import("@/components/TrackingMap").then((m) => m.TrackingMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-canvas text-sm text-muted">
        Harita yükleniyor…
      </div>
    ),
  },
);

// Demo sipariş
const demoOrder = {
  orderNo: "GO-2026-10472",
  cargoNo: "ARS 873 419 552",
  carrier: "Aras Kargo",
  product: "Karakovan Çam Balı 850 g",
  qty: 2,
  producer: "Karadeniz Arıcılık",
  eta: "27 Haziran 2026",
  origin: { lat: 40.99, lng: 39.72, label: "Karadeniz Arıcılık · Maçka, Trabzon" },
  destination: { lat: 41.0082, lng: 28.9784, label: "Kadıköy, İstanbul" },
  steps: [
    { title: "Sipariş Alındı", time: "24 Haziran · 14:20", done: true },
    { title: "Hazırlanıyor", time: "24 Haziran · 18:05", done: true },
    { title: "Kargoya Verildi", time: "25 Haziran · 09:40", done: true },
    { title: "Yolda", time: "26 Haziran · 11:15", current: true },
    { title: "Teslim Edildi", time: "Tahmini 27 Haziran", done: false },
  ],
};

export default function TrackingPage() {
  const [q, setQ] = useState(demoOrder.orderNo);
  const o = demoOrder;

  return (
    <div>
      {/* Başlık + sorgu */}
      <section className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            Kargo Takibi
          </p>
          <h1 className="mt-2 font-display text-3xl text-forest-deep sm:text-4xl lg:text-5xl">
            Sipariş Takip
          </h1>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted">
            Sipariş veya kargo takip numaranızı girin; kargonuzun canlı konumunu
            harita üzerinde görün.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-6 flex max-w-md flex-col gap-2.5 sm:flex-row"
          >
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Örn. GO-2026-10472"
                className="h-12 w-full rounded-full border border-line bg-card pl-11 pr-4 text-sm text-ink outline-none placeholder:text-muted focus:border-gold"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep"
            >
              Sorgula
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Özet şerit */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-card p-5">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <Info label="Sipariş No" value={o.orderNo} />
            <Info label="Kargo Takip No" value={o.cargoNo} />
            <Info label="Kargo Firması" value={o.carrier} />
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3.5 py-1.5 text-sm font-semibold text-gold-deep">
            <TruckIcon className="h-4 w-4" />
            Yolda
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Sol: durum zaman çizelgesi */}
          <div className="rounded-[1.5rem] border border-line bg-card p-6">
            <h2 className="font-display text-xl text-forest-deep">Sipariş Durumu</h2>
            <p className="mt-1 text-sm text-muted">
              {o.qty} × {o.product} · {o.producer}
            </p>

            <ol className="mt-6 space-y-1">
              {o.steps.map((s, i) => {
                const last = i === o.steps.length - 1;
                return (
                  <li key={s.title} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${
                          s.done
                            ? "bg-success text-white"
                            : s.current
                              ? "bg-gold text-white"
                              : "border border-line bg-cream text-muted"
                        }`}
                      >
                        {s.done ? (
                          <VerifiedIcon className="h-4 w-4" />
                        ) : s.current ? (
                          <TruckIcon className="h-4 w-4" />
                        ) : (
                          <ClockIcon className="h-4 w-4" />
                        )}
                      </span>
                      {!last && (
                        <span
                          className={`my-1 w-0.5 flex-1 ${
                            s.done ? "bg-success/40" : "bg-line"
                          }`}
                          style={{ minHeight: 28 }}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <p
                        className={`font-semibold ${
                          s.current ? "text-gold-deep" : "text-forest-deep"
                        }`}
                      >
                        {s.title}
                      </p>
                      <p className="text-xs text-muted">{s.time}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-2 flex items-center gap-2 rounded-xl bg-canvas px-4 py-3 text-sm text-forest-deep">
              <CalendarIcon className="h-4 w-4 text-gold" />
              Tahmini teslim: <strong>{o.eta}</strong>
            </div>
          </div>

          {/* Sağ: canlı harita */}
          <div className="overflow-hidden rounded-[1.5rem] border border-line bg-card">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-forest-deep">
                <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                Canlı Konum
              </p>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <PinIcon className="h-3.5 w-3.5" />
                Trabzon → İstanbul
              </p>
            </div>
            <div className="h-[420px] w-full">
              <TrackingMap origin={o.origin} destination={o.destination} progress={0.6} />
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          Demo — örnek sipariş gösteriliyor. Gerçek takip, sipariş sistemi
          bağlandığında etkin olacak.
        </p>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="font-semibold text-forest-deep">{value}</p>
    </div>
  );
}
